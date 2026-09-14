import Navbar from "./components/navbar";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f3f3f1]">
      <Navbar />

      <section className="px-3 pb-10 pt-8 sm:px-5 lg:px-8 lg:pb-16 lg:pt-10">
        <div className="mx-auto max-w-[1500px]">
          <div className="grid items-center gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="pt-4 lg:pt-8">
              <h1 className="max-w-[780px] text-[3rem] font-black leading-[0.86] tracking-[-0.085em] text-[#2a2a2a] sm:text-[4rem] lg:text-[5.6rem]">
                Discover the
                <span className="mt-1 block text-[#2f2f2f]">perfect event</span>
                <span className="relative mt-1 inline-block text-[#2f2f2f]">
                  for you
                  <span className="absolute -bottom-2 left-1 h-[10px] w-[105%] -rotate-[12deg] rounded-full bg-[#d7d5d2] opacity-95 blur-[1px]" />
                  <span className="absolute -bottom-[9px] left-0 h-[12px] w-[100%] rotate-[8deg] rounded-full border-b-[5px] border-b-[#d7d5d2] border-l-0 border-r-0 border-t-0" />
                </span>
              </h1>

              <p className="mt-7 max-w-[680px] text-base leading-7 text-[#5a5a5a] sm:text-lg">
                EVENTIS helps you relax from looking for events and lets you focus on
                enjoying your social life. You don&apos;t have to waste time looking for
                an event, no guesswork — just rest and relax.
              </p>

              <div className="mt-8 flex max-w-[790px] items-center overflow-hidden rounded-[22px] border border-[#d9d5d2] bg-[#f1efed] p-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]">
                <div className="flex min-w-0 flex-1 items-center gap-3 px-4 py-4 text-left text-[#3e3e3e]">
                  <span className="text-xl text-[#4b4b4b]">⌕</span>
                  <span className="truncate text-base sm:text-lg">Try “Sip and paint events”</span>
                </div>
                <button className="ml-2 rounded-[16px] bg-white px-5 py-4 text-sm font-bold uppercase tracking-[0.04em] text-[#1b1b1b] shadow-[0_8px_18px_rgba(17,17,17,0.08)] transition hover:opacity-95 sm:px-8">
                  Find your next event
                </button>
              </div>
            </div>

            <div className="relative flex items-center justify-center">
              <div className="relative h-[500px] w-[380px]">
                <div
                  className="float-phone absolute left-8 top-6 w-[250px] rounded-[32px] border border-[#e4e0dc] bg-[#eceae8] p-3 shadow-[0_24px_40px_rgba(17,17,17,0.08)]"
                >
                  <div className="rounded-[24px] bg-white p-3 shadow-[0_12px_24px_rgba(15,23,42,0.08)]">
                    <div className="mb-2 flex items-center justify-between text-[9px] text-[#707070]">
                      <span>9:41</span>
                      <div className="flex items-center gap-1">
                        <span className="h-2 w-2 rounded-full bg-[#7c7c7c]" />
                        <span className="h-2 w-4 rounded-full bg-[#7c7c7c]" />
                      </div>
                    </div>
                    <div className="mb-3 flex items-center justify-between text-[10px] text-[#6d6d6d]">
                      <span className="font-medium">Hi Jenn</span>
                      <span>⚙</span>
                    </div>
                    <div className="flex items-center rounded-full bg-[#f3f2f1] px-2.5 py-2 text-[9px] text-[#5b5b5b]">
                      <span className="mr-2">⌕</span>
                      <span>Search for events</span>
                    </div>
                    <div className="mt-3 text-[10px] font-medium text-[#555555]">Categories</div>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      <span className="rounded-full border border-[#e5e1dd] bg-[#f6f5f3] px-2 py-1 text-[8px] text-[#4d4d4d]">Concert</span>
                      <span className="rounded-full border border-[#e5e1dd] bg-[#f6f5f3] px-2 py-1 text-[8px] text-[#4d4d4d]">Sports</span>
                      <span className="rounded-full border border-[#e5e1dd] bg-[#f6f5f3] px-2 py-1 text-[8px] text-[#4d4d4d]">Tech</span>
                    </div>
                  </div>
                </div>

                <div
                  className="float-phone-alt absolute right-0 top-14 w-[280px] rounded-[32px] border border-[#e4e0dc] bg-[#f0efee] p-3 shadow-[0_30px_50px_rgba(17,17,17,0.12)]"
                >
                  <div className="rounded-[24px] bg-white p-4 shadow-[0_16px_30px_rgba(15,23,42,0.08)]">
                    <div className="mb-3 flex items-center justify-between text-[10px] text-[#6d6d6d]">
                      <span>9:41</span>
                      <div className="flex items-center gap-1">
                        <span className="h-2.5 w-2.5 rounded-full bg-[#7c7c7c]" />
                        <span className="h-2.5 w-5 rounded-full bg-[#7c7c7c]" />
                      </div>
                    </div>

                    <div className="rounded-[18px] bg-[#f7f7f6] p-2">
                      <div className="mb-2 flex items-center justify-between text-[9px] text-[#6a6a6a]">
                        <span>Categories</span>
                        <span>View all</span>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-2 rounded-[14px] bg-[#f1e9e0] p-2">
                          <div className="h-8 w-8 rounded-xl bg-[#ffb66a]" />
                          <div className="flex-1 min-w-0">
                            <div className="text-[9px] font-semibold text-[#4a4a4a]">Open mic night</div>
                            <div className="text-[8px] text-[#666]">Sat, Aug 10 • 2:00pm</div>
                          </div>
                          <div className="text-[9px] font-semibold text-[#4a4a4a]">$12</div>
                        </div>

                        <div className="flex items-center gap-2 rounded-[14px] bg-[#e8eef5] p-2">
                          <div className="h-8 w-8 rounded-xl bg-[#90caf9]" />
                          <div className="flex-1 min-w-0">
                            <div className="text-[9px] font-semibold text-[#4a4a4a]">Party Night</div>
                            <div className="text-[8px] text-[#666]">Sat, Aug 10 • 2:00pm</div>
                          </div>
                          <div className="text-[9px] font-semibold text-[#4a4a4a]">$10</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
