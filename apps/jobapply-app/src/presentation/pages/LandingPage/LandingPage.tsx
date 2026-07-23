import { useState, useEffect } from 'react'
import { Link } from '@tanstack/react-router'
import { css, keyframes } from '@emotion/css'

// ── Keyframes ───────────────────────────────────────────────
const floatOrb = keyframes`
  0%,100% { transform: translate(0,0) scale(1); }
  33% { transform: translate(30px,-40px) scale(1.05); }
  66% { transform: translate(-20px,20px) scale(.95); }
`
const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`
const bounce = keyframes`
  0%,100% { transform: translateX(-50%) translateY(0); }
  50% { transform: translateX(-50%) translateY(8px); }
`

// ── Hover-only emotion classes ───────────────────────────────
const navLinkCls = css`
  white-space: nowrap;
  flex-shrink: 0;
  font-size: 14px;
  font-weight: 700;
  color: rgba(255,255,255,.85);
  padding: 8px 16px;
  border-radius: 999px;
  transition: all .2s;
  text-decoration: none;
  font-family: 'Lato', sans-serif;
  &:hover { color: #fff; background: rgba(255,255,255,.18); }
`
const navEnterCls = css`
  white-space: nowrap;
  display: flex;
  align-items: center;
  height: 44px;
  padding: 0 26px;
  border-radius: 999px;
  font-weight: 900;
  font-size: 14px;
  font-family: 'Lato', sans-serif;
  color: #fff;
  background: linear-gradient(120deg, #a78bfa 0%, #f0abfc 55%, #fb7185 100%);
  background-size: 200% 100%;
  background-position: 0% 0;
  box-shadow: 0 4px 18px rgba(124,58,237,.45);
  transition: background-position .4s ease, box-shadow .25s, transform .2s;
  text-decoration: none;
  &:hover { background-position: 100% 0; box-shadow: 0 6px 26px rgba(251,113,133,.5); transform: translateY(-1px); }
`
const navRegisterCls = css`
  display: flex;
  white-space: nowrap;
  align-items: center;
  height: 44px;
  padding: 0 22px;
  border-radius: 999px;
  font-weight: 900;
  font-size: 14px;
  font-family: 'Lato', sans-serif;
  color: #5b21b6;
  background: #fff;
  box-shadow: 0 2px 12px rgba(0,0,0,.12);
  transition: all .2s;
  text-decoration: none;
  &:hover { background: #ede9fe; transform: translateY(-1px); }
`
const heroCTAMainCls = css`
  background: #fff;
  color: #4c1d95;
  border: none;
  border-radius: 2px;
  padding: 18px 38px;
  font-size: 14px;
  font-weight: 900;
  font-family: 'Lato', sans-serif;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  cursor: pointer;
  transition: all .3s;
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
  &:hover { background: #ede9fe; letter-spacing: 2px; }
`
const heroCTASecCls = css`
  color: #fff;
  font-size: 14px;
  font-weight: 700;
  font-family: 'Lato', sans-serif;
  letter-spacing: 1px;
  text-transform: uppercase;
  border-bottom: 1px solid rgba(255,255,255,.4);
  padding-bottom: 4px;
  transition: border-color .2s;
  text-decoration: none;
  &:hover { border-color: #fff; }
`
const featCardCls = css`
  background: #fff;
  border-radius: 16px;
  border: 1px solid #e9e4fc;
  padding: 28px 26px;
  box-shadow: 0 2px 20px rgba(124,58,237,.09);
  transition: transform .25s, box-shadow .25s;
  &:hover { transform: translateY(-6px); box-shadow: 0 8px 40px rgba(124,58,237,.16); }
`
const ctaBandBtnCls = css`
  display: inline-flex;
  align-items: center;
  gap: 9px;
  background: #fff;
  color: #7c3aed;
  border: none;
  border-radius: 999px;
  padding: 14px 32px;
  font-size: 15px;
  font-weight: 900;
  font-family: 'Lato', sans-serif;
  cursor: pointer;
  transition: all .25s;
  box-shadow: 0 4px 24px rgba(0,0,0,.2);
  position: relative;
  text-decoration: none;
  &:hover { background: #ede9fe; transform: translateY(-2px); box-shadow: 0 8px 32px rgba(0,0,0,.25); }
`
const footerLinkCls = css`
  font-size: 13.5px;
  color: rgba(255,255,255,.45);
  cursor: pointer;
  text-decoration: none;
  transition: color .15s;
  &:hover { color: #c4b5fd; }
`

export default function LandingPage() {
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' && window.innerWidth <= 860
  )

  useEffect(() => {
    function onResize() {
      const m = window.innerWidth <= 860
      setIsMobile(prev => prev !== m ? m : prev)
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const m = isMobile

  return (
    <div style={{ background: '#f5f3ff', color: '#1e1b2e', fontSize: 15, overflowX: 'hidden', minHeight: '100vh', fontFamily: "'Lato', sans-serif" }}>

      {/* Scrim */}
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, height: 130, zIndex: 99, pointerEvents: 'none',
        background: 'linear-gradient(to bottom, rgba(20,8,40,.55) 0%, rgba(20,8,40,.28) 45%, transparent 100%)',
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
        maskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)',
        WebkitMaskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)',
      } as React.CSSProperties} />

      {/* NAV — Liquid Glass Pill */}
      <nav style={{
        position: 'fixed', top: m ? 10 : 18, left: '50%', transform: 'translateX(-50%)', zIndex: 100,
        width: m ? 'calc(100% - 20px)' : 'min(1180px, calc(100% - 32px))', height: 60,
        display: 'flex', alignItems: 'center', padding: m ? '0 8px 0 16px' : '0 12px 0 22px', borderRadius: 999,
        background: 'linear-gradient(135deg, rgba(255,255,255,.30), rgba(255,255,255,.08))',
        backdropFilter: 'blur(22px) saturate(180%)',
        WebkitBackdropFilter: 'blur(22px) saturate(180%)',
        border: '1px solid rgba(255,255,255,.4)',
        boxShadow: '0 8px 32px rgba(26,5,51,.28), inset 0 1px 0 rgba(255,255,255,.5), inset 0 -1px 0 rgba(255,255,255,.08)',
      } as React.CSSProperties}>
        <div style={{ fontFamily: "'Lato', sans-serif", fontSize: 22, fontWeight: 900, color: '#fff', letterSpacing: '-.5px', cursor: 'pointer' }}>
          do<span style={{ color: '#c4b5fd' }}>job</span>
        </div>

        {!m && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginLeft: 36 }}>
            <a href="#como-funciona" className={navLinkCls}>Como funciona</a>
            <a href="#score" className={navLinkCls}>Score ATS</a>
          </div>
        )}

        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 10 }}>
          <Link to="/login" className={navEnterCls}>Entrar</Link>
          {!m && <Link to="/register" className={navRegisterCls}>Testar grátis</Link>}
        </div>
      </nav>

      {/* HERO */}
      <section style={{ minHeight: '100vh', background: 'linear-gradient(145deg, #1a0533 0%, #2d1065 40%, #4c1d95 70%, #6d28d9 100%)', position: 'relative', display: 'flex', overflow: 'hidden' }}>
        {/* Grid texture */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.04) 1px, transparent 1px)', backgroundSize: '60px 60px', pointerEvents: 'none' }} />
        {/* Orb 1 */}
        <div style={{ position: 'absolute', width: 600, height: 600, borderRadius: '50%', filter: 'blur(90px)', opacity: .35, background: 'radial-gradient(circle, #f0abfc 0%, transparent 70%)', top: -120, right: -60, animation: `${floatOrb} 12s ease-in-out infinite` }} />
        {/* Orb 2 */}
        <div style={{ position: 'absolute', width: 420, height: 420, borderRadius: '50%', filter: 'blur(90px)', opacity: .3, background: 'radial-gradient(circle, #60a5fa 0%, transparent 70%)', bottom: 0, left: -100, animation: `${floatOrb} 9s ease-in-out infinite reverse` }} />

        {/* Hero grid */}
        <div style={{
          flex: 1, display: 'grid',
          gridTemplateColumns: m ? '1fr' : '1.05fr .95fr',
          alignItems: 'center',
          maxWidth: 1440, margin: '0 auto', width: '100%', position: 'relative', zIndex: 2,
          gap: m ? 40 : 64,
          padding: m ? '128px 20px 60px' : '170px 64px 100px',
        }}>
          {/* Left: text */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 32, animation: `${fadeUp} .6s ease both` }}>
              <div style={{ width: 36, height: 1, background: 'rgba(255,255,255,.4)', flexShrink: 0 }} />
              <div style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '3px', color: '#c4b5fd' }}>Tailoring de CV com IA</div>
            </div>

            <h1 style={{ fontFamily: "'Lato', sans-serif", fontSize: 'clamp(44px, 5.4vw, 76px)', fontWeight: 300, lineHeight: 1.08, color: '#fff', letterSpacing: '-1px', margin: '0 0 28px', animation: `${fadeUp} .6s ease .1s both` }}>
              Um currículo<br />
              <span style={{ fontWeight: 900, fontStyle: 'italic', background: 'linear-gradient(90deg, #c4b5fd, #f0abfc, #fb7185)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>à altura</span> da vaga<br />
              que você quer.
            </h1>

            <p style={{ fontSize: 18, color: 'rgba(255,255,255,.6)', lineHeight: 1.75, maxWidth: 460, margin: '0 0 44px', fontWeight: 300, animation: `${fadeUp} .6s ease .2s both` }}>
              Cole a descrição da vaga e deixe a IA do dojob calibrar seu currículo com precisão — score ATS, keywords e bullets reescritos, em minutos.
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap', animation: `${fadeUp} .6s ease .3s both`, marginBottom: 64 }}>
              <Link to="/register" className={heroCTAMainCls}>Tailorizar meu CV</Link>
              <a href="#como-funciona" className={heroCTASecCls}>Ver como funciona</a>
            </div>
          </div>

          {/* Right: image placeholder + badge */}
          <div style={{ position: 'relative', height: m ? 340 : 600, animation: `${fadeUp} .8s ease .2s both` }}>
            <div style={{
              position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
              borderRadius: 4, overflow: 'hidden',
              boxShadow: '0 40px 100px rgba(0,0,0,.45)',
              border: '1px solid rgba(255,255,255,.15)',
              background: 'linear-gradient(145deg, #2d1065 0%, #4c1d95 35%, #7c3aed 65%, #a78bfa 100%)',
            }} />
            <div style={{
              position: 'absolute',
              left: m ? 12 : -28,
              bottom: m ? 20 : 48,
              background: 'rgba(255,255,255,.95)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              borderRadius: 4,
              padding: m ? '14px 18px' : '22px 26px',
              boxShadow: '0 20px 50px rgba(26,5,51,.35)',
              maxWidth: 230,
            } as React.CSSProperties}>
              <div style={{ fontSize: 34, fontWeight: 900, color: '#7c3aed', lineHeight: 1 }}>91</div>
              <div style={{ fontSize: 11, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '.6px', marginTop: 6 }}>Score ATS após tailoring</div>
            </div>
          </div>
        </div>

        {/* Scroll hint */}
        <div style={{ position: 'absolute', bottom: 32, left: '50%', transform: 'translateX(-50%)', color: 'rgba(255,255,255,.35)', fontSize: 20, animation: `${bounce} 2s infinite`, cursor: 'pointer', zIndex: 2 }}>
          <i className="fas fa-chevron-down" />
        </div>
      </section>

      {/* FEATURES */}
      <div id="score" style={{ padding: m ? '64px 20px' : '100px 48px', maxWidth: 1280, margin: '0 auto' }}>
        <div style={{ fontSize: 12, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '1.5px', color: '#a78bfa', marginBottom: 12 }}>Tailoring de CV</div>
        <h2 style={{ fontFamily: "'Lato', sans-serif", fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 900, color: '#1e1b2e', lineHeight: 1.15, letterSpacing: '-1px', margin: '0 0 16px' }}>
          Um currículo afiado<br />para cada vaga que você quer
        </h2>
        <p style={{ fontSize: 17, color: '#6b7280', lineHeight: 1.65, maxWidth: 540, margin: 0 }}>
          O dojob compara seu CV com a descrição da vaga e mostra exatamente o que ajustar para passar pelo ATS e impressionar o recrutador.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: m ? '1fr' : 'repeat(3, 1fr)', gap: 20, marginTop: 56 }}>
          <div className={featCardCls}>
            <div style={{ width: 52, height: 52, borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, marginBottom: 18, background: '#ede9fe' }}>✦</div>
            <div style={{ fontSize: 17, fontWeight: 900, marginBottom: 8, color: '#1e1b2e' }}>Score ATS em tempo real</div>
            <div style={{ fontSize: 14, color: '#6b7280', lineHeight: 1.65 }}>Veja sua pontuação de aderência à vaga se atualizar conforme você edita, com um breakdown por categoria.</div>
            <span style={{ display: 'inline-block', marginTop: 14, background: '#ede9fe', color: '#7c3aed', borderRadius: 999, padding: '3px 12px', fontSize: 11.5, fontWeight: 700 }}>Atualização instantânea</span>
          </div>

          <div className={featCardCls}>
            <div style={{ width: 52, height: 52, borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, marginBottom: 18, background: '#dbeafe' }}>🔑</div>
            <div style={{ fontSize: 17, fontWeight: 900, marginBottom: 8, color: '#1e1b2e' }}>Sugestão de keywords</div>
            <div style={{ fontSize: 14, color: '#6b7280', lineHeight: 1.65 }}>Identifica termos da vaga que faltam no seu CV e sugere onde encaixá-los naturalmente.</div>
            <span style={{ display: 'inline-block', marginTop: 14, background: '#dbeafe', color: '#1d4ed8', borderRadius: 999, padding: '3px 12px', fontSize: 11.5, fontWeight: 700 }}>Extraídas da vaga</span>
          </div>

          <div className={featCardCls}>
            <div style={{ width: 52, height: 52, borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, marginBottom: 18, background: '#d1fae5' }}>✍️</div>
            <div style={{ fontSize: 17, fontWeight: 900, marginBottom: 8, color: '#1e1b2e' }}>Reescrita de bullets com IA</div>
            <div style={{ fontSize: 14, color: '#6b7280', lineHeight: 1.65 }}>A IA reescreve suas experiências com verbos de impacto e métricas, mantendo sua voz.</div>
            <span style={{ display: 'inline-block', marginTop: 14, background: '#d1fae5', color: '#065f46', borderRadius: 999, padding: '3px 12px', fontSize: 11.5, fontWeight: 700 }}>Um clique por bullet</span>
          </div>

          <div className={featCardCls}>
            <div style={{ width: 52, height: 52, borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, marginBottom: 18, background: '#ffedd5' }}>📊</div>
            <div style={{ fontSize: 17, fontWeight: 900, marginBottom: 8, color: '#1e1b2e' }}>Comparativo antes/depois</div>
            <div style={{ fontSize: 14, color: '#6b7280', lineHeight: 1.65 }}>Acompanhe a evolução do seu score a cada ajuste aplicado, com histórico das versões.</div>
            <span style={{ display: 'inline-block', marginTop: 14, background: '#ffedd5', color: '#c2410c', borderRadius: 999, padding: '3px 12px', fontSize: 11.5, fontWeight: 700 }}>Histórico de versões</span>
          </div>

          <div className={featCardCls}>
            <div style={{ width: 52, height: 52, borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, marginBottom: 18, background: '#fce7f3' }}>🌐</div>
            <div style={{ fontSize: 17, fontWeight: 900, marginBottom: 8, color: '#1e1b2e' }}>PT-BR e English lado a lado</div>
            <div style={{ fontSize: 14, color: '#6b7280', lineHeight: 1.65 }}>Mantenha versões calibradas em português e inglês para vagas locais e remotas globais.</div>
            <span style={{ display: 'inline-block', marginTop: 14, background: '#fce7f3', color: '#9d174d', borderRadius: 999, padding: '3px 12px', fontSize: 11.5, fontWeight: 700 }}>Sincronizado</span>
          </div>

          <div className={featCardCls}>
            <div style={{ width: 52, height: 52, borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, marginBottom: 18, background: '#fef3c7' }}>📄</div>
            <div style={{ fontSize: 17, fontWeight: 900, marginBottom: 8, color: '#1e1b2e' }}>Exportação em PDF</div>
            <div style={{ fontSize: 14, color: '#6b7280', lineHeight: 1.65 }}>Baixe o CV tailorizado pronto para envio, formatado e livre de erros de ATS.</div>
            <span style={{ display: 'inline-block', marginTop: 14, background: '#fef3c7', color: '#92400e', borderRadius: 999, padding: '3px 12px', fontSize: 11.5, fontWeight: 700 }}>Pronto para enviar</span>
          </div>
        </div>
      </div>

      {/* HOW IT WORKS */}
      <div id="como-funciona" style={{ background: 'linear-gradient(180deg, #fff 0%, #f5f3ff 100%)' }}>
        <div style={{ padding: m ? '64px 20px' : '100px 48px', maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ fontSize: 12, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '1.5px', color: '#a78bfa', marginBottom: 12 }}>Como funciona</div>
          <h2 style={{ fontFamily: "'Lato', sans-serif", fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 900, color: '#1e1b2e', lineHeight: 1.15, letterSpacing: '-1px', margin: 0 }}>
            Do CV genérico ao<br />CV sob medida, em 3 passos
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: m ? '1fr' : '1fr 1fr', gap: m ? 40 : 80, alignItems: 'center', marginTop: 56 }}>
            {/* Steps */}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', gap: 20, padding: '22px 0', borderBottom: '1px solid #e9e4fc' }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, background: '#ede9fe', color: '#7c3aed', fontSize: 16, fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>1</div>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 900, marginBottom: 4 }}>Envie seu CV e a vaga</div>
                  <div style={{ fontSize: 14, color: '#6b7280', lineHeight: 1.6 }}>Suba seu currículo atual e cole a descrição da vaga que você quer tailorizar.</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 20, padding: '22px 0', borderBottom: '1px solid #e9e4fc' }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, background: '#ede9fe', color: '#7c3aed', fontSize: 16, fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>2</div>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 900, marginBottom: 4 }}>Veja o score e as sugestões</div>
                  <div style={{ fontSize: 14, color: '#6b7280', lineHeight: 1.6 }}>A IA analisa aderência ao ATS e aponta keywords faltantes e bullets a melhorar.</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 20, padding: '22px 0' }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, background: '#ede9fe', color: '#7c3aed', fontSize: 16, fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>3</div>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 900, marginBottom: 4 }}>Aplique e baixe o PDF</div>
                  <div style={{ fontSize: 14, color: '#6b7280', lineHeight: 1.6 }}>Aceite as sugestões com um clique e exporte o CV já calibrado para a vaga.</div>
                </div>
              </div>
            </div>

            {/* ATS mock card */}
            <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #e9e4fc', boxShadow: '0 20px 60px rgba(124,58,237,.22)', overflow: 'hidden', position: 'relative' }}>
              <div style={{ background: '#f8f7fc', borderBottom: '1px solid #e9e4fc', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#f87171' }} />
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#fbbf24' }} />
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#34d399' }} />
                <div style={{ flex: 1, height: 20, background: '#e9e4fc', borderRadius: 999, margin: '0 10px' }} />
              </div>
              <div style={{ padding: 24 }}>
                <div style={{ fontSize: 13, fontWeight: 900, color: '#7c3aed', marginBottom: 12 }}>✦ Análise ATS · Senior Frontend Engineer @ Nubank</div>
                <div style={{ background: '#ede9fe', borderRadius: 10, padding: 14, marginBottom: 12, textAlign: 'center' }}>
                  <div style={{ fontSize: 36, fontWeight: 900, color: '#7c3aed' }}>85</div>
                  <div style={{ fontSize: 11, color: '#6b7280' }}>Score com otimizações</div>
                  <div style={{ width: '80%', height: 6, background: '#fff', borderRadius: 999, margin: '8px auto 0', overflow: 'hidden' }}>
                    <div style={{ width: '85%', height: '100%', background: 'linear-gradient(90deg,#a78bfa,#f0abfc)', borderRadius: 999 }} />
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 110, fontWeight: 700 }}>React</div>
                    <div style={{ flex: 1, height: 8, background: '#ede9fe', borderRadius: 999, overflow: 'hidden' }}>
                      <div style={{ width: '95%', height: '100%', background: '#34d399', borderRadius: 999 }} />
                    </div>
                    <div style={{ width: 36, textAlign: 'right', fontWeight: 700, color: '#065f46' }}>95%</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 110, fontWeight: 700 }}>TypeScript</div>
                    <div style={{ flex: 1, height: 8, background: '#ede9fe', borderRadius: 999, overflow: 'hidden' }}>
                      <div style={{ width: '90%', height: '100%', background: '#34d399', borderRadius: 999 }} />
                    </div>
                    <div style={{ width: 36, textAlign: 'right', fontWeight: 700, color: '#065f46' }}>90%</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 110, fontWeight: 700 }}>Microfrontend</div>
                    <div style={{ flex: 1, height: 8, background: '#ede9fe', borderRadius: 999, overflow: 'hidden' }}>
                      <div style={{ width: '80%', height: '100%', background: '#a78bfa', borderRadius: 999 }} />
                    </div>
                    <div style={{ width: 36, textAlign: 'right', fontWeight: 700, color: '#7c3aed' }}>80%</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 110, fontWeight: 700 }}>Soft skills</div>
                    <div style={{ flex: 1, height: 8, background: '#ede9fe', borderRadius: 999, overflow: 'hidden' }}>
                      <div style={{ width: '55%', height: '100%', background: '#fb923c', borderRadius: 999 }} />
                    </div>
                    <div style={{ width: 36, textAlign: 'right', fontWeight: 700, color: '#c2410c' }}>55%</div>
                  </div>
                </div>
                <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#d1fae5', color: '#065f46', borderRadius: 999, padding: '5px 14px', fontSize: 12, fontWeight: 700 }}>
                    <i className="fas fa-arrow-up" style={{ fontSize: 10 }} />+23 pts aplicados
                  </div>
                  <div style={{ background: '#ede9fe', color: '#7c3aed', borderRadius: 999, padding: '5px 14px', fontSize: 12, fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                    <i className="fas fa-file-pdf" style={{ fontSize: 10 }} />Baixar PDF
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA BAND */}
      <div style={{ background: 'linear-gradient(135deg, #7c3aed 0%, #4c1d95 50%, #7c3aed 100%)', padding: m ? '56px 20px' : '80px 48px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.04) 1px,transparent 1px)', backgroundSize: '60px 60px', pointerEvents: 'none' }} />
        <h2 style={{ fontFamily: "'Lato', sans-serif", fontSize: 'clamp(28px,4vw,44px)', fontWeight: 900, color: '#fff', margin: '0 0 16px', position: 'relative' }}>
          Pronto para tailorizar<br />seu próximo CV?
        </h2>
        <p style={{ fontSize: 17, color: 'rgba(255,255,255,.65)', margin: '0 0 36px', position: 'relative' }}>
          Crie sua conta gratuitamente e rode sua primeira análise ATS hoje mesmo.
        </p>
        <Link to="/register" className={ctaBandBtnCls}>
          <i className="fas fa-rocket" />Criar conta grátis agora
        </Link>
      </div>

      {/* FOOTER */}
      <footer style={{ background: '#1e1b2e', padding: m ? '36px 20px 24px' : '48px 48px 32px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', display: 'flex', flexDirection: m ? 'column' : 'row', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 20, textAlign: m ? 'center' : 'left' }}>
          <div style={{ fontSize: 22, fontWeight: 900, color: '#fff', fontFamily: "'Lato', sans-serif" }}>
            do<span style={{ color: '#c4b5fd' }}>job</span>
          </div>
          <div style={{ display: 'flex', gap: m ? 14 : 24, flexWrap: 'wrap', justifyContent: 'center' }}>
            <a className={footerLinkCls}>Sobre</a>
            <a className={footerLinkCls}>Blog</a>
            <a className={footerLinkCls}>Privacidade</a>
            <a className={footerLinkCls}>Termos</a>
            <a className={footerLinkCls}>Suporte</a>
          </div>
        </div>
        <div style={{ textAlign: 'center', fontSize: 12.5, color: 'rgba(255,255,255,.25)', marginTop: 24, paddingTop: 24, borderTop: '1px solid rgba(255,255,255,.08)', maxWidth: 1280, marginLeft: 'auto', marginRight: 'auto' }}>
          © 2026 dojob. Todos os direitos reservados.
        </div>
      </footer>

    </div>
  )
}
