import { catalog, type CatalogDestination } from "./catalog";
import type { Climate, GuidedAnswers, HardNo, Setting } from "./types";

export interface Match {
  dest: CatalogDestination;
  /** 0–100 */
  score: number;
  reason: string;
}

const CLIMATE_WORDS: Record<Climate, string> = {
  warm: "Warm, sunny weather",
  mild: "Mild weather",
  cold: "Crisp, cold air",
  rainy: "Cosy, rainy-day charm",
};
const SETTING_WORDS: Record<Setting, string> = {
  beach: "beaches",
  mountains: "mountain scenery",
  city: "big-city energy",
  countryside: "open countryside",
};
const VIBE_WORDS = {
  adventure: "plenty of adventure",
  relaxing: "room to slow down",
  cultural: "deep culture and history",
  party: "great nightlife",
} as const;

const NEIGHBOUR: Partial<Record<Climate, Climate>> = { warm: "mild", mild: "warm", cold: "rainy", rainy: "mild" };

const join = (parts: string[]) =>
  parts.length <= 1 ? parts.join("") : `${parts.slice(0, -1).join(", ")} and ${parts[parts.length - 1]}`;

/** Score one destination against the guided planner answers. */
export const scoreDestination = (dest: CatalogDestination, a: GuidedAnswers): Match | null => {
  if (a.region !== "Anywhere" && dest.continent !== a.region) return null;

  let raw = a.region === "Anywhere" ? 12 : 20;
  const good: string[] = [];

  if (dest.climate.includes(a.climate)) {
    raw += 18;
    good.push(CLIMATE_WORDS[a.climate]);
  } else if (NEIGHBOUR[a.climate] && dest.climate.includes(NEIGHBOUR[a.climate]!)) raw += 6;

  if (dest.setting.includes(a.setting)) {
    raw += 18;
    good.push(SETTING_WORDS[a.setting]);
  }
  if (dest.vibe.includes(a.vibe)) {
    raw += 16;
    good.push(VIBE_WORDS[a.vibe]);
  }

  const transit = { public: { great: 8, good: 4, car: -6 }, rental: { great: 0, good: 3, car: 8 }, mix: { great: 6, good: 6, car: 4 } }[a.transport][dest.transit];
  raw += transit;
  if (a.transport === "public" && dest.transit === "great") good.push("excellent public transit");
  if (a.transport === "rental" && dest.transit === "car") good.push("roads made for a road trip");

  raw += a.housing === "hostel" ? { 1: 6, 2: 2, 3: -4 }[dest.cost] : a.housing === "airbnb" && dest.flags.includes("remote") ? -2 : 3;

  const b = a.budget;
  raw += b < 1500 ? { 1: 10, 2: 0, 3: -12 }[dest.cost] : b <= 3500 ? { 1: 6, 2: 6, 3: -2 }[dest.cost] : { 1: 2, 2: 4, 3: 8 }[dest.cost];

  if (a.party === "solo" && dest.transit !== "car" && !dest.flags.includes("remote")) raw += 3;
  if (a.party === "couple" && (dest.vibe.includes("relaxing") || dest.vibe.includes("cultural"))) raw += 3;
  if (a.party === "group" && (dest.vibe.includes("party") || dest.setting.includes("city"))) raw += 3;

  const conflicts = a.hardNos.filter((h: HardNo) => dest.flags.includes(h));
  raw -= conflicts.length * 18;

  const score = Math.max(35, Math.min(98, Math.round(40 + raw * 0.58)));
  const fits =
    dest.cost === 1 ? "easy on a tight budget" : dest.cost === 2 ? "a comfortable fit for your budget" : b > 3500 ? "worth the splurge" : "a stretch on your budget";
  const reason = `${join(good.length ? good : [dest.blurb.replace(/\.$/, "")])}. ${fits.charAt(0).toUpperCase()}${fits.slice(1)}.`;
  return { dest, score, reason };
};

/** All destinations that fit, best first. */
export const rankDestinations = (a: GuidedAnswers): Match[] =>
  catalog
    .map((d) => scoreDestination(d, a))
    .filter((m): m is Match => !!m)
    .sort((x, y) => y.score - x.score);

export const tripLength = (a: GuidedAnswers) => {
  if (a.dates.from && a.dates.to) {
    const days = Math.round((+new Date(a.dates.to) - +new Date(a.dates.from)) / 86400000) + 1;
    return Math.max(2, Math.min(7, days));
  }
  return 5;
};
