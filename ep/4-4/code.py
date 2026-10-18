# ===============================================================
# 인공지능 알고리즘 패밀리 4-4 · 잘 나오는 금고만 당길까
#  - 라이브러리: numpy (Colab 기본 설치)
#  - 하는 일: 보상 금고 두 개, ε-탐욕(ε = 0 / 0.1 / 0.5) 비교, 시드 300개 평균
# ===============================================================
import numpy as np

# ---------------------------------------------------------------
# 1) 한 판: T번 당기기. switch_at 번째에 두 금고의 확률이 뒤바뀐다
#    값 고치기: Q ← Q + α(r − Q)
#    [내 문제로 바꾸려면] probs(금고별 보상 확률)와 금고 수, switch_at을 바꾼다
def play(eps, seed, T=300, probs=(0.7, 0.3), switch_at=100, alpha=0.1):
    rng = np.random.default_rng(seed)
    Q = np.zeros(2)
    total = 0
    for t in range(T):
        p = probs if t < switch_at else probs[::-1]
        if rng.uniform() < eps:
            a = rng.integers(2)                       # 탐험: 아무 금고나
        else:
            a = rng.integers(2) if Q[0] == Q[1] else int(np.argmax(Q))   # 활용: 값이 큰 금고
        r = int(rng.uniform() < p[a])
        Q[a] += alpha * (r - Q[a])
        total += r
    return total

# ---------------------------------------------------------------
# 2) 담판: 시드 300개 평균
def average(eps, switch_at):
    return np.mean([play(eps, 1000 + s, switch_at=switch_at) for s in range(300)])

for switch_at, label in ((100, "100번째에 확률이 바뀜"), (10**9, "끝까지 안 바뀜")):
    res = {eps: average(eps, switch_at) for eps in (0.0, 0.1, 0.5)}
    print(f"[{label}]  ε=0(Money-Robo) {res[0.0]:.1f}   ε=0.1(초파리) {res[0.1]:.1f}   ε=0.5 {res[0.5]:.1f}")
