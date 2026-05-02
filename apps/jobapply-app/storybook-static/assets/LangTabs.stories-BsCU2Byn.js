import{j as s}from"./jsx-runtime-Z5uAzocK.js";import{r as g}from"./index-pP6CS22B.js";import{C as t}from"./colors-DIVxRCoz.js";import{B as c}from"./radius-D3pzAX1q.js";import{F as y}from"./typography-CACM-JMF.js";import{S as p}from"./spacing-BssltnqB.js";import"./_commonjsHelpers-Cpj98o6Y.js";const o={container:{display:"inline-flex",background:t.surfaceBorder,borderRadius:c.full,padding:"2px",gap:"2px"},tab:{padding:`${p.xxs} ${p.md}`,borderRadius:c.full,fontSize:"1.3rem",fontWeight:y.medium,cursor:"pointer",border:"none",background:"transparent",color:t.textSub,transition:"background 0.15s, color 0.15s"},tabActive:{background:t.primaryDark,color:t.white}};function i({tabs:n,activeKey:a,onChange:l}){return s.jsx("div",{style:o.container,children:n.map(e=>s.jsx("button",{type:"button",style:{...o.tab,...e.key===a?o.tabActive:{}},onClick:()=>l(e.key),children:e.label},e.key))})}i.__docgenInfo={description:"",methods:[],displayName:"LangTabs",props:{tabs:{required:!0,tsType:{name:"Array",elements:[{name:"LangTab"}],raw:"LangTab[]"},description:""},activeKey:{required:!0,tsType:{name:"string"},description:""},onChange:{required:!0,tsType:{name:"signature",type:"function",raw:"(key: string) => void",signature:{arguments:[{type:{name:"string"},name:"key"}],return:{name:"void"}}},description:""}}};const h={title:"Design System/Navigation/LangTabs",component:i},r={render:()=>{const[n,a]=g.useState("pt-BR");return s.jsx(i,{tabs:[{key:"pt-BR",label:"PT-BR"},{key:"en",label:"EN"}],activeKey:n,onChange:a})}};var d,m,u;r.parameters={...r.parameters,docs:{...(d=r.parameters)==null?void 0:d.docs,source:{originalSource:`{
  render: () => {
    const [active, setActive] = useState('pt-BR');
    return <LangTabs tabs={[{
      key: 'pt-BR',
      label: 'PT-BR'
    }, {
      key: 'en',
      label: 'EN'
    }]} activeKey={active} onChange={setActive} />;
  }
}`,...(u=(m=r.parameters)==null?void 0:m.docs)==null?void 0:u.source}}};const B=["Default"];export{r as Default,B as __namedExportsOrder,h as default};
