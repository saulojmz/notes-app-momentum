import Link from "next/link";
import { Reveal } from "./Reveal";
import { Arrow, SectionLabel } from "./SectionLabel";

const services = [
  {
    title: "Website design",
    line: "A site that feels like your place.",
    body: "Before anything gets designed, I spend time at your counter learning what makes your place yours: the light, the regulars, the chalkboard specials. Then I design a website that carries that feeling and makes the important things (hours, menu, where to find you) impossible to miss.",
    gets: ["A custom design, never a template", "Phone-first layouts that scale up", "Type and color that fit your brand", "Two rounds of thoughtful revisions"],
  },
  {
    title: "Website development",
    line: "Fast, sturdy and easy to update.",
    body: "I build what I design, so nothing gets lost in translation. Your site loads quickly on a phone with one bar of signal, works for people using screen readers, shows up properly in search, and comes with an editor simple enough to change the specials before you open.",
    gets: ["Hand-built, responsive website", "Accessibility and SEO built in", "Simple editing for menus and hours", "Hosting, domain and launch setup"],
  },
  {
    title: "Digital experience design",
    line: "The useful bits, done with care.",
    body: "Ordering, reservations, pre-orders, subscriptions, gift cards: the moments where a website becomes part of your service. I design them around how your counter actually runs, and work with the tools you already use, like Square, Toast, Shopify or Resy.",
    gets: ["Ordering and booking flows", "Menus that update in a minute", "Your existing tools, connected", "Fewer “are you open today?” calls"],
  },
];

export function Services() {
  return (
    <section id="services" aria-labelledby="services-title" className="grain relative bg-oat py-[clamp(5rem,12vw,10rem)]">
      <div className="frame relative">
        <div className="grid gap-8 md:grid-cols-12 md:items-end">
          <div className="md:col-span-8">
            <SectionLabel index="02">Services</SectionLabel>
            <h2 id="services-title" className="display mt-6 text-[clamp(3.2rem,9vw,8.5rem)]">
              On the <em className="wonk text-terracotta">menu.</em>
            </h2>
          </div>
          <Reveal className="md:col-span-4">
            <p className="text-[1.05rem] leading-relaxed text-ink/85">
              A short menu, done properly. Every project is designed and built by me, start to finish, so you always know
              who you’re talking to.
            </p>
          </Reveal>
        </div>

        <ol className="mt-[clamp(3rem,7vw,6rem)] border-t border-ink">
          {services.map((s, i) => (
            <Reveal as="li" key={s.title} className="group border-b border-ink">
              <div className="grid gap-x-[var(--gutter)] gap-y-6 py-[clamp(2rem,4.5vw,3.75rem)] md:grid-cols-12">
                <span className="label pt-3 text-cocoa md:col-span-1">0{i + 1}</span>
                <div className="md:col-span-5">
                  <h3 className="display text-[clamp(2.4rem,5vw,4.5rem)] transition-[font-variation-settings,font-weight] duration-700 ease-out-soft group-hover:font-[560]">
                    {s.title}
                  </h3>
                  <p className="display display-sm mt-3 text-[1.6rem] italic text-terracotta">{s.line}</p>
                </div>
                <div className="md:col-span-6">
                  <p className="text-[1.05rem] leading-relaxed">{s.body}</p>
                  <p className="label mt-7 text-cocoa">What you get</p>
                  <ul className="mt-3 grid gap-x-8 sm:grid-cols-2">
                    {s.gets.map((g) => (
                      <li key={g} className="flex gap-3 border-t border-ink/20 py-2.5 text-[0.98rem]">
                        <span aria-hidden="true" className="text-terracotta">
                          —
                        </span>
                        {g}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Reveal>
          ))}
        </ol>

        <Reveal className="mt-12 flex flex-col gap-4 border border-dashed border-ink/50 p-6 sm:flex-row sm:items-center sm:justify-between md:p-8">
          <p className="max-w-2xl">
            <span className="label mr-3 bg-butter px-2 py-1">Specials board</span>
            Brand identity, art direction and photography direction are coming to the menu soon. If you need them now, ask
            anyway.
          </p>
          <Link href="/#contact" className="group label inline-flex shrink-0 items-center gap-2">
            <span className="draw-link">Ask about it</span>
            <Arrow className="transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
