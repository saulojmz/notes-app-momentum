# Proof Studio website

Marketing site for a small, independent web design studio for coffee shops, roasters, bakeries, cafés and neighborhood restaurants. “Proof” is a placeholder name: it nods both to bread proofing and to design proofs, and it changes in one file.

Built with Next.js (App Router), React, TypeScript and Tailwind CSS v4. There are no animation or icon libraries. Motion uses CSS plus one small IntersectionObserver component, and the icons are hand-drawn SVG.

## Running it

```bash
cd studio
npm install
npm run dev      # http://localhost:3000
npm run build    # production build (every page is statically generated)
npm run start    # serve the production build
npm run lint
```

## Structure

```
src/
  app/
    layout.tsx            Fonts, metadata, nav, footer, skip link
    page.tsx              Homepage: Hero → Work → Services → About → Process → Contact
    work/[slug]/page.tsx  Case study page for each concept project
    fonts.ts              Self-hosted fonts (next/font/local)
    globals.css           Design tokens, type utilities, motion, reduced-motion rules
    sitemap.ts, robots.ts, icon.svg, not-found.tsx
  content/
    site.ts               Studio name, founder, email, socials, nav
    projects.ts           The four concept projects (copy, palettes, menus)
  components/
    Hero, Work, Services, About, Process, Contact, ContactForm, Footer, Nav …
    mocks/                Concept website screens drawn in HTML/SVG
  fonts/                  woff2 files (all SIL Open Font License)
```

## Design system

| | |
|---|---|
| Display | **Fraunces**, variable, using its SOFT and WONK axes. Upright for statements, wonky italic for the accent word in each headline. |
| Text | **Instrument Sans** |
| Labels | **DM Mono**, uppercase and tracked, for editorial running heads like “(02) — Services” |
| Palette | Paper `#f3ebdd`, Oat `#e8dcc7`, Espresso ink `#2a1c15`, Cocoa `#5e4334`, Butter `#f1c95b`, Terracotta `#b2431c`, Pistachio `#b9c48c` |
| Concept fonts | Bricolage Grotesque and Gloock, used only inside the project screens so each concept has its own voice |

Tokens live in `src/app/globals.css` under `@theme`. Each section opens with a numbered running head, a large Fraunces headline, and an italic terracotta “payoff” word.

## Before publishing: replace these

1. **Studio details** in `src/content/site.ts`: `name`, `wordmark`, `email` (`hello@proofstudio.co` is a placeholder; check that you own the domain), `url`, and the social links (Instagram and LinkedIn currently point to the sites’ homepages).
2. **Founder portrait.** In `src/components/About.tsx`, pass `src` to `<Portrait />` (e.g. `<Portrait src="/saulo.jpg" />`, with the photo in `public/`). Until then an illustrated placeholder holds the space.
3. **About copy.** Check the two paragraphs in `About.tsx` sound like you.
4. **Process timings and promises** in `Process.tsx` (“about six weeks”, “a month of small tweaks”) and the “two working days” reply time in `Contact.tsx` / `ContactForm.tsx`. Change them to match how you actually work.
5. **Studio hours** in `Footer.tsx`.
6. **Contact form delivery.** With no backend, the form opens the visitor’s email app with everything pre-filled. To collect submissions directly, post the form data to a service (Formspree, Basin, Resend through a route handler, etc.) in `ContactForm.tsx`.
7. **Portfolio.** The four projects are *self-initiated concepts* and are labelled as such on every card and case study. Replace or supplement them in `src/content/projects.ts` as real work comes in. Real projects will want photography: swap the illustrated mockups in `components/mocks/` for screenshots or photos with `next/image`.
8. **Social share image.** Add `src/app/opengraph-image.png` (1200×630) for nicer link previews.

## Accessibility and motion

- Semantic landmarks, a skip link, a single `h1` per page, and labelled form controls with inline, announced errors.
- The mobile menu traps focus, closes on Escape, and returns focus to its toggle.
- axe-core (WCAG 2.1 AA) reports zero violations on every page, including the text inside the concept screens.
- Every animation respects `prefers-reduced-motion`. Scroll reveals only hide content once JavaScript has run, so nothing is invisible without JS.
