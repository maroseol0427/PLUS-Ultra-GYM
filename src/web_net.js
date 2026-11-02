// PLUS Ultra GYM — Firebase 연결층. 게임 코드는 window.claude.use('db'|'room'|'downloads')만 부르므로 여기서 같은 모양으로 흉내 낸다.
(function(){
 const cfg=window.FIREBASE_CONFIG;
 const dl={save({filename,data}){return new Promise((ok,no)=>{try{const u=URL.createObjectURL(data),a=document.createElement('a');a.href=u;a.download=filename;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(u),4000);ok()}catch(e){no(e)}})}};
 if(!cfg||!cfg.apiKey||!window.firebase){window.claude={use:async n=>n==='downloads'?dl:null};return}
 firebase.initializeApp(cfg);const D=firebase.database();
 const PID=Math.random().toString(36).slice(2,10)+Date.now().toString(36).slice(-4);
 const clean=o=>JSON.parse(JSON.stringify(o));
 let conn=false;const connCbs=new Set();D.ref('.info/connected').on('value',s=>{conn=!!s.val();connCbs.forEach(f=>{try{f(conn)}catch{}})});
 const db={
  doc(path){const r=D.ref(path);return{
   async get(){const s=await r.get(),v=s.val();return{exists:v!==null,data:()=>v}},
   async set(o){await r.set(clean(o))},
   onSnapshot(cb,err){const f=s=>cb({exists:s.val()!==null,data:()=>s.val()});r.on('value',f,e=>err&&err(e));return()=>r.off('value',f)},
   async acquire({holder,ttlMs}){const now=Date.now(),t=await D.ref('locks/'+path.replace(/\//g,'_')).transaction(c=>(!c||c.until<now||c.holder===holder)?{holder,until:now+ttlMs}:undefined);return{acquired:t.committed}}}},
  collection(name){let ord='score',lim=10;const q={orderBy(f){ord=f;return q},limit(n){lim=n;return q},
   onSnapshot(cb,err){const r=D.ref(name).orderByChild(ord).limitToLast(lim);r.on('value',s=>{const docs=[];s.forEach(c=>{docs.push({id:c.key,data:()=>c.val()})});docs.reverse();cb({docs})},e=>err&&err(e));return()=>r.off()}};return q}};
 function room(path){const ref=D.ref(path),M={},mineOf=()=>M[uid()]||(M[uid()]=D.ref(path+'/'+uid())),map=new Map(),subs=new Set();let state={},t=null,left=false;
  const emit=()=>{if(t)return;t=setTimeout(()=>{t=null;const peers=[...map].map(([k,v])=>({peer:k,presence:v,sameTab:k===uid(),kind:'viewer'}));subs.forEach(f=>{try{f({peers})}catch{}})},60)};
  const put=s=>{map.set(s.key,s.val()||{});emit()},del=s=>{map.delete(s.key);emit()};
  ref.on('child_added',put);ref.on('child_changed',put);ref.on('child_removed',del);
  const re=s=>{if(s.val()&&!left&&Object.keys(state).length){const m=mineOf();m.onDisconnect().remove();m.update(state)}};D.ref('.info/connected').on('value',re);
  const R={onPeers(cb){subs.add(cb);emit();return()=>subs.delete(cb)},onConnection(cb){connCbs.add(cb);cb(conn);return()=>connCbs.delete(cb)},connected:()=>conn,
   presence(patch){patch=clean(patch);for(const k in patch)state[k]=patch[k];if('hit'in patch&&patch.hit===undefined)delete state.hit;const m=mineOf();if(!m._od){m._od=1;m.onDisconnect().remove()}return m.update(patch)},
   async leave(){left=true;ref.off();D.ref('.info/connected').off('value',re);subs.clear();try{const m=mineOf();await m.onDisconnect().cancel();await m.remove()}catch{}},
   async join(name){return room('rooms/'+name)}};
  return R}
 const A=firebase.auth?firebase.auth():null,uid=()=>A&&A.currentUser?A.currentUser.uid:PID;
 if(A){const prov=()=>{const p=new firebase.auth.GoogleAuthProvider();p.setCustomParameters({prompt:'select_account'});return p};
  window.gymAuth={async login(){try{return(await A.signInWithPopup(prov())).user}catch(e){if(e&&e.code==='auth/popup-blocked'){await A.signInWithRedirect(prov());return null}throw e}},logout:()=>A.signOut(),watch:cb=>A.onAuthStateChanged(u=>cb(u&&{uid:u.uid,email:u.email||''}))};
  window.gymAdminWatch=cb=>A.onAuthStateChanged(u=>cb(u&&u.emailVerified?u.email:''))}
 let lobby=null;
 window.claude={use:async n=>n==='db'?db:n==='downloads'?dl:n==='room'?(lobby||(lobby=room('lobby'))):null};
})();
