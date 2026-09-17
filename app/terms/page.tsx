export default function TermsPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="rounded-[28px] border border-[#e5e0dc] bg-[#f8f6f4] p-8 shadow-[0_12px_30px_rgba(17,17,17,0.04)] sm:p-10">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#5a5a5a]">
          Terms & Conditions
        </p>
        <h1 className="mt-4 text-3xl font-black tracking-[-0.05em] text-[#1d1d1d] sm:text-5xl">
          Terms of use.
        </h1>

        <div className="mt-8 space-y-5 text-base leading-7 text-[#4f4f4f]">
          <p>
            By using EVENTIS, you agree to use the platform responsibly and in compliance
            with all applicable laws.
          </p>
          <p>
            Content provided through EVENTIS is for informational and discovery purposes. We
            do not guarantee that every listing or event detail is error-free or current.
          </p>
          <p>
            Users are responsible for verifying event information and participating in events
            in accordance with venue policies and local regulations.
          </p>
          <p>
            EVENTIS may update these terms from time to time, and continued use of the site
            indicates acceptance of any changes.
          </p>
        </div>
      </div>
    </main>
  );
}
