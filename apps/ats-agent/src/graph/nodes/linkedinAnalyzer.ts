import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY ?? '')
const model = genAI.getGenerativeModel({ model: 'gemini-flash-lite-latest' })

interface LinkedInProfile {
  headline: string
  about: string
  experience: string
  skills: string
  education: string
  certifications?: string
}

export interface VoiceAnswer {
  label: string
  answer: string
}

interface LinkedInAnalysisResult {
  voiceProfile: {
    tone: 'direct' | 'narrative' | 'technical' | 'conversational'
    signaturePatterns: string[]
    avoidedPatterns: string[]
    rawInputMissing: boolean
    qualityNote: string
  }
  headlineAnalysis: {
    currentScore: 'weak' | 'moderate' | 'strong'
    alternatives: string[]
  }
  aboutAudit: {
    issues: string[]
    rewrite: string | null
  }
  experienceGaps: Array<{ role: string; original: string; rewrite: string }>
  keywordGaps: {
    technical: string[]
    domain: string[]
    softSkills: string[]
    certifications: string[]
  }
  quickWins: string[]
  overallScore: {
    score: number
    strengths: string[]
    blockers: string[]
    priorityAction: string
  }
}

const LOCALE_LABEL: Record<string, string> = {
  'en': 'English',
  'pt-BR': 'Brazilian Portuguese',
}

const PT_BR_MARKERS = /\b(de|da|do|das|dos|em|por|para|com|que|uma|um|no|na|nos|nas|ao|aos|às|pelo|pela|pelos|pelas|se|são|foi|era|está|estou|tenho|trabalhei|trabalhando|atuei|atuando|responsável|desenvolvimento|empresa|equipe|gerenciamento|liderança|projetos|anos|meses|cargo|setor)\b/gi

function detectLocale(profile: LinkedInProfile): string {
  const text = [profile.headline, profile.about, profile.experience, profile.skills].join(' ')
  const matches = text.match(PT_BR_MARKERS) ?? []
  return matches.length >= 5 ? 'pt-BR' : 'en'
}

