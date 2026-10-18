# ===============================================================
# 인공지능 알고리즘 패밀리 4-2 · 트리 깊이와 과적합
#  - 라이브러리: numpy, scikit-learn (Colab 기본 설치)
#  - 하는 일: 잡음 섞인 데이터에서 결정 트리 깊이별 훈련·검증 정확도 비교
# ===============================================================
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.tree import DecisionTreeClassifier

# ---------------------------------------------------------------
# 1) 데이터: 물결 모양 경계 y > 0.6·sin(2.6x), 정답 일부를 일부러 뒤집는다
#    [내 데이터로 바꾸려면] X(특징)와 y(0/1 정답)를 내 데이터로 바꾼다
def make(flip, seed=42, n=300):
    rng = np.random.default_rng(seed)
    X = rng.uniform(-1, 1, (n, 2))
    y = (X[:, 1] > 0.6 * np.sin(2.6 * X[:, 0])).astype(int)
    noise = rng.uniform(size=n) < flip
    y[noise] = 1 - y[noise]
    return train_test_split(X, y, test_size=100, random_state=3)

# ---------------------------------------------------------------
# 2) 담판: 깊이 3(초파리) vs 끝까지(Money-Robo)
for flip in (0.15, 0.0):
    X_tr, X_va, y_tr, y_va = make(flip)
    print(f"--- 정답 뒤집기 {int(flip*100)}% ---")
    for name, depth in (("초파리 · 깊이 3", 3), ("Money-Robo · 끝까지", None)):
        t = DecisionTreeClassifier(max_depth=depth, random_state=0).fit(X_tr, y_tr)
        print(f"{name:18s} 훈련 {t.score(X_tr, y_tr):.3f}  검증 {t.score(X_va, y_va):.3f}  잎 {t.get_n_leaves()}개")

# ---------------------------------------------------------------
# 3) 깊이별 곡선 (잡음 15%)
X_tr, X_va, y_tr, y_va = make(0.15)
print("깊이  훈련   검증")
for d in range(1, 13):
    t = DecisionTreeClassifier(max_depth=d, random_state=0).fit(X_tr, y_tr)
    print(f"{d:4d}  {t.score(X_tr, y_tr):.3f}  {t.score(X_va, y_va):.3f}")
