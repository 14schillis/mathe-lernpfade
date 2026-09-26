/* ================= Navigation ================= */
var app=document.getElementById("app");
function renderNav(){
  var h="";
  PARTS.forEach(function(p,i){
    var cur=i===S.part,dis=i>S.max,done=i<S.max&&!cur;
    h+='<button data-go="'+i+'"'+(cur?' aria-current="step"':'')+(dis?' disabled':'')+' class="'+(done?'done':'')+'" title="'+(i+1)+" "+p+'"><span class="n">'+(i+1)+'</span><span class="t">'+p+'</span></button>';
  });
  document.getElementById("nav").innerHTML=h;
  document.getElementById("navlbl").textContent="Abschnitt "+(S.part+1)+" von 8: "+PARTS[S.part]+(TEACH?" · Lehrermodus":"");
}
function go(p){if(DR)return;S.part=p;S.flash="part";render();window.scrollTo(0,0);}
function unlock(p){S.max=Math.max(S.max,p);go(p);}
function nextBtn(p,label){return '<div class="btnrow" data-step="next'+p+'"><button class="btn" data-act="unlock" data-p="'+p+'">'+label+'</button></div>';}
function head(i,title){return '<div class="phead"><span class="pn">Abschnitt '+(i+1)+'</span><h2>'+title+'</h2></div>';}
