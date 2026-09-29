/* ---------- Einrichten ---------- */
function structKey(d){return JSON.stringify([+d.teamCount,d.mode,modeOf(d.mode).groups>1?d.groupOf:[],!!d.hinRueck]);}
function hasResults(){return !!S&&Object.values(S.results).some(r=>r&&(num(r.h)!==null||num(r.a)!==null));}
function validate(d){
  const m=modeOf(d.mode), e=[];
  if(d.teamCount<m.min) e.push(`Dieser Modus braucht mindestens ${m.min} Teams.`);
  else if(m.groups>1) for(let g=0;g<m.groups;g++) if(d.groupOf.filter(x=>x===g).length<2) e.push(`Gruppe ${LETTERS[g]} braucht mindestens 2 Teams.`);
  if(toMin(d.start)===null) e.push('Trage eine Startzeit ein.');
  const raw=String(d.dur===undefined||d.dur===null?'':d.dur).trim();
  if(raw!==''&&!(+raw>0)) e.push('Die Spieldauer muss mindestens 1 Minute betragen.');
  else if(raw===''){
    if(toMin(d.end)===null) e.push('Trage eine Spieldauer oder ein Stundenende ein.');
    else if(!e.length){
      const games=buildGames(d);
      if(durOf(d,games).dur===null) e.push(`Bis zum Stundenende reicht die Zeit nicht für ${games.length} Spiele. Wähle einen anderen Modus, verringere die Wechselzeit oder trage eine Spieldauer ein.`);
    }
  }
  return e;
}
function renderSetup(){
  if(!draft){
    draft=S?clone(S.settings):defaultsDraft();
  }
  const d=draft, m=modeOf(d.mode);
  let h='<div class="setup">';
  h+=`<section class="card"><h2>Turnier</h2>
    <label class="fld"><span>Name (optional)</span><input type="text" data-f="name" value="${esc(d.name)}" placeholder="z. B. Fußballturnier 7b"></label>
    <div class="fld"><span id="lbl-count">Anzahl Teams</span><div class="count" role="group" aria-labelledby="lbl-count"><button type="button" class="sb" data-cnt="-1" aria-label="Ein Team weniger">−</button><output>${d.teamCount}</output><button type="button" class="sb" data-cnt="1" aria-label="Ein Team mehr">+</button></div></div>
  </section>`;
  h+=`<section class="card"><h2>Modus</h2><div class="modes">${MODES.map(x=>{
      const dis=d.teamCount<x.min;
      return `<label class="mode${d.mode===x.id?' on':''}${dis?' dis':''}"><input type="radio" name="mode" value="${x.id}"${d.mode===x.id?' checked':''}${dis?' disabled':''}><span class="mn">${x.name}</span><span class="md">${dis?`Ab ${x.min} Teams möglich.`:x.desc}</span></label>`;
    }).join('')}</div>
    <label class="chk"><input type="checkbox" data-f="hinRueck"${d.hinRueck?' checked':''}><span>Hin- und Rückrunde${m.ko||m.groups>1?' in der Vorrunde':''}</span></label>
  </section>`;
  h+=`<section class="card"><h2>Teams</h2>${m.groups>1?'<p class="help">Die Gruppen sind der Reihe nach vorbelegt. Mit A, B oder C lässt sich ein Team umsetzen.</p>':''}<div class="teams">${d.teams.map((t,i)=>`<div class="trow"><span class="tno">${i+1}</span><input type="text" data-team="${i}" value="${esc(t)}" placeholder="Team ${i+1}" aria-label="Name von Team ${i+1}">${m.groups>1?`<div class="gsel" role="group" aria-label="Gruppe für Team ${i+1}">${[...Array(m.groups)].map((_,g)=>`<button type="button" class="gb${d.groupOf[i]===g?' on':''}" style="--gc:var(--g${g})" data-grp="${g}" data-ti="${i}" aria-pressed="${d.groupOf[i]===g}">${LETTERS[g]}</button>`).join('')}</div>`:''}</div>`).join('')}</div><p class="gcount" id="gcount"></p></section>`;
  h+=`<section class="card"><h2>Zeitplan</h2><div class="grid4">
    <label class="fld"><span>Beginn</span><input type="time" data-f="start" value="${esc(d.start)}"></label>
    <label class="fld"><span>Spieldauer in Minuten</span><input type="number" min="1" max="60" inputmode="numeric" data-f="dur" value="${esc(d.dur)}" placeholder="automatisch"></label>
    <label class="fld"><span>Wechselzeit in Minuten</span><input type="number" min="0" max="30" inputmode="numeric" data-f="change" value="${esc(d.change)}"></label>
    ${m.ko?`<label class="fld"><span>Pause vor der Endrunde</span><input type="number" min="0" max="60" inputmode="numeric" data-f="pause" value="${esc(d.pause)}"></label>`:''}
    <label class="fld"><span>Stundenende (optional)</span><input type="time" data-f="end" value="${esc(d.end)}"></label>
  </div><p class="help">Bleibt die Spieldauer leer, wird sie aus Beginn und Stundenende berechnet.</p></section>`;
  h+=`<section class="card"><h2>Wertung und Schiris</h2>
    <div class="fld"><span>Punkte für einen Sieg</span><div class="seg">${[3,2].map(p=>`<button type="button" class="segb${+d.winPts===p?' on':''}" data-pts="${p}" aria-pressed="${+d.winPts===p}">${p} Punkte</button>`).join('')}</div></div>
    <p class="help">Ein Unentschieden gibt 1 Punkt. Bei Gleichstand zählen nacheinander: Punkte, Tordifferenz, mehr erzielte Tore, direkter Vergleich, Los.${m.id==='g3_ko'?' Der beste Zweite wird nach Punkten pro Spiel ermittelt, damit ungleich große Gruppen fair verglichen werden.':''}</p>
    <label class="chk"><input type="checkbox" data-f="refs"${d.refs?' checked':''}><span>Spielfreie Teams als Schiri einteilen</span></label>
  </section>`;
  h+='<section class="card sum" id="summary"></section></div>';
  $('#app').innerHTML=h;
  refreshSummary();
}
