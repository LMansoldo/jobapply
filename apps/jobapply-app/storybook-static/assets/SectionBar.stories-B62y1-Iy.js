import{j as s}from"./jsx-runtime-Z5uAzocK.js";import{r as u}from"./index-pP6CS22B.js";import{C as e}from"./colors-DIVxRCoz.js";import{B as y}from"./radius-D3pzAX1q.js";import{F as b}from"./typography-CACM-JMF.js";import{S as t}from"./spacing-BssltnqB.js";import"./_commonjsHelpers-Cpj98o6Y.js";const i={bar:{display:"flex",gap:t.xs,overflowX:"auto",scrollbarWidth:"none",paddingBottom:t.xxs},chip:{padding:`${t.xxs} ${t.md}`,borderRadius:y.chip,fontSize:"1.3rem",fontWeight:b.medium,border:`1px solid ${e.surfaceBorder}`,background:e.white,color:e.textSub,cursor:"pointer",whiteSpace:"nowrap",transition:"background 0.15s, color 0.15s, border-color 0.15s",flexShrink:0},chipActive:{background:e.primaryLight,color:e.primaryDark,borderColor:e.primaryMid}};function c({sections:a,activeKey:n,onChange:m}){return s.jsx("div",{style:i.bar,children:a.map(r=>s.jsx("button",{type:"button",style:{...i.chip,...r.key===n?i.chipActive:{}},onClick:()=>m(r.key),children:r.label},r.key))})}c.__docgenInfo={description:"",methods:[],displayName:"SectionBar",props:{sections:{required:!0,tsType:{name:"Array",elements:[{name:"SectionItem"}],raw:"SectionItem[]"},description:""},activeKey:{required:!0,tsType:{name:"string"},description:""},onChange:{required:!0,tsType:{name:"signature",type:"function",raw:"(key: string) => void",signature:{arguments:[{type:{name:"string"},name:"key"}],return:{name:"void"}}},description:""}}};const B={title:"Design System/CV/SectionBar",component:c},o={render:()=>{const[a,n]=u.useState("personal");return s.jsx(c,{sections:[{key:"personal",label:"Dados Pessoais"},{key:"experience",label:"Experiência"},{key:"education",label:"Educação"},{key:"skills",label:"Habilidades"}],activeKey:a,onChange:n})}};var p,d,l;o.parameters={...o.parameters,docs:{...(p=o.parameters)==null?void 0:p.docs,source:{originalSource:`{
  render: () => {
    const [active, setActive] = useState('personal');
    return <SectionBar sections={[{
      key: 'personal',
      label: 'Dados Pessoais'
    }, {
      key: 'experience',
      label: 'Experiência'
    }, {
      key: 'education',
      label: 'Educação'
    }, {
      key: 'skills',
      label: 'Habilidades'
    }]} activeKey={active} onChange={setActive} />;
  }
}`,...(l=(d=o.parameters)==null?void 0:d.docs)==null?void 0:l.source}}};const C=["Default"];export{o as Default,C as __namedExportsOrder,B as default};
