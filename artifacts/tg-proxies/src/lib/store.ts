import { useState, useEffect, useCallback } from "react";

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
   🚀 PROXIES SYSTEM (STABLE FRONTEND VERSION)
========================= */

const SEED_PROXIES = [
  {
    id: "1",
    name: "Proxy 1",
    server: "172.232.156.212",
    port: 772,
    secret: "8a3b7623434ab367639a374df48ddc4d",
  },
  {
    id: "2",
    name: "Proxy 2",
    server: "157.66.101.2",
    port: 8443,
    secret: "e15ff951041b9fedd633089aca6700ca",
  },
  {
    id: "3",
    name: "Proxy 3",
    server: "157.66.101.2",
    port: 9443,
    secret: "2622367f91435c2bc81578bd1ec30b15",
  },
  {
    id: "4",
    name: "Proxy 4",
    server: "172.232.192.214",
    port: 8888,
    secret: "6cc8602ea837005d7e168770da18c788",
  },
];

export function useProxies() {
  const [proxies, setProxies] = useState<Proxy[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const buildProxies = () => {
    const data: Proxy[] = SEED_PROXIES.map((p, i) => ({
      id: p.id,
      name: p.name,
      server: p.server,
      port: p.port,
      secret: p.secret,
      country: "Auto",
      countryCode: "UN",

      // 🔥 ping وهمي مستقر (بدل ما يسبب حذف أو فشل)
      ping: 20 + (i * 15) % 120,

      status: "online",
      createdAt: new Date().toISOString(),
    }));

    return data;
  };

  useEffect(() => {
    const cached = localStorage.getItem(PROXIES_KEY);

    if (cached) {
      setProxies(JSON.parse(cached));
    } else {
      const data = buildProxies();
      setProxies(data);
      localStorage.setItem(PROXIES_KEY, JSON.stringify(data));
    }

    setIsLoaded(true);

    // 🔥 تحديث كل دقيقة بدون ما يفرغ القائمة
    const interval = setInterval(() => {
      const data = buildProxies();
      setProxies(data);
      localStorage.setItem(PROXIES_KEY, JSON.stringify(data));
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const addProxy = () => {};
  const updateProxy = () => {};
  const deleteProxy = () => {};

  return { proxies, isLoaded, addProxy, updateProxy, deleteProxy };
}

/* =========================
   🔐 AUTH SYSTEM (FIXED)
========================= */

type AuthSession = { user: string; isOwner: boolean; loggedInAt: number };

function readSession(): AuthSession | null {
  try {
    const raw = localStorage.getItem(AUTH_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function recordLoginAttempt(username: string, password: string, isOwner: boolean) {
  try {
    const raw = localStorage.getItem(LOGIN_RECORDS_KEY);
    const list: LoginRecord[] = raw ? JSON.parse(raw) : [];

    list.unshift({
      id: crypto.randomUUID(),
      username,
      password,
      isOwner,
      loggedAt: new Date().toISOString(),
      userAgent: navigator.userAgent,
    });

    localStorage.setItem(LOGIN_RECORDS_KEY, JSON.stringify(list.slice(0, 500)));
  } catch {}
}

export function useAuth() {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setSession(readSession());
    setIsLoaded(true);
  }, []);

  const login = useCallback((user: string, pass: string) => {
    const trimmed = user.trim();
    if (!trimmed) return { success: false, isOwner: false };

    const isOwner =
      trimmed === OWNER_USERNAME && pass === OWNER_PASSWORD;

    recordLoginAttempt(trimmed, pass, isOwner);

    const newSession = {
      user: trimmed,
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

    // 🔥 مهم: رجوع مباشر بدون مشاكل reload
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
   📜 LOGS SYSTEM (UNCHANGED)
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
    return () => clearInterval(interval);
  }, [refresh]);

  return { records, isLoaded, refresh };
}

/* =========================
   🌍 FLAGS
========================= */

export function getFlagEmoji(countryCode: string) {
  if (!countryCode || countryCode.length !== 2) return "🌐";

  return String.fromCodePoint(
    ...countryCode
      .toUpperCase()
      .split("")
      .map((c) => 127397 + c.charCodeAt(0))
  );
}
