import React, { useState, useEffect } from 'react';
import { useEvent } from '../../context/EventContext';
import { formatDuration } from '../../utils/classifier';
import { StatusDot, getStatusBorderClass } from '../common/StatusIndicator';
import {
  Clock,
  CheckCircle2,
  AlertTriangle,
  Send,
  Layers,
  Check,
} from 'lucide-react';

function IncidentCard({ incident }) {
  const {
    staff,
    acknowledgeIncident,
    assignStaffToIncident,
    resolveIncident,
  } = useEvent();

  // Real-time ticking stopwatch since detection
  const [elapsed, setElapsed] = useState(() => Date.now() - incident.detectedAt);
  const [resolveNotes, setResolveNotes] = useState('');
  const [isResolving, setIsResolving] = useState(false);

  useEffect(() => {
    if (incident.status === 'resolved') return;

    const interval = setInterval(() => {
      setElapsed(Date.now() - incident.detectedAt);
    }, 1000);

    return () => clearInterval(interval);
  }, [incident.detectedAt, incident.status]);

  const borderClass = getStatusBorderClass(
    incident.severity === 'high' ? 'red' : incident.category === 'crowded_zone' ? 'orange' : 'yellow'
  );

  return (
    <article
      tabIndex={0}
      aria-label={`Incident ticket ${incident.ticketId || incident.id}: ${incident.issueTitle}`}
      className={`p-4 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 ${borderClass} space-y-3 focus-visible:ring-2 focus-visible:ring-zinc-900 dark:focus-visible:ring-zinc-100`}
    >
      {/* Top Header: Category, Zone, Live Timer, Real Ticket ID */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-mono text-xs font-semibold px-2 py-0.5 border border-zinc-300 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100">
            {incident.ticketId || incident.id.slice(-4)}
          </span>

          {incident.isPrivateEmergency && (
            <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300 font-semibold">
              Confidential Private Request
            </span>
          )}

          <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
            {incident.issueTitle}
          </span>
          <span className="text-zinc-300 dark:text-zinc-700">|</span>
          <span className="text-xs text-zinc-600 dark:text-zinc-400">
            {incident.zoneName}
          </span>
        </div>

        {/* Live Stopwatch & Status */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center gap-1 text-xs font-mono text-zinc-600 dark:text-zinc-400">
            <Clock className="w-3.5 h-3.5 text-zinc-400" />
            <span>{incident.status === 'resolved' ? 'Resolved' : `${formatDuration(elapsed)} ago`}</span>
          </div>

          <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 font-semibold">
            {incident.status}
          </span>
        </div>
      </div>

      {/* Metric Badges: Real Affected Count & Transparent Confidence */}
      <div className="flex flex-wrap items-center gap-3 text-xs">
        <div className="flex items-center gap-1.5 text-zinc-700 dark:text-zinc-300">
          <span className="text-zinc-400">Affected Count:</span>
          <span className="font-semibold font-mono px-1.5 py-0.5 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700">
            {incident.affectedCount} attendee{incident.affectedCount > 1 ? 's' : ''}
          </span>
          {incident.sourceReportIds.length > 1 && (
            <span className="text-[10px] text-zinc-500 font-normal">
              ({incident.sourceReportIds.length} merged reports)
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5 text-zinc-700 dark:text-zinc-300">
          <span className="text-zinc-400">Confidence:</span>
          <span className="capitalize font-semibold font-mono px-1.5 py-0.5 border border-zinc-200 dark:border-zinc-700">
            {incident.confidence}
          </span>
          <span className="text-[10px] text-zinc-500">
            {incident.confidence === 'high' ? '(≥6 reports or verified)' : incident.confidence === 'medium' ? '(3–5 reports)' : '(1–2 reports)'}
          </span>
        </div>
      </div>

      {/* Suggested Operational Action */}
      <div className="p-2.5 bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-800 text-xs">
        <span className="font-semibold text-zinc-700 dark:text-zinc-300 block mb-0.5">
          Suggested Action:
        </span>
        <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
          {incident.suggestedAction}
        </p>
      </div>

      {/* Assignee & Operational Controls */}
      <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 flex flex-wrap items-center justify-between gap-3">
        {/* Staff Assignment */}
        <div className="flex items-center gap-2">
          <label htmlFor={`assign-staff-${incident.id}`} className="text-xs text-zinc-500 dark:text-zinc-400">
            Staff:
          </label>
          <select
            id={`assign-staff-${incident.id}`}
            value={incident.assignedStaffId || ''}
            onChange={(e) => assignStaffToIncident(incident.id, e.target.value)}
            disabled={incident.status === 'resolved'}
            className="text-xs p-2 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 disabled:opacity-50 min-h-[44px]"
          >
            <option value="">-- Assign Marshal --</option>
            {staff.map(s => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.role}) — {s.status}
              </option>
            ))}
          </select>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {incident.status === 'detected' && (
            <button
              onClick={() => acknowledgeIncident(incident.id)}
              className="px-4 py-2 text-xs border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 font-semibold min-h-[44px]"
            >
              Acknowledge
            </button>
          )}

          {incident.status !== 'resolved' && (
            !isResolving ? (
              <button
                onClick={() => setIsResolving(true)}
                className="px-4 py-2 text-xs bg-zinc-900 text-zinc-100 dark:bg-zinc-100 dark:text-zinc-900 font-semibold hover:bg-zinc-800 min-h-[44px]"
              >
                Resolve Incident
              </button>
            ) : (
              <div className="flex items-center gap-2 flex-wrap">
                <input
                  type="text"
                  placeholder="Action taken / resolution notes..."
                  value={resolveNotes}
                  onChange={(e) => setResolveNotes(e.target.value)}
                  className="text-xs p-2 border border-zinc-300 dark:border-zinc-700 bg-transparent text-zinc-900 dark:text-zinc-100 w-44 sm:w-56 min-h-[44px]"
                />
                <button
                  onClick={() => {
                    resolveIncident(incident.id, resolveNotes);
                    setIsResolving(false);
                  }}
                  className="px-4 py-2 text-xs bg-emerald-700 text-white font-semibold hover:bg-emerald-800 min-h-[44px]"
                >
                  Confirm
                </button>
                <button
                  onClick={() => setIsResolving(false)}
                  className="px-3 py-2 text-xs text-zinc-500 hover:text-zinc-800 min-h-[44px]"
                >
                  Cancel
                </button>
              </div>
            )
          )}
        </div>
      </div>
    </article>
  );
}

export function IncidentFeed() {
  const { incidents } = useEvent();
  const [filterCategory, setFilterCategory] = useState('ALL');

  const activeIncidents = incidents.filter(i => i.status !== 'resolved');

  const displayedIncidents = incidents.filter(i => {
    if (filterCategory === 'ALL') return true;
    if (filterCategory === 'ACTIVE') return i.status !== 'resolved';
    return i.category === filterCategory;
  });

  return (
    <div className="space-y-4">
      {/* Feed Filter Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-200 dark:border-zinc-800 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              Live Incident Triage Feed
            </h2>
            <span className="text-xs px-2 py-0.5 bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 font-mono font-semibold">
              {activeIncidents.length} active
            </span>
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Correlated friction reports with live detection stopwatches and verified dispatch
          </p>
        </div>

        {/* Filter Dropdown */}
        <div className="flex items-center gap-2 text-xs">
          <label htmlFor="incident-filter-select" className="text-zinc-500 dark:text-zinc-400">
            Filter:
          </label>
          <select
            id="incident-filter-select"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="text-xs p-2 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 min-h-[44px]"
          >
            <option value="ALL">All Incidents ({incidents.length})</option>
            <option value="ACTIVE">Active Only ({activeIncidents.length})</option>
            <option value="blocked_path">Blocked Paths</option>
            <option value="long_queue">Long Queues</option>
            <option value="crowded_zone">Crowded Zones</option>
            <option value="accessibility_issue">Accessibility Barriers</option>
            <option value="medical">Medical / First Aid</option>
          </select>
        </div>
      </div>

      {/* Explicit Empty State */}
      {displayedIncidents.length === 0 ? (
        <div className="p-8 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-center space-y-2">
          <Layers className="w-8 h-8 text-zinc-400 mx-auto" />
          <h3 className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">
            No Incidents Found
          </h3>
          <p className="text-xs text-zinc-500">
            {filterCategory === 'ACTIVE'
              ? 'All reported venue frictions have been resolved. Flow is nominal.'
              : 'No incidents match the selected filter category.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {displayedIncidents.map(incident => (
            <IncidentCard key={incident.id} incident={incident} />
          ))}
        </div>
      )}
    </div>
  );
}
