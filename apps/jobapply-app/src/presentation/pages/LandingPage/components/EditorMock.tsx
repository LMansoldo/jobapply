import { useTranslation } from 'react-i18next'
import { css } from '@emotion/css'
import { ringSmCls, barSmCls, barFillCyanCls, scoreCountKeyframe, tokens, monoCls } from '../LandingPage.styles'
import { suggestKw, scores } from '../data'

// ---------- mock (glass shell) ----------
const mockCls = css`border-radius:22px;overflow:hidden;background:rgba(255,255,255,.75);backdrop-filter:blur(30px);-webkit-backdrop-filter:blur(30px);border:1px solid rgba(255,255,255,.8);box-shadow:${tokens.shLg},inset 0 1px 0 rgba(255,255,255,.9)`
const mockBarCls = css`display:flex;align-items:center;gap:12px;padding:12px 18px;border-bottom:1px solid rgba(10,10,18,.06)`
const mockDotsCls = css`display:flex;gap:6px`
const mockDotCls = css`width:9px;height:9px;border-radius:999px`
const mockUrlCls = css`margin-left:16px;font-size:11px;color:rgba(10,10,18,.45)`
const mockLangsCls = css`margin-left:auto;display:flex;gap:6px`
const mockLangCls = css`font-size:10px;padding:4px 10px;border-radius:6px;background:rgba(10,10,18,.05);color:rgba(10,10,18,.6);border:1px solid ${tokens.line}`
const mockLangOnCls = css`background:rgba(22,163,74,.12);color:#16a34a;border-color:rgba(22,163,74,.3)`

const mockSplitCls = css`display:grid;grid-template-columns:1fr 220px;@media (max-width:640px){grid-template-columns:1fr}`
const mockMainCls = css`padding:22px;border-right:1px solid rgba(10,10,18,.06);min-height:520px`
const mockLabelCls = css`display:flex;align-items:center;gap:8px;font-size:10px;letter-spacing:.15em;text-transform:uppercase;color:rgba(10,10,18,.4);margin-bottom:14px`
const mockLabelDotCls = css`width:5px;height:5px;border-radius:999px`
const mockJdCls = css`padding:14px;border-radius:10px;background:rgba(10,10,18,.03);border:1px solid rgba(10,10,18,.06);font-size:12px;line-height:1.6;color:rgba(10,10,18,.7);margin-bottom:24px`
const hlCls = css`background:rgba(139,92,246,.18);color:#7c3aed;padding:1px 4px;border-radius:3px`
const mockBoxCls = css`padding:14px;border-radius:10px;margin-bottom:10px`
const mockBoxRedCls = css`background:rgba(220,38,38,.05);border:1px solid rgba(220,38,38,.18)`
const mockBoxGreenCls = css`background:rgba(22,163,74,.06);border:1px solid rgba(22,163,74,.25);margin-bottom:20px`
const mockBoxHeadCls = css`display:flex;justify-content:space-between;align-items:center;margin-bottom:6px`
const mockTagCls = css`font-size:10px;text-transform:uppercase;letter-spacing:.1em`
const mockTagRedCls = css`color:rgba(220,38,38,.85)`
const mockTagGreenCls = css`color:#16a34a`
const mockBeforeCls = css`font-size:13px;color:rgba(10,10,18,.6);line-height:1.5;text-decoration:line-through`
const mockAfterCls = css`font-size:13px;color:${tokens.ink};line-height:1.5`
const mjPurpleCls = css`color:#7c3aed;font-weight:700`
const mjGreenCls = css`color:#16a34a;font-weight:700`
const mockKwCls = css`display:flex;gap:8px;flex-wrap:wrap;padding:12px;border-radius:10px;background:rgba(139,92,246,.06);border:1px solid rgba(139,92,246,.2)`
const mockKwTitleCls = css`font-size:10px;color:#7c3aed;text-transform:uppercase;letter-spacing:.1em;width:100%;margin-bottom:4px`
const kwChipCls = css`font-size:11px;padding:4px 9px;border-radius:999px;background:rgba(139,92,246,.15);border:1px solid rgba(139,92,246,.4);color:#7c3aed;display:flex;align-items:center;gap:5px`

const mockSideCls = css`padding:22px;display:flex;flex-direction:column;gap:18px`
const mockLabelUcCls = css`font-size:10px;letter-spacing:.15em;text-transform:uppercase;color:rgba(10,10,18,.4);margin-bottom:12px`
const ringCenterCls = css`position:absolute;inset:0;display:grid;place-items:center;text-align:center`
const ringValueCls = css`font-size:38px;color:${tokens.ink}`
const ringSubCls = css`font-size:9px;color:#16a34a;text-transform:uppercase;letter-spacing:.1em;margin-top:2px`
const hrCls = css`height:1px;background:rgba(10,10,18,.08)`
const scoreListCls = css`display:flex;flex-direction:column;gap:12px`
const scoreRowHeadCls = css`display:flex;justify-content:space-between;margin-bottom:5px`
const scoreRowNameCls = css`font-size:11px;color:rgba(10,10,18,.8)`
const scoreRowPctCls = css`font-size:10px;color:rgba(10,10,18,.45)`
const downloadBtnCls = css`margin-top:auto;border-radius:999px;padding:12px;text-align:center;background:${tokens.ink};color:#fff;box-shadow:${tokens.shDark};font-weight:700;text-decoration:none;cursor:pointer`

