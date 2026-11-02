const {chromium}=require('playwright');const fs=require('fs'),http=require('http'),path=require('path');
const root=path.join(__dirname,'web');
const srv=http.createServer((q,r)=>{let f=q.url.split('?')[0];if(f==='/')f='/index.html';if(f==='/firebase-config.js'){r.end('window.FIREBASE_CONFIG={apiKey:"x"}');return}
 try{r.end(fs.readFileSync(path.join(root,f)))}catch{r.statusCode=404;r.end()}}).listen(8767);
(async()=>{const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader']});const ctx=await b.newContext({viewport:{width:1000,height:760}});
for(const[u,f]of[['**/three.min.js','node_modules/three/build/three.min.js'],['**/Reflector.js','node_modules/three/examples/js/objects/Reflector.js'],['**/firebase-app-compat.js','fakefb.js']])await ctx.route(u,r=>r.fulfill({body:fs.readFileSync(f,'utf8'),contentType:'text/javascript'}));
for(const u of['**/firebase-database-compat.js','**/firebase-auth-compat.js'])await ctx.route(u,r=>r.fulfill({body:'',contentType:'text/javascript'}));
await ctx.route('https://fonts.googleapis.com/**',r=>r.fulfill({body:'',contentType:'text/css'}));
const open=async(n,em,nick)=>{const p=await ctx.newPage();p.on('pageerror',e=>console.log(n,'ERR',e.message));await p.addInitScript(e=>window.FAKE_EMAIL=e,em);await p.goto('http://localhost:8767/');await p.waitForTimeout(700);if(nick)await p.fill('#nick',nick);await p.click('#gGo');await p.waitForFunction(()=>started,null,{timeout:60000});await p.waitForTimeout(800);return p};
const A=await open('A','maroseol0427@gmail.com','릿타');const B=await open('B','friend@gmail.com','친구');await B.waitForTimeout(1500);
await A.bringToFront();await A.waitForTimeout(1500);
// menu -> phone
await B.click('#bMenuT');await B.waitForTimeout(800);console.log('B emote',await B.evaluate(()=>me.emote&&me.emote.type));await B.click('#bMenuT');
// flag pants + rename
await A.evaluate(()=>{S.look.bot='flag';rebuildMe();me.ch.pos.set(0,0,2);me.ch.ry=0;camY=0;camD=3.5;camP=.1});
await A.click('#bMenuT');await A.click('#bAdmin');await A.waitForTimeout(500);await A.screenshot({path:'h1.png'});
console.log('admin rows',await A.evaluate(()=>[...document.querySelectorAll('#admL .row span')].map(s=>s.textContent)));
await A.evaluate(()=>{const i=[...document.querySelectorAll('#admL input[type=text]')][0];i.value='관장님';[...document.querySelectorAll('#admL button')].find(b=>b.textContent==='이름 바꾸기').click()});
console.log('name',await A.evaluate(()=>S.name));
// kick B
const kb=async t=>A.evaluate(t=>{const b=[...document.querySelectorAll('#admL button')].find(b=>b.textContent===t);b.click();b.click()},t);
await kb('계정 초기화');await A.waitForTimeout(2500);await B.bringToFront();await B.waitForTimeout(2000);console.log('kickdoc',await B.evaluate(()=>JSON.parse(localStorage.getItem('fakefb')).kick));
console.log('B kicked',await B.evaluate(()=>document.body.innerText.slice(0,40)),await A.evaluate(()=>Object.keys(JSON.parse(localStorage.getItem('fakefb')).acct||{})));
await A.evaluate(()=>closeSheets());await A.waitForTimeout(1200);await A.screenshot({path:'h2.png'});
// npc phone
await A.evaluate(()=>{const o=npcs.find(n=>!n.staff&&n.mode==='roam');o.emote={type:'phone',t:30};o.wait=30;o.ch.pos.set(me.ch.pos.x+.9,0,me.ch.pos.z+.6);o.tx=o.ch.pos.x;o.tz=o.ch.pos.z;o.ch.ry=0;camD=2.4;camP=.05});await A.waitForTimeout(1500);await A.screenshot({path:'h3.png'});
console.log('phoners',await A.evaluate(()=>npcs.filter(n=>n.phoner).map(n=>n.n)));
await b.close();srv.close()})();
