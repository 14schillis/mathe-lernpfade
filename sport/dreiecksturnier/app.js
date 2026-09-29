
(function(){
"use strict";
const KEY='dreiecksturnier-v1';
const TIMEOUT=12000;
const $=s=>document.querySelector(s);
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

let S=load();
let view=S.order.length?'grid':'setup';
let sel=null, selTimer=null, panelOpen=false, confirm=null, moved=[];

function load(){
  try{const o=JSON.parse(localStorage.getItem(KEY)||'null'); if(o&&Array.isArray(o.order)) return Object.assign({draft:'',history:[],last:''},o);}catch(e){}
  return {order:[],draft:'',history:[],last:''};
}
function save(){try{localStorage.setItem(KEY,JSON.stringify(S));}catch(e){}}

/* Geometrie: Reihe r hat r+1 Plätze, Index i = r(r+1)/2 + c */
const rowStart=r=>r*(r+1)/2;
function rowsFor(n){let r=0; while(rowStart(r+1)<n) r++; return n?r+1:0;}
function pos(i){let r=0; while(rowStart(r+1)<=i) r++; return [r,i-rowStart(r)];}
function neighbors(i){
  const n=S.order.length, [r,c]=pos(i), out=[];
  [[r,c-1],[r,c+1],[r-1,c-1],[r-1,c],[r+1,c],[r+1,c+1]].forEach(([rr,cc])=>{
    if(rr<0||cc<0||cc>rr) return;
    const k=rowStart(rr)+cc; if(k<n) out.push(k);
  });
  return out;
}
function shuffle(a){a=a.slice(); for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]];} return a;}
function parseNames(t){return t.split(/\r?\n|;/).map(s=>s.trim()).filter(Boolean);}

/* Größe der Kästchen an den Bildschirm anpassen */
function sizeGrid(){
  const tri=$('#tri'); if(!tri) return;
  const R=Math.max(rowsFor(S.order.length),1);
  const app=$('#app'), cs=getComputedStyle(app);
  const W=app.clientWidth-parseFloat(cs.paddingLeft)-parseFloat(cs.paddingRight);
  const gap=R>7?5:7;
  const cw=Math.max(56,Math.min(170,Math.floor((W-(R-1)*gap)/R)));
  const fs=Math.max(11,Math.min(21,cw/7.2));
  tri.style.setProperty('--gap',gap+'px');
  tri.style.setProperty('--cw',cw+'px');
  tri.style.setProperty('--ch',Math.max(44,Math.round(cw*0.5))+'px');
  tri.style.setProperty('--fs',fs.toFixed(1)+'px');
}

