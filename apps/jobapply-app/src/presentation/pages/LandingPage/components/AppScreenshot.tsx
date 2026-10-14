import { useTranslation } from 'react-i18next'
import styled from '@emotion/styled'
import { CardWhite, Ring, Bar, Chip, monoFont, tokens } from '../LandingPage.styles'
import { atsList, categories, minimap } from '../data'
import { TopbarLeft, ToolBold, ToolItalic, EditorMinirow, StatusLang, CatBarFill } from './AppScreenshot.styles'

// ---------- app__topbar ----------
const AppTopbar = styled.div`display:flex;align-items:center;justify-content:space-between;padding:12px 24px;border-bottom:1px solid rgba(10,10,18,.07);background:#fff`
const AppBrand = styled.span`font-family:'Lato',sans-serif;font-weight:900;font-size:20px;letter-spacing:-.02em`
const AppBrandDo = styled.span`color:${tokens.ink}`
const AppBrandJob = styled.span`color:${tokens.brand}`
const AppTabs = styled.div`display:flex;align-items:center;gap:8px;@media (max-width:640px){display:none}`
const AppTabLabel = styled.span`font-size:11px;color:rgba(10,10,18,.5)`
const AppTabIco = styled.div`width:16px;height:16px;display:flex;align-items:center;justify-content:center;color:rgba(10,10,18,.5)`
const AppTab = styled.div`display:flex;flex-direction:column;align-items:center;gap:3px;padding:8px 14px;border-radius:10px`
const AppTabActive = styled(AppTab)`
  background:rgba(124,92,252,.1);
  & ${AppTabLabel}{color:${tokens.brand};font-weight:700}
  & ${AppTabIco}{color:${tokens.brand}}
`
const AppUser = styled.div`display:flex;align-items:center;gap:10px;padding:5px 12px 5px 5px;border-radius:999px;border:1px solid ${tokens.line}`
const AppAvatar = styled.div`width:28px;height:28px;border-radius:999px;background:linear-gradient(135deg,#7c5cfc,#a78bfa)`
const AppUserName = styled.span`font-size:13px;color:${tokens.ink};font-weight:700`

// ---------- app__sub ----------
const AppSub = styled.div`display:flex;align-items:center;justify-content:space-between;padding:14px 24px;border-bottom:1px solid rgba(10,10,18,.07);background:#fafafb;@media (max-width:640px){flex-direction:column;align-items:flex-start;gap:8px}`
const AppSubLeft = styled.div`display:flex;align-items:center;gap:20px`
const AppSubNew = styled.div`display:flex;align-items:center;gap:6px;color:${tokens.brand};font-size:13px;font-weight:700`
const AppSubNewSpinner = styled.span`display:inline-block;width:13px;height:13px;border:1.6px solid #7c5cfc;border-top-color:transparent;border-radius:999px`
const AppSubTitle = styled.div`font-size:14px;font-weight:700;color:${tokens.ink}`
const AppSubDesc = styled.div`font-size:11px;color:rgba(10,10,18,.45)`
const AppMode = styled.div`display:flex;align-items:center;gap:7px;font-size:12px;color:#16a34a`
const Dot = styled.span`width:7px;height:7px;border-radius:999px;background:#16a34a`

// ---------- app__ats ----------
const AppAts = styled.div`display:flex;align-items:center;flex-wrap:wrap;gap:8px;padding:12px 24px;border-bottom:1px solid rgba(10,10,18,.07);background:#fafafb`
const AppAtsLabel = styled.span`font-size:12px;color:rgba(10,10,18,.4);margin-right:2px`

// ---------- app__split ----------
const AppSplit = styled.div`display:grid;grid-template-columns:1.55fr 1fr;gap:0;background:#f4f4f7;padding:20px;align-items:start;@media (max-width:900px){grid-template-columns:1fr;gap:20px}`

// ---------- editor (dark markdown editor) ----------
const Editor = styled.div`border-radius:12px;overflow:hidden;background:#12152a;box-shadow:${tokens.shMd}`
const EditorToolbar = styled.div`display:flex;align-items:center;gap:18px;padding:10px 14px;border-bottom:1px solid rgba(255,255,255,.08)`
const EditorMenu = styled.span`font-size:12px;color:rgba(255,255,255,.75)`
const EditorTools = styled.div`display:flex;align-items:center;gap:12px;margin-left:8px;color:rgba(255,255,255,.55);font-size:12px;font-weight:700`
const EditorDivider = styled.span`width:1px;height:12px;background:rgba(255,255,255,.15)`
const EditorGrid = styled.div`display:grid;grid-template-columns:1fr 54px;gap:0`
const EditorBody = styled.div`padding:18px 16px;font-family:${monoFont};font-size:11px;line-height:1.75;min-height:340px`
const EditorMinimap = styled.div`border-left:1px solid rgba(255,255,255,.08);padding:14px 8px;display:flex;flex-direction:column;gap:3px;opacity:.5`
const EditorStatus = styled.div`display:flex;align-items:center;gap:16px;padding:8px 14px;border-top:1px solid rgba(255,255,255,.08);font-family:${monoFont};font-size:10px;color:rgba(255,255,255,.4)`
// markdown syntax coloring
const MdH = styled.div`color:#5ed4c4`
const MdP = styled.div`color:#c8cdd8`
const MdStrong = styled.span`color:#fff;font-weight:700`
const MdSub = styled.div`color:#8ea0d8`
const MdGap = styled.div`height:10px`
const MdGapSm = styled.div`height:6px`

