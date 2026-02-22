import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

/**
 * Pre-configured axios instance that reads the auth token from localStorage
 * and attaches it as a Bearer token on every request.
 */
export const api = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("talentos_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

/**
 * Returns the stored org object from localStorage, or null.
 */
export function getStoredOrg(): { id: string; name: string; email: string } | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = localStorage.getItem("talentos_org");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

/**
 * Returns the stored auth token or null.
 */
export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("talentos_token");
}

/**
 * Clears all auth data from localStorage.
 */
export function clearAuth(): void {
  localStorage.removeItem("talentos_token");
  localStorage.removeItem("talentos_org");
  localStorage.removeItem("talentos_role");
  localStorage.removeItem("talentos_employee");
}

/**
 * Returns the stored role ('admin' | 'employee') or null.
 */
export function getStoredRole(): "admin" | "employee" | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("talentos_role") as "admin" | "employee" | null;
}

/**
 * Returns the stored employee object from localStorage, or null.
 */
export function getStoredEmployee(): {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
} | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem("talentos_employee");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}
