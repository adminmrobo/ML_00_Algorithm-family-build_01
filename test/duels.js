const ML=require('../src/ml.js');
// 4-1: 같은 매출 데이터, 다른 질문
function store(seed){const r=ML.R(seed),D=[];for(let i=0;i<120;i++){const ad=r()*10,wk=r()<2/7?1:0,s=50+6*ad+25*wk+ML.N(r)*10;D.push({x:[ad,wk],s:s,y:s>=100?1:0});}return D;}
{const D=store(41),[tr,te]=ML.split(D,2/3,7);
 const Xs=D=>D.map(d=>[d.x[0]/10,d.x[1]]);
 const lg=ML.logfit(Xs(tr),tr.map(d=>d.y),3000,1.0);const a=ML.acc(lg,Xs(te),te.map(d=>d.y));
 const maj=Math.round(ML.mean(tr.map(d=>d.y)));const ab=ML.mean(te.map(d=>d.y===maj?1:0));
 const ln=ML.linfit(tr.map(d=>d.x),tr.map(d=>d.s));const m=ML.mae(ln,te.map(d=>d.x),te.map(d=>d.s));
 const mu=ML.mean(tr.map(d=>d.s));const mb=ML.mean(te.map(d=>Math.abs(d.s-mu)));
 const viaReg=ML.mean(te.map(d=>((ln.predict(d.x)>=100)?1:0)===d.y?1:0));
 console.log('4-1 cls acc',a.toFixed(3),'base',ab.toFixed(3),'| reg MAE',m.toFixed(2),'base',mb.toFixed(2),'| reg→cls',viaReg.toFixed(3),'pos rate',ML.mean(D.map(d=>d.y)).toFixed(2));}
// 4-2: 트리 깊이
function curve(seed,n,flip){const r=ML.R(seed),D=[];for(let i=0;i<n;i++){const x=r()*2-1,y=r()*2-1;let c=(y>0.6*Math.sin(2.6*x))?1:0;if(r()<flip)c=1-c;D.push({x:[x,y],y:c});}return D;}
for(const flip of [0.15,0]){const D=curve(42,300,flip),[tr,te]=ML.split(D,2/3,3);const X=tr.map(d=>d.x),Y=tr.map(d=>d.y),Xt=te.map(d=>d.x),Yt=te.map(d=>d.y);
 const out=[];for(const dep of [1,2,3,4,5,6,8,10,30]){const t=ML.tree(X,Y,dep,1);out.push(dep+':'+ML.acc(t,X,Y).toFixed(2)+'/'+ML.acc(t,Xt,Yt).toFixed(2)+'('+t.leaves+')');}
 console.log('4-2 flip',flip,out.join(' '));}
// 4-3: 고객 군집
function cust(seed,payOnly){const r=ML.R(seed),S=payOnly?[[5,3],[5,7],[5,12]]:[[2,3],[8,4],[6,12]],SD=payOnly?[[2.2,1.1],[2.2,1.1],[2.2,1.6]]:[[1,1.2],[1.5,1.2],[1.5,2]],D=[];
 for(let g=0;g<3;g++)for(let i=0;i<60;i++)D.push({x:[Math.max(0.2,S[g][0]+ML.N(r)*SD[g][0]),Math.max(0.3,S[g][1]+ML.N(r)*SD[g][1])],y:g});return D;}
for(const po of [false,true]){const D=cust(43,po);const pay=D.map(d=>d.x[1]).slice().sort((a,b)=>a-b),q1=pay[60],q2=pay[120];
 const fa=D.map(d=>d.x[1]<q1?0:d.x[1]<q2?1:2);const fo=ML.overlap(fa,D.map(d=>d.y),3);
 const mu=[0,1].map(j=>ML.mean(D.map(d=>d.x[j]))),sd=[0,1].map(j=>Math.sqrt(ML.mean(D.map(d=>(d.x[j]-mu[j])**2))));
 const Z=D.map(d=>d.x.map((v,j)=>(v-mu[j])/sd[j]));let best=null;for(const s of [1,2,3,4,5]){const k=ML.kmeans(Z,3,s,30);if(!best||k.sse<best.sse)best=k;}
 const ro=ML.overlap(best.a,D.map(d=>d.y),3);console.log('4-3 payOnly',po,'fly',fo.toFixed(3),'robo',ro.toFixed(3));}
// 4-4: 탐험
for(const [T,sw] of [[200,100],[300,100]]){let g=0,e=0,S=300;for(let s=0;s<S;s++){g+=ML.banditA(0,0.1,T,0.7,0.3,sw,1000+s).total;e+=ML.banditA(0.1,0.1,T,0.7,0.3,sw,1000+s).total;}
 let gn=0,en=0;for(let s=0;s<S;s++){gn+=ML.banditA(0,0.1,T,0.7,0.3,1e9,2000+s).total;en+=ML.banditA(0.1,0.1,T,0.7,0.3,1e9,2000+s).total;}
 console.log('4-4 T',T,'switch: greedy',(g/S).toFixed(1),'eps',(e/S).toFixed(1),'| no switch: greedy',(gn/S).toFixed(1),'eps',(en/S).toFixed(1));}
// 4-5
console.log('4-5 maj25',ML.majority(25,0.6).toFixed(3),'maj5',ML.majority(5,0.6).toFixed(3),'sim rho0',ML.committeeSim(25,0.6,0,4000,5).toFixed(3),'rho.5',ML.committeeSim(25,0.6,0.5,4000,5).toFixed(3),'rho1',ML.committeeSim(25,0.6,1,4000,5).toFixed(3),'single',ML.committeeSim(1,0.6,0,4000,5).toFixed(3));
