# Borrowed Gestures — first coded prototype

A mobile-first static website for Interaction Design 1 (UT Austin). Visitors explore ordinary objects in and around the Art Building, such as a handrail, a door handle, or a bench edge, and the small bodily gestures those objects support.

> **Status: prototype with demonstration content.** All five objects are examples. Their locations, photographs, observations, and histories are **not** verified. The pages say so wherever it matters.

## 1. What it does: the core loop

**Choose a clue → find the object → look closely → explore a gesture → reveal observations and an imagined scene → continue exploring.**

The whole visit is meant to take about 20 minutes outdoors, mostly away from the screen. The website never senses what the visitor does. The **Reveal** button just shows content that is already on the page.

## 2. Files and how they connect

```text
borrowed-gestures/
├── index.html     Collection page: intro, "Where to look" (map or placeholder + stop list), filter, cards
├── object.html    ONE shared detail page. object.html?id=handrail shows the handrail record, etc.
├── styles.css     All styling, in 8 commented sections, with colour variables at the top
├── data.js        ALL content: SITE settings + the OBJECTS array (five records)
├── script.js      All behaviour for both pages
├── assets/        Ten placeholder SVG line illustrations (detail + context for each object)
├── README.md      This file
└── WIREFLOW.md    What to sketch for the paper wireflow
```

Both HTML pages load `data.js` and then `script.js` with `defer`, so the scripts run in that order after the HTML is parsed. No server, build step, framework, or `fetch()` is needed. The bottom of `script.js` checks which page it is on: if `#collection-grid` exists it is the collection page, and if `#object-page` exists it is the detail page.

## 3. Preview locally

The simplest way is to double-click `index.html` to open it in a browser.

For behaviour closer to Neocities, run a small local server from this folder:

```bash
python3 -m http.server 8000
```

Then open <http://localhost:8000>.

## 4. Replacing demonstration content

Everything you edit is in **`data.js`**. Each object is one `{ ... }` record:

| Field | What to put there |
|---|---|
| `id` | Short lowercase name used in the address, e.g. `"handrail"`. Must be unique. |
| `number` | Specimen label, e.g. `"01"`. |
| `title`, `objectType`, `movementCategory` | Evocative title, literal object name, and one of `Grip`, `Glide`, `Pause`, `Pass`. |
| `contentStatus` | `"demo"` shows "Example encounter — object and location unverified." Set it to `"verified"` once the object is real and checked. |
| `cardClue` | One-line clue on the card. |
| `locationDescription` | Text directions: a starting landmark, where to look, and the identifying feature. If you use "left" or "right", say which way the person is facing. `null` shows "Exact location pending field observation". |
| `latitude`, `longitude` | Numbers, or `null` until measured on site. |
| `detailImage`, `contextImage` | Paths such as `"assets/handrail-detail.jpg"`. |
| `detailImageAlt`, `contextImageAlt` | Describe what the photo shows that matters for finding the detail. |
| `imageIsIllustration` | `true` shows "Illustration — replace with site photograph." Set it to `false` for your own photographs. |
| `findPrompt`, `gesturePrompt`, `alternativePrompt` | The three encounter prompts. |
| `observation`, `observationStatus` | Your factual field observation. `observationStatus: "demo"` shows a "Demonstration note" tag; use `"field"` for real notes. If the cause of a mark is unknown, say so. |
| `imaginedMoment` | 35–65 words of fiction. It is always labelled "An imagined moment". |
| `futureInvitation` | One gentle sentence. |
| `observedOn`, `material`, `photoCredit`, `sourceNote` | Use `null` when unknown. The page shows "Not yet recorded" instead. |

**Photos:** put them in `assets/`, keep the filenames lowercase with no spaces (`bench-detail.jpg`), and resize them to about 1200px wide so they load quickly outdoors.

**Adding a sixth object:** copy a record, give it a new `id` and `number`, and add the comma between records. The card, stop list, and detail page appear automatically.

## 5. How the map activates

`initializeMap()` in `script.js` creates the Leaflet map **only if** at least one record has numeric coordinates **and** the Leaflet library loaded.

- **0 verified objects:** the "Locations to be verified" panel shows. This is the current state, and no fake markers are drawn.
- **1 verified object:** the map centres on it at `SITE.singleMarkerZoom`.
- **2 or more:** the map fits its bounds around all of them.
- **Filter changes:** `updateMapMarkers()` redraws only the markers for matching objects.
- **Leaflet fails to load:** a "Map unavailable" message points to the stop list, and the cards and list still work.

To activate it, measure each spot on site (for example, with a long-press in a maps app while standing at the object) and enter the numbers:

```js
latitude: 30.28xxx,
longitude: -97.73xxx,
```

Each marker shows its specimen number. Its popup shows the title, the location text, and a link to the detail page. Scroll-wheel zoom is off, and one-finger dragging is off on phones, so the page scrolls past the map normally.

`SITE.mapCenter` is deliberately `null`. A building centre has not been verified from a reliable source. Even with one, it would not verify the position of an individual handle or seat.

## 6. Publishing on Neocities

