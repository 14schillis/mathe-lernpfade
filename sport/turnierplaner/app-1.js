"use strict";
const KEY='turnierplaner-v1';
const LETTERS='ABC';
const MODES=[
  {id:'rr',       name:'Jeder gegen jeden', desc:'Alle spielen gegeneinander, die Tabelle entscheidet.', groups:1, ko:false, min:2},
  {id:'rr_final', name:'Jeder gegen jeden mit Finale', desc:'Danach Finale 1. gegen 2. und ab 4 Teams Spiel um Platz 3 (3. gegen 4.).', groups:1, ko:true, min:3},
  {id:'g2',       name:'Zwei Gruppen', desc:'Jede Gruppe spielt jeder gegen jeden, ohne Endrunde.', groups:2, ko:false, min:4},
  {id:'g3',       name:'Drei Gruppen', desc:'Jede Gruppe spielt jeder gegen jeden, ohne Endrunde.', groups:3, ko:false, min:6},
  {id:'g2_ko',    name:'Zwei Gruppen mit Endrunde über Kreuz', desc:'Halbfinale A1 gegen B2 und B1 gegen A2, danach Spiel um Platz 3 und Finale.', groups:2, ko:true, min:4},
  {id:'g3_ko',    name:'Drei Gruppen mit Endrunde', desc:'Die drei Gruppensieger und der beste Zweite spielen Halbfinale, danach Spiel um Platz 3 und Finale.', groups:3, ko:true, min:6}
];
const modeOf=id=>MODES.find(m=>m.id===id)||MODES[0];
const $=s=>document.querySelector(s);
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const clone=o=>JSON.parse(JSON.stringify(o));
const num=v=>(v===''||v===null||v===undefined||isNaN(parseInt(v,10)))?null:parseInt(v,10);
const cmp=(a,b)=>{for(let i=0;i<a.length;i++){if(a[i]<b[i])return -1;if(a[i]>b[i])return 1;}return 0;};
const reduceMotion=()=>window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;

let S=load();
let view=S?'plan':'setup';
let draft=null;
let pendingConfirm=null;

function load(){
  try{
    const raw=localStorage.getItem(KEY); if(!raw) return null;
    const o=JSON.parse(raw);
    if(!o||!o.settings||!Array.isArray(o.games)) return null;
    o.results=o.results||{};
    if(!Array.isArray(o.lots)||o.lots.length!==o.settings.teamCount) o.lots=makeLots(o.settings.teamCount);
    return o;
  }catch(e){return null;}
}
function save(){try{localStorage.setItem(KEY,JSON.stringify(S));}catch(e){}}
function makeLots(n){return Array.from({length:n},()=>Math.random());}

function tname(st,i){const v=(st.teams[i]||'').trim(); return v||('Team '+(i+1));}
const name=i=>tname(S.settings,i);
function defaultGroups(n,g){return Array.from({length:n},(_,i)=>g===1?0:Math.floor(i*g/n));}
function toMin(t){const m=/^(\d{1,2}):(\d{2})/.exec(t||''); return m?(+m[1])*60+(+m[2]):null;}
function fmt(m){m=((Math.round(m)%1440)+1440)%1440; return String(Math.floor(m/60)).padStart(2,'0')+':'+String(m%60).padStart(2,'0');}
function nowRounded(){const d=new Date(); return fmt(Math.ceil((d.getHours()*60+d.getMinutes())/5)*5);}
function defaultsDraft(){
  const n=6;
  return {name:'',teamCount:n,teams:Array(n).fill(''),mode:'g2_ko',groupOf:defaultGroups(n,2),hinRueck:false,winPts:3,start:nowRounded(),dur:'7',change:'1',pause:'0',end:'',refs:true};
}
const gcol=g=>g.phase==='ko'?'var(--ko)':'var(--g'+g.g+')';

