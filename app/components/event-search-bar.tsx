"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, type FormEvent } from "react";

const categories = [
  { label: "Music", value: "music", icon: "music-note" },
  { label: "Sports", value: "sports", icon: "basketball" },
  { label: "Community", value: "community", icon: "users" },
  { label: "Movies / Entertainment", value: "entertainment", icon: "movies" },
  { label: "Parties / Events", value: "parties", icon: "party-popper" },
] as const;

const moreCategories = [
  { label: "Fashion", value: "fashion" },
  { label: "Festival", value: "festival" },
  { label: "All events", value: "all" },
] as const;

type CategoryIconName = (typeof categories)[number]["icon"] | "more";

function CategoryIcon({ name }: { name: CategoryIconName }) {
  const commonProps = {
    viewBox: "0 0 24 24",
    "aria-hidden": true as const,
    className: "h-5 w-5 fill-none stroke-current",
    strokeWidth: 2.1,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  switch (name) {
    case "music-note":
      return <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 fill-current"><path d="M13 3v11.2a3.5 3.5 0 1 1-2-3.2V5l9-2v9.2a3.5 3.5 0 1 1-2-3.2V5.5l-5 1.1V3Z" /></svg>;
    case "basketball":
      return <svg {...commonProps}><circle cx="12" cy="12" r="9" /><path d="M3.4 9h17.2M3.4 15h17.2M8.7 3.9c2.1 2.2 3.1 4.9 3.3 8.1-.2 3.2-1.2 5.9-3.3 8.1m6.6-16.2c-2.1 2.2-3.1 4.9-3.3 8.1.2 3.2 1.2 5.9 3.3 8.1" /></svg>;
    case "users":
      return <svg {...commonProps}><circle cx="9" cy="8" r="2.7" /><circle cx="17" cy="9" r="2.2" /><path d="M3.5 19c.4-3.1 2.2-4.8 5.5-4.8s5.1 1.7 5.5 4.8m.1-4.2c2.7-.3 4.7 1 5.2 3.6m-1.4-9.6c2.7.7 3.5 3.1 2.4 5.1" /></svg>;
    case "movies":
      return <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 fill-current"><path d="M4 8h16v12H4zM3 7l2-4h16l-2 4H3Zm2-3 .9 3m4.1-3 .9 3m4.1-3 .9 3m4.1-3 .9 3" /></svg>;
    case "party-popper":
      return <svg {...commonProps}><path d="m4 20 4-11 8 8-12 3Z" /><path d="m8 9 4-4m3 7 4-1m-8-4 1-4m5 1 2-2m1 7 3-1" /></svg>;
    case "more":
      return <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 fill-current"><circle cx="5" cy="12" r="1.8" /><circle cx="12" cy="12" r="1.8" /><circle cx="19" cy="12" r="1.8" /></svg>;
  }
}

function eventsUrl(search: string, category: string) {
  const params = new URLSearchParams();
  if (search.trim()) params.set("search", search.trim());
  if (category !== "all") params.set("category", category);
  const query = params.toString();
  return query ? `/events?${query}` : "/events";
}

export default function EventSearchBar() {
  const router = useRouter();
  const moreMenuRef = useRef<HTMLDivElement>(null);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  useEffect(() => {
    queueMicrotask(() => {
      const params = new URLSearchParams(window.location.search);
      setSearch(params.get("search") ?? "");
      setActiveCategory(params.get("category") ?? "all");
    });
  }, []);

  useEffect(() => {
    const syncQuery = (event: Event) => {
      const detail = (event as CustomEvent<{ search: string; category: string }>).detail;
      setSearch(detail.search);
      setActiveCategory(detail.category);
    };
    window.addEventListener("eventis-event-search", syncQuery);
    return () => window.removeEventListener("eventis-event-search", syncQuery);
  }, []);

  useEffect(() => {
    if (!isMoreOpen) return;

    const closeMenu = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsMoreOpen(false);
    };
    const closeOnOutsideClick = (event: PointerEvent) => {
      if (!moreMenuRef.current?.contains(event.target as Node)) setIsMoreOpen(false);
    };

    window.addEventListener("keydown", closeMenu);
    document.addEventListener("pointerdown", closeOnOutsideClick);
    return () => {
      window.removeEventListener("keydown", closeMenu);
      document.removeEventListener("pointerdown", closeOnOutsideClick);
    };
  }, [isMoreOpen]);

  function submitSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    router.push(eventsUrl(search, activeCategory));
    window.dispatchEvent(new CustomEvent("eventis-event-search", { detail: { search: search.trim(), category: activeCategory } }));
  }

  function selectCategory(value: string) {
    setActiveCategory(value);
    setIsMoreOpen(false);
    router.push(eventsUrl(search, value));
    window.dispatchEvent(new CustomEvent("eventis-event-search", { detail: { search: search.trim(), category: value } }));
  }

  const isMoreActive = moreCategories.some((category) => category.value === activeCategory && category.value !== "all");

  return (
    <section className="event-search-section" aria-label="Search events by keyword or category">
      <div className="event-search-bar">
        <form role="search" onSubmit={submitSearch} className="event-search-field">
          <svg viewBox="0 0 24 24" aria-hidden="true" className="h-[17px] w-[17px] shrink-0 fill-none stroke-current" strokeWidth="2" strokeLinecap="round">
            <circle cx="10.8" cy="10.8" r="6.3" />
            <path d="m16 16 4.3 4.3" />
          </svg>
          <label className="sr-only" htmlFor="landing-event-search">Search events</label>
          <input
            id="landing-event-search"
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search event…"
          />
          <button type="submit" className="sr-only">Search events</button>
        </form>

        <nav className="event-category-list" aria-label="Event categories">
          {categories.map((category) => (
            <button
              key={category.value}
              type="button"
              aria-label={category.label}
              aria-pressed={activeCategory === category.value}
              title={category.label}
              onClick={() => selectCategory(category.value)}
              className={`event-category-button${activeCategory === category.value ? " is-active" : ""}`}
            >
              <CategoryIcon name={category.icon} />
            </button>
          ))}
          <div className="event-category-more" ref={moreMenuRef}>
            <button
              type="button"
              aria-label="More event categories"
              aria-expanded={isMoreOpen}
              aria-controls="event-category-more-menu"
              title="More categories"
              onClick={() => setIsMoreOpen((open) => !open)}
              className={`event-category-button${isMoreActive ? " is-active" : ""}`}
            >
              <CategoryIcon name="more" />
            </button>
            {isMoreOpen && (
              <div id="event-category-more-menu" className="event-category-menu" role="group" aria-label="More event categories">
                {moreCategories.map((category) => (
                  <button
                    key={category.value}
                    type="button"
                    aria-pressed={activeCategory === category.value}
                    onClick={() => selectCategory(category.value)}
                    className={activeCategory === category.value ? "is-active" : ""}
                  >
                    {category.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </nav>
      </div>
    </section>
  );
}