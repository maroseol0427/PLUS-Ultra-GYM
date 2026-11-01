window.firebase=(()=>{const KEY='fakefb',bc=new BroadcastChannel('fakefb');let tree=JSON.parse(localStorage.getItem(KEY)||'{}');const L=new Set(),disc=new Map();
const ks=p=>p.split('/').filter(Boolean),cp=v=>v==null?null:JSON.parse(JSON.stringify(v));
function get(p){let n=tree;for(const k of ks(p)){if(n==null||typeof n!=='object')return null;n=n[k]}return n===undefined?null:cp(n)}
const load=()=>{tree=JSON.parse(localStorage.getItem(KEY)||'{}')};function setAt(p,v){const a=ks(p);let n=tree;for(let i=0;i<a.length-1;i++){if(!n[a[i]]||typeof n[a[i]]!=='object')n[a[i]]={};n=n[a[i]]}if(v==null)delete n[a.at(-1)];else n[a.at(-1)]=cp(v)}
function commit(){localStorage.setItem(KEY,JSON.stringify(tree));bc.postMessage(1);fire()}
bc.onmessage=()=>{tree=JSON.parse(localStorage.getItem(KEY)||'{}');fire()};
function fire(){for(const l of[...L])l()}
const snap=(key,v,order)=>({key,val:()=>v,exists:()=>v!==null,forEach(fn){const e=Object.entries(v||{});if(order)e.sort((a,b)=>((a[1]||{})[order]||0)-((b[1]||{})[order]||0));for(const[k,c]of e)fn(snap(k,c))}});
addEventListener('pagehide',()=>{load();for(const[p]of disc)setAt(p,null);commit()});
function ref(p,q={}){p=ks(p).join('/');const key=ks(p).at(-1)||null;const R={key,
 on(type,cb){let l;if(p==='.info/connected'){setTimeout(()=>cb(snap(null,true)));l=()=>{};}
  else if(type==='value'){let last;l=()=>{let v=get(p);if(q.order&&v){let e=Object.entries(v).sort((a,b)=>((a[1]||{})[q.order]||0)-((b[1]||{})[q.order]||0));if(q.lim)e=e.slice(-q.lim);v=Object.fromEntries(e)}const j=JSON.stringify(v);if(j!==last){last=j;cb(snap(key,v,q.order))}};setTimeout(l)}
  else{let prev={};l=()=>{const v=get(p)||{};for(const k in v){const j=JSON.stringify(v[k]);if(!(k in prev)){if(type==='child_added')cb(snap(k,v[k]))}else if(prev[k]!==j&&type==='child_changed')cb(snap(k,v[k]))}
   for(const k in prev)if(!(k in v)&&type==='child_removed')cb(snap(k,null));prev=Object.fromEntries(Object.entries(v).map(([k,c])=>[k,JSON.stringify(c)]))};setTimeout(l)}
  l.p=p;l.t=type;l.cb=cb;L.add(l);return cb},
 off(type,cb){for(const l of[...L])if(l.p===p&&(!type||l.t===type)&&(!cb||l.cb===cb))L.delete(l)},
 async get(){return snap(key,get(p))},async set(v){load();setAt(p,v);commit()},async update(o){load();for(const k in o)setAt(p+'/'+k,o[k]);commit()},async remove(){load();setAt(p,null);commit()},
 async transaction(fn){load();const v=fn(get(p));if(v===undefined)return{committed:false};setAt(p,v);commit();return{committed:true}},
 onDisconnect(){return{remove:async()=>{disc.set(p,1)},cancel:async()=>{disc.delete(p)}}},
 orderByChild(f){return ref(p,{...q,order:f})},limitToLast(n){return ref(p,{...q,lim:n})}};return R}
return{initializeApp(){},database(){return{ref}}}})();
