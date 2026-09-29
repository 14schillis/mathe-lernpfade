function refreshSummary(){
  const d=draft, m=modeOf(d.mode), el=$('#summary'); if(!el) return;
  const gc=$('#gcount');
  if(gc) gc.textContent=m.groups>1?[...Array(m.groups)].map((_,g)=>`Gruppe ${LETTERS[g]}: ${d.groupOf.filter(x=>x===g).length} Teams`).join(', '):'';
  const errs=validate(d);
  let h='';
  if(errs.length) h+=`<p class="err">${errs.join(' ')}</p>`;
  else{
    const games=buildGames(d), ko=games.filter(g=>g.phase==='ko').length, end=endTime(d,games), lim=toMin(d.end);
    const du=durOf(d,games);
    h+=`<p class="sum-main"><strong>${games.length} Spiele</strong>${ko?`, davon ${ko} in der Endrunde`:''}. ${du.auto?`Spieldauer automatisch berechnet: <strong>${du.dur} min</strong> pro Spiel. `:''}Voraussichtliches Ende: <strong>${fmt(end)} Uhr</strong>.</p>`;
    if(du.auto&&du.dur<4) h+=`<p class="warn">Das sind nur ${du.dur} ${du.dur===1?'Minute':'Minuten'} pro Spiel. Eventuell passt ein Modus mit weniger Spielen besser.</p>`;
    if(lim!==null){
      const diff=end-lim;
      h+=diff>0?`<p class="warn">Das sind ${diff} ${diff===1?'Minute':'Minuten'} zu viel. Spieldauer oder Wechselzeit kürzen oder einen anderen Modus wählen.</p>`:`<p class="ok">Passt, ${-diff} ${diff===-1?'Minute':'Minuten'} Puffer bis zum Stundenende.</p>`;
    }
  }
  const structural=!!S&&structKey(d)!==structKey(S.settings);
  if(!S){
    h+=`<div class="btns"><button type="button" class="btn primary" data-act="create"${errs.length?' disabled':''}>Turnier erstellen</button></div>`;
  }else if(pendingConfirm==='rebuild'){
    h+=`<p class="warn">Mit diesen Änderungen wird der Spielplan neu erstellt. Alle eingetragenen Ergebnisse werden gelöscht.</p><div class="btns"><button type="button" class="btn danger" data-act="rebuild-yes">Neu erstellen und Ergebnisse löschen</button><button type="button" class="btn ghost" data-act="cancel">Abbrechen</button></div>`;
  }else if(pendingConfirm==='new'){
    h+=`<p class="warn">Das aktuelle Turnier mit allen Ergebnissen wird gelöscht.</p><div class="btns"><button type="button" class="btn danger" data-act="new-yes">Turnier löschen und neu anlegen</button><button type="button" class="btn ghost" data-act="cancel">Abbrechen</button></div>`;
  }else{
    if(structural) h+='<p class="help">Teams, Gruppen oder Modus wurden geändert. Der Spielplan wird dann neu erstellt.</p>';
    h+=`<div class="btns"><button type="button" class="btn primary" data-act="apply"${errs.length?' disabled':''}>Änderungen übernehmen</button><button type="button" class="btn ghost" data-act="new">Neues Turnier anlegen</button></div>`;
  }
  el.innerHTML=h;
}
function goPlan(){draft=null; pendingConfirm=null; view='plan'; render(); window.scrollTo(0,0);}
function act(a){
  if(a==='create'){
    S={v:1,settings:clone(draft),games:buildGames(draft),results:{},lots:makeLots(draft.teamCount)};
    save(); goPlan();
  }else if(a==='apply'){
    const structural=structKey(draft)!==structKey(S.settings);
    if(structural&&hasResults()){pendingConfirm='rebuild'; refreshSummary(); return;}
    if(structural){S.games=buildGames(draft); S.results={}; S.lots=makeLots(draft.teamCount);}
    S.settings=clone(draft); save(); goPlan();
  }else if(a==='rebuild-yes'){
    S.settings=clone(draft); S.games=buildGames(draft); S.results={}; S.lots=makeLots(draft.teamCount);
    save(); goPlan();
  }else if(a==='new'){pendingConfirm='new'; refreshSummary();}
  else if(a==='new-yes'){
    S=null; try{localStorage.removeItem(KEY);}catch(e){}
    draft=defaultsDraft(); pendingConfirm=null; view='setup'; render(); window.scrollTo(0,0);
  }else if(a==='cancel'){pendingConfirm=null; refreshSummary();}
}

