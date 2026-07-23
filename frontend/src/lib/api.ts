import axios from "axios";

// Backend API base URL. Override with NEXT_PUBLIC_API_URL (see .env).
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

// Token storage helpers (localStorage-backed).
const TOKEN_KEY = "gajab_token";

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string | null): void {
  if (typeof window === "undefined") return;
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// Attach the bearer token to every outgoing request.
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers = config.headers ?? {};
    (config.headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

// Standard API envelope returned by list endpoints.
export interface ApiList<T> {
  data: T[];
  total: number;
}

export async function get<T>(url: string, params?: Record<string, unknown>): Promise<T> {
  const res = await api.get<T>(url, { params });
  return res.data;
}

export async function post<T>(url: string, body?: unknown): Promise<T> {
  const res = await api.post<T>(url, body);
  return res.data;
}

export async function put<T>(url: string, body?: unknown): Promise<T> {
  const res = await api.put<T>(url, body);
  return res.data;
}

export async function del<T>(url: string): Promise<T> {
  const res = await api.delete<T>(url);
  return res.data;
}

/**
 * Download a binary response (blob) from the given URL.
 * Triggers a browser file-save automatically.
 */
export async function downloadBlob(url: string, filename: string): Promise<void> {
  const res = await api.get(url, { responseType: "blob" });
  const blob = new Blob([res.data], {
    type: res.headers["content-type"] ?? "application/octet-stream",
  });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(link.href);
}
