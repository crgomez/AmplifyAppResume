# Design Document

## Overview

This design document outlines the comprehensive redesign and content update for Carlos R Gomez's portfolio website. The design will transform the current two-column layout into a modern, engaging single-page application that effectively showcases his evolution from security engineer to security engineering manager with advanced AI/ML training and mentoring capabilities.

The design draws inspiration from modern portfolio examples (Jessica Mangoni Malheiro, Rahul Jain, Brittany Chiang, and Matt Farley) while maintaining professional credibility appropriate for senior security leadership roles.

## Architecture

### Design System Foundation
- **Framework**: Modern CSS Grid and Flexbox layout system replacing the current Bootstrap-heavy approach
- **Typography**: Refined typography hierarchy using modern font stacks with improved readability
- **Color Palette**: Professional security-focused color scheme with accent colors for engagement
- **Responsive Strategy**: Mobile-first responsive design with progressive enhancement
- **Animation Framework**: Subtle CSS animations and scroll-triggered effects for modern user experience

### Layout Architecture
- **Hero Section**: Full-viewport introduction with animated elements
- **Navigation**: Sticky navigation with smooth scroll anchoring
- **Content Sections**: Modular section-based layout with consistent spacing and visual hierarchy
- **Interactive Elements**: Hover states, micro-interactions, and progressive disclosure patterns

## Components and Interfaces

### 1. Hero Section Component
**Purpose**: Create immediate impact showcasing Carlos's current role and expertise

**Design Elements**:
- Large, professional headshot with subtle animation on load
- Animated typewriter effect for role progression: "Security Engineer → Manager → AI/ML Leader"
- Key metrics displayed as animated counters (11+ years experience, 4k+ AWS accounts managed, 40M+ users protected)
- Call-to-action buttons for resume download and contact
- Subtle particle animation background representing data/security networks

**Technical Implementation**:
- CSS Grid layout for responsive positioning
- JavaScript intersection observer for scroll-triggered animations
- SVG icons for social links with hover animations

### 2. Professional Summary Component
**Purpose**: Provide comprehensive overview of expertise and leadership philosophy

**Design Elements**:
- Split-screen layout with professional narrative on left, key achievements timeline on right
- Interactive skill categories with expandable details
- Mentoring philosophy callout box with testimonial-style design
- Visual progression chart showing career evolution

**Content Structure**:
- Executive summary highlighting AI/ML training and data-driven leadership
- Leadership philosophy emphasizing mentoring and team development
- Key achievement metrics with visual emphasis
- Professional interests and continuous learning commitment

### 3. Experience Showcase Component
**Purpose**: Present career progression with detailed project highlights

**Design Elements**:
- Timeline-based layout with company logos and role progression
- Expandable project cards with detailed technical information
- Interactive technology stack visualization
- Quantified impact metrics with visual emphasis
- "Deep Dive" modal windows for major projects

**Key Projects to Highlight**:
- Centralized Security Analytics Platform (4k+ AWS accounts)
- Orchestration Middleware Security Controls (40M+ Ring users)
- Two Person Authorization (2PA) Implementation
- Cross-functional team leadership across Amazon subsidiaries
- Insider Threat Program scaling across multiple business units

### 4. Technical Expertise Matrix
**Purpose**: Organize and present technical skills in an engaging, scannable format

**Design Elements**:
- Interactive skill grid with hover effects revealing proficiency details
- Category-based organization: Security Engineering, AI/ML & Data Science, Leadership & Strategy
- Visual proficiency indicators using modern progress designs
- Technology logos and certifications display
- Recent learning highlights (Columbia Business School, Stanford)

### 5. Mentoring & Leadership Component
**Purpose**: Showcase leadership development and mentoring capabilities

**Design Elements**:
- Team development philosophy statement
- Leadership approach visualization (conflict resolution, talent management)
- Mentoring impact stories with testimonial-style cards
- Professional development timeline showing continuous learning
- Call-to-action for mentoring opportunities

### 6. Contact & Collaboration Interface
**Purpose**: Facilitate professional connections and opportunities

**Design Elements**:
- Multi-channel contact options with clear hierarchy
- Interactive contact form with modern styling
- Professional availability status
- Social proof elements (LinkedIn, GitHub, professional networks)
- Resume download with tracking analytics

## Data Models

