# ===============================================================
# 인공지능 알고리즘 패밀리 4-3 · 정답 없이 고객 무리 찾기
#  - 라이브러리: numpy, scikit-learn (Colab 기본 설치)
#  - 하는 일: 결제액 3등분 vs K-평균, 숨겨 둔 등급과의 겹침 비교 + 주성분 분석
# ===============================================================
import numpy as np
from itertools import permutations
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler
from sklearn.decomposition import PCA

# ---------------------------------------------------------------
# 1) 고객 180명: 등급(일반·단골·VIP)마다 방문 횟수와 결제액이 다르다
#    [내 데이터로 바꾸려면] X에 내 특징 열을 넣는다. 등급(정답)이 없으면 겹침 계산은 빼고 본다
def make(pay_only, seed=43):
    rng = np.random.default_rng(seed)
    if pay_only:   # 등급이 결제액으로만 갈리는 데이터
        center, spread = [(5, 3), (5, 7), (5, 12)], [(2.2, 1.1), (2.2, 1.1), (2.2, 1.6)]
    else:          # 단골은 방문 횟수로, VIP는 결제액으로 갈리는 데이터
        center, spread = [(2, 3), (8, 4), (6, 12)], [(1, 1.2), (1.5, 1.2), (1.5, 2)]
    X, grade = [], []
    for g in range(3):
        v = np.maximum(0.2, rng.normal(center[g][0], spread[g][0], 60))
        p = np.maximum(0.3, rng.normal(center[g][1], spread[g][1], 60))
        X += list(zip(v, p)); grade += [g] * 60
    return np.array(X), np.array(grade)

def overlap(a, t):
    """무리 번호와 숨긴 등급을 가장 잘 짝지었을 때 같은 칸에 든 비율"""
    return max(np.mean(np.array(p)[a] == t) for p in permutations(range(3)))

# ---------------------------------------------------------------
# 2) 담판: 결제액 3등분(초파리) vs K-평균(Money-Robo)
for pay_only in (False, True):
    X, grade = make(pay_only)
    q1, q2 = np.quantile(X[:, 1], [1 / 3, 2 / 3])
    fly = np.digitize(X[:, 1], [q1, q2])
    robo = KMeans(n_clusters=3, n_init=5, random_state=0).fit_predict(StandardScaler().fit_transform(X))
    label = "결제액으로만 갈리는 데이터" if pay_only else "두 특징으로 갈리는 데이터"
    print(f"[{label}] 초파리(결제액 3등분) {overlap(fly, grade):.3f}   Money-Robo(K-평균) {overlap(robo, grade):.3f}")

# ---------------------------------------------------------------
# 3) k를 바꾸면 무리 안 거리 제곱합(inertia)은 계속 준다
X, grade = make(False)
Z = StandardScaler().fit_transform(X)
print("k별 무리 안 거리 제곱합:", ", ".join(f"k={k}: {KMeans(n_clusters=k, n_init=5, random_state=0).fit(Z).inertia_:.1f}" for k in range(1, 7)))

# ---------------------------------------------------------------
# 4) 주성분 분석: 방문 횟수 · 결제액 · 머문 시간 → 축 두 개
rng = np.random.default_rng(1)
stay = np.maximum(2, 5 + 2 * X[:, 0] + 0.8 * X[:, 1] + rng.normal(0, 3, len(X)))
pca = PCA(n_components=3).fit(StandardScaler().fit_transform(np.column_stack([X, stay])))
print("축별 퍼짐 비율:", np.round(pca.explained_variance_ratio_, 3), " 두 축 합:", round(pca.explained_variance_ratio_[:2].sum(), 3))
