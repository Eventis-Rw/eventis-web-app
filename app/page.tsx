import Footer from "./components/footer";
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
                an event, no guesswork just rest and relax.
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
              <div className="relative h-[620px] w-[430px]">
                <div className="absolute left-8 top-8 h-[470px] w-[220px] -rotate-6 rounded-[32px] border-[6px] border-[#171717] bg-white p-2 shadow-[0_35px_65px_rgba(17,17,17,0.22)]">
                  <div className="h-full overflow-hidden rounded-[22px] bg-[linear-gradient(180deg,#f9f6f3_0%,#f1efe9_100%)] p-3">
                    <div className="mb-2 flex items-center justify-between text-[8px] font-semibold text-[#4a4a4a]">
                      <span>9:41</span>
                      <div className="flex items-center gap-1">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#4a4a4a]" />
                        <span className="h-1.5 w-4 rounded-full bg-[#4a4a4a]" />
                      </div>
                    </div>

                    <div className="rounded-[16px] bg-white p-2 shadow-sm">
                      <div className="text-[8px] font-medium uppercase tracking-[0.12em] text-[#777]">
                        Eventis
                      </div>
                      <div className="mt-1 text-[24px] font-black leading-none tracking-[-0.07em] text-[#1a1a1a]">
                        9:41
                      </div>
                    </div>

                    <div className="mt-3 rounded-[18px] bg-[linear-gradient(180deg,#dfe6f2_0%,#f5f7fb_100%)] p-2">
                      <div className="mb-2 flex items-center justify-between text-[7px] text-[#4d5664]">
                        <span>Tonight</span>
                        <span>Live</span>
                      </div>
                      <div className="rounded-[14px] bg-[linear-gradient(135deg,#ffd7b2,#b4d6ff)] p-2">
                        <div className="text-[9px] font-bold text-[#1d2330]">Sunset Social</div>
                        <div className="mt-1 text-[7px] text-[#334155]">Rooftop lounge • 8:00 PM</div>
                      </div>
                    </div>

                    <div className="mt-3 space-y-2">
                      <div className="flex items-center justify-between rounded-[12px] bg-white p-2 shadow-sm">
                        <div>
                          <div className="text-[7px] text-[#666]">Connection</div>
                          <div className="text-[9px] font-bold text-[#1a1a1a]">Maya invited you</div>
                        </div>
                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#161616] text-[8px] font-bold text-white">
                          E
                        </div>
                      </div>

                      <div className="flex items-center justify-between rounded-[12px] bg-white p-2 shadow-sm">
                        <div>
                          <div className="text-[7px] text-[#666]">Messages</div>
                          <div className="text-[9px] font-bold text-[#1a1a1a]">3 new replies</div>
                        </div>
                        <div className="rounded-full bg-[#eef2ff] px-2 py-1 text-[7px] font-bold text-[#374151]">
                          3
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="absolute right-10 top-12 h-[520px] w-[240px] rotate-[8deg] rounded-[34px] border-[6px] border-[#171717] bg-white p-2 shadow-[0_40px_80px_rgba(17,17,17,0.2)]">
                  <div className="h-full overflow-hidden rounded-[24px] bg-[linear-gradient(180deg,#fcfbf9_0%,#f2f0ec_100%)] p-3">
                    <div className="mb-3 flex items-center justify-between text-[8px] font-semibold text-[#4a4a4a]">
                      <span>9:41</span>
                      <div className="flex items-center gap-1">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#4a4a4a]" />
                        <span className="h-1.5 w-4 rounded-full bg-[#4a4a4a]" />
                      </div>
                    </div>

                    <div className="rounded-[18px] bg-white p-3 shadow-sm">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-[8px] uppercase tracking-[0.12em] text-[#7a7a7a]">
                            Eventis
                          </div>
                          <div className="mt-1 text-[12px] font-black text-[#1a1a1a]">Your events</div>
                        </div>
                        <div className="rounded-full bg-[#f2f2f2] px-2 py-1 text-[7px] font-bold text-[#3d3d3d]">
                          12
                        </div>
                      </div>

                      <div className="mt-3 space-y-2">
                        <div className="rounded-[12px] bg-[#f8efe6] p-2">
                          <div className="text-[8px] font-medium text-[#8a5b2a]">Live</div>
                          <div className="mt-1 text-[10px] font-bold text-[#1a1a1a]">Wine & Paint Night</div>
                          <div className="text-[7px] text-[#5f5f5f]">Fri • 7:30 PM</div>
                        </div>

                        <div className="rounded-[12px] bg-[#edf3ff] p-2">
                          <div className="text-[8px] font-medium text-[#2d5aa6]">Invited</div>
                          <div className="mt-1 text-[10px] font-bold text-[#1a1a1a]">Community Meetup</div>
                          <div className="text-[7px] text-[#5f5f5f]">Sat • 6:00 PM</div>
                        </div>

                        <div className="rounded-[12px] bg-[#ecf8f1] p-2">
                          <div className="text-[8px] font-medium text-[#2f7a4d]">Saved</div>
                          <div className="mt-1 text-[10px] font-bold text-[#1a1a1a]">Jazz Festival</div>
                          <div className="text-[7px] text-[#5f5f5f]">Sun • 9:00 PM</div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 rounded-[14px] bg-[#1a1a1a] p-2 text-white shadow-sm">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-[7px] uppercase tracking-[0.12em] text-[#d5d5d5]">
                            Messages
                          </div>
                          <div className="text-[9px] font-bold">The group chat is ready</div>
                        </div>
                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-[8px] font-black text-[#1a1a1a]">
                          E
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

      <Footer />
    </main>
  );
}
