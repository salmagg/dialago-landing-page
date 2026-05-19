# Ivory Clinic — Dental Landing Page (Design System Extract)

> Source: Behance project module images for “Dental | Landing Page | Web Site Design — Ivory Clinic”.
>
> Note: This is a **design-from-mock** extraction (the Behance content is rasterized mockups, not live HTML/CSS), so values below are from **on-image annotations + visual inspection**, not computed styles.

## Visual Theme & Atmosphere

- **Overall mood**: clinical, premium, airy, “high-tech dentistry” with restrained minimalism.
- **Contrast strategy**: large low-contrast typography and background surfaces, punctuated by **near-black** for primary CTAs and key numeric highlights.
- **Signature motif**: oversized numerals, thin geometric type, wide whitespace, and product-like 3D imagery (implants/teeth renders) on cool, soft backgrounds.

## Color Palette & Roles

Observed palette cards explicitly labeled in the mock:

- **Rich Black (Primary ink / CTA)**: `#202121` (RGB 32, 33, 33)
  - **Use for**: primary buttons, key headings, large numerals, icons.
- **Ice Blue (Primary surface)**: `#E8EFF5` (RGB 232, 239, 245)
  - **Use for**: hero backgrounds, section panels, cards, subtle fills.
- **Pure White (Base)**: `#FFFFFF` (RGB 255, 255, 255)
  - **Use for**: page background, inner surfaces, negative space.

Derived neutrals seen in the mock (approximate, visual-only):

- **Soft gray text**: `rgba(32,33,33,0.55–0.75)` for secondary copy.
- **Hairline borders**: `rgba(32,33,33,0.08–0.14)` for dividers and card outlines.

### Token suggestions

```txt
--color-ink: #202121;
--color-surface: #E8EFF5;
--color-bg: #FFFFFF;
--color-ink-muted: rgba(32,33,33,.65);
--color-border: rgba(32,33,33,.12);
```

## Typography Rules

The mock calls out the type family and a sizing ladder:

- **Font family**: `HelveticaNeueCyr` (geometric, modern, high readability)
- **Displayed size ladder (px)**: `494`, `192`, `86`, `42`, `21`, `16`

### Practical hierarchy mapping

- **Display XXL**: 192–494px
  - Use for hero numerals, poster-like titles, and section indices (e.g. “01 / 04 / 12”).
- **Display / H1**: ~86px
  - Use for major section headlines (“Certified Quality”, “Your smile partner”).
- **H2 / Section lead**: ~42px
  - Use for concise statements and 2-line headlines.
- **Body / UI**: 16–21px
  - 21px for readable body on wide whitespace; 16px for labels, nav, microcopy.

### Weight & tracking

- **Weights**: prefer Light/Regular for most copy; use Medium/Bold sparingly for emphasis.
- **Letter spacing**: neutral to slightly tight for large display text; avoid overly wide tracking to keep the “clinical” feel.
- **Line height**: generous for body (≈1.4–1.6), tighter for large display (≈0.95–1.1).

## Layout Principles

- **Grid**: wide desktop canvas with generous margins; content blocks often sit inside large rounded “panel” surfaces (Ice Blue) centered on white.
- **Whitespace philosophy**: intentional emptiness; avoid dense stacks. Use single focal items per section (one hero visual + one statement).
- **Composition pattern**:
  - big hero render centered/anchored
  - oversized numerals as structural anchors
  - short headline + 1–2 lines of supporting copy
  - pill CTA
- **Section indexing**: two-digit indices (“01”, “04”, “12”) appear as visual rhythm elements, not just labels.

## Components & Styling

### Buttons (Primary CTA)

- **Shape**: pill / fully rounded (capsule).
- **Fill**: Rich Black `#202121`.
- **Text**: white or very light gray on dark (visually `#FFFFFF`).
- **Placement**: often floating within hero panels; never crowded.
- **States (inferred)**:
  - Hover: slightly lighter fill (`#2B2C2C`) or subtle elevation
  - Active: slightly darker / pressed with reduced shadow
  - Focus: 2px outline using `rgba(32,33,33,.25)` (keep subtle)

Suggested tokens:

```txt
--btn-primary-bg: var(--color-ink);
--btn-primary-fg: #FFFFFF;
--btn-radius: 999px;
--btn-padding-x: 18px;
--btn-padding-y: 10px;
```

### Cards / Panels

- **Surface**: Ice Blue panel on white page.
- **Edges**: soft rounding (visual-only; likely 24–40px on large hero panels).
- **Borders**: minimal; separation achieved by contrast + whitespace.
- **Inner spacing**: generous; content rarely touches edges.

### Navigation (top)

- **Style**: minimal, light UI; small text; ample spacing between items.
- **Behavior (inferred)**: sticky or anchored; keep chrome understated to let hero dominate.

### Stats / Number blocks

- **Large numerals**: used as anchors; often black with thin weight.
- **Micro labels**: small, muted, aligned near numbers (“Years of Experience”, “Clinics in Europe”).

## Depth & Elevation

- **Shadows**: subtle, if present. Prefer “soft separation” over obvious drop shadows.
- **Layering**: primarily achieved through large panels, not heavy elevation.

Suggested shadow (if needed):

```txt
--shadow-soft: 0 10px 30px rgba(32,33,33,.10);
```

## Imagery & Iconography

- **Imagery**: high-quality 3D renders (implants/teeth), glossy highlights, controlled reflections.
- **Background motif**: cool gradients/noise-like soft fields; avoid warm tones.
- **Icons**: minimal line icons; small; secondary to typography.

## Motion & Interaction (Inferred)

- **Motion personality**: calm, premium, “tech” (ease-out, 180–260ms).
- **Transitions**: opacity + slight translate (4–8px) for reveal; avoid bouncy easing.

## Responsive Behavior (Observed/Inferred)

The project includes a mobile composition preview beside desktop.

- **Mobile**: hero panel remains central; big numerals scale down but remain prominent.
- **Collapse strategy**: keep one primary column; preserve whitespace; reduce multi-column grids into stacked panels.
- **Touch targets**: pill CTAs remain large and easy to tap.

## Do’s and Don’ts

- **Do**: use very limited palette; let type and whitespace carry hierarchy.
- **Do**: emphasize “numbers as structure” (indices, stats).
- **Do**: use cool, soft surfaces (Ice Blue) rather than pure gray.
- **Don’t**: add bright accent colors; it breaks the clinical premium feel.
- **Don’t**: introduce heavy shadows, thick borders, or crowded UI density.

## Agent Prompt Guide (Copy/paste)

### Prompt: Hero section

“Design a premium dental clinic landing hero in the ‘Ivory Clinic’ style: background surface `#E8EFF5` inside a large rounded panel on white; font `HelveticaNeueCyr`; oversized thin numerals as structural anchors; a single 3D implant/tooth render centered; pill primary CTA button in `#202121` with white text; sparse, calm layout with large whitespace.”

### Prompt: Typography + palette board

“Create a typography & colors board using HelveticaNeueCyr and a size ladder of 494/192/86/42/21/16px; show palette cards for Rich Black `#202121`, Ice Blue `#E8EFF5`, Pure White `#FFFFFF`; keep the layout minimal and editorial, with light borders `rgba(32,33,33,.12)`.”

