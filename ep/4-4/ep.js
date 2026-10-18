/* ══ 4-4 강화학습 ════════════════════════════════════════════════ */
/* ── 히어로: 에이전트 ↔ 환경 고리 ── */
heroStage($('heroCv'),{bg:'sc_night',bgY:.3,fly:'point',robo:'coin',motif:function(ctx,t,W,H){var C=cols();
  ctx.fillStyle='rgba(13,12,28,.78)';rr(ctx,280,30,540,250,16);ctx.fill();
  var ax=400,ex=700,cy=155;
  [[ax,'에이전트','#f1b646'],[ex,'환경','#82b8ff']].forEach(function(b){ctx.fillStyle=rgba(b[2],.18);rr(ctx,b[0]-70,cy-40,140,80,12);ctx.fill();ctx.strokeStyle=b[2];ctx.lineWidth=2.5;ctx.stroke();ctx.font=font(15,700);ctx.fillStyle='#eceaf3';ctx.textAlign='center';ctx.fillText(b[1],b[0],cy+40+22);});
  var sw=NPC.draw('sweep_side',4);ctx.drawImage(sw,ax-sw.width/2,cy-sw.height/2);
  ctx.fillStyle='#25283a';ctx.fillRect(ex-50,cy-22,100,44);for(var i=0;i<5;i++){ctx.strokeStyle='#4a4d68';ctx.strokeRect(ex-50+i*20,cy-22,20,44);}ctx.fillStyle='#9d9bb8';ctx.fillRect(ex+32,cy-4,8,8);
  ctx.strokeStyle='rgba(241,182,70,.8)';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(ax+70,cy-24);ctx.quadraticCurveTo(550,cy-110,ex-70,cy-24);ctx.stroke();
  ctx.strokeStyle='rgba(94,227,156,.8)';ctx.beginPath();ctx.moveTo(ex-70,cy+24);ctx.quadraticCurveTo(550,cy+110,ax+70,cy+24);ctx.stroke();
  var u=(t*.45)%1,p1=[(1-u)*(1-u)*(ax+70)+2*u*(1-u)*550+u*u*(ex-70),(1-u)*(1-u)*(cy-24)+2*u*(1-u)*(cy-110)+u*u*(cy-24)];glow(ctx,p1[0],p1[1],16,'#f1b646',.9);ctx.font=font(14,700);ctx.fillStyle='#f1b646';ctx.fillText('행동 a',550,cy-78);
  var v=((t*.45)+.5)%1,p2=[(1-v)*(1-v)*(ex-70)+2*v*(1-v)*550+v*v*(ax+70),(1-v)*(1-v)*(cy+24)+2*v*(1-v)*(cy+110)+v*v*(cy+24)];glow(ctx,p2[0],p2[1],16,'#5ee39c',.9);ctx.fillStyle='#5ee39c';ctx.fillText('상태 s · 보상 r',550,cy+92);}});

