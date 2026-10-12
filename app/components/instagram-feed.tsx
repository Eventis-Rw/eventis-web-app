"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  eventStorageKey,
  sampleEvents,
  savedEventStorageKey,
  type EventPost,
} from "../lib/events";
import {
  AUTH_CHANGE_EVENT,
  clearUserSession,
  getStoredUser,
  type EventisUser,
} from "../lib/auth";

// Format count exactly like mobile app: formatCount (EventCard.tsx line 1313)
function formatCount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1).replace(/\.0$/, "")}k`;
  return String(n);
}

// Format date exactly like mobile app: en-GB format (day month year) (EventCard.tsx line 1304)
function formatDate(dateStr: string): string {
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

type StoryItem = {
  id: string;
  organizerName: string;
  organizerAvatar: string;
  storyImage: string;
  eventTitle: string;
  eventId: string;
  timeAgo: string;
};

// Stories directly matching mobile app components/StoriesBar.tsx
const DEFAULT_STORIES: StoryItem[] = [
  {
    id: "story_1",
    organizerName: "Kigali Jazz",
    organizerAvatar: "/eve1.jpg",
    storyImage: "/event.jpg",
    eventTitle: "Neon Pulse Music Festival",
    eventId: "sample-jazz-under-stars",
    timeAgo: "2h ago",
  },
  {
    id: "story_2",
    organizerName: "Tech Kigali",
    organizerAvatar: "/chart1.png",
    storyImage: "/chart1.png",
    eventTitle: "FutureTech Summit 2026",
    eventId: "sample-tech-summit",
    timeAgo: "4h ago",
  },
  {
    id: "story_3",
    organizerName: "Street Food Fest",
    organizerAvatar: "/eve2.jpg",
    storyImage: "/eve2.jpg",
    eventTitle: "Global Street Food Carnival",
    eventId: "sample-food-culture-fair",
    timeAgo: "6h ago",
  },
  {
    id: "story_4",
    organizerName: "BK Arena",
    organizerAvatar: "/event.jpg",
    storyImage: "/event.jpg",
    eventTitle: "Kigali City Basketball Open",
    eventId: "sample-basketball-open",
    timeAgo: "8h ago",
  },
  {
    id: "story_5",
    organizerName: "Fashion Collective",
    organizerAvatar: "/eve3.jpg",
    storyImage: "/eve3.jpg",
    eventTitle: "Kigali Fashion Week Runway",
    eventId: "sample-fashion-week",
    timeAgo: "11h ago",
  },
  {
    id: "story_6",
    organizerName: "Yoga Life",
    organizerAvatar: "/eve4.jpg",
    storyImage: "/event.jpg",
    eventTitle: "Morning Yoga at Inzora Rooftop",
    eventId: "sample-rooftop-cinema",
    timeAgo: "14h ago",
  },
  {
    id: "story_7",
    organizerName: "Midnight Beats",
    organizerAvatar: "/eve1.jpg",
    storyImage: "/eve1.jpg",
    eventTitle: "Midnight Lounge Sessions",
    eventId: "sample-jazz-under-stars",
    timeAgo: "16h ago",
  },
  {
    id: "story_8",
    organizerName: "Art Rwanda",
    organizerAvatar: "/eve2.jpg",
    storyImage: "/eve2.jpg",
    eventTitle: "Kigali Contemporary Art Showcase",
    eventId: "sample-food-culture-fair",
    timeAgo: "18h ago",
  },
];

const mockChatContacts = [
  { id: "c1", name: "Aline Mugisha", headline: "Active on Eventis", avatar: "/eve1.jpg" },
  { id: "c2", name: "Eric Kayiranga", headline: "See you at BK Arena!", avatar: "/eve2.jpg" },
  { id: "c3", name: "Diane Uwase", headline: "Let's get tickets together", avatar: "/eve3.jpg" },
  { id: "c4", name: "Patrick Ndayisaba", headline: "Kigali music enthusiast", avatar: "/eve4.jpg" },
];

const suggestedOrganizers = [
  { handle: "bk_arena_rw", name: "BK Arena Rwanda", avatar: "/event.jpg", subtitle: "Major Stadium & Events" },
  { handle: "kcc_rwanda", name: "Kigali Convention Centre", avatar: "/eve1.jpg", subtitle: "Conferences & Summits" },
  { handle: "zaria_court", name: "Zaria Court Kigali", avatar: "/eve3.jpg", subtitle: "Sports & Culture Hub" },
  { handle: "mundi_center", name: "Mundi Center", avatar: "/event-poster-3.jpg", subtitle: "Creative Arts Center" },
];

function getOrganizer(event: EventPost) {
  const customOrg = (event as Record<string, unknown>).organizer;
  if (typeof customOrg === "string" && customOrg.trim()) {
    return {
      name: customOrg,
      initial: customOrg.charAt(0).toUpperCase(),
      isSponsored: Boolean((event as Record<string, unknown>).isSponsored),
      avatar: (event as Record<string, unknown>).organizerAvatar as string | null,
    };
  }

  const loc = event.location.toLowerCase();
  const cat = event.category.toLowerCase();

  if (loc.includes("bk arena") || loc.includes("kigali arena")) {
    return { name: "BK Arena Official", initial: "B", isSponsored: true, avatar: "/event.jpg" };
  }
  if (loc.includes("convention center") || loc.includes("convention centre")) {
    return { name: "Kigali Convention Centre", initial: "K", isSponsored: true, avatar: "/eve1.jpg" };
  }
  if (loc.includes("mundi center")) {
    return { name: "Mundi Center", initial: "M", isSponsored: false, avatar: "/event-poster-3.jpg" };
  }
  if (loc.includes("norrsken")) {
    return { name: "Norrsken House Kigali", initial: "N", isSponsored: false, avatar: "/chart1.png" };
  }
  if (cat.includes("fashion")) {
    return { name: "Kigali Fashion Week", initial: "F", isSponsored: true, avatar: "/eve3.jpg" };
  }
  if (cat.includes("festival") || cat.includes("music")) {
    return { name: "Kigali Music Society", initial: "M", isSponsored: false, avatar: "/eve2.jpg" };
  }

  const name = event.location.split(",")[0] || "Eventis Organiser";
  return { name, initial: name.charAt(0).toUpperCase(), isSponsored: false, avatar: null };
}

function readStoredEvents(): EventPost[] {
  try {
    const value: unknown = JSON.parse(localStorage.getItem(eventStorageKey) ?? "[]");
    return Array.isArray(value) ? (value as EventPost[]) : [];
  } catch {
    return [];
  }
}

function readSavedIds(): string[] {
  try {
    const value: unknown = JSON.parse(localStorage.getItem(savedEventStorageKey) ?? "[]");
    return Array.isArray(value)
      ? value.filter((item): item is string => typeof item === "string")
      : [];
  } catch {
    return [];
  }
}

export default function InstagramFeed() {
  const [events, setEvents] = useState<EventPost[]>(sampleEvents);
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [sharesState, setSharesState] = useState<Record<string, number>>({});
  const [hiddenPostIds, setHiddenPostIds] = useState<Set<string>>(new Set());
  const [expandedCaptions, setExpandedCaptions] = useState<Record<string, boolean>>({});

  // Stories State
  const allStories = DEFAULT_STORIES;
  const [activeStoryIndex, setActiveStoryIndex] = useState<number | null>(null);
  const [storyProgress, setStoryProgress] = useState(0);
  const [isStoryPaused, setIsStoryPaused] = useState(false);
  const [viewedStories, setViewedStories] = useState<Set<string>>(new Set());

  // Current user state
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<EventisUser | null>(null);
  const [isPoster, setIsPoster] = useState(false);
  const [isOrganizerModalOpen, setIsOrganizerModalOpen] = useState(false);
  const [orgBrandName, setOrgBrandName] = useState("");
  const [orgCategory, setOrgCategory] = useState("Concerts & Music");
  const [orgDescription, setOrgDescription] = useState("");
  const [orgPhone, setOrgPhone] = useState("");

  useEffect(() => {
    const syncUser = () => {
      setCurrentUser(getStoredUser());
    };
    const syncRole = () => {
      setIsPoster(localStorage.getItem("eventis-role") === "poster");
    };
    queueMicrotask(() => {
      syncUser();
      syncRole();
    });
    window.addEventListener(AUTH_CHANGE_EVENT, syncUser);
    window.addEventListener("eventis-role-change", syncRole);
    window.addEventListener("storage", syncUser);
    window.addEventListener("storage", syncRole);
    return () => {
      window.removeEventListener(AUTH_CHANGE_EVENT, syncUser);
      window.removeEventListener("eventis-role-change", syncRole);
      window.removeEventListener("storage", syncUser);
      window.removeEventListener("storage", syncRole);
    };
  }, []);

  const handleActivateOrganizer = (e: React.FormEvent) => {
    e.preventDefault();
    const finalName = orgBrandName.trim() || currentUser?.fullName || "Rwanda Organizer";
    localStorage.setItem("eventis-role", "poster");
    localStorage.setItem("eventis-organizer-name", finalName);
    localStorage.setItem("eventis-organizer-category", orgCategory);
    setIsPoster(true);
    window.dispatchEvent(new Event("eventis-role-change"));
    window.dispatchEvent(new Event("storage"));
    setIsOrganizerModalOpen(false);
    showToast("🎉 Organizer profile activated! Welcome, " + finalName);
    router.push("/events/create");
  };

  // Modals matching mobile app (insightsModal, shareModal, optionsModal)
  const [activeInsightEvent, setActiveInsightEvent] = useState<EventPost | null>(null);
  const [activeShareEvent, setActiveShareEvent] = useState<EventPost | null>(null);
  const [activeOptionsEvent, setActiveOptionsEvent] = useState<EventPost | null>(null);
  const [reportFeedbackEventId, setReportFeedbackEventId] = useState<string | null>(null);
  const [chatSearch, setChatSearch] = useState("");
  const [sentChatIds, setSentChatIds] = useState<Record<string, boolean>>({});
  const [copyFeedback, setCopyFeedback] = useState(false);
  const [sendingAll, setSendingAll] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  // Filters (Category list from mobile app constants/events.ts: CATEGORIES)
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const storyTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Stories horizontal scroll pagination (< and >)
  const storiesScrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkStoriesScroll = () => {
    const el = storiesScrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 6);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 6);
  };

  const handleScrollStories = (direction: "left" | "right") => {
    const el = storiesScrollRef.current;
    if (!el) return;
    const scrollAmount = 260;
    el.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    const el = storiesScrollRef.current;
    if (!el) return;
    queueMicrotask(() => {
      checkStoriesScroll();
    });
    const onScroll = () => checkStoriesScroll();
    const onResize = () => checkStoriesScroll();
    el.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      el.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, [allStories]);

  useEffect(() => {
    queueMicrotask(() => {
      const stored = readStoredEvents();
      const storedIds = new Set(stored.map((e) => e.id));
      const merged = [...stored, ...sampleEvents.filter((e) => !storedIds.has(e.id))];
      setEvents(merged);
      const initialSaved = readSavedIds();
      setSavedIds(initialSaved);

      // Initial shares based on mobile app formula: Math.max(14, Math.floor(viewsCount * 0.082))
      const initialShares: Record<string, number> = {};
      merged.forEach((event) => {
        const views = event.viewsCount || 120;
        initialShares[event.id] = Math.max(14, Math.floor(views * 0.082));
      });
      setSharesState(initialShares);

      const params = new URLSearchParams(window.location.search);
      setSearchQuery(params.get("search") ?? "");
      setSelectedCategory(params.get("category") ?? "All");
    });
  }, []);

  useEffect(() => {
    const handleSearch = (e: Event) => {
      const detail = (e as CustomEvent<{ search: string; category: string }>).detail;
      if (detail) {
        setSearchQuery(detail.search || "");
        setSelectedCategory(detail.category || "All");
      }
    };
    window.addEventListener("eventis-event-search", handleSearch);
    return () => window.removeEventListener("eventis-event-search", handleSearch);
  }, []);

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (query.trim()) {
        params.set("search", query.trim());
      } else {
        params.delete("search");
      }
      const newUrl = params.toString() ? `/?${params.toString()}` : "/";
      window.history.replaceState(null, "", newUrl);
    }
  };

  const handleCategorySelect = (cat: string) => {
    setSelectedCategory(cat);
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (cat !== "All") {
        params.set("category", cat);
      } else {
        params.delete("category");
      }
      const newUrl = params.toString() ? `/?${params.toString()}` : "/";
      window.history.replaceState(null, "", newUrl);
    }
  };

  const showToast = (message: string) => {
    setToastMessage(message);
    window.setTimeout(() => setToastMessage(""), 2600);
  };

  // Save Event logic (persisted to savedEventStorageKey without count display, exactly like mobile app EventCard.tsx)
  const toggleSave = (eventId: string) => {
    if (!currentUser) {
      showToast("Login required to save events");
      router.push("/users/auth/login");
      return;
    }
    const isSaved = savedIds.includes(eventId);
    const nextSaved = isSaved
      ? savedIds.filter((id) => id !== eventId)
      : [...savedIds, eventId];
    setSavedIds(nextSaved);
    localStorage.setItem(savedEventStorageKey, JSON.stringify(nextSaved));
    window.dispatchEvent(new Event("storage"));
    showToast(isSaved ? "Removed from saved events" : "Event saved to your collection");
  };

  const handleViewEvent = (eventId: string) => {
    if (!currentUser) {
      showToast("Login required to view event details");
      router.push("/users/auth/login");
      return;
    }
    router.push(`/events/${eventId}`);
  };

  const handleShare = (event: EventPost) => {
    setChatSearch("");
    setActiveShareEvent(event);
  };

  const handleNativeShare = async (event: EventPost) => {
    const url = `${window.location.origin}/events/${event.id}`;
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: event.title,
          text: `Check out this event: ${event.title}\n📍 ${event.location}\n📅 ${formatDate(event.startDate)} · ${event.time}`,
          url,
        });
        setSharesState((prev) => ({ ...prev, [event.id]: (prev[event.id] || 0) + 1 }));
        setActiveShareEvent(null);
        showToast("Shared successfully!");
        return;
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") return;
      }
    }
    handleCopyLink(event);
  };

  const handleCopyLink = (event: EventPost) => {
    const url = `${window.location.origin}/events/${event.id}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopyFeedback(true);
      setSharesState((prev) => ({ ...prev, [event.id]: (prev[event.id] || 0) + 1 }));
      showToast("Link copied to clipboard!");
      setTimeout(() => setCopyFeedback(false), 2000);
    });
  };

  const handleSendToChat = (contactId: string, event: EventPost) => {
    if (!currentUser) {
      showToast("Login required to chat");
      router.push("/users/auth/login");
      return;
    }
    if (sentChatIds[contactId]) return;
    setSentChatIds((prev) => ({ ...prev, [contactId]: true }));
    setSharesState((prev) => ({ ...prev, [event.id]: (prev[event.id] || 0) + 1 }));
    showToast("Sent in chat!");
  };

  const handleSendToAllChats = (event: EventPost) => {
    if (!currentUser) {
      showToast("Login required to send to chats");
      router.push("/users/auth/login");
      return;
    }
    if (sendingAll) return;
    setSendingAll(true);
    const newSent: Record<string, boolean> = {};
    mockChatContacts.forEach((c) => {
      newSent[c.id] = true;
    });
    setSentChatIds(newSent);
    setSharesState((prev) => ({ ...prev, [event.id]: (prev[event.id] || 0) + mockChatContacts.length }));
    showToast("Sent to all chats!");
    setTimeout(() => setSendingAll(false), 800);
  };

  const handleHidePost = (eventId: string) => {
    setHiddenPostIds((prev) => new Set([...prev, eventId]));
    setActiveOptionsEvent(null);
  };

  const handleUnhidePost = (eventId: string) => {
    setHiddenPostIds((prev) => {
      const next = new Set(prev);
      next.delete(eventId);
      return next;
    });
  };

  const handleReportPost = (eventId: string) => {
    setReportFeedbackEventId(eventId);
    setTimeout(() => {
      setActiveOptionsEvent(null);
      setReportFeedbackEventId(null);
      showToast("Report submitted. We will review this event within 24 hours.");
    }, 1400);
  };

  // Stories Logic

  const openStory = (index: number) => {
    setActiveStoryIndex(index);
    setStoryProgress(0);
    setIsStoryPaused(false);
    const storyId = allStories[index]?.id;
    if (storyId) {
      setViewedStories((prev) => new Set([...prev, storyId]));
    }
  };

  const closeStory = () => {
    setActiveStoryIndex(null);
    setStoryProgress(0);
    setIsStoryPaused(false);
  };

  const nextStory = () => {
    if (activeStoryIndex === null) return;
    if (activeStoryIndex < allStories.length - 1) {
      openStory(activeStoryIndex + 1);
    } else {
      closeStory();
    }
  };

  const prevStory = () => {
    if (activeStoryIndex === null) return;
    if (activeStoryIndex > 0) {
      openStory(activeStoryIndex - 1);
    } else {
      setStoryProgress(0);
    }
  };

  const nextStoryRef = useRef(nextStory);
  const prevStoryRef = useRef(prevStory);
  const closeStoryRef = useRef(closeStory);

  useEffect(() => {
    nextStoryRef.current = nextStory;
    prevStoryRef.current = prevStory;
    closeStoryRef.current = closeStory;
  });

  // Story progress timer (5000ms duration per story, exactly like mobile app StoriesBar.tsx)
  useEffect(() => {
    if (activeStoryIndex === null || isStoryPaused) {
      if (storyTimerRef.current) clearInterval(storyTimerRef.current);
      return;
    }

    const intervalTime = 50;
    const totalDuration = 5000;
    const step = (intervalTime / totalDuration) * 100;

    storyTimerRef.current = setInterval(() => {
      setStoryProgress((prev) => {
        if (prev >= 100) {
          nextStoryRef.current();
          return 0;
        }
        return prev + step;
      });
    }, intervalTime);

    return () => {
      if (storyTimerRef.current) clearInterval(storyTimerRef.current);
    };
  }, [activeStoryIndex, isStoryPaused]);

  // Keyboard navigation for stories & modals
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeStoryIndex !== null) {
        if (e.key === "Escape") closeStoryRef.current();
        if (e.key === "ArrowRight") nextStoryRef.current();
        if (e.key === "ArrowLeft") prevStoryRef.current();
        if (e.key === " ") setIsStoryPaused((p) => !p);
      }
      if (activeInsightEvent && e.key === "Escape") setActiveInsightEvent(null);
      if (activeShareEvent && e.key === "Escape") setActiveShareEvent(null);
      if (activeOptionsEvent && e.key === "Escape") setActiveOptionsEvent(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeStoryIndex, activeInsightEvent, activeShareEvent, activeOptionsEvent]);

  // Feed filtering
  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      const matchSearch =
        !searchQuery ||
        `${event.title} ${event.description} ${event.location} ${event.category}`
          .toLowerCase()
          .includes(searchQuery.toLowerCase());
      const matchCat =
        selectedCategory === "All" ||
        event.category.toLowerCase().includes(selectedCategory.toLowerCase());
      return matchSearch && matchCat;
    });
  }, [events, searchQuery, selectedCategory]);

  // Mobile App Categories list (constants/events.ts: CATEGORIES)
  const categories = ["All", "Music", "Sports", "Business", "Food", "Tech", "Art", "Nightlife", "Community"];

  return (
    <div className="relative min-h-screen bg-[#070814] text-[#F4F7FF] pb-16">
      <div className="relative z-10 mx-auto max-w-[960px] px-2 sm:px-4 py-4 md:py-6 flex justify-center gap-8 lg:gap-10">
        
        {/* Main Feed Column (Instagram proportions: max-w-[490px]) */}
        <main className="w-full max-w-[490px] flex flex-col gap-4 sm:gap-5">

          {/* Stories Tray (Pure Instagram Style with < and > pagination) */}
          <div className="relative w-full group">
            {/* Left pagination chevron (<) */}
            {canScrollLeft && (
              <button
                type="button"
                onClick={() => handleScrollStories("left")}
                aria-label="Previous stories"
                className="absolute -left-1.5 top-[38px] -translate-y-1/2 z-20 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#070814]/90 hover:bg-[#10162C] border border-white/[0.20] text-[#F4F7FF] flex items-center justify-center shadow-xl backdrop-blur-md transition-all hover:scale-105 active:scale-95 cursor-pointer"
              >
                <svg className="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </button>
            )}

            {/* Right pagination chevron (>) */}
            {canScrollRight && (
              <button
                type="button"
                onClick={() => handleScrollStories("right")}
                aria-label="Next stories"
                className="absolute -right-1.5 top-[38px] -translate-y-1/2 z-20 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#070814]/90 hover:bg-[#10162C] border border-white/[0.20] text-[#F4F7FF] flex items-center justify-center shadow-xl backdrop-blur-md transition-all hover:scale-105 active:scale-95 cursor-pointer"
              >
                <svg className="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            )}

            <div
              ref={storiesScrollRef}
              className="w-full overflow-x-auto pb-1 scrollbar-none scroll-smooth"
            >
              <div className="flex items-center gap-4 sm:gap-5 px-1 py-1">
                {/* User Story Circle ("Your story") */}
                <Link
                  href="/events/create"
                  className="flex flex-col items-center gap-1.5 shrink-0 group focus:outline-none"
                >
                  <div className="relative w-[68px] h-[68px] rounded-full p-[2px] border border-white/[0.16] group-hover:border-[#00A3FF] transition">
                    <div className="relative w-full h-full rounded-full bg-white/[0.08] flex items-center justify-center overflow-hidden">
                      <span className="text-xl font-bold text-[#A7B0C9]">👤</span>
                    </div>
                    <div className="absolute bottom-0 right-0 w-[20px] h-[20px] rounded-full bg-[#00A3FF] border-2 border-[#070814] flex items-center justify-center text-[12px] font-bold text-white shadow-sm">
                      +
                    </div>
                  </div>
                  <span className="text-[11px] font-medium text-[#A7B0C9] truncate max-w-[68px] text-center">
                    Your story
                  </span>
                </Link>

                {/* Organizer Stories (Exact mobile activeAvatarRing: crisp electric blue ring, no gradients) */}
                {allStories.map((story, idx) => {
                  const isViewed = viewedStories.has(story.id);
                  return (
                    <button
                      key={story.id}
                      type="button"
                      onClick={() => openStory(idx)}
                      className="flex flex-col items-center gap-1.5 shrink-0 group cursor-pointer focus:outline-none"
                    >
                      <div
                        className={`relative w-[68px] h-[68px] rounded-full p-[2px] transition-transform duration-200 group-hover:scale-105 border-2 ${
                          isViewed
                            ? "border-white/[0.18]"
                            : "border-[#00A3FF]"
                        }`}
                      >
                        <div className="relative w-full h-full rounded-full border border-[#070814] overflow-hidden bg-[#10162C]">
                          <Image
                            src={story.organizerAvatar}
                            alt={story.organizerName}
                            fill
                            unoptimized
                            sizes="62px"
                            className="object-cover"
                          />
                        </div>
                      </div>
                      <span className="text-[11px] font-medium text-[#F4F7FF] truncate max-w-[72px] text-center">
                        {story.organizerName}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Active Search Filter Badge (When searched from Topbar) */}
          {searchQuery && (
            <div className="flex items-center justify-between px-3 py-1.5 text-xs text-[#A7B0C9] bg-white/[0.04] rounded-xl border border-white/[0.08]">
              <span>
                Searching for <strong className="text-[#00A3FF]">&ldquo;{searchQuery}&rdquo;</strong> ({filteredEvents.length} result{filteredEvents.length === 1 ? "" : "s"})
              </span>
              <button
                type="button"
                onClick={() => handleSearchChange("")}
                className="text-[#00A3FF] hover:underline font-semibold cursor-pointer"
              >
                Clear
              </button>
            </div>
          )}

          {/* Mobile Organizer Banner for Logged-In Users */}
          {currentUser && (
            <div className="lg:hidden p-3.5 rounded-2xl border border-[#00A3FF]/30 bg-gradient-to-r from-[#0c1638] via-[#091230] to-[#070b20] flex items-center justify-between gap-3 shadow-lg">
              <div className="min-w-0">
                <span className="text-[10px] font-black uppercase tracking-wider text-[#00A3FF]">
                  {isPoster ? "Organizer Studio" : "Host in Rwanda 🇷🇼"}
                </span>
                <p className="text-xs font-bold text-[#F4F7FF] truncate">
                  {isPoster ? "Ready to publish an event?" : "Become an Event Organizer"}
                </p>
              </div>
              {isPoster ? (
                <Link
                  href="/events/create"
                  className="shrink-0 py-1.5 px-3.5 rounded-xl bg-[#00A3FF] text-white text-xs font-bold shadow transition hover:bg-[#0092E6]"
                >
                  + Post Event
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setOrgBrandName(currentUser.fullName ? `${currentUser.fullName} Events` : "");
                    setOrgPhone(currentUser.phone || "");
                    setIsOrganizerModalOpen(true);
                  }}
                  className="shrink-0 py-1.5 px-3.5 rounded-xl bg-[#00A3FF] text-white text-xs font-bold shadow transition hover:bg-[#0092E6] cursor-pointer"
                >
                  Get Started
                </button>
              )}
            </div>
          )}

          {/* Category Filter Pills (Mobile App CategoryPill.tsx style: no emoji, clean glass pills) */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {categories.map((cat) => {
              const active = selectedCategory.toLowerCase() === cat.toLowerCase();
              return (
                <button
                  key={cat}
                  onClick={() => handleCategorySelect(cat)}
                  className={`px-4 py-2 rounded-full text-[12px] font-medium shrink-0 transition-all cursor-pointer ${
                    active
                      ? "bg-[#00A3FF] text-white border border-[#00A3FF]"
                      : "bg-white/[0.08] text-[#A7B0C9] hover:bg-white/[0.14] hover:text-[#F4F7FF] border border-white/[0.16]"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Posts Feed (Matches Mobile App EventCard.tsx 100%) */}
          {filteredEvents.length === 0 ? (
            <div className="bg-[#10162C]/75 border border-white/[0.14] rounded-2xl p-10 text-center text-[#A7B0C9]">
              <p className="text-base font-semibold text-[#F4F7FF] mb-1">No event posts found</p>
              <p className="text-xs text-[#A7B0C9]">Try searching for other keywords or reset your category filter.</p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("All");
                }}
                className="mt-4 px-4 py-2 bg-[#00A3FF] hover:bg-[#0092E6] text-white rounded-lg text-xs font-bold transition cursor-pointer"
              >
                Reset filters
              </button>
            </div>
          ) : (
            filteredEvents.map((event) => {
              const isHidden = hiddenPostIds.has(event.id);
              if (isHidden) {
                return (
                  <div
                    key={event.id}
                    className="p-4 rounded-2xl bg-[#10162C]/75 border border-white/[0.14] flex items-center justify-between text-xs text-[#A7B0C9]"
                  >
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-[#A7B0C9] fill-none stroke-current stroke-[2]" viewBox="0 0 24 24">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" strokeLinecap="round" strokeLinejoin="round" />
                        <line x1="1" y1="1" x2="23" y2="23" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <span>Post hidden. You won&apos;t see this post again in your feed.</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleUnhidePost(event.id)}
                      className="px-3 py-1 rounded-md border border-white/[0.18] text-[#00A3FF] font-bold hover:bg-white/[0.08] cursor-pointer"
                    >
                      Undo
                    </button>
                  </div>
                );
              }

              const org = getOrganizer(event);
              const isSaved = savedIds.includes(event.id);
              const shares = sharesState[event.id] || 14;
              const isCaptionExpanded = expandedCaptions[event.id] ?? false;
              const captionCanExpand = event.description.trim().length > 110;

              return (
                <article
                  key={event.id}
                  className="w-full bg-[rgba(16,22,44,0.72)] backdrop-blur-xl border border-white/[0.16] rounded-2xl overflow-hidden shadow-2xl transition hover:border-white/[0.25]"
                >
                  {/* Post Header: Organizer info & Category (EventCard.tsx lines 1182-1217: NO follow button) */}
                  <div className="flex items-center justify-between px-[14px] py-[12px]">
                    <div className="flex items-center gap-[10px] min-w-0 flex-1">
                      {/* Avatar: 36px circle with initial letter or photo (styles.instaOrganizerAvatar) */}
                      <div className="w-[36px] h-[36px] rounded-full bg-[#00A3FF] flex items-center justify-center font-bold text-white text-[16px] shrink-0 overflow-hidden select-none">
                        {org.avatar ? (
                          <Image src={org.avatar} alt={org.name} width={36} height={36} unoptimized className="w-full h-full object-cover" />
                        ) : (
                          <span>{org.name.charAt(0).toUpperCase()}</span>
                        )}
                      </div>

                      {/* Organizer text column: gap-0.5 (styles.instaOrganizerTextCol) */}
                      <div className="flex flex-col gap-[2px] min-w-0 flex-1">
                        <div className="flex items-center gap-[6px] min-w-0">
                          <Link
                            href={`/events/${event.id}`}
                            className="text-[15px] font-bold text-[#F4F7FF] hover:underline truncate"
                          >
                            {org.name}
                          </Link>
                          {org.isSponsored && (
                            <div className="px-[6px] py-[2px] rounded-[4px] bg-[#00A3FF]/15 shrink-0">
                              <span className="text-[10px] font-semibold text-[#00A3FF] leading-none">Sponsored</span>
                            </div>
                          )}
                        </div>
                        <p className="text-[12px] font-medium text-[#A7B0C9] truncate">
                          {event.location.includes("Rwanda") ? event.location : `${event.location}, Rwanda`}
                        </p>
                      </div>
                    </div>

                    {/* 3-dots more button (styles.instaMoreBtn) */}
                    <button
                      type="button"
                      onClick={() => setActiveOptionsEvent(event)}
                      className="w-[32px] h-[32px] rounded-full flex items-center justify-center text-[#A7B0C9] hover:text-[#F4F7FF] hover:bg-white/[0.10] border border-transparent hover:border-white/[0.12] transition shrink-0 cursor-pointer"
                      aria-label="More options"
                    >
                      <svg className="w-[18px] h-[18px] fill-current" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="1.75" />
                        <circle cx="6" cy="12" r="1.75" />
                        <circle cx="18" cy="12" r="1.75" />
                      </svg>
                    </button>
                  </div>

                  {/* Post Media: Full-width square 1:1 image (styles.instaMediaWrap: width 100%, aspectRatio: 1) */}
                  <div
                    onClick={() => handleViewEvent(event.id)}
                    className="block relative w-full aspect-square bg-black overflow-hidden select-none cursor-pointer group"
                  >
                    <Image
                      src={event.coverImage}
                      alt={event.title}
                      fill
                      unoptimized
                      sizes="(max-width: 640px) 100vw, 490px"
                      className="object-cover group-hover:scale-[1.01] transition-transform duration-300"
                    />
                  </div>

                  {/* Action Bar (EventCard.tsx lines 1230-1260: Share with count, Insights pill, Save without count) */}
                  <div className="px-[14px] py-[8px] flex items-center justify-between">
                    {/* Left: Interactive Share with count, plus Insights */}
                    <div className="flex items-center gap-[12px]">
                      {/* Share action with live count */}
                      <button
                        type="button"
                        onClick={() => handleShare(event)}
                        className="flex items-center gap-[6px] text-[#F4F7FF] hover:text-[#00A3FF] transition cursor-pointer"
                        aria-label={`Share event, ${shares} shares`}
                      >
                        <svg className="w-[21px] h-[21px] fill-none stroke-current stroke-[1.8]" viewBox="0 0 24 24">
                          <path d="M22 2L11 13" strokeLinecap="round" strokeLinejoin="round" />
                          <path d="M22 2L15 22L11 13L2 9L22 2Z" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <span className="text-[13px] font-semibold text-[#F4F7FF]">{formatCount(shares)}</span>
                      </button>

                      {/* Insights button with live views number */}
                      <button
                        type="button"
                        onClick={() => setActiveInsightEvent(event)}
                        className="flex items-center gap-[6px] text-[#00A3FF] hover:text-white px-[10px] py-[3.5px] rounded-full bg-[#00A3FF]/15 hover:bg-[#00A3FF]/25 border border-[#00A3FF]/30 transition cursor-pointer text-[12px] font-semibold backdrop-blur-md group"
                        aria-label={`View event insights, ${formatCount(event.viewsCount || 120)} views`}
                      >
                        <svg className="w-[15px] h-[15px] fill-none stroke-current stroke-[2]" viewBox="0 0 24 24">
                          <path d="M18 20V10" strokeLinecap="round" strokeLinejoin="round" />
                          <path d="M12 20V4" strokeLinecap="round" strokeLinejoin="round" />
                          <path d="M6 20V14" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <span>Insights</span>
                        <span className="text-[11px] font-bold text-[#F4F7FF] bg-[#00A3FF]/25 group-hover:bg-[#00A3FF]/40 px-1.5 py-0.5 rounded-full leading-none transition">
                          {formatCount(event.viewsCount || 120)}
                        </span>
                      </button>
                    </div>

                    {/* Right: Save Post action without count (styles.instaActionPill) */}
                    <button
                      type="button"
                      onClick={() => toggleSave(event.id)}
                      className="p-[4px] text-[#F4F7FF] hover:opacity-75 transition transform active:scale-125 cursor-pointer"
                      aria-label={isSaved ? "Saved post" : "Save post"}
                    >
                      {isSaved ? (
                        <svg className="w-[21px] h-[21px] text-[#00A3FF] fill-current" viewBox="0 0 24 24">
                          <path d="M19 21L12 16L5 21V5C5 3.89543 5.89543 3 7 3H17C18.1046 3 19 3.89543 19 5V21Z" />
                        </svg>
                      ) : (
                        <svg className="w-[21px] h-[21px] fill-none stroke-current stroke-[1.8]" viewBox="0 0 24 24">
                          <path d="M19 21L12 16L5 21V5C5 3.89543 5.89543 3 7 3H17C18.1046 3 19 3.89543 19 5V21Z" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </button>
                  </div>

                  {/* Post Details & Caption (EventCard.tsx lines 1262-1296: styles.instaDetails) */}
                  <div className="px-[14px] pb-[16px] flex flex-col gap-[6px]">
                    {/* Title */}
                    <button
                      type="button"
                      onClick={() => handleViewEvent(event.id)}
                      className="text-left text-[17px] font-extrabold leading-[22px] tracking-[-0.25px] text-[#F4F7FF] hover:underline line-clamp-2 cursor-pointer"
                    >
                      {event.title}
                    </button>

                    {/* Meta Row: Calendar icon 14px + Date & Time 13px medium (styles.instaMetaRow) */}
                    <div className="flex items-center gap-[6px]">
                      <svg className="w-[14px] h-[14px] text-[#00A3FF] fill-none stroke-current stroke-[2]" viewBox="0 0 24 24">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                        <line x1="16" y1="2" x2="16" y2="6" strokeLinecap="round" />
                        <line x1="8" y1="2" x2="8" y2="6" strokeLinecap="round" />
                        <line x1="3" y1="10" x2="21" y2="10" />
                      </svg>
                      <span className="text-[13px] font-medium text-[#A7B0C9]">
                        {formatDate(event.startDate)} · {event.time}
                      </span>
                    </div>

                    {/* Caption: Organizer Name + Description (fontSize: 14, lineHeight: 21) */}
                    <div className="text-[14px] leading-[21px] text-[#A7B0C9]">
                      <strong className="font-bold text-[#F4F7FF] mr-1.5">{org.name}</strong>
                      <span className={isCaptionExpanded ? "" : "line-clamp-2"}>
                        {event.description}
                      </span>
                    </div>

                    {captionCanExpand && (
                      <button
                        type="button"
                        onClick={() =>
                          setExpandedCaptions((prev) => ({
                            ...prev,
                            [event.id]: !prev[event.id],
                          }))
                        }
                        className="self-start py-[2px] text-[13px] font-semibold text-[#A7B0C9] hover:text-[#F4F7FF] cursor-pointer"
                        aria-label={`${isCaptionExpanded ? "Collapse" : "Expand"} caption for ${event.title}`}
                      >
                        {isCaptionExpanded ? "less" : "more"}
                      </button>
                    )}

                    {/* View more button (Glassmorphism without gradients, auth-protected) */}
                    <div className="relative group/view mt-2.5">
                      <button
                        type="button"
                        onClick={() => handleViewEvent(event.id)}
                        className="w-full py-2.5 px-4 rounded-xl bg-white/[0.07] hover:bg-white/[0.13] active:bg-white/[0.18] border border-white/[0.14] backdrop-blur-md text-xs font-bold text-[#F4F7FF] transition flex items-center justify-center cursor-pointer shadow-sm select-none"
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
                </article>
              );
            })
          )}
        </main>

        {/* Right Sidebar (Desktop Supporting Explorer Column) */}
        <aside className="hidden lg:block w-[300px] shrink-0 sticky top-24 h-fit space-y-6">
          {/* User Profile / Visitor Welcome Card */}
          <div className="p-4 rounded-2xl bg-[rgba(16,22,44,0.72)] backdrop-blur-xl border border-white/[0.16] shadow-xl">
            {currentUser ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative w-11 h-11 rounded-full overflow-hidden border border-white/[0.18] shrink-0">
                    <Image
                      src={currentUser.avatarUrl || "/eve1.jpg"}
                      alt={currentUser.fullName}
                      fill
                      unoptimized
                      sizes="44px"
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-[#F4F7FF] truncate">
                      {currentUser.username}
                    </p>
                    <p className="text-xs text-[#A7B0C9] truncate">
                      {currentUser.fullName}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    clearUserSession();
                  }}
                  className="text-xs font-bold text-[#FF5252] hover:underline cursor-pointer shrink-0 ml-2"
                >
                  Log out
                </button>
              </div>
            ) : (
              <div className="text-left space-y-2.5">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-[#00A3FF]/15 border border-[#00A3FF]/30 flex items-center justify-center shrink-0">
                    <svg className="w-4 h-4 text-[#00A3FF]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#F4F7FF]">Welcome to EVENTIS</p>
                    <p className="text-[11px] text-[#A7B0C9]">Rwanda&apos;s Live Events Community</p>
                  </div>
                </div>
                <p className="text-xs text-[#A7B0C9] leading-relaxed">
                  Sign in to save events to your collection, chat with organizers, and get tickets instantly across Rwanda.
                </p>
                <div className="flex items-center gap-2 pt-1">
                  <Link
                    href="/users/auth/login"
                    className="flex-1 py-2 px-3 rounded-full text-center text-xs font-bold bg-white/10 hover:bg-white/15 text-[#F4F7FF] border border-white/20 transition"
                  >
                    Login
                  </Link>
                  <Link
                    href="/users/auth/register"
                    className="flex-1 py-2 px-3 rounded-full text-center text-xs font-bold bg-[#00A3FF] hover:bg-[#0092E6] text-white transition shadow-sm"
                  >
                    Sign Up
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Become an Organizer Card (Visible when user is logged in) */}
          {currentUser && (
            <div className="relative overflow-hidden rounded-2xl border border-[#00A3FF]/28 bg-gradient-to-br from-[#0e1a42] via-[#091230] to-[#060a1e] p-4.5 shadow-[0_16px_36px_rgba(0,163,255,0.14)] backdrop-blur-xl">
              {/* Decorative radial ambient glow */}
              <div className="pointer-events-none absolute -right-6 -top-6 h-28 w-28 rounded-full bg-[#00A3FF]/25 blur-2xl" />
              <div className="pointer-events-none absolute -left-6 -bottom-6 h-24 w-24 rounded-full bg-[#6930c3]/20 blur-2xl" />

              <div className="relative z-10 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-[#00A3FF]/40 bg-[#00A3FF]/15 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-[#00A3FF]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#00A3FF] animate-pulse" />
                    {isPoster ? "Organizer Studio" : "Host with Eventis"}
                  </span>
                  <span className="text-[11px] font-bold text-[#A7B0C9]">Rwanda 🇷🇼</span>
                </div>

                <div>
                  <h3 className="text-base font-extrabold text-[#F4F7FF] tracking-tight">
                    {isPoster ? "Manage Your Events" : "Become an Organizer"}
                  </h3>
                  <p className="mt-1 text-xs text-[#A7B0C9] leading-relaxed">
                    {isPoster
                      ? "Publish new concerts, festivals, or nightlife experiences directly to Rwanda's live feed."
                      : "Host concerts, festivals, parties, or workshops. Reach thousands of event-goers across Rwanda and sell tickets effortlessly."}
                  </p>
                </div>

                {/* Organizer feature bullets */}
                {!isPoster ? (
                  <div className="space-y-1.5 pt-0.5 text-[11px] text-[#DCE4FF]">
                    <div className="flex items-center gap-2">
                      <svg className="h-3.5 w-3.5 text-[#00A3FF] shrink-0" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span>Direct ticket sales & QR mobile check-in</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg className="h-3.5 w-3.5 text-[#00A3FF] shrink-0" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span>Real-time audience reach & analytics</span>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-[11px] text-[#71cf88] font-medium pt-0.5">
                    <svg className="h-3.5 w-3.5 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Verified Organizer Status Active</span>
                  </div>
                )}

                <div className="pt-1">
                  {isPoster ? (
                    <Link
                      href="/events/create"
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#00A3FF] hover:bg-[#0092E6] py-2.5 px-3 text-xs font-bold text-white shadow-[0_6px_20px_rgba(0,163,255,0.35)] transition cursor-pointer"
                    >
                      <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                        <line x1="12" y1="5" x2="12" y2="19" />
                        <line x1="5" y1="12" x2="19" y2="12" />
                      </svg>
                      <span>+ Post New Event</span>
                    </Link>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setOrgBrandName(currentUser.fullName ? `${currentUser.fullName} Events` : "");
                        setOrgPhone(currentUser.phone || "");
                        setIsOrganizerModalOpen(true);
                      }}
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#00A3FF] hover:bg-[#0092E6] py-2.5 px-3 text-xs font-bold text-white shadow-[0_6px_20px_rgba(0,163,255,0.35)] transition cursor-pointer"
                    >
                      <span>Get Started as Organizer</span>
                      <svg className="h-3.5 w-3.5 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Suggested Organizers & Venues (View events, NO follow buttons) */}
          <div className="p-4 rounded-2xl bg-[rgba(16,22,44,0.72)] backdrop-blur-xl border border-white/[0.16] shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[12px] font-bold text-[#A7B0C9] uppercase tracking-wider">
                Explore Venues
              </span>
              <Link href="/events" className="text-xs font-semibold text-[#00A3FF] hover:underline">
                See All
              </Link>
            </div>

            <div className="space-y-3.5">
              {suggestedOrganizers.map((account) => (
                <div key={account.handle} className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="relative w-9 h-9 rounded-full overflow-hidden bg-[#181a44] border border-white/[0.14]">
                      <Image
                        src={account.avatar}
                        alt={account.name}
                        fill
                        unoptimized
                        sizes="36px"
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#F4F7FF]">{account.name}</p>
                      <p className="text-[10px] text-[#A7B0C9] truncate max-w-[130px]">
                        {account.subtitle}
                      </p>
                    </div>
                  </div>
                  <Link
                    href={`/events?search=${encodeURIComponent(account.name)}`}
                    className="text-xs font-bold text-[#00A3FF] hover:underline px-2 py-1 rounded hover:bg-white/[0.08]"
                  >
                    View
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Links & Copyright */}
          <div className="text-[11px] text-[#6b7696] space-y-3 px-2">
            <p className="flex flex-wrap gap-x-2 gap-y-1">
              <Link href="/users/about" className="hover:underline">About</Link> ·
              <Link href="/events" className="hover:underline">Events</Link> ·
              <Link href="/terms" className="hover:underline">Terms</Link> ·
              <Link href="/privacy-policy" className="hover:underline">Privacy</Link> ·
              <span>Kigali, Rwanda</span>
            </p>
            <p className="uppercase tracking-wider">© 2026 EVENTIS PLATFORM</p>
          </div>
        </aside>
      </div>

      {/* FULL INSTAGRAM STORY VIEWER MODAL (Matches StoriesBar.tsx viewer) */}
      {activeStoryIndex !== null && allStories[activeStoryIndex] && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 select-none"
          onClick={closeStory}
        >
          <div
            className="relative w-full max-w-[420px] aspect-[9/16] bg-[#0c0e29] rounded-2xl overflow-hidden shadow-2xl flex flex-col justify-between"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Progress Bars (5000ms duration per story) */}
            <div className="absolute top-2.5 left-2.5 right-2.5 z-30 flex items-center gap-1.5">
              {allStories.map((st, i) => {
                let progress = 0;
                if (i < activeStoryIndex) progress = 100;
                else if (i === activeStoryIndex) progress = storyProgress;
                return (
                  <div key={st.id} className="h-1 flex-1 bg-white/30 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-white transition-all duration-75"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                );
              })}
            </div>

            {/* Story Header */}
            <div className="absolute top-6 left-3 right-3 z-30 flex items-center justify-between text-white drop-shadow-md">
              <div className="flex items-center gap-2.5">
                <div className="relative w-9 h-9 rounded-full overflow-hidden border border-white">
                  <Image
                    src={allStories[activeStoryIndex].organizerAvatar}
                    alt=""
                    fill
                    unoptimized
                    className="object-cover"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-bold">{allStories[activeStoryIndex].organizerName}</span>
                    <span className="text-[#00A3FF] text-xs font-bold">✓</span>
                  </div>
                  <span className="text-[10px] text-white/80">{allStories[activeStoryIndex].timeAgo}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsStoryPaused((p) => !p)}
                  className="w-8 h-8 rounded-full bg-black/40 flex items-center justify-center text-xs text-white cursor-pointer"
                  title={isStoryPaused ? "Play story" : "Pause story"}
                >
                  {isStoryPaused ? "▶" : "⏸"}
                </button>
                <button
                  type="button"
                  onClick={closeStory}
                  className="w-8 h-8 rounded-full bg-black/40 flex items-center justify-center text-base font-bold text-white cursor-pointer"
                  title="Close story"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Story Background Image */}
            <div className="relative w-full h-full bg-black">
              <Image
                src={allStories[activeStoryIndex].storyImage}
                alt={allStories[activeStoryIndex].eventTitle}
                fill
                unoptimized
                priority
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/40 pointer-events-none" />
            </div>

            {/* Click Navigation Zones */}
            <div
              className="absolute inset-y-16 left-0 w-1/3 z-20 cursor-w-resize"
              onClick={prevStory}
              aria-label="Previous story"
            />
            <div
              className="absolute inset-y-16 right-0 w-1/3 z-20 cursor-e-resize"
              onClick={nextStory}
              aria-label="Next story"
            />

            {/* Story Bottom Card */}
            <div className="absolute bottom-4 left-3 right-3 z-30 space-y-2.5">
              <div className="p-3 bg-black/75 backdrop-blur-md rounded-xl border border-white/20 text-white space-y-1">
                <span className="inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#00A3FF]">
                  Featured Story
                </span>
                <h3 className="text-sm font-bold leading-tight">
                  {allStories[activeStoryIndex].eventTitle}
                </h3>
              </div>

              <Link
                href={`/events/${allStories[activeStoryIndex].eventId}`}
                className="w-full py-2.5 bg-[#00A3FF] hover:bg-[#0092E6] text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-lg transition"
              >
                <span>View Event Details</span>
                <span>↗</span>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* EVENT INSIGHTS MODAL (Exact 2x2 Grid from Mobile App EventCard.tsx lines 757-983) */}
      {activeInsightEvent && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4"
          onClick={() => setActiveInsightEvent(null)}
        >
          <div
            className="w-full max-w-[440px] bg-[rgba(10,16,36,0.85)] backdrop-blur-2xl border border-white/[0.16] rounded-2xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-5 pb-3 border-b border-white/[0.10] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#00A3FF]/15 border border-[#00A3FF]/30 flex items-center justify-center text-[#00A3FF]">
                  <svg className="w-5 h-5 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                    <line x1="18" y1="20" x2="18" y2="10" />
                    <line x1="12" y1="20" x2="12" y2="4" />
                    <line x1="6" y1="20" x2="6" y2="14" />
                    <line x1="2" y1="20" x2="22" y2="20" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-base font-bold text-[#F4F7FF]">Event Insights</h2>
                  <p className="text-xs text-[#A7B0C9] line-clamp-1">{activeInsightEvent.title}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActiveInsightEvent(null)}
                className="text-[#A7B0C9] hover:text-[#F4F7FF] text-lg font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Metrics Grid (Exact 2x2 Cards matching mobile app) */}
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                {/* 1. Total Views */}
                <div className="p-3.5 rounded-xl bg-white/[0.06] border border-white/[0.10] flex flex-col gap-1">
                  <div className="flex items-center gap-1.5 text-[#00A3FF]">
                    <svg className="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                    <span className="text-xs font-semibold">Total Views</span>
                  </div>
                  <strong className="text-xl font-extrabold text-[#F4F7FF]">
                    {formatCount(activeInsightEvent.viewsCount || 120)}
                  </strong>
                </div>

                {/* 2. Post Shares */}
                <div className="p-3.5 rounded-xl bg-white/[0.06] border border-white/[0.10] flex flex-col gap-1">
                  <div className="flex items-center gap-1.5 text-[#10B981]">
                    <svg className="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                      <line x1="22" y1="2" x2="11" y2="13" />
                      <polygon points="22 2 15 22 11 13 2 9 22 2" />
                    </svg>
                    <span className="text-xs font-semibold">Post Shares</span>
                  </div>
                  <strong className="text-xl font-extrabold text-[#F4F7FF]">
                    {formatCount(sharesState[activeInsightEvent.id] || 14)}
                  </strong>
                </div>

                {/* 3. Saved / Bookmarked */}
                <div className="p-3.5 rounded-xl bg-white/[0.06] border border-white/[0.10] flex flex-col gap-1">
                  <div className="flex items-center gap-1.5 text-[#F59E0B]">
                    <svg className="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                    </svg>
                    <span className="text-xs font-semibold">Saved / Bookmarked</span>
                  </div>
                  <strong className="text-xl font-extrabold text-[#F4F7FF]">
                    {formatCount(
                      Math.max(9, Math.floor((activeInsightEvent.viewsCount || 120) * 0.064)) +
                        (savedIds.includes(activeInsightEvent.id) ? 1 : 0)
                    )}
                  </strong>
                </div>

                {/* 4. Attending */}
                <div className="p-3.5 rounded-xl bg-white/[0.06] border border-white/[0.10] flex flex-col gap-1">
                  <div className="flex items-center gap-1.5 text-[#8B5CF6]">
                    <svg className="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                    <span className="text-xs font-semibold">Attending</span>
                  </div>
                  <strong className="text-xl font-extrabold text-[#F4F7FF]">
                    {formatCount(Math.round((activeInsightEvent.viewsCount || 120) * 0.35))}
                  </strong>
                </div>
              </div>

              {/* Engagement Rate Row */}
              <div className="p-3.5 rounded-xl bg-white/[0.05] border border-white/[0.08] flex items-center justify-between">
                <div className="flex items-center gap-2 text-[#F4F7FF] text-xs font-semibold">
                  <svg className="w-4 h-4 text-[#00A3FF] fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                    <polyline points="17 6 23 6 23 12" />
                  </svg>
                  <span>Engagement Rate</span>
                </div>
                <span className="text-base font-extrabold text-[#00A3FF]">
                  {(
                    (((sharesState[activeInsightEvent.id] || 14) +
                      (Math.max(9, Math.floor((activeInsightEvent.viewsCount || 120) * 0.064)) +
                        (savedIds.includes(activeInsightEvent.id) ? 1 : 0))) /
                      Math.max(activeInsightEvent.viewsCount || 120, 1)) *
                    100
                  ).toFixed(1)}
                  %
                </span>
              </div>
            </div>

            <div className="p-4 border-t border-white/[0.10] flex justify-end">
              <button
                type="button"
                onClick={() => setActiveInsightEvent(null)}
                className="px-5 py-2 bg-white/[0.08] hover:bg-white/[0.14] text-[#F4F7FF] rounded-xl text-xs font-bold border border-white/[0.14] cursor-pointer transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SHARE MODAL (Matches Mobile App EventCard.tsx lines 228-472) */}
      {activeShareEvent && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3"
          onClick={() => setActiveShareEvent(null)}
        >
          <div
            className="w-full max-w-[420px] bg-[rgba(10,16,36,0.85)] backdrop-blur-2xl border border-white/[0.16] rounded-2xl p-5 shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/[0.10] pb-3">
              <h3 className="text-sm font-bold text-[#F4F7FF]">Share Event</h3>
              <button
                onClick={() => setActiveShareEvent(null)}
                className="text-[#A7B0C9] hover:text-[#F4F7FF] cursor-pointer"
              >
                ✕
              </button>
            </div>

            {currentUser ? (
              <>
                {/* Search Box */}
                <div className="flex items-center gap-2 bg-white/[0.06] px-3 py-2 rounded-xl border border-white/[0.10]">
                  <svg className="w-4 h-4 text-[#A7B0C9] fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Search chats..."
                    value={chatSearch}
                    onChange={(e) => setChatSearch(e.target.value)}
                    className="w-full bg-transparent text-xs text-[#F4F7FF] placeholder-[#A7B0C9] focus:outline-none"
                  />
                </div>

                {/* Send to all chats button */}
                <button
                  type="button"
                  onClick={() => handleSendToAllChats(activeShareEvent)}
                  className="w-full py-2.5 px-3 rounded-xl bg-[#00A3FF]/15 border border-[#00A3FF]/30 hover:bg-[#00A3FF]/25 text-[#00A3FF] text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer"
                >
                  <svg className="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                    <line x1="22" y1="2" x2="11" y2="13" />
                    <polygon points="22 2 15 22 11 13 2 9 22 2" />
                  </svg>
                  <span>{sendingAll ? "Sent to all chats!" : `Send to all chats (${mockChatContacts.length})`}</span>
                </button>

                {/* Chats List */}
                <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
                  {mockChatContacts
                    .filter((c) => c.name.toLowerCase().includes(chatSearch.toLowerCase()))
                    .map((contact) => {
                      const isSent = sentChatIds[contact.id];
                      return (
                        <div
                          key={contact.id}
                          className="flex items-center justify-between p-2 rounded-xl bg-white/[0.05] border border-white/[0.08]"
                        >
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full overflow-hidden bg-[#00A3FF] relative shrink-0">
                              <Image src={contact.avatar} alt="" fill unoptimized className="object-cover" />
                            </div>
                            <div>
                              <p className="text-xs font-bold text-[#F4F7FF]">{contact.name}</p>
                              <p className="text-[10px] text-[#A7B0C9]">{contact.headline}</p>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleSendToChat(contact.id, activeShareEvent)}
                            className={`text-xs font-bold px-3 py-1 rounded-lg transition cursor-pointer ${
                              isSent
                                ? "bg-white/[0.10] text-[#A7B0C9]"
                                : "bg-[#00A3FF] hover:bg-[#0092E6] text-white"
                            }`}
                          >
                            {isSent ? "✓ Sent" : "Send"}
                          </button>
                        </div>
                      );
                    })}
                </div>
              </>
            ) : (
              /* Visitor view: Prompt to log in to chat with friends directly */
              <div className="p-4 rounded-xl bg-white/[0.04] border border-white/[0.10] text-center space-y-2.5">
                <div className="w-10 h-10 mx-auto rounded-full bg-[#00A3FF]/15 border border-[#00A3FF]/30 flex items-center justify-center text-[#00A3FF]">
                  <svg className="w-5 h-5 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#F4F7FF]">Direct Messaging on Eventis</h4>
                  <p className="text-[11px] text-[#A7B0C9] mt-0.5">
                    Log in to send events directly to your Eventis friends and chat contacts.
                  </p>
                </div>
                <Link
                  href="/users/auth/login"
                  onClick={() => setActiveShareEvent(null)}
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-[#00A3FF] hover:bg-[#0092E6] text-white text-xs font-bold transition shadow-md"
                >
                  Log In to Chat
                </Link>
              </div>
            )}

            {/* Quick action circles */}
            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/[0.10] text-center">
              <button
                type="button"
                onClick={() => handleNativeShare(activeShareEvent)}
                className="flex flex-col items-center gap-1 p-2 rounded-xl hover:bg-white/[0.06] transition cursor-pointer"
              >
                <div className="w-10 h-10 rounded-full bg-white/[0.07] border border-white/[0.12] flex items-center justify-center text-[#F4F7FF]">
                  <svg className="w-5 h-5 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                    <circle cx="18" cy="5" r="3" />
                    <circle cx="6" cy="12" r="3" />
                    <circle cx="18" cy="19" r="3" />
                    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                  </svg>
                </div>
                <span className="text-[10px] text-[#A7B0C9]">Share to Apps</span>
              </button>

              <button
                type="button"
                onClick={() => handleCopyLink(activeShareEvent)}
                className="flex flex-col items-center gap-1 p-2 rounded-xl hover:bg-white/[0.06] transition cursor-pointer"
              >
                <div className={`w-10 h-10 rounded-full border flex items-center justify-center ${copyFeedback ? "bg-emerald-500/20 border-emerald-400 text-emerald-300" : "bg-white/[0.07] border-white/[0.12] text-[#F4F7FF]"}`}>
                  <svg className="w-5 h-5 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                  </svg>
                </div>
                <span className="text-[10px] text-[#A7B0C9]">{copyFeedback ? "Copied!" : "Copy link"}</span>
              </button>

              <a
                href={`https://wa.me/?text=${encodeURIComponent(`Check out this event: ${activeShareEvent.title} in Rwanda: ${typeof window !== "undefined" ? window.location.origin : ""}/events/${activeShareEvent.id}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  setSharesState((p) => ({ ...p, [activeShareEvent.id]: (p[activeShareEvent.id] || 0) + 1 }));
                  setActiveShareEvent(null);
                }}
                className="flex flex-col items-center gap-1 p-2 rounded-xl hover:bg-white/[0.06] transition"
              >
                <div className="w-10 h-10 rounded-full bg-white/[0.07] border border-white/[0.12] flex items-center justify-center text-emerald-400">
                  <svg className="w-5 h-5 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                  </svg>
                </div>
                <span className="text-[10px] text-[#A7B0C9]">WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* OPTIONS MODAL (Matches Mobile App EventCard.tsx lines 476-755) */}
      {activeOptionsEvent && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3"
          onClick={() => setActiveOptionsEvent(null)}
        >
          <div
            className="w-full max-w-[340px] bg-[rgba(10,16,36,0.85)] backdrop-blur-2xl border border-white/[0.16] rounded-2xl p-4 shadow-2xl space-y-3.5"
            onClick={(e) => e.stopPropagation()}
          >
            {reportFeedbackEventId ? (
              <div className="p-6 text-center space-y-2">
                <span className="text-3xl">✅</span>
                <h3 className="text-sm font-bold text-[#F4F7FF]">Report Submitted</h3>
                <p className="text-xs text-[#A7B0C9]">
                  Thank you for letting us know. We will review this event within 24 hours.
                </p>
              </div>
            ) : (
              <>
                {/* Header */}
                <div className="text-center pb-2 border-b border-white/[0.10]">
                  <h3 className="text-xs font-bold text-[#F4F7FF] truncate">{activeOptionsEvent.title}</h3>
                  <p className="text-[11px] text-[#A7B0C9]">
                    Organized by {getOrganizer(activeOptionsEvent).name}
                  </p>
                </div>

                {/* Group 1: Moderation */}
                <div className="rounded-xl bg-white/[0.06] border border-white/[0.10] divide-y divide-white/[0.08] text-xs font-semibold">
                  <button
                    type="button"
                    onClick={() => handleReportPost(activeOptionsEvent.id)}
                    className="w-full py-3 px-4 flex items-center justify-between text-[#FF5D6C] hover:bg-white/[0.08] cursor-pointer"
                  >
                    <span className="flex items-center gap-2.5">
                      <svg className="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="8" x2="12" y2="12" />
                        <line x1="12" y1="16" x2="12.01" y2="16" />
                      </svg>
                      Report
                    </span>
                    <span>›</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleHidePost(activeOptionsEvent.id)}
                    className="w-full py-3 px-4 flex items-center gap-2.5 text-[#F4F7FF] hover:bg-white/[0.08] cursor-pointer"
                  >
                    <svg className="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                    Not interested
                  </button>
                </div>

                {/* Group 2: Engagement & Navigation */}
                <div className="rounded-xl bg-white/[0.06] border border-white/[0.10] divide-y divide-white/[0.08] text-xs font-semibold">
                  <Link
                    href={`/events/${activeOptionsEvent.id}`}
                    className="w-full py-3 px-4 flex items-center justify-between text-[#F4F7FF] hover:bg-white/[0.08]"
                  >
                    <span className="flex items-center gap-2.5">
                      <svg className="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                        <polyline points="15 3 21 3 21 9" />
                        <line x1="10" y1="14" x2="21" y2="3" />
                      </svg>
                      Go to post
                    </span>
                    <span>›</span>
                  </Link>

                  <button
                    type="button"
                    onClick={() => {
                      toggleSave(activeOptionsEvent.id);
                      setActiveOptionsEvent(null);
                    }}
                    className="w-full py-3 px-4 flex items-center justify-between text-[#00A3FF] hover:bg-white/[0.08] cursor-pointer"
                  >
                    <span className="flex items-center gap-2.5">
                      <svg className="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                      </svg>
                      {savedIds.includes(activeOptionsEvent.id) ? "Saved" : "Save"}
                    </span>
                    {savedIds.includes(activeOptionsEvent.id) && <span>✓</span>}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setActiveOptionsEvent(null);
                      setActiveShareEvent(activeOptionsEvent);
                    }}
                    className="w-full py-3 px-4 flex items-center justify-between text-[#F4F7FF] hover:bg-white/[0.08] cursor-pointer"
                  >
                    <span className="flex items-center gap-2.5">
                      <svg className="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                        <line x1="22" y1="2" x2="11" y2="13" />
                        <polygon points="22 2 15 22 11 13 2 9 22 2" />
                      </svg>
                      Share to...
                    </span>
                    <span>›</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      handleCopyLink(activeOptionsEvent);
                      setActiveOptionsEvent(null);
                    }}
                    className="w-full py-3 px-4 flex items-center gap-2.5 text-[#F4F7FF] hover:bg-white/[0.08] cursor-pointer"
                  >
                    <svg className="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                    </svg>
                    Copy link
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setActiveInsightEvent(activeOptionsEvent);
                      setActiveOptionsEvent(null);
                    }}
                    className="w-full py-3 px-4 flex items-center gap-2.5 text-[#00A3FF] hover:bg-white/[0.08] cursor-pointer"
                  >
                    <svg className="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                      <line x1="18" y1="20" x2="18" y2="10" />
                      <line x1="12" y1="20" x2="12" y2="4" />
                      <line x1="6" y1="20" x2="6" y2="14" />
                      <line x1="2" y1="20" x2="22" y2="20" />
                    </svg>
                    Event Insights
                  </button>
                </div>

                {/* Cancel Button */}
                <button
                  type="button"
                  onClick={() => setActiveOptionsEvent(null)}
                  className="w-full py-2.5 rounded-xl bg-white/[0.08] border border-white/[0.12] text-xs font-bold text-[#A7B0C9] hover:text-[#F4F7FF] cursor-pointer transition"
                >
                  Cancel
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* BECOME AN ORGANIZER ONBOARDING MODAL */}
      {isOrganizerModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200"
          onClick={() => setIsOrganizerModalOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="organizer-modal-title"
        >
          <div
            className="relative w-full max-w-lg rounded-3xl border border-white/[0.18] bg-[#0c1026]/95 p-6 sm:p-8 text-left shadow-[0_25px_60px_rgba(0,0,0,0.85)] backdrop-blur-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              type="button"
              onClick={() => setIsOrganizerModalOpen(false)}
              className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-white/[0.08] text-[#A7B0C9] hover:bg-white/[0.15] hover:text-white transition cursor-pointer"
              aria-label="Close modal"
            >
              ✕
            </button>

            {/* Header Lockup */}
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#00A3FF] to-[#0051FF] text-white shadow-[0_6px_20px_rgba(0,163,255,0.4)] shrink-0">
                <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-[#00A3FF]">Creator Onboarding</span>
                <h2 id="organizer-modal-title" className="text-xl sm:text-2xl font-black text-[#F4F7FF] tracking-tight">
                  Become an Organizer
                </h2>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-[#A7B0C9] leading-relaxed mb-6">
              Create your organizer profile to publish live concerts, festivals, nightlife events, and sell tickets directly to event-goers across Rwanda.
            </p>

            <form onSubmit={handleActivateOrganizer} className="space-y-4">
              <div>
                <label htmlFor="org-brand-input" className="block text-xs font-bold text-[#F4F7FF] mb-1.5">
                  Organizer or Brand Name *
                </label>
                <input
                  id="org-brand-input"
                  type="text"
                  required
                  value={orgBrandName}
                  onChange={(e) => setOrgBrandName(e.target.value)}
                  placeholder="e.g. Rwanda Jazz Festival, Neon Nights, BK Arena"
                  className="w-full rounded-xl border border-white/[0.14] bg-white/[0.06] px-3.5 py-2.5 text-sm text-[#F4F7FF] placeholder-[#A7B0C9]/60 outline-none transition focus:border-[#00A3FF] focus:bg-[#070814]/80"
                />
              </div>

              <div>
                <label htmlFor="org-cat-select" className="block text-xs font-bold text-[#F4F7FF] mb-1.5">
                  Primary Event Category
                </label>
                <select
                  id="org-cat-select"
                  value={orgCategory}
                  onChange={(e) => setOrgCategory(e.target.value)}
                  className="w-full rounded-xl border border-white/[0.14] bg-[#0c1026] px-3.5 py-2.5 text-sm text-[#F4F7FF] outline-none transition focus:border-[#00A3FF]"
                >
                  <option value="Concerts & Music">Live Music & Concerts</option>
                  <option value="Festivals & Culture">Festivals & Cultural Fairs</option>
                  <option value="Nightlife & Clubs">Nightlife, Lounges & Parties</option>
                  <option value="Tech & Summits">Tech, Business & Conferences</option>
                  <option value="Sports & Fitness">Sports & Fitness Meets</option>
                  <option value="Arts & Fashion">Fashion & Contemporary Art</option>
                </select>
              </div>

              <div>
                <label htmlFor="org-desc-input" className="block text-xs font-bold text-[#F4F7FF] mb-1.5">
                  Bio / About Your Events (Optional)
                </label>
                <textarea
                  id="org-desc-input"
                  rows={2}
                  value={orgDescription}
                  onChange={(e) => setOrgDescription(e.target.value)}
                  placeholder="Tell attendees across Rwanda what kind of experiences you organize..."
                  className="w-full rounded-xl border border-white/[0.14] bg-white/[0.06] px-3.5 py-2 text-sm text-[#F4F7FF] placeholder-[#A7B0C9]/60 outline-none transition focus:border-[#00A3FF] focus:bg-[#070814]/80 resize-none"
                />
              </div>

              <div>
                <label htmlFor="org-phone-input" className="block text-xs font-bold text-[#F4F7FF] mb-1.5">
                  Contact Phone Number
                </label>
                <input
                  id="org-phone-input"
                  type="tel"
                  value={orgPhone}
                  onChange={(e) => setOrgPhone(e.target.value)}
                  placeholder="e.g. 0788123456"
                  className="w-full rounded-xl border border-white/[0.14] bg-white/[0.06] px-3.5 py-2.5 text-sm text-[#F4F7FF] placeholder-[#A7B0C9]/60 outline-none transition focus:border-[#00A3FF] focus:bg-[#070814]/80"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-3 border-t border-white/[0.1]">
                <button
                  type="button"
                  onClick={() => setIsOrganizerModalOpen(false)}
                  className="rounded-xl border border-white/20 bg-white/[0.06] px-4 py-2.5 text-xs font-bold text-[#A7B0C9] hover:bg-white/[0.1] hover:text-white transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-[#00A3FF] hover:bg-[#0092E6] px-5 py-2.5 text-xs font-bold text-white shadow-[0_6px_20px_rgba(0,163,255,0.4)] transition cursor-pointer flex items-center gap-1.5"
                >
                  <span>Activate Profile & Post Event</span>
                  <span>→</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-full bg-[#00A3FF] text-white text-xs font-bold shadow-2xl backdrop-blur-md border border-white/20 flex items-center gap-2">
          <span>✓</span>
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
