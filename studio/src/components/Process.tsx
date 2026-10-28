import { Reveal } from "./Reveal";
import { SectionLabel } from "./SectionLabel";

const steps = [
  {
    name: "Discover",
    when: "Week 1",
    body: "We start with a conversation, ideally over coffee. I learn how your business runs, who comes through the door and what your current site gets wrong.",
    leave: "A short plan with scope, timeline and a clear price.",
  },
  {
    name: "Design",
    when: "Weeks 2–4",
    body: "I design the key pages for phone and desktop, then we review them together. Real layouts with your real menu, never lorem ipsum.",
    leave: "Clickable designs you can try on your own phone.",
  },
  {
    name: "Build",
    when: "Weeks 4–6",
    body: "I build the site, connect ordering or booking tools, and test it on real phones, slow connections and screen readers.",
    leave: "A private preview link to poke around.",
  },
  {
    name: "Launch",
    when: "Week 6 & on",
    body: "We go live, I show you how to update everything yourself, and I stick around for a month of small tweaks.",
    leave: "A site you own, and someone to call.",
  },
];

export function Process() {
  return (
    <section aria-labelledby="process-title" className="grain relative overflow-hidden bg-terracotta py-[clamp(5rem,12vw,10rem)] text-crema">
      <div className="frame relative">
        <div className="grid gap-8 md:grid-cols-12 md:items-end">
          <div className="md:col-span-8">
            <SectionLabel index="04">Process</SectionLabel>
            <h2 id="process-title" className="display mt-6 text-[clamp(3rem,8vw,7.5rem)]">
              First coffee to <br className="hidden md:block" />
              <em className="wonk text-butter">opening day.</em>
            </h2>
          </div>
          <Reveal className="md:col-span-4">
            <p className="text-[1.05rem] leading-relaxed">
              Most websites take about six weeks. You’ll always know what’s happening, what I need from you, and what comes
              next.
            </p>
          </Reveal>
        </div>

        <div className="relative mt-[clamp(3.5rem,8vw,6.5rem)]">
          <div aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-crema/30" />
          <div aria-hidden="true" className="proof-line absolute inset-x-0 top-0 h-[3px] -translate-y-px bg-butter" />
          <ol className="grid gap-x-[var(--gutter)] sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((s, i) => (
              <Reveal as="li" key={s.name} delay={i * 110} className="relative border-crema/30 pb-12 pt-8 max-lg:border-b sm:pr-4">
                <span aria-hidden="true" className="absolute -top-[7px] left-0 size-3.5 rounded-full border-2 border-butter bg-terracotta" />
                <div className="flex items-baseline justify-between">
                  <span className="display text-[clamp(4.5rem,8vw,7rem)] leading-none text-butter">{i + 1}</span>
                  <span className="label">{s.when}</span>
                </div>
                <h3 className="display mt-6 text-[2.4rem]">{s.name}</h3>
                <p className="mt-3 leading-relaxed">{s.body}</p>
                <p className="mt-5 border-t border-dashed border-crema/40 pt-4 text-[0.95rem]">
                  <span className="label mb-1 block">You leave with</span>
                  {s.leave}
                </p>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
