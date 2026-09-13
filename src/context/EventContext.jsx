import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  INITIAL_EVENT,
  INITIAL_ZONES,
  INITIAL_FACILITIES,
  INITIAL_SESSIONS,
  INITIAL_STAFF,
  INITIAL_INCIDENTS,
  INITIAL_BARRIER_LEDGER,
  CACHED_EMERGENCY_CONTACTS,
} from '../data/seedData';
import {
  CATEGORY_DEFINITIONS,
  calculateConfidence,
  computeZoneStatus,
  formatDuration,
  calculateResolutionDelta,
} from '../utils/classifier';
import {
  updateSafetyCache,
  getSafetyCache,
  isSimulatedOffline,
  setSimulatedOffline as setSimulatedOfflineStorage,
} from '../utils/offlineLayer';
import { ROUTE_DNA_PROFILES } from '../utils/recommendation';

const EventContext = createContext(null);

const STORAGE_KEYS = {
  ZONES: 'pulseops_state_zones',
  INCIDENTS: 'pulseops_state_incidents',
  REPORTS: 'pulseops_state_reports',
  LEDGER: 'pulseops_state_ledger',
  STAFF: 'pulseops_state_staff',
  PREFERENCES: 'pulseops_state_preferences',
  BOOKMARKS: 'pulseops_state_bookmarks',
  ROLE: 'pulseops_current_role',
  LAST_SYNC: 'pulseops_last_sync_timestamp',
};

// Generate realistic short production ticket IDs (e.g. PO-8492)
function generateTicketId() {
  const num = Math.floor(1000 + Math.random() * 9000);
  return `PO-${num}`;
}

