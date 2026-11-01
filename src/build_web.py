# gym.html(아티팩트 원본) → web/index.html (GitHub Pages + Firebase 버전)
import sys,shutil,os
D=os.path.dirname(os.path.abspath(__file__))
s=open(D+'/gym.html',encoding='utf8').read()
def R(old,new):
    global s
    if s.count(old)!=1: sys.exit('COUNT %d: %s'%(s.count(old),old[:80]))
    s=s.replace(old,new)
# 랭킹 문서 이름을 아이디 해시 대신 계정 해시에서 만든다 (남이 아이디만 알고 내 랭킹을 덮어쓰지 못하게)
R("await db.doc('rank/'+nameKey).set(","await db.doc('rank/'+(await sha('rank:'+acctKey))).set(")
R('<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>',
  '<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>\n'
  '<script src="https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js"></script>\n'
  '<script src="https://www.gstatic.com/firebasejs/10.12.2/firebase-database-compat.js"></script>\n'
  '<script src="firebase-config.js"></script>\n<script src="net.js"></script>')
R("<title>PLUS Ultra GYM</title>",'<!doctype html>\n<html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><meta name="theme-color" content="#0b0d12">\n<title>PLUS Ultra GYM</title>')
R("<canvas id=\"c\"></canvas>","</head><body>\n<canvas id=\"c\"></canvas>")
R("if(!gRoom||sendT<.1)return;","if(!gRoom||sendT<.2)return;")
s=s.rstrip()+'\n</body></html>\n'
open(D+'/web/index.html','w',encoding='utf8').write(s)
shutil.copy(D+'/web_net.js',D+'/web/net.js')
open(D+'/web/.nojekyll','w').close()
print('built web/index.html',len(s))