/* ── 01 복도 청소봇 ── */
(function(){var cv=$('loopCv'),N=5,pos=1,Q=[],ph=0,acc=0,run=!REDUCE,last={a:null,r:null,from:1},r=ML.R(11),eps=.2,al=.3,score=0,steps=0;
 function reset(){Q=[];for(var i=0;i<N;i++)Q.push([0,0]);pos=1;ph=0;score=0;steps=0;last={a:null,r:null,from:1};draw();ui();}
 var PH=['① 상태 보기','② 행동 고르기','③ 환경이 바뀜','④ 보상 받기','⑤ 값 고치기'];
 function advance(){if(ph===1){var q=Q[pos];last.a=r()<eps?(r()<.5?0:1):(q[0]===q[1]?(r()<.5?0:1):(q[0]>q[1]?0:1));last.from=pos;}
  if(ph===2){var np=pos+(last.a?1:-1);if(np<0){last.r=-1;last.wall=true;}else{last.wall=false;pos=np;last.r=pos===N-1?1:0;}}
  if(ph===4){var qq=Q[last.from];qq[last.a]+=al*(last.r-qq[last.a]);score+=last.r;steps++;if(pos===N-1){pos=1;}}
  ph=(ph+1)%5;draw();ui();}
 function draw(){var H=250,W=fit(cv,H),ctx=cv.getContext('2d'),C=cols(),cw=Math.min(76,(W*.55-40)/N),x0=24,y0=70;ctx.clearRect(0,0,W,H);
  ctx.fillStyle=C.eye;ctx.fillRect(x0-8,y0-6,6,cw+12);ctx.font=font(11);ctx.fillStyle=C.eye;ctx.textAlign='center';ctx.fillText('벽',x0-5,y0-12);
  for(var i=0;i<N;i++){var x=x0+i*cw;ctx.fillStyle=i===N-1?rgba(C.amber,.18):C.panel2;ctx.fillRect(x,y0,cw-2,cw);ctx.strokeStyle=C.rule;ctx.strokeRect(x,y0,cw-2,cw);
   if(i===N-1){ctx.fillStyle=C.amber;ctx.font=font(11,700);ctx.fillText('먼지 +1',x+cw/2,y0+cw+16);}
   var q=Q[i];ctx.font=font(10.5);ctx.fillStyle=q[0]<0?C.eye:C.muted;ctx.textAlign='left';ctx.fillText('←'+fx(q[0],2),x+3,y0+cw+32);ctx.textAlign='right';ctx.fillStyle=q[1]>0?C.gfp:C.muted;ctx.fillText(fx(q[1],2)+'→',x+cw-5,y0+cw+46);}
  var sp=NPC.draw('sweep_top',4);ctx.drawImage(sp,x0+pos*cw+(cw-2)/2-sp.width/2,y0+cw/2-sp.height/2);
  if(ph>=3&&last.r!=null){ctx.font=font(16,700);ctx.fillStyle=last.r>0?C.gfp:last.r<0?C.eye:C.muted;ctx.textAlign='center';ctx.fillText((last.r>0?'+':'')+last.r+(last.wall?' 쿵!':last.r>0?' 삐빅!':''),x0+pos*cw+cw/2,y0-14);}
  ctx.font=font(11);ctx.fillStyle=C.muted;ctx.textAlign='left';ctx.fillText('칸 아래 숫자: 그 칸에서 ← / → 를 했을 때의 값 Q',x0,H-10);
  var gx=x0+N*cw+40,gw=W-gx-16,ay=70,eyy=180,bx=gx+gw/2;
  [[ay,'에이전트 (쓱싹이)',C.amber,[0,1,4]],[eyy,'환경 (복도)',C.info,[2,3]]].forEach(function(b){var on=b[3].indexOf(ph)>=0;ctx.fillStyle=rgba(b[2],on?.25:.08);rr(ctx,gx,b[0]-24,gw,48,10);ctx.fill();ctx.strokeStyle=rgba(b[2],on?1:.5);ctx.lineWidth=on?2.5:1.2;ctx.stroke();ctx.font=font(13,700);ctx.fillStyle=C.text;ctx.textAlign='center';ctx.fillText(b[1],bx,b[0]+5);});
  ctx.strokeStyle=rgba(C.amber,ph===1||ph===2?1:.4);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(bx+gw*.25,ay+24);ctx.lineTo(bx+gw*.25,eyy-24);ctx.stroke();ctx.font=font(11.5,700);ctx.fillStyle=C.amber;ctx.textAlign='left';ctx.fillText('행동 '+(last.a==null?'?':(last.a?'→':'←')),bx+gw*.25+6,(ay+eyy)/2);
  ctx.strokeStyle=rgba(C.gfp,ph===3||ph===4?1:.4);ctx.beginPath();ctx.moveTo(bx-gw*.25,eyy-24);ctx.lineTo(bx-gw*.25,ay+24);ctx.stroke();ctx.fillStyle=C.gfp;ctx.textAlign='right';ctx.fillText('상태 · 보상 '+(last.r==null?'?':last.r),bx-gw*.25-6,(ay+eyy)/2);
  stamp(ctx,W,'설명용 모형');}
 function ui(){$('loopFlow').querySelectorAll('button').forEach(function(b,i){b.className=i===ph?'on':'';});
  var msg=['쓱싹이가 지금 어느 칸에 있는지 본다(상태).','칸에 적힌 두 값 중 큰 쪽을 고른다. 다섯 번에 한 번쯤은 일부러 아무 쪽이나 고른다(탐험).','행동대로 움직인다. 벽이면 제자리.','환경이 점수를 준다. 먼지 칸 +1, 벽 −1, 그 밖 0.','방금 한 행동의 값을 고친다: Q ← Q + 0.3 × (보상 − Q).'];
  $('loopInfo').innerHTML='<b>'+PH[ph]+'.</b> '+msg[ph]+' <span class="muted">· '+steps+'번 움직임 · 누적 보상 '+score+'</span>';$('loopPlay').textContent=run?'❚❚ 멈춤':'▶ 재생';}
 $('loopPlay').addEventListener('click',function(){run=!run;ui();});$('loopReset').addEventListener('click',reset);
 onTick(cv,function(dt){if(!run)return;acc+=dt;if(acc>.45){acc=0;advance();}});reset();onRedraw(draw);})();

