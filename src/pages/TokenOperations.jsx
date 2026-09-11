/* eslint-disable react/prop-types */
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Activity, ArrowDownToLine, ArrowRight, CheckCircle2, ChevronLeft, ChevronRight,
  CircleAlert, Coins, Copy, FlaskConical, RefreshCw, Search, Users, Wallet, X
} from 'lucide-react';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import axiosInstance from '../utils/axiosInstance';
import { useDarkMode } from '../context/DarkModeContext';

const TOKEN_META = {
  USDC: { color: '#2775ca', symbol: '$' },
  USDT: { color: '#26a17b', symbol: '₮' },
  DAI: { color: '#f5ac37', symbol: '◈' }
};
const PAGE_SIZE = 10;
const format = (value, digits = 2) => new Intl.NumberFormat('en-US', { maximumFractionDigits: digits }).format(Number(value || 0));
const compact = (value) => new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 }).format(Number(value || 0));
const short = (value, left = 9, right = 5) => value ? `${value.slice(0, left)}…${value.slice(-right)}` : '—';
const timeAgo = (value) => {
  if (!value) return 'Never';
  const seconds = Math.max(0, Math.floor((Date.now() - new Date(value).getTime()) / 1000));
  if (seconds < 60) return 'Just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
};

const TokenOperations = () => {
  const { darkMode } = useDarkMode();
  const [tab, setTab] = useState('overview');
  const [rangeDays, setRangeDays] = useState(30);
  const [data, setData] = useState({ summary: {}, tokens: [], activity: [], recentTransactions: [], recentWallets: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [walletType, setWalletType] = useState('all');
  const [merchantPage, setMerchantPage] = useState(1);
  const [walletPage, setWalletPage] = useState(1);
  const [transactionPage, setTransactionPage] = useState(1);
  const [fundingWallet, setFundingWallet] = useState(null);
  const [notice, setNotice] = useState('');

  const loadData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axiosInstance.get('/api/admin/sandbox-tokens/overview', { params: { rangeDays } });
      setData(response.data?.data || {});
    } catch (requestError) {
      setError(requestError.response?.data?.error || 'Token analytics could not be loaded.');
    } finally {
      setLoading(false);
    }
  }, [rangeDays]);

  useEffect(() => { loadData(); }, [loadData]);

  const wallets = useMemo(() => (data.recentWallets || []).filter((wallet) => {
    const merchantWallet = String(wallet.owner_id || '').startsWith('merchant:');
    const matchesType = walletType === 'all' || (walletType === 'merchant' ? merchantWallet : !merchantWallet);
    const haystack = `${wallet.owner_id} ${wallet.address} ${wallet.label} ${wallet.merchant?.businessName} ${wallet.merchant?.email}`.toLowerCase();
    return matchesType && haystack.includes(search.toLowerCase());
  }), [data.recentWallets, search, walletType]);

  const activity = useMemo(() => (data.activity || []).map((item) => ({
    ...item,
    volume: Number(item.volume),
    label: new Date(item.day).toLocaleDateString('en', { month: 'short', day: 'numeric' })
  })), [data.activity]);

  const card = darkMode ? 'border-gray-700 bg-gray-800 text-white' : 'border-gray-200 bg-white text-gray-900';
  const muted = darkMode ? 'text-gray-400' : 'text-gray-500';
  const tabs = [['overview', 'Overview'], ['wallets', 'Wallets'], ['transactions', 'Ledger activity']];
  const tokenUnavailable = Boolean(data.tokenServerError) || data.health?.status !== 'ok';

  return (
    <div className="space-y-5">
      <section className="relative overflow-hidden rounded-2xl border border-gray-800 bg-[#131720] p-7 text-white shadow-xl">
        <div className="relative z-10 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div><span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-purple-300"><FlaskConical size={15}/> Sandbox infrastructure</span><h1 className="mt-3 text-3xl font-bold">Token operations</h1><p className="mt-2 max-w-2xl text-sm text-gray-400">Monitor simulated stablecoins, merchant testing activity, wallets, and the sandbox ledger from the admin console.</p></div>
          <div className="flex flex-wrap items-center gap-3"><div className="rounded-xl border border-gray-700 bg-gray-800/80 px-4 py-3"><span className="block text-xs text-gray-500">Token server</span><strong className={`mt-1 flex items-center gap-2 text-sm ${tokenUnavailable ? 'text-red-300' : 'text-emerald-300'}`}><i className={`h-2 w-2 rounded-full ${tokenUnavailable ? 'bg-red-400' : 'bg-emerald-400'}`}/>{tokenUnavailable ? 'Unavailable' : 'Operational'}</strong></div><button onClick={loadData} disabled={loading} className="inline-flex items-center gap-2 rounded-xl bg-purple-600 px-4 py-3 text-sm font-semibold hover:bg-purple-500 disabled:opacity-60"><RefreshCw size={16} className={loading ? 'animate-spin' : ''}/>Refresh</button></div>
        </div>
      </section>

      {(error || data.tokenServerError) && <div className={`flex items-start gap-3 rounded-xl border p-4 text-sm ${darkMode ? 'border-amber-800 bg-amber-950/30 text-amber-300' : 'border-amber-200 bg-amber-50 text-amber-800'}`}><CircleAlert size={18}/><div><strong className="block">Some token data is unavailable</strong><span>{error || data.tokenServerError}</span></div></div>}
      {notice && <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-xl bg-emerald-700 px-4 py-3 text-sm text-white shadow-xl"><CheckCircle2 size={17}/>{notice}</div>}

      <div className={`inline-flex rounded-xl border p-1 ${card}`}>{tabs.map(([id, label]) => <button key={id} onClick={() => setTab(id)} className={`rounded-lg px-4 py-2 text-sm font-medium ${tab === id ? 'bg-[#7042D2] text-white' : muted}`}>{label}</button>)}</div>

      {loading && !data.summary?.wallets ? <div className="flex justify-center py-24"><div className="h-9 w-9 animate-spin rounded-full border-b-2 border-[#7042D2]"/></div> : null}

      {tab === 'overview' && <>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Metric card={card} muted={muted} icon={<Wallet/>} label="Total wallets" value={format(data.summary?.wallets, 0)} detail={`${format(data.summary?.merchant_wallets, 0)} merchant wallets`}/>
          <Metric card={card} muted={muted} icon={<Activity/>} label="Transactions" value={format(data.summary?.period_transactions, 0)} detail={`Last ${rangeDays} days`}/>
          <Metric card={card} muted={muted} icon={<Coins/>} label="Token volume" value={`$${compact(data.summary?.period_volume)}`} detail="Simulated, no real value"/>
          <Metric card={card} muted={muted} icon={<Users/>} label="Test customers" value={format(data.summary?.customer_wallets, 0)} detail={`Active ${timeAgo(data.summary?.last_activity)}`}/>
        </div>
        <MerchantLifecycle lifecycle={data.merchantLifecycle} page={merchantPage} setPage={setMerchantPage} card={card} muted={muted}/>
        <div className="grid gap-4 lg:grid-cols-3">{(data.tokens || []).map(token => <TokenCard key={token.token} token={token} card={card} muted={muted}/>)}</div>
        <div className="grid gap-4 xl:grid-cols-5">
          <section className={`rounded-xl border p-5 xl:col-span-3 ${card}`}><div className="mb-4 flex items-center justify-between"><div><h2 className="font-semibold">Testing activity</h2><p className={`text-xs ${muted}`}>Simulated token volume over time</p></div><select value={rangeDays} onChange={event => setRangeDays(Number(event.target.value))} className={`rounded-lg border px-3 py-2 text-xs ${card}`}><option value="7">7 days</option><option value="30">30 days</option><option value="90">90 days</option></select></div><div className="h-64"><ResponsiveContainer width="100%" height="100%"><AreaChart data={activity}><CartesianGrid vertical={false} strokeDasharray="4 6" stroke={darkMode ? '#374151' : '#e5e7eb'}/><XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 11 }}/><YAxis axisLine={false} tickLine={false} tickFormatter={compact} tick={{ fill: '#9ca3af', fontSize: 11 }}/><Tooltip/><Area type="monotone" dataKey="volume" stroke="#8d64ff" fill="#8d64ff33" strokeWidth={2.5}/></AreaChart></ResponsiveContainer></div></section>
          <RecentActivity transactions={data.recentTransactions || []} card={card} muted={muted}/>
        </div>
      </>}

      {tab === 'wallets' && <section className={`rounded-xl border p-5 ${card}`}><div className="mb-5 flex flex-wrap items-center justify-between gap-3"><div><h2 className="font-semibold">Wallet directory</h2><p className={`text-xs ${muted}`}>Merchant and customer sandbox balances</p></div><div className="flex flex-wrap gap-2"><label className={`flex items-center gap-2 rounded-lg border px-3 ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}><Search size={15}/><input value={search} onChange={event => { setSearch(event.target.value); setWalletPage(1); }} placeholder="Search wallets" className="bg-transparent py-2 text-sm outline-none"/></label><select value={walletType} onChange={event => { setWalletType(event.target.value); setWalletPage(1); }} className={`rounded-lg border px-3 text-sm ${card}`}><option value="all">All wallets</option><option value="merchant">Merchants</option><option value="customer">Customers</option></select></div></div><WalletTable wallets={wallets} page={walletPage} setPage={setWalletPage} setFundingWallet={setFundingWallet} card={card} muted={muted}/></section>}

      {tab === 'transactions' && <section className={`rounded-xl border p-5 ${card}`}><div className="mb-5"><h2 className="font-semibold">Ledger activity</h2><p className={`text-xs ${muted}`}>Every recent faucet and transfer event</p></div><TransactionTable transactions={data.recentTransactions || []} page={transactionPage} setPage={setTransactionPage} muted={muted}/></section>}
      {fundingWallet && <FundingModal wallet={fundingWallet} close={() => setFundingWallet(null)} onSuccess={() => { setNotice('Test tokens dispensed successfully'); window.setTimeout(() => setNotice(''), 2500); loadData(); }} darkMode={darkMode}/>} 
    </div>
  );
};

const Metric = ({ card, muted, icon, label, value, detail }) => <article className={`rounded-xl border p-5 ${card}`}><div className="flex items-center justify-between"><span className={`text-xs font-semibold uppercase tracking-wide ${muted}`}>{label}</span><span className="rounded-lg bg-purple-100 p-2 text-purple-600">{icon}</span></div><strong className="mt-4 block text-2xl">{value}</strong><span className={`mt-2 block text-xs ${muted}`}>{detail}</span></article>;
const TokenCard = ({ token, card, muted }) => { const meta = TOKEN_META[token.token] || TOKEN_META.USDC; return <article className={`rounded-xl border p-5 ${card}`}><div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-full font-bold text-white" style={{ background: meta.color }}>{meta.symbol}</span><div><strong>{token.token}</strong><small className={`block ${muted}`}>Sandbox stablecoin</small></div><span className={`ml-auto text-xs ${muted}`}>{token.funded_wallets} funded</span></div><span className={`mt-5 block text-xs uppercase ${muted}`}>Circulating supply</span><strong className="mt-1 block text-2xl">{format(token.supply)} <small className={muted}>{token.token}</small></strong><div className="mt-4 grid grid-cols-3 gap-2 border-t border-gray-200/20 pt-4 text-xs"><div><span className={muted}>Dispensed</span><strong className="block">{compact(token.faucet_volume)}</strong></div><div><span className={muted}>Transferred</span><strong className="block">{compact(token.transfer_volume)}</strong></div><div><span className={muted}>Events</span><strong className="block">{format(token.transaction_count, 0)}</strong></div></div></article>; };

const MerchantLifecycle = ({ lifecycle, page, setPage, card, muted }) => { const merchants = lifecycle?.recent || []; const totalPages = Math.max(1, Math.ceil(merchants.length / PAGE_SIZE)); const currentPage = Math.min(page, totalPages); const visible = merchants.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE); const summary = lifecycle?.summary || {}; return <section className={`rounded-xl border p-5 ${card}`}><h2 className="font-semibold">Merchant activation</h2><p className={`mb-4 text-xs ${muted}`}>Registration, verification, onboarding, and test-key coverage</p><div className="mb-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{[['Registered', summary.registered], ['Email verified', summary.verified], ['Verified, onboarding incomplete', summary.verifiedOnboardingIncomplete], ['Onboarding complete', summary.onboardingCompleted]].map(([label, value]) => <div key={label} className={`rounded-lg border p-3 ${card}`}><small className={muted}>{label}</small><strong className="mt-1 block text-xl">{format(value, 0)}</strong></div>)}</div><div className="overflow-x-auto"><table className="w-full min-w-[760px] text-left text-sm"><thead><tr className={`border-b ${muted}`}><th className="p-3">Merchant</th><th>Source</th><th>Email</th><th>Onboarding</th><th>Test key</th><th>Registered</th></tr></thead><tbody>{visible.map(merchant => <tr key={merchant.id} className="border-b border-gray-200/20"><td className="p-3"><strong>{merchant.businessName || 'Pending onboarding'}</strong><small className={`block ${muted}`}>{merchant.email}</small></td><td className="capitalize">{merchant.registrationSource || 'website'}</td><td>{merchant.verified ? 'Verified' : 'Unverified'}</td><td>{merchant.onboardingStatus === 'completed' ? 'Completed' : 'Incomplete'}</td><td>{merchant.hasTestPublicKey ? 'Issued' : 'Missing'}</td><td className={muted}>{timeAgo(merchant.createdAt)}</td></tr>)}</tbody></table></div><Pagination page={currentPage} totalPages={totalPages} setPage={setPage}/></section>; };

const WalletTable = ({ wallets, page, setPage, setFundingWallet, muted }) => { const totalPages = Math.max(1, Math.ceil(wallets.length / PAGE_SIZE)); const currentPage = Math.min(page, totalPages); const visible = wallets.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE); return <><div className="overflow-x-auto"><table className="w-full min-w-[900px] text-left text-sm"><thead><tr className={`border-b ${muted}`}><th className="p-3">Owner</th><th>Address</th><th>Balances</th><th>Events</th><th>Last active</th><th/></tr></thead><tbody>{visible.map(wallet => <tr key={wallet.id} className="border-b border-gray-200/20"><td className="p-3"><strong>{wallet.merchant?.businessName || wallet.label || 'Test customer'}</strong><small className={`block ${muted}`}>{wallet.merchant?.email || wallet.owner_id}</small></td><td><button onClick={() => navigator.clipboard.writeText(wallet.address)} className={`inline-flex items-center gap-1 font-mono text-xs ${muted}`}>{short(wallet.address)}<Copy size={12}/></button></td><td><div className="flex gap-2">{Object.entries(wallet.balances || {}).map(([token, value]) => <span key={token} className="rounded bg-purple-100/10 px-2 py-1 text-xs"><b>{token}</b> {format(value)}</span>)}</div></td><td>{format(wallet.transaction_count, 0)}</td><td className={muted}>{timeAgo(wallet.last_activity)}</td><td>{wallet.merchant && <button onClick={() => setFundingWallet(wallet)} className="rounded-lg bg-purple-600 px-3 py-2 text-xs font-semibold text-white">Dispense</button>}</td></tr>)}</tbody></table></div>{!wallets.length && <div className={`py-16 text-center ${muted}`}>No wallets match this search.</div>}<Pagination page={currentPage} totalPages={totalPages} setPage={setPage}/></>; };
const TransactionTable = ({ transactions, page, setPage, muted }) => { const totalPages = Math.max(1, Math.ceil(transactions.length / PAGE_SIZE)); const currentPage = Math.min(page, totalPages); const visible = transactions.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE); return <><div className="overflow-x-auto"><table className="w-full min-w-[780px] text-left text-sm"><thead><tr className={`border-b ${muted}`}><th className="p-3">Event</th><th>Hash</th><th>Recipient</th><th>Token</th><th>Amount</th><th>Status</th><th>Created</th></tr></thead><tbody>{visible.map(tx => <tr key={tx.id} className="border-b border-gray-200/20"><td className="p-3 capitalize">{tx.type}</td><td className={`font-mono text-xs ${muted}`}>{short(tx.transaction_hash)}</td><td className={muted}>{short(tx.to_owner_id || 'merchant')}</td><td><strong>{tx.token}</strong></td><td>{format(tx.amount)}</td><td className="capitalize text-emerald-500">{tx.status}</td><td className={muted}>{timeAgo(tx.created_at)}</td></tr>)}</tbody></table></div><Pagination page={currentPage} totalPages={totalPages} setPage={setPage}/></>; };
const RecentActivity = ({ transactions, card, muted }) => <section className={`rounded-xl border p-5 xl:col-span-2 ${card}`}><h2 className="font-semibold">Recent activity</h2><p className={`mb-3 text-xs ${muted}`}>Latest ledger events</p>{transactions.slice(0, 6).map(tx => <div key={tx.id} className="flex items-center gap-3 border-b border-gray-200/20 py-3 last:border-0"><span className="rounded-lg bg-purple-100 p-2 text-purple-600">{tx.type === 'faucet' ? <ArrowDownToLine size={16}/> : <ArrowRight size={16}/>}</span><div className="min-w-0 flex-1"><strong className="block text-sm">{tx.type === 'faucet' ? 'Tokens dispensed' : 'Payment transferred'}</strong><small className={`block truncate ${muted}`}>{short(tx.transaction_hash)} · {timeAgo(tx.created_at)}</small></div><strong className="text-sm">{format(tx.amount)} {tx.token}</strong></div>)}</section>;
const Pagination = ({ page, totalPages, setPage }) => <div className="mt-4 flex items-center justify-end gap-3 text-xs"><button disabled={page === 1} onClick={() => setPage(Math.max(1, page - 1))} className="rounded-lg border border-gray-300/30 p-2 disabled:opacity-30"><ChevronLeft size={15}/></button><span>Page {page} of {totalPages}</span><button disabled={page === totalPages} onClick={() => setPage(Math.min(totalPages, page + 1))} className="rounded-lg border border-gray-300/30 p-2 disabled:opacity-30"><ChevronRight size={15}/></button></div>;

const FundingModal = ({ wallet, close, onSuccess, darkMode }) => { const [token, setToken] = useState('USDC'); const [amount, setAmount] = useState(1000); const [submitting, setSubmitting] = useState(false); const [error, setError] = useState(''); const submit = async event => { event.preventDefault(); setSubmitting(true); setError(''); try { await axiosInstance.post('/api/admin/sandbox-tokens/fund', { merchantId: wallet.merchant.id, token, amount: Number(amount) }); onSuccess(); close(); } catch (requestError) { setError(requestError.response?.data?.error || 'Unable to dispense tokens.'); } finally { setSubmitting(false); } }; return <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-5"><form onSubmit={submit} className={`relative w-full max-w-md rounded-2xl border p-6 shadow-2xl ${darkMode ? 'border-gray-700 bg-gray-800 text-white' : 'border-gray-200 bg-white text-gray-900'}`}><button type="button" onClick={close} className="absolute right-4 top-4"><X size={18}/></button><span className="grid h-11 w-11 place-items-center rounded-xl bg-purple-100 text-purple-600"><FlaskConical/></span><h2 className="mt-4 text-xl font-semibold">Dispense test tokens</h2><p className="mt-1 text-sm text-gray-500">Fund <strong>{wallet.merchant.businessName}</strong>&apos;s sandbox wallet.</p><div className="mt-5 grid grid-cols-3 gap-2">{Object.keys(TOKEN_META).map(name => <button type="button" key={name} onClick={() => setToken(name)} className={`rounded-lg border p-3 text-sm font-semibold ${token === name ? 'border-purple-500 bg-purple-50 text-purple-700' : 'border-gray-300/30'}`}>{name}</button>)}</div><label className="mt-4 block text-sm">Amount<input type="number" min="0.01" step="0.01" required value={amount} onChange={event => setAmount(event.target.value)} className={`mt-2 w-full rounded-lg border p-3 ${darkMode ? 'border-gray-600 bg-gray-700' : 'border-gray-300 bg-white'}`}/></label>{error && <p className="mt-3 text-sm text-red-500">{error}</p>}<button disabled={submitting} className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-purple-600 p-3 text-sm font-semibold text-white disabled:opacity-50"><Coins size={16}/>{submitting ? 'Dispensing…' : `Dispense ${token}`}</button></form></div>; };

export default TokenOperations;
