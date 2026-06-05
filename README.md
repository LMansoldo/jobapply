# JobApply

Job application platform MVP with AI-powered ATS analysis.

## Architecture

```
jobapply-app → (REST) → jobapply-api → (HTTP) → ats-agent → Gemini API
                              ↓
                          MongoDB
```

| Service | Stack | Port |
|---------|-------|------|
| `jobapply-app` | Vite + React + TypeScript | 5173 |
| `jobapply-api` | Express + MongoDB + JWT | 3000 |
| `ats-agent` | Fastify + LangGraph + Gemini | 3001 |
| `linkedin-agent` | LangGraph + Gemini | — |
| `@jobapply/ui` | React + TypeScript (design system) | — |

## Prerequisites

- Node.js >= 18
- Yarn 1.x (`npm install -g yarn`)
- MongoDB running locally or a remote URI
- Google Gemini API key

## Installation

```bash
git clone https://github.com/lucasmansoldo/jobapply.git
cd jobapply
yarn install
```

## Environment Variables

Each app requires its own `.env` file. Copy the examples and fill in your keys:

```bash
cp apps/jobapply-api/.env.example apps/jobapply-api/.env
cp apps/ats-agent/.env.example    apps/ats-agent/.env
```

**`apps/jobapply-api/.env`**
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/jobapply
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=7d
GOOGLE_AI_API_KEY=your_google_ai_api_key
ATS_AGENT_URL=http://localhost:3001
LINKEDIN_CLIENT_ID=your_linkedin_client_id
LINKEDIN_CLIENT_SECRET=your_linkedin_client_secret
```

**`apps/ats-agent/.env`**
```env
PORT=3001
GEMINI_API_KEY=your_google_ai_api_key
```

**`apps/jobapply-app/.env`**
```env
VITE_API_URL=http://localhost:3000
```

## Running in Development

### All services at once

```bash
yarn dev
```

### Individual services

```bash
yarn dev:api      # jobapply-api   → http://localhost:3000
yarn dev:agent    # ats-agent      → http://localhost:3001
yarn dev:app      # jobapply-app   → http://localhost:5173
```

## Other Commands

```bash
yarn build         # Build all packages
yarn lint          # Lint all packages
yarn typecheck     # Typecheck all packages
```