/* ── 03 직접 당기기 ── */
(function(){var r=ML.R(5),n=[0,0],s=[0,0],P=[RL.PA,RL.PB],lastTxt='';
 function ui(){$('pullBars').innerHTML=['A','B'].map(function(k,i){var m=n[i]?s[i]/n[i]:0;return '<div class="row"><span>금고 '+k+' · '+n[i]+'번</span><div class="tr"><div class="fl" style="width:'+(m*100)+'%;background:var(--'+(i?'info':'amber')+')"></div></div><span class="v">'+(n[i]?pct(m,0):'—')+'</span></div>';}).join('');
  var tot=n[0]+n[1];$('pullInfo').innerHTML=tot?(lastTxt+' · 지금까지 '+tot+'번 중 보상 '+(s[0]+s[1])+'번.'+(tot>=10?' 막대는 지금까지 받은 보상 비율이다. '+(n[0]<3||n[1]<3?'한쪽을 거의 안 당겼다면, 그 금고의 막대는 아직 믿기 어렵다.':'두 금고를 충분히 당겼다면 어느 쪽이 나은지 보일 것이다.'):'')):'아직 한 번도 당기지 않았다.';}
 function pull(i){var w=r()<P[i]?1:0;n[i]++;s[i]+=w;lastTxt='금고 '+'AB'[i]+' → '+(w?'<b style="color:var(--gfp)">+1</b>':'0');ui();}
 $('pullA').addEventListener('click',function(){pull(0)});$('pullB').addEventListener('click',function(){pull(1)});$('pullReset').addEventListener('click',function(){n=[0,0];s=[0,0];r=ML.R(5);ui();});ui();})();

