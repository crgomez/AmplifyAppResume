# Dark Mode Design - Option 2

## Current Problem
Users with dark mode enabled see:
- Light sage background (#eaf2e7) 
- Dark green text (#0F2306)
- This creates poor contrast and readability issues

## Proposed Dark Mode Solution

### Color Palette for Dark Mode

**Backgrounds:**
- Main background: `#0F2306` (deep forest green - was text color)
- Card background: `#1a3a0d` (slightly lighter green)
- Accent sections: `#2d5015` (medium green)

**Text:**
- Primary text: `#f5f1e8` (light cream - high contrast)
- Muted text: `#c5d4bd` (light sage - for secondary text)
- Links/accents: `#d0e5e6` (pale mint - still visible)

**Borders:**
- Borders: `#3d5f25` (medium-light green)
- Card borders: `#2d5015` (subtle)

### Visual Comparison

```
┌─────────────────────────────────────────────────────────────┐
│                    LIGHT MODE (Current)                      │
├─────────────────────────────────────────────────────────────┤
│  Background: #eaf2e7 (light sage)                           │
│  Text: #0F2306 (dark green)                                 │
│  Cards: #ffffff (white)                                     │
│  Accents: #d0e5e6 (pale mint)                               │
│                                                              │
│  ┌──────────────────────────────────────┐                  │
│  │ Carlos R. Gomez                      │ ← Dark on light  │
│  │                                      │                   │
│  │ Driving quantitative insights...     │                   │
│  │                                      │                   │
│  │ ┌────────────────┐ ┌──────────────┐ │                  │
│  │ │ 01             │ │ 02           │ │ ← White cards    │
│  │ │ Senior Sec Eng │ │ Manager, IT  │ │                   │
│  │ └────────────────┘ └──────────────┘ │                   │
│  └──────────────────────────────────────┘                  │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                    DARK MODE (Proposed)                      │
├─────────────────────────────────────────────────────────────┤
│  Background: #0F2306 (deep forest green)                    │
│  Text: #f5f1e8 (light cream)                                │
│  Cards: #1a3a0d (dark green)                                │
│  Accents: #3d5f25 (medium green)                            │
│                                                              │
│  ┌──────────────────────────────────────┐                  │
│  │ Carlos R. Gomez                      │ ← Light on dark  │
│  │                                      │                   │
│  │ Driving quantitative insights...     │                   │
│  │                                      │                   │
│  │ ┌────────────────┐ ┌──────────────┐ │                  │
│  │ │ 01             │ │ 02           │ │ ← Dark green     │
│  │ │ Senior Sec Eng │ │ Manager, IT  │ │   cards          │
│  │ └────────────────┘ └──────────────┘ │                   │
│  └──────────────────────────────────────┘                  │
└─────────────────────────────────────────────────────────────┘
```

### Detailed Section Breakdown

#### Navigation (Dark Mode)
```
┌─────────────────────────────────────────────────────────────┐
│ Carlos R. Gomez    Experience  Education  Certifications    │
│ #f5f1e8 (cream)    #f5f1e8     #f5f1e8    #f5f1e8          │
│                                                              │
│ Background: #0F2306 (deep forest green)                     │
│ Border: #2d5015 (subtle green)                              │
└─────────────────────────────────────────────────────────────┘
```

#### Hero Section (Dark Mode)
```
┌─────────────────────────────────────────────────────────────┐
│  ┌─────────────────────────────────────────────┐           │
│  │ SENIOR SECURITY ENGINEER, INCIDENT RESPONSE │           │
│  │ Background: #2d5015 (medium green)          │           │
│  │ Text: #f5f1e8 (cream)                       │           │
│  └─────────────────────────────────────────────┘           │
│                                                              │
│  Driving quantitative insights in incident                  │
│  response for Amazon Device Subsidiaries                    │
│  #f5f1e8 (cream text - 4rem)                               │
│                                                              │
│  Hi! I'm Carlos, a Senior Security Engineer with 11+ years │
│  transforming security operations...                        │
│  #c5d4bd (light sage - 1.375rem)                           │
│                                                              │
│  ┌────┐ ┌────┐ ┌──────────┐                               │
│  │ GH │ │ LI │ │ Resume   │                                │
│  └────┘ └────┘ └──────────┘                               │
│  Border: #3d5f25 (medium-light green)                      │
│                                                              │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐      │
│  │ Incident     │ │ AI/ML & Data │ │ Security     │       │
│  │ Response     │ │ Science      │ │ Engineering  │       │
│  └──────────────┘ └──────────────┘ └──────────────┘      │
│  Background: #2d5015, Text: #f5f1e8                        │
│                                                              │
│  Main Background: #0F2306 (deep forest green)              │
└─────────────────────────────────────────────────────────────┘
```

#### Experience Cards (Dark Mode)
```
┌─────────────────────────────────────────────────────────────┐
│  Professional Experience                                     │
│  #f5f1e8 (cream - 2.5rem)                                   │
│                                                              │
│  ┌──────────────────────┐     ┌──────────────────────┐    │
│  │ 01                   │     │ 02                   │     │
│  │ #c5d4bd (muted)      │     │ #c5d4bd (muted)      │     │
│  │                      │     │                      │     │
│  │ Senior Security Eng. │     │ Manager, Insider     │     │
│  │ #f5f1e8 (cream)      │     │ Threat Program       │     │
│  │                      │     │ #f5f1e8 (cream)      │     │
│  │ 2024 - Present       │     │ 2022 - 2024          │     │
│  │ #c5d4bd (muted)      │     │ #c5d4bd (muted)      │     │
│  │                      │     │                      │     │
│  │ Leading quantitative │     │ Led cross-functional │     │
│  │ insights...          │     │ team...              │     │
│  │ #c5d4bd (muted)      │     │ #c5d4bd (muted)      │     │
│  │                      │     │                      │     │
│  │ — 44% increase...    │     │ — Architected 50+... │     │
│  │ #c5d4bd (muted)      │     │ #c5d4bd (muted)      │     │
│  └──────────────────────┘     └──────────────────────┘     │
│  Background: #1a3a0d (dark green card)                      │
│  Border: #2d5015 (subtle)                                   │
│                                                              │
│  Main Background: #0F2306 (deep forest green)              │
└─────────────────────────────────────────────────────────────┘
```

#### Education Section (Dark Mode)
```
┌─────────────────────────────────────────────────────────────┐
│  Education & Certifications                                  │
│  #f5f1e8 (cream - 2.5rem)                                   │
│                                                              │
│  MS Homeland Security                                        │
│  #f5f1e8 (cream - 1.25rem)                                  │
│  Penn State University • InfoSec & Forensics                │
│  #c5d4bd (light sage - 0.9rem)                              │
│                                                              │
│  Leading in a Data-Driven World                             │
│  #f5f1e8 (cream - 1.25rem)                                  │
│  Columbia Business School Executive Education               │
│  #c5d4bd (light sage - 0.9rem)                              │
│                                                              │
│  Background: #2d5015 (medium green - accent section)        │
└─────────────────────────────────────────────────────────────┘
```

#### Footer (Dark Mode)
```
┌─────────────────────────────────────────────────────────────┐
│  Carlos R. Gomez                                            │
│  #f5f1e8 (cream)                                            │
│  Senior Security Engineer                                   │
│  #c5d4bd (light sage)                                       │
│                                                              │
│  NAVIGATION          CONNECT                                │
│  #c5d4bd (muted)     #c5d4bd (muted)                        │
│                                                              │
│  Experience          ┌────┐ ┌────┐                         │
│  Education           │ GH │ │ LI │                          │
│  Certifications      └────┘ └────┘                         │
│  Resume              Border: #3d5f25                        │
│  #c5d4bd (links)                                            │
│                                                              │
│  ─────────────────────────────────────────────────────────  │
│  © 2026 Carlos R. Gomez. All rights reserved.              │
│  #c5d4bd (muted)                                            │
│                                                              │
│  Background: #0F2306 (deep forest green - same as main)    │
└─────────────────────────────────────────────────────────────┘
```

## Pros & Cons

### Pros ✅
- Respects user's system preference
- Maintains green color palette theme
- High contrast for readability
- Professional dark mode experience
- Reduces eye strain in low light

### Cons ❌
- Different from Caladan Bio's light aesthetic
- More complex to maintain
- Need to test all components in both modes
- Some users might prefer consistent light branding

## Implementation Complexity

**Easy:** Update CSS variables in `@media (prefers-color-scheme: dark)`
**Medium:** Test all sections, buttons, and interactions
**Hard:** Ensure all inline styles respect dark mode

## Recommendation

If you want to support dark mode properly, this approach maintains the green nature theme while providing excellent readability. The deep forest green background with cream text creates a sophisticated, professional look that still feels "on brand."

However, if brand consistency is more important, forcing light mode (Option 1) might be better.
