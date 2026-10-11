"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import EventSearchBar from "../../components/event-search-bar";
import Footer from "../../components/footer";
import Navbar from "../../components/navbar";
import { eventStorageKey, sampleEvents, savedEventStorageKey, type EventPost } from "../../lib/events";

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(`${date}T12:00:00`));
}

export default function EventDetailsPage() {
  const { eventId } = useParams<{ eventId: string }>();
  const [event, setEvent] = useState<EventPost | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    try {
      const stored: unknown = JSON.parse(localStorage.getItem(eventStorageKey) ?? "[]");
      const userEvents = Array.isArray(stored) ? stored as EventPost[] : [];
      const found = [...userEvents, ...sampleEvents].find((item) => item.id === eventId) ?? null;
      setEvent(found);
      const saved: unknown = JSON.parse(localStorage.getItem(savedEventStorageKey) ?? "[]");
      setIsSaved(Array.isArray(saved) && saved.includes(eventId));
    } catch {
      setEvent(sampleEvents.find((item) => item.id === eventId) ?? null);
    } finally {
      setIsLoading(false);
    }
  }, [eventId]);

  function toggleSave() {
    if (!event) return;
    const saved: unknown = JSON.parse(localStorage.getItem(savedEventStorageKey) ?? "[]");
    const savedIds = Array.isArray(saved) ? saved.filter((item): item is string => typeof item === "string") : [];
    const next = isSaved ? savedIds.filter((id) => id !== event.id) : [...savedIds, event.id];
    localStorage.setItem(savedEventStorageKey, JSON.stringify(next));
    setIsSaved(!isSaved);
    setFeedback(isSaved ? "Removed from saved events" : "Saved to your events");
  }

  async function shareEvent() {
    if (!event) return;
    const url = window.location.href;
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
      setFeedback("Could not share this event");
    }
  }

  return (
    <main className="min-h-screen bg-[#02021f]">
      <Navbar />
      <EventSearchBar />
      <section className="event-detail-page">
        <div className="event-detail-container">
          <Link href="/events" className="event-detail-back">← Back to events</Link>
          {isLoading ? (
            <div className="event-detail-loading" aria-label="Loading event details" />
          ) : event ? (
            <article className="event-detail-layout">
              <div className="event-detail-cover">
                <Image src={event.coverImage} alt={event.title} fill priority unoptimized className="event-detail-image" />
                <span className="event-detail-category">{event.category}</span>
              </div>
              <div className="event-detail-content">
                <p className="event-discovery-eyebrow">EVENT DETAILS</p>
                <h1>{event.title}</h1>
                <p className="event-detail-description">{event.description}</p>
                <div className="event-detail-facts">
                  <div><span>Date</span><strong>{formatDate(event.startDate)}{event.endDate !== event.startDate ? ` – ${formatDate(event.endDate)}` : ""}</strong></div>
                  <div><span>Time</span><strong>{event.time}</strong></div>
                  <div><span>Location</span><strong>{event.location}</strong></div>
                  <div><span>Format</span><strong>{event.eventFormat ?? "In person"}</strong></div>
                  <div><span>Admission</span><strong>{event.priceType === "free" ? "Free" : event.price || "Paid"}</strong></div>
                </div>
                <div className="event-detail-actions">
                  <button type="button" onClick={toggleSave}>{isSaved ? "Saved" : "Save event"}</button>
                  <button type="button" onClick={() => void shareEvent()}>Share event</button>
                </div>
              </div>
            </article>
          ) : (
            <div className="event-detail-not-found">
              <h1>Event not found</h1>
              <p>This event may have been removed or is no longer available.</p>
              <Link href="/events">Browse events</Link>
            </div>
          )}
        </div>
      </section>
      <Footer />
      {feedback && <div className="event-action-feedback" role="status">{feedback}</div>}
    </main>
  );
}