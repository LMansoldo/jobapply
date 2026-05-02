import{j as g}from"./jsx-runtime-Z5uAzocK.js";import{C as e}from"./colors-DIVxRCoz.js";import{B as f}from"./radius-D3pzAX1q.js";import{F as v}from"./typography-CACM-JMF.js";import{S as a}from"./spacing-BssltnqB.js";import"./index-pP6CS22B.js";import"./_commonjsHelpers-Cpj98o6Y.js";const s={display:"inline-flex",alignItems:"center",padding:`${a.xxs} ${a.xs}`,borderRadius:f.full,fontSize:"1.1rem",fontWeight:v.medium,lineHeight:1},h={success:{...s,background:e.greenBg,color:e.green},warning:{...s,background:e.warningBg,color:e.warning}};function l({variant:u="success",children:p}){return g.jsx("span",{style:h[u],children:p})}l.__docgenInfo={description:"",methods:[],displayName:"InlineBadge",props:{variant:{required:!1,tsType:{name:"union",raw:"'success' | 'warning'",elements:[{name:"literal",value:"'success'"},{name:"literal",value:"'warning'"}]},description:"",defaultValue:{value:"'success'",computed:!1}},children:{required:!0,tsType:{name:"ReactReactNode",raw:"React.ReactNode"},description:""}}};const b={title:"Design System/Primitives/InlineBadge",component:l},r={args:{variant:"success",children:"Aprovado"}},n={args:{variant:"warning",children:"Pendente"}};var t,i,o;r.parameters={...r.parameters,docs:{...(t=r.parameters)==null?void 0:t.docs,source:{originalSource:`{
  args: {
    variant: 'success',
    children: 'Aprovado'
  }
}`,...(o=(i=r.parameters)==null?void 0:i.docs)==null?void 0:o.source}}};var c,d,m;n.parameters={...n.parameters,docs:{...(c=n.parameters)==null?void 0:c.docs,source:{originalSource:`{
  args: {
    variant: 'warning',
    children: 'Pendente'
  }
}`,...(m=(d=n.parameters)==null?void 0:d.docs)==null?void 0:m.source}}};const W=["Success","Warning"];export{r as Success,n as Warning,W as __namedExportsOrder,b as default};
