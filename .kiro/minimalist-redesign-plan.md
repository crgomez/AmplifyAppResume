# Minimalist Portfolio Redesign - Implementation Plan

## Overview
Transform the current burgundy-themed portfolio into a Caladan Bio-inspired minimalist design with nature-inspired green palette, larger typography, and cleaner aesthetic.

## ✅ Phase 1: Foundation (COMPLETED)
- [x] Update color tokens to green palette
- [x] Increase typography scale
- [x] Simplify font weights (400, 600 only)
- [x] Update border radius for softer corners
- [x] Minimize shadows
- [x] Create sample page for reference

## ✅ Phase 2: Components Update (COMPLETED)
### Buttons & CTAs
- [x] Update button styles to outlined with rounded corners (24px radius)
- [x] Remove gradient effects
- [x] Simplify hover states (opacity only)
- [x] Update social icons to button style

### Cards
- [x] Update experience cards with white background
- [x] Add subtle borders (1px solid)
- [x] Remove shadows
- [x] Increase border radius to 16px
- [x] Remove all gradient backgrounds

### Badges & Tags
- [x] Simplify badge styling
- [x] Remove colored backgrounds
- [x] Use simple border style

## Phase 3: Layout Restructuring (NEXT)
### Navigation (NEW)
- [ ] Add minimalist top navigation bar
- [ ] Include: Name/Logo, Experience, Education, Contact links
- [ ] Sticky navigation on scroll (optional)
- [ ] Simple underline on active section
- [ ] Mobile: Hamburger menu or keep visible
- [ ] Match Caladan Bio's clean nav style

### Hero Section
- [ ] Increase headline size to 80px (5rem)
- [ ] Simplify intro to 2 sentences max
- [ ] Remove or simplify interactive photo
- [ ] Convert social icons to outlined buttons
- [ ] Remove gradient text effect
- [ ] Remove role badge styling

### Experience Section
- [ ] Add numbered items (01, 02, 03, 04, 05)
- [ ] Wrap each role in white card
- [ ] Remove metric callouts (IWIKS™, 4k+, etc.) or simplify
- [ ] Remove "View Details" expandable sections
- [ ] Condense bullet points to 2-3 max per role
- [ ] Remove company icon badges or simplify

### Education Section
- [ ] Remove card styling
- [ ] Simplify to clean list format
- [ ] Remove certifications section or condense significantly
- [ ] Remove technical skills grid or simplify

## Phase 4: Content Reduction
- [ ] Condense hero intro from 2 paragraphs to 2 sentences
- [ ] Reduce experience bullets from 4 to 2-3 per role
- [ ] Remove or condense metric callouts
- [ ] Simplify education entries
- [ ] Remove or condense certifications

## Phase 5: Interaction Removal
- [ ] Remove all hover animations
- [ ] Remove fade-in-up animations
- [ ] Remove carousel JavaScript (already not in branch)
- [ ] Remove photo interaction JavaScript
- [ ] Remove project detail toggle functionality
- [ ] Simplify to opacity-only hover states

## Phase 6: Dark/Accent Sections (Optional Enhancement)
- [ ] Add dark green section for "Why I do this" content
- [ ] Add light mint accent sections for variety
- [ ] Implement alternating background pattern
- [ ] Update text colors for dark backgrounds

## Phase 7: Polish & Testing
- [ ] Test on mobile devices
- [ ] Verify accessibility (contrast ratios)
- [ ] Remove unused CSS
- [ ] Optimize performance
- [ ] Test across browsers
- [ ] Verify all links work

## Design Principles
1. **Simplicity First** - Remove before adding
2. **Typography Hierarchy** - Use size and weight, not color
3. **Generous Whitespace** - 10-12rem between sections
4. **Soft & Organic** - Rounded corners, nature colors
5. **Content-First** - Let content breathe, minimal decoration
6. **Clear Navigation** - Simple, unobtrusive wayfinding

## Navigation Design Notes
Inspired by Caladan Bio's approach:
- Minimal, clean top bar
- Text-only links (no icons)
- Simple hover states (underline or opacity)
- Optional: Sticky on scroll with subtle background
- Mobile: Keep simple, avoid complex hamburger menus if possible
- Consider: Name on left, nav links on right
- Anchor links to sections: #experience, #education, #contact

## Color Palette Reference
- **#0F2306** - Deep forest green (text, dark backgrounds)
- **#eaf2e7** - Light sage green (main background)
- **#cde8ba** - Soft sage green (accent cards)
- **#d0e5e6** - Pale mint (borders, alt backgrounds)
- **#f5f1e8** - Light cream (text on dark backgrounds)
- **#ffffff** - White (cards)

## Typography Scale
- Hero: 80px (5rem)
- Section titles: 40px (2.5rem)
- Role titles: 24px (1.5rem)
- Body: 20px (1.25rem)
- Metadata: 16px (1rem)

## Next Steps
1. Update button and CTA components
2. Simplify card styling
3. Update hero section
4. Restructure experience section with numbered items
5. Test and iterate
