"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const events = [
  {
    title: "Fantasy Music Concert",
    type: "Live music",
    date: "4 Dec 2021",
    location: "Kigali Convention Center",
    color: "#f4c400",
    image: "/eve1.jpg",
  },
  {
    title: "Kigali Up Music Festival",
    type: "Rwandan music festival",
    date: "26 - 28 July",
    location: "Amahoro Stadium Grounds",
    color: "#ef7f2d",
    image: "/eve2.jpg",
  },
  {
    title: "Kigali Fashion Week",
    type: "Fashion showcase",
    date: "27 May 2026",
    location: "Kigali Universe - The Bridge",
    color: "#f5a900",
    image: "/eve3.jpg",
  },
  {
    title: "RIMBA Fashion Show",
    type: "Fashion, culture and exhibition",
    date: "Saturday 27 Sept 2025",
    location: "The Manor Hotel, Nyarutarama",
    color: "#d6a13d",
    image: "/eve4.jpg",
  },
];

export default function FeaturedShowcase() {
  const [activeEvent, setActiveEvent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const timer = window.setInterval(() => {
      setActiveEvent((current) => (current + 1) % events.length);
    }, 4200);
    return () => window.clearInterval(timer);
  }, [isPaused]);

  const event = events[activeEvent];

  return (
    <section id="featured" className="border-y border-[#e5e0dc] bg-[#f3f3f1] px-3 py-16 sm:px-5 lg:px-8 lg:py-24">
      <div className="mx-auto max-w-[1500px]">
        <div className="flex flex-col items-center gap-5 text-center">
          <div className="mx-auto max-w-[680px] text-center">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-[#8a6b55]">Featured on Eventis</p>
            <h2 className="mt-4 max-w-[620px] text-4xl font-black leading-[0.95] tracking-[-0.07em] text-[#292929] sm:text-5xl lg:text-6xl">
              Find something worth showing up for.
            </h2>
          </div>
          <p className="mx-auto max-w-[500px] text-center text-sm leading-6 text-[#65605c]">
            A live window into the experiences and connections shaping your week.
          </p>
        </div>

        <div className="mt-10 grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
          <article className="overflow-hidden rounded-[30px] bg-[#1d1d1c] p-5 text-white shadow-[0_24px_55px_rgba(42,35,30,0.16)] sm:p-7">
            <div className="flex items-center justify-between gap-4 text-xs font-bold uppercase tracking-[0.16em] text-[#d7c2af]">
              <span>Events to remember</span>
              <button type="button" onClick={() => setIsPaused((paused) => !paused)} className="rounded-full border border-white/20 px-3 py-1.5 text-[10px] text-white/80 transition hover:bg-white/10" aria-label={isPaused ? "Resume event carousel" : "Pause event carousel"}>
                {isPaused ? "Resume" : "Pause"}
              </button>
            </div>

            <div className="relative mt-5 min-h-[380px] overflow-hidden rounded-[22px] bg-[#30302e]">
              <Image src={event.image} alt={event.title} fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-contain opacity-90 transition duration-700" priority={activeEvent === 0} />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(20,20,19,0.1),rgba(20,20,19,0.92))]" />
              <div className="absolute left-5 top-5 rounded-full bg-white/15 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-white backdrop-blur-sm">
                Live pick {String(activeEvent + 1).padStart(2, "0")} / {String(events.length).padStart(2, "0")}
              </div>
              <div className="absolute inset-x-5 bottom-5">
                <div className="mb-4 h-1.5 overflow-hidden rounded-full bg-white/20">
                  <div className="h-full rounded-full transition-all duration-500" style={{ width: `${((activeEvent + 1) / events.length) * 100}%`, backgroundColor: event.color }} />
                </div>
                <p className="text-xs font-bold uppercase tracking-[0.14em]" style={{ color: event.color }}>{event.type}</p>
                <h3 className="mt-2 text-4xl font-black leading-[0.95] tracking-[-0.07em] sm:text-5xl">{event.title}</h3>
                <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-white/70">
                  <span>{event.date}</span><span>{event.location}</span>
                </div>
              </div>
            </div>

            <div className="mt-5 flex items-center justify-between gap-4">
              <div className="flex gap-2">
                {events.map((item, index) => <button key={item.title} type="button" onClick={() => setActiveEvent(index)} className={`h-2 rounded-full transition-all ${index === activeEvent ? "w-8 bg-white" : "w-2 bg-white/30"}`} aria-label={`Show ${item.title}`} aria-current={index === activeEvent} />)}
              </div>
              <div className="flex gap-2">
                <button type="button" onClick={() => setActiveEvent((activeEvent + events.length - 1) % events.length)} className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 text-lg transition hover:bg-white/10" aria-label="Previous event">←</button>
                <button type="button" onClick={() => setActiveEvent((activeEvent + 1) % events.length)} className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 text-lg transition hover:bg-white/10" aria-label="Next event">→</button>
              </div>
            </div>
          </article>

          <article className="rounded-[30px] bg-[#f8f6f3] p-5 shadow-[0_18px_42px_rgba(42,35,30,0.08)] sm:p-7">
            <div className="flex items-center justify-between gap-4">
              <span className="text-xs font-black uppercase tracking-[0.16em] text-[#8a6b55]">Connect with Eventis</span>
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#292929] text-lg text-white" aria-hidden="true">↗</span>
            </div>
            <div className="relative mt-6 aspect-[16/10] overflow-hidden rounded-[22px] bg-white">
              <Image src="/chart1.png" alt="Eventis members chatting and planning to attend a Tech and Innovation Summit" fill sizes="(max-width: 1024px) 100vw, 45vw" className="object-contain" />
            </div>
            <h3 className="mt-12 max-w-[390px] text-3xl font-black leading-[0.98] tracking-[-0.06em] text-[#292929] sm:text-4xl">
              Watch your circle grow in real time.
            </h3>
            <p className="mt-5 max-w-[390px] text-sm leading-6 text-[#65605c]">
              Every invite, shared plan, and new connection adds momentum to the Eventis community.
            </p>
          </article>
        </div>
      </div>
    </section>
  );
}