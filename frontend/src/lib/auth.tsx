"use client";
import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { api, post, getToken, setToken } from "@/lib/api";

export interface AuthUser {
  id: string;
  role: "admin" | "ambassador";
  ambassadorId?: string | null;
  email?: string;
  name?: string | null;
}

interface LoginResult {
  token: string;
  user: AuthUser;
}

interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<AuthUser>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setTok] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Hydrate from localStorage on mount.
  useEffect(() => {
    const t = getToken();
    if (t) {
      setTok(t);
      // Decode the JWT payload (base64url) to recover the user without a round-trip.
      try {
        const payload = JSON.parse(atob(t.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")));
        setUser({
          id: payload.id,
          role: payload.role,
          ambassadorId: payload.ambassadorId ?? null,
          email: payload.email,
          name: payload.name ?? null,
        });
      } catch {
        setToken(null);
      }
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<AuthUser> => {
    const res = await post<LoginResult>("/auth/login", { email, password });
    setToken(res.token);
    setTok(res.token);
    setUser(res.user);
    return res.user;
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setTok(null);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, token, isAuthenticated: !!user, loading, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}

// Convenience: post with the auth api instance (token auto-attached by interceptor).
export { api };
