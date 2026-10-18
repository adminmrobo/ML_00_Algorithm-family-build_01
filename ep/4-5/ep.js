/* ══ 4-5 앙상블 ══════════════════════════════════════════════════ */
/* ── 히어로: 나무 아홉 그루의 투표 ── */
heroStage($('heroCv'),{bg:'sc_magic',bgY:.15,fly:'point',robo:'stack',motif:function(ctx,t,W,H){var C=cols();
  ctx.fillStyle='rgba(13,12,28,.78)';rr(ctx,270,26,560,262,16);ctx.fill();var r=ML.R(3),yes=0;
  for(var i=0;i<9;i++){var x=320+i*58,y=200,v=r()<.7?1:0,ph=(t*1.5-i*.25);if(v)yes++;
   ctx.fillStyle='#6b4a2f';ctx.fillRect(x-4,y,8,26);var col=v?'#ff9a4d':'#82b8ff';ctx.fillStyle=rgba(col,.85);ctx.beginPath();ctx.moveTo(x,y-46);ctx.lineTo(x-22,y+2);ctx.lineTo(x+22,y+2);ctx.closePath();ctx.fill();
   var u=Math.max(0,Math.min(1,(ph%3)));ctx.fillStyle=col;ctx.globalAlpha=1-u*.3;ctx.fillRect(x-5,y-60-u*70,10,10);ctx.globalAlpha=1;}
  glow(ctx,550,62,46,'#d672d6',.55);ctx.font=font(17,700);ctx.fillStyle='#eceaf3';ctx.textAlign='center';ctx.fillText('다수결 '+yes+' : '+(9-yes),550,68);}});

/* ── 01 배깅 ── */
function region(cv,model,H,pts){var Wd=fit(cv,H),ctx=cv.getContext('2d'),C=cols(),n=50,S=Math.min(Wd,H),ox=(Wd-S)/2,cw=S/n;ctx.clearRect(0,0,Wd,H);
  for(var a=0;a<n;a++)for(var b=0;b<n;b++){var p=model.predict([-1+(a+.5)*2/n,1-(b+.5)*2/n]);ctx.fillStyle=p?rgba(C.orange,.24):rgba(C.info,.14);ctx.fillRect(ox+a*cw,b*cw,cw+.5,cw+.5);}
  if(pts)pts.forEach(function(d){circ(ctx,ox+(d.x[0]+1)/2*S,(1-d.x[1])/2*S,2.3,d.y?C.orange:C.info);});return {ctx:ctx,S:S,ox:ox};}
(function(){var seed=1,cur;
 function draw(){var a=region($('bgA'),cur.one,200,ENS.S.tr),b=region($('bgB'),cur.f,200,ENS.S.tr);[a,b].forEach(function(o){var C=cols();o.ctx.strokeStyle=C.text;o.ctx.setLineDash([4,4]);o.ctx.lineWidth=1.1;o.ctx.beginPath();for(var q=0;q<=60;q++){var x=-1+q/30,y=.6*Math.sin(2.6*x);var X=o.ox+(x+1)/2*o.S,Y=(1-y)/2*o.S;q?o.ctx.lineTo(X,Y):o.ctx.moveTo(X,Y);}o.ctx.stroke();o.ctx.setLineDash([]);});}
 function ui(){$('bgAc').textContent='한 그루 · 검증 '+pct(cur.oa);$('bgBc').textContent='25그루 투표 · 검증 '+pct(cur.fa);$('bgSeed').textContent='뽑기 '+seed+'번째 · 점선은 진짜 경계';
  $('bgBars').innerHTML=[['한 그루',cur.oa,'muted'],['25그루 투표',cur.fa,'stain']].map(function(r){return '<div class="row"><span>'+r[0]+'</span><div class="tr"><div class="fl" style="width:'+(r[1]*100)+'%;background:var(--'+r[2]+')"></div></div><span class="v">'+pct(r[1])+'</span></div>';}).join('')+'<p class="muted" style="font-size:13px;margin:4px 0 0">처음 보는 100개로 잰 검증 정확도</p>';}
 function go(){cur=ENS.bag(seed);draw();ui();}
 $('bgRe').addEventListener('click',function(){seed=seed%9+1;go();});go();onRedraw(draw);})();

