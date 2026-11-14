# Ventura — Design System (redesign v1)

First-pass redesign. The direction is **editorial travel journal**: warm paper, ink type,
one confident brand colour, photography given room to breathe. Everything below is
driven by tokens so the next styling pass is a matter of changing values, not components.

## Where styling lives

| What | File |
| --- | --- |
| Colour, type, radius, shadow, layout tokens | `src/index.css` (`:root` and `.dark`) |
| Reusable recipes (`.surface`, `.glass`, `.eyebrow`, …) | `src/index.css` → `@layer components` |
| Token → Tailwind name mapping | `tailwind.config.ts` |
| Fonts (self-hosted, no CDN) | `src/main.tsx` imports + `--font-*` tokens |
| Shared building blocks | `src/components/kit/` |
| shadcn primitives (restyled) | `src/components/ui/` |

Feature code uses **no raw colours** (`bg-white`, `text-neutral-900`, `green-500`, hex…).
If you find yourself needing one, add a token instead.

## Tokens

### Colour
| Token | Role | Light |
| --- | --- | --- |
| `--background` | Paper | `40 33% 97%` |
| `--foreground` | Ink text | `30 12% 10%` |
| `--card` | Raised surface | white |
| `--primary` | Brand ultramarine (evolved from `#7061E8`) | `238 70% 56%` |
| `--secondary` / `--muted` / `--accent` | Sand fills, hovers | `38 26% 91–93%` |
| `--ink` / `--ink-foreground` / `--ink-muted` | Dark surfaces: nav dock, hero tiles, toasts | |
| `--scrim` / `--on-image` | Photo overlays + text on photos (theme-independent) | |
| `--highlight` | Ratings, warm accents | saffron |
| `--primary-2` | Second gradient stop, used only for AI moments (`.bg-brand-gradient`, `.shimmer-bar`) | violet |
| `--success` `--warning` `--destructive` `--info` | Status, safety map, entry types | |
| `--cat-events` `--cat-food` `--cat-cafes` | Map marker colours | |

All colours are bare HSL channels, so opacity modifiers work: `bg-primary/10`.

### Type
| Token / class | Use |
| --- | --- |
| `--font-display` · `.text-display` | Fraunces — page titles, hero names, big numbers |
| `.text-title` | Fraunces at text optical size — section and card titles |
| `--font-sans` | Geist — UI and body |
| `--font-mono` · `.eyebrow` · `.meta` | Geist Mono — labels, times, counts |

### Shape & depth
- `--radius` (1rem) drives every radius: `rounded-sm/md/lg/xl/2xl/3xl` are offsets from it.
- `--shadow-xs … --shadow-lg`, `--shadow-float` — warm-tinted, soft.
- `--dock-height`, `--dock-offset` — the floating nav; `.pb-dock` / `.bottom-dock` keep content and
  fixed buttons clear of it.

## Recipes (`@layer components`)
- `.surface` — white card, hairline border, soft shadow. Default container.
- `.surface-sunken` — sand fill, no border.
- `.surface-ink` — dark card for primary moments (Create itinerary, Meet now, totals).
- `.glass` — floating control over the map.
- `.glass-dark` — floating control over photography.
- `.scrim-b` / `.scrim-t` — photo gradients for legible overlaid text.
- `.eyebrow`, `.meta` — mono labels.

## Kit (`src/components/kit`)
`SmartImage` (never shows a broken image), `Chip` / `ChipRow`, `Segmented`, `SectionHeader`,
`TopBar`, `MetaItem` / `MetaDot`, `Rating`, `EmptyState`, `BottomSheet`, `StickyFooter`, `Rail`.

## Common restyles

- **Change the brand colour:** edit `--primary` and `--ring` (and `--cat-events` if markers should follow).
- **Go back to the original lavender:** `--primary: 248 66% 65%;`
- **Swap fonts:** install another `@fontsource-variable/*` package, import it in `src/main.tsx`,
  and point `--font-display` / `--font-sans` / `--font-mono` at it.
