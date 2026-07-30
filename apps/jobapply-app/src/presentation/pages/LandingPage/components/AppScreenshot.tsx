import { useTranslation } from 'react-i18next'
import { css } from '@emotion/css'
import { cardWhiteCls, ringCls, barCls, barFillCls, chipCls, monoCls, tokens } from '../LandingPage.styles'
import { atsList, categories, minimap } from '../data'

// ---------- app__topbar ----------
const appTopbarCls = css`display:flex;align-items:center;justify-content:space-between;padding:12px 24px;border-bottom:1px solid rgba(10,10,18,.07);background:#fff`
const appBrandCls = css`font-family:'Lato',sans-serif;font-weight:900;font-size:20px;letter-spacing:-.02em`
const appBrandDoCls = css`color:${tokens.ink}`
const appBrandJobCls = css`color:${tokens.brand}`
const appTabsCls = css`display:flex;align-items:center;gap:8px;@media (max-width:640px){display:none}`
const appTabLabelCls = css`font-size:11px;color:rgba(10,10,18,.5)`
const appTabIcoCls = css`width:16px;height:16px;border-radius:4px;border:1.6px solid rgba(10,10,18,.35);position:relative`
const appTabIcoRoundCls = css`width:14px;height:14px;border-radius:999px`
const appTabCls = css`display:flex;flex-direction:column;align-items:center;gap:2px;padding:8px 14px;border-radius:10px`
const appTabActiveCls = css`
  background:rgba(124,92,252,.1);
  & .${appTabLabelCls}{color:${tokens.brand};font-weight:700}
  & .${appTabIcoCls}{border-color:${tokens.brand}}
`
const appUserCls = css`display:flex;align-items:center;gap:10px;padding:5px 12px 5px 5px;border-radius:999px;border:1px solid ${tokens.line}`
const appAvatarCls = css`width:28px;height:28px;border-radius:999px;background:linear-gradient(135deg,#7c5cfc,#a78bfa)`
const appUserNameCls = css`font-size:13px;color:${tokens.ink};font-weight:700`

// ---------- app__sub ----------
const appSubCls = css`display:flex;align-items:center;justify-content:space-between;padding:14px 24px;border-bottom:1px solid rgba(10,10,18,.07);background:#fafafb;@media (max-width:640px){flex-direction:column;align-items:flex-start;gap:8px}`
const appSubLeftCls = css`display:flex;align-items:center;gap:20px`
const appSubNewCls = css`display:flex;align-items:center;gap:6px;color:${tokens.brand};font-size:13px;font-weight:700`
const appSubNewSpinnerCls = css`display:inline-block;width:13px;height:13px;border:1.6px solid #7c5cfc;border-top-color:transparent;border-radius:999px`
const appSubTitleCls = css`font-size:14px;font-weight:700;color:${tokens.ink}`
const appSubDescCls = css`font-size:11px;color:rgba(10,10,18,.45)`
const appModeCls = css`display:flex;align-items:center;gap:7px;font-size:12px;color:#16a34a`
const dotCls = css`width:7px;height:7px;border-radius:999px;background:#16a34a`

// ---------- app__ats ----------
const appAtsCls = css`display:flex;align-items:center;flex-wrap:wrap;gap:8px;padding:12px 24px;border-bottom:1px solid rgba(10,10,18,.07);background:#fafafb`
const appAtsLabelCls = css`font-size:12px;color:rgba(10,10,18,.4);margin-right:2px`

// ---------- app__split ----------
const appSplitCls = css`display:grid;grid-template-columns:1.55fr 1fr;gap:0;background:#f4f4f7;padding:20px;align-items:start;@media (max-width:900px){grid-template-columns:1fr;gap:20px}`

// ---------- editor (dark markdown editor) ----------
const editorCls = css`border-radius:12px;overflow:hidden;background:#12152a;box-shadow:${tokens.shMd}`
const editorToolbarCls = css`display:flex;align-items:center;gap:18px;padding:10px 14px;border-bottom:1px solid rgba(255,255,255,.08)`
const editorMenuCls = css`font-size:12px;color:rgba(255,255,255,.75)`
const editorToolsCls = css`display:flex;align-items:center;gap:12px;margin-left:8px;color:rgba(255,255,255,.55);font-size:12px;font-weight:700`
const editorDividerCls = css`width:1px;height:12px;background:rgba(255,255,255,.15)`
const editorGridCls = css`display:grid;grid-template-columns:1fr 54px;gap:0`
const editorBodyCls = css`padding:18px 16px;font-family:'JetBrains Mono',monospace;font-size:11px;line-height:1.75;min-height:340px`
const editorMinimapCls = css`border-left:1px solid rgba(255,255,255,.08);padding:14px 8px;display:flex;flex-direction:column;gap:3px;opacity:.5`
const editorMinirowCls = css`height:3px;border-radius:2px;background:rgba(255,255,255,.35)`
const editorStatusCls = css`display:flex;align-items:center;gap:16px;padding:8px 14px;border-top:1px solid rgba(255,255,255,.08);font-family:'JetBrains Mono',monospace;font-size:10px;color:rgba(255,255,255,.4)`
// markdown syntax coloring
const mdHCls = css`color:#5ed4c4`
const mdPCls = css`color:#c8cdd8`
const mdStrongCls = css`color:#fff;font-weight:700`
const mdSubCls = css`color:#8ea0d8`
const mdGapCls = css`height:10px`
const mdGapSmCls = css`height:6px`

