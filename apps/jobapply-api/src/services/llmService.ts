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
