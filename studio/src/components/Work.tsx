import Link from "next/link";
import { projects, type Project } from "@/content/projects";
import { DesktopMock } from "./mocks/Desktop";
import { FlowPhone, MenuPhone } from "./mocks/Phone";
import { Reveal } from "./Reveal";
import { Arrow, SectionLabel } from "./SectionLabel";

export function ConceptTag({ className = "" }: { className?: string }) {
  return (
    <span className={`label inline-block border border-dashed border-current px-2 py-1 text-[0.68rem] ${className}`}>
      Self-initiated concept
    </span>
  );
}

function Meta({ project, index, className = "" }: { project: Project; index: number; className?: string }) {
  return (
    <div className={className}>
      <div className="flex items-center justify-between gap-4">
        <span className="label text-cocoa">
          {String(index + 1).padStart(2, "0")} / {project.kind}
        </span>
        <ConceptTag className="text-cocoa" />
      </div>
      <h3 className="display mt-4 text-[clamp(2.4rem,4.4vw,3.75rem)]">
        <Link href={`/work/${project.slug}`} className="after:absolute after:inset-0 focus-visible:outline-none">
          {project.name}
        </Link>
      </h3>
      <p className="label mt-2 text-terracotta">{project.category}</p>
      <p className="mt-4 max-w-[26rem] text-[1.02rem] leading-relaxed text-ink/85">{project.summary}</p>
      <span className="label mt-6 inline-flex items-center gap-2">
        <span className="draw-link">View the concept</span>
        <Arrow className="transition-transform duration-300 group-hover:translate-x-1" />
      </span>
    </div>
  );
}

/** A coloured field the screens sit on; it gives each project its own room. */
function Field({ color, className = "", children }: { color: string; className?: string; children: React.ReactNode }) {
  return (
    <div className={`relative overflow-hidden ${className}`} style={{ background: color }}>
      {children}
    </div>
  );
}

const lift =
  "transition-transform duration-[900ms] ease-out-soft group-hover:-translate-y-2 group-hover:scale-[1.015] motion-reduce:transform-none";

export function Work() {
  const [ninefold, tuesday, pilar, late] = projects;

  return (
    <section id="work" aria-labelledby="work-title" className="frame relative py-[clamp(5rem,12vw,10rem)]">
      <div className="grid gap-8 md:grid-cols-12 md:items-end">
        <div className="md:col-span-7">
          <SectionLabel index="01">Selected work</SectionLabel>
          <h2 id="work-title" className="display mt-6 text-[clamp(3.2rem,9vw,8.5rem)]">
            Fresh out <br className="hidden sm:block" />
            of the <em className="wonk text-terracotta">oven.</em>
          </h2>
        </div>
        <Reveal className="md:col-span-4 md:col-start-9">
          <p className="text-[1.05rem] leading-relaxed text-ink/85">
            Proof is new, so these four are <strong className="font-semibold">self-initiated concepts</strong>: imagined
            businesses, designed and prototyped end to end to show how I work. Real client projects will take their place
            as they open their doors.
          </p>
        </Reveal>
      </div>

      <div className="mt-[clamp(3.5rem,8vw,7rem)] grid gap-x-[var(--gutter)] gap-y-[clamp(4.5rem,10vw,9rem)] md:grid-cols-12">
        {/* 01 — wide field, phone breaking out of the frame */}
        <article className="group relative grid gap-8 md:col-span-12 lg:grid-cols-12 lg:items-end">
          <Reveal className="relative lg:col-span-9">
            <Field color={ninefold.theme.ink} className="py-[7%] pl-[7%] pr-[16%]">
              <DesktopMock project={ninefold} className={lift} />
            </Field>
            <MenuPhone
              project={ninefold}
              className="absolute -bottom-12 right-[2%] w-[22%] rotate-[4deg] transition-transform duration-[900ms] ease-out-soft group-hover:rotate-[1deg] max-sm:hidden"
            />
          </Reveal>
          <Reveal delay={120} className="max-w-xl max-lg:mt-8 lg:col-span-3">
            <Meta project={ninefold} index={0} />
          </Reveal>
        </article>

        {/* 02 — text leads, field on the right */}
        <article className="group relative grid gap-8 md:col-span-12 lg:grid-cols-12">
          <Reveal className="order-2 max-w-xl lg:order-1 lg:col-span-3 lg:pt-10">
            <Meta project={tuesday} index={1} />
          </Reveal>
          <Reveal delay={120} className="order-1 lg:order-2 lg:col-span-8 lg:col-start-5">
            <Field color={tuesday.theme.accent} className="px-[6%] py-[6%]">
              <DesktopMock project={tuesday} className={`${lift} rotate-[-1.2deg]`} />
            </Field>
          </Reveal>
        </article>

        {/* 03 — tall portrait field with two phones */}
        <article className="group relative md:col-span-5">
          <Reveal>
            <Field color={pilar.theme.ink} className="flex aspect-[4/5] items-center justify-center gap-[6%] px-[8%]">
              <svg aria-hidden="true" className="absolute inset-0 size-full opacity-[0.14]">
                <defs>
                  <pattern id="work-tiles" width="56" height="56" patternUnits="userSpaceOnUse">
                    <path d="M28 6c8 8 8 14 0 22-8-8-8-14 0-22Zm0 44c-8-8-8-14 0-22 8 8 8 14 0 22ZM6 28c8-8 14-8 22 0-8 8-14 8-22 0Zm44 0c-8 8-14 8-22 0 8-8 14-8 22 0Z" fill="#F5EADB" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#work-tiles)" />
              </svg>
              <MenuPhone project={pilar} className={`w-[44%] -translate-y-[6%] ${lift}`} />
              <FlowPhone project={pilar} className={`w-[44%] translate-y-[8%] ${lift} delay-75`} />
            </Field>
          </Reveal>
          <Reveal delay={120} className="mt-8">
            <Meta project={pilar} index={2} />
          </Reveal>
        </article>

        {/* 04 — offset down to keep the column rhythm uneven */}
        <article className="group relative md:col-span-6 md:col-start-7 md:mt-[clamp(6rem,16vw,14rem)]">
          <Reveal>
            <Field color={late.theme.accent2} className="px-[7%] py-[9%]">
              <DesktopMock project={late} className={lift} />
            </Field>
          </Reveal>
          <Reveal delay={120} className="mt-8">
            <Meta project={late} index={3} />
          </Reveal>
        </article>
      </div>
    </section>
  );
}
