/* ══ 4-4 데이터: 보상 상자 두 개 (밴딧), 시드 고정 ══ */
var RL=(function(){
var T=300,SW=100,PA=.7,PB=.3,ALPHA=.1,S=300;
function avg(eps,sw,seed0){var cur=new Float64Array(T),tot=0,good=0;for(var s=0;s<S;s++){var o=ML.banditA(eps,ALPHA,T,PA,PB,sw,seed0+s);tot+=o.total;
   for(var t=0;t<T;t++){cur[t]+=o.curve[t]/S;var best=(t<sw)?0:1;if(o.pulls[t]===best)good++;}}
  return {mean:tot/S,curve:cur,goodRate:good/(S*T)};}
function duel(sw){sw=sw==null?SW:sw;var seed=sw>T?2000:1000;return {g:avg(0,sw,seed),e:avg(0.1,sw,seed),e5:avg(0.5,sw,seed)};}
return {T:T,SW:SW,PA:PA,PB:PB,ALPHA:ALPHA,S:S,avg:avg,duel:duel};})();
