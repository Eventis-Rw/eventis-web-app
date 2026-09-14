"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const navItems = [
  { label: "About", href: "#about" },
  { label: "Contact Us", href: "#contact" },
  { label: "Connect with EVENTIS", href: "#love" },
  { label: "Find Event", href: "#events" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={[
        "sticky top-0 z-50 w-full px-4 py-5 transition-all duration-300 sm:px-6 lg:px-12",
        scrolled
          ? "border-b border-[#e5e1dc] bg-[#f5f3f1]/95 shadow-[0_8px_24px_rgba(17,17,17,0.06)] backdrop-blur-md"
          : "border-b border-[#ece9e5] bg-[#f7f5f3]/80 backdrop-blur-sm"
      ].join(" ")}
    >
      <nav className="mx-auto flex max-w-[1800px] items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-4 text-[#1f1f1f]">
          <span className="flex h-10 w-10 items-center justify-center rounded-full border border-[#d8d3cf] bg-white shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]">
            <svg viewBox="0 0 48 48" className="h-7 w-7 text-[#1f1f1f]" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path d="M14 17.5C19.2 9.4 27.8 8.5 32.8 10.4C38.2 12.5 39.8 18.3 37.3 23.2C34.6 28.7 28.8 31.4 22.6 34.3C17.2 36.8 14.3 41.1 14.2 46" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
              <path d="M31.8 16.8C27 11.5 20.6 13.6 19.2 18.7C17.7 24.4 22.6 29.4 28.5 30.6C33.8 31.7 37.5 35.9 37.5 40.8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
              <circle cx="23.8" cy="18.2" r="1.4" fill="currentColor"/>
            </svg>
          </span>
          <span className="text-[2.1rem] font-light tracking-[-0.08em] text-[#1d1d1d]">
            EVENTIS
          </span>
        </Link>

        <div className="hidden flex-1 items-center justify-center md:flex">
          <div className="flex items-center justify-center gap-12 rounded-[9999px] border border-[#e4e1dd] bg-[#f3f1ee] px-8 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="text-[1.05rem] font-medium tracking-[-0.03em] text-[#2c2c2c] transition-all duration-200 hover:text-[#111111]"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <div className="flex items-center gap-2 rounded-[9999px] border border-[#e4e1dd] bg-[#f3f1ee] p-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]">
            <Link
              href="#login"
              className="inline-flex items-center justify-center rounded-[9999px] px-4 py-2.5 text-sm font-medium text-[#2c2c2c] transition-all duration-200 hover:bg-white hover:text-[#111111]"
            >
              Login
            </Link>
            <Link
              href="#register"
              className="inline-flex items-center justify-center rounded-[9999px] px-4 py-2.5 text-sm font-medium text-[#2c2c2c] transition-all duration-200 hover:bg-white hover:text-[#111111]"
            >
              Register
            </Link>

            <Link
              href="#app"
              className="inline-flex items-center gap-3 rounded-[9999px] bg-[#1d1d1d] px-5 py-3 text-base font-semibold text-white shadow-[0_10px_24px_rgba(17,17,17,0.12)] transition-all duration-200 hover:bg-[#111111]"
            >
              <span className="text-xl font-bold">Get App</span>
              <span className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/12">
                  <svg viewBox="0 0 24 24" className="h-4 w-4 text-white" fill="currentColor" aria-hidden="true">
                    <path d="M16.7 12.7c0-2.3 1.9-3.4 2-3.5-1.1-1.6-2.8-1.8-3.4-1.8-1.5-.1-2.9.9-3.6.9-.7 0-1.8-.9-3.1-.9-1.6 0-3 .9-3.8 2.3C2.9 11.9 3.6 16.5 5.3 18.6c.7 1 1.6 2.1 2.8 2.1 1.1 0 1.6-.7 3-.7 1.4 0 1.8.7 3 .7 1.2 0 2-.9 2.8-2 .8-1.3 1.1-2.7 1.1-2.8-.1-.1-2.1-.9-3.3-3.2Zm-1-5.7c.6-.8 1-1.8.9-2.9-.9.1-2 .6-2.7 1.4-.6.7-1.1 1.8-1 2.8.9.1 2-.5 2.8-1.3Z"/>
                  </svg>
                </span>
                <span className="flex h-7 w-7 items-center justify-center overflow-hidden rounded-full bg-transparent p-0 text-white">
                  <svg viewBox="0 0 640 640" className="h-7 w-7" aria-hidden="true" fill="currentColor">
                    <path d="M389.6 298.3L168.9 77L449.7 238.2L389.6 298.3zM111.3 64C98.3 70.8 89.6 83.2 89.6 99.3L89.6 540.6C89.6 556.7 98.3 569.1 111.3 575.9L367.9 319.9L111.3 64zM536.5 289.6L477.6 255.5L411.9 320L477.6 384.5L537.7 350.4C555.7 336.1 555.7 303.9 536.5 289.6zM168.9 563L449.7 401.8L389.6 341.7L168.9 563z"/>
                  </svg>
                </span>
              </span>
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}
