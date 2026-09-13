import React from 'react';
import { useEvent } from '../../context/EventContext';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { StatusDot } from './StatusIndicator';
import { ShieldAlert, WifiOff, Sun, Moon, LogOut, User } from 'lucide-react';

export function Header() {
  const {
    event,
    isOnline,
    lastSyncTime,
    setEmergencyModalOpen,
  } = useEvent();

  const { currentUser, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();

  return (
    <header className="border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 sticky top-0 z-30 transition-colors">
      {/* Safety Critical Offline Banner */}
      {!isOnline && (
        <div 
          role="alert" 
          className="px-4 py-2 bg-zinc-900 text-zinc-100 dark:bg-zinc-100 dark:text-zinc-900 text-xs font-semibold flex items-center justify-between border-b border-zinc-700"
        >
          <div className="flex items-center gap-2">
            <WifiOff className="w-3.5 h-3.5 shrink-0" />
            <span>Offline — Showing cached safety store (Cached {lastSyncTime})</span>
          </div>
        </div>
      )}

      {/* Main Navigation Bar (Clean 3-Zone Layout) */}
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between gap-3">
        {/* ZONE 1 (LEFT): Brand + Event Name */}
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="font-semibold tracking-tight text-sm text-zinc-950 dark:text-zinc-50">
            Kshetra
          </span>
          <span className="text-zinc-300 dark:text-zinc-700 select-none">/</span>
          <span className="text-xs text-zinc-500 dark:text-zinc-400 truncate max-w-[140px] sm:max-w-none">
            {event.title}
          </span>
        </div>

        {/* ZONE 2 (RIGHT): Theme, Status, Filled Red Emergency, Avatar Unit, Separated Logout */}
        <div className="flex items-center gap-2">
          {/* 1. Theme Toggle */}
          <button
            onClick={toggleTheme}
            aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
            className="h-9 w-9 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:border-zinc-400 dark:hover:border-zinc-600 flex items-center justify-center transition-colors shrink-0"
          >
            {isDark ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-zinc-600" />}
          </button>

          {/* 2. Real Live/Offline Status Badge */}
          <div
            className={`hidden sm:flex items-center gap-1.5 h-9 px-2.5 text-[11px] font-mono border transition-colors ${
              isOnline
                ? 'border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 bg-zinc-50 dark:bg-zinc-800/40'
                : 'border-amber-300 dark:border-amber-800 text-amber-800 dark:text-amber-400 bg-amber-50/50 dark:bg-amber-950/20'
            }`}
            title={isOnline ? `Connected. Synced at ${lastSyncTime}` : `Offline. Using safety cache from ${lastSyncTime}`}
          >
            <StatusDot status={isOnline ? 'green' : 'yellow'} />
            <span>{isOnline ? `Live • ${lastSyncTime}` : `Offline — cached ${lastSyncTime}`}</span>
          </div>

          {/* 3. Emergency Button (VISUALLY DISTINCT: FILLED RED) */}
          <button
            onClick={() => setEmergencyModalOpen(true)}
            aria-label="Open emergency assistance protocols"
            className="h-9 px-3 text-xs bg-red-600 text-white hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-500 font-semibold flex items-center justify-center gap-1.5 transition-colors shrink-0"
          >
            <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
            <span>Emergency</span>
          </button>

          {/* 4. User Avatar + Name + Role Unit */}
          {currentUser && (
            <div className="flex items-center gap-2 h-9 px-2.5 border border-zinc-200 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-800/40">
              <div className="w-5 h-5 bg-zinc-900 text-zinc-100 dark:bg-zinc-100 dark:text-zinc-900 text-[10px] font-semibold flex items-center justify-center uppercase">
                {currentUser.name.charAt(0)}
              </div>
              <div className="flex flex-col text-left leading-none">
                <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 truncate max-w-[110px]">
                  {currentUser.name}
                </span>
                <span className="text-[10px] text-zinc-500 dark:text-zinc-400 truncate max-w-[110px] mt-0.5 capitalize">
                  {currentUser.staffRole || currentUser.role}
                </span>
              </div>
            </div>
          )}

          {/* 5. Separated Logout Button */}
          {currentUser && (
            <button
              onClick={logout}
              title="Log out and return to landing page"
              aria-label="Log out"
              className="h-9 px-2.5 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 flex items-center justify-center gap-1 text-xs transition-colors shrink-0 ml-0.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Log out</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
