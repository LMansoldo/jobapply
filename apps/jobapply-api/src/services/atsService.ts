const ATS_AGENT_URL = process.env.ATS_AGENT_URL;
if (!ATS_AGENT_URL) throw new Error('ATS_AGENT_URL environment variable is not set');

const LINKEDIN_AGENT_URL = process.env.LINKEDIN_AGENT_URL;
if (!LINKEDIN_AGENT_URL) throw new Error('LINKEDIN_AGENT_URL environment variable is not set');

// Single connection per analysis; aborts if the agent exceeds the deadline
export const STREAM_DEADLINE_MS = 300_000;

async function streamATSResult(requestId: string): Promise<unknown> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), STREAM_DEADLINE_MS);

  try {
    const res = await fetch(`${ATS_AGENT_URL}/result/${requestId}/stream`, {
      headers: { Accept: 'text/event-stream' },
      signal: controller.signal,
    });
    if (!res.ok || !res.body) {
      const err = new Error('ATS agent result error') as Error & { status: number };
      err.status = res.status;
      throw err;
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    let chunk = await reader.read();
    while (!chunk.done) {
      buffer += decoder.decode(chunk.value, { stream: true });

      let sep = buffer.indexOf('\n\n');
      while (sep !== -1) {
        const frame = buffer.slice(0, sep);
        buffer = buffer.slice(sep + 2);
        sep = buffer.indexOf('\n\n');

        const dataLine = frame.split('\n').find((line) => line.startsWith('data:'));
        if (!dataLine) continue; // heartbeat comment
        const job = JSON.parse(dataLine.slice(5).trim()) as { status: string; report?: unknown; error?: string };
        if (job.status === 'done') return job.report;
        if (job.status === 'error') throw new Error(job.error ?? 'ATS analysis failed');
      }

      chunk = await reader.read();
    }

    throw new Error('ATS analysis timed out');
  } catch (err) {
    if (err instanceof Error && err.name === 'AbortError') throw new Error('ATS analysis timed out');
    throw err;
  } finally {
    clearTimeout(timer);
  }
}

export async function startATSAnalysis(cvMarkdown: string, jobDescription: string, locale?: string): Promise<{ requestId: string }> {
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

  return response.json() as Promise<{ requestId: string }>;
}

export async function openATSResultStream(requestId: string, signal?: AbortSignal): Promise<Response> {
  const response = await fetch(`${ATS_AGENT_URL}/result/${requestId}/stream`, {
    headers: { Accept: 'text/event-stream' },
    ...(signal && { signal }),
  });
  if (!response.ok || !response.body) {
    const err = new Error('ATS agent result error') as Error & { status: number };
    err.status = response.status;
    throw err;
  }
  return response;
}

export async function analyzeWithATS(cvMarkdown: string, jobDescription: string, locale?: string): Promise<unknown> {
  const { requestId } = await startATSAnalysis(cvMarkdown, jobDescription, locale);
  return streamATSResult(requestId)
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
