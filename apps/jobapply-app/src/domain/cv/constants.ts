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

[2–3 frases. Use a linguagem exata da descrição da vaga que está aplicando.
Inclua seu cargo principal, anos de experiência e 2–3 habilidades técnicas do JD.]

---

## Habilidades

**Proficiente:** [lista de habilidades]

**Intermediário:** [lista de habilidades]

**Básico:** [lista de habilidades]

> **Dica ATS:** Liste as habilidades exatamente como aparecem na descrição da vaga.

> "React.js" e "React" podem não ser reconhecidos como iguais dependendo da plataforma. Use os dois se a vaga usar um deles.
 
> Máx. 15 itens.

---

## Experiência Profissional

### [Cargo] | [Nome da Empresa] | [Cidade, Estado ou Remoto]
**[MM/AAAA] – [MM/AAAA ou Atual]**

[Uma frase descrevendo o time, produto ou contexto. Exemplo: Liderou o desenvolvimento front-end de uma plataforma SaaS B2B atendendo mais de 200 clientes corporativos na América Latina.]

- [Conquista com métrica. Exemplo: Reduzi o tempo de carregamento em 40% implementando code splitting e lazy loading, elevando o Lighthouse score de 62 para 94.]
- [Conquista com métrica. Exemplo: Mentorei 3 engenheiros júnior com 1:1s semanais e revisões de código, acelerando o onboarding em 2 meses.]
- [Sinal de tecnologia/ownership. Exemplo: Construí e mantive uma biblioteca de componentes usada por 5 squads de produto, reduzindo inconsistências de UI em 70%.]
- [Sinal de tecnologia/ownership. Exemplo: Liderou a migração do Create React App para Next.js, viabilizando SSR e reduzindo o bundle inicial em 35%.]

> **Dica Gupy:** Cada bullet deve ter pelo menos um número ou métrica. "Responsável por X" tem score baixo. "Aumentei X em Y%" tem score alto.

---

### [Cargo] | [Nome da Empresa] | [Cidade, Estado ou Remoto]
**[MM/AAAA] – [MM/AAAA]**

[Frase de contexto.]

- [Conquista com métrica.]
- [Conquista com métrica.]
- [Conquista com métrica.]
- [Conquista com métrica.]
- [Sinal de tecnologia ou ownership.]

---

## Formação Acadêmica

### [Nome do Curso] em [Área]
**[Nome da Instituição]** | [Cidade, Estado] | **[MM/AAAA] – [MM/AAAA]**

[Opcional: disciplinas relevantes, TCC, projetos acadêmicos]

---

## Certificações (opcional)

- [Nome da Certificação] — [Organização Emissora] — [MM/AAAA]
- [Nome da Certificação] — [Organização Emissora] — [MM/AAAA]

---

## Idiomas

- Português: Nativo
- Inglês: [Fluente / Avançado / Intermediário] — [Pontuação TOEFL/IELTS se aplicável]
 
`

/** Default EN markdown template for the CV editor */
export const EN_TEMPLATE = `## Summary

[2–3 sentences. Mirror the exact language from the job description you're applying to.
Include your main title, years of experience, and 2–3 hard skills from the JD.
Example: Senior Front-End Engineer with 6+ years of experience building scalable web applications using React, TypeScript, and Node.js. Proven track record of leading cross-functional teams and delivering products used by millions of users. Currently focused on design systems and micro-frontend architecture.]

---

## Skills

**Proficient:**
**Intermediate:**
**Beginner:**

> **ATS tip:** List skills exactly as they appear in the job description.
> "React.js" and "React" may not match depending on the platform. Use both if the JD uses one.
> Max. 15 items.

---

## Professional Experience

### [Job Title] | [Company Name] | [City, State or Remote]
**[MM/YYYY] – [MM/YYYY or Present]**

[One sentence describing the team, product, or context. Example: Led front-end development for a B2B SaaS platform serving 200+ enterprise clients across Latin America.]

- [Achievement with metric. Example: Reduced page load time by 40% by implementing code splitting and lazy loading, improving Lighthouse score from 62 to 94.]
- [Achievement with metric. Ex reviews, accelerating their onboarding by 2 months.]
- [Technology/ownership sample: Built and maintained a component library used across 5 product squads, reducing UI inconsistencies by 70%.]
- [Technology/ownership sample: Built and maintained a component library used across 5 product squads, reducing UI inconsistencies by 70%.]
- [Achievement with metric. Example: Mentored 3 junior engineers through weekly 1:1s and codeignal. Example: Owned the migration from Create React App to Next.js, enabling SSR and cutting initial bundle size by 35%.]

> **Gupy tip:** Every bullet must have a number or metric. "Responsável por X" scores low. "Aumentei X em Y%" scores high.

---

### [Job Title] | [Company Name] | [City, State or Remote]
**[MM/YYYY] – [MM/YYYY]**

[Context sentence.]

- [Achievement with metric.]
- [Achievement with metric.]
- [Achievement with metric.]
- [Achievement with metric.]
- [Technology signal or ownership.]

---

## Education

### [Degree Name] in [Field of Study]
**[University Name]** | [City, State] | **[MM/YYYY] – [MM/YYYY]**

[Optional: relevant coursework, thesis, GPA if strong, academic projects]

---

## Certifications (optional)

- [Certification Name] — [Issuing Organization] — [MM/YYYY]
- [Certification Name] — [Issuing Organization] — [MM/YYYY]

---

## Languages

- Portuguese: Native
- English: [Fluent / Advanced / Intermediate] — [TOEFL/IELTS score if applicable]

`
