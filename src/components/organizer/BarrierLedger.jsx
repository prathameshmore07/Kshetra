import React from 'react';
import { useEvent } from '../../context/EventContext';
import { formatDuration } from '../../utils/classifier';
import { Download, FileText, FileCheck2, Clock } from 'lucide-react';

export function BarrierLedger() {
  const { barrierLedger, event } = useEvent();

  // Metrics computation from real state
  const totalIncidents = barrierLedger.length;
  const avgResolveSeconds = totalIncidents > 0
    ? Math.round(barrierLedger.reduce((sum, item) => sum + (item.resolveTimeSeconds || 0), 0) / totalIncidents)
    : 0;

  // Repeat issues analysis (dynamically computed from live barrierLedger store)
  const zoneCounts = barrierLedger.reduce((acc, curr) => {
    acc[curr.zoneName] = (acc[curr.zoneName] || 0) + 1;
    return acc;
  }, {});

  const repeatBottlenecks = Object.entries(zoneCounts)
    .filter(([_, count]) => count > 1)
    .sort((a, b) => b[1] - a[1]);

  // CSV Export
  const exportCSV = () => {
    const headers = [
      'Ticket ID',
      'Issue Title',
      'Category',
      'Zone',
      'Affected Count',
      'Detected At',
      'Acknowledged At',
      'Resolved At',
      'Resolve Time (sec)',
      'Resolution Delta',
      'Staff Officer',
    ];

    const rows = barrierLedger.map(item => [
      item.ticketId || item.incidentId,
      `"${item.issueTitle.replace(/"/g, '""')}"`,
      item.category,
      `"${item.zoneName}"`,
      item.affectedCount,
      new Date(item.detectedAt).toISOString(),
      new Date(item.acknowledgedAt).toISOString(),
      new Date(item.resolvedAt).toISOString(),
      item.resolveTimeSeconds,
      `"${item.resolutionDelta}"`,
      `"${item.resolvedByStaff}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `kshetra-barrier-ledger-${event.id}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // JSON Export
  const exportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(barrierLedger, null, 2));
    const link = document.createElement('a');
    link.setAttribute('href', dataStr);
    link.setAttribute('download', `kshetra-barrier-ledger-${event.id}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header & Export Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-200 dark:border-zinc-800 pb-3">
        <div>
          <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            Barrier Ledger (Immutable Audit Log)
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Post-event compliance report • Complete start, ack, and resolution duration audit
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={exportCSV}
            disabled={totalIncidents === 0}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 font-semibold disabled:opacity-40 min-h-[44px]"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={exportJSON}
            disabled={totalIncidents === 0}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs bg-zinc-900 text-zinc-100 dark:bg-zinc-100 dark:text-zinc-900 hover:bg-zinc-800 font-semibold disabled:opacity-40 min-h-[44px]"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Export JSON</span>
          </button>
        </div>
      </div>

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-3.5 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
          <span className="text-[11px] text-zinc-500 uppercase tracking-wide block">
            Total Incidents Resolved
          </span>
          <span className="text-2xl font-semibold font-mono text-zinc-900 dark:text-zinc-100 mt-1 block">
            {totalIncidents}
          </span>
          <span className="text-[11px] text-zinc-400">
            100% verified resolution trail
          </span>
        </div>

        <div className="p-3.5 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
          <span className="text-[11px] text-zinc-500 uppercase tracking-wide block">
            Average Resolution Time
          </span>
          <span className="text-2xl font-semibold font-mono text-zinc-900 dark:text-zinc-100 mt-1 block">
            {totalIncidents > 0 ? formatDuration(avgResolveSeconds * 1000) : '0s'}
          </span>
          <span className="text-[11px] text-zinc-400">
            From detection to physical resolution
          </span>
        </div>

        <div className="p-3.5 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
          <span className="text-[11px] text-zinc-500 uppercase tracking-wide block">
            Repeat Bottlenecks Identified
          </span>
          <span className="text-2xl font-semibold font-mono text-zinc-900 dark:text-zinc-100 mt-1 block">
            {repeatBottlenecks.length}
          </span>
          <span className="text-[11px] text-zinc-400">
            Zones with multiple friction cycles
          </span>
        </div>
      </div>

      {/* Repeat Bottlenecks Callout */}
      {repeatBottlenecks.length > 0 && (
        <div className="p-3.5 border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/40 space-y-1.5">
          <span className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 block">
            Repeat Bottlenecks Breakdown:
          </span>
          <div className="flex flex-wrap gap-2">
            {repeatBottlenecks.map(([zoneName, count], idx) => (
              <span
                key={idx}
                className="text-xs px-2.5 py-1 border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 font-mono"
              >
                {zoneName}: <strong>{count} incidents</strong>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Detailed Ledger Table or Empty State */}
      {totalIncidents === 0 ? (
        <div className="p-8 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-center space-y-2">
          <FileCheck2 className="w-8 h-8 text-zinc-400 mx-auto" />
          <h3 className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">
            Barrier Ledger is Empty
          </h3>
          <p className="text-xs text-zinc-500">
            When incidents in the live feed are resolved, their audit trail and timestamp metrics will be logged here.
          </p>
        </div>
      ) : (
        <div className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse min-w-[760px]">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50 text-zinc-500 dark:text-zinc-400 font-semibold">
                <th className="p-3">Ticket &amp; Issue</th>
                <th className="p-3">Zone</th>
                <th className="p-3">Count</th>
                <th className="p-3">Start (Detected)</th>
                <th className="p-3">Ack</th>
                <th className="p-3">Resolved</th>
                <th className="p-3">Duration</th>
                <th className="p-3">Resolution Delta</th>
                <th className="p-3">Staff Officer</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 font-normal">
              {barrierLedger.map((entry) => (
                <tr key={entry.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30">
                  <td className="p-3">
                    <span className="font-mono text-[11px] font-semibold text-zinc-900 dark:text-zinc-100 block">
                      {entry.ticketId || entry.incidentId.slice(-4)}
                    </span>
                    <span className="text-zinc-700 dark:text-zinc-300 block">
                      {entry.issueTitle}
                    </span>
                  </td>

                  <td className="p-3 text-zinc-600 dark:text-zinc-400">
                    {entry.zoneName}
                  </td>

                  <td className="p-3 font-mono">
                    {entry.affectedCount}
                  </td>

                  <td className="p-3 font-mono text-zinc-600 dark:text-zinc-400">
                    {new Date(entry.detectedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </td>

                  <td className="p-3 font-mono text-zinc-600 dark:text-zinc-400">
                    {entry.acknowledgedAt
                      ? new Date(entry.acknowledgedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
                      : '—'}
                  </td>

                  <td className="p-3 font-mono text-zinc-600 dark:text-zinc-400">
                    {new Date(entry.resolvedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </td>

                  <td className="p-3 font-mono font-semibold text-zinc-900 dark:text-zinc-100">
                    {entry.resolveTimeFormatted}
                  </td>

                  <td className="p-3 text-emerald-700 dark:text-emerald-400 font-semibold">
                    {entry.resolutionDelta}
                  </td>

                  <td className="p-3 text-zinc-700 dark:text-zinc-300">
                    {entry.resolvedByStaff}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
