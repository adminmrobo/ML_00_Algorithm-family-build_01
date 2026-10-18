/* ══ 4-2 지도학습 ════════════════════════════════════════════════ */
var AD=SUP.ad();

/* ── 히어로: 회귀선과 경계선 ── */
heroStage($('heroCv'),{bg:'sc_board',bgY:.2,fly:'point',robo:'chart',motif:function(ctx,t,W,H){var C=cols();
  ctx.fillStyle='rgba(13,12,28,.78)';rr(ctx,260,30,580,250,16);ctx.fill();
  var x0=290,y0=255,w=240,h=200;ctx.strokeStyle='rgba(236,234,243,.35)';ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(x0,y0-h);ctx.lineTo(x0,y0);ctx.lineTo(x0+w,y0);ctx.stroke();
  AD.forEach(function(d,i){var px=x0+d.x/10*w,py=y0-(d.s-30)/90*h;ctx.fillStyle=rgba(C.info,.85);ctx.fillRect(Math.round(px)-3,Math.round(py)-3,6,6);});
  var k=(Math.sin(t*.9)+1)/2,a=0.3+0.7*k;ctx.strokeStyle=rgba('#5ee39c',.9);ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(x0,y0-(50*a+40*(1-a)-30)/90*h);ctx.lineTo(x0+w,y0-(50*a+40*(1-a)+60*a+30*(1-a)-30)/90*h);ctx.stroke();
  ctx.font=font(13,700);ctx.fillStyle='#82b8ff';ctx.textAlign='center';ctx.fillText('회귀 · 숫자를 맞힌다',x0+w/2,52);
  var X1=570,r=ML.R(7);for(var i=0;i<46;i++){var u=r(),v=r(),c=v>0.5+0.25*Math.sin(u*6);ctx.fillStyle=c?'#f0604d':'#82b8ff';ctx.fillRect(Math.round(X1+u*240)-3,Math.round(y0-v*h)-3,6,6);}
  ctx.strokeStyle='#eceaf3';ctx.lineWidth=2.5;ctx.setLineDash([6,5]);ctx.beginPath();for(var q=0;q<=40;q++){var u2=q/40,yy=y0-(0.5+0.25*Math.sin(u2*6+Math.sin(t)*0.3))*h;q?ctx.lineTo(X1+u2*240,yy):ctx.moveTo(X1+u2*240,yy);}ctx.stroke();ctx.setLineDash([]);
  ctx.fillStyle='#f0604d';ctx.fillText('분류 · 이름표를 맞힌다',X1+120,52);}});

