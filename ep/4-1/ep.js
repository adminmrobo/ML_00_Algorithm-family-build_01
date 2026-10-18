/* ══ 4-1 가계도 ══════════════════════════════════════════════ */
var FAM={sup:{n:'지도 가문',c:'info',mat:'입력 X와 정답 y의 짝',q:'"이건 무엇인가?"(분류) · "얼마인가?"(회귀)',br:[['회귀',7],['분류',8]],ex:'아파트 면적 → 매매가, 거래 → 정상/사기',next:'4-2 지도 가문 · 4-6 회귀파 일곱 · 4-7 분류파 여덟 · 4-12 지도 가문의 장부'},
 uns:{n:'비지도 가문',c:'gfp',mat:'입력 X만 (정답 없음)',q:'"비슷한 것끼리 묶이나?"(군집) · "더 적은 축으로 줄일 수 있나?"(차원 축소)',br:[['군집',5],['차원 축소',4]],ex:'고객 구매 기록 → 고객 무리, 설문 50문항 → 두 축 지도',next:'4-3 비지도 가문 · 4-8 비지도 아홉 · 4-13 비지도 가문의 장부'},
 rl:{n:'강화 가문',c:'amber',mat:'행동한 뒤 받는 보상',q:'"어떻게 행동해야 보상의 합이 커지나?"',br:[['Q-Learning · DQN · PPO',3]],ex:'로봇청소기가 벽에 부딪히면 감점, 바둑에서 이기면 +1',next:'4-4 강화 가문 · 4-9 강화 삼대 · 4-14 강화 가문의 장부'},
 ens:{n:'앙상블 연합',c:'stain',mat:'여러 모델의 의견',q:'"여럿의 다수결이 혼자보다 낫나?"',br:[['배깅',3],['부스팅',4]],ex:'트리 25그루의 투표(랜덤 포레스트), 틀린 곳을 고쳐 가는 트리 연쇄(GBM)',next:'4-5 앙상블 연합 · 4-10 앙상블 계보 · 4-15 마지막 담판'}};
var FKEYS=['sup','uns','rl','ens'];

/* ── 히어로: 빛나는 조직도 ── */
heroStage($('heroCv'),{bg:'sc_lab',bgY:.35,fly:'point',robo:'stack',motif:function(ctx,t,W,H){var C=cols(),cx=W/2,top=58,fy=168,by=250;
  ctx.fillStyle='rgba(13,12,28,.72)';rr(ctx,250,26,600,262,16);ctx.fill();
  var xs=[340,480,620,760],keys=FKEYS;
  keys.forEach(function(k,i){var col=C[FAM[k].c],pulse=.55+.35*Math.sin(t*2.4-i*.8);
    ctx.strokeStyle=rgba(col,pulse);ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(cx,top+22);ctx.bezierCurveTo(cx,top+70,xs[i],fy-60,xs[i],fy-20);ctx.stroke();
    var br=FAM[k].br;br.forEach(function(b,j){var bx=br.length===1?xs[i]:xs[i]+(j?34:-34);ctx.strokeStyle=rgba(col,.45);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(xs[i],fy+18);ctx.lineTo(bx,by-12);ctx.stroke();
      ctx.fillStyle=rgba(col,.22);rr(ctx,bx-30,by-12,60,24,6);ctx.fill();ctx.strokeStyle=col;ctx.lineWidth=1.2;ctx.stroke();ctx.font=font(br.length===1?9.5:11,700);ctx.fillStyle='#eceaf3';ctx.textAlign='center';ctx.fillText(br.length===1?'Q·DQN·PPO':b[0],bx,by+4);});
    glow(ctx,xs[i],fy,30,col,.45*pulse);circ(ctx,xs[i],fy,20,'#1c1e2d',col,3);ctx.font=font(12,700);ctx.fillStyle=col;ctx.textAlign='center';ctx.fillText(['지도','비지도','강화','앙상블'][i],xs[i],fy+4);});
  ctx.setLineDash([5,5]);ctx.strokeStyle=rgba(C.stain,.6);ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(760,fy+20);ctx.quadraticCurveTo(620,fy+70,374,by-14);ctx.stroke();ctx.setLineDash([]);
  glow(ctx,cx,top,44,'#d4a54a',.45);circ(ctx,cx,top,30,'#1a1714','#d4a54a',3);ctx.font=font(12,700);ctx.fillStyle='#eceaf3';ctx.textAlign='center';ctx.fillText('대부',cx,top+5);ctx.font=font(10.5,700);var mw=ctx.measureText('머신러닝 집안').width+14;ctx.fillStyle='rgba(15,13,11,.92)';rr(ctx,cx-mw/2,top+34,mw,18,9);ctx.fill();ctx.strokeStyle='#d4a54a';ctx.lineWidth=1;ctx.stroke();ctx.fillStyle='#d4a54a';ctx.fillText('머신러닝 집안',cx,top+47);}});

