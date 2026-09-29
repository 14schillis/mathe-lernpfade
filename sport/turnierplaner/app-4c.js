/* ---------- Ereignisse ---------- */
function step(id,k,dlt){
  const r=S.results[id]||(S.results[id]={});
  const other={h:'a',a:'h',ph:'pa',pa:'ph'}[k];
  let v=num(r[k]);
  v=v===null?(dlt>0?1:0):Math.max(0,Math.min(99,v+dlt));
  r[k]=v; if(num(r[other])===null) r[other]=0;
  const a=document.getElementById(`in-${id}-${k}`), b=document.getElementById(`in-${id}-${other}`);
  if(a) a.value=v; if(b) b.value=r[other];
  save(); refreshPlan();
}
function init(){
  $('#tabs').addEventListener('click',e=>{
    const b=e.target.closest('[data-view]'); if(!b) return;
    view=b.dataset.view;
    if(view!=='setup'){draft=null;} pendingConfirm=null;
    render(); window.scrollTo(0,0);
  });
  const app=$('#app');
  app.addEventListener('click',e=>{
    const b=e.target.closest('button'); if(!b||b.disabled) return;
    if(b.dataset.step){step(b.dataset.id,b.dataset.k,+b.dataset.step); return;}
    if(b.id==='jump'){
      const n=document.querySelector('.game.next');
      if(n) n.scrollIntoView({behavior:reduceMotion()?'auto':'smooth',block:'center'});
      return;
    }
    if(b.dataset.cnt){
      const n=Math.max(2,Math.min(16,draft.teamCount+(+b.dataset.cnt)));
      if(n===draft.teamCount) return;
      draft.teamCount=n;
      while(draft.teams.length<n) draft.teams.push('');
      draft.teams.length=n;
      draft.groupOf=defaultGroups(n,modeOf(draft.mode).groups);
      pendingConfirm=null; renderSetup(); return;
    }
    if(b.dataset.grp!==undefined){
      const i=+b.dataset.ti, g=+b.dataset.grp; draft.groupOf[i]=g;
      b.parentElement.querySelectorAll('.gb').forEach(x=>{const on=+x.dataset.grp===g; x.classList.toggle('on',on); x.setAttribute('aria-pressed',String(on));});
      pendingConfirm=null; refreshSummary(); return;
    }
    if(b.dataset.pts){
      draft.winPts=+b.dataset.pts;
      b.parentElement.querySelectorAll('.segb').forEach(x=>{const on=x===b; x.classList.toggle('on',on); x.setAttribute('aria-pressed',String(on));});
      refreshSummary(); return;
    }
    if(b.dataset.act) act(b.dataset.act);
  });
  app.addEventListener('input',e=>{
    const t=e.target;
    if(t.classList.contains('si')){
      const clean=t.value.replace(/\D/g,'').slice(0,2);
      if(clean!==t.value) t.value=clean;
      const r=S.results[t.dataset.id]||(S.results[t.dataset.id]={});
      r[t.dataset.k]=clean===''?null:+clean;
      save(); refreshPlan(); return;
    }
    if(t.dataset.team!==undefined){draft.teams[+t.dataset.team]=t.value; return;}
    if(t.dataset.f&&t.type!=='checkbox'){draft[t.dataset.f]=t.value; pendingConfirm=null; refreshSummary();}
  });
  app.addEventListener('change',e=>{
    const t=e.target;
    if(t.type==='checkbox'&&t.dataset.f){draft[t.dataset.f]=t.checked; pendingConfirm=null; refreshSummary(); return;}
    if(t.name==='mode'){
      const old=modeOf(draft.mode), nw=modeOf(t.value);
      draft.mode=t.value;
      if(old.groups!==nw.groups) draft.groupOf=defaultGroups(draft.teamCount,nw.groups);
      pendingConfirm=null; renderSetup();
    }
  });
  app.addEventListener('focusin',e=>{if(e.target.classList.contains('si')) setTimeout(()=>{try{e.target.select();}catch(_){}} ,0);});
  render();
}
globalThis.__TP={buildGames,compute,setState:s=>{S=s;},podium};
if(typeof document!=='undefined'&&document.getElementById('app')) init();
