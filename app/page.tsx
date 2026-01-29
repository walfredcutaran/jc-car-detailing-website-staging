import Image from "next/image";
import BookingForm from "./components/booking-form";
import MouseSpotlight from "./components/MouseSpotlight";
// import FoamBubbles from "./components/FoamBubbles";
import FoamBubblesInteractive from "./components/FoamBubblesInteractive";

export default function BookingPage() {
  return (

    <main className="relative min-h-screen overflow-hidden bg-gray-950 text-white">
      {/* Ambient background */}
      <FoamBubblesInteractive count={24} popDistance={30} />
      <div className="relative z-10">{/* your content */}</div>
      <MouseSpotlight />
      <div className="pointer-events-none absolute inset-0">
        {/* grid */}
        <div className="absolute inset-0 opacity-[0.06] [background-image:linear-gradient(to_right,white_1px,transparent_1px),linear-gradient(to_bottom,white_1px,transparent_1px)] [background-size:48px_48px]" />
        {/* blobs */}
        <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-indigo-500/20 blur-3xl animate-pulse" />
        <div className="absolute top-40 -right-24 h-[28rem] w-[28rem] rounded-full bg-fuchsia-500/15 blur-3xl animate-[pulse_4s_ease-in-out_infinite]" />
        <div className="absolute bottom-[-120px] left-1/3 h-[30rem] w-[30rem] rounded-full bg-cyan-500/10 blur-3xl animate-[pulse_6s_ease-in-out_infinite]" />
        {/* Wet clearcoat sheen */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-40 top-10 h-[520px] w-[900px] -rotate-12 rounded-[999px] bg-[radial-gradient(closest-side,rgba(255,255,255,0.20),transparent_70%)] blur-2xl" />
          <div className="absolute right-[-260px] top-32 h-[520px] w-[900px] rotate-[10deg] rounded-[999px] bg-[radial-gradient(closest-side,rgba(99,102,241,0.18),transparent_72%)] blur-2xl" />
        </div>


        {/* vignette */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/40 to-black/70" />
      </div>

      {/* Paint swirl hologram */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.18]">
        <div className="absolute left-[20%] top-[15%] h-[480px] w-[480px] rounded-full bg-[conic-gradient(from_0deg,rgba(255,255,255,0.15),transparent_25%,rgba(99,102,241,0.12),transparent_55%,rgba(236,72,153,0.12),transparent_80%)] blur-2xl animate-[spin_40s_linear_infinite]" />
        <div className="absolute right-[15%] bottom-[10%] h-[520px] w-[520px] rounded-full bg-[conic-gradient(from_180deg,rgba(255,255,255,0.12),transparent_30%,rgba(34,211,238,0.10),transparent_60%,rgba(99,102,241,0.10),transparent_85%)] blur-2xl animate-[spin_55s_linear_infinite]" />
      </div>


      {/* Water beading (ceramic coating effect) */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.18]">
        {/* cluster 1 */}
        <div className="absolute left-[6%] top-[12%] grid grid-cols-8 gap-6">
          {Array.from({ length: 24 }).map((_, i) => (
            <span
              key={`wb1-${i}`}
              className="h-2 w-2 rounded-full bg-white/70 blur-[0.3px] animate-[pulse_4s_ease-in-out_infinite]"
              style={{ animationDelay: `${i * 0.2}s` }}
            />
          ))}
        </div>

        {/* Micro polish streaks */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.12]">
          <div className="absolute left-[10%] top-[35%] h-[1px] w-[380px] rotate-12 bg-gradient-to-r from-transparent via-white/70 to-transparent blur-[0.5px]" />
          <div className="absolute left-[18%] top-[38%] h-[1px] w-[420px] rotate-6 bg-gradient-to-r from-transparent via-white/50 to-transparent blur-[0.5px]" />
          <div className="absolute right-[12%] top-[28%] h-[1px] w-[360px] -rotate-8 bg-gradient-to-r from-transparent via-white/60 to-transparent blur-[0.5px]" />
          <div className="absolute right-[20%] top-[32%] h-[1px] w-[420px] -rotate-4 bg-gradient-to-r from-transparent via-white/50 to-transparent blur-[0.5px]" />
        </div>
        {/* Ceramic coating rainbow film */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.22]">
          <div className="absolute left-[30%] top-[8%] h-[420px] w-[720px] rounded-[999px] bg-[linear-gradient(115deg,rgba(99,102,241,0.18),rgba(236,72,153,0.14),rgba(34,211,238,0.14),transparent)] blur-3xl animate-[pulse_6s_ease-in-out_infinite]" />
        </div>

        {/* Shop light reflections */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.12]">
          <div className="absolute left-[12%] top-[8%] h-[6px] w-[320px] rounded-full bg-white/60 blur-md" />
          <div className="absolute left-[18%] top-[14%] h-[6px] w-[260px] rounded-full bg-white/50 blur-md" />
          <div className="absolute right-[14%] top-[10%] h-[6px] w-[300px] rounded-full bg-white/50 blur-md" />
        </div>

        {/* cluster 2 */}
        <div className="absolute right-[10%] top-[18%] grid grid-cols-10 gap-7">
          {Array.from({ length: 40 }).map((_, i) => (
            <span
              key={`wb2-${i}`}
              className="h-1.5 w-1.5 rounded-full bg-white/60 blur-[0.3px] animate-[pulse_5s_ease-in-out_infinite]"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
        {/* Dust sparkle */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.15]">
          {Array.from({ length: 60 }).map((_, i) => (
            <span
              key={`dust-${i}`}
              className="absolute h-[2px] w-[2px] rounded-full bg-white/60 blur-[0.4px]"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
            />
          ))}
        </div>

        {/* cluster 3 */}
        <div className="absolute left-[18%] bottom-[14%] grid grid-cols-12 gap-8">
          {Array.from({ length: 36 }).map((_, i) => (
            <span
              key={`wb3-${i}`}
              className="h-1 w-1 rounded-full bg-white/50 blur-[0.4px] animate-[pulse_6s_ease-in-out_infinite]"
              style={{ animationDelay: `${i * 0.18}s` }}
            />
          ))}
        </div>

        {/* random beads */}
        <span className="absolute left-[42%] top-[22%] h-2 w-2 rounded-full bg-white/60 blur-[0.5px] animate-pulse" />
        <span className="absolute left-[48%] top-[28%] h-1.5 w-1.5 rounded-full bg-white/50 blur-[0.5px] animate-[pulse_3.5s_ease-in-out_infinite]" />
        <span className="absolute right-[38%] top-[24%] h-2 w-2 rounded-full bg-white/60 blur-[0.5px] animate-[pulse_4.5s_ease-in-out_infinite]" />
        <span className="absolute right-[32%] top-[30%] h-1.5 w-1.5 rounded-full bg-white/50 blur-[0.5px] animate-pulse" />
      </div>


      <div className="relative mx-auto grid max-w-6xl grid-cols-1 gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8">
        {/* Left panel */}
        <section className="flex flex-col justify-center">
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-gray-200">
            <span className="h-1.5 w-1.5 rounded-full bg-green-400" />
            Fast booking • Confirmation within 1–2 hours
          </div>

          <h1 className="mt-4 text-4xl font-semibold tracking-tight">
            Book your detail in{" "}
            <span className="bg-gradient-to-r from-indigo-300 via-white to-fuchsia-300 bg-clip-text text-transparent">
              under a minute
            </span>
          </h1>

          <p className="mt-3 text-sm leading-6 text-gray-300">
            Choose your service, pick a time, and we’ll confirm by text/email.
            Clean, simple, and professional.
          </p>

          {/* Feature cards */}
          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <InfoCard title="Mobile Service" desc="We come to you (home/office)." />
            <InfoCard title="Pro Products" desc="Paint-safe & interior-safe." />
            <InfoCard title="Transparent Pricing" desc="No surprise add-ons." />
            <InfoCard title="Satisfaction Check" desc="Final walkthrough before we leave." />
          </div>

          {/* Steps */}
          <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-sm font-semibold">How it works</p>
            <ol className="mt-3 space-y-2 text-sm text-gray-300">
              <li className="flex gap-3">
                <span className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-white/10 text-xs">
                  1
                </span>
                Fill in your details & preferred schedule.
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-white/10 text-xs">
                  2
                </span>
                We confirm availability and send final price.
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-white/10 text-xs">
                  3
                </span>
                We arrive + detail + final walkthrough.
              </li>
            </ol>
          </div>

          {/* Micro testimonials */}
          <div className="mt-6 flex flex-col gap-3 text-sm text-gray-300">
            <Quote text="Paint looked brand new. Super clean work." author="— Kevin T." />
            <Quote text="On-time, professional, and the interior was spotless." author="— Maria L." />
          </div>
        </section>

        {/* Right panel: form */}
        <div className="relative">
          {/* glow border */}
          <div className="absolute -inset-2 rounded-3xl bg-gradient-to-r from-indigo-500/20 via-fuchsia-500/10 to-cyan-500/20 blur-xl" />
          <div className="relative">
            <BookingForm />
          </div>
        </div>
      </div>
    </main>
  );
}

function InfoCard({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4 hover:bg-white/10 transition">
      <p className="text-sm font-semibold">{title}</p>
      <p className="mt-1 text-sm text-gray-300">{desc}</p>
    </div>
  );
}

function Quote({ text, author }: { text: string; author: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <p className="italic">“{text}”</p>
      <p className="mt-2 text-xs text-gray-400">{author}</p>
    </div>
  );
}

