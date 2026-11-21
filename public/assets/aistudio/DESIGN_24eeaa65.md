---
name: Kinetic Swiss Deck
colors:
  surface: '#fcf9f8'
  surface-dim: '#dcd9d9'
  surface-bright: '#fcf9f8'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f6f3f2'
  surface-container: '#f0edec'
  surface-container-high: '#ebe7e7'
  surface-container-highest: '#e5e2e1'
  on-surface: '#1c1b1b'
  on-surface-variant: '#5a403d'
  inverse-surface: '#313030'
  inverse-on-surface: '#f3f0ef'
  outline: '#8e706c'
  outline-variant: '#e3beb9'
  surface-tint: '#b5251e'
  primary: '#b2221c'
  on-primary: '#ffffff'
  primary-container: '#d53c31'
  on-primary-container: '#fffbff'
  inverse-primary: '#ffb4aa'
  secondary: '#9a443a'
  on-secondary: '#ffffff'
  secondary-container: '#ff9385'
  on-secondary-container: '#772a22'
  tertiary: '#006672'
  on-tertiary: '#ffffff'
  tertiary-container: '#008190'
  on-tertiary-container: '#f7feff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdad5'
  primary-fixed-dim: '#ffb4aa'
  on-primary-fixed: '#410001'
  on-primary-fixed-variant: '#920408'
  secondary-fixed: '#ffdad5'
  secondary-fixed-dim: '#ffb4aa'
  on-secondary-fixed: '#400202'
  on-secondary-fixed-variant: '#7b2d25'
  tertiary-fixed: '#9defff'
  tertiary-fixed-dim: '#6ed5e7'
  on-tertiary-fixed: '#001f24'
  on-tertiary-fixed-variant: '#004f59'
  background: '#fcf9f8'
  on-background: '#1c1b1b'
  surface-variant: '#e5e2e1'
  bg-matte: '#E6E6E6'
  surface-elevated: '#F2F2F2'
  ink-stark: '#111111'
  ink-muted: '#5A5A5A'
  accent-vermilion: '#E5483B'
  surface-dark: '#141414'
  surface-dark-elevated: '#1A1A1A'
  border-dark: '#2E2E2E'
typography:
  display-xl:
    fontFamily: Syne
    fontSize: 96px
    fontWeight: '800'
    lineHeight: '0.95'
    letterSpacing: -0.03em
  display-xl-mobile:
    fontFamily: Syne
    fontSize: 44px
    fontWeight: '800'
    lineHeight: '0.98'
    letterSpacing: -0.03em
  headline-lg:
    fontFamily: Syne
    fontSize: 64px
    fontWeight: '800'
    lineHeight: '1.02'
    letterSpacing: -0.03em
  headline-lg-mobile:
    fontFamily: Syne
    fontSize: 36px
    fontWeight: '800'
    lineHeight: '1.05'
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Syne
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-sm:
    fontFamily: Syne
    fontSize: 22px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Space Grotesk
    fontSize: 22px
    fontWeight: '500'
    lineHeight: '1.35'
    letterSpacing: -0.01em
  body-md:
    fontFamily: Space Grotesk
    fontSize: 15px
    fontWeight: '400'
    lineHeight: '1.65'
  body-sm:
    fontFamily: Space Grotesk
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.55'
  label-md:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '700'
    lineHeight: '1.4'
    letterSpacing: 0.14em
  label-sm:
    fontFamily: JetBrains Mono
    fontSize: 11px
    fontWeight: '700'
    lineHeight: '1.4'
    letterSpacing: 0.14em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1.75rem
  margin: 6vw
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.75rem
  space-xl: 2.25rem
---

## Brand & Style

This design system establishes a **Swiss Neo-Brutalist & Kinetic Typography** aesthetic tailored for a multidisciplinary portfolio. It merges the rigid, mathematical precision of Swiss International Style—evidenced by crosshair registration grids, tabular metadata, and uppercase micro-labels—with the raw, high-contrast energy of Neo-Brutalism and tactile playing-card metaphors.

