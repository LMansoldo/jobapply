<div align="center">

# DoJob

**CV tailoring and ATS analysis powered by AI — live at [dojob.pro](https://dojob.pro)**

[![Live](https://img.shields.io/badge/🚀_live-dojob.pro-7c3aed?style=for-the-badge)](https://dojob.pro)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![React](https://img.shields.io/badge/React_18-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev)
[![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com)
[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com)
[![Gemini](https://img.shields.io/badge/Gemini_AI-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://deepmind.google/technologies/gemini)

</div>

---

Most CVs never reach a human — they're filtered out by ATS software before anyone reads them. DoJob analyzes your CV against a job description, scores it, surfaces what's missing, and generates tailored cover letters, video scripts, and LinkedIn positioning — all in one place.

## Architecture

```
jobapply-app → (REST) → jobapply-api → (HTTP) → ats-agent → Gemini API
                               ↓
                           MongoDB
```

| Service | Stack | Port |
|---------|-------|------|
| `jobapply-app` | Vite + React 18 + TypeScript | 5173 |
| `jobapply-api` | Express + MongoDB + JWT | 3000 |
| `ats-agent` | Fastify + LangGraph + Gemini | 3001 |
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

Copy the examples and fill in your keys:

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

```bash
yarn dev          # all services in parallel

yarn dev:api      # jobapply-api   → http://localhost:3000
yarn dev:agent    # ats-agent      → http://localhost:3001
yarn dev:app      # jobapply-app   → http://localhost:5173
```

## Other Commands

```bash
yarn build         # build all packages
yarn lint          # lint all packages
yarn typecheck     # typecheck all packages
```