/* ── 01 경사 하강으로 직선 맞추기 ── */
(function(){var cv=$('gdCv'),w,b,ep,run=false,acc=0,phase=0,lr=0.02;
 var X=AD.map(function(d){return d.x/10}),Y=AD.map(function(d){return d.s/100});
 function reset(){w=-0.3;b=1.1;ep=0;phase=0;draw();ui();}
 function mse(){var s=0;X.forEach(function(x,i){var e=w*x+b-Y[i];s+=e*e;});return s/X.length*10000;}
 function step(){var gw=0,gb=0;X.forEach(function(x,i){var e=w*x+b-Y[i];gw+=e*x;gb+=e;});w-=lr*20*gw/X.length*2;b-=lr*20*gb/X.length*2;ep++;}
 function draw(){var H=280,Wd=fit(cv,H),ctx=cv.getContext('2d'),C=cols(),l=44,r=Wd-14,tp=14,bt=H-32;ctx.clearRect(0,0,Wd,H);
  function px(x){return l+x/10*(r-l)}function py(s){return bt-(s-20)/120*(bt-tp)}
  ctx.strokeStyle=C.rule;ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(l,tp);ctx.lineTo(l,bt);ctx.lineTo(r,bt);ctx.stroke();
  ctx.font=font(11);ctx.fillStyle=C.muted;ctx.textAlign='center';ctx.fillText('광고비 (만 원)',(l+r)/2,H-6);[0,5,10].forEach(function(v){ctx.fillText(v,px(v),bt+14);});
  ctx.textAlign='right';[40,80,120].forEach(function(v){ctx.fillText(v,l-6,py(v)+4);});ctx.save();ctx.translate(12,(tp+bt)/2);ctx.rotate(-Math.PI/2);ctx.textAlign='center';ctx.fillText('매출 (만 원)',0,0);ctx.restore();
  AD.forEach(function(d){var pr=(w*d.x/10+b)*100;if(phase>=1){ctx.strokeStyle=rgba(C.orange,.55);ctx.lineWidth=1.2;ctx.beginPath();ctx.moveTo(px(d.x),py(d.s));ctx.lineTo(px(d.x),py(pr));ctx.stroke();}circ(ctx,px(d.x),py(d.s),3.2,C.info);});
  ctx.strokeStyle=C.gfp;ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(px(0),py(b*100));ctx.lineTo(px(10),py((w+b)*100));ctx.stroke();
  stamp(ctx,Wd,'예시 데이터');}
 function ui(){$('gdFlow').querySelectorAll('button').forEach(function(x,i){x.className=i===phase?'on':(ep>0&&i<phase?'done':'');});
  $('gdStat').innerHTML='<div><b class="num">'+ep+'</b><span>반복 횟수</span></div><div><b class="num">'+fx(mse(),1)+'</b><span>평균 제곱 오차</span></div><div><b class="num">'+fx(w*10,2)+'</b><span>기울기 w (만 원당)</span></div><div><b class="num">'+fx(b*100,1)+'</b><span>높이 b</span></div>';
  $('gdPlay').textContent=run?'❚❚ 멈춤':'▶ 학습';}
 $('gdPlay').addEventListener('click',function(){run=!run;ui();});
 $('gdStep').addEventListener('click',function(){run=false;phase=(phase+1)%4;if(phase===3){step();}draw();ui();});
 $('gdReset').addEventListener('click',function(){run=false;reset();});
 onTick(cv,function(dt){if(!run)return;acc+=dt;if(acc>.06){acc=0;phase=(phase+1)%4;if(phase===3)step();if(ep>=400)run=false;draw();ui();}});
 reset();onRedraw(draw);})();

