# Minimalist Portfolio Redesign Plan

## Design Inspiration Summary

**Vast Mini Brand Guidelines**
- Warm, neutral tones evoking outer space and space station interiors
- Primary accent: **Solar Orange** — the warm glow of the sun
- Sophisticated, editorial, restrained

**Caladan.bio**
- Dark background, clean minimal layout
- Strong typographic hierarchy
- Generous negative space
- Subtle, refined interactions

**Target aesthetic:** Dark-mode portfolio. Near-black background with warm undertones (space interior), Solar Orange as the sole accent color, clean editorial typography, and aggressive whitespace.

---

## Current Issues to Fix

| Issue | Current | Target |
|-------|---------|--------|
| Color scheme | Burgundy + warm cream | Dark + Solar Orange |
| Hero layout | HTML `<table>` | CSS Flexbox |
| Visual noise | Gradient animations, shimmer effects | Clean, static design |
| Navigation | None | Minimal sticky nav |
| Typography | Gradient animated headings | Solid, confident white text |
| Cards | Heavy borders + gradient accents | Ultra-minimal dark cards |
| Badges/tags | Gradient hover effects | Simple pill borders |
| Buttons | Shimmer CTA animation | Clean, no shimmer |
| Dependencies | jQuery + Bootstrap scripts | Keep minimal JS, remove Bootstrap |

---

## Phase 1: Design Token Overhaul — `css/design-system/tokens.css`

**Exact Vast Brand Colors (from guidelines):**

| Name | Hex | Usage |
|------|-----|-------|
| Meteorite Black | `#2A2C2F` | Page background |
| Moon Rock | `#B3ABA3` | Secondary text, muted elements |
| Warm Gray | `#ECE8E3` | Subtle borders, hover states |
| Warm White | `#FDFCF4` | Primary text on dark bg |
| White | `#FFFFFF` | High-contrast text |
| Solar Orange | `#FF5623` | Accent only — metrics, emphasis, links |

> **Rule from guidelines:** Solar Orange should NOT be used for large areas — only for details where emphasis is needed.

```
Background:   #2A2C2F  (Meteorite Black)
Card:         #33363A  (slightly lighter surface)
Border:       #3E4145  (subtle border on dark)
Muted bg:     #2F3235  (hover/muted surface)

Text:         #FDFCF4  (Warm White — primary text)
Secondary:    #B3ABA3  (Moon Rock — muted text)

Primary:      #FF5623  (Solar Orange — accent only)
Primary hover:#E64D1F  (deeper orange)
Primary light:#FF7A4D  (lighter orange)
```

Typography update:
- Add `DM Sans` or `Plus Jakarta Sans` via Google Fonts as the display font (clean, geometric sans-serif)
- Keep `Inter` as body fallback
- Tighten letter-spacing on headings: `--letter-spacing-tight: -0.02em`

---

## Phase 2: Base Styles — `css/design-system/base.css`

- Remove gradient from `h1`, `h2` defaults
- Set solid `var(--color-foreground)` on all headings
- Increase base `line-height` to `1.7` for body text (more airy)
- Link color → Solar Orange, no underline by default

---

## Phase 3: Component Overhaul — `css/design-system/components.css`

### Buttons
- Remove `.cta-button-enhanced` shimmer `@keyframes` animation
- Primary button: solid orange, no box-shadow lift, simple `opacity: 0.85` hover
- Secondary button: transparent with 1px orange border

### Cards
- `.experience-card`: remove gradient left-border accent → replace with a 1px `var(--color-border)` top border only
- `.education-card`: remove top gradient accent → clean minimal card
- `.certification-card`: remove top-right glow effect
- All cards: `background: var(--color-card)`, ultra-subtle border

### Role Badge
- `.role-badge-enhanced`: remove gradient background → plain uppercase text in Solar Orange, small letter-spacing, no background

### Expertise Tags
- `.tag-enhanced`: replace gradient hover → simple `border: 1px solid var(--color-border)` pill, orange text on hover

### Social Icons
- `.social-icon-enhanced`: clean circle with 1px border, no gradient overlay

### Gradient Text
- `.gradient-text`: remove animated gradient → solid `var(--color-foreground)` with orange on key words only (applied manually in HTML)

---

## Phase 4: Layout Updates — `css/main.css`

**Add sticky minimal navigation:**
```css
.site-nav {
  position: fixed; top: 0; left: 0; right: 0;
  height: 56px;
  background: rgb(14 13 12 / 0.85);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--color-border);
  display: flex; align-items: center;
  z-index: var(--z-sticky);
}
```
Nav contains: `CRG` (name monogram, left) + `Experience · Education · Contact` links (right, small caps)

**Hero layout:**
- Replace `<table class="responsive-table">` with CSS Flexbox `<div class="hero-layout">`
- `.hero-layout`: `display: flex; gap: 4rem; align-items: flex-start`
- `.hero-content`: `flex: 1`
- `.hero-photo`: `flex: 0 0 280px`
- Responsive: stack on mobile via `flex-direction: column`

**Section spacing:**
- Increase section padding to `6rem` top/bottom on desktop
- Add thin `1px` horizontal rule between sections using `var(--color-border)`

---

## Phase 5: HTML Structure — `index.html`

### Add Navigation (before `<div class="min-h-screen">`)
```html
<nav class="site-nav">
  <div class="container flex items-center justify-between" style="width:100%">
    <span class="nav-name">CRG</span>
    <div class="nav-links">
      <a href="#experience">Experience</a>
      <a href="#education">Education</a>
      <a href="resume.pdf">Resume ↗</a>
    </div>
  </div>
</nav>
```

### Replace Hero Table Layout
Remove `<table class="responsive-table">` → use `<div class="hero-layout">` with flex children.

### Headline
Remove `class="gradient-text"` → use `class="hero-headline"` with solid white text. Apply a single `<span class="text-orange">` around one key phrase for orange accent.

### Remove inline `<style>` blocks
The responsive table `<style>` block inside the `<section>` should move to `main.css`.

### Add section IDs for nav anchors
- Experience section: `id="experience"`
- Education section: `id="education"`

### Remove Bootstrap JS
Bootstrap bundle is only used for collapse components (which we are simplifying). Remove it. Keep jQuery + scripts.js.

---

## Phase 6: Micro-interactions Audit — `js/scripts.js`

- Keep Intersection Observer scroll animations (they're subtle and tasteful)
- Keep interactive photo reveal (it's a signature interaction)
- Remove: no changes needed, script is clean

---

## File Change Summary

| File | Change Type | Scope |
|------|-------------|-------|
| `css/design-system/tokens.css` | Full rewrite | Colors + add new typography tokens |
| `css/design-system/base.css` | Edit | Remove gradient heading defaults, update link styles |
| `css/design-system/components.css` | Edit | Remove shimmer, simplify cards/badges/buttons |
| `css/main.css` | Edit | Add nav styles, hero flexbox, section rules, update typography |
| `index.html` | Edit | Add nav, replace table with flex, update classes, add section IDs |
| `css/style.css` | No change | Legacy file, leave untouched |

---

## Visual Before/After Summary

**Before:** Warm cream background, burgundy accents, animated gradient headlines, shimmer CTAs, HTML table hero, no navigation, heavy card decorations.

**After:** Near-black space-interior background, Solar Orange accents, confident solid white headlines, minimal cards with subtle borders, flex hero layout, sticky minimal nav, generous whitespace throughout.
