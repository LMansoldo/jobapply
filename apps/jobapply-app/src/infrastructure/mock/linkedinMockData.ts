import type { LinkedInProfile, LinkedInAnalysis, LinkedInResult } from '../../domain/linkedin/types'

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

export const MOCK_LINKEDIN_RESULT: LinkedInResult = {
  seo: {
    before: {
      overall_score: 52,
      keyword_density_score: 40,
      completeness_score: 65,
      specificity_score: 50,
      role_alignment_score: 55,
      authority_score: 48,
      missing_keywords: ['TypeScript', 'React', 'Node.js', 'CI/CD', 'Docker'],
      generic_phrases: [
        { phrase: 'results-driven professional', reason: 'Overused cliché with no specificity', suggestion: 'Led payment infrastructure migration reducing latency 40%' },
        { phrase: 'passionate about technology', reason: 'Generic and unverifiable', suggestion: 'Describe a specific technical challenge you solved' },
      ],
      completeness_gaps: ['About section under 200 words', 'Fewer than 10 skills listed'],
      action_items: [
        { action: 'Add TypeScript and React to skills section', reason: 'Core keywords missing for target role', priority: 'high' },
        { action: 'Expand About section to 200+ words', reason: 'Current about is too short to rank well', priority: 'high' },
        { action: 'Replace generic opening phrase', reason: 'Headline weakened by cliché', priority: 'medium' },
      ],
      sections: {
        headline: { score: 45, label: 'headline' },
        about: { score: 50, label: 'about' },
        experience: { score: 60, label: 'experience' },
        skills: { score: 55, label: 'skills' },
      },
    },
    after: {
      overall_score: 78,
      keyword_density_score: 72,
      completeness_score: 80,
      specificity_score: 75,
      role_alignment_score: 82,
      authority_score: 70,
      missing_keywords: ['Docker', 'Kubernetes'],
      generic_phrases: [],
      completeness_gaps: [],
      action_items: [
        { action: 'Add Docker and Kubernetes certifications', reason: 'Remaining keyword gaps for senior roles', priority: 'low' },
      ],
      sections: {
        headline: { score: 80, label: 'headline' },
        about: { score: 78, label: 'about' },
        experience: { score: 82, label: 'experience' },
        skills: { score: 72, label: 'skills' },
      },
    },
    delta: 26,
  },
  generation: {
    headlineAnalysis: {
      currentScore: 'weak',
      alternatives: [
        'Senior Frontend Engineer | React & TypeScript | Scalable SaaS Products',
        'Frontend Engineer — React, TypeScript, Node.js | 5 Years Building High-Traffic Platforms',
        'Software Engineer | TypeScript · React · CI/CD | Led 3x Performance Improvements',
      ],
    },
    aboutAudit: {
      issues: [
        'Opening sentence is a generic cliché',
        'No quantified achievements mentioned',
        'Under 200 words — insufficient for LinkedIn SEO',
      ],
      rewrite: 'Frontend engineer with 5 years of experience building scalable web products used by 100k+ users. Specialised in React, TypeScript, and modern CI/CD pipelines. At Acme Corp, led the migration from a legacy CRA setup to Vite, cutting build times by 70%. Previously at StartupXYZ, owned the design system that reduced component duplication by 40% across 6 product teams. Currently exploring distributed frontend architectures and edge-side rendering patterns. Open to senior IC roles at product-led companies in fintech or developer tooling.',
    },
    experienceGaps: [
      {
        role: 'Senior Frontend Engineer at Acme Corp',
        original: 'Responsible for building frontend features and maintaining the design system.',
        rewrite: 'Led migration of CRA monolith to Vite across 4 product squads, reducing CI build time from 8min to 2.4min. Owned design system adopted by 6 teams, cutting duplicated component code by 40%.',
      },
    ],
    keywordGaps: {
      technical: ['TypeScript', 'React', 'Node.js', 'Docker', 'CI/CD'],
      domain: ['SaaS', 'fintech', 'developer tooling'],
      softSkills: [],
      certifications: ['AWS Certified Developer'],
    },
    quickWins: [
      'Add TypeScript and React explicitly to your Skills section — they appear 0 times currently',
      'Change first sentence of About to start with a specific achievement, not a personality trait',
      'Add metrics to your most recent role (even rough numbers help)',
      'Customise your LinkedIn URL to linkedin.com/in/your-name',
    ],
    overallScore: {
      score: 52,
      strengths: ['Clear career progression', 'Education section complete', 'Multiple roles with dates'],
      blockers: ['Missing core technical keywords', 'Generic About section', 'No quantified achievements'],
      priorityAction: 'Add TypeScript and React to your Skills section immediately — these are zero-frequency keywords for your target role.',
    },
    voiceProfile: {
      tone: 'technical-pragmatic',
      signaturePatterns: ['Led X to achieve Y', 'Built Z that reduced W'],
      rawInputMissing: false,
      qualityNote: 'Voice calibrated from anchor evidence. Rewrites maintain first-person active voice.',
    },
  },
  locale: 'en',
}