/* ── 02 y 바꾸기 ── */
(function(){var cv=$('ycv'),mode='reg';
 var ln=ML.linfit(AD.map(function(d){return [d.x]}),AD.map(function(d){return d.s})),lg=ML.logfit(AD.map(function(d){return [d.x/10]}),AD.map(function(d){return d.y}),4000,2);
 var cut=-lg.b/lg.w[0]*10,racc=ML.acc({predict:function(x){return lg.predict([x[0]/10])}},AD.map(function(d){return [d.x]}),AD.map(function(d){return d.y}));
 var rmae=ML.mae(ln,AD.map(function(d){return [d.x]}),AD.map(function(d){return d.s}));
 function draw(){var H=260,Wd=fit(cv,H),ctx=cv.getContext('2d'),C=cols(),l=50,r=Wd-14,tp=14,bt=H-32;ctx.clearRect(0,0,Wd,H);
  function px(x){return l+x/10*(r-l)}
  ctx.strokeStyle=C.rule;ctx.beginPath();ctx.moveTo(l,tp);ctx.lineTo(l,bt);ctx.lineTo(r,bt);ctx.stroke();ctx.font=font(11);ctx.fillStyle=C.muted;ctx.textAlign='center';ctx.fillText('광고비 (만 원)',(l+r)/2,H-6);[0,5,10].forEach(function(v){ctx.fillText(v,px(v),bt+14);});
  if(mode==='reg'){function py(s){return bt-(s-20)/120*(bt-tp)}
   ctx.setLineDash([4,4]);ctx.strokeStyle=rgba(C.amber,.6);ctx.beginPath();ctx.moveTo(l,py(90));ctx.lineTo(r,py(90));ctx.stroke();ctx.setLineDash([]);ctx.fillStyle=C.amber;ctx.textAlign='left';ctx.fillText('목표 90',l+4,py(90)-5);
   AD.forEach(function(d){circ(ctx,px(d.x),py(d.s),3.4,C.info);});ctx.strokeStyle=C.gfp;ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(px(0),py(ln.predict([0])));ctx.lineTo(px(10),py(ln.predict([10])));ctx.stroke();
   ctx.fillStyle=C.muted;ctx.textAlign='right';[40,80,120].forEach(function(v){ctx.fillText(v,l-6,py(v)+4);});}
  else{var y1=tp+40,y0=bt-40;function py2(p){return y0-(y0-y1)*p}
   ctx.fillStyle=rgba(C.orange,.08);ctx.fillRect(px(cut),tp,r-px(cut),bt-tp);
   ctx.strokeStyle=C.gfp;ctx.lineWidth=2.5;ctx.beginPath();for(var q=0;q<=100;q++){var x=q/10,p=lg.prob([x/10]);q?ctx.lineTo(px(x),py2(p)):ctx.moveTo(px(x),py2(p));}ctx.stroke();
   AD.forEach(function(d,i){var jit=((i*37)%11-5);circ(ctx,px(d.x),(d.y?y1:y0)+jit,3.4,d.y?C.orange:C.info);});
   ctx.setLineDash([5,4]);ctx.strokeStyle=C.text;ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(px(cut),tp);ctx.lineTo(px(cut),bt);ctx.stroke();ctx.setLineDash([]);
   ctx.textAlign='right';ctx.fillStyle=C.orange;ctx.fillText('달성 (1)',l-6,y1+4);ctx.fillStyle=C.info;ctx.fillText('미달 (0)',l-6,y0+4);ctx.fillStyle=C.text;ctx.textAlign='left';ctx.fillText('경계 '+fx(cut,1)+'만 원',px(cut)+6,tp+12);}
  stamp(ctx,Wd,'예시 데이터');}
 function ui(){$('yInfo').innerHTML=mode==='reg'?'<b>회귀.</b> 직선이 매출액 자체를 맞힌다. 배운 식: 매출 ≈ '+fx(ln.w[0],1)+' + '+fx(ln.w[1],2)+' × 광고비. 평균 '+fx(rmae,1)+'만 원 빗나간다(같은 60일 기준).':
   '<b>분류.</b> 같은 점들이 "달성(주황)"과 "미달(파랑)" 두 줄로 갈린다. 초록 곡선은 달성 확률이고, 0.5를 넘는 광고비 '+fx(cut,1)+'만 원에 경계가 생긴다. 60일 중 '+pct(racc)+'를 맞힌다. 경계 근처는 광고비가 같아도 결과가 갈려 틀리기 쉽다.';draw();}
 seg('#m2 .pills button',function(v){mode=v;ui();});ui();onRedraw(draw);})();

/* ── 03 훈련과 검증 ── */
var CURVE=SUP.curve(.15),DEPTHS=[];for(var dd=1;dd<=12;dd++)DEPTHS.push(SUP.fitDepth(CURVE,dd));
function regionCanvas(cv,model,pts,H){var Wd=fit(cv,H),ctx=cv.getContext('2d'),C=cols(),n=60,S=Math.min(Wd,H),ox=(Wd-S)/2,cw=S/n;ctx.clearRect(0,0,Wd,H);
  for(var a=0;a<n;a++)for(var b=0;b<n;b++){var p=model.predict([-1+(a+.5)*2/n,1-(b+.5)*2/n]);ctx.fillStyle=p?rgba(C.orange,.22):rgba(C.info,.14);ctx.fillRect(ox+a*cw,b*cw,cw+.5,cw+.5);}
  ctx.strokeStyle=C.text;ctx.setLineDash([4,4]);ctx.lineWidth=1.2;ctx.beginPath();for(var q=0;q<=60;q++){var x=-1+q/30,y=0.6*Math.sin(2.6*x);var X0=ox+(x+1)/2*S,Y0=(1-y)/2*S;q?ctx.lineTo(X0,Y0):ctx.moveTo(X0,Y0);}ctx.stroke();ctx.setLineDash([]);
  pts.forEach(function(d){circ(ctx,ox+(d.x[0]+1)/2*S,(1-d.x[1])/2*S,2.6,d.y?C.orange:C.info);});}
