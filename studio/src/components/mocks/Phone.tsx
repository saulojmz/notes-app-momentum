import type { Project, ProjectSlug } from "@/content/projects";
import { PhoneFrame } from "./Frames";

const displayFont: Record<ProjectSlug, string> = {
  "ninefold-coffee": "font-grotesk font-bold tracking-[-0.04em]",
  "tuesday-bread": "font-didone",
  "cafe-pilar": "font-display italic [font-variation-settings:'SOFT'_100,'WONK'_1]",
  "late-plate": "font-didone",
};

function TopBar({ project }: { project: Project }) {
  return (
    <div className="flex items-center justify-between px-[7cqw] pb-[4cqw] pt-[14cqw] text-[3.6cqw]">
      <span className={`text-[5.4cqw] leading-none ${displayFont[project.slug]}`}>{project.name}</span>
      <span aria-hidden="true" className="flex w-[6cqw] flex-col gap-[1.2cqw]">
        <span className="h-[0.5cqw] bg-current" />
        <span className="h-[0.5cqw] bg-current" />
      </span>
    </div>
  );
}

/** First phone: the list people check most — roasts, the day’s bake, today’s specials, this week’s menu. */
export function MenuPhone({ project, className }: { project: Project; className?: string }) {
  const { menu } = project;
  return (
    <PhoneFrame project={project} className={className}>
      <TopBar project={project} />
      <div className="px-[7cqw]">
        <p className="font-mono text-[3cqw] uppercase tracking-[0.15em] text-[var(--m)]">Updated this morning</p>
        <p className={`mt-[2cqw] text-[11cqw] leading-[0.95] ${displayFont[project.slug]}`}>{menu.heading}</p>
        <ul className="mt-[6cqw] border-t border-current/25">
          {menu.items.map((item) => (
            <li key={item.name} className="flex items-start justify-between gap-[4cqw] border-b border-current/25 py-[3.6cqw]">
              <span>
                <span className={`block text-[4.2cqw] leading-tight ${item.soldOut ? "text-[var(--m)] line-through" : ""}`}>
                  {item.name}
                </span>
                <span className="mt-[1cqw] block text-[3.2cqw] text-[var(--m)]">{item.soldOut ? "Sold out · back soon" : item.note}</span>
              </span>
              <span className="text-[4cqw] tabular-nums">{item.price}</span>
            </li>
          ))}
        </ul>
      </div>
      <div
        className={`absolute inset-x-[7cqw] bottom-[8cqw] py-[4cqw] text-center text-[3.8cqw] font-semibold ${
          project.slug === "late-plate" ? "bg-[var(--a)] text-[var(--p)]" : "bg-[var(--i)] text-[var(--p)]"
        }`}
      >
        {project.slug === "late-plate" ? "Book a table" : project.slug === "cafe-pilar" ? "Cómo llegar · Directions" : "Order for pickup"}
      </div>
    </PhoneFrame>
  );
}

function Chip({ children, active = false }: { children: React.ReactNode; active?: boolean }) {
  return (
    <span
      className={`inline-flex items-center justify-center border px-[3cqw] py-[2.4cqw] text-[3.6cqw] ${
        active ? "border-[var(--i)] bg-[var(--i)] text-[var(--p)]" : "border-current/30"
      }`}
    >
      {children}
    </span>
  );
}

function Subscription() {
  return (
    <>
      <p className="font-mono text-[3cqw] uppercase tracking-[0.15em] text-[var(--m)]">Your subscription</p>
      <p className="mt-[2cqw] font-grotesk text-[10cqw] font-bold leading-[0.95] tracking-[-0.04em]">Next bag ships Thursday.</p>
      <div className="mt-[6cqw] flex items-center gap-[4cqw] bg-[var(--a)] p-[4cqw] text-[var(--i)]">
        <span className="font-grotesk text-[12cqw] font-extrabold leading-none tracking-[-0.06em]">09</span>
        <span className="text-[3.6cqw] leading-snug">
          House espresso
          <br />
          <span className="opacity-70">340g · whole bean</span>
        </span>
      </div>
      <p className="mt-[6cqw] text-[3.4cqw] text-[var(--m)]">Every</p>
      <div className="mt-[2cqw] grid grid-cols-3 gap-[2cqw]">
        <Chip>1 wk</Chip>
        <Chip active>2 wks</Chip>
        <Chip>4 wks</Chip>
      </div>
      <div className="mt-[5cqw] grid grid-cols-2 gap-[2cqw]">
        <Chip>Skip next</Chip>
        <Chip>Swap coffee</Chip>
      </div>
      <p className="mt-[5cqw] text-center text-[3.4cqw] underline underline-offset-[1cqw] opacity-70">Pause anytime</p>
    </>
  );
}

