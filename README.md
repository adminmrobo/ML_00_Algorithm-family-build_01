# 인공지능 알고리즘 패밀리 조직도

이름만 수십 개인 머신러닝 알고리즘을 **네 가문의 가계도** 한 장으로 정리하고, 버튼을 눌러 직접 돌려 보며 배우는 교육용 웹 페이지입니다. 한 집안의 대부인 박사 앞에서 초파리 연구원과 Money-Robo가 구역마다 담판을 짓고, 승패는 페이지가 브라우저에서 직접 계산한 데이터가 정합니다.

- **바로 보기:** https://adminmrobo.github.io/ML_00_Algorithm-family-build/
- **글:** 안상선 ((주)M-Robo 대표)
- **라이선스:** CC BY-NC 4.0 (비상업적 이용, 출처 표기 필수) — [LICENSE.md](LICENSE.md)

## 3부작 구성

| 부 | 이름 | 질문 | 상태 |
|---|---|---|---|
| 1부 | 가계도 (숲 보기) | 어떤 가문이 있고, 왜 갈라졌나? | 공개 |
| 2부 | 조직원 명부 (나무 보기) | 조직원(알고리즘) 하나하나의 특기는 무엇인가? | 준비 중 |
| 3부 | 가문 회합 (규칙과 담판) | 어떻게 공정하게 겨루고, 무엇으로 재고, 어떻게 고르나? | 준비 중 |

## 편 목록

| 편 | 파일 | 제목 |
|---|---|---|
| 처음 화면 | [index.html](index.html) | 목차 — 네 가문, 서른네 조직원, 한 명의 대부 |
| 4-1 | [4-1_ml_family_map.html](4-1_ml_family_map.html) | 가계도 — 무엇을 보고 배우나 |
| 4-2 | [4-2_supervised.html](4-2_supervised.html) | 지도 가문 — 정답지를 보고 규칙을 찾는다 |
| 4-3 | [4-3_unsupervised.html](4-3_unsupervised.html) | 비지도 가문 — 정답 없이 숨은 구조를 찾는다 |
| 4-4 | [4-4_reinforcement.html](4-4_reinforcement.html) | 강화 가문 — 해 보고, 보상으로 배운다 |
| 4-5 | [4-5_ensemble.html](4-5_ensemble.html) | 앙상블 연합 — 혼자보다 여럿이 낫다 |
| 4-6 ~ 4-10 | 준비 중 | 조직원 명부: 회귀파 일곱 · 분류파 여덟 · 비지도 아홉 · 강화 삼대 · 앙상블 계보 |
| 4-11 ~ 4-15 | 준비 중 | 가문 회합: 가문의 규칙 · 지도 가문의 장부 · 비지도 가문의 장부 · 강화 가문의 장부 · 마지막 담판 |

편마다 개념 설명, 움직이는 그림, 두 세력의 담판, 확인 문제, Colab 코드, AI 응용 프롬프트, 용어 정리, 비유 모음, 레퍼런스, 교육자 TIP이 들어 있습니다.

## 등장인물

| 인물 | 역할 |
|---|---|
| 대부 · 박사 | 네 가문의 수장이자 담판의 심판. 판정은 데이터대로 내린다 |
| 참모 · 조수 | 장부를 쥔 사람. 담판 결과 숫자를 발표하고 세력도를 고친다 |
| 초파리 연구원 | 의심하는 간부. 단순한 모델, 기준선, 처음 보는 데이터로 확인하기를 고른다 |
| Money-Robo | 장부 든 회계. 크고 많고 비싼 쪽에 건다 |

## 폴더

```
├── index.html, 4-0_index.html, 4-1 ~ 4-5 .html   배포용 페이지. 그림과 스크립트가 모두 파일 안에 들어 있다
├── ep/          편별 조각 (본문, 아웃트로, 데이터, 그림 스크립트, Colab 코드)
├── src/         공용 조각 (테마, 담판 엔진, 작은 학습 엔진, 목차 틀)
├── assets/      페이지에 넣는 압축 그림
├── assets_src/  그림 원본 (PNG)
├── test/        검증 스크립트
├── build.py, prep_assets.py   페이지를 만드는 스크립트 — BUILD.md
├── 대부_컨셉_설정.md, 캐릭터_설정.md, 이미지_제작_규격.md   설정 문서
├── LICENSE.md
└── .nojekyll
```

## 데이터

담판에 쓰는 매출·고객·보상 데이터는 설명을 위해 규칙으로 만든 예시이며 실제 기록이 아닙니다(난수 고정). 알고리즘 조직도의 구조는 *Machine Learning Algorithm Family Tree* 인포그래픽(Pooja Pawar)을 참고해 새로 그렸습니다. "대부" 컨셉은 범죄 가문 장르의 일반적인 분위기만 빌렸으며 특정 영화와 관계없고 폭력을 다루지 않습니다.

---

# AI Algorithm Family Tree

An educational website that organizes dozens of machine-learning algorithms into **one family tree of four houses**, where you learn by pressing buttons and running things yourself. Before the Doctor — the don of the family — the Fruit Fly Researcher and Money-Robo settle a showdown in every district, and the winner is decided by data the page computes in your browser. (Korean only for now.)

- **Live site:** https://adminmrobo.github.io/ML_00_Algorithm-family-build/
- **Author:** Ahn Sangsun (CEO, M-Robo Co., Ltd.)
- **License:** CC BY-NC 4.0 (non-commercial use, attribution required) — [LICENSE.md](LICENSE.md)
- **Parts:** Part 1 *The Family Tree* (4-1 to 4-5, published) · Part 2 *The Member Registry* (4-6 to 4-10, in progress) · Part 3 *The Family Council* (4-11 to 4-15, in progress)
- **Build:** see [BUILD.md](BUILD.md)
