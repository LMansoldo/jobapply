const ATS_AGENT_URL = process.env.ATS_AGENT_URL;
if (!ATS_AGENT_URL) throw new Error('ATS_AGENT_URL environment variable is not set');

async function pollJobResult(requestId: string, intervalMs = 2000, timeoutMs = 300_000): Promise<unknown> {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    await new Promise((r) => setTimeout(r, intervalMs));
    const res = await fetch(`${ATS_AGENT_URL}/result/${requestId}`);
    if (!res.ok) {
      const body = await res.json().catch(() => ({})) as { message?: string };
      const err = new Error(body.message ?? 'ATS agent polling error') as Error & { status: number };
      err.status = res.status;
      throw err;
    }
    const job = await res.json() as { status: string; report?: unknown; error?: string };
    if (job.status === 'done') return job.report;
    if (job.status === 'error') {
      const err = new Error(job.error ?? 'ATS agent job failed') as Error & { status: number };
      err.status = 502;
      throw err;
    }
  }
  const err = new Error('ATS agent timed out') as Error & { status: number };
  err.status = 504;
  throw err;
}

export async function analyzeWithATS(cvMarkdown: string, jobDescription: string, locale?: string, platform?: string, jobUrl?: string): Promise<unknown> {
  const response = await fetch(`${ATS_AGENT_URL}/analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ cvMarkdown, jobDescription, ...(locale && { locale }), ...(platform && { platform }), ...(jobUrl && { jobUrl }) }),
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({})) as { message?: string };
    const err = new Error(body.message ?? 'ATS agent error') as Error & { status: number };
    err.status = response.status;
    throw err;
  }

  const init = await response.json() as { requestId?: string };
  if (init.requestId) return pollJobResult(init.requestId);
  return init;
}

export async function generateResumeWithATS(cvMarkdown: string, jobDescription: string, locale?: string): Promise<unknown> {
  const response = await fetch(`${ATS_AGENT_URL}/generate-resume`, {
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
