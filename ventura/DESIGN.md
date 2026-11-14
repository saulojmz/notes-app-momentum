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

## Copy changes (easy to revert)
Collections on the Itineraries page now pair a category eyebrow with a headline
("Nightlife" / *After dark*); Guides empty state, booking steps and Plan Trip have rewritten
microcopy. Search the page files for the strings to change them back.
