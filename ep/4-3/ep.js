/* ══ 4-3 비지도학습 ══════════════════════════════════════════════ */
var CU=UNS.cust(false),CZ=UNS.std(CU);
function gcol(C,g){return [C.info,C.gfp,C.orange,C.stain][g]}
function scatter(ctx,W,H,D,colorFn,opt){opt=opt||{};var C=cols(),l=46,r=W-12,tp=12,bt=H-34;
  function px(v){return l+v/11*(r-l)}function py(p){return bt-p/17*(bt-tp)}
  ctx.strokeStyle=C.rule;ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(l,tp);ctx.lineTo(l,bt);ctx.lineTo(r,bt);ctx.stroke();
  ctx.font=font(11);ctx.fillStyle=C.muted;ctx.textAlign='center';ctx.fillText('한 달 방문 횟수',(l+r)/2,H-6);[0,5,10].forEach(function(v){ctx.fillText(v,px(v),bt+14);});
  ctx.textAlign='right';[0,5,10,15].forEach(function(v){ctx.fillText(v,l-6,py(v)+4);});ctx.save();ctx.translate(12,(tp+bt)/2);ctx.rotate(-Math.PI/2);ctx.textAlign='center';ctx.fillText('평균 결제액 (만 원)',0,0);ctx.restore();
  if(opt.hlines)opt.hlines.forEach(function(q){ctx.setLineDash([5,4]);ctx.strokeStyle=C.c_fly;ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(l,py(q));ctx.lineTo(r,py(q));ctx.stroke();ctx.setLineDash([]);});
  D.forEach(function(d,i){circ(ctx,px(d.x[0]),py(Math.min(16.5,d.x[1])),3.4,colorFn(d,i));});return {px:px,py:py};}

/* ── 히어로 ── */
heroStage($('heroCv'),{bg:'sc_lab',bgY:.75,fly:'point',robo:'count',motif:function(ctx,t,W,H){var C=cols(),k=(Math.sin(t*.7)+1)/2,cx=[430,560,680],cy=[200,150,90];
  ctx.fillStyle='rgba(13,12,28,.72)';rr(ctx,290,24,520,260,16);ctx.fill();var r=ML.R(5);
  CU.forEach(function(d,i){var gx=330+d.x[0]/11*440,gy=270-d.x[1]/17*230,tx=gx,ty=gy,jx=(r()-.5)*420,jy=(r()-.5)*200,x=550+jx*(1-k)+(tx-550)*k,y=160+jy*(1-k)+(ty-160)*k;
   ctx.fillStyle=k>.6?[ '#82b8ff','#5ee39c','#ff9a4d'][d.y]:'rgba(200,198,216,.8)';ctx.fillRect(Math.round(x)-3,Math.round(y)-3,6,6);});
  if(k>.6){[[2,3],[8,4],[6,12]].forEach(function(c,j){var x=330+c[0]/11*440,y=270-c[1]/17*230;glow(ctx,x,y,22,['#82b8ff','#5ee39c','#ff9a4d'][j],.6);ctx.font=font(20,700);ctx.fillStyle='#eceaf3';ctx.textAlign='center';ctx.fillText('★',x,y+7);});}
  ctx.font=font(13,700);ctx.fillStyle='#5ee39c';ctx.textAlign='center';ctx.fillText(k>.6?'스스로 찾은 세 무리':'정답 없는 점들',550,46);}});

/* ── 01 정답 보기·가리기 ── */
(function(){var cv=$('hideCv'),show=false;
 npcLine($('guestHost'),['g1','g2','g3'],3,'<b>손님들</b>: 점 하나가 고객 한 명이다. 이름표(등급)는 조수만 알고 있다.');
 function draw(){var H=260,W=fit(cv,H),ctx=cv.getContext('2d'),C=cols();ctx.clearRect(0,0,W,H);scatter(ctx,W,H,CU,function(d){return show?gcol(C,d.y):rgba(C.muted,.75)});
  if(show){ctx.font=font(11.5,700);ctx.textAlign='left';UNS.GN.forEach(function(n,g){ctx.fillStyle=gcol(C,g);ctx.fillText('● '+n,W-90,26+g*16);});}stamp(ctx,W-(show?96:0),'예시 데이터');}
 seg('#m1 .pills button',function(v){show=v==='show';draw();});draw();onRedraw(draw);})();

