function refreshPlan(){
  const c=compute(), st=S.settings;
  document.querySelectorAll('.game').forEach(el=>{
    const i=+el.dataset.i, g=S.games[i], tt=c.teamsOf[i], hn=c.hint[i];
    const r=S.results[g.id]||{}, x=num(r.h), y=num(r.a);
    const nm=el.querySelectorAll('.nm'), hi=el.querySelectorAll('.hint');
    [0,1].forEach(k=>{
      if(tt[k]!==null){nm[k].textContent=name(tt[k]); nm[k].classList.remove('ph'); hi[k].textContent='';}
      else{nm[k].textContent=srcLabel(k?g.as:g.hs,st); nm[k].classList.add('ph'); hi[k].textContent=hn[k]!==null?'aktuell: '+name(hn[k]):'';}
    });
    const known=tt[0]!==null&&tt[1]!==null;
    el.querySelectorAll('.si,.sb').forEach(b=>{b.disabled=!known;});
    el.querySelectorAll('.si').forEach(inp=>{
      const k=inp.dataset.k, team=(k==='h'||k==='ph')?tt[0]:tt[1];
      inp.setAttribute('aria-label',(k.charAt(0)==='p'?'Entscheidung ':'Tore ')+(team!==null?name(team):''));
    });
    let w=null;
    if(g.phase==='ko') w=c.ko[g.id].winner;
    else if(x!==null&&y!==null&&x!==y) w=x>y?g.h:g.a;
    [0,1].forEach(k=>{
      nm[k].classList.toggle('win',w!==null&&w===tt[k]);
      nm[k].classList.toggle('lose',w!==null&&w!==tt[k]);
    });
    el.classList.toggle('done',c.done[i]);
    el.classList.toggle('next',c.next===i);
    el.querySelector('.flag').textContent=c.next===i?'Jetzt dran':'';
    const d=el.querySelector('.deci'); if(d) d.hidden=!c.ko[g.id].draw;
    const ref=el.querySelector('.ref');
    if(!st.refs||st.teamCount<3) ref.textContent='';
    else ref.textContent=c.refs[i]!==null?'Schiri: '+name(c.refs[i]):(known?'':'Schiri steht noch nicht fest');
  });
}

function tableHTML(list,g,c,compact){
  const m=c.m, title=m.groups===1?(m.ko?'Tabelle Vorrunde':'Tabelle'):'Gruppe '+LETTERS[g];
  const gg=c.groupGames[g], dn=gg.filter(x=>c.done[S.games.indexOf(x)]).length;
  const diff=d=>d>0?'+'+d:(d<0?'−'+(-d):'0');
  const rows=list.map((s,i)=>`<tr class="${qualifies(i+1,s.team,c)?'q':''}"><td class="pl">${i+1}.</td><td class="tn">${esc(name(s.team))}</td>${compact?'':`<td>${s.sp}</td><td>${s.s}</td><td>${s.u}</td><td>${s.n}</td>`}<td>${s.gf}:${s.ga}</td><td>${diff(s.gf-s.ga)}</td><td class="pk">${s.pts}</td></tr>`).join('');
  const notes=list.map((s,i)=>(s.tie&&s.sp>0&&list[i-1].sp>0)?`${esc(name(list[i-1].team))} vor ${esc(name(s.team))}: ${s.tie}${s.tie==='Los'?' (automatisch gezogen)':''}`:'').filter(Boolean);
  return `<section class="tbl" style="--gc:var(--g${g})"><h2>${title}<span class="prog">${dn} von ${gg.length} Spielen</span></h2><div class="scroll"><table><thead><tr><th class="pl">Pl.</th><th class="tn">Team</th>${compact?'':'<th>Sp</th><th>S</th><th>U</th><th>N</th>'}<th>Tore</th><th>Diff</th><th class="pk">Pkt</th></tr></thead><tbody>${rows}</tbody></table></div>${notes.length?`<ul class="notes">${notes.map(n=>`<li>${n}</li>`).join('')}</ul>`:''}</section>`;
}
