import{j as e}from"./jsx-runtime-Z5uAzocK.js";import{C as S}from"./colors-DIVxRCoz.js";import{S as i}from"./spacing-BssltnqB.js";import"./index-pP6CS22B.js";import"./_commonjsHelpers-Cpj98o6Y.js";const r={wrapper:{background:S.pageBg,minHeight:"100vh",width:"100%"},grid:{display:"grid",maxWidth:i.pageMaxWidth,margin:"0 auto",padding:`${i.lg} ${i.lg}`,gap:i.lg,alignItems:"start"},gridJobs:{gridTemplateColumns:"28rem 1fr 30rem"},gridCv:{gridTemplateColumns:"26rem 1fr 34rem"},gridTailoring:{gridTemplateColumns:"1fr 36rem"},gridDefault:{gridTemplateColumns:"1fr"}};function T({left:t,center:y,right:g,variant:n="jobs"}){const d=n==="jobs"?r.gridJobs:n==="cv"?r.gridCv:n==="tailoring"?r.gridTailoring:r.gridDefault,c=t!==void 0,m=g!==void 0,C=!c&&!m?"1fr":c?m?d.gridTemplateColumns:`${d.gridTemplateColumns.split(" ")[0]} 1fr`:`1fr ${d.gridTemplateColumns.split(" ").pop()}`;return e.jsx("div",{style:r.wrapper,children:e.jsxs("div",{style:{...r.grid,gridTemplateColumns:C},children:[c&&e.jsx("aside",{children:t}),e.jsx("main",{children:y}),m&&e.jsx("aside",{children:g})]})})}T.__docgenInfo={description:"",methods:[],displayName:"PageLayout",props:{left:{required:!1,tsType:{name:"ReactNode"},description:""},center:{required:!0,tsType:{name:"ReactNode"},description:""},right:{required:!1,tsType:{name:"ReactNode"},description:""},variant:{required:!1,tsType:{name:"union",raw:"'jobs' | 'cv' | 'tailoring'",elements:[{name:"literal",value:"'jobs'"},{name:"literal",value:"'cv'"},{name:"literal",value:"'tailoring'"}]},description:"",defaultValue:{value:"'jobs'",computed:!1}}}};const W={title:"Design System/Layout/PageLayout",component:T,parameters:{layout:"fullscreen"}},a=({label:t})=>e.jsx("div",{style:{background:"#ede9fe",borderRadius:14,padding:24,minHeight:200,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,color:"#7c3aed"},children:t}),s={args:{variant:"jobs",left:e.jsx(a,{label:"Filter Panel"}),center:e.jsx(a,{label:"Job List"}),right:e.jsx(a,{label:"Profile Sidebar"})}},l={args:{variant:"cv",left:e.jsx(a,{label:"Wizard Stepper"}),center:e.jsx(a,{label:"Form / Editor"}),right:e.jsx(a,{label:"CV Preview"})}},o={args:{variant:"tailoring",center:e.jsx(a,{label:"Workspace Tabs"}),right:e.jsx(a,{label:"ATS Panel"})}};var p,u,b;s.parameters={...s.parameters,docs:{...(p=s.parameters)==null?void 0:p.docs,source:{originalSource:`{
  args: {
    variant: 'jobs',
    left: <Panel label="Filter Panel" />,
    center: <Panel label="Job List" />,
    right: <Panel label="Profile Sidebar" />
  }
}`,...(b=(u=s.parameters)==null?void 0:u.docs)==null?void 0:b.source}}};var f,v,j;l.parameters={...l.parameters,docs:{...(f=l.parameters)==null?void 0:f.docs,source:{originalSource:`{
  args: {
    variant: 'cv',
    left: <Panel label="Wizard Stepper" />,
    center: <Panel label="Form / Editor" />,
    right: <Panel label="CV Preview" />
  }
}`,...(j=(v=l.parameters)==null?void 0:v.docs)==null?void 0:j.source}}};var h,x,P;o.parameters={...o.parameters,docs:{...(h=o.parameters)==null?void 0:h.docs,source:{originalSource:`{
  args: {
    variant: 'tailoring',
    center: <Panel label="Workspace Tabs" />,
    right: <Panel label="ATS Panel" />
  }
}`,...(P=(x=o.parameters)==null?void 0:x.docs)==null?void 0:P.source}}};const k=["JobsVariant","CvVariant","TailoringVariant"];export{l as CvVariant,s as JobsVariant,o as TailoringVariant,k as __namedExportsOrder,W as default};
