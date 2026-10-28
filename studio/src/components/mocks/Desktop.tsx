import type { Project } from "@/content/projects";
import { Bean, CoffeeBag, Concha, Croissant, Loaf, Plate, Tiles } from "./art";
import { BrowserFrame } from "./Frames";

// Homepage concepts. All measurements are in cqw (percent of frame width),
// so each screen scales like an image while staying crisp, selectable text.

function Ninefold() {
  return (
    <div className="absolute inset-0 font-sans">
      <div className="flex items-center justify-between px-[4cqw] pt-[2.6cqw] text-[1.25cqw]">
        <span className="font-grotesk text-[2cqw] font-extrabold tracking-[-0.04em]">NINEFOLD</span>
        <span className="flex gap-[3cqw] opacity-80">
          <span>Coffee</span>
          <span>Subscribe</span>
          <span>Bar</span>
          <span>Visit</span>
        </span>
        <span className="rounded-full border border-current px-[1.4cqw] py-[0.4cqw]">Bag (2)</span>
      </div>

      <div className="absolute left-[4cqw] top-[11cqw] w-[44cqw]">
        <p className="font-mono text-[1.15cqw] uppercase tracking-[0.15em] text-[var(--m)]">Roast No. 09 — out now</p>
        <p className="mt-[1.6cqw] font-grotesk text-[6.6cqw] font-bold leading-[0.9] tracking-[-0.05em]">
          Coffee you can count&nbsp;on.
        </p>
        <p className="mt-[2cqw] w-[34cqw] text-[1.45cqw] leading-[1.45] opacity-80">
          Small-batch roasts, numbered as they leave the drum. Tastes like brown sugar and cherry; brews like a dream.
        </p>
        <div className="mt-[2.6cqw] flex items-center gap-[2cqw] text-[1.3cqw]">
          <span className="rounded-full bg-[var(--i)] px-[2.4cqw] py-[1.1cqw] font-semibold text-[var(--p)]">Shop No. 09</span>
          <span className="underline underline-offset-[0.5cqw]">Start a subscription</span>
        </div>
      </div>

      <div className="absolute right-[5cqw] top-[7.5cqw] size-[40cqw] rounded-full bg-[var(--a)]" />
      <div className="absolute right-[4cqw] top-[7cqw] grid size-[10cqw] rotate-[12deg] place-items-center rounded-full bg-[var(--a2)] text-center font-mono text-[1.05cqw] uppercase leading-tight tracking-wider">
        Roasted
        <br />
        this week
      </div>
      <CoffeeBag className="absolute right-[15cqw] top-[10cqw] w-[20cqw] rotate-[-6deg] drop-shadow-[0_2cqw_2cqw_rgba(0,0,0,0.2)]" />
      <Bean className="absolute right-[40cqw] top-[38cqw] w-[2.4cqw] rotate-[30deg]" />
      <Bean className="absolute right-[7cqw] top-[40cqw] w-[2cqw] -rotate-[20deg]" />

      <div className="absolute inset-x-0 bottom-0 flex border-t border-[var(--i)]/20 text-[1.2cqw]">
        {["Brown sugar", "Cherry", "Hazelnut", "Espresso · Milk"].map((n, i) => (
          <span key={n} className="flex-1 border-r border-[var(--i)]/20 px-[4cqw] py-[1.6cqw] last:border-0">
            <span className="mr-[1cqw] font-mono text-[var(--m)]">0{i + 1}</span>
            {n}
          </span>
        ))}
      </div>
    </div>
  );
}

