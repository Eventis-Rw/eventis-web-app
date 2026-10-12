"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { saveUserSession, type EventisUser } from "../lib/auth";

function generateUserId(prefix: string) {
  return `${prefix}_${Date.now().toString(36)}`;
}

interface AuthGateProps {
  initialMode?: "login" | "register";
}

export default function AuthGate({ initialMode = "login" }: AuthGateProps) {
  const router = useRouter();
  const [authMode, setAuthMode] = useState<"login" | "register">(initialMode);

  // Login form state
  const [phone, setPhone] = useState("");
  const [loginError, setLoginError] = useState("");

  // Register form state
  const [fullName, setFullName] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regStep, setRegStep] = useState<"details" | "otp">("details");
  const [otp, setOtp] = useState<string[]>(Array(4).fill(""));
  const [regError, setRegError] = useState("");

  const handleSwitchToRegister = () => {
    setAuthMode("register");
    setRegStep("details");
    setRegError("");
    if (typeof window !== "undefined") {
      window.history.replaceState(null, "", "/users/auth/register");
    }
  };

  const handleSwitchToLogin = () => {
    setAuthMode("login");
    setLoginError("");
    if (typeof window !== "undefined") {
      window.history.replaceState(null, "", "/users/auth/login");
    }
  };

  // LOGIN ACTIONS
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let digits = phone.replace(/\D/g, "");
    if (!digits) {
      setLoginError("Please enter your phone number.");
      return;
    }
    if (digits.length === 9 && digits.startsWith("7")) {
      digits = "0" + digits;
      setPhone(digits);
    }
    if (digits.length < 10) {
      setLoginError("Phone number must be at least 10 digits (e.g. 0788123456).");
      return;
    }
    if (digits.length === 10 && !digits.startsWith("07")) {
      setLoginError("Rwandan phone numbers must start with 07 (e.g. 0788123456).");
      return;
    }

    const cleanUsername = digits.slice(-4);
    const user: EventisUser = {
      id: generateUserId("usr"),
      username: cleanUsername ? `explorer_${cleanUsername}` : "rwanda_explorer",
      fullName: "Eric Mugisha",
      phone: digits,
      email: "member@eventis.rw",
      avatarUrl: "/eve1.jpg",
      isPhoneVerified: true,
      isBusinessAccount: false,
      bio: "Discovering live concerts and culture across Rwanda 🇷🇼",
    };

    saveUserSession(user);
    router.push("/");
  };

  // REGISTER ACTIONS
  const handleRegisterNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (fullName.trim().length < 2) {
      setRegError("Please enter your full name.");
      return;
    }
    let digits = regPhone.replace(/\D/g, "");
    if (!digits) {
      setRegError("Please enter your phone number.");
      return;
    }
    if (digits.length === 9 && digits.startsWith("7")) {
      digits = "0" + digits;
      setRegPhone(digits);
    }
    if (digits.length < 10) {
      setRegError("Phone number must be at least 10 digits (e.g. 0788123456).");
      return;
    }
    if (digits.length === 10 && !digits.startsWith("07")) {
      setRegError("Rwandan phone numbers must start with 07 (e.g. 0788123456).");
      return;
    }
    setRegError("");
    setRegStep("otp");
  };

  const verifyOtpCode = (code: string) => {
    if (code.length !== 4) {
      setRegError("Please enter the complete 4-digit verification code.");
      return;
    }

    const cleanUsername = fullName.trim().toLowerCase().replace(/\s+/g, "_") || "new_explorer";
    const user: EventisUser = {
      id: generateUserId("usr"),
      username: cleanUsername,
      fullName: fullName.trim(),
      phone: regPhone,
      email: `${cleanUsername}@eventis.rw`,
      avatarUrl: "/eve2.jpg",
      isPhoneVerified: true,
      isBusinessAccount: false,
      bio: "Just joined Eventis! Ready for live events 🇷🇼",
    };

    saveUserSession(user);
    router.push("/");
  };

  const handleVerifyOtp = () => {
    verifyOtpCode(otp.join(""));
  };

  const handleOtpChange = (index: number, val: string) => {
    const digit = val.replace(/\D/g, "").slice(-1);
    const nextOtp = [...otp];
    nextOtp[index] = digit;
    setOtp(nextOtp);
    if (regError) setRegError("");

    if (digit && index < 3) {
      const nextInput = document.getElementById(`react-otp-${index + 1}`) as HTMLInputElement | null;
      nextInput?.focus();
    }

    const fullCode = nextOtp.join("");
    if (fullCode.length === 4) {
      verifyOtpCode(fullCode);
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`react-otp-${index - 1}`) as HTMLInputElement | null;
      prevInput?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 4);
    if (!pasted) return;
    const nextOtp = Array(4).fill("");
    for (let i = 0; i < pasted.length; i++) {
      nextOtp[i] = pasted[i];
    }
    setOtp(nextOtp);
    if (pasted.length === 4) {
      verifyOtpCode(pasted);
    } else {
      const targetInput = document.getElementById(`react-otp-${pasted.length}`) as HTMLInputElement | null;
      targetInput?.focus();
    }
  };

  return (
    <div className="eventis-gate-root">
      <style>{`
        .eventis-gate-root {
          position: fixed;
          inset: 0;
          overflow: hidden;
          background: #070814;
          color: #F4F7FF;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
          -webkit-font-smoothing: antialiased;
          text-rendering: geometricPrecision;
          z-index: 100;
          display: flex;
        }

        /* ─── Left Hero Video Panel (Crisp, High-Speed Falcon Video) ─── */
        .gate-photo {
          position: relative;
          width: 55%;
          height: 100%;
          overflow: hidden;
          background: #020308;
          flex-shrink: 0;
        }

        .gate-photo-img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
          display: block;
          user-select: none;
        }

        /* ─── Right Pane Container (Centered & Balanced) ─── */
        .gate-pane {
          position: relative;
          flex: 1;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 48px 32px;
          overflow-y: auto;
          background: #070814;
        }

        /* ─── Seamless Auth Container (No Div / Box Border) ─── */
        .gate-card {
          position: relative;
          z-index: 1;
          width: 100%;
          max-width: 440px;
          background: transparent;
          border: none;
          box-shadow: none;
          padding: 0;
          display: flex;
          flex-direction: column;
          animation: gateCardEntrance 0.62s cubic-bezier(0.16, 1, 0.3, 1) both;
        }

        @keyframes gateCardEntrance {
          from {
            opacity: 0;
            transform: translateY(16px) scale(0.985);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        /* ─── Brand Lockup ─── */
        .gate-brand {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          margin-bottom: 24px;
        }

        .gate-brand-icon {
          width: 32px;
          height: 32px;
          filter: drop-shadow(0 2px 10px rgba(0, 163, 255, 0.5));
        }

        .gate-brand-name {
          font-size: 14px;
          font-weight: 800;
          letter-spacing: 0.18em;
          color: #FFFFFF;
          text-transform: uppercase;
        }

        /* ─── Typography ─── */
        .gate-title {
          font-size: 28px;
          font-weight: 800;
          letter-spacing: -0.025em;
          color: #FFFFFF;
          margin: 0 0 24px 0;
          line-height: 1.2;
          text-align: center;
        }

        .gate-subtitle {
          font-size: 14px;
          color: #A7B0C9;
          margin: 0 0 24px 0;
          line-height: 1.5;
          text-align: center;
        }

        /* ─── Form Inputs ─── */
        .gate-form {
          display: flex;
          flex-direction: column;
          gap: 18px;
        }

        .gate-field-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .gate-field-label {
          font-size: 13px;
          font-weight: 600;
          color: #CBD5E1;
          letter-spacing: -0.01em;
        }

        .gate-input-wrapper {
          display: flex;
          align-items: center;
          height: 52px;
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          border: 1.5px solid rgba(255, 255, 255, 0.16);
          border-radius: 14px;
          padding: 0 14px;
          gap: 10px;
          box-shadow: inset 0 1px 1px rgba(255, 255, 255, 0.1), 0 2px 6px rgba(0, 0, 0, 0.15);
          transition: border-color 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease;
        }

        .gate-input-wrapper:focus-within {
          border-color: #00A3FF;
          background: rgba(255, 255, 255, 0.08);
          box-shadow: 0 0 0 3px rgba(0, 163, 255, 0.28), inset 0 1px 1px rgba(255, 255, 255, 0.2);
        }

        .gate-text-input,
        .gate-phone-input {
          flex: 1;
          height: 100%;
          background: transparent;
          border: none;
          outline: none;
          color: #FFFFFF;
          font-size: 15px;
          font-family: inherit;
          font-weight: 500;
        }

        .gate-text-input::placeholder,
        .gate-phone-input::placeholder {
          color: rgba(167, 176, 201, 0.55);
          font-weight: 400;
        }

        .gate-field-icon {
          width: 18px;
          height: 18px;
          color: #7D88A8;
          flex-shrink: 0;
        }

        /* ─── Error Alert Banner ─── */
        .gate-error-banner {
          display: flex;
          align-items: center;
          gap: 8px;
          background: rgba(239, 68, 68, 0.12);
          border: 1px solid rgba(239, 68, 68, 0.28);
          color: #FCA5A5;
          font-size: 13px;
          font-weight: 500;
          padding: 10px 14px;
          border-radius: 12px;
          margin-top: 4px;
        }

        .gate-error-icon {
          width: 16px;
          height: 16px;
          flex-shrink: 0;
        }

        /* ─── Submit Button (Clean, Centered, Pill Shape) ─── */
        .gate-submit-btn {
          width: 100%;
          height: 54px;
          border-radius: 999px;
          border: 1px solid rgba(255, 255, 255, 0.25);
          background: linear-gradient(135deg, rgba(0, 163, 255, 0.95) 0%, rgba(0, 102, 255, 0.95) 100%);
          color: #FFFFFF;
          font-size: 15px;
          font-weight: 700;
          letter-spacing: 0.01em;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-top: 6px;
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          box-shadow:
            0 12px 32px -4px rgba(0, 163, 255, 0.48),
            inset 0 1px 1px rgba(255, 255, 255, 0.45),
            inset 0 -1px 1px rgba(0, 0, 0, 0.15);
          transition: transform 0.18s cubic-bezier(0.2, 0.7, 0.3, 1), box-shadow 0.18s ease, filter 0.18s ease;
        }

        .gate-submit-btn:hover {
          filter: brightness(1.1);
          transform: translateY(-1px);
          box-shadow:
            0 16px 36px -4px rgba(0, 163, 255, 0.58),
            inset 0 1px 1px rgba(255, 255, 255, 0.5);
        }

        .gate-submit-btn:active {
          transform: translateY(1px);
          filter: brightness(0.96);
        }

        /* ─── Footer Navigation ─── */
        .gate-footer {
          margin-top: 24px;
          text-align: center;
          font-size: 14px;
          color: #A7B0C9;
        }

        .gate-footer-btn {
          color: #00A3FF;
          font-weight: 700;
          text-decoration: underline;
          text-underline-offset: 3px;
          background: none;
          border: none;
          cursor: pointer;
          font-size: inherit;
          padding: 0;
          margin-left: 4px;
          transition: color 0.15s ease;
        }

        .gate-footer-btn:hover {
          color: #38BDF8;
        }

        /* ─── OTP Verification Grid (4 Digits) ─── */
        .gate-otp-grid {
          display: flex;
          justify-content: center;
          gap: 14px;
          margin: 10px 0 16px 0;
        }

        .gate-otp-box {
          width: 64px;
          height: 64px;
          text-align: center;
          font-size: 24px;
          font-weight: 800;
          border-radius: 14px;
          background: rgba(255, 255, 255, 0.06);
          border: 1.5px solid rgba(255, 255, 255, 0.18);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          box-shadow: inset 0 1px 1px rgba(255, 255, 255, 0.1);
          color: #FFFFFF;
          outline: none;
          transition: border-color 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease;
        }

        .gate-otp-box:focus {
          border-color: #00A3FF;
          box-shadow: 0 0 0 3px rgba(0, 163, 255, 0.26), inset 0 1px 1px rgba(255, 255, 255, 0.2);
          background: rgba(255, 255, 255, 0.1);
        }

        /* ─── Mobile Responsiveness (< 900px) ─── */
        @media (max-width: 899px) {
          .eventis-gate-root {
            flex-direction: column;
            overflow-y: auto;
          }

          .gate-photo {
            width: 100%;
            height: clamp(230px, 30vh, 280px);
          }

          .gate-scrim-blend {
            width: 100%;
            height: 90px;
            top: auto;
            bottom: 0;
            background: linear-gradient(to bottom, rgba(7, 8, 20, 0) 0%, rgba(7, 8, 20, 0.85) 60%, #070814 100%);
          }

          .gate-pane {
            width: 100%;
            height: auto;
            min-height: auto;
            padding: 0 20px 40px 20px;
            margin-top: -30px;
            z-index: 3;
          }

          .gate-card {
            max-width: 480px;
            padding: 32px 24px;
            border-radius: 22px;
          }

          .gate-title {
            font-size: 24px;
          }

          .gate-otp-box {
            width: 42px;
            height: 50px;
            font-size: 18px;
          }
        }
      `}</style>

      {/* Home Navigation Button */}
      <Link
        href="/"
        className="absolute top-5 right-5 z-50 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/[0.08] hover:bg-white/[0.15] border border-white/[0.14] backdrop-blur-md text-xs font-semibold text-[#A7B0C9] hover:text-white transition shadow-lg cursor-pointer"
        aria-label="Go to home"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="w-3.5 h-3.5 text-[#00A3FF]"
          aria-hidden="true"
        >
          <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
        </svg>
        <span>Home</span>
      </Link>

      {/* Left Artwork Section with Seamless Falcon Video Loop */}
      <section className="gate-photo">
        <video
          className="gate-photo-img"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
        >
          <source
            src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260813_052122_e77a27e6-17f1-4794-889b-3ceaa0e9e8cb.mp4"
            type="video/mp4"
          />
        </video>
      </section>

      {/* Right Form Pane with Clean Glassmorphic Card */}
      <section className="gate-pane">
        <div className="gate-card">
          {/* Brand Header */}
          <div className="gate-brand">
            <svg className="gate-brand-icon" viewBox="8 0 128 126" fill="none" aria-hidden="true">
              <circle cx="108" cy="13" r="11" fill="#00A3FF" />
              <path
                fill="#00A3FF"
                fillRule="evenodd"
                d="M63 28c-27 0-47 19-47 46s20 46 47 46c21 0 37-11 47-28l-18-9c-6 12-16 19-29 19-16 0-27-9-30-23l50-1 47-47c5-5 0-12-6-9L91 42C83 33 74 28 63 28Zm-29 35c4-13 14-20 29-20 12 0 21 6 25 17l-54 3Z"
              />
            </svg>
            <span className="gate-brand-name">EVENTIS</span>
          </div>

          {authMode === "login" ? (
            <>
              <h1 className="gate-title">Welcome Back</h1>

              <form onSubmit={handleLoginSubmit} className="gate-form">
                <div className="gate-field-group">
                  <label htmlFor="gate-phone-input" className="gate-field-label">
                    Phone Number
                  </label>
                  <div className="gate-input-wrapper">
                    <svg className="gate-field-icon" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 4V3z" />
                    </svg>
                    <input
                      id="gate-phone-input"
                      type="tel"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={12}
                      autoComplete="tel"
                      value={phone}
                      onKeyDown={(e) => {
                        if (
                          ["Backspace", "Delete", "Tab", "Escape", "Enter", "ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.key) ||
                          (e.ctrlKey || e.metaKey)
                        ) {
                          return;
                        }
                        if (!/^\d$/.test(e.key)) {
                          e.preventDefault();
                        }
                      }}
                      onChange={(e) => {
                        const onlyNumbers = e.target.value.replace(/\D/g, "");
                        setPhone(onlyNumbers);
                        setLoginError("");
                      }}
                      placeholder="Enter your phone number"
                      aria-label="Phone number"
                      className="gate-phone-input"
                    />
                  </div>

                  {loginError && (
                    <div className="gate-error-banner" role="alert">
                      <svg viewBox="0 0 20 20" fill="currentColor" className="gate-error-icon" aria-hidden="true">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      <span>{loginError}</span>
                    </div>
                  )}
                </div>

                <button id="gate-loginBtn" type="submit" className="gate-submit-btn">
                  Login
                </button>
              </form>

              <p className="gate-footer" id="gate-bottom">
                Don&#8217;t have an account?
                <button
                  type="button"
                  className="gate-footer-btn"
                  onClick={handleSwitchToRegister}
                >
                  Register
                </button>
              </p>
            </>
          ) : (
            /* Streamlined Registration View */
            <>
              <h1 className="gate-title">
                {regStep === "details" ? "Create Account" : "Verify Phone"}
              </h1>
              {regStep === "otp" && (
                <p className="gate-subtitle">
                  Enter the 4-digit verification code sent to {regPhone}
                </p>
              )}

              {regStep === "details" ? (
                <form onSubmit={handleRegisterNext} className="gate-form">
                  <div className="gate-field-group">
                    <label htmlFor="reg-name" className="gate-field-label">Full Name</label>
                    <div className="gate-input-wrapper">
                      <svg className="gate-field-icon" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                      </svg>
                      <input
                        id="reg-name"
                        type="text"
                        value={fullName}
                        onChange={(e) => {
                          setFullName(e.target.value);
                          setRegError("");
                        }}
                        placeholder="e.g. Eric Mugisha"
                        className="gate-text-input"
                      />
                    </div>
                  </div>

                  <div className="gate-field-group">
                    <label htmlFor="reg-phone" className="gate-field-label">Phone Number</label>
                    <div className="gate-input-wrapper">
                      <svg className="gate-field-icon" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 4V3z" />
                      </svg>
                      <input
                        id="reg-phone"
                        type="tel"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        maxLength={12}
                        value={regPhone}
                        onKeyDown={(e) => {
                          if (
                            ["Backspace", "Delete", "Tab", "Escape", "Enter", "ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.key) ||
                            (e.ctrlKey || e.metaKey)
                          ) {
                            return;
                          }
                          if (!/^\d$/.test(e.key)) {
                            e.preventDefault();
                          }
                        }}
                        onChange={(e) => {
                          const onlyNumbers = e.target.value.replace(/\D/g, "");
                          setRegPhone(onlyNumbers);
                          setRegError("");
                        }}
                        placeholder="Enter your phone number"
                        className="gate-phone-input"
                      />
                    </div>
                  </div>

                  {regError && (
                    <div className="gate-error-banner" role="alert">
                      <svg viewBox="0 0 20 20" fill="currentColor" className="gate-error-icon" aria-hidden="true">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      <span>{regError}</span>
                    </div>
                  )}

                  <button type="submit" className="gate-submit-btn">
                    Continue
                  </button>
                </form>
              ) : (
                <div className="gate-form">
                  <div className="gate-otp-grid">
                    {otp.map((val, idx) => (
                      <input
                        key={idx}
                        id={`react-otp-${idx}`}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={val}
                        onChange={(e) => handleOtpChange(idx, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                        onPaste={handleOtpPaste}
                        className="gate-otp-box"
                      />
                    ))}
                  </div>

                  {regError && (
                    <div className="gate-error-banner" role="alert">
                      <svg viewBox="0 0 20 20" fill="currentColor" className="gate-error-icon" aria-hidden="true">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      <span>{regError}</span>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={handleVerifyOtp}
                    className="gate-submit-btn"
                  >
                    Verify
                  </button>
                </div>
              )}

              <p className="gate-footer">
                Already have an account?
                <button
                  type="button"
                  className="gate-footer-btn"
                  onClick={handleSwitchToLogin}
                >
                  Log in
                </button>
              </p>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
