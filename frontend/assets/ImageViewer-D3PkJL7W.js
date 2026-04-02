import{r as e}from"./rolldown-runtime-Dw2cE7zH.js";import{A as t,K as n,f as r}from"./lucide-icons-bundle-BjxiUmip.js";import{t as i}from"./index-BOoMtvDw.js";import{t as a}from"./Modal-DYuE6Gps.js";var o=e(n(),1),s=i();function c({isOpen:e,onClose:n,title:i=`Image Viewer`,src:c,alt:l=`Image`,printWidth:u,printHeight:d}){return(0,s.jsx)(a,{isOpen:e,onClose:n,title:i,size:`lg`,footer:(0,s.jsxs)(`div`,{className:`flex justify-end w-full gap-2`,children:[(0,s.jsxs)(`button`,{onClick:(0,o.useCallback)(()=>{let e=u,t=d,n=document.createElement(`iframe`);n.style.position=`absolute`,n.style.width=`0`,n.style.height=`0`,n.style.border=`0`,document.body.appendChild(n);let r=n.contentWindow?.document;r&&(r.open(),r.writeln(`
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
        <img src="${c}" onload="window.focus(); window.print();" />
      </body>
    </html>
  `),r.close(),setTimeout(()=>{document.body.removeChild(n)},1e3))},[u,d,c,i]),className:`btn btn-primary btn-sm flex items-center gap-2`,children:[(0,s.jsx)(r,{size:16}),`Print`]}),(0,s.jsxs)(`a`,{href:c,target:`_blank`,rel:`noopener noreferrer`,className:`btn btn-outline-primary btn-sm flex items-center gap-2`,children:[(0,s.jsx)(t,{size:16}),`Open in New Tab`]})]}),children:(0,s.jsx)(`div`,{className:`flex flex-col items-center gap-4`,children:(0,s.jsx)(`div`,{className:`relative w-full max-h-[70vh] rounded-lg overflow-hidden border border-border bg-muted/20 flex items-center justify-center`,children:(0,s.jsx)(`img`,{src:c,alt:l,className:`max-w-full max-h-full shadow-lg`})})})})}export{c as t};