/* ── 02 K-평균 한 단계씩 ── */
(function(){var cv=$('kmCv'),k=3,res,st,ph,auto=false,acc=0;
 function reset(){res=ML.kmeans(CZ,k,1,30);st=0;ph=0;auto=false;draw();ui();}
 var mu=[ML.mean(CU.map(function(d){return d.x[0]})),ML.mean(CU.map(function(d){return d.x[1]}))],sd=[0,1].map(function(j){return Math.sqrt(ML.mean(CU.map(function(d){return Math.pow(d.x[j]-mu[j],2)})))});
 function unz(c){return [c[0]*sd[0]+mu[0],c[1]*sd[1]+mu[1]]}
 function draw(){var H=300,W=fit(cv,H),ctx=cv.getContext('2d'),C=cols();ctx.clearRect(0,0,W,H);var s=res.steps[Math.min(st,res.steps.length-1)],showA=ph>0||st>0;
  var ax=scatter(ctx,W,H,CU,function(d,i){return showA?gcol(C,s.a[i]):rgba(C.muted,.7)});
  s.C.forEach(function(c,j){var u=unz(c),x=ax.px(u[0]),y=ax.py(u[1]);glow(ctx,x,y,18,gcol(C,j),.5);ctx.font=font(22,700);ctx.fillStyle=gcol(C,j);ctx.textAlign='center';ctx.fillText('★',x,y+8);ctx.strokeStyle=C.text;ctx.lineWidth=.8;ctx.strokeText('★',x,y+8);});
  stamp(ctx,W,'예시 데이터 · 표준화한 거리');}
 function ui(){var last=st>=res.steps.length-1,s=res.steps[Math.min(st,res.steps.length-1)];
  $('kmInfo').innerHTML=(st===0&&ph===0?'<b>시작.</b> 중심 별 '+k+'개를 점 가운데 아무 데나 놓았다. "한 단계"를 누르면 점마다 가장 가까운 별의 색을 입는다.':
   last?'<b>끝 ('+(res.steps.length)+'단계).</b> 별을 옮겨도 무리가 더는 바뀌지 않는다. 무리 안 거리 제곱합 '+fx(res.sse,1)+'. 숨겨 둔 등급과의 겹침 '+pct(ML.overlap(res.a,CU.map(function(d){return d.y}),k===3?3:3))+(k!==3?' (k가 3이 아니면 등급 세 개와 짝이 맞지 않아 겹침이 낮게 나온다)':'')+'.':
   (ph===1?'<b>단계 '+(st+1)+' · ① 붙이기.</b> 점마다 가장 가까운 별의 무리에 들어갔다.':'<b>단계 '+(st+1)+' · ② 옮기기.</b> 별이 자기 무리 점들의 평균 자리로 옮겨 갔다.'));}
 function step(){if(st>=res.steps.length-1){auto=false;return;}if(ph===0){ph=1;}else{st++;ph=1;}draw();ui();}
 $('kmStep').addEventListener('click',function(){auto=false;step();});$('kmAuto').addEventListener('click',function(){auto=true;});$('kmReset').addEventListener('click',reset);
 seg('#m2 .pills button',function(v){k=+v;reset();});
 onTick(cv,function(dt){if(!auto)return;acc+=dt;if(acc>.5){acc=0;step();}});reset();onRedraw(draw);})();

