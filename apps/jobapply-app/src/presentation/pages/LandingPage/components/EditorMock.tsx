import { useTranslation } from 'react-i18next'
import styled from '@emotion/styled'
import { RingSm, BarSm, monoFont, tokens } from '../LandingPage.styles'
import { suggestKw, scores } from '../data'
import { MockDot, MockLabelDot, KwPlus, RingProgressCircle, ScoreBarFill } from './EditorMock.styles'

// ---------- mock (glass shell) ----------
const Mock = styled.div`border-radius:22px;overflow:hidden;background:rgba(255,255,255,.75);backdrop-filter:blur(30px);-webkit-backdrop-filter:blur(30px);border:1px solid rgba(255,255,255,.8);box-shadow:${tokens.shLg},inset 0 1px 0 rgba(255,255,255,.9)`
const MockBar = styled.div`display:flex;align-items:center;gap:12px;padding:12px 18px;border-bottom:1px solid rgba(10,10,18,.06)`
const MockDots = styled.div`display:flex;gap:6px`
const MockUrl = styled.div`margin-left:16px;font-size:11px;color:rgba(10,10,18,.45);font-family:${monoFont}`
const MockLangs = styled.div`margin-left:auto;display:flex;gap:6px`
const MockLang = styled.div`font-size:10px;padding:4px 10px;border-radius:6px;background:rgba(10,10,18,.05);color:rgba(10,10,18,.6);border:1px solid ${tokens.line};font-family:${monoFont}`
const MockLangOn = styled.div`background:rgba(22,163,74,.12);color:#16a34a;border-color:rgba(22,163,74,.3);font-family:${monoFont};font-size:10px;padding:4px 10px;border-radius:6px`

const MockSplit = styled.div`display:grid;grid-template-columns:1fr 220px;@media (max-width:640px){grid-template-columns:1fr}`
const MockMain = styled.div`padding:22px;border-right:1px solid rgba(10,10,18,.06);min-height:520px`
const MockLabel = styled.div`display:flex;align-items:center;gap:8px;font-size:10px;letter-spacing:.15em;text-transform:uppercase;color:rgba(10,10,18,.4);margin-bottom:14px`
const MockJd = styled.div`padding:14px;border-radius:10px;background:rgba(10,10,18,.03);border:1px solid rgba(10,10,18,.06);font-size:12px;line-height:1.6;color:rgba(10,10,18,.7);margin-bottom:24px`
const Hl = styled.span`background:rgba(139,92,246,.18);color:#7c3aed;padding:1px 4px;border-radius:3px`
const MockBox = styled.div`padding:14px;border-radius:10px;margin-bottom:10px`
const MockBoxRed = styled(MockBox)`background:rgba(220,38,38,.05);border:1px solid rgba(220,38,38,.18)`
const MockBoxGreen = styled(MockBox)`background:rgba(22,163,74,.06);border:1px solid rgba(22,163,74,.25);margin-bottom:20px`
const MockBoxHead = styled.div`display:flex;justify-content:space-between;align-items:center;margin-bottom:6px`
const MockTag = styled.div`font-size:10px;text-transform:uppercase;letter-spacing:.1em;font-family:${monoFont}`
const MockTagRed = styled(MockTag)`color:rgba(220,38,38,.85)`
const MockTagGreen = styled(MockTag)`color:#16a34a`
const MockBefore = styled.div`font-size:13px;color:rgba(10,10,18,.6);line-height:1.5;text-decoration:line-through`
const MockAfter = styled.div`font-size:13px;color:${tokens.ink};line-height:1.5`
const MjPurple = styled.span`color:#7c3aed;font-weight:700`
const MjGreen = styled.span`color:#16a34a;font-weight:700`
const MockKw = styled.div`display:flex;gap:8px;flex-wrap:wrap;padding:12px;border-radius:10px;background:rgba(139,92,246,.06);border:1px solid rgba(139,92,246,.2)`
const MockKwTitle = styled.div`font-size:10px;color:#7c3aed;text-transform:uppercase;letter-spacing:.1em;width:100%;margin-bottom:4px;font-family:${monoFont}`
const KwChip = styled.div`font-size:11px;padding:4px 9px;border-radius:999px;background:rgba(139,92,246,.15);border:1px solid rgba(139,92,246,.4);color:#7c3aed;display:flex;align-items:center;gap:5px;font-family:${monoFont}`

