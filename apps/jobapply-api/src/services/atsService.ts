const ATS_AGENT_URL = process.env.ATS_AGENT_URL;
if (!ATS_AGENT_URL) throw new Error('ATS_AGENT_URL environment variable is not set');

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

  return response.json();
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

export async function analyzeLinkedInWithLinkedInAgent(payload: unknown): Promise<{ requestId: string }> {
  const url = `${process.env.LINKEDIN_AGENT_URL}/analyze`
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!response.ok) {
    throw new Error(`linkedin-agent /analyze failed: ${response.status}`)
  }
  return response.json() as Promise<{ requestId: string }>
}

export async function getLinkedInJobResult(requestId: string): Promise<unknown> {
  const url = `${process.env.LINKEDIN_AGENT_URL}/result/${requestId}`
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`linkedin-agent /result failed: ${response.status}`)
  }
  return response.json()
}
