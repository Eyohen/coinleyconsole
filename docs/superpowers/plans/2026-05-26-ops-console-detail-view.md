# Ops Console Detail View Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Let admins find any payment by deposit address (or salt/sweep hash), view all of its operational fields in one place, and force a sweep on funded-but-expired payments — all from the admin console UI.

**Architecture:** Three backend additions to `coinleyserver` (extended `getTransactions` search clause, new `GET /api/admin/payments/:id`, optional `force` flag on `POST /api/admin/sweep/:id/retry`), plus one new React route in the admin console (`/transactions/:paymentId`) backed by a new `TransactionDetail.jsx` page. Existing `Transactions.jsx` gets a wider search and clickable rows; `App.jsx` gets the new route.

**Tech Stack:** Express + Sequelize (backend), React 18 + Vite + React Router v6 + Tailwind + lucide-react (frontend).

**Per-spec decisions baked in:**
- No unit tests for this work; manual QA on staging covers it (spec §Testing).
- Backend changes go directly to `coinleyserver` `staging` branch.
- Frontend changes stay on `feat/ops-console-detail-view` in `coinley-admin-console`.

---

## File Structure

**`coinleyserver` (on `staging`)**
- Modify `controller/admin.js` — extend `getTransactions` search clause; add new `getPaymentById` function; add `force` flag to `retrySweepPayment`; export `getPaymentById`.
- Modify `route/admin.js` — register `GET /payments/:id` route.

**`coinley-admin-console` (on `feat/ops-console-detail-view`)**
- Create `src/pages/TransactionDetail.jsx` — new page rendering Overview, Deposit, Sweep, Timeline, Actions sections; handles Force Sweep confirm + result toast.
- Modify `src/pages/Transactions.jsx` — update search placeholder; add `useNavigate` + onClick on each row; cursor styling.
- Modify `src/App.jsx` — import `TransactionDetail`; add `<Route path="/transactions/:paymentId" ... />`.

---

## Task 1: Backend — Extend admin transactions search

**Files:**
- Modify: `coinleyserver/controller/admin.js:370-375` (inside `getTransactions`)

- [ ] **Step 1: Replace the existing `if (search)` block.**

Edit `coinleyserver/controller/admin.js`, locate this block (around line 370):

```js
    if (search) {
      where[db.Sequelize.Op.or] = [
        { id: { [db.Sequelize.Op.iLike]: `%${search}%` } },
        { transactionHash: { [db.Sequelize.Op.iLike]: `%${search}%` } }
      ];
    }
```

Replace with:

```js
    if (search) {
      // Admin ops use this to find a payment by any handle they happen to have:
      // the payment id, the customer's deposit tx, our sweep tx, the deposit
      // address, or the salt. All ILIKE so partial paste works.
      where[db.Sequelize.Op.or] = [
        { id:              { [db.Sequelize.Op.iLike]: `%${search}%` } },
        { transactionHash: { [db.Sequelize.Op.iLike]: `%${search}%` } },
        { depositAddress:  { [db.Sequelize.Op.iLike]: `%${search}%` } },
        { depositTxHash:   { [db.Sequelize.Op.iLike]: `%${search}%` } },
        { sweepTxHash:     { [db.Sequelize.Op.iLike]: `%${search}%` } },
        { salt:            { [db.Sequelize.Op.iLike]: `%${search}%` } }
      ];
    }
```

- [ ] **Step 2: Verify the controller still loads.**

Run from `/Users/joshuasol/Desktop/work/coinley/coinleyserver`:
```bash
node -e "require('./controller/admin.js'); console.log('OK')"
```
Expected: `OK` (after env warnings).

- [ ] **Step 3: Commit.**

```bash
git -C /Users/joshuasol/Desktop/work/coinley/coinleyserver add controller/admin.js
git -C /Users/joshuasol/Desktop/work/coinley/coinleyserver commit -m "feat(admin): broaden transactions search to match deposit/sweep/salt fields"
```

---

## Task 2: Backend — `GET /api/admin/payments/:id` endpoint

**Files:**
- Modify: `coinleyserver/controller/admin.js` (add `getPaymentById` near the other Payment-related admin handlers; export at the bottom)
- Modify: `coinleyserver/route/admin.js` (register the route)

- [ ] **Step 1: Add the handler in `controller/admin.js`.**

