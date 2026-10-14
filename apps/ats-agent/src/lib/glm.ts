import OpenAI from 'openai'

let client: OpenAI | undefined

function getClient(): OpenAI {
  if (!client) {
    const apiKey = process.env.ZAI_API_KEY
    if (!apiKey) throw new Error('ZAI_API_KEY environment variable is not set')
    client = new OpenAI({
      apiKey,
      baseURL: 'https://api.z.ai/api/paas/v4',
    })
  }
  return client
}

const MODEL = 'glm-5.3-flash'

export async function generate(prompt: string): Promise<string> {
  const completion = await getClient().chat.completions.create({
    model: MODEL,
    // glm-5.3-flash always reasons; 'low' trades output quality for latency
    reasoning_effort: 'low',
    messages: [{ role: 'user', content: prompt }],
  })
  return completion.choices[0]?.message?.content ?? ''
}