function buildLinkedInPrompt(
  profile: LinkedInProfile,
  targetRole: string | undefined,
  locale?: string,
  voiceAnswers: VoiceAnswer[] = []
): string {
  const resolvedLocale = locale ?? detectLocale(profile)
  const lang = LOCALE_LABEL[resolvedLocale] ?? 'English'

  return `<system>
You are a senior LinkedIn profile strategist and recruiter with a strong editorial eye.
Respond ONLY with a valid JSON object — no markdown, no explanation, no preamble.
All string values MUST be in ${lang}. This is non-negotiable.
</system>

<style_rules>
NEVER use these patterns — they signal AI-generated text and destroy credibility:

Hollow openers and filler:
- "Apaixonado por", "Entusiasta de", "Profissional dedicado", "Perfil dinâmico"
- "Passionate about", "Enthusiastic", "Results-driven", "Dynamic professional"
- "At my core", "I gravitate toward", "I thrive in"

Banned vocabulary — find specific alternatives every time:
- leverage → use, apply, tap into
- utilize → use
- implement → build, ship, roll out, introduce
- deliver → ship, produce, finish, hand off
- drive → push, run, lead, move
- ensure → make sure, check that
- facilitate → help, run, make possible
- seamless → smooth, clean, without friction
- robust → solid, reliable, battle-tested
- innovative → [delete — describe what was actually new]
- dynamic → [delete — describe what actually changed]
- passionate → [delete — show it through the work described]

Generic CTAs:
- "Vamos conectar!", "Entre em contato!", "Let's connect!", "Feel free to reach out"
- "Aberto a novas oportunidades", "Em busca de novos desafios"
</style_rules>

<rhythm_rules>
Vary sentence length deliberately and unpredictably:
- Mix short sentences (under 8 words) with longer ones (20-30 words)
- Occasionally start a sentence with "And" or "But" / "E" or "Mas" where natural
- Do not make all bullets the same grammatical structure
  BAD: three bullets all starting with past-tense verb + object + metric
  GOOD: mix structures — one leads with context, one with result, one with the action
- Allow one slightly informal contraction or aside per paragraph where it fits naturally
</rhythm_rules>

<human_markers>
Inject subtle markers of human writing without making the text unprofessional:
- One sentence per section slightly more conversational than the rest
- Occasionally lead a bullet with context instead of a power verb
  ("After the platform migration, built the audit trail that..." vs "Built audit trail...")
- Use specific, slightly unusual word choices — pulled from the candidate's raw_voice_input
- Include one oddly specific detail per role that sounds too precise to be invented
</human_markers>

<linkedin_profile>
  <headline>${profile.headline}</headline>
  <about>${profile.about}</about>
  <experience>${profile.experience}</experience>
  <skills>${profile.skills}</skills>
  <education>${profile.education}</education>
  <certifications>${profile.certifications ?? "none"}</certifications>
</linkedin_profile>

<raw_voice_input>
${voiceAnswers.length > 0
  ? voiceAnswers.map(a => `Q: ${a.label}\nA: ${a.answer}`).join('\n\n')
  : "NOT PROVIDED — base voiceProfile on the linkedin_profile text only. Flag in voiceProfile that raw input was missing and quality may be reduced."
}
</raw_voice_input>

${targetRole
  ? `<target_role>\n${targetRole}\n</target_role>`
  : `<target_role>Not provided — infer the most likely career direction from the profile and raw_voice_input.</target_role>`
}

<edge_context>
${!profile.about || profile.about.trim().length < 100 ? "WARNING: About section is empty or very short. Prioritize About rewrite as highest impact action." : ""}
${!profile.headline || profile.headline === profile.experience?.split("\n")[0] ? "WARNING: Headline appears to be just a job title. Flag this as a missed opportunity." : ""}
${!targetRole ? "WARNING: No target role provided. Base all recommendations on the profile's implied career direction." : ""}
${voiceAnswers.length === 0 ? "WARNING: No raw voice input provided. Rewrites will be less personalized. Flag this risk in voiceProfile.rawInputMissing." : ""}
</edge_context>

<instructions>
Analyze the LinkedIn profile for discoverability, recruiter appeal, and alignment with the target role.

### voiceProfile (do this first — everything else depends on this)
Primary source: raw_voice_input (the candidate's unedited answers).
Secondary source: linkedin_profile existing text.

Extract:
- tone: how they naturally write/speak (direct, narrative, technical, conversational)
- signaturePatterns: 3 characteristic phrases, constructions, or vocabulary choices
  pulled verbatim or near-verbatim from raw_voice_input
  — informal expressions count, imperfections count, jargon they use counts
- avoidedPatterns: what sounds foreign to their voice
  (if they never use bullet points naturally, note that;
   if they speak in short punchy sentences, note that long prose feels wrong)
- rawInputMissing: true | false
- qualityNote: one sentence on confidence level of the voice extraction

All rewrites must be built ON TOP of the raw_voice_input material.
Edit and elevate — never replace with generic professional language.
If the candidate wrote "debugava problema que todo mundo jurava que era de backend",
that phrase or its spirit must survive into the final rewrite.

### headlineAnalysis
Evaluate the current headline. Flag if it wastes the 220-character limit with just a job title.
Provide up to 3 alternative headline versions using the format:
[Role/Specialty] · [Key Tech or Domain] · [Value Proposition or CTA]
Each must be under 220 characters.
CTA must name a specific conversation or offer — never a generic "let's connect".
Pull vocabulary and framing from voiceProfile.signaturePatterns where possible.
Apply rhythm_rules: vary structure across the 3 alternatives.

### aboutAudit
Step 1 — Score the current About (pass/fail each):
  [ ] Hook in first 300 chars drops reader into a situation, not a self-description
  [ ] Written in first person throughout
  [ ] Contains keywords relevant to target role
  [ ] CTA names a specific conversation, not a generic contact invite
  [ ] No words from banned_vocabulary or hollow openers

Step 2 — If 2+ criteria fail, provide a full rewrite.
         If 1 or 0 fail, provide targeted edits only.

Rewrite rules:
- Must open with a specific situation, problem, or moment from raw_voice_input
  — if the candidate described a real problem or project, start there
- Preserve at least one phrase from raw_voice_input verbatim or near-verbatim
- CTA must reference what the candidate specifically offers or is looking for,
  using their own words where possible
- Under 2,000 characters
- Apply rhythm_rules and human_markers throughout
- The rewrite is a DRAFT — leave one natural gap the candidate can fill
  with a detail only they would know

### experienceGaps
For each role, identify:
- Bullets that are task-based, not achievement-based
- Missing metrics or quantification
- Language mismatches vs target role
Provide specific rewrites for the worst offenders (max 5 total across all roles).
Each rewrite must apply rhythm_rules — no two bullets with identical grammatical structure.
Pull specific vocabulary from voiceProfile.signaturePatterns where it fits.

### keywordGaps
List keywords recruiters searching for the target role would use, absent from the profile.
Group by: technical skills | domain/industry | soft skills | certifications.

### quickWins
List up to 5 high-impact, low-effort changes specific to this profile.
Not generic advice — each must reference something concrete from the profile or raw_voice_input.

### overallScore
Rate the profile 1-10 for recruiter discoverability for the target role.
Include: score, top 2 strengths, top 2 blockers, one priority action.
priorityAction must be written as a draft the candidate should edit —
leave one gap for them to fill with personal context.

### self_check (internal — do not include in output)
Before finalizing, verify every rewritten string:
- No word from banned_vocabulary — replace any found
- No hollow opener — rewrite
- No 3+ consecutive bullets with identical grammatical structure — break the pattern
- At least one short sentence (under 8 words) per block of text
- voiceProfile.signaturePatterns appear in at least one rewrite field
Apply fixes silently. Do not include this field in the JSON output.
</instructions>

Respond with this exact JSON shape:
{
  "voiceProfile": {
    "tone": "direct | narrative | technical | conversational",
    "signaturePatterns": ["string", "string", "string"],
    "avoidedPatterns": ["string"],
    "rawInputMissing": false,
    "qualityNote": "string"
  },
  "headlineAnalysis": {
    "currentScore": "weak | moderate | strong",
    "alternatives": ["string", "string", "string"]
  },
  "aboutAudit": {
    "issues": ["string"],
    "rewrite": "string | null"
  },
  "experienceGaps": [{ "role": "string", "original": "string", "rewrite": "string" }],
  "keywordGaps": {
    "technical": ["string"],
    "domain": ["string"],
    "softSkills": ["string"],
    "certifications": ["string"]
  },
  "quickWins": ["string"],
  "overallScore": {
    "score": 7,
    "strengths": ["string", "string"],
    "blockers": ["string", "string"],
    "priorityAction": "string"
  }
}`
}

