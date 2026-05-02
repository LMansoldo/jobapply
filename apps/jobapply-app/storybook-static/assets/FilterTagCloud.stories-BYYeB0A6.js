import{j as i}from"./jsx-runtime-Z5uAzocK.js";import{r as b}from"./index-pP6CS22B.js";import{C as a}from"./colors-DIVxRCoz.js";import{B as f}from"./radius-D3pzAX1q.js";import{F as v}from"./typography-CACM-JMF.js";import{S as s}from"./spacing-BssltnqB.js";import"./_commonjsHelpers-Cpj98o6Y.js";const l={cloud:{display:"flex",flexWrap:"wrap",gap:s.xs},tag:{padding:`${s.xxs} ${s.sm}`,borderRadius:f.full,fontSize:"1.2rem",fontWeight:v.medium,border:`1px solid ${a.surfaceBorder}`,background:a.white,color:a.textSub,cursor:"pointer",transition:"background 0.15s, color 0.15s, border-color 0.15s"},tagActive:{background:a.primaryLight,color:a.primaryDark,borderColor:a.primaryMid}};function c({tags:r,onChange:o}){return i.jsx("div",{style:l.cloud,children:r.map(e=>i.jsx("button",{type:"button",style:{...l.tag,...e.active?l.tagActive:{}},onClick:()=>o(e.label,!e.active),children:e.label},e.label))})}c.__docgenInfo={description:"",methods:[],displayName:"FilterTagCloud",props:{tags:{required:!0,tsType:{name:"Array",elements:[{name:"FilterTag"}],raw:"FilterTag[]"},description:""},onChange:{required:!0,tsType:{name:"signature",type:"function",raw:"(label: string, active: boolean) => void",signature:{arguments:[{type:{name:"string"},name:"label"},{type:{name:"boolean"},name:"active"}],return:{name:"void"}}},description:""}}};const j={title:"Design System/Jobs/FilterTagCloud",component:c},t={render:()=>{const[r,o]=b.useState([{label:"React",active:!1},{label:"TypeScript",active:!0},{label:"Node.js",active:!1},{label:"Python",active:!1}]);return i.jsx(c,{tags:r,onChange:(e,u)=>o(g=>g.map(n=>n.label===e?{...n,active:u}:n))})}};var p,d,m;t.parameters={...t.parameters,docs:{...(p=t.parameters)==null?void 0:p.docs,source:{originalSource:`{
  render: () => {
    const [tags, setTags] = useState([{
      label: 'React',
      active: false
    }, {
      label: 'TypeScript',
      active: true
    }, {
      label: 'Node.js',
      active: false
    }, {
      label: 'Python',
      active: false
    }]);
    return <FilterTagCloud tags={tags} onChange={(label, active) => setTags(prev => prev.map(t => t.label === label ? {
      ...t,
      active
    } : t))} />;
  }
}`,...(m=(d=t.parameters)==null?void 0:d.docs)==null?void 0:m.source}}};const k=["Default"];export{t as Default,k as __namedExportsOrder,j as default};
