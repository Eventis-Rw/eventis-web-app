"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { eventStorageKey, sampleEvents, savedEventStorageKey, type EventPost } from "../lib/events";

const pageSize = 8;
const categoryTerms: Record<string, string[]> = {
  music: ["music"],
  sports: ["sport"],
  community: ["community", "culture", "network"],
  entertainment: ["movie", "film", "cinema", "entertainment"],
  parties: ["party", "event", "festival"],
  fashion: ["fashion"],
  festival: ["festival"],
  technology: ["technology", "tech"],
};

const categoryOptions = [
  ["all", "All categories"],
  ["music", "Music"],
  ["sports", "Sports"],
  ["community", "Community"],
  ["entertainment", "Movies / Entertainment"],
  ["parties", "Parties / Events"],
  ["fashion", "Fashion"],
  ["festival", "Festival"],
  ["technology", "Technology"],
] as const;

const venues = [
  { name: "BK Arena", activity: "2 Events", image: "/event.jpg" },
  { name: "Zaria Court", activity: "3 Activities", image: "/eve3.jpg" },
  { name: "Nyandungu Eco Park", activity: "1 Event", image: "/eve4.jpg" },
];

const posterSlides = [
  ...sampleEvents.slice(0, 4).map((event) => ({
    id: event.id,
    title: event.title,
    subtitle: `${event.category} · ${formatDate(event.startDate)}`,
    location: event.location,
    image: event.coverImage,
    href: `/events/${event.id}`,
  })),
  { id: "music-in-space", title: "Music in Space Rwanda Kigali World Tour", subtitle: "Live music · August 23, 2025", location: "Camp Kigali", image: "/event-poster-1.jpg", href: "/events" },
  { id: "africas-business-heroes", title: "Africa's Business Heroes Summit & Grand-Finale", subtitle: "Innovation · November 23–24, 2023", location: "Kigali Convention Centre", image: "/event-poster-2.jpg", href: "/events" },
  { id: "iteka-cultural-festival", title: "Iteka African Cultural Festival Grand Finale", subtitle: "Music · Dance · Fashion · Culture", location: "Mundi Center", image: "/event-poster-3.jpg", href: "/events" },
  { id: "umoja-fest", title: "Umoja Fest Kwanzaa Celebration", subtitle: "Drum circle · Storytelling · Open mic", location: "Kigali", image: "/event-poster-4.jpg", href: "/events" },
];

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(`${date}T12:00:00`));
}

function readStoredEvents(): EventPost[] {
  try {
    const value: unknown = JSON.parse(localStorage.getItem(eventStorageKey) ?? "[]");
    return Array.isArray(value) ? value as EventPost[] : [];
  } catch {
    return [];
  }
}

function readSavedIds() {
  try {
    const value: unknown = JSON.parse(localStorage.getItem(savedEventStorageKey) ?? "[]");
    return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
  } catch {
    return [];
  }
}

function matchesCategory(event: EventPost, category: string) {
  if (category === "all") return true;
  const terms = categoryTerms[category];
  const value = event.category.toLowerCase();
  return terms ? terms.some((term) => value.includes(term)) : value === category;
}

