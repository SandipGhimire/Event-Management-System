import{r as e}from"./rolldown-runtime-Dw2cE7zH.js";import{a as t,j as n,p as r,q as i,t as a}from"./lucide-icons-bundle-DtOZ2b9c.js";import{t as o}from"./index-Dchvx4_F.js";import{t as s}from"./Modal-yAD1fo2g.js";var c=e(i(),1),l=o();function u({id:e,label:n,accept:r=`*`,maxSize:i=5,onChange:o,previewUrl:s,error:u,className:d=``}){let[f,p]=(0,c.useState)(!1),[m,h]=(0,c.useState)(null),[g,_]=(0,c.useState)(null),[v,y]=(0,c.useState)(null),b=(0,c.useRef)(null),x=s||m;(0,c.useEffect)(()=>()=>{m&&URL.revokeObjectURL(m)},[m]);let S=(0,c.useCallback)(e=>{if(y(null),r!==`*`){let t=r.split(`,`).map(e=>e.trim().toLowerCase()),n=e.type.toLowerCase(),i=e.name.toLowerCase();if(!t.some(e=>e.startsWith(`image/`)?n.startsWith(`image/`):e.startsWith(`.`)?i.endsWith(e):n===e))return y(`File type not allowed. Please upload ${r}`),!1}return e.size>i*1024*1024?(y(`File size exceeds ${i}MB limit.`),!1):!0},[r,i]),C=(0,c.useCallback)(e=>{if(e){if(S(e))if(_(e),o(e),e.type.startsWith(`image/`)){let t=URL.createObjectURL(e);m&&URL.revokeObjectURL(m),h(t)}else h(null)}else _(null),o(null),m&&URL.revokeObjectURL(m),h(null)},[o,S,m]),w=(0,c.useCallback)(e=>{e.preventDefault(),e.stopPropagation(),p(!0)},[]),T=(0,c.useCallback)(e=>{e.preventDefault(),e.stopPropagation(),p(!1)},[]),E=(0,c.useCallback)(e=>{e.preventDefault(),e.stopPropagation(),p(!1);let t=e.dataTransfer.files;t&&t.length>0&&C(t[0])},[C]);return(0,l.jsxs)(`div`,{className:`fileupload-container ${d}`,children:[n&&(0,l.jsx)(`label`,{className:`block text-sm font-medium text-text-primary mb-1`,children:n}),(0,l.jsxs)(`div`,{className:`fileupload-dropzone ${f?`dragging`:``} ${u||v?`has-error`:``}`,onDragOver:w,onDragLeave:T,onDrop:E,onClick:()=>{b.current?.click()},children:[(0,l.jsx)(`input`,{type:`file`,ref:b,className:`hidden`,accept:r,onChange:e=>C(e.target.files?.[0]||null),id:e}),(0,l.jsx)(`div`,{className:`fileupload-icon`,children:(0,l.jsx)(t,{size:24})}),(0,l.jsx)(`div`,{className:`fileupload-text`,children:g?(0,l.jsx)(`span`,{className:`truncate max-w-[200px] inline-block`,children:g.name}):`Click or drag file to upload`}),(0,l.jsxs)(`div`,{className:`fileupload-subtext`,children:[r===`image/*`?`PNG, JPG, GIF up to `:`Files up to `,i,`MB`]}),x&&(0,l.jsxs)(`div`,{className:`fileupload-preview`,children:[(0,l.jsx)(`img`,{src:x,alt:`Preview`}),(0,l.jsx)(`button`,{type:`button`,className:`fileupload-remove`,onClick:e=>{e.stopPropagation(),C(null),b.current&&(b.current.value=``)},title:`Remove file`,children:(0,l.jsx)(a,{size:14})})]})]}),(u||v)&&(0,l.jsx)(`div`,{className:`fileupload-error`,children:u||v})]})}function d({isOpen:e,onClose:t,title:i=`Image Viewer`,src:a,alt:o=`Image`,printWidth:u,printHeight:d}){return(0,l.jsx)(s,{isOpen:e,onClose:t,title:i,size:`lg`,footer:(0,l.jsxs)(`div`,{className:`flex justify-end w-full gap-2`,children:[(0,l.jsxs)(`button`,{onClick:(0,c.useCallback)(()=>{let e=u,t=d,n=document.createElement(`iframe`);n.style.position=`absolute`,n.style.width=`0`,n.style.height=`0`,n.style.border=`0`,document.body.appendChild(n);let r=n.contentWindow?.document;r&&(r.open(),r.writeln(`
    <html>
      <head>
        <title>Print ${i}</title>
        <style>
          ${e&&t?`@page {
            size: ${e} ${t};
            margin: 0;
          }`:``}
          body {
            margin: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            width: 100vw;
            background: white;
          }
          img {
            width: 100%;
            height: 100%;
            object-fit: contain;
          }
        </style>
      </head>
      <body>
        <img src="${a}" onload="window.focus(); window.print();" />
      </body>
    </html>
  `),r.close(),setTimeout(()=>{document.body.removeChild(n)},1e3))},[u,d,a,i]),className:`btn btn-primary btn-sm flex items-center gap-2`,children:[(0,l.jsx)(r,{size:16}),`Print`]}),(0,l.jsxs)(`a`,{href:a,target:`_blank`,rel:`noopener noreferrer`,className:`btn btn-outline-primary btn-sm flex items-center gap-2`,children:[(0,l.jsx)(n,{size:16}),`Open in New Tab`]})]}),children:(0,l.jsx)(`div`,{className:`flex flex-col items-center gap-4`,children:(0,l.jsx)(`div`,{className:`relative w-full max-h-[70vh] rounded-lg overflow-hidden border border-border bg-muted/20 flex items-center justify-center`,children:(0,l.jsx)(`img`,{src:a,alt:o,className:`max-w-full max-h-full shadow-lg`})})})})}export{u as n,d as t};