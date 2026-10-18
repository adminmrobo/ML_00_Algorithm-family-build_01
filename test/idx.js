const {chromium}=require('/opt/npm-tools/node_modules/playwright');const path=require('path');
(async()=>{const b=await chromium.launch();for(const w of [1280,390]){const p=await b.newPage({viewport:{width:w,height:900}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
 await p.goto('file://'+path.resolve('out/4-0_index.html'));await p.waitForTimeout(1500);
 const r=await p.evaluate(()=>({sw:document.documentElement.scrollWidth,W:document.documentElement.clientWidth,noimg:[...document.querySelectorAll('img')].filter(i=>!i.getAttribute('src')).length,links:[...new Set([...document.querySelectorAll('a[href]')].map(a=>a.getAttribute('href')))]}));
 console.log(w,JSON.stringify({errs,ok:r.sw<=r.W,noimg:r.noimg,links:r.links.join(' ')}));
 await p.screenshot({path:`test/idx_${w}.png`,fullPage:true});await p.close();}
 const p=await b.newPage({viewport:{width:1280,height:900}});await p.goto('file://'+path.resolve('out/4-3_unsupervised.html'));await p.waitForTimeout(500);
 console.log(await p.$eval('#series',e=>e.innerHTML.slice(0,90)), await p.$$eval('.outro .next a',a=>a.map(x=>x.getAttribute('href')).join(' ')));await b.close();})();