export function EventProvider({ children }) {
  const [isLoading, setIsLoading] = useState(true);
  const [storeError, setStoreError] = useState(null);

  // Current view role: 'attendee' | 'organizer'
  const [currentRole, setCurrentRole] = useState(() => {
    return localStorage.getItem(STORAGE_KEYS.ROLE) || 'attendee';
  });

  // Master event metadata
  const [event] = useState(INITIAL_EVENT);

  // Core collections with localStorage persistence
  const [zones, setZones] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ZONES);
      return saved ? JSON.parse(saved) : INITIAL_ZONES;
    } catch {
      return INITIAL_ZONES;
    }
  });

  const [facilities] = useState(INITIAL_FACILITIES);
  const [sessions] = useState(INITIAL_SESSIONS);

  const [staff, setStaff] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.STAFF);
      return saved ? JSON.parse(saved) : INITIAL_STAFF;
    } catch {
      return INITIAL_STAFF;
    }
  });

  const [incidents, setIncidents] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.INCIDENTS);
      return saved ? JSON.parse(saved) : INITIAL_INCIDENTS;
    } catch {
      return INITIAL_INCIDENTS;
    }
  });

  const [reports, setReports] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.REPORTS);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [barrierLedger, setBarrierLedger] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.LEDGER);
      return saved ? JSON.parse(saved) : INITIAL_BARRIER_LEDGER;
    } catch {
      return INITIAL_BARRIER_LEDGER;
    }
  });

  // Bookmarked session IDs
  const [bookmarkedSessionIds, setBookmarkedSessionIds] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.BOOKMARKS);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Attendee Preferences (Route DNA, interests)
  const [preferences, setPreferences] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PREFERENCES);
      return saved ? JSON.parse(saved) : {
        routeDna: 'mobility-friendly',
        interests: ['AI', 'Accessibility', 'Urban Tech'],
      };
    } catch {
      return {
        routeDna: 'mobility-friendly',
        interests: ['AI', 'Accessibility', 'Urban Tech'],
      };
    }
  });

  // Sync timestamps
  const [lastSyncTime, setLastSyncTime] = useState(() => {
    return localStorage.getItem(STORAGE_KEYS.LAST_SYNC) || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  });

  // Connectivity & Safety Offline Layer
  const [isOnline, setIsOnline] = useState(() => {
    if (isSimulatedOffline()) return false;
    return typeof navigator !== 'undefined' ? navigator.onLine : true;
  });

  // Modals & UI Triggers
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportModalZoneId, setReportModalZoneId] = useState(null);
  const [emergencyModalOpen, setEmergencyModalOpen] = useState(false);
  const [quietModalOpen, setQuietModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Initialize store simulation & verify persistence
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 150); // fast crisp hydration
    return () => clearTimeout(timer);
  }, []);

  // Update sync timestamp
  const refreshSyncTimestamp = useCallback(() => {
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setLastSyncTime(timeStr);
    try {
      localStorage.setItem(STORAGE_KEYS.LAST_SYNC, timeStr);
    } catch {}
  }, []);

  // Toast Helper with queueing and deduplication
  const showToast = useCallback((msg, type = 'info') => {
    setToastMessage({ msg, type, id: Date.now() });
    setTimeout(() => {
      setToastMessage(prev => (prev?.msg === msg ? null : prev));
    }, 4500);
  }, []);

  // Synchronize state and safety cache
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ZONES, JSON.stringify(zones));
      localStorage.setItem(STORAGE_KEYS.INCIDENTS, JSON.stringify(incidents));
      localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(reports));
      localStorage.setItem(STORAGE_KEYS.STAFF, JSON.stringify(staff));
      localStorage.setItem(STORAGE_KEYS.LEDGER, JSON.stringify(barrierLedger));
      localStorage.setItem(STORAGE_KEYS.PREFERENCES, JSON.stringify(preferences));
      localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(bookmarkedSessionIds));
      localStorage.setItem(STORAGE_KEYS.ROLE, currentRole);
      // Synchronize safety-critical offline layer
      updateSafetyCache(zones, facilities);
    } catch (e) {
      console.warn('Storage sync warning:', e);
      setStoreError('Unable to write to local state storage.');
    }
  }, [zones, incidents, reports, staff, barrierLedger, preferences, bookmarkedSessionIds, currentRole, facilities]);

  // Connectivity change listener
  useEffect(() => {
    const handleConnectivity = () => {
      const simulated = isSimulatedOffline();
      if (simulated) {
        setIsOnline(false);
      } else {
        const onlineState = navigator.onLine;
        setIsOnline(onlineState);
        if (onlineState) {
          refreshSyncTimestamp();
        }
      }
    };

    window.addEventListener('online', handleConnectivity);
    window.addEventListener('offline', handleConnectivity);
    window.addEventListener('pulseops_connectivity_change', handleConnectivity);

    return () => {
      window.removeEventListener('online', handleConnectivity);
      window.removeEventListener('offline', handleConnectivity);
      window.removeEventListener('pulseops_connectivity_change', handleConnectivity);
    };
  }, [refreshSyncTimestamp]);

  // Periodic heartbeat sync (every 30s)
  useEffect(() => {
    const interval = setInterval(() => {
      if (isOnline) {
        refreshSyncTimestamp();
      }
    }, 30000);
    return () => clearInterval(interval);
  }, [isOnline, refreshSyncTimestamp]);

  /**
   * Route DNA Profile Selection
   * Persists immediately and triggers confirmation toast
   */
  const setRouteDna = useCallback((profileId) => {
    const profile = ROUTE_DNA_PROFILES[profileId];
    if (!profile) return;

    setPreferences(prev => ({ ...prev, routeDna: profileId }));
    refreshSyncTimestamp();
    showToast(`Route DNA updated: ${profile.label}. Recalculating walk times & recommendations.`, 'info');
  }, [showToast, refreshSyncTimestamp]);

  /**
   * Toggle Session Bookmark
   */
  const toggleBookmark = useCallback((sessionId) => {
    setBookmarkedSessionIds(prev => {
      const exists = prev.includes(sessionId);
      const updated = exists ? prev.filter(id => id !== sessionId) : [...prev, sessionId];
      const sessionObj = sessions.find(s => s.id === sessionId);
      const title = sessionObj ? sessionObj.title.slice(0, 35) + '...' : 'Session';
      showToast(exists ? `Removed "${title}" from schedule.` : `Saved "${title}" to your schedule.`, 'info');
      return updated;
    });
  }, [sessions, showToast]);

  /**
   * 1-Tap Friction Submission & Report Merging Logic
   * Category -> Zone -> Optional Note -> Real Ticket ID -> State Store
   */
  const submitFrictionReport = useCallback(({
    category,
    zoneId,
    customNote = '',
    photoPreview = null,
    reporterType = 'attendee',
    isPrivateEmergency = false,
  }) => {
    const targetZone = zones.find(z => z.id === zoneId) || zones[0];
    const categoryMeta = CATEGORY_DEFINITIONS[category] || CATEGORY_DEFINITIONS.blocked_path;
    const now = Date.now();
    const rollingWindowMs = 15 * 60 * 1000; // 15 minutes
    const ticketId = generateTicketId();

    const newReport = {
      id: `rep-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      ticketId,
      category,
      zoneId: targetZone.id,
      zoneName: targetZone.name,
      customNote,
      photoUrl: photoPreview,
      reporterType,
      isPrivateEmergency,
      timestamp: now,
      status: 'pending',
    };

    // Private Assistance Emergency requests route directly to organizer as urgent private intervention
    if (isPrivateEmergency) {
      const privateIncident = {
        id: `inc-private-${now}`,
        ticketId,
        eventId: event.id,
        category: 'medical',
        isPrivateEmergency: true,
        zoneId: targetZone.id,
        zoneName: targetZone.name,
        issueTitle: `Private Assistance: ${customNote || 'Confidential on-site escort request'}`,
        severity: 'high',
        affectedCount: 1,
        confidence: 'high',
        suggestedAction: 'Deploy on-site coordinator directly without public dispatch',
        assignedStaffId: null,
        assignedStaffName: null,
        status: 'detected',
        detectedAt: now,
        acknowledgedAt: null,
        resolvedAt: null,
        initialZoneStatus: targetZone.status,
        finalZoneStatus: null,
        sourceReportIds: [newReport.id],
        notes: customNote || 'Confidential request sent to organizer triage only.',
      };

      setIncidents(prev => [privateIncident, ...prev]);
      setReports(prev => [newReport, ...prev]);
      refreshSyncTimestamp();
      showToast(`Private assistance dispatched [Ticket ${ticketId}] to operations desk.`, 'success');
      return { ticketId, incidentId: privateIncident.id, merged: false, zoneName: targetZone.name };
    }

    // Standard report: Check for active incident in same zone & category within 15 min
    const existingIndex = incidents.findIndex(inc => 
      inc.zoneId === targetZone.id &&
      inc.category === category &&
      inc.status !== 'resolved' &&
      !inc.isPrivateEmergency &&
      (now - inc.detectedAt <= rollingWindowMs)
    );

    let resultingIncidentId = null;
    let wasMerged = false;
    let finalAffectedCount = 1;

    if (existingIndex !== -1) {
      // MERGE REPORT INTO EXISTING INCIDENT
      wasMerged = true;
      const existing = incidents[existingIndex];
      finalAffectedCount = existing.affectedCount + 1;
      const newConfidence = calculateConfidence(finalAffectedCount, false);
      resultingIncidentId = existing.id;

      const updatedIncident = {
        ...existing,
        affectedCount: finalAffectedCount,
        confidence: newConfidence.level,
        sourceReportIds: [...existing.sourceReportIds, newReport.id],
        notes: customNote ? `${existing.notes} | ${customNote}` : existing.notes,
      };

      const updatedIncidents = [...incidents];
      updatedIncidents[existingIndex] = updatedIncident;
      setIncidents(updatedIncidents);

      // Recompute Zone status dynamically
      const zoneIncidents = updatedIncidents.filter(i => i.zoneId === targetZone.id);
      const computed = computeZoneStatus(zoneIncidents);
      setZones(prev => prev.map(z => z.id === targetZone.id ? { ...z, ...computed } : z));

      newReport.status = 'merged';
      newReport.mergedIntoIncidentId = existing.id;
      setReports(prev => [newReport, ...prev]);

      showToast(`Report merged into existing ticket [${existing.ticketId || ticketId}]. Affected count: ${finalAffectedCount}`, 'info');
    } else {
      // CREATE NEW INCIDENT CARD
      const initialConfidence = calculateConfidence(1, reporterType === 'staff');
      const newIncident = {
        id: `inc-${now}`,
        ticketId,
        eventId: event.id,
        category,
        zoneId: targetZone.id,
        zoneName: targetZone.name,
        issueTitle: customNote ? `${categoryMeta.label}: ${customNote}` : `${categoryMeta.label} reported`,
        severity: categoryMeta.defaultSeverity,
        affectedCount: 1,
        confidence: initialConfidence.level,
        suggestedAction: categoryMeta.suggestedAction,
        assignedStaffId: null,
        assignedStaffName: null,
        status: 'detected',
        detectedAt: now,
        acknowledgedAt: null,
        resolvedAt: null,
        initialZoneStatus: targetZone.status,
        finalZoneStatus: null,
        sourceReportIds: [newReport.id],
        notes: customNote || 'Initial 1-tap submission.',
      };

      resultingIncidentId = newIncident.id;
      const updatedIncidents = [newIncident, ...incidents];
      setIncidents(updatedIncidents);

      // Recompute Zone status dynamically
      const zoneIncidents = updatedIncidents.filter(i => i.zoneId === targetZone.id);
      const computed = computeZoneStatus(zoneIncidents);
      setZones(prev => prev.map(z => z.id === targetZone.id ? { ...z, ...computed } : z));

      newReport.status = 'open';
      newReport.mergedIntoIncidentId = newIncident.id;
      setReports(prev => [newReport, ...prev]);

      showToast(`Friction ticket created [${ticketId}]. Operations notified.`, 'success');
    }

    refreshSyncTimestamp();
    return {
      ticketId: existingIndex !== -1 ? (incidents[existingIndex].ticketId || ticketId) : ticketId,
      incidentId: resultingIncidentId,
      merged: wasMerged,
      affectedCount: finalAffectedCount,
      zoneName: targetZone.name,
    };
  }, [zones, incidents, event.id, showToast, refreshSyncTimestamp]);

  // Acknowledge Incident
  const acknowledgeIncident = useCallback((incidentId) => {
    const now = Date.now();
    let target = null;

    setIncidents(prev => prev.map(inc => {
      if (inc.id === incidentId) {
        target = inc;
        return {
          ...inc,
          status: 'acknowledged',
          acknowledgedAt: inc.acknowledgedAt || now,
        };
      }
      return inc;
    }));

    refreshSyncTimestamp();
    showToast(`Acknowledged ticket [${target?.ticketId || incidentId.slice(-4)}] by operations desk.`, 'info');
  }, [showToast, refreshSyncTimestamp]);

  // Assign Staff Member
  const assignStaffToIncident = useCallback((incidentId, staffId) => {
    const selectedStaff = staff.find(s => s.id === staffId);
    if (!selectedStaff) return;

    const now = Date.now();
    let targetTicket = '';

    setIncidents(prev => prev.map(inc => {
      if (inc.id === incidentId) {
        targetTicket = inc.ticketId || inc.id.slice(-4);
        return {
          ...inc,
          assignedStaffId: selectedStaff.id,
          assignedStaffName: selectedStaff.name,
          status: 'in_progress',
          acknowledgedAt: inc.acknowledgedAt || now,
        };
      }
      return inc;
    }));

    setStaff(prev => prev.map(s => {
      if (s.id === staffId) {
        return { ...s, status: 'assigned', currentTaskId: incidentId };
      }
      return s;
    }));

    refreshSyncTimestamp();
    showToast(`Assigned ${selectedStaff.name} to ticket [${targetTicket}].`, 'success');
  }, [staff, showToast, refreshSyncTimestamp]);

  // Resolve Incident & Verify Loop
  const resolveIncident = useCallback((incidentId, notes = '') => {
    const now = Date.now();
    const targetIncident = incidents.find(i => i.id === incidentId);
    if (!targetIncident) return;

    const resolveDurationMs = now - targetIncident.detectedAt;
    const resolveTimeSec = Math.round(resolveDurationMs / 1000);
    const resolveFormatted = formatDuration(resolveDurationMs);

    // 1. Mark resolved
    const updatedIncidents = incidents.map(inc => {
      if (inc.id === incidentId) {
        return {
          ...inc,
          status: 'resolved',
          resolvedAt: now,
        };
      }
      return inc;
    });
    setIncidents(updatedIncidents);

    // 2. Recompute Zone status dynamically
    const remainingZoneIncidents = updatedIncidents.filter(
      i => i.zoneId === targetIncident.zoneId && i.status !== 'resolved'
    );
    const newZoneState = computeZoneStatus(remainingZoneIncidents);

    // 3. Compute resolution delta
    const resolutionDelta = calculateResolutionDelta(
      targetIncident.initialZoneStatus,
      newZoneState.status,
      resolveDurationMs
    );

    // 4. Update zone state
    setZones(prev => prev.map(z => {
      if (z.id === targetIncident.zoneId) {
        return {
          ...z,
          status: newZoneState.status,
          reasonString: newZoneState.reasonString,
        };
      }
      return z;
    }));

    // 5. Append to Barrier Ledger
    const ledgerEntry = {
      id: `ledger-${Date.now()}`,
      incidentId: targetIncident.id,
      ticketId: targetIncident.ticketId || targetIncident.id.slice(-4),
      issueTitle: targetIncident.issueTitle,
      category: targetIncident.category,
      zoneId: targetIncident.zoneId,
      zoneName: targetIncident.zoneName,
      affectedCount: targetIncident.affectedCount,
      detectedAt: targetIncident.detectedAt,
      acknowledgedAt: targetIncident.acknowledgedAt || targetIncident.detectedAt,
      resolvedAt: now,
      resolveTimeSeconds: resolveTimeSec,
      resolveTimeFormatted: resolveFormatted,
      resolutionDelta,
      resolvedByStaff: targetIncident.assignedStaffName || 'Lead Operations Officer',
      notes: notes || targetIncident.notes,
    };

    setBarrierLedger(prev => [ledgerEntry, ...prev]);

    // 6. Free up assigned staff
    if (targetIncident.assignedStaffId) {
      setStaff(prev => prev.map(s => {
        if (s.id === targetIncident.assignedStaffId) {
          return { ...s, status: 'available', currentTaskId: null };
        }
        return s;
      }));
    }

    refreshSyncTimestamp();
    showToast(`Resolved ticket [${ledgerEntry.ticketId}]! ${resolutionDelta}`, 'success');
  }, [incidents, showToast, refreshSyncTimestamp]);

  // Demo Failsafe
  const triggerDemoScenario = useCallback(() => {
    const now = Date.now();
    const demoRamp = {
      ...INITIAL_INCIDENTS[0],
      id: `inc-demo-ramp-${now}`,
      ticketId: 'PO-1082',
      detectedAt: now - 3 * 60 * 1000,
      status: 'detected',
      assignedStaffId: null,
      assignedStaffName: null,
    };
    const demoFoodCourt = {
      ...INITIAL_INCIDENTS[1],
      id: `inc-demo-food-${now}`,
      ticketId: 'PO-3944',
      detectedAt: now - 7 * 60 * 1000,
      status: 'detected',
      assignedStaffId: null,
      assignedStaffName: null,
    };

    setIncidents([demoRamp, demoFoodCourt]);
    setZones(INITIAL_ZONES);
    setStaff(INITIAL_STAFF);
    refreshSyncTimestamp();
    showToast('Demo scenario active: Blocked Ramp (Red) & Overcrowded Food Court (Orange)', 'info');
  }, [showToast, refreshSyncTimestamp]);

  // Offline simulation toggle
  const toggleSimulatedOffline = useCallback(() => {
    const current = isSimulatedOffline();
    setSimulatedOfflineStorage(!current);
    setIsOnline(current);
    showToast(!current ? 'Simulated Offline Mode: Using cached safety store' : 'Connected to live network', 'info');
  }, [showToast]);

  // Modal helpers
  const openReportModal = useCallback((zoneId = null) => {
    setReportModalZoneId(zoneId);
    setReportModalOpen(true);
  }, []);

  return (
    <EventContext.Provider
      value={{
        isLoading,
        storeError,
        setStoreError,
        event,
        zones,
        facilities,
        sessions,
        staff,
        incidents,
        reports,
        barrierLedger,
        bookmarkedSessionIds,
        toggleBookmark,
        preferences,
        isOnline,
        lastSyncTime,
        currentRole,
        setCurrentRole,
        setRouteDna,
        submitFrictionReport,
        acknowledgeIncident,
        assignStaffToIncident,
        resolveIncident,
        triggerDemoScenario,
        toggleSimulatedOffline,
        reportModalOpen,
        setReportModalOpen,
        reportModalZoneId,
        openReportModal,
        emergencyModalOpen,
        setEmergencyModalOpen,
        quietModalOpen,
        setQuietModalOpen,
        toastMessage,
        showToast,
        cachedContacts: CACHED_EMERGENCY_CONTACTS,
      }}
    >
      {children}
    </EventContext.Provider>
  );
}

export function useEvent() {
  const context = useContext(EventContext);
  if (!context) {
    throw new Error('useEvent must be used within an EventProvider');
  }
  return context;
}