/* ---------- Spielplan erzeugen ---------- */
function circlePairs(list){
  const arr=list.slice(); if(arr.length%2) arr.push(null);
  const n=arr.length, out=[];
  for(let r=0;r<n-1;r++){
    for(let i=0;i<n/2;i++){
      const a=arr[i], b=arr[n-1-i];
      if(a!==null&&b!==null) out.push((r+i)%2?[b,a]:[a,b]);
    }
    arr.splice(1,0,arr.pop());
  }
  return out;
}
// Reihenfolge für ein Feld: möglichst keine zwei Spiele direkt hintereinander, Spiele gleichmäßig verteilen
function orderGreedy(list,out,last,cnt){
  const rem=list.map((x,i)=>Object.assign({},x,{i}));
  while(rem.length){
    const pos=out.length; let bi=0, bk=null;
    const left={}; rem.forEach(x=>{left[x.g]=(left[x.g]||0)+1;});
    rem.forEach((x,k)=>{
      const rh=last[x.h]===undefined?99:pos-last[x.h];
      const ra=last[x.a]===undefined?99:pos-last[x.a];
      const minR=Math.min(rh,ra);
      const key=[Math.min(minR,2), left[x.g], -((cnt[x.h]||0)+(cnt[x.a]||0)), minR, -x.i];
      if(!bk||cmp(key,bk)>0){bk=key;bi=k;}
    });
    const x=rem.splice(bi,1)[0];
    last[x.h]=pos; last[x.a]=pos;
    cnt[x.h]=(cnt[x.h]||0)+1; cnt[x.a]=(cnt[x.a]||0)+1;
    out.push(x);
  }
}
function buildGames(st){
  const m=modeOf(st.mode), groups=[...Array(m.groups)].map(()=>[]);
  for(let i=0;i<st.teamCount;i++) groups[m.groups===1?0:st.groupOf[i]].push(i);
  const hin=[];
  groups.forEach((list,g)=>circlePairs(list).forEach(p=>hin.push({g,h:p[0],a:p[1]})));
  const ordered=[], last={}, cnt={};
  orderGreedy(hin,ordered,last,cnt);
  if(st.hinRueck) orderGreedy(hin.map(x=>({g:x.g,h:x.a,a:x.h})),ordered,last,cnt);
  const games=ordered.map((x,i)=>({id:'G'+(i+1),phase:'group',g:x.g,h:x.h,a:x.a}));
  const R=(g,r)=>({t:'rank',g,r}), W=id=>({t:'w',id}), L=id=>({t:'l',id}), Q=s=>({t:'q',slot:s});
  let ko=[];
  if(m.id==='rr_final'){
    if(st.teamCount>=4) ko.push({id:'P3',label:'Spiel um Platz 3',hs:R(0,3),as:R(0,4)});
    ko.push({id:'F',label:'Finale',hs:R(0,1),as:R(0,2)});
  }
  if(m.id==='g2_ko'||m.id==='g3_ko'){
    const hf1=m.id==='g2_ko'?[R(0,1),R(1,2)]:[Q(1),Q(4)];
    const hf2=m.id==='g2_ko'?[R(1,1),R(0,2)]:[Q(2),Q(3)];
    ko=[
      {id:'HF1',label:'Halbfinale 1',hs:hf1[0],as:hf1[1]},
      {id:'HF2',label:'Halbfinale 2',hs:hf2[0],as:hf2[1]},
      {id:'P3',label:'Spiel um Platz 3',hs:L('HF1'),as:L('HF2')},
      {id:'F',label:'Finale',hs:W('HF1'),as:W('HF2')}
    ];
  }
  ko.forEach(k=>games.push(Object.assign({phase:'ko'},k)));
  return games;
}
function srcLabel(src,st){
  if(!src) return '';
  const m=modeOf(st.mode);
  if(src.t==='rank') return m.groups===1?(src.r+'. der Tabelle'):(src.r+'. Gruppe '+LETTERS[src.g]);
  if(src.t==='q') return src.slot===4?'Bester Zweiter':'Gruppensieger';
  const lab={HF1:'Halbfinale 1',HF2:'Halbfinale 2'}[src.id]||src.id;
  return (src.t==='w'?'Sieger ':'Verlierer ')+lab;
}
function times(st,games){
  const s=toMin(st.start); const start=s===null?480:s;
  const step=(durOf(st,games).dur||0)+(+st.change||0);
  const firstKO=games.findIndex(g=>g.phase==='ko');
  return games.map((g,i)=>start+i*step+(firstKO>0&&i>=firstKO?(+st.pause||0):0));
}
function endTime(st,games){if(!games.length) return null; const t=times(st,games); return t[t.length-1]+(durOf(st,games).dur||0);}
// Spieldauer: eingegeben, sonst aus Beginn und Stundenende berechnet (ganze Minuten, abgerundet)
function durOf(st,games){
  const raw=st.dur===undefined||st.dur===null?'':String(st.dur).trim();
  if(raw!==''&&+raw>0) return {dur:+raw,auto:false};
  const s=toMin(st.start), e=toMin(st.end), n=games.length;
  if(s===null||e===null||!n) return {dur:null,auto:true};
  const firstKO=games.findIndex(g=>g.phase==='ko');
  const avail=e-s-(firstKO>0?(+st.pause||0):0)-(n-1)*(+st.change||0);
  const v=Math.floor(avail/n);
  return {dur:v>=1?v:null,auto:true};
}

