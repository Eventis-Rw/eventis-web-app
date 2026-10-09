import Link from "next/link";
import LoginForm from "@/app/components/login-form";

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-[#f3f3f1]">
      <div className="relative min-h-screen overflow-hidden bg-[#f9f7f5]">
        <Link
          href="/"
          className="absolute right-5 top-5 z-30 inline-flex items-center gap-2 rounded-full border border-white/70 bg-white px-4 py-2 text-sm font-semibold text-black shadow-lg transition hover:bg-[#f0f0f0] sm:right-8 sm:top-7"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
            aria-hidden="true"
            className="h-4 w-4 fill-current"
          >
            <path d="M240 6.1c9.1-8.2 22.9-8.2 32 0l232 208c9.9 8.8 10.7 24 1.8 33.9s-24 10.7-33.9 1.8l-8-7.2 0 205.3c0 35.3-28.7 64-64 64l-288 0c-35.3 0-64-28.7-64-64l0-205.3-8 7.2c-9.9 8.8-25 8-33.9-1.8s-8-25 1.8-33.9L240 6.1zm16 50.1L96 199.7 96 448c0 8.8 7.2 16 16 16l48 0 0-104c0-39.8 32.2-72 72-72l48 0c39.8 0 72 32.2 72 72l0 104 48 0c8.8 0 16-7.2 16-16l0-248.3-160-143.4zM208 464l96 0 0-104c0-13.3-10.7-24-24-24l-48 0c-13.3 0-24 10.7-24 24l0 104z" />
          </svg>
          Home
        </Link>

        <div className="grid min-h-screen lg:grid-cols-[0.9fr_1.1fr]">
          <div className="relative min-h-[620px] overflow-hidden bg-[#061117] px-8 py-10 text-white sm:px-10 lg:min-h-screen lg:px-12">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: "url('/api/event-image')" }}
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,8,12,0.48),rgba(0,8,12,0.9)_78%,rgba(0,8,12,0.98))]" />
            <div className="relative z-10 flex h-full flex-col justify-between">
              <Link href="/" className="inline-flex flex-col text-white">
                <span className="text-[2rem] font-black leading-none tracking-[-0.08em]">EVENTIS</span>
                <span className="mt-2 text-[0.58rem] font-semibold tracking-[0.28em] text-white/75">
                  DISCOVER • CONNECT • EXPERIENCE
                </span>
              </Link>

              <div className="mt-12 max-w-md">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/70">Your events await</p>
                <h2 className="mt-4 text-4xl font-black leading-tight tracking-[-0.06em] text-white sm:text-5xl">
                  Pick up where you left off.
                </h2>
              </div>
            </div>
          </div>

          <LoginForm />
        </div>
      </div>
    </main>
  );
}
