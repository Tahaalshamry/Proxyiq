import { useState, useEffect } from "react";
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

const PROXIES_KEY = "tg_proxies_v1";
const AUTH_KEY = "tg_auth_session";

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

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const session = localStorage.getItem(AUTH_KEY);
    if (session) {
      const parsed = JSON.parse(session);
      if (parsed.user === "98Taha11") {
        setIsAuthenticated(true);
      }
    }
    setIsLoaded(true);
  }, []);

  const login = (user: string, pass: string) => {
    if (user === "98Taha11" && pass === "Taha8burhan9") {
      localStorage.setItem(
        AUTH_KEY,
        JSON.stringify({ user, loggedInAt: Date.now() })
      );
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    localStorage.removeItem(AUTH_KEY);
    setIsAuthenticated(false);
  };

  return { isAuthenticated, isLoaded, login, logout };
}

export function getFlagEmoji(countryCode: string) {
  if (!countryCode || countryCode.length !== 2) return "🌐";
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}
