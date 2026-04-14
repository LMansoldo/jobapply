# Funcionalidades não implementadas — Endpoint de API inexistente

Lista das funcionalidades que foram implementadas visualmente/estruturalmente no frontend,
mas que dependem de endpoints de API ainda não existentes no backend.

---

## 1. Filtros avançados de vagas (JobFilterBar)

**Campos:** `contractTypes`, `modalities`, `experienceLevels`, `maxSalary`, `sort`

Os novos filtros foram adicionados ao tipo `JobFilters` e ao componente `JobFilterBar`,
mas o repositório `jobsRepository` e o backend não processam esses campos.

**Endpoint necessário:**
```
GET /jobs?contractTypes[]=clt&modalities[]=remote&experienceLevels[]=senior&maxSalary=20000&sort=salary
```

---

## 2. Campos extras do CV (title, github, website)

**Campos:** `CV.title`, `CV.github`, `CV.website`

Adicionados aos tipos `CV` e `CVCreatePayload`, ao mock e ao formulário de cadastro (CVBaseForm).
O endpoint `POST /cv` e `PUT /cv/:id` precisam aceitar e persistir esses campos.

**Endpoint necessário:**
```
POST/PUT /cv
Body: { ..., title: string, github: string, website: string }
```

---

## 3. Campos de versão locale do CV (skillPercentages, languageLevels, certifications)

**Campos:** `CVLocaleVersion.skillPercentages`, `CVLocaleVersion.languageLevels`, `CVLocaleVersion.certifications`

Adicionados ao tipo e ao mock para renderização no `CVTemplate`.
O endpoint `PUT /cv/:id/locale/:locale` precisa aceitar esses campos na payload.

**Endpoint necessário:**
```
PUT /cv/:id/locale/:locale
Body: { ..., skillPercentages: [...], languageLevels: [...], certifications: [...] }
```

---

## 4. Stats do perfil do candidato (Candidaturas / Entrevistas / Ofertas)

**Componente:** `ProfileCard` (props `applications`, `interviews`, `offers`)

Atualmente usando valores mockados (47 / 12 / 3).
Requer endpoint que retorne estatísticas de candidaturas do usuário autenticado.

**Endpoint necessário:**
```
GET /user/stats
Response: { applications: number, interviews: number, offers: number }
```

---

## 5. Candidatura direta a vagas (botão "Candidatar")

**Componente:** `DSJobCard` (prop `onApply`)

A ação abre a `job.url` em nova aba (quando disponível) ou exibe um toast.
Para candidaturas gerenciadas pelo sistema, seria necessário:

**Endpoint necessário:**
```
POST /jobs/:id/apply
Response: { applicationId: string, status: 'applied' }
```

---

## 6. Alertas de vaga

**Componente:** `JobAlertsCard`

Atualmente usando 3 alertas mockados.
Requer CRUD completo de alertas no backend.

**Endpoints necessários:**
```
GET  /alerts
POST /alerts  Body: { keywords: string[], modalities: string[], ... }
DELETE /alerts/:id
```

---

## 7. Notícias do setor (IndustryNewsCard)

**Componente:** `IndustryNewsCard`

Atualmente com 4 notícias estáticas mockadas no frontend.
Requer endpoint ou integração com feed externo (RSS/API).

**Endpoint necessário:**
```
GET /news?category=tech&limit=4
Response: { items: [{ title, source, time, thumbnail, url }] }
```

---

## 8. Visibilidade do perfil no CVViewerSidebar

**Componente:** `CVViewerSidebar` (prop `visibility`)

Atualmente usando valores fixos: `{ views: 142, searches: 38, saved: 7 }`.
Requer endpoint de analytics do perfil.

**Endpoint necessário:**
```
GET /cv/:id/visibility
Response: { views: number, searches: number, saved: number }
```

---

## 9. Compartilhar link do CV

**Componente:** `CVViewerSidebar` (botão "Compartilhar link")

Implementado como no-op. Requer publicação do CV e geração de link público.

**Endpoint necessário:**
```
POST /cv/:id/publish
Response: { public_url: string, public_id: string }
```

---

## 10. Tradução automática PT-BR → EN

**Componente:** `MonacoEditorPanel` (botão "Traduzir do PT-BR")

Atualmente exibe apenas um `message.info()`. Requer endpoint de tradução via IA.

**Endpoint necessário:**
```
POST /cv/:id/translate
Body: { sourceLocale: 'pt-BR', targetLocale: 'en' }
Response: { translatedContent: string }
```

---

## 11. Cover Letter — Geração com IA

**Página:** `CVTailoringPage` (aba "Cover Letter")

O botão "Regenerar carta" e a geração com IA são visuais/sem ação real.
Requer endpoint de geração de carta de apresentação.

**Endpoint necessário:**
```
POST /tailoring/:cvId/cover-letter
Body: { jobId: string, tone: 'formal'|'direct'|'creative'|'confident' }
Response: { content: string }
```

---

## 12. Roteiro de Vídeo — Geração com IA

**Página:** `CVTailoringPage` (aba "Roteiro de Vídeo")

O botão "Gerar novo roteiro" não possui ação real.
Requer endpoint de geração de script de entrevista.

**Endpoint necessário:**
```
POST /tailoring/:cvId/video-script
Body: { jobId: string, duration: '60s'|'90s'|'2min', tone: string }
Response: { scenes: [{ label: string, duration: string, text: string }] }
```

---

## 13. Export PDF otimizado / DOCX

**Componente:** `TailoringPreviewPanel` (botões "Baixar CV otimizado · PDF", "Baixar como .DOCX")

Atualmente exibem apenas `message.info()`. Requer endpoint de geração de documento.

**Endpoint necessário:**
```
POST /cv/:id/export
Body: { format: 'pdf'|'docx', tailoredContent?: string }
Response: Blob (arquivo para download)
```

---

## 14. Salvar versão tailored como nova versão do CV

**Componente:** `TailoringPreviewPanel` (botão "Salvar como nova versão")

Atualmente é no-op. Requer endpoint para criar nova `CVLocaleVersion` a partir do conteúdo tailored.

**Endpoint necessário:**
```
POST /cv/:id/versions
Body: { locale: string, content: string, sourceJobId: string }
Response: CVLocaleVersion
```

---

## 15. Sort de vagas no backend

**Página:** `JobsPage` (SortDropdown)

O frontend envia o campo `sort` no `JobFilters`, mas o mock e a API real não o processam.
A ordenação precisa ser implementada no backend.

**Query param necessário:**
```
GET /jobs?sort=salary|recent|relevant|applications
```

---

*Gerado automaticamente após execução do plano nifty-enchanting-kite.md em 2026-04-06.*
