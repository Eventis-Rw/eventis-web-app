"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  AUTH_CHANGE_EVENT,
  clearUserSession,
  getStoredUser,
  type EventisUser,
} from "../lib/auth";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Inbox", href: "/inbox" },
  { label: "Saved", href: "/saved" },
  { label: "About", href: "/users/about" },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isPoster, setIsPoster] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);

  // Authenticated user state & dropdown
  const [currentUser, setCurrentUser] = useState<EventisUser | null>(null);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isGetAppOpen, setIsGetAppOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    queueMicrotask(() => {
      const params = new URLSearchParams(window.location.search);
      setSearchQuery(params.get("search") ?? "");
      setIsMenuOpen(false);
      setIsProfileMenuOpen(false);
    });
  }, [pathname]);

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    if (pathname === "/") {
      const params = new URLSearchParams(window.location.search);
      if (query.trim()) {
        params.set("search", query.trim());
      } else {
        params.delete("search");
      }
      const newUrl = params.toString() ? `/?${params.toString()}` : "/";
      window.history.replaceState(null, "", newUrl);
      window.dispatchEvent(
        new CustomEvent("eventis-event-search", {
          detail: { search: query.trim(), category: params.get("category") || "All" },
        })
      );
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pathname !== "/") {
      router.push(`/?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  useEffect(() => {
    const syncRole = () => setIsPoster(localStorage.getItem("eventis-role") === "poster");
    const syncUser = () => setCurrentUser(getStoredUser());
    const savedTheme = localStorage.getItem("eventis-theme");
    const theme =
      savedTheme === "dark" || savedTheme === "light"
        ? savedTheme
        : window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";

    queueMicrotask(() => {
      syncRole();
      syncUser();
    });

    document.documentElement.dataset.theme = theme;
    window.addEventListener("eventis-role-change", syncRole);
    window.addEventListener(AUTH_CHANGE_EVENT, syncUser);
    window.addEventListener("storage", syncRole);
    window.addEventListener("storage", syncUser);

    return () => {
      window.removeEventListener("eventis-role-change", syncRole);
      window.removeEventListener(AUTH_CHANGE_EVENT, syncUser);
      window.removeEventListener("storage", syncRole);
      window.removeEventListener("storage", syncUser);
    };
  }, []);

  // Close profile dropdown on outside click or escape
  useEffect(() => {
    if (!isProfileMenuOpen) return;
    const handleOutsideClick = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    };
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsProfileMenuOpen(false);
    };
    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isProfileMenuOpen]);

  useEffect(() => {
    if (!isMenuOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsMenuOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [isMenuOpen]);

  useEffect(() => {
    if (!isGetAppOpen) return;
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsGetAppOpen(false);
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isGetAppOpen]);

  const handleLogout = () => {
    setIsProfileMenuOpen(false);
    setIsMenuOpen(false);
    clearUserSession();
    router.push("/");
  };

  function isActive(href: string) {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  const links = [...navLinks, ...(isPoster ? [{ label: "Event Post", href: "/events/create" }] : [])];

  return (
    <header className={`eventis-navbar sticky top-0 z-50 w-full bg-transparent transition-all duration-200 ${isScrolled ? "is-scrolled" : ""}`}>
      <div className="mx-auto flex min-h-[76px] w-full max-w-[1500px] items-center justify-between gap-3 px-4 py-2 sm:px-6 lg:px-8">
        <Link href="/" aria-label="Eventis home" className="eventis-logo-lockup shrink-0">
          <Image src="/eventis-logo.svg" alt="" width={56} height={56} priority className="h-14 w-14 object-contain" />
        </Link>

        {/* Topbar Search Bar (Instagram Web Style) */}
        <div className="relative flex-1 max-w-[220px] sm:max-w-[280px] md:max-w-[340px] mx-1 sm:mx-2">
          <form onSubmit={handleSearchSubmit} className="relative w-full">
            <div className="flex items-center gap-2 bg-white/[0.06] hover:bg-white/[0.09] focus-within:bg-[#070814]/80 border border-white/[0.12] focus-within:border-[#00A3FF] rounded-full px-3.5 py-1.5 sm:py-2 text-xs text-[#F4F7FF] transition-all">
              <svg className="w-4 h-4 text-[#A7B0C9] fill-none stroke-current stroke-2 shrink-0" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" strokeLinecap="round" />
              </svg>
              <input
                type="search"
                placeholder="Search events, venues…"
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full bg-transparent text-xs sm:text-sm text-[#F4F7FF] placeholder-[#A7B0C9] focus:outline-none"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => handleSearchChange("")}
                  className="w-4 h-4 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-[10px] text-[#A7B0C9] hover:text-[#F4F7FF] transition cursor-pointer shrink-0"
                  aria-label="Clear search"
                >
                  ✕
                </button>
              )}
            </div>
          </form>
        </div>

        <nav aria-label="Main navigation" className="hidden items-center justify-center xl:flex">
          <div className="flex items-center gap-0.5">
            {links.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                aria-current={isActive(link.href) ? "page" : undefined}
                className={`eventis-nav-link${isActive(link.href) ? " is-active" : ""}`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </nav>

        {/* Action Buttons: Get App, Logged In (Profile with Avatar + Logout) or Logged Out */}
        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          {/* Get App Button with App Store and Play Store Icons */}
          <button
            type="button"
            onClick={() => setIsGetAppOpen(true)}
            className="eventis-get-app-btn flex items-center gap-2 rounded-full px-3 py-1.5 sm:px-3.5 sm:py-2 text-xs font-bold transition-all cursor-pointer shrink-0"
            aria-label="Get Eventis App on App Store and Google Play"
          >
            <span className="flex items-center gap-1.5 shrink-0 opacity-95">
              {/* Apple App Store Icon */}
              <svg className="w-3.5 h-3.5 fill-current shrink-0" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.62-.75 1.04-1.8 0.92-2.85-.9.04-2 .6-2.65 1.35-.58.66-1.09 1.73-.95 2.76.99.08 2.04-.51 2.68-1.26z" />
              </svg>
              {/* Google Play Store Icon */}
              <svg className="w-3 h-3 fill-current shrink-0" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M3.609 1.814L13.793 12 3.61 22.186a2.03 2.03 0 0 1-.61-1.465V3.279c0-.585.228-1.119.609-1.465zm11.255 11.257l2.257 2.257-11.458 6.51 9.201-8.767zm2.257-2.257L14.864 8.56 5.663 3.328l11.458 6.486zm1.189 1.189l2.793 1.587c.725.412.725 1.085 0 1.497l-2.793 1.587-2.115-2.336 2.115-2.335z" />
              </svg>
            </span>
            <span>Get App</span>
          </button>

          {currentUser ? (
            /* Logged in: Profile avatar with Instagram-style dropdown */
            <div className="relative" ref={profileMenuRef}>
              <button
                type="button"
                onClick={() => setIsProfileMenuOpen((prev) => !prev)}
                className="flex items-center gap-2 p-1 pl-1.5 pr-2.5 rounded-full border border-white/20 bg-white/[0.06] hover:bg-white/[0.12] hover:border-[#00A3FF] transition cursor-pointer"
                aria-expanded={isProfileMenuOpen}
                aria-haspopup="true"
                aria-label="Account menu"
              >
                <div className="relative w-8 h-8 rounded-full overflow-hidden border border-white/30 shrink-0">
                  <Image
                    src={currentUser.avatarUrl || "/eve1.jpg"}
                    alt={currentUser.fullName}
                    fill
                    unoptimized
                    sizes="32px"
                    className="object-cover"
                  />
                </div>
                <span className="hidden sm:inline-block text-xs font-semibold text-[#F4F7FF] max-w-[100px] truncate">
                  {currentUser.fullName.split(" ")[0]}
                </span>
                <svg
                  className={`w-3.5 h-3.5 text-[#A7B0C9] transition-transform ${isProfileMenuOpen ? "rotate-180" : ""}`}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>

              {/* Instagram-style Profile Menu Dropdown */}
              {isProfileMenuOpen && (
                <div className="absolute right-0 top-full mt-2.5 w-64 rounded-2xl bg-[rgba(16,22,44,0.96)] backdrop-blur-2xl border border-white/[0.18] shadow-[0_20px_50px_rgba(0,0,0,0.7)] py-2 z-50 text-left">
                  {/* User info header */}
                  <div className="px-4 py-3 flex items-center gap-3 border-b border-white/[0.08]">
                    <div className="relative w-10 h-10 rounded-full overflow-hidden border border-white/30 shrink-0">
                      <Image
                        src={currentUser.avatarUrl || "/eve1.jpg"}
                        alt={currentUser.fullName}
                        fill
                        unoptimized
                        sizes="40px"
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-[#F4F7FF] truncate">{currentUser.fullName}</p>
                      <p className="text-xs text-[#A7B0C9] truncate">@{currentUser.username}</p>
                    </div>
                  </div>

                  {/* Menu navigation options */}
                  <div className="py-1">
                    <Link
                      href="/users/about"
                      onClick={() => setIsProfileMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-xs font-medium text-[#F4F7FF] hover:bg-white/[0.08] transition"
                    >
                      <svg className="w-4 h-4 text-[#A7B0C9] fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                      </svg>
                      Profile
                    </Link>
                    <Link
                      href="/saved"
                      onClick={() => setIsProfileMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-xs font-medium text-[#F4F7FF] hover:bg-white/[0.08] transition"
                    >
                      <svg className="w-4 h-4 text-[#A7B0C9] fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                      </svg>
                      Saved Events
                    </Link>
                    <Link
                      href="/events/create"
                      onClick={() => setIsProfileMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-xs font-medium text-[#F4F7FF] hover:bg-white/[0.08] transition"
                    >
                      <svg className="w-4 h-4 text-[#A7B0C9] fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="8" x2="12" y2="16" />
                        <line x1="8" y1="12" x2="16" y2="12" />
                      </svg>
                      Post an Event
                    </Link>
                  </div>

                  {/* Logout Button */}
                  <div className="border-t border-white/[0.08] pt-1">
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-semibold text-[#FF5252] hover:bg-[#FF5252]/10 transition cursor-pointer"
                    >
                      <svg className="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                        <polyline points="16 17 21 12 16 7" />
                        <line x1="21" y1="12" x2="9" y2="12" />
                      </svg>
                      Log out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Logged out: Login and Sign Up buttons */
            <>
              <div className="hidden items-center gap-1.5 xl:flex">
                <Link
                  href="/users/auth/login"
                  className="eventis-auth-login"
                >
                  Login
                </Link>

                <Link
                  href="/users/auth/register"
                  className="eventis-auth-primary inline-flex"
                >
                  Sign Up
                </Link>
              </div>

              <Link
                href="/users/auth/register"
                className="eventis-auth-primary inline-flex xl:hidden"
              >
                Sign Up
              </Link>
            </>
          )}

          <button
            type="button"
            onClick={() => setIsMenuOpen((open) => !open)}
            aria-expanded={isMenuOpen}
            aria-controls="eventis-mobile-navigation"
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            className="eventis-menu-button inline-flex h-10 w-10 shrink-0 items-center justify-center xl:hidden"
          >
            {isMenuOpen ? (
              <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 fill-none stroke-current" strokeWidth="1.8" strokeLinecap="round">
                <path d="m6 6 12 12M18 6 6 18" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 fill-none stroke-current" strokeWidth="1.8" strokeLinecap="round">
                <path d="M4 7h16M4 12h16M4 17h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMenuOpen && (
        <nav id="eventis-mobile-navigation" aria-label="Mobile navigation" className="eventis-mobile-panel xl:hidden">
          <div className="flex flex-col">
            {/* Mobile Get App Button */}
            <button
              type="button"
              onClick={() => {
                setIsMenuOpen(false);
                setIsGetAppOpen(true);
              }}
              className="w-full flex items-center justify-center gap-2.5 py-2.5 px-4 mb-3 rounded-xl border border-[#00A3FF]/30 text-[#00A3FF] bg-[#00A3FF]/10 text-xs font-bold hover:bg-[#00A3FF]/20 transition cursor-pointer"
            >
              <span className="flex items-center gap-1.5 shrink-0 opacity-95">
                {/* Apple App Store Icon */}
                <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.62-.75 1.04-1.8 0.92-2.85-.9.04-2 .6-2.65 1.35-.58.66-1.09 1.73-.95 2.76.99.08 2.04-.51 2.68-1.26z" />
                </svg>
                {/* Google Play Store Icon */}
                <svg className="w-3.5 h-3.5 fill-current shrink-0" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M3.609 1.814L13.793 12 3.61 22.186a2.03 2.03 0 0 1-.61-1.465V3.279c0-.585.228-1.119.609-1.465zm11.255 11.257l2.257 2.257-11.458 6.51 9.201-8.767zm2.257-2.257L14.864 8.56 5.663 3.328l11.458 6.486zm1.189 1.189l2.793 1.587c.725.412.725 1.085 0 1.497l-2.793 1.587-2.115-2.336 2.115-2.335z" />
                </svg>
              </span>
              <span>Get App</span>
            </button>

            {links.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                aria-current={isActive(link.href) ? "page" : undefined}
                className={`eventis-mobile-link${isActive(link.href) ? " is-active" : ""}`}
              >
                {link.label}
              </Link>
            ))}

            {currentUser ? (
              <div className="space-y-3 pt-4 border-t border-white/[0.08]">
                <div className="flex items-center gap-3 p-2.5 rounded-xl bg-white/[0.06] border border-white/[0.1]">
                  <div className="relative w-10 h-10 rounded-full overflow-hidden border border-white/20 shrink-0">
                    <Image
                      src={currentUser.avatarUrl || "/eve1.jpg"}
                      alt={currentUser.fullName}
                      fill
                      unoptimized
                      sizes="40px"
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-[#F4F7FF] truncate">{currentUser.fullName}</p>
                    <p className="text-xs text-[#A7B0C9] truncate">@{currentUser.username}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-[#FF5252]/30 text-[#FF5252] bg-[#FF5252]/10 text-xs font-bold hover:bg-[#FF5252]/20 transition cursor-pointer"
                >
                  <svg className="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                    <polyline points="16 17 21 12 16 7" />
                    <line x1="21" y1="12" x2="9" y2="12" />
                  </svg>
                  Log out
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3 pt-3 border-t border-white/[0.08]">
                <Link href="/users/auth/login" onClick={() => setIsMenuOpen(false)} className="eventis-auth-login">
                  Login
                </Link>
                <Link href="/users/auth/register" onClick={() => setIsMenuOpen(false)} className="eventis-auth-primary">
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </nav>
      )}

      {/* Get App Modal Dialog */}
      {isGetAppOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 backdrop-blur-md p-4"
          onClick={() => setIsGetAppOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="get-app-title"
        >
          <div
            className="relative w-full max-w-md rounded-3xl border border-white/[0.18] bg-[#0c1024]/95 p-6 sm:p-8 text-center shadow-[0_25px_60px_rgba(0,0,0,0.8)] backdrop-blur-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setIsGetAppOpen(false)}
              className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-white/[0.08] text-[#A7B0C9] hover:bg-white/[0.15] hover:text-white transition cursor-pointer"
              aria-label="Close dialog"
            >
              ✕
            </button>

            {/* App Icon */}
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#00A3FF] to-[#0051FF] shadow-[0_8px_24px_rgba(0,163,255,0.35)]">
              <svg className="h-9 w-9 text-white" viewBox="8 0 128 126" fill="currentColor" aria-hidden="true">
                <circle cx="108" cy="13" r="11" />
                <path
                  fillRule="evenodd"
                  d="M63 28c-27 0-47 19-47 46s20 46 47 46c21 0 37-11 47-28l-18-9c-6 12-16 19-29 19-16 0-27-9-30-23l50-1 47-47c5-5 0-12-6-9L91 42C83 33 74 28 63 28Zm-29 35c4-13 14-20 29-20 12 0 21 6 25 17l-54 3Z"
                />
              </svg>
            </div>

            <h2 id="get-app-title" className="text-2xl font-black tracking-tight text-[#F4F7FF]">
              Get the EVENTIS App
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-[#A7B0C9] leading-relaxed">
              Explore live events, get instant concert notifications, and book tickets anywhere in Kigali.
            </p>

            {/* QR Code */}
            <div className="my-6 inline-flex flex-col items-center justify-center rounded-2xl border border-white/[0.12] bg-white/[0.04] p-4">
              <div className="rounded-xl bg-white p-3 shadow-md">
                <svg className="h-32 w-32" viewBox="0 0 120 120" fill="none" aria-hidden="true">
                  <rect width="120" height="120" fill="white" />
                  <rect x="10" y="10" width="30" height="30" rx="4" fill="#070814" />
                  <rect x="16" y="16" width="18" height="18" rx="2" fill="white" />
                  <rect x="21" y="21" width="8" height="8" fill="#00A3FF" />
                  <rect x="80" y="10" width="30" height="30" rx="4" fill="#070814" />
                  <rect x="86" y="16" width="18" height="18" rx="2" fill="white" />
                  <rect x="91" y="21" width="8" height="8" fill="#00A3FF" />
                  <rect x="10" y="80" width="30" height="30" rx="4" fill="#070814" />
                  <rect x="16" y="86" width="18" height="18" rx="2" fill="white" />
                  <rect x="21" y="91" width="8" height="8" fill="#00A3FF" />
                  <rect x="46" y="14" width="6" height="6" fill="#070814" />
                  <rect x="58" y="14" width="6" height="6" fill="#070814" />
                  <rect x="68" y="14" width="6" height="6" fill="#070814" />
                  <rect x="46" y="26" width="6" height="6" fill="#070814" />
                  <rect x="58" y="26" width="16" height="6" fill="#00A3FF" />
                  <rect x="46" y="38" width="16" height="6" fill="#070814" />
                  <rect x="68" y="38" width="6" height="6" fill="#070814" />
                  <rect x="14" y="46" width="6" height="16" fill="#070814" />
                  <rect x="26" y="46" width="6" height="6" fill="#070814" />
                  <rect x="38" y="46" width="6" height="16" fill="#00A3FF" />
                  <rect x="50" y="50" width="20" height="20" rx="4" fill="#00A3FF" />
                  <rect x="80" y="46" width="16" height="6" fill="#070814" />
                  <rect x="102" y="46" width="6" height="16" fill="#070814" />
                  <rect x="80" y="58" width="6" height="16" fill="#070814" />
                  <rect x="92" y="58" width="16" height="6" fill="#070814" />
                  <rect x="46" y="80" width="16" height="6" fill="#070814" />
                  <rect x="68" y="80" width="6" height="16" fill="#070814" />
                  <rect x="80" y="80" width="16" height="6" fill="#00A3FF" />
                  <rect x="102" y="80" width="6" height="6" fill="#070814" />
                  <rect x="46" y="92" width="6" height="16" fill="#070814" />
                  <rect x="58" y="92" width="16" height="6" fill="#070814" />
                  <rect x="80" y="92" width="6" height="16" fill="#070814" />
                  <rect x="92" y="92" width="16" height="16" fill="#00A3FF" />
                  <rect x="46" y="104" width="28" height="6" fill="#070814" />
                </svg>
              </div>
              <span className="mt-2.5 text-[11px] font-semibold text-[#A7B0C9]">
                Scan with phone camera to download
              </span>
            </div>

            {/* Store Badges */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href="https://apps.apple.com"
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-auto flex items-center justify-center gap-2.5 rounded-xl border border-white/20 bg-white/[0.08] hover:bg-white/[0.14] px-4 py-2.5 text-left transition text-white"
              >
                <svg className="h-6 w-6 fill-current shrink-0" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.62-.75 1.04-1.8 0.92-2.85-.9.04-2 .6-2.65 1.35-.58.66-1.09 1.73-.95 2.76.99.08 2.04-.51 2.68-1.26z" />
                </svg>
                <div className="flex flex-col text-left leading-tight">
                  <span className="text-[9px] uppercase tracking-wider text-[#A7B0C9]">Download on the</span>
                  <span className="text-xs font-bold text-white">App Store</span>
                </div>
              </a>

              <a
                href="https://play.google.com"
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-auto flex items-center justify-center gap-2.5 rounded-xl border border-white/20 bg-white/[0.08] hover:bg-white/[0.14] px-4 py-2.5 text-left transition text-white"
              >
                <svg className="h-6 w-6 fill-current shrink-0 text-[#00A3FF]" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M3.609 1.814L13.793 12 3.61 22.186a2.03 2.03 0 0 1-.61-1.465V3.279c0-.585.228-1.119.609-1.465zm11.255 11.257l2.257 2.257-11.458 6.51 9.201-8.767zm2.257-2.257L14.864 8.56 5.663 3.328l11.458 6.486zm1.189 1.189l2.793 1.587c.725.412.725 1.085 0 1.497l-2.793 1.587-2.115-2.336 2.115-2.335z" />
                </svg>
                <div className="flex flex-col text-left leading-tight">
                  <span className="text-[9px] uppercase tracking-wider text-[#A7B0C9]">GET IT ON</span>
                  <span className="text-xs font-bold text-white">Google Play</span>
                </div>
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