/* ── 01 겹친 동그라미 ── */
(function(){var cv=$('nestCv'),sel='ml';
 var INFO={ai:'<b>인공지능</b> — 사람의 지적인 일(알아보기, 판단하기, 말하기)을 컴퓨터가 하도록 만드는 기술 전체. 사람이 규칙을 일일이 써 넣는 방법(예: 전문가 시스템)도 여기에 든다.',
  ml:'<b>머신러닝</b> — 규칙을 사람이 다 쓰지 않고 <b>데이터에서 배우는</b> 방법. 이 시리즈의 조직도는 이 동그라미 안의 가문도다. "머신러닝"이라는 말은 Samuel(1959)의 체커 프로그램 논문으로 널리 알려졌다.',
  dl:'<b>딥러닝</b> — 층을 깊게 쌓은 신경망으로 특징까지 데이터에서 배우는 머신러닝의 한 파. 조직도에서는 따로 떨어진 가문이 아니라, 오토인코더(비지도)·DQN(강화)처럼 여러 가문 안에 도구로 들어가 있다.'};
 function draw(){var H=250,W=fit(cv,H),ctx=cv.getContext('2d'),C=cols(),cx=W/2,cy=H/2+6;ctx.clearRect(0,0,W,H);
  [['ai','인공지능',112,C.muted],['ml','머신러닝',80,'#b07cff'],['dl','딥러닝',44,C.info]].forEach(function(o,i){var on=o[0]===sel,R=Math.min(o[2]*1.05,W/2-10)*(i===0?1:1),y=cy+(112-o[2])*.45;
   ctx.fillStyle=rgba(o[3],on?.28:.08);ctx.beginPath();ctx.arc(cx,y,R,0,7);ctx.fill();ctx.strokeStyle=rgba(o[3],on?1:.55);ctx.lineWidth=on?3:1.5;ctx.stroke();
   ctx.font=font(on?14:12.5,700);ctx.fillStyle=on?C.text:C.muted;ctx.textAlign='center';ctx.fillText(o[1],cx,y-R+20);});
  stamp(ctx,W,'개념 도식');}
 function ui(){$('nestInfo').innerHTML=INFO[sel];draw();}
 seg('#m1 .choice .btn',function(v){sel=v;ui();});ui();onRedraw(draw);})();

