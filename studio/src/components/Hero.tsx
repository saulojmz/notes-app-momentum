import Link from "next/link";
import { audiences, site } from "@/content/site";
import { Arrow } from "./SectionLabel";
import { Reveal } from "./Reveal";

function CupGlyph() {
  return (
    <svg
      viewBox="0 0 120 100"
      aria-hidden="true"
      className="mx-[0.06em] inline-block h-[0.72em] w-[0.86em] -translate-y-[0.02em] align-baseline"
    >
      <g fill="none" stroke="var(--color-terracotta)" strokeWidth="5" strokeLinecap="round">
        <path className="steam" style={{ animationDelay: "0s" }} d="M44 28c-6-7 6-11 0-19" />
        <path className="steam" style={{ animationDelay: "1.1s" }} d="M60 28c-6-7 6-11 0-19" />
        <path className="steam" style={{ animationDelay: "2.2s" }} d="M76 28c-6-7 6-11 0-19" />
      </g>
      <path d="M22 40h76v14c0 21-17 38-38 38S22 75 22 54Z" fill="var(--color-ink)" />
      <path d="M98 48h4a11 11 0 0 1 0 22h-7" fill="none" stroke="var(--color-ink)" strokeWidth="7" />
      <ellipse cx="60" cy="40" rx="38" ry="6" fill="var(--color-butter)" />
    </svg>
  );
}

function Stamp() {
  const text = "small batch websites · made to order · baked fresh · ";
  return (
    <div className="relative size-36 lg:size-44" aria-hidden="true">
      <svg viewBox="0 0 200 200" className="spin-slow absolute inset-0 size-full text-ink">
        <defs>
          <path id="stamp-circle" d="M100 100m-78 0a78 78 0 1 1 156 0a78 78 0 1 1-156 0" />
        </defs>
        <text className="label" style={{ fontSize: 15 }} fill="currentColor">
          <textPath href="#stamp-circle" textLength="486" lengthAdjust="spacing">
            {text}
          </textPath>
        </text>
      </svg>
      <div className="absolute inset-[26%] grid place-items-center rounded-full bg-terracotta text-paper">
        <span className="display wonk text-3xl italic lg:text-4xl">P.</span>
      </div>
    </div>
  );
}

export function Hero() {
  return (
    <section aria-labelledby="hero-title" className="relative overflow-hidden pt-[calc(var(--nav-h)+2rem)] pb-8">
      <div className="frame relative">
        <div className="label flex flex-wrap items-center justify-between gap-x-6 gap-y-2 border-b border-ink/20 pb-4 text-cocoa">
          <span>Independent web design studio</span>
          <span className="hidden sm:inline">Coffee · Bread · Corners</span>
          <span>{site.location} — Est. 2026</span>
        </div>

        <h1
          id="hero-title"
          className="display relative mt-[clamp(2.5rem,7vw,6rem)] text-[clamp(3.6rem,12.4vw,13.5rem)]"
        >
          <span className="line-mask">
            <span style={{ "--delay": "80ms" } as React.CSSProperties}>Websites for</span>
          </span>
          <span className="line-mask">
            <span style={{ "--delay": "200ms" } as React.CSSProperties}>
              places that
              <CupGlyph />
            </span>
          </span>
          <span className="line-mask md:pl-[18%]">
            <span style={{ "--delay": "320ms" } as React.CSSProperties}>
              open <em className="wonk font-[340] text-terracotta">early.</em>
            </span>
          </span>
        </h1>

        <div className="absolute right-[var(--gutter)] top-[clamp(7rem,13vw,11rem)] hidden md:block">
          <Stamp />
        </div>

        <div className="mt-[clamp(3rem,7vw,6rem)] grid gap-10 pb-[clamp(4rem,9vw,8rem)] md:grid-cols-12">
          <Reveal className="md:col-span-4 lg:col-span-3" delay={500}>
            <p className="label mb-4 text-cocoa">Made for</p>
            <ul className="columns-2 gap-6 text-[0.95rem] leading-relaxed md:columns-1">
              {audiences.map((a) => (
                <li key={a} className="break-inside-avoid border-b border-ink/15 py-1.5">
                  {a}
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal className="md:col-span-7 md:col-start-6 lg:col-span-6 lg:col-start-7" delay={650}>
            <p className="display display-sm text-[clamp(1.75rem,3.2vw,2.75rem)] italic leading-[1.05] text-cocoa">
              …and the ones worth staying out late for.
            </p>
            <p className="mt-6 max-w-[36rem] text-lg leading-relaxed md:text-xl">
              Proof is a small, independent studio designing and building websites for coffee shops, roasters, bakeries,
              cafés and neighborhood restaurants. Sites that feel like walking through your door, and work as hard as
              your morning crew.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-x-8 gap-y-5">
              <Link
                href="/#contact"
                className="group label inline-flex items-center gap-3 bg-ink px-6 py-4 text-paper transition-colors hover:bg-terracotta"
              >
                Start a project
                <Arrow className="transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
              <Link href="/#work" className="group label inline-flex items-center gap-2">
                <span className="draw-link">See the work</span>
                <Arrow className="rotate-90 transition-transform duration-300 group-hover:translate-y-0.5" />
              </Link>
            </div>
          </Reveal>
        </div>
      </div>

      <Ticker />
    </section>
  );
}

function Ticker() {
  const items = ["Good websites for good places", "Menus people can read", "Hours that are right", "Orders that just work", "Made in small batches"];
  const row = (hidden: boolean) => (
    <ul className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
      {items.map((t) => (
        <li key={t} className="flex items-center whitespace-nowrap">
          <span className="display px-6 text-[clamp(1.5rem,3vw,2.5rem)] italic">{t}</span>
          <svg viewBox="0 0 20 20" aria-hidden="true" className="size-5 text-terracotta">
            <path d="M10 0l2.4 7.6L20 10l-7.6 2.4L10 20l-2.4-7.6L0 10l7.6-2.4Z" fill="currentColor" />
          </svg>
        </li>
      ))}
    </ul>
  );
  return (
    <div className="marquee relative -mx-4 -rotate-[1.2deg] overflow-hidden border-y border-ink bg-butter py-4">
      <div className="marquee-track flex w-max">
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
}
