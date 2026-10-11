"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import AuthGate from "./components/auth-gate";
import InstagramFeed from "./components/instagram-feed";
import Navbar from "./components/navbar";
import { AUTH_CHANGE_EVENT, getStoredUser, type EventisUser } from "./lib/auth";

export default function Home() {
  const [currentUser, setCurrentUser] = useState<EventisUser | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);

  useEffect(() => {
    const syncAuth = () => {
      setCurrentUser(getStoredUser());
    };

    queueMicrotask(() => {
      syncAuth();
      setIsAuthReady(true);
    });

    window.addEventListener(AUTH_CHANGE_EVENT, syncAuth);
    window.addEventListener("storage", syncAuth);

    return () => {
      window.removeEventListener(AUTH_CHANGE_EVENT, syncAuth);
      window.removeEventListener("storage", syncAuth);
    };
  }, []);

  // Graceful splash screen during client-side hydration (sub-50ms)
  if (!isAuthReady) {
    return (
      <main className="min-h-screen bg-[#070814] flex flex-col items-center justify-center">
        <div className="flex flex-col items-center gap-4 animate-pulse">
          <div className="relative w-16 h-16">
            <Image
              src="/eventis-logo.svg"
              alt="Eventis"
              width={64}
              height={64}
              priority
              className="object-contain"
            />
          </div>
          <span className="text-sm font-bold tracking-[0.25em] text-[#A7B0C9] uppercase">
            EVENTIS
          </span>
        </div>
      </main>
    );
  }

  // If user is not authenticated, show AuthGate before landing page feed can be seen
  if (!currentUser) {
    return <AuthGate />;
  }

  // Authenticated user: Full Instagram-style feed experience
  return (
    <main className="min-h-screen bg-[#070814]">
      <Navbar />
      <InstagramFeed />
    </main>
  );
}