/* ── 03 주성분 분석 ── */
(function(){var cv=$('pcaCv'),P3=CU.map(function(d){return [d.x[0],d.x[1],d.stay]}),mu=[0,1,2].map(function(j){return ML.mean(P3.map(function(p){return p[j]}))}),sd=[0,1,2].map(function(j){return Math.sqrt(ML.mean(P3.map(function(p){return Math.pow(p[j]-mu[j],2)})))});
 var Z=P3.map(function(p){return p.map(function(v,j){return (v-mu[j])/sd[j]})}),pc=ML.pca(Z,3),ang=0.6,flat=0,target=0;
 $('pcaBars').innerHTML=pc.ratio.map(function(v,i){return '<div class="row"><span>'+['첫째 축','둘째 축','셋째 축'][i]+'</span><div class="tr"><div class="fl" style="width:'+(v*100)+'%;background:var(--'+(i<2?'gfp':'muted')+')"></div></div><span class="v">'+pct(v)+'</span></div>';}).join('')+'<p class="muted" style="font-size:13px;margin:8px 0 0">축 두 개에 퍼짐의 '+pct(pc.ratio[0]+pc.ratio[1])+'가 담긴다. 세 특징은 단위를 맞춘(표준화) 뒤 계산했다.</p>';
 function draw(){var H=280,W=fit(cv,H),ctx=cv.getContext('2d'),C=cols(),cx=W/2,cy=H/2+10,S=Math.min(W,H)*.23;ctx.clearRect(0,0,W,H);
  var ca=Math.cos(ang),sa=Math.sin(ang),el=.45;
  function p3(v){var x=v[0]*ca-v[2]*sa,z=v[0]*sa+v[2]*ca,y=v[1];var Y=y*Math.cos(el)-z*Math.sin(el);return [cx+x*S,cy-Y*S];}
  if(flat<1){[[1,0,0,'방문'],[0,1,0,'결제액'],[0,0,1,'머문 시간']].forEach(function(a){var o=p3([0,0,0]),e=p3([a[0]*2.2,a[1]*2.2,a[2]*2.2]);ctx.strokeStyle=rgba(C.muted,(1-flat)*.8);ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(o[0],o[1]);ctx.lineTo(e[0],e[1]);ctx.stroke();ctx.fillStyle=rgba(C.muted,1-flat);ctx.font=font(11);ctx.textAlign='center';ctx.fillText(a[3],e[0],e[1]-4);});}
  Z.forEach(function(z,i){var a=p3(z),b=[cx+pc.proj[i][0]*S*.85,cy-pc.proj[i][1]*S*.85],x=a[0]+(b[0]-a[0])*ease(flat),y=a[1]+(b[1]-a[1])*ease(flat);circ(ctx,x,y,3,gcol(C,CU[i].y));});
  if(flat>.98){ctx.strokeStyle=C.rule;ctx.beginPath();ctx.moveTo(14,cy);ctx.lineTo(W-14,cy);ctx.moveTo(cx,14);ctx.lineTo(cx,H-14);ctx.stroke();ctx.font=font(11);ctx.fillStyle=C.muted;ctx.textAlign='right';ctx.fillText('첫째 축 →',W-16,cy-6);ctx.textAlign='left';ctx.fillText('↑ 둘째 축',cx+6,20);}
  stamp(ctx,W,flat>.98?'평면으로 펼친 결과':'세 특징 (표준화)');}
 $('pcaGo').addEventListener('click',function(){target=1;if(REDUCE){flat=1;draw();}});$('pcaBack').addEventListener('click',function(){target=0;if(REDUCE){flat=0;draw();}});
 onTick(cv,function(dt){if(flat<1&&target===0)ang+=dt*.5;flat+=(target-flat)*Math.min(1,dt*3);if(Math.abs(target-flat)<.002)flat=target;draw();});draw();onRedraw(draw);})();

/* ── 담판 ── */
function duelBox(o){return statGrid([[pct(o.fo),'초파리 · 결제액으로 3등분 · 등급과 겹침','f'],[pct(o.ko),'Money-Robo · K-평균 · 등급과 겹침','r']])+
  '<div class="two" style="margin-top:12px"><figure style="margin:0"><canvas class="fig" id="cA" aria-label="결제액 문턱 두 개로 나눈 무리"></canvas><figcaption class="muted" style="font-size:13px">초파리 · 결제액 문턱 '+fx(o.q[0],1)+' · '+fx(o.q[1],1)+'만 원</figcaption></figure><figure style="margin:0"><canvas class="fig" id="cB" aria-label="K-평균이 찾은 무리"></canvas><figcaption class="muted" style="font-size:13px">Money-Robo · K-평균 (k = 3)</figcaption></figure></div>';}
function drawDuel(o,ida,idb){function dr(){[[ida,o.fa,o.q],[idb,o.ka,null]].forEach(function(s){var cv=$(s[0]);if(!cv)return;var H=230,W=fit(cv,H),ctx=cv.getContext('2d'),C=cols();ctx.clearRect(0,0,W,H);
  var perm=[0,1,2];var best=-1;[[0,1,2],[0,2,1],[1,0,2],[1,2,0],[2,0,1],[2,1,0]].forEach(function(p){var c=0;s[1].forEach(function(a,i){if(p[a]===o.D[i].y)c++;});if(c>best){best=c;perm=p;}});
  scatter(ctx,W,H,o.D,function(d,i){var g=perm[s[1][i]];return g===d.y?gcol(C,g):C.eye;},{hlines:s[2]});});}setTimeout(dr,0);onRedraw(dr);}
