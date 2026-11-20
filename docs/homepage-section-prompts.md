# Homepage section prompts

Prompts for building new sections in the style of the Bizaffix homepage ("Engineered on paper").
Paste **Part 1 (theme brief)** first, then the prompt for the section you want to copy, then your own
content. Each section prompt says what the section is, how it is laid out, how it moves, and which
files to read as the reference.

---

## Part 1: Theme brief (paste this before any section prompt)

```text
You are adding a section to the Bizaffix homepage (React 19 + TypeScript + Tailwind v4 + Vite,
framer-motion via LazyMotion/`m`, GSAP ScrollTrigger only for the horizontal work rail).
The homepage theme is called "Engineered on paper": each section is a full-width SHEET OF PAPER
with technical print details (grid, crop marks, uppercase spec labels, figure numbers), and
physical paper effects (grain, pushpins, tape, torn edges, slightly rotated cards with navy shadows).

READ FIRST
- src/styles/paper-home.css: every .ph-* token (scoped to .paper-home)
- src/components/paper/kit.tsx: PaperSection, tones, PaperButton, PaperLink, Arrow
- src/components/paper/paper.tsx: PaperPin, CropMarks, usePaperGrain
- src/components/paper/TornEdge.tsx: scroll-driven torn bottom edge
- src/components/motion/Reveal.tsx: Reveal, RevealLines, RevealText, CountUp, useRevealed
- src/lib/paper-theme.ts: paperInk colours and paperFont
- src/pages/HomePage.tsx: section order and the colour rhythm

PALETTE (brand only, never add new colours)
blue #234ED1 · navy #0D121F · night #14245F · yellow #FDE36E · cream #FFFCF0
periwinkle #B3C5FA · light blue #E7EDFC · grey #5A6472 · border #DDE3EC · white
Shadows are always navy (rgb 10 26 58), never grey. Use the CSS vars: var(--ph-blue), etc.

SHEET TONES (PaperSection tone=...): blue, night, yellow, white, cream, periwinkle.
`tones[tone]` gives: sheet bg/text, `muted` text that passes AA, `rule` border colour,
`grid` class, and `button` ('navy' on blue/yellow/periwinkle, 'blue' on light sheets).
Rule: never put two sheets of the same tone next to each other. Current order:
blue hero → white marquee → yellow healthcare → night work rail → cream/blue centre tear →
white services → periwinkle process → white people → night presence → yellow CTA → blue footer.

TYPE (font: 'Bizaffix Dazzed' with Instrument Sans fallback, weight 500, never bold)
- .ph-h1 hero only · .ph-h2 section title · .ph-h3 card/row title
- .ph-lead intro paragraph (max 60ch) · .ph-body body copy
- .ph-label: 12–13px UPPERCASE, 0.1em tracking, tabular numbers. Used for spec codes
  (HC-01, IND-03, PT-02), "Fig. 04", counts ("3 services"), captions, tags.
- .ph-mark: wrap ONE accent word in a headline; a yellow highlighter sweeps in under it.

LAYOUT
- Content goes in .ph-container (max 1440px, gutter clamp(20px,5vw,96px)); PaperSection adds it.
- Section padding .ph-pad (64 / 96 / 128px). 12-column grid, gap-6.
- Standard header pattern: h2 in lg:col-span-5, lead + PaperLink in lg:col-span-6 lg:col-start-7.
  Or: sticky intro in col-span-5, content list in col-span-7.
- Corners are almost square: 4px on cards, 2px on tags/images/icon tiles. No pills, no big radii.

PAPER PIECES
- .ph-paper: white card, 1px border, 4px radius, navy paper shadow. Add .ph-paper-cream for cream.
- .ph-tilt + style={{'--rot':'-0.8deg'}}: card sits off-square; hover straightens and lifts it.
  Rotate neighbours in alternating directions (e.g. ['-1.2deg','0.9deg','-0.6deg','1.1deg']).
- <PaperPin color={paperInk.blue|yellow} className="top-[22px] left-1/2" />: glossy pushpin.
  Pins are for hero moments only. One YELLOW pin per screen at most; the rest are blue.
- Tape: an absolutely positioned span, ~h-6 w-20, rotate 24–32deg, yellow or blue at ~85% alpha.
- <CropMarks /> at a block's corners; PaperSection draws them by default (crop={false} to skip).
- Grid: ph-grid (white), ph-grid-blue (cream), ph-grid-navy (yellow/periwinkle),
  ph-grid-inverse (blue/night). PaperSection adds the right one (grid={false} to skip).
- Grain: usePaperGrain() → style={{'--ph-grain': grain}} on a .ph-grain layer (PaperSection does it).
- <TornEdge seed={n} pin="left|center|right" under={paperInk.<next sheet colour>} />: put it in
  PaperSection's `after` prop to tear the bottom of the sheet as the page scrolls. Unique seed per tear.
- Tags: <li className="ph-label rounded-[2px] border border-[var(--ph-border)] px-2 py-1">.
- Rows: border-t on the list, border-b on each row, grid-cols-[3.5rem_1fr_auto] with a spec code
  in the first column.

BUTTONS
- Primary: <PaperButton tone={t.button} to="/route">Label</PaperButton>: flat sheet, torn left
  edge, arrow. Without `to` it becomes Book a call.
- Secondary: <PaperLink to="/route">Label</PaperLink>: text + arrow, underline draws in on hover.
- One primary button per section at most.

MOTION (everything must respect prefers-reduced-motion)
- Headline: <RevealLines lines={['Line one', 'line two.']} stagger={100} /> (lines rise in).
- Blocks: <Reveal delay={160}> (rise), variant="fade", variant="rise". Stagger list items by
  index * 70–90ms. Lead at ~160ms, CTA at ~260ms.
- Numbers: <CountUp value={n} />. Icons: SVG paths with pathLength={1} className="reveal-stroke".
- Easing cubic-bezier(0.22,1,0.36,1), 300–700ms.
- Scroll-pinned effects only on wide screens with motion allowed; fall back to a plain stacked
  layout otherwise.

ACCESSIBILITY
- section aria-labelledby → h2 id. Decorative layers aria-hidden. If RevealLines splits a heading
  with an accent, put the full text in an sr-only span and the animated copy in aria-hidden.
- Interactive rows are <button>s with aria-expanded/aria-controls or aria-pressed; visible
  focus: focus-visible:outline-2 outline-offset-2 outline-[var(--ph-blue)].

CONTENT
- Copy lives in src/content/*.ts (home.ts, premium-home.ts, services.ts …), not in the component.
- Real Bizaffix facts only; don't invent clients, numbers, or quotes.
- Sentence case everywhere except .ph-label.

Write the section in src/sections/home/<Name>.tsx, export a named component, match the
comment style of the existing sections (one JSDoc block saying what the sheet is), and add it
to src/pages/HomePage.tsx where its tone fits the rhythm.
```