### Target Audience & Emotional Response
Designed for creative directors, technical recruiters, and engineering collaborators, the interface evokes **clarity, kinetic energy, and architectural rigor**. The stark contrast between matte architectural grey (`#E6E6E6`), deep black ink (`#111111`), and vibrant vermilion (`#E5483B`) creates an immediate editorial impact, while interactive 3D card tilts and mouse-tracked elements invite playful exploration.

## Colors

The palette is anchored in a high-contrast light mode that pairs a matte architectural grey canvas (`#E6E6E6`) with stark black ink (`#111111`) and a single, high-energy vermilion accent (`#E5483B`).

### Usage & Hierarchy
- **Primary Accent (`#E5483B`)**: Reserved for focal architectural elements (such as the hero vertical pillar), interactive hover states, active index numbers, suit symbols (`✦`), and key callout cards.
- **Surfaces (`#E6E6E6`, `#F2F2F2`, `#FFFFFF`)**: The global canvas uses `#E6E6E6` to reduce glare and evoke physical poster stock. Elevated cards use `#F2F2F2` or `#FFFFFF` to create subtle tonal separation.
- **Inverted Dark Band (`#111111`, `#1A1A1A`)**: Specific sections (such as Skills) invert the polarity, using `#111111` as the background, `#1A1A1A` for cards with `#2E2E2E` borders, and `#E6E6E6` for text.
- **Typography Ink (`#111111`, `#5A5A5A`)**: Primary headings and borders use `#111111`, while secondary body copy and project descriptions use `#5A5A5A` for comfortable reading contrast.

## Typography

Typography in this design system pairs wide, expressive display headers with technical, monospaced metadata.

### Font Roles
- **Display (`Syne`)**: Used for all major section titles, kinetic hero typography, and card headlines. Display text is set in uppercase with tight tracking (`-0.03em`). Hollow-stroke variants (`.hollow`) use `color: transparent` with a `1.5px` stroke in `#111111` (or `#E6E6E6` on dark bands).
- **Body (`Space Grotesk`)**: Used for lead statements, biographical copy, and project descriptions, offering geometric clarity at smaller sizes.
- **Metadata & Indices (`JetBrains Mono`)**: Used for uppercase micro-labels (`.meta`), index numbers, and button text with wide letter-spacing (`0.14em`).

## Layout & Spacing

The layout is governed by a **Fluid Grid** anchored by a global **Swiss Registration Grid**—a subtle background layer of `+` crosshair markers (`rgba(17, 17, 17, 0.35)`) spaced every `240px` horizontally and `220px` vertically.

### Grid & Breakpoints
- **Container Max-Width**: `1320px` centered within `6vw` horizontal outer margins.
- **Desktop (`> 900px`)**:
  - *About*: 12-column grid (4 columns identity card, 8 columns editorial copy & education).
  - *Projects*: 2-column grid with `36px` (`2.25rem`) gutters.
  - *Skills*: 3-column grid with `28px` (`1.75rem`) gutters.
  - *Achievements*: 2x2 grid.
- **Tablet & Mobile (`≤ 900px`, `≤ 860px`, `≤ 820px`)**: Multi-column grids collapse cleanly into a single-column stack, maintaining `6vw` outer margins and generous vertical section padding (`110px`–`120px` on desktop, scaling down proportionally on mobile).

## Elevation & Depth

Depth is communicated through a combination of **low-contrast structural borders**, **tonal surface shifts**, and **soft ambient shadows** reserved for interactive card decks.

- **Structural Borders**: Cards and rows rely on crisp `1.5px solid #111111` (or `rgba(17, 17, 17, 0.12)` for project cards) outlines to define boundaries against the `#E6E6E6` canvas.
- **Ambient Shadows**: Only floating, interactive card elements cast shadows:
  - *Playing-Card Fan*: `0 20px 40px rgba(0, 0, 0, 0.14)`
  - *Project Cards*: `0 18px 36px rgba(0, 0, 0, 0.06)`