/* ── 03 자동 300번 ── */
(function(){var cv=$('banCv'),eps=.1,seed=7,res=null,shown=0,run=false;
 function sim(){var o=ML.banditA(eps,RL.ALPHA,RL.T,RL.PA,RL.PB,RL.SW,seed),Qs=[],rr2=ML.R(seed);return o;}
 function qtrace(){var r=ML.R(seed),Q=[0,0],tr=[];for(var t=0;t<RL.T;t++){var p=t<RL.SW?[RL.PA,RL.PB]:[RL.PB,RL.PA],a;if(r()<eps)a=r()<.5?0:1;else a=Q[0]===Q[1]?(r()<.5?0:1):(Q[0]>Q[1]?0:1);var rew=r()<p[a]?1:0;Q[a]+=RL.ALPHA*(rew-Q[a]);tr.push([Q[0],Q[1]]);}return tr;}
 var qt=[];
 function draw(){var H=240,W=fit(cv,H),ctx=cv.getContext('2d'),C=cols(),l=36,r=W-10,T=RL.T;ctx.clearRect(0,0,W,H);function px(t){return l+t/T*(r-l)}
  ctx.fillStyle=rgba(C.muted,.08);ctx.fillRect(px(RL.SW),8,r-px(RL.SW),H-30);ctx.font=font(10.5);ctx.fillStyle=C.muted;ctx.textAlign='left';ctx.fillText('A 70% · B 30%',l+4,18);ctx.fillText('A 30% · B 70%',px(RL.SW)+4,18);
  if(res){for(var t=0;t<shown;t++){ctx.fillStyle=res.pulls[t]?C.info:C.amber;ctx.fillRect(px(t),26+(res.pulls[t]?10:0),Math.max(1.5,(r-l)/T),8);}
   var y0=H-24,y1=60;ctx.strokeStyle=C.rule;ctx.beginPath();ctx.moveTo(l,y1);ctx.lineTo(l,y0);ctx.lineTo(r,y0);ctx.stroke();
   ctx.textAlign='right';ctx.fillText('1',l-4,y1+4);ctx.fillText('0',l-4,y0+4);
   [[0,C.amber],[1,C.info]].forEach(function(s){ctx.strokeStyle=s[1];ctx.lineWidth=2;ctx.beginPath();for(var t=0;t<shown;t++){var y=y0-qt[t][s[0]]*(y0-y1);t?ctx.lineTo(px(t),y):ctx.moveTo(px(t),y);}ctx.stroke();});
   ctx.strokeStyle=C.gfp;ctx.lineWidth=2;ctx.setLineDash([4,3]);ctx.beginPath();for(var t2=0;t2<shown;t2++){var y2=y0-res.curve[t2]/T*(y0-y1);t2?ctx.lineTo(px(t2),y2):ctx.moveTo(px(t2),y2);}ctx.stroke();ctx.setLineDash([]);}
  ctx.textAlign='left';ctx.font=font(10.5);ctx.fillStyle=C.amber;ctx.fillText('■ A의 값 Q',l+4,H-6);ctx.fillStyle=C.info;ctx.fillText('■ B의 값 Q',l+90,H-6);ctx.fillStyle=C.gfp;ctx.fillText('점선: 누적 보상 (위 끝 = 300)',l+176,H-6);
  stamp(ctx,W,'시드 '+seed);}
 function ui(){if(!res){$('banInfo').textContent='ε를 정하고 돌려 보자. 위쪽 띠는 매번 당긴 금고(노랑 A, 파랑 B)다.';return;}
  var a1=0,b2=0;for(var t=0;t<RL.T;t++){if(t<RL.SW&&res.pulls[t]===0)a1++;if(t>=RL.SW&&res.pulls[t]===1)b2++;}
  $('banInfo').innerHTML='ε = '+fx(eps,2)+' · 누적 보상 <b>'+res.total+'</b> · 바뀌기 전 좋은 금고(A)를 '+a1+'/'+RL.SW+'번, 바뀐 뒤 좋은 금고(B)를 '+b2+'/'+(RL.T-RL.SW)+'번 골랐다.'+(eps===0&&b2<50?' 바뀐 뒤에도 A만 당긴다. B를 해 보지 않으니 B가 좋아진 걸 모른다.':'')+' <span class="muted">다시 누르면 다른 시드로 돈다.</span>';}
 $('epsSl').addEventListener('input',function(){eps=+this.value;$('epsVal').textContent=fx(eps,2);});
 $('banRun').addEventListener('click',function(){seed++;res=sim();qt=qtrace();shown=REDUCE?RL.T:0;run=!REDUCE;draw();ui();});
 onTick(cv,function(dt){if(!run)return;shown=Math.min(RL.T,shown+Math.ceil(dt*150));draw();if(shown>=RL.T){run=false;ui();}});draw();ui();onRedraw(draw);})();