function renderTools(){
  const t=$('#tools');
  if(view==='setup'){t.innerHTML=''; return;}
  t.innerHTML=`<button type="button" class="btn ghost" data-act="undo"${S.history.length?'':' disabled'}>Rückgängig</button><button type="button" class="btn${panelOpen?' primary':''}" data-act="panel" aria-expanded="${panelOpen}">Namen</button>`;
}
function render(){
  renderTools();
  if(view==='setup') renderSetup(); else renderGrid();
}
function statusHTML(){
  if(sel!==null){
    const nb=neighbors(sel).length;
    return `<p class="status hot" id="status"><span><strong>${esc(S.order[sel])}</strong> ist ausgewählt. Grün markiert sind die ${nb} direkten Nachbarn. Wer gewonnen hat, tippt jetzt den geschlagenen Gegner an.</span></p>`;
  }
  if(S.last) return `<p class="status" id="status"><span>${S.last} Nächster Tausch: erst Sieger, dann Verlierer antippen.</span></p>`;
  return `<p class="status" id="status"><span>Tausch: erst den Sieger antippen, dann den geschlagenen Nachbarn. Nur schauen: eigenen Namen antippen.</span></p>`;
}
function renderGrid(){
  const n=S.order.length, R=rowsFor(n);
  let h='';
  if(panelOpen) h+=panelHTML();
  h+=statusHTML();
  const nb=sel!==null?new Set(neighbors(sel)):new Set();
  h+=`<div class="tri${sel!==null?' picking':''}" id="tri" style="--timeout:${TIMEOUT}ms">`;
  for(let r=0;r<R;r++){
    h+='<div class="row">';
    for(let c=0;c<=r;c++){
      const i=rowStart(r)+c;
      if(i>=n){h+='<div class="cell empty" aria-hidden="true"></div>'; continue;}
      const cls=['cell']; if(i===0) cls.push('top'); if(i===sel) cls.push('sel'); if(nb.has(i)) cls.push('nb'); if(moved.includes(i)) cls.push('moved');
      h+=`<button type="button" class="${cls.join(' ')}" data-i="${i}"${i===sel?' aria-pressed="true"':''}${nb.has(i)?' aria-label="'+esc(S.order[i])+', kann gefordert werden"':''}>${esc(S.order[i])}</button>`;
    }
    h+='</div>';
  }
  h+='</div>';
  $('#app').innerHTML=h;
  moved=[];
  sizeGrid();
}
function panelHTML(){
  const list=S.order.map((nm,i)=>`<li><span class="p">${i+1}.</span><span class="n">${esc(nm)}</span><button type="button" class="x" data-remove="${i}" aria-label="${esc(nm)} entfernen">×</button></li>`).join('');
  let conf='';
  if(confirm==='shuffle') conf=`<p class="warn">Alle Plätze werden neu ausgelost.</p><div class="btns"><button type="button" class="btn danger" data-act="shuffle-yes">Neu auslosen</button><button type="button" class="btn ghost" data-act="cancel">Abbrechen</button></div>`;
  else if(confirm==='new') conf=`<p class="warn">Das aktuelle Dreieck wird gelöscht.</p><div class="btns"><button type="button" class="btn danger" data-act="new-yes">Löschen und neue Namen eingeben</button><button type="button" class="btn ghost" data-act="cancel">Abbrechen</button></div>`;
  else conf=`<div class="btns"><button type="button" class="btn ghost" data-act="shuffle">Alle neu auslosen</button><button type="button" class="btn ghost" data-act="new">Neue Gruppe anlegen</button><button type="button" class="btn primary" data-act="panel">Fertig</button></div>`;
  return `<section class="panel"><h2>Namen</h2>
    <div class="addrow"><input type="text" id="late" placeholder="Nachzügler, z. B. Jonas" aria-label="Name des Nachzüglers" autocomplete="off"><button type="button" class="btn primary" data-act="add">Unten anhängen</button></div>
    <p class="help">Die Reihenfolge entspricht den Plätzen von oben nach unten. Wer geht, wird mit × entfernt, alle dahinter rücken einen Platz auf.</p>
    <ul class="plist">${list}</ul>${conf}</section>`;
}
function renderSetup(){
  const n=parseNames(S.draft).length;
  $('#app').innerHTML=`<section class="card"><h2>Wer spielt mit?</h2>
    <p class="help">Einen Namen pro Zeile eingeben oder eine Liste einfügen. Die Plätze im Dreieck werden zufällig ausgelost.</p>
    <textarea id="names" aria-label="Namen, einer pro Zeile" placeholder="Anna&#10;Ben&#10;Clara">${esc(S.draft)}</textarea>
    <p class="count" id="count">${n} ${n===1?'Name':'Namen'}${n?`, ${rowsFor(n)} Reihen`:''}</p>
    <div class="btns"><button type="button" class="btn primary" data-act="start"${n<2?' disabled':''}>Zufällig aufstellen</button></div>
  </section>`;
}

