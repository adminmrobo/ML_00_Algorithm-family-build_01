// 사용: node test/shot.js out/파일.html [width] [prefix] [openDuel]
const {chromium}=require('/opt/npm-tools/node_modules/playwright');
(async()=>{const [file,w='1280',pre='s',open='1']=process.argv.slice(2);
 const b=await chromium.launch();const p=await b.newPage({viewport:{width:+w,height:900},deviceScaleFactor:1});
 const errs=[];p.on('pageerror',e=>errs.push('pageerror: '+e.message));p.on('console',m=>{if(m.type()==='error')errs.push('console: '+m.text())});
 await p.goto('file://'+require('path').resolve(file));await p.waitForTimeout(1200);
 if(open==='1'){const ids=await p.$$eval('.duel',a=>a.map(x=>x.id));for(const id of ids){await p.evaluate(i=>document.getElementById(i)._open(),id);}await p.waitForTimeout(2500);
   const alts=await p.$$('.alt [data-alt]');for(const a of alts){await a.click();await p.waitForTimeout(600);} }
 const over=await p.evaluate(()=>{const W=document.documentElement.clientWidth,bad=[];document.querySelectorAll('body *').forEach(e=>{const r=e.getBoundingClientRect();if(r.right>W+1&&getComputedStyle(e).position!=='fixed'&&!e.closest('.cwrap,.tw,pre,.toc,.series')&&r.width>0)bad.push(e.tagName+'.'+e.className+' '+Math.round(r.right));});return {sw:document.documentElement.scrollWidth,W:W,bad:bad.slice(0,8)};});
 const H=await p.evaluate(()=>document.body.scrollHeight);
 const secs=await p.$$eval('header.hero,section.part,section.outro',a=>a.map(x=>x.id));
 for(const id of secs){const el=await p.$('#'+id);if(!el)continue;await el.scrollIntoViewIfNeeded();await p.waitForTimeout(250);await el.screenshot({path:`test/${pre}_${id}.png`});}
 const score=await p.evaluate(()=>document.getElementById('score').innerText);
 console.log(JSON.stringify({errs,over,H,score},null,0));await b.close();})();