/* ── 담판 ── */
function curvesCanvas(id,A,B,la,lb,sw){function dr(){var cv=$(id);if(!cv)return;var H=220,W=fit(cv,H),ctx=cv.getContext('2d'),C=cols(),l=40,r=W-10,tp=12,bt=H-30,T=RL.T,M=Math.max(A.curve[T-1],B.curve[T-1])*1.08;ctx.clearRect(0,0,W,H);
  function px(t){return l+t/T*(r-l)}function py(v){return bt-v/M*(bt-tp)}
  if(sw<T){ctx.fillStyle=rgba(C.muted,.08);ctx.fillRect(px(sw),tp,r-px(sw),bt-tp);ctx.font=font(10.5);ctx.fillStyle=C.muted;ctx.textAlign='left';ctx.fillText('금고 확률이 바뀜',px(sw)+4,tp+12);}
  ctx.strokeStyle=C.rule;ctx.beginPath();ctx.moveTo(l,tp);ctx.lineTo(l,bt);ctx.lineTo(r,bt);ctx.stroke();ctx.font=font(10.5);ctx.fillStyle=C.muted;ctx.textAlign='center';[0,100,200,300].forEach(function(v){ctx.fillText(v,px(v),bt+14);});ctx.fillText('당긴 횟수',(l+r)/2,H-4);
  ctx.textAlign='right';[0,50,100,150,200].forEach(function(v){if(v<=M)ctx.fillText(v,l-4,py(v)+4);});
  [[A,C.c_fly,la],[B,C.c_robo,lb]].forEach(function(s,j){ctx.strokeStyle=s[1];ctx.lineWidth=2.6;ctx.beginPath();for(var t=0;t<T;t++){t?ctx.lineTo(px(t),py(s[0].curve[t])):ctx.moveTo(px(t),py(s[0].curve[t]));}ctx.stroke();ctx.fillStyle=s[1];ctx.textAlign='right';ctx.font=font(11.5,700);ctx.fillText(s[2]+' '+fx(s[0].curve[T-1],1),r-4,py(s[0].curve[T-1])+(j?16:-8));});}
  setTimeout(dr,0);onRedraw(dr);}
