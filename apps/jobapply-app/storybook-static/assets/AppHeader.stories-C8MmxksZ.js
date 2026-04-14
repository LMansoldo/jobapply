import{j as t}from"./jsx-runtime-Z5uAzocK.js";import{C as r}from"./colors-DIVxRCoz.js";import{S as v}from"./shadows-BanYPHY4.js";import{F as l,a as p}from"./typography-CACM-JMF.js";import{S as e}from"./spacing-BssltnqB.js";import{u as S}from"./useTranslation-oUtoUx8t.js";import"./index-pP6CS22B.js";import"./_commonjsHelpers-Cpj98o6Y.js";import"./i18nInstance-CVCyxaL8.js";const a={header:{position:"sticky",top:0,zIndex:100,background:r.white,boxShadow:v.sm,height:"6rem",display:"flex",alignItems:"center",padding:`0 ${e.lg}`,gap:e.lg},logo:{fontFamily:p.heading,fontWeight:l.bold,fontSize:"2.0rem",color:r.primaryDark,textDecoration:"none",marginRight:e.lg,flexShrink:0},nav:{display:"flex",alignItems:"center",gap:e.md,flex:1},navLink:{fontFamily:p.body,fontWeight:l.medium,fontSize:"1.4rem",color:r.textSub,textDecoration:"none",padding:`${e.xs} ${e.sm}`,borderRadius:"6px",transition:"color 0.15s, background 0.15s"},navLinkActive:{color:r.primaryDark,background:r.primaryLight},right:{marginLeft:"auto",display:"flex",alignItems:"center",gap:e.sm}};function y({navItems:i=[],rightSlot:u,logoText:b}){const{t:x}=S();return t.jsxs("header",{style:a.header,children:[t.jsx("a",{href:"/",style:a.logo,children:b??x("app.name")}),i.length>0&&t.jsx("nav",{style:a.nav,children:i.map(o=>t.jsx("a",{href:o.href??"#",style:{...a.navLink,...o.active?a.navLinkActive:{}},children:o.label},o.key))}),t.jsx("div",{style:a.right,children:u})]})}y.__docgenInfo={description:"",methods:[],displayName:"AppHeader",props:{navItems:{required:!1,tsType:{name:"Array",elements:[{name:"NavItem"}],raw:"NavItem[]"},description:"",defaultValue:{value:"[]",computed:!1}},rightSlot:{required:!1,tsType:{name:"ReactNode"},description:""},logoText:{required:!1,tsType:{name:"string"},description:""}}};const R={title:"Design System/Layout/AppHeader",component:y,parameters:{layout:"fullscreen"}},n={args:{logoText:"JobApply",navItems:[{key:"jobs",label:"Vagas",href:"/jobs",active:!0},{key:"cv",label:"Meu CV",href:"/cv"}]}},s={args:{logoText:"JobApply",navItems:[{key:"jobs",label:"Vagas",href:"/jobs"}],rightSlot:t.jsx("span",{style:{fontSize:"1.4rem"},children:"Lucas M."})}};var m,c,d;n.parameters={...n.parameters,docs:{...(m=n.parameters)==null?void 0:m.docs,source:{originalSource:`{
  args: {
    logoText: 'JobApply',
    navItems: [{
      key: 'jobs',
      label: 'Vagas',
      href: '/jobs',
      active: true
    }, {
      key: 'cv',
      label: 'Meu CV',
      href: '/cv'
    }]
  }
}`,...(d=(c=n.parameters)==null?void 0:c.docs)==null?void 0:d.source}}};var g,h,f;s.parameters={...s.parameters,docs:{...(g=s.parameters)==null?void 0:g.docs,source:{originalSource:`{
  args: {
    logoText: 'JobApply',
    navItems: [{
      key: 'jobs',
      label: 'Vagas',
      href: '/jobs'
    }],
    rightSlot: <span style={{
      fontSize: '1.4rem'
    }}>Lucas M.</span>
  }
}`,...(f=(h=s.parameters)==null?void 0:h.docs)==null?void 0:f.source}}};const z=["Default","WithRightSlot"];export{n as Default,s as WithRightSlot,z as __namedExportsOrder,R as default};