/* ── 02 부스팅 ── */
(function(){var cv=$('bsCv'),m=1;
 function draw(){var mdl=ENS.boostAt(m),o=region(cv,mdl,260,null),C=cols(),w=ENS.AB.weights[m-1],mx=Math.max.apply(null,w);
  ENS.R.forEach(function(d,i){var wrong=mdl.predict(d.x)!==d.y,rad=2+Math.sqrt(w[i]/mx)*4.5;circ(o.ctx,o.ox+(d.x[0]+1)/2*o.S,(1-d.x[1])/2*o.S,rad,d.y?C.orange:C.info,wrong?C.eye:null,2);});
  o.ctx.strokeStyle=C.text;o.ctx.setLineDash([4,4]);o.ctx.beginPath();o.ctx.arc(o.ox+o.S/2,o.S/2,Math.sqrt(.45)*o.S/2,0,7);o.ctx.stroke();o.ctx.setLineDash([]);stamp(o.ctx,fit(cv,260),'점 크기 = 다음 그루터기가 받는 무게');}
 function ui(){var mdl=ENS.boostAt(m),acc=ML.acc(mdl,ENS.R.map(function(d){return d.x}),ENS.R.map(function(d){return d.y}));
  $('bsInfo').innerHTML='그루터기 '+m+'개 · 훈련 정확도 <b>'+pct(acc)+'</b>. '+(m===1?'직선 한 번으로 잘랐다. 원 안팎을 가를 수 없다(편향).':m<6?'직선 조각이 몇 개 겹쳐 사각형 비슷한 영역이 생겼다. 빨간 테 점이 아직 틀린 점이다.':'조각들이 모여 원을 닮아 간다. 크게 그려진 점은 여러 번 틀려 무게가 쌓인 점이다.');}
 $('bsSl').addEventListener('input',function(){m=+this.value;$('bsVal').textContent=m;draw();ui();});draw();ui();onRedraw(draw);})();

/* ── 03 다트판 ── */
(function(){var cv=$('dtbCv'),fix=0,k=0,r=ML.R(4),A=[],B=[];for(var i=0;i<18;i++){A.push([ML.N(r)*.42,ML.N(r)*.42]);B.push([.45+ML.N(r)*.1,-.35+ML.N(r)*.1]);}
 function board(ctx,cx,cy,R,pts,lab,C){[1,.66,.33].forEach(function(s,i){circ(ctx,cx,cy,R*s,i===2?rgba(C.eye,.25):(i?rgba(C.text,.05):rgba(C.text,.03)),C.rule,1);});circ(ctx,cx,cy,4,C.eye);
  pts.forEach(function(p){circ(ctx,cx+p[0]*R,cy+p[1]*R,4.5,C.c_doc,C.text,1);});ctx.font=font(13,700);ctx.fillStyle=C.text;ctx.textAlign='center';ctx.fillText(lab,cx,cy+R+22);}
 function draw(){var H=260,W=fit(cv,H),ctx=cv.getContext('2d'),C=cols(),R=Math.min(95,W/5);ctx.clearRect(0,0,W,H);var e=ease(k);
  board(ctx,W*.27,H/2-12,R,A.map(function(p){return [p[0]*(1-.75*e),p[1]*(1-.75*e)]}),e>.5?'배깅: 평균을 내니 모였다':'높은 분산: 흩어진다',C);
  board(ctx,W*.73,H/2-12,R,B.map(function(p){return [p[0]-.45*e*.85,p[1]+.35*e*.85]}),e>.5?'부스팅: 치우침을 고쳤다':'높은 편향: 한쪽으로 몰린다',C);stamp(ctx,W,'개념 도식');}
 seg('#m3 .pills button',function(v){fix=+v;});onTick(cv,function(dt){var nk=k+(fix-k)*Math.min(1,dt*3);if(Math.abs(nk-k)>1e-4||REDUCE){k=REDUCE?fix:nk;draw();}});draw();onRedraw(draw);})();