// ---------- score panel ----------
const Score = styled.div`display:flex;flex-direction:column;gap:18px;padding:0 0 0 20px;@media (max-width:900px){padding:0}`
const ScoreBanner = styled.div`display:flex;align-items:center;justify-content:space-between;padding:12px 16px;border-radius:10px;background:rgba(22,163,74,.1);border:1px solid rgba(22,163,74,.2)`
const ScoreBannerTxt = styled.span`font-size:13px;color:${tokens.ink};font-weight:700`
const ScoreBannerBadge = styled.span`font-size:11px;padding:3px 9px;border-radius:999px;background:#16a34a;color:#fff;font-weight:700`
const RingWrap = styled.div`text-align:center;padding:6px 0`
const RingCenter = styled.div`position:absolute;inset:0;display:grid;place-items:center;text-align:center`
const RingValue = styled.div`font-family:'Lato',sans-serif;font-weight:900;font-size:40px;line-height:1;color:${tokens.brand}`
const RingUnit = styled.div`font-size:12px;color:rgba(10,10,18,.4)`
const ScoreLabel = styled.div`font-size:13px;color:rgba(10,10,18,.55);margin-top:6px;text-align:center`
const CatsTitle = styled.div`font-size:12px;letter-spacing:.06em;text-transform:uppercase;color:rgba(10,10,18,.55);font-weight:700;margin-bottom:14px`
const CatsList = styled.div`display:flex;flex-direction:column;gap:14px`
const CatName = styled.div`font-size:13px;color:${tokens.ink};margin-bottom:6px`
const Export = styled.div`border-top:1px solid ${tokens.line};padding-top:16px`
const ExportTitle = styled.div`font-size:11px;letter-spacing:.06em;text-transform:uppercase;color:rgba(10,10,18,.45);font-weight:700;margin-bottom:12px`
const ExportList = styled.div`display:flex;flex-direction:column;gap:10px`
const AppBtn = styled.a`text-align:center;padding:13px;border-radius:10px;font-size:13px;font-weight:700`
const AppBtnPrimary = styled(AppBtn)`background:${tokens.brand};color:#fff;box-shadow:${tokens.shBrand}`
const AppBtnOutline = styled(AppBtn)`background:#fff;color:${tokens.brand};border:1px solid rgba(124,92,252,.4)`

/** Splits a `**bold:** rest` markdown-ish line so the bold prefix can be rendered distinctly, like the mock's separate `md-strong` span. */
function MdSkillLine({ text }: { text: string }) {
  const match = /^\*\*(.+?)\*\*(.*)$/.exec(text)
  if (!match) return <>{text}</>
  return (
    <>
      <MdStrong>**{match[1]}**</MdStrong>
      {match[2]}
    </>
  )
}

