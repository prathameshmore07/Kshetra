import React, { useState, useEffect } from 'react';
import { useEvent } from '../../context/EventContext';
import { StatusDot } from '../common/StatusIndicator';
import { X, ShieldAlert, Phone, HelpCircle, UserCheck, AlertTriangle } from 'lucide-react';

export function EmergencyModal() {
  const {
    emergencyModalOpen,
    setEmergencyModalOpen,
    cachedContacts,
    submitFrictionReport,
    zones,
  } = useEvent();

  const [activeTier, setActiveTier] = useState('tier1'); // 'tier1' | 'tier2' | 'tier3'
  const [tier2Note, setTier2Note] = useState('');
  const [tier2ZoneId, setTier2ZoneId] = useState(zones[0]?.id || 'zone-main-stage');
  const [tier2Result, setTier2Result] = useState(null);
  const [tier3Confirmed, setTier3Confirmed] = useState(false);

  // Escape key to close
  useEffect(() => {
    if (!emergencyModalOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [emergencyModalOpen]);

  if (!emergencyModalOpen) return null;

  const handleClose = () => {
    setEmergencyModalOpen(false);
    setActiveTier('tier1');
    setTier2Result(null);
    setTier3Confirmed(false);
    setTier2Note('');
  };

  const handleTier2Submit = (e) => {
    e.preventDefault();
    const res = submitFrictionReport({
      category: 'medical',
      zoneId: tier2ZoneId,
      customNote: tier2Note || 'Private assistance requested (Sensory/Mobility/Personal Safety)',
      isPrivateEmergency: true,
      reporterType: 'attendee',
    });
    setTier2Result(res);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="emergency-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 animate-in fade-in duration-100"
    >
      <div className="bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 w-full max-w-xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-red-600 shrink-0" />
            <h2 id="emergency-modal-title" className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              Safety &amp; Emergency Assistance
            </h2>
          </div>
          <button
            onClick={handleClose}
            aria-label="Close emergency modal"
            className="p-2 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tier Tabs (Accessible Tablist) */}
        <div role="tablist" aria-label="Emergency Tiers" className="grid grid-cols-3 border-b border-zinc-200 dark:border-zinc-800 text-xs">
          <button
            role="tab"
            aria-selected={activeTier === 'tier1'}
            onClick={() => setActiveTier('tier1')}
            className={`py-3 px-3 text-center border-b-2 transition-colors min-h-[44px] flex items-center justify-center ${
              activeTier === 'tier1'
                ? 'border-zinc-900 dark:border-zinc-100 font-semibold text-zinc-900 dark:text-zinc-100 bg-zinc-50 dark:bg-zinc-800/50'
                : 'border-transparent text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100'
            }`}
          >
            Tier 1: Guidance
          </button>
          <button
            role="tab"
            aria-selected={activeTier === 'tier2'}
            onClick={() => setActiveTier('tier2')}
            className={`py-3 px-3 text-center border-b-2 transition-colors min-h-[44px] flex items-center justify-center ${
              activeTier === 'tier2'
                ? 'border-zinc-900 dark:border-zinc-100 font-semibold text-zinc-900 dark:text-zinc-100 bg-zinc-50 dark:bg-zinc-800/50'
                : 'border-transparent text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100'
            }`}
          >
            Tier 2: Private Request
          </button>
          <button
            role="tab"
            aria-selected={activeTier === 'tier3'}
            onClick={() => setActiveTier('tier3')}
            className={`py-3 px-3 text-center border-b-2 transition-colors min-h-[44px] flex items-center justify-center ${
              activeTier === 'tier3'
                ? 'border-red-600 font-semibold text-red-700 dark:text-red-400 bg-red-50/40 dark:bg-red-950/20'
                : 'border-transparent text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100'
            }`}
          >
            Tier 3: Escalation
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4">
          {/* TIER 1: GUIDANCE */}
          {activeTier === 'tier1' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 mb-1">
                  On-Site Emergency &amp; Care Stations
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  Direct physical locations with trained medical &amp; security personnel:
                </p>
              </div>

              <div className="space-y-2">
                <div tabIndex={0} className="p-3 border border-zinc-200 dark:border-zinc-800 border-l-[3px] border-l-[#16a34a] focus-visible:ring-2 focus-visible:ring-zinc-900">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                      Medical Tent &amp; First Aid Hub
                    </span>
                    <span className="text-[11px] text-zinc-500">2 min walk • Ground Floor</span>
                  </div>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    Stationed with emergency paramedics, AED defibrillator, and oxygen support. Next to Skywalk East.
                  </p>
                </div>

                <div tabIndex={0} className="p-3 border border-zinc-200 dark:border-zinc-800 border-l-[3px] border-l-[#16a34a] focus-visible:ring-2 focus-visible:ring-zinc-900">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                      Quiet Room (Zen Haven)
                    </span>
                    <span className="text-[11px] text-zinc-500">3 min walk • West Corridor</span>
                  </div>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    Sensory regulation sanctuary for neurodivergent attendees or panic decompression. Dimmed, silent (&lt; 38 dB).
                  </p>
                </div>

                <div tabIndex={0} className="p-3 border border-zinc-200 dark:border-zinc-800 border-l-[3px] border-l-[#16a34a] focus-visible:ring-2 focus-visible:ring-zinc-900">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                      Central Help Desk &amp; Security
                    </span>
                    <span className="text-[11px] text-zinc-500">1 min walk • Grand Pavilion Foyer</span>
                  </div>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    Event marshals, wheelchair assistance dispatch, and lost attendee reunion point.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TIER 2: PRIVATE ASSISTANCE REQUEST */}
          {activeTier === 'tier2' && (
            <div className="space-y-4">
              <div className="border border-zinc-200 dark:border-zinc-800 p-3 bg-zinc-50 dark:bg-zinc-800/30">
                <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 block mb-0.5">
                  Private &amp; Confidential Dispatch
                </span>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  Sent directly to the lead organizer triage screen only. Never posted on public feeds or map overlays.
                </p>
              </div>

              {tier2Result ? (
                <div className="p-5 border border-zinc-200 dark:border-zinc-800 text-center space-y-2.5">
                  <span className="font-mono text-xs px-2 py-0.5 border border-zinc-300 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-semibold inline-block">
                    Ticket: {tier2Result.ticketId}
                  </span>
                  <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 block">
                    Private Request Dispatched to Command Desk
                  </span>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400">
                    A floor marshal or accessibility escort has been alerted for {tier2Result.zoneName}.
                  </p>
                  <button
                    onClick={handleClose}
                    className="mt-3 px-5 py-2.5 text-xs bg-zinc-900 text-zinc-100 dark:bg-zinc-100 dark:text-zinc-900 font-semibold min-h-[44px]"
                  >
                    Done
                  </button>
                </div>
              ) : (
                <form onSubmit={handleTier2Submit} className="space-y-3">
                  <div>
                    <label htmlFor="tier2-zone" className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                      Your Current Location
                    </label>
                    <select
                      id="tier2-zone"
                      value={tier2ZoneId}
                      onChange={(e) => setTier2ZoneId(e.target.value)}
                      className="w-full text-xs p-2.5 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 min-h-[44px]"
                    >
                      {zones.map(z => (
                        <option key={z.id} value={z.id}>{z.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="tier2-note" className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                      Describe What You Need (Optional)
                    </label>
                    <textarea
                      id="tier2-note"
                      value={tier2Note}
                      onChange={(e) => setTier2Note(e.target.value)}
                      placeholder="e.g. Wheelchair battery depleted, sensory overload escort needed, personal safety escort"
                      rows={3}
                      className="w-full text-xs p-2.5 bg-transparent border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 text-xs bg-zinc-900 text-zinc-100 dark:bg-zinc-100 dark:text-zinc-900 font-semibold hover:bg-zinc-800 min-h-[44px]"
                  >
                    Transmit Private Request
                  </button>
                </form>
              )}
            </div>
          )}

          {/* TIER 3: EMERGENCY ESCALATION */}
          {activeTier === 'tier3' && (
            <div className="space-y-4">
              {/* Mandatory Notice */}
              <div className="p-3 border border-red-300 dark:border-red-900 border-l-[3px] border-l-[#dc2626] bg-red-50/30 dark:bg-red-950/20">
                <span className="text-xs font-semibold text-red-700 dark:text-red-400 block mb-1">
                  Notice: In-Venue Support Only
                </span>
                <p className="text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed">
                  Kshetra is an in-venue coordination tool and <strong>is not a replacement for official local emergency services (112 / 911)</strong>. If you are experiencing a life-threatening medical event, fire, or acute crime, dial official services immediately.
                </p>
              </div>

              {!tier3Confirmed ? (
                <div className="p-5 border border-zinc-200 dark:border-zinc-800 text-center space-y-3">
                  <AlertTriangle className="w-6 h-6 text-red-600 mx-auto" />
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-sm mx-auto">
                    Confirm to access cached offline direct emergency lines and alert on-site command.
                  </p>
                  <button
                    onClick={() => setTier3Confirmed(true)}
                    className="px-5 py-2.5 text-xs border border-red-600 text-red-600 dark:text-red-400 font-semibold hover:bg-red-50 dark:hover:bg-red-950/30 min-h-[44px]"
                  >
                    Confirm Escalation &amp; View Numbers
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 mb-1">
                    Cached Offline Emergency Contacts:
                  </div>

                  {cachedContacts.map((contact, i) => (
                    <div
                      key={i}
                      className="p-3 border border-zinc-200 dark:border-zinc-800 flex items-center justify-between gap-2"
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 truncate">
                            {contact.name}
                          </span>
                          <span className="text-[10px] px-1.5 py-0.5 border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400">
                            {contact.badge}
                          </span>
                        </div>
                        <span className="text-xs text-zinc-500 dark:text-zinc-400 font-mono block mt-0.5">
                          {contact.phone}
                        </span>
                      </div>
                      <a
                        href={`tel:${contact.phone.replace(/[^0-9+]/g, '')}`}
                        className="px-4 py-2 text-xs border border-zinc-900 dark:border-zinc-100 font-semibold text-zinc-900 dark:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 min-h-[44px] flex items-center justify-center shrink-0"
                      >
                        Call
                      </a>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-zinc-200 dark:border-zinc-800 flex justify-end">
          <button
            onClick={handleClose}
            className="px-4 py-2 text-xs text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 min-h-[44px]"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