function TuesdayBread() {
  return (
    <div className="absolute inset-0 overflow-hidden font-sans">
      <div className="grid grid-cols-3 items-center px-[4cqw] pt-[2.6cqw] text-[1.3cqw]">
        <span className="flex gap-[2.4cqw]">
          <span className="underline decoration-[var(--a)] decoration-[0.25cqw] underline-offset-[0.6cqw]">Today’s bake</span>
          <span>Our bread</span>
        </span>
        <span className="text-center font-didone text-[2.4cqw] leading-none">Tuesday Bread</span>
        <span className="flex justify-end gap-[2.4cqw]">
          <span>Visit</span>
          <span className="bg-[var(--a)] px-[1.6cqw] py-[0.5cqw] text-[var(--a2)]">Pre-order</span>
        </span>
      </div>

      <p className="absolute inset-x-0 top-[9cqw] text-center font-didone text-[12cqw] leading-[0.86] tracking-[-0.03em]">
        Bread,
        <br />
        still warm.
      </p>
      <Loaf className="absolute left-[3cqw] top-[10cqw] w-[16cqw] rotate-[-12deg]" />
      <Croissant className="absolute right-[4cqw] top-[11cqw] w-[13cqw] rotate-[14deg]" />

      <div className="absolute right-[5cqw] top-[30cqw] grid size-[10cqw] rotate-[10deg] place-items-center rounded-full bg-[var(--a)] text-center font-mono text-[1.05cqw] uppercase leading-tight tracking-wider text-[var(--a2)]">
        Out of
        <br />
        the oven
        <br />
        7:00 am
      </div>

      <div className="absolute bottom-[3cqw] left-[4cqw] right-[22cqw] bg-[var(--a2)] px-[2.6cqw] py-[1.8cqw]">
        <div className="mb-[1cqw] flex items-baseline justify-between">
          <span className="font-didone text-[2.3cqw]">Today’s bake</span>
          <span className="font-mono text-[1cqw] uppercase tracking-wider text-[var(--m)]">Updated 6:42 am</span>
        </div>
        <div className="grid grid-cols-4 gap-[2cqw] text-[1.15cqw]">
          {[
            ["Country sourdough", "Fresh"],
            ["Rye & caraway", "Fresh"],
            ["Cardamom bun", "Gone · next 10:30"],
            ["Olive fougasse", "Low"],
          ].map(([n, s]) => (
            <div key={n} className="border-t border-[var(--i)]/30 pt-[0.8cqw]">
              <p className={s.startsWith("Gone") ? "text-[var(--m)] line-through" : ""}>{n}</p>
              <p className={`font-mono text-[0.95cqw] uppercase ${s === "Low" ? "text-[var(--a)]" : "text-[var(--m)]"}`}>{s}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function CafePilar() {
  return (
    <div className="absolute inset-0 font-sans">
      <Tiles id="pilar-band" className="absolute inset-x-0 top-0 h-[2.4cqw] w-full" />
      <div className="flex items-center justify-between px-[4cqw] pt-[4.4cqw] text-[1.3cqw]">
        <span className="font-display text-[2.6cqw] italic leading-none [font-variation-settings:'SOFT'_100,'WONK'_1]">Café Pilar</span>
        <span className="flex items-center gap-[2.6cqw]">
          <span>Menú</span>
          <span>Hoy</span>
          <span>Visítanos</span>
          <span className="flex overflow-hidden rounded-full border border-current font-mono text-[1.05cqw]">
            <span className="bg-[var(--i)] px-[1cqw] py-[0.3cqw] text-[var(--p)]">ES</span>
            <span className="px-[1cqw] py-[0.3cqw]">EN</span>
          </span>
        </span>
      </div>

      <div className="absolute bottom-0 left-[4cqw] h-[41cqw] w-[31cqw] overflow-hidden rounded-t-full bg-[var(--a2)]">
        <Tiles id="pilar-arch" className="absolute inset-x-0 bottom-0 h-[11cqw] w-full" />
        <Concha className="absolute bottom-[8cqw] left-1/2 w-[22cqw] -translate-x-1/2" />
      </div>

      <div className="absolute left-[41cqw] top-[12cqw] w-[52cqw]">
        <p className="font-display text-[8.4cqw] italic leading-[0.92] tracking-[-0.03em] [font-variation-settings:'SOFT'_100,'WONK'_1,'opsz'_144]">
          Buenos días, <span className="text-[var(--a)]">vecinos.</span>
        </p>
        <p className="mt-[1.4cqw] font-display text-[2.2cqw] italic text-[var(--m)]">Good morning, neighbors.</p>
        <div className="mt-[3.4cqw] grid grid-cols-[auto_1fr] gap-x-[2.4cqw] border-y border-[var(--i)]/25 py-[1.8cqw] text-[1.3cqw]">
          <span className="font-mono text-[1.1cqw] uppercase tracking-widest text-[var(--a)]">Hoy</span>
          <span>Abierto 7–3 · Open 7 till 3</span>
          <span className="font-mono text-[1.1cqw] uppercase tracking-widest text-[var(--a)]">Pan</span>
          <span>Conchas de vainilla, recién horneadas</span>
        </div>
        <div className="mt-[2.4cqw] flex gap-[1.6cqw] text-[1.3cqw]">
          <span className="rounded-full bg-[var(--i)] px-[2.4cqw] py-[1cqw] text-[var(--p)]">Ver el menú</span>
          <span className="rounded-full border border-current px-[2.4cqw] py-[1cqw]">Cómo llegar</span>
        </div>
      </div>
    </div>
  );
}

function LatePlate() {
  return (
    <div className="absolute inset-0 overflow-hidden font-mono">
      <div className="flex items-center justify-between px-[4cqw] pt-[2.6cqw] text-[1.15cqw] uppercase tracking-[0.2em]">
        <span>Menu</span>
        <span className="tracking-[0.5em]">Late Plate</span>
        <span className="text-[var(--a)]">Book</span>
      </div>
      <Plate className="absolute -right-[5cqw] top-[8cqw] w-[42cqw]" />
      <div className="absolute left-[8cqw] top-[10cqw] w-[48cqw]">
        <p className="font-didone text-[8.6cqw] leading-[0.9] tracking-[-0.02em]">
          Dinner,
          <br />
          five till <span className="italic text-[var(--a)]">late.</span>
        </p>
        <p className="mt-[2.2cqw] text-[1.15cqw] uppercase tracking-[0.18em] text-[var(--m)]">Twenty seats · Tues–Sun · Kitchen till 1 am</p>
        <div className="mt-[3cqw] w-[38cqw] space-y-[1.2cqw] text-[1.25cqw]">
          {[
            ["Charred leeks, romesco", "14"],
            ["Tagliatelle, brown butter", "24"],
            ["Half chicken, salsa verde", "29"],
          ].map(([n, p]) => (
            <p key={n} className="flex items-baseline gap-[1cqw]">
              <span>{n}</span>
              <span className="flex-1 border-b border-dotted border-current opacity-40" />
              <span>{p}</span>
            </p>
          ))}
        </div>
        <span className="mt-[3cqw] inline-block bg-[var(--a)] px-[2.6cqw] py-[1.2cqw] text-[1.2cqw] uppercase tracking-[0.2em] text-[var(--p)]">
          Book a table
        </span>
      </div>
    </div>
  );
}

const screens = {
  "ninefold-coffee": Ninefold,
  "tuesday-bread": TuesdayBread,
  "cafe-pilar": CafePilar,
  "late-plate": LatePlate,
} as const;

export function DesktopMock({ project, className }: { project: Project; className?: string }) {
  const Screen = screens[project.slug];
  return (
    <BrowserFrame project={project} className={className}>
      <Screen />
    </BrowserFrame>
  );
}
