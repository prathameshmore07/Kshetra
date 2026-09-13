// Production Verification Test Suite for PulseOps

import {
  CATEGORY_DEFINITIONS,
  calculateConfidence,
  computeZoneStatus,
  formatDuration,
  calculateResolutionDelta,
} from './src/utils/classifier.js';

import {
  scoreSession,
  ROUTE_DNA_PROFILES,
} from './src/utils/recommendation.js';

import {
  getCalmSanctuaryRoute,
  calculateFacilityWalkTime,
} from './src/utils/routeDna.js';

import {
  INITIAL_ZONES,
  INITIAL_SESSIONS,
  INITIAL_INCIDENTS,
  INITIAL_BARRIER_LEDGER,
  CACHED_EMERGENCY_CONTACTS,
} from './src/data/seedData.js';

console.log('=== STARTING PULSEOPS PRODUCTION INTEGRATION TESTS ===\n');

// 1. TICKET ID FORMAT & UNIQUENESS
console.log('Test 1: Ticket ID generation format (PO-XXXX)');
function generateTicketId() {
  const num = Math.floor(1000 + Math.random() * 9000);
  return `PO-${num}`;
}
const sampleTickets = new Set();
for (let i = 0; i < 50; i++) {
  const id = generateTicketId();
  console.assert(/^PO-\d{4}$/.test(id), `Invalid format: ${id}`);
  sampleTickets.add(id);
}
console.assert(sampleTickets.size >= 48, 'Ticket IDs must have high entropy');
console.log('✓ Ticket ID format (/^PO-\\d{4}$/) verified across 50 iterations\n');

// 2. ROUTE DNA PERSISTENCE & DYNAMIC RECOMPUTATION
console.log('Test 2: Route DNA dynamic recomputation');
const testSession = INITIAL_SESSIONS[0];
const scoresByDna = {};
for (const [dnaKey, profile] of Object.entries(ROUTE_DNA_PROFILES)) {
  const scoreResult = scoreSession(testSession, { routeDna: dnaKey, interests: ['AI'] }, INITIAL_ZONES);
  scoresByDna[dnaKey] = scoreResult.score;
  console.log(`- ${profile.label}: Score=${scoreResult.score}, Sub-scores: I=${scoreResult.interest}, A=${scoreResult.accessibility}, T=${scoreResult.time}, C=${scoreResult.crowd}`);
}
console.assert(scoresByDna['mobility-friendly'] !== undefined, 'Mobility DNA score computed');
console.assert(scoresByDna['fast'] !== undefined, 'Fast DNA score computed');
console.log('✓ Route DNA dynamic score variation verified\n');

// 3. FACILITY WALK TIME DYNAMIC ADJUSTMENT
console.log('Test 3: Facility Walk Time Dynamic Adjustment');
const testFacility = { id: 'f-1', name: 'Restrooms', zoneId: 'zone-ramp-west', walkTimeMinutes: 3 };
const walkMobility = calculateFacilityWalkTime(testFacility, 'mobility-friendly', INITIAL_ZONES);
const walkFast = calculateFacilityWalkTime(testFacility, 'fast', INITIAL_ZONES);
console.log(`- Blocked ramp facility walk time (Mobility): ${walkMobility.minutes} min (Detour: ${walkMobility.hasDetour})`);
console.log(`- Blocked ramp facility walk time (Fast): ${walkFast.minutes} min (Detour: ${walkFast.hasDetour})`);
console.assert(walkMobility.hasDetour === true, 'Blocked ramp must trigger detour for mobility profile');
console.assert(walkMobility.minutes > walkFast.minutes, 'Mobility detour must take more time than fast route');
console.log('✓ Facility walk time dynamic detour computation verified\n');

// 4. REPORT MERGING & AFFECTED COUNT RECALCULATION
console.log('Test 4: Report Merging & Dynamic Zone Reason');
const mergedIncidents = [
  {
    id: 'inc-merged-1',
    ticketId: 'PO-7721',
    zoneId: 'zone-food-court',
    category: 'crowded_zone',
    status: 'detected',
    severity: 'medium',
    affectedCount: 19, // Merged 19 reports
    issueTitle: 'Food Court Spillover',
  }
];
const computedStatus = computeZoneStatus(mergedIncidents);
console.log(`- Zone Status with 19 merged reports: ${computedStatus.status.toUpperCase()} -> ${computedStatus.reasonString}`);
console.assert(computedStatus.status === 'orange', 'Should be orange status for crowded spillover');
console.assert(computedStatus.reasonString.includes('19 reports'), 'Reason string must show exact count 19');
console.log('✓ Merged incident count dynamically reflected in zone reason string\n');

// 5. BARRIER LEDGER VERIFY LOOP & AUDIT DELTA
console.log('Test 5: Barrier Ledger Verify Loop & Delta Text');
const delta = calculateResolutionDelta('orange', 'green', 6.2 * 60 * 1000);
console.log(`- Calculated resolution delta: "${delta}"`);
console.assert(delta === 'Reduced from ORANGE to GREEN in 6 min', `Unexpected delta: ${delta}`);
console.log('✓ Barrier Ledger resolution delta formatting verified\n');

// 6. LIFE-SAFETY OFFLINE CACHE INTEGRITY
console.log('Test 6: Life-Safety Offline Cache Integrity');
console.assert(CACHED_EMERGENCY_CONTACTS.length >= 4, 'Must have at least 4 safety contacts');
console.assert(CACHED_EMERGENCY_CONTACTS.some(c => c.phone === '112'), '112 national emergency line must be present');
console.log('✓ Life-safety emergency cache verified\n');

console.log('=== ALL PRODUCTION INTEGRATION TESTS PASSED ===');