Insert the following function immediately AFTER the `getTransactions` function (which ends around line 423). Find the line `// Get fee transactions (admin revenue)` and insert ABOVE it:

```js
// Get a single payment by id, with all associations + flattened sweep metadata.
// Used by the admin TransactionDetail page so it can render every operational
// field on a payment in one view (deposit, sweep, timeline, merchant) without
// the frontend having to dig into metadata.
const getPaymentById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: 'Missing payment id' });
    }

    const payment = await Payment.findByPk(id, {
      include: [
        { model: Merchant, attributes: ['id', 'businessName', 'email'] },
        { model: Network,  attributes: ['id', 'name', 'shortName', 'chainId', 'explorerUrl'] },
        { model: Token,    attributes: ['id', 'symbol', 'name', 'address', 'decimals'] }
      ]
    });

    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' });
    }

    // Flatten the bits of metadata the detail view leans on so the frontend
    // doesn't have to know the metadata shape.
    const sweepGasFee   = payment.metadata?.sweepGasFee   || null;
    const sweepAttempts = payment.metadata?.sweepAttempts ?? 0;
    const manualRetryAt = payment.metadata?.manualRetryAt || null;
    const manualRetryBy = payment.metadata?.manualRetryBy || null;
    const manualForceAt = payment.metadata?.manualForceAt || null;
    const manualForceBy = payment.metadata?.manualForceBy || null;

    res.json({
      success: true,
      data: {
        payment,
        ops: {
          sweepGasFee,
          sweepAttempts,
          manualRetryAt,
          manualRetryBy,
          manualForceAt,
          manualForceBy
        }
      }
    });
  } catch (error) {
    console.error('Get payment by id error:', error);
    res.status(500).json({ error: error.message });
  }
};
```

- [ ] **Step 2: Export `getPaymentById` from `controller/admin.js`.**

Locate the `module.exports = { ... }` block near the bottom of the file. Find the `getTransactions,` line in that exports list and add `getPaymentById,` immediately after it:

```js
  getTransactions,
  getPaymentById,
```

- [ ] **Step 3: Register the route in `route/admin.js`.**

Open `coinleyserver/route/admin.js`. Find the import block at the top that destructures controller functions. Add `getPaymentById,` to that destructure (next to `getTransactions`):

```js
  getTransactions,
  getPaymentById,
```

Then, find the line `router.get('/transactions', authenticateAdmin, getTransactions);` (around line 70). Add a new line immediately after it:

```js
router.get('/payments/:id', authenticateAdmin, getPaymentById);
```

- [ ] **Step 4: Verify the route table loads.**

Run from `/Users/joshuasol/Desktop/work/coinley/coinleyserver`:
```bash
node -e "require('./route/admin.js'); console.log('OK')"
```
Expected: `OK` (after env warnings).

- [ ] **Step 5: Commit.**

```bash
git -C /Users/joshuasol/Desktop/work/coinley/coinleyserver add controller/admin.js route/admin.js
git -C /Users/joshuasol/Desktop/work/coinley/coinleyserver commit -m "feat(admin): add GET /api/admin/payments/:id with flattened ops metadata"
```

---

## Task 3: Backend — `force` flag on retry-sweep

**Files:**
- Modify: `coinleyserver/controller/admin.js:1328-1400` (`retrySweepPayment`)

- [ ] **Step 1: Update `retrySweepPayment` to read and act on `force`.**

In `controller/admin.js`, locate `retrySweepPayment` (starts around line 1328) and replace its body up through the `payment.update(...)` call. Specifically, replace this section:

```js
const retrySweepPayment = async (req, res) => {
  try {
    const { paymentId } = req.params;

    const payment = await Payment.findByPk(paymentId, {
      include: [
        { model: Network },
        { model: Token },
        { model: Merchant }
      ]
    });

    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' });
    }

    if (payment.depositMethod !== 'deposit_address') {
      return res.status(400).json({ error: 'Payment is not a deposit address payment' });
    }

    if (payment.sweptAt) {
      return res.status(400).json({ error: 'Payment already swept' });
    }

    // Reset the payment status to allow retry
    await payment.update({
      status: 'completed', // Reset to completed so sweep service picks it up
      metadata: {
        ...payment.metadata,
        sweepAttempts: 0, // Reset attempts
        manualRetryAt: new Date().toISOString(),
        manualRetryBy: req.admin?.email || 'admin'
      }
    });
```

