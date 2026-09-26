/* ================= Abschnitt 3: Modelle anpassen ================= */
function termLin(m){return '<span class="mi">g</span>(<span class="mi">t</span>) = <span class="v lin" id="mv">'+num(m,1)+'</span> · <span class="mi">t</span> + 1100';}
function termExp(a){return '<span class="mi">f</span>(<span class="mi">t</span>) = 1100 · <span class="v exp" id="av">'+num(a,3)+'</span><sup><span class="mi">t</span></sup>';}
function P3(){
  var p=S.p3,lin=p.tab==="lin",h=head(2,"Modelle zunächst intuitiv anpassen")+'<div class="stage"><div class="viz"><div class="card"><div class="chart" id="ch"></div></div></div><div class="side"><div class="card">';
  h+='<div class="tabs" role="tablist"><button role="tab" class="tl" data-act="tab" data-tab="lin" aria-selected="'+lin+'">A · Lineares Modell'+(p.sm!=null?'<span class="ok">✓</span>':"")+'</button>'+ 
     '<button role="tab" class="te" data-act="tab" data-tab="exp" aria-selected="'+(!lin)+'">B · Exponentielles Modell'+(p.sa!=null?'<span class="ok">✓</span>':"")+'</button></div>';
  if(lin){
    h+='<p class="small">Anfangswert fest: <span class="m"><i>g</i>(0) = 1100</span>. Damit hat das Modell die Form</p>'+ 
       '<div class="eq"><span class="mi">g</span>(<span class="mi">t</span>) = <span class="mi">m</span> · <span class="mi">t</span> + 1100</div>'+ 
       '<p><b>Auftrag:</b> Passe <span class="m"><i>m</i></span> so an, dass die Gerade die Daten möglichst gut beschreibt.</p>'+ 
       '<div class="sl" style="--thumb:'+LIN+'"><button class="stp" data-act="nudge" data-d="-1" aria-label="m verkleinern">−</button>'+ 
       '<input type="range" id="sl" min="100" max="300" step="0.5" value="'+p.m+'" aria-label="Steigung m"><button class="stp" data-act="nudge" data-d="1" aria-label="m vergrößern">+</button></div>'+ 
       '<div class="term" id="term">'+termLin(p.m)+'</div>'+ 
       '<div class="btnrow"><button class="btn" data-act="save">Mein lineares Modell festhalten</button>'+(p.sm!=null?'<span class="saved">festgehalten: m = '+num(p.sm,1)+'</span>':"")+'</div>';
  }else{
    h+='<p class="small">Anfangswert fest: <span class="m"><i>f</i>(0) = 1100</span>. Damit hat das Modell die Form</p>'+ 
       '<div class="eq"><span class="mi">f</span>(<span class="mi">t</span>) = 1100 · <span class="mi">a</span><sup><span class="mi">t</span></sup></div>'+ 
       '<p><b>Auftrag:</b> Passe <span class="m"><i>a</i></span> so an, dass der Graph die Daten möglichst gut beschreibt.</p>'+ 
       '<div class="sl" style="--thumb:'+EXP+'"><button class="stp" data-act="nudge" data-d="-1" aria-label="a verkleinern">−</button>'+ 
       '<input type="range" id="sl" min="1" max="1.2" step="0.001" value="'+p.a+'" aria-label="Wachstumsfaktor a"><button class="stp" data-act="nudge" data-d="1" aria-label="a vergrößern">+</button></div>'+ 
       '<div class="term" id="term">'+termExp(p.a)+'</div>'+ 
       '<div class="btnrow"><button class="btn" data-act="save">Mein exponentielles Modell festhalten</button>'+(p.sa!=null?'<span class="saved">festgehalten: a = '+num(p.sa,3)+'</span>':"")+'</div>';
  }
  h+='</div>';
  if(p.sm!=null&&p.sa!=null){
    h+='<div class="card" data-step="p3done"><p>Beide Modelle sind festgehalten. Du kannst sie noch verändern und erneut festhalten.</p>'+ 
       '<p>Statt nur zu probieren, können wir die Parameter auch <b>aus den Daten bestimmen</b>.</p>'+nextBtn(3,"Weiter: Parameter bestimmen")+'</div>';
  }else{
    h+='<p class="small" style="margin:10px 4px">Halte beide Modelle fest (Reiter A und B), um weiterzukommen.</p>';
  }
  h+='</div></div>';
  return h;
}
function D3(){
  var p=S.p3,lin=p.tab==="lin",cur=[],lg=[LG_PT];
  if(lin){
    if(p.sa!=null){cur.push({f:fS,col:EXP,w:2,dash:"6 5",op:0.6});lg.push({col:EXP,dash:"6 5",op:0.6,w:2,label:"dein exponentielles Modell"});}
    cur.push({f:function(t){return Y[0]+p.m*t;},col:LIN,w:2.8});lg.push({col:LIN,label:"lineares Modell g"});
  }else{
    if(p.sm!=null){cur.push({f:gS,col:LIN,w:2,dash:"6 5",op:0.6});lg.push({col:LIN,dash:"6 5",op:0.6,w:2,label:"dein lineares Modell"});}
    cur.push({f:function(t){return Y[0]*Math.pow(p.a,t);},col:EXP,w:2.8});lg.push({col:EXP,label:"exponentielles Modell f"});
  }
  chart(document.getElementById("ch"),ext(BASE,{curves:cur,legend:lg,rings:[{t:0,label:"fest: (0 | 1100)",col:"#6b7686",side:"b"}],aria:"Datenpunkte mit angepasstem Modell"}));
}

