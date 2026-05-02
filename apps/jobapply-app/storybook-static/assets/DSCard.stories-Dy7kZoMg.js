import{j as r}from"./jsx-runtime-Z5uAzocK.js";import{r as w}from"./index-pP6CS22B.js";import{C as s}from"./colors-DIVxRCoz.js";import{B as j}from"./radius-D3pzAX1q.js";import{S as g}from"./shadows-BanYPHY4.js";import{S as c}from"./spacing-BssltnqB.js";import{L as R,F as T,a as q}from"./typography-CACM-JMF.js";import"./_commonjsHelpers-Cpj98o6Y.js";const e={card:{background:s.white,borderRadius:j.base,border:`1px solid ${s.surfaceBorder}`,boxShadow:g.sm,padding:c.lg,transition:"box-shadow 0.2s ease"},cardHoverable:{cursor:"pointer"},header:{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:c.md},title:{fontFamily:q.heading,fontWeight:T.semibold,fontSize:"1.1rem",letterSpacing:R.label,textTransform:"uppercase",color:s.textSub}};function h({title:a,extra:n,children:b,hoverable:i,style:y,className:v,onClick:x}){const[C,d]=w.useState(!1);return r.jsxs("div",{className:v,style:{...e.card,...i?e.cardHoverable:{},boxShadow:i&&C?g.md:e.card.boxShadow,...y},onClick:x,onMouseEnter:()=>d(!0),onMouseLeave:()=>d(!1),children:[(a||n)&&r.jsxs("div",{style:e.header,children:[a&&r.jsx("span",{style:e.title,children:a}),n]}),b]})}h.__docgenInfo={description:"",methods:[],displayName:"DSCard",props:{title:{required:!1,tsType:{name:"ReactNode"},description:""},extra:{required:!1,tsType:{name:"ReactNode"},description:""},children:{required:!0,tsType:{name:"ReactNode"},description:""},hoverable:{required:!1,tsType:{name:"boolean"},description:""},style:{required:!1,tsType:{name:"ReactCSSProperties",raw:"React.CSSProperties"},description:""},className:{required:!1,tsType:{name:"string"},description:""},onClick:{required:!1,tsType:{name:"signature",type:"function",raw:"() => void",signature:{arguments:[],return:{name:"void"}}},description:""}}};const I={title:"Design System/Primitives/DSCard",component:h},o={args:{title:"Seção",children:r.jsx("p",{style:{margin:0,fontSize:14,color:"#6b7280"},children:"Conteúdo do card."})}},t={args:{title:"Card Interativo",hoverable:!0,children:r.jsx("p",{style:{margin:0,fontSize:14,color:"#6b7280"},children:"Passe o mouse para ver o hover."})}};var l,p,m;o.parameters={...o.parameters,docs:{...(l=o.parameters)==null?void 0:l.docs,source:{originalSource:`{
  args: {
    title: 'Seção',
    children: <p style={{
      margin: 0,
      fontSize: 14,
      color: '#6b7280'
    }}>Conteúdo do card.</p>
  }
}`,...(m=(p=o.parameters)==null?void 0:p.docs)==null?void 0:m.source}}};var u,f,S;t.parameters={...t.parameters,docs:{...(u=t.parameters)==null?void 0:u.docs,source:{originalSource:`{
  args: {
    title: 'Card Interativo',
    hoverable: true,
    children: <p style={{
      margin: 0,
      fontSize: 14,
      color: '#6b7280'
    }}>Passe o mouse para ver o hover.</p>
  }
}`,...(S=(f=t.parameters)==null?void 0:f.docs)==null?void 0:S.source}}};const _=["Default","Hoverable"];export{o as Default,t as Hoverable,_ as __namedExportsOrder,I as default};
