/**
 * @file constants.ts
 * @description CV domain constants: language options and markdown templates.
 */

/** Language options for the CV form select field */
export const LANGUAGE_OPTIONS = [
  'Português', 'Inglês', 'Espanhol', 'Francês',
  'Alemão', 'Italiano', 'Mandarim', 'Japonês',
].map((l) => ({ label: l, value: l }))

/** Default PT-BR markdown template for the CV editor */
export const PT_BR_TEMPLATE = `# Objetivo
**Cargo:** Engenheiro Front-End Sênior
**Stack principal:** Svelte, React, TypeScript

# Resumo
**Headline:** Engenheiro Front-End Sênior com 7+ anos construindo plataformas financeiras escaláveis.
**Áreas de foco:** Fintech, Visualização de Dados, PWA
**Tagline:** Especializado em Svelte, React e TypeScript — entrego código limpo, performático e orientado a negócio.

# Skills Técnicas
## Frontend
Svelte, React, Redux, Next.js, Tailwind CSS, Ant Design

## Linguagens
TypeScript, JavaScript, PHP

## Backend & Cloud
Node.js, Express, AWS Lambda

# Competências
## API & Integração
APIs RESTful, GraphQL, WebSockets

## Processos & Qualidade
Testes Automatizados, Code Review, CI/CD

# Soft Skills
- Entrega de alto valor equilibrando qualidade e ciclos ágeis de entrega
- Resolução de problemas complexos com pensamento crítico e visão sistêmica
- Comunicação clara com stakeholders técnicos e de negócio

# Expertise
- Atualiza continuamente o conhecimento técnico acompanhando evoluções de frameworks e boas práticas
- Capacidade comprovada de fazer a ponte entre times técnicos e stakeholders de produto

# Experiência

## Desenvolvedor Front-End Sênior | Venturus | Brasília, Brasil | Jun 2025 - Presente
- [architecture] Mentoro desenvolvedores Jr. na aplicação de boas práticas e uso eficiente de IA.
- [innovation] Desenvolvi agentes de IA para análise de bugs — reduzindo tempo de debug em 60%.

## Desenvolvedor Front-End Sênior | Ília Digital (JPMC) | Brasília, Brasil | Abr 2022 - Abr 2025
- [architecture] Liderei o MVP para gestão de contas bancárias com Svelte e TypeScript.
- [integration] Integrei APIs do JPMorgan seguindo padrões rigorosos de segurança financeira.

# Formação
**Grau:** Bacharelado em Sistemas de Informação
**Instituição:** Universidade Estácio de Sá
**Conclusão:** Dez 2022
`

/** Default EN markdown template for the CV editor */
export const EN_TEMPLATE = `# Objective
**Role:** Senior Front-End Engineer
**Main stack:** Svelte, React, TypeScript

# Summary
**Headline:** Senior Front-End Engineer with 7+ years building scalable financial platforms and fintech products.
**Focus areas:** Fintech, Data Visualization, PWA
**Tagline:** Specialized in Svelte, React and TypeScript — delivering clean, performant, business-oriented code.

# Technical Skills
## Frontend
Svelte, React, Redux, Next.js, Tailwind CSS, Ant Design

## Languages
TypeScript, JavaScript, PHP

## Backend & Cloud
Node.js, Express, AWS Lambda

# Competencies
## API & Integration
RESTful APIs, GraphQL, WebSockets

## Process & Quality
Automated Testing, Code Review, CI/CD

# Soft Skills
- Delivering high value while balancing quality and agile delivery cycles
- Solving complex problems with critical thinking and systemic vision
- Clear communication with both technical teams and business stakeholders

# Expertise
- Continuously updates technical knowledge following framework evolution and best practices
- Proven ability to bridge the gap between technical teams and product stakeholders

# Experience

## Senior Front-End Developer | Venturus | Brasília, Brazil | Jun 2025 - Present
- [architecture] Mentoring Jr. developers on best practices and efficient use of AI.
- [innovation] Developed AI agents for bug analysis — reducing debugging time by 60%.

## Senior Front-End Developer | Ília Digital (JPMC) | Brasília, Brazil | Apr 2022 - Apr 2025
- [architecture] Led MVP for bank account management with Svelte and TypeScript.
- [integration] Integrated JPMorgan APIs following strict financial security standards.

# Education
**Degree:** Bachelor in Information Systems
**Institution:** Estácio de Sá University
**Graduation:** Dec 2022
`
