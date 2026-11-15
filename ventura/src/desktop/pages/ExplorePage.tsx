import { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Check, Search, Star } from "lucide-react";
import { Segmented, SmartImage } from "@/components/kit";
import { destinations, itineraries } from "@/data/mockItineraries";
import { catalog } from "@/features/planner/catalog";
import type { Continent, Setting } from "@/features/planner/types";
import { cn } from "@/lib/utils";
import { Page, PageHeader } from "../Shell";

type Tab = "itineraries" | "destinations";

const FilterGroup = <T extends string>({ title, options, value, onChange }: { title: string; options: { value: T; label: string; count?: number }[]; value: T; onChange: (v: T) => void }) => (
  <fieldset className="space-y-1">
    <legend className="eyebrow mb-2 px-2">{title}</legend>
    {options.map((o) => {
      const on = o.value === value;
      return (
        <button
          key={o.value}
          type="button"
          role="radio"
          aria-checked={on}
          onClick={() => onChange(o.value)}
          className={cn(
            "flex h-8 w-full items-center gap-2 rounded-[var(--radius-chip)] px-2 text-left text-sm transition-colors",
            on ? "bg-card font-medium shadow-xs ring-1 ring-border" : "text-muted-foreground hover:bg-secondary hover:text-foreground",
          )}
        >
          <span className="flex-1">{o.label}</span>
          {o.count !== undefined && <span className="text-xs tabular-nums text-muted-foreground">{o.count}</span>}
          {on && o.count === undefined && <Check className="h-3.5 w-3.5" />}
        </button>
      );
    })}
  </fieldset>
);

const regionOf = (destinationId: string) => destinations.find((d) => d.id === destinationId)?.region ?? "Europe";
const LENGTHS = [
  { value: "any", label: "Any length", test: () => true },
  { value: "short", label: "1–2 days", test: (n: number) => n <= 2 },
  { value: "mid", label: "3–4 days", test: (n: number) => n >= 3 && n <= 4 },
  { value: "long", label: "5 days or more", test: (n: number) => n >= 5 },
] as const;
const COST = [
  { value: "any", label: "Any budget" },
  { value: "1", label: "Budget" },
  { value: "2", label: "Mid-range" },
  { value: "3", label: "Splurge" },
] as const;
const COST_LABEL = { 1: "$", 2: "$$", 3: "$$$" } as const;

