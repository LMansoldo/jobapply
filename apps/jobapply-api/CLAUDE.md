# jobapply-api

API REST Express + MongoDB + JWT. Gerencia usuários, CVs e vagas. Orquestra chamadas ao ats-agent.

## Stack
- Express 4
- MongoDB + Mongoose
- JWT (`jsonwebtoken`)
- Google Gemini (`@google/generative-ai`) via `llmService.ts`

## Arquitetura Interna

```
routes/ → controllers/ → services/ + models/
```

- `routes/` — define apenas path e middleware de auth
- `controllers/` — orquestram: buscam dados, chamam services, retornam resposta
- `services/` — lógica de negócio: `atsService.ts` (ats-agent), `llmService.ts` (Gemini direto), `interviewPrepService.ts`
- `models/` — schemas Mongoose: User, CV, Job, Voucher, PublishedCV

## Convenções

- `atsService.ts` é o **único** ponto de contato com o ats-agent
- `llmService.ts` é o **único** lugar onde Gemini é chamado diretamente
- `sanitizeUserInput()` de `utils/sanitize.ts` é obrigatório antes de passar dados do usuário para LLM
- Auth middleware em `middleware/auth.ts` — usar em todas as rotas protegidas
- Limite de uso em `middleware/usageLimit.ts` — aplicar em endpoints de geração LLM

## Detecção de Locale

`detectLocale(text)` em `controllers/cvController.ts` detecta pt-BR vs en automaticamente. Usar antes de qualquer serviço LLM quando `locale` não for fornecido.

## PROIBIDO

- Lógica LLM fora de `llmService.ts` ou `atsService.ts`
- Chamar `ATS_AGENT_URL` diretamente fora de `atsService.ts`
- Mockar MongoDB nos testes
- Alterar schemas Mongoose sem migration plan