/* ── 02 움직이는 조직도 ── */
(function(){var cv=$('treeCv'),sel='sup',t=0;
 function draw(){var H=330,W=fit(cv,H),ctx=cv.getContext('2d'),C=cols(),cx=W/2,top=40,fy=140,by=226,xs=FKEYS.map(function(_,i){return W*(0.14+0.24*i);});ctx.clearRect(0,0,W,H);
  FKEYS.forEach(function(k,i){var f=FAM[k],col=C[f.c],on=k===sel,a=on?1:.35,x=xs[i];
   ctx.strokeStyle=rgba(col,a);ctx.lineWidth=on?3.5:2;ctx.beginPath();ctx.moveTo(cx,top+20);ctx.bezierCurveTo(cx,top+60,x,fy-60,x,fy-22);ctx.stroke();
   if(on&&!REDUCE){var u=(t*.6)%1,px=cx+(x-cx)*u,py=top+20+(fy-22-top-20)*u;glow(ctx,px,py,12,col,.9);}
   f.br.forEach(function(b,j){var n=f.br.length,bx=n===1?x:x+(j?1:-1)*Math.min(58,W*.055),bw=n===1?Math.min(150,W*.2):Math.min(96,W*.1);
    ctx.strokeStyle=rgba(col,a*.8);ctx.lineWidth=on?2.5:1.5;ctx.beginPath();ctx.moveTo(x,fy+22);ctx.lineTo(bx,by-16);ctx.stroke();
    ctx.fillStyle=rgba(col,on?.22:.07);rr(ctx,bx-bw/2,by-16,bw,40,8);ctx.fill();ctx.strokeStyle=rgba(col,a);ctx.lineWidth=1.3;ctx.stroke();
    ctx.textAlign='center';ctx.font=font(W<640?10.5:12.5,700);ctx.fillStyle=on?C.text:C.muted;ctx.fillText(b[0],bx,by+2);ctx.font=font(10.5);ctx.fillText('알고리즘 '+b[1],bx,by+17);});
   if(on)glow(ctx,x,fy,34,col,.4);circ(ctx,x,fy,22,C.panel2,rgba(col,a),on?3:1.5);ctx.font=font(W<640?10.5:12.5,700);var tw=ctx.measureText(f.n).width+12;ctx.fillStyle=C.panel;rr(ctx,x-tw/2,fy-46,tw,20,6);ctx.fill();ctx.fillStyle=rgba(col,on?1:.7);ctx.textAlign='center';ctx.fillText(f.n,x,fy-31);ctx.font=font(10.5);ctx.fillStyle=C.muted;ctx.fillText(['정답','데이터만','보상','의견'][i],x,fy+4);});
  var ly=by+44,ea=sel==='ens'||sel==='sup'?.9:.35;ctx.setLineDash([5,5]);ctx.strokeStyle=rgba(C.stain,ea);ctx.lineWidth=1.6;ctx.beginPath();
  ctx.moveTo(xs[3],by+26);ctx.lineTo(xs[3],ly);ctx.lineTo(xs[0],ly);ctx.lineTo(xs[0],by+26);ctx.stroke();ctx.setLineDash([]);
  ctx.font=font(11);ctx.fillStyle=rgba(C.stain,ea+.1);ctx.textAlign='center';ctx.fillText('앙상블로 만든 지도학습 모델 (랜덤 포레스트, GBM …)',(xs[0]+xs[3])/2,ly+16);
  glow(ctx,cx,top,30,C.c_doc,.4);circ(ctx,cx,top,20,C.panel2,C.c_doc,3);ctx.font=font(12.5,700);ctx.fillStyle=C.text;ctx.fillText('대부 · 머신러닝 집안',cx,top-26);
  stamp(ctx,W,'인포그래픽 구조를 다시 그린 가계도');}
 function ui(){var f=FAM[sel];$('treeInfo').innerHTML='<b style="color:var(--'+f.c+')">'+f.n+'</b> · 배우는 재료: '+f.mat+'<br>질문: '+f.q+'<br>예: '+f.ex+'<br><span class="muted">이 가문을 다시 만나는 곳: '+f.next+'</span>';draw();}
 document.querySelectorAll('#m2 .fambtn').forEach(function(b){b.insertBefore(NPC.crest(b.getAttribute('data-v'),3,FAM[b.getAttribute('data-v')].n+' 문장'),b.firstChild);});
 seg('#m2 .fambtn',function(v){sel=v;ui();});ui();onRedraw(draw);
 if(!REDUCE)onTick(cv,function(dt){t+=dt;draw();});})();

