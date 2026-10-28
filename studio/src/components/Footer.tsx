import Link from "next/link";
import { site } from "@/content/site";

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-ink text-paper">
      <div className="frame">
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 border-t border-paper/20 pt-12 lg:grid-cols-4">
          <div>
            <p className="label text-paper/60">Studio</p>
            <ul className="mt-4 space-y-1.5">
              {site.nav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="draw-link">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="label text-paper/60">Say hello</p>
            <a href={`mailto:${site.email}`} className="draw-link mt-4 inline-block">
              {site.email}
            </a>
            <p className="mt-1.5 text-paper/70">{site.location}</p>
          </div>
          <div>
            <p className="label text-paper/60">Elsewhere</p>
            <ul className="mt-4 space-y-1.5">
              {site.socials.map((s) => (
                <li key={s.label}>
                  <a href={s.href} className="draw-link" target="_blank" rel="noopener noreferrer">
                    {s.label}
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="label text-paper/60">Studio hours</p>
            <dl className="mt-4 grid grid-cols-[auto_1fr] gap-x-5 gap-y-1.5 tabular-nums">
              <dt>Mon–Fri</dt>
              <dd>8 – 5</dd>
              <dt>Sat</dt>
              <dd>Out visiting bakeries</dd>
              <dt>Sun</dt>
              <dd>Closed</dd>
            </dl>
          </div>
        </div>

        <div className="label mt-16 flex flex-wrap items-center justify-between gap-4 text-paper/60">
          <p>© {new Date().getFullYear()} {site.name}. Made in {site.location.split(",")[0]}, best enjoyed fresh.</p>
          <a href="#main" className="draw-link">
            Back to the top ↑
          </a>
        </div>
      </div>

      {/* Oversized wordmark, cropped at the baseline like a loaf rising out of the page. */}
      <div
        aria-hidden="true"
        className="pointer-events-none mt-2 h-[0.68em] select-none overflow-hidden text-[clamp(8rem,41vw,40rem)] leading-[0.9]"
      >
        {/* Letters come from CSS content so this purely decorative mark stays out of the text layer. */}
        <span className="display wonk flex -translate-x-[0.03em] items-baseline whitespace-nowrap italic text-paper/[0.08] before:content-['proof']">
          <svg viewBox="0 0 20 12" className="ml-[0.06em] h-[0.32em] w-[0.53em] text-terracotta">
            <path d="M1 11.5C1 5.7 5.2 1 10 1s9 4.7 9 10.5Z" fill="currentColor" />
          </svg>
        </span>
      </div>
    </footer>
  );
}
