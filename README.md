# PLUS Ultra GYM

실시간 온라인 헬스장 게임. 지점 2곳(강남점·서초점), 지점당 최대 50명.

- 게임: https://maroseol0427.github.io/PLUS-Ultra-GYM/
- 서버: Firebase Realtime Database `plus-ultra-gym` (싱가포르)

## 파일
- `index.html` — 게임 (원본 `src/gym.html`에서 `build_web.py`로 생성)
- `net.js` — Firebase 연결층
- `firebase-config.js` — Firebase 웹 앱 설정
- `database.rules.json` — 보안 규칙 (바뀌면 Firebase 콘솔 규칙 탭에 다시 게시)
- `src/` — 원본과 빌드 스크립트

## 업데이트
`python3 src/build_web.py` → 생성된 `web/` 파일을 저장소 루트에 복사 → commit/push → 1~10분 뒤 반영
