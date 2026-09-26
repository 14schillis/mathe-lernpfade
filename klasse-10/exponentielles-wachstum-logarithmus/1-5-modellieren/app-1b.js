/* ================= Fragen ================= */
var Q={
 q1:{type:"open",q:"Welches mathematische Modell könnte zu diesen Daten passen?",
   sub:"Gib eine erste Vermutung ab – es gibt hier noch kein Richtig oder Falsch.",
   opts:[{t:"eher linear"},{t:"eher exponentiell"},{t:"aus der Darstellung noch nicht sicher"}],
   fb:"Deine Vermutung ist notiert. Wir überprüfen sie im Lauf des Lernpfads."},
 q2:{type:"single",q:"Woran könnte man lineares und exponentielles Wachstum unterscheiden?",
   sub:"Denke an gleiche Zeitabstände.",
   opts:[
    {t:"Linear: konstante Differenzen (gleiche Zuwächse) – exponentiell: konstante Faktoren",ok:true},
    {t:"Linear: konstante Faktoren – exponentiell: konstante Differenzen (gleiche Zuwächse)",hint:"Vertauscht: Bei linearem Wachstum kommt in gleichen Zeitabständen immer gleich viel dazu."},
    {t:"Linear: Der Graph steigt – exponentiell: Der Graph fällt",hint:"Beide Wachstumsarten können steigen. Entscheidend ist, wie sich die Werte von Schritt zu Schritt verändern."}],
   ok:"Genau. Diesen „Fingerabdruck“ der Daten untersuchen wir jetzt."},
 q3:{type:"single",q:"Was zeigt der Fingerabdruck der Daten?",
   opts:[
    {t:"Weder die Zuwächse noch die Faktoren sind konstant.",ok:true},
    {t:"Die Zuwächse sind konstant – die Daten sind also exakt linear.",hint:"Vergleiche z. B. +282 und +477."},
    {t:"Die Faktoren sind konstant – die Daten sind also exakt exponentiell.",hint:"Vergleiche z. B. 1,28 und 1,14."}],
   ok:"Richtig. Keines der beiden Muster liegt exakt vor."},
 q4l:{type:"single",q:"Wie berechnest du die Steigung m der Geraden durch P₁ und P₂?",
   opts:[
    {t:'<span class="mm"><i>m</i> = '+fr("3969 − 1100","14 − 0")+'</span>',ok:true},
    {t:'<span class="mm"><i>m</i> = '+fr("14 − 0","3969 − 1100")+'</span>',hint:"Steigung = Zuwachs der y-Werte geteilt durch Zuwachs der t-Werte – nicht umgekehrt."},
    {t:'<span class="mm"><i>m</i> = '+fr("3969","14")+'</span>',hint:"Der Anfangswert 1100 gehört nicht zum Zuwachs. Bilde die Differenz der y-Werte."}],
   ok:"Richtig: Steigung = Differenz der y-Werte durch Differenz der t-Werte."},
 q4e1:{type:"single",q:"Wie kommst du dem Wert von a näher?",
   opts:[
    {t:"Beide Seiten durch 1100 teilen",ok:true},
    {t:"Auf beiden Seiten 1100 subtrahieren",hint:"1100 ist ein Faktor, kein Summand – also teilen."},
    {t:"Beide Seiten durch 14 teilen",hint:"14 ist der Exponent von a, kein Faktor."}],
   ok:"Richtig – so steht die Potenz a¹⁴ allein."},
 q4e2:{type:"single",q:"Wie erhältst du daraus a?",
   opts:[
    {t:'<span class="mm"><i>a</i> = '+rt("14",fr("3969","1100"))+'</span>',ok:true},
    {t:'<span class="mm"><i>a</i> = '+fr("3969","1100")+' : 14</span>',hint:"Die 14 ist ein Exponent. „Hoch 14“ macht man mit der 14. Wurzel rückgängig, nicht durch Teilen."},
    {t:'<span class="mm"><i>a</i> = <span class="pw"><span class="pa">(</span>'+fr("3969","1100")+'<span class="pa">)</span><span class="px">14</span></span></span>',hint:"„Hoch 14“ soll rückgängig gemacht werden – nicht noch einmal angewendet."}],
   ok:"Richtig – die 14. Wurzel macht „hoch 14“ rückgängig."},
 q4o:{type:"open",q:"Sind die beiden Modelle deshalb gleich gut?",
   opts:[{t:"Ja, beide sind gleich gut."},{t:"Nein, nicht unbedingt."},{t:"Das kann man so noch nicht sagen."}],
   fb:"Notiert. Ob beide gleich gut sind, zeigt erst der Vergleich mit den übrigen Messwerten."},
 q5:{type:"multi",q:"Welches Modell beschreibt den Zeitraum 2005–2019 insgesamt besser? Wähle alle zutreffenden Aussagen.",
   opts:[
    {t:"Der lineare Graph liegt bei vielen Messpunkten näher an den realen Daten.",ok:true},
    {t:"Das exponentielle Modell trifft Anfang und Ende, weicht dazwischen aber teilweise deutlich ab.",ok:true},
    {t:"Beide Modelle sind nur Näherungen.",ok:true},
    {t:"Ein Modell muss nicht jeden Messpunkt exakt treffen.",ok:true},
    {t:"Das exponentielle Modell ist besser, weil es Anfangs- und Endpunkt exakt trifft.",hint:"Anfangs- und Endpunkt treffen beide Modelle – daran lässt sich also kein Unterschied festmachen."},
    {t:"Die Internetnutzerzahlen wachsen exakt linear.",hint:"Die Zuwächse waren nicht konstant. Ein Modell beschreibt Daten nur näherungsweise."}],
   ok:"Richtig – diese vier Aussagen treffen zu."},
 q6:{type:"multi",q:"Was folgt aus dem Vergleich? Wähle alle zutreffenden Aussagen.",
   opts:[
    {t:"Von allen betrachteten Modellen hat das lineare Computer-Modell die kleinste mittlere Abweichung.",ok:true},
    {t:"Auch das beste exponentielle Modell weicht im Mittel deutlich stärker ab als das lineare Computer-Modell.",ok:true},
    {t:"Der Computer kann Parameter optimieren, aber nicht entscheiden, ob ein Funktionstyp zur Sachsituation passt.",ok:true},
    {t:"Weil der Computer gerechnet hat, sind beide Computer-Modelle automatisch sachlich sinnvoll.",hint:"Der Computer passt nur die Parameter eines vorgegebenen Funktionstyps an. Ob der Typ sinnvoll ist, beurteilt er nicht."},
    {t:"Die Computer-Modelle treffen jetzt alle Messpunkte exakt.",hint:"Auch die Computer-Modelle haben eine mittlere Abweichung größer als 0."}],
   ok:"Richtig – diese drei Aussagen treffen zu."},
 q7:{type:"multi",q:"Die Rechnung ist mathematisch korrekt. Warum kann die Prognose trotzdem problematisch sein? Wähle alle zutreffenden Aussagen.",
   opts:[
    {t:"Die Weltbevölkerung ist begrenzt.",ok:true},
    {t:"Nicht jeder Mensch kann zwingend als zusätzlicher neuer Internetnutzer hinzukommen.",ok:true},
    {t:"Technische, wirtschaftliche und gesellschaftliche Bedingungen können sich verändern.",ok:true},
    {t:"Ein Modell, das vorhandene Daten gut beschreibt, muss außerhalb des betrachteten Zeitraums nicht gültig bleiben.",ok:true},
    {t:"Eine mathematisch korrekte Rechnung garantiert keine realistische Prognose.",ok:true},
    {t:"In der Rechnung für 2030 steckt ein Rechenfehler.",hint:"Die Rechnung f(25) = 1100 · a²⁵ ist korrekt – das Problem liegt nicht in der Mathematik."},
    {t:"Weil das Modell Anfangs- und Endwert exakt trifft, ist die Prognose zuverlässig.",hint:"Ein Modell kann Daten im betrachteten Zeitraum treffen und außerhalb trotzdem versagen."}],
   ok:"Richtig – diese fünf Aussagen treffen zu."},
 q8:{type:"single",q:"Warum ist Modellieren kein einmaliger Rechenweg?",
   opts:[
    {t:"Weil ein Modell überprüft und bei Bedarf verändert werden muss.",ok:true},
    {t:"Weil man so lange rechnen muss, bis das Modell alle Messwerte exakt trifft.",hint:"Ein Modell muss Messwerte nicht exakt treffen – es soll sie gut genug beschreiben."},
    {t:"Weil jeder Rechenschritt mehrmals kontrolliert werden muss.",hint:"Es geht nicht um Rechenkontrolle, sondern darum, ob das Modell zur Wirklichkeit passt."}],
   ok:"Genau. Modellieren ist ein Kreislauf: überprüfen, bewerten und bei Bedarf verbessern."}
};

