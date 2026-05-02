// Exemplo de uso do endpoint /generate-cv
// Este exemplo mostra como usar o novo endpoint para gerar um CV adaptado

const exampleRequest = {
  cv: {
    fullName: 'Maria Santos',
    email: 'maria.santos@email.com',
    phone: '+55 11 98888-7777',
    location: 'Rio de Janeiro, RJ',
    linkedin: 'linkedin.com/in/mariasantos',
    github: 'github.com/mariasantos',
    summary: 'Engenheira de Software com 4 anos de experiência em desenvolvimento web. Especializada em React e Node.js.',
    skills: [
      {
        label: 'Frontend',
        items: ['React', 'TypeScript', 'Next.js', 'Tailwind CSS']
      },
      {
        label: 'Backend',
        items: ['Node.js', 'Express', 'MongoDB', 'PostgreSQL']
      },
      {
        label: 'DevOps',
        items: ['Docker', 'AWS', 'Git', 'CI/CD']
      }
    ],
    experience: [
      {
        role: 'Engenheira de Software',
        company: 'TechCorp',
        location: 'Rio de Janeiro, RJ',
        period: '03/2021 - Presente',
        context: 'Desenvolvimento de plataforma SaaS para gestão de projetos',
        highlights: [
          'Desenvolvi features principais usando React e TypeScript',
          'Implementei APIs RESTful com Node.js e Express',
          'Colaborei com equipe de UX para melhorar experiência do usuário'
        ]
      },
      {
        role: 'Desenvolvedora Full Stack',
        company: 'StartupXYZ',
        location: 'São Paulo, SP',
        period: '06/2019 - 02/2021',
        context: 'Desenvolvimento de aplicativo mobile-first',
        highlights: [
          'Criei interface responsiva com React Native',
          'Integrei APIs de terceiros para funcionalidades de pagamento',
          'Implementei sistema de autenticação JWT'
        ]
      }
    ],
    education: [
      {
        degree: 'Bacharelado em Engenharia de Software',
        field: 'Engenharia de Software',
        institution: 'Universidade Federal do Rio de Janeiro',
        location: 'Rio de Janeiro, RJ',
        period: '2015 - 2019',
        notes: 'Graduação com honras'
      }
    ],
    languages: [
      {
        language: 'Português',
        level: 'Nativo'
      },
      {
        language: 'Inglês',
        level: 'Avançado'
      },
      {
        language: 'Espanhol',
        level: 'Intermediário'
      }
    ]
  },
  jobDescription: `# Vaga: Engenheira de Software Sênior

## Sobre a vaga
Buscamos uma Engenheira de Software Sênior para liderar o desenvolvimento de nossas plataformas digitais. A pessoa ideal terá experiência sólida em arquitetura de software e liderança técnica.

## Responsabilidades
- Liderar o desenvolvimento de features complexas
- Projetar e implementar arquiteturas escaláveis
- Mentorar desenvolvedores júniores e plenos
- Colaborar com Product Managers para definir roadmap técnico
- Garantir qualidade de código através de code reviews e testes
- Otimizar performance e segurança das aplicações

## Requisitos
- 5+ anos de experiência com desenvolvimento web
- Experiência profunda em React e TypeScript
- Conhecimento avançado em Node.js e arquitetura de APIs
- Experiência com bancos de dados relacionais e não-relacionais
- Familiaridade com Docker e Kubernetes
- Experiência com AWS ou Google Cloud Platform
- Habilidades de liderança e comunicação

## Diferenciais
- Experiência com microsserviços
- Conhecimento em GraphQL
- Experiência com mensageria (Kafka, RabbitMQ)
- Certificações em cloud computing`,
  locale: 'pt-BR' as const
}

console.log('=== Exemplo de Uso do Endpoint /generate-cv ===\n')
console.log('Para usar o novo endpoint, faça uma requisição POST:')
console.log('\nURL: http://localhost:3001/generate-cv')
console.log('Method: POST')
console.log('Headers: { "Content-Type": "application/json" }')
console.log('\nBody:')
console.log(JSON.stringify(exampleRequest, null, 2))

console.log('\n=== Resposta Esperada ===')
console.log('\nO endpoint retornará um objeto com:')
console.log('{')
console.log('  "report": { ... },  // Relatório completo de análise ATS')
console.log('  "adaptedCV": { ... } // CV adaptado para a vaga')
console.log('}')

console.log('\n=== Comparação com Endpoint /analyze ===')
console.log('\nEndpoint /analyze (existente):')
console.log('- Retorna apenas: { "report": { ... } }')
console.log('- Mantém compatibilidade com clientes existentes')

console.log('\nEndpoint /generate-cv (novo):')
console.log('- Retorna: { "report": { ... }, "adaptedCV": { ... } }')
console.log('- Inclui CV adaptado gerado a partir das sugestões do semanticAnalyzer')

console.log('\n=== Fluxo do Sistema ===')
console.log('1. Recebe CV e job description')
console.log('2. Mapeia CV (mapperNode)')
console.log('3. Analisa regras ATS (ruleScorerNode)')
console.log('4. Analisa semanticamente (semanticAnalyzerNode)')
console.log('5. Gera CV adaptado (cvGeneratorNode) ← NOVO')
console.log('6. Agrega resultados (aggregatorNode)')
console.log('7. Retorna { report, adaptedCV }')

console.log('\n=== Características do CV Adaptado ===')
console.log('✅ Dados pessoais preservados (nome, email, contato)')
console.log('✅ Summary otimizado para a vaga')
console.log('✅ Skills reorganizados conforme sugestões ATS')
console.log('✅ Experience reformulado com keywords da vaga')
console.log('✅ Conteúdo irrelevante removido')
console.log('✅ Suporte a multi-idioma (en/pt-BR)')

console.log('\n=== Como Testar ===')
console.log('1. Inicie o servidor: npm run dev')
console.log('2. Use curl ou Postman para testar o endpoint')
console.log('3. Verifique se o adaptedCV contém as melhorias sugeridas no report')

console.log('\n=== Exemplo de Comando curl ===')
console.log('curl -X POST http://localhost:3001/generate-cv \\')
console.log('  -H "Content-Type: application/json" \\')
console.log('  -d \'{"cv": {...}, "jobDescription": "...", "locale": "pt-BR"}\'')