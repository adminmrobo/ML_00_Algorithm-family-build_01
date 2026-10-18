# ===============================================================
# 인공지능 알고리즘 패밀리 4-5 · 한 그루, 숲, 그리고 다수결
#  - 라이브러리: numpy, scipy, scikit-learn (Colab 기본 설치)
#  - 하는 일: 트리 한 그루 vs 랜덤 포레스트, AdaBoost 반복 수, 다수결 정답률
# ===============================================================
import numpy as np
from scipy.stats import binom
from sklearn.model_selection import train_test_split
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier, AdaBoostClassifier

# ---------------------------------------------------------------
# 1) 배깅: 물결 데이터(정답 15% 뒤집기)에서 한 그루 vs 25그루
#    [내 데이터로 바꾸려면] X, y를 내 데이터로 바꾼다
rng = np.random.default_rng(42)
X = rng.uniform(-1, 1, (300, 2))
y = (X[:, 1] > 0.6 * np.sin(2.6 * X[:, 0])).astype(int)
flip = rng.uniform(size=300) < 0.15
y[flip] = 1 - y[flip]
X_tr, X_va, y_tr, y_va = train_test_split(X, y, test_size=100, random_state=3)

one, forest = [], []
for s in range(5):                                   # 훈련 데이터를 다시 뽑아 5번
    idx = np.random.default_rng(s).integers(0, len(X_tr), len(X_tr))
    one.append(DecisionTreeClassifier(random_state=s).fit(X_tr[idx], y_tr[idx]).score(X_va, y_va))
    forest.append(RandomForestClassifier(n_estimators=25, max_features=1, random_state=s).fit(X_tr, y_tr).score(X_va, y_va))
print(f"[배깅] 한 그루  검증 평균 {np.mean(one):.3f} (흔들림 ±{np.std(one):.3f})")
print(f"       25그루   검증 평균 {np.mean(forest):.3f} (흔들림 ±{np.std(forest):.3f})")

# ---------------------------------------------------------------
# 2) 부스팅: 원 안/밖 데이터, 그루터기를 몇 개 쌓느냐에 따라
rng = np.random.default_rng(9)
R = rng.uniform(-1, 1, (80, 2))
ry = ((R ** 2).sum(1) < 0.45).astype(int)
for m in (1, 3, 10, 30):
    ab = AdaBoostClassifier(DecisionTreeClassifier(max_depth=1), n_estimators=m, random_state=0).fit(R, ry)
    print(f"[부스팅] 그루터기 {m:2d}개  훈련 정확도 {ab.score(R, ry):.3f}")

# ---------------------------------------------------------------
# 3) 다수결: 정답률 60% 위원 n명이 서로 독립일 때 (계산식 = 이항분포)
for n in (1, 5, 25, 51):
    print(f"[다수결] 위원 {n:2d}명  정답률 {binom.sf(n // 2, n, 0.6):.3f}")
# 흉내 내기: 문제 2,000개
rng = np.random.default_rng(5)
votes = rng.uniform(size=(2000, 25)) < 0.6
print(f"[다수결 흉내] 25명 {np.mean(votes.sum(1) > 12):.3f}   1명 {np.mean(votes[:, 0]):.3f}")