/* ── 04 데이터 카드 배정 ── */
var CARDS=[
 {t:'아파트 면적, 층, 역까지 거리 → 매매가',a:'reg',why:'정답(매매가)이 붙어 있고 숫자다. 지도학습 · 회귀.'},
 {t:'거래 기록 → 정상 / 사기',a:'cls',why:'정답(정상·사기)이 붙어 있고 이름표다. 지도학습 · 분류.'},
 {t:'고객 구매 기록만 있다. 비슷한 고객끼리 묶고 싶다',a:'clu',why:'정답 열이 없다. 비슷한 것끼리 묶는다. 비지도학습 · 군집.'},
 {t:'로봇청소기가 벽에 부딪히면 −1, 먼지를 치우면 +1',a:'rl',why:'정답 대신 행동 뒤의 보상이 있다. 강화학습.'},
 {t:'설문 50문항 답을 두 개의 축으로 줄여 지도로 그리고 싶다',a:'dim',why:'정답 없이 특징 수를 줄인다. 비지도학습 · 차원 축소.'},
 {t:'사진 → 고양이 / 개',a:'cls',why:'정답(고양이·개)이 붙은 사진으로 배운다. 지도학습 · 분류.'},
 {t:'바둑을 두며 이기면 +1, 지면 −1',a:'rl',why:'수마다 정답이 없고 판이 끝나야 보상이 온다. 강화학습.'},
 {t:'지난 1년 매출로 내일 매출을 맞힌다',a:'reg',alt:'cls',why:'숫자(매출액)를 맞히면 회귀다. 그런데 "목표를 넘을까"로 물으면 분류도 된다. 질문이 파를 정한다. 아래 담판을 보자.'}];
var SLOTN={reg:'지도 · 회귀',cls:'지도 · 분류',clu:'비지도 · 군집',dim:'비지도 · 차원 축소',rl:'강화학습'};
(function(){var host=$('cards'),pick=-1,done={};
 npcLine($('antHost'),['ant','card','ant','card','ant'],3,'심부름꾼 개미 <b>나르미</b>들이 신입 카드를 날라 왔다. 카드를 하나 골라 맞는 가문에 들여보내자.');
 function render(){host.innerHTML=CARDS.map(function(c,i){var d=done[i],cls=d?(d.ok?'ok':'no'):'';return '<button class="dcard '+cls+'" data-i="'+i+'" aria-pressed="'+(i===pick)+'"><span>'+c.t+'</span><span class="res">'+(d?(d.ok?'✓ ':'✗ ')+SLOTN[d.v]:'')+'</span></button>';}).join('');
  var n=Object.keys(done).length,ok=Object.keys(done).filter(function(k){return done[k].ok}).length;$('cardScore').textContent=n?('배정 '+n+'/8 · 맞음 '+ok):'';}
 host.addEventListener('click',function(e){var b=e.target.closest('.dcard');if(!b)return;pick=+b.getAttribute('data-i');render();$('cardInfo').innerHTML='고른 카드: <b>'+CARDS[pick].t+'</b> — 아래에서 가문·파를 누르세요.';});
 $('slots').addEventListener('click',function(e){var b=e.target.closest('[data-v]');if(!b)return;if(pick<0){$('cardInfo').textContent='먼저 카드를 하나 고르세요.';return;}
  var c=CARDS[pick],v=b.getAttribute('data-v'),ok=v===c.a||v===c.alt;done[pick]={v:v,ok:ok};
  $('cardInfo').innerHTML=(ok?'<b>맞아요.</b> ':'<b style="color:var(--eye)">다시 생각해 봐요.</b> ')+c.why;pick=-1;render();});
 $('cardReset').addEventListener('click',function(){done={};pick=-1;render();$('cardInfo').textContent='카드를 하나 고른 뒤, 아래에서 가문·파를 누르세요.';});
 render();})();

