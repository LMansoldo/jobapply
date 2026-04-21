import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY as string);
const MODEL = 'gemini-flash-lite-latest';

async function generate(systemInstruction: string, userPrompt: string): Promise<string> {
  const model = genAI.getGenerativeModel({ model: MODEL, systemInstruction });
  const result = await model.generateContent(userPrompt);
  return result.response.text();
}

export async function tailorJobDescription(originalDescription: string): Promise<string> {
  const system = `You are an expert technical recruiter and job description editor.
Your task is to rewrite job descriptions to be clear, concise, and structured.
Output only the rewritten job description — no preamble, no explanation.
Use the following sections when relevant:
1. Role Overview (2-3 sentences)
2. Key Responsibilities (bullet list)
3. Required Qualifications (bullet list)
4. Nice-to-Have (bullet list, if applicable)
5. What We Offer (bullet list, if applicable)`;

  const user = `Rewrite the following job description:

<job_description>
${originalDescription}
</job_description>`;

  return generate(system, user);
}

export async function generateCoverLetter(
  cvData: object,
  jobDescription: string,
  options: {
    lang?: string;
    rawVoiceInput?: { label: string; answer: string }[];
    recipientName?: string;
  } = {}
): Promise<string> {
  const { lang = 'en', rawVoiceInput, recipientName } = options;
const system = `<system>
You are a senior career coach and cover letter writer with a strong editorial eye.
Respond ONLY with the cover letter text — no markdown code blocks, no explanations, no preamble.
The letter must be written in ${lang}. This is non-negotiable.
</system>

<language_conventions lang="${lang}">
${lang === 'pt-BR' ? `
PORTUGUESE (PT-BR) CONVENTIONS:
- Do NOT translate English cover letter conventions directly — they sound foreign in Brazilian Portuguese
- Opening: never use "Prezado(a) Recrutador(a)" as first words — it reads as template
  Prefer: jump straight into the hook, save the greeting for after if needed
- Formality: PT-BR professional writing sits between formal and conversational
  Avoid both extremes: "Venho por meio desta" (too stiff) and "Oi, tudo bem?" (too casual)
- Metrics: use Brazilian number formatting — "R$ 2,3 milhões", "40%", "3 semanas"
- Verb tense for achievements: use pretérito perfeito composto naturally
  ("tenho construído", "trabalhei", "entregamos") — not everything in simple past
- Closing: assertive but not aggressive
  AVOID: "Agradeço imensamente pela oportunidade" (subservient)
  PREFER: something that signals confidence and next step without begging
- Length: PT-BR hiring culture accepts slightly shorter letters — 3 tight paragraphs often stronger than 4
` : `
ENGLISH CONVENTIONS:
- US/UK distinction: if determinable from JD, match the spelling and idiom
  US: "I've built...", "color", "optimize"
  UK: "I have built...", "colour", "optimise"
- Opening: never start with "I" as the first word of the letter
- Formality: EN professional writing is more direct than PT-BR — shorter sentences, fewer subordinate clauses
- Metrics: use EN number formatting — "$2.3M", "40%", "3 weeks"
- Closing: end with forward momentum, not gratitude
  AVOID: "Thank you for your time and consideration"
  PREFER: a confident statement about next steps or genuine interest in a specific aspect of the role
- Length: 3-4 tight paragraphs — EN hiring culture penalizes verbosity more than PT-BR
`}
</language_conventions>

<style_rules>
NEVER use these patterns — they signal AI-generated text immediately:

Hollow openers (both languages):
- "I am writing to express my interest in..."
- "I am excited to apply for the position of..."
- "Estou escrevendo para manifestar meu interesse..."
- "Com grande entusiasmo, venho candidatar-me..."
- Any opener that names the job title in the first sentence

Banned vocabulary:
- leverage → use, apply, tap into
- utilize → use
- implement → build, ship, roll out
- deliver → ship, produce, finish
- drive → push, run, lead, move
- ensure → make sure, check that
- seamless → smooth, clean, without friction
- robust → solid, reliable, battle-tested
- passionate → [show it through the work, never say it]
- dynamic → [delete]
- innovative → [describe what was actually new]
- results-driven, detail-oriented, team player → [delete all]
- "track record of" → name the actual track record
- "proven ability to" → show the proof, skip the claim

PT-BR specific banned:
- "venho por meio desta"
- "prezado(a) recrutador(a)" as opener
- "agradeço imensamente"
- "me coloco à disposição"
- "atenciosamente" as the only closer signal

EN specific banned:
- "I look forward to hearing from you"
- "Thank you for your time and consideration"
- "Please find my CV attached"
- "I would welcome the opportunity to discuss"
</style_rules>

<rhythm_rules>
- Mix short sentences (under 8 words) with longer ones (20-30 words)
- No two consecutive paragraphs with the same opening structure
- The letter must have at least one sentence under 6 words that lands like a punch
- EN: never start more than one paragraph with "I"
- PT-BR: vary between starting with the subject and starting with a verb or circumstance
- Allow one informal aside or contraction where it fits naturally
</rhythm_rules>

<human_markers>
- Open with a specific situation, problem, or observation — not a self-description
- One oddly specific detail (a real number, a real scenario) per body paragraph
- At least one sentence that only this candidate could have written
- The closing paragraph must name something specific about the company or role
  — not generic enthusiasm, but a real reason this opportunity is different for them
</human_markers>

<integrity_rules>
NEVER invent, fabricate, or embellish:
- Any experience, project, or role not present in the CV
- Any metric or number not present in the CV
- Any skill, tool, or technology not listed in the CV
- Any claim about the company not supported by the job description
If the CV lacks a specific experience the JD requires, acknowledge the adjacent skill
or transferable context — do not invent the missing experience.
</integrity_rules>`

const user = `<job_description>
${jobDescription}
</job_description>

<cv>
${JSON.stringify(cvData, null, 2)}
</cv>

${rawVoiceInput ? `<raw_voice_input>
${rawVoiceInput.map(a => `Q: ${a.label}\nA: ${a.answer}`).join('\n\n')}
</raw_voice_input>` : ''}

${recipientName ? `<recipient>
Address the letter to: ${recipientName}
</recipient>` : ''}

<instructions>
Before writing, think step by step:

1. Voice extraction
   Primary source: raw_voice_input (if provided) — extract tone, vocabulary, rhythm
   Secondary source: CV summary and experience bullet points
   The letter must sound like the candidate wrote it on a good day — not like a recruiter rewrote it
   Apply the language_conventions for ${lang} throughout

2. Hook identification
   Find the single strongest intersection between the candidate's background and the JD
   That intersection becomes the opening — not a greeting, not a title mention
   Start in medias res: a problem, a moment, a specific observation about the role

3. Paragraph structure
   P1 — Hook: specific situation or observation that earns the reader's attention (3-4 sentences)
   P2 — Strongest match: one concrete experience from the CV that directly addresses
        the JD's most critical requirement — with a real metric or specific outcome
   P3 — Secondary match or transferable context: connects another part of their background
        to a secondary requirement — or addresses a gap honestly with adjacent skills
   P4 — Closing: specific reason this company/role matters to this candidate
        Name something real from the JD — a product detail, a stated challenge, a team mission
        Close with confidence, not with permission-asking
        Apply the closing conventions for ${lang}

4. Self-check before output
   - Does the opener mention the job title or use a banned opener? → rewrite it
   - Does any sentence use a word from banned_vocabulary? → replace it
   - Does any PT-BR banned phrase appear? → remove it
   - Does any EN banned closer appear? → replace it
   - Are all paragraphs a similar length? → break the rhythm
   - Does the closing ask for permission instead of asserting? → fix it
   - Does any claim go beyond what the CV supports? → remove or reframe it
   Apply fixes silently.

Output only the final cover letter — plain text, no markdown, no subject line.
</instructions>`;

  return generate(system, user);
}

