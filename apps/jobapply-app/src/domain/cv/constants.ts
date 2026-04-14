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
export const PT_BR_TEMPLATE = `## Resumo

Engenheiro Front-End Sênior com 7+ anos construindo plataformas financeiras escaláveis usando Svelte, React, TypeScript e Node.js. Histórico comprovado em liderar times e entregar produtos usados por milhares de usuários. Atualmente focado em design systems e engenharia de IA.

## Skills

**Languages:** TypeScript, JavaScript, PHP, Elixir
**Frameworks & Libraries:** Svelte, React, Redux, Next.js, Tailwind CSS, Ant Design
**Tools & Platforms:** Vite, Webpack, Docker, Git, Jenkins, GitHub Actions, AWS
**Testing:** Jest, Cypress, Playwright
**AI Engineering:** AI Agents, MCP Servers, RAG, Prompt Engineering, LangChain
**Methodologies:** TDD, Agile, Scrum, Clean Architecture, Code Review, CI/CD

## Experiência Profissional

### Desenvolvedor Front-End Sênior | Venturus | Brasília, Brasil (Remoto)
**06/2025 – Presente**

Desenvolvo ferramentas internas com IA e oriento desenvolvedores juniores em consultoria para clientes empresariais.

- Orientei 4 desenvolvedores juniores por meio de pair programming e code reviews semanais, acelerando suas habilidades em 3 meses.
- Desenvolvi agentes de IA para pré-análise de bugs e testes E2E — reduzindo tempo de debug em 60%.
- Desenvolvi MCP Servers com contexto de projeto — reduzindo AI slop em prompts em 50%.

### Desenvolvedor Front-End Sênior | Ília Digital (JPMC) | Brasília, Brasil (Remoto)
**04/2022 – 04/2025**

Liderei o desenvolvimento front-end para plataformas bancárias e de investimento usadas por milhares de clientes do JPMC.

- Liderei MVP para gestão de contas e investimentos com Svelte, TypeScript, Tailwind e Vite — reduzindo problemas de ciclo de vida em 90%.
- Entreguei PWA para despesas e transferências — reduzi tempo de carregamento em 40% via lazy loading e code splitting.
- Projetei biblioteca de componentes usada por 5 squads — reduziu tempo de desenvolvimento em 70%.

## Formação

### Bacharelado em Sistemas de Informação
**Universidade Estácio de Sá** | Rio de Janeiro, Brasil | **01/2018 – 12/2022**

## Idiomas

- Português: Nativo
- Inglês: Fluente
`

/** Default EN markdown template for the CV editor */
export const EN_TEMPLATE = `## Summary

Senior Front-End Engineer with 7+ years building scalable financial platforms using Svelte, React, TypeScript, and Node.js. Proven track record of leading teams and delivering products used by thousands of users. Currently focused on design systems and AI engineering.

## Skills

**Languages:** TypeScript, JavaScript, PHP, Elixir
**Frameworks & Libraries:** Svelte, React, Redux, Next.js, Tailwind CSS, Ant Design
**Tools & Platforms:** Vite, Webpack, Docker, Git, Jenkins, GitHub Actions, AWS
**Testing:** Jest, Cypress, Playwright
**AI Engineering:** AI Agents, MCP Servers, RAG, Prompt Engineering, LangChain
**Methodologies:** TDD, Agile, Scrum, Clean Architecture, Code Review, CI/CD

## Professional Experience

### Senior Front-End Developer | Venturus | Brasília, Brazil (Remote)
**06/2025 – Present**

Develop AI-powered internal tools and mentor junior developers in a consultancy serving enterprise clients.

- Mentored 4 junior developers through weekly pair programming and code reviews, accelerating their skills by 3 months.
- Built AI agents for pre-analysis of bugs and E2E testing — reducing debug time by 60%.
- Developed MCP Servers with project context — reducing AI slop in prompts by 50%.

### Senior Front-End Developer | Ília Digital (JPMC) | Brasília, Brazil (Remote)
**04/2022 – 04/2025**

Led front-end development for banking and investment platforms used by thousands of JPMC clients.

- Led MVP for bank accounts and investments using Svelte, TypeScript, Tailwind, and Vite — reducing lifecycle issues by 90%.
- Delivered PWA for expenses and transfers — reduced loading times by 40% via lazy loading and code splitting.
- Designed component library used across 5 squads — decreased sprint development time by 70%.

## Education

### Bachelor in Information Systems
**Estácio de Sá University** | Rio de Janeiro, Brazil | **01/2018 – 12/2022**

## Languages

- Portuguese: Native
- English: Fluent
`
