import { genAI } from '../../lib/gemini'
import type {
  CV,
  MappedCV,
  KeywordPhrase,
  RemoveSuggestion,
  SkillGroup,
  Experience,
  Education,
  Language,
  Certification,
  Project
} from '../../types'

const model = genAI.getGenerativeModel({ model: 'gemini-flash-lite-latest' })

interface AdaptedCVResponse {
  contact: {
    fullName?: string
    email?: string
    phone?: string
    location?: string
    linkedin?: string
    github?: string
    portfolio?: string
  }
  summary?: string
  skills?: SkillGroup[]
  experience?: Experience[]
  education?: Education[]
  languages?: Language[]
  certifications?: Certification[]
  projects?: Project[]
  localeVersions?: Array<{
    locale: 'en' | 'pt-BR'
    summary?: string
    skills?: SkillGroup[]
    experience?: Experience[]
  }>
}

const LOCALE_LABEL: Record<string, string> = {
  'en': 'English',
  'pt-BR': 'Brazilian Portuguese',
}

function buildCvGeneratorPrompt(
  cv: CV,
  jd: string,
  semanticGaps: string[],
  rephraseSuggestions: Array<{ from: string; to: string }>,
  keywordPhrases: KeywordPhrase[],
  removeSuggestions: RemoveSuggestion[],
  locale?: string
): string {
  const lang = LOCALE_LABEL[locale ?? 'en'] ?? 'English'

  return `<system>
You are a professional CV writer and ATS optimization specialist. Your task is to generate an adapted version of the candidate's CV that addresses all the analysis suggestions while preserving personal information and maintaining professional integrity.

Respond ONLY with a valid JSON object matching the exact structure below — no markdown, no explanation, no preamble. All text content MUST be in ${lang}. This is non-negotiable.

CRITICAL RULES:
1. PRESERVE all personal contact information exactly as provided (name, email, phone, etc.)
2. Only modify sections where improvements are suggested
3. Maintain the original CV's structure and formatting style
4. Integrate keyword phrases naturally, don't just append them
5. Remove only the specific items suggested for removal
6. Keep all dates, company names, and role titles accurate
</system>

<original_cv>
${JSON.stringify(cv, null, 2)}
</original_cv>

<job_description>
${jd}
</job_description>

<analysis_suggestions>
### Semantic Gaps
${semanticGaps.map(gap => `- ${gap}`).join('\n')}

### Rephrase Suggestions
${rephraseSuggestions.map(s => `- FROM: "${s.from}"\n  TO: "${s.to}"`).join('\n')}

### Keyword Phrases to Integrate
${keywordPhrases.map(kp => `- ${kp.keyword}:\n${kp.phrases.map(p => `  • ${p}`).join('\n')}`).join('\n')}

### Remove Suggestions
${removeSuggestions.map(rs => `- SECTION: ${rs.section}\n  ITEM: ${rs.item}\n  REASON: ${rs.reason}`).join('\n')}
</analysis_suggestions>

<instructions>
Generate an adapted CV that addresses ALL the suggestions above. Follow these guidelines:

1. CONTACT SECTION: Preserve EXACTLY as-is. Do not modify name, email, phone, location, or URLs.

2. SUMMARY: Rewrite to address semantic gaps and integrate relevant keywords. Keep it concise (3-4 sentences).

3. SKILLS:
   - Reorganize skill groups if needed for better ATS parsing
   - Add missing skills identified in semantic gaps
   - Remove any skills suggested for removal
   - Keep technical and soft skills separated

4. EXPERIENCE:
   - Apply rephrase suggestions to relevant bullet points
   - Integrate keyword phrases naturally into achievements
   - Remove specific items suggested for removal
   - Add metrics and quantifiable results where possible
   - Maintain chronological order

5. EDUCATION & OTHER SECTIONS:
   - Update only if specific suggestions apply
   - Otherwise preserve as-is

6. LOCALE SUPPORT:
   - If locale is specified (${lang}), ensure all text is in that language
   - If CV has localeVersions, update the appropriate version

IMPORTANT: Only make changes where suggestions exist. If no suggestion applies to a section, preserve it exactly as in the original CV.
</instructions>

<response_format>
Return a JSON object with this exact structure:
{
  "contact": {
    "fullName": "string (PRESERVE ORIGINAL)",
    "email": "string (PRESERVE ORIGINAL)",
    "phone": "string (PRESERVE ORIGINAL)",
    "location": "string (PRESERVE ORIGINAL)",
    "linkedin": "string (PRESERVE ORIGINAL)",
    "github": "string (PRESERVE ORIGINAL)",
    "portfolio": "string (PRESERVE ORIGINAL)"
  },
  "summary": "string (updated if needed)",
  "skills": [
    {
      "label": "string",
      "items": ["string", "string"]
    }
  ],
  "experience": [
    {
      "role": "string",
      "company": "string",
      "location": "string",
      "period": "string",
      "context": "string",
      "highlights": ["string", "string"]
    }
  ],
  "education": [
    {
      "degree": "string",
      "field": "string",
      "institution": "string",
      "location": "string",
      "period": "string",
      "notes": "string"
    }
  ],
  "languages": [
    {
      "language": "string",
      "level": "string",
      "score": "string"
    }
  ],
  "certifications": [
    {
      "name": "string",
      "organization": "string",
      "date": "string"
    }
  ],
  "projects": [
    {
      "name": "string",
      "url": "string",
      "description": "string",
      "highlights": ["string", "string"]
    }
  ],
  "localeVersions": [
    {
      "locale": "en" | "pt-BR",
      "summary": "string",
      "skills": [
        {
          "label": "string",
          "items": ["string", "string"]
        }
      ],
      "experience": [
        {
          "role": "string",
          "company": "string",
          "location": "string",
          "period": "string",
          "context": "string",
          "highlights": ["string", "string"]
        }
      ]
    }
  ]
}
</response_format>`
}

