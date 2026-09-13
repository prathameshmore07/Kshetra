// Explicit Rule-Based Classification & Triage Engine
// No black-box ML or fake AI labels — transparent rule tables and threshold logic

export const CATEGORY_DEFINITIONS = {
  blocked_path: {
    id: 'blocked_path',
    label: 'Blocked Path / Ramp',
    defaultSeverity: 'high',
    icon: 'AlertTriangle',
    suggestedAction: 'Deploy facility crew to inspect and clear corridor/ramp obstruction immediately',
    initialStatusImpact: 'orange',
  },
  long_queue: {
    id: 'long_queue',
    label: 'Long Queue Wait',
    defaultSeverity: 'medium',
    icon: 'Clock',
    suggestedAction: 'Dispatch queue marshals to open secondary line or divert attendee flow',
    initialStatusImpact: 'yellow',
  },
  crowded_zone: {
    id: 'crowded_zone',
    label: 'Crowded Zone Spillover',
    defaultSeverity: 'medium',
    icon: 'Users',
    suggestedAction: 'Regulate entrance rate and guide attendees to overflow seating / calmer zones',
    initialStatusImpact: 'orange',
  },
  accessibility_issue: {
    id: 'accessibility_issue',
    label: 'Accessibility Barrier',
    defaultSeverity: 'high',
    icon: 'Accessibility',
    suggestedAction: 'Immediate priority: dispatch Accessibility Lead Anita to assist and clear barrier',
    initialStatusImpact: 'red',
  },
  lost: {
    id: 'lost',
    label: 'Lost / Wayfinding Help',
    defaultSeverity: 'low',
    icon: 'Compass',
    suggestedAction: 'Position roving information volunteer or guide attendee toward central Help Desk',
    initialStatusImpact: 'yellow',
  },
  medical: {
    id: 'medical',
    label: 'Medical / First Aid',
    defaultSeverity: 'high',
    icon: 'HeartPulse',
    suggestedAction: 'Urgent priority: dispatch Dr. David Pinto with first aid kit and clear direct corridor',
    initialStatusImpact: 'red',
  },
};

/**
 * Explicit confidence calculation based on count and verification:
 * - 1-2 reports / 10min = 'low'
 * - 3-5 reports = 'medium'
 * - 6+ reports OR staff-confirmed = 'high'
 */
export function calculateConfidence(reportCount, isStaffConfirmed = false) {
  if (isStaffConfirmed || reportCount >= 6) {
    return {
      level: 'high',
      rationale: isStaffConfirmed 
        ? 'Verified by on-site staff' 
        : `${reportCount} correlated reports in 10-min window (threshold: ≥6)`,
    };
  }
  if (reportCount >= 3) {
    return {
      level: 'medium',
      rationale: `${reportCount} correlated reports in 10-min window (threshold: 3–5)`,
    };
  }
  return {
    level: 'low',
    rationale: `${reportCount} initial report in 10-min window (threshold: 1–2)`,
  };
}

/**
 * Determine zone status severity based on active incidents
 * Max 4 status colors: 'green' | 'yellow' | 'orange' | 'red'
 */
export function computeZoneStatus(incidentsInZone) {
  const active = incidentsInZone.filter(inc => inc.status !== 'resolved');
  if (active.length === 0) {
    return {
      status: 'green',
      reasonString: 'Green: Flow optimal — all recent friction reports cleared',
    };
  }

  // Check if any critical accessibility or high severity incident
  const hasRed = active.some(inc => 
    inc.severity === 'high' || 
    inc.category === 'accessibility_issue' || 
    inc.category === 'medical' ||
    inc.affectedCount >= 20
  );
  if (hasRed) {
    const primary = active.find(inc => inc.severity === 'high') || active[0];
    return {
      status: 'red',
      reasonString: `Red: ${primary.issueTitle} (${primary.affectedCount} affected)`,
    };
  }

  // Check for orange (high crowd or 5+ reports)
  const hasOrange = active.some(inc => 
    inc.severity === 'medium' || 
    inc.category === 'crowded_zone' || 
    inc.affectedCount >= 5
  );
  if (hasOrange) {
    const primary = active.find(inc => inc.category === 'crowded_zone') || active[0];
    return {
      status: 'orange',
      reasonString: `Orange: ${primary.affectedCount} reports in recent window (${primary.issueTitle})`,
    };
  }

  // Otherwise yellow
  const count = active.reduce((acc, curr) => acc + curr.affectedCount, 0);
  return {
    status: 'yellow',
    reasonString: `Yellow: ${count} minor friction reports under review`,
  };
}

/**
 * Format elapsed duration (e.g. "4m 12s ago")
 */
export function formatDuration(ms) {
  const seconds = Math.max(0, Math.floor(ms / 1000));
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  if (m === 0) return `${s}s`;
  return `${m}m ${s.toString().padStart(2, '0')}s`;
}

/**
 * Calculate resolution delta text when incident is resolved
 */
export function calculateResolutionDelta(initialStatus, finalStatus, durationMs) {
  const durationMin = Math.max(1, Math.round(durationMs / 60000));
  const from = initialStatus.toUpperCase();
  const to = finalStatus.toUpperCase();
  return `Reduced from ${from} to ${to} in ${durationMin} min`;
}
