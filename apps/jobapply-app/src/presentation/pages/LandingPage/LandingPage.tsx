import { useState, useEffect } from 'react'
import { Link } from '@tanstack/react-router'
import { Grid } from 'antd'
import {
  RocketOutlined,
  TagOutlined,
  EditOutlined,
  SwapOutlined,
  GlobalOutlined,
  FilePdfOutlined,
  DownOutlined,
  CheckCircleFilled,
} from '@ant-design/icons'
import * as S from './LandingPage.styles'

const { useBreakpoint } = Grid

const FEATURES = [
  {
    icon: <RocketOutlined />,
    iconBg: '#ede9fe',
    title: 'Score ATS universal',
    desc: 'Pontuação de compatibilidade com o sistema de triagem da vaga, antes mesmo de enviar.',
    tag: 'ATS Score',
  },
  {
    icon: <TagOutlined />,
    iconBg: '#dbeafe',
    title: 'Keywords da vaga',
    desc: 'Extrai as palavras-chave exatas do anúncio e mostra quais estão faltando no seu CV.',
    tag: 'Keywords',
  },
  {
    icon: <EditOutlined />,
    iconBg: '#d1fae5',
    title: 'Reescrita de bullets',
    desc: 'IA reescreve seus bullets de experiência com foco nos requisitos específicos da vaga.',
    tag: 'IA Generativa',
  },
  {
    icon: <SwapOutlined />,
    iconBg: '#fef3c7',
    title: 'Antes e depois',
    desc: 'Visualize o diff completo entre o CV original e o tailorizado para cada candidatura.',
    tag: 'Diff visual',
  },
  {
    icon: <GlobalOutlined />,
    iconBg: '#fce7f3',
    title: 'PT-BR e English',
    desc: 'Tailorize para vagas em português e inglês — o agente detecta o idioma automaticamente.',
    tag: 'Multilíngue',
  },
  {
    icon: <FilePdfOutlined />,
    iconBg: '#ffe4e6',
    title: 'Export PDF',
    desc: 'Exporte o CV tailorizado em PDF pronto para envio, sem sair da plataforma.',
    tag: 'Export',
  },
]

const STEPS = [
  {
    num: '1',
    title: 'Cole a descrição da vaga',
    desc: 'Copie o texto do anúncio e cole no campo de vaga. O agente faz a análise semântica.',
  },
  {
    num: '2',
    title: 'Faça upload do seu CV',
    desc: 'Envie seu CV em PDF ou cole o texto — ou importe diretamente pelo LinkedIn.',
  },
  {
    num: '3',
    title: 'Receba o relatório ATS',
    desc: 'Em segundos você tem score, keywords faltando, bullets reescritos e CV pronto.',
  },
]

const MINI_KWS = [
  { label: 'React / TypeScript', pct: 92, color: '#7c3aed' },
  { label: 'Node.js', pct: 78, color: '#a78bfa' },
  { label: 'SQL / NoSQL', pct: 65, color: '#c4b5fd' },
]