// ---------- score panel ----------
const scoreCls = css`display:flex;flex-direction:column;gap:18px;padding:0 0 0 20px;@media (max-width:900px){padding:0}`
const scoreBannerCls = css`display:flex;align-items:center;justify-content:space-between;padding:12px 16px;border-radius:10px;background:rgba(22,163,74,.1);border:1px solid rgba(22,163,74,.2)`
const scoreBannerTxtCls = css`font-size:13px;color:${tokens.ink};font-weight:700`
const scoreBannerBadgeCls = css`font-size:11px;padding:3px 9px;border-radius:999px;background:#16a34a;color:#fff;font-weight:700`
const ringWrapCls = css`text-align:center;padding:6px 0`
const ringCenterCls = css`position:absolute;inset:0;display:grid;place-items:center;text-align:center`
const ringValueCls = css`font-family:'Lato',sans-serif;font-weight:900;font-size:40px;line-height:1;color:${tokens.brand}`
const ringUnitCls = css`font-size:12px;color:rgba(10,10,18,.4)`
const scoreLabelCls = css`font-size:13px;color:rgba(10,10,18,.55);margin-top:6px;text-align:center`
const catsTitleCls = css`font-size:12px;letter-spacing:.06em;text-transform:uppercase;color:rgba(10,10,18,.55);font-weight:700;margin-bottom:14px`
const catsListCls = css`display:flex;flex-direction:column;gap:14px`
const catNameCls = css`font-size:13px;color:${tokens.ink};margin-bottom:6px`
const exportCls = css`border-top:1px solid ${tokens.line};padding-top:16px`
const exportTitleCls = css`font-size:11px;letter-spacing:.06em;text-transform:uppercase;color:rgba(10,10,18,.45);font-weight:700;margin-bottom:12px`
const exportListCls = css`display:flex;flex-direction:column;gap:10px`
const appBtnCls = css`text-align:center;padding:13px;border-radius:10px;font-size:13px;font-weight:700`
const appBtnPrimaryCls = css`background:${tokens.brand};color:#fff;box-shadow:${tokens.shBrand}`
const appBtnOutlineCls = css`background:#fff;color:${tokens.brand};border:1px solid rgba(124,92,252,.4)`

/** Splits a `**bold:** rest` markdown-ish line so the bold prefix can be rendered distinctly, like the mock's separate `md-strong` span. */
function MdSkillLine({ text }: { text: string }) {
  const match = /^\*\*(.+?)\*\*(.*)$/.exec(text)
  if (!match) return <>{text}</>
  return (
    <>
      <span className={mdStrongCls}>**{match[1]}**</span>
      {match[2]}
    </>
  )
}

