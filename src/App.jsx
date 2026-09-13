import React from 'react';
import { EventProvider, useEvent } from './context/EventContext';
import { Header } from './components/common/Header';
import { Toast } from './components/common/Toast';
import { DevPanel } from './components/common/DevPanel';
import { AttendeePortal } from './components/attendee/AttendeePortal';
import { OrganizerDashboard } from './components/organizer/OrganizerDashboard';
import { FrictionReportModal } from './components/attendee/FrictionReportModal';
import { EmergencyModal } from './components/attendee/EmergencyModal';
import { QuietModeModal } from './components/attendee/QuietModeModal';

function AppContent() {
  const { currentRole } = useEvent();

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 flex flex-col font-sans">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6">
        {currentRole === 'attendee' ? (
          <AttendeePortal />
        ) : (
          <OrganizerDashboard />
        )}
      </main>

      {/* Global Modals & Notifications */}
      <FrictionReportModal />
      <EmergencyModal />
      <QuietModeModal />
      <Toast />

      {/* Hidden Dev & Demo failsafe panel (Ctrl+Shift+D or ?demo=1) */}
      <DevPanel />
    </div>
  );
}

export default function App() {
  return (
    <EventProvider>
      <AppContent />
    </EventProvider>
  );
}