---

## Part 2: Section prompts

### 01. Hero: blue sheet with readout and pinned card (`PremiumHero.tsx`)

```text
Build a hero like src/sections/home/PremiumHero.tsx.

Sheet: brand-blue (tones.blue), pulled up under the header with -mt-(--header-clearance), top
padding calc(var(--header-clearance)+32px). White inverse grid, grain, white crop marks (md+).

Layout:
1. .ph-h1 in white across the full width, three lines via RevealLines (delay 140, stagger 110);
   the last word wrapped in .ph-mark (yellow highlighter). Full title in sr-only.
2. Below, a 12-col grid aligned to the bottom (lg:items-end):
   - col-span-6: .ph-lead in white, then a row with PaperButton (tone navy) and a white PaperLink.
   - col-span-5 col-start-8: a "readout" <dl>: 4 rows, each border-t border-white/25 (last also
     border-b), ph-label term on the left in muted white, a 1.5rem tabular number on the right
     using CountUp. Rows fade in staggered by 90ms.
3. A cream pinned card below (mt-16): .ph-paper.ph-paper-cream.ph-tilt, --rot -0.6deg, a YELLOW
   PaperPin at the top, inside a 12-col row: ph-label "Industry 01 — X" (3 cols), ph-h3 title
   (4 cols), small tag chips (3 cols), PaperLink pushed to the end (2 cols).
4. End with <TornEdge seed={...} pin="center" under={paperInk.white} /> so the sheet tears into
   the next (white) section.
Interaction: onPointerMove sets --tilt (−9..9deg) from pointer x so the pins lean toward the cursor;
reset to 0 on pointer leave.
```

