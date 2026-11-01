const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader']});const p=await b.newPage({viewport:{width:1100,height:760}});
p.on('pageerror',e=>console.log('ERR',e.message));
await p.route('**/three.min.js',r=>r.fulfill({body:fs.readFileSync('node_modules/three/build/three.min.js','utf8'),contentType:'text/javascript'}));
await p.route('**/Reflector.js',r=>r.fulfill({body:fs.readFileSync('node_modules/three/examples/js/objects/Reflector.js','utf8'),contentType:'text/javascript'}));
await p.route('https://fonts.googleapis.com/**',r=>r.fulfill({body:'',contentType:'text/css'}));
await p.setContent('<!doctype html><meta charset=utf8><body>'+fs.readFileSync('gym.html','utf8'));
await p.waitForTimeout(500);await p.click('#guest');await p.waitForTimeout(800);
await p.click('#bMenuT');await p.waitForTimeout(200);await p.screenshot({path:'u1.png'});
console.log('menu',await p.evaluate(()=>[...document.querySelectorAll('#menuP button')].filter(b=>b.offsetParent).map(b=>b.textContent)));
await p.click('#bMenuT');
// NPC stuck check: count NPCs whose pos hardly changes while walking for 6s
await p.evaluate(()=>{window.trk=npcs.map(o=>({o,p:[o.ch.pos.x,o.ch.pos.z],stuck:0}));setInterval(()=>{for(const t of trk){const d=Math.hypot(t.o.ch.pos.x-t.p[0],t.o.ch.pos.z-t.p[1]);if(t.o.act==='walk'&&d<.02)t.stuck++;t.p=[t.o.ch.pos.x,t.o.ch.pos.z]}},500)});
await p.waitForTimeout(15000);console.log('stuck',await p.evaluate(()=>trk.filter(t=>t.stuck>2).map(t=>[t.o.n,t.o.mode,!!t.o.eq,t.stuck])));
// admin + avatars
await p.fill('#cmdIn','리타천재');await p.press('#cmdIn','Enter');await p.waitForTimeout(300);
console.log('admin',await p.evaluate(()=>[isAdmin,document.body.classList.contains('admin')]));
await p.evaluate(()=>{closeSheets();S.avatar='hero';rebuildMe();me.ch.pos.set(0,0,-14);me.ch.ry=PI;camY=PI;camD=4;camP=.15});await p.waitForTimeout(1500);await p.screenshot({path:'u2.png'});
await p.evaluate(()=>{const L=[['champ',-1.5],['coach',0],['queen',1.5]];npcs.slice(0,3).forEach((o,i)=>{const a=AVATARS.find(x=>x[0]===L[i][0])[2];scene.remove(o.ch.root);o.mode='roam';o.wait=99;o.ch=makeChar(Object.assign({},o.ch.look,a.look),a.mu,a.fat);o.ch.pos.set(L[i][1],0,-12.5);o.tx=L[i][1];o.tz=-12.5;o.ch.ry=0});me.ch.pos.set(-3,0,-12.5);me.ch.ry=0;camY=0;camD=5;camP=.1});
await p.waitForTimeout(1500);await p.screenshot({path:'u3.png'});
// clothes
await p.evaluate(()=>{const T=[['hoodie','jogger'],['jacket','leggings'],['comp','skirt'],['crop','shorts'],['bra','leggings']];npcs.slice(3,8).forEach((o,i)=>{scene.remove(o.ch.root);o.mode='roam';o.wait=99;o.ch=makeChar(Object.assign({},o.ch.look,{top:T[i][0],bot:T[i][1],c:['#e5484d','#3e8ef7','#30a46c','#f5a524','#ff7eb6'][i]}),[.3,.3,.3,.3,.3,.3,.3],18);o.ch.pos.set(-3+i*1.5,0,3);o.tx=o.ch.pos.x;o.tz=3;o.ch.ry=0});S.avatar='';rebuildMe();me.ch.pos.set(0,0,6.5);camY=0;camD=5.5;camP=.1});
await p.waitForTimeout(1500);await p.screenshot({path:'u4.png'});
// plates persist
await p.evaluate(()=>{const e=EQID.sq3;const f=front(e,1);me.ch.pos.set(f.x,0,f.z)});await p.waitForTimeout(300);await p.click('#use');await p.waitForTimeout(300);for(let i=0;i<8;i++)await p.click('#wUp');await p.click('#stop');await p.waitForTimeout(300);
console.log('bar after',await p.evaluate(()=>EQID.sq3.bar.userData.n));
await b.close()})();
