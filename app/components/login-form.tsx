"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { DEFAULT_DEMO_USER, saveUserSession, type EventisUser } from "../lib/auth";

export default function LoginForm() {
  const router = useRouter();
  const [phoneNumber, setPhoneNumber] = useState("");
  const canLogin = phoneNumber.trim().length >= 10;

  const handleLoginSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!canLogin) return;

    const user: EventisUser = {
      id: "usr_" + Date.now().toString(36),
      username: "kigali_member",
      fullName: "Eric Mugisha",
      phone: phoneNumber,
      email: "member@eventis.rw",
      avatarUrl: "/eve1.jpg",
      isPhoneVerified: true,
      isBusinessAccount: false,
      bio: "Active member in the Rwanda Eventis community.",
    };
    saveUserSession(user);
    router.push("/");
  };

  const handleDemoLogin = () => {
    saveUserSession(DEFAULT_DEMO_USER);
    router.push("/");
  };

  return (
    <div className="flex min-h-[620px] items-center justify-center bg-[#fbfaf9] px-5 py-12 sm:px-8 sm:py-14 lg:min-h-screen lg:px-12">
      <div className="w-full max-w-lg rounded-[28px] border border-[#eee7e4] bg-white p-6 shadow-[0_18px_40px_rgba(17,17,17,0.04)] sm:p-8">
        <div className="mb-8 text-left">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#66615d]">Welcome back</p>
          <h1 className="mt-3 text-3xl font-black tracking-[-0.06em] text-[#1b1b1b]">
            Log in to EVENTIS
          </h1>
          <p className="mt-3 text-sm leading-6 text-[#5a5755]">
            Enter your phone number to continue discovering events and connecting with your community.
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleLoginSubmit}>
          <div>
            <label htmlFor="login-phone-number" className="mb-2 block text-sm font-semibold text-[#343434]">
              Phone number
            </label>
            <input
              id="login-phone-number"
              name="phoneNumber"
              type="tel"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={12}
              autoComplete="tel"
              value={phoneNumber}
              onKeyDown={(e) => {
                if (
                  ["Backspace", "Delete", "Tab", "Escape", "Enter", "ArrowLeft", "ArrowRight"].includes(e.key) ||
                  (e.ctrlKey || e.metaKey)
                ) {
                  return;
                }
                if (!/^\d$/.test(e.key)) {
                  e.preventDefault();
                }
              }}
              onChange={(event) => setPhoneNumber(event.target.value.replace(/\D/g, ""))}
              placeholder="Enter your phone number"
              className="w-full rounded-2xl border border-[#e7e0dc] bg-[#f7f5f4] px-4 py-3.5 text-base text-[#1b1b1b] shadow-[inset_0_1px_2px_rgba(17,17,17,0.02)] outline-none transition focus:border-[#1b1b1b] focus:bg-white focus:ring-2 focus:ring-[#1b1b1b]/10"
            />
          </div>

          <button
            type="submit"
            disabled={!canLogin}
            className="w-full rounded-full bg-[#1b1b1b] px-5 py-3.5 text-base font-bold text-white shadow-[0_15px_30px_rgba(17,17,17,0.15)] transition hover:bg-[#2b2b2b] disabled:cursor-not-allowed disabled:bg-[#bdb5b0] disabled:shadow-none cursor-pointer"
          >
            Login
          </button>

          <button
            type="button"
            onClick={handleDemoLogin}
            className="w-full py-3 px-4 rounded-full border border-dashed border-[#00A3FF] text-[#00A3FF] text-sm font-bold hover:bg-[#00A3FF]/10 transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>⚡ Continue with Demo Account</span>
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-[#5a5755]">
          Don&apos;t have an account?{" "}
          <Link href="/users/auth/register" className="font-semibold text-[#00A3FF] hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