/* Aktionen */
function clearSel(){sel=null; if(selTimer){clearTimeout(selTimer); selTimer=null;}}
function select(i){
  clearSel(); sel=i;
  selTimer=setTimeout(()=>{sel=null; selTimer=null; if(view==='grid') renderGrid();},TIMEOUT);
}
function pushHistory(){S.history.push({order:S.order.slice(),last:S.last}); if(S.history.length>50) S.history.shift();}
function tapCell(i){
  if(sel===null){select(i); renderGrid(); return;}
  if(sel===i){clearSel(); renderGrid(); return;}
  if(neighbors(sel).includes(i)){
    const w=sel, l=i, wn=S.order[w], ln=S.order[l];
    pushHistory();
    S.order[w]=ln; S.order[l]=wn;
    S.last=l===0?`<strong>${esc(wn)}</strong> steht jetzt an der Spitze.`:`<strong>${esc(wn)}</strong> hat gegen <strong>${esc(ln)}</strong> gewonnen und Platz getauscht.`;
    save(); clearSel(); moved=[w,l]; renderTools(); renderGrid(); return;
  }
  select(i); renderGrid();
}
function act(a){
  if(a==='start'){
    const names=parseNames(S.draft); if(names.length<2) return;
    S.order=shuffle(names); S.history=[]; S.last=''; save();
    view='grid'; panelOpen=false; render(); return;
  }
  if(a==='undo'){
    const h=S.history.pop(); if(!h) return;
    S.order=h.order; S.last='Letzter Schritt rückgängig gemacht.'; clearSel(); save(); render(); return;
  }
  if(a==='panel'){panelOpen=!panelOpen; confirm=null; clearSel(); render(); if(panelOpen){const el=$('#late'); if(el) el.focus();} return;}
  if(a==='add'){
    const el=$('#late'), nm=el?el.value.trim():''; if(!nm){if(el) el.focus(); return;}
    pushHistory(); S.order.push(nm); S.last=`<strong>${esc(nm)}</strong> ist unten dazugekommen.`; save(); render();
    const e2=$('#late'); if(e2) e2.focus(); return;
  }
  if(a==='shuffle'||a==='new'){confirm=a; renderGrid(); return;}
  if(a==='cancel'){confirm=null; renderGrid(); return;}
  if(a==='shuffle-yes'){pushHistory(); S.order=shuffle(S.order); S.last='Alle Plätze wurden neu ausgelost.'; confirm=null; panelOpen=false; save(); render(); return;}
  if(a==='new-yes'){S.draft=S.order.join('\n'); S.order=[]; S.history=[]; S.last=''; confirm=null; panelOpen=false; clearSel(); save(); view='setup'; render(); return;}
}
function init(){
  document.addEventListener('click',e=>{
    const b=e.target.closest('button');
    if(b&&b.disabled) return;
    if(b&&b.dataset.i!==undefined){tapCell(+b.dataset.i); return;}
    if(b&&b.dataset.remove!==undefined){
      const i=+b.dataset.remove, nm=S.order[i];
      pushHistory(); S.order.splice(i,1); S.last=`<strong>${esc(nm)}</strong> wurde entfernt.`; save();
      if(!S.order.length){view='setup'; panelOpen=false;}
      render(); return;
    }
    if(b&&b.dataset.act){act(b.dataset.act); return;}
    if(!b&&sel!==null&&view==='grid'&&!e.target.closest('.panel')){clearSel(); renderGrid();}
  });
  document.addEventListener('input',e=>{
    if(e.target.id==='names'){
      S.draft=e.target.value; save();
      const n=parseNames(S.draft).length;
      $('#count').textContent=`${n} ${n===1?'Name':'Namen'}${n?`, ${rowsFor(n)} Reihen`:''}`;
      document.querySelector('[data-act="start"]').disabled=n<2;
    }
  });
  document.addEventListener('keydown',e=>{
    if(e.key==='Enter'&&e.target.id==='late'){e.preventDefault(); act('add');}
    if(e.key==='Escape'&&sel!==null){clearSel(); renderGrid();}
  });
  let rt; window.addEventListener('resize',()=>{clearTimeout(rt); rt=setTimeout(sizeGrid,80);});
  render();
}
init();
})();
