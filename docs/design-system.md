# Bizaffix design system: Care wayfinding

Bizaffix builds software, and healthcare is the industry it leads with. Visitors are healthcare operators, founders and product leads choosing a build partner. The site has one job: earn their trust and get them to book a call.

## Concept

Hospitals guide people with clear signs, colour-coded zones and painted floor lines ("follow the blue line"). Bizaffix does the same work in software: it connects patients, providers and data so nobody gets lost. The site borrows that language:

- **Signage type.** One humanist grotesk, set semi-condensed and large for headings, like a wayfinding sign.
- **The route line.** One blue line that connects things: the hero map, the process route, the closing call to action. It always means "this connects to that".
- **Stations.** Hexagons, taken from the Bizaffix logo, mark the points on a route and the zone markers on each section.
- **Idea → Reality.** The legacy tagline, "From idea to reality", is the journey every route takes.

Spend boldness once: the hero route map is the memorable moment. Everything else stays calm, white and disciplined.

## Colour

| Token | Hex | Role |
|---|---|---|
| `text` (Ink) | `#0d121f` | Text, dark buttons |
| `page-white` (Clinic white) | `#ffffff` | Page |
| `bg-subtle` (Ward) | `#f5f7fb` | Quiet zones, media wells |
| `brand` (Route blue) | `#2f5bea` | The route line, links, the brand button |
| `surface-brand-deep` (Night route) | `#14245f` | The healthcare zone and the closing panel |
| `accent` (Signal gold) | `#f5c84c` | "You are here": the active station only |

Borders are cool greys (`border-subtle #ebeff5`, `border #dde3ec`, `border-strong #c3ccd9`). Gold never fills large areas. Status colours (`success`, `error`) are only for status.

## Type

One family: **Instrument Sans** (Google Fonts, variable `wdth 75–100`, `wght 400–700`).

| Role | Class | Size | Weight / width |
|---|---|---|---|
| Display (home hero) | `text-display` | 48 → 100px | 600, 80% wide |
| Page title (inner h1) | `text-page-title` | 44 → 80px | 600, 82% wide |
| Section title (h2) | `text-section-title` | 34 → 60px | 600, 85% wide |
| Title (h3) | `text-title` | 22 → 28px | 600, 92% wide |
| Card title (h4) | `text-card-title` | 19 → 22px | 600 |
| Body large | `text-body-large` | 18 → 20px | 400 |
| Body | `text-body` | 17px | 400 |
| Small | `text-body-small` | 15px | 400 |
| Label | `text-eyebrow` | 14px | 500, sentence case |
| Caption | `text-caption` | 13px | 400 |

Headings are ink. No single accented word or phrase in a headline. Labels are sentence case: no all caps, no monospace. Numbers use `tabular-nums`. Keep body lines under about 70 characters (`measure`, `max-w-[38rem]`).

## Shape and depth

Radius follows hierarchy rather than one value everywhere:

- Feature media and dark panels: `rounded-2xl` (36px)
- Cards and media inside sections: `rounded-xl` (28px)
- Small surfaces such as menus and inputs: `rounded-lg` (20px)
- Controls (buttons, chips, filters): `rounded-pill`

