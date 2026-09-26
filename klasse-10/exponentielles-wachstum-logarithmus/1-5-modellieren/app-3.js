/* ================= Abschnitt 1: Daten ================= */
function tableV(){
  var h='<table class="dt"><thead><tr><th>Jahr</th><th><i>t</i></th><th>Internetnutzer in Mio.</th></tr></thead><tbody>';
  T.forEach(function(t,i){h+='<tr><td>'+(Y0+t)+'</td><td>'+t+'</td><td class="num">'+Y[i]+'</td></tr>';});
  return h+'</tbody></table>';
}
function tableH(){
  var h='<table class="dt h"><tbody><tr><th>Jahr</th>';T.forEach(function(t){h+='<td>'+(Y0+t)+'</td>';});
  h+='</tr><tr><th><i>t</i></th>';T.forEach(function(t){h+='<td>'+t+'</td>';});
  h+='</tr><tr><th>Nutzer in Mio.</th>';Y.forEach(function(v){h+='<td class="num"><b>'+v+'</b></td>';});
  return h+'</tr></tbody></table>';
}
function P1(){
  var h=head(0,"Nur die Daten betrachten")+'<div class="stage"><div class="viz"><div class="card"><div class="chart" id="ch"></div></div>'+ 
    '<div class="card only-wide" style="margin-top:10px">'+tableH()+'</div></div><div class="side">';
  h+='<div class="card"><p>Die Tabelle zeigt die Anzahl der Internetnutzer weltweit von 2005 bis 2019.</p>'+ 
     '<p class="small">Für die Rechnung setzen wir <span class="m"><i>t</i> = 0</span> für das Jahr 2005. <span class="m"><i>t</i></span> gibt also die Jahre seit 2005 an.</p>'+ 
     '<div class="only-narrow" style="margin-top:8px">'+tableV()+'</div></div>';
  h+='<div class="card">'+mcHTML("q1");
  if(answered("q1")) h+='<div class="step" data-step="after-q1">'+mcHTML("q2")+'</div>';
  if(solved("q2")) h+=nextBtn(1,"Weiter: Strukturen untersuchen");
  h+='</div></div></div>';
  return h;
}
function D1(){chart(document.getElementById("ch"),ext(BASE,{legend:[LG_PT],aria:"Datenpunkte der Internetnutzer 2005 bis 2019",reserve:330}));}

/* ================= Abschnitt 2: Strukturen ================= */
function P2(){
  var p=S.p2,h=head(1,"Fingerabdruck der Daten")+'<div class="stage"><div class="viz"><div class="card">';
  h+='<div class="seg" role="group" aria-label="Darstellung"><button data-act="fp" data-m="d" aria-pressed="'+(p.mode==="d")+'">Zuwächse anzeigen</button>'+ 
     '<button data-act="fp" data-m="f" aria-pressed="'+(p.mode==="f")+'">Faktoren anzeigen</button></div>';
  h+='<div class="fp"><div class="hd"><span>Jahr</span><span><i>t</i></span><span style="text-align:right;padding-right:14px">Nutzer in Mio.</span><span>'+ 
     (p.mode==="d"?"Zuwachs (je 2 Jahre)":p.mode==="f"?"Faktor (je 2 Jahre)":"&nbsp;")+'</span></div>';
  T.forEach(function(t,i){
    h+='<div class="vr"><span>'+(Y0+t)+'</span><span>'+t+'</span><span class="val">'+Y[i]+'</span><span></span></div>';
    if(i<N-1){
      h+='<div class="br"><span></span><span></span><span></span><span>';
      if(p.mode==="d") h+='<span class="dv"><b>+'+DIFF[i]+'</b><i style="width:'+(DIFF[i]/500*100*0.55).toFixed(1)+'%"></i></span>';
      else if(p.mode==="f") h+='<span class="dv q"><b>· '+num(FAC[i],2)+'</b><i style="width:'+((FAC[i]-1)/0.3*100*0.55).toFixed(1)+'%"></i></span>';
      h+='</span></div>';
    }
  });
  h+='</div><div class="fpsum">';
  if(p.mode==="d") h+='Zuwachs = Wert − vorheriger Wert. Die Zuwächse liegen zwischen '+Math.min.apply(null,DIFF)+' und '+Math.max.apply(null,DIFF)+' Mio.';
  else if(p.mode==="f") h+='Faktor = Wert : vorheriger Wert (gerundet). Die Faktoren liegen zwischen '+num(Math.min.apply(null,FAC),2)+' und '+num(Math.max.apply(null,FAC),2)+'.';
  else h+='Wähle oben eine Darstellung.';
  h+='</div></div></div><div class="side"><div class="card"><p>Die Messwerte liegen immer im Abstand von 2 Jahren.</p>'+ 
     '<p>Schalte zwischen <b>Zuwächsen</b> und <b>Faktoren</b> um. Sind die Zuwächse konstant? Sind die Faktoren konstant?</p>'+ 
     '<p class="small">'+(p.seenD?"✓ ":"○ ")+"Zuwächse angesehen &nbsp; "+(p.seenF?"✓ ":"○ ")+"Faktoren angesehen</p>";
  if(p.seenD&&p.seenF) h+='<div class="step" data-step="q3wrap">'+mcHTML("q3")+'</div>';
  h+='</div>';
  if(solved("q3")) h+='<div class="card" data-step="after-q3"><div class="note"><p><b>Reale Daten folgen mathematischen Modellen meist nicht exakt.</b></p></div>'+ 
     '<p style="margin-top:10px">Wie finden wir trotzdem heraus, welches Modell die Daten <b>insgesamt</b> besser beschreibt?</p>'+nextBtn(2,"Modelle untersuchen")+'</div>';
  h+='</div></div>';
  return h;
}
