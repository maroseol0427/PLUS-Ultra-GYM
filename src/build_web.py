# gym.html(아티팩트 원본) → web/index.html (GitHub Pages + Firebase 버전)
import sys,shutil,os
D=os.path.dirname(os.path.abspath(__file__))
s=open(D+'/gym.html',encoding='utf8').read()
def R(old,new):
    global s
    if s.count(old)!=1: sys.exit('COUNT %d: %s'%(s.count(old),old[:80]))
    s=s.replace(old,new)
# 랭킹 문서 이름을 아이디 해시 대신 계정 해시에서 만든다 (남이 아이디만 알고 내 랭킹을 덮어쓰지 못하게)
# 구글 로그인 전용: 계정·랭킹 문서 이름 = Firebase uid (서버 규칙이 본인만 쓰게 막음)
R("await db.doc('rank/'+nameKey).set(","await db.doc('rank/'+acctKey).set(")
R("rankRows=q.docs.map(","rankRows=q.docs.filter(d=>d.id.length<60).map(")
R("""  <p>아이디와 비밀번호로 들어오면 근육·코인·의상이 저장돼서 다른 기기에서도 이어서 할 수 있어요. 처음 쓰는 아이디는 새 계정이 만들어져요. 실제로 쓰는 비밀번호는 넣지 마세요.</p>""",
  """  <p>구글 계정으로 들어오면 근육·코인·의상이 저장돼서 폰·PC 어디서든 이어서 할 수 있어요. 처음이면 아래에서 닉네임·성별·피부색을 고르고 시작하세요.</p>""")
R('<label for="nick" class="k">닉네임 (새 계정·게스트, 등판에 새겨져요)</label>','<label for="nick" class="k">닉네임 (처음 시작할 때만, 등판에 새겨져요)</label>')
R('<div class="two"><input type="text" id="lgId"','<div class="two" hidden><input type="text" id="lgId"')
R('<button id="go">로그인 / 새 계정</button>\n  <button id="guest">게스트로 시작 (이 기기에만 저장)</button>',
  '<button id="go" hidden>로그인 / 새 계정</button>\n  <button id="guest" hidden>게스트로 시작</button>\n  <button id="gGo" class="gbtn"><svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true"><path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z"/><path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/><path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-7.9l-6.5 5C9.5 39.6 16.2 44 24 44z"/><path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z"/></svg><span id="gTxt">Google로 시작하기</span></button>\n  <button id="gOut" class="sm" hidden>다른 구글 계정으로 바꾸기</button>')
R("#guest{padding:11px;","#gGo{display:flex;align-items:center;justify-content:center;gap:10px;padding:14px;border:0;border-radius:12px;background:#fff;color:#1f1f1f;font:700 16px var(--body);cursor:pointer;box-shadow:0 6px 18px rgba(0,0,0,.3)}#gGo:disabled{opacity:.6}\n#guest{padding:11px;")
R('<button id="bAdmin">🔑 관리자</button>','<button id="bAdmin" class="admonly">🔑 관리자 패널</button><button id="bLogout">🚪 로그아웃</button>')
R("getDb();initLobby();drawChanSign();","""// ---------- 구글 로그인 (웹 버전 전용) ----------
let gUser=null;const inApp=()=>/KAKAOTALK|Instagram|FBAN|FBAV|Line\/|NAVER|DaumApps|everytimeApp/i.test(navigator.userAgent);
function gUI(){$('gTxt').textContent=gUser?`${gUser.email.replace(/^(.{2}).*(@.*)$/,'$1***$2')} 로 시작하기`:'Google로 시작하기';$('gOut').hidden=!gUser}
if(window.gymAuth){gymAuth.watch(u=>{gUser=u;gUI();if(!u&&started)location.reload()});gUI();
 if(inApp())lgMsg('카카오톡·인스타 같은 앱 안 브라우저에서는 구글 로그인이 막혀요. 크롬이나 사파리로 열어주세요',true)}
$('gOut').onclick=async()=>{try{await gymAuth.logout()}catch{}gUser=null;gUI()};
$('bLogout').onclick=async()=>{try{saveSoon();await cloudFlush();await gymAuth.logout()}catch{}location.reload()};
$('gGo').onclick=async()=>{audio();if(!window.gymAuth)return lgMsg('서버에 연결하지 못했어요. 새로고침 해 주세요',true);
 if(inApp()){if(/KAKAOTALK/i.test(navigator.userAgent)){location.href='kakaotalk://web/openExternal?url='+encodeURIComponent(location.href);return}return lgMsg('오른쪽 위 ⋯ 메뉴에서 "다른 브라우저로 열기"를 눌러 크롬이나 사파리로 열어주세요',true)}
 $('gGo').disabled=true;lgMsg('구글 계정 확인 중…');
 try{const u=gUser||await gymAuth.login();if(!u)throw 0;gUser=u;gUI();await getDb();if(!db)throw 0;acctKey=u.uid;nameKey=u.uid;guest=false;
  const a=await db.doc('acct/'+u.uid).get();
  if(a.exists&&(a.data()||{}).save){enter(normalize(a.data().save),'다시 오셨네요!');return}
  const ns=fromStart();await db.doc('acct/'+u.uid).set({save:ns,at:Date.now()});enter(ns,'환영해요! 새 캐릭터를 만들었어요')}
 catch(e){lgMsg(e&&e.code==='auth/popup-closed-by-user'?'로그인 창이 닫혔어요. 다시 눌러 주세요':e&&e.code==='auth/popup-blocked'?'팝업이 막혔어요. 팝업을 허용하고 다시 눌러 주세요':'로그인하지 못했어요. 잠시 후 다시 눌러 주세요',true)}
 finally{$('gGo').disabled=false}};
getDb();initLobby();drawChanSign();""")
R('<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>',
  '<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>\n'
  '<script src="https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js"></script>\n'
  '<script src="https://www.gstatic.com/firebasejs/10.12.2/firebase-database-compat.js"></script>\n'
  '<script src="https://www.gstatic.com/firebasejs/10.12.2/firebase-auth-compat.js"></script>\n'
  '<script src="firebase-config.js"></script>\n<script src="net.js"></script>')
R("<title>PLUS Ultra GYM</title>",'<!doctype html>\n<html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><meta name="theme-color" content="#0b0d12">\n<title>PLUS Ultra GYM</title>')
R("<canvas id=\"c\"></canvas>","</head><body>\n<canvas id=\"c\"></canvas>")
R("if(!gRoom||sendT<.1)return;","if(!gRoom||sendT<.2)return;")
R("if(t==='리타천재'){setAdmin(true);return openAdmin()}","")
s=s.rstrip()+'\n</body></html>\n'
open(D+'/web/index.html','w',encoding='utf8').write(s)
shutil.copy(D+'/web_net.js',D+'/web/net.js')
open(D+'/web/.nojekyll','w').close()
print('built web/index.html',len(s))
