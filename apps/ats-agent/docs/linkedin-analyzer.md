# LinkedIn Profile Analyzer

Nova funcionalidade para análise de perfis do LinkedIn, integrada ao ATS Agent.

## Visão Geral

O LinkedIn Analyzer analisa perfis do LinkedIn para:
- Otimizar descoberta por recrutadores
- Melhorar alinhamento com cargos alvo
- Identificar gaps em keywords e conteúdo
- Sugerir melhorias de alto impacto

## Endpoint da API

`POST /linkedin-analyze`

### Request Body

```json
{
  "profile": {
    "headline": "string",
    "about": "string", 
    "experience": "string",
    "skills": "string",
    "education": "string",
    "certifications": "string (opcional)"
  },
  "targetRole": "string",
  "locale": "en" | "pt-BR" (opcional, padrão: "en")
}
```

### Response

```json
{
  "headlineAnalysis": {
    "currentScore": "weak | moderate | strong",
    "alternatives": ["string", "string", "string"]
  },
  "aboutAudit": {
    "issues": ["string"],
    "rewrite": "string | null"
  },
  "experienceGaps": [
    {
      "role": "string",
      "original": "string", 
      "rewrite": "string"
    }
  ],
  "keywordGaps": {
    "technical": ["string"],
    "domain": ["string"],
    "softSkills": ["string"],
    "certifications": ["string"]
  },
  "quickWins": ["string"],
  "overallScore": {
    "score": 7,
    "strengths": ["string", "string"],
    "blockers": ["string", "string"],
    "priorityAction": "string"
  }
}
```

## Análises Realizadas

### 1. Headline Analysis
- Avalia o título atual (até 220 caracteres)
- Sugere alternativas no formato: `[Cargo/Especialidade] · [Tecnologia/Domínio] · [Proposta de Valor/CTA]`
- Classifica como: weak, moderate, strong

### 2. About Audit  
- Verifica hook nos primeiros ~300 caracteres
- Confirma escrita em primeira pessoa
- Avalia keywords relevantes para o cargo alvo
- Verifica call-to-action no final
- Fornece rewrite se necessário

### 3. Experience Gaps
- Identifica bullet points baseados em tarefas (não em conquistas)
- Detecta métricas e quantificações ausentes
- Analisa mismatches de linguagem vs cargo alvo
- Fornece rewrites específicos (máx. 5)

### 4. Keyword Gaps
- Lista keywords que recrutadores usariam mas estão ausentes
- Agrupadas por: habilidades técnicas, domínio/indústria, soft skills, certificações

### 5. Quick Wins
- Sugere 5 mudanças de alto impacto e baixo esforço
- Exemplos: adicionar frame "Open to Work", solicitar endorsements, etc.

### 6. Overall Score
- Nota de 1-10 para descoberta por recrutadores
- 2 principais pontos fortes
- 2 principais bloqueadores  
- 1 ação prioritária

## Exemplo de Uso

```typescript
import { linkedinAnalyzerNode } from './src/graph/nodes/linkedinAnalyzer'

const result = await linkedinAnalyzerNode({
  input: {
    profile: {
      headline: "Software Engineer",
      about: "I'm a software engineer...",
      experience: "Senior Software Engineer at TechCorp...",
      skills: "JavaScript, React, Node.js",
      education: "Bachelor of Computer Science",
      certifications: "AWS Certified"
    },
    targetRole: "Senior Full Stack Engineer with cloud experience",
    locale: 'en'
  }
})
```

## Integração com o Sistema Existente

- Novo arquivo: `src/graph/nodes/linkedinAnalyzer.ts`
- Novo endpoint na API: `POST /linkedin-analyze`
- Usa o mesmo modelo Gemini que outras análises
- Suporta localização (en/pt-BR)

## Dependências

- Google Generative AI (Gemini Flash Lite)
- Variável de ambiente: `GEMINI_API_KEY`