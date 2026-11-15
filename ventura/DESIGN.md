# Ventura — Design System (v3, unslopped)

Direction, set during the unslop pass:

- **Product.** A travel companion that plans trips, guides you around a city and connects you with local guides.
- **Character.** Calm, exact, a little warm.
- **World.** Paper maps and window light. Neutral stone surfaces, cobalt map ink, photography carries the colour.
- **Moments.** Destination photography, the map, the match score on the world dot map.
- **Signature.** The dashed route line: progress through the planner and booking flows (`RouteProgress`),
  and the rail between stops on an itinerary day (`.route-line-v`).

Everything is token-driven, so the next styling pass is a matter of changing values, not components.

## Where styling lives

| What | File |
| --- | --- |
| Colour, type, radius, shadow, layout tokens | `src/index.css` (`:root` and `.dark`) |
| Reusable recipes (`.surface`, `.glass`, `.eyebrow`, `.route-line`, …) | `src/index.css` → `@layer components` |
| Token → Tailwind name mapping | `tailwind.config.ts` |
| Fonts (self-hosted, no CDN) | `src/main.tsx` imports + `--font-*` tokens |
| Shared building blocks | `src/components/kit/` |
| shadcn primitives (restyled) | `src/components/ui/` |

Feature code uses **no raw colours** (`bg-white`, `text-neutral-900`, `green-500`, hex…).
If you find yourself needing one, add a token instead.

## Rules

- One accent (`--primary`, cobalt). It marks the main action, the selection, and the one figure that matters
  (match score, current step). Icon tiles, category labels, list numbers stay neutral.
- No hue gradients, glows, sparkles or emoji. Icons are lucide, 1.5 stroke, in the text colour.
- Sentence case, no tracked uppercase labels. Weights 400 and 500 only.
- No exclamation marks; headlines, labels, buttons, toasts end without a period.
- Motion uses one curve (`--ease`), no hover scaling, nothing loops unless it is live
  (your location on the map, the camera analysing).
- Radii: controls 10px (`--radius-control`), chips 8px (`--radius-chip`), cards 12–16px, sheets/dialogs 20px.

## Tokens

### Colour
| Token | Role | Light |
| --- | --- | --- |
| `--background` | Stone paper | `60 9% 97%` |
| `--foreground` / `--ink` | Ink text, selected tiles, user chat bubbles | `60 4% 10%` |
| `--card` | Raised surface | white |
| `--primary` | Cobalt map ink, the only accent | `224 71% 48%` |
| `--secondary` / `--muted` / `--accent` | Neutral fills, hovers | `60 6–7% 92–93%` |
| `--border` / `--input` | Hairlines | `60 5% 85–89%` |
| `--scrim` / `--on-image` | Photo overlays + text on photos (theme-independent) | |
| `--highlight` | Rating stars only | saffron |
| `--success` `--warning` `--destructive` `--info` | Status, safety map | toned down |
| `--cat-events` `--cat-food` `--cat-cafes` | Map marker colours (each means a layer) | |

### Type
| Token / class | Use |
| --- | --- |
| `--font-display` · `.text-display` | Instrument Serif 400 — page titles (36px), hero names, key figures |
| `--font-sans` · `.text-title` | Instrument Sans — UI, body, card and section titles (500) |
| `.eyebrow`, `.meta` | 13px muted sans, sentence case |
| `tabular-nums` | Every time, price, count and score |

### Shape & depth
- `--radius` 12px, `--radius-control` 10px, `--radius-chip` 8px.
- `--shadow-xs … --shadow-lg`, `--shadow-float` — neutral, soft, small. Floating controls over the map only.
- `--dock-height` — the bottom tab bar; `.pb-dock` / `.bottom-dock` keep content and fixed buttons clear of it.

## Recipes (`@layer components`)
- `.surface` — white card, hairline border, faint shadow. Default container.
- `.surface-sunken` — neutral fill, no border.
- `.surface-ink` — kept as an alias of `.surface` for compatibility.
- `.glass` — floating control over the map.
- `.glass-dark` — floating control over photography.
- `.scrim-b` / `.scrim-t` — photo gradients for legible overlaid text.
- `.route-line` / `.route-line-v` — the dashed signature line.
- `.progress-run` — indeterminate progress track (generating itineraries).

## Kit (`src/components/kit`)
`SmartImage` (never shows a broken image), `Chip` / `ChipRow`, `Segmented`, `SectionHeader`,
`TopBar`, `MetaItem` / `MetaDot`, `Rating`, `EmptyState`, `BottomSheet`, `StickyFooter`, `Rail`,
`RouteProgress` (the signature stepper).

## Common restyles

- **Change the brand colour:** edit `--primary` and `--ring` (and `--cat-events` if markers should follow).
- **Swap fonts:** install another `@fontsource-variable/*` package, import it in `src/main.tsx`,
  and point `--font-display` / `--font-sans` / `--font-mono` at it.
- **Softer or sharper corners:** change `--radius`.
- **Nav:** `Layout.tsx` renders a standard bottom tab bar; the active tab takes the accent.
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
