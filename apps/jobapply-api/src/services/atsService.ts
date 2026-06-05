const ATS_AGENT_URL = process.env.ATS_AGENT_URL;
if (!ATS_AGENT_URL) throw new Error('ATS_AGENT_URL environment variable is not set');

const LINKEDIN_AGENT_URL = process.env.LINKEDIN_AGENT_URL;
if (!LINKEDIN_AGENT_URL) throw new Error('LINKEDIN_AGENT_URL environment variable is not set');

async function pollATSResult(requestId: string): Promise<unknown> {
  const MAX_WAIT_MS = 120_000
  const POLL_INTERVAL_MS = 2_000
  const deadline = Date.now() + MAX_WAIT_MS

  while (Date.now() < deadline) {
    const res = await fetch(`${ATS_AGENT_URL}/result/${requestId}`)
    if (!res.ok) {
      const err = new Error('ATS agent result error') as Error & { status: number }
      err.status = res.status
      throw err
    }
    const job = await res.json() as { status: string; report?: unknown; adaptedCV?: unknown; resume?: unknown; error?: string }
    if (job.status === 'done') return job.report
    if (job.status === 'error') throw new Error(job.error ?? 'ATS analysis failed')
    await new Promise(resolve => setTimeout(resolve, POLL_INTERVAL_MS))
  }

  throw new Error('ATS analysis timed out')
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

  const { requestId } = await response.json() as { requestId: string; status: string }
  return pollATSResult(requestId)
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
  const url = `${LINKEDIN_AGENT_URL}/analyze`
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
  const url = `${LINKEDIN_AGENT_URL}/result/${requestId}`
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`linkedin-agent /result failed: ${response.status}`)
  }
  return response.json()
}