Duel('d4',{title:'잘 나오는 금고만 당길까',q:'보상 금고 A(70%)와 B(30%). 300번 당기는 동안 100번째에 두 금고의 확률이 몰래 뒤바뀐다. 둘 다 같은 값 고치기 식(α = 0.1)을 쓰고, 고르는 방식만 다르다. 시드 300개의 평균으로 잰다.',
 fly:['열 번에 한 번은 아무 금고나 (ε = 0.1)','가끔은 다른 길도 가 봐야 바뀐 걸 알지.'],robo:['늘 값이 큰 금고만 (ε = 0)','지금 제일 잘 나오는 데 몰빵이지.'],roboMood:'coin',
 run:async function(p){p(.3);await wait(80);var o=RL.duel();p(1);
  return {winner:o.e.mean>o.g.mean?'f':(o.e.mean<o.g.mean?'r':'d'),measure:'시드 300개 평균으로 초파리 쪽 누적 보상은 '+fx(o.e.mean,1)+', Money-Robo 쪽은 '+fx(o.g.mean,1)+'이에요. 그때그때 좋은 금고를 고른 비율은 초파리 '+pct(o.e.goodRate)+', Money-Robo '+pct(o.g.goodRate)+'예요.',
   verdict:'지금 가장 좋아 보이는 것만 고르면 세상이 바뀐 걸 모른다. 탐험한 쪽이 바뀐 금고를 찾아냈다. 이 구역은 초파리 쪽이다.',key:'활용만 하면 모르는 쪽의 정보가 쌓이지 않는다.',
   render:function(box){box.innerHTML=statGrid([[fx(o.e.mean,1),'초파리 · ε = 0.1 · 평균 누적 보상','f'],[pct(o.e.goodRate),'초파리 · 좋은 금고 고른 비율','f'],[fx(o.g.mean,1),'Money-Robo · ε = 0 · 평균 누적 보상','r'],[pct(o.g.goodRate),'Money-Robo · 좋은 금고 고른 비율','r']])+'<canvas class="fig" id="bcA" style="margin-top:12px" aria-label="두 방식의 평균 누적 보상 곡선. 100번째 이후 초파리 쪽 곡선이 더 가파르게 오른다"></canvas>';curvesCanvas('bcA',o.e,o.g,'초파리','Money-Robo',RL.SW);}};},
 alts:[{label:'금고 확률이 끝까지 안 바뀐다면?',run:async function(box){var o=RL.duel(1e9);
   box.innerHTML=statGrid([[fx(o.e.mean,1),'초파리 · ε = 0.1','f'],[fx(o.g.mean,1),'Money-Robo · ε = 0','r']])+'<canvas class="fig" id="bcB" style="margin-top:12px" aria-label="금고가 바뀌지 않을 때 두 방식의 평균 누적 보상 곡선"></canvas>'+
    say('robo','wow','안 바뀌는데도 내가 져? …아, 처음에 B가 운 좋게 한 번 나오면 B만 당기다가 A를 영영 안 해 보는구나.')+say('asst','ledger','맞아요. 값이 처음엔 둘 다 0이라, 탐험이 없으면 처음 몇 번의 운에 묶여요. 바뀌지 않는 세상에서도 탐험이 조금은 필요해요.');curvesCanvas('bcB',o.e,o.g,'초파리','Money-Robo',1e9);}},
  {label:'탐험을 ε = 0.5로 크게 하면?',run:async function(box){var o=RL.duel();
   box.innerHTML=statGrid([[fx(o.e.mean,1),'ε = 0.1','f'],[fx(o.e5.mean,1),'ε = 0.5'],[fx(o.g.mean,1),'ε = 0','r']])+say('fly','coffee','절반이나 아무 데나 당기면 좋은 금고를 알아도 못 써먹지. 탐험은 조금, 활용은 많이.');}}]});

/* ══ 확인 문제 ══ */
var QUIZ={q4:[
 {q:'강화학습이 배우는 재료는?',o:[['행동한 뒤 받는 보상',1,'정답 대신 점수만 받는다. 다른 행동을 했으면 얼마였을지는 알려 주지 않는다.'],['입력과 정답의 짝',0,'그것은 지도학습의 재료다(4-2).'],['정답 없는 입력만',0,'그것은 비지도학습의 재료다(4-3).']]},
 {q:'Q ← Q + α(r − Q)에서 보상 r이 예상 Q보다 크면?',o:[['Q가 올라간다',1,'(r − Q)가 양수이니 α만큼 곱해 더해진다. 예상보다 좋으면 값을 올린다.'],['Q가 내려간다',0,'r − Q가 음수일 때, 곧 예상보다 나쁠 때 내려간다.'],['Q가 r로 바로 바뀐다',0,'α = 1일 때만 그렇다. 보통은 조금씩 고친다.']]},
 {q:'담판에서 ε = 0(활용만)이 금고가 바뀌지 않을 때도 진 까닭은?',o:[['처음 몇 번의 운으로 나쁜 금고에 묶일 수 있어서',1,'두 값이 0에서 시작하니, B가 먼저 한 번 나오면 B만 당기고 A를 다시 해 보지 않는다.'],['ε = 0은 학습률이 0이라서',0,'두 쪽의 학습률은 0.1로 같다. ε는 탐험 비율이다.'],['금고 A가 더 나빠서',0,'바뀌지 않는 조건에서는 A(70%)가 계속 더 좋다.']]}]};

