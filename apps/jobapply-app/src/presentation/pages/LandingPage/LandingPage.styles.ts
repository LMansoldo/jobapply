import { css, keyframes } from '@emotion/css'

export const tokens = {
  ink: '#0a0a12',
  brand: '#7c5cfc',
  fgSoft: 'rgba(10,10,18,.62)',
  line: 'rgba(10,10,18,.08)',
  bg: '#f2f2f5',
  glass: 'rgba(255,255,255,.72)',
  shSm: '0 4px 12px rgba(20,20,50,.06)',
  shMd: '0 16px 40px rgba(20,20,50,.10)',
  shLg: '0 32px 80px rgba(20,20,50,.14)',
  shDark: '0 12px 30px rgba(20,20,50,.22)',
  shBrand: '0 12px 30px rgba(124,92,252,.28)',
} as const

const font = "'Lato','Verdana',sans-serif"
const mono = "'JetBrains Mono',monospace"

// motion only when user allows it
const auroraDrift = keyframes`0%{transform:translate3d(-8%,-6%,0) rotate(0) scale(1.1)}33%{transform:translate3d(6%,-2%,0) rotate(40deg) scale(1.25)}66%{transform:translate3d(-4%,8%,0) rotate(-25deg) scale(1.15)}100%{transform:translate3d(-8%,-6%,0) rotate(0) scale(1.1)}`
const auroraDrift2 = keyframes`0%{transform:translate3d(10%,8%,0) rotate(0) scale(1)}50%{transform:translate3d(-12%,-4%,0) rotate(80deg) scale(1.3)}100%{transform:translate3d(10%,8%,0) rotate(0) scale(1)}`
const fadeUp = keyframes`from{opacity:0;transform:translateY(28px);filter:blur(6px)}to{opacity:1;transform:translateY(0);filter:blur(0)}`
/** Hero: visible immediately, subtle slide-up only (no opacity flash) */
const heroSlideUp = keyframes`from{transform:translateY(28px);filter:blur(6px)}to{transform:translateY(0);filter:blur(0)}`
export const scoreCountKeyframe = keyframes`from{stroke-dashoffset:283}to{stroke-dashoffset:26}`

const mm = '@media (prefers-reduced-motion: no-preference)'

export const revealInClass = 'in'
export const fadeInCls = css`opacity:0;&.in{${mm}{animation:${fadeUp} 1.1s cubic-bezier(.2,.7,.2,1) forwards}}@media (prefers-reduced-motion: reduce){opacity:1}`
/** Hero elements: visible immediately (opacity:1), animate slide-up only when .in is added */
export const heroFadeInCls = css`opacity:1;&.in{${mm}{animation:${heroSlideUp} 1.1s cubic-bezier(.2,.7,.2,1) forwards}}`

export const auroraCls = css`position:absolute;top:0;left:0;right:0;height:100%;overflow:hidden;pointer-events:none;z-index:0`
const blob = `position:absolute;border-radius:50%`
export const auroraBlob1Cls = css`${blob};top:-8%;left:-18%;width:70vw;height:70vw;background:radial-gradient(closest-side,rgba(139,92,246,.5),rgba(139,92,246,0) 70%);filter:blur(90px);${mm}{animation:${auroraDrift} 22s ease-in-out infinite}`
export const auroraBlob2Cls = css`${blob};top:4%;right:-22%;width:65vw;height:65vw;background:radial-gradient(closest-side,rgba(34,211,238,.42),rgba(34,211,238,0) 70%);filter:blur(100px);${mm}{animation:${auroraDrift2} 28s ease-in-out infinite}`
export const auroraBlob3Cls = css`${blob};top:42%;left:12%;width:60vw;height:60vw;background:radial-gradient(closest-side,rgba(236,72,153,.3),rgba(236,72,153,0) 70%);filter:blur(120px);${mm}{animation:${auroraDrift} 34s ease-in-out infinite reverse}`
export const auroraBlob4Cls = css`${blob};top:66%;right:4%;width:55vw;height:55vw;background:radial-gradient(closest-side,rgba(74,222,128,.28),rgba(74,222,128,0) 70%);filter:blur(120px);${mm}{animation:${auroraDrift2} 40s ease-in-out infinite}`
export const auroraVeilCls = css`position:absolute;inset:0;background:linear-gradient(180deg,rgba(242,242,245,.4) 0%,rgba(242,242,245,.55) 45%,rgba(242,242,245,.9) 100%)`

export const sectionCls = css`position:relative;z-index:5;max-width:1440px;margin:0 auto;padding:120px 48px 60px;@media (max-width:640px){padding-left:22px;padding-right:22px}`
export const sectionHeroCls = css`${sectionCls};padding:150px 48px 100px;@media (max-width:640px){padding-left:22px;padding-right:22px}`
export const sectionStepsCls = css`${sectionCls};padding:120px 48px 100px;@media (max-width:640px){padding-left:22px;padding-right:22px}`
export const sectionCtaCls = css`${sectionCls};padding:60px 48px 160px;@media (max-width:640px){padding-left:22px;padding-right:22px}`
/** Below-fold sections: defer rendering until scrolled into view */
export const sectionBelowFoldCls = css`${sectionCls};content-visibility:auto;contain-intrinsic-size:auto 600px`
export const sectionStepsBelowFoldCls = css`${sectionStepsCls};content-visibility:auto;contain-intrinsic-size:auto 500px`
export const sectionCtaBelowFoldCls = css`${sectionCtaCls};content-visibility:auto;contain-intrinsic-size:auto 400px`

