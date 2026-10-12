"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Footer from "./footer";
import Navbar from "./navbar";

type EventFormData = {
  title: string;
  description: string;
  category: string;
  location: string;
  startDate: string;
  endDate: string;
  time: string;
  status: "upcoming" | "expired";
  priceType: "free" | "paid";
  price: string;
  coverImage: string;
  viewsCount: number;
};

const fieldClass = "mt-2 w-full rounded-lg border border-[#d8d1cb] bg-white px-4 py-3 text-sm text-[#292929] outline-none transition focus:border-[#292929] focus:ring-2 focus:ring-[#292929]/10";

function readImage(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("The image could not be read."));
    reader.readAsDataURL(file);
  });
}

export default function CreateEventForm() {
  const router = useRouter();
  const [isPoster, setIsPoster] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [priceType, setPriceType] = useState<"free" | "paid">("free");
  const [imagePreview, setImagePreview] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    queueMicrotask(() => {
      setIsPoster(localStorage.getItem("eventis-role") === "poster");
      setIsReady(true);
    });
  }, []);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    const form = event.currentTarget;
    const formData = new FormData(form);
    const startDate = String(formData.get("startDate"));
    const endDate = String(formData.get("endDate"));
    const startTimestamp = Date.parse(`${startDate}T00:00:00`);
    const endTimestamp = Date.parse(`${endDate}T00:00:00`);

    if (!Number.isFinite(startTimestamp) || !Number.isFinite(endTimestamp)) {
      setError("Enter valid start and end dates.");
      return;
    }
    if (endTimestamp < startTimestamp) {
      setError("End date cannot be earlier than start date.");
      return;
    }

    const cover = formData.get("coverImage");
    if (!(cover instanceof File)) {
      setError("Select an image file or leave the cover image empty.");
      return;
    }
    if (cover.size > 5 * 1024 * 1024) {
      setError("Cover images must be 5 MB or smaller.");
      return;
    }
    if (cover.size > 0 && !cover.type.startsWith("image/")) {
      setError("Choose an image file for the cover.");
      return;
    }

    setIsSubmitting(true);
    try {
      const coverImage = cover.size ? await readImage(cover) : "/eve1.jpg";
      const post: EventFormData & { id: string } = {
        id: crypto.randomUUID(),
        title: String(formData.get("title")).trim(),
        description: String(formData.get("description")).trim(),
        category: String(formData.get("category") ?? ""),
        location: String(formData.get("location")).trim(),
        startDate,
        endDate,
        time: String(formData.get("time")),
        status: String(formData.get("status")) as EventFormData["status"],
        priceType,
        price: priceType === "paid" ? String(formData.get("price")).trim() : "",
        coverImage,
        viewsCount: 0,
      };
      const savedPosts = JSON.parse(localStorage.getItem("eventis-events") ?? "[]");
      localStorage.setItem("eventis-events", JSON.stringify([post, ...savedPosts]));
      sessionStorage.setItem("eventis-published", post.title);
      router.push("/events");
    } catch {
      setError("This post could not be saved in this browser. Try a smaller cover image.");
      setIsSubmitting(false);
    }
  }

  if (!isReady) {
    return <main className="min-h-screen bg-[#f3f3f1]" />;
  }

  return (
    <main className="min-h-screen bg-[#f3f3f1] text-[#292929]">
      <Navbar />
      <section className="px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="mx-auto max-w-[920px]">
          <Link href="/events" className="text-sm font-semibold text-[#6d625b] hover:text-[#1b1b1b]">
            ← Back to events
          </Link>
          {!isPoster ? (
            <div className="mt-8 border-y border-[#d8d1cb] py-12">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[#8a6b55]">Organizer Access</p>
              <h1 className="mt-3 text-4xl font-black tracking-[-0.07em]">Become an Event Organizer</h1>
              <p className="mt-4 max-w-xl text-sm leading-6 text-[#65605c]">
                You are currently viewing Eventis as a regular attendee. Activate organizer permissions to publish concerts, parties, workshops, and nightlife events to Rwanda&apos;s feed.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => {
                    localStorage.setItem("eventis-role", "poster");
                    window.dispatchEvent(new Event("eventis-role-change"));
                    window.dispatchEvent(new Event("storage"));
                    setIsPoster(true);
                  }}
                  className="rounded-full bg-[#00A3FF] hover:bg-[#0092E6] px-6 py-3 text-sm font-bold text-white shadow-md transition cursor-pointer"
                >
                  Activate Organizer Access Now
                </button>
                <Link
                  href="/"
                  className="rounded-full border border-[#d8d1cb] bg-white px-6 py-3 text-sm font-bold text-[#292929] hover:bg-neutral-50 transition"
                >
                  Return to Feed
                </Link>
              </div>
            </div>
          ) : (
            <>
              <div className="mt-8 border-b border-[#d8d1cb] pb-7">
                <p className="text-xs font-black uppercase tracking-[0.2em] text-[#8a6b55]">EVENTIS / POSTER</p>
                <h1 className="mt-3 text-4xl font-black leading-none tracking-[-0.07em] sm:text-6xl">Create Event Post</h1>
                <p className="mt-4 text-sm leading-6 text-[#65605c]">Add the details so people know what to expect.</p>
              </div>

              <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label htmlFor="event-title" className="text-sm font-bold">Title <span className="text-[#9c4b3d">*</span></label>
                    <input id="event-title" name="title" required maxLength={100} className={fieldClass} placeholder="Give your event a clear name" />
                  </div>
                  <div className="sm:col-span-2">
                    <label htmlFor="event-description" className="text-sm font-bold">Description <span className="text-[#9c4b3d">*</span></label>
                    <textarea id="event-description" name="description" required rows={4} maxLength={2000} className={`${fieldClass} resize-y`} placeholder="What should attendees know?" />
                  </div>
                  <div>
                    <label htmlFor="event-category" className="text-sm font-bold">Category <span className="font-normal text-[#77716c]">(optional)</span></label>
                    <select id="event-category" name="category" defaultValue="" className={fieldClass}>
                      <option value="">Choose a category</option>
                      <option>Live music</option><option>Festival</option><option>Fashion</option><option>Food & drink</option><option>Community</option><option>Arts & culture</option><option>Other</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="event-location" className="text-sm font-bold">Location <span className="text-[#9c4b3d">*</span></label>
                    <input id="event-location" name="location" required maxLength={180} className={fieldClass} placeholder="Venue and area" />
                  </div>
                  <div>
                    <label htmlFor="event-start" className="text-sm font-bold">Start date <span className="text-[#9c4b3d">*</span></label>
                    <input id="event-start" name="startDate" type="date" required className={fieldClass} />
                  </div>
                  <div>
                    <label htmlFor="event-end" className="text-sm font-bold">End date <span className="text-[#9c4b3d">*</span></label>
                    <input id="event-end" name="endDate" type="date" required className={fieldClass} />
                  </div>
                  <div>
                    <label htmlFor="event-time" className="text-sm font-bold">Time <span className="text-[#9c4b3d">*</span></label>
                    <input id="event-time" name="time" type="time" required className={fieldClass} />
                  </div>
                  <div>
                    <label htmlFor="event-status" className="text-sm font-bold">Status <span className="text-[#9c4b3d">*</span></label>
                    <select id="event-status" name="status" required defaultValue="upcoming" className={fieldClass}>
                      <option value="upcoming">Upcoming</option>
                      <option value="expired">Expired</option>
                    </select>
                  </div>
                  <fieldset className="sm:col-span-2">
                    <legend className="text-sm font-bold">Admission <span className="text-[#9c4b3d">*</span></legend>
                    <div className="mt-3 flex flex-wrap gap-3">
                      {(["free", "paid"] as const).map((value) => (
                        <label key={value} className={`flex cursor-pointer items-center gap-2 rounded-lg border px-4 py-3 text-sm font-semibold capitalize ${priceType === value ? "border-[#292929] bg-white" : "border-[#d8d1cb] bg-[#f8f7f5]"}`}>
                          <input type="radio" name="priceType" value={value} checked={priceType === value} onChange={() => setPriceType(value)} className="accent-[#292929]" />
                          {value}
                        </label>
                      ))}
                    </div>
                    {priceType === "paid" && (
                      <div className="mt-4 max-w-sm">
                        <label htmlFor="event-price" className="text-sm font-bold">Ticket price <span className="text-[#9c4b3d">*</span></label>
                        <input id="event-price" name="price" required maxLength={40} className={fieldClass} placeholder="e.g. 10,000 RWF" />
                      </div>
                    )}
                  </fieldset>
                  <div className="sm:col-span-2">
                    <label htmlFor="event-cover" className="text-sm font-bold">Cover image <span className="font-normal text-[#77716c]">(optional)</span></label>
                    <input id="event-cover" name="coverImage" type="file" accept="image/*" onChange={(event) => {
                      const file = event.target.files?.[0];
                      if (file && file.size <= 5 * 1024 * 1024) setImagePreview(URL.createObjectURL(file));
                      else setImagePreview("");
                    }} className={`${fieldClass} file:mr-4 file:rounded-md file:border-0 file:bg-[#292929] file:px-3 file:py-2 file:text-xs file:font-bold file:text-white`} />
                    <p className="mt-2 text-xs text-[#77716c]">JPG, PNG, or another image format. Maximum 5 MB.</p>
                    {imagePreview && <Image src={imagePreview} alt="Selected event cover preview" width={520} height={300} unoptimized className="mt-4 aspect-[16/8] w-full max-w-md rounded-lg object-cover" />}
                  </div>
                </div>

                {error && <p role="alert" className="rounded-lg border border-[#e2b8ae] bg-[#fff1ed] px-4 py-3 text-sm font-semibold text-[#8b3326]">{error}</p>}
                <div className="flex flex-col-reverse gap-3 border-t border-[#d8d1cb] pt-6 sm:flex-row sm:justify-end">
                  <Link href="/events" className="rounded-lg border border-[#d2cbc5] px-5 py-3 text-center text-sm font-bold text-[#292929] transition hover:bg-white">Cancel</Link>
                  <button type="submit" disabled={isSubmitting} className="rounded-lg bg-[#1b1b1b] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#3a3a3a] disabled:cursor-wait disabled:opacity-60">
                    {isSubmitting ? "Publishing..." : "Publish event"}
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </section>
      <Footer />
    </main>
  );
}