- **Z-Index Layering (Hero)**: The hero composes depth across distinct planes: Vertical Red Pillar (`z-index: 1`), Kinetic Typography (`2`), Playing-Card Fan (`3`), Circular Dial (`4`), Center Front Card (`5`), and Hovered/Active Card (`10`).
- **Atmospheric Grain**: A subtle `0.03` opacity matte grain overlay sits across the viewport (`pointer-events: none`) to unify digital layers into a cohesive printed-poster texture.

## Shapes

This design system balances sharp brutalist typography with **rounded playing-card geometry**.

- **Card Frames**: Playing cards, identity cards, and skills cards use a consistent `18px` (`1.125rem`) border radius, while project cards use `20px` and achievement cards use `16px`.
- **Internal Previews**: Nested media windows inside project cards step down to `12px` for clean concentric nesting.
- **Tactile Controls**: Buttons and rectangular badges use a crisp `4px` (`0.25rem`) radius, contrasting against the softer card frames.
- **Circular Elements**: The rotating hero dial badge is a true circle (`170px` diameter) with a `1.5px dashed rgba(17, 17, 17, 0.3)` ring.

## Components

### Buttons
- **Primary Tactile Button (`.btn`)**: Solid `#111111` background, `#E6E6E6` uppercase `JetBrains Mono` text (`12px`, `0.1em` tracking), `12px 22px` padding, and `4px` border radius. On hover, the background shifts to `#E5483B` and the button translates `-2px` vertically with `cubic-bezier(0.22, 1, 0.36, 1)` easing.

### Chips & Tags
- **Skill Pills**: Compact rectangular or pill-shaped tags with `1px solid #2E2E2E` borders on dark surfaces (`#1A1A1A`). Interactive soft-skill pills highlight with `#E5483B` on hover.

### Cards
- **Playing-Card Fan (Hero)**: `3:4.1` aspect ratio, `18px` radius, `clamp(190px, 21vw, 270px)` width. Cards fan out with subtle rotation; hovering or clicking lifts the card (`translateY(-28px) scale(1.05)`) to `z-index: 10`.
- **Project Cards**: `20px` radius, `32px` padding, alternating between `#FFFFFF` and `#121212` surfaces. Features a `✦` suit symbol in `#E5483B`, `12px` rounded media preview, and subtle 3D tilt (`±4deg`) on hover.
- **Identity & Achievement Cards**: `#F2F2F2` surface with `1.5px solid #111111` borders and `26px`–`28px` internal padding.

### Lists & Experience Rows
- **Experience Rows**: Full-width horizontal rows separated by `1.5px solid #111111` top/bottom dividers. Hovering reveals a `#E5483B` vertical indicator bar on the left edge.

### Form Controls (Inputs, Checkboxes, Radio Buttons)
- **Input Fields**: `1.5px solid #111111` border, `#F2F2F2` background, `4px` radius, and `JetBrains Mono` uppercase labels. Focus state shifts border color to `#E5483B`.
- **Checkboxes & Radio Buttons**: Sharp `1.5px solid #111111` outlines (`4px` radius for checkboxes, `50%` for radios) with solid `#E5483B` fill when checked.

### Signature Architectural Elements
- **Crosshair Registration Grid**: Global `+` markers (`rgba(17, 17, 17, 0.35)`) on a `240px × 220px` grid.
- **Directional Triangles**: `8px` solid `#111111` triangles (`▲ ▼ ◄ ►`) placed at viewport edges and card centers.
- **Eye Emblem**: `42×42px` 4-lobe outline in `2px` `#111111` stroke with a mouse-tracked pupil clamped within `±10px` X and `±5px` Y.