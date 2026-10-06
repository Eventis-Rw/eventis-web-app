"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import Footer from "../components/footer";
import Navbar from "../components/navbar";

type EventPost = {
  id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  startDate: string;
  endDate: string;
  time: string;
  status: "upcoming" | "expired";
  priceType: "free" | "paid";
  price?: string;
  coverImage: string;
  viewsCount: number;
};

const storageKey = "eventis-events";
const sampleEvents: EventPost[] = [
  {
    id: "sample-fantasy-concert",
    title: "Fantasy Music Concert",
    description: "An evening of live music and unforgettable performances.",
    category: "Live music",
    location: "Kigali Convention Center",
    startDate: "2026-10-18",
    endDate: "2026-10-18",
    time: "19:00",
    status: "upcoming",
    priceType: "paid",
    price: "15,000 RWF",
    coverImage: "/eve1.jpg",
    viewsCount: 128,
  },
  {
    id: "sample-kigali-up",
    title: "Kigali Up Music Festival",
    description: "A weekend celebrating music, culture, and community.",
    category: "Festival",
    location: "Amahoro Stadium Grounds",
    startDate: "2026-10-24",
    endDate: "2026-10-26",
    time: "14:00",
    status: "upcoming",
    priceType: "paid",
    price: "10,000 RWF",
    coverImage: "/eve2.jpg",
    viewsCount: 96,
  },
  {
    id: "sample-fashion-week",
    title: "Kigali Fashion Week",
    description: "Discover new collections from designers across the region.",
    category: "Fashion",
    location: "Kigali Universe - The Bridge",
    startDate: "2026-11-02",
    endDate: "2026-11-02",
    time: "18:30",
    status: "upcoming",
    priceType: "paid",
    price: "8,000 RWF",
    coverImage: "/eve3.jpg",
    viewsCount: 74,
  },
  {
    id: "sample-rimba-fashion",
    title: "RIMBA Fashion Show",
    description: "A showcase of fashion, culture, and creative expression.",
    category: "Fashion",
    location: "The Manor Hotel, Nyarutarama",
    startDate: "2026-11-13",
    endDate: "2026-11-13",
    time: "17:00",
    status: "upcoming",
    priceType: "paid",
    price: "12,000 RWF",
    coverImage: "/eve4.jpg",
    viewsCount: 53,
  },
];

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(`${date}T12:00:00`));
}

