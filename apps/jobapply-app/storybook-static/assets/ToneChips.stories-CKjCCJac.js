import{j as i}from"./jsx-runtime-Z5uAzocK.js";import{r as m}from"./index-pP6CS22B.js";import{C as e}from"./colors-DIVxRCoz.js";import{B as y}from"./radius-D3pzAX1q.js";import{F as f}from"./typography-CACM-JMF.js";import{S as s}from"./spacing-BssltnqB.js";import"./_commonjsHelpers-Cpj98o6Y.js";const a={group:{display:"flex",flexWrap:"wrap",gap:s.xs},chip:{padding:`${s.xxs} ${s.md}`,borderRadius:y.full,fontSize:"1.3rem",fontWeight:f.medium,border:`1px solid ${e.surfaceBorder}`,background:e.white,color:e.textSub,cursor:"pointer",transition:"background 0.15s, color 0.15s, border-color 0.15s"},chipActive:{background:e.primaryDark,color:e.white,borderColor:e.primaryDark}};function l({options:n,value:t,onChange:d}){return i.jsx("div",{style:a.group,children:n.map(r=>i.jsx("button",{type:"button",style:{...a.chip,...r.key===t?a.chipActive:{}},onClick:()=>d(r.key),children:r.label},r.key))})}l.__docgenInfo={description:"",methods:[],displayName:"ToneChips",props:{options:{required:!0,tsType:{name:"Array",elements:[{name:"ToneOption"}],raw:"ToneOption[]"},description:""},value:{required:!0,tsType:{name:"string"},description:""},onChange:{required:!0,tsType:{name:"signature",type:"function",raw:"(key: string) => void",signature:{arguments:[{type:{name:"string"},name:"key"}],return:{name:"void"}}},description:""}}};const T={title:"Design System/ATS/ToneChips",component:l},o={render:()=>{const[n,t]=m.useState("professional");return i.jsx(l,{options:[{key:"professional",label:"Profissional"},{key:"casual",label:"Casual"},{key:"executive",label:"Executivo"},{key:"creative",label:"Criativo"}],value:n,onChange:t})}};var p,u,c;o.parameters={...o.parameters,docs:{...(p=o.parameters)==null?void 0:p.docs,source:{originalSource:`{
  render: () => {
    const [tone, setTone] = useState('professional');
    return <ToneChips options={[{
      key: 'professional',
      label: 'Profissional'
    }, {
      key: 'casual',
      label: 'Casual'
    }, {
      key: 'executive',
      label: 'Executivo'
    }, {
      key: 'creative',
      label: 'Criativo'
    }]} value={tone} onChange={setTone} />;
  }
}`,...(c=(u=o.parameters)==null?void 0:u.docs)==null?void 0:c.source}}};const S=["Default"];export{o as Default,S as __namedExportsOrder,T as default};
