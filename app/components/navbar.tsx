import Link from "next/link";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/users/about" },
  { label: "Connect With Eventis", href: "/" },
  { label: "Contact Us", href: "/#contact" },
];

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-[#e7e1dc] bg-[#f7f5f3]/90 backdrop-blur-sm">
      <div className="mx-auto flex max-w-[1500px] items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex shrink-0 items-center">
          <span className="text-[1.75rem] font-black tracking-[-0.08em] text-[#1b1b1b] sm:text-[2rem]">
            EVENTIS
          </span>
        </Link>

        <nav className="hidden items-center justify-center md:flex">
          <div className="flex items-center gap-2 rounded-full border border-[#e8e1dc] bg-[#f8f5f3]/80 px-3 py-2 shadow-[0_8px_18px_rgba(17,17,17,0.03)] backdrop-blur-sm">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="rounded-full px-4 py-2 text-[0.92rem] font-bold text-[#3e3e3e] transition duration-200 hover:bg-[#f3efed] hover:text-[#111111]"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </nav>

        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-2 rounded-full border border-[#e2ddd9] bg-white/80 p-1.5 shadow-[0_8px_20px_rgba(17,17,17,0.04)] sm:flex">
            <Link
              href="/users/auth/login"
              className="rounded-full px-4 py-2 text-sm font-semibold text-[#1d1d1d] transition hover:bg-[#f5f2ef]"
            >
              Login
            </Link>

            <Link
              href="/users/auth/register"
              className="rounded-full bg-[#1b1b1b] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#2d2d2d]"
            >
              Sign Up
            </Link>
          </div>

          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full bg-[#1a1a1a] px-4 py-2.5 text-sm font-bold text-white shadow-[0_12px_24px_rgba(17,17,17,0.18)] transition hover:bg-[#2b2b2b]"
          >
            <span className="flex items-center gap-2">
              <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-current">
                <path d="M15.7 12.5c0-2.2 1.8-3.3 1.9-3.4-1-1.5-2.6-1.7-3.2-1.8-1.4-.1-2.7.8-3.4.8-.7 0-1.8-.8-2.9-.8-1.5 0-2.9.9-3.7 2.1-1.6 2.8-.4 6.9 1.1 9.2.7 1 1.6 2.1 2.7 2.1 1.1 0 1.5-.7 2.9-.7 1.4 0 1.8.7 2.9.7 1.2 0 2-.9 2.7-2 .9-1.3 1.3-2.6 1.3-2.7-.1-.1-2.5-1-2.5-3.2Zm-2.3-6.4c.6-.7 1-1.7.9-2.6-.9.1-2 .6-2.7 1.3-.6.6-1.1 1.6-1 2.5.9.1 2-.5 2.8-1.2Z" />
              </svg>
              <svg viewBox="0 0 448 512" aria-hidden="true" className="h-4 w-4 fill-current">
                <path d="M293.6 234.3L72.9 13 353.7 174.2 293.6 234.3zM15.3 0C2.3 6.8-6.4 19.2-6.4 35.3l0 441.3c0 16.1 8.7 28.5 21.7 35.3L271.9 255.9 15.3 0zM440.5 225.6l-58.9-34.1-65.7 64.5 65.7 64.5 60.1-34.1c18-14.3 18-46.5-1.2-60.8zM72.9 499L353.7 337.8 293.6 277.7 72.9 499z" />
              </svg>
            </span>
            <span>Get App</span>
          </Link>

          <button className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#d5d0cc] bg-white text-lg text-[#1d1d1d] shadow-sm md:hidden">
            ☰
          </button>
        </div>
      </div>
    </header>
  );
}

