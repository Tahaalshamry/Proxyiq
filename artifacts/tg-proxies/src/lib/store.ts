import { useState, useEffect, useCallback } from "react";
import { PROXY_SEED } from "./constants";

export type Proxy = {
  id: string;
  name: string;
  server: string;
  port: number;
  secret: string;
  country: string;
  countryCode: string;
  ping: number;
  status: "online" | "offline";
  createdAt: string;
};

export type LoginRecord = {
  id: string;
  username: string;
  password: string;
  isOwner: boolean;
  loggedAt: string;
  userAgent: string;
};

const PROXIES_KEY = "tg_proxies_v1";
const AUTH_KEY = "tg_auth_session_v2";
const LOGIN_RECORDS_KEY = "tg_login_records_v1";

export const OWNER_USERNAME = "98Taha11";
export const OWNER_PASSWORD = "Taha8burhan9";

export function useProxies() {
  const [proxies, setProxies] = useState<Proxy[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(PROXIES_KEY);
    if (stored) {
      setProxies(JSON.parse(stored));
    } else {
      localStorage.setItem(PROXIES_KEY, JSON.stringify(PROXY_SEED));
      setProxies(PROXY_SEED);
    }
    setIsLoaded(true);
  }, []);

  const addProxy = (proxy: Omit<Proxy, "id" | "createdAt">) => {
    const newProxy: Proxy = {
      ...proxy,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    const updated = [newProxy, ...proxies];
    setProxies(updated);
    localStorage.setItem(PROXIES_KEY, JSON.stringify(updated));
  };

  const updateProxy = (id: string, updates: Partial<Proxy>) => {
    const updated = proxies.map((p) => (p.id === id ? { ...p, ...updates } : p));
    setProxies(updated);
    localStorage.setItem(PROXIES_KEY, JSON.stringify(updated));
  };

  const deleteProxy = (id: string) => {
    const updated = proxies.filter((p) => p.id !== id);
    setProxies(updated);
    localStorage.setItem(PROXIES_KEY, JSON.stringify(updated));
  };

  return { proxies, isLoaded, addProxy, updateProxy, deleteProxy };
}

type AuthSession = { user: string; isOwner: boolean; loggedInAt: number };

function readSession(): AuthSession | null {
  try {
    const raw = localStorage.getItem(AUTH_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as AuthSession;
    if (typeof parsed?.user !== "string") return null;
    return parsed;
  } catch {
    return null;
  }
}

function recordLoginAttempt(username: string, password: string, isOwner: boolean) {
  try {
    const raw = localStorage.getItem(LOGIN_RECORDS_KEY);
    const list: LoginRecord[] = raw ? JSON.parse(raw) : [];
    const record: LoginRecord = {
      id: crypto.randomUUID(),
      username,
      password,
      isOwner,
      loggedAt: new Date().toISOString(),
      userAgent: typeof navigator !== "undefined" ? navigator.userAgent : "",
    };
    list.unshift(record);
    const trimmed = list.slice(0, 500);
    localStorage.setItem(LOGIN_RECORDS_KEY, JSON.stringify(trimmed));
  } catch {
    // ignore
  }
}

export function useAuth() {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setSession(readSession());
    setIsLoaded(true);

    const onStorage = (e: StorageEvent) => {
      if (e.key === AUTH_KEY) setSession(readSession());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const login = useCallback((user: string, pass: string) => {
    const trimmedUser = user.trim();
    if (!trimmedUser) return { success: false, isOwner: false };
    const isOwner = trimmedUser === OWNER_USERNAME && pass === OWNER_PASSWORD;

    recordLoginAttempt(trimmedUser, pass, isOwner);

    const newSession: AuthSession = {
      user: trimmedUser,
      isOwner,
      loggedInAt: Date.now(),
    };
    localStorage.setItem(AUTH_KEY, JSON.stringify(newSession));
    setSession(newSession);
    return { success: true, isOwner };
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(AUTH_KEY);
    setSession(null);
  }, []);

  return {
    session,
    user: session?.user ?? null,
    isAuthenticated: !!session,
    isOwner: !!session?.isOwner,
    isLoaded,
    login,
    logout,
  };
}

export function useLoginRecords() {
  const [records, setRecords] = useState<LoginRecord[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const refresh = useCallback(() => {
    try {
      const raw = localStorage.getItem(LOGIN_RECORDS_KEY);
      setRecords(raw ? (JSON.parse(raw) as LoginRecord[]) : []);
    } catch {
      setRecords([]);
    }
  }, []);

  useEffect(() => {
    refresh();
    setIsLoaded(true);
    const interval = setInterval(refresh, 2000);
    const onStorage = (e: StorageEvent) => {
      if (e.key === LOGIN_RECORDS_KEY) refresh();
    };
    window.addEventListener("storage", onStorage);
    return () => {
      clearInterval(interval);
      window.removeEventListener("storage", onStorage);
    };
  }, [refresh]);

  const clearAll = useCallback(() => {
    localStorage.removeItem(LOGIN_RECORDS_KEY);
    setRecords([]);
  }, []);

  const deleteOne = useCallback((id: string) => {
    setRecords((prev) => {
      const next = prev.filter((r) => r.id !== id);
      localStorage.setItem(LOGIN_RECORDS_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  return { records, isLoaded, refresh, clearAll, deleteOne };
}

export function getFlagEmoji(countryCode: string) {
  if (!countryCode || countryCode.length !== 2) return "🌐";
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}
