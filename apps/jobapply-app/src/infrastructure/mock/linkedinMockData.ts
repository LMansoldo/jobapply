import type { LinkedInProfile, LinkedInAnalysis } from '../../domain/linkedin/types'

export const MOCK_LINKEDIN_PROFILE: LinkedInProfile = {
  headline: 'Senior Frontend Engineer | React, TypeScript, Node.js',
  about:
    'Software engineer with 5+ years building scalable web applications. Passionate about developer experience, performance, and product thinking. Led front-end architecture for B2B SaaS serving 200+ enterprise clients.',
  experience:
    'Senior Frontend Engineer · TechCorp (2022–Present)\n' +
    'Led migration from CRA to Vite, reducing build times by 70%. Mentored 3 junior devs.\n\n' +
    'Frontend Developer · Startup XYZ (2020–2022)\n' +
    'Built the customer-facing dashboard from scratch with React + TypeScript.',
  skills: 'React, TypeScript, Node.js, GraphQL, AWS, Docker, TailwindCSS, Vite, Next.js',
  education: "Bachelor's in Computer Science · UFRGS (2015–2019)",
  certifications: 'AWS Certified Developer – Associate (2023)',
}

export const MOCK_LINKEDIN_ANALYSIS: LinkedInAnalysis = {
  headlineAnalysis: {
    currentScore: 'weak',
    alternatives: [
      'Senior Frontend Developer | React, TypeScript & Node.js | Scaling B2B SaaS Products',
      'Senior Frontend Engineer | React & TypeScript Expert | Architecting High-Performance Web Apps',
      'Senior Frontend Developer | Building Scalable SaaS with React, TypeScript & AWS',
    ],
  },
  aboutAudit: {
    issues: [
      'Lacks a clear value proposition tied to business impact.',
      'Missing measurable outcomes — add metrics like "reduced build time by 70%".',
      'No call-to-action for recruiters or collaborators.',
    ],
    rewrite:
      'Senior Frontend Engineer with 5+ years architecting scalable web applications for B2B SaaS. I specialize in React, TypeScript, and Node.js, with a track record of modernizing front-end stacks and boosting team efficiency. At TechCorp, I led a migration that cut build times by 70% and improved Lighthouse scores from 62 to 94. Passionate about developer experience, performance, and clean architecture. Open to senior and staff engineer roles.',
  },
  experienceGaps: [
    {
      role: 'TechCorp',
      original: 'Led migration from CRA to Vite, reducing build times by 70%. Mentored 3 junior devs.',
      rewrite:
        'Architected migration from CRA to Vite, reducing CI build times by 70% and improving developer iteration speed. Mentored 3 junior engineers, increasing team delivery velocity by 40%.',
    },
    {
      role: 'Startup XYZ',
      original: 'Built the customer-facing dashboard from scratch with React + TypeScript.',
      rewrite:
        'Built greenfield customer dashboard using React and TypeScript, reducing onboarding friction and contributing to a 15% decrease in churn over two quarters.',
    },
  ],
  keywordGaps: {
    technical: ['Next.js', 'Redux', 'GraphQL', 'CI/CD', 'Micro-frontends', 'Testing Library'],
    domain: ['Fintech', 'SaaS', 'B2B', 'Open Banking'],
    softSkills: ['Cross-functional Leadership', 'Stakeholder Management', 'Technical Mentorship'],
    certifications: ['AWS Certified Developer', 'Professional Scrum Master'],
  },
  quickWins: [
    'Replace your current headline with a role-title + stack + value-prop format.',
    'Add quantified metrics to every experience bullet (%, $, time saved).',
    'Populate the Skills section with your top 20 technical keywords for recruiter SEO.',
    'Request 3 LinkedIn recommendations from former colleagues focused on technical impact.',
    'Add your top projects to the Featured section with screenshots or GitHub links.',
  ],
  overallScore: {
    score: 6,
    strengths: [
      'Strong technical stack diversity (React + TypeScript + Node.js)',
      'Clear history of high-impact contributions in B2B SaaS',
    ],
    blockers: [
      'Headline lacks role title and searchable keywords',
      'Experience bullets missing quantified business outcomes',
    ],
    priorityAction:
      'Rewrite your headline immediately to include your job title and core tech stack to improve recruiter searchability.',
  },
  locale: 'en',
}
