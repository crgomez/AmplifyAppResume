# AI Feedback Synthesis - Site Improvement Recommendations

**Date:** Current
**Sources:** Perplexity site review + Claude content briefs
**Purpose:** Consolidate both AI recommendations into actionable improvements prioritized by impact

---

## Executive Summary

Both Perplexity and Claude identified the **same core problem**: the site undersells Carlos's current capabilities. Perplexity focused on *presentation* (how the story is told), while Claude focused on *positioning* (what story to tell). The synthesis: **the current IR role needs to be the hero of the site, not the footnote.**

**Shared diagnosis:**
- Current role (2024–present) is thin; previous role (2022–2024) dominates
- ML pipeline work is buried or absent; it should be the lead capability
- Messaging is too generic; needs sharper niche positioning
- Metrics exist but aren't visually prominent
- Missing career narrative / "how I work" section

---

## Consolidated Recommendations by Priority

### 🔴 Critical (Foundation Issues)

#### 1. **Rebalance Experience Section** 
**Problem:** The Insider Threat role (2022–2024) is the richest content; current IR role (2024–present) has two thin lines. Visitor concludes best work is behind him.

**Sources:**
- Claude Brief 2, R1: "The current role becomes the richest section on the page"
- Perplexity: "It currently reads like a resume pasted into a portfolio rather than a curated career story"

**Action:**
- Rebuild current role to be the most detailed entry
- Lead with ML platform work (4 beats):
  1. Shipped production ML security-intelligence platform (BERT, clustering, MITRE mapping)
  2. Shipped natural-language query interface (MCP) - peers/leadership can query directly
  3. Service ownership - owns and operates these in production
  4. In-pilot: automated triage extending toward SOAR
  5. Foundation: live IR work (capability-level only, no incident specifics)
- Keep Insider Threat role but make it *lighter* and *after* current role

**Copy ready:** Claude Brief 2, Copy Block C

---

#### 2. **Feature the ML Platform Prominently**
**Problem:** The production ML pipeline is either buried or absent; it's the one capability a generic senior security engineer can't claim.

**Sources:**
- Claude Brief 1: "The ML pipeline is the headline capability, not a footnote"
- Perplexity: Missing featured project/case study section
- Claude Brief 2: "#1 takeaway a visitor should leave with: Carlos builds ML/AI that transforms security operations"

**Action:**
- Create dedicated "Featured Projects" or "What I Build" section
- Lead with ML-Driven Security Operations Intelligence project
- Structure: Platform description + 3 capabilities (classification/clustering, GenAI summarization, NL query interface)
- Stack disclosure: Python, scikit-learn, SageMaker, Lambda, S3, QuickSight, Terraform, BERT, MCP

**Copy ready:** Claude Brief 1, Copy Block C

---

#### 3. **Sharpen Hero Headline**
**Problem:** Current tagline is too broad; doesn't communicate the builder + ML differentiation.

**Sources:**
- Perplexity: "Replace 'transforming security operations through data-driven insights' with a sharper positioning statement"
- Claude Briefs 1 & 2: Align with new LinkedIn headline

**Current (likely):**
> Senior Security Engineer, Incident Response

**Recommended:**
> Senior Security Engineer, Incident Response @ Amazon — I build ML/AI that transforms security operations | IoT & Life-Safety (Ring, Blink, eero, Zoox)

**Alternative (Perplexity suggestion):**
> Senior Security Engineer specializing in quantitative incident response, insider threat detection, and AI-augmented security analytics for enterprise-scale cloud and device environments

---

### 🟡 High Impact (Content Fixes)

#### 4. **Add Metrics Callout Section**
**Problem:** Quantified outcomes exist but aren't visually prominent; they're the clearest evidence of seniority and business value.

**Sources:**
- Perplexity: "Turn 3–4 of those numbers into a 'selected impact' strip near the top"
- Perplexity: "Those metrics should be more visually prominent"

