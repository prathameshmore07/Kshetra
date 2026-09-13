import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AuthContext = createContext(null);

const AUTH_STORAGE_KEY = 'kshetra_auth_session';

// Pre-approved Organizer Staff Directory with seed credentials
export const PREAPPROVED_STAFF = [
  {
    id: 'staff-1',
    name: 'Anita Roy',
    email: 'anita@mumbaifuture.org',
    password: 'ops',
    role: 'organizer',
    staffRole: 'Accessibility Lead',
    specialty: 'Mobility & Wheelchair Wayfinding',
  },
  {
    id: 'staff-2',
    name: 'Rajesh Kadam',
    email: 'rajesh@mumbaifuture.org',
    password: 'ops',
    role: 'organizer',
    staffRole: 'Security & Crowd Marshal',
    specialty: 'Corridor Clearance & Ingress',
  },
  {
    id: 'staff-3',
    name: 'Priya Sharma',
    email: 'priya@mumbaifuture.org',
    password: 'ops',
    role: 'organizer',
    staffRole: 'Facilities Manager',
    specialty: 'Queue Logistics & Signage',
  },
  {
    id: 'staff-4',
    name: 'Dr. David Pinto',
    email: 'david@mumbaifuture.org',
    password: 'ops',
    role: 'organizer',
    staffRole: 'Medical Lead',
    specialty: 'First Aid & Emergency Response',
  },
  {
    id: 'staff-admin',
    name: 'Command Officer',
    email: 'admin@kshetra.io',
    password: 'admin',
    role: 'organizer',
    staffRole: 'Operations Director',
    specialty: 'Master Incident Triage & Barrier Audit',
  },
];

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem(AUTH_STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalRole, setAuthModalRole] = useState('attendee'); // 'attendee' | 'organizer'

  // Persist session
  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(currentUser));
      } else {
        localStorage.removeItem(AUTH_STORAGE_KEY);
      }
    } catch (e) {
      console.warn('Auth session storage error:', e);
    }
  }, [currentUser]);

  /**
   * Attendee Login: Low-friction check-in via email or event pass code
   */
  const loginAttendee = useCallback(({ name = 'Guest Attendee', email = '', checkInCode = 'MFC-2026' }) => {
    const user = {
      id: `att-${Date.now()}`,
      name: name.trim() || 'Attendee',
      email: email.trim() || 'guest@mumbaifuture.org',
      checkInCode: checkInCode.trim() || 'MFC-2026',
      role: 'attendee',
      loggedInAt: new Date().toISOString(),
    };
    setCurrentUser(user);
    setAuthModalOpen(false);
    return { success: true, user };
  }, []);

  /**
   * Organizer Login: Email & Password verification against pre-approved staff
   */
  const loginOrganizer = useCallback(({ email, password }) => {
    const cleanEmail = email.trim().toLowerCase();
    const staffMember = PREAPPROVED_STAFF.find(
      s => s.email.toLowerCase() === cleanEmail && s.password === password
    );

    if (!staffMember) {
      return {
        success: false,
        error: 'Invalid organizer credentials. Use pre-approved staff email or click a quick-fill account.',
      };
    }

    const user = {
      id: staffMember.id,
      name: staffMember.name,
      email: staffMember.email,
      role: 'organizer',
      staffRole: staffMember.staffRole,
      specialty: staffMember.specialty,
      loggedInAt: new Date().toISOString(),
    };

    setCurrentUser(user);
    setAuthModalOpen(false);
    return { success: true, user };
  }, []);

  /**
   * Logout: Clears session and returns to public landing page
   */
  const logout = useCallback(() => {
    setCurrentUser(null);
    setAuthModalOpen(false);
  }, []);

  const openLogin = useCallback((role = 'attendee') => {
    setAuthModalRole(role);
    setAuthModalOpen(true);
  }, []);

  const closeLogin = useCallback(() => {
    setAuthModalOpen(false);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated: Boolean(currentUser),
        isAttendee: currentUser?.role === 'attendee',
        isOrganizer: currentUser?.role === 'organizer',
        loginAttendee,
        loginOrganizer,
        logout,
        authModalOpen,
        authModalRole,
        openLogin,
        closeLogin,
        preapprovedStaff: PREAPPROVED_STAFF,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