function Preorder() {
  return (
    <>
      <p className="font-mono text-[3cqw] uppercase tracking-[0.15em] text-[var(--m)]">Step 1 of 3</p>
      <p className="mt-[2cqw] font-didone text-[10.5cqw] leading-[0.95]">When are you picking up?</p>
      <p className="mt-[6cqw] text-[3.4cqw] text-[var(--m)]">Saturday</p>
      <div className="mt-[2cqw] grid grid-cols-3 gap-[2cqw]">
        <Chip>7–8</Chip>
        <Chip active>8–9</Chip>
        <Chip>9–10</Chip>
        <Chip>10–11</Chip>
        <span className="inline-flex items-center justify-center border border-dashed border-current/30 text-[3.4cqw] text-[var(--m)]">Full</span>
        <Chip>12–1</Chip>
      </div>
      <div className="mt-[6cqw] bg-[var(--a2)] p-[4cqw] text-[3.5cqw] leading-snug">
        <span className="font-semibold">8 items</span> will be ready at 8–9, including country sourdough and rye.
      </div>
      <div className="mt-[6cqw] bg-[var(--a)] py-[4cqw] text-center text-[3.8cqw] font-semibold text-[var(--a2)]">See what’s ready →</div>
    </>
  );
}

function Visit() {
  return (
    <>
      <p className="font-mono text-[3cqw] uppercase tracking-[0.15em] text-[var(--m)]">Visítanos · Visit</p>
      <div className="relative mt-[4cqw] h-[44cqw] overflow-hidden bg-[var(--a2)]">
        <svg viewBox="0 0 200 120" className="absolute inset-0 size-full" preserveAspectRatio="none" aria-hidden="true">
          <g stroke="#F5EADB" strokeWidth="7" fill="none">
            <path d="M-10 40h220M-10 92h220M60-10v140M150-10v140" />
          </g>
          <path d="M60 40h90" stroke="#C9542C" strokeWidth="3" strokeDasharray="5 4" fill="none" />
        </svg>
        <span className="absolute left-[67%] top-[20%] grid size-[9cqw] place-items-center rounded-full bg-[var(--i)] font-display text-[4cqw] italic text-[var(--p)]">
          P
        </span>
      </div>
      <div className="mt-[5cqw] space-y-[2.4cqw] text-[3.6cqw]">
        {[
          ["Lun–Vie", "7:00 – 3:00"],
          ["Sáb", "8:00 – 2:00"],
          ["Dom", "Cerrado · Closed"],
        ].map(([d, h]) => (
          <p key={d} className="flex justify-between border-b border-current/20 pb-[2cqw]">
            <span>{d}</span>
            <span className="tabular-nums">{h}</span>
          </p>
        ))}
      </div>
      <p className="mt-[4cqw] text-[3.4cqw] leading-snug text-[var(--m)]">
        Street parking on the side. The patio door is open for dogs and strollers.
      </p>
    </>
  );
}

function Booking() {
  return (
    <>
      <p className="font-mono text-[3cqw] uppercase tracking-[0.15em] text-[var(--m)]">Book a table</p>
      <p className="mt-[2cqw] font-didone text-[10.5cqw] leading-[0.95]">How many of you?</p>
      <div className="mt-[5cqw] grid grid-cols-4 gap-[2cqw] font-mono">
        <Chip>1</Chip>
        <Chip active>2</Chip>
        <Chip>3</Chip>
        <Chip>4</Chip>
      </div>
      <p className="mt-[6cqw] font-mono text-[3cqw] uppercase tracking-[0.15em] text-[var(--m)]">Friday · open times</p>
      <div className="mt-[2cqw] grid grid-cols-3 gap-[2cqw] font-mono">
        <Chip>6:15</Chip>
        <Chip>8:45</Chip>
        <Chip>9:30</Chip>
      </div>
      <p className="mt-[5cqw] text-[3.3cqw] leading-snug text-[var(--m)]">
        The bar’s six seats are always kept for walk-ins.
      </p>
      <div className="mt-[6cqw] bg-[var(--a)] py-[4cqw] text-center font-mono text-[3.4cqw] uppercase tracking-[0.15em] text-[var(--p)]">
        Continue
      </div>
    </>
  );
}

const flows: Record<ProjectSlug, () => React.ReactElement> = {
  "ninefold-coffee": Subscription,
  "tuesday-bread": Preorder,
  "cafe-pilar": Visit,
  "late-plate": Booking,
};

/** Second phone: the one task that matters most to this kind of business. */
export function FlowPhone({ project, className }: { project: Project; className?: string }) {
  const Flow = flows[project.slug];
  return (
    <PhoneFrame project={project} className={className}>
      <TopBar project={project} />
      <div className="px-[7cqw]">
        <Flow />
      </div>
    </PhoneFrame>
  );
}