1. Sign in to your Neocities dashboard yourself.
2. Upload `index.html`, `object.html`, `styles.css`, `data.js`, `script.js`, and the **`assets` folder** with the same names. Create a folder called `assets` in the dashboard and upload the SVGs or photos into it.
3. Keep paths exactly the same. Filenames are case-sensitive online.
4. Open your site address and test a card link and the Reveal button.

`README.md` and `WIREFLOW.md` do not need to be uploaded.

## 7. The main JavaScript, explained

| Function | What it does |
|---|---|
| `renderCards(objects)` | Empties the grid, then builds one `<li>` card per object. The title link is stretched over the whole card with CSS (`.card-link::after`), which gives one tab stop per card. |
| `filterObjects(category)` | Uses **`.filter()`**, which returns a *new* array with only the items whose `movementCategory` matches. `"all"` returns everything. |
| `handleFilterChange(event)` | Runs from an **event listener** on the select's `change` event. It re-renders the cards and markers, and updates the polite live region ("Showing 2 of 5 objects."). Focus stays where it is. |
| `renderStopList()` | Builds the plain text list of stops, which is the non-map way to orient. |
| `initializeMap()` / `updateMapMarkers()` | See section 5. |
| `setUpObjectPage()` | Reads the **URL query parameter** with `new URLSearchParams(window.location.search).get("id")`, then uses **`.find()`** to get the first record with that id. If none matches, `showNotFound()` shows a friendly message and a link back. |
| `renderObjectPage(object)` | Fills each element by its id with `textContent`, sets the document title, and shows or hides the demo and illustration labels. |
| `toggleStory()` | Reads the button's `aria-expanded`, then flips it. It also toggles the panel's `hidden` attribute, so hidden content can't be reached with Tab. It changes the button label and puts a short message in a polite live region. It never moves focus or scrolls. Reloading the page resets it. |
| `textOrFallback(value, fallback)` | Makes sure `null` never appears on screen. |

`hidden` is set directly as a property (`element.hidden = true`). In CSS, `.card:focus-within` and `:focus-visible` provide the focus rings.

## 8. External dependencies

- **Leaflet 1.9.4** (CSS + JS) from `unpkg.com`, with Subresource Integrity hashes. These were checked against the official npm package and match the Leaflet quick-start: <https://leafletjs.com/examples/quick-start/>.
- **OpenStreetMap tiles** (`tile.openstreetmap.org`), used only once coordinates exist. The attribution is kept.

Both need network access. All core content (`data.js`, pages, and illustrations) is local and works without them. Fonts are system fonts, so there is no font download.

## 9. What remains before a real outdoor test

- [ ] Choose 5–10 real objects in or immediately around ART that suit gentle, optional touch. Avoid artworks, plants, sharp, moving, fragile, or damaged things.
- [ ] Take detail and context photographs, then replace the SVGs and set `imageIsIllustration: false`.
- [ ] Write real alt text for each photograph.
- [ ] Write field observations, dates, materials, and photo credits, and state uncertainty honestly.
- [ ] Write text directions from a clear landmark for each stop.
- [ ] Measure coordinates on site. The map turns on automatically.
- [ ] Check access: building hours, whether areas are public, and which routes and surfaces are actually step-free. Don't publish claims you haven't verified.
- [ ] Walk the route yourself and time it, to see whether 20 minutes is realistic.
- [ ] Replace or remove record 05 if no suitable repair exists.
- [ ] Re-check contrast, alt text, and layout with real photos in bright daylight.

## 10. Outdoor test checklist (with one or two people)

For each object, watch and then ask:

- [ ] Could they **find the object** from the clue and image? How long did it take, and did they need "Need a wider view?"
- [ ] Did they **understand the gesture** prompt without help?
- [ ] Did they notice and feel free to choose **the alternative** (looking or tracing in the air)?
- [ ] Could they tell **fact from fiction**, the "What we can see" observation from "An imagined moment"?
- [ ] Afterwards: did the encounter **change how they relate to the object**? Would they notice it next time?
- [ ] Was the screen readable in sunlight? Were touch targets easy to hit while standing?

## Checks performed on this prototype

These were run in headless Chromium against a local server:

- Five cards render, all ten illustrations load, and there were no failed requests or console errors on either page.
- Each card opens the correct record. Clicking the card body, not just the title, also works.
- The filter counts are correct (All 5, Grip 1, Glide 1, Pause 2, Pass 1), and the live-region text updates.
- Reveal and collapse work with mouse click, Enter, and Space, and `aria-expanded` matches the panel visibility.
- The invalid-id and missing-id pages show "We couldn't find that object" with a link back.
- There is no horizontal scroll at 320px, 390px, or 1280px, or at a 200% root font size.
- The tab order is logical with one stop per card, and headings are in order (h1 → h2 → h3).
- With coordinates injected for testing, the map shows 1 or 3 markers, filtering redraws them, and popups link to the right page. With the coordinates added but Leaflet blocked, "Map unavailable" shows and the content still works.
- Colour contrast: body text is 16:1, secondary text is 9.3:1, the rust accent on the background is 7.0:1, and white on rust buttons is 7.7:1.

**Not yet checked:** real screen readers (VoiceOver, TalkBack, NVDA), real phones outdoors, browser zoom on iOS Safari, and the live map with real tiles. This prototype has not been certified as accessible.
