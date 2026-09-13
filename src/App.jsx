import React from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { EventProvider } from './context/EventContext';
import { Header } from './components/common/Header';
import { Toast } from './components/common/Toast';
import { DevPanel } from './components/common/DevPanel';
import { LandingPage } from './components/public/LandingPage';
import { LoginModal } from './components/auth/LoginModal';
import { AttendeePortal } from './components/attendee/AttendeePortal';
import { OrganizerDashboard } from './components/organizer/OrganizerDashboard';
import { FrictionReportModal } from './components/attendee/FrictionReportModal';
import { EmergencyModal } from './components/attendee/EmergencyModal';
import { QuietModeModal } from './components/attendee/QuietModeModal';

function AppContent() {
  const { isAuthenticated, isAttendee, isOrganizer } = useAuth();

  // Public unauthenticated view
  if (!isAuthenticated) {
    return (
      <>
        <LandingPage />
        <LoginModal />
        <DevPanel />
        <Toast />
      </>
    );
  }

  // Authenticated Protected Views
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 flex flex-col font-sans transition-colors">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6">
        {isAttendee && <AttendeePortal />}
        {isOrganizer && <OrganizerDashboard />}
      </main>

      {/* Role-specific and global modals */}
      {isAttendee && (
        <>
          <FrictionReportModal />
          <QuietModeModal />
        </>
      )}
      <EmergencyModal />
      <Toast />

      {/* Hidden Dev & Demo failsafe panel (Ctrl+Shift+D or ?demo=1) */}
      <DevPanel />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <EventProvider>
          <AppContent />
        </EventProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