export async function linkedinAnalyzerNode(state: {
  input: {
    targetRole?: string
    locale?: string
    voiceAnswers?: VoiceAnswer[]
    profile: {
      headline: string
      about: string
      experience: string
      skills: string
      education: string
      certifications?: string
    }
  }
}): Promise<LinkedInAnalysisResult> {
  const { targetRole, locale, voiceAnswers = [], profile } = state.input

  if (!profile) {
    throw new Error('linkedinAnalyzerNode: LinkedIn profile is missing from state')
  }

  const prompt = buildLinkedInPrompt(profile, targetRole, locale, voiceAnswers)

  const result = await model.generateContent(prompt)
  const raw = result.response.text()

  let parsed: LinkedInAnalysisResult
  try {
    const clean = raw.replace(/^```json\s*/i, '').replace(/```\s*$/, '').trim()
    parsed = JSON.parse(clean) as LinkedInAnalysisResult
  } catch (error) {
    console.error('Failed to parse Gemini response:', raw.slice(0, 200))
    throw new Error(`Failed to parse Gemini response as JSON: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }

  // Validate required fields
  if (!parsed.headlineAnalysis || !parsed.aboutAudit || !parsed.overallScore) {
    throw new Error('Invalid LinkedIn analysis response: missing required fields')
  }

  return parsed
}