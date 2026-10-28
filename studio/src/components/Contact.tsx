import { site } from "@/content/site";
import { ContactForm } from "./ContactForm";
import { Reveal } from "./Reveal";
import { SectionLabel } from "./SectionLabel";

export function Contact() {
  return (
    <section id="contact" aria-labelledby="contact-title" className="grain relative overflow-hidden bg-ink py-[clamp(5rem,12vw,10rem)] text-paper">
      <div className="frame relative grid gap-x-[var(--gutter)] gap-y-14 lg:grid-cols-12">
        <div className="lg:col-span-6">
          <SectionLabel index="05">Contact</SectionLabel>
          <h2 id="contact-title" className="display mt-6 text-[clamp(3.2rem,7.4vw,7.5rem)]">
            Have something good <em className="wonk text-butter">brewing?</em>
          </h2>
          <Reveal className="mt-10 max-w-md space-y-5 text-[1.08rem] leading-relaxed text-paper/85">
            <p>
              Opening a new place, finally fixing the old website, or just wondering what this would cost? Tell me a little
              about your business. I read every message myself and reply within two working days.
            </p>
          </Reveal>
          <Reveal delay={120} className="mt-10">
            <p className="label text-paper/70">Or write directly</p>
            <a
              href={`mailto:${site.email}`}
              className="display display-sm ink-link mt-3 inline-block text-[clamp(1.8rem,3.6vw,3rem)] italic text-paper"
            >
              {site.email}
            </a>
          </Reveal>
        </div>

        <Reveal delay={150} className="relative lg:col-span-6 lg:pt-6">
          <div className="transition-transform duration-700 ease-out-soft lg:rotate-[1.2deg] lg:hover:rotate-0 motion-reduce:rotate-0">
            <ContactForm />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
