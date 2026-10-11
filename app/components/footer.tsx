import Image from "next/image";
import Link from "next/link";

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/users/about" },
  { label: "Connect With Eventis", href: "/" },
  { label: "Contact Us", href: "/#contact" },
];

const legalLinks = [
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms & Conditions", href: "/terms" },
];

const socialLinks = [
  {
    label: "Instagram",
    href: "https://www.instagram.com",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-current">
        <path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7Zm5 3.5A4.5 4.5 0 1 1 7.5 12 4.5 4.5 0 0 1 12 7.5Zm0 2A2.5 2.5 0 1 0 14.5 12 2.5 2.5 0 0 0 12 9.5Zm5-3.1a1.1 1.1 0 1 1-1.1-1.1 1.1 1.1 0 0 1 1.1 1.1Z" />
      </svg>
    ),
  },
  {
    label: "X",
    href: "https://x.com",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-current">
        <path d="M18.9 2h3.7l-8.1 9.2L22.9 22h-7.3l-5.7-8.1L4.2 22H.5l8.7-9.9L1.1 2h7.5l5.1 7.3L18.9 2Zm-1.3 18.2h2L7.2 3.7H4.9l12.7 16.5Z" />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-current">
        <path d="M6.94 8.5A1.56 1.56 0 1 1 6.9 5.38a1.56 1.56 0 0 1 .04 3.12ZM5.5 10h2.84v9H5.5v-9Zm4.8 0h2.73v1.23h.04c.38-.72 1.31-1.48 2.69-1.48 2.88 0 3.41 1.89 3.41 4.35V19h-2.84v-17.7c0-1.06-.02-2.42-1.47-2.42-1.48 0-1.71 1.15-1.71 2.35V19h-2.85v-9Z" />
      </svg>
    ),
  },
  {
    label: "Facebook",
    href: "https://www.facebook.com",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-current">
        <path d="M13.5 22v-8h2.7l.4-3h-3.1V7.5c0-.9.2-1.5 1.6-1.5H16V3.1c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3V11H7v3h2.3v8h4.2Z" />
      </svg>
    ),
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-[#e8e3df] bg-[#f5f3f1] text-[#2d2d2d]">
      <div className="mx-auto max-w-[1500px] px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2 xl:grid-cols-[1.5fr_1fr_1fr_1.2fr]">
          <div>
            <Link href="/" className="inline-flex items-center gap-2 text-left">
              <Image src="/eventis-logo.svg" alt="" width={32} height={32} className="h-8 w-8 object-contain" />
              <span className="eventis-brand-wordmark text-[1.6rem] sm:text-[1.8rem]">
                EVENTIS
              </span>
            </Link>

            <p className="mt-5 max-w-sm text-sm leading-6 text-[#5b5b5b]">
              Discover standout events, memorable experiences, and unforgettable nights
              tailored to your lifestyle.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              {socialLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={link.label}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-[#dcd5d1] bg-white text-[#3f3f3f] transition hover:border-[#bcb5b0] hover:text-[#111111]"
                >
                  {link.icon}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-black uppercase tracking-[0.12em] text-[#1f1f1f]">
              Quick Links
            </h3>
            <ul className="mt-5 space-y-3">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="inline-flex rounded-full px-2 py-1 text-sm font-semibold text-[#4a4a4a] transition hover:bg-[#f1eeeb] hover:text-[#111111]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-black uppercase tracking-[0.12em] text-[#1f1f1f]">
              Contact Us
            </h3>
            <ul className="mt-5 space-y-3 text-sm text-[#555555]">
              <li>
                <a href="mailto:startupfounders8@gmail.com" className="transition hover:text-[#111111]">
                  startupfounders8@gmail.com
                </a>
              </li>
              <li>
                <a href="tel:+250796591452" className="transition hover:text-[#111111]">
                  +250 796 591 452
                </a>
              </li>
              <li>KG 98 Street, Kigali, Rwanda</li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-black uppercase tracking-[0.12em] text-[#1f1f1f]">
              Legal
            </h3>
            <ul className="mt-5 space-y-3">
              {legalLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="inline-flex rounded-full px-2 py-1 text-sm font-semibold text-[#4a4a4a] transition hover:bg-[#f1eeeb] hover:text-[#111111]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-[#e0d9d4] pt-5 text-sm text-[#5f5f5f]">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p>© {new Date().getFullYear()} EVENTIS. All rights reserved.</p>
            <div className="flex flex-wrap gap-2">
              <Link
                href="/privacy-policy"
                className="rounded-full px-3 py-1.5 text-sm font-semibold text-[#4a4a4a] transition hover:bg-[#f1eeeb] hover:text-[#111111]"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="rounded-full px-3 py-1.5 text-sm font-semibold text-[#4a4a4a] transition hover:bg-[#f1eeeb] hover:text-[#111111]"
              >
                Terms
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
