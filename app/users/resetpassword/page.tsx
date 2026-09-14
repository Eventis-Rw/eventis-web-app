const categoryItems = [
  "Concert",
  "Sports",
  "Art and Theatre",
  "Family",
  "Parties",
  "Tech",
];

export default function ResetPasswordPage() {
  return (
    <main className="min-h-screen bg-[#c7c0f4] px-3 py-4 sm:px-5 lg:px-8">
      <div className="mx-auto max-w-[1500px] overflow-hidden rounded-[28px] border border-[#16171a] bg-[#101113] shadow-[0_0_0_1px_rgba(255,255,255,0.02)]">
        <section className="px-5 pb-10 pt-8 sm:px-8 lg:px-12 lg:pb-16 lg:pt-10">
          <div className="grid items-center gap-7 lg:grid-cols-[1.08fr_0.92fr]">
            <div className="pt-4 lg:pt-8">
              <h1 className="max-w-[720px] text-[3.2rem] font-black leading-[0.86] tracking-[-0.08em] text-white sm:text-[4.2rem] lg:text-[6.3rem]">
                Discover the
                <span className="mt-2 block">perfect event</span>
                <span className="relative mt-2 inline-block">
                  for you
                  <span className="absolute -bottom-2 left-1 h-[10px] w-[105%] -rotate-[12deg] rounded-full bg-[#d88cff] opacity-95 blur-[1px]" />
                  <span className="absolute -bottom-[9px] left-0 h-[12px] w-[100%] rotate-[8deg] rounded-full border-b-[5px] border-b-[#d88cff] border-l-0 border-r-0 border-t-0" />
                </span>
              </h1>

              <p className="mt-8 max-w-[720px] text-lg leading-8 text-slate-200/80 sm:text-xl">
                Penta helps you relax from looking for events and lets you focus on
                enjoying your social life. You don&apos;t have to waste time looking for
                an event, no guesswork — just rest and relax.
              </p>

              <div className="mt-8 flex max-w-[780px] items-center overflow-hidden rounded-[22px] border border-white/10 bg-white/5 p-2 backdrop-blur-sm shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
                <div className="flex min-w-0 flex-1 items-center gap-3 px-4 py-4 text-left text-slate-200/80">
                  <span className="text-xl text-white/80">⌕</span>
                  <span className="truncate text-base sm:text-lg">Try “Sip and paint events”</span>
                </div>
                <button className="ml-2 rounded-[16px] bg-[#f4f5f7] px-5 py-4 text-sm font-bold uppercase tracking-[0.04em] text-[#121417] transition-opacity hover:opacity-95 sm:px-8">
                  Find your next event
                </button>
              </div>
            </div>

            <div className="relative flex min-h-[540px] items-end justify-center pt-6 lg:justify-end">
              <div className="relative flex items-end justify-center gap-5">
                <div className="relative z-20 w-[300px] rounded-[32px] border border-[#dfe1e6] bg-[#f8f8f8] p-3 shadow-[0_28px_60px_rgba(0,0,0,0.45)]">
                  <div className="rounded-[26px] bg-[#eff1f4] p-3">
                    <div className="mb-3 flex items-center justify-between px-1 text-[10px] text-slate-500">
                      <span>9:41</span>
                      <div className="flex items-center gap-1">
                        <span className="h-2.5 w-2.5 rounded-full bg-slate-500/80" />
                        <span className="h-2.5 w-5 rounded-full bg-slate-500/80" />
                      </div>
                    </div>

                    <div className="rounded-[18px] bg-white p-3 shadow-[0_10px_25px_rgba(15,23,42,0.08)]">
                      <div className="flex items-center justify-between pb-2 text-[11px] text-slate-500">
                        <span className="font-medium">Hi Jenn</span>
                        <span>⚙</span>
                      </div>
                      <div className="flex items-center rounded-full bg-slate-100 px-3 py-2 text-[10px] text-slate-500">
                        <span className="mr-2">⌕</span>
                        <span>Search for events</span>
                      </div>

                      <div className="mt-3 text-[11px] font-medium text-slate-600">Categories</div>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {categoryItems.map((item) => (
                          <span
                            key={item}
                            className="rounded-full border border-slate-200 bg-slate-50 px-2 py-1 text-[9px] text-slate-600"
                          >
                            {item}
                          </span>
                        ))}
                      </div>

                      <div className="mt-4 space-y-2">
                        <div className="flex items-center gap-2 rounded-[14px] bg-[#f9d0b7] p-2 shadow-sm">
                          <div className="h-10 w-10 rounded-xl bg-[#ffb66a]" />
                          <div className="flex-1 min-w-0">
                            <div className="text-[10px] font-semibold text-slate-700">Open mic night</div>
                            <div className="text-[9px] text-slate-600">Sat, Aug 10 • 2:00pm</div>
                          </div>
                          <div className="text-[10px] font-semibold text-slate-700">$12</div>
                        </div>

                        <div className="flex items-center gap-2 rounded-[14px] bg-[#dcefff] p-2 shadow-sm">
                          <div className="h-10 w-10 rounded-xl bg-[#90caf9]" />
                          <div className="flex-1 min-w-0">
                            <div className="text-[10px] font-semibold text-slate-700">Party Night</div>
                            <div className="text-[9px] text-slate-600">Sat, Aug 10 • 2:00pm</div>
                          </div>
                          <div className="text-[10px] font-semibold text-slate-700">$10</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="relative z-10 -mb-8 w-[260px] translate-x-4 rounded-[32px] border border-[#e5e7eb] bg-[#f5f5f5] p-3 shadow-[0_26px_45px_rgba(0,0,0,0.35)]">
                  <div className="rounded-[26px] bg-[#f1f3f5] p-3">
                    <div className="mb-3 flex items-center justify-between px-1 text-[10px] text-slate-500">
                      <span>9:41</span>
                      <div className="flex items-center gap-1">
                        <span className="h-2.5 w-2.5 rounded-full bg-slate-500/80" />
                        <span className="h-2.5 w-5 rounded-full bg-slate-500/80" />
                      </div>
                    </div>
                    <div className="rounded-[18px] bg-white p-3">
                      <div className="mb-3 flex items-center justify-between text-[10px] text-slate-500">
                        <span>Close to you</span>
                        <span>View all</span>
                      </div>
                      <div className="space-y-2">
                        <div className="h-14 rounded-xl bg-[#f4f4f5]" />
                        <div className="h-14 rounded-xl bg-[#f4f4f5]" />
                        <div className="h-14 rounded-xl bg-[#f4f4f5]" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="relative z-0 -mb-12 mr-1 h-[430px] w-[150px] rounded-[28px] bg-[#f7f7f7] p-2 shadow-[0_24px_48px_rgba(0,0,0,0.32)]">
                  <div className="h-full rounded-[24px] bg-white p-3">
                    <div className="mb-3 flex items-center justify-between text-[8px] text-slate-500">
                      <span>9:41</span>
                      <span>◉</span>
                    </div>
                    <div className="space-y-2">
                      <div className="h-10 rounded-xl bg-[#f1f5f9]" />
                      <div className="h-20 rounded-xl bg-[#f8fafc]" />
                      <div className="h-10 rounded-xl bg-[#f1f5f9]" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
