import{j as n}from"./jsx-runtime-Z5uAzocK.js";import{r as y}from"./index-pP6CS22B.js";import{C as r}from"./colors-DIVxRCoz.js";import{B as g}from"./radius-D3pzAX1q.js";import{F as f}from"./typography-CACM-JMF.js";import{S as t}from"./spacing-BssltnqB.js";import"./_commonjsHelpers-Cpj98o6Y.js";const a={grid:{display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(10rem, 1fr))",gap:t.sm},card:{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:t.sm,padding:`${t.lg} ${t.md}`,borderRadius:g.lg,border:`1.5px solid ${r.surfaceBorder}`,background:r.white,cursor:"pointer",transition:"border-color 0.15s, background 0.15s",fontSize:"1.3rem",fontWeight:f.medium,color:r.textSub},cardActive:{background:r.primaryLight,borderColor:r.primaryDark,color:r.primaryDark},icon:{fontSize:"2.4rem"}};function d({roles:s,value:o,onChange:c}){return n.jsx("div",{style:a.grid,children:s.map(e=>n.jsxs("div",{style:{...a.card,...e.key===o?a.cardActive:{}},onClick:()=>c(e.key),role:"radio","aria-checked":e.key===o,tabIndex:0,onKeyDown:u=>u.key==="Enter"&&c(e.key),children:[n.jsx("span",{style:a.icon,children:e.icon}),n.jsx("span",{children:e.label})]},e.key))})}d.__docgenInfo={description:"",methods:[],displayName:"RoleCards",props:{roles:{required:!0,tsType:{name:"Array",elements:[{name:"RoleOption"}],raw:"RoleOption[]"},description:""},value:{required:!0,tsType:{name:"string"},description:""},onChange:{required:!0,tsType:{name:"signature",type:"function",raw:"(key: string) => void",signature:{arguments:[{type:{name:"string"},name:"key"}],return:{name:"void"}}},description:""}}};const j={title:"Design System/Auth/RoleCards",component:d},i={render:()=>{const[s,o]=y.useState("candidate");return n.jsx(d,{roles:[{key:"candidate",label:"Candidato",icon:"👤"},{key:"recruiter",label:"Recrutador",icon:"🔍"},{key:"company",label:"Empresa",icon:"🏢"}],value:s,onChange:o})}};var l,m,p;i.parameters={...i.parameters,docs:{...(l=i.parameters)==null?void 0:l.docs,source:{originalSource:`{
  render: () => {
    const [role, setRole] = useState('candidate');
    return <RoleCards roles={[{
      key: 'candidate',
      label: 'Candidato',
      icon: '👤'
    }, {
      key: 'recruiter',
      label: 'Recrutador',
      icon: '🔍'
    }, {
      key: 'company',
      label: 'Empresa',
      icon: '🏢'
    }]} value={role} onChange={setRole} />;
  }
}`,...(p=(m=i.parameters)==null?void 0:m.docs)==null?void 0:p.source}}};const v=["Default"];export{i as Default,v as __namedExportsOrder,j as default};
