export interface EventisUser {
  id: string;
  username: string;
  fullName: string;
  phone?: string;
  email?: string;
  avatarUrl: string;
  isPhoneVerified: boolean;
  isBusinessAccount: boolean;
  bio?: string;
}

export const AUTH_USER_KEY = "eventis-user";
export const AUTH_CHANGE_EVENT = "eventis-auth-change";

export const DEFAULT_DEMO_USER: EventisUser = {
  id: "usr_kigali_1",
  username: "eventis_explorer",
  fullName: "Eric Mugisha",
  phone: "+250 788 123 456",
  email: "eric@eventis.rw",
  avatarUrl: "/eve1.jpg",
  isPhoneVerified: true,
  isBusinessAccount: false,
  bio: "Discovering culture, music and tech in Kigali 🇷🇼",
};

export function getStoredUser(): EventisUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(AUTH_USER_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as EventisUser;
  } catch {
    return null;
  }
}

export function saveUserSession(user: EventisUser): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
  window.dispatchEvent(new Event(AUTH_CHANGE_EVENT));
}

export function clearUserSession(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(AUTH_USER_KEY);
  window.dispatchEvent(new Event(AUTH_CHANGE_EVENT));
}
