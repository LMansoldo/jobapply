import{j as e}from"./jsx-runtime-Z5uAzocK.js";import{S as y}from"./ScoreRing-DSRWHk0s.js";import{P as f}from"./ProgressBar-DOAbWGxR.js";import{K as x}from"./KeywordItem-B7X6yaxX.js";import{C as o}from"./colors-DIVxRCoz.js";import{B as g}from"./radius-D3pzAX1q.js";import{S as w}from"./shadows-BanYPHY4.js";import{S as n}from"./spacing-BssltnqB.js";import{F as v,a as h}from"./typography-CACM-JMF.js";import{u as S}from"./useTranslation-oUtoUx8t.js";import"./index-pP6CS22B.js";import"./_commonjsHelpers-Cpj98o6Y.js";import"./AntdIcon-CHU0j-dj.js";import"./i18nInstance-CVCyxaL8.js";const s={panel:{background:o.white,borderRadius:g.base,boxShadow:w.sm,padding:n.lg,display:"flex",flexDirection:"column",gap:n.lg},scoreCenter:{display:"flex",justifyContent:"center"},sectionTitle:{fontFamily:h.heading,fontWeight:v.semibold,fontSize:"1.3rem",color:o.textSub,textTransform:"uppercase",letterSpacing:"0.8px",marginBottom:n.sm},keywordList:{display:"flex",flexDirection:"column",gap:"2px"},divider:{height:"1px",background:o.surfaceBorder}};function u({score:c,categories:i=[],keywords:l=[]}){const{t}=S();return e.jsxs("div",{style:s.panel,children:[e.jsx("div",{style:s.scoreCenter,children:e.jsx(y,{value:c,size:120,label:t("ats.score"),sublabel:"/100"})}),i.length>0&&e.jsxs("div",{children:[e.jsx("p",{style:s.sectionTitle,children:t("ats.breakdown")}),e.jsx("div",{style:{display:"flex",flexDirection:"column",gap:"1rem"},children:i.map(r=>e.jsx(f,{value:r.value,label:r.name},r.name))})]}),l.length>0&&e.jsxs(e.Fragment,{children:[e.jsx("div",{style:s.divider}),e.jsxs("div",{children:[e.jsx("p",{style:s.sectionTitle,children:t("ats.keywords")}),e.jsx("div",{style:s.keywordList,children:l.map(r=>e.jsx(x,{keyword:r.keyword,status:r.status},r.keyword))})]})]})]})}u.__docgenInfo={description:"",methods:[],displayName:"ATSPanel",props:{score:{required:!0,tsType:{name:"number"},description:""},categories:{required:!1,tsType:{name:"Array",elements:[{name:"ATSCategory"}],raw:"ATSCategory[]"},description:"",defaultValue:{value:"[]",computed:!1}},keywords:{required:!1,tsType:{name:"Array",elements:[{name:"ATSKeyword"}],raw:"ATSKeyword[]"},description:"",defaultValue:{value:"[]",computed:!1}}}};const _={title:"Design System/ATS/ATSPanel",component:u,parameters:{layout:"padded"}},a={args:{score:78,categories:[{name:"Palavras-chave",value:82},{name:"Formato",value:90},{name:"Experiência",value:65}],keywords:[{keyword:"React",status:"found"},{keyword:"TypeScript",status:"found"},{keyword:"Kubernetes",status:"missing"},{keyword:"CI/CD",status:"weak"}]}};var d,m,p;a.parameters={...a.parameters,docs:{...(d=a.parameters)==null?void 0:d.docs,source:{originalSource:`{
  args: {
    score: 78,
    categories: [{
      name: 'Palavras-chave',
      value: 82
    }, {
      name: 'Formato',
      value: 90
    }, {
      name: 'Experiência',
      value: 65
    }],
    keywords: [{
      keyword: 'React',
      status: 'found'
    }, {
      keyword: 'TypeScript',
      status: 'found'
    }, {
      keyword: 'Kubernetes',
      status: 'missing'
    }, {
      keyword: 'CI/CD',
      status: 'weak'
    }]
  }
}`,...(p=(m=a.parameters)==null?void 0:m.docs)==null?void 0:p.source}}};const q=["Default"];export{a as Default,q as __namedExportsOrder,_ as default};
