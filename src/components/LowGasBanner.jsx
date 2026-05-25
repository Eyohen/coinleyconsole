// src/components/LowGasBanner.jsx
//
// Persistent in-app warning when any sweeper wallet is below its threshold.
// Renders ONLY when the /api/admin/sweep/balances summary reports
// warning/critical/empty/unknown chains. Reads severity straight from the
// server response — no client-side threshold logic, so the banner state
// always matches what the gasMonitor cron is alerting on.

import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, AlertOctagon, X } from 'lucide-react';
import axios from 'axios';
import { URL } from '../url';
import { useDarkMode } from '../context/DarkModeContext';

const POLL_INTERVAL_MS = 60_000; // refresh once a minute when banner is mounted

const SEVERITY_RANK = { healthy: 0, unknown: 1, warning: 2, critical: 3, empty: 4 };

const LowGasBanner = () => {
  const { darkMode } = useDarkMode();
  const [summary, setSummary] = useState(null);
  const [balances, setBalances] = useState([]);
  const [dismissed, setDismissed] = useState(false);

  const fetchHealth = useCallback(async () => {
    try {
      const res = await axios.get(`${URL}/api/admin/sweep/balances`, {
        headers: { Authorization: `Bearer ${sessionStorage.getItem('access_token')}` }
      });
      if (res.data?.success) {
        setSummary(res.data.summary || null);
        setBalances(res.data.balances || []);
      }
    } catch (err) {
      // Silent — banner just won't render. Sweep Management page surfaces the error.
      console.warn('[LowGasBanner] fetch failed:', err.message);
    }
  }, []);

  useEffect(() => {
    fetchHealth();
    const id = setInterval(fetchHealth, POLL_INTERVAL_MS);
    return () => clearInterval(id);
  }, [fetchHealth]);

  // Reset dismissal whenever a *worse* severity appears, so a new incident
  // re-shows the banner even if a previous warning was dismissed.
  const worstSeverity = balances.reduce((worst, b) => {
    const rank = SEVERITY_RANK[b.severity] ?? 0;
    return rank > SEVERITY_RANK[worst] ? b.severity : worst;
  }, 'healthy');

  useEffect(() => {
    const lastDismissed = sessionStorage.getItem('lowGasBanner.dismissedAt');
    const lastWorst = sessionStorage.getItem('lowGasBanner.dismissedAtWorst');
    if (lastDismissed && lastWorst === worstSeverity) {
      setDismissed(true);
    } else {
      setDismissed(false);
    }
  }, [worstSeverity]);

  if (!summary) return null;

  const issueCount = (summary.critical || 0) + (summary.empty || 0) + (summary.warning || 0) + (summary.unknown || 0);
  if (issueCount === 0) return null;
  if (dismissed) return null;

  const affected = balances.filter(b =>
    ['warning', 'critical', 'empty', 'unknown'].includes(b.severity)
  );

  const isCritical = (summary.critical || 0) + (summary.empty || 0) > 0;
  const tone = isCritical
    ? { bg: 'bg-red-50', border: 'border-red-300', text: 'text-red-900', icon: <AlertOctagon className="text-red-600" size={22} /> }
    : { bg: 'bg-yellow-50', border: 'border-yellow-300', text: 'text-yellow-900', icon: <AlertTriangle className="text-yellow-600" size={22} /> };

  const darkTone = darkMode
    ? (isCritical
      ? 'bg-red-950/40 border-red-900/60 text-red-200'
      : 'bg-yellow-950/40 border-yellow-900/60 text-yellow-200')
    : `${tone.bg} ${tone.border} ${tone.text}`;

  const handleDismiss = () => {
    setDismissed(true);
    sessionStorage.setItem('lowGasBanner.dismissedAt', new Date().toISOString());
    sessionStorage.setItem('lowGasBanner.dismissedAtWorst', worstSeverity);
  };

  return (
    <div className={`mb-6 border ${darkTone} rounded-lg p-4 flex items-start gap-3`}>
      <div className="flex-shrink-0 mt-0.5">{tone.icon}</div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm">
          {isCritical ? 'Sweeper wallet needs attention' : 'Sweeper wallet running low'}
        </p>
        <p className="text-sm mt-1 opacity-90">
          {affected.length} chain{affected.length === 1 ? '' : 's'} below threshold:{' '}
          {affected.map((b, i) => (
            <span key={b.chainId}>
              <span className="font-medium">{b.name}</span>
              <span className="opacity-75"> ({b.severity}{b.balance != null ? `, ${parseFloat(b.balance).toFixed(4)} ${b.symbol}` : ''})</span>
              {i < affected.length - 1 ? ', ' : ''}
            </span>
          ))}
          .
        </p>
        <Link
          to="/sweep-management"
          className={`inline-block mt-2 text-sm font-semibold underline ${
            darkMode ? 'hover:opacity-80' : 'hover:opacity-70'
          }`}
        >
          View Sweep Management →
        </Link>
      </div>
      <button
        type="button"
        onClick={handleDismiss}
        className={`flex-shrink-0 ml-2 rounded p-1 ${
          darkMode ? 'hover:bg-white/10' : 'hover:bg-black/5'
        }`}
        aria-label="Dismiss"
        title="Dismiss until next incident"
      >
        <X size={18} />
      </button>
    </div>
  );
};

export default LowGasBanner;