export default function EditorMock() {
  const { t } = useTranslation()
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const ringCircleStyle = reduce ? { strokeDashoffset: 26 } : { animation: `${scoreCountKeyframe} 2.2s cubic-bezier(.2,.7,.2,1) .3s both` }
  return (
    <div className={mockCls}>
      <div className={mockBarCls}>
        <div className={mockDotsCls}>
          <div className={mockDotCls} style={{ background: '#ff5f57' }} />
          <div className={mockDotCls} style={{ background: '#febc2e' }} />
          <div className={mockDotCls} style={{ background: '#28c840' }} />
        </div>
        <div className={`${mockUrlCls} ${monoCls}`}>dojob.pro/editor</div>
        <div className={mockLangsCls}>
          <div className={`${mockLangCls} ${monoCls}`}>PT-BR</div>
          <div className={`${mockLangCls} ${mockLangOnCls} ${monoCls}`}>EN</div>
        </div>
      </div>

      <div className={mockSplitCls}>
        <div className={mockMainCls}>
          <div className={mockLabelCls}>
            <span className={mockLabelDotCls} style={{ background: '#8b5cf6', boxShadow: '0 0 8px #8b5cf6' }} />
            {t('landing.editorMock.jdLabel')}
          </div>
          <div className={mockJdCls}>
            {t('landing.editorMock.jdPre')} <span className={hlCls}>React</span> {t('landing.editorMock.and')} <span className={hlCls}>TypeScript</span> {t('landing.editorMock.jdMid')} <span className={hlCls}>microfrontend</span>{t('landing.editorMock.jdPost')} <span className={hlCls}>performance</span> {t('landing.editorMock.and')} <span className={hlCls}>a11y</span> {t('landing.editorMock.jdEnd')}
          </div>

          <div className={mockLabelCls}>
            <span className={mockLabelDotCls} style={{ background: '#06b6d4', boxShadow: '0 0 8px #06b6d4' }} />
            {t('landing.editorMock.cvLabel')}
          </div>

          <div className={`${mockBoxCls} ${mockBoxRedCls}`}>
            <div className={`${mockTagCls} ${mockTagRedCls} ${monoCls}`}>{t('landing.editorMock.beforeTag')}</div>
            <div className={mockBeforeCls}>{t('landing.editorMock.beforeText')}</div>
          </div>

          <div className={`${mockBoxCls} ${mockBoxGreenCls}`}>
            <div className={mockBoxHeadCls}>
              <div className={`${mockTagCls} ${mockTagGreenCls} ${monoCls}`}>{t('landing.editorMock.afterTag')}</div>
              <div className={`${mockTagCls} ${mockTagGreenCls} ${monoCls}`}>{t('landing.editorMock.afterBadge')}</div>
            </div>
            <div className={mockAfterCls}>
              {t('landing.editorMock.afterPre')} <span className={mjPurpleCls}>12 microfrontends</span> {t('landing.editorMock.afterMid')} <span className={mjPurpleCls}>React/TypeScript</span>{t('landing.editorMock.afterCut')} <span className={mjGreenCls}>37%</span> {t('landing.editorMock.afterEnd')} <span className={mjGreenCls}>98</span>.
            </div>
          </div>

          <div className={mockKwCls}>
            <div className={`${mockKwTitleCls} ${monoCls}`}>{t('landing.editorMock.kwTitle')}</div>
            {suggestKw.map(k => (
              <div className={`${kwChipCls} ${monoCls}`} key={k}><span style={{ fontSize: 10 }}>+</span>{k}</div>
            ))}
          </div>
        </div>

        <div className={mockSideCls}>
          <div>
            <div className={`${mockLabelUcCls} ${monoCls}`}>{t('landing.editorMock.sideScore')}</div>
            <div className={ringSmCls} style={{ margin: '0 auto' }}>
              <svg viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(10,10,18,.08)" strokeWidth={7} />
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="url(#g2)"
                  strokeWidth={7}
                  strokeLinecap="round"
                  strokeDasharray={283}
                  style={ringCircleStyle}
                />
                <defs>
                  <linearGradient id="g2" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0" stopColor="#8b5cf6" />
                    <stop offset=".6" stopColor="#06b6d4" />
                    <stop offset="1" stopColor="#16a34a" />
                  </linearGradient>
                </defs>
              </svg>
              <div className={ringCenterCls}>
                <div>
                  <div className={ringValueCls}>91</div>
                  <div className={ringSubCls}>+23 pts</div>
                </div>
              </div>
            </div>
          </div>

          <div className={hrCls} />

          <div className={scoreListCls}>
            {scores.map(s => (
              <div key={s.name}>
                <div className={scoreRowHeadCls}>
                  <span className={scoreRowNameCls}>{s.name}</span>
                  <span className={`${scoreRowPctCls} ${monoCls}`}>{s.pct}%</span>
                </div>
                <div className={barSmCls}><div className={barFillCyanCls} style={{ width: `${s.pct}%` }} /></div>
              </div>
            ))}
          </div>

          <a className={downloadBtnCls}>{t('landing.editorMock.downloadPdf')}</a>
        </div>
      </div>
    </div>
  )
}