Shadows are only for things that float (the header, menus, the hero map's active detail). Flat content sits on borders or tone, not shadows.

## Components

All in `src/components`:

- `ui/HexMark`: the station hexagon. Variants are `station` (white with an ink ring), `active` (gold), `solid` (brand) and `outline`.
- `ui/Wayfinder`: the zone marker at the top of a major section. Hexagon, label, a rule that runs to the edge, and optional meta (for example "5 solutions"). Use it only on sections a visitor might navigate to, never as decoration above every heading.
- `common/SectionHeader`: the standard section intro. Title on the left, supporting text on the right on wide screens, plus an optional action.
- `layout/PageHero`: the standard top of every inner page. Wayfinder, page title, intro, actions, and an optional aside.
- `ui/Button`: `primary` (ink), `brand` (blue), `secondary` (outline), `ghost`. Pill shape, sentence-case text, no arrow glyphs.
- `ui/TextLink`: an underlined text link. The underline thickens on hover. No arrow glyph.
- `layout/ConnectBanner`: the closing "destination", where the route line ends at a station next to Book a call.

- `ui/HexMonogram`: the stand-in for a portrait (hexagon with initials) until real photos exist.
- `ui/BookCallLink`: every Book a call goes through this. It uses the Google booking page when `VITE_BOOK_CALL_URL` is set, otherwise `/contact`, and on `/contact` it scrolls to the form.

### Rules that keep it consistent

- **Buttons.** A page's main action is `primary` (ink). Blue (`brand`) is only for the header's Book a call, so it stays the one always-visible conversion button. On dark panels, use `inverse` and `inverse-outline`.
- **Section intros.** Use `SectionHeader`: title top-left, description top-right, so long descriptions don't leave a hole above the title. Use `PageHero` for every inner page top. Don't hand-roll either.
- **`cn` joins classes; it does not merge them.** A `className` that conflicts with a component's own class (for example `min-h-0` against `min-h-(--button-height)`) wins or loses by stylesheet order, not by order of writing. Change size or behaviour through a prop instead (`TextLink inline`, `Button size`).
- **Framer Motion `m.*` components need a `LazyMotion` ancestor** (`domAnimation`). Without one they don't animate, and the route map's line stays undrawn. `domAnimation` has no layout animations, so don't rely on `layoutId`.
- **Containers.** Use `Container variant="wide"` for sections and `reading` for long text. Sections use `section-y`.
- **Images.** Several project boards in `src/assets` are 4–15 MB SVGs with embedded bitmaps. Prefer the PNG boards or the drawn `WorkStill` product stills, and export new boards as WebP or AVIF under about 500 KB. Never put a stock photo next to a named person.

## Background: one ambient layer

The whole site shares one background: `src/components/motion/AmbientBackground.tsx`, mounted once in `SiteLayout`. It is a single fixed `<canvas>` (`position: fixed; inset: 0; z-index: -1; pointer-events: none`).

- **What it draws:**
  - a sparse hexagon lattice, whose cells brighten and fade in slow travelling waves;
  - three thin flowing lines threading through the lattice;
  - a pale blue glow at the top right.
- **Colours:** `#2563EB` and `#93C5FD` at low opacity.
- **Scroll:** the lattice moves at 12% of the scroll distance. This is one layer of parallax.
- **Performance:** it uses `requestAnimationFrame`, is capped at 30 fps and at a device pixel ratio of 2, and pauses on its own in background tabs.
- **Reduced motion:** with `prefers-reduced-motion` on, it shows a still frame that is redrawn only on scroll or resize.

Rules:
- Homepage sections, the closing section and the footer have transparent backgrounds, so the canvas shows through.
- Content cards (image wells, the services board, step cards, the closing panel) keep their own surfaces.
- Never add decorative shapes inside sections. All ambient motion lives in this one layer.
- `body` is transparent; the page white is on `html`, below the canvas.

Brand sheet colours: blue `#234ED1`, logo cyan `#009BDF`, gradient `#708ADA` to `#3F64D4`, yellow `#FDE36E`, periwinkle `#B3C5FA`, cream `#FFFCF0`, and the blue blur (`#C4DAF3`, `#A7BCED`, `#4B71E9`). The brand typeface is Dazzed (licensed). Add its woff2 files with an `@font-face` rule to switch it on; Instrument Sans stands in until then.

## Motion

- One orchestrated moment per page at most. On the homepage it is the route map: the line draws in and the stations arrive.
- Everything else moves only in answer to the visitor: hover, focus, open, select.
- No fade-and-slide on every section. No infinite decorative loops.
- `prefers-reduced-motion` turns off all non-essential motion.

## Writing

- All public copy comes from `content/legacy-site.md` (see `.cursor/rules/site-copy.mdc`). No invented clients, numbers, ratings or products.
- Sentence case everywhere. Plain verbs. The main call to action is **Book a call**.
- Separate metadata with commas or line breaks, not " · ".
- Don't put "→" in link or button text.

## Quality floor

- Works at 360px wide, with no horizontal scroll.
- Visible keyboard focus on everything interactive (`focus-visible:outline-brand`).
- Text contrast passes WCAG AA, including `text-inverse-muted` on dark panels.
- Images have real alt text. No stock photos standing in for named people.
