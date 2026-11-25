import { parse } from "node-html-parser";
import fs from "fs"; import path from "path";
const files=[]; (function w(d){for(const f of fs.readdirSync(d)){const p=path.join(d,f); if(fs.statSync(p).isDirectory()) w(p); else if(f.endsWith(".html")) files.push(p);}})("raw");
const INL=new Set(["strong","b","em","i","u","s","del","sup","sub","br","span","a","small","time","abbr","bdi","code","mark","q","cite"]);
const pat={};
for(const f of files){ const root=parse(fs.readFileSync(f,"utf8"));
  for(const el of root.querySelectorAll("h1,h2,h3,h4,h5,h6,p,li,a,button,summary,figcaption,label,dt,dd,blockquote,span,strong")) {
    for(const c of el.childNodes){ if(c.nodeType!==1) continue; const t=c.rawTagName.toLowerCase(); const cl=c.getAttribute("class")||""; const attrs=Object.keys(c.attributes).filter(a=>a!=="class").join(","); const k=`${el.rawTagName.toLowerCase()} > ${t}${cl?"."+cl.split(/\s+/).join("."):""}${attrs?"["+attrs+"]":""}`; pat[k]=(pat[k]||0)+1; }
  }}
const arr=Object.entries(pat).filter(([k])=>/^(h\d|p|span|strong|label|figcaption|summary|dt|dd|blockquote) > /.test(k)).sort((a,b)=>b[1]-a[1]);
for(const [k,v] of arr) console.log(v,k);