/* ── 담판: 같은 데이터, 다른 질문 ── */
function storeStats(o,target){return statGrid([[pct(o.acc),'초파리(분류) · 목표 '+target+' 달성 여부 맞힌 비율','f'],[pct(o.base),'기준선 · "늘 '+(o.maj?'달성':'미달')+'"이라고만 답할 때'],[fx(o.mae,1),'Money-Robo(회귀) · 평균 오차(만 원)','r'],[fx(o.maeB,1),'기준선 · "늘 평균 매출"이라고만 답할 때']]);}
Duel('d1',{title:'같은 매출 데이터, 다른 질문',q:'가게의 하루 매출 기록 120일치(광고비, 주말 여부, 매출). 80일로 배우고 처음 보는 40일로 잰다. 둘은 같은 데이터에 서로 다른 질문을 던진다.',
 fly:['분류 · 목표(100만 원)를 넘을까','되나 안 되나만 알면 돼.'],robo:['회귀 · 매출이 얼마일까','숫자로 말해야 돈이 되지.'],roboMood:'chart',
 run:async function(p){p(.4);await wait(200);var o=STORE.duel(100);p(1);
  return {winner:'d',measure:'처음 보는 40일에서 초파리 쪽은 '+pct(o.acc)+'를 맞혔어요(기준선 '+pct(o.base)+'). Money-Robo 쪽은 평균 '+fx(o.mae,1)+'만 원 빗나갔어요(기준선 '+fx(o.maeB,1)+'만 원). 둘 다 기준선을 넉넉히 이겼어요.',
   verdict:'장부의 단위가 달라 견줄 수 없다. 하나는 맞힌 비율, 하나는 빗나간 금액이다. 둘 다 자기 질문에 잘 답했다. 이 구역은 나눠 갖는다.',key:'가문을 고르는 건 데이터가 아니라 질문이다.',
   render:function(b){b.innerHTML=storeStats(o,100);}};},
 alts:[{label:'회귀 예측으로 달성 여부도 판정하면?',run:async function(box){var o=STORE.duel(100);
   box.innerHTML=statGrid([[pct(o.via),'Money-Robo의 매출 예측이 100 이상이면 "달성"으로 바꿔 판정','r'],[pct(o.acc),'초파리의 분류 모델','f']])+say('asst','smile','회귀로 얻은 숫자를 문턱에 대 보면 분류 답도 나와요. 거의 비슷해요. 회귀는 더 많은 정보(얼마나)를 주는 대신, 문턱을 사람이 정해야 해요.');}},
  {label:'목표를 130만 원으로 올리면?',run:async function(box){var o=STORE.duel(130);
   box.innerHTML=storeStats(o,130)+say('fly','point','정확도 '+pct(o.acc)+'? 근데 "늘 미달"이라고만 해도 '+pct(o.base)+'잖아. 목표를 넘는 날이 전체의 '+pct(o.pos,0)+'뿐이면 정확도는 속기 쉬워. 이건 4-12에서 다시 따지자.');}}]});

/* ══ 확인 문제 ══ */
var QUIZ={q1:[
 {q:'가문을 가르는 기준으로 가장 알맞은 것은?',o:[['알고리즘이 무엇을 보고 배우나(정답, 데이터만, 보상)',1,'02장 조직도의 가지가 바로 이 기준이다. 앙상블은 여기에 "모델 여럿을 묶는다"는 기술이 더해진 것이다.'],['알고리즘이 만들어진 연도',0,'연도는 계보(2부)에서 보지만 가문을 가르지는 않는다. Q-Learning(1989)과 PPO(2017)는 연도가 달라도 같은 강화학습 가문이다.'],['모델의 크기(가중치 수)',0,'선형 회귀도, 큰 신경망도 정답이 있으면 지도학습이다. 크기는 가문과 상관없다.']]},
 {q:'랜덤 포레스트가 지도학습과 앙상블 두 곳에 나오는 까닭은?',o:[['앙상블 기법(배깅)으로 만든 지도학습 모델이라서',1,'정답 있는 데이터로 배우니 지도학습이고, 트리 여러 그루를 묶으니 앙상블이다. 이중 소속이다.'],['인포그래픽의 실수라서',0,'실수가 아니다. GBM, XGBoost도 같은 까닭으로 두 곳에 실려 있다.'],['비지도학습에도 쓰여서',0,'랜덤 포레스트는 보통 정답이 있는 분류·회귀에 쓴다.']]},
 {q:'"내일 매출이 목표를 넘을까?"를 맞히는 문제는?',o:[['지도학습 · 분류',1,'정답(넘음/못 넘음)이 이름표다. 같은 데이터로 "매출이 얼마일까?"를 물으면 회귀가 된다.'],['비지도학습 · 군집',0,'지난 기록에 실제로 넘었는지가 적혀 있으면 정답이 있는 셈이다. 지도학습이다.'],['강화학습',0,'행동에 따른 보상을 받는 문제가 아니라, 기록과 정답으로 배우는 문제다.']]}]};