Duel('d3',{title:'정답 없이 고객 무리 찾기',q:'고객 180명을 세 무리로 나눈다. 정답(등급)은 조수만 안다. 나눈 결과가 숨겨 둔 등급과 얼마나 겹칠까?',
 fly:['결제액만 보고 3등분','돈 쓰는 크기가 등급이지. 기준이 분명해야 믿지.'],robo:['K-평균 (k = 3)','방문이랑 결제를 둘 다 넣고 알고리즘한테 맡겨.'],roboMood:'count',
 run:async function(p){p(.4);await wait(200);var o=UNS.duel(false);p(1);
  return {winner:o.ko>o.fo?'r':(o.ko<o.fo?'f':'d'),big:false,measure:'금고를 열었어요. Money-Robo 쪽 무리는 등급과 '+pct(o.ko)+' 겹치고, 초파리 쪽은 '+pct(o.fo)+'예요. 빨간 점이 등급과 다른 무리에 들어간 고객이에요. 초파리 쪽은 결제액이 비슷한 일반 고객과 단골을 잘 못 가렸어요.',
   verdict:'정답이 없어도 구조는 있다. 단골은 결제액이 아니라 방문 횟수로 갈리는 무리였다. 두 특징을 함께 본 쪽이 이겼다. 이 구역은 Money-Robo 쪽이다.',key:'정답 없이도 데이터의 모양에서 무리를 찾을 수 있다.',
   render:function(box){box.innerHTML=duelBox(o)+'<p class="muted" style="font-size:13px;margin:6px 0 0">빨간 점 = 숨겨 둔 등급과 다른 무리에 들어간 고객</p>';drawDuel(o,'cA','cB');}};},
 alts:[{label:'무리가 결제액으로만 갈린다면?',run:async function(box){var o=UNS.duel(true);
   box.innerHTML=statGrid([[pct(o.fo),'초파리 · 결제액으로 3등분','f'],[pct(o.ko),'Money-Robo · K-평균','r']])+'<div class="two" style="margin-top:12px"><canvas class="fig" id="cC" aria-label="결제액으로만 갈리는 데이터에서 초파리의 무리"></canvas><canvas class="fig" id="cD" aria-label="같은 데이터에서 K-평균의 무리"></canvas></div>'+
    say('fly','arms','봐, 등급이 정말 결제액으로만 갈리면 내 기준이 '+pct(o.fo)+'야. 방문 횟수는 등급과 상관없는 잡음일 뿐이니까.')+say('robo','wow','K-평균은 방문 횟수의 퍼짐까지 무리로 착각했네… '+pct(o.ko)+'.');drawDuel(o,'cC','cD');}},
  {label:'무리 수 k를 바꾸면?',run:async function(box){var rows=[1,2,3,4,5,6].map(function(k){var o=UNS.kbest(CZ,k);return [k,o.sse];});
   box.innerHTML='<div class="tw"><table class="tb"><thead><tr><th>k</th><th>무리 안 거리 제곱합</th></tr></thead><tbody>'+rows.map(function(r){return '<tr><td>'+r[0]+'</td><td>'+fx(r[1],1)+'</td></tr>';}).join('')+'</tbody></table></div>'+
    say('asst','ledger','k를 늘릴수록 거리 제곱합은 계속 줄어요. k = 180이면 0이 되겠죠. 그래서 이 숫자만으로는 k를 못 정해요. 3에서 크게 꺾이는 게 단서예요. 이 이야기는 4-13에서 해요.');}}]});

