import type { Job } from '../../domain/jobs/types'
import type { CV } from '../../domain/cv/types'
import type { User } from '../../domain/auth/types'

export const MOCK_USER: User = {
  id: 'user-001',
  name: 'Lucas Mansoldo',
  email: 'lucas@test.com',
  cv: 'cv-001',
}

export const MOCK_TOKEN = 'mock-jwt-token-abc123'

export const MOCK_JOBS: Job[] = [
  {
    _id: 'job-001',
    title: 'Frontend Developer',
    company: 'Tech Corp',
    location: 'Remoto',
    description:
      'We are looking for a skilled Frontend Developer with experience in React and TypeScript. You will be responsible for building and maintaining high-quality web applications.',
    tailoredDescription: undefined,
    tags: ['react', 'typescript', 'antd'],
    url: 'https://techcorp.com/jobs/frontend',
    salary: 'R$ 10.000 - R$ 14.000',
    status: 'open',
    contractType: 'pj',
    modality: 'remote',
    experienceLevel: 'senior',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    _id: 'job-002',
    title: 'Backend Engineer',
    company: 'Acme Inc',
    location: 'São Paulo, SP',
    description:
      'Build and maintain REST APIs using Node.js and MongoDB. Collaborate with frontend team to design API contracts and ensure high availability.',
    tailoredDescription:
      'Senior Backend Engineer role focused on Node.js microservices, MongoDB optimization, and RESTful API design for a fast-growing SaaS platform.',
    tags: ['node', 'mongodb', 'rest-api'],
    url: 'https://acme.com/careers',
    salary: 'R$ 12.000 - R$ 18.000',
    status: 'applied',
    contractType: 'clt',
    modality: 'hybrid',
    experienceLevel: 'senior',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    _id: 'job-003',
    title: 'Full Stack Developer',
    company: 'Startup XYZ',
    location: 'Híbrido – Belo Horizonte, MG',
    description:
      'Full Stack position working with React on the frontend and Python/FastAPI on the backend. Great opportunity to work on greenfield projects with modern architecture.',
    tailoredDescription: undefined,
    tags: ['react', 'python', 'fastapi', 'postgresql'],
    url: undefined,
    salary: 'R$ 8.000 - R$ 12.000',
    status: 'open',
    contractType: 'clt',
    modality: 'hybrid',
    experienceLevel: 'mid',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    _id: 'job-004',
    title: 'DevOps Engineer',
    company: 'Cloud Solutions',
    location: 'Remoto',
    description:
      'Looking for a DevOps Engineer to manage CI/CD pipelines, Kubernetes clusters, and cloud infrastructure on AWS. Experience with Terraform is a plus.',
    tailoredDescription: undefined,
    tags: ['devops', 'kubernetes', 'aws', 'terraform', 'ci-cd'],
    url: 'https://cloudsolutions.io/jobs',
    salary: 'R$ 15.000 - R$ 22.000',
    status: 'closed',
    contractType: 'pj',
    modality: 'remote',
    experienceLevel: 'specialist',
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    _id: 'job-005',
    title: 'Mobile Developer (React Native)',
    company: 'AppFactory',
    location: 'Remoto',
    description:
      'Join our mobile team to build cross-platform apps with React Native. You will work closely with designers and backend engineers to deliver polished user experiences.',
    tailoredDescription: undefined,
    tags: ['react-native', 'mobile', 'typescript', 'expo'],
    url: undefined,
    salary: 'R$ 9.000 - R$ 13.000',
    status: 'open',
    contractType: 'clt',
    modality: 'remote',
    experienceLevel: 'mid',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
]

export const MOCK_CV: CV = {
  _id: 'cv-001',
  user: 'user-001',
  fullName: 'Lucas Mansoldo',
  email: 'lucas@test.com',
  phone: '+55 61 99999-9999',
  location: 'Brasília, Brasil',
  linkedin: 'linkedin.com/in/lucasmansoldo',
  title: 'Senior Frontend Engineer',
  github: 'github.com/lucasg',
  website: 'lucasmansoldo.dev',
  languages: ['Português', 'Inglês', 'Espanhol'],
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
      skillPercentages: [
        { name: 'React', percent: 95 },
        { name: 'TypeScript', percent: 90 },
        { name: 'Node.js', percent: 75 },
        { name: 'GraphQL', percent: 80 },
        { name: 'Docker', percent: 65 },
      ],
      languageLevels: [
        { name: 'Português', level: 'Nativo' },
        { name: 'Inglês', level: 'Avançado' },
      ],
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
