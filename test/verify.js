const {chromium}=require('/opt/npm-tools/node_modules/playwright');const fs=require('fs'),path=require('path');
const PLAN={'4-1':'d','4-2':'f','4-3':'r','4-4':'f','4-5':'r'};
(async()=>{const b=await chromium.launch();const files=fs.readdirSync('out').filter(f=>f.endsWith('.html')&&!f.startsWith('4-0')).sort((a,c)=>a.localeCompare(c,undefined,{numeric:true}));
 for(const f of files){for(const [w,scheme] of [[390,'light'],[1280,'dark']]){const p=await b.newPage({viewport:{width:w,height:900},colorScheme:scheme});
  const errs=[];p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>{if(m.type()==='error'&&!/ERR_TUNNEL|Failed to load resource/.test(m.text()))errs.push(m.text())});
  await p.goto('file://'+path.resolve('out',f));await p.waitForTimeout(800);
  const ids=await p.$$eval('.duel',a=>a.map(x=>x.id));for(const id of ids)await p.evaluate(i=>document.getElementById(i)._open(),id);await p.waitForTimeout(2500);
  for(const a of await p.$$('.alt [data-alt]')){await a.click();await p.waitForTimeout(400);}
  const r=await p.evaluate(()=>{const W=document.documentElement.clientWidth;
    const links=[...document.querySelectorAll('a[href]')].map(a=>a.getAttribute('href')).filter(h=>!h.startsWith('#')&&!h.startsWith('http'));
    let nb=null;try{nb=JSON.parse(notebook(CODE)).cells.length}catch(e){nb='ERR '+e.message}
    const missingImg=[...document.querySelectorAll('img')].filter(i=>!i.getAttribute('src')).length;
    const jt=document.querySelectorAll('.jt').length;
    return {sw:document.documentElement.scrollWidth,W,mine:SCORE.mine,score:[sF.textContent,sR.textContent,sD.textContent].join(':'),links:[...new Set(links)],nb,missingImg,jt,quiz:document.querySelectorAll('.qz').length,gl:GL.length,an:ANALOGY.length,refs:REFS.length};});
  console.log(f,w,scheme,JSON.stringify({ok:r.sw<=r.W,mine:r.mine,plan:PLAN[f.slice(0,3)],score:r.score,nb:r.nb,missingImg:r.missingImg,jt:r.jt,quiz:r.quiz,gl:r.gl,an:r.an,refs:r.refs,errs}));
  if(w===390)console.log('   links',r.links.join(' '));
  if(scheme==='dark'&&f.startsWith('4-1')){for(const id of ['top','m4']){const el=await p.$('#'+id);await el.scrollIntoViewIfNeeded();await el.screenshot({path:'test/dark_'+id+'.png'});}}
  await p.close();}}
 await b.close();})();