(function(){var cv=$('dtCv'),cc=$('dcCv'),dep=3;
 npcLine($('owlHost'),['owl'],3,'금고지기 부엉이 <b>봉인관</b>: "검증 장부 100건은 이 금고에 봉인해 두었습니다. 배우는 동안에는 열지 않습니다."');
 function draw(){regionCanvas(cv,DEPTHS[dep-1].t,CURVE.tr,260);var c=cv.getContext('2d');stamp(c,fit(cv,260),'점선 = 진짜 경계');
  var H=150,Wd=fit(cc,H),ctx=cc.getContext('2d'),C=cols(),l=36,r=Wd-10,tp=10,bt=H-24;ctx.clearRect(0,0,Wd,H);
  function px(d){return l+(d-1)/11*(r-l)}function py(a){return bt-(a-.5)/.5*(bt-tp)}
  ctx.strokeStyle=C.rule;ctx.beginPath();ctx.moveTo(l,tp);ctx.lineTo(l,bt);ctx.lineTo(r,bt);ctx.stroke();ctx.font=font(10.5);ctx.fillStyle=C.muted;ctx.textAlign='right';[.5,.75,1].forEach(function(v){ctx.fillText(pct(v,0),l-4,py(v)+4);});ctx.textAlign='center';[1,3,6,9,12].forEach(function(v){ctx.fillText(v,px(v),bt+14);});
  [['tr',C.gfp],['va',C.amber]].forEach(function(s){ctx.strokeStyle=s[1];ctx.lineWidth=2.4;ctx.beginPath();DEPTHS.forEach(function(o,i){var X=px(i+1),Y=py(o[s[0]]);i?ctx.lineTo(X,Y):ctx.moveTo(X,Y);});ctx.stroke();DEPTHS.forEach(function(o,i){circ(ctx,px(i+1),py(o[s[0]]),i+1===dep?5:2.5,s[1]);});});
  ctx.strokeStyle=C.text;ctx.setLineDash([3,3]);ctx.beginPath();ctx.moveTo(px(dep),tp);ctx.lineTo(px(dep),bt);ctx.stroke();ctx.setLineDash([]);
  ctx.fillStyle=C.text;ctx.textAlign='left';ctx.font=font(11,700);var o=DEPTHS[dep-1];ctx.fillText('깊이 '+dep+' · 훈련 '+pct(o.tr)+' · 검증 '+pct(o.va)+' · 잎 '+o.t.leaves+'개',l+6,tp+12);}
 $('dtSl').addEventListener('input',function(){dep=+this.value;$('dtVal').textContent=dep;draw();});draw();onRedraw(draw);})();