With:

```js
const retrySweepPayment = async (req, res) => {
  try {
    const { paymentId } = req.params;
    // Accept force flag from body or query so curl/PowerShell users have an easy path.
    const force = req.body?.force === true
      || req.body?.force === 'true'
      || req.query?.force === 'true';

    const payment = await Payment.findByPk(paymentId, {
      include: [
        { model: Network },
        { model: Token },
        { model: Merchant }
      ]
    });

    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' });
    }

    if (payment.depositMethod !== 'deposit_address') {
      return res.status(400).json({ error: 'Payment is not a deposit address payment' });
    }

    if (payment.sweptAt) {
      return res.status(400).json({ error: 'Payment already swept' });
    }

    // Reset the payment so the sweep service will pick it up. Both retry and
    // force flows set status='completed'; the difference is that force is for
    // recovery cases (e.g. expired payment that got funded anyway), so we
    // tag the audit trail with `manualForceAt/By` to distinguish it from a
    // routine retry on a failed sweep.
    const auditPatch = force
      ? {
          manualForceAt: new Date().toISOString(),
          manualForceBy: req.admin?.email || 'admin'
        }
      : {
          manualRetryAt: new Date().toISOString(),
          manualRetryBy: req.admin?.email || 'admin'
        };

    await payment.update({
      status: 'completed',
      metadata: {
        ...payment.metadata,
        sweepAttempts: 0,
        ...auditPatch
      }
    });
```

Leave the rest of the function (the `sweepService.sweepPayment(paymentId)` block and the catch) untouched.

- [ ] **Step 2: Verify the controller still loads.**

```bash
node -e "require('./controller/admin.js'); console.log('OK')"
```
Expected: `OK`.

- [ ] **Step 3: Commit.**

```bash
git -C /Users/joshuasol/Desktop/work/coinley/coinleyserver add controller/admin.js
git -C /Users/joshuasol/Desktop/work/coinley/coinleyserver commit -m "feat(admin): force flag on retry-sweep with separate audit-trail metadata"
```

---

## Task 4: Backend — push to staging

- [ ] **Step 1: Confirm we're on staging with the three new commits ahead of origin.**

```bash
git -C /Users/joshuasol/Desktop/work/coinley/coinleyserver status -sb
git -C /Users/joshuasol/Desktop/work/coinley/coinleyserver log --oneline origin/staging..HEAD
```
Expected: branch shows `staging...origin/staging [ahead 3]`; three new commits listed (broaden search, payments/:id endpoint, force flag).

- [ ] **Step 2: Push to origin/staging.**

```bash
git -C /Users/joshuasol/Desktop/work/coinley/coinleyserver push origin staging
```
Expected: clean push, no rejections.

---

## Task 5: Frontend — `TransactionDetail.jsx` page

**Files:**
- Create: `coinley-admin-console/src/pages/TransactionDetail.jsx`

- [ ] **Step 1: Write the full file.**

Create `/Users/joshuasol/Desktop/work/coinley/coinley-admin-console/src/pages/TransactionDetail.jsx` with this content:

```jsx
// src/pages/TransactionDetail.jsx
import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import {
  ArrowLeft, Copy, ExternalLink, AlertCircle, RefreshCw,
  CheckCircle2, Clock, XCircle, AlertTriangle, Zap
} from 'lucide-react';
import { useDarkMode } from '../context/DarkModeContext';
import { URL } from '../url';

const STATUS_BADGE = {
  pending:   'bg-yellow-100 text-yellow-800',
  detected:  'bg-blue-100 text-blue-800',
  confirmed: 'bg-indigo-100 text-indigo-800',
  completed: 'bg-emerald-100 text-emerald-800',
  swept:     'bg-green-100 text-green-800',
  expired:   'bg-gray-100 text-gray-700',
  failed:    'bg-red-100 text-red-800',
};

function shortenHash(s, lead = 10, tail = 6) {
  if (!s) return '';
  if (s.length <= lead + tail + 3) return s;
  return `${s.slice(0, lead)}…${s.slice(-tail)}`;
}

function fmtDate(d) {
  if (!d) return '—';
  return new Date(d).toLocaleString();
}

function CopyButton({ value, darkMode }) {
  const [copied, setCopied] = useState(false);
  if (!value) return null;
  return (
    <button
      type="button"
      onClick={() => {
        navigator.clipboard.writeText(value);
        setCopied(true);
        setTimeout(() => setCopied(false), 1200);
      }}
      className={`ml-2 inline-flex items-center text-xs ${
        darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-800'
      }`}
      title="Copy"
    >
      <Copy size={14} />
      {copied && <span className="ml-1">copied</span>}
    </button>
  );
}

function ExplorerLink({ explorerUrl, path, darkMode, children }) {
  if (!explorerUrl || !path) return <>{children}</>;
  const base = explorerUrl.replace(/\/$/, '');
  return (
    <a
      href={`${base}/${path}`}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-1 underline ${
        darkMode ? 'text-purple-300 hover:text-white' : 'text-[#7042D2] hover:text-purple-900'
      }`}
    >
      {children}
      <ExternalLink size={12} />
    </a>
  );
}

