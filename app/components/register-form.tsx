"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { saveUserSession, type EventisUser } from "../lib/auth";

type Step = "signup" | "otp" | "success";

function generateUserId(prefix: string) {
  return `${prefix}_${Date.now().toString(36)}`;
}

export default function RegisterForm() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("signup");
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState<string[]>(Array(4).fill(""));

  const otpCode = useMemo(() => otp.join(""), [otp]);
  const canContinue = fullName.trim().length > 1 && phoneNumber.trim().length >= 10;

  const handleNext = () => {
    if (!canContinue) return;
    setStep("otp");
  };

  const executeVerification = (code?: string) => {
    const finalCode = code || otp.join("");
    if (finalCode.length !== 4) return;
    const user: EventisUser = {
      id: generateUserId("usr"),
      username: fullName.trim().toLowerCase().replace(/\s+/g, "_") || "eventis_user",
      fullName: fullName.trim() || "New Member",
      phone: phoneNumber,
      email: `${fullName.trim().toLowerCase().replace(/\s+/g, ".")}@eventis.rw`,
      avatarUrl: "/eve2.jpg",
      isPhoneVerified: true,
      isBusinessAccount: false,
    };
    saveUserSession(user);
    setStep("success");
  };

  const handleOtpChange = (index: number, value: string) => {
    const sanitized = value.replace(/\D/g, "").slice(-1);
    const nextOtp = [...otp];
    nextOtp[index] = sanitized;
    setOtp(nextOtp);

    if (sanitized && index < 3) {
      const nextInput = document.getElementById(`otp-${index + 1}`) as HTMLInputElement | null;
      nextInput?.focus();
    }

    if (nextOtp.join("").length === 4) {
      executeVerification(nextOtp.join(""));
    }
  };

  const handleOtpKeyDown = (
    index: number,
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key === "Backspace" && !otp[index] && index > 0) {
      const previousInput = document.getElementById(`otp-${index - 1}`) as HTMLInputElement | null;
      previousInput?.focus();
    }
  };

  const handleVerify = () => {
    executeVerification(otpCode);
  };

  return (
    <div className="flex min-h-[620px] items-center justify-center bg-[#fbfaf9] px-5 py-12 sm:px-8 sm:py-14 lg:min-h-screen lg:px-12">
      {step === "signup" && (
        <div className="w-full max-w-lg rounded-[28px] border border-[#eee7e4] bg-white p-6 shadow-[0_18px_40px_rgba(17,17,17,0.04)] sm:p-8">
          <div className="mb-8 text-left">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#66615d]">
              Sign up
            </p>
            <h2 className="mt-3 text-3xl font-black tracking-[-0.06em] text-[#1b1b1b]">
              Create your account
            </h2>
          </div>

          <div className="space-y-6">
            <div>
              <label htmlFor="full-name" className="mb-2 block text-sm font-semibold text-[#343434]">
                Full name
              </label>
              <input
                id="full-name"
                type="text"
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
                placeholder="Enter your full name"
                className="w-full rounded-2xl border border-[#e7e0dc] bg-[#f7f5f4] px-4 py-3.5 text-base text-[#1b1b1b] shadow-[inset_0_1px_2px_rgba(17,17,17,0.02)] outline-none transition focus:border-[#1b1b1b] focus:bg-white focus:ring-2 focus:ring-[#1b1b1b]/10"
              />
            </div>

            <div>
              <label htmlFor="phone-number" className="mb-2 block text-sm font-semibold text-[#343434]">
                Phone number
              </label>
              <input
                id="phone-number"
                type="tel"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={12}
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
              type="button"
              onClick={handleNext}
              disabled={!canContinue}
              className="w-full rounded-full bg-[#1b1b1b] px-5 py-3.5 text-base font-bold text-white shadow-[0_15px_30px_rgba(17,17,17,0.15)] transition hover:bg-[#2b2b2b] disabled:cursor-not-allowed disabled:bg-[#bdb5b0] disabled:shadow-none cursor-pointer"
            >
              Continue
            </button>
          </div>

          <p className="mt-8 text-center text-sm text-[#5a5755]">
            Already have an account?{" "}
            <Link href="/users/auth/login" className="font-semibold text-[#00A3FF] hover:underline">
              Log in
            </Link>
          </p>
        </div>
      )}

      {step === "otp" && (
        <div className="w-full max-w-lg rounded-[28px] border border-[#eee7e4] bg-white p-6 shadow-[0_18px_40px_rgba(17,17,17,0.04)] sm:p-8">
          <div className="mb-8 text-left">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#66615d]">
              Verification
            </p>
            <h2 className="mt-3 text-3xl font-black tracking-[-0.06em] text-[#1b1b1b]">
              Enter OTP code
            </h2>
            <p className="mt-3 text-sm leading-6 text-[#5a5755]">
              We&apos;ve sent a 4-digit verification code to {phoneNumber}.
            </p>
          </div>

          <div className="flex justify-center gap-2 sm:gap-3">
            {otp.map((digit, index) => (
              <input
                key={index}
                id={`otp-${index}`}
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={1}
                value={digit}
                onChange={(event) => handleOtpChange(index, event.target.value)}
                onKeyDown={(event) => handleOtpKeyDown(index, event)}
                className="h-12 w-11 rounded-xl border border-[#e3ddd8] bg-white text-center text-lg font-bold text-[#1b1b1b] outline-none transition focus:border-[#1b1b1b] focus:ring-2 focus:ring-[#1b1b1b]/10 sm:h-14 sm:w-12"
              />
            ))}
          </div>

          <button
            type="button"
            onClick={handleVerify}
            disabled={otpCode.length !== 4}
            className="mt-8 w-full rounded-full bg-[#00A3FF] hover:bg-[#0092E6] px-5 py-3.5 text-base font-bold text-white shadow-lg transition cursor-pointer disabled:cursor-not-allowed disabled:bg-[#bdb5b0] disabled:shadow-none"
          >
            Verify
          </button>

          <div className="mt-6 flex items-center justify-between text-sm text-[#5a5755]">
            <button type="button" className="font-semibold text-[#1b1b1b] hover:underline cursor-pointer">
              Resend code
            </button>
            <button
              type="button"
              onClick={() => setStep("signup")}
              className="font-semibold text-[#1b1b1b] hover:underline cursor-pointer"
            >
              Edit details
            </button>
          </div>
        </div>
      )}

      {step === "success" && (
        <div className="w-full max-w-lg rounded-[28px] border border-[#eee7e4] bg-white p-6 text-center shadow-[0_18px_40px_rgba(17,17,17,0.04)] sm:p-8">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-2xl text-emerald-600 font-bold border border-emerald-200">
            ✓
          </div>

          <h2 className="mt-6 text-3xl font-black tracking-[-0.06em] text-[#1b1b1b]">
            Account verified
          </h2>
          <p className="mt-3 text-sm leading-6 text-[#5a5755]">
            Welcome to EVENTIS, <strong className="text-[#1b1b1b]">{fullName}</strong>! Your account has been verified and you are now signed in.
          </p>

          <button
            type="button"
            onClick={() => router.push("/")}
            className="mt-8 inline-flex w-full items-center justify-center rounded-full bg-[#00A3FF] hover:bg-[#0092E6] px-5 py-3.5 text-base font-bold text-white shadow-lg transition cursor-pointer"
          >
            Enter Eventis Feed →
          </button>
        </div>
      )}
    </div>
  );
}
