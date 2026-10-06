const faqs = [
  {
    question: "How do I find events near me?",
    answer:
      "Browse the latest Eventis picks or search for a specific experience, then explore events by category, date, and location.",
  },
  {
    question: "Can I use Eventis without an account?",
    answer:
      "Yes. You can discover events without signing in. Create an account when you are ready to save events, connect with friends, or manage your plans.",
  },
  {
    question: "How do I save an event for later?",
    answer:
      "Open an event you like and choose the save option. Your saved events make it easier to come back when you are ready to make plans.",
  },
  {
    question: "Can I share an event with my friends?",
    answer:
      "Absolutely. Share an event directly with the people you want to invite and start planning your next outing together.",
  },
  {
    question: "What kinds of events can I discover?",
    answer:
      "Eventis brings together concerts, festivals, fashion shows, meetups, social gatherings, and other memorable experiences happening around you.",
  },
];

export default function FaqSection() {
  return (
    <section id="faq" className="bg-[#f3f3f1] px-3 py-16 sm:px-5 lg:px-8 lg:py-24">
      <div className="mx-auto max-w-[1500px]">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-[#8a6b55]">FAQ</p>
            <h2 className="mt-4 max-w-[520px] text-4xl font-black leading-[0.95] tracking-[-0.07em] text-[#292929] sm:text-5xl lg:text-6xl">
              Your guide to going out.
            </h2>
          </div>

          <div className="border-t border-[#cfc8c2]">
            {faqs.map((faq, index) => (
              <details key={faq.question} className="group border-b border-[#cfc8c2]">
                <summary className="flex cursor-pointer list-none items-center gap-4 py-5 text-left marker:hidden [&::-webkit-details-marker]:hidden sm:py-6">
                  <span className="w-8 shrink-0 text-sm font-bold text-[#8a6b55]">Q{index + 1}</span>
                  <span className="flex-1 text-lg font-bold tracking-[-0.03em] text-[#292929] sm:text-xl">
                    {faq.question}
                  </span>
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#bdb5ae] text-xl font-light leading-none text-[#292929] transition group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="max-w-[680px] pb-6 pl-12 text-sm leading-6 text-[#65605c] sm:pl-12 sm:text-base">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}