/* ══ 확인 문제 ══ */
var QUIZ={q3:[
 {q:'비지도학습이 지도학습과 가장 크게 다른 점은?',o:[['정답 y 없이 입력 X만으로 배운다',1,'그래서 "얼마나 틀렸나"를 바로 잴 수 없다. 담판에서는 조수가 몰래 등급을 적어 두어 채점할 수 있었다.'],['데이터가 더 적어도 된다',0,'데이터 양과는 상관없다.'],['결과가 늘 정확하다',0,'정답이 없으니 정확한지 확인하기가 오히려 어렵다.']]},
 {q:'K-평균에서 사람이 정해야 하는 것은?',o:[['무리 수 k',1,'알고리즘은 k를 스스로 정하지 않는다. 담판의 조건 바꾸기에서 보듯 거리 제곱합은 k를 늘릴수록 계속 준다.'],['각 무리의 이름',0,'이름도 사람이 붙이지만, 알고리즘을 돌리기 전에 꼭 정해야 하는 것은 k다.'],['점마다의 정답',0,'정답이 있으면 비지도학습이 아니다.']]},
 {q:'03장에서 세 특징을 축 두 개로 줄여도 퍼짐의 대부분이 남은 까닭은?',o:[['세 특징이 서로 얽혀 함께 움직여서',1,'자주 오는 사람이 오래 머물고 많이 쓰는 사람도 오래 머문다. 얽힌 특징은 적은 축으로 요약된다.'],['특징 하나를 지워서',0,'PCA는 특징을 지우지 않는다. 세 특징을 섞은 새 축을 만든다.'],['점이 180개뿐이라서',0,'점의 수와 상관없다.']]}]};

var PROMPTS=[
 {t:'① 내 고객 데이터 군집',use:'정답 없는 고객·상품 데이터를 묶어 보고 싶을 때',p:'아래 코드는 고객 데이터를 표준화한 뒤 K-평균으로 묶고, 주성분 분석으로 평면에 그린다. 내 데이터에 맞게 바꿔 줘.\n\n- 내 데이터: 〔예) members.csv, 열: 방문 횟수, 평균 결제액, 최근 방문 후 지난 날수〕\n\nk를 2~8로 바꿔 가며 무리 안 거리 제곱합을 그래프로 그리고, 고른 k로 묶은 뒤 무리마다 특징 평균을 표로 보여 줘. 무리에 이름을 붙일 때 참고할 점도 알려 줘.'},
 {t:'② 표준화가 왜 필요한지',use:'단위가 다른 특징을 함께 쓸 때',p:'K-평균에서 특징의 단위(예: 방문 횟수와 결제액 원)가 다를 때 표준화를 하지 않으면 어떤 일이 생기는지, 작은 예시 데이터로 보여 주는 파이썬 코드를 써 줘. 표준화 전후의 무리를 나란히 그리고, 차이를 세 문장으로 설명해 줘.'},
 {t:'③ 주성분 해석',use:'PCA 결과의 축이 무슨 뜻인지 알고 싶을 때',p:'주성분 분석 결과에서 각 주성분이 원래 특징을 얼마나 섞었는지(적재량)를 읽는 법을 설명해 줘. 내 데이터 〔설명〕로 첫째·둘째 주성분의 적재량 표와 설명된 분산 비율을 출력하는 코드를 쓰고, 두 축에 사람이 읽을 수 있는 이름을 붙여 보는 예시도 보여 줘.'},
 {t:'④ 정답 없는 결과 검증 계획',use:'군집 결과를 보고서에 쓰기 전에',p:'정답이 없는 군집 결과를 업무에 쓰기 전에 확인할 것들을 체크리스트로 만들어 줘. 1) 지표(실루엣 등) 2) 시작점을 바꿔도 같은 결과가 나오는지 3) 무리별 특징이 업무적으로 말이 되는지 4) 시간이 지나도 유지되는지. 각 항목을 확인하는 파이썬 코드 조각도 붙여 줘.'}];
var GL=[
 ['가문','비지도학습','정답 없이 입력만으로 구조를 찾는 가문.'],['파','군집','비슷한 데이터끼리 묶는 일.'],['파','차원 축소','특징 수를 줄여 요약하는 일.'],
 ['알고리즘','K-평균','중심 k개를 두고 "가까운 중심에 붙이기 → 중심 옮기기"를 되풀이하는 군집 방법.'],['알고리즘','주성분 분석','가장 넓게 퍼진 방향부터 새 축을 찾는 차원 축소 방법(PCA).'],
 ['계산','중심','무리 점들의 평균 자리.'],['계산','거리','두 점이 얼마나 떨어졌는지. 보통 직선거리.'],['계산','표준화','특징마다 평균 0, 퍼짐 1로 맞추는 일. 단위가 다른 특징을 함께 쓸 때 필요하다.'],
 ['계산','퍼짐','데이터가 흩어진 정도(분산).'],['평가','무리 안 거리 제곱합','점과 자기 무리 중심 사이 거리 제곱의 합. 작을수록 무리가 촘촘하다.'],['평가','겹침 비율','무리 번호와 숨긴 정답을 가장 잘 짝지었을 때 같은 칸에 든 비율. 이 편에서만 쓰는 이름.']];
