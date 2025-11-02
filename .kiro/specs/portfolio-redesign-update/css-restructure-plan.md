# CSS Architecture Restructure Plan

## Current State
- `css/style.css` - Main comprehensive stylesheet (2356 lines)
- `lovable_css.css` - Tailwind-based design system
- `app.css` - React app styles

## Proposed Structure

### 1. Core Design System (`css/design-system/`)
```
css/
├── design-system/
│   ├── tokens.css          # CSS custom properties (colors, spacing, typography)
│   ├── base.css           # Reset, base styles, typography
│   ├── components.css     # Reusable components (buttons, cards, tags)
│   └── utilities.css      # Utility classes (spacing, colors, layout)
├── layout/
│   ├── grid.css          # Grid system and layout utilities
│   └── responsive.css    # Responsive breakpoints and media queries
├── sections/
│   ├── hero.css          # Hero section specific styles
│   ├── experience.css    # Experience cards and timeline
│   └── footer.css        # Footer styles
└── main.css              # Main entry point that imports all modules
```

### 2. Benefits of This Structure
- **Maintainability**: Easier to find and modify specific styles
- **Scalability**: Can add new sections without bloating main file
- **Consistency**: Design tokens ensure consistent spacing, colors, typography
- **Performance**: Can load only needed CSS modules
- **Collaboration**: Multiple developers can work on different modules

### 3. Migration Strategy
1. Extract design tokens from current CSS
2. Split components into logical modules
3. Update HTML to use consistent class naming
4. Test responsive behavior
5. Optimize for performance

### 4. Design Token Consolidation
Currently we have overlapping design systems:
- CSS custom properties in `style.css`
- HSL colors in `lovable_css.css`
- Need to consolidate into single source of truth

### 5. Class Naming Convention
Adopt consistent naming:
- `.btn-*` for buttons
- `.card-*` for cards
- `.text-*` for typography
- `.space-*` for spacing
- `.layout-*` for layout utilities