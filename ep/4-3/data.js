/* ══ 4-3 데이터: 고객 180명 (규칙으로 만든 예시, 난수 고정) ══ */
var UNS=(function(){
var GN=['일반','단골','VIP'];
function cust(payOnly){var r=ML.R(43),S=payOnly?[[5,3],[5,7],[5,12]]:[[2,3],[8,4],[6,12]],SD=payOnly?[[2.2,1.1],[2.2,1.1],[2.2,1.6]]:[[1,1.2],[1.5,1.2],[1.5,2]],D=[];
  for(var g=0;g<3;g++)for(var i=0;i<60;i++){var v=Math.max(0.2,S[g][0]+ML.N(r)*SD[g][0]),p=Math.max(0.3,S[g][1]+ML.N(r)*SD[g][1]);D.push({x:[v,p],y:g,stay:Math.max(2,5+2*v+0.8*p+ML.N(r)*3)});}return D;}
function std(D){var mu=[0,1].map(function(j){return ML.mean(D.map(function(d){return d.x[j]}))}),sd=[0,1].map(function(j){return Math.sqrt(ML.mean(D.map(function(d){return Math.pow(d.x[j]-mu[j],2)})))});
  return D.map(function(d){return d.x.map(function(v,j){return (v-mu[j])/sd[j]})});}
function kbest(Z,k,seeds){var best=null;(seeds||[1,2,3,4,5]).forEach(function(s){var o=ML.kmeans(Z,k,s,30);if(!best||o.sse<best.sse)best=o;});return best;}
function flyRule(D){var pay=D.map(function(d){return d.x[1]}).slice().sort(function(a,b){return a-b}),q1=pay[Math.floor(D.length/3)],q2=pay[Math.floor(2*D.length/3)];
  return {a:D.map(function(d){return d.x[1]<q1?0:d.x[1]<q2?1:2}),q1:q1,q2:q2};}
function duel(payOnly){var D=cust(payOnly),f=flyRule(D),k=kbest(std(D),3),t=D.map(function(d){return d.y});
  return {D:D,fa:f.a,q:[f.q1,f.q2],ka:k.a,fo:ML.overlap(f.a,t,3),ko:ML.overlap(k.a,t,3)};}
return {GN:GN,cust:cust,std:std,kbest:kbest,flyRule:flyRule,duel:duel};})();