const MockSide = styled.div`padding:22px;display:flex;flex-direction:column;gap:18px`
const MockLabelUc = styled.div`font-size:10px;letter-spacing:.15em;text-transform:uppercase;color:rgba(10,10,18,.4);margin-bottom:12px;font-family:${monoFont}`
const RingCenter = styled.div`position:absolute;inset:0;display:grid;place-items:center;text-align:center`
const RingValue = styled.div`font-size:38px;color:${tokens.ink}`
const RingSub = styled.div`font-size:9px;color:#16a34a;text-transform:uppercase;letter-spacing:.1em;margin-top:2px`
const Hr = styled.div`height:1px;background:rgba(10,10,18,.08)`
const ScoreList = styled.div`display:flex;flex-direction:column;gap:12px`
const ScoreRowHead = styled.div`display:flex;justify-content:space-between;margin-bottom:5px`
const ScoreRowName = styled.span`font-size:11px;color:rgba(10,10,18,.8)`
const ScoreRowPct = styled.span`font-size:10px;color:rgba(10,10,18,.45);font-family:${monoFont}`
const DownloadBtn = styled.a`margin-top:auto;border-radius:999px;padding:12px;text-align:center;background:${tokens.ink};color:#fff;box-shadow:${tokens.shDark};font-weight:700;text-decoration:none;cursor:pointer`

export default function EditorMock() {
  const { t } = useTranslation()
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  return (
    <Mock>
      <MockBar>
        <MockDots>
          <MockDot $bg="#ff5f57" />
          <MockDot $bg="#febc2e" />
          <MockDot $bg="#28c840" />
        </MockDots>
        <MockUrl>dojob.pro/editor</MockUrl>
        <MockLangs>
          <MockLang>PT-BR</MockLang>
          <MockLangOn>EN</MockLangOn>
        </MockLangs>
      </MockBar>

      <MockSplit>
        <MockMain>
          <MockLabel>
            <MockLabelDot $color="#8b5cf6" />
            {t('landing.editorMock.jdLabel')}
          </MockLabel>
          <MockJd>
            {t('landing.editorMock.jdPre')} <Hl>React</Hl> {t('landing.editorMock.and')} <Hl>TypeScript</Hl> {t('landing.editorMock.jdMid')} <Hl>microfrontend</Hl>{t('landing.editorMock.jdPost')} <Hl>performance</Hl> {t('landing.editorMock.and')} <Hl>a11y</Hl> {t('landing.editorMock.jdEnd')}
          </MockJd>

          <MockLabel>
            <MockLabelDot $color="#06b6d4" />
            {t('landing.editorMock.cvLabel')}
          </MockLabel>

          <MockBoxRed>
            <MockTagRed>{t('landing.editorMock.beforeTag')}</MockTagRed>
            <MockBefore>{t('landing.editorMock.beforeText')}</MockBefore>
          </MockBoxRed>

          <MockBoxGreen>
            <MockBoxHead>
              <MockTagGreen>{t('landing.editorMock.afterTag')}</MockTagGreen>
              <MockTagGreen>{t('landing.editorMock.afterBadge')}</MockTagGreen>
            </MockBoxHead>
            <MockAfter>
              {t('landing.editorMock.afterPre')} <MjPurple>12 microfrontends</MjPurple> {t('landing.editorMock.afterMid')} <MjPurple>React/TypeScript</MjPurple>{t('landing.editorMock.afterCut')} <MjGreen>37%</MjGreen> {t('landing.editorMock.afterEnd')} <MjGreen>98</MjGreen>.
            </MockAfter>
          </MockBoxGreen>

          <MockKw>
            <MockKwTitle>{t('landing.editorMock.kwTitle')}</MockKwTitle>
            {suggestKw.map(k => (
              <KwChip key={k}><KwPlus>+</KwPlus>{k}</KwChip>
            ))}
          </MockKw>
        </MockMain>

        <MockSide>
          <div>
            <MockLabelUc>{t('landing.editorMock.sideScore')}</MockLabelUc>
            <RingSm>
              <svg viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(10,10,18,.08)" strokeWidth={7} />
                <RingProgressCircle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="url(#g2)"
                  strokeWidth={7}
                  strokeLinecap="round"
                  strokeDasharray={283}
                  $reduce={reduce}
                />
                <defs>
                  <linearGradient id="g2" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0" stopColor="#8b5cf6" />
                    <stop offset=".6" stopColor="#06b6d4" />
                    <stop offset="1" stopColor="#16a34a" />
                  </linearGradient>
                </defs>
              </svg>
              <RingCenter>
                <div>
                  <RingValue>91</RingValue>
                  <RingSub>+23 pts</RingSub>
                </div>
              </RingCenter>
            </RingSm>
          </div>

          <Hr />

          <ScoreList>
            {scores.map(s => (
              <div key={s.name}>
                <ScoreRowHead>
                  <ScoreRowName>{s.name}</ScoreRowName>
                  <ScoreRowPct>{s.pct}%</ScoreRowPct>
                </ScoreRowHead>
                <BarSm><ScoreBarFill $w={`${s.pct}%`} /></BarSm>
              </div>
            ))}
          </ScoreList>

          <DownloadBtn>{t('landing.editorMock.downloadPdf')}</DownloadBtn>
        </MockSide>
      </MockSplit>
    </Mock>
  )
}