export default function AppScreenshot() {
  const { t } = useTranslation()

  return (
    <CardWhite>
      <AppTopbar>
        <TopbarLeft>
          <AppBrand>
            <AppBrandDo>do</AppBrandDo>
            <AppBrandJob>job</AppBrandJob>
          </AppBrand>
          <AppTabs>
            <AppTabActive>
              <AppTabIco aria-hidden="true">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 20h9" />
                  <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
                </svg>
              </AppTabIco>
              <AppTabLabel>{t('landing.appMock.tabTailoring')}</AppTabLabel>
            </AppTabActive>
            <AppTab>
              <AppTabIco aria-hidden="true">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M4.98 3.5A2.5 2.5 0 1 0 5 8.5a2.5 2.5 0 0 0-.02-5ZM3 9h4v12H3zm6 0h3.8v1.7h.05c.53-1 1.83-2.05 3.77-2.05C20.3 8.65 21 10.9 21 14v7h-4v-6.2c0-1.48-.03-3.38-2.06-3.38-2.06 0-2.38 1.6-2.38 3.27V21H9z" />
                </svg>
              </AppTabIco>
              <AppTabLabel>{t('landing.appMock.tabLinkedin')}</AppTabLabel>
            </AppTab>
            <AppTab>
              <AppTabIco aria-hidden="true">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="8" r="4" />
                  <path d="M4 21c0-4 4-6 8-6s8 2 8 6" />
                </svg>
              </AppTabIco>
              <AppTabLabel>{t('landing.appMock.tabProfile')}</AppTabLabel>
            </AppTab>
            </AppTabs>
          </TopbarLeft>
        <AppUser>
          <AppAvatar aria-hidden="true" />
          <AppUserName>Lucas</AppUserName>
        </AppUser>
      </AppTopbar>

      <AppSub>
        <AppSubLeft>
          <AppSubNew>
            <AppSubNewSpinner aria-hidden="true" />
            {t('landing.appMock.newAnalysis')}
          </AppSubNew>
          <div>
            <AppSubTitle>{t('landing.appMock.manualTitle')}</AppSubTitle>
            <AppSubDesc>{t('landing.appMock.manualDesc')}</AppSubDesc>
          </div>
        </AppSubLeft>
        <AppMode>
          <Dot aria-hidden="true" />
          {t('landing.appMock.manualMode')}
        </AppMode>
      </AppSub>

      <AppAts>
        <AppAtsLabel>{t('landing.appMock.atsLabel')}</AppAtsLabel>
        {atsList.map(a => <Chip key={a}>{a}</Chip>)}
      </AppAts>

      <AppSplit>
        <Editor>
          <EditorToolbar>
            <EditorMenu>{t('landing.appMock.editorFile')}</EditorMenu>
            <EditorMenu>{t('landing.appMock.editorExport')}</EditorMenu>
            <EditorTools>
              <ToolBold>B</ToolBold>
              <ToolItalic>I</ToolItalic>
              <span>H1</span>
              <span>H2</span>
              <span>H3</span>
              <EditorDivider />
              <span>≣</span>
              <span>⁝≣</span>
              <span>—</span>
              <span>↺</span>
              <span>↻</span>
              <span>👁</span>
            </EditorTools>
          </EditorToolbar>
          <EditorGrid>
            <EditorBody>
              <MdH>{t('landing.appMock.cvObjectiveH')}</MdH>
              <MdP>{t('landing.appMock.cvObjective')}</MdP>
              <MdGap />
              <MdH>{t('landing.appMock.cvSummaryH')}</MdH>
              <MdP>{t('landing.appMock.cvSummary')}</MdP>
              <MdGap />
              <MdH>{t('landing.appMock.cvSkillsH')}</MdH>
              <MdP><MdSkillLine text={t('landing.appMock.cvSkillsDesign')} /></MdP>
              <MdP><MdSkillLine text={t('landing.appMock.cvSkillsResearch')} /></MdP>
              <MdP><MdSkillLine text={t('landing.appMock.cvSkillsCollab')} /></MdP>
              <MdGap />
              <MdH>{t('landing.appMock.cvExpH')}</MdH>
              <MdGapSm />
              <MdSub>{t('landing.appMock.cvExpRole')}</MdSub>
              <MdStrong>{t('landing.appMock.cvExpDate')}</MdStrong>
            </EditorBody>
            <EditorMinimap aria-hidden="true">
              {minimap.map((w, i) => (
                <EditorMinirow key={i} $w={w} />
              ))}
            </EditorMinimap>
          </EditorGrid>
          <EditorStatus>
            <span>Markdown</span>
            <span>Ln 1, Col 1</span>
            <span>{t('landing.appMock.statusWords')}</span>
            <StatusLang>PT-BR</StatusLang>
          </EditorStatus>
        </Editor>

        <Score>
          <ScoreBanner>
            <ScoreBannerTxt>{t('landing.appMock.scoreBanner')}</ScoreBannerTxt>
            <ScoreBannerBadge>{t('landing.appMock.scoreBannerBadge')}</ScoreBannerBadge>
          </ScoreBanner>

          <RingWrap>
            <Ring>
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
              <RingCenter>
                <div>
                  <RingValue>30</RingValue>
                  <RingUnit>/100</RingUnit>
                </div>
              </RingCenter>
            </Ring>
            <ScoreLabel>{t('landing.appMock.scoreLabel')}</ScoreLabel>
          </RingWrap>

          <div>
            <CatsTitle>{t('landing.appMock.catsTitle')}</CatsTitle>
            <CatsList>
              {categories.map(c => (
                <div key={c.key}>
                  <CatName>{t(`landing.appMock.${c.key}`)}</CatName>
                  <Bar><CatBarFill $w={c.pct} /></Bar>
                </div>
              ))}
            </CatsList>
          </div>

          <Export>
            <ExportTitle>{t('landing.appMock.exportTitle')}</ExportTitle>
            <ExportList>
              <AppBtnPrimary>{t('landing.appMock.exportPdf')}</AppBtnPrimary>
              <AppBtnOutline>{t('landing.appMock.exportMd')}</AppBtnOutline>
              <AppBtnOutline>{t('landing.appMock.exportSave')}</AppBtnOutline>
            </ExportList>
          </Export>
        </Score>
      </AppSplit>
    </CardWhite>
  )
}