/* ══ 공통 B·C·D·E·F 데이터 ══ */
var PROMPTS=[
 {t:'① 내 데이터는 어느 가문?',use:'내 업무 데이터에 맞는 가문과 파를 고를 때',p:'너는 머신러닝 교육과 현업 적용에 밝은 멘토다. 내 데이터와 하고 싶은 일을 보고, 지도학습(회귀·분류), 비지도학습(군집·차원 축소), 강화학습 중 어디에 해당하는지 판단해 줘.\n\n- 내 데이터: 〔예) 쇼핑몰 주문 기록 2년치, 열: 날짜·고객ID·상품·금액·반품 여부〕\n- 하고 싶은 일: 〔예) 반품할 주문을 미리 알고 싶다〕\n\n1. 정답 열(y)이 있는지, 있다면 숫자인지 이름표인지 짚어 줘.\n2. 가문과 파를 고르고 이유를 세 문장으로 써 줘.\n3. 같은 데이터로 질문을 바꾸면 다른 가문이 되는 예를 두 개 들어 줘.\n4. 처음 시도할 가장 단순한 모델과 비교할 기준선을 하나씩 추천해 줘.'},
 {t:'② 카드 문제 만들기',use:'수업에서 쓸 "어느 가문?" 연습 문제가 필요할 때',p:'머신러닝 입문 수업용 연습 문제를 만들어 줘. 일상·업무 상황 카드 12장을 만들고, 각 카드가 지도학습 회귀/지도학습 분류/비지도 군집/비지도 차원 축소/강화학습 중 어디인지 정답과 한 줄 해설을 붙여 줘. 그중 2장은 질문을 어떻게 잡느냐에 따라 두 파가 모두 정답이 되는 "헷갈리는 카드"로 만들고, 왜 둘 다 맞는지 설명해 줘. 대상: 〔예) 데이터 분석을 처음 배우는 직장인〕'},
 {t:'③ 같은 데이터, 다른 질문 실험',use:'이 편의 담판 코드를 내 데이터로 바꿀 때',p:'아래 코드는 같은 매출 데이터로 분류(목표 달성 여부)와 회귀(매출액)를 각각 학습하고, 처음 보는 데이터에서 기준선과 비교한다. 이 구조를 내 데이터에 맞게 바꿔 줘.\n\n- 내 데이터 파일: 〔예) sales.csv, 열: date, ad_cost, weekday, sales〕\n- 목표 문턱: 〔예) 매출 300만 원〕\n\n데이터 불러오기, 훈련/시험 나누기(시간 순서가 있으면 앞 기간으로 배우고 뒤 기간으로 재기), 분류·회귀·각 기준선 점수를 표로 출력하는 부분까지 써 줘.'},
 {t:'④ 조직도 확장 조사',use:'인포그래픽에 없는 가문(반지도·자기지도 등)을 더 알고 싶을 때',p:'머신러닝 알고리즘 가문도(지도·비지도·강화·앙상블)에 없는 학습 방식으로 반지도학습, 자기지도학습, 전이학습, 온라인 학습이 있다고 한다. 각각을 "무엇을 보고 배우나" 기준으로 한 문단씩 설명하고, 네 가문 중 어디와 가장 가까운지, 대표적인 예를 하나씩 들어 줘. 특정 논문을 인용할 때는 실제로 있다고 확신하는 것만 쓰고, 확실하지 않으면 "확인 필요"라고 표시해 줘.'}];
