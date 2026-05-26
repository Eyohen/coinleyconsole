// src/pages/TransactionDetail.jsx
/* eslint-disable react/prop-types */
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
  cancelled: 'bg-gray-100 text-gray-700',
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

  const [showConfirm, setShowConfirm] = useState(false);
  const [forcing, setForcing] = useState(false);
  const [toast, setToast] = useState(null);

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
      fetchPayment();
    }
  };

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
  const isExpired = status === 'expired';

  return (
    <div className="p-6 max-w-5xl mx-auto">
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
