// Firebase Configuration & Optional Live Firestore Adapter
// Works 100% offline / standalone via reactive store; seamlessly activates if credentials provided

export const getStoredFirebaseConfig = () => {
  try {
    const raw = localStorage.getItem('kshetra_firebase_config');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const saveFirebaseConfig = (config) => {
  if (!config) {
    localStorage.removeItem('kshetra_firebase_config');
  } else {
    localStorage.setItem('kshetra_firebase_config', JSON.stringify(config));
  }
};

export const isFirebaseConfigured = () => {
  const cfg = getStoredFirebaseConfig();
  return Boolean(cfg && cfg.apiKey && cfg.projectId);
};
