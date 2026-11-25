import fs from "fs"; import path from "path"; import * as csstree from "css-tree";
const files=[]; (function w(d){for(const f of fs.readdirSync(d)){const p=path.join(d,f); if(fs.statSync(p).isDirectory()) w(p); else if(f.endsWith(".html")) files.push(p);}})("raw");
const lists=files.map(f=>[...fs.readFileSync(f,"utf8").matchAll(/assets\/css\/([\w-]+)\.css/g)].map(m=>m[1]));
const order=[]; for(const l of lists) for(const c of l) if(!order.includes(c)) order.push(c);
console.log("order:",order.join(" "));
// selector -> file -> media|decls
const defs={};
for(const c of order){ const ast=csstree.parse(fs.readFileSync(`../../assets/css/${c}.css`,"utf8"));
  csstree.walk(ast,{visit:"Rule",enter(node){ const media=this.atrule?csstree.generate(this.atrule.prelude||{type:"Raw",value:""}):"";
    const sels=csstree.generate(node.prelude).split(",");
    for(const s of sels){ const k=media+"|"+s.trim(); (defs[k] ||= {})[c]=csstree.generate(node.block);} }});
}
let n=0;
for(const [k,v] of Object.entries(defs)){ const fs_=Object.keys(v); if(fs_.length<2) continue;
  // pages that load some but not all of these files
  const bad=lists.filter(l=>fs_.some(f=>l.includes(f)) && !fs_.every(f=>l.includes(f))).length;
  if(bad) { n++; if(n<=40) console.log(k,"|",fs_.join(","),"| pages partial:",bad); }
}
console.log("conflicts:",n);