var CARDS=["Reale Situation und Daten betrachten","Geeigneten Funktionstyp wählen","Parameter bestimmen",
  "Modell mit realen Daten vergleichen","Ergebnisse im Sachzusammenhang bewerten","Modell bei Bedarf verändern"];
var CARD_HINT=["Am Anfang steht die reale Situation mit ihren Daten.",
  "Bevor man Parameter bestimmen kann, braucht man einen Funktionstyp.",
  "Erst wenn der Funktionstyp feststeht, kann man seine Parameter bestimmen.",
  "Mit dem fertigen Modell vergleicht man die Modellwerte mit den realen Daten.",
  "Danach beurteilt man die Ergebnisse im Sachzusammenhang.",
  "Zum Schluss wird das Modell – falls nötig – verbessert."];

var PARTS=["Daten","Strukturen","Modelle anpassen","Parameter bestimmen","Modelle prüfen","Computer-Modell","Prognosen","Modellierungskreislauf"];
var YEARS=[2019,2025,2030,2040,2050];

/* ================= Zustand ================= */
function shuffledCards(){var o;do{o=shuf(range(CARDS.length));}while(o.every(function(v,i){return v===i;}));return o;}
var S;
function fresh(){
  var ord={};
  Object.keys(Q).forEach(function(k){ord[k]=Q[k].type==="open"?range(Q[k].opts.length):shuf(range(Q[k].opts.length));});
  var o=shuffledCards();
  return {part:0,max:TEACH?7:0,ord:ord,mc:{},
    p2:{mode:null,seenD:false,seenF:false},
    p3:{tab:"lin",m:150,a:1.05,sm:null,sa:null},
    p4:{lIn:"",lTry:0,lOk:false,lShow:false,eSub:false,eIn:"",eTry:0,eOk:false,eShow:false,lFb:"",eFb:""},
    p5:{sel:null,vis:{}},
    p6:{shown:false,ta:null,tb:null},
    p7:{year:2019,seen:{2019:true}},
    p8:{order:o,solved:false,fb:"",fbc:"",finished:false,moved:-1},
    flash:null,anim:{}};
}
function st(id){if(!S.mc[id])S.mc[id]={sel:Q[id].type==="multi"?[]:null,dis:[],bad:[],solved:false,fb:"",fbc:""};return S.mc[id];}
function solved(id){return !!(S.mc[id]&&S.mc[id].solved);}
function answered(id){return !!(S.mc[id]&&S.mc[id].sel!==null);}