export default function EventsPage() {
  const [events, setEvents] = useState(sampleEvents);
  const [role, setRole] = useState("visitor");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [status, setStatus] = useState("upcoming");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    try {
      const storedEvents = localStorage.getItem(storageKey);
      if (storedEvents) setEvents([...JSON.parse(storedEvents), ...sampleEvents]);
    } catch {
      localStorage.removeItem(storageKey);
    }

    setRole(localStorage.getItem("eventis-role") ?? "visitor");
    const publishedTitle = sessionStorage.getItem("eventis-published");
    if (publishedTitle) {
      setNotice(`“${publishedTitle}” has been published.`);
      sessionStorage.removeItem("eventis-published");
    }
  }, []);

  const categories = useMemo(
    () => [...new Set(events.map((event) => event.category).filter(Boolean))],
    [events],
  );
  const filteredEvents = events.filter((event) => {
    const matchesSearch = `${event.title} ${event.description} ${event.location}`
      .toLowerCase()
      .includes(search.toLowerCase());
    return (
      matchesSearch &&
      (category === "all" || event.category === category) &&
      (status === "all" || event.status === status)
    );
  });

  function changeRole(nextRole: string) {
    localStorage.setItem("eventis-role", nextRole);
    setRole(nextRole);
    window.dispatchEvent(new Event("eventis-role-change"));
  }

  return (
    <main className="min-h-screen bg-[#f3f3f1] text-[#292929]">
      <Navbar />
      <section className="px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="mx-auto max-w-[1280px]">
          <div className="flex flex-col gap-7 border-b border-[#d8d1cb] pb-8 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-[#8a6b55]">EVENTIS / DISCOVER</p>
              <h1 className="mt-3 text-4xl font-black leading-none tracking-[-0.07em] sm:text-6xl">
                Find your next event.
              </h1>
              <p className="mt-4 max-w-xl text-sm leading-6 text-[#65605c] sm:text-base">
                Explore what&apos;s happening around Kigali and find something worth showing up for.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <label className="text-xs font-bold uppercase tracking-[0.12em] text-[#65605c]" htmlFor="preview-role">
                Preview role
              </label>
              <select
                id="preview-role"
                value={role}
                onChange={(event) => changeRole(event.target.value)}
                className="rounded-lg border border-[#d2cbc5] bg-white px-3 py-2 text-sm font-semibold outline-none focus:border-[#292929]"
              >
                <option value="visitor">Visitor</option>
                <option value="poster">Poster</option>
              </select>
              {role === "poster" && (
                <Link href="/events/create" className="rounded-lg bg-[#1b1b1b] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#3a3a3a]">
                  + Event Post
                </Link>
              )}
            </div>
          </div>

          {notice && (
            <p role="status" className="mt-6 rounded-lg border border-[#acd1b4] bg-[#edf7ef] px-4 py-3 text-sm font-semibold text-[#246239]">
              {notice}
            </p>
          )}

          <div className="mt-8 grid gap-3 sm:grid-cols-[minmax(0,1fr)_220px_180px]">
            <label className="sr-only" htmlFor="event-search">Search events</label>
            <input
              id="event-search"
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search events, places, or experiences"
              className="min-w-0 rounded-lg border border-[#d8d1cb] bg-white px-4 py-3 text-sm outline-none placeholder:text-[#8b8580] focus:border-[#292929]"
            />
            <label className="sr-only" htmlFor="event-category">Filter by category</label>
            <select id="event-category" value={category} onChange={(event) => setCategory(event.target.value)} className="rounded-lg border border-[#d8d1cb] bg-white px-4 py-3 text-sm outline-none focus:border-[#292929]">
              <option value="all">All categories</option>
              {categories.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
            <label className="sr-only" htmlFor="event-status">Filter by status</label>
            <select id="event-status" value={status} onChange={(event) => setStatus(event.target.value)} className="rounded-lg border border-[#d8d1cb] bg-white px-4 py-3 text-sm outline-none focus:border-[#292929]">
              <option value="upcoming">Upcoming</option>
              <option value="expired">Expired</option>
              <option value="all">All events</option>
            </select>
          </div>

          <div className="mt-8 flex items-center justify-between gap-4">
            <h2 className="text-xl font-black tracking-[-0.04em]">Events</h2>
            <p className="text-sm text-[#65605c]">{filteredEvents.length} available</p>
          </div>

          {filteredEvents.length ? (
            <div className="mt-4 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {filteredEvents.map((event) => (
                <article key={event.id} className="overflow-hidden rounded-xl border border-[#e0dad5] bg-white">
                  <div className="relative aspect-[16/10] bg-[#e9e5e1]">
                    <Image src={event.coverImage} alt={event.title} fill sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw" className="object-cover" unoptimized />
                    <span className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-[#292929]">
                      {event.category || "Event"}
                    </span>
                  </div>
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-4">
                      <h3 className="text-xl font-black leading-tight tracking-[-0.04em]">{event.title}</h3>
                      <span className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase ${event.status === "upcoming" ? "bg-[#e9f3eb] text-[#28633b]" : "bg-[#f0eeec] text-[#67615c]"}`}>
                        {event.status}
                      </span>
                    </div>
                    <p className="mt-3 line-clamp-2 min-h-10 text-sm leading-5 text-[#65605c]">{event.description}</p>
                    <div className="mt-5 space-y-2 border-t border-[#eee9e5] pt-4 text-sm text-[#4e4945]">
                      <p>{formatDate(event.startDate)}{event.endDate !== event.startDate ? ` - ${formatDate(event.endDate)}` : ""} · {event.time}</p>
                      <p className="truncate">{event.location}</p>
                      <p className="font-bold text-[#292929]">{event.priceType === "free" ? "Free" : event.price || "Paid"}</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="mt-4 border-y border-[#d8d1cb] py-16 text-center">
              <h3 className="text-xl font-black">No events match those filters.</h3>
              <p className="mt-2 text-sm text-[#65605c]">Try a different search or category.</p>
            </div>
          )}
        </div>
      </section>
      <Footer />
    </main>
  );
}