/* ── 04 위원 수 ── */
(function(){var cv=$('cmCv'),p=.6,rho=0,cache={};
 function simC(n){var k=n+'|'+p+'|'+rho;if(cache[k]==null)cache[k]=ML.committeeSim(n,p,rho,2000,5);return cache[k];}
 var NS=[1,3,5,7,9,11,15,21,25,31,41,51];
 function draw(){var H=240,W=fit(cv,H),ctx=cv.getContext('2d'),C=cols(),l=40,r=W-10,tp=12,bt=H-30;ctx.clearRect(0,0,W,H);
  function px(n){return l+(n-1)/50*(r-l)}function py(a){return bt-(a-.3)/.7*(bt-tp)}
  ctx.strokeStyle=C.rule;ctx.beginPath();ctx.moveTo(l,tp);ctx.lineTo(l,bt);ctx.lineTo(r,bt);ctx.stroke();ctx.font=font(10.5);ctx.fillStyle=C.muted;ctx.textAlign='right';[.4,.6,.8,1].forEach(function(v){ctx.fillText(pct(v,0),l-4,py(v)+4);});ctx.textAlign='center';[1,11,25,51].forEach(function(v){ctx.fillText(v,px(v),bt+14);});ctx.fillText('위원 수',(l+r)/2,H-4);
  ctx.setLineDash([3,3]);ctx.strokeStyle=C.muted;ctx.beginPath();ctx.moveTo(l,py(p));ctx.lineTo(r,py(p));ctx.stroke();ctx.setLineDash([]);
  ctx.strokeStyle=C.gfp;ctx.lineWidth=2.5;ctx.beginPath();for(var n=1;n<=51;n+=2){var y=py(ML.majority(n,p));n>1?ctx.lineTo(px(n),y):ctx.moveTo(px(n),y);}ctx.stroke();
  if(rho>0){ctx.strokeStyle=C.eye;ctx.lineWidth=2.5;ctx.beginPath();NS.forEach(function(n,i){var y=py(simC(n));i?ctx.lineTo(px(n),y):ctx.moveTo(px(n),y);});ctx.stroke();}
  stamp(ctx,W,'계산값');}
 function ui(){var m25=ML.majority(25,p),s25=rho>0?simC(25):m25;$('cmInfo').innerHTML='위원 한 명 '+pct(p,0)+' → 25명 다수결 <b>'+pct(s25)+'</b>'+(rho>0?' (같은 실수 몫 ρ = '+fx(rho,2)+', 독립이었다면 '+pct(m25)+')':'')+'. '+(p<.5?'한 명이 동전보다 못하면 다수결은 더 나빠진다.':rho>=.5?'위원들이 같은 실수를 함께 하면 사람 수가 늘어도 거의 나아지지 않는다.':'');}
 $('cmP').addEventListener('input',function(){p=+this.value;$('cmPv').textContent=fx(p,2);draw();ui();});
 $('cmR').addEventListener('input',function(){rho=+this.value;$('cmRv').textContent=fx(rho,2);draw();ui();});draw();ui();onRedraw(draw);})();

