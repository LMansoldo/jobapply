import{j as w}from"./jsx-runtime-Z5uAzocK.js";import{B as j}from"./button-Sqhg_H5B.js";import{C as r}from"./colors-DIVxRCoz.js";import{B as C}from"./radius-D3pzAX1q.js";import{S as m}from"./shadows-BanYPHY4.js";import{F,a as P}from"./typography-CACM-JMF.js";import{S as d}from"./spacing-BssltnqB.js";import"./index-pP6CS22B.js";import"./_commonjsHelpers-Cpj98o6Y.js";import"./AntdIcon-CHU0j-dj.js";import"./CSSMotionList-AqyeqKqI.js";import"./index-CoFmL6N8.js";import"./compact-item-DP62HJAi.js";import"./reactNode-bk3iEYHd.js";function B({children:n,...i}){return w.jsx(j,{...i,children:n})}B.__docgenInfo={description:`Wrapper around Ant Design Button.
@param props - ButtonProps forwarded to AntButton`,methods:[],displayName:"Button",composes:["AntButtonProps"]};const a={fontFamily:P.body,fontWeight:F.semibold,borderRadius:C.full,padding:`0 ${d.lg}`,height:"4.0rem",cursor:"pointer",display:"inline-flex",alignItems:"center",justifyContent:"center",gap:d.xs,transition:"all 0.2s ease",border:"none",fontSize:"1.4rem"},V={primary:{...a,background:r.gradientTailorBtn,color:r.white,boxShadow:m.cta},ghost:{...a,background:"transparent",color:r.primaryDark,border:`1.5px solid ${r.primaryDark}`},"ghost-dark":{...a,background:"transparent",color:r.white,border:`1.5px solid ${r.white}`},"solid-white":{...a,background:r.white,color:r.primaryDark,boxShadow:m.sm}};function x({variant:n="primary",style:i,children:D,..._}){return w.jsx(B,{..._,style:{...V[n],...i},children:D})}x.__docgenInfo={description:"",methods:[],displayName:"DSButton",props:{variant:{required:!1,tsType:{name:"union",raw:"'primary' | 'ghost' | 'ghost-dark' | 'solid-white'",elements:[{name:"literal",value:"'primary'"},{name:"literal",value:"'ghost'"},{name:"literal",value:"'ghost-dark'"},{name:"literal",value:"'solid-white'"}]},description:"",defaultValue:{value:"'primary'",computed:!1}}},composes:["Omit"]};const H={title:"Design System/Primitives/DSButton",component:x},o={args:{variant:"primary",children:"Tailor My CV"}},t={args:{variant:"ghost",children:"Ver Detalhes"}},e={args:{variant:"ghost-dark",children:"Login"},parameters:{backgrounds:{default:"dark"}}},s={args:{variant:"solid-white",children:"Saiba mais"}};var p,l,c;o.parameters={...o.parameters,docs:{...(p=o.parameters)==null?void 0:p.docs,source:{originalSource:`{
  args: {
    variant: 'primary',
    children: 'Tailor My CV'
  }
}`,...(c=(l=o.parameters)==null?void 0:l.docs)==null?void 0:c.source}}};var u,h,g;t.parameters={...t.parameters,docs:{...(u=t.parameters)==null?void 0:u.docs,source:{originalSource:`{
  args: {
    variant: 'ghost',
    children: 'Ver Detalhes'
  }
}`,...(g=(h=t.parameters)==null?void 0:h.docs)==null?void 0:g.source}}};var y,f,S;e.parameters={...e.parameters,docs:{...(y=e.parameters)==null?void 0:y.docs,source:{originalSource:`{
  args: {
    variant: 'ghost-dark',
    children: 'Login'
  },
  parameters: {
    backgrounds: {
      default: 'dark'
    }
  }
}`,...(S=(f=e.parameters)==null?void 0:f.docs)==null?void 0:S.source}}};var k,b,v;s.parameters={...s.parameters,docs:{...(k=s.parameters)==null?void 0:k.docs,source:{originalSource:`{
  args: {
    variant: 'solid-white',
    children: 'Saiba mais'
  }
}`,...(v=(b=s.parameters)==null?void 0:b.docs)==null?void 0:v.source}}};const J=["Primary","Ghost","GhostDark","SolidWhite"];export{t as Ghost,e as GhostDark,o as Primary,s as SolidWhite,J as __namedExportsOrder,H as default};