/* ================= Multiple-Choice ================= */
function mcHTML(id){
  var d=Q[id],s=st(id),h='<div class="mc" data-mc="'+id+'" data-step="'+id+'"><p class="q">'+d.q+'</p>'+(d.sub?'<p class="sub">'+d.sub+'</p>':'')+'<div class="opts">';
  S.ord[id].forEach(function(i){
    var o=d.opts[i],cls="opt",dis=false;
    if(d.type==="single"&&s.solved&&s.sel!==i)return;
    if(d.type==="single"){
      if(s.solved){ if(s.sel===i)cls+=" ok"; else {cls+=" faded";} dis=true; }
      else if(s.dis.indexOf(i)>=0){cls+=" no";dis=true;}
    }else if(d.type==="open"){
      if(s.sel===i)cls+=" chosen";
    }else{
      var on=s.sel.indexOf(i)>=0;
      if(s.solved){ cls+=o.ok?" ok":" faded"; dis=true; }
      else { if(on)cls+=" chosen"; if(s.bad.indexOf(i)>=0)cls+=" no"; }
    }
    h+='<button class="'+cls+'" data-i="'+i+'"'+(dis?" disabled":"")+(d.type!=="single"?' aria-pressed="'+(d.type==="multi"?(s.solved?!!o.ok:s.sel.indexOf(i)>=0):s.sel===i)+'"':"")+'>'+ 
      (d.type==="multi"?'<span class="bx" aria-hidden="true"></span>':"")+'<span>'+o.t+'</span></button>';
  });
  h+='</div>';
  if(d.type==="multi"&&!s.solved) h+='<div class="btnrow"><button class="btn ghost" data-check="'+id+'"'+(s.sel.length?"":" disabled")+'>Auswahl prüfen</button></div>';
  if(s.fb) h+='<div class="fb '+s.fbc+'">'+s.fb+'</div>';
  return h+'</div>';
}
function mcClick(id,i){
  var d=Q[id],s=st(id);
  if(d.type==="single"){
    if(s.solved||s.dis.indexOf(i)>=0)return;
    if(d.opts[i].ok){s.solved=true;s.sel=i;s.fb=d.ok;s.fbc="ok";S.flash="after-"+id;}
    else{s.dis.push(i);s.fb=d.opts[i].hint;s.fbc="hint";}
  }else if(d.type==="open"){
    var first=s.sel===null;s.sel=i;s.solved=true;s.fb=d.fb;s.fbc="neutral";if(first)S.flash="after-"+id;
  }else{
    if(s.solved)return;
    var k=s.sel.indexOf(i);if(k>=0)s.sel.splice(k,1);else s.sel.push(i);
    s.bad=[];s.fb="";
  }
  render();
}
function mcCheck(id){
  var d=Q[id],s=st(id),wrong=[],missing=0;
  d.opts.forEach(function(o,i){var on=s.sel.indexOf(i)>=0;if(on&&!o.ok)wrong.push(i);if(!on&&o.ok)missing++;});
  if(!wrong.length&&!missing){s.solved=true;s.fb=d.ok;s.fbc="ok";S.flash="after-"+id;}
  else{
    s.bad=wrong.slice();s.fbc="hint";
    var h="";wrong.forEach(function(i){h+="<p>"+d.opts[i].hint+"</p>";});
    if(missing)h+="<p>"+(wrong.length?"Außerdem fehlen":"Es fehlen")+" noch zutreffende Aussagen.</p>";
    s.fb=h;
  }
  render();
}
