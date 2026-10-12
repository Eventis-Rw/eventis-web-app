"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Navbar from "../../components/navbar";
import {
  AUTH_CHANGE_EVENT,
  getStoredUser,
  type EventisUser,
} from "../../lib/auth";
import {
  eventStorageKey,
  sampleEvents,
  savedEventStorageKey,
  type EventPost,
} from "../../lib/events";

function formatDate(dateStr: string): string {
  try {
    const date = new Date(dateStr.includes("T") ? dateStr : `${dateStr}T12:00:00`);
    return date.toLocaleDateString("en-GB", {
      weekday: "long",
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

function formatShortDate(dateStr: string): string {
  try {
    const date = new Date(dateStr.includes("T") ? dateStr : `${dateStr}T12:00:00`);
    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

function formatCount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1).replace(/\.0$/, "")}k`;
  return String(n);
}

export default function EventDetailsPage() {
  const { eventId } = useParams<{ eventId: string }>();
  const router = useRouter();

  const [currentUser, setCurrentUser] = useState<EventisUser | null>(null);
  const [event, setEvent] = useState<EventPost | null>(null);
  const [featuredEvents, setFeaturedEvents] = useState<EventPost[]>([]);
  const [nearbyEvents, setNearbyEvents] = useState<EventPost[]>([]);
  const [isSaved, setIsSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState("");

  const showToast = (msg: string) => {
    setToastMessage(msg);
    window.setTimeout(() => setToastMessage(""), 2600);
  };

  useEffect(() => {
    const syncUser = () => {
      setCurrentUser(getStoredUser());
    };
    queueMicrotask(() => {
      syncUser();
    });
    window.addEventListener(AUTH_CHANGE_EVENT, syncUser);
    window.addEventListener("storage", syncUser);
    return () => {
      window.removeEventListener(AUTH_CHANGE_EVENT, syncUser);
      window.removeEventListener("storage", syncUser);
    };
  }, []);

  useEffect(() => {
    queueMicrotask(() => {
      try {
        const stored: unknown = JSON.parse(localStorage.getItem(eventStorageKey) ?? "[]");
        const userEvents = Array.isArray(stored) ? (stored as EventPost[]) : [];
        const all = [...userEvents, ...sampleEvents];

        const found = all.find((item) => item.id === eventId) ?? null;
        setEvent(found);

        const others = all.filter((item) => item.id !== eventId);
        
        // Populate 10 featured events (2 rows of 5 columns)
        const featured = others.slice(0, 10);
        if (featured.length < 10) {
          const padPool = sampleEvents.filter((item) => item.id !== eventId);
          while (featured.length < 10 && padPool.length > 0) {
            const itemToAdd = padPool[featured.length % padPool.length];
            featured.push({
              ...itemToAdd,
              id: `${itemToAdd.id}_f${featured.length}`,
            });
          }
        }
        setFeaturedEvents(featured);

        // Nearby events: 4 events in the right-hand column
        setNearbyEvents(others.slice(2, 6).length >= 4 ? others.slice(2, 6) : others.slice(0, 4));

        const saved: unknown = JSON.parse(localStorage.getItem(savedEventStorageKey) ?? "[]");
        setIsSaved(Array.isArray(saved) && saved.includes(eventId));
      } catch {
        const found = sampleEvents.find((item) => item.id === eventId) ?? null;
        setEvent(found);
        const others = sampleEvents.filter((item) => item.id !== eventId);
        setFeaturedEvents(others.slice(0, 10));
        setNearbyEvents(others.slice(0, 4));
      } finally {
        setIsLoading(false);
      }
    });
  }, [eventId]);

  const handleViewEvent = (targetId: string) => {
    const cleanId = targetId.split("_f")[0];
    if (!currentUser) {
      showToast("Login required to view event details");
      router.push("/users/auth/login");
      return;
    }
    router.push(`/events/${cleanId}`);
  };

  const toggleSave = () => {
    if (!event) return;
    if (!currentUser) {
      showToast("Login required to save events");
      router.push("/users/auth/login");
      return;
    }
    const saved: unknown = JSON.parse(localStorage.getItem(savedEventStorageKey) ?? "[]");
    const savedIds = Array.isArray(saved)
      ? saved.filter((item): item is string => typeof item === "string")
      : [];
    const next = isSaved ? savedIds.filter((id) => id !== event.id) : [...savedIds, event.id];
    localStorage.setItem(savedEventStorageKey, JSON.stringify(next));
    window.dispatchEvent(new Event("storage"));
    setIsSaved(!isSaved);
    showToast(isSaved ? "Removed from saved events" : "Event saved to your collection");
  };

  const handleShare = async () => {
    if (!event) return;
    const url = window.location.href;
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: event.title,
          text: `Check out ${event.title} in Rwanda!\n📍 ${event.location}\n📅 ${formatDate(event.startDate)}`,
          url,
        });
        showToast("Shared successfully!");
        return;
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") return;
      }
    }
    navigator.clipboard.writeText(url).then(() => {
      showToast("Link copied to clipboard!");
    });
  };

  return (
    <main className="min-h-screen bg-[#070814] text-[#F4F7FF] pb-24">
      <Navbar />

      <div className="mx-auto max-w-[1280px] px-3 sm:px-6 pt-5 sm:pt-7">
        {/* Breadcrumb Navigation */}
        <div className="mb-5 sm:mb-6 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#A7B0C9] hover:text-[#00A3FF] transition"
          >
            <span className="text-base leading-none">←</span>
            <span>Back to Feed</span>
          </Link>

          {event && (
            <span className="px-3 py-1 rounded-full bg-white/[0.06] border border-white/[0.12] backdrop-blur-md text-xs font-semibold text-[#A7B0C9]">
              {event.category}
            </span>
          )}
        </div>

        {isLoading ? (
          <div className="p-16 rounded-3xl bg-[rgba(16,22,44,0.72)] backdrop-blur-xl border border-white/[0.14] text-center">
            <div className="w-10 h-10 border-2 border-[#00A3FF] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs font-bold text-[#A7B0C9]">Loading event details...</p>
          </div>
        ) : !event ? (
          <div className="p-16 rounded-3xl bg-[rgba(16,22,44,0.72)] backdrop-blur-xl border border-white/[0.14] text-center max-w-lg mx-auto">
            <h1 className="text-2xl font-black text-[#F4F7FF] mb-2">Event Not Found</h1>
            <p className="text-sm text-[#A7B0C9] mb-6">
              This event might have expired, been removed, or the link is invalid.
            </p>
            <Link
              href="/"
              className="inline-flex items-center justify-center px-6 py-2.5 rounded-xl bg-[#00A3FF] hover:bg-[#0092E6] text-white text-xs font-bold transition shadow-lg"
            >
              Discover other events
            </Link>
          </div>
        ) : (
          <div className="space-y-12">
            
            {/* TOP SECTION: Event Details Card (8 cols) + Nearby Events (4 cols on right side) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Event Detailed Information Card (Glassmorphism without gradients) */}
              <article className="lg:col-span-8 rounded-3xl bg-[rgba(16,22,44,0.72)] backdrop-blur-xl border border-white/[0.14] overflow-hidden shadow-2xl">
                {/* Hero Cover Image */}
                <div className="relative w-full aspect-[16/9] sm:aspect-[21/9] bg-black overflow-hidden">
                  <Image
                    src={event.coverImage}
                    alt={event.title}
                    fill
                    priority
                    unoptimized
                    className="object-cover"
                  />
                  <div className="absolute top-4 left-4 z-10">
                    <span className="px-3 py-1 rounded-full bg-[#070814]/85 border border-white/[0.20] backdrop-blur-md text-[11px] font-bold text-[#00A3FF]">
                      {event.category}
                    </span>
                  </div>
                </div>

                {/* Event Content Details */}
                <div className="p-5 sm:p-8 space-y-6">
                  {/* Title and Top Header */}
                  <div>
                    <span className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-[#00A3FF]">
                      Event Details · Rwanda 🇷🇼
                    </span>
                    <h1 className="mt-1 text-2xl sm:text-3xl md:text-4xl font-black text-[#F4F7FF] tracking-tight leading-tight">
                      {event.title}
                    </h1>
                  </div>

                  {/* Primary Event Facts Tiles (Clean glass tiles without gradients) */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <div className="p-3.5 rounded-2xl bg-white/[0.05] border border-white/[0.10] backdrop-blur-md">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#A7B0C9] block mb-1">
                        Date
                      </span>
                      <strong className="text-xs sm:text-sm font-bold text-[#F4F7FF] block leading-tight">
                        {formatShortDate(event.startDate)}
                        {event.endDate && event.endDate !== event.startDate
                          ? ` - ${formatShortDate(event.endDate)}`
                          : ""}
                      </strong>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-white/[0.05] border border-white/[0.10] backdrop-blur-md">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#A7B0C9] block mb-1">
                        Time
                      </span>
                      <strong className="text-xs sm:text-sm font-bold text-[#F4F7FF] block leading-tight">
                        {event.time}
                      </strong>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-white/[0.05] border border-white/[0.10] backdrop-blur-md">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#A7B0C9] block mb-1">
                        Location
                      </span>
                      <strong className="text-xs sm:text-sm font-bold text-[#F4F7FF] block leading-tight truncate">
                        {event.location}
                      </strong>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-white/[0.05] border border-white/[0.10] backdrop-blur-md">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#A7B0C9] block mb-1">
                        Format
                      </span>
                      <strong className="text-xs sm:text-sm font-bold text-[#F4F7FF] block leading-tight">
                        {event.eventFormat ?? "In person"}
                      </strong>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-white/[0.05] border border-white/[0.10] backdrop-blur-md">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#A7B0C9] block mb-1">
                        Admission
                      </span>
                      <strong className="text-xs sm:text-sm font-bold text-[#F4F7FF] block leading-tight">
                        {event.priceType === "free" ? "Free" : event.price || "Paid"}
                      </strong>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-white/[0.05] border border-white/[0.10] backdrop-blur-md">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#A7B0C9] block mb-1">
                        Views
                      </span>
                      <strong className="text-xs sm:text-sm font-bold text-[#00A3FF] block leading-tight">
                        {formatCount(event.viewsCount || 120)} views
                      </strong>
                    </div>
                  </div>

                  {/* Description Section */}
                  <div className="pt-2">
                    <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#A7B0C9] mb-2">
                      About This Experience
                    </h2>
                    <p className="text-sm sm:text-base text-[#F4F7FF]/90 leading-relaxed whitespace-pre-line font-normal">
                      {event.description}
                    </p>
                  </div>

                  {/* Action Buttons Row */}
                  <div className="pt-4 border-t border-white/[0.10] flex items-center gap-3">
                    <button
                      type="button"
                      onClick={toggleSave}
                      className={`flex-1 sm:flex-initial px-5 py-3 rounded-2xl text-xs font-bold border transition flex items-center justify-center gap-2 cursor-pointer backdrop-blur-md ${
                        isSaved
                          ? "bg-[#00A3FF]/20 border-[#00A3FF] text-[#00A3FF]"
                          : "bg-white/[0.07] hover:bg-white/[0.13] border-white/[0.16] text-[#F4F7FF]"
                      }`}
                    >
                      <span>{isSaved ? "★ Saved" : "☆ Save Event"}</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleShare}
                      className="flex-1 sm:flex-initial px-5 py-3 rounded-2xl bg-white/[0.07] hover:bg-white/[0.13] border border-white/[0.16] text-xs font-bold text-[#F4F7FF] transition flex items-center justify-center gap-2 cursor-pointer backdrop-blur-md"
                    >
                      <svg className="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                        <line x1="22" y1="2" x2="11" y2="13" />
                        <polygon points="22 2 15 22 11 13 2 9 22 2" />
                      </svg>
                      <span>Share</span>
                    </button>
                  </div>
                </div>
              </article>

              {/* RIGHT SIDE COLUMN: Nearby Events (Beside Event Details) */}
              <aside className="lg:col-span-4 space-y-4">
                <div className="flex items-center justify-between pb-1">
                  <h2 className="text-base sm:text-lg font-bold text-[#F4F7FF]">Nearby Events</h2>
                  <span className="text-[11px] text-[#A7B0C9] font-medium">Around Rwanda</span>
                </div>

                <div className="space-y-3">
                  {nearbyEvents.map((nearby) => (
                    <div
                      key={nearby.id}
                      className="p-3.5 rounded-2xl bg-[rgba(16,22,44,0.72)] backdrop-blur-xl border border-white/[0.14] shadow-lg flex flex-col gap-2.5 transition hover:border-white/[0.24]"
                    >
                      <div className="flex items-center gap-3">
                        <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-black shrink-0 border border-white/[0.10]">
                          <Image
                            src={nearby.coverImage}
                            alt={nearby.title}
                            fill
                            unoptimized
                            className="object-cover"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <span className="text-[10px] font-bold text-[#00A3FF] block truncate">
                            {nearby.category}
                          </span>
                          <h3 className="text-xs sm:text-sm font-bold text-[#F4F7FF] truncate">
                            {nearby.title}
                          </h3>
                          <p className="text-[11px] text-[#A7B0C9] truncate">
                            {nearby.location}
                          </p>
                          <p className="text-[10px] font-medium text-[#A7B0C9]/80 truncate">
                            {formatShortDate(nearby.startDate)} · {nearby.time}
                          </p>
                        </div>
                      </div>

                      {/* View More Button (Glassmorphism without gradients & Login Required hover indicator) */}
                      <div className="relative group/view">
                        <button
                          type="button"
                          onClick={() => handleViewEvent(nearby.id)}
                          className="w-full py-2 px-3 rounded-xl bg-white/[0.07] hover:bg-white/[0.13] active:bg-white/[0.18] border border-white/[0.14] backdrop-blur-md text-xs font-bold text-[#F4F7FF] transition flex items-center justify-center cursor-pointer shadow-sm select-none"
                        >
                          View more
                        </button>
                        {!currentUser && (
                          <div className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover/view:opacity-100 transition-all duration-200 z-30 px-3 py-1 rounded-lg bg-[#0a1026]/95 border border-white/[0.18] backdrop-blur-md text-[11px] font-bold text-[#00A3FF] shadow-2xl whitespace-nowrap">
                            Login required
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </aside>

            </div>

            {/* BOTTOM SECTION: Featured Events (Underneath Details - 10 Events in 2 Rows with 5 Columns) */}
            <section className="space-y-5 pt-8 border-t border-white/[0.10]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <h2 className="text-xl sm:text-2xl font-black text-[#F4F7FF] tracking-tight">
                    Featured Events
                  </h2>
                  <span className="text-[11px] font-bold text-[#00A3FF] bg-[#00A3FF]/15 border border-[#00A3FF]/30 px-3 py-0.5 rounded-full backdrop-blur-md">
                    10 Curated Experiences
                  </span>
                </div>
                <Link href="/" className="text-xs font-bold text-[#00A3FF] hover:underline">
                  Explore full feed →
                </Link>
              </div>

              {/* 2 Rows with 5 Columns Grid Layout (Exact 10 Cards on Desktop) */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5 sm:gap-4">
                {featuredEvents.slice(0, 10).map((item) => (
                  <div
                    key={item.id}
                    className="rounded-2xl bg-[rgba(16,22,44,0.72)] backdrop-blur-xl border border-white/[0.14] overflow-hidden shadow-lg flex flex-col justify-between p-3 transition hover:border-white/[0.28] hover:-translate-y-0.5 duration-200"
                  >
                    <div>
                      {/* Thumbnail Cover */}
                      <div className="relative w-full aspect-[16/10] rounded-xl overflow-hidden bg-black mb-2.5">
                        <Image
                          src={item.coverImage}
                          alt={item.title}
                          fill
                          unoptimized
                          className="object-cover"
                        />
                        <span className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded-full bg-[#070814]/85 text-[10px] font-bold text-[#00A3FF] border border-white/[0.16] backdrop-blur-md truncate max-w-[85%]">
                          {item.category}
                        </span>
                      </div>

                      {/* Title & Metadata */}
                      <h3 className="text-xs font-bold text-[#F4F7FF] line-clamp-1 mb-1">
                        {item.title}
                      </h3>
                      <p className="text-[11px] text-[#A7B0C9] line-clamp-1 mb-1">
                        📍 {item.location}
                      </p>
                      <p className="text-[10px] font-medium text-[#A7B0C9]/85 mb-2">
                        📅 {formatShortDate(item.startDate)} · {item.time}
                      </p>
                    </div>

                    {/* View More Button (Glassmorphism without gradients & Login Required hover indicator) */}
                    <div className="relative group/view pt-1">
                      <button
                        type="button"
                        onClick={() => handleViewEvent(item.id)}
                        className="w-full py-2 px-2.5 rounded-xl bg-white/[0.07] hover:bg-white/[0.13] active:bg-white/[0.18] border border-white/[0.14] backdrop-blur-md text-xs font-bold text-[#F4F7FF] transition flex items-center justify-center cursor-pointer shadow-sm select-none"
                      >
                        View more
                      </button>
                      {!currentUser && (
                        <div className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover/view:opacity-100 transition-all duration-200 z-30 px-2.5 py-1 rounded-lg bg-[#0a1026]/95 border border-white/[0.18] backdrop-blur-md text-[10px] font-bold text-[#00A3FF] shadow-2xl whitespace-nowrap">
                          Login required
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>

          </div>
        )}
      </div>

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-full bg-[#00A3FF] text-white text-xs font-bold shadow-2xl backdrop-blur-md border border-white/20 flex items-center gap-2 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <span>{toastMessage}</span>
        </div>
      )}
    </main>
  );
}