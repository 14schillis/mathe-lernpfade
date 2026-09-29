/* ---------- Darstellung ---------- */
function render(){
  const nav=$('#tabs');
  if(!S){nav.innerHTML=''; nav.hidden=true;}
  else{
    nav.hidden=false;
    nav.innerHTML=[['plan','Spielplan'],['tables','Tabellen'],['overview','Übersicht'],['setup','Einrichten']]
      .map(([id,l])=>`<button class="tab${view===id?' on':''}" data-view="${id}"${view===id?' aria-current="page"':''}>${l}</button>`).join('');
  }
  $('#title').textContent=S?(S.settings.name.trim()||'Turnier'):'Neues Turnier';
  if(view==='setup') renderSetup();
  else if(view==='plan') renderPlan();
  else if(view==='tables') renderTables();
  else renderOverview();
}

function stepper(id,k){
  const v=(S.results[id]||{})[k];
  return `<div class="stp"><button type="button" class="sb" data-step="-1" data-id="${id}" data-k="${k}" aria-label="Ein Tor weniger">−</button><input id="in-${id}-${k}" class="si" type="text" inputmode="numeric" pattern="[0-9]*" maxlength="2" autocomplete="off" data-id="${id}" data-k="${k}" value="${v===null||v===undefined?'':v}"><button type="button" class="sb" data-step="1" data-id="${id}" data-k="${k}" aria-label="Ein Tor mehr">+</button></div>`;
}
function renderPlan(){
  const st=S.settings, m=modeOf(st.mode), T=times(st,S.games), end=endTime(st,S.games);
  const firstKO=S.games.findIndex(g=>g.phase==='ko');
  let h=`<div class="bar"><p class="info">${S.games.length} Spiele je ${durOf(st,S.games).dur} min${durOf(st,S.games).auto?' (automatisch berechnet)':''}, Ende ca. ${fmt(end)} Uhr</p><button type="button" class="btn ghost" id="jump">Zum aktuellen Spiel</button></div>`;
  S.games.forEach((g,i)=>{
    if(i===0&&firstKO>0) h+=`<h2 class="phase">Vorrunde</h2>`;
    if(i===firstKO&&firstKO>0) h+=`<h2 class="phase">Endrunde${+st.pause?`<span>nach ${+st.pause} min Pause</span>`:''}</h2>`;
    const tag=g.phase==='ko'?g.label:(m.groups>1?'Gruppe '+LETTERS[g.g]:'');
    h+=`<article class="game" data-i="${i}" style="--gc:${gcol(g)}">
      <div class="meta"><span class="time">${fmt(T[i])}</span><span>Spiel ${i+1}</span>${tag?`<span class="tag">${esc(tag)}</span>`:''}<span class="flag"></span></div>
      <div class="match">
        <div class="team home"><span class="nm"></span><span class="hint"></span></div>
        <div class="score">${stepper(g.id,'h')}<span class="colon">:</span>${stepper(g.id,'a')}</div>
        <div class="team away"><span class="nm"></span><span class="hint"></span></div>
      </div>
      ${g.phase==='ko'?`<div class="deci" hidden><span class="deci-l">Unentschieden. Ergebnis der Entscheidung, z. B. Siebenmeterschießen:</span><div class="score small">${stepper(g.id,'ph')}<span class="colon">:</span>${stepper(g.id,'pa')}</div></div>`:''}
      <div class="ref"></div>
    </article>`;
  });
  $('#app').innerHTML=h;
  refreshPlan();
}
