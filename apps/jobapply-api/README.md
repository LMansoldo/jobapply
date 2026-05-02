# jobapply-api

API REST para gerenciamento de vagas e CVs com suporte a tailoring via LLM (Anthropic Claude).

## Stack

- Node.js + Express + TypeScript
- MongoDB + Mongoose
- JWT Authentication
- Google Gemini (gemini-2.0-flash)

## Setup

### Pré-requisitos

- Node.js >= 18
- MongoDB rodando em `localhost:27017` (ou URI do Atlas)
- Chave de API da Anthropic

### Instalação

```bash
git clone <repo>
cd jobapply-api
npm install
cp .env.example .env
```

Edite o `.env` com seus valores:

```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/jobapply
JWT_SECRET=sua_chave_secreta_aqui
JWT_EXPIRES_IN=7d
GOOGLE_AI_API_KEY=AIza...
```

### Rodar

```bash
npm run dev      # desenvolvimento (ts-node + nodemon)
npm run build    # compila para dist/
npm start        # produção (requer build antes)
```

---

## Autenticação

Todos os endpoints, exceto `/users/register` e `/users/login`, requerem o header:

```
Authorization: Bearer <token>
```

O token é obtido no login e expira conforme `JWT_EXPIRES_IN`.

---

## Endpoints

### Usuários

| Método | Rota | Auth | Descrição |
|--------|------|------|-----------|
| POST | `/users/register` | Não | Cadastro de usuário |
| POST | `/users/login` | Não | Login, retorna JWT |

### Vagas

| Método | Rota | Auth | Descrição |
|--------|------|------|-----------|
| POST | `/jobs/bulk` | Sim | Cadastro em massa de vagas |
| GET | `/jobs` | Sim | Listagem de vagas com filtros e paginação |
| DELETE | `/jobs/:id` | Sim | Exclusão de vaga |
| POST | `/jobs/:id/tailor-description` | Sim | Reescreve a descrição da vaga via LLM |

**Query params de `/jobs`:** `title`, `company`, `location`, `status` (open/closed/applied), `tags` (separados por vírgula), `page`, `limit`

### CV

| Método | Rota | Auth | Descrição |
|--------|------|------|-----------|
| POST | `/cv` | Sim | Cadastro de CV (1 por usuário) |
| GET | `/cv/:id` | Sim | Busca CV (apenas o próprio) |
| PUT | `/cv/:id` | Sim | Edição de CV (apenas o próprio) |
| DELETE | `/cv/:id` | Sim | Exclusão de CV (apenas o próprio) |
| POST | `/cv/:id/tailor` | Sim | Adapta CV a uma vaga via LLM |

---

## Exemplos de Uso

### Registrar e logar

```bash
curl -X POST http://localhost:3000/users/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Lucas","email":"lucas@test.com","password":"secret123"}'

TOKEN=$(curl -s -X POST http://localhost:3000/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"lucas@test.com","password":"secret123"}' | jq -r '.token')
```

### Inserir vagas em massa

```bash
curl -X POST http://localhost:3000/jobs/bulk \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "jobs": [
      {
        "title": "Backend Engineer",
        "company": "Acme",
        "location": "Remote",
        "description": "Build and maintain REST APIs...",
        "tags": ["node", "mongodb"],
        "status": "open"
      }
    ]
  }'
```

### Listar vagas com filtro

```bash
curl "http://localhost:3000/jobs?status=open&tags=node&page=1&limit=10" \
  -H "Authorization: Bearer $TOKEN"
```

### Cadastrar CV

```bash
curl -X POST http://localhost:3000/cv \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "fullName": "Lucas M",
    "email": "lucas@test.com",
    "phone": "+55 11 99999-9999",
    "summary": "Backend developer with 5 years of experience.",
    "skills": ["Node.js", "MongoDB", "TypeScript"],
    "experience": [
      {
        "company": "Acme Corp",
        "role": "Backend Developer",
        "startDate": "2020-01",
        "endDate": "2024-01",
        "description": "Developed REST APIs using Node.js and MongoDB."
      }
    ],
    "education": [
      {
        "institution": "USP",
        "degree": "Bachelor",
        "field": "Computer Science",
        "startDate": "2015-01",
        "endDate": "2019-12"
      }
    ],
    "languages": ["Portuguese", "English"]
  }'
```

### Tailor de job description

```bash
curl -X POST http://localhost:3000/jobs/<JOB_ID>/tailor-description \
  -H "Authorization: Bearer $TOKEN"
```

### Tailor de CV para uma vaga

```bash
curl -X POST http://localhost:3000/cv/<CV_ID>/tailor \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"jobId": "<JOB_ID>"}'
```

---

## Códigos de Resposta

| Status | Descrição |
|--------|-----------|
| 200 | Sucesso |
| 201 | Criado com sucesso |
| 400 | Dados inválidos ou faltando |
| 401 | Token ausente ou inválido |
| 403 | Sem permissão (recurso de outro usuário) |
| 404 | Recurso não encontrado |
| 409 | Conflito (email ou CV duplicado) |
| 502 | Erro na LLM |
| 500 | Erro interno do servidor |