### Professional Profile Model
```javascript
{
  personalInfo: {
    name: "Carlos R Gomez",
    title: "Senior Security Engineer, Incident Response",
    location: "Los Angeles, CA",
    email: "crgomez167@gmail.com",
    phone: "+1.323.620.2277",
    website: "https://crgomez.com"
  },
  
  professionalSummary: {
    yearsExperience: 11,
    currentRole: "Senior Security Engineer, Incident Response",
    specializations: ["Insider Threat Detection", "Incident Response", "AI/ML Leadership"],
    keyAchievements: [
      "Scaled ITD & IR programs across Amazon subsidiaries",
      "Led cross-functional teams of analysts, data scientists, and security engineers",
      "Architected security analytics platform processing 4k+ AWS accounts"
    ]
  },
  
  experience: [
    {
      company: "Amazon",
      period: "2022 - Present",
      role: "Manager, Insider Threat Program",
      division: "Devices Subsidiaries & Acquisitions",
      keyProjects: [...],
      technologies: [...],
      impact: [...]
    }
  ],
  
  education: [
    {
      degree: "Leading in a Data-Driven World",
      institution: "Columbia Business School Executive Education",
      type: "Professional Development",
      year: "2024"
    }
  ],
  
  skills: {
    securityEngineering: [...],
    aiMlDataScience: [...],
    leadershipStrategy: [...]
  }
}
```

### Project Showcase Model
```javascript
{
  projects: [
    {
      id: "security-analytics-platform",
      title: "Centralized Security Analytics Platform",
      company: "Amazon",
      description: "Enterprise-scale insider threat detection capabilities",
      technologies: ["AWS CloudTrail", "Custom Analytics", "SOAR"],
      impact: {
        scope: "4k+ AWS accounts",
        metrics: "50+ custom threat indicators",
        businessValue: "Real-time risk assessment across subsidiaries"
      },
      details: "Comprehensive project description...",
      images: [...],
      links: [...]
    }
  ]
}
```

## Error Handling

### User Experience Error Handling
- **Graceful Degradation**: Ensure core content remains accessible if JavaScript fails
- **Progressive Enhancement**: Layer interactive features on top of solid HTML foundation
- **Loading States**: Implement skeleton screens and loading indicators for dynamic content
- **Fallback Content**: Provide static alternatives for animated or interactive elements

### Performance Error Handling
- **Image Optimization**: Implement lazy loading with placeholder images
- **Font Loading**: Use font-display: swap for web fonts with system font fallbacks
- **Animation Performance**: Use CSS transforms and opacity for smooth animations
- **Resource Loading**: Implement service worker for offline functionality and caching

### Accessibility Error Handling
- **Screen Reader Support**: Proper ARIA labels and semantic HTML structure
- **Keyboard Navigation**: Full keyboard accessibility for all interactive elements
- **Color Contrast**: Ensure WCAG AA compliance for all text and interactive elements
- **Motion Preferences**: Respect user's reduced motion preferences

## Testing Strategy

### Visual Regression Testing
- **Cross-browser Compatibility**: Test across Chrome, Firefox, Safari, and Edge
- **Device Testing**: Responsive design validation across mobile, tablet, and desktop
- **Performance Testing**: Core Web Vitals optimization and monitoring
- **Accessibility Testing**: Automated and manual accessibility audits

### Content Validation Testing
- **Information Architecture**: Ensure all resume content is accurately represented
- **Link Validation**: Verify all external links and downloadable resources
- **Form Functionality**: Test contact form submission and validation
- **SEO Optimization**: Meta tags, structured data, and search engine optimization

### User Experience Testing
- **Navigation Flow**: Smooth scrolling and section transitions
- **Interactive Elements**: Hover states, animations, and micro-interactions
- **Loading Performance**: Page speed optimization and resource loading
- **Mobile Experience**: Touch-friendly interactions and mobile-specific optimizations

## Implementation Phases

### Phase 1: Foundation & Structure
- Modern CSS architecture setup
- Responsive grid system implementation
- Typography and color system establishment
- Basic component structure creation

### Phase 2: Content Integration
- Updated professional content integration
- Project showcase development
- Skills matrix implementation
- Education and certification updates

### Phase 3: Interactive Features
- Animation and micro-interaction implementation
- Contact form development
- Navigation enhancement
- Performance optimization

### Phase 4: Polish & Optimization
- Cross-browser testing and fixes
- Accessibility improvements
- SEO optimization
- Analytics integration

## Design Inspiration Integration

### From Jessica Mangoni Malheiro
- Clean, minimalist layout with strategic use of white space
- Professional color palette with subtle accent colors
- Clear typography hierarchy and readable content structure

### From Rahul Jain
- Interactive elements and hover effects
- Modern card-based design for project showcases
- Smooth scrolling and section transitions

### From Brittany Chiang
- Technical project presentation with detailed descriptions
- GitHub integration and open-source project highlights
- Developer-focused design elements with professional polish

### From Matt Farley
- Clear value proposition and professional positioning
- Client/employer-focused messaging and case studies
- Strong call-to-action elements and contact optimization