var GL=[
 ['큰 그림','인공지능','사람의 지적인 일을 컴퓨터가 하도록 만드는 기술 전체.'],
 ['큰 그림','머신러닝','규칙을 사람이 다 쓰지 않고 데이터에서 배우는 방법. 이 조직도의 범위.'],
 ['큰 그림','딥러닝','층을 깊게 쌓은 신경망으로 특징까지 배우는 머신러닝의 한 파. 여러 가문 안에 도구로 쓰인다.'],
 ['큰 그림','생성형 AI','글·그림 등을 새로 만들어 내는 AI. 이 조직도의 범위 밖이며 3-8에서 뼈대를 다룬다.'],
 ['가문','지도학습','입력과 정답의 짝으로 배우는 가문. 파: 회귀, 분류.'],
 ['가문','비지도학습','정답 없이 입력만으로 구조를 찾는 가문. 파: 군집, 차원 축소.'],
 ['가문','강화학습','행동한 뒤 받는 보상으로 배우는 가문.'],
 ['가문','앙상블','모델 여럿의 의견을 묶어 하나의 답을 내는 기술. 파: 배깅, 부스팅.'],
 ['파','회귀','숫자를 예측하는 지도학습.'],
 ['파','분류','이름표(범주)를 예측하는 지도학습.'],
 ['파','군집','비슷한 데이터끼리 묶는 비지도학습.'],
 ['파','차원 축소','특징 수를 줄여 요약하거나 그림으로 보는 비지도학습.'],
 ['파','배깅','데이터를 무작위로 다시 뽑아 만든 모델 여럿을 평균·투표하는 앙상블.'],
 ['파','부스팅','앞 모델이 틀린 곳을 다음 모델이 고치도록 차례로 쌓는 앙상블.'],
 ['데이터','정답','데이터마다 붙은 맞히려는 값(y). 레이블이라고도 한다.'],
 ['데이터','특징','판단의 단서가 되는 입력 값(X).'],
 ['데이터','보상','강화학습에서 행동한 뒤 받는 점수.'],
 ['평가','기준선','가장 단순한 답(늘 평균, 늘 많은 쪽). 모든 모델은 이것부터 이겨야 한다.']];
var ANALOGY=[
 ['지도학습','답지가 있는 문제집으로 공부하기',2,'냄새와 전기충격을 짝지어 그 냄새를 피하게 되는 연상 학습','초파리가 받는 것은 "정답 이름표"가 아니라 겪은 사건 자체다. 그래서 강화학습과 경계가 겹친다'],
 ['비지도학습','답지 없이 비슷한 물건끼리 서랍에 정리하기',1,'','묶는 기준이 여러 가지라 "맞는 정리"가 하나로 정해지지 않는다(4-13)'],
 ['강화학습','해 보고 칭찬·꾸중으로 배우기',2,'보상·처벌 신호로 행동을 바꾸는 학습','보상이 늦게 오고, 내 행동이 다음 상황을 바꾼다. 칭찬처럼 바로 오지 않는다'],
 ['앙상블','위원회 다수결',1,'','위원들이 같은 실수를 하면 투표해도 나아지지 않는다(4-5)'],
 ['조직도','집안 가계도',1,'','가계도와 달리 한 알고리즘이 두 가문에 동시에 속할 수 있다(랜덤 포레스트)']];
