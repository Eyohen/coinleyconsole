# Ops Console: Search-by-Address + Payment Detail + Manual Sweep

**Status:** Draft for review
**Date:** 2026-05-26
**Repos affected:** `coinley-admin-console` (frontend), `coinleyserver` (backend)
**Frontend branch:** `feat/ops-console-detail-view` (off `production/main` on `coinleylabs/coinley-console-FE`)
**Backend deploy target:** `coinleyserver` staging (direct, no feature branch)

## Goal

Make the admin console detailed enough that day-to-day ops questions ("is this address ours?", "did this payment sweep?", "the customer paid an expired invoice — can we recover the funds?") can be answered and acted on from the UI, without dropping into the database.

## Motivation

A live incident triggered this work: a customer sent funds to a CREATE2 deposit address belonging to an expired payment. Verifying the address required hand-crafted SQL; recovering the funds would require either manual SweepService invocation or a DB status hack. The admin Transactions page already lists most of the data we need but doesn't expose it in a way that supports ops use.

## Non-goals

- Bulk operations beyond what `SweepManagement` already provides.
- Editing payment fields from the UI (high blast radius — leave for DB).
- A standalone "paste address, verify ownership" widget. The extended search subsumes this.
- Cross-merchant analytics, reporting, or auditing surfaces.

## Architecture

Two backend additions and one frontend route. Everything else extends existing surfaces.

### Backend changes (`coinleyserver`, on `staging` branch)

1. **Extend `getTransactions` search clause** (`controller/admin.js:370-375`).
   Currently matches `id ILIKE %q%` OR `transactionHash ILIKE %q%`. Add: `depositAddress`, `salt`, `sweepTxHash`, `depositTxHash`. All `ILIKE %q%` so partial paste works.

2. **New endpoint: `GET /api/admin/payments/:id`** (`controller/admin.js` + `route/admin.js`).
   Returns the full Payment row plus `Network`, `Merchant` (id, businessName, email), `Token` (symbol, name, address), and surfaces `metadata.sweepGasFee` and `metadata.sweepAttempts` explicitly at top level so the frontend doesn't have to dig. 404 if not found.

3. **Force flag on `POST /api/admin/sweep/:paymentId/retry`** (`controller/admin.js:1328`).
   Accept `?force=true` (or `{ force: true }` in body). When set: skip the existing checks beyond `!sweptAt` and `depositMethod === 'deposit_address'`, reset `status='completed'`, and call `sweepService.sweepPayment(paymentId)`. Without `force`, behavior is unchanged.
   This is required for the "funded after expiry" case where `status='expired'` and `detectedAt` may be null — the current code path resets status to `completed` regardless, so the only behavioral diff is that `force` documents intent and lets us add a tighter audit-trail metadata entry (`manualForceAt`, `manualForceBy`).

### Frontend changes (`coinley-admin-console`, on `feat/ops-console-detail-view`)

1. **`Transactions.jsx` — extend search UX.**
   Update placeholder to `Search by ID, deposit address, tx hash, sweep tx, or salt...`. No state-shape changes; backend handles the extra match fields. Each row in the existing table becomes clickable — clicking navigates to `/transactions/:paymentId`.