export default function LandingPage() {
  const screens = useBreakpoint()
  const isMobile = !screens.md
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className={S.pageRoot}>
      {/* NAV */}
      <nav className={S.nav(scrolled)}>
        <a href="#hero" className={S.navLogo(scrolled)}>
          do<span className={S.navLogoAccent(scrolled)}>job</span>
        </a>

        {!isMobile && (
          <div className={S.navLinks(scrolled)}>
            <a href="#score">Score ATS</a>
            <a href="#como-funciona">Como funciona</a>
          </div>
        )}

        <div className={S.navCtas}>
          <Link to="/login" className={S.navBtnGhost(scrolled)}>
            Entrar
          </Link>
          <Link to="/register" className={S.navBtnSolid(scrolled)}>
            Testar grátis
          </Link>
        </div>
      </nav>

      {/* HERO */}
      <section className={S.hero} id="hero">
        <div className={S.orb1} />
        <div className={S.orb2} />
        <div className={S.orb3} />

        <div className={S.heroContent}>
          <div className={S.heroEyebrow}>
            <span className={S.liveDot} />
            Tailoring de CV com IA
          </div>

          <h1 className={S.heroH1}>
            Seu CV{' '}
            <span className={S.heroH1Grad}>personalizado</span>
            <br />
            para cada vaga
          </h1>

          <p className={S.heroSub}>
            Analise o score ATS, identifique keywords faltando e receba um CV
            reescrito para a vaga em segundos — tudo com IA.
          </p>

          <div className={S.heroCtas(isMobile)}>
            <Link to="/register" className={S.ctaMain}>
              <RocketOutlined /> Tailorizar meu CV
            </Link>
            <a href="#como-funciona" className={S.ctaSec}>
              Ver como funciona <DownOutlined />
            </a>
          </div>
        </div>

        <button
          type="button"
          className={S.scrollHint}
          onClick={() => document.getElementById('score')?.scrollIntoView({ behavior: 'smooth' })}
          aria-label="Rolar para baixo"
        >
          <DownOutlined />
        </button>
      </section>

      {/* FEATURES */}
      <div id="score">
        <div className={S.section}>
          <p className={S.sectionLabel}>Funcionalidades</p>
          <h2 className={S.sectionTitle}>Tudo que você precisa para ser chamado</h2>
          <p className={S.sectionSub}>
            Do score ATS ao PDF final — sem copiar e colar entre ferramentas.
          </p>

          <div className={S.featuresGrid(isMobile)}>
            {FEATURES.map((f) => (
              <div key={f.title} className={S.featCard}>
                <div className={S.featIcon(f.iconBg)}>{f.icon}</div>
                <p className={S.featTitle}>{f.title}</p>
                <p className={S.featDesc}>{f.desc}</p>
                <span className={S.featTag}>{f.tag}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* HOW IT WORKS */}
      <div className={S.hiwBg} id="como-funciona">
        <div className={S.section}>
          <p className={S.sectionLabel}>Como funciona</p>
          <h2 className={S.sectionTitle}>3 passos, CV pronto</h2>
          <p className={S.sectionSub}>
            Da vaga ao CV tailorizado em menos de 60 segundos.
          </p>

          <div className={S.hiwGrid(isMobile)}>
            <div>
              {STEPS.map((step) => (
                <div key={step.num} className={S.stepRow}>
                  <div className={`${S.stepNum} step-num-inner`}>{step.num}</div>
                  <div>
                    <p className={S.stepTitle}>{step.title}</p>
                    <p className={S.stepDesc}>{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className={S.hiwVisual}>
              <div className={S.hiwVisualBar}>
                <span className={S.dot('#f87171')} />
                <span className={S.dot('#fbbf24')} />
                <span className={S.dot('#34d399')} />
              </div>
              <div className={S.hiwVisualBody}>
                <div className={S.miniAts}>
                  <p className={S.miniAtsTitle}>Análise ATS — Engenheiro Frontend</p>
                  {MINI_KWS.map((kw) => (
                    <div key={kw.label} className={S.miniKwRow}>
                      <span className={S.miniKwLabel}>{kw.label}</span>
                      <div className={S.miniKwBar}>
                        <div className={S.miniKwFill(`${kw.pct}%`, kw.color)} />
                      </div>
                      <span className={S.miniKwPct}>{kw.pct}%</span>
                    </div>
                  ))}
                  <span className={S.miniScoreBadge}>
                    <CheckCircleFilled /> Score ATS: 91 após tailoring
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA BAND */}
      <div className={S.ctaBand}>
        <h2 className={S.ctaBandH2}>Pronto para ser chamado para entrevistas?</h2>
        <p className={S.ctaBandP}>
          Crie sua conta gratuita e tailorize o primeiro CV agora.
        </p>
        <Link to="/register" className={S.ctaMain}>
          <RocketOutlined /> Criar conta grátis agora
        </Link>
      </div>

      {/* FOOTER */}
      <footer className={S.footer}>
        <div className={S.footerInner}>
          <span className={S.footerLogo}>
            do<span className={S.footerLogoAccent}>job</span>
          </span>
          <div className={S.footerLinks}>
            <a href="#score">Funcionalidades</a>
            <a href="#como-funciona">Como funciona</a>
            <Link to="/login">Entrar</Link>
            <Link to="/register">Criar conta</Link>
          </div>
          <p className={S.footerCopy}>© 2026 dojob. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  )
}