export async function generateVideoScript(cvData: object, jobDescription: string): Promise<string> {
  const system = `You are an expert personal branding coach and video script writer.
You will receive a candidate's CV data (as JSON) and a job description.
Write a structured script for a short (2-3 minute) personal presentation video that:
- Opens with a memorable introduction
- Highlights the 2-3 most relevant experiences for this role
- Showcases key technical skills naturally in context
- Explains why the candidate is excited about this specific role/company
- Closes with a confident call to action
Structure the script with clearly labeled sections.
Keep the language natural and spoken — as if talking to a hiring manager.
NEVER invents or fabricates any experience, skill, or credential.
Output only the script in Markdown. No explanations.`;

  const user = `Job Description:
<job_description>
${jobDescription}
</job_description>

Candidate CV (JSON):
<cv>
${JSON.stringify(cvData, null, 2)}
</cv>

Write the video script in Markdown.`;

  return generate(system, user);
}

export async function tailorCV(cvData: object, jobDescription: string): Promise<string> {
  const system = `You are an expert career coach and professional CV writer.
You will receive a candidate's CV data (as JSON) and a job description.
Your task is to produce a tailored CV in clean Markdown format that:
- Highlights skills and experiences most relevant to the job
- Uses keywords from the job description naturally
- Reorders bullet points to lead with the most relevant achievements
- NEVER invents or fabricates any experience, skill, or credential
- Keeps all dates and company names exactly as provided
Output only the tailored CV in Markdown. No explanations.`;

  const user = `Job Description:
<job_description>
${jobDescription}
</job_description>

Candidate CV (JSON):
<cv>
${JSON.stringify(cvData, null, 2)}
</cv>

Produce the tailored CV in Markdown.`;

  return generate(system, user);
}
