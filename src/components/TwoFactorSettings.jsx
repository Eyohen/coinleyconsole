// src/components/TwoFactorSettings.jsx
//
// Self-contained enable/disable UI for admin TOTP two-factor authentication.
// Compatible with Microsoft Authenticator, Google Authenticator, Authy or any other
// standard authenticator app — no Microsoft (or other third-party) credentials involved;
// the server generates and verifies the code itself.

import { useState, useEffect } from 'react';
import axios from 'axios';
import { RiShieldCheckLine, RiQrCodeLine } from 'react-icons/ri';
import { URL } from '../url';

const authHeaders = () => ({
  headers: { Authorization: `Bearer ${sessionStorage.getItem('access_token')}` }
});

const TwoFactorSettings = ({ darkMode }) => {
  const [step, setStep] = useState('idle'); // idle | enrolling | disabling
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState('');
  const [manualEntryKey, setManualEntryKey] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(null); // null = still loading

  useEffect(() => {
    let cancelled = false;
    axios.get(`${URL}/api/admin/2fa/status`, authHeaders())
      .then((res) => { if (!cancelled) setTwoFactorEnabled(!!res.data.enabled); })
      .catch(() => { if (!cancelled) setTwoFactorEnabled(false); });
    return () => { cancelled = true; };
  }, []);

  const startEnrollment = async () => {
    setError(''); setSuccess(''); setLoading(true);
    try {
      const res = await axios.post(`${URL}/api/admin/2fa/setup`, {}, authHeaders());
      setQrCodeDataUrl(res.data.qrCodeDataUrl);
      setManualEntryKey(res.data.manualEntryKey);
      setStep('enrolling');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to start setup. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const confirmEnrollment = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      await axios.post(`${URL}/api/admin/2fa/verify`, { code }, authHeaders());
      setSuccess('Two-factor authentication is now enabled.');
      setStep('idle');
      setCode('');
      setTwoFactorEnabled(true);
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const disable = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      await axios.post(`${URL}/api/admin/2fa/disable`, { password }, authHeaders());
      setSuccess('Two-factor authentication has been disabled.');
      setStep('idle');
      setPassword('');
      setTwoFactorEnabled(false);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to disable. Check your password and try again.');
    } finally {
      setLoading(false);
    }
  };

  const cardCls = `rounded-lg shadow-md p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`;
  const labelCls = `block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`;
  const inputCls = `block w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
    darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'
  }`;

  return (
    <div className={cardCls}>
      <h2 className={`text-xl font-semibold mb-2 flex items-center ${darkMode ? 'text-white' : 'text-gray-800'}`}>
        <RiShieldCheckLine className="mr-2 text-[#7042D2]" />
        Two-Factor Authentication
      </h2>
      <p className={`text-sm mb-6 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
        Adds a second step to admin login using an authenticator app (Microsoft Authenticator,
        Google Authenticator, Authy, or any other TOTP app). Nothing to configure with Microsoft
        or any third party — the code is generated and checked entirely by our own server.
      </p>

      {error && (
        <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-800">{error}</div>
      )}
      {success && (
        <div className="mb-4 rounded-md bg-green-50 p-3 text-sm text-green-800">{success}</div>
      )}

      {step === 'idle' && twoFactorEnabled === null && (
        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Loading...</p>
      )}
      {step === 'idle' && twoFactorEnabled !== null && (
        twoFactorEnabled ? (
          <div>
            <p className={`mb-4 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Two-factor authentication is <span className="font-semibold text-green-600">enabled</span> on this account.
            </p>
            <button
              onClick={() => setStep('disabling')}
              className="px-4 py-2 rounded-md border border-red-300 text-red-700 hover:bg-red-50 text-sm font-medium"
            >
              Disable two-factor authentication
            </button>
          </div>
        ) : (
          <div>
            <p className={`mb-4 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Two-factor authentication is <span className="font-semibold">not enabled</span> on this account.
            </p>
            <button
              onClick={startEnrollment}
              disabled={loading}
              className="px-4 py-2 rounded-md bg-[#7042D2] text-white text-sm font-medium hover:bg-opacity-90 disabled:opacity-50 flex items-center"
            >
              <RiQrCodeLine className="mr-2" />
              {loading ? 'Starting...' : 'Enable two-factor authentication'}
            </button>
          </div>
        )
      )}

      {step === 'enrolling' && (
        <form onSubmit={confirmEnrollment} className="space-y-4">
          <ol className={`list-decimal list-inside space-y-2 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            <li>Open Microsoft Authenticator (or Google Authenticator / Authy) on your phone.</li>
            <li>Add an account and scan the QR code below, or enter the key manually.</li>
            <li>Enter the 6-digit code it shows to confirm setup.</li>
          </ol>

          {qrCodeDataUrl && (
            <div className="flex justify-center py-2">
              <img src={qrCodeDataUrl} alt="Two-factor setup QR code" className="w-48 h-48" />
            </div>
          )}

          {manualEntryKey && (
            <div>
              <label className={labelCls}>Can't scan? Enter this key manually</label>
              <code className={`block text-xs p-2 rounded break-all ${darkMode ? 'bg-gray-900 text-gray-300' : 'bg-gray-100 text-gray-800'}`}>
                {manualEntryKey}
              </code>
            </div>
          )}

          <div>
            <label htmlFor="setup-code" className={labelCls}>Verification code</label>
            <input
              id="setup-code"
              type="text"
              inputMode="numeric"
              maxLength={6}
              required
              autoFocus
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              className={`${inputCls} text-center text-xl tracking-[0.4em]`}
              placeholder="000000"
            />
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading || code.length !== 6}
              className="px-4 py-2 rounded-md bg-[#7042D2] text-white text-sm font-medium hover:bg-opacity-90 disabled:opacity-50"
            >
              {loading ? 'Verifying...' : 'Confirm and enable'}
            </button>
            <button
              type="button"
              onClick={() => { setStep('idle'); setCode(''); setError(''); }}
              className={`px-4 py-2 rounded-md text-sm font-medium ${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {step === 'disabling' && (
        <form onSubmit={disable} className="space-y-4">
          <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Enter your current password to disable two-factor authentication.
          </p>
          <div>
            <label htmlFor="disable-password" className={labelCls}>Current password</label>
            <input
              id="disable-password"
              type="password"
              required
              autoFocus
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputCls}
            />
          </div>
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading || !password}
              className="px-4 py-2 rounded-md bg-red-600 text-white text-sm font-medium hover:bg-red-700 disabled:opacity-50"
            >
              {loading ? 'Disabling...' : 'Disable two-factor authentication'}
            </button>
            <button
              type="button"
              onClick={() => { setStep('idle'); setPassword(''); setError(''); }}
              className={`px-4 py-2 rounded-md text-sm font-medium ${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default TwoFactorSettings;
