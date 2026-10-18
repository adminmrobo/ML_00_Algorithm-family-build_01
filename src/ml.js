/* ══ ML: 작은 학습 엔진 (브라우저와 node에서 같은 코드) ═════════════ */
var ML=(function(){
function R(a){return function(){a|=0;a=a+0x6D2B79F5|0;var t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
function N(r){var u=0;while(!u)u=r();return Math.sqrt(-2*Math.log(u))*Math.cos(2*Math.PI*r())}
function sig(z){return 1/(1+Math.exp(-z))}
function mean(a){var s=0;for(var i=0;i<a.length;i++)s+=a[i];return s/a.length}
/* 섞어서 나누기 */
function shuffle(a,r){a=a.slice();for(var i=a.length-1;i>0;i--){var j=Math.floor(r()*(i+1));var t=a[i];a[i]=a[j];a[j]=t;}return a}
function split(D,frac,seed){var s=shuffle(D,R(seed)),k=Math.round(s.length*frac);return [s.slice(0,k),s.slice(k)]}

/* ── 선형 회귀 (특징 여러 개, 정규방정식) ── */
function solve(A,b){var n=b.length,M=A.map(function(r,i){return r.concat([b[i]])});
  for(var c=0;c<n;c++){var p=c;for(var r=c+1;r<n;r++)if(Math.abs(M[r][c])>Math.abs(M[p][c]))p=r;var t=M[c];M[c]=M[p];M[p]=t;
    for(r=0;r<n;r++){if(r===c)continue;var f=M[r][c]/M[c][c];for(var k=c;k<=n;k++)M[r][k]-=f*M[c][k];}}
  return M.map(function(r,i){return r[n]/r[i]});}
function linfit(X,y,l2){var d=X[0].length+1,A=[],b=[],i,j,k;for(i=0;i<d;i++){A.push(new Array(d).fill(0));b.push(0);}
  X.forEach(function(x,n){var v=[1].concat(x);for(i=0;i<d;i++){b[i]+=v[i]*y[n];for(j=0;j<d;j++)A[i][j]+=v[i]*v[j];}});
  if(l2)for(i=1;i<d;i++)A[i][i]+=l2;var w=solve(A,b);
  return {w:w,predict:function(x){var s=w[0];for(var i=0;i<x.length;i++)s+=w[i+1]*x[i];return s;}};}
function mae(m,X,y){var s=0;X.forEach(function(x,i){s+=Math.abs(m.predict(x)-y[i]);});return s/X.length}

/* ── 로지스틱 회귀 (경사 하강) ── */
function logfit(X,y,ep,lr){var d=X[0].length,w=new Array(d).fill(0),b=0,n=X.length;
  for(var e=0;e<ep;e++){var g=new Array(d).fill(0),gb=0;for(var i=0;i<n;i++){var z=b;for(var k=0;k<d;k++)z+=w[k]*X[i][k];var p=sig(z)-y[i];for(k=0;k<d;k++)g[k]+=p*X[i][k];gb+=p;}
    for(k=0;k<d;k++)w[k]-=lr*g[k]/n;b-=lr*gb/n;}
  return {w:w,b:b,prob:function(x){var z=b;for(var k=0;k<d;k++)z+=w[k]*x[k];return sig(z);},predict:function(x){return this.prob(x)>=.5?1:0;}};}
function acc(m,X,y){var s=0;X.forEach(function(x,i){if(m.predict(x)===y[i])s++;});return s/X.length}

/* ── 결정 트리 분류 (지니, 깊이 제한) ── */
function gini(c){var n=c[0]+c[1];if(!n)return 0;var p=c[1]/n;return 2*p*(1-p)}
function tree(X,y,maxD,minLeaf,r,mtry,w){minLeaf=minLeaf||1;var d=X[0].length,idx=X.map(function(_,i){return i});w=w||X.map(function(){return 1});
  function leaf(ix){var c=[0,0];ix.forEach(function(i){c[y[i]]+=w[i];});return {leaf:1,v:c[1]>=c[0]?1:0,c:c};}
  function grow(ix,dep){var c=[0,0];ix.forEach(function(i){c[y[i]]+=w[i];});if(dep>=maxD||ix.length<2*minLeaf||!c[0]||!c[1])return leaf(ix);
    var best=null,feats=[];for(var f=0;f<d;f++)feats.push(f);if(mtry&&r)feats=shuffle(feats,r).slice(0,mtry);
    feats.forEach(function(f){var s=ix.slice().sort(function(a,b){return X[a][f]-X[b][f]}),L=[0,0],tot=c[0]+c[1];
      for(var k=0;k<s.length-1;k++){L[y[s[k]]]+=w[s[k]];if(k+1<minLeaf||s.length-k-1<minLeaf)continue;var a=X[s[k]][f],b=X[s[k+1]][f];if(a===b)continue;
        var Rr=[c[0]-L[0],c[1]-L[1]],nl=L[0]+L[1],nr=Rr[0]+Rr[1],g=(nl*gini(L)+nr*gini(Rr))/tot;if(!best||g<best.g)best={g:g,f:f,t:(a+b)/2};}});
    if(!best||best.g>=gini(c)-1e-12)return leaf(ix);
    var li=[],ri=[];ix.forEach(function(i){(X[i][best.f]<=best.t?li:ri).push(i);});
    return {f:best.f,t:best.t,l:grow(li,dep+1),r:grow(ri,dep+1)};}
  var root=grow(idx,0);
  function pred(x){var n=root;while(!n.leaf)n=x[n.f]<=n.t?n.l:n.r;return n.v;}
  function leaves(n){return n.leaf?1:leaves(n.l)+leaves(n.r)}
  return {root:root,predict:pred,leaves:leaves(root)};}

/* ── 배깅(랜덤 포레스트 흉내)과 다수결 ── */
function forest(X,y,nT,maxD,seed,mtry){var r=R(seed),T=[];for(var t=0;t<nT;t++){var bx=[],by=[];for(var i=0;i<X.length;i++){var j=Math.floor(r()*X.length);bx.push(X[j]);by.push(y[j]);}T.push(tree(bx,by,maxD,1,r,mtry));}
  return {trees:T,predict:function(x){var v=0;T.forEach(function(t){v+=t.predict(x);});return v*2>=T.length?1:0;},vote:function(x){var v=0;T.forEach(function(t){v+=t.predict(x);});return v/T.length;}};}
/* ── 부스팅(AdaBoost, 그루터기) ── */
function adaboost(X,y,M){var n=X.length,w=X.map(function(){return 1/n}),H=[],hist=[];
  for(var m=0;m<M;m++){var st=tree(X,y,1,1,null,null,w),err=0;X.forEach(function(x,i){if(st.predict(x)!==y[i])err+=w[i];});err=Math.max(err,1e-9);var a=.5*Math.log((1-err)/err);
    H.push({t:st,a:a});w=w.map(function(wi,i){return wi*Math.exp(st.predict(X[i])!==y[i]?a:-a);});var s=w.reduce(function(p,q){return p+q},0);w=w.map(function(v){return v/s});hist.push(w.slice());}
  return {H:H,weights:hist,predict:function(x){var s=0;H.forEach(function(h){s+=h.a*(h.t.predict(x)?1:-1);});return s>=0?1:0;}};}

/* ── K-평균 (단계별) ── */
function kmeans(P,k,seed,iters){var r=R(seed),C=shuffle(P,r).slice(0,k).map(function(p){return p.slice()}),steps=[],a=P.map(function(){return 0});
  for(var it=0;it<(iters||20);it++){var ch=0;P.forEach(function(p,i){var bi=0,bd=1e18;C.forEach(function(c,j){var dd=0;for(var q=0;q<p.length;q++)dd+=(p[q]-c[q])*(p[q]-c[q]);if(dd<bd){bd=dd;bi=j;}});if(a[i]!==bi||it===0)ch++;a[i]=bi;});
    steps.push({C:C.map(function(c){return c.slice()}),a:a.slice()});
    C=C.map(function(c,j){var s=c.map(function(){return 0}),n=0;P.forEach(function(p,i){if(a[i]===j){n++;p.forEach(function(v,q){s[q]+=v;});}});return n?s.map(function(v){return v/n}):c;});
    if(!ch&&it>0)break;}
  var sse=0;P.forEach(function(p,i){var c=C[a[i]];p.forEach(function(v,q){sse+=(v-c[q])*(v-c[q]);});});
  return {C:C,a:a,steps:steps,sse:sse};}
/* 군집 번호와 숨긴 정답의 겹침(가장 잘 맞는 짝 맞추기) */
function overlap(a,t,k){var perms=[[0,1,2],[0,2,1],[1,0,2],[1,2,0],[2,0,1],[2,1,0]],best=0;if(k===2)perms=[[0,1],[1,0]];
  perms.forEach(function(p){var s=0;a.forEach(function(v,i){if(p[v]===t[i])s++;});best=Math.max(best,s);});return best/a.length;}

/* ── 주성분 분석 (거듭제곱법) ── */
function pca(P,nc){var d=P[0].length,mu=new Array(d).fill(0);P.forEach(function(p){p.forEach(function(v,q){mu[q]+=v/P.length;});});
  var Z=P.map(function(p){return p.map(function(v,q){return v-mu[q]})}),Cv=[];for(var i=0;i<d;i++){Cv.push(new Array(d).fill(0));}
  Z.forEach(function(z){for(var i=0;i<d;i++)for(var j=0;j<d;j++)Cv[i][j]+=z[i]*z[j]/(P.length-1);});
  var tot=0;for(i=0;i<d;i++)tot+=Cv[i][i];var comps=[],vals=[],M=Cv.map(function(r){return r.slice()});
  for(var c=0;c<nc;c++){var v=new Array(d).fill(0).map(function(_,q){return 1/(q+1.3)});for(var it=0;it<300;it++){var nv=M.map(function(r){return r.reduce(function(s,x,j){return s+x*v[j]},0)});var nn=Math.hypot.apply(null,nv);v=nv.map(function(x){return x/nn});}
    var lam=M.map(function(r){return r.reduce(function(s,x,j){return s+x*v[j]},0)}).reduce(function(s,x,i){return s+x*v[i]},0);comps.push(v);vals.push(lam);
    for(i=0;i<d;i++)for(var j=0;j<d;j++)M[i][j]-=lam*v[i]*v[j];}
  return {mu:mu,comps:comps,ratio:vals.map(function(l){return l/tot}),proj:Z.map(function(z){return comps.map(function(v){return z.reduce(function(s,x,i){return s+x*v[i]},0)})})};}

/* ── 두 갈래 선택(밴딧) ── */
function bandit(eps,T,pA,pB,switchAt,seed){var r=R(seed),Q=[0,0],n=[0,0],tot=0,curve=[],pulls=[];
  for(var t=0;t<T;t++){var p=t<switchAt?[pA,pB]:[pB,pA],a;
    if(r()<eps)a=r()<.5?0:1;else a=Q[0]===Q[1]?(r()<.5?0:1):(Q[0]>Q[1]?0:1);
    var rew=r()<p[a]?1:0;n[a]++;Q[a]+=(rew-Q[a])/n[a];tot+=rew;curve.push(tot);pulls.push(a);}
  return {total:tot,curve:curve,pulls:pulls,Q:Q};}
/* 상수 학습률판(최근 결과에 더 무게): Q ← Q + α(r − Q) */
function banditA(eps,alpha,T,pA,pB,switchAt,seed){var r=R(seed),Q=[0,0],tot=0,curve=[],pulls=[];
  for(var t=0;t<T;t++){var p=t<switchAt?[pA,pB]:[pB,pA],a;
    if(r()<eps)a=r()<.5?0:1;else a=Q[0]===Q[1]?(r()<.5?0:1):(Q[0]>Q[1]?0:1);
    var rew=r()<p[a]?1:0;Q[a]+=alpha*(rew-Q[a]);tot+=rew;curve.push(tot);pulls.push(a);}
  return {total:tot,curve:curve,pulls:pulls,Q:Q};}

/* ── 다수결 위원회 ── */
function choose(n,k){var c=1;for(var i=0;i<k;i++)c=c*(n-i)/(i+1);return c}
function majority(n,p){var s=0;for(var k=Math.floor(n/2)+1;k<=n;k++)s+=choose(n,k)*Math.pow(p,k)*Math.pow(1-p,n-k);return s}
/* 상관이 있는 위원: 문항마다 '함께 틀리는 몫' rho만큼은 한 번의 공통 판정을 모두가 따른다 */
function committeeSim(n,p,rho,Q,seed){var r=R(seed),ok=0;for(var q=0;q<Q;q++){var common=r()<p,v=0;for(var i=0;i<n;i++){var right=r()<rho?common:(r()<p);if(right)v++;}if(v*2>n)ok++;}return ok/Q}

/* ── 데이터 만들기 ── */
function blobs(seed,specs){var r=R(seed),D=[];specs.forEach(function(s,ci){for(var i=0;i<s.n;i++)D.push({x:[s.c[0]+N(r)*s.s[0],s.c[1]+N(r)*s.s[1]],y:ci});});return D;}
return {R:R,N:N,sig:sig,mean:mean,shuffle:shuffle,split:split,linfit:linfit,mae:mae,logfit:logfit,acc:acc,tree:tree,forest:forest,adaboost:adaboost,kmeans:kmeans,overlap:overlap,pca:pca,bandit:bandit,banditA:banditA,majority:majority,committeeSim:committeeSim,blobs:blobs};
})();
if(typeof module!=='undefined')module.exports=ML;
