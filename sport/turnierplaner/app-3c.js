function koHTML(c){
  const st=S.settings;
  let h='<section class="ko"><h2>Endrunde</h2>';
  S.games.forEach((g,i)=>{
    if(g.phase!=='ko') return;
    const tt=c.teamsOf[i], r=S.results[g.id]||{}, x=num(r.h), y=num(r.a), px=num(r.ph), py=num(r.pa), w=c.ko[g.id].winner;
    const nmx=k=>tt[k]!==null?esc(name(tt[k])):`<span class="ph">${esc(srcLabel(k?g.as:g.hs,st))}</span>`;
    const sc=(x!==null&&y!==null&&tt[0]!==null&&tt[1]!==null)?`${x}:${y}${x===y&&px!==null&&py!==null?`<small>${px}:${py} Entsch.</small>`:''}`:'–';
    h+=`<div class="ko-g"><span class="ko-l">${g.label}</span><span class="ko-t${w!==null&&w===tt[0]?' win':''}">${nmx(0)}</span><span class="ko-s">${sc}</span><span class="ko-t r${w!==null&&w===tt[1]?' win':''}">${nmx(1)}</span></div>`;
  });
  return h+'</section>';
}
function podiumHTML(c,big){
  const p=podium(c); if(!p) return '';
  if(p.type==='podium'){
    return `<section class="podium${big?' big':''}"><h2>Endstand</h2><ol>${p.list.map((t,i)=>(t===null||t===undefined)?'':`<li class="p${i+1}"><span class="pp">${i+1}.</span><span class="pn">${esc(name(t))}</span></li>`).join('')}</ol></section>`;
  }
  return `<section class="podium${big?' big':''}"><h2>Gruppensieger</h2><ol>${p.list.map((t,g)=>`<li><span class="pp">${LETTERS[g]}</span><span class="pn">${esc(name(t))}</span></li>`).join('')}</ol></section>`;
}
function legendHTML(c){
  const id=c.m.id;
  if(id==='g2_ko'||id==='g3_ko') return '<p class="legend">Markierte Teams stehen nach aktuellem Stand im Halbfinale.</p>';
  if(id==='rr_final') return '<p class="legend">Markierte Teams stehen nach aktuellem Stand im Finale.</p>';
  return '';
}
function renderTables(){
  const c=compute();
  let h=podiumHTML(c,false)+legendHTML(c);
  h+='<div class="tables">'+c.rank.map((l,g)=>tableHTML(l,g,c,false)).join('')+'</div>';
  if(c.m.ko) h+=koHTML(c);
  $('#app').innerHTML=h;
}
function renderOverview(){
  const c=compute(), st=S.settings, T=times(st,S.games);
  const label=(i,k)=>{const g=S.games[i], t=c.teamsOf[i][k]; return t!==null?esc(name(t)):`<span class="ph">${esc(srcLabel(k?g.as:g.hs,st))}</span>`;};
  const tagOf=g=>g.phase==='ko'?g.label:(c.m.groups>1?'Gruppe '+LETTERS[g.g]:'');
  let h='<div class="ov">';
  if(c.next===-1){
    h+=podiumHTML(c,true)||'';
  }else{
    const i=c.next, g=S.games[i], tag=tagOf(g);
    h+=`<section class="ov-now" style="--gc:${gcol(g)}"><p class="ov-k">Jetzt dran<span>${fmt(T[i])} Uhr, Spiel ${i+1}${tag?', '+esc(tag):''}</span></p><div class="ov-match"><span>${label(i,0)}</span><span class="vs">gegen</span><span>${label(i,1)}</span></div>${c.refs[i]!==null?`<p class="ov-ref">Schiri: ${esc(name(c.refs[i]))}</p>`:''}</section>`;
    const nx=[]; for(let k=i+1;k<S.games.length&&nx.length<4;k++) nx.push(k);
    if(nx.length){
      h+='<section class="ov-list"><h2>Danach</h2>'+nx.map(k=>{
        const g2=S.games[k], tg=tagOf(g2);
        return `<div class="ovr" style="--gc:${gcol(g2)}"><span class="t">${fmt(T[k])}</span><span>${label(k,0)} gegen ${label(k,1)}${tg?`<span class="g">${esc(tg)}</span>`:''}</span>${c.refs[k]!==null?`<span class="s">Schiri: ${esc(name(c.refs[k]))}</span>`:''}</div>`;
      }).join('')+'</section>';
    }
    h+=podiumHTML(c,false);
  }
  h+=legendHTML(c)+'<div class="tables">'+c.rank.map((l,g)=>tableHTML(l,g,c,true)).join('')+'</div>';
  if(c.m.ko) h+=koHTML(c);
  $('#app').innerHTML=h+'</div>';
}