var REFS=[
 'Pawar, P. <i>Machine Learning Algorithm Family Tree</i> (인포그래픽). — 조직도의 바탕 구조',
 'Samuel, A. L. (1959). Some studies in machine learning using the game of checkers. <i>IBM Journal of Research and Development</i>, 3(3), 210–229. <a href="https://doi.org/10.1147/rd.33.0210" target="_blank" rel="noopener">doi:10.1147/rd.33.0210</a> — 01장',
 'LeCun, Y., Bengio, Y., &amp; Hinton, G. (2015). Deep learning. <i>Nature</i>, 521, 436–444. <a href="https://doi.org/10.1038/nature14539" target="_blank" rel="noopener">doi:10.1038/nature14539</a> — 01장',
 'Hastie, T., Tibshirani, R., &amp; Friedman, J. (2009). <i>The Elements of Statistical Learning</i> (2nd ed.). Springer. — 지도·비지도학습 전반',
 'Sutton, R. S., &amp; Barto, A. G. (2018). <i>Reinforcement Learning: An Introduction</i> (2nd ed.). MIT Press. — 강화학습',
 'Breiman, L. (1996). Bagging predictors. <i>Machine Learning</i>, 24(2), 123–140. <a href="https://doi.org/10.1007/BF00058655" target="_blank" rel="noopener">doi:10.1007/BF00058655</a> — 앙상블(배깅)',
 'Freund, Y., &amp; Schapire, R. E. (1997). A decision-theoretic generalization of on-line learning and an application to boosting. <i>Journal of Computer and System Sciences</i>, 55(1), 119–139. <a href="https://doi.org/10.1006/jcss.1997.1504" target="_blank" rel="noopener">doi:10.1006/jcss.1997.1504</a> — 앙상블(부스팅)'];
var TIP={who:'머신러닝을 처음 배우는 대학생·직장인·고등학생. 수식 없이 읽을 수 있다',goal:'① 네 가문을 "무엇을 보고 배우나"로 구별한다 ② 데이터 상황을 보고 가문과 파를 고른다 ③ 같은 데이터라도 질문에 따라 파가 바뀐다는 것을 예로 설명한다',time:'읽기 15분 · 카드 배정과 담판 10분 · Colab 10분',
 plans:[['강의형 30분','01장 동그라미 5분 → 02장 조직도 10분 → 04장 카드를 학생들이 손으로 배정 10분 → 담판 결과 맞혀 보기 5분.'],['실무 OJT 60분','02·03장 15분 → "우리 팀 데이터 카드 8장" 만들어 배정 20분 → 담판 코드를 사내 매출 데이터로 바꿔 보기 25분.'],['1:1 튜터링','카드 여덟 장을 먼저 풀게 하고, 틀린 카드만 골라 02장 조직도의 해당 가지를 다시 본다. 헷갈리는 카드(8번)는 꼭 말로 설명하게 한다.']],
 myths:[['딥러닝은 머신러닝과 다른 분야다','딥러닝은 머신러닝의 한 파다. 조직도에서는 여러 가문 안에 도구로 들어간다'],['앙상블은 데이터 종류에 따른 다섯째 가문이다','앙상블은 모델을 묶는 기술이다. 그래서 지도학습 칸과 겹친다'],['정답이 숫자면 무조건 회귀다','질문을 "문턱을 넘을까"로 바꾸면 같은 데이터로 분류를 한다'],['강화학습은 로봇에만 쓴다','추천, 게임, 언어 모델 미세조정 등 "행동 → 보상" 구조면 어디든 쓴다']]};
var CODE={title:'같은 데이터, 다른 질문 — 분류와 회귀를 나란히',sub:'담판 재현 · numpy, scikit-learn · CPU 몇 초',file:'same_data_two_questions',
 desc:'이 편의 담판을 그대로 옮겼다. 규칙으로 만든 매출 데이터 120일치로 분류(목표 달성 여부)와 회귀(매출액)를 각각 학습하고, 처음 보는 40일에서 기준선과 비교한다. 마지막에 회귀 예측을 문턱에 대어 분류 답으로 바꿔 본다.',
 cap:'실행 결과 (scikit-learn 1.x, CPU). 데이터 규칙은 브라우저와 같지만 난수 생성기가 달라 숫자는 조금 다르다. 결론(둘 다 기준선을 이기고, 단위가 달라 견줄 수 없다)은 같다.'};
