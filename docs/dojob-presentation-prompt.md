# DoJob (jobapply) — Demo Presentation Prompt

## Assistant Prompt

> You are responsible for returning the script of a presentation according to the context below. Listen and follow the presentation via screenshots and transcribed context. Based on what is being said, output the matching step of the script in text. Follow the structure shown below. Do not invent anything beyond what is provided here as context.

---

> Reviewed against the codebase (`apps/jobapply-extension`, `apps/ats-agent`). Corrections applied to the original draft: the score is 100% boolean literal matching (no vector similarity), semantic/LLM output never changes the score, PDF is only an output (no PDF parsing on input), and the demo structure was adapted from the old Ledger template to the DoJob flow.

## Summary
* Feature overview: The extension captures a job description from any page (right-click "Copy Job Description") and runs CV analysis, editing, and resume generation against it. The backend LangGraph agent does all the analysis, and the results come back over SSE.
* Mechanism: The backend agent scores ATS compatibility with **boolean literal keyword matching**. The LLM creates JD keywords with spelling/abbreviation/plural variants, and the agent matches them against 5 CV sections. Keywords have weights by tier (must-have 3, important 2, nice-to-have only gives a small bonus, capped at 5). **Semantic understanding never changes the score** — when the CV says the same thing with different words, the LLM gap advisor creates a "rephrase" tip instead.
* Score formula: `universalScore = 0.70 × keywordCoverage + 0.15 × contentQuality + 0.15 × format + nice-to-have bonus (≤5)`. Content quality is deterministic: the score goes down when it finds generic phrases ("responsible for", "worked with") and requires at least 40% of bullets with real numbers.
* Outputs: ATS match score with evidence snippets (the exact CV text around each matched term) and clear recommendations — remove items that don't help (removeSuggestions), rewrite phrasing to match JD wording (keywordsToRephrase), ready-to-use honest lines for skills that are really missing (keywordPhrases). It also creates a tailored resume in one click with a **scoreBefore → scoreAfter delta**, and exports a PDF with an ATS-friendly layout (pdfmake).
* Screen context: The speaker opened Lucas Mansoldo de Andrade's Senior Software Engineer CV, with stacks in AI Engineering (LangGraph, RAG, MCP Server), Frontend (Svelte, React), and Backend (Node.js, TypeScript). The project uses the same stack, so the boolean matcher will find these exact terms live.

## Insights
* Closing the loop on the 5-step demo structure: The speaker moved from reviewing the Ledger demo pattern to presenting their own live product demo. The CV on screen is the raw input to show real-time keyword matching, scoring, and step-by-step editing.
* From manual tailoring to agentic guidance: The agent does not rewrite the resume with generic LLM hallucination. It works like an iterative linter — it flags missing hard skills, suggests strong phrasing, and has an anti-fabrication guard: a suggested rewrite is rejected if it would add a specialty the CV doesn't really have (e.g., "visual regression testing" ← the CV only says "automated regression testing").
* Every match comes with evidence: the report shows the exact CV text where each keyword was found. This is a big difference from black-box ATS checkers — you can check every result.
* No hallucinated scores: the score is deterministic math over literal matches. The LLM only creates keywords, classifies them, and gives advice on gaps. If an LLM call fails, the advice gets worse, but the score is never blocked or corrupted.

## Trade-offs
* Boolean Literal Matching vs. Full Semantic Vector Matching:
    * Boolean / strict literal matching (used for scoring): Matches hard ATS filters (exact tech terms like "LangGraph", "PostgreSQL") and gives deterministic, reproducible scores. LLM-made variant lists and a classifier fix most false negatives (they merge EITHER-OR lists that were broken into must-haves and remove variants that hide the key token) — but a true synonym still counts as missing, on purpose.
    * Semantic / vector matching (not used for scoring): Understands context, but gives a false sense of security when old ATS filters need exact keywords. It also makes scores hard to reproduce.
    * The planned mix (used here): Boolean literal matching is the only thing that builds the score. The LLM semantic pass runs only over missing keywords — it classifies each one as "rephrase" (the CV already says it, here is the exact rewrite) or "absent" (here are honest conditional lines) — advice without touching the score.

## Explanation
ATS Optimization Agent & Boolean Matching Engine
An ATS Optimization Agent is an automated pipeline that learns how Applicant Tracking System filters work and beats them honestly.
* Problem Solved: Most corporate ATS platforms reject candidates whose resumes lack specific keywords before a human reads them. Candidates find it hard to keep the CV ATS-friendly and readable at the same time.
* How it works — a 9-node LangGraph pipeline (`mapper → jdExtractor → cvExtractor → keywordComposer → keywordClassifier → booleanMatcher → scoreComposer → gapAdvisor → aggregator`):
    1. Input normalization (deterministic): Flattens the structured CV or CV markdown into mapped sections. The JD is captured text from the page (no scraping, no PDF parsing on input — PDF is only an export).
    2. Requirement Extraction (LLM, cached by JD content hash): Breaks the JD into 15–40 small requirement chunks, typed (skill / tool / domain / credential / soft / req) and tiered (must-have / important / nice-to-have), plus the exact job title.
    3. CV Extraction (LLM, cached by CV content hash): Indexes the CV into typed evidence atoms per section.
    4. Keyword Composition & Classification (LLM): Compares JD × CV atoms to create keywords with variant lists. A light classifier pass fixes composition errors.
    5. Boolean Evaluation (deterministic): Word-boundary regex with plural handling against the experience, skills, summary, education, and languages sections. Each match returns the evidence excerpt.
    6. Scoring & Remediation (deterministic score + LLM advice): Tier-weighted keyword coverage (70%) + deterministic content/format (30%) build the score. The gap advisor then turns every missing keyword into a rephrase tip, honest conditional phrases, or a remove suggestion.