function Field({ label, children, mono = false, darkMode }) {
  return (
    <div className="flex flex-col gap-1 py-2">
      <span className={`text-xs uppercase tracking-wide ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
        {label}
      </span>
      <div className={`${mono ? 'font-mono text-sm' : 'text-sm'} ${darkMode ? 'text-gray-100' : 'text-gray-900'} break-all`}>
        {children ?? <span className="text-gray-400">—</span>}
      </div>
    </div>
  );
}

function TimelineStep({ label, timestamp, reached, isError, darkMode }) {
  let Icon = Clock;
  let color = 'text-gray-400';
  if (isError) { Icon = XCircle; color = 'text-red-500'; }
  else if (reached) { Icon = CheckCircle2; color = 'text-green-500'; }
  return (
    <div className="flex items-start gap-3 py-2">
      <Icon size={18} className={color} />
      <div>
        <div className={`text-sm font-medium ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>{label}</div>
        <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{timestamp ? fmtDate(timestamp) : '—'}</div>
      </div>
    </div>
  );
}

export default function TransactionDetail() {
  const { paymentId } = useParams();
  const navigate = useNavigate();
  const { darkMode } = useDarkMode();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Force-sweep modal + toast state
  const [showConfirm, setShowConfirm] = useState(false);
  const [forcing, setForcing] = useState(false);
  const [toast, setToast] = useState(null); // { type: 'success'|'error', message, txHash? }

  const fetchPayment = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${URL}/api/admin/payments/${paymentId}`, {
        headers: { Authorization: `Bearer ${sessionStorage.getItem('access_token')}` }
      });
      if (response.data?.success) {
        setData(response.data.data);
      } else {
        setError('Failed to load payment');
      }
    } catch (err) {
      if (err.response?.status === 404) {
        setError('Payment not found');
      } else {
        console.error('Error fetching payment:', err);
        setError(err.response?.data?.error || 'Failed to load payment');
      }
    } finally {
      setLoading(false);
    }
  }, [paymentId]);

  useEffect(() => { fetchPayment(); }, [fetchPayment]);

  const handleForceSweep = async () => {
    setForcing(true);
    setToast(null);
    try {
      const response = await axios.post(
        `${URL}/api/admin/sweep/${paymentId}/retry`,
        { force: true },
        { headers: { Authorization: `Bearer ${sessionStorage.getItem('access_token')}` } }
      );
      if (response.data?.success) {
        setToast({
          type: 'success',
          message: response.data.message || 'Sweep retry triggered',
          txHash: response.data.sweepTxHash || null
        });
      } else {
        setToast({
          type: 'error',
          message: response.data?.error || response.data?.message || 'Sweep failed',
        });
      }
    } catch (err) {
      setToast({
        type: 'error',
        message: err.response?.data?.error || err.message || 'Force sweep request failed',
      });
    } finally {
      setForcing(false);
      setShowConfirm(false);
      fetchPayment(); // refresh detail regardless of outcome
    }
  };

  // --- render ---
  if (loading) {
    return (
      <div className="p-6">
        <div className="flex justify-center items-center py-16">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#7042D2]"></div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-6 max-w-3xl mx-auto">
        <button
          onClick={() => navigate('/transactions')}
          className={`mb-4 inline-flex items-center gap-2 text-sm ${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}
        >
          <ArrowLeft size={16} /> Back to Transactions
        </button>
        <div className={`p-6 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
          <div className="flex items-center gap-2 text-red-700">
            <AlertCircle size={20} />
            <span>{error || 'Payment not available'}</span>
          </div>
        </div>
      </div>
    );
  }

  const { payment, ops } = data;
  const explorerUrl = payment.Network?.explorerUrl;
  const status = payment.status;
  const canForceSweep = !payment.sweptAt && payment.depositMethod === 'deposit_address';

  // Treat 'expired' as a terminal state in the timeline (replaces the
  // greyed-out Detected → Confirmed → Completed path).
  const isExpired = status === 'expired';

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Link
            to="/transactions"
            className={`inline-flex items-center gap-2 text-sm ${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}
          >
            <ArrowLeft size={16} /> Back
          </Link>
          <span className={darkMode ? 'text-gray-500' : 'text-gray-400'}>/</span>
          <span className={`font-mono text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            {shortenHash(payment.id, 8, 6)}
          </span>
          <CopyButton value={payment.id} darkMode={darkMode} />
        </div>
        <button
          onClick={fetchPayment}
          className={`p-2 rounded-md ${darkMode ? 'text-gray-400 hover:text-white hover:bg-gray-700' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'}`}
          title="Refresh"
        >
          <RefreshCw size={18} />
        </button>
      </div>

      {/* Toast */}
      {toast && (
        <div className={`mb-4 p-4 rounded-md border flex items-start gap-3 ${
          toast.type === 'success'
            ? 'bg-green-50 border-green-200 text-green-800'
            : 'bg-red-50 border-red-200 text-red-800'
        }`}>
          {toast.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
          <div className="flex-1">
            <div className="font-medium">{toast.message}</div>
            {toast.txHash && (
              <div className="mt-1 font-mono text-xs break-all">
                Sweep tx: {toast.txHash}{' '}
                {explorerUrl && (
                  <ExplorerLink explorerUrl={explorerUrl} path={`tx/${toast.txHash}`} darkMode={darkMode}>
                    view
                  </ExplorerLink>
                )}
              </div>
            )}
          </div>
          <button onClick={() => setToast(null)} className="text-xs underline">dismiss</button>
        </div>
      )}

      {/* Status + Amount summary strip */}
      <div className={`p-4 rounded-lg mb-6 flex items-center justify-between ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
        <div className="flex items-center gap-3">
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${STATUS_BADGE[status] || 'bg-gray-100 text-gray-700'}`}>
            {status}
          </span>
          <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            on {payment.Network?.name || `chain ${payment.Network?.chainId || '?'}`}
          </span>
        </div>
        <div className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          {payment.amount} {payment.currency}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Overview */}
        <section className={`p-5 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
          <h2 className={`text-base font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Overview</h2>
          <Field label="Merchant" darkMode={darkMode}>
            {payment.Merchant?.businessName || '—'}
            {payment.Merchant?.email && (
              <span className={`block text-xs mt-0.5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {payment.Merchant.email}
              </span>
            )}
          </Field>
          <Field label="Amount" darkMode={darkMode}>{payment.amount} {payment.currency}</Field>
          <Field label="Network" darkMode={darkMode}>{payment.Network?.name} (chain {payment.Network?.chainId})</Field>
          <Field label="Token" darkMode={darkMode}>
            {payment.Token?.symbol ? `${payment.Token.symbol} — ${payment.Token.name}` : '—'}
          </Field>
          <Field label="Created" darkMode={darkMode}>{fmtDate(payment.createdAt)}</Field>
          <Field label="Expires" darkMode={darkMode}>{fmtDate(payment.expiresAt)}</Field>
        </section>

        {/* Deposit */}
        <section className={`p-5 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
          <h2 className={`text-base font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Deposit</h2>
          <Field label="Deposit Address" mono darkMode={darkMode}>
            {payment.depositAddress ? (
              <>
                <ExplorerLink explorerUrl={explorerUrl} path={`address/${payment.depositAddress}`} darkMode={darkMode}>
                  {payment.depositAddress}
                </ExplorerLink>
                <CopyButton value={payment.depositAddress} darkMode={darkMode} />
              </>
            ) : null}
          </Field>
          <Field label="Factory" mono darkMode={darkMode}>
            {payment.factoryAddress ? (
              <>
                <ExplorerLink explorerUrl={explorerUrl} path={`address/${payment.factoryAddress}`} darkMode={darkMode}>
                  {payment.factoryAddress}
                </ExplorerLink>
                <CopyButton value={payment.factoryAddress} darkMode={darkMode} />
              </>
            ) : null}
          </Field>
          <Field label="Salt" mono darkMode={darkMode}>
            {payment.salt && (
              <>
                {shortenHash(payment.salt, 14, 10)}
                <CopyButton value={payment.salt} darkMode={darkMode} />
              </>
            )}
          </Field>
          <Field label="Deposit Tx" mono darkMode={darkMode}>
            {payment.depositTxHash ? (
              <>
                <ExplorerLink explorerUrl={explorerUrl} path={`tx/${payment.depositTxHash}`} darkMode={darkMode}>
                  {shortenHash(payment.depositTxHash, 12, 10)}
                </ExplorerLink>
                <CopyButton value={payment.depositTxHash} darkMode={darkMode} />
              </>
            ) : null}
          </Field>
          <Field label="Confirmations" darkMode={darkMode}>
            {payment.confirmations != null
              ? `${payment.confirmations}${payment.requiredConfirmations ? ` / ${payment.requiredConfirmations}` : ''}`
              : '—'}
          </Field>
          <Field label="Detected At" darkMode={darkMode}>{fmtDate(payment.detectedAt)}</Field>
          <Field label="Confirmed At" darkMode={darkMode}>{fmtDate(payment.confirmedAt)}</Field>
        </section>

        {/* Sweep */}
        <section className={`p-5 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
          <h2 className={`text-base font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Sweep</h2>
          <Field label="Sweep Tx" mono darkMode={darkMode}>
            {payment.sweepTxHash ? (
              <>
                <ExplorerLink explorerUrl={explorerUrl} path={`tx/${payment.sweepTxHash}`} darkMode={darkMode}>
                  {shortenHash(payment.sweepTxHash, 12, 10)}
                </ExplorerLink>
                <CopyButton value={payment.sweepTxHash} darkMode={darkMode} />
              </>
            ) : null}
          </Field>
          <Field label="Swept At" darkMode={darkMode}>{fmtDate(payment.sweptAt)}</Field>
          <Field label="Gas Fee" darkMode={darkMode}>
            {ops.sweepGasFee
              ? `${ops.sweepGasFee.native || ops.sweepGasFee.wei || '—'} ${ops.sweepGasFee.symbol || ''}`
              : '—'}
          </Field>
          <Field label="Sweep Attempts" darkMode={darkMode}>{ops.sweepAttempts}</Field>
          {(ops.manualRetryAt || ops.manualForceAt) && (
            <Field label="Manual Intervention" darkMode={darkMode}>
              {ops.manualForceAt && (
                <span className="block">Forced by {ops.manualForceBy || '—'} at {fmtDate(ops.manualForceAt)}</span>
              )}
              {ops.manualRetryAt && (
                <span className="block">Retried by {ops.manualRetryBy || '—'} at {fmtDate(ops.manualRetryAt)}</span>
              )}
            </Field>
          )}
        </section>

        {/* Timeline */}
        <section className={`p-5 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
          <h2 className={`text-base font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Timeline</h2>
          <TimelineStep label="Created"   timestamp={payment.createdAt}   reached={true}                         darkMode={darkMode} />
          {isExpired ? (
            <TimelineStep label="Expired" timestamp={payment.expiresAt} reached={true} isError darkMode={darkMode} />
          ) : (
            <>
              <TimelineStep label="Detected"  timestamp={payment.detectedAt}  reached={!!payment.detectedAt}  darkMode={darkMode} />
              <TimelineStep label="Confirmed" timestamp={payment.confirmedAt} reached={!!payment.confirmedAt} darkMode={darkMode} />
              <TimelineStep label="Completed" timestamp={payment.completedAt} reached={status === 'completed' || status === 'swept' || !!payment.sweptAt} darkMode={darkMode} />
              <TimelineStep label="Swept"     timestamp={payment.sweptAt}     reached={!!payment.sweptAt}     darkMode={darkMode} />
            </>
          )}
        </section>
      </div>

      {/* Actions */}
      {canForceSweep && (
        <section className={`mt-6 p-5 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
          <div className="flex items-start gap-3">
            <AlertTriangle size={20} className="text-amber-500 mt-0.5" />
            <div className="flex-1">
              <h2 className={`text-base font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Force Sweep</h2>
              <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Triggers a sweep of the deposit address regardless of detection status. Use this for funded-but-expired payments or stuck cases.
                The action is recorded in audit metadata as <code>manualForceBy</code>.
              </p>
              <button
                onClick={() => setShowConfirm(true)}
                disabled={forcing}
                className="mt-3 inline-flex items-center gap-2 px-4 py-2 bg-[#7042D2] text-white rounded-md text-sm hover:bg-opacity-90 disabled:opacity-50"
              >
                <Zap size={16} /> Force Sweep
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Confirm modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className={`max-w-md w-full rounded-lg p-6 ${darkMode ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-900'}`}>
            <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
              <AlertTriangle className="text-amber-500" size={20} />
              Confirm Force Sweep
            </h3>
            <p className="text-sm mb-4">
              About to force-sweep on <strong>{payment.Network?.name || 'unknown chain'}</strong>.
            </p>
            <div className={`text-xs font-mono break-all rounded p-3 mb-4 ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
              {payment.depositAddress}
            </div>
            <p className="text-sm mb-4">
              Current status: <strong>{status}</strong> · Amount: <strong>{payment.amount} {payment.currency}</strong>
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowConfirm(false)}
                disabled={forcing}
                className={`px-4 py-2 text-sm rounded-md border ${darkMode ? 'border-gray-600 hover:bg-gray-700' : 'border-gray-300 hover:bg-gray-50'}`}
              >
                Cancel
              </button>
              <button
                onClick={handleForceSweep}
                disabled={forcing}
                className="px-4 py-2 text-sm rounded-md bg-[#7042D2] text-white hover:bg-opacity-90 disabled:opacity-50 inline-flex items-center gap-2"
              >
                {forcing && <RefreshCw size={14} className="animate-spin" />}
                Confirm Force Sweep
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Lint the new file.**

Run from `/Users/joshuasol/Desktop/work/coinley/coinley-admin-console`:
```bash
npx eslint src/pages/TransactionDetail.jsx
```
Expected: clean (no output). If the linter complains about unused imports, remove the offenders; everything imported above is intended to be used as written.

- [ ] **Step 3: Commit.**

```bash
git -C /Users/joshuasol/Desktop/work/coinley/coinley-admin-console add src/pages/TransactionDetail.jsx
git -C /Users/joshuasol/Desktop/work/coinley/coinley-admin-console commit -m "feat(admin): add TransactionDetail page with timeline + force-sweep action"
```

---

## Task 6: Frontend — wire route + clickable rows + wider search

**Files:**
- Modify: `coinley-admin-console/src/App.jsx`
- Modify: `coinley-admin-console/src/pages/Transactions.jsx`

- [ ] **Step 1: Register the route in `App.jsx`.**

Open `coinley-admin-console/src/App.jsx`. Near the other page imports at the top (around line 23, next to `import Transactions from './pages/Transactions';`), add:

```jsx
import TransactionDetail from './pages/TransactionDetail';
```

Then locate the existing block:

```jsx
          <Route path="/transactions" element={
            <DashboardLayout>
              <Transactions />
            </DashboardLayout>
          } />
```

Insert immediately AFTER it:

```jsx
          <Route path="/transactions/:paymentId" element={
            <DashboardLayout>
              <TransactionDetail />
            </DashboardLayout>
          } />
```

- [ ] **Step 2: Update the search placeholder in `Transactions.jsx`.**

In `coinley-admin-console/src/pages/Transactions.jsx`, find the input at line 763:

```jsx
              placeholder="Search by ID or Tx Hash..."
```

Replace with:

```jsx
              placeholder="Search by ID, deposit address, tx hash, sweep tx, or salt..."
```

- [ ] **Step 3: Make rows clickable.**

In the same file, at the top, find the existing react-router import. If it doesn't already import `useNavigate`, add it:

```jsx
import { useNavigate } from 'react-router-dom';
```

Then inside the `Transactions` function body, near the other hook initializations (e.g. `const { darkMode } = useDarkMode();`), add:

```jsx
  const navigate = useNavigate();
```

Now find the table row at line 993:

```jsx
                  <tr key={tx.id} className={`border-b ${
                    darkMode 
                      ? 'border-gray-700 hover:bg-gray-700' 
                      : 'border-gray-100 hover:bg-gray-50'
                  }`}>
```

Replace with:

```jsx
                  <tr
                    key={tx.id}
                    onClick={() => navigate(`/transactions/${tx.id}`)}
                    className={`border-b cursor-pointer ${
                      darkMode
                        ? 'border-gray-700 hover:bg-gray-700'
                        : 'border-gray-100 hover:bg-gray-50'
                    }`}
                  >
```

The existing per-cell copy buttons (e.g., the tx-hash copy at line 395-ish in the active render) call `e.stopPropagation()`? They don't currently — they'll bubble up and navigate. To prevent that, find each `onClick={() => copyToClipboard(...)}` button inside a row and wrap the handler. Specifically, search for `onClick={() => copyToClipboard(` inside the live render section (`tbody`); for each occurrence, change the handler to:

```jsx
onClick={(e) => { e.stopPropagation(); copyToClipboard(tx.transactionHash); }}
```

(Adjust the argument — `tx.transactionHash` or whichever value the original passed — to match the original call.) Apply the same `e.stopPropagation()` wrapping to **every** in-row interactive element under `<tbody>` — copy buttons, action-column buttons, dropdowns — otherwise clicking them will also navigate to the detail page. If you find no in-row interactive elements after line 993, this guard isn't needed; skip it.

- [ ] **Step 4: Lint the changed files.**

```bash
npx eslint src/App.jsx src/pages/Transactions.jsx
```
Expected: clean. If "useNavigate is defined but never used" appears, ensure you actually used `navigate(...)` in the row's `onClick`.

- [ ] **Step 5: Commit.**

```bash
git -C /Users/joshuasol/Desktop/work/coinley/coinley-admin-console add src/App.jsx src/pages/Transactions.jsx
git -C /Users/joshuasol/Desktop/work/coinley/coinley-admin-console commit -m "feat(admin): clickable transaction rows + broader search placeholder + detail route"
```

---

## Task 7: End-to-end manual verification

**Backend (against staging API):**

- [ ] **Step 1: Search returns rows when given a deposit address.**

Replace `<TOKEN>` with a valid admin access token and `<ADDR>` with `0x990677fc0864dcd5D7f812824D87270c123E161A`:

```bash
curl -s -H "Authorization: Bearer <TOKEN>" \
  "https://<staging-base>/api/admin/transactions?search=<ADDR>&limit=5" | jq '.data.transactions[].id'
```

Expected: zero or more payment ids. If non-zero, copy one for the next step.

- [ ] **Step 2: Detail endpoint returns full record.**

```bash
curl -s -H "Authorization: Bearer <TOKEN>" \
  "https://<staging-base>/api/admin/payments/<ID>" | jq '.data | { status: .payment.status, depositAddress: .payment.depositAddress, sweepTxHash: .payment.sweepTxHash, sweepAttempts: .ops.sweepAttempts }'
```

Expected: JSON with status, depositAddress, sweepTxHash, sweepAttempts.

**Frontend (against the deployed build of `feat/ops-console-detail-view` — or `npm run dev` locally pointed at staging):**

- [ ] **Step 3: Search by address surfaces the row.**

In the admin console Transactions page, paste a known deposit address into the search input → press Enter → confirm the row appears.

- [ ] **Step 4: Click navigates to detail.**

Click the row → URL becomes `/transactions/<id>` → all sections render with copy buttons and explorer links where applicable.

- [ ] **Step 5: Force Sweep button visibility.**

For a payment with `sweptAt = null`: Force Sweep card is visible at the bottom. For a payment already swept: the card is absent.

- [ ] **Step 6: Force Sweep flow.**

Pick an expired or pending payment on staging that is safe to retry (or a known funded-but-expired). Click Force Sweep → confirm modal shows network + deposit address + amount + status → click Confirm → toast appears (success or error) → detail page refreshes and Manual Intervention field shows the forced timestamp.

---

## Final push (when verification passes)

```bash
git -C /Users/joshuasol/Desktop/work/coinley/coinley-admin-console push -u production feat/ops-console-detail-view
```

Then open a PR from `feat/ops-console-detail-view` → `production/main` on `coinleylabs/coinley-console-FE`.
