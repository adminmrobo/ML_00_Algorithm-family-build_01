# 만들기 — 빌드 키트 안내

- `python3 build.py` → `out/`에 목차 `4-0_index.html`(같은 내용의 첫 화면 `index.html` 포함)과 4-1 ~ 4-5 HTML을 만든다. 목차 틀은 `src/index_tpl.html` (`python3 build.py 4-2`처럼 한 편만도 가능).
- 공용 조각: `src/base.css`(시리즈 테마) · `src/extra.css`(미니맵·대결·공통 섹션) · `src/core.js`(그림·점수판·미니맵·대결·퀴즈·코드·프롬프트·용어·NPC) · `src/ml.js`(작은 학습 엔진, node에서도 실행) · `src/author.html`.
- 편별 조각: `ep/4-n/` 안에 `meta.json`(제목·목차·꼬리말) · `body.html` · `outro.html` · `data.js`(데이터·대결 계산) · `ep.js`(그림·대결·퀴즈·용어·비유·레퍼런스·교육자 TIP) · `code.py`(Colab 코드, 빌드 때 실행해 결과를 페이지에 넣음).
- 그림: `assets/`(페이지에 넣는 압축본) · `assets_orig/`(원본). 새 그림 원본은 `assets_src/`에 둔다.
- 2부·3부 편을 더할 때: `ep/4-6/`처럼 폴더를 만들고, `src/core.js`의 `EPISODES`에서 그 편의 `ready`를 1로 바꾼다.
- 검증: `node test/duels.js`(대결 결과), `node test/verify.js`(390px·다크 모드·오류·링크).

## 대부(누아르) 컨셉
- 설정: `대부_컨셉_설정.md` (기획안 위에 덧씌우는 문서).
- 정장 그림 교체: `assets/`에 `doc_don.webp`, `doc_verdict.webp`, `asst_ledger.webp`, `fly_fedora.webp`, `robo_tux.webp`, `sc_meeting.webp`, `sc_alley.webp`를 넣고 `python3 build.py`. 없으면 build.py의 `ALIASES`에 적힌 기존 그림이 대신 들어간다.

## 그림 넣기
원본 PNG를 `assets_src/`에 넣고 `python3 prep_assets.py` → `python3 build.py`.

## 배포 (GitHub Pages)
`out/`의 HTML 7개(`index.html`, `4-0_index.html`, `4-1` ~ `4-5`)를 저장소 맨 위에 올린다. `.nojekyll`이 있어야 GitHub Pages가 파일을 그대로 내보낸다.