* When to use: Tailoring applications for company portals that use old or modern ATS systems. Avoid purely generative overwrites that invent experience — this pipeline makes that impossible by design.
* Reliability details (good answers for Q&A): Results are delivered async — `POST /cv/analyze` → `{requestId}` → SSE stream (15s heartbeat, 5min deadline). The job store stays in memory with a 30min TTL. Chunks are cached in local SQLite by content hash (no TTL — same input always gives the same output). So a cold analysis makes 5 LLM calls, and a warm one only 3.

## Watch out for
* Live Demo Readiness: A cold analysis makes 5 LLM calls in sequence (JD extraction, CV extraction, keyword composition, classification, gap advice). Expect visible waiting time on the first run for each CV/JD pair — demo with a warm cache, or talk about the SSE progress while you wait. The extension shows friendly error messages (502 "service unavailable", 504 "timeout"), but the rate-limit UX is just a generic error bar, not a retry flow.

## Demo Structure (adapted for DoJob)
1. CONTEXT & FOUNDATION (10–15% of time)
   • Problem: manual CV tailoring for every application; black-box ATS checkers that score without evidence or invent experience.
   • Underlying tech: Chrome MV3 extension (overlay via Shadow DOM iframe) + Express API + LangGraph agent (Fastify, GLM/Z.ai), with a deterministic score core.
2. CAPTURE & ONBOARDING (25% of time)
   • Multi-path entry: right-click "Copy Job Description" on any job page → the overlay opens with the JD already filled in; a fallback flow opens the overlay in a new tab.
   • Auth lifecycle: login/register inside the overlay; CV loaded from the API into the TipTap rich markdown editor; language auto-detected from the JD.
3. CORE ANALYSIS LOOP (40% of time)
   • Live Execution: run Analyze — show the boolean match report with score breakdown and evidence excerpts per keyword.
   • Iterative Linting: apply rephrase chips directly in the editor (insert at cursor / find & replace), and walk through the semantic gaps, keyword phrases, and remove suggestions modals.
   • Generate Resume: one-click tailored resume with the live scoreBefore → scoreAfter delta — the highlight of the demo.
4. ARCHITECTURE & CLOSING (20% of time)
   • Trade-off talk: why semantics never change the score; anti-fabrication guard; caching (SQLite chunks, no TTL); async SSE delivery.
   • Roadmap: RAG-grounded gap advisor + bulk JD match search (see Future Roadmap below).
   • Q&A handover.

## Future Roadmap

### 1. RAG-Grounded Gap Advisor (retrieval picks candidates, LLM confirms)
* Today: the gapAdvisor receives ALL cv_atoms in the prompt, and the LLM must read all of them to decide rephrase vs absent for every missing keyword.
* Planned: embed CV and JD atoms once (cached by content hash in the existing SQLite chunk index — same idea as the chunks: same input always gives the same output, no TTL). Then each missing JD keyword becomes a **query**, and we retrieve the top-k most similar CV atoms using cosine similarity.
* Flow: keyword query → cosine top-k over ~100 CV vectors (brute-force in JS — no vector DB needed at this size) → the LLM confirms rephrase vs absent only for the retrieved candidates.
* Wins: the prompt stays small even with long CVs (multi-page CVs stop making the advice call bigger), and rephrase detection gets cheaper and more reliable.
* The rule stays: retrieval only **filters candidates for advice** — it never changes the score. The boolean backbone and the `looksFabricated` anti-fabrication guard stay the same.

### 2. Bulk JD Match Search (vector search over the user's saved jobs)
* This is where vector search really makes sense: scale. A user saves dozens of JDs over time, and each one is already broken into typed/tiered requirement chunks (`jd_chunks`).
* Planned: score the user's CV against every saved JD (boolean backbone per JD) and use embedding similarity to group and rank the pool.
* Show two groups:
    * **Ready now** — JDs already scoring **≥ 80**: apply today.
    * **High potential** — JDs where the missing keywords are all classified as **rephrase** (the CV already says the same thing with other words): applying the suggested rewrites pushes the projected score **above 90 with zero fabrication** — the gap is wording, not experience.
* Positioning: this completes the product — from "tailor one CV for one job" to "which of my 50 saved jobs should I apply to this week, ranked by honest match potential".