### 02. Industries marquee (`IndustriesMarquee.tsx`)

```text
Build a marquee like src/sections/home/IndustriesMarquee.tsx.

Sheet: white, no grid, no crop marks, short padding (pt-8 pb-16): it sits directly under the
hero's torn edge, which acts as its top padding. sr-only h2.
Content: a single row of UPPERCASE words, clamp(1.5rem,1rem+2vw,2.5rem), weight 500, tracking
0.06em, navy, px-8 apart, each followed by a small blue printer's registration mark (SVG circle
r=5.5 plus a cross). The row bleeds to the viewport edges (-mx-[clamp(20px,5vw,96px)]) inside
.marquee-mask, and .marquee-track drifts slowly. Render the list twice; the second copy is
aria-hidden. First-copy items fade in staggered by 90ms.
```

### 03. Sticky intro + accordion rows (`HealthcareZone.tsx`)

```text
Build a section like src/sections/home/HealthcareZone.tsx.

Sheet: yellow (tones.yellow), navy grid, navy primary button.
Layout: 12-col grid.
- Left col-span-5, lg:sticky at top calc(var(--header-clearance)+24px): two-line .ph-h2 with
  RevealLines, .ph-lead, PaperButton tone navy.
- Right col-span-7: a list of .ph-paper rows (p-0), gap-3, each revealed with delay index*70.
  Each row is an <h3><button> with grid-cols-[3.75rem_1fr_auto]: a spec code in ph-label grey
  ("HC-01"), the .ph-h3 title, and a 36px square toggle (2px radius, border; plus sign whose
  vertical bar scales to 0 when open; filled navy when open).
- Only one row open at a time, first open by default. The panel animates height 0→auto and
  opacity with framer-motion AnimatePresence (0.38s, ease [0.22,1,0.36,1]), no animation with
  reduced motion. Panel: border-t, .ph-body grey copy (60ch), a PaperLink "View case study".
  Indent the panel on md+ so its text lines up with the title column.
- Full a11y: aria-expanded, aria-controls, role="region" aria-labelledby.
```

### 04. Horizontal work rail (`HorizontalWork.tsx`)

```text
Build a pinned horizontal scroller like src/sections/home/HorizontalWork.tsx.

Sheet: night (#14245F), white text. On md+, GSAP ScrollTrigger pins the section and translates a
flex track sideways (scrub 1); below md the panels simply stack vertically.
Panels in the track, each h-screen, separated by border-r border-white/15:
1. Intro panel (~44vw), left edge aligned with the page container: .ph-h2 "Selected work" (line
   rises in), white/85 .ph-lead, white PaperLink; a ph-label footnote at the bottom.
2. One panel per project (~38vw): a cream .ph-paper.ph-tilt card linked to the case, each with a
   different --rot, every other card dropped md:mt-12. A strip of yellow tape over the top-right
   corner. Image box aspect 1.46/1, 2px radius, border, white bg, image object-contain, scales 1.03
   on hover. Below: ph-label "Case 01" + a yellow highlighted category chip, .ph-h3 title, grey
   .ph-body, and a "View case study" ph-link.
   Parallax: the card wrapper moves ±28px and the image ±6% via containerAnimation.
3. A compact spec card (~34vw): cream .ph-paper, ph-label "Project types", h3, a ruled list
   with codes PT-01…, PaperLink.
4. A full-screen "What we do" panel: huge stacked words sized to fit the viewport (canvas
   measurement), white; during an ~80vh hold after the rail stops, each word in turn turns yellow,
   shifts 14px, and the others dim to 35%; then all reset. Hover does the same.
Extras: a yellow "View case study" label follows the pointer over cards (not on touch). A bottom
progress bar: ph-label "Project 2 of 4" + a 1px white/20 line filling with yellow. Soft-snap to
the moment the last panel arrives. Refresh ScrollTrigger after images and fonts load. Reduced
motion: no word animation, no parallax.
```

### 05. Directory board with pinned figure (`WhoWeWorkWith.tsx`)

