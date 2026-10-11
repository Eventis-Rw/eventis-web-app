"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Events", href: "/events" },
  { label: "Categories", href: "/events#event-category" },
  { label: "Inbox", href: "/inbox" },
  { label: "Saved", href: "/saved" },
  { label: "About", href: "/users/about" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [isPoster, setIsPoster] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hash, setHash] = useState("");

  useEffect(() => {
    const syncRole = () => setIsPoster(localStorage.getItem("eventis-role") === "poster");
    const savedTheme = localStorage.getItem("eventis-theme");
    const theme = savedTheme === "dark" || savedTheme === "light"
      ? savedTheme
      : window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";

    syncRole();
    document.documentElement.dataset.theme = theme;
    window.addEventListener("eventis-role-change", syncRole);
    window.addEventListener("storage", syncRole);
    return () => {
      window.removeEventListener("eventis-role-change", syncRole);
      window.removeEventListener("storage", syncRole);
    };
  }, []);

  useEffect(() => {
    const syncHash = () => setHash(window.location.hash);
    syncHash();
    window.addEventListener("hashchange", syncHash);
    setIsMenuOpen(false);
    return () => window.removeEventListener("hashchange", syncHash);
  }, [pathname]);

  useEffect(() => {
    if (!isMenuOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsMenuOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [isMenuOpen]);

  function isActive(href: string) {
    if (href === "/") return pathname === "/";
    if (href === "/events") return pathname === "/events" && hash !== "#event-category";
    if (href === "/events#event-category") return pathname === "/events" && hash === "#event-category";
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  const links = [...navLinks, ...(isPoster ? [{ label: "Event Post", href: "/events/create" }] : [])];

  return (
    <header className="eventis-navbar sticky top-0 z-50 w-full">
      <div className="mx-auto flex min-h-[76px] w-full max-w-[1500px] items-center justify-between gap-3 px-4 py-2 sm:px-6 lg:px-8">
        <Link href="/" aria-label="Eventis home" className="eventis-logo-lockup shrink-0">
          <Image src="/eventis-logo.svg" alt="" width={56} height={56} priority className="h-14 w-14 object-contain" />
        </Link>

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

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
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
      {isMenuOpen && (
        <nav id="eventis-mobile-navigation" aria-label="Mobile navigation" className="eventis-mobile-panel xl:hidden">
          <div className="flex flex-col">
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
            <div className="flex items-center gap-3 pt-3">
              <Link href="/users/auth/login" onClick={() => setIsMenuOpen(false)} className="eventis-auth-login">
                Login
              </Link>
            </div>
          </div>
        </nav>
      )}
    </header>
  );
}

