// Safety-Critical Offline Cache Layer
// Stores emergency contacts, last-known zone statuses, and venue map data in localStorage
// Separate from standard Firebase sync to ensure life-safety availability in dead zones

import { CACHED_EMERGENCY_CONTACTS } from '../data/seedData';

const CACHE_KEYS = {
  SAFETY_CONTACTS: 'kshetra_safety_contacts',
  ZONE_STATUSES: 'kshetra_cached_zones',
  FACILITIES: 'kshetra_cached_facilities',
  LAST_SYNC_TIME: 'kshetra_safety_cache_timestamp',
  SIMULATED_OFFLINE: 'kshetra_simulated_offline',
};

/**
 * Initialize and update the offline safety cache with current zone and facility data
 */
export function updateSafetyCache(zones, facilities) {
  try {
    localStorage.setItem(CACHE_KEYS.SAFETY_CONTACTS, JSON.stringify(CACHED_EMERGENCY_CONTACTS));
    if (zones && zones.length > 0) {
      localStorage.setItem(CACHE_KEYS.ZONE_STATUSES, JSON.stringify(zones));
    }
    if (facilities && facilities.length > 0) {
      localStorage.setItem(CACHE_KEYS.FACILITIES, JSON.stringify(facilities));
    }
    localStorage.setItem(CACHE_KEYS.LAST_SYNC_TIME, new Date().toISOString());
  } catch (err) {
    console.warn('Could not write to safety localStorage cache:', err);
  }
}

/**
 * Read safety-critical data from offline cache
 */
export function getSafetyCache() {
  try {
    const rawContacts = localStorage.getItem(CACHE_KEYS.SAFETY_CONTACTS);
    const rawZones = localStorage.getItem(CACHE_KEYS.ZONE_STATUSES);
    const rawFacilities = localStorage.getItem(CACHE_KEYS.FACILITIES);
    const timestamp = localStorage.getItem(CACHE_KEYS.LAST_SYNC_TIME);

    return {
      contacts: rawContacts ? JSON.parse(rawContacts) : CACHED_EMERGENCY_CONTACTS,
      zones: rawZones ? JSON.parse(rawZones) : null,
      facilities: rawFacilities ? JSON.parse(rawFacilities) : null,
      lastSyncTime: timestamp || 'Initial build',
    };
  } catch (err) {
    console.warn('Could not read from safety cache:', err);
    return {
      contacts: CACHED_EMERGENCY_CONTACTS,
      zones: null,
      facilities: null,
      lastSyncTime: 'Offline fallback',
    };
  }
}

/**
 * Check simulated offline mode
 */
export function isSimulatedOffline() {
  return localStorage.getItem(CACHE_KEYS.SIMULATED_OFFLINE) === 'true';
}

export function setSimulatedOffline(val) {
  localStorage.setItem(CACHE_KEYS.SIMULATED_OFFLINE, val ? 'true' : 'false');
  window.dispatchEvent(new Event('kshetra_connectivity_change'));
}
