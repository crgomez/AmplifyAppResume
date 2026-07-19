# Synthesis vs. Implementation — Gap Analysis

**Purpose:** This document compares the original AI feedback synthesis (consolidated recommendations from Perplexity and Claude) against what was actually built, identifies where the implementation veered from intent, and defines what the Phase 7 revision pass needs to correct.

**Audience:** Any model assisting with the revision. Feed this alongside the current `index.html` and the `revision-spec.md`.

---

## What Was the Original Directive?

The original synthesis identified one core problem shared by both Perplexity and Claude:

> **The site undersells Carlos's current capabilities. The current IR role needs to be the hero of the site, not the footnote.**

Secondary directives:
- Tell a curated career story, not a resume pasted into a portfolio
- Lead with the ML platform as the headline capability
- Write in Carlos's voice (first person, active)
- Include the origin story (the director meeting scene) as the emotional hook
- Make metrics visually scannable
- Use IWIK as the single organizing framework (decision-first methodology)

---

## What Was Built Correctly

These elements landed as intended and should be preserved:

| Element | Status | Notes |
|---------|--------|-------|
| Four-act experience structure | ✅ Correct | Acts: AI-Augmented IR → Insider Risk → Repeatable IR → Infrastructure |
| Current role is the richest section | ✅ Correct | 4 paragraphs + stack line vs. 2 paragraphs for others |
| Function-only naming (no internal codenames) | ✅ Correct | No Amazon internal service names anywhere |
| IWIK without ™ or implied authorship | ✅ Correct | Referenced as methodology from Columbia, not original creation |
| Shipped vs. pilot tense | ✅ Correct | Platform + MCP = shipped; triage/SOAR = "piloting" |
| UCLA ML course (in progress) | ✅ Correct | Listed in Certifications with "In Progress, Fall 2026" |
| Copenhagen Business School Negotiation | ✅ Correct | Listed in Certifications, Jan 2026 |
| Clear CTAs | ✅ Correct | Resume download button, GitHub, LinkedIn in hero |
| Option 4 layout (narrative titles) | ✅ Correct | Full-width acts with clear period/org metadata |
| No contact form (not yet phase) | ✅ N/A | Wasn't in scope for content phases |

---

## Where the Implementation Veered

### 1. Voice — Agentless/Passive Instead of First Person (CRITICAL)

**What was intended:**
The Claude briefs provided copy blocks written in first person. The synthesis said "Carlos's voice" and "curated story." The hero headline says "I build" — establishing first person as the contract with the reader.

**What was built:**
Nearly every paragraph below the headline removes the actor:
- "Starting as an incident responder on a lean team, **the focus shifted** to building systems…"
- "Coming into this role as an incident responder, **the shift was** from 'handling cases' to…"
- "**Architected** 50+ custom threat indicators…"
- "**The challenge was** balancing rigor with speed…"
- "**The approach starts** from the decision…"

**Why it matters:**
The headline promises "I build" but the body reads like a job description written *about* Carlos, not *by* him. This is the single biggest regression — it strips the personality and ownership that made the source material distinctive.

