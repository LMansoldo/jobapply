const ATS_AGENT_URL = process.env.ATS_AGENT_URL;
if (!ATS_AGENT_URL) throw new Error('ATS_AGENT_URL environment variable is not set');

export async function analyzeWithATS(cvMarkdown: string, jobDescription: string, locale?: string): Promise<unknown> {
  const response = await fetch(`${ATS_AGENT_URL}/analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ cvMarkdown, jobDescription, ...(locale && { locale }) }),
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({})) as { message?: string };
    const err = new Error(body.message ?? 'ATS agent error') as Error & { status: number };
    err.status = response.status;
    throw err;
  }

  return response.json();
}

export async function generateCVWithATS(cv: object, jobDescription: string, locale?: string): Promise<unknown> {
  const response = await fetch(`${ATS_AGENT_URL}/generate-cv`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ cv, jobDescription, ...(locale && { locale }) }),
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({})) as { message?: string };
    const err = new Error(body.message ?? 'ATS agent error') as Error & { status: number };
    err.status = response.status;
    throw err;
  }

  return response.json();
}

export async function analyzeLinkedInWithATS(profile: {
  headline: string;
  about: string;
  experience: string;
  skills: string;
  education: string;
  certifications?: string;
}, targetRole?: string, locale?: string, voiceAnswers?: { label: string; answer: string }[]): Promise<unknown> {
  const response = await fetch(`${ATS_AGENT_URL}/linkedin-analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      profile,
      ...(targetRole && { targetRole }),
      ...(locale && { locale }),
      ...(voiceAnswers?.length && { voiceAnswers }),
    }),
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({})) as { message?: string };
    const err = new Error(body.message ?? 'ATS agent error') as Error & { status: number };
    err.status = response.status;
    throw err;
  }

  return response.json();
}