const ExplorePage = () => {
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const tab: Tab = params.get("tab") === "destinations" ? "destinations" : "itineraries";
  const [q, setQ] = useState("");
  const [region, setRegion] = useState("All");
  const [length, setLength] = useState<(typeof LENGTHS)[number]["value"]>("any");
  const [category, setCategory] = useState("All");
  const [continent, setContinent] = useState<"All" | Continent>("All");
  const [cost, setCost] = useState<(typeof COST)[number]["value"]>("any");
  const [setting, setSetting] = useState<"All" | Setting>("All");

  const query = q.trim().toLowerCase();
  const its = useMemo(
    () =>
      itineraries.filter((it) => {
        const dest = destinations.find((d) => d.id === it.destinationId);
        const lengthTest = LENGTHS.find((l) => l.value === length)!.test;
        return (
          (region === "All" || regionOf(it.destinationId) === region) &&
          lengthTest(it.duration) &&
          (category === "All" || it.category === category || it.tags.includes(category)) &&
          (!query || it.title.toLowerCase().includes(query) || dest?.name.toLowerCase().includes(query))
        );
      }),
    [region, length, category, query],
  );
  const dests = useMemo(
    () =>
      catalog.filter(
        (d) =>
          (continent === "All" || d.continent === continent) &&
          (cost === "any" || String(d.cost) === cost) &&
          (setting === "All" || d.setting.includes(setting)) &&
          (!query || d.name.toLowerCase().includes(query) || d.country.toLowerCase().includes(query)),
      ),
    [continent, cost, setting, query],
  );

  return (
    <Page wide>
      <PageHeader eyebrow={`${catalog.length} destinations · ${itineraries.length} itineraries`} title="Explore">
        <label className="flex h-10 w-[320px] items-center gap-2.5 rounded-[var(--radius-control)] border border-border bg-card px-3 focus-within:border-primary/50 focus-within:ring-4 focus-within:ring-primary/10">
          <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search places" className="h-full min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground" />
        </label>
      </PageHeader>

      <div className="grid grid-cols-[220px_minmax(0,1fr)] gap-10">
        <aside className="space-y-7">
          <Segmented<Tab>
            label="Browse"
            value={tab}
            onChange={(t) => setParams(t === "destinations" ? { tab: t } : {})}
            options={[
              { value: "itineraries", label: "Itineraries" },
              { value: "destinations", label: "Places" },
            ]}
          />
          {tab === "itineraries" ? (
            <>
              <FilterGroup
                title="Region"
                value={region}
                onChange={setRegion}
                options={["All", "Europe", "Asia", "Americas", "Africa", "Oceania"].map((r) => ({
                  value: r,
                  label: r === "All" ? "Everywhere" : r,
                  count: itineraries.filter((it) => r === "All" || regionOf(it.destinationId) === r).length,
                }))}
              />
              <FilterGroup title="Length" value={length} onChange={(v) => setLength(v as typeof length)} options={LENGTHS.map(({ value, label }) => ({ value, label }))} />
              <FilterGroup
                title="Category"
                value={category}
                onChange={setCategory}
                options={["All", "Culture", "History", "Food", "Nature", "Nightlife"].map((c) => ({ value: c, label: c === "All" ? "Anything" : c }))}
              />
            </>
          ) : (
            <>
              <FilterGroup
                title="Region"
                value={continent}
                onChange={(v) => setContinent(v as typeof continent)}
                options={(["All", "Europe", "Asia", "North America", "South America", "Africa", "Oceania"] as const).map((c) => ({
                  value: c,
                  label: c === "All" ? "Everywhere" : c,
                  count: catalog.filter((d) => c === "All" || d.continent === c).length,
                }))}
              />
              <FilterGroup title="Budget" value={cost} onChange={(v) => setCost(v as typeof cost)} options={COST.map(({ value, label }) => ({ value, label }))} />
              <FilterGroup
                title="Setting"
                value={setting}
                onChange={(v) => setSetting(v as typeof setting)}
                options={(["All", "city", "beach", "mountains", "countryside"] as const).map((s) => ({ value: s, label: s === "All" ? "Any setting" : s[0].toUpperCase() + s.slice(1) }))}
              />
            </>
          )}
        </aside>

        <section aria-live="polite">
          <p className="meta mb-4 tabular-nums">
            {tab === "itineraries" ? `${its.length} itineraries` : `${dests.length} places`}
          </p>
          <div className="grid grid-cols-3 gap-x-6 gap-y-8">
            {tab === "itineraries"
              ? its.map((it) => {
                  const dest = destinations.find((d) => d.id === it.destinationId);
                  return (
                    <button key={it.id} type="button" onClick={() => navigate(`/explore/itinerary/${it.id}`)} className="group text-left">
                      <SmartImage src={it.imageUrl} alt="" className="aspect-[4/3] w-full rounded-2xl object-cover" />
                      <p className="meta mt-3 tabular-nums">
                        {dest?.name} · {it.duration} {it.duration === 1 ? "day" : "days"}
                      </p>
                      <h3 className="mt-0.5 text-[17px] font-medium leading-snug group-hover:underline group-hover:decoration-foreground/30 group-hover:underline-offset-4">{it.title}</h3>
                      <p className="mt-1 flex items-center gap-1.5 text-[13px] tabular-nums text-muted-foreground">
                        <Star className="h-3.5 w-3.5 fill-highlight text-highlight" strokeWidth={0} />
                        {it.rating.toFixed(1)} · {it.author.name}
                      </p>
                    </button>
                  );
                })
              : dests.map((d) => (
                  <button key={d.id} type="button" onClick={() => navigate(`/explore/destination/${d.id}`)} className="group text-left">
                    <SmartImage src={d.image} alt="" className="aspect-[4/3] w-full rounded-2xl object-cover" />
                    <p className="meta mt-3">
                      {d.country} · {COST_LABEL[d.cost]}
                    </p>
                    <h3 className="mt-0.5 text-[17px] font-medium group-hover:underline group-hover:decoration-foreground/30 group-hover:underline-offset-4">{d.name}</h3>
                    <p className="mt-1 line-clamp-2 text-[13px] leading-relaxed text-muted-foreground">{d.blurb}</p>
                  </button>
                ))}
          </div>
          {(tab === "itineraries" ? its : dests).length === 0 && <p className="rounded-xl bg-secondary px-4 py-3 text-sm text-muted-foreground">Nothing matches these filters</p>}
        </section>
      </div>
    </Page>
  );
};

export default ExplorePage;