**Correction:** Full first-person voice pass. Every claim should have Carlos as the actor. Vary construction (don't start every sentence with "I") but ensure a reader always knows *who did the work*.

---

### 2. Origin Story Dropped (CRITICAL)

**What was intended:**
The synthesis (Priority P1, item #5) said to replace the bio with a responder→builder narrative. The Claude briefs provided a specific scene: Carlos walks into a meeting with a business unit director, data ready, risk analysis done. Director shuts it down. Carlos realizes he understood the threat perfectly but had no idea how to bring the room with him. That sent him to Copenhagen and Columbia.

**What was built:**
The "How I Work" section opens with methodology ("The approach starts from the decision…") with no context for *why* this matters to Carlos personally. It reads as a generic framework description. There's no human scene, no failure, no turn.

**Why it matters:**
The origin story is the single most memorable piece of copy in the source material. It answers "why should I care about this person's methodology?" — not with credentials, but with a relatable professional failure and the growth that followed. Without it, IWIK is just another framework name.

**Correction:** Open "How I Work" with the director meeting scene, then let the methodology follow naturally from it. The revision spec provides the exact replacement copy.

---

### 3. OODA Loop Added Without Basis (MEDIUM)

**What was intended:**
The synthesis never mentions OODA. The Claude briefs don't mention OODA. The organizing framework is IWIK (decision-first, tied to Carlos's own story and exec education).

**What was built:**
A full paragraph in "How I Work" maps the ML platform to OODA phases: "The work applies the OODA loop — Observe, Orient, Decide, Act — to security operations."

**Why it matters:**
Two competing frameworks dilute each other. IWIK has a story behind it (the director scene, Columbia, Copenhagen). OODA is a borrowed generic military framework with no personal connection. Running both confuses the reader about what Carlos's actual methodology is.

**Correction:** Remove the OODA paragraph entirely. If any OODA substance is worth keeping, fold it into the IWIK framing without naming a second framework.

---

### 4. No Impact/Metrics Strip (MEDIUM)

**What was intended:**
The synthesis (Priority P1, item #4) called for a visual metrics strip near the hero — 3-4 key numbers with one-sentence context each. The `site-copy-and-kiro-prompts.md` provides ready copy:
- Reporting time: multi-day manual cycles → minutes
- Insider risk: 50+ custom indicators protecting ~40M MAU
- Log onboarding: 3-4 weeks → ~30 minutes
- Operating scale: 130K+ employees at Google

**What was built:**
No metrics strip exists. The numbers are buried in prose paragraphs within the experience acts.

**Why it matters:**
A skimming executive (the target audience) gets no extractable proof points without reading full paragraphs. The metrics strip was specifically recommended by Perplexity as "the clearest evidence of seniority and business value."

**Correction:** Add a metrics/impact section. Can be between hero and "How I Work," or as a compact band within the hero. Keep it to 3-4 numbers with brief context.

---

### 5. No "Selected Outcomes" in Experience Acts (MEDIUM)

**What was intended:**
The revision spec (R7.4) calls for 2-3 scannable bullet points at the end of each act, using only claims already present in the prose. This supplements the narrative — it doesn't replace it.

**What was built:**
Each act is solid prose paragraphs with nothing scannable. A recruiter or hiring manager skimming gets no quick proof points.

**Why it matters:**
Not everyone reads every paragraph. The acts tell a great story for engaged readers, but executives scan. Selected outcomes give them extractable evidence without breaking the narrative flow.

**Correction:** Add a "Selected outcomes" block (2-3 bullets) to the end of each act, before the Stack line. Use only claims already on the site.

---

### 6. Education Section — Duplication Not Resolved (LOW)

**What was intended:**
The synthesis (item #9) said to de-duplicate Columbia (appears in both Education and Certifications) and separate degrees from short courses.

**What was built:**
"Leading in a Data-Driven World / Columbia Business School Executive Education" appears in the Education grid AND in Certifications. "Demystifying AI / Stanford" is listed under Education alongside the MS and BS, implying equivalence.

**Correction:**
- Education section: MS (Penn State) and BS (Azusa Pacific) only
- Certifications section: All short courses and exec education (Columbia, Stanford, Copenhagen, UCLA)

---

### 7. Skills Section — Unsupported Claims Remain (LOW)

**What was intended:**
The synthesis (item #11) said skills claims must be backed by site content. The revision spec (R7.6) is more specific.

**What was built:**
- "Anomaly Detection" — claimed but nothing on the site demonstrates it in production
- "Talent Management" and "Resource Budgeting" — management-era skills that pull against the builder positioning the rest of the site now establishes

**Correction:**
- Remove or tie "Anomaly Detection" to UCLA coursework ("in progress")
- Remove "Talent Management" and "Resource Budgeting"
- Ensure remaining skills each map to something visible in the acts

---

### 8. 40M / 35.8M Figure Conflict — Still Unresolved (REQUIRES SIGN-OFF)

**What was intended:**
The synthesis (item #8) flagged this as needing Carlos's canonical decision.

**What was built:**
Act 3 says "a user base of over 40 million monthly active users" — this is Ring's total MAU. The résumé says "35.8M customer accounts (49.49%)" — this is the 2PA protection coverage. They describe different things but currently read as interchangeable.

**Correction:** Carlos must decide:
- 40M MAU = Ring's total user base (reach/context)
- 35.8M accounts = accounts protected by specific security control (impact)
- Never let them appear to describe the same thing
- Ensure site, résumé, and LinkedIn all agree

---

## Severity Summary

| Priority | Issue | Effort | Impact |
|----------|-------|--------|--------|
| P0 | First-person voice pass | Medium (rewrite, not restructure) | Fixes the biggest tonal regression |
| P0 | Restore origin story in How I Work | Low (copy provided) | Restores the most memorable content |
| P1 | Remove OODA paragraph | Trivial | Eliminates framework conflict |
| P1 | Add impact/metrics strip | Medium | Gives scanners proof points |
| P1 | Add Selected Outcomes to each act | Low | Improves scannability without restructuring |
| P2 | Education de-duplication | Low | Cleaner information architecture |
| P2 | Skills cleanup | Low | Removes unsupported claims |
| P2 | 40M/35.8M resolution | Low | Requires Carlos sign-off first |

---

## What NOT to Change

These are correct and must be preserved through any revision:

1. **Four-act structure** — don't reorganize or merge acts
2. **Act titles** — "Quantitative, AI-Augmented Incident Response," "Insider Risk at Scale," "Building Repeatable IR," "Infrastructure and Scale"
3. **Current role as richest section** — it should remain the most detailed
4. **Function-only naming** — no internal Amazon codenames
5. **No ™ on IWIK** — referenced as Columbia methodology, no implied authorship
6. **Shipped vs. pilot language** — platform + user MCP = shipped; triage SOAR = "piloting"
7. **UCLA in-progress** — correctly noted as Fall 2026
8. **Design system and CSS architecture** — this is a copy pass, not a visual redesign
9. **Section order** — Hero → How I Work → Experience → Education/Certs → Footer
10. **No incident specifics** — capability-level only for live IR work

---

## Recommended Task Order

1. Voice pass — first person across all body copy
2. Rewrite How I Work (origin story + remove OODA)
3. Add Selected Outcomes to all four acts
4. Add impact/metrics strip
5. Education de-duplication
6. Skills cleanup
7. Figures resolution (needs Carlos sign-off)
8. Final review pass

---

## Sign-Off Gates (Carlos Only — Do Not Resolve Unilaterally)

- [ ] Amazon-shareable pass on origin story copy (describes an internal meeting)
- [ ] Canonical figures decision (40M MAU vs. 35.8M accounts)
- [ ] Final approval before publish