var PROMPTS=[
 {t:'① 내 문제를 강화학습으로 볼 수 있을까',use:'업무 문제가 강화학습에 맞는지 판단할 때',p:'내 문제를 강화학습으로 풀 수 있는지 판단해 줘.\n\n- 문제: 〔예) 쇼핑몰 첫 화면에 배너 세 개 중 무엇을 보여 줄지 정하기〕\n- 얻을 수 있는 신호: 〔예) 클릭 여부〕\n\n1. 에이전트, 환경, 상태, 행동, 보상을 각각 무엇으로 둘지 표로 정리해 줘.\n2. 보상이 늦게 오는지, 행동이 다음 상태를 바꾸는지 따져 줘.\n3. 다중 슬롯머신(밴딧) 수준으로 충분한지, 상태가 있는 강화학습이 필요한지 판단해 줘.\n4. 실험할 때 탐험 때문에 생기는 비용과 줄이는 방법을 알려 줘.'},
 {t:'② ε-탐욕 실험 확장',use:'이 편의 담판 코드를 바꿔 볼 때',p:'아래 코드는 금고 두 개에서 ε = 0과 ε = 0.1을 비교한다. 다음을 추가해 줘. 1) 금고 수를 5개로 늘리기 2) ε를 0, 0.01, 0.05, 0.1, 0.2, 0.5로 바꾸며 평균 누적 보상 그래프 그리기 3) 시간이 지날수록 ε를 줄이는 방식(ε 감소) 추가 4) 금고 확률이 바뀌는 시점을 여러 번으로 늘리기. 결과를 해석하는 세 문장도 써 줘.'},
 {t:'③ 학습률 α와 바뀌는 세상',use:'최근 결과에 얼마나 무게를 둘지 정할 때',p:'Q ← Q + α(r − Q)에서 α를 고정값으로 쓸 때와 1/n(평균)으로 쓸 때의 차이를, 확률이 바뀌는 금고 실험으로 비교하는 코드를 써 줘. 바뀐 뒤 몇 번 만에 좋은 금고로 갈아타는지 표로 보여 주고, 실제 서비스(추천, 광고)에서 α를 고를 때의 기준을 설명해 줘.'},
 {t:'④ 수업용 탐험·활용 게임',use:'강의에서 학생들과 직접 해 보고 싶을 때',p:'교실에서 종이와 주사위만으로 할 수 있는 "탐험과 활용" 게임을 설계해 줘. 금고 두 개의 숨은 확률, 라운드 수, 중간에 확률을 바꾸는 규칙, 기록표 양식, 끝난 뒤 던질 질문 세 개를 포함해 줘. 대상: 〔예) 고등학생 30명〕'}];
var GL=[
 ['가문','강화학습','행동한 뒤 받는 보상으로 배우는 가문.'],['재료','에이전트','행동을 고르고 배우는 쪽. 이 편에서는 청소봇과 두 연구원.'],['재료','환경','에이전트의 행동에 반응해 상태와 보상을 돌려주는 쪽.'],
 ['재료','상태','지금 어떤 상황인지(s).'],['재료','행동','에이전트가 고르는 것(a).'],['재료','보상','행동 뒤에 받는 점수(r).'],['재료','정책','어떤 상태에서 어떤 행동을 할지 정하는 방식.'],
 ['계산','값','이 행동을 하면 받을 것으로 기대하는 보상(Q).'],['계산','학습률','한 번에 값을 얼마나 고칠지(α).'],['계산','할인율','먼 미래의 보상을 얼마나 줄여서 셀지(γ). 4-9에서 다룬다.'],
 ['전략','탐험','아직 잘 모르는 행동을 일부러 해 보는 것.'],['전략','활용','아는 것 중 값이 가장 큰 행동을 고르는 것.'],['전략','ε-탐욕','ε 비율만큼 무작위로 탐험하고, 나머지는 활용하는 방법.'],['문제','밴딧','상태 없이 여러 선택지 중 하나를 반복해 고르는 가장 단순한 강화학습 문제.']];