/* ── 담판 ── */
Duel('d5',{title:'위원 한 명 vs 스물다섯 명',q:'문제 2,000개를 푼다. 위원은 저마다 정답률 60%이고, 서로 독립적으로 판단한다(문제마다 따로 동전을 던지듯 틀린다). 한 명에게 맡길까, 스물다섯 명의 다수결에 맡길까?',
 fly:['믿을 만한 한 명','다 같은 실력이면 한 명이면 충분해.'],robo:['스물다섯 명의 다수결','분산 투자가 기본이지.'],roboMood:'stack',
 run:async function(p){p(.4);await wait(120);var one=ENS.committee(1,.6,0),many=ENS.committee(25,.6,0);p(1);
  return {winner:many>one?'r':(many<one?'f':'d'),big:false,measure:'문제 2,000개에서 한 명은 '+pct(one)+', 스물다섯 명 다수결은 '+pct(many)+'를 맞혔어요. 계산식으로 구한 값(60.0%, '+pct(ML.majority(25,.6))+')과 거의 같아요.',
   verdict:'서로 다르게 틀리는 위원을 모으면 다수결이 훨씬 강해진다. 이 구역은 Money-Robo 쪽이다. 다만 초파리의 질문이 바로 이 승리의 조건이다.',key:'다수결의 힘은 위원 수가 아니라 위원들이 서로 다르게 틀리는 데서 나온다.',
   render:function(box){box.innerHTML=statGrid([[pct(one),'초파리 · 한 명','f'],[pct(many),'Money-Robo · 25명 다수결','r'],[pct(ML.majority(5,.6)),'참고 · 5명 다수결 (계산식)'],[pct(ML.majority(51,.6)),'참고 · 51명 다수결 (계산식)']]);}};},
 alts:[{label:'위원들이 같은 실수를 하면 (ρ = 0.5)?',run:async function(box){var one=ENS.committee(1,.6,0),many=ENS.committee(25,.6,.5);
   box.innerHTML=statGrid([[pct(one),'한 명','f'],[pct(many),'25명 다수결 · ρ = 0.5','r']])+say('fly','arms','봐, 절반쯤 같은 의견을 따라가면 스물다섯 명이어도 한 명이랑 별 차이 없어.')+say('robo','blush','분산 투자인 줄 알았는데 다 같은 종목을 산 셈이었네…');}},
  {label:'위원 실력이 45%라면?',run:async function(box){var one=ENS.committee(1,.45,0),many=ENS.committee(25,.45,0);
   box.innerHTML=statGrid([[pct(one),'한 명 · 45%','f'],[pct(many),'25명 다수결 · 45%','r']])+say('asst','shock','위원 한 명이 동전보다 못하면 다수결이 오히려 더 틀려요. '+pct(many)+'까지 떨어졌어요. 묶기 전에 모델 하나하나가 쓸 만한지부터 봐야 해요.');}}]});

/* ══ 확인 문제 ══ */
var QUIZ={q5:[
 {q:'배깅이 주로 줄이는 것은?',o:[['분산 (데이터가 조금 바뀔 때 결과가 크게 흔들리는 것)',1,'다시 뽑은 데이터로 키운 모델들의 평균·투표가 흔들림을 상쇄한다. 01장에서 한 그루는 크게 흔들리고 25그루 투표는 덜 흔들렸다.'],['편향',0,'편향은 부스팅이 주로 줄인다.'],['데이터 수',0,'배깅은 데이터를 다시 뽑지만 수를 줄이지 않는다.']]},
 {q:'부스팅에서 다음 모델이 신경 쓰는 점은?',o:[['앞 모델들이 틀린 점',1,'틀린 점에 무게를 더 얹어 다음 그루터기가 그 점을 맞히도록 한다. 02장의 큰 점이 그 무게다.'],['아무 점이나 무작위로',0,'무작위로 다시 뽑는 것은 배깅이다.'],['이미 맞힌 점',0,'맞힌 점은 오히려 무게가 줄어든다.']]},
 {q:'다수결이 강해지기 위한 조건으로 옳은 것은?',o:[['위원 한 명 한 명이 동전보다 낫고, 서로 다르게 틀릴 것',1,'p < 0.5면 오히려 나빠지고, 같은 실수를 함께 하면(ρ가 크면) 나아지지 않는다(04장, 담판의 조건 바꾸기).'],['위원이 많기만 하면 된다',0,'같은 실수를 함께 하는 위원은 많아도 소용없다.'],['위원이 모두 같은 모델일 것',0,'같은 데이터로 키운 같은 모델은 같은 실수를 한다. 그래서 배깅은 데이터를 다시 뽑는다.']]}]};

