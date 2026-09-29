/* ---------- Auswertung ---------- */
function sortTeams(list,played,wp){
  const gd=o=>o.gf-o.ga;
  list.sort((x,y)=>y.pts-x.pts||gd(y)-gd(x)||y.gf-x.gf||x.team-y.team);
  const out=[]; let i=0;
  while(i<list.length){
    let j=i+1;
    while(j<list.length&&list[j].pts===list[i].pts&&gd(list[j])===gd(list[i])&&list[j].gf===list[i].gf) j++;
    const block=list.slice(i,j);
    if(block.length>1){
      const set=new Set(block.map(b=>b.team)), mini={};
      block.forEach(b=>mini[b.team]={pts:0,gd:0,gf:0});
      played.forEach(p=>{
        if(set.has(p.h)&&set.has(p.a)){
          const A=mini[p.h], B=mini[p.a];
          A.gf+=p.x; B.gf+=p.y; A.gd+=p.x-p.y; B.gd+=p.y-p.x;
          if(p.x>p.y) A.pts+=wp; else if(p.y>p.x) B.pts+=wp; else {A.pts++;B.pts++;}
        }
      });
      block.sort((x,y)=>{const a=mini[x.team],b=mini[y.team]; return b.pts-a.pts||b.gd-a.gd||b.gf-a.gf||S.lots[x.team]-S.lots[y.team];});
      for(let k=1;k<block.length;k++){
        const a=mini[block[k-1].team], b=mini[block[k].team];
        block[k].tie=(a.pts===b.pts&&a.gd===b.gd&&a.gf===b.gf)?'Los':'direkter Vergleich';
      }
    }
    out.push(...block); i=j;
  }
  return out;
}
function qSlots(rank){
  const key=s=>{const p=Math.max(s.sp,1); return [s.pts/p,(s.gf-s.ga)/p,s.gf/p,-S.lots[s.team]];};
  const byKey=(a,b)=>cmp(key(b),key(a));
  const W=rank.map((r,g)=>Object.assign({},r[0],{g})).sort(byKey);
  const sec=rank.map((r,g)=>r[1]?Object.assign({},r[1],{g}):null).filter(Boolean).sort(byKey)[0];
  if(!sec||W.length<3) return {};
  if(W[0].g===sec.g) return {1:W[1].team,4:sec.team,2:W[0].team,3:W[2].team};
  return {1:W[0].team,4:sec.team,2:W[1].team,3:W[2].team};
}
function compute(){
  const st=S.settings, m=modeOf(st.mode), wp=+st.winPts||3;
  const res=id=>S.results[id]||{};
  const doneG=g=>num(res(g.id).h)!==null&&num(res(g.id).a)!==null;
  const groupGames=[...Array(m.groups)].map(()=>[]);
  S.games.forEach(g=>{if(g.phase==='group') groupGames[g.g].push(g);});
  const groupDone=groupGames.map(l=>l.every(doneG));
  const groupStarted=groupGames.map(l=>l.some(doneG));
  const rank=groupGames.map((list,gi)=>{
    const s={};
    for(let i=0;i<st.teamCount;i++) if((m.groups===1?0:st.groupOf[i])===gi) s[i]={team:i,sp:0,s:0,u:0,n:0,gf:0,ga:0,pts:0};
    const played=list.filter(doneG).map(g=>({h:g.h,a:g.a,x:num(res(g.id).h),y:num(res(g.id).a)}));
    played.forEach(p=>{add(s[p.h],p.x,p.y); add(s[p.a],p.y,p.x);});
    return sortTeams(Object.values(s),played,wp);
  });
  function add(o,f,a){o.sp++;o.gf+=f;o.ga+=a; if(f>a){o.s++;o.pts+=wp;} else if(f===a){o.u++;o.pts+=1;} else o.n++;}
  const allGroupsDone=groupDone.every(Boolean);
  const anyStarted=groupStarted.some(Boolean);
  const q=m.id==='g3_ko'?qSlots(rank):{};
  const ko={}, teamsOf=[], hint=[];
  function resolve(src,strict){
    if(src.t==='rank'){
      if(strict&&!groupDone[src.g]) return null;
      if(!strict&&!groupStarted[src.g]) return null;
      const e=rank[src.g][src.r-1]; return e?e.team:null;
    }
    if(src.t==='q'){
      if(strict&&!allGroupsDone) return null;
      if(!strict&&!anyStarted) return null;
      return q[src.slot]===undefined?null:q[src.slot];
    }
    const k=ko[src.id]; if(!k||k.winner===null) return null;
    return src.t==='w'?k.winner:k.loser;
  }
  S.games.forEach((g,i)=>{
    if(g.phase==='group'){teamsOf[i]=[g.h,g.a]; hint[i]=[null,null]; return;}
    const r=[resolve(g.hs,true),resolve(g.as,true)];
    teamsOf[i]=r; hint[i]=[r[0]===null?resolve(g.hs,false):null, r[1]===null?resolve(g.as,false):null];
    const rr=res(g.id), x=num(rr.h), y=num(rr.a), px=num(rr.ph), py=num(rr.pa);
    let winner=null, loser=null;
    const known=r[0]!==null&&r[1]!==null;
    if(known&&x!==null&&y!==null){
      if(x!==y){winner=x>y?r[0]:r[1]; loser=x>y?r[1]:r[0];}
      else if(px!==null&&py!==null&&px!==py){winner=px>py?r[0]:r[1]; loser=px>py?r[1]:r[0];}
    }
    ko[g.id]={winner,loser,draw:known&&x!==null&&y!==null&&x===y};
  });
  const done=S.games.map(g=>g.phase==='group'?doneG(g):ko[g.id].winner!==null);
  return {m,rank,groupGames,groupDone,allGroupsDone,q,ko,teamsOf,hint,done,next:done.indexOf(false),refs:computeRefs(teamsOf)};
}
function computeRefs(teamsOf){
  const st=S.settings, n=st.teamCount;
  if(!st.refs||n<3) return teamsOf.map(()=>null);
  const cnt=Array(n).fill(0), out=[];
  const inG=(i,t)=>i>=0&&i<teamsOf.length&&teamsOf[i].includes(t);
  const laterKO=(i,t)=>{for(let k=i+1;k<teamsOf.length;k++) if(S.games[k].phase==='ko'&&teamsOf[k].includes(t)) return true; return false;};
  teamsOf.forEach((tt,i)=>{
    if(tt[0]===null||tt[1]===null){out.push(null);return;}
    let best=null, bs=Infinity;
    for(let t=0;t<n;t++){
      if(tt.includes(t)) continue;
      const s=cnt[t]*10+(inG(i+1,t)?5:0)+(inG(i-1,t)?2:0)+(S.games[i].phase==='ko'&&laterKO(i,t)?4:0);
      if(s<bs){bs=s;best=t;}
    }
    if(best!==null) cnt[best]++;
    out.push(best);
  });
  return out;
}
function podium(c){
  const m=c.m;
  if(m.ko){
    const f=c.ko.F; if(!f||f.winner===null) return null;
    let third=null;
    if(c.ko.P3) third=c.ko.P3.winner;
    else if(m.id==='rr_final'&&c.rank[0][2]) third=c.rank[0][2].team;
    return {type:'podium',list:[f.winner,f.loser,third]};
  }
  if(!c.done.every(Boolean)) return null;
  if(m.groups===1) return {type:'podium',list:c.rank[0].slice(0,3).map(s=>s.team)};
  return {type:'groups',list:c.rank.map(r=>r[0].team)};
}
function qualifies(pos,team,c){
  const id=c.m.id;
  if(id==='g2_ko'||id==='rr_final') return pos<=2;
  if(id==='g3_ko') return pos===1||team===c.q[4];
  return false;
}