/* ── 담판: 트리 깊이 ── */
Duel('d2',{title:'트리를 얼마나 깊게 키울까',q:'03장의 점 300개(정답 15%가 잘못 적힘). 200개로 결정 트리를 키우고, 처음 보는 100개로 잰다. 깊이를 누가 더 잘 골랐을까?',
 fly:['깊이 3에서 멈춘다','질문 몇 개면 충분해. 나머지는 잡음일걸.'],robo:['끝까지 키운다','훈련 정확도 100%. 이걸로 간다.'],roboMood:'chart',
 run:async function(p){p(.3);await wait(150);var S=CURVE,a=SUP.fitDepth(S,3),b=SUP.fitDepth(S,30);p(1);
  return {winner:a.va>b.va?'f':(a.va<b.va?'r':'d'),measure:'훈련 정확도는 Money-Robo 쪽 '+pct(b.tr)+', 초파리 쪽 '+pct(a.tr)+'. 그런데 처음 보는 100개에서는 초파리 쪽 '+pct(a.va)+', Money-Robo 쪽 '+pct(b.va)+'예요. 끝까지 키운 트리는 잎이 '+b.t.leaves+'개, 깊이 3 트리는 '+a.t.leaves+'개예요.',
   verdict:'외운 것과 이해한 것은 다르다. 끝까지 키운 트리는 잘못 적힌 정답까지 외웠다. 이 구역은 초파리 쪽이다.',key:'실력은 처음 보는 데이터로 잰다.',
   render:function(box){box.innerHTML=statGrid([[pct(a.tr),'초파리 · 훈련 정확도','f'],[pct(a.va),'초파리 · 검증 정확도','f'],[pct(b.tr),'Money-Robo · 훈련 정확도','r'],[pct(b.va),'Money-Robo · 검증 정확도','r']])+
    '<div class="two" style="margin-top:12px"><figure style="margin:0"><canvas class="fig" id="dA" aria-label="깊이 3 트리의 경계"></canvas><figcaption class="muted" style="font-size:13px">초파리 · 깊이 3 (잎 '+a.t.leaves+'개)</figcaption></figure><figure style="margin:0"><canvas class="fig" id="dB" aria-label="끝까지 키운 트리의 경계"></canvas><figcaption class="muted" style="font-size:13px">Money-Robo · 끝까지 (잎 '+b.t.leaves+'개)</figcaption></figure></div>';
    function dr(){regionCanvas($('dA'),a.t,S.tr,220);regionCanvas($('dB'),b.t,S.tr,220);}setTimeout(dr,0);onRedraw(dr);}};},
 alts:[{label:'잘못 적힌 정답이 없다면?',run:async function(box){var S=SUP.curve(0),a=SUP.fitDepth(S,3),b=SUP.fitDepth(S,30);
   box.innerHTML=statGrid([[pct(a.va),'초파리 · 깊이 3 · 검증','f'],[pct(b.va),'Money-Robo · 끝까지 · 검증','r'],[pct(b.tr),'Money-Robo · 훈련']])+say('robo','happy','봐, 데이터가 깨끗하면 깊게 키워도 '+pct(b.va)+'! 깊이 3보다 높잖아.')+say('fly','coffee','인정. 외울 잡음이 없으면 깊어도 괜찮아. 문제는 실제 데이터엔 잡음이 늘 있다는 거지.');}},
  {label:'깊이별로 다 재 보면?',run:async function(box){box.innerHTML='<div class="tw"><table class="tb"><thead><tr><th>깊이</th><th>잎</th><th>훈련</th><th>검증</th></tr></thead><tbody>'+DEPTHS.map(function(o,i){return '<tr><td>'+(i+1)+'</td><td>'+o.t.leaves+'</td><td>'+pct(o.tr)+'</td><td>'+(o.va===Math.max.apply(null,DEPTHS.map(function(q){return q.va}))?'<b>'+pct(o.va)+'</b>':pct(o.va))+'</td></tr>';}).join('')+'</tbody></table></div>'+say('asst','ledger','검증 정확도가 가장 높은 깊이를 고르는 게 정석이에요. 다만 이렇게 검증 데이터로 고르면, 마지막 실력은 또 다른 시험 데이터로 재야 해요. 이 이야기는 4-11에서 다시 해요.');}}]});

/* ══ 확인 문제 ══ */
var QUIZ={q2:[
 {q:'지도학습에서 "얼마나 틀렸나"를 잴 수 있는 까닭은?',o:[['데이터마다 정답 y가 있어서',1,'예측과 정답의 차이가 곧 오차다. 비지도학습은 정답이 없어서 이렇게 잴 수 없다(4-3).'],['모델이 직선이라서',0,'모델 모양과 상관없다. 트리든 신경망이든 정답이 있으면 오차를 잴 수 있다.'],['데이터가 60개뿐이라서',0,'데이터 수와 상관없다.']]},
 {q:'같은 광고비 데이터에서 y를 "목표 달성 여부"로 바꾸면?',o:[['분류가 된다',1,'정답이 이름표(달성/미달)이니 분류다. 02장 그림에서 점이 두 줄로 갈렸다.'],['비지도학습이 된다',0,'정답(달성 여부)이 붙어 있으니 여전히 지도학습이다.'],['회귀 그대로다',0,'회귀는 숫자를 맞힐 때다.']]},
 {q:'트리를 끝까지 키우면 훈련 정확도 100%인데 검증 정확도가 떨어지는 까닭은?',o:[['잘못 적힌 정답과 잡음까지 외워서',1,'과적합이다. 잡음이 없는 데이터(담판의 조건 바꾸기)에서는 차이가 거의 사라진다.'],['검증 데이터가 너무 적어서',0,'100개면 충분히 차이가 보인다. 깊이를 바꿔도 검증 데이터는 같다.'],['트리가 확률을 내지 못해서',0,'확률과는 상관없다. 경계가 잘게 쪼개진 것이 원인이다.']]}]};

