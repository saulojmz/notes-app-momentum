import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getNextProject, getProject, projects, type ProjectSlug } from "@/content/projects";
import { DesktopMock } from "@/components/mocks/Desktop";
import { FlowPhone, MenuPhone } from "@/components/mocks/Phone";
import { Reveal } from "@/components/Reveal";
import { Arrow } from "@/components/SectionLabel";
import { ConceptTag } from "@/components/Work";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const project = getProject((await params).slug);
  if (!project) return {};
  return {
    title: `${project.name} (concept)`,
    description: project.summary,
    openGraph: { title: `${project.name} — a self-initiated concept`, description: project.summary },
  };
}

const specimenFont: Record<ProjectSlug, string> = {
  "ninefold-coffee": "font-grotesk font-bold tracking-[-0.05em]",
  "tuesday-bread": "font-didone",
  "cafe-pilar": "font-display italic [font-variation-settings:'SOFT'_100,'WONK'_1,'opsz'_144]",
  "late-plate": "font-didone",
};

export default async function ProjectPage({ params }: Params) {
  const project = getProject((await params).slug);
  if (!project) notFound();
  const next = getNextProject(project.slug);
  const index = projects.indexOf(project);
  const darkProject = project.slug === "late-plate";
  // The hero field uses the project's deepest colour so the screens sit on their own brand.
  const field = darkProject ? project.theme.paper : project.theme.ink;

  return (
    <article>
      <header className="frame pt-[calc(var(--nav-h)+2.5rem)]">
        <div className="label flex flex-wrap items-center justify-between gap-4 border-b border-ink/20 pb-4 text-cocoa">
          <Link href="/#work" className="group inline-flex items-center gap-2">
            <Arrow className="rotate-180 transition-transform group-hover:-translate-x-1" />
            <span className="draw-link">All work</span>
          </Link>
          <span>
            Concept {String(index + 1).padStart(2, "0")} of {String(projects.length).padStart(2, "0")}
          </span>
        </div>

        <div className="mt-[clamp(2.5rem,6vw,5rem)] grid gap-8 md:grid-cols-12 md:items-end">
          <div className="md:col-span-8">
            <p className="label text-terracotta">{project.category}</p>
            <h1 className="display mt-4 text-[clamp(3.6rem,11vw,10.5rem)]">
              <span className="line-mask">
                <span>{project.name}</span>
              </span>
            </h1>
          </div>
          <div className="md:col-span-4">
            <ConceptTag className="text-cocoa" />
            <p className="mt-4 text-lg leading-relaxed">{project.summary}</p>
          </div>
        </div>

        <dl className="label mt-12 grid grid-cols-2 gap-6 border-t border-ink/20 pt-5 text-cocoa sm:grid-cols-4 [&_dd]:font-medium">
          <div>
            <dt>Type</dt>
            <dd className="mt-1 text-ink">{project.kind}</dd>
          </div>
          <div>
            <dt>Scope</dt>
            <dd className="mt-1 text-ink">Web design & UX</dd>
          </div>
          <div>
            <dt>Year</dt>
            <dd className="mt-1 text-ink">{project.year}</dd>
          </div>
          <div>
            <dt>Status</dt>
            <dd className="mt-1 text-ink">Self-initiated</dd>
          </div>
        </dl>
      </header>

      <div className="frame mt-10">
        <Reveal className="px-[5%] py-[6%]" style={{ background: field }}>
          <DesktopMock project={project} />
        </Reveal>
      </div>

      <section aria-label="Overview" className="frame grid gap-x-[var(--gutter)] gap-y-12 py-[clamp(4.5rem,10vw,8rem)] md:grid-cols-12">
        <h2 className="display text-[clamp(2.2rem,4vw,3.5rem)] md:col-span-4">
          The <em className="wonk text-terracotta">place.</em>
        </h2>
        <div className="space-y-10 md:col-span-7 md:col-start-6">
          <p className="display text-[clamp(1.5rem,2.4vw,2.1rem)] leading-[1.2] [font-variation-settings:'opsz'_48,'SOFT'_100] tracking-[-0.015em]">
            {project.intro}
          </p>
          <div className="grid gap-8 sm:grid-cols-2">
            <Reveal>
              <h3 className="label text-cocoa">The brief</h3>
              <p className="mt-3 leading-relaxed">{project.brief}</p>
            </Reveal>
            <Reveal delay={100}>
              <h3 className="label text-cocoa">The idea</h3>
              <p className="mt-3 leading-relaxed">{project.idea}</p>
            </Reveal>
          </div>
        </div>
      </section>

      <section aria-labelledby="screens-title" className="grain relative bg-oat py-[clamp(4.5rem,10vw,8rem)]">
        <div className="frame relative grid items-center gap-x-[var(--gutter)] gap-y-14 md:grid-cols-12">
          <div className="md:col-span-4">
            <h2 id="screens-title" className="display text-[clamp(2.2rem,4vw,3.5rem)]">
              In your <em className="wonk text-terracotta">pocket.</em>
            </h2>
            <p className="mt-5 max-w-sm leading-relaxed">
              Most visits happen on a phone, often while standing in line or walking over. These screens are designed for
              that moment first.
            </p>
            <ol className="mt-8 space-y-6">
              {project.details.map((d, i) => (
                <li key={d.title} className="grid grid-cols-[2.25rem_1fr] border-t border-ink/25 pt-4">
                  <span className="display text-2xl italic text-terracotta">{i + 1}.</span>
                  <span>
                    <span className="block font-semibold">{d.title}</span>
                    <span className="mt-1 block text-ink/80">{d.body}</span>
                  </span>
                </li>
              ))}
            </ol>
          </div>
          <div className="grid grid-cols-2 gap-[6%] md:col-span-7 md:col-start-6 md:px-[4%]">
            <Reveal>
              <MenuPhone project={project} />
              <p className="label mt-4 text-center text-cocoa">{project.screens[0]}</p>
            </Reveal>
            <Reveal delay={140} className="mt-[18%]">
              <FlowPhone project={project} />
              <p className="label mt-4 text-center text-cocoa">{project.screens[1]}</p>
            </Reveal>
          </div>
        </div>
      </section>

      <section aria-labelledby="system-title" className="frame py-[clamp(4.5rem,10vw,8rem)]">
        <div className="grid gap-x-[var(--gutter)] gap-y-10 md:grid-cols-12">
          <h2 id="system-title" className="display text-[clamp(2.2rem,4vw,3.5rem)] md:col-span-4">
            The <em className="wonk text-terracotta">ingredients.</em>
          </h2>
          <div className="md:col-span-8">
            <ul className="grid grid-cols-2 sm:grid-cols-4">
              {project.palette.map((c, i) => (
                <Reveal as="li" key={c.hex} delay={i * 70}>
                  <div className="aspect-[3/4] border border-ink/10" style={{ background: c.hex }} />
                  <p className="mt-3 text-sm font-medium">{c.name}</p>
                  <p className="label text-cocoa">{c.hex}</p>
                </Reveal>
              ))}
            </ul>
            <div className="mt-10 grid gap-8 border-t border-ink/20 pt-8 sm:grid-cols-[auto_1fr] sm:items-center">
              <p className={`text-[7rem] leading-[0.85] ${specimenFont[project.slug]}`} aria-hidden="true">
                Aa
              </p>
              <div>
                <p className="label text-cocoa">Display · {project.type.display}</p>
                <p className="label text-cocoa">Text · {project.type.text}</p>
                <p className="mt-3 max-w-md leading-relaxed">{project.type.note}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <aside className="frame">
        <p className="border-y border-dashed border-ink/40 py-6 text-center text-[0.98rem] text-cocoa">
          {project.name} is an imagined business, created as a self-initiated concept to explore how a {project.kind.toLowerCase()} website
          could work. Any resemblance to a real place is a happy accident.
        </p>
      </aside>

      <Link
        href={`/work/${next.slug}`}
        className="group mt-[clamp(4rem,9vw,7rem)] block overflow-hidden"
        style={{ background: next.slug === "late-plate" ? next.theme.paper : next.theme.ink, color: next.slug === "late-plate" ? next.theme.ink : next.theme.paper }}
      >
        <div className="frame flex flex-wrap items-end justify-between gap-6 py-[clamp(3.5rem,8vw,6.5rem)]">
          <div>
            <p className="label opacity-80">Next concept</p>
            <p className="display mt-4 text-[clamp(3rem,9vw,8rem)] transition-transform duration-700 ease-out-soft group-hover:translate-x-3">
              {next.name}
            </p>
          </div>
          <Arrow className="size-[clamp(3rem,7vw,6rem)] transition-transform duration-500 group-hover:translate-x-3" />
        </div>
      </Link>
    </article>
  );
}