```text
Build a section like src/sections/home/WhoWeWorkWith.tsx.

Sheet: cream with ph-grid-blue and light grain, navy crop marks around the content block.
Layout: 12-col grid.
- Left col-span-5: two-line .ph-h2 ("X leads. / The same craft travels."), grey .ph-lead, then a
  ruled list of buttons, grid-cols-[3.5rem_1.25rem_1fr_auto]: ph-label code "IND-01", a small hex
  mark (HexMark active/station), the .ph-h3 name (grey, navy when active or hovered), and on the
  first row a blue ph-label "Lead industry". Hover (mouse only), focus, or click sets the active
  row; aria-pressed.
- Right col-span-7 (lg+ only): a white .ph-card rotated 0.8deg with a blue PaperPin at the top,
  a light-blue image well (fixed height min(46vh,30rem)) where all images are stacked and the
  active one cross-fades in (500ms opacity). Figcaption in ph-label: name on the left,
  "Fig. 0N" on the right.
Must fit one screen (it is used inside the centre tear): use height media queries to tighten
padding and type on short screens.
```

### 06. Case study poster (`CaseHighlight.tsx`)

```text
Build a section like src/sections/home/CaseHighlight.tsx.

Sheet: brand blue with inverse grid and grain, white crop marks.
Layout: 12-col grid, items-center.
- Left col-span-7: the product as a cream "poster": .ph-paper.ph-paper-cream.ph-tilt (--rot
  -1.2deg), a YELLOW PaperPin at top centre, a yellow ph-label tag in the top-left corner
  ("Case study"), the image (object-cover, height min(52vh,30rem)), figcaption in ph-label
  (project name / platform).
- Right col-span-5: two-line white .ph-h2 (the project name), the problem as white/90 .ph-body,
  the answer as .ph-body font-medium with a 3px yellow left border and ps-4, then a white
  PaperLink. Staggered reveals (150 / 250 / 330ms).
Not a testimonial: no quotation marks.
```

### 07. Centre tear reveal (`components/paper/CenterTearReveal.tsx`)

```text
Build a transition like src/components/paper/CenterTearReveal.tsx between two sections.
This is the page's signature moment, so use it once only.

A tall wrapper (stage height + ~175vh, 120vh on phones) holds a sticky full-screen stage.
Scroll progress 0..1 drives it in phases:
- 0–0.10 hold: the top section (cream) is shown whole, pinned at both top corners.
- 0.10–0.36 crack: a jagged opening grows from the middle of the seam toward both edges,
  brand blue showing through, edged with a white fibre stroke.
- 0.36–0.90 split: the sheet becomes two clipped halves (the right one an inert, aria-hidden
  copy) that swing apart on their corner pins (translate ±55vw, rotate ±4deg), with a navy drop
  shadow, a fibre rim, and curled flaps along each torn edge.
- 0.36–1 underneath: the second section (blue) rises from translateY 18% / scale 0.94 to rest,
  a navy shade over it fades out, and its text fades in between 0.62 and 0.82.
Seam geometry comes from a seeded generator (lib/tear.ts, lib/tear-layout.ts). One rAF per
frame only while near the viewport; write a style only when its value changed (keeps it on the
compositor). Fall back to the two sections stacked when motion is reduced or the top section
doesn't fit one screen; re-measure after fonts load and on resize.
```

### 08. Service directory, three flat sheets (`ServicesDirectory.tsx`)

```text
Build a section like src/sections/home/ServicesDirectory.tsx.

Sheet: white with grid and crop marks. No pins here (pins are for hero moments).
Header: .ph-h2 in col-span-5; grey .ph-lead + PaperLink "View all X" in col-span-6 col-start-7.
Body (mt-16): a 3-column grid of .ph-paper <article>s (equal height, flex column), each lifting
4px on hover, revealed with delay index*90:
- Top row: a 48px blue icon tile (2px radius) with a white line icon whose paths draw in
  (pathLength=1, .reveal-stroke, staggered --reveal-delay), and a ph-label count on the right
  ("2 services").
- .ph-h3 at clamp(1.5rem,1.2rem+0.9vw,2rem), grey summary.
- A ruled list of links: title in font-medium, one-line grey description, a → that nudges 4px
  on hover; the row turns blue on hover.
- Tech tags pinned to the bottom (mt-auto) as ph-label chips.
Footer line: a ph-label "Technologies: A · B · C" with the list in navy.
```

