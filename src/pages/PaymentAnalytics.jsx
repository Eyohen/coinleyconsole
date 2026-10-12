import { useCallback, useEffect, useMemo, useState } from 'react';
import { Activity, AlertCircle, CheckCircle2, Clock3, CreditCard, RefreshCw, Repeat2, ShoppingCart, TrendingUp, WalletCards } from 'lucide-react';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import axiosInstance from '../utils/axiosInstance';
import { useDarkMode } from '../context/DarkModeContext';

const number = (value) => new Intl.NumberFormat('en-US').format(Number(value || 0));
const money = (value) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 }).format(Number(value || 0));
const duration = (seconds) => {
  if (!seconds) return '—';
  if (seconds < 60) return `${seconds}s`;
  if (seconds < 3600) return `${Math.round(seconds / 60)}m`;
  return `${(seconds / 3600).toFixed(1)}h`;
};

export default function PaymentAnalytics() {
  const { darkMode } = useDarkMode();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axiosInstance.get('/api/admin/analytics/payment-funnel');
      setData(response.data?.data || null);
    } catch (requestError) {
      setError(requestError.response?.data?.error || 'Payment analytics could not be loaded.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);
  useEffect(() => {
    const timer = window.setInterval(load, 60000);
    return () => window.clearInterval(timer);
  }, [load]);

  const chart = useMemo(() => (data?.hourly || []).map((row) => ({
    ...row,
    label: new Date(row.hour).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  })), [data]);

  const card = darkMode ? 'border-gray-700 bg-gray-800 text-white' : 'border-gray-200 bg-white text-gray-900';
  const muted = darkMode ? 'text-gray-400' : 'text-gray-500';
  const metrics = data?.metrics || {};
  const maxFunnel = Math.max(1, ...(data?.funnel || []).map((step) => step.value));

  const cards = [
    ['Success rate', `${metrics.successRate || 0}%`, `${number(metrics.successfulPayments)} successful payments`, TrendingUp, 'text-emerald-600 bg-emerald-100'],
    ['Abandoned', number(metrics.abandonedPayments), 'Expired or cancelled', ShoppingCart, 'text-amber-600 bg-amber-100'],
    ['Average order value', money(metrics.averageOrderValue), 'Successful payments', CreditCard, 'text-blue-600 bg-blue-100'],
    ['Processing time', duration(metrics.averageProcessingSeconds), 'Created to confirmed', Clock3, 'text-purple-600 bg-purple-100'],
    ['Correction rate', `${metrics.correctionRate || 0}%`, 'Under/overpayment corrections', Activity, 'text-rose-600 bg-rose-100'],
    ['Repeat wallet usage', `${metrics.repeatWalletPaymentRate || 0}%`, `${number(metrics.repeatWallets)} repeat wallets`, Repeat2, 'text-cyan-600 bg-cyan-100']
  ];

  return <div className="space-y-5">
    <section className="flex flex-wrap items-center justify-between gap-4 py-2">
      <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Payment funnel</h1>
      <div className="flex items-center gap-3"><div className={`rounded-xl border px-4 py-2 text-xs ${card}`}><span className={`block ${muted}`}>Window</span><strong>Last 24 hours</strong></div><button onClick={load} disabled={loading} className="flex items-center gap-2 rounded-xl bg-purple-600 px-4 py-3 text-sm font-semibold text-white hover:bg-purple-500 disabled:opacity-60"><RefreshCw size={16} className={loading ? 'animate-spin' : ''}/>Refresh</button></div>
    </section>

    {error && <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"><AlertCircle size={18}/>{error}</div>}
    {!error && data?.dataCoverage?.impressionLimitation && <div className={`flex items-start gap-3 rounded-xl border p-4 text-sm ${darkMode ? 'border-amber-800 bg-amber-950/30 text-amber-200' : 'border-amber-200 bg-amber-50 text-amber-800'}`}><AlertCircle size={18} className="mt-0.5 shrink-0"/><div><strong className="block">Impression coverage</strong><span>{data.dataCoverage.impressionLimitation}</span></div></div>}

    {loading && !data ? <div className="grid place-items-center py-28"><div className="h-10 w-10 animate-spin rounded-full border-b-2 border-purple-600"/></div> : data && <>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{cards.map(([label, value, detail, Icon, accent]) => <article key={label} className={`rounded-xl border p-5 ${card}`}><div className="flex items-center justify-between"><span className={`text-xs font-semibold uppercase tracking-wide ${muted}`}>{label}</span><span className={`rounded-lg p-2 ${accent}`}><Icon size={18}/></span></div><strong className="mt-4 block text-2xl">{value}</strong><span className={`mt-1 block text-xs ${muted}`}>{detail}</span></article>)}</div>

      <div className="grid gap-5 xl:grid-cols-5">
        <section className={`rounded-xl border p-5 xl:col-span-2 ${card}`}><div className="mb-5"><h2 className="font-semibold">24-hour funnel</h2><p className={`text-xs ${muted}`}>Server-observable checkout progression</p></div><div className="space-y-5">{(data.funnel || []).map((step, index) => <div key={step.key}><div className="mb-2 flex items-center justify-between text-sm"><span>{step.label}</span><strong>{number(step.value)}</strong></div><div className={`h-3 overflow-hidden rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}><div className="h-full rounded-full bg-gradient-to-r from-purple-600 to-indigo-400" style={{ width: `${Math.max(step.value ? 4 : 0, (step.value / maxFunnel) * 100)}%` }}/></div>{index > 0 && <small className={muted}>{data.funnel[index - 1].value ? ((step.value / data.funnel[index - 1].value) * 100).toFixed(1) : '0.0'}% from previous step</small>}</div>)}</div></section>
        <section className={`rounded-xl border p-5 xl:col-span-3 ${card}`}><div className="mb-4"><h2 className="font-semibold">Checkout activity</h2><p className={`text-xs ${muted}`}>Starts and outcomes by hour</p></div><div className="h-72"><ResponsiveContainer width="100%" height="100%"><AreaChart data={chart}><CartesianGrid vertical={false} strokeDasharray="4 6" stroke={darkMode ? '#374151' : '#e5e7eb'}/><XAxis dataKey="label" interval={3} axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 11 }}/><YAxis allowDecimals={false} axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 11 }}/><Tooltip/><Area type="monotone" dataKey="starts" name="Checkout starts" stroke="#8b5cf6" fill="#8b5cf633" strokeWidth={2}/><Area type="monotone" dataKey="successful" name="Successful" stroke="#10b981" fill="#10b98122" strokeWidth={2}/></AreaChart></ResponsiveContainer></div></section>
      </div>

      <div className="grid gap-5 xl:grid-cols-5"><section className={`rounded-xl border p-5 xl:col-span-3 ${card}`}><div className="mb-4"><h2 className="font-semibold">Failure reasons</h2><p className={`text-xs ${muted}`}>Failed, expired, and cancelled checkouts</p></div>{!data.failureReasons?.length ? <div className={`flex items-center gap-2 py-10 text-sm ${muted}`}><CheckCircle2 size={18} className="text-emerald-500"/>No failures recorded in this window.</div> : <div className="divide-y divide-gray-200/20">{data.failureReasons.map((item) => <div key={item.reason} className="flex items-center gap-4 py-3"><span className="min-w-0 flex-1 truncate text-sm">{item.reason}</span><span className={muted}>{item.share}%</span><strong className="w-8 text-right">{item.count}</strong></div>)}</div>}</section><section className={`rounded-xl border p-5 xl:col-span-2 ${card}`}><div className="flex items-center gap-3"><span className="rounded-lg bg-cyan-100 p-2 text-cyan-600"><WalletCards size={18}/></span><div><h2 className="font-semibold">Wallet retention</h2><p className={`text-xs ${muted}`}>Successful payments with sender data</p></div></div><dl className="mt-5 space-y-4 text-sm"><div className="flex justify-between"><dt className={muted}>Unique paying wallets</dt><dd className="font-semibold">{number(metrics.uniquePayingWallets)}</dd></div><div className="flex justify-between"><dt className={muted}>Repeat wallets</dt><dd className="font-semibold">{number(metrics.repeatWallets)}</dd></div><div className="flex justify-between"><dt className={muted}>Wallet data coverage</dt><dd className="font-semibold">{data.dataCoverage?.walletCoverage || 0}%</dd></div></dl><p className={`mt-5 border-t border-gray-200/20 pt-4 text-xs ${muted}`}>Last updated {new Date(data.generatedAt).toLocaleString()} · refreshes every minute</p></section></div>
    </>}
  </div>;
}
