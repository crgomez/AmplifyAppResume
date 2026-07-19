# Phase 7 — Final Implementation Plan

**Status:** Ready to execute (except two items requiring Carlos sign-off)
**Date:** July 2026
**Inputs synthesized:**
- `ai-feedback-synthesis.md` — original Perplexity + Claude recommendations
- `synthesis-vs-implementation.md` — gap analysis of what was intended vs. built
- `revision-recommendations-for-kiro-md.md` — line-level implementation instructions from latest review
- `revision-spec.md` — Carlos's Phase 7 revision spec

**Scope:** Copy and structure only. Do NOT touch: CSS/design system, section order, act titles, four-act structure, or any element confirmed correct in `synthesis-vs-implementation.md`.

---

## Consensus Across All Sources

All three documents (plus Carlos's own revision spec) agree on:

1. **The #1 problem is voice.** The site reads as a job description written about Carlos, not by him. The headline says "I build" but everything below it removes the actor.
2. **The origin story is missing.** The director meeting scene — the most memorable piece of copy — never made it into the build.
3. **OODA was added without basis.** Not in any source document. Competes with IWIK. Remove it.
4. **Metrics need visual prominence.** The numbers exist in prose but aren't scannable.
5. **Education is duplicated.** Columbia appears twice; short courses sit alongside degrees.
6. **Skills have unsupported claims.** "Anomaly Detection," "Talent Management," "Resource Budgeting" undermine the builder positioning.

---

## Task List — Execute in Order

### T1. Voice Pass — First Person, Active Voice (P0)

**All sources agree. No sign-off needed. Execute immediately.**

Convert all narrative body copy to first person. The hero headline already says "I build" — the rest of the site must match that contract.

**Rewrite rules:**
- Every claim should have Carlos as the actor
- Vary construction — don't start every sentence with "I"
- The test: can a reader tell *who did the work*?
- Preserve existing structure, section order, headings

**Specific rewrites (from revision-recommendations doc):**

**Hero intro (currently ~line 101):**
> "I started as an incident responder on a lean team and shifted my focus to building systems that stop problems instead of just responding to them. Today I own and operate a production ML platform that turns fragmented incident data into one clear operational picture, queryable in plain language by peers, managers, and leadership. My work spans both halves: the technical craft, and the decision-making and influence that turns a finding into action."

**Act 4 — Quantitative, AI-Augmented IR (4 paragraphs):**
> Para 1: "Coming into this role as an incident responder, I shifted from handling cases to designing systems that prevent incidents and make every investigation faster and more defensible. On a flat team with no dedicated platform group, that builder mindset quickly became the core of my job."
>
> Para 2: "I built a production security-intelligence platform that aggregates fragmented incident data across devices and cloud services and applies machine learning — semantic embeddings, clustering, dimensionality reduction — to surface operational patterns that raw dashboards miss, mapped directly into the MITRE ATT&CK framework. On top of that, I added a GenAI summarization layer with deterministic status fields and human review guardrails that reduced incident reporting time from multi-day manual workflows to minutes, while preserving the rigor leadership expects."
>
> Para 3: "To make this usable beyond the IR team, I exposed the platform through a natural-language interface based on Model Context Protocol, so peers, managers, and executives can ask scoped, read-only questions in plain language — identity-aware, fully audit-logged — instead of waiting on hand-built reports. I'm now extending it into orchestration, piloting automated incident triage with a team-facing interface that IR and Vulnerability Management can build on."
>
> Para 4: "All of this sits on top of live incident response work: I lead end-to-end investigations across the device ecosystem and coordinate with engineering, legal, and product stakeholders. Building detection and analytics from the lived reality of incidents is what keeps the system effective. My through-line is applying the 'I Wish I Knew' (IWIK) methodology from Columbia and Copenhagen — start from the decision that needs to be made, then work backward to the data — so the platform answers the questions leaders actually ask, not just collects more metrics."

**Act 3 — Insider Risk at Scale (2 paragraphs):**
> Para 1: "This is where detection design met consumer scale. I led a cross-functional team developing enterprise-scale insider threat capabilities across Amazon's hardware subsidiaries. My challenge was balancing rigor with speed: what does an insider-threat case look like when it has to work across a user base of over 40 million monthly active users?"
>
> Para 2: "I architected 50+ custom threat indicators and correlation algorithms that protect Ring's device customers and internal systems. The real win was building security controls that could operate at that scale without drowning responders in false positives — designing the signals that matter, not just collecting more logs."

**Act 2 — Building Repeatable IR (2 paragraphs):**
> Para 1: "This is where I turned ad-hoc investigation work into structured, repeatable pipelines. At Ring, I took on responsibility for incident response protecting millions of device customers. My problem was speed and consistency: incidents needed response protocols, not just talented responders improvising each time."
>
> Para 2: "I built incident response protocols on the F3EAD framework, implemented automated SOAR pipelines for threat response, and cut AWS CloudWatch log onboarding from 3–4 weeks to roughly 30 minutes through reusable patterns and automation. The result was IR that was faster and more consistent: structured workflows that compress manual investigation tasks from days to minutes, so the team could scale without growing linearly."

**Act 1 — Infrastructure and Scale (2 paragraphs):**
> Para 1: "This is where I set my foundation: learning how systems break at scale and how people actually use them. Supporting global IT operations for 130K+ employees and helping optimize cloud infrastructure taught me reliability, usability, and distributed systems thinking — not just individual hosts or one-off fixes."
>
> Para 2: "I built a data analytics platform for cloud infrastructure optimization — my first lesson in turning messy, incomplete operational data into actionable insights. My takeaway: incident response and security don't happen in a vacuum. They ride on top of complex, real-world infrastructure, and understanding that infrastructure is where effective security engineering starts."

---

### T2. Rewrite "How I Work" — Origin Story + Remove OODA (P0)

**OODA removal: all sources agree, no sign-off needed.**
**Origin story: 🔶 REQUIRES CARLOS SIGN-OFF (describes an internal meeting)**

**Remove:** The entire OODA paragraph ("The work applies the OODA loop — Observe, Orient, Decide, Act — to security operations…")

**Replace the full "How I Work" section content with (from revision-spec.md, confirmed by all sources):**

> I walked into a meeting with a business unit director once — data ready, risk analysis done, a clear mitigation plan. He came in hostile, deflected every point, and shut the proposal down before I'd even finished framing the problem. The meeting was over in minutes. The security gap stayed open.
>
> I did what engineers do with a failed system: I went looking for the root cause. Not in the proposal — in the negotiation itself. That sent me to Copenhagen Business School's executive negotiation program, and to Columbia for quantitative decision-making, to learn the half of the job I'd been ignoring. I understood the threat perfectly. I had no idea how to bring the room with me.
>
> That's why I start from the decision that has to be made and work backward to the data that informs it — the "I Wish I Knew" questions first, the engineering second. In practice it means building systems that answer the questions leaders actually ask. The ML platform doesn't exist because machine learning is interesting; it exists because "what patterns are we seeing across teams?" gets asked every week and raw dashboards can't answer it. The natural-language interface exists because waiting on a hand-built report is how decisions get delayed.
>
> Our job isn't to be right. It's to be effective. That usually means working both halves — the threat, and the buy-in.

**Note:** The revision-recommendations doc offered a generalized draft as fallback. The revision-spec.md copy above is Carlos's preferred version (from the Claude briefs). Carlos must confirm it's Amazon-shareable since it describes an internal meeting at capability level.

---

### T3. Add Impact/Metrics Strip (P1)

**All sources agree. No sign-off needed.**

Insert between the hero section (after expertise tags) and "How I Work." Use 4 items with numbers already verified on the site:

| Metric | Value | Context |
|--------|-------|---------|
| Reporting time | Multi-day → minutes | AI-augmented summaries with guardrails |
| Insider risk | 50+ custom indicators | Protecting ~40M monthly active users |
| Log onboarding | 3–4 weeks → ~30 min | AWS CloudWatch integration automation |
| Operating scale | 130K+ employees | Infrastructure and IT support at Google |

**Format:** 4 compact cards or a horizontal band — match existing design system components (`.tag-enhanced` or `.education-grid` patterns). Keep it tight; one metric + one-line context per card.

**Important framing note (from revision-spec.md):** The 130K figure should be framed as the *environment worked in*, not as impact driven. Don't present it as a headline achievement — it's scale context.

---

### T4. Add "Selected Outcomes" to Each Act (P1)

**All sources agree. No sign-off needed.**

Insert as a styled bullet list at the end of each act's `.act-content`, before the `.act-stack` line (where present). Use ONLY claims already in that act's prose — nothing new.

**Act 4 — Quantitative, AI-Augmented IR:**
- Reduced incident reporting from multi-day manual synthesis to minutes, with deterministic status fields and human review guardrails
- Surfaced incident patterns and ATT&CK technique clusters that raw dashboards couldn't show
- Shipped a natural-language, audit-logged query interface (MCP) so peers and leadership can self-serve incident intelligence

**Act 3 — Insider Risk at Scale:**
- Architected 50+ custom threat indicators and correlation algorithms across Amazon's hardware subsidiaries
- Built detection tuned to operate at consumer scale without drowning responders in false positives

**Act 2 — Building Repeatable IR:**
- Built IR protocols on the F3EAD framework and automated SOAR pipelines for threat response
- Cut AWS CloudWatch log onboarding from 3–4 weeks to roughly 30 minutes
- Compressed manual investigation tasks from days to minutes through structured, reusable workflows

**Act 1 — Infrastructure and Scale:**
- Built a data analytics platform for cloud infrastructure optimization
- Supported global IT operations at 130K+ employee scale

*(Note: Act 1 bullets frame 130K as environment/context, not as impact driven.)*

---

### T5. Education De-duplication (P2)

**All sources agree. No sign-off needed.**

**Education section — keep only degrees:**
- MS Homeland Security — Penn State University (InfoSec & Forensics)
- BS Information Systems Security — Azusa Pacific University

**Move to Certifications (don't delete — preserve content):**
- "Demystifying AI" / Stanford Continuing Studies → move to Certifications grid (add date if known)

**Remove from Education (true duplicate — already in Certifications with full title):**
- "Leading in a Data-Driven World" / Columbia Business School Executive Education

**Result:** Education = 2 items (degrees). Certifications = all exec ed, short courses, and professional development.

---

### T6. Skills Cleanup (P2)

**All sources agree. No sign-off needed.**

**AI/ML & Data Science row:**
- Remove "Anomaly Detection" (not demonstrated in production on the site)
- Alternative: if Carlos wants to keep it, reword to "Anomaly Detection (in progress — UCLA)" — but this reads awkwardly in a skills list, so removal is cleaner

**Leadership & Strategy row:**
- Remove "Talent Management"
- Remove "Resource Budgeting"
- Keep "Conflict Resolution" (aligns with stakeholder-influence narrative and Copenhagen training)
- Keep "Operational Planning" (aligns with builder/systems work)

**Final Leadership & Strategy line:** "Conflict Resolution, Operational Planning"

---

### T7. 🔶 40M / 35.8M Figure Resolution (P2 — REQUIRES CARLOS SIGN-OFF)

**Current state:** The site uses only 40M MAU (in Act 3). The number 35.8M does not appear in `index.html`. There is no on-site conflict today.

**The conflict is cross-document:** the résumé says "35.8M customer accounts (49.49%)" referring to 2PA protection coverage. A reader who sees both could confuse the two metrics.

**Latest recommendation (from revision-recommendations doc):** No change to `index.html` unless Carlos wants to add 35.8M as a separate, clearly-labeled metric. The fix is ensuring résumé and LinkedIn either:
- Also use 40M as context, OR
- Clearly label 35.8M as "accounts protected by 2PA" (a distinct metric from total MAU)

**Decision needed:** Keep site as-is (40M only) and reconcile résumé/LinkedIn externally? Or add 35.8M somewhere on the site with clear labeling?

---

## Sign-Off Gates

| Gate | Blocks | Status |
|------|--------|--------|
| Origin story copy is Amazon-shareable | T2 | 🔶 Pending Carlos |
| 40M vs 35.8M canonical decision | T7 | 🔶 Pending Carlos |
| Final approval before publish | All | 🔶 After all tasks complete |

---

## Execution Notes

- **T1 through T4** can proceed without any sign-off (T2's OODA removal is unblocked; only the origin story replacement needs approval)
- **Partial T2 approach:** Remove OODA immediately, leave a placeholder comment for origin story pending approval, then backfill when Carlos signs off
- **All changes are git-revertible** — commit after each task for clean rollback if needed
- **Do not change:** CSS, design tokens, section order, act titles, act structure, function-only naming, shipped/pilot language, UCLA status, or any element listed in "What NOT to Change" in `synthesis-vs-implementation.md`

---

## Source Agreement Matrix

| Recommendation | Original Synthesis | Gap Analysis | Revision Spec | Revision Recommendations | Consensus |
|---|---|---|---|---|---|
| First-person voice | Implied (copy blocks were 1P) | Called as #1 regression | R7.1 (highest priority) | §1 with line-level rewrites | **UNANIMOUS** |
| Origin story | P1 item #5 | Called as #2 regression | R7.2 (exact copy provided) | §2 (draft + approval gate) | **UNANIMOUS** |
| Remove OODA | Not mentioned (wasn't in original) | Called as introduced without basis | R7.3 (explicit removal) | §2 (remove entirely) | **UNANIMOUS** |
| Metrics strip | P1 item #4 | Called as missing | Not in revision-spec (focused on copy) | §3 (4-item strip) | **3 of 4** |
| Selected outcomes | Not in original synthesis | Called as missing scannability | R7.4 (exact bullets provided) | §4 (bullets per act) | **3 of 4** |
| Education dedup | Item #9 | Called as unresolved | R7.7 | §5 | **UNANIMOUS** |
| Skills cleanup | Item #11 | Called as unresolved | R7.6 | §6 | **UNANIMOUS** |
| 40M/35.8M | Item #8 (sign-off needed) | Called as unresolved | R7.5 (sign-off needed) | §7 (no site change recommended) | **UNANIMOUS** |

---

## What This Document Replaces

This is the single source of truth for Phase 7 implementation. It supersedes:
- The task list in `revision-spec.md` (incorporated here with specifics)
- The priority matrix in `ai-feedback-synthesis.md` (resolved into concrete tasks)
- The gap list in `synthesis-vs-implementation.md` (translated into actions)
- The line-level instructions in `revision-recommendations-for-kiro-md.md` (absorbed into T1–T7)

Feed this document alongside `index.html` to any model executing the work.