- **Softer or sharper corners:** change `--radius`.
- **Light nav instead of ink:** in `Layout.tsx` swap `bg-ink` → `glass`, and the active pill to `bg-ink text-ink-foreground`.
- **Dark mode:** a full `.dark` token set exists; add `class="dark"` to `<html>` to try it.
  The camera landmark panel already uses it for an immersive look.
- **Map tint:** the base map is desaturated with `[filter:saturate(0.55)_sepia(0.06)]` in `MapPage.tsx`.

## Trip planner (v2)

Ported from the trip-planner handoff and redrawn in Ventura's language.

| Route | Screen |
| --- | --- |
| `/plan-trip` | Entry: guided or AI chat, resume, last plan, saved trips |
| `/plan-trip/guided` | Nine questions, one per screen, progress auto-saved |
| `/plan-trip/results` | World dot map with match-weighted markers, top three, other fits |
| `/plan-trip/chat` | AI chat with a six-detail tracker, two-stage generation |
| `/plan-trip/options` | Three AI itineraries, a separator, three traveler favourites |
| `/itinerary/:id` | Planned trips open in the regular itinerary screen, with save and edit |

Code lives in `src/features/planner/` (catalog, matching, itinerary builder, trips store, AI providers),
`src/pages/planner/` and `src/components/planner/`. Saved trips appear on the Profile "Saved" tab.

**AI providers** (`src/features/planner/ai/`), chosen once per session:
1. **Claude**: when a host bridge (`window.__venturaHost`) or an artifact runtime (`window.claude`) is present.
2. **Server**: the handoff's `travel-chat` edge function (`supabase/functions/travel-chat`) when
   `VITE_SUPABASE_URL` / `VITE_SUPABASE_PUBLISHABLE_KEY` are set. Set `LOVABLE_API_KEY` (or swap in any
   OpenAI-compatible endpoint) on the function.
3. **Offline planner**: keyword-based, uses the destination catalog. Always works; also the fallback if a
   viewer declines Claude.

All three follow the handoff rules: six criteria before generating, one question at a time, no
"I will now generate", stage 1 (AI itineraries) then stage 2 (traveler itineraries).

## Interactive prototype build

`npm run build:prototype` writes `dist-prototype/`: relative paths, in-memory routing, all imagery
bundled. It starts at `/map`, or at the route in the embedding iframe's `data-start` attribute
(or `window.__VENTURA_START__`). This is what the design review's flows canvas plays.

## Behaviour preserved from the handoff
- Dock hidden on `/camera`, `/itinerary/:id`, `/destinations/:id`, `/bookings/:id`.
- Itinerary detail back button → `/profile`.
- Map: filters are exclusive; markers only after a filter; sheet only on marker tap, with that marker's data.
- Companion cards: tapping anywhere opens the profile.
- Fixed buttons sit above the dock (Banner Grid "Save itinerary" uses `.bottom-dock`).
- Itinerary detail meta: avatar + name row, then days · stops · rating on one line.

## Fixes made along the way
- App no longer crashes without Supabase env vars; image hooks fall back gracefully.
- Broken remote images render a quiet placeholder (`SmartImage`); the Edinburgh hero uses the bundled photo.
- `/src/assets/...` string paths replaced with imports (they broke production builds).
- "Meet now" booking path no longer dead-ends (defaults to the nearest public meeting point).
- New bookings show on the Guides page immediately (bookings hook instances stay in sync).
- Profile save counts no longer change on every render.
- Map filter row scrolls instead of clipping "Cafés"; action buttons no longer clip.
- Unused `App.css` removed.
- Mock photography bundled in `src/assets/photos` (look up with `photo(id)` from `src/lib/photos.ts`);
  PNG assets converted to sized JPEGs (16 MB → 1.1 MB).
- Storage access goes through `src/lib/storage.ts`, which never throws.
- New screens scroll to the top.

## Copy changes (easy to revert)
Collections on the Itineraries page now pair a category eyebrow with a headline
("Nightlife" / *After dark*); Guides empty state, booking steps and Plan Trip have rewritten
microcopy. Search the page files for the strings to change them back.