2. **New page: `TransactionDetail.jsx` at `/transactions/:paymentId`.**
   Registered in the main router. Fetches `GET /api/admin/payments/:paymentId` on mount.

   Page layout (sections, top to bottom):

   - **Header bar** — payment ID (truncated + copy), status badge, "View on explorer" button (links to depositTxHash on the network's block explorer when present), back-to-list link.
   - **Overview card** — amount + currency, USD equivalent if available, merchant business name + email, network + chain ID, created timestamp.
   - **Deposit info card** — deposit address (full + copy + explorer link), factory address, salt, depositTxHash (+ explorer link), depositBlockNumber, detectedAt, confirmedAt, confirmations vs. requiredConfirmations.
   - **Sweep info card** — sweepTxHash (+ explorer link), sweep gas fee (native + USD via the same `nativePrices` data we now use), sweptAt, sweep attempt count from metadata.
   - **Timeline** — vertical list of milestones (Created → Detected → Confirmed → Completed → Swept) with timestamps. Stages not reached are grayed out. If the payment expired, "Expired" appears as a terminal state instead of greyed-out Detected.
   - **Actions card** (only when `!sweptAt`) — **Force Sweep** button. Clicking opens a confirm modal showing network, deposit address, amount, and current status, with a `Confirm force sweep` action and a Cancel. On confirm: `POST /api/admin/sweep/:paymentId/retry` with `{ force: true }`. Show a result toast: success with sweep tx hash on success, or error message on failure. Refresh the detail data after the call returns.

3. **Routing change.** Add `<Route path="/transactions/:paymentId" element={<TransactionDetail />} />` in the main router. Transactions list rows get an `onClick` that calls `navigate(\`/transactions/\${payment.id}\`)`.

## Data flow

```
User (ops admin) ─[paste address into search]─▶ Transactions.jsx
  ─[GET /api/admin/transactions?search=0x…]─▶ getTransactions (extended OR clause)
  ─[returns matching rows]─▶ user clicks row
  ─[navigate /transactions/:id]─▶ TransactionDetail.jsx
  ─[GET /api/admin/payments/:id]─▶ new endpoint (full record)
  ─[renders detail sections]─▶ user clicks Force Sweep
  ─[confirm modal → POST /api/admin/sweep/:id/retry { force: true }]─▶ retrySweepPayment
  ─[SweepService.sweepPayment]─▶ on-chain sweep
  ─[returns sweepTxHash or error]─▶ TransactionDetail refreshes
```

## Error handling

- **Detail endpoint 404**: detail page renders an empty state with "Payment not found" and a back link.
- **Detail endpoint 500**: inline error banner with retry button (same pattern as `Transactions.jsx`).
- **Force Sweep success but sweep fails on-chain**: backend already returns `{ success: true, ... }` with a follow-up error message in the same shape. Surface both — green banner "retry triggered" then red banner "sweep attempt failed: <message>". Do not silently swallow.
- **Force Sweep on already-swept payment**: backend rejects with 400. Surface the message verbatim.
- **Search returns no results**: existing empty-state row already handles this. No change.

## Permissions / audit

All endpoints use the existing `authenticateAdmin` middleware — no new permission model. Force-sweep writes `manualForceAt` and `manualForceBy: req.admin.email` to `metadata` so the action is traceable in the DB.

## Testing

- **Backend smoke**: pick a known `swept` payment from staging — `GET /api/admin/payments/:id` should return all fields. Search with the deposit address should return exactly one row.
- **Frontend smoke**: paste `0x990677fc0864dcd5D7f812824D87270c123E161A` into search; if it's ours, the row appears; click to detail; verify timeline + addresses render correctly. Click Force Sweep, confirm in the modal, observe the toast and refreshed detail.
- **No new unit tests** — this is admin-facing CRUD over existing data layers. Manual QA on staging covers it.

## Rollout

1. Backend: push changes to `coinleyserver` `staging`. Railway redeploy is automatic.
2. Frontend: open PR `feat/ops-console-detail-view` → `production/main`. After review, merge → Azure redeploy.
3. Today's Eyohen-only fixes (LowGasBanner mount + gas-analytics USD backend) get cherry-picked into a separate PR against `production/main`; that's tracked outside this spec.

## Open questions

None blocking. Worth flagging for future iteration:

- Should the detail view be embedded into the `Transactions` page as a side panel as well, for power-user triage? (Deferred — dedicated route covers the primary need.)
- Do we want a server-side balance check before allowing Force Sweep (i.e., confirm the deposit address actually holds tokens before resetting status)? Possibly, but the on-chain sweep itself will no-op cleanly if the address is empty, so the marginal value is low. Deferred.
