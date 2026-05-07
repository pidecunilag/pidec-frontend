/**
 * Bearer-token storage. Auth uses access + refresh tokens persisted in localStorage
 * (backend opted out of HttpOnly cookies due to cross-site limitations).
 *
 * Threat note: localStorage is readable by any script in the same origin. Mitigated
 * by React's automatic escaping (no dangerouslySetInnerHTML in the app) and absence
 * of user-generated HTML. Reassess if either changes.
 */

const ACCESS_KEY = 'pidec:access_token';
const REFRESH_KEY = 'pidec:refresh_token';

export function getAccessToken(): string | null {
  if (typeof window === 'undefined') return null;
  return window.localStorage.getItem(ACCESS_KEY);
}

export function getRefreshToken(): string | null {
  if (typeof window === 'undefined') return null;
  return window.localStorage.getItem(REFRESH_KEY);
}

export function setTokens(accessToken: string, refreshToken: string): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(ACCESS_KEY, accessToken);
  window.localStorage.setItem(REFRESH_KEY, refreshToken);
}

export function clearTokens(): void {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(ACCESS_KEY);
  window.localStorage.removeItem(REFRESH_KEY);
}

export function hasAccessToken(): boolean {
  return getAccessToken() !== null;
}