**Action:**
- Create visual metrics strip below hero or within hero section
- Feature 3-4 key numbers:
  - **44%** increase in discovery rates (AI-augmented research)
  - **8+ hours → minutes** (report generation time)
  - **50+ custom** threat indicators architected
  - **40M** Monthly Active Users protected (Ring)
  - **4k+ AWS accounts** (CloudTrail telemetry processing)
- Add one-sentence context for each metric
- Standardize phrasing: "Reduced X from Y to Z" or "Improved X by Y%"

**Relates to:** Our existing Task 3.1 (animated counter displays)

---

#### 5. **Replace Bio with Responder→Builder Narrative**
**Problem:** Current bio doesn't establish the career arc or the "both halves" (technical + influence) positioning.

**Sources:**
- Claude Briefs 1 & 2: Replace with finalized narrative (Copy Block A)
- Perplexity: "Add a clear narrative arc"

**Action:**
- Replace current bio with Copy Block A (full) or Copy Block B (condensed)
- **Must include:**
  - Opening scene: director meeting that failed (memorable, human)
  - "I did what engineers do with a failed system" - root cause analysis
  - Copenhagen → Columbia → Stanford journey (the "other half")
  - Responder → Builder arc
  - "I start from the decision... work backward to the data"
  - ML platform that peers/leadership query directly
  - Closing: "Our job isn't to be right. It's to be effective."

**Copy ready:** Claude Brief 1 & 2, Copy Blocks A & B

---

#### 6. **Add "How I Work" / Methodology Section**
**Problem:** No explicit connection between F3EAD, decision-driven frameworks, IWIK, and the ML work.

**Sources:**
- Perplexity: "Add a short 'What I focus on' or 'How I work' section"
- Claude: "I start from the decision and work backward to the data — the 'I Wish I Knew' questions first"

**Action:**
- Create new section between Hero and Experience
- Title: "How I Work" or "Approach"
- Content:
  - Decision-first methodology (IWIK from Columbia)
  - F3EAD cycle application to security operations
  - Quantitative-intuition frameworks
  - Building vs. responding philosophy
- Keep it 2-3 paragraphs, not a wall of text

**Tone:** Conversational, first-person, shows the *how* behind the outcomes

---

### 🟢 Important (Credibility & Polish)

#### 7. **Fix IWIKS™ Framing**
**Problem:** Site presents "IWIKS™ methodology" as proprietary/trademarked. IWIK ("I Wish I Knew") comes from Columbia coursework, not original authorship.

**Sources:**
- Claude Fix #2 (all three briefs): "Small credibility exposure to anyone who knows the source"

**Action:**
- Remove ™ symbol everywhere it appears
- Remove any implied authorship
- Reframe as *applying* the framework:
  - "applying quantitative-intuition and decision-driven frameworks (Columbia)"
  - "I start from the decision and work backward to the data — the 'I Wish I Knew' questions first"

**Priority:** High credibility risk with low effort to fix

---

#### 8. **Resolve 40M vs 35.8M Figure Conflict**
**Problem:** Site references ~40M Monthly Active Users; résumé references 35.8M customer accounts (49.49% of user base) — different metrics that could confuse readers.

**Sources:**
- Claude Fix #1 (all three briefs): "Sharp reader will notice"

