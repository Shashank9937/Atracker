const STORAGE_KEY = 'founder-os::workspace';
const AI_STORAGE_KEY = 'founder-os::ai-section';
const MIGRATION_KEY = 'founder-os::migration::ai-v1';

const safeParse = (raw) => {
  try {
    return raw ? JSON.parse(raw) : null;
  } catch (error) {
    return null;
  }
};

export const loadStorageSnapshot = () => {
  try {
    const namespace = {};
    const keys = [];

    for (let index = 0; index < window.localStorage.length; index += 1) {
      const key = window.localStorage.key(index);
      if (!key || !key.startsWith('founder-os::')) continue;
      keys.push(key);
      namespace[key] = safeParse(window.localStorage.getItem(key));
    }

    return {
      workspace: namespace[STORAGE_KEY] || null,
      aiMirror: namespace[AI_STORAGE_KEY] || null,
      migration: namespace[MIGRATION_KEY] || null,
      namespace,
      keys,
    };
  } catch (error) {
    console.error('Failed to inspect Founder OS storage', error);
    return {
      workspace: null,
      aiMirror: null,
      migration: null,
      namespace: {},
      keys: [],
    };
  }
};

export const loadAppData = () => loadStorageSnapshot().workspace;

export const saveAppData = (data) => {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    window.localStorage.setItem(
      AI_STORAGE_KEY,
      JSON.stringify({
        ...(data.ai || {}),
        savedAt: new Date().toISOString(),
      }),
    );
    window.localStorage.setItem(
      MIGRATION_KEY,
      JSON.stringify({
        version: 'ai-v1',
        migratedAt: new Date().toISOString(),
      }),
    );
  } catch (error) {
    console.error('Failed to persist Founder OS data', error);
  }
};

export const getStorageDiagnostics = () => {
  const snapshot = loadStorageSnapshot();
  return {
    keys: snapshot.keys,
    hasWorkspace: Boolean(snapshot.workspace),
    hasAiMirror: Boolean(snapshot.aiMirror),
    migration: snapshot.migration,
  };
};

export const storageKey = STORAGE_KEY;
export const aiStorageKey = AI_STORAGE_KEY;
export const migrationKey = MIGRATION_KEY;