### 09. Pinned stack of pages (`ApproachStack.tsx`)

```text
Build a section like src/sections/home/ApproachStack.tsx.

Sheet: periwinkle with navy grid.
Intro: .ph-h2 with the accent word in .ph-mark ("What sets us / apart."), .ph-lead.
Wide screens with motion allowed: the section is (steps*70 + 40)vh tall with a sticky h-svh inner.
Left col-span-5: intro + a progress row of small bars (active one w-10 navy, past ones 50% navy,
future ones 20%). Right col-span-7: a 400px pad of stacked .ph-paper pages. framer-motion
useScroll maps progress to the active step. Placement by offset from active: front (0, scale 1),
behind (−12px, 0.96), further behind (−24px, 0.92), past pages slide up −40px and fade out.
700ms transitions. Only the front page's content is visible; the rest are aria-hidden.
Each page: grid 52% / 1fr: an image well (aspect 4/3, light blue, 2px radius) and text: ph-label
"01 / 05", .ph-h3, grey .ph-body.
Phones and reduced motion: a plain 2-column grid of the same cards inside PaperSection.
```

### 10. People as paper ID badges (`Members.tsx`)

```text
Build a section like src/sections/home/Members.tsx.

Sheet: plain white, grid={false} (so it reads apart from the dark panel after it).
Header: .ph-h2 col-span-5; grey .ph-lead + PaperLink col-span-6 col-start-7.
Body: 1 / 2 / 4 column grid of cream .ph-paper.ph-tilt badges, each rotated differently
(['-1.2deg','0.9deg','-0.6deg','1.3deg']), fading in with delay index*90. Each badge: a square
portrait (2px radius, border, light-blue bg) loaded from public/images/team/<id>.webp; if it
fails, show the person's initials large in blue. Then .ph-h3 name and a blue ph-label role.
```

### 11. Dark panel with a pinned map (`GlobalPresence.tsx`)

```text
Build a section like src/sections/home/GlobalPresence.tsx.

Sheet: night, no grid. Ends with <TornEdge seed={31} pin="left" under={paperInk.yellow} /> in
the `after` prop (move the bottom padding onto the container so the tear sits flush).
Layout: 12-col, lg:items-center.
- Left col-span-5: three-line white .ph-h2, last line in .ph-mark (sr-only full text). A 2-col
  list of location "spec cards": border-t border-white/25 pt-4, .ph-h3 place, white/80 region.
  A white PaperLink (bookCall) below.
- Right col-span-7: a cream .ph-paper with light grain: ph-label "Fig. 10 — Presence", then a
  dotted world map SVG (navy dots at 28% opacity). A blue route line draws in between the cities
  (shallow quadratic arcs, .reveal-stroke) once the map is in view (useRevealed + data-inview).
  At each city: a pulsing .ph-live ring, a PaperPin (YELLOW for HQ, blue for the rest), and a navy
  ph-label name tag under the pin.
```

### 12. Closing call to action (`PaperConnect.tsx`)

```text
Build a closing section like src/sections/home/PaperConnect.tsx.

Wrap it in <div className="paper-home group/route"> (it renders outside <main>).
Sheet: yellow, navy type, with a strip of blue tape (rgb(35 78 209/0.82), rotate 24deg) across
the top-right corner, hanging above the sheet's top edge.
Layout: col-span-7 .ph-h2 + .ph-lead; col-span-5 (justify-end) navy PaperButton + a PaperLink
to the email address.
Below (mt-16) an "Idea → Reality" route line: ph-label "Idea" with a navy ring, a 2px navy/20
track, ph-label "Reality" with a solid hex mark. The track fills left to right with navy (700ms)
when any link in the section is hovered or focused (group-has-[a:hover]/route:scale-x-100).
```

---

## Part 3: Quick prompt template for a brand-new section

```text
[Paste Part 1: Theme brief]

Make a new homepage section: <name>.
Purpose: <what it should tell the visitor>.
Content: <real copy / data, or the src/content file to add it to>.
Pattern to follow: <one of the section prompts above, e.g. "03 sticky intro + accordion rows">.
Sheet tone: <tone>, placed between <section A> and <section B> (must differ from both neighbours).
Interaction: <none / hover / accordion / pinned scroll …>, with a reduced-motion fallback.
```
