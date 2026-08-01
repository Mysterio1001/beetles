export function clearStoredValue(storage, key) {
  if (!storage || !key) return false;

  try {
    storage.removeItem(key);
    return true;
  } catch {
    return false;
  }
}

export function readStoredJson(storage, key, fallback, validate = () => true) {
  if (!storage || !key) return fallback;

  try {
    const rawValue = storage.getItem(key);
    if (rawValue === null) return fallback;

    const value = JSON.parse(rawValue);
    if (!validate(value)) {
      clearStoredValue(storage, key);
      return fallback;
    }

    return value;
  } catch {
    clearStoredValue(storage, key);
    return fallback;
  }
}

export function writeStoredJson(storage, key, value) {
  if (!storage || !key) return false;

  try {
    storage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}
