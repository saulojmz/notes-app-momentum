// The four portfolio pieces are self-initiated concepts: invented businesses,
// designed to show how the studio thinks. They are labelled as such everywhere
// they appear. Swap them for real client work as it comes in.

export type ProjectSlug = "ninefold-coffee" | "tuesday-bread" | "cafe-pilar" | "late-plate";

export type MenuItem = { name: string; note?: string; price: string; soldOut?: boolean };

export type Project = {
  slug: ProjectSlug;
  name: string;
  category: string;
  kind: string;
  year: string;
  summary: string;
  intro: string;
  brief: string;
  idea: string;
  theme: {
    paper: string;
    ink: string;
    accent: string;
    accent2: string;
    muted: string;
  };
  palette: { name: string; hex: string }[];
  type: { display: string; text: string; note: string };
  details: { title: string; body: string }[];
  menu: { heading: string; items: MenuItem[] };
  screens: [string, string];
};

export const projects: Project[] = [
  {
    slug: "ninefold-coffee",
    name: "Ninefold Coffee",
    category: "Specialty coffee roaster & bar",
    kind: "Roaster",
    year: "2026",
    summary:
      "A website for a small-batch roaster where every bag gets a number and every number gets a story.",
    intro:
      "Ninefold is an imagined micro-roaster with one coffee bar and a habit of numbering everything. The site needed to sell beans online without feeling like a shop template, and to make tasting notes readable by people who just want something nice for the morning.",
    brief:
      "Roasters often end up with two websites stitched together: a pretty homepage and a generic store. The goal was one continuous experience, where browsing coffees feels like talking to the person behind the bar.",
    idea:
      "Each roast is treated like a numbered edition. A large numeral anchors every product, and tasting notes are translated into plain language (“tastes like a ripe apricot, finishes like cocoa”) with a simple brew guide underneath.",
    theme: {
      paper: "#EEE7D8",
      ink: "#1D3428",
      accent: "#F09A4E",
      accent2: "#C9D6B0",
      muted: "#56695B",
    },
    palette: [
      { name: "Roastery green", hex: "#1D3428" },
      { name: "Apricot", hex: "#F09A4E" },
      { name: "Sage foam", hex: "#C9D6B0" },
      { name: "Kraft paper", hex: "#EEE7D8" },
    ],
    type: {
      display: "Bricolage Grotesque",
      text: "Instrument Sans",
      note: "A sturdy grotesque with a little swagger, sized up for the numerals.",
    },
    details: [
      {
        title: "Tasting notes, translated",
        body: "Flavor wheels are replaced with a short, human sentence and three notes you can actually picture.",
      },
      {
        title: "Subscription without the fine print",
        body: "Pause, skip or swap a delivery from a single screen, with the next ship date always visible.",
      },
      {
        title: "Brew guide on every bag",
        body: "Ratios, grind and time for pour-over, espresso and batch brew live directly on the product page.",
      },
    ],
    menu: {
      heading: "Current roasts",
      items: [
        { name: "No. 07 — Huila, Colombia", note: "Apricot · panela · cocoa", price: "$19" },
        { name: "No. 08 — Guji, Ethiopia", note: "Peach tea · jasmine · lime", price: "$22" },
        { name: "No. 09 — House espresso", note: "Brown sugar · cherry · hazelnut", price: "$18" },
        { name: "No. 06 — Decaf, Peru", note: "Milk chocolate · toasted almond", price: "$18", soldOut: true },
      ],
    },
    screens: ["Current roasts", "Subscription"],
  },
  {
    slug: "tuesday-bread",
    name: "Tuesday Bread",
    category: "Artisan sourdough bakery",
    kind: "Bakery",
    year: "2026",
    summary:
      "A cheerful, honest website for a neighborhood bakery that bakes small batches and sells out early.",
    intro:
      "Tuesday Bread is an imagined bakery that started as a weekly bread subscription and grew into a storefront. Its customers mostly want to know one thing: what’s on the shelf today, and will it still be there at 11?",
    brief:
      "Bakeries lose people at the door when the website only shows a static menu. The site needed to show the day’s bake, make pre-orders effortless and carry the bakery’s warmth without becoming cluttered.",
    idea:
      "The homepage opens with a live ‘today’s bake’ board the bakers update from their phone before opening. Sold-out items stay visible, crossed out, with the time the next batch comes out of the oven.",
    theme: {
      paper: "#F6D96F",
      ink: "#3A1A10",
      accent: "#B8391C",
      accent2: "#FFF4D6",
      muted: "#7A4A2E",
    },
    palette: [
      { name: "Butter", hex: "#F6D96F" },
      { name: "Brick oven", hex: "#B8391C" },
      { name: "Crust", hex: "#3A1A10" },
      { name: "Crumb", hex: "#FFF4D6" },
    ],
    type: {
      display: "Gloock",
      text: "Instrument Sans",
      note: "A high-contrast serif with soft, doughy curves, set big and tight.",
    },
    details: [
      {
        title: "Today’s bake, updated from a phone",
        body: "A tiny admin screen lets the team mark items as fresh, low or gone in two taps.",
      },
      {
        title: "Pre-order by pickup time",
        body: "Customers choose a pickup window first, so they only see what will actually be ready.",
      },
      {
        title: "Allergens up front",
        body: "Every loaf and pastry shows its key allergens on the list itself, not three taps deep.",
      },
    ],
    menu: {
      heading: "Today’s bake",
      items: [
        { name: "Country sourdough", note: "Out of the oven 7:00", price: "$11" },
        { name: "Rye & caraway", note: "Small batch", price: "$12" },
        { name: "Cardamom bun", note: "Next batch 10:30", price: "$5", soldOut: true },
        { name: "Olive fougasse", note: "Saturdays only", price: "$9" },
      ],
    },
    screens: ["Today’s bake", "Pre-order"],
  },
  {
    slug: "cafe-pilar",
    name: "Café Pilar",
    category: "Neighborhood café",
    kind: "Café",
    year: "2026",
    summary:
      "A bilingual website for a corner café that feels like being greeted by name.",
    intro:
      "Café Pilar is an imagined family café on a residential corner, serving café de olla, conchas and breakfast tacos to the same faces every morning. Its regulars speak English, Spanish and usually both at once.",
    brief:
      "Most café sites treat translation as an afterthought hidden in the footer. This one needed to feel equally at home in both languages and work as a quick daily utility: hours, today’s specials, and directions.",
    idea:
      "A language toggle sits right in the header and remembers your choice. The design borrows from hand-painted tile and the café’s arched window, with a ‘hoy / today’ module front and center.",
    theme: {
      paper: "#F5EADB",
      ink: "#22356F",
      accent: "#B4461F",
      accent2: "#F1B9A0",
      muted: "#5A5F84",
    },
    palette: [
      { name: "Azulejo", hex: "#22356F" },
      { name: "Barro", hex: "#B4461F" },
      { name: "Rosa concha", hex: "#F1B9A0" },
      { name: "Cal", hex: "#F5EADB" },
    ],
    type: {
      display: "Fraunces Italic",
      text: "Instrument Sans",
      note: "A soft, slightly wonky italic that feels hand-lettered on a window.",
    },
    details: [
      {
        title: "Truly bilingual",
        body: "English and Spanish are written side by side, not machine-translated, and the toggle never leaves the header.",
      },
      {
        title: "The ‘hoy’ module",
        body: "Today’s hours, specials and pastry of the day in one glance, designed to be checked in line at a bus stop.",
      },
      {
        title: "Directions that make sense",
        body: "Parking, the side door, the dog-friendly patio: the things locals know, written down for newcomers.",
      },
    ],
    menu: {
      heading: "Hoy / Today",
      items: [
        { name: "Café de olla", note: "Canela · piloncillo", price: "$4.5" },
        { name: "Concha de vainilla", note: "Vanilla concha", price: "$3" },
        { name: "Taco de papa con chorizo", note: "Potato & chorizo", price: "$4" },
        { name: "Pan de elote", note: "Sweet corn cake", price: "$4", soldOut: true },
      ],
    },
    screens: ["Hoy / Today", "Visit"],
  },
  {
    slug: "late-plate",
    name: "Late Plate",
    category: "Independent restaurant",
    kind: "Restaurant",
    year: "2026",
    summary:
      "A moody, menu-first website for a twenty-seat restaurant that only does dinner.",
    intro:
      "Late Plate is an imagined chef-owned restaurant with twenty seats, a short menu that changes weekly and a kitchen that stays open later than anyone else on the street.",
    brief:
      "Small restaurants often pay for heavy reservation widgets that look nothing like the room. The site needed to feel like the restaurant after dark, put the menu first and make booking a table feel calm.",
    idea:
      "The whole site is set like a printed dinner menu: one column, generous margins, a single warm accent. Booking is a three-step sheet that asks for party size first, then shows only the times that are actually open.",
    theme: {
      paper: "#2A1B2C",
      ink: "#F3E7D7",
      accent: "#EE6247",
      accent2: "#4A3450",
      muted: "#BCA9B8",
    },
    palette: [
      { name: "Aubergine", hex: "#2A1B2C" },
      { name: "Chili", hex: "#EE6247" },
      { name: "Candlelight", hex: "#F3E7D7" },
      { name: "Plum", hex: "#4A3450" },
    ],
    type: {
      display: "Gloock",
      text: "DM Mono",
      note: "A dramatic serif with a typewritten mono, like a menu printed that afternoon.",
    },
    details: [
      {
        title: "Menu first",
        body: "This week’s menu is the homepage. No carousel, no ‘explore our story’ button standing in the way.",
      },
      {
        title: "Calm booking",
        body: "Party size, then date, then the times that are free. Waitlist and walk-in policy explained in one sentence.",
      },
      {
        title: "Readable in the dark",
        body: "Contrast and type sizes are tested for dim rooms and phones turned all the way down.",
      },
    ],
    menu: {
      heading: "This week",
      items: [
        { name: "Charred leeks", note: "Romesco · hazelnut", price: "14" },
        { name: "Hand-cut tagliatelle", note: "Brown butter · sage", price: "24" },
        { name: "Half chicken", note: "Salsa verde · fries", price: "29" },
        { name: "Burnt honey tart", note: "Crème fraîche", price: "11" },
      ],
    },
    screens: ["This week", "Book a table"],
  },
];

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}

export function getNextProject(slug: string) {
  const i = projects.findIndex((p) => p.slug === slug);
  return projects[(i + 1) % projects.length];
}
