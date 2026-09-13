import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { X, Lock, User, Key, Check, AlertCircle } from 'lucide-react';

export function LoginModal() {
  const {
    authModalOpen,
    authModalRole,
    closeLogin,
    loginAttendee,
    loginOrganizer,
    preapprovedStaff,
  } = useAuth();

  const [mode, setMode] = useState(authModalRole || 'attendee');
  const [attendeeName, setAttendeeName] = useState('Arjun Mehta');
  const [attendeeCode, setAttendeeCode] = useState('MFC-2026');
  const [organizerEmail, setOrganizerEmail] = useState('');
  const [organizerPassword, setOrganizerPassword] = useState('');
  const [error, setError] = useState(null);

  // Sync mode with trigger role
  useEffect(() => {
    if (authModalRole) {
      setMode(authModalRole);
      setError(null);
    }
  }, [authModalRole]);

  // Escape key to close
  useEffect(() => {
    if (!authModalOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        closeLogin();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [authModalOpen, closeLogin]);

  if (!authModalOpen) return null;

  const handleAttendeeSubmit = (e) => {
    e.preventDefault();
    loginAttendee({
      name: attendeeName,
      checkInCode: attendeeCode,
    });
  };

  const handleOrganizerSubmit = (e) => {
    e.preventDefault();
    setError(null);
    const result = loginOrganizer({
      email: organizerEmail,
      password: organizerPassword,
    });
    if (!result.success) {
      setError(result.error);
    }
  };

  const handleQuickFillOrganizer = (staff) => {
    setOrganizerEmail(staff.email);
    setOrganizerPassword(staff.password);
    setError(null);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 animate-in fade-in duration-100"
    >
      <div className="bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 w-full max-w-md p-5 max-h-[92vh] overflow-y-auto space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-zinc-200 dark:border-zinc-800">
          <div>
            <span className="text-[10px] font-mono uppercase text-zinc-500 tracking-wider block">
              Kshetra Access
            </span>
            <h2 id="auth-modal-title" className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              {mode === 'attendee' ? 'Attendee Check-In' : 'Organizer Authentication'}
            </h2>
          </div>
          <button
            onClick={closeLogin}
            aria-label="Close modal"
            className="p-2 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Role Switcher Tabs */}
        <div role="tablist" aria-label="Authentication Type" className="grid grid-cols-2 border border-zinc-200 dark:border-zinc-800 text-xs">
          <button
            role="tab"
            aria-selected={mode === 'attendee'}
            onClick={() => { setMode('attendee'); setError(null); }}
            className={`py-2.5 px-3 text-center transition-colors min-h-[44px] flex items-center justify-center font-medium ${
              mode === 'attendee'
                ? 'bg-zinc-900 text-zinc-50 dark:bg-zinc-100 dark:text-zinc-900 font-semibold'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
            }`}
          >
            Attendee
          </button>
          <button
            role="tab"
            aria-selected={mode === 'organizer'}
            onClick={() => { setMode('organizer'); setError(null); }}
            className={`py-2.5 px-3 text-center transition-colors min-h-[44px] flex items-center justify-center font-medium ${
              mode === 'organizer'
                ? 'bg-zinc-900 text-zinc-50 dark:bg-zinc-100 dark:text-zinc-900 font-semibold'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
            }`}
          >
            Organizer / Staff
          </button>
        </div>

        {/* ATTENDEE FORM */}
        {mode === 'attendee' && (
          <form onSubmit={handleAttendeeSubmit} className="space-y-3.5">
            <div>
              <label htmlFor="att-name" className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                Your Name or Handle
              </label>
              <input
                id="att-name"
                type="text"
                required
                value={attendeeName}
                onChange={(e) => setAttendeeName(e.target.value)}
                placeholder="e.g. Arjun Mehta"
                className="w-full text-xs p-2.5 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 min-h-[44px]"
              />
            </div>

            <div>
              <label htmlFor="att-code" className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                Event Pass or Check-In Code
              </label>
              <input
                id="att-code"
                type="text"
                value={attendeeCode}
                onChange={(e) => setAttendeeCode(e.target.value)}
                placeholder="e.g. MFC-2026"
                className="w-full text-xs p-2.5 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 min-h-[44px] font-mono"
              />
              <span className="text-[11px] text-zinc-500 dark:text-zinc-400 block mt-1">
                Default guest pass code for Mumbai Future Commons: <code>MFC-2026</code>
              </span>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 text-xs bg-zinc-900 text-zinc-50 dark:bg-zinc-100 dark:text-zinc-900 font-semibold hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors min-h-[44px] flex items-center justify-center"
            >
              Enter Event Experience
            </button>
          </form>
        )}

        {/* ORGANIZER FORM */}
        {mode === 'organizer' && (
          <div className="space-y-3.5">
            <form onSubmit={handleOrganizerSubmit} className="space-y-3">
              {error && (
                <div role="alert" className="p-2.5 border border-red-300 dark:border-red-900 bg-red-50 dark:bg-red-950/30 text-xs text-red-700 dark:text-red-400 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <div>
                <label htmlFor="org-email" className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  Staff Email Address
                </label>
                <input
                  id="org-email"
                  type="email"
                  required
                  value={organizerEmail}
                  onChange={(e) => setOrganizerEmail(e.target.value)}
                  placeholder="e.g. anita@mumbaifuture.org"
                  className="w-full text-xs p-2.5 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 min-h-[44px]"
                />
              </div>

              <div>
                <label htmlFor="org-password" className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  Password
                </label>
                <input
                  id="org-password"
                  type="password"
                  required
                  value={organizerPassword}
                  onChange={(e) => setOrganizerPassword(e.target.value)}
                  placeholder="Password (e.g. ops or admin)"
                  className="w-full text-xs p-2.5 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 min-h-[44px]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 text-xs bg-zinc-900 text-zinc-50 dark:bg-zinc-100 dark:text-zinc-900 font-semibold hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors min-h-[44px] flex items-center justify-center"
              >
                Access Command Center
              </button>
            </form>

            {/* Pre-Approved Staff 1-Click Fill Helper for Evaluators */}
            <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800">
              <span className="text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 block mb-1.5">
                Quick 1-Click Staff Fill (Demo Accounts):
              </span>
              <div className="grid grid-cols-2 gap-1.5 text-[11px]">
                {preapprovedStaff.slice(0, 4).map(s => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => handleQuickFillOrganizer(s)}
                    className="p-1.5 text-left border border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600 bg-zinc-50 dark:bg-zinc-800/40 text-zinc-700 dark:text-zinc-300 truncate"
                  >
                    <span className="font-semibold block truncate">{s.name}</span>
                    <span className="text-[10px] text-zinc-400 block truncate">{s.staffRole}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