var PROMPTS=[
 {t:'① 내 데이터로 한 그루 vs 숲',use:'결정 트리를 랜덤 포레스트로 바꿀지 판단할 때',p:'아래 코드는 결정 트리 한 그루와 랜덤 포레스트, AdaBoost를 같은 데이터에서 비교한다. 내 데이터에 맞게 바꿔 줘.\n\n- 내 데이터: 〔예) loans.csv, 정답 열 default(0/1)〕\n\n1. 훈련 데이터를 부트스트랩으로 10번 다시 뽑아 한 그루와 숲의 검증 정확도 평균과 표준편차를 비교해 줘(흔들림 확인).\n2. 그루 수를 1, 5, 25, 100, 300으로 바꾸며 검증 정확도 곡선을 그려 줘.\n3. 결과를 분산·편향의 말로 세 문장 해석해 줘.'},
 {t:'② 부스팅이 과적합하는 순간',use:'부스팅 반복 수를 정할 때',p:'잡음이 섞인 분류 데이터를 만들고, AdaBoost와 그래디언트 부스팅의 반복 수(1~500)에 따른 훈련·검증 정확도 곡선을 그려 줘. 검증 정확도가 꺾이는 지점과, 조기 종료(early stopping)로 그 지점을 자동으로 찾는 방법을 코드로 보여 줘.'},
 {t:'③ 위원들을 다르게 만드는 법',use:'앙상블 모델들의 상관을 줄이고 싶을 때',p:'앙상블에서 모델들이 "서로 다르게 틀리게" 만드는 방법을 정리해 줘: 부트스트랩, 특징 무작위 선택(랜덤 포레스트의 max_features), 서로 다른 알고리즘 섞기(스태킹·투표), 다른 시드. 각 방법이 모델 간 예측 상관을 얼마나 낮추는지 확인하는 파이썬 코드도 써 줘. 내 데이터: 〔설명〕'},
 {t:'④ 수업용 다수결 실험',use:'강의에서 다수결의 조건을 체험시키고 싶을 때',p:'학생 30명이 참여하는 "다수결 실험"을 설계해 줘. 1) 혼자 풀면 정답률이 60%쯤 되는 문제 10개 2) 조별(5명) 다수결로 다시 풀기 3) 서로 상의하고 다수결(같은 실수 유도)과 상의 없이 다수결(독립) 비교 4) 결과를 칠판에 정리하는 표 양식과 토론 질문 세 개.'}];
var GL=[
 ['가문','앙상블','모델 여럿의 답을 평균·투표로 묶는 기술.'],['파','배깅','데이터를 다시 뽑아 만든 모델 여럿을 동시에 키워 투표하는 앙상블.'],['파','부스팅','앞 모델이 틀린 곳을 다음 모델이 고치도록 차례로 쌓는 앙상블.'],
 ['알고리즘','랜덤 포레스트','배깅에 "질문할 특징도 무작위로 고르기"를 더한 트리 앙상블.'],['알고리즘','AdaBoost','틀린 점에 무게를 얹으며 약한 모델을 쌓는 부스팅 방법.'],['알고리즘','그루터기','질문 하나로 끝나는 깊이 1짜리 결정 트리.'],
 ['계산','부트스트랩','데이터에서 중복을 허락해 같은 수만큼 다시 뽑는 것.'],['계산','다수결','여럿의 답 중 가장 많이 나온 답을 고르는 것.'],
 ['오차','분산','데이터가 조금 바뀔 때 모델의 답이 흔들리는 정도.'],['오차','편향','모델이 너무 단순해 늘 같은 쪽으로 틀리는 정도.'],['오차','상관','두 모델이 함께 맞고 함께 틀리는 정도. 앙상블에서는 낮을수록 좋다.']];
var ANALOGY=[
 ['배깅','같은 문제를 여러 사람이 따로 풀고 다수결',1,'','사람들은 서로 이야기하면 같은 실수를 하게 된다. 배깅은 데이터를 다시 뽑아 일부러 다르게 만든다'],
 ['부스팅','오답 노트를 넘겨받은 다음 학생',1,'','다음 학생이 오답만 파고들다 보면 잡음 문제까지 외울 수 있다(과적합)'],
 ['분산과 편향','흩어지는 다트와 한쪽으로 몰리는 다트',1,'','실제 모델은 둘이 섞여 있고, 하나를 줄이면 다른 하나가 늘기도 한다'],
 ['다수결','위원회 투표',2,'뇌에서는 많은 뉴런의 활동을 모아 판단한다는 연구가 있다','뇌의 뉴런들은 서로 강하게 연결되어 있어 "독립 투표"와는 거리가 멀다']];
