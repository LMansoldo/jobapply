import 'dotenv/config'
import Fastify from 'fastify'
import { registerRoutes } from './api/routes'

const PORT = parseInt(process.env.PORT ?? '3001', 10)

async function main(): Promise<void> {
  const app = Fastify({ logger: true })

  await registerRoutes(app)

  try {
    await app.listen({ port: PORT, host: '0.0.0.0' })
  } catch (err) {
    app.log.error(err)
    process.exit(1)
  }
}

main()