function ActionIcon({ name }: { name: "save" | "share" | "insights" }) {
  const common = {
    viewBox: "0 0 24 24",
    "aria-hidden": true as const,
    className: "h-4 w-4 fill-none stroke-current",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  if (name === "save") return <svg {...common}><path d="M6 4.5h12v16l-6-3.8-6 3.8z" /></svg>;
  if (name === "share") return <svg {...common}><circle cx="18" cy="5" r="2.5" /><circle cx="6" cy="12" r="2.5" /><circle cx="18" cy="19" r="2.5" /><path d="m8.2 10.8 7.5-4.4m-7.5 6.8 7.5 4.4" /></svg>;
  return <svg {...common}><path d="M3 19h18M5 16v-4m5 4V5m5 11V9m5 7V7" /></svg>;
}

export default function EventDiscovery({ showEventGrid = true }: { showEventGrid?: boolean }) {
  const router = useRouter();
  const [events, setEvents] = useState<EventPost[]>(sampleEvents);
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [location, setLocation] = useState("all");
  const [date, setDate] = useState("");
  const [priceType, setPriceType] = useState("all");
  const [eventFormat, setEventFormat] = useState("all");
  const [sort, setSort] = useState("recommended");
  const [page, setPage] = useState(1);
  const [hasMoreFeatured, setHasMoreFeatured] = useState(true);
  const [spotlightIndex, setSpotlightIndex] = useState(0);
  const [isSpotlightPaused, setIsSpotlightPaused] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedInsight, setSelectedInsight] = useState<EventPost | null>(null);
  const [feedback, setFeedback] = useState("");
  const featuredScroller = useRef<HTMLDivElement>(null);

  useEffect(() => {
    queueMicrotask(() => {
      const stored = readStoredEvents();
      const storedIds = new Set(stored.map((event) => event.id));
      setEvents([...stored, ...sampleEvents.filter((event) => !storedIds.has(event.id))]);
      setSavedIds(readSavedIds());
      const params = new URLSearchParams(window.location.search);
      setSearch(params.get("search") ?? "");
      setCategory(params.get("category") ?? "all");
      setIsLoading(false);
    });
  }, []);

  useEffect(() => {
    const syncQuery = (event: Event) => {
      const detail = (event as CustomEvent<{ search: string; category: string }>).detail;
      setSearch(detail.search);
      setCategory(detail.category);
      setPage(1);
    };
    window.addEventListener("eventis-event-search", syncQuery);
    return () => window.removeEventListener("eventis-event-search", syncQuery);
  }, []);

  useEffect(() => {
    if (!selectedInsight) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelectedInsight(null);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [selectedInsight]);

  useEffect(() => {
    if (!feedback) return;
    const timer = window.setTimeout(() => setFeedback(""), 2600);
    return () => window.clearTimeout(timer);
  }, [feedback]);

  useEffect(() => {
    if (isSpotlightPaused || posterSlides.length < 2) return;
    const timer = window.setTimeout(() => {
      setSpotlightIndex((index) => (index + 1) % posterSlides.length);
    }, 5000);
    return () => window.clearTimeout(timer);
  }, [isSpotlightPaused, spotlightIndex]);

  useEffect(() => {
    if (showEventGrid) return;
    const scroller = featuredScroller.current;
    if (!scroller) return;

    const updateMoreState = () => {
      setHasMoreFeatured(scroller.scrollLeft + scroller.clientWidth < scroller.scrollWidth - 1);
    };

    updateMoreState();
    scroller.addEventListener("scroll", updateMoreState);
    const resizeObserver = new ResizeObserver(updateMoreState);
    resizeObserver.observe(scroller);
    return () => {
      scroller.removeEventListener("scroll", updateMoreState);
      resizeObserver.disconnect();
    };
  }, [events.length, showEventGrid]);

  const locations = useMemo(
    () => [...new Set(events.map((event) => event.location).filter(Boolean))].sort(),
    [events],
  );

  const filteredEvents = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    const results = events.filter((event) => {
      const searchable = `${event.title} ${event.description} ${event.location} ${event.category}`.toLowerCase();
      return (
        (!normalizedSearch || searchable.includes(normalizedSearch)) &&
        matchesCategory(event, category) &&
        (location === "all" || event.location === location) &&
        (!date || event.startDate === date) &&
        (priceType === "all" || event.priceType === priceType) &&
        (eventFormat === "all" || (event.eventFormat ?? "In person") === eventFormat)
      );
    });

    if (sort === "newest") return results.sort((a, b) => b.startDate.localeCompare(a.startDate));
    if (sort === "upcoming") return results.sort((a, b) => a.startDate.localeCompare(b.startDate));
    if (sort === "popular") return results.sort((a, b) => b.viewsCount - a.viewsCount);
    return results;
  }, [category, date, eventFormat, events, location, priceType, search, sort]);

  const totalPages = Math.max(1, Math.ceil(filteredEvents.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const visibleEvents = filteredEvents.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const activeFilterCount = [
    category !== "all",
    location !== "all",
    Boolean(date),
    priceType !== "all",
    eventFormat !== "all",
  ].filter(Boolean).length;

  function setFilter(setter: (value: string) => void, value: string) {
    setter(value);
    setPage(1);
  }

  function clearFilters() {
    setSearch("");
    setCategory("all");
    setLocation("all");
    setDate("");
    setPriceType("all");
    setEventFormat("all");
    setSort("recommended");
    setPage(1);
    router.replace("/events");
    window.dispatchEvent(new CustomEvent("eventis-event-search", { detail: { search: "", category: "all" } }));
  }

  function toggleSave(event: EventPost) {
    const isSaved = savedIds.includes(event.id);
    const next = isSaved ? savedIds.filter((id) => id !== event.id) : [...savedIds, event.id];
    setSavedIds(next);
    localStorage.setItem(savedEventStorageKey, JSON.stringify(next));
    setFeedback(isSaved ? "Event removed from saved" : "Event saved");
  }

  async function shareEvent(event: EventPost) {
    const url = `${window.location.origin}/events/${event.id}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: event.title, text: event.description, url });
        setFeedback("Event shared");
      } else {
        await navigator.clipboard.writeText(url);
        setFeedback("Event link copied");
      }
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") return;
      setFeedback("Share this event: " + url);
    }
  }

  function goToPage(nextPage: number) {
    setPage(Math.max(1, Math.min(totalPages, nextPage)));
    document.getElementById("event-discovery-heading")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  const firstPage = Math.max(1, Math.min(currentPage - 2, totalPages - 4));
  const pageNumbers = Array.from({ length: Math.min(5, totalPages) }, (_, index) => firstPage + index);
  const spotlight = posterSlides[spotlightIndex % posterSlides.length];

  function showMoreFeatured() {
    featuredScroller.current?.scrollBy({ left: featuredScroller.current.clientWidth, behavior: "smooth" });
  }

  return (
    <section id="discover-events" className="event-discovery-section">
      <div className="event-discovery-container">
        {!showEventGrid && (
          <>
            <div className="event-stories" aria-label="Event stories">
              {events.map((event, index) => (
                <button
                  key={event.id}
                  type="button"
                  className="event-story"
                  onClick={() => featuredScroller.current?.children[index]?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "start" })}
                  aria-label={`Show ${event.title}`}
                >
                  <span className="event-story-ring">
                    <span className="event-story-image">
                      <Image src={event.coverImage} alt="" fill unoptimized sizes="72px" />
                    </span>
                  </span>
                  <span className="event-story-title">{event.title}</span>
                </button>
              ))}
            </div>
            <div className="event-featured-heading">
              <h2>Featured events</h2>
              <button type="button" onClick={showMoreFeatured} disabled={!hasMoreFeatured}>
                {hasMoreFeatured ? "View more" : "All events shown"}
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6" /></svg>
              </button>
            </div>
          </>
        )}
        <div ref={showEventGrid ? undefined : featuredScroller} className={`event-discovery-showcase${showEventGrid ? "" : " event-discovery-featured-grid"}`}>
          {!showEventGrid && events.map((event) => (
            <article className="event-feature-card" key={event.id}>
              <Link href={`/events/${event.id}`} className="event-feature-card-link">
                <div className="event-feature-poster">
                  <Image src={event.coverImage} alt={event.title} fill unoptimized sizes="(max-width: 520px) 100vw, (max-width: 900px) 50vw, 33vw" className="event-feature-poster-image" />
                  <span className="event-feature-date">{formatDate(event.startDate)}</span>
                </div>
                <div className="event-feature-details">
                  <p className="event-feature-location">
                    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="2.5" /></svg>
                    <span>{event.location}</span>
                  </p>
                  <h2>{event.title}</h2>
                  <div className="event-feature-footer">
                    <span className="event-feature-category"><span aria-hidden="true">{event.category.slice(0, 1).toUpperCase()}</span>{event.category}</span>
                    <span className="event-feature-price">
                      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.6 13.4 13.4 20.6a2 2 0 0 1-2.8 0L3 13V3h10l7.6 7.6a2 2 0 0 1 0 2.8Z" /><circle cx="7.5" cy="7.5" r="1" /></svg>
                      {event.priceType === "free" ? "Free entry" : event.price || "Paid entry"}
                    </span>
                  </div>
                </div>
              </Link>
            </article>
          ))}

          {showEventGrid && <>
          <article className="event-spotlight-card">
            <Image src={spotlight.image} alt="" fill unoptimized aria-hidden="true" className="event-spotlight-backdrop" />
            <Image src={spotlight.image} alt={spotlight.title} fill unoptimized className="event-spotlight-image" />
            <div className="event-spotlight-shade" />
            <div className="event-spotlight-topline">
              <span>FEATURED EVENT POSTERS</span>
              <div className="event-spotlight-controls">
                <button type="button" onClick={() => setSpotlightIndex((index) => (index - 1 + posterSlides.length) % posterSlides.length)} aria-label="Previous poster">←</button>
                <button type="button" onClick={() => setIsSpotlightPaused((paused) => !paused)} aria-label={isSpotlightPaused ? "Resume poster slideshow" : "Pause poster slideshow"}>
                  {isSpotlightPaused ? "Play" : "Pause"}
                </button>
                <button type="button" onClick={() => setSpotlightIndex((index) => (index + 1) % posterSlides.length)} aria-label="Next poster">→</button>
              </div>
            </div>
            <div className="event-spotlight-copy" aria-live="polite">
              <p>{spotlight.subtitle}</p>
              <h2>{spotlight.title}</h2>
              <span>{spotlight.location}</span>
              <Link href={spotlight.href}>View event</Link>
            </div>
            <div className="sr-only" aria-live="polite">{spotlight.title}</div>
            <div className="event-spotlight-dots" aria-label="Poster pagination">
              <span>{spotlightIndex + 1} / {posterSlides.length}</span>
              {posterSlides.map((slide, index) => (
                <button key={slide.id} type="button" aria-label={`Show poster ${index + 1}: ${slide.title}`} aria-current={index === spotlightIndex} className={index === spotlightIndex ? "is-current" : ""} onClick={() => setSpotlightIndex(index)} />
              ))}
            </div>
          </article>

          <aside className="event-venues-panel" aria-labelledby="event-venues-title">
            <div className="event-venues-heading">
              <div><p>EXPLORE PLACES</p><h2 id="event-venues-title">Venues</h2></div>
              <Link href="/events">All events</Link>
            </div>
            <div className="event-venues-grid">
              {venues.map((venue) => (
                <Link key={venue.name} href={`/events?search=${encodeURIComponent(venue.name)}`} className="event-venue-card">
                  <Image src={venue.image} alt="" fill unoptimized className="event-venue-image" />
                  <span className="event-venue-shade" />
                  <span className="event-venue-copy"><strong>{venue.name}</strong><span>{venue.activity}</span></span>
                </Link>
              ))}
            </div>
          </aside>
          </>}
        </div>

        {showEventGrid && <div className="event-discovery-heading-row">
          <div>
            <p className="event-discovery-eyebrow">THE EVENTIS LIST</p>
            <h2 id="event-discovery-heading">Discover Events</h2>
            <p className="event-discovery-subtitle">Find events that match your interests.</p>
          </div>
          <p className="event-result-total">{filteredEvents.length} events</p>
        </div>}

        {showEventGrid && <div className="event-filter-toolbar">
          <button
            type="button"
            className="event-mobile-filter-trigger"
            aria-expanded={isFilterOpen}
            aria-controls="event-filter-panel"
            onClick={() => setIsFilterOpen((open) => !open)}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-none stroke-current" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 5h16M7 12h10m-7 7h4" /></svg>
            <span>Filters{activeFilterCount ? ` (${activeFilterCount})` : ""}</span>
          </button>
          <div id="event-filter-panel" className={`event-filter-panel${isFilterOpen ? " is-open" : ""}`}>
            <label className="event-filter-control">
              <span>Category</span>
              <select value={category} onChange={(event) => setFilter(setCategory, event.target.value)}>
                {categoryOptions.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
              </select>
            </label>
            <label className="event-filter-control">
              <span>Location</span>
              <select value={location} onChange={(event) => setFilter(setLocation, event.target.value)}>
                <option value="all">All locations</option>
                {locations.map((item) => <option key={item} value={item}>{item}</option>)}
              </select>
            </label>
            <label className="event-filter-control">
              <span>Date</span>
              <input type="date" value={date} onChange={(event) => setFilter(setDate, event.target.value)} />
            </label>
            <label className="event-filter-control">
              <span>Event type</span>
              <select value={priceType} onChange={(event) => setFilter(setPriceType, event.target.value)}>
                <option value="all">All prices</option>
                <option value="free">Free</option>
                <option value="paid">Paid</option>
              </select>
            </label>
            <label className="event-filter-control">
              <span>Format</span>
              <select value={eventFormat} onChange={(event) => setFilter(setEventFormat, event.target.value)}>
                <option value="all">All formats</option>
                <option value="In person">In person</option>
                <option value="Online">Online</option>
              </select>
            </label>
            <label className="event-filter-control event-sort-control">
              <span>Sort by</span>
              <select value={sort} onChange={(event) => setFilter(setSort, event.target.value)}>
                <option value="recommended">Recommended</option>
                <option value="newest">Newest</option>
                <option value="upcoming">Upcoming</option>
                <option value="popular">Most popular</option>
              </select>
            </label>
            {(activeFilterCount > 0 || search) && (
              <button type="button" className="event-clear-filters" onClick={clearFilters}>Clear filters</button>
            )}
          </div>
        </div>}

        {showEventGrid && (isLoading ? (
          <div className="event-discovery-grid" aria-label="Loading events">
            {Array.from({ length: pageSize }, (_, index) => <div className="event-card-skeleton" key={index}><div /><span /><span /><span /></div>)}
          </div>
        ) : visibleEvents.length ? (
          <div className="event-discovery-grid">
            {visibleEvents.map((event) => {
              const isSaved = savedIds.includes(event.id);
              return (
                <article className="event-discovery-card" key={event.id}>
                  <div className="event-card-cover">
                    <Link href={`/events/${event.id}`} className="event-card-image-link" aria-label={`View ${event.title}`}>
                      <Image src={event.coverImage} alt={event.title} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw" unoptimized className="event-card-image" />
                    </Link>
                    <span className="event-card-category">{event.category}</span>
                    <button type="button" className={`event-card-save${isSaved ? " is-saved" : ""}`} aria-pressed={isSaved} onClick={() => toggleSave(event)}>
                      <ActionIcon name="save" />
                      <span>{isSaved ? "Saved" : "Save"}</span>
                    </button>
                  </div>
                  <div className="event-card-content">
                    <Link href={`/events/${event.id}`} className="event-card-title-link">
                      <h3>{event.title}</h3>
                    </Link>
                    <p className="event-card-description">{event.description}</p>
                    <div className="event-card-meta">
                      <p><span aria-hidden="true">◷</span>{formatDate(event.startDate)}{event.endDate !== event.startDate ? ` – ${formatDate(event.endDate)}` : ""} · {event.time}</p>
                      <p><span aria-hidden="true">⌖</span>{event.location}</p>
                    </div>
                    <div className="event-card-footer">
                      <span className="event-card-price">{event.priceType === "free" ? "Free" : event.price || "Paid"}</span>
                      <div className="event-card-actions">
                        <button type="button" onClick={() => void shareEvent(event)}><ActionIcon name="share" /><span>Share</span></button>
                        <button type="button" onClick={() => setSelectedInsight(event)}><ActionIcon name="insights" /><span>Insights ({(event.viewsCount || 120).toLocaleString()})</span></button>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="event-empty-state">
            <span aria-hidden="true" className="event-empty-mark">⌕</span>
            <h3>No events found</h3>
            <p>Try changing your filters or search criteria.</p>
            <button type="button" onClick={clearFilters}>Clear filters</button>
          </div>
        ))}

        {showEventGrid && !isLoading && totalPages > 1 && (
          <nav className="event-pagination" aria-label="Event pages">
            <button type="button" onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1}>Previous</button>
            {pageNumbers.map((number) => (
              <button key={number} type="button" aria-current={number === currentPage ? "page" : undefined} className={number === currentPage ? "is-current" : ""} onClick={() => goToPage(number)}>{number}</button>
            ))}
            <button type="button" onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages}>Next</button>
          </nav>
        )}
      </div>

      {showEventGrid && selectedInsight && (
        <div className="event-insights-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setSelectedInsight(null); }}>
          <section className="event-insights-dialog" role="dialog" aria-modal="true" aria-labelledby="event-insights-title">
            <div className="event-insights-heading">
              <div><p>EVENT PERFORMANCE</p><h2 id="event-insights-title">{selectedInsight.title}</h2></div>
              <button type="button" aria-label="Close insights" onClick={() => setSelectedInsight(null)}>×</button>
            </div>
            <div className="event-insights-grid">
              <div><span>Views</span><strong>{selectedInsight.viewsCount}</strong></div>
              <div><span>Saves</span><strong>{(selectedInsight.savesCount ?? 0) + (savedIds.includes(selectedInsight.id) ? 1 : 0)}</strong></div>
              <div><span>Shares</span><strong>{selectedInsight.sharesCount ?? 0}</strong></div>
              <div><span>Engagement</span><strong>{Math.min(100, Math.round((((selectedInsight.savesCount ?? 0) + (selectedInsight.sharesCount ?? 0)) / Math.max(1, selectedInsight.viewsCount)) * 100))}%</strong></div>
            </div>
            <p className="event-insights-note">Preview metrics are local estimates until event analytics are connected.</p>
          </section>
        </div>
      )}

      {showEventGrid && feedback && <div className="event-action-feedback" role="status">{feedback}</div>}
    </section>
  );
}