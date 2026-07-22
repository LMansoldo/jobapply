import type { CV } from '../../domain/cv/types'
import type { User } from '../../domain/auth/types'

export const MOCK_USER: User = {
  id: 'user-001',
  name: 'Lucas Mansoldo',
  email: 'lucas@test.com',
  cv: 'cv-001',
}

export const MOCK_TOKEN = 'mock-jwt-token-abc123'

export const MOCK_CV: CV = {
  _id: 'cv-001',
  user: 'user-001',
  fullName: 'Lucas Mansoldo',
  email: 'lucas@test.com',
  phone: '+55 61 99999-9999',
  location: 'Brasília, Brasil',
  linkedin: 'linkedin.com/in/lucasmansoldo',
  objective: 'Senior Frontend Engineer',  // Renamed from title
  github: 'github.com/lucasg',
  portfolio: 'lucasmansoldo.dev',  // Renamed from website
  languages: [{ language: 'Português', level: 'Nativo' }, { language: 'Inglês', level: 'Avançado' }, { language: 'Espanhol', level: 'Intermediário' }],
  tailoredVersions: [],
  localeVersions: [
    {
      locale: 'pt-BR',
      summary: 'Engenheiro Front-End Sênior com 5+ anos construindo aplicações web escaláveis. Especializado em React e TypeScript — código limpo e orientado a resultado.',
      skills: [
        { label: 'Frontend', items: ['React', 'TypeScript', 'Ant Design', 'Next.js'] },
        { label: 'Backend', items: ['Node.js', 'MongoDB', 'REST APIs'] },
        { label: 'Processos', items: ['Git', 'Code Review', 'CI/CD'] },
      ],
      experience: [
        {
          role: 'Senior Frontend Developer',
          company: 'Tech Corp',
          location: 'Brasília, Brasil',
          period: 'Mar 2021 - Presente',
          context: 'Liderança técnica do produto SaaS principal.',
          highlights: [
            'Liderou o desenvolvimento frontend do produto SaaS principal com React e Ant Design.',
            'Mentorou desenvolvedores júnior em boas práticas de React e TypeScript.',
          ],
        },
        {
          role: 'Full Stack Developer',
          company: 'Startup XYZ',
          location: 'Remoto',
          period: 'Jun 2019 - Fev 2021',
          highlights: [
            'Desenvolveu features full-stack com React e Node.js consumidas por clientes web e mobile.',
            'Implementou APIs RESTful com Node.js e MongoDB.',
          ],
        },
      ],
      // Removed skillPercentages (not in API)
      // Removed languageLevels (not in API)
      education: [
        {
          degree: 'Bacharel em Ciência da Computação',
          institution: 'Universidade Federal de Minas Gerais',
          location: 'Belo Horizonte, Brasil',
          period: '2015 – 2019',
        },
      ],
      certifications: [
        { name: 'AWS Cloud Practitioner', org: 'Amazon Web Services', date: '2023' },
        { name: 'Meta Front-End Developer', org: 'Meta', date: '2022' },
      ],
    },
  ],
  updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
}