var PROMPTS=[
 {t:'① 내 데이터로 과적합 확인',use:'모델이 외우고 있는지 확인하고 싶을 때',p:'아래 코드는 결정 트리를 깊이 1부터 끝까지 키우며 훈련 정확도와 검증 정확도를 비교한다. 이 구조를 내 데이터에 맞게 바꿔 줘.\n\n- 내 데이터: 〔예) customers.csv, 정답 열 churn(이탈 0/1)〕\n- 특징 열: 〔예) 가입 기간, 월 사용액, 문의 횟수〕\n\n깊이별 훈련·검증 정확도 표와 그래프를 그리고, 검증 정확도가 가장 높은 깊이를 골라 줘. 그 깊이를 고른 뒤 최종 성능은 따로 떼어 둔 시험 데이터로 한 번만 재는 부분도 넣어 줘.'},
 {t:'② 회귀와 분류로 같은 문제 풀기',use:'숫자로 맞힐지 이름표로 맞힐지 정할 때',p:'〔예) 다음 달 매출〕을 예측하려 한다. 같은 데이터로 ① 회귀(매출액 예측)와 ② 분류(목표 〔예) 1억〕 달성 여부)를 각각 만들 때의 장단점을 표로 비교해 줘. 각각 어떤 평가 지표를 쓰는지, 회귀 결과를 문턱에 대어 분류로 바꾸는 방법과 그때의 주의점도 알려 줘.'},
 {t:'③ 잘못 적힌 정답 찾기',use:'정답 열에 잡음이 많을 것 같을 때',p:'지도학습 데이터의 정답 일부가 잘못 적혀 있을 때(label noise) 생기는 문제와 대처법을 정리해 줘. 1) 과적합과의 관계 2) 잘못 적힌 정답을 찾는 간단한 방법(예: 교차 검증 예측과 정답이 크게 다른 행 보기) 3) 트리 깊이 제한, 규제 같은 대응. 내 데이터는 〔설명〕이다. 파이썬 예시 코드도 붙여 줘.'},
 {t:'④ 수업용 과적합 시연 만들기',use:'강의에서 과적합을 눈으로 보여 주고 싶을 때',p:'고등학생도 이해할 수 있는 과적합 시연을 기획해 줘. 1) 일상 비유 하나 2) 5분 안에 Colab에서 돌릴 수 있는 시연 코드(결정 트리 깊이 슬라이더 또는 다항 회귀 차수) 3) 학생에게 던질 질문 세 개와 예상 답. 정답에 일부러 잡음을 섞는 이유도 설명해 줘.'}];
var GL=[
 ['데이터','입력','모델에 넣는 값(X). 특징이라고도 한다.'],['데이터','정답','데이터마다 붙은 맞히려는 값(y). 레이블.'],
 ['파','회귀','숫자를 맞히는 지도학습.'],['파','분류','이름표를 맞히는 지도학습.'],
 ['학습','오차','예측과 정답의 차이.'],['학습','평균 제곱 오차','오차를 제곱해 평균한 값. 회귀에서 많이 줄이는 손실.'],
 ['학습','경사 하강','오차가 줄어드는 방향으로 가중치를 조금씩 옮기는 방법.'],['학습','기울기','직선이 얼마나 가파른지(w). 경사 하강의 "기울기"와는 다른 뜻으로도 쓰인다.'],
 ['학습','문턱','확률을 이름표로 바꾸는 기준값. 보통 0.5.'],['모델','결정 트리','예/아니오 질문을 이어 붙여 답을 내는 모델.'],['모델','잎','결정 트리의 맨 끝 칸. 답이 정해지는 곳.'],
 ['평가','훈련 데이터','모델이 배우는 데 쓰는 데이터.'],['평가','검증 데이터','배우는 동안 보여 주지 않고 실력을 재는 데이터.'],['평가','과적합','훈련 데이터만 외워 처음 보는 데이터에서 틀리는 상태.'],['평가','정확도','맞힌 개수 ÷ 전체 개수.']];
