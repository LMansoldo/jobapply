import{j as a}from"./jsx-runtime-Z5uAzocK.js";import{C as r}from"./colors-DIVxRCoz.js";import{B as j}from"./radius-D3pzAX1q.js";import{S as c}from"./spacing-BssltnqB.js";import"./index-pP6CS22B.js";import"./_commonjsHelpers-Cpj98o6Y.js";const p=["transparent",r.danger,r.orange,r.warning,r.green],_=["","Muito fraca","Fraca","Média","Forte"],s={wrapper:{display:"flex",flexDirection:"column",gap:c.xxs},bars:{display:"flex",gap:c.xs},bar:{flex:1,height:"4px",borderRadius:j.full,background:r.surfaceBorder,transition:"background 0.3s"},label:{fontSize:"1.2rem",transition:"color 0.3s"}};function w({value:e}){return a.jsxs("div",{style:s.wrapper,children:[a.jsx("div",{style:s.bars,children:[1,2,3,4].map(i=>a.jsx("div",{style:{...s.bar,background:e>=i?p[e]:void 0}},i))}),e>0&&a.jsx("span",{style:{...s.label,color:p[e]},children:_[e]})]})}w.__docgenInfo={description:"",methods:[],displayName:"PasswordStrength",props:{value:{required:!0,tsType:{name:"union",raw:"0 | 1 | 2 | 3 | 4",elements:[{name:"literal",value:"0"},{name:"literal",value:"1"},{name:"literal",value:"2"},{name:"literal",value:"3"},{name:"literal",value:"4"}]},description:""}}};const E={title:"Design System/Auth/PasswordStrength",component:w},o={args:{value:1}},t={args:{value:2}},n={args:{value:3}},l={args:{value:4}};var d,m,u;o.parameters={...o.parameters,docs:{...(d=o.parameters)==null?void 0:d.docs,source:{originalSource:`{
  args: {
    value: 1
  }
}`,...(u=(m=o.parameters)==null?void 0:m.docs)==null?void 0:u.source}}};var g,v,x;t.parameters={...t.parameters,docs:{...(g=t.parameters)==null?void 0:g.docs,source:{originalSource:`{
  args: {
    value: 2
  }
}`,...(x=(v=t.parameters)==null?void 0:v.docs)==null?void 0:x.source}}};var f,h,b;n.parameters={...n.parameters,docs:{...(f=n.parameters)==null?void 0:f.docs,source:{originalSource:`{
  args: {
    value: 3
  }
}`,...(b=(h=n.parameters)==null?void 0:h.docs)==null?void 0:b.source}}};var S,y,L;l.parameters={...l.parameters,docs:{...(S=l.parameters)==null?void 0:S.docs,source:{originalSource:`{
  args: {
    value: 4
  }
}`,...(L=(y=l.parameters)==null?void 0:y.docs)==null?void 0:L.source}}};const F=["Level1","Level2","Level3","Level4"];export{o as Level1,t as Level2,n as Level3,l as Level4,F as __namedExportsOrder,E as default};
