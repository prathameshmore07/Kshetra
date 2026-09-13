import React, { useState } from 'react';
import { useEvent } from '../../context/EventContext';
import { AttendeeHome } from './AttendeeHome';
import { VenueMap2D } from './VenueMap2D';
import { SessionList } from './SessionList';
import { Home, Map, Calendar, Send } from 'lucide-react';

export function AttendeePortal() {
  const [activeTab, setActiveTab] = useState('home'); // 'home' | 'map' | 'sessions'
  const { openReportModal } = useEvent();

  return (
    <div className="max-w-2xl mx-auto pb-28">
      {/* Mobile-Friendly Sub-Navigation with Accessible Tablist */}
      <div 
        role="tablist" 
        aria-label="Attendee views" 
        className="flex border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 mb-4 sticky top-14 z-20 text-xs"
      >
        <button
          role="tab"
          aria-selected={activeTab === 'home'}
          onClick={() => setActiveTab('home')}
          className={`flex-1 py-3 px-3 flex items-center justify-center gap-2 border-b-2 transition-colors min-h-[44px] ${
            activeTab === 'home'
              ? 'border-zinc-900 dark:border-zinc-100 font-semibold text-zinc-900 dark:text-zinc-100'
              : 'border-transparent text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100'
          }`}
        >
          <Home className="w-3.5 h-3.5" />
          <span>Home</span>
        </button>

        <button
          role="tab"
          aria-selected={activeTab === 'map'}
          onClick={() => setActiveTab('map')}
          className={`flex-1 py-3 px-3 flex items-center justify-center gap-2 border-b-2 transition-colors min-h-[44px] ${
            activeTab === 'map'
              ? 'border-zinc-900 dark:border-zinc-100 font-semibold text-zinc-900 dark:text-zinc-100'
              : 'border-transparent text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100'
          }`}
        >
          <Map className="w-3.5 h-3.5" />
          <span>Venue Map</span>
        </button>

        <button
          role="tab"
          aria-selected={activeTab === 'sessions'}
          onClick={() => setActiveTab('sessions')}
          className={`flex-1 py-3 px-3 flex items-center justify-center gap-2 border-b-2 transition-colors min-h-[44px] ${
            activeTab === 'sessions'
              ? 'border-zinc-900 dark:border-zinc-100 font-semibold text-zinc-900 dark:text-zinc-100'
              : 'border-transparent text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100'
          }`}
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>Sessions</span>
        </button>
      </div>

      {/* Main Tab Content */}
      <main>
        {activeTab === 'home' && <AttendeeHome />}
        {activeTab === 'map' && <VenueMap2D />}
        {activeTab === 'sessions' && <SessionList />}
      </main>

      {/* Floating 1-Tap Friction Button for Instant 5-Second Access */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-20 w-full max-w-md px-4">
        <button
          onClick={() => openReportModal()}
          aria-label="Submit 1-tap friction report in under 5 seconds"
          className="w-full py-3 px-4 bg-zinc-900 text-zinc-50 dark:bg-zinc-100 dark:text-zinc-900 text-xs font-semibold flex items-center justify-center gap-2 border border-zinc-900 dark:border-zinc-100 hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors min-h-[48px] focus-visible:outline-2 focus-visible:outline-zinc-900 dark:focus-visible:outline-zinc-100"
        >
          <Send className="w-4 h-4" />
          <span>Report Venue Friction (5-Second Flow)</span>
        </button>
      </div>
    </div>
  );
}
