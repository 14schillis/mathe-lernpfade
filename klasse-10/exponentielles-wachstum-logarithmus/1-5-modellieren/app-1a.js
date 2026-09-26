/* ================= Daten & Modelle ================= */
var T=[0,2,4,6,8,10,12,14];
var Y=[1100,1382,1772,2242,2660,3030,3492,3969];
var Y0=2005, N=T.length;
var LIN="#2466a8", EXP="#b0601c", PT="#2d3a48", AMB="#c98a1c";

/* Zwei-Punkte-Modelle aus erstem und letztem Messwert */
var M2=(Y[N-1]-Y[0])/(T[N-1]-T[0]);
var A2=Math.pow(Y[N-1]/Y[0],1/(T[N-1]-T[0]));
function g2(t){return Y[0]+M2*t;}
function f2(t){return Y[0]*Math.pow(A2,t);}

/* Ausgleichsrechnung (kleinste Quadrate) */
function linReg(xs,ys){
  var n=xs.length,mx=0,my=0,i,sxy=0,sxx=0;
  for(i=0;i<n;i++){mx+=xs[i];my+=ys[i];}
  mx/=n;my/=n;
  for(i=0;i<n;i++){sxy+=(xs[i]-mx)*(ys[i]-my);sxx+=(xs[i]-mx)*(xs[i]-mx);}
  var k=sxy/sxx;return {k:k,d:my-k*mx};
}
var LR=linReg(T,Y);
var ER=linReg(T,Y.map(function(v){return Math.log(v);}));
var MC=LR.k, TC=LR.d, BC=Math.exp(ER.d), AC=Math.exp(ER.k);
function gC(t){return MC*t+TC;}
function fC(t){return BC*Math.pow(AC,t);}
function gS(t){return Y[0]+S.p3.sm*t;}          /* eigenes lineares Modell */
function fS(t){return Y[0]*Math.pow(S.p3.sa,t);} /* eigenes exponentielles Modell */
function mad(F){var s=0;for(var i=0;i<N;i++)s+=Math.abs(F(T[i])-Y[i]);return s/N;}

var DIFF=[],FAC=[];
for(var i0=1;i0<N;i0++){DIFF.push(Y[i0]-Y[i0-1]);FAC.push(Y[i0]/Y[i0-1]);}

/* ================= Formatierung ================= */
function num(v,d){
  d=d||0;
  var s=Math.abs(v).toFixed(d), p=s.split("."), ip=p[0];
  if(ip.length>4) ip=ip.replace(/\B(?=(\d{3})+(?!\d))/g," ");
  var neg=v<0&&Number(s)!==0;
  return (neg?"−":"")+ip+(p[1]?","+p[1]:"");
}
function mrd(v){return num(v/1000,1);}
function fr(a,b){return '<span class="fr"><span>'+a+'</span><span>'+b+'</span></span>';}
function rt(n,x){return '<span class="rt"><span class="ri">'+n+'</span><svg class="rsv" viewBox="0 0 10 20" preserveAspectRatio="none" aria-hidden="true"><path d="M0.3 12.6 L2.6 11.2 L5.4 19.6 L9.7 0.4 L10.4 0.4" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round" vector-effect="non-scaling-stroke"/></svg><span class="rr">'+x+'</span></span>';}
function shuf(a){a=a.slice();for(var i=a.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1)),t=a[i];a[i]=a[j];a[j]=t;}return a;}
function range(n){var a=[];for(var i=0;i<n;i++)a.push(i);return a;}
var RED=window.matchMedia&&window.matchMedia("(prefers-reduced-motion: reduce)").matches;
var TEACH=/[?&]teacher=1\b/.test(location.search);