var ANALOGY=[
 ['지도학습','답지가 있는 문제집으로 공부',2,'냄새와 설탕(보상)·전기충격(벌)을 짝지어 배우는 연상 학습','초파리가 받는 것은 이름표가 아니라 겪은 사건이다'],
 ['경사 하강','안개 낀 산에서 발밑이 내려가는 쪽으로 한 걸음씩',1,'','실제 손실 지형은 골짜기가 여러 개라 가장 낮은 곳에 닿는다는 보장이 없다'],
 ['과적합','기출문제 답만 외운 학생',1,'','외운 학생은 스스로 외웠다는 걸 알지만, 모델은 모른다. 그래서 검증 데이터로 재야 한다'],
 ['검증 데이터','봉인된 모의고사',1,'','검증 데이터로 설정을 여러 번 고르면 그것도 조금씩 "외워진다"(4-11)']];
var REFS=[
 'Hastie, T., Tibshirani, R., &amp; Friedman, J. (2009). <i>The Elements of Statistical Learning</i> (2nd ed.), 2장(지도학습 개요)·7장(모델 평가와 선택)·9장(트리). Springer.',
 'Breiman, L., Friedman, J. H., Olshen, R. A., &amp; Stone, C. J. (1984). <i>Classification and Regression Trees</i>. Wadsworth. — 결정 트리',
 'Pawar, P. <i>Machine Learning Algorithm Family Tree</i> (인포그래픽). — 지도학습 칸의 구성'];
var TIP={who:'지도학습을 처음 배우는 학습자. 4-1을 읽었으면 좋다',goal:'① 지도학습의 재료(X, y)와 학습 흐름(예측→비교→고치기)을 설명한다 ② 같은 데이터에서 y를 바꿔 회귀와 분류를 구별한다 ③ 훈련·검증 정확도의 차이로 과적합을 알아본다',time:'읽기 15분 · 슬라이더와 담판 10분 · Colab 10분',
 plans:[['강의형 30분','01장 애니메이션 5분 → 02장 y 바꾸기 5분 → 03장 깊이 슬라이더를 학생과 함께 움직이며 "검증이 가장 높은 깊이" 맞히기 10분 → 담판 10분.'],['실무 OJT 60분','03장 15분 → 사내 데이터로 프롬프트 ①을 돌려 깊이별 표 만들기 30분 → 결과 공유 15분.'],['1:1 튜터링','담판 결과를 열기 전에 승자를 예측하게 하고, 틀렸다면 그 까닭을 03장 곡선으로 설명하게 한다.']],
 myths:[['훈련 정확도가 높으면 좋은 모델이다','처음 보는 데이터의 정확도가 진짜 실력이다'],['복잡한 모델이 늘 이긴다','잡음이 많은 데이터에서는 단순한 모델이 이기기도 한다(담판)'],['분류와 회귀는 데이터가 다르다','같은 데이터라도 정답 y를 어떻게 두느냐로 갈린다']]};
var CODE={title:'트리 깊이와 과적합',sub:'담판 재현 · numpy, scikit-learn · CPU 몇 초',file:'tree_depth_overfit',
 desc:'03장과 담판을 옮겼다. 물결 모양 경계에 정답 15%를 뒤집은 점 300개를 만들고, 결정 트리를 깊이 1부터 끝까지 키우며 훈련·검증 정확도를 비교한다. 잡음이 없을 때도 함께 본다.',
 cap:'실행 결과 (scikit-learn 1.x, CPU). 데이터 규칙은 브라우저와 같지만 난수 생성기와 트리 구현이 달라 숫자는 조금 다르다. 결론(잡음이 있으면 끝까지 키운 트리가 검증에서 진다)은 같다.'};
