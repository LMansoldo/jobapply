import{j as e}from"./jsx-runtime-Z5uAzocK.js";import{C as a}from"./colors-DIVxRCoz.js";import{B as u}from"./radius-D3pzAX1q.js";import{S as f}from"./shadows-BanYPHY4.js";import{S as s}from"./spacing-BssltnqB.js";import{F as y,a as b}from"./typography-CACM-JMF.js";import"./index-pP6CS22B.js";import"./_commonjsHelpers-Cpj98o6Y.js";const d={card:{background:a.white,borderRadius:u.base,boxShadow:f.sm,overflow:"hidden"},header:{padding:`${s.md} ${s.lg}`,borderBottom:`1px solid ${a.surfaceBorder}`,fontFamily:b.heading,fontWeight:y.semibold,fontSize:"1.5rem",color:a.textMain},body:{padding:s.lg}};function h({header:i,children:g}){return e.jsxs("div",{style:d.card,children:[i&&e.jsx("div",{style:d.header,children:i}),e.jsx("div",{style:d.body,children:g})]})}h.__docgenInfo={description:"",methods:[],displayName:"WizardCard",props:{header:{required:!1,tsType:{name:"ReactNode"},description:""},children:{required:!0,tsType:{name:"ReactNode"},description:""}}};const R={title:"Design System/CV/WizardCard",component:h},r={args:{header:"Dados Pessoais",children:e.jsx("p",{style:{margin:0,fontSize:14,color:"#6b7280"},children:"Formulário aqui"})}},o={args:{children:e.jsx("p",{style:{margin:0,fontSize:14,color:"#6b7280"},children:"Conteúdo sem cabeçalho"})}};var n,t,c;r.parameters={...r.parameters,docs:{...(n=r.parameters)==null?void 0:n.docs,source:{originalSource:`{
  args: {
    header: 'Dados Pessoais',
    children: <p style={{
      margin: 0,
      fontSize: 14,
      color: '#6b7280'
    }}>Formulário aqui</p>
  }
}`,...(c=(t=r.parameters)==null?void 0:t.docs)==null?void 0:c.source}}};var m,l,p;o.parameters={...o.parameters,docs:{...(m=o.parameters)==null?void 0:m.docs,source:{originalSource:`{
  args: {
    children: <p style={{
      margin: 0,
      fontSize: 14,
      color: '#6b7280'
    }}>Conteúdo sem cabeçalho</p>
  }
}`,...(p=(l=o.parameters)==null?void 0:l.docs)==null?void 0:p.source}}};const q=["WithHeader","NoHeader"];export{o as NoHeader,r as WithHeader,q as __namedExportsOrder,R as default};
