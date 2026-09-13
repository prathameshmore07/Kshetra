import React from 'react';
import { useEvent } from '../../context/EventContext';
import { StatusDot } from './StatusIndicator';
import { ShieldAlert, WifiOff } from 'lucide-react';
import { ROUTE_DNA_PROFILES } from '../../utils/recommendation';

export function Header() {
  const {
    event,
    currentRole,
    setCurrentRole,
    isOnline,
    lastSyncTime,
    setEmergencyModalOpen,
    preferences,
  } = useEvent();

  const activeDna = ROUTE_DNA_PROFILES[preferences.routeDna] || ROUTE_DNA_PROFILES['mobility-friendly'];

  return (
    <header className="border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 sticky top-0 z-30">
      {/* Safety Critical Offline Banner */}
      {!isOnline && (
        <div 
          role="alert" 
          className="px-4 py-2 bg-zinc-900 text-zinc-100 dark:bg-zinc-100 dark:text-zinc-900 text-xs font-semibold flex items-center justify-between border-b border-zinc-700"
        >
          <div className="flex items-center gap-2">
            <WifiOff className="w-3.5 h-3.5 shrink-0" />
            <span>Offline — Showing cached emergency contacts, venue map &amp; statuses (Cached {lastSyncTime})</span>
          </div>
        </div>
      )}

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between gap-3">
        {/* Brand & Context */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-semibold tracking-tight text-base text-zinc-900 dark:text-zinc-50">
              PulseOps
            </span>
            <span className="text-zinc-300 dark:text-zinc-700 font-normal">|</span>
            <span className="text-xs text-zinc-500 dark:text-zinc-400 truncate max-w-[140px] sm:max-w-none">
              {event.title}
            </span>
          </div>

          {/* Route DNA Active Badge (Attendee view) */}
          {currentRole === 'attendee' && (
            <div className="hidden md:flex items-center gap-1.5 px-2 py-0.5 border border-zinc-200 dark:border-zinc-800 text-[11px] text-zinc-600 dark:text-zinc-400">
              <span>DNA:</span>
              <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                {activeDna.label}
              </span>
            </div>
          )}
        </div>

        {/* Global Action Tools */}
        <div className="flex items-center gap-2.5">
          {/* Real Live / Offline Status Badge */}
          <div
            className={`flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-mono border transition-colors ${
              isOnline
                ? 'border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 bg-zinc-50 dark:bg-zinc-800/40'
                : 'border-amber-300 dark:border-amber-800 text-amber-800 dark:text-amber-400 bg-amber-50/50 dark:bg-amber-950/20'
            }`}
            title={isOnline ? `Connected to operational data store. Last synced at ${lastSyncTime}` : `Network unavailable. Serving safety cache from ${lastSyncTime}`}
          >
            <StatusDot status={isOnline ? 'green' : 'yellow'} />
            <span className="hidden xs:inline">{isOnline ? `Live • ${lastSyncTime}` : `Offline — cached ${lastSyncTime}`}</span>
            <span className="xs:hidden">{isOnline ? lastSyncTime : 'Cached'}</span>
          </div>

          {/* 3-Tier Emergency Trigger */}
          <button
            onClick={() => setEmergencyModalOpen(true)}
            aria-label="Open emergency assistance protocols"
            className="inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs border border-red-300 dark:border-red-900 text-red-700 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors font-semibold min-h-[44px]"
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Emergency</span>
          </button>

          {/* Role Toggle */}
          <div 
            role="group" 
            aria-label="Interface Mode" 
            className="flex border border-zinc-300 dark:border-zinc-700 p-0.5 min-h-[44px] items-center"
          >
            <button
              onClick={() => setCurrentRole('attendee')}
              aria-pressed={currentRole === 'attendee'}
              className={`px-3 py-2 text-xs min-h-[38px] transition-colors flex items-center justify-center ${
                currentRole === 'attendee'
                  ? 'bg-zinc-900 text-zinc-50 dark:bg-zinc-100 dark:text-zinc-900 font-semibold'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
              }`}
            >
              Attendee
            </button>
            <button
              onClick={() => setCurrentRole('organizer')}
              aria-pressed={currentRole === 'organizer'}
              className={`px-3 py-2 text-xs min-h-[38px] transition-colors flex items-center justify-center ${
                currentRole === 'organizer'
                  ? 'bg-zinc-900 text-zinc-50 dark:bg-zinc-100 dark:text-zinc-900 font-semibold'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
              }`}
            >
              Organizer
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