var ANALOGY=[
 ['강화학습','해 보고 칭찬·꾸중으로 배우기',2,'보상·처벌 신호로 행동을 바꾸는 동물의 시행착오 학습','동물의 보상 신호가 이 편의 식처럼 "결과 − 예상"을 정확히 계산하는지는 생물마다 연구 중이다'],
 ['탐험과 활용','단골 식당과 새 식당 사이의 고민',2,'먹이를 찾는 동물이 익숙한 곳과 새 곳을 오간다','동물의 탐험에는 호기심·위험 회피 등 여러 동기가 섞여 있다'],
 ['값 Q','"이 가게는 이 정도 맛"이라는 기억',1,'','사람의 기억은 기분이나 최근 경험에 크게 흔들리지만, Q는 정해진 식대로만 바뀐다'],
 ['늦게 오는 보상','시험 결과가 학기 말에야 나오는 것',1,'','어느 공부가 점수에 기여했는지 사람도 정확히 나누지 못한다. 알고리즘은 할인율과 반복으로 나눈다(4-9)']];
var REFS=[
 'Sutton, R. S., &amp; Barto, A. G. (2018). <i>Reinforcement Learning: An Introduction</i> (2nd ed.), 2장(다중 슬롯머신, ε-탐욕, 상수 학습률)·3장(에이전트와 환경). MIT Press.',
 'Watkins, C. J. C. H., &amp; Dayan, P. (1992). Q-learning. <i>Machine Learning</i>, 8, 279–292. <a href="https://doi.org/10.1007/BF00992698" target="_blank" rel="noopener">doi:10.1007/BF00992698</a> — 값 Q (4-9에서 자세히)',
 'Pawar, P. <i>Machine Learning Algorithm Family Tree</i> (인포그래픽). — 강화학습 칸의 구성'];
var TIP={who:'강화학습을 처음 배우는 학습자. 4-2를 읽었으면 지도학습과의 차이가 잘 보인다',goal:'① 에이전트·환경·상태·행동·보상의 고리를 설명한다 ② 지도학습과 다른 세 가지를 예로 든다 ③ 탐험과 활용의 저울질을 실험 결과로 설명한다',time:'읽기 15분 · 금고 당기기와 담판 15분 · Colab 10분',
 plans:[['강의형 30분','01장 고리 5분 → 03장 "직접 당기기"를 학생들이 열 번씩 해 보고 결과 비교 10분 → ε 슬라이더 5분 → 담판 10분.'],['실무 OJT 60분','01·02장 15분 → 프롬프트 ①로 우리 서비스의 배너·추천 문제를 강화학습 언어로 정리 30분 → 탐험 비용 토론 15분.'],['1:1 튜터링','ε = 0으로 여러 번 돌려 나쁜 금고에 묶이는 경우를 직접 찾게 하고, 왜 그런지 값 Q 곡선으로 설명하게 한다.']],
 myths:[['강화학습은 정답을 몰래 보고 배운다','정답이 아니라 보상만 받는다. 안 해 본 행동의 결과는 모른다'],['탐험은 손해일 뿐이다','당장은 손해처럼 보여도, 세상이 바뀌거나 처음 운이 나빴을 때 큰 손해를 막는다'],['보상을 크게 하면 빨리 배운다','보상의 크기보다 무엇에 보상을 주느냐가 중요하다(4-14 보상 설계)']]};
var CODE={title:'잘 나오는 금고만 당길까 — ε-탐욕 담판',sub:'담판 재현 · numpy만 · CPU 몇 초',file:'explore_exploit',
 desc:'담판을 옮겼다. 금고 두 개(70%·30%)가 100번째에 뒤바뀌는 300번 당기기를 시드 300개로 돌려, ε = 0과 ε = 0.1의 평균 누적 보상을 비교한다. 바뀌지 않는 경우와 ε = 0.5도 함께 본다.',
 cap:'실행 결과 (numpy, CPU). 규칙은 브라우저와 같지만 난수 생성기가 달라 숫자는 조금 다르다. 결론(ε = 0.1이 ε = 0과 ε = 0.5보다 많이 받는다)은 같다.'};
