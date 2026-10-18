/* ══ 4-2 데이터 (규칙으로 만든 예시, 난수 고정) ══ */
var SUP=(function(){
/* 광고비 → 매출 (01·02장) */
function ad(){var r=ML.R(21),D=[];for(var i=0;i<60;i++){var x=r()*10,s=50+6*x+ML.N(r)*8;D.push({x:x,s:s,y:s>=90?1:0});}return D;}
/* 곡선 경계 + 정답 일부 뒤집기 (03장·대결) */
function curve(flip){var r=ML.R(42),D=[];for(var i=0;i<300;i++){var x=r()*2-1,y=r()*2-1,c=(y>0.6*Math.sin(2.6*x))?1:0;if(r()<flip)c=1-c;D.push({x:[x,y],y:c});}var s=ML.split(D,2/3,3);return {tr:s[0],va:s[1]};}
function fitDepth(S,dep){var X=S.tr.map(function(d){return d.x}),Y=S.tr.map(function(d){return d.y}),t=ML.tree(X,Y,dep,1);
  return {t:t,tr:ML.acc(t,X,Y),va:ML.acc(t,S.va.map(function(d){return d.x}),S.va.map(function(d){return d.y}))};}
return {ad:ad,curve:curve,fitDepth:fitDepth};})();