/* ================= Abschnitt 4: Parameter bestimmen ================= */
var M2R=Math.round(M2*10)/10, A2R=Math.round(A2*1000)/1000;
function P4(){
  var p=S.p4,h=head(3,"Parameter mathematisch bestimmen")+'<div class="stage"><div class="viz"><div class="card"><div class="chart" id="ch"></div></div></div><div class="side">';
  h+='<div class="card"><p>Statt nur zu probieren, können wir die Parameter auch aus den Daten bestimmen. Wir verwenden den <b>ersten</b> und den <b>letzten</b> Messwert:</p>'+ 
     '<div class="eq" style="color:#1f4e79">P₁(0 | 1100) &nbsp;und&nbsp; P₂(14 | 3969)</div></div>';
  h+='<div class="card"><h3 class="lin">Lineares Modell <span class="m">g(<i>t</i>) = <i>m</i> · <i>t</i> + 1100</span></h3>'+mcHTML("q4l");
  if(solved("q4l")){
    h+='<div class="step" data-step="after-q4l"><div class="stepline"><i>m</i> = '+fr("3969 − 1100","14 − 0")+' = '+fr("2869","14")+'</div>';
    if(!(p.lOk||p.lShow)){
      h+='<p>Berechne <span class="m"><i>m</i></span> und runde auf eine Nachkommastelle.</p><div class="inrow"><label for="inL"><i>m</i> ≈</label>'+ 
         '<input id="inL" inputmode="decimal" autocomplete="off" value="'+p.lIn+'"><button class="btn ghost" data-act="chkL">Prüfen</button>'+ 
         (p.lTry>=2?'<button class="btn quiet" data-act="showL">Lösung zeigen</button>':"")+'</div>'+(p.lFb?'<div class="fb hint">'+p.lFb+'</div>':"");
    }else{
      h+='<div class="stepline" data-step="lres"><i>m</i> ≈ <b>'+num(M2,1)+'</b></div>'+ 
         '<div class="term" data-step="lterm"><span class="mi">g</span>(<span class="mi">t</span>) ≈ 1100 + <span class="v lin">'+num(M2,1)+'</span> · <span class="mi">t</span></div>'+ 
         (S.p3.sm!=null?'<p class="small">Dein Schätzwert aus Abschnitt 3: <span class="m"><i>m</i> = '+num(S.p3.sm,1)+'</span></p>':"");
    }
    h+='</div>';
  }
  h+='</div>';
  var lDone=p.lOk||p.lShow;
  if(lDone){
    h+='<div class="card" data-step="ecard"><h3 class="exp">Exponentielles Modell <span class="m">f(<i>t</i>) = 1100 · <i>a</i><sup><i>t</i></sup></span></h3>';
    if(!p.eSub){
      h+='<p>Setze <span class="m">P₂(14 | 3969)</span> in <span class="m">f(<i>t</i>) = 1100 · <i>a</i><sup><i>t</i></sup></span> ein.</p><div class="btnrow"><button class="btn ghost" data-act="sub">Einsetzen</button></div>';
    }else{
      h+='<div class="stepline" data-step="esub">3969 = 1100 · <i>a</i><sup>14</sup></div>'+mcHTML("q4e1");
      if(solved("q4e1")){
        h+='<div class="step" data-step="after-q4e1"><div class="stepline">'+fr("3969","1100")+' = <i>a</i><sup>14</sup></div>'+mcHTML("q4e2")+'</div>';
      }
      if(solved("q4e2")){
        h+='<div class="step" data-step="after-q4e2"><div class="stepline"><i>a</i> = '+rt("14",fr("3969","1100"))+' = <span class="pw"><span class="pa">(</span>'+fr("3969","1100")+'<span class="pa">)</span><span class="px">'+fr("1","14")+'</span></span></div>';
        if(!(p.eOk||p.eShow)){
          h+='<p>Berechne <span class="m"><i>a</i></span> mit dem Taschenrechner und runde auf drei Nachkommastellen.</p><div class="inrow"><label for="inE"><i>a</i> ≈</label>'+ 
             '<input id="inE" inputmode="decimal" autocomplete="off" value="'+p.eIn+'"><button class="btn ghost" data-act="chkE">Prüfen</button>'+ 
             (p.eTry>=2?'<button class="btn quiet" data-act="showE">Lösung zeigen</button>':"")+'</div>'+(p.eFb?'<div class="fb hint">'+p.eFb+'</div>':"");
        }else{
          h+='<div class="stepline" data-step="eres"><i>a</i> ≈ <b>'+num(A2,3)+'</b></div>'+ 
             '<div class="term"><span class="mi">f</span>(<span class="mi">t</span>) ≈ 1100 · <span class="v exp">'+num(A2,3)+'</span><sup><span class="mi">t</span></sup></div>'+ 
             (S.p3.sa!=null?'<p class="small">Dein Schätzwert aus Abschnitt 3: <span class="m"><i>a</i> = '+num(S.p3.sa,3)+'</span></p>':"");
        }
        h+='</div>';
      }
    }
    h+='</div>';
  }
  if(p.eOk||p.eShow){
    h+='<div class="card" data-step="both"><div class="note"><p><b>Die zugrunde liegenden Zwei-Punkte-Modelle treffen Anfangs- und Endpunkt exakt.</b> Für die Anzeige wurden die Parameter gerundet.</p>'+ 
       '<p class="small">Mit den ungerundeten Parametern gilt: g(0) = f(0) = 1100 und g(14) = f(14) = 3969. Alle Diagramme und Rechnungen verwenden die ungerundeten Werte.</p></div><div style="margin-top:10px">'+mcHTML("q4o")+'</div>';
    if(answered("q4o")) h+=nextBtn(4,"Weiter: Modelle prüfen");
    h+='</div>';
  }
  h+='</div></div>';
  return h;
}
function D4(){
  var p=S.p4,cur=[],lg=[LG_PT],lDone=p.lOk||p.lShow,eDone=p.eOk||p.eShow;
  if(lDone){cur.push({f:g2,col:LIN,anim:S.anim.g2});lg.push({col:LIN,label:"g(t) ≈ 1100 + "+num(M2,1)+" · t"});}
  if(eDone){cur.push({f:f2,col:EXP,anim:S.anim.f2});lg.push({col:EXP,label:"f(t) ≈ 1100 · "+num(A2,3)+"ᵗ"});}
  S.anim={};
  chart(document.getElementById("ch"),ext(BASE,{curves:cur,legend:lg,rings:[{t:0,label:"P₁(0 | 1100)",side:"b"},{t:14,label:"P₂(14 | 3969)",side:"l"}],aria:"Zwei-Punkte-Modelle"}));
}
function parseNum(s){s=String(s||"").replace(/\s/g,"").replace(",",".").replace("−","-");if(!/^-?\d*\.?\d+$/.test(s))return NaN;return parseFloat(s);}
