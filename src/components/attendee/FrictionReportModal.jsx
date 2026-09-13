import React, { useState, useEffect } from 'react';
import { useEvent } from '../../context/EventContext';
import { CATEGORY_DEFINITIONS } from '../../utils/classifier';
import { StatusDot } from '../common/StatusIndicator';
import { X, Check, Camera, AlertTriangle, Clock, Users, Accessibility, Compass, HeartPulse } from 'lucide-react';

const ICONS = {
  blocked_path: AlertTriangle,
  long_queue: Clock,
  crowded_zone: Users,
  accessibility_issue: Accessibility,
  lost: Compass,
  medical: HeartPulse,
};

export function FrictionReportModal() {
  const {
    reportModalOpen,
    setReportModalOpen,
    reportModalZoneId,
    zones,
    submitFrictionReport,
  } = useEvent();

  const [selectedCategory, setSelectedCategory] = useState('blocked_path');
  const [selectedZoneId, setSelectedZoneId] = useState(() => reportModalZoneId || zones[0]?.id || 'zone-main-stage');
  const [customNote, setCustomNote] = useState('');
  const [photoPreview, setPhotoPreview] = useState(null);
  const [submittedResult, setSubmittedResult] = useState(null);

  // Sync zone ID if passed from outside
  useEffect(() => {
    if (reportModalZoneId) {
      setSelectedZoneId(reportModalZoneId);
    }
  }, [reportModalZoneId]);

  // Handle Escape key to close modal
  useEffect(() => {
    if (!reportModalOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [reportModalOpen]);

  if (!reportModalOpen) return null;

  const handleClose = () => {
    setReportModalOpen(false);
    setSubmittedResult(null);
    setCustomNote('');
    setPhotoPreview(null);
  };

  const handleQuickSubmit = (categoryOverride = null) => {
    const categoryToUse = categoryOverride || selectedCategory;
    const targetZoneId = selectedZoneId || reportModalZoneId || zones[0].id;

    const result = submitFrictionReport({
      category: categoryToUse,
      zoneId: targetZoneId,
      customNote,
      photoPreview,
      reporterType: 'attendee',
      isPrivateEmergency: false,
    });

    setSubmittedResult(result);
  };

  const simulatePhotoUpload = () => {
    setPhotoPreview('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="60" viewBox="0 0 100 60"><rect width="100" height="60" fill="%2327272a"/><text x="50" y="35" fill="%23a1a1aa" font-size="10" text-anchor="middle">Photo Attached</text></svg>');
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="report-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 animate-in fade-in duration-100"
    >
      <div className="bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 w-full max-w-lg p-5 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-zinc-200 dark:border-zinc-800">
          <div>
            <h2 id="report-modal-title" className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              Report Venue Friction
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              5-second submission to floor marshals and live venue status
            </p>
          </div>
          <button
            onClick={handleClose}
            aria-label="Close modal"
            className="p-2 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {submittedResult ? (
          /* Confirmation Screen with Real Ticket ID */
          <div className="py-6 text-center space-y-3">
            <div className="inline-flex items-center justify-center w-10 h-10 border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800">
              <Check className="w-5 h-5 text-emerald-600" />
            </div>

            <div>
              <span className="font-mono text-xs px-2 py-0.5 border border-zinc-300 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-semibold inline-block mb-1">
                Ticket: {submittedResult.ticketId}
              </span>
              <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                {submittedResult.merged ? 'Correlated with Active Incident' : 'Incident Dispatched to Operations'}
              </h3>
            </div>

            <p className="text-xs text-zinc-600 dark:text-zinc-400 max-w-xs mx-auto leading-relaxed">
              {submittedResult.merged
                ? `Your report in ${submittedResult.zoneName} has been merged into active ticket ${submittedResult.ticketId}. Total affected attendees: ${submittedResult.affectedCount}.`
                : `New ticket ${submittedResult.ticketId} dispatched for ${submittedResult.zoneName}. Nearby floor marshals alerted.`}
            </p>

            <div className="pt-3">
              <button
                onClick={handleClose}
                className="px-6 py-2.5 text-xs bg-zinc-900 text-zinc-50 dark:bg-zinc-100 dark:text-zinc-900 font-semibold min-h-[44px] min-w-[100px]"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          /* 5-Second Tap Flow */
          <div className="py-4 space-y-4">
            {/* 1. Category 1-Tap Buttons */}
            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-2">
                1. Select Issue Category (1 Tap)
              </label>
              <div role="radiogroup" aria-label="Friction Categories" className="grid grid-cols-2 gap-2">
                {Object.values(CATEGORY_DEFINITIONS).map(cat => {
                  const Icon = ICONS[cat.id] || AlertTriangle;
                  const isSelected = selectedCategory === cat.id;

                  return (
                    <button
                      key={cat.id}
                      type="button"
                      role="radio"
                      aria-checked={isSelected}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`flex items-center gap-2 p-3 text-left border text-xs transition-colors min-h-[48px] focus-visible:ring-2 focus-visible:ring-zinc-900 dark:focus-visible:ring-zinc-100 ${
                        isSelected
                          ? 'border-zinc-900 dark:border-zinc-100 bg-zinc-100 dark:bg-zinc-800 font-semibold'
                          : 'border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:border-zinc-400'
                      }`}
                    >
                      <Icon className="w-4 h-4 text-zinc-600 dark:text-zinc-400 shrink-0" />
                      <span className="truncate">{cat.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Zone Location */}
            <div>
              <label htmlFor="report-zone-select" className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                2. Location Zone
              </label>
              <select
                id="report-zone-select"
                value={selectedZoneId}
                onChange={(e) => setSelectedZoneId(e.target.value)}
                className="w-full text-xs p-2.5 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 min-h-[44px]"
              >
                {zones.map(z => (
                  <option key={z.id} value={z.id}>
                    {z.name} ({z.status.toUpperCase()})
                  </option>
                ))}
              </select>
            </div>

            {/* 3. Optional Details / Photo */}
            <div className="space-y-2 pt-1 border-t border-zinc-100 dark:border-zinc-800">
              <div className="flex items-center justify-between">
                <label htmlFor="report-notes" className="text-xs text-zinc-600 dark:text-zinc-400 font-semibold">
                  3. Optional note or photo
                </label>
                {!photoPreview ? (
                  <button
                    type="button"
                    onClick={simulatePhotoUpload}
                    className="inline-flex items-center gap-1 text-[11px] text-zinc-600 dark:text-zinc-400 hover:underline min-h-[32px] px-1"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span>Attach Photo</span>
                  </button>
                ) : (
                  <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                    ✓ Photo attached
                  </span>
                )}
              </div>
              <input
                id="report-notes"
                type="text"
                value={customNote}
                onChange={(e) => setCustomNote(e.target.value)}
                placeholder="e.g. Crate on ramp, 20m queue spilling into corridor"
                className="w-full text-xs p-2.5 bg-transparent border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 min-h-[44px]"
                maxLength={100}
              />
            </div>

            {/* Submit Action */}
            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 text-xs text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 min-h-[44px]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleQuickSubmit()}
                className="px-5 py-2.5 text-xs bg-zinc-900 text-zinc-50 dark:bg-zinc-100 dark:text-zinc-900 font-semibold hover:bg-zinc-800 dark:hover:bg-zinc-200 min-h-[44px]"
              >
                Submit Signal
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
