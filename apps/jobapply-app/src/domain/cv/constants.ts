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

Desenvolvedor Full-Stack com 5+ anos de experiência construindo aplicações web escaláveis usando React, TypeScript e Node.js. Histórico comprovado em colaborar com times multifuncionais e entregar produtos de alta qualidade. Apaixonado por boas práticas de engenharia e experiência do usuário.

## Skills

**Languages:** TypeScript, JavaScript, Python
**Frameworks & Libraries:** React, Node.js, Next.js, Express
**Tools & Platforms:** Docker, Git, GitHub Actions, AWS, PostgreSQL
**Testing:** Jest, Cypress
**Methodologies:** Agile, Scrum, Clean Architecture, Code Review, CI/CD

## Experiência Profissional

### Desenvolvedor Full-Stack Pleno | Tech Corp | São Paulo, Brasil (Remoto)
**03/2022 – Presente**

Desenvolvimento de features e manutenção de plataforma SaaS B2B utilizada por centenas de empresas.

- Implementei módulo de relatórios em tempo real, reduzindo o tempo de geração de dados em 45%.
- Refatorei pipeline de CI/CD, diminuindo o tempo de deploy em 30%.
- Colaborei no onboarding técnico de 3 desenvolvedores juniores.

### Desenvolvedor Frontend Junior | Startup Digital | São Paulo, Brasil
**06/2020 – 02/2022**

Construção de interfaces responsivas e integração com APIs REST em startup de e-commerce.

- Desenvolvi carrinho de compras com React e Redux, aumentando a taxa de conversão em 15%.
- Criei componentes reutilizáveis que aceleraram o desenvolvimento em 25%.
- Participei de revisões de código semanais e sprints ágeis.

## Formação

### Bacharelado em Ciência da Computação
**Universidade Federal** | São Paulo, Brasil | **01/2016 – 12/2020**

## Idiomas

- Português: Nativo
- Inglês: Avançado
`

/** Default EN markdown template for the CV editor */
export const EN_TEMPLATE = `## Summary

Full-Stack Developer with 5+ years of experience building scalable web applications using React, TypeScript, and Node.js. Proven track record of collaborating with cross-functional teams and delivering high-quality products. Passionate about engineering best practices and user experience.

## Skills

**Languages:** TypeScript, JavaScript, Python
**Frameworks & Libraries:** React, Node.js, Next.js, Express
**Tools & Platforms:** Docker, Git, GitHub Actions, AWS, PostgreSQL
**Testing:** Jest, Cypress
**Methodologies:** Agile, Scrum, Clean Architecture, Code Review, CI/CD

## Professional Experience

### Mid-Level Full-Stack Developer | Tech Corp | São Paulo, Brazil (Remote)
**03/2022 – Present**

Feature development and maintenance of a B2B SaaS platform used by hundreds of companies.

- Implemented a real-time reporting module, reducing data generation time by 45%.
- Refactored the CI/CD pipeline, cutting deployment time by 30%.
- Assisted in the technical onboarding of 3 junior developers.

### Junior Frontend Developer | Digital Startup | São Paulo, Brazil
**06/2020 – 02/2022**

Built responsive interfaces and REST API integrations for an e-commerce startup.

- Developed a shopping cart with React and Redux, increasing conversion rate by 15%.
- Created reusable components that sped up development by 25%.
- Participated in weekly code reviews and agile sprints.

## Education

### Bachelor in Computer Science
**Federal University** | São Paulo, Brazil | **01/2016 – 12/2020**

## Languages

- Portuguese: Native
- English: Advanced
`
