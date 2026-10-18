/* ══ 4-5 데이터 (규칙으로 만든 예시, 난수 고정) ══ */
var ENS=(function(){
function curve(flip,seed){var r=ML.R(seed||42),D=[];for(var i=0;i<300;i++){var x=r()*2-1,y=r()*2-1,c=(y>0.6*Math.sin(2.6*x))?1:0;if(r()<flip)c=1-c;D.push({x:[x,y],y:c});}var s=ML.split(D,2/3,3);return {tr:s[0],va:s[1]};}
var S=curve(.15);
function XY(A){return [A.map(function(d){return d.x}),A.map(function(d){return d.y})];}
/* 다시 뽑은 훈련 데이터(부트스트랩)로 트리 1그루 vs 25그루 */
function bag(seed){var t=XY(S.tr),v=XY(S.va),r=ML.R(seed),bx=[],by=[];for(var i=0;i<t[0].length;i++){var j=Math.floor(r()*t[0].length);bx.push(t[0][j]);by.push(t[1][j]);}
  var one=ML.tree(bx,by,30,1),f=ML.forest(t[0],t[1],25,30,seed,1);return {one:one,f:f,oa:ML.acc(one,v[0],v[1]),fa:ML.acc(f,v[0],v[1])};}
/* 부스팅용 작은 데이터: 원 안/밖 */
function ring(){var r=ML.R(9),D=[];for(var i=0;i<80;i++){var x=r()*2-1,y=r()*2-1;D.push({x:[x,y],y:(x*x+y*y<0.45)?1:0});}return D;}
var R=ring(),AB=ML.adaboost(R.map(function(d){return d.x}),R.map(function(d){return d.y}),30);
function boostAt(m){var H=AB.H.slice(0,m);return {predict:function(x){var s=0;H.forEach(function(h){s+=h.a*(h.t.predict(x)?1:-1);});return s>=0?1:0;}};}
function committee(n,p,rho,seed){return ML.committeeSim(n,p,rho,2000,seed||5);}
return {S:S,bag:bag,R:R,AB:AB,boostAt:boostAt,committee:committee};})();
