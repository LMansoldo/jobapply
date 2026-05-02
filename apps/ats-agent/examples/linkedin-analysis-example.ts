// Exemplo de uso do LinkedIn Analyzer
// Este exemplo mostra como usar a nova funcionalidade de análise de perfil do LinkedIn

const exampleProfile = {
  headline: "Software Engineer",
  about: "I'm a software engineer with experience in web development. I work with JavaScript and React.",
  experience: `Senior Software Engineer at TechCorp (2020-Present)
- Developed web applications using React and Node.js
- Collaborated with cross-functional teams
- Implemented new features

Software Developer at StartupXYZ (2018-2020)
- Built responsive websites
- Fixed bugs in existing code
- Participated in code reviews`,
  skills: "JavaScript, React, Node.js, HTML, CSS, Git",
  education: "Bachelor of Computer Science - University of Tech (2014-2018)",
  certifications: "AWS Certified Developer Associate"
}

const exampleTargetRole = "Senior Full Stack Engineer with expertise in modern JavaScript frameworks, cloud infrastructure, and team leadership. Looking for someone who can architect scalable web applications and mentor junior developers."

// Para usar o linkedinAnalyzerNode:
// import { linkedinAnalyzerNode } from '../src/graph/nodes/linkedinAnalyzer'
//
// const result = await linkedinAnalyzerNode({
//   input: {
//     profile: exampleProfile,
//     targetRole: exampleTargetRole,
//     locale: 'en' // ou 'pt-BR'
//   }
// })
//
// console.log(JSON.stringify(result, null, 2))

console.log('Exemplo de perfil do LinkedIn:')
console.log(JSON.stringify(exampleProfile, null, 2))
console.log('\nCargo alvo:')
console.log(exampleTargetRole)
console.log('\nPara executar a análise, use o endpoint POST /linkedin-analyze na API')

// Estrutura esperada da resposta:
const exampleResponse = {
  headlineAnalysis: {
    currentScore: "weak",
    alternatives: [
      "Senior Full Stack Engineer · React/Node.js/AWS · Building scalable web applications with 6+ years experience",
      "Full Stack Software Engineer · JavaScript/Cloud Architecture · Leading development teams and mentoring engineers",
      "Tech Lead · Web Applications · Specializing in modern JavaScript frameworks and cloud infrastructure"
    ]
  },
  aboutAudit: {
    issues: [
      "Missing hook in first 300 characters",
      "Doesn't include keywords for Senior Full Stack Engineer role",
      "No clear call-to-action at the end"
    ],
    rewrite: "As a Senior Full Stack Engineer with 6+ years of experience, I specialize in architecting scalable web applications using modern JavaScript frameworks like React and Node.js. My expertise extends to cloud infrastructure on AWS, where I've deployed and maintained production systems serving thousands of users. Passionate about mentoring junior developers and implementing best practices in code quality and team collaboration. Currently seeking leadership opportunities in innovative tech companies where I can contribute to building robust, user-centric applications. Open to discussing how my full-stack expertise can drive your engineering team's success."
  },
  experienceGaps: [
    {
      role: "Senior Software Engineer at TechCorp",
      original: "Developed web applications using React and Node.js",
      rewrite: "Architected and developed 3+ scalable web applications using React and Node.js, improving performance by 40% and reducing load times from 3s to 1.2s"
    },
    {
      role: "Senior Software Engineer at TechCorp",
      original: "Collaborated with cross-functional teams",
      rewrite: "Led collaboration with product, design, and QA teams across 5+ major feature releases, improving delivery timelines by 25% through better communication workflows"
    }
  ],
  keywordGaps: {
    technical: ["TypeScript", "Docker", "Kubernetes", "CI/CD", "Microservices"],
    domain: ["SaaS", "E-commerce", "FinTech", "Startup scaling"],
    softSkills: ["Technical leadership", "Mentoring", "Stakeholder management", "Agile coaching"],
    certifications: ["Google Cloud Professional", "React Advanced Certification"]
  },
  quickWins: [
    "Add 'Open to Work' frame to profile picture",
    "Request 5 endorsements for React and Node.js skills",
    "Add AWS Certified Developer Associate badge to certifications section",
    "Update headline to include key technologies and value proposition",
    "Connect with 10+ recruiters specializing in full-stack roles"
  ],
  overallScore: {
    score: 6,
    strengths: [
      "Clear technical skills listed in skills section",
      "Progressive career growth shown in experience timeline"
    ],
    blockers: [
      "Headline is too generic (just 'Software Engineer')",
      "Experience bullet points lack metrics and achievements"
    ],
    priorityAction: "Rewrite all experience bullet points to focus on achievements with quantifiable results, starting with the most recent role"
  }
}

console.log('\nExemplo de resposta esperada:')
console.log(JSON.stringify(exampleResponse, null, 2))