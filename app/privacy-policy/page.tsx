export default function PrivacyPolicyPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="rounded-[28px] border border-[#e5e0dc] bg-[#f8f6f4] p-8 shadow-[0_12px_30px_rgba(17,17,17,0.04)] sm:p-10">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#5a5a5a]">
          Privacy Policy
        </p>
        <h1 className="mt-4 text-3xl font-black tracking-[-0.05em] text-[#1d1d1d] sm:text-5xl">
          Your privacy matters to us.
        </h1>

        <div className="mt-8 space-y-5 text-base leading-7 text-[#4f4f4f]">
          <p>
            EVENTIS is committed to protecting your personal information and using it only
            to enhance your event discovery experience.
          </p>
          <p>
            We collect contact information, event preferences, and usage details to provide
            tailored recommendations, secure account access, and improve the platform.
          </p>
          <p>
            We do not sell your personal information. We may share limited data with trusted
            service providers only to support our platform, analytics, and communication
            features.
          </p>
          <p>
            You can review, update, or request the deletion of your data at any time by
            contacting our support team.
          </p>
        </div>
      </div>
    </main>
  );
}