export async function cvGeneratorNode(state: {
  input: { jobDescription: string; locale?: 'en' | 'pt-BR' }
  mapped?: MappedCV
  semanticGaps?: string[]
  rephraseSuggestions?: Array<{ from: string; to: string }>
  keywordPhrases?: KeywordPhrase[]
  removeSuggestions?: RemoveSuggestion[]
}): Promise<{ adaptedCV: CV }> {
  const cv = state.mapped?.raw
  if (!cv) throw new Error('cvGeneratorNode: mapped CV is missing from state')

  const semanticGaps = state.semanticGaps ?? []
  const rephraseSuggestions = state.rephraseSuggestions ?? []
  const keywordPhrases = state.keywordPhrases ?? []
  const removeSuggestions = state.removeSuggestions ?? []

  const prompt = buildCvGeneratorPrompt(
    cv,
    state.input.jobDescription,
    semanticGaps,
    rephraseSuggestions,
    keywordPhrases,
    removeSuggestions,
    state.input.locale
  )

  const result = await model.generateContent(prompt)
  const raw = result.response.text()

  let parsed: AdaptedCVResponse
  try {
    const clean = raw.replace(/^```json\s*/i, '').replace(/```\s*$/, '').trim()
    parsed = JSON.parse(clean) as AdaptedCVResponse
  } catch (error) {
    console.error('Failed to parse Gemini response:', raw.slice(0, 500))
    throw new Error(`Failed to parse Gemini response as JSON: ${(error as Error).message}`)
  }

  // Convert AdaptedCVResponse to CV type
  const adaptedCV: CV = {
    ...cv, // Preserve original fields not in response
    fullName: parsed.contact.fullName ?? cv.fullName,
    email: parsed.contact.email ?? cv.email,
    phone: parsed.contact.phone ?? cv.phone,
    location: parsed.contact.location ?? cv.location,
    linkedin: parsed.contact.linkedin ?? cv.linkedin,
    github: parsed.contact.github ?? cv.github,
    portfolio: parsed.contact.portfolio ?? cv.portfolio,
    summary: parsed.summary ?? cv.summary,
    skills: parsed.skills ?? cv.skills,
    experience: parsed.experience ?? cv.experience,
    education: parsed.education ?? cv.education,
    languages: parsed.languages ?? cv.languages,
    certifications: parsed.certifications ?? cv.certifications,
    projects: parsed.projects ?? cv.projects,
    localeVersions: parsed.localeVersions ?? cv.localeVersions,
  }

  return { adaptedCV }
}