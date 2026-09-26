/* ================= Diagramm (SVG) ================= */
function niceStep(range){var c=[250,500,1000,2000,2500,5000,10000,20000,25000,50000];for(var i=0;i<c.length;i++)if(range/c[i]<=7)return c[i];return 100000;}
function chart(host,o){
  if(!host)return;
  var W=Math.max(260,Math.floor(host.clientWidth));
  var wide=window.innerWidth>=900;
  var H=Math.round(W*(o.ratio||(W<560?0.8:0.64)));
  var maxH=wide?Math.max(280,window.innerHeight-(o.reserve||200)):Math.max(260,Math.round(window.innerHeight*0.55));
  H=Math.max(220,Math.min(H,maxH,480));
  var fs=W<460?11.5:12.5;
  var yStep=o.yStep||niceStep(o.y1-o.y0);
  var ticksY=[];for(var v=o.y0;v<=o.y1+1e-9;v+=yStep)ticksY.push(v);
  var maxLab=Math.max.apply(null,ticksY.map(function(v){return num(v).length;}));
  var L=Math.round(maxLab*fs*0.62+16), R=14, TOP=12, B=o.tRow===false?30:46;
  var pw=W-L-R, ph=H-TOP-B;
  function X(t){return L+(t-o.t0)/(o.t1-o.t0)*pw;}
  function Yp(v){return TOP+ph-(v-o.y0)/(o.y1-o.y0)*ph;}
  var cid=host.id+"-clip";
  var h='<svg viewBox="0 0 '+W+' '+H+'" width="'+W+'" height="'+H+'" role="img" aria-label="'+(o.aria||"Diagramm")+'" font-family="Segoe UI,system-ui,-apple-system,Helvetica Neue,Arial,sans-serif" font-size="'+fs+'">';
  h+='<defs><clipPath id="'+cid+'"><rect x="'+L+'" y="'+TOP+'" width="'+pw+'" height="'+ph+'"/></clipPath></defs>';
  if(o.band){
    var bx0=X(o.band[0]),bx1=X(o.band[1]);
    h+='<rect x="'+bx0+'" y="'+TOP+'" width="'+(bx1-bx0)+'" height="'+ph+'" fill="#eef2f7"/>';
    if(bx1-bx0>=90)h+='<text x="'+(bx1-6)+'" y="'+(TOP+32)+'" text-anchor="end" fill="#6b7686" font-size="'+(fs-0.5)+'">Datenbereich</text>';
  }
  ticksY.forEach(function(v){var y=Yp(v);h+='<line x1="'+L+'" x2="'+(L+pw)+'" y1="'+y+'" y2="'+y+'" stroke="#e6e9ee"/>';
    h+='<text x="'+(L-7)+'" y="'+(y+4)+'" text-anchor="end" fill="#4a5566">'+num(v)+'</text>';});
  o.xt.forEach(function(t){var x=X(t);h+='<line x1="'+x+'" x2="'+x+'" y1="'+TOP+'" y2="'+(TOP+ph)+'" stroke="#eef0f3"/>';
    h+='<line x1="'+x+'" x2="'+x+'" y1="'+(TOP+ph)+'" y2="'+(TOP+ph+5)+'" stroke="#8a94a2"/>';
    h+='<text x="'+x+'" y="'+(TOP+ph+18)+'" text-anchor="middle" fill="#2d3a48">'+(Y0+t)+'</text>';
    if(o.tRow!==false)h+='<text x="'+x+'" y="'+(TOP+ph+34)+'" text-anchor="middle" fill="#7a8494" font-size="'+(fs-1)+'">'+t+'</text>';});
  h+='<text x="'+(L-7)+'" y="'+(TOP+ph+18)+'" text-anchor="end" fill="#7a8494" font-size="'+(fs-1)+'">Jahr</text>';
  if(o.tRow!==false)h+='<text x="'+(L-7)+'" y="'+(TOP+ph+34)+'" text-anchor="end" fill="#7a8494" font-size="'+(fs-1)+'" font-style="italic">t</text>';
  h+='<line x1="'+L+'" x2="'+(L+pw)+'" y1="'+(TOP+ph)+'" y2="'+(TOP+ph)+'" stroke="#5b6573" stroke-width="1.3"/>';
  h+='<line x1="'+L+'" x2="'+L+'" y1="'+TOP+'" y2="'+(TOP+ph)+'" stroke="#5b6573" stroke-width="1.3"/>';
  h+='<text x="'+(L+8)+'" y="'+(TOP+14)+'" fill="#4a5566" font-weight="600" stroke="#fff" stroke-width="4" paint-order="stroke">Internetnutzer in Mio.</text>';
  if(o.hline){var yh=Yp(o.hline.v);
    h+='<line x1="'+L+'" x2="'+(L+pw)+'" y1="'+yh+'" y2="'+yh+'" stroke="#6f7a88" stroke-width="1.5" stroke-dasharray="7 5"/>';
    h+='<text x="'+(L+8)+'" y="'+(yh-7)+'" text-anchor="start" fill="#4f5a68" font-weight="600" stroke="#fff" stroke-width="4" paint-order="stroke">'+o.hline.label+'</text>';}
  h+='<g clip-path="url(#'+cid+')">';
  (o.curves||[]).forEach(function(c){
    var d="",n=160,a=Math.max(o.t0,c.from!=null?c.from:o.t0),b=o.t1;
    for(var k=0;k<=n;k++){var t=a+(b-a)*k/n,v=c.f(t);var yy=Yp(v);if(yy<-2000)yy=-2000;d+=(k?"L":"M")+X(t).toFixed(1)+" "+yy.toFixed(1);}
    h+='<path d="'+d+'" fill="none" stroke="'+c.col+'" stroke-width="'+(c.w||2.6)+'"'+(c.dash?' stroke-dasharray="'+c.dash+'"':'')+(c.op?' opacity="'+c.op+'"':'')+
      (c.anim&&!c.dash?' pathLength="1" class="draw"':'')+' stroke-linecap="round" stroke-linejoin="round"/>';
  });
  h+='</g>';
  if(o.sel!=null&&o.devs){
    var ti=T.indexOf(o.sel),yv=Y[ti],xs=X(o.sel);
    o.devs.forEach(function(dv){
      var x=xs+dv.dx,y1=Yp(yv),y2=Yp(dv.f(o.sel));
      if(Math.abs(y2-y1)<1)return;
      h+='<line x1="'+x+'" x2="'+x+'" y1="'+y1+'" y2="'+y2+'" stroke="'+dv.col+'" stroke-width="2.4" stroke-dasharray="4 3"/>';
      h+='<line x1="'+(x-4)+'" x2="'+(x+4)+'" y1="'+y2+'" y2="'+y2+'" stroke="'+dv.col+'" stroke-width="2.4"/>';
    });
  }
  (o.rings||[]).forEach(function(r){
    var ti=T.indexOf(r.t),x=X(r.t),y=Yp(Y[ti]);
    h+='<circle cx="'+x+'" cy="'+y+'" r="11" fill="none" stroke="'+(r.col||"#1f4e79")+'" stroke-width="2.2"/>';
    if(r.label){var lx=r.side==="l"?x-16:x+12,ly=r.side==="l"?y-4:(r.side==="b"?y+28:y-14);
      h+='<text x="'+lx+'" y="'+ly+'" text-anchor="'+(r.side==="l"?"end":"start")+'" fill="'+(r.col||"#1f4e79")+'" font-weight="600" stroke="#fff" stroke-width="4" paint-order="stroke">'+r.label+'</text>';}
  });
  if(o.pts!==false){
    T.forEach(function(t,i){
      var x=X(t),y=Yp(Y[i]),sel=o.sel===t;
      if(sel)h+='<circle cx="'+x+'" cy="'+y+'" r="10" fill="#fdf3df" stroke="'+AMB+'" stroke-width="2.4"/>';
      h+='<circle cx="'+x+'" cy="'+y+'" r="'+(sel?5.5:5.2)+'" fill="'+PT+'" stroke="#fff" stroke-width="1.6"/>';
    });
    if(o.pick) T.forEach(function(t,i){
      h+='<circle class="hit" data-t="'+t+'" cx="'+X(t)+'" cy="'+Yp(Y[i])+'" r="21" fill="transparent" tabindex="-1"><title>'+(Y0+t)+': '+Y[i]+' Mio.</title></circle>';
    });
  }
  (o.marks||[]).forEach(function(m){
    var x=X(m.t),y=Yp(m.v);
    h+='<circle cx="'+x+'" cy="'+y+'" r="5" fill="#fff" stroke="'+m.col+'" stroke-width="2.4"/>';
    if(m.label)h+='<text x="'+(x+(m.side==="l"?-10:10))+'" y="'+(y+(m.dy||4))+'" text-anchor="'+(m.side==="l"?"end":"start")+'" fill="'+m.col+'" font-weight="700" stroke="#fff" stroke-width="4" paint-order="stroke">'+m.label+'</text>';
  });
  h+='</svg>';
  if(o.legend&&o.legend.length){
    h+='<div class="legend">';
    o.legend.forEach(function(l){
      h+='<span><svg viewBox="0 0 26 10" aria-hidden="true">'+(l.pt?'<circle cx="13" cy="5" r="4" fill="'+PT+'"/>':'<line x1="1" x2="25" y1="5" y2="5" stroke="'+l.col+'" stroke-width="'+(l.w||2.6)+'"'+(l.dash?' stroke-dasharray="'+l.dash+'"':'')+(l.op?' opacity="'+l.op+'"':'')+'/>')+'</svg>'+l.label+'</span>';
    });
    h+='</div>';
  }
  host.innerHTML=h;
}
var BASE={t0:-0.6,t1:14.6,y0:0,y1:4500,yStep:500,xt:T};
function ext(a,b){var o={},k;for(k in a)o[k]=a[k];for(k in b)o[k]=b[k];return o;}
var LG_PT={pt:true,label:"Messwerte"};
