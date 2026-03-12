const STORAGE_KEY = 'founder-os::workspace';

export const loadAppData = () => {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (error) {
    console.error('Failed to load Founder OS data', error);
    return null;
  }
};

export const saveAppData = (data) => {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to persist Founder OS data', error);
  }
};

export const storageKey = STORAGE_KEY;
