/**
 * localStorage that never throws. Storage can be unavailable (private mode,
 * blocked site data, sandboxed previews); the app keeps working in memory.
 */
const memory = new Map<string, string>();

const raw = {
  get(key: string): string | null {
    try {
      return localStorage.getItem(key);
    } catch {
      return memory.get(key) ?? null;
    }
  },
  set(key: string, value: string) {
    try {
      localStorage.setItem(key, value);
    } catch {
      memory.set(key, value);
    }
  },
  remove(key: string) {
    try {
      localStorage.removeItem(key);
    } catch {
      memory.delete(key);
    }
  },
};

export const storage = {
  get<T>(key: string, fallback: T): T {
    const value = raw.get(key);
    if (value == null) return fallback;
    try {
      return JSON.parse(value) as T;
    } catch {
      return fallback;
    }
  },
  set(key: string, value: unknown) {
    raw.set(key, JSON.stringify(value));
  },
  remove: raw.remove,
  getRaw: raw.get,
  setRaw: raw.set,
};
