/* ==================== Abschnitt 5: Modelle prüfen ================= */
function P5(){
  var p=S.p5,h=head(4,"Modellgüte untersuchen")+'<div class="stage"><div class="viz"><div class="card"><div class="chart" id="ch"></div>';
  h+='<div class="chips" style="justify-content:center;margin-top:8px" role="group" aria-label="Messpunkt wählen">';
  T.forEach(function(t){h+='<button class="chip'+(p.vis[t]?" seen":"")+'" data-act="pick" data-t="'+t+'" aria-pressed="'+(p.sel===t)+'">'+(Y0+t)+'</button>';});
  h+='</div></div></div><div class="side"><div class="card">';
  h+='<p>Tippe Messpunkte im Diagramm an (oder wähle ein Jahr) und vergleiche beide Modelle mit der Realität.</p>';
  if(p.sel==null){h+='<div class="fb neutral">Noch kein Punkt gewählt.</div>';}
  else{
    var t=p.sel,i=T.indexOf(t),y=Y[i],gl=g2(t),fe=f2(t);
    h+='<div class="info"><div class="ih">'+(Y0+t)+' &nbsp;<span class="small">(<i>t</i> = '+t+')</span></div>'+
       '<span class="lab">Realität</span><span class="rl">'+num(y)+' Mio.</span><span></span>'+
       '<span class="lab lin">linear <span class="m">g('+t+')</span></span><span class="lin rl">≈ '+num(gl,1)+' Mio.</span><span class="dev lin">Abweichung '+num(Math.abs(gl-y),1)+'</span>'+
       '<span class="lab exp">exponentiell <span class="m">f('+t+')</span></span><span class="exp rl">≈ '+num(fe,1)+' Mio.</span><span class="dev exp">Abweichung '+num(Math.abs(fe-y),1)+'</span></div>'+
       '<p class="small" style="margin-top:6px">Die gestrichelten Strecken im Diagramm zeigen die Abweichungen. (Rechnung mit ungerundeten Parametern.)</p>';
  }
  var nv=visCount(),ni=visInner(),okV=visOk();
  h+='<p class="small">'+(okV?"✓ ":"")+'Untersucht: '+nv+(nv===1?" Messpunkt":" Messpunkte")+', davon '+ni+' zwischen Anfang und Ende.'+
     (okV?"":'<br>Untersuche mindestens fünf Messpunkte, darunter mindestens drei Werte zwischen Anfang und Ende.')+'</p></div>';
  if(okV){
    h+='<div class="card" data-step="q5wrap">'+mcHTML("q5")+'</div>';
  }
  if(solved("q5")){
    var g=S.mc.q1&&S.mc.q1.sel!=null?Q.q1.opts[S.mc.q1.sel].t:null;
    h+='<div class="card" data-step="after-q5"><div class="merk"><div class="ttl">Ergebnis</div><p>Für den betrachteten Zeitraum beschreibt das lineare Modell die Daten insgesamt besser.</p></div>'+
       '<p class="small" style="margin-top:8px">Das heißt nicht, dass die Entwicklung „linear ist“. Es heißt nur: Das lineare Modell beschreibt <b>diesen Datenbereich</b> besser.'+
       (g?' Deine Vermutung zu Beginn war: „'+g+'“.':"")+'</p>'+nextBtn(5,"Weiter: Computer-Modell")+'</div>';
  }
  h+='</div></div>';
  return h;
}
function D5(){
  var p=S.p5;
  chart(document.getElementById("ch"),ext(BASE,{curves:[{f:g2,col:LIN},{f:f2,col:EXP}],pick:true,sel:p.sel,
    devs:[{f:g2,col:LIN,dx:-4},{f:f2,col:EXP,dx:4}],
    legend:[LG_PT,{col:LIN,label:"lineares Modell g"},{col:EXP,label:"exponentielles Modell f"}],aria:"Messpunkte antippen, um Abweichungen zu sehen",reserve:250}));
}