var REFS=[
 'Breiman, L. (1996). Bagging predictors. <i>Machine Learning</i>, 24(2), 123–140. <a href="https://doi.org/10.1007/BF00058655" target="_blank" rel="noopener">doi:10.1007/BF00058655</a> — 01장',
 'Breiman, L. (2001). Random forests. <i>Machine Learning</i>, 45(1), 5–32. <a href="https://doi.org/10.1023/A:1010933404324" target="_blank" rel="noopener">doi:10.1023/A:1010933404324</a> — 01장, 04장',
 'Freund, Y., &amp; Schapire, R. E. (1997). A decision-theoretic generalization of on-line learning and an application to boosting. <i>Journal of Computer and System Sciences</i>, 55(1), 119–139. <a href="https://doi.org/10.1006/jcss.1997.1504" target="_blank" rel="noopener">doi:10.1006/jcss.1997.1504</a> — 02장 AdaBoost',
 'Hastie, T., Tibshirani, R., &amp; Friedman, J. (2009). <i>The Elements of Statistical Learning</i> (2nd ed.), 7장(편향·분산)·8장(배깅)·10장(부스팅)·15장(랜덤 포레스트). Springer.'];
var TIP={who:'앙상블을 처음 배우는 학습자. 4-2(결정 트리, 과적합)를 읽었으면 좋다',goal:'① 배깅과 부스팅의 차이를 "동시에/차례로"로 설명한다 ② 분산과 편향을 다트판 비유로 구별한다 ③ 다수결이 강해지는 두 조건을 말한다',time:'읽기 15분 · 슬라이더와 담판 10분 · Colab 10분',
 plans:[['강의형 30분','01장 다시 뽑기를 여러 번 누르며 흔들림 보기 5분 → 02장 슬라이더 5분 → 03장 다트판 5분 → 04장 p와 ρ 조절, 담판 15분.'],['실무 OJT 60분','01·02장 15분 → 프롬프트 ①로 사내 데이터에서 한 그루 vs 숲 비교 30분 → "우리 모델들은 서로 다르게 틀리는가" 토론 15분.'],['1:1 튜터링','담판의 조건 바꾸기 두 개를 보게 하고, 다수결이 실패하는 두 경우를 학습자의 말로 정리하게 한다.']],
 myths:[['모델을 많이 묶을수록 늘 좋아진다','모델들이 같은 실수를 하면 나아지지 않고, 하나하나가 동전보다 못하면 오히려 나빠진다'],['부스팅은 과적합하지 않는다','잡음이 많으면 틀린 점(잡음)을 쫓아가 과적합할 수 있다. 반복 수를 검증으로 고른다'],['앙상블은 다섯째 가문이다','데이터 종류가 아니라 모델을 묶는 기술이다. 그래서 지도학습 칸과 겹친다']]};
var CODE={title:'한 그루, 숲, 그리고 다수결',sub:'담판 재현 · numpy, scikit-learn · CPU 몇 초',file:'bagging_boosting_vote',
 desc:'01·02장과 담판을 옮겼다. 물결 데이터에서 결정 트리 한 그루와 랜덤 포레스트(25그루)를 다시 뽑기 5번으로 비교하고, 원 데이터에서 AdaBoost의 반복 수별 정확도를 본다. 마지막에 정답률 60% 위원의 다수결을 계산식과 흉내 내기로 구한다.',
 cap:'실행 결과 (scikit-learn 1.x, CPU). 데이터 규칙은 브라우저와 같지만 난수 생성기와 구현이 달라 숫자는 조금 다르다. 결론(숲이 한 그루보다 안정적이고 정확하다, 독립인 위원 25명의 다수결은 약 85%다)은 같다.'};
