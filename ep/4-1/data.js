/* ══ 4-1 데이터: 가게 매출 (규칙으로 만든 예시, 난수 고정) ══ */
var STORE=(function(){
function make(seed,target){var r=ML.R(seed),D=[];for(var i=0;i<120;i++){var ad=r()*10,wk=r()<2/7?1:0,s=50+6*ad+25*wk+ML.N(r)*10;D.push({x:[ad,wk],s:s,y:s>=target?1:0});}return D;}
function duel(target){target=target||100;var D=make(41,target),sp=ML.split(D,2/3,7),tr=sp[0],te=sp[1];
  function Xs(A){return A.map(function(d){return [d.x[0]/10,d.x[1]]});}
  var lg=ML.logfit(Xs(tr),tr.map(function(d){return d.y}),3000,1.0),acc=ML.acc(lg,Xs(te),te.map(function(d){return d.y}));
  var maj=ML.mean(tr.map(function(d){return d.y}))>=.5?1:0,base=ML.mean(te.map(function(d){return d.y===maj?1:0}));
  var ln=ML.linfit(tr.map(function(d){return d.x}),tr.map(function(d){return d.s})),mae=ML.mae(ln,te.map(function(d){return d.x}),te.map(function(d){return d.s}));
  var mu=ML.mean(tr.map(function(d){return d.s})),maeB=ML.mean(te.map(function(d){return Math.abs(d.s-mu)}));
  var via=ML.mean(te.map(function(d){return ((ln.predict(d.x)>=target)?1:0)===d.y?1:0}));
  return {D:D,tr:tr,te:te,lg:lg,ln:ln,acc:acc,base:base,maj:maj,mae:mae,maeB:maeB,via:via,pos:ML.mean(D.map(function(d){return d.y}))};}
return {make:make,duel:duel};})();