export default function AppScreenshot() {
  const { t } = useTranslation()

  return (
    <div className={cardWhiteCls}>
      <div className={appTopbarCls}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
          <span className={appBrandCls}>
            <span className={appBrandDoCls}>do</span>
            <span className={appBrandJobCls}>job</span>
          </span>
          <div className={appTabsCls}>
            <div className={`${appTabCls} ${appTabActiveCls}`}>
              <div className={appTabIcoCls}>
                <div style={{ position: 'absolute', right: -2, bottom: -2, width: 6, height: 1.6, background: '#7c5cfc', transform: 'rotate(45deg)' }} />
              </div>
              <span className={appTabLabelCls}>{t('landing.appMock.tabTailoring')}</span>
            </div>
            <div className={appTabCls}>
              <div className={appTabIcoCls} />
              <span className={appTabLabelCls}>{t('landing.appMock.tabLinkedin')}</span>
            </div>
            <div className={appTabCls}>
              <div className={`${appTabIcoCls} ${appTabIcoRoundCls}`} />
              <span className={appTabLabelCls}>{t('landing.appMock.tabProfile')}</span>
            </div>
          </div>
        </div>
        <div className={appUserCls}>
          <div className={appAvatarCls} aria-hidden="true" />
          <span className={appUserNameCls}>Lucas</span>
        </div>
      </div>

      <div className={appSubCls}>
        <div className={appSubLeftCls}>
          <div className={appSubNewCls}>
            <span className={appSubNewSpinnerCls} aria-hidden="true" />
            {t('landing.appMock.newAnalysis')}
          </div>
          <div>
            <div className={appSubTitleCls}>{t('landing.appMock.manualTitle')}</div>
            <div className={appSubDescCls}>{t('landing.appMock.manualDesc')}</div>
          </div>
        </div>
        <div className={appModeCls}>
          <span className={dotCls} aria-hidden="true" />
          {t('landing.appMock.manualMode')}
        </div>
      </div>

      <div className={appAtsCls}>
        <span className={appAtsLabelCls}>{t('landing.appMock.atsLabel')}</span>
        {atsList.map(a => <div className={chipCls} key={a}>{a}</div>)}
      </div>

      <div className={appSplitCls}>
        <div className={editorCls}>
          <div className={editorToolbarCls}>
            <span className={editorMenuCls}>{t('landing.appMock.editorFile')}</span>
            <span className={editorMenuCls}>{t('landing.appMock.editorExport')}</span>
            <div className={editorToolsCls}>
              <span style={{ fontWeight: 900 }}>B</span>
              <span style={{ fontStyle: 'italic' }}>I</span>
              <span>H1</span>
              <span>H2</span>
              <span>H3</span>
              <span className={editorDividerCls} />
              <span>≣</span>
              <span>⁝≣</span>
              <span>—</span>
              <span>↺</span>
              <span>↻</span>
              <span>👁</span>
            </div>
          </div>
          <div className={editorGridCls}>
            <div className={`${editorBodyCls} ${monoCls}`}>
              <div className={mdHCls}>{t('landing.appMock.cvObjectiveH')}</div>
              <div className={mdPCls}>{t('landing.appMock.cvObjective')}</div>
              <div className={mdGapCls} />
              <div className={mdHCls}>{t('landing.appMock.cvSummaryH')}</div>
              <div className={mdPCls}>{t('landing.appMock.cvSummary')}</div>
              <div className={mdGapCls} />
              <div className={mdHCls}>{t('landing.appMock.cvSkillsH')}</div>
              <div className={mdPCls}><MdSkillLine text={t('landing.appMock.cvSkillsDesign')} /></div>
              <div className={mdPCls}><MdSkillLine text={t('landing.appMock.cvSkillsResearch')} /></div>
              <div className={mdPCls}><MdSkillLine text={t('landing.appMock.cvSkillsCollab')} /></div>
              <div className={mdGapCls} />
              <div className={mdHCls}>{t('landing.appMock.cvExpH')}</div>
              <div className={mdGapSmCls} />
              <div className={mdSubCls}>{t('landing.appMock.cvExpRole')}</div>
              <div className={mdStrongCls}>{t('landing.appMock.cvExpDate')}</div>
            </div>
            <div className={editorMinimapCls} aria-hidden="true">
              {minimap.map((w, i) => (
                <div key={i} className={editorMinirowCls} style={{ width: w }} />
              ))}
            </div>
          </div>
          <div className={editorStatusCls}>
            <span>Markdown</span>
            <span>Ln 1, Col 1</span>
            <span>{t('landing.appMock.statusWords')}</span>
            <span style={{ marginLeft: 'auto' }}>PT-BR</span>
          </div>
        </div>

        <div className={scoreCls}>
          <div className={scoreBannerCls}>
            <span className={scoreBannerTxtCls}>{t('landing.appMock.scoreBanner')}</span>
            <span className={scoreBannerBadgeCls}>{t('landing.appMock.scoreBannerBadge')}</span>
          </div>

          <div className={ringWrapCls}>
            <div className={ringCls}>
              <svg viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(10,10,18,.08)" strokeWidth="6" />
                <circle cx="50" cy="50" r="45" fill="none" stroke="url(#g1)" strokeWidth="6" strokeLinecap="round" strokeDasharray="283" strokeDashoffset={198} />
                <defs>
                  <linearGradient id="g1" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0" stopColor="#7c5cfc" />
                    <stop offset="1" stopColor="#ec4899" />
                  </linearGradient>
                </defs>
              </svg>
              <div className={ringCenterCls}>
                <div>
                  <div className={ringValueCls}>30</div>
                  <div className={ringUnitCls}>/100</div>
                </div>
              </div>
            </div>
            <div className={scoreLabelCls}>{t('landing.appMock.scoreLabel')}</div>
          </div>

          <div>
            <div className={catsTitleCls}>{t('landing.appMock.catsTitle')}</div>
            <div className={catsListCls}>
              {categories.map(c => (
                <div key={c.key}>
                  <div className={catNameCls}>{t(`landing.appMock.${c.key}`)}</div>
                  <div className={barCls}><div className={barFillCls} style={{ width: c.pct }} /></div>
                </div>
              ))}
            </div>
          </div>

          <div className={exportCls}>
            <div className={exportTitleCls}>{t('landing.appMock.exportTitle')}</div>
            <div className={exportListCls}>
              <a className={`${appBtnCls} ${appBtnPrimaryCls}`}>{t('landing.appMock.exportPdf')}</a>
              <a className={`${appBtnCls} ${appBtnOutlineCls}`}>{t('landing.appMock.exportMd')}</a>
              <a className={`${appBtnCls} ${appBtnOutlineCls}`}>{t('landing.appMock.exportSave')}</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
