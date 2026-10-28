import { site } from "@/content/site";
import { Reveal } from "./Reveal";
import { SectionLabel } from "./SectionLabel";

const principles = [
  ["Craft, down to the comma", "Spacing, type, the alt text on your croissant photo. Small things add up to a place that feels cared for."],
  ["Usability before ornament", "If someone can’t find your hours in three seconds, it doesn’t matter how pretty the page is."],
  ["Made with you", "You know your regulars. I know websites. We’ll figure out the rest across the counter."],
  ["Independent, like you", "No account managers and no handoffs. You talk to the person doing the work, every time."],
  ["Constraints welcome", "Selling out by ten, two menus, two languages: real-world quirks make the best ideas."],
  ["Personality on purpose", "Your place isn’t generic. Your website has no business being generic either."],
];

/**
 * Founder portrait. Pass `src` once a real photo exists; until then an
 * art-directed placeholder holds the space at the right proportions.
 */
function Portrait({ src }: { src?: string }) {
  return (
    <figure className="relative">
      <div className="relative aspect-[4/5] overflow-hidden rounded-t-[999px] bg-pistachio">
        {src ? (
          // eslint-disable-next-line @next/next/no-img-element -- swap for next/image once a final asset exists
          <img src={src} alt={`Portrait of ${site.founder}`} className="size-full object-cover" />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-end" aria-hidden="true">
            <svg viewBox="0 0 300 300" className="w-[78%] text-ink">
              <circle cx="150" cy="104" r="52" fill="currentColor" />
              <path d="M40 300c0-70 50-118 110-118s110 48 110 118Z" fill="currentColor" />
              <g transform="translate(196 214)">
                <path d="M0 6h44v24a22 22 0 0 1-44 0Z" fill="var(--color-paper)" />
                <path d="M44 12h6a8 8 0 0 1 0 16h-6" stroke="var(--color-paper)" strokeWidth="5" fill="none" />
                <ellipse cx="22" cy="6" rx="22" ry="4" fill="var(--color-butter)" />
              </g>
            </svg>
          </div>
        )}
      </div>
      <span className="label absolute -right-3 top-10 rotate-[6deg] bg-butter px-3 py-2 shadow-[3px_3px_0_var(--color-ink)]">
        Se habla español
      </span>
      <figcaption className="label mt-4 flex justify-between gap-4 text-cocoa">
        <span>{site.founder}, founder</span>
        <span>{src ? site.location : "Photo coming soon"}</span>
      </figcaption>
    </figure>
  );
}

export function About() {
  return (
    <section id="about" aria-labelledby="about-title" className="frame py-[clamp(5rem,12vw,10rem)]">
      <SectionLabel index="03">About</SectionLabel>

      <div className="mt-10 grid gap-x-[var(--gutter)] gap-y-14 md:grid-cols-12">
        <Reveal className="md:col-span-5 lg:col-span-4">
          <Portrait />
        </Reveal>

        <div className="md:col-span-7 lg:col-span-7 lg:col-start-6">
          <h2 id="about-title" className="display text-[clamp(2.6rem,5.6vw,5.25rem)] leading-[0.95]">
            Your corner spot deserves the care of a <em className="wonk text-terracotta">flagship.</em>
          </h2>
          <Reveal className="mt-10 grid gap-6 text-[1.08rem] leading-relaxed sm:grid-cols-2">
            <p>
              Hi, I’m Saulo. I’m a product designer in Austin, and Proof is my one-person studio. My background is in
              designing digital products people use every day, and the biggest lesson has been that good design is mostly
              paying attention.
            </p>
            <p>
              I started Proof because the places I love most (the café that knows my order, the bakery that sells out by
              ten) usually have the weakest websites on the block. Not because they don’t care, but because good design
              has felt out of reach for small teams. I’d like to change that.
            </p>
          </Reveal>
        </div>
      </div>

      <div className="mt-[clamp(4rem,9vw,8rem)] border-t border-ink pt-6">
        <p className="label text-cocoa">How I like to work</p>
        <ol className="mt-8 grid gap-x-[var(--gutter)] gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {principles.map(([title, body], i) => (
            <Reveal as="li" key={title} delay={(i % 3) * 90} className="grid grid-cols-[3rem_1fr] gap-2">
              <span className="display text-3xl italic text-terracotta">{i + 1}.</span>
              <span>
                <span className="display display-sm block text-[1.7rem] leading-tight">{title}</span>
                <span className="mt-2 block text-ink/80">{body}</span>
              </span>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
