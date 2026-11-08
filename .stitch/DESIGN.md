---
name: Papel
colors:
  surface: '#F6F8FA'
  surface-dim: '#EEF2F6'
  surface-bright: '#FFFFFF'
  surface-container-lowest: '#FFFFFF'
  surface-container-low: '#F6F8FA'
  surface-container: '#EEF2F6'
  surface-container-high: '#E3E8EE'
  surface-container-highest: '#CBD5E1'
  on-surface: '#1A2233'
  on-surface-variant: '#5B6678'
  inverse-surface: '#1A2233'
  inverse-on-surface: '#FFFFFF'
  outline: '#CBD5E1'
  outline-variant: '#E3E8EE'
  surface-tint: '#1F4D8F'
  primary: '#1F4D8F'
  on-primary: '#FFFFFF'
  primary-container: '#173B6E'
  on-primary-container: '#DCE7F7'
  secondary: '#5B6678'
  on-secondary: '#FFFFFF'
  secondary-container: '#EEF2F6'
  on-secondary-container: '#1A2233'
  error: '#C0392B'
  on-error: '#FFFFFF'
  error-container: '#FDECEC'
  on-error-container: '#C0392B'
  background: '#F6F8FA'
  on-background: '#1A2233'
  surface-variant: '#EEF2F6'
typography:
  brand-wordmark:
    fontFamily: Unbounded
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 28px
    letterSpacing: -0.02em
  display-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 47px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
    letterSpacing: -0.01em
  body-base:
    fontFamily: Plus Jakarta Sans
    fontSize: 15px
    fontWeight: '400'
    lineHeight: 24px
    letterSpacing: '0'
  body-bold:
    fontFamily: Plus Jakarta Sans
    fontSize: 15px
    fontWeight: '600'
    lineHeight: 24px
    letterSpacing: '0'
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: '0'
rounded:
  sm: 4px
  DEFAULT: 6px
  md: 6px
  lg: 10px
  xl: 12px
  full: 9999px
spacing:
  unit: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 24px
---

# Design System: Papel

## 1. Visual Theme & Atmosphere

Papel is an editorial, tactile document workspace designed for university students, OJT/practicum interns, and early-career graduates. The atmosphere feels like a well-lit architectural drafting table: crisp white paper sheets resting on a calm, cool-slate desk (`#F6F8FA`), framed by hairline `1px` structural borders (`#E3E8EE`) and anchored by a single authoritative Cobalt Navy accent (`#1F4D8F`).

Density is balanced (`5/10`), variance is asymmetric (`7/10`), and motion is fluid and hardware-accelerated (`6/10`). Every element occupies its own spatial zone with zero gradients, zero neon glows, and zero decorative clutter, keeping the user's attention focused on the typography and structure of their resume.

## 2. Color Palette & Roles

### Primary Foundation
- **Drafting Desk Slate** (`#F6F8FA`) — Primary page canvas and subtle input/chip background fill.
- **Paper Sheet White** (`#FFFFFF`) — Elevated card containers, form panels, modals, and the A4 resume sheet.
- **Stage Recessed Gray** (`#EEF2F6`) — Recessed stage behind the live A4 resume preview and miniature template wireframes.
- **Hairline Structural Border** (`#E3E8EE`) — `1px` solid dividers, card outlines, and form input borders.

### Accent & Interactive
- **Cobalt Navy** (`#1F4D8F`) — Single primary accent used for primary CTAs, active template pills, form progress indicators, and focus rings.
- **Deep Cobalt Hover** (`#173B6E`) — Hover and pressed state for primary Cobalt Navy buttons.
- **Soft Cobalt Wash** (`rgba(31, 77, 143, 0.08)`) — Subtle highlight wash for active badges and selected states.

### Typography & Text Hierarchy
- **Deep Slate Ink** (`#1A2233`) — Primary headings, form labels, and body copy (never pure `#000000`).
- **Muted Slate** (`#5B6678`) — Secondary descriptions, field hints, and metadata.

### Functional States
- **Crimson Alert** (`#C0392B`) — Inline validation errors, destructive actions ("Start over"), and PDF export error alerts.

## 3. Typography Rules

- **Brand Wordmark (`Unbounded`, Weight 700, `-0.02em` tracking):** Reserved exclusively for the **"Papel"** product name in headers and footers. Never used for section titles, buttons, or body copy.
- **UI & Editorial Copy (`Plus Jakarta Sans`, Weights 400, 500, 600, 700):** Used for all headlines, form labels, inputs, navigation, and helper text.
- **Document Preview Fonts:** Dynamic per resume template (`Times-Roman` / serif for Harvard academic layouts, `Helvetica` / sans-serif for modern two-column and sidebar layouts, `Courier` / monospace for technical layouts).
- **Line Width & Casing:** Body copy is constrained to `60ch–65ch` for effortless scanning. Labels use natural sentence case rather than wide-tracked uppercase.

## 4. Component Stylings

### Buttons
- **Corner Radius:** `6px` (`--radius-input`).
- **Primary Button:** Solid Cobalt Navy (`#1F4D8F`), white `600` weight text, hover fill `#173B6E` with subtle `-1px` vertical lift and `0.5px` active press feedback.
- **Secondary / Outline Button:** Solid white (`#FFFFFF`), `1px` border (`#E3E8EE`), `#1A2233` text, hover fill `#F6F8FA` with border darkening to `#CBD5E1`.

### Cards & Panels
- **Corner Radius:** `10px` (`--radius-panel`).
- **Border & Elevation:** `1px` solid `#E3E8EE` with a whisper shadow (`0 1px 2px rgba(16, 24, 40, 0.06)`). Interactive cards elevate smoothly on hover (`translateY(-3px)`) using cubic-bezier spring easing (`cubic-bezier(0.22, 1, 0.36, 1)`).

### Inputs & Form Controls
- **Corner Radius:** `6px`, `1px` solid `#E3E8EE` border, `40px` height for single-line inputs.
- **Validation:** Live inline validation with Crimson Alert (`#C0392B`) border and helper message below the input; labels always remain visible above the field.

### Live A4 Resume Stage
- **Aspect Ratio:** True A4 proportions (`650px` width × `919px` minimum height) inside a recessed `#EEF2F6` scrollable viewport with a high-contrast custom scrollbar (`.preview-scrollbar`).

## 5. Layout Principles

- **Landing Page Architecture:** 2-column asymmetric hero (`1280px` max width) pairing left-aligned value proposition copy with an interactive live template switcher on the right, followed by an asymmetric 12-column Bento feature grid (`7/5` and `5/7` splits) with interactive micro-demos inside the cards.
- **Builder Workspace:** 12-column split screen (`1440px` max width) with the 8-step guided `FormWizard` in 5 columns on the left and the sticky `LivePreview` A4 stage in 7 columns on the right.
- **Responsive Strategy:** Collapses cleanly to a single column below `1024px` (`lg`), with a docked bottom action bar on mobile for one-tap template switching and PDF export.

## 6. Anti-Patterns (Banned)

- No CSS gradients (`linear-gradient`, `radial-gradient`) anywhere in the UI.
- No emojis in headings, badges, buttons, or feature cards.
- No pure black (`#000000`) for UI backgrounds or text; use `#1A2233`.
- No generic 3-equal-column feature card rows; use asymmetric Bento splits with interactive previews.
- No blocking browser `alert()` dialogs; all feedback and errors render inline with accessible `role="alert"` or `role="status"` regions.