export const monoCls = css`font-family:${mono}`

const btn = `font-family:${font};font-weight:700;border-radius:999px;white-space:nowrap;text-align:center;display:inline-block;cursor:pointer;text-decoration:none`
const btnDark = `${btn};background:${tokens.ink};color:#fff;box-shadow:${tokens.shDark}`
const btnGhost = `${btn};background:rgba(255,255,255,.7);backdrop-filter:blur(20px);border:1px solid rgba(255,255,255,.8);color:${tokens.ink};box-shadow:${tokens.shSm}`
export const btnDarkMdCls = css`${btnDark};padding:10px 18px;font-size:14px`
export const btnDarkLgCls = css`${btnDark};padding:18px 26px;font-size:16px`
export const btnDarkXlCls = css`${btnDark};padding:20px 32px;font-size:16px`
export const btnGhostLgCls = css`${btnGhost};padding:18px 26px;font-size:16px`

export const displayCls = css`font-family:${font};font-weight:900;font-size:clamp(56px,9.5vw,148px);line-height:.92;letter-spacing:-.045em;margin:0;color:${tokens.ink}`
export const headingCls = css`font-family:${font};font-weight:900;font-size:clamp(48px,6.5vw,100px);line-height:.94;letter-spacing:-.035em;margin:0;color:${tokens.ink}`
export const headingCtaCls = css`${headingCls};font-size:clamp(56px,8vw,124px);line-height:.92;letter-spacing:-.045em`
export const accentCls = css`background:linear-gradient(120deg,#8b5cf6 0%,#06b6d4 55%,#ec4899 100%);-webkit-background-clip:text;background-clip:text;color:transparent`
export const accentCyanCls = css`background:linear-gradient(120deg,#8b5cf6,#06b6d4);-webkit-background-clip:text;background-clip:text;color:transparent`
export const accentPinkCls = css`background:linear-gradient(120deg,#8b5cf6,#ec4899);-webkit-background-clip:text;background-clip:text;color:transparent`
export const leadCls = css`font-size:20px;line-height:1.5;color:${tokens.fgSoft};margin:0;max-width:580px`
export const leadSmCls = css`font-size:18px;line-height:1.55;max-width:640px;color:rgba(10,10,18,.6)`

export const glassCls = css`background:${tokens.glass};backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);border:1px solid rgba(255,255,255,.8);box-shadow:${tokens.shMd},inset 0 1px 0 rgba(255,255,255,.9)`
export const panelCls = css`background:rgba(255,255,255,.7);backdrop-filter:blur(30px);-webkit-backdrop-filter:blur(30px);border:1px solid rgba(255,255,255,.85);box-shadow:${tokens.shLg},inset 0 1px 0 rgba(255,255,255,.9);border-radius:32px`
export const cardWhiteCls = css`background:#fff;border:1px solid ${tokens.line};box-shadow:${tokens.shLg},inset 0 1px 0 rgba(255,255,255,.9);border-radius:20px;overflow:hidden`
export const chipCls = css`font-size:12px;padding:5px 12px;border-radius:999px;border:1px solid rgba(10,10,18,.12);color:rgba(10,10,18,.6)`

export const topbarCls = css`position:fixed;top:0;left:0;right:0;z-index:50;background:rgba(255,255,255,.72);backdrop-filter:blur(24px) saturate(160%);-webkit-backdrop-filter:blur(24px) saturate(160%);border-bottom:1px solid rgba(10,10,18,.08);box-shadow:0 1px 20px rgba(20,20,50,.06)`
export const topbarBarCls = css`display:flex;align-items:center;justify-content:space-between;gap:24px;max-width:1440px;margin:0 auto;padding:16px 48px;@media (max-width:640px){padding:14px 22px}`

export const ringCls = css`position:relative;width:150px;height:150px;margin:0 auto;& svg{width:100%;height:100%;transform:rotate(-90deg)}`
export const ringSmCls = css`position:relative;width:100%;aspect-ratio:1;max-width:150px;margin:0 auto;& svg{width:100%;height:100%;transform:rotate(-90deg)}`
export const barCls = css`height:8px;border-radius:8px;background:rgba(10,10,18,.06);overflow:hidden`
export const barSmCls = css`height:4px;border-radius:8px;background:rgba(10,10,18,.06);overflow:hidden`
export const barFillCls = css`height:100%;background:linear-gradient(90deg,#7c5cfc,#c4b5fd);border-radius:8px`
export const barFillCyanCls = css`height:100%;background:linear-gradient(90deg,#8b5cf6,#06b6d4);border-radius:8px`