**Action (REQUIRES CARLOS SIGN-OFF):**
- Pick canonical figures
- Use each number only where precise:
  - **40M MAU** = reach/context (Ring's total user base)
  - **35.8M accounts** = impact metric (accounts protected by 2PA)
- Never let them appear to describe the same thing
- Ensure site, résumé, and LinkedIn all agree

**Blocker:** Carlos must decide which figures to use where

---

#### 9. **Update Education Section**
**Problem:** Missing recent coursework; inconsistent naming.

**Sources:**
- Claude R5: Add UCLA ML course; verify CBS Negotiation
- Perplexity: Fix "CBS Executive Fonden" typo; standardize "Continuous" vs "Continuing Studies"

**Action:**
- Add: **UCLA Extension — Machine Learning Using Python (COM SCI X 450.4)**, *in progress, Fall 2026*
- Verify present: **Copenhagen Business School — Executive Professional Negotiation (Jan 2026)**
- Fix typos:
  - "CBS Executive Fonden" → "CBS Executive Foundation" (or correct name)
  - Standardize "Stanford Continuing Studies" (check official name)

---

#### 10. **Add Clear CTAs**
**Problem:** Weak conversion paths; no clear next action for visitors.

**Sources:**
- Perplexity: "Add a top-level CTA such as 'View Resume,' 'Connect on LinkedIn,' or 'Contact'"
- Perplexity: "Optimize for fast trust, fast differentiation, and one clear action"

**Action:**
- Add primary CTA in hero: "View Resume" or "Download Resume"
- Add secondary CTA: "Connect on LinkedIn"
- Ensure resume PDF is up to date and linked
- Consider adding GitHub or writing samples if available
- Make CTAs visually prominent (existing btn-primary style)

**Relates to:** Our existing Task 3.2, Task 8

---

### 🔵 Nice to Have (Enhancements)

#### 11. **Improve Skills Section Alignment**
**Problem:** Skills (ML, anomaly detection, predictive analytics) are claimed but not clearly backed by evidence.

**Sources:**
- Claude R5.3: "Skills claims MUST be backed by platform content, not float unsupported"
- Perplexity: "Reconcile claimed skills with evidence"

**Action:**
- Ensure ML/anomaly detection/predictive analytics claims align with ML platform project
- If anomaly detection isn't in production yet, tie to UCLA coursework ("in progress")
- Cross-reference: When skills mention ML, experience section should demonstrate it

---

#### 12. **Collapse Older Roles**
**Problem:** Google/Verizon roles take up visual space; they're foundation but not differentiators.

**Sources:**
- Perplexity: "Consider collapsing older roles slightly"
- Claude: "Preserve earlier roles as the technical-origin story" (but lighter)

**Action:**
- Keep Google and Verizon roles
- Reduce bullet points to 1-2 per role (vs. current 3-4)
- Focus on capabilities gained, not detailed achievements
- Visual weight: Current IR > Insider Threat > Google/Verizon

---

#### 13. **Add Internal Service Naming Guard**
**Problem:** Platform has internal Amazon codename; must not appear on public site.

**Sources:**
- Claude C1, Fix #3: "Function-only naming"

**Action:**
- Audit site for any internal codenames
- Replace with function descriptions:
  - "operational security-intelligence platform"
  - "the platform"
  - Never use internal Amazon system names

**Priority:** Low unless codename is currently present

---

## Implementation Priority Matrix

| Priority | Item | Effort | Impact | Blocker |
|----------|------|--------|--------|---------|
| P0 | Rebalance Experience (Current IR role) | High | Critical | None |
| P0 | Feature ML Platform | Medium | Critical | Amazon-shareable pass |
| P0 | Sharpen Hero Headline | Low | High | None |
| P1 | Add Metrics Callout | Medium | High | None |
| P1 | Replace Bio (Responder→Builder) | Low | High | None |
| P1 | Add "How I Work" Section | Medium | High | None |
| P2 | Fix IWIKS™ Framing | Low | Medium | None |
| P2 | Resolve 40M/35.8M Figures | Low | Medium | **Carlos sign-off** |
| P2 | Update Education Section | Low | Medium | None |
| P2 | Add Clear CTAs | Low | Medium | None |
| P3 | Skills Section Alignment | Low | Low | None |
| P3 | Collapse Older Roles | Low | Low | None |
| P3 | Internal Service Naming Guard | Low | Low | Audit first |

---

## Recommended Implementation Phases

### Phase 1: Foundation (1-2 hours)
**Goal:** Fix the core positioning problem
1. Sharpen hero headline (5 min)
2. Fix IWIKS™ framing everywhere it appears (15 min)
3. Update education section (typos, UCLA, CBS) (10 min)
4. Add clear CTAs (buttons) (15 min)

**Result:** Immediate credibility improvements, better conversion

---

### Phase 2: Content Rebalance (3-4 hours)
**Goal:** Make current role the hero
5. Rebuild current IR role using Copy Block C (1 hour)
6. Lighten Insider Threat role (reduce bullets) (30 min)
7. Replace bio with Copy Block A or B (15 min)
8. Create "How I Work" section (1 hour)

**Result:** Site now tells the right story arc

---

### Phase 3: Visual Prominence (2-3 hours)
**Goal:** Make the evidence unmissable
9. Add metrics callout section (1 hour)
10. Create Featured Projects section with ML platform (2 hours)

**Result:** Quantitative proof is front-and-center

---

### Phase 4: Polish (1-2 hours)
**Goal:** Cross-document consistency
11. Resolve 40M/35.8M figures (Carlos decision + find-and-replace) (30 min)
12. Skills section alignment (30 min)
13. Collapse older roles slightly (30 min)
14. Cross-check: site/résumé/LinkedIn tell one story (1 hour)

**Result:** Watertight, consistent, professional

---

## Copy Blocks Available (Ready to Use)

All copy is provided in Claude's briefs and ready to drop in:

- **Copy Block A** - Full bio narrative (responder→builder arc with director scene)
- **Copy Block B** - Condensed bio (short-form fallback)
- **Copy Block C** - Current role, rebuilt (the priority section)
- **Copy Block C (alternate)** - Featured project: ML-Driven Security Operations Intelligence

**Location:** See attached Claude briefs (crgomez-site-update-brief-1.md, -2.md)

---

## Sign-Off Gates (Carlos Only)

Before publishing, Carlos must approve:

- [ ] **Amazon-shareable pass** - All technical/architecture language in ML platform description
- [ ] **Canonical figures** - Decision on 40M MAU vs 35.8M accounts usage
- [ ] **IWIKS™ removed** - Confirm no trademark or authorship implication remains
- [ ] **Tense/scope** - Platform + user MCP = shipped (present); triage SOAR + team MCP = in pilot
- [ ] **Internal codenames** - Confirm no internal service names appear
- [ ] **Live IR description** - Capability-level only, no incident specifics
- [ ] **Cross-document check** - Site/résumé/LinkedIn tell one consistent story

---

## Key Differences Between Perplexity & Claude

| Aspect | Perplexity | Claude |
|--------|-----------|--------|
| **Focus** | Presentation, visitor UX, conversion | Positioning, narrative arc, content substance |
| **Tone** | Consultant/advisor | Teammate/implementer |
| **Specificity** | General principles + examples | Ready-to-use copy blocks |
| **Primary concern** | "Make evidence more visible" | "Current role is too thin" |
| **Strength** | Outside-in perspective | Deep context on Carlos's work |

**Synthesis:** Perplexity says *how to present*, Claude says *what to present*. Both agree on the core problem: **current work is undersold**.

---

## Open Questions for Carlos

1. **Amazon-shareable pass:** Is Copy Block C (ML platform description) safe to publish publicly?
2. **Figures:** Should we use 40M MAU, 35.8M accounts, or both? Where does each appear?
3. **Internal codenames:** Does the current site use any? (Need to audit live site to confirm)
4. **Projects section:** Should the ML platform live in:
   - A. Dedicated "Featured Projects" section (Perplexity recommendation)
   - B. Within the expanded current role entry (Claude approach)
   - C. Both (project card + role details)
5. **Design vs. content:** Is this purely a content refresh, or can we adjust layout for the metrics callout section?

---

## Next Steps

**Recommended path:**
1. Carlos reviews this synthesis
2. Carlos provides sign-offs on gated items (Amazon-shareable, figures, etc.)
3. Start with Phase 1 (foundation fixes) - low effort, immediate improvement
4. Proceed to Phase 2 (content rebalance) - the core fix
5. Phase 3 & 4 as time permits

**Estimated total effort:** 8-12 hours of implementation work across all phases

**Biggest quick win:** Phase 1 (1-2 hours) immediately improves credibility and messaging without touching the architecture.
