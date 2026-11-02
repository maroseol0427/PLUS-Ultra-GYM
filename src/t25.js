const {chromium}=require('playwright');const fs=require('fs'),http=require('http'),path=require('path');
const root=path.join(__dirname,'web');
const srv=http.createServer((q,r)=>{let f=q.url.split('?')[0];if(f==='/')f='/index.html';if(f==='/firebase-config.js'){r.end('window.FIREBASE_CONFIG={apiKey:"x"}');return}
 try{r.end(fs.readFileSync(path.join(root,f)))}catch{r.statusCode=404;r.end()}}).listen(8766);
(async()=>{const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader']});const ctx=await b.newContext({viewport:{width:900,height:760}});
for(const[u,f]of[['**/three.min.js','node_modules/three/build/three.min.js'],['**/Reflector.js','node_modules/three/examples/js/objects/Reflector.js'],['**/firebase-app-compat.js','fakefb.js']])await ctx.route(u,r=>r.fulfill({body:fs.readFileSync(f,'utf8'),contentType:'text/javascript'}));
for(const u of['**/firebase-database-compat.js','**/firebase-auth-compat.js'])await ctx.route(u,r=>r.fulfill({body:'',contentType:'text/javascript'}));
await ctx.route('https://fonts.googleapis.com/**',r=>r.fulfill({body:'',contentType:'text/css'}));
const open=async(n,em)=>{const p=await ctx.newPage();p.on('pageerror',e=>console.log(n,'ERR',e.message));await p.addInitScript(e=>window.FAKE_EMAIL=e,em);await p.goto('http://localhost:8766/');await p.waitForTimeout(800);return p};
const A=await open('A','maroseol0427@gmail.com');await A.screenshot({path:'g0.png'});
console.log('A visible',await A.evaluate(()=>[$('lgId').offsetParent!==null,$('guest').offsetParent!==null,$('gGo').offsetParent!==null,$('gTxt').textContent]));
await A.fill('#nick','릿타');await A.click('#gGo');await A.waitForFunction(()=>started,null,{timeout:60000});await A.waitForTimeout(1000);
console.log('A in',await A.evaluate(()=>[acctKey,isAdmin,$('net').textContent,getComputedStyle($('bAdmin')).display,S.name]));
const B=await open('B','friend@gmail.com');await B.click('#gGo');await B.waitForFunction(()=>started,null,{timeout:60000});await B.waitForTimeout(2500);await A.bringToFront();await A.waitForTimeout(1500);
console.log('peers',await A.evaluate(()=>[...peers.keys()]),await B.evaluate(()=>[isAdmin,[...peers.keys()],getComputedStyle($('bAdmin')).display]));
await A.evaluate(()=>{S.coins=555;saveSoon()});await A.waitForTimeout(4500);
console.log('db keys',await A.evaluate(()=>{const t=JSON.parse(localStorage.getItem('fakefb'));return[Object.keys(t.acct||{}),Object.keys(t.rank||{}),Object.keys((t.rooms||{})['ch-gangnam']||{}),Object.keys(t.lobby||{})]}));
// relogin
const C=await open('C','maroseol0427@gmail.com');await C.click('#gGo');await C.waitForFunction(()=>started,null,{timeout:60000});console.log('C',await C.evaluate(()=>[S.coins,S.name,isAdmin]));
await b.close();srv.close()})();