var ANALOGY=[
 ['군집','이름표 없이 옷장 정리하기',2,'더듬이엽에서 같은 종류의 냄새 신호가 한 사구체로 모인다','사구체로 모이는 것은 학습이 아니라 발달 과정의 배선이다'],
 ['K-평균','모임 장소를 정하고, 모인 사람들의 한가운데로 장소를 옮기기',1,'','시작 장소를 어디 두느냐에 따라 다른 결과에 멈출 수 있다'],
 ['차원 축소','입체 조각을 가장 잘 보이는 각도에서 사진 찍기',1,'','사진 한 장에 담기지 않는 정보는 사라진다. 사라진 몫을 숫자(설명된 퍼짐)로 확인한다'],
 ['정답 없는 채점','심사위원 없는 요리 대회',1,'','실제로는 숨긴 정답이 없는 경우가 대부분이다. 그래서 다른 채점법이 필요하다(4-13)']];
var REFS=[
 'MacQueen, J. (1967). Some methods for classification and analysis of multivariate observations. <i>Proceedings of the Fifth Berkeley Symposium on Mathematical Statistics and Probability</i>, 1, 281–297. — K-평균',
 'Lloyd, S. P. (1982). Least squares quantization in PCM. <i>IEEE Transactions on Information Theory</i>, 28(2), 129–137. <a href="https://doi.org/10.1109/TIT.1982.1056489" target="_blank" rel="noopener">doi:10.1109/TIT.1982.1056489</a> — K-평균의 반복 절차',
 'Pearson, K. (1901). On lines and planes of closest fit to systems of points in space. <i>Philosophical Magazine</i>, 2(11), 559–572. <a href="https://doi.org/10.1080/14786440109462720" target="_blank" rel="noopener">doi:10.1080/14786440109462720</a> — 주성분 분석',
 'Hastie, T., Tibshirani, R., &amp; Friedman, J. (2009). <i>The Elements of Statistical Learning</i> (2nd ed.), 14장(비지도학습). Springer.'];
var TIP={who:'비지도학습을 처음 배우는 학습자. 4-2를 읽었으면 좋다',goal:'① 정답 없이 배운다는 뜻을 예로 설명한다 ② K-평균의 두 단계를 말로 설명한다 ③ 차원 축소가 무엇을 남기고 무엇을 버리는지 설명한다',time:'읽기 15분 · K-평균과 PCA 조작 10분 · Colab 10분',
 plans:[['강의형 30분','01장 정답 가리기 5분 → 02장 K-평균을 "한 단계"로 함께 넘기기 10분 → 03장 펼치기 5분 → 담판 결과 예측 10분.'],['실무 OJT 60분','02장 10분 → 사내 고객 데이터로 프롬프트 ① 돌리기 30분 → 무리에 이름 붙이기 토론 20분.'],['1:1 튜터링','담판의 조건 바꾸기 두 개를 모두 보게 하고, "어떤 데이터에서 누가 이기는가"를 학습자가 직접 정리하게 한다.']],
 myths:[['비지도학습은 정답을 스스로 알아낸다','무리를 찾을 뿐 이름(정답)은 사람이 붙인다'],['K-평균은 늘 같은 답을 낸다','시작점에 따라 다를 수 있어 여러 번 돌려 가장 좋은 것을 고른다'],['차원을 줄이면 정보가 그대로 남는다','버려진 축의 퍼짐만큼 정보가 사라진다. 비율로 확인한다']]};
var CODE={title:'정답 없이 고객 무리 찾기',sub:'담판 재현 · numpy, scikit-learn · CPU 몇 초',file:'customer_clusters',
 desc:'담판을 옮겼다. 고객 180명(방문 횟수, 결제액, 머문 시간)을 만들고, 결제액 3등분과 K-평균의 결과를 숨겨 둔 등급과 비교한다. 결제액으로만 갈리는 데이터에서도 다시 겨룬다. 마지막에 주성분 분석의 축별 퍼짐을 출력한다.',
 cap:'실행 결과 (scikit-learn 1.x, CPU). 데이터 규칙은 브라우저와 같지만 난수 생성기가 달라 숫자는 조금 다르다. 결론(두 특징으로 갈리는 데이터에서는 K-평균이, 결제액으로만 갈리는 데이터에서는 결제액 3등분이 이긴다)은 같다.'};
