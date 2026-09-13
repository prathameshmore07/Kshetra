import React, { useState } from 'react';
import { useEvent } from '../../context/EventContext';
import { IncidentFeed } from './IncidentFeed';
import { TrendChart } from './TrendChart';
import { StaffTaskList } from './StaffTaskList';
import { BarrierLedger } from './BarrierLedger';
import { StatusDot } from '../common/StatusIndicator';
import { CardSkeleton } from '../common/Skeleton';
import {
  Layers,
  LineChart,
  Users,
  FileCheck2,
} from 'lucide-react';

export function OrganizerDashboard() {
  const { incidents, zones, barrierLedger, isLoading } = useEvent();
  const [activeTab, setActiveTab] = useState('feed'); // 'feed' | 'trends' | 'staff' | 'ledger'

  if (isLoading) {
    return <CardSkeleton />;
  }

  const activeIncidentsCount = incidents.filter(i => i.status !== 'resolved').length;
  const criticalZones = zones.filter(z => z.status === 'red' || z.status === 'orange');

  return (
    <div className="space-y-6">
      {/* Venue Health & Quick Triage Banner */}
      <div className="p-4 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
              Operations Command Center
            </h1>
            <span className="text-xs px-2 py-0.5 border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 font-mono">
              Live Triage
            </span>
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Real-time friction correlation, staff dispatch, and verified Barrier Ledger auditing
          </p>
        </div>

        {/* Critical Alerts Ribbon (Computed dynamically) */}
        <div className="flex flex-wrap items-center gap-2">
          {criticalZones.length === 0 ? (
            <div className="flex items-center gap-1.5 px-3 py-1.5 text-xs border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50">
              <StatusDot status="green" />
              <span className="text-zinc-600 dark:text-zinc-300 font-medium">
                All zones currently operating nominal
              </span>
            </div>
          ) : (
            criticalZones.map(zone => (
              <div
                key={zone.id}
                className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50"
              >
                <StatusDot status={zone.status} />
                <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                  {zone.name.split('(')[0]}:
                </span>
                <span className="text-zinc-600 dark:text-zinc-400 truncate max-w-[220px]">
                  {zone.reasonString}
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Organizer Navigation Tabs (Touch targets &ge; 44px) */}
      <div 
        role="tablist" 
        aria-label="Organizer Dashboard Views" 
        className="grid grid-cols-2 sm:grid-cols-4 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs"
      >
        <button
          role="tab"
          aria-selected={activeTab === 'feed'}
          onClick={() => setActiveTab('feed')}
          className={`py-3 px-3 flex items-center justify-center gap-2 border-r border-zinc-200 dark:border-zinc-800 transition-colors min-h-[44px] ${
            activeTab === 'feed'
              ? 'bg-zinc-900 text-zinc-50 dark:bg-zinc-100 dark:text-zinc-900 font-semibold'
              : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Incident Feed ({activeIncidentsCount})</span>
        </button>

        <button
          role="tab"
          aria-selected={activeTab === 'trends'}
          onClick={() => setActiveTab('trends')}
          className={`py-3 px-3 flex items-center justify-center gap-2 border-r border-zinc-200 dark:border-zinc-800 transition-colors min-h-[44px] ${
            activeTab === 'trends'
              ? 'bg-zinc-900 text-zinc-50 dark:bg-zinc-100 dark:text-zinc-900 font-semibold'
              : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
          }`}
        >
          <LineChart className="w-3.5 h-3.5" />
          <span>Queue &amp; Crowd Trends</span>
        </button>

        <button
          role="tab"
          aria-selected={activeTab === 'staff'}
          onClick={() => setActiveTab('staff')}
          className={`py-3 px-3 flex items-center justify-center gap-2 border-r border-zinc-200 dark:border-zinc-800 transition-colors min-h-[44px] ${
            activeTab === 'staff'
              ? 'bg-zinc-900 text-zinc-50 dark:bg-zinc-100 dark:text-zinc-900 font-semibold'
              : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Staff Tasks</span>
        </button>

        <button
          role="tab"
          aria-selected={activeTab === 'ledger'}
          onClick={() => setActiveTab('ledger')}
          className={`py-3 px-3 flex items-center justify-center gap-2 transition-colors min-h-[44px] ${
            activeTab === 'ledger'
              ? 'bg-zinc-900 text-zinc-50 dark:bg-zinc-100 dark:text-zinc-900 font-semibold'
              : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
          }`}
        >
          <FileCheck2 className="w-3.5 h-3.5" />
          <span>Barrier Ledger ({barrierLedger.length})</span>
        </button>
      </div>

      {/* Tab Panels */}
      {activeTab === 'feed' && <IncidentFeed />}
      {activeTab === 'trends' && <TrendChart />}
      {activeTab === 'staff' && <StaffTaskList />}
      {activeTab === 'ledger' && <BarrierLedger />}
    </div>
  );
}
