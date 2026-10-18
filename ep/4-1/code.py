# ===============================================================
# 인공지능 알고리즘 패밀리 4-1 · 같은 데이터, 다른 질문
#  - 라이브러리: numpy, scikit-learn (Colab 기본 설치)
#  - 하는 일: 같은 매출 데이터로 분류(목표 달성 여부)와 회귀(매출액)를 학습하고
#             처음 보는 데이터에서 각각의 기준선과 비교한다
# ===============================================================
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression, LinearRegression
from sklearn.dummy import DummyClassifier, DummyRegressor
from sklearn.metrics import accuracy_score, mean_absolute_error

# ---------------------------------------------------------------
# 1) 데이터 만들기: 매출 = 50 + 6 × 광고비 + 25 × 주말 + 잡음  (단위: 만 원)
#    [내 데이터로 바꾸려면] X(광고비, 주말 여부)와 sales를 내 데이터로 바꾼다
rng = np.random.default_rng(41)
n = 120
ad = rng.uniform(0, 10, n)                 # 광고비
weekend = (rng.uniform(size=n) < 2 / 7).astype(int)
sales = 50 + 6 * ad + 25 * weekend + rng.normal(0, 10, n)
X = np.column_stack([ad, weekend])
TARGET = 100                               # 목표 매출

X_tr, X_te, s_tr, s_te = train_test_split(X, sales, test_size=40, random_state=7)
y_tr, y_te = (s_tr >= TARGET).astype(int), (s_te >= TARGET).astype(int)

# ---------------------------------------------------------------
# 2) 초파리의 질문: 목표를 넘을까? (분류)
clf = LogisticRegression().fit(X_tr, y_tr)
base_c = DummyClassifier(strategy="most_frequent").fit(X_tr, y_tr)
print(f"[분류] 정확도 {accuracy_score(y_te, clf.predict(X_te)):.3f}   기준선(늘 많은 쪽) {accuracy_score(y_te, base_c.predict(X_te)):.3f}")

# ---------------------------------------------------------------
# 3) Money-Robo의 질문: 매출이 얼마일까? (회귀)
reg = LinearRegression().fit(X_tr, s_tr)
base_r = DummyRegressor(strategy="mean").fit(X_tr, s_tr)
print(f"[회귀] 평균 오차 {mean_absolute_error(s_te, reg.predict(X_te)):.2f}만 원   기준선(늘 평균) {mean_absolute_error(s_te, base_r.predict(X_te)):.2f}만 원")
print(f"       배운 식: 매출 ≈ {reg.intercept_:.1f} + {reg.coef_[0]:.2f} × 광고비 + {reg.coef_[1]:.1f} × 주말")

# ---------------------------------------------------------------
# 4) 회귀 예측을 문턱에 대 보면 분류 답도 나온다
via = (reg.predict(X_te) >= TARGET).astype(int)
print(f"[회귀 → 분류] 정확도 {accuracy_score(y_te, via):.3f}")
print(f"목표를 넘은 날의 비율: {np.mean(sales >= TARGET):.2f}")
