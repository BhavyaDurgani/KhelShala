# System Context & Domain Mechanics
## Project: KhelShala - Interactive Engineering Simulation Platform

---

## 1. Domain Model & Platform Architecture

KhelShala is a gamified, real-time educational simulation portal designed to bridge theoretical software, hardware, and engineering concepts with hands-on, high-tech WebGL interactive environments.

```
+---------------------------------------------------------------------------------------------------+
|                                      KHELSHALA PLATFORM HUB                                       |
|  - Learner Profile & XP Progress System (Delta-based anti-farming score calculation)               |
|  - Engineering Technology Tracks (Cybersecurity, Software Engineering, AI, Cloud, Robotics)       |
|  - Global Leaderboard, Badges & Achievements Catalog, Live Telemetry Developer Matrix              |
+---------------------------------------------------------------------------------------------------+
                                                  |
        +------------------+----------------------+------------------+------------------+
        |                  |                      |                  |                  |
        v                  v                      v                  v                  v
+---------------+  +---------------+  +---------------+  +---------------+  +---------------+
|  CYBERCRIME   |  |   ALGORITHM   |  |  AI NEURAL    |  |  CLOUD DEVOPS |  |   ROBOTICS    |
|     CITY      |  |     CITY      |  | PIPELINE LAB  |  | GRID SIMULATOR|  | KINEMATICS    |
| Cybersecurity |  | Software/DSA  |  | AI & Data Eng |  | Cloud & DevOps|  | Robotics Eng  |
+---------------+  +---------------+  +---------------+  +---------------+  +---------------+
```

---

## 2. Core Mathematical & Engineering Formulations

### 2.1 Cybersecurity Risk Engine & CIA Equilibrium (`Cybercrime City`)
For every asset $a$ in sector $s$:
$$\text{Likelihood}(a) = \text{BaseLikelihood}(a) \times \prod_{c \in \text{DeployedControls}(s)} (1 - \text{Mitigation}(c, a))$$

$$\text{Impact}(a) = \text{AssetValue}(a) \times \text{VulnerabilityLevel}(a)$$

$$\text{Risk}(a) = \text{Likelihood}(a) \times \text{Impact}(a)$$

$$\text{Total System Risk} = \sum_{a} \text{Risk}(a)$$

#### CIA Triad Equilibrium Score:
$$\text{CIA Balance Score} = 100 - \sigma(C, I, A) \times 10$$
*(Maintains a higher score when Confidentiality $C$, Integrity $I$, and Availability $A$ are kept near equilibrium without sacrificing operational uptime).*

---

### 2.2 Asymptotic Big-O Complexity Engine (`Algorithm City`)
Algorithms executed in the in-world terminal are profiled across four scale tiers:
- **Tier 1**: $N = 10$ (Micro scale)
- **Tier 2**: $N = 1,000$ (Small scale)
- **Tier 3**: $N = 100,000$ (Medium scale)
- **Tier 4**: $N = 1,000,000$ (Enterprise scale)

#### Time Complexity Benchmarks:
1. **Constant Time $O(1)$**: $T(N) = c \approx 0.001\text{ms}$ across all tiers.
2. **Logarithmic Time $O(\log_2 N)$**:
   - $N = 1,000 \rightarrow \approx 10\text{ operations}$
   - $N = 1,000,000 \rightarrow \approx 20\text{ operations } (0.02\text{ms})$
3. **Linear Time $O(N)$**:
   - $N = 1,000 \rightarrow 1,000\text{ operations } (0.8\text{ms})$
   - $N = 1,000,000 \rightarrow 1,000,000\text{ operations } (180\text{ms})$
4. **Linearithmic Time $O(N \log_2 N)$**:
   - $N = 1,000,000 \rightarrow 20,000,000\text{ operations } (350\text{ms})$
5. **Quadratic Time $O(N^2)$**:
   - $N = 1,000,000 \rightarrow 1,000,000,000,000\text{ operations } (> 12,000\text{s})$ $\rightarrow$ **SYSTEM OVERLOAD**

---

### 2.3 Deep Neural Network Backpropagation & ETL Dynamics (`AI & Data Engineering`)
For a neural network with $L$ hidden layers, node count $n$, learning rate $\alpha$, and dropout rate $d$:

$$\text{Validation Accuracy} = \min\left(99.4, \max\left(60.0, 80 + 4.2 L - 800 |\alpha - 0.005| + 3.5 \frac{n}{64} - 4.0 \mathbb{I}(d > 0.3)\right)\right)$$

$$\text{Training Loss} = \max\left(0.002, \frac{1.0}{\text{Validation Accuracy} \times 0.2} + 0.001 \times \text{BatchSize}\right)$$

- **Feature Normalizers**: Z-Score Standard Normalization $z = \frac{x - \mu}{\sigma}$ vs Min-Max Normalization $x' = \frac{x - x_{\min}}{x_{\max} - x_{\min}}$.

---

### 2.4 Cloud NGINX & Kubernetes Auto-Scaler Mechanics (`Cloud & DevOps`)
System latency $L$ and SLA Uptime $U_{\text{SLA}}$ under traffic volume $R$ (req/sec):

$$\text{Active Pod Capacity} = \sum_{\text{region} \in \{\text{US}, \text{EU}, \text{AP}\}} \text{Pods}_{\text{region}} \times \text{Status}_{\text{region}}$$

$$\text{CPU Load \%} = \min\left(100, \frac{R}{\text{Active Pod Capacity} \times 12,500}\right)$$

$$L_{\text{ms}} = \max\left(15, 20 + \frac{\text{CPU Load}}{2} - \mathbb{I}(\text{LeastConn}) \times 8\right)$$

$$U_{\text{SLA}} = \max\left(95.0, 100 - \max(0, \text{CPU Load} - 65) \times 0.15\right)$$

---

### 2.5 3-DOF Robot Arm Forward & Inverse Kinematics (`Robotics Kinematics`)
For joint angles $\theta_1, \theta_2, \theta_3$ and link lengths $l_1, l_2, l_3$:
$$x_{\text{end}} = x_0 + l_1 \cos(\theta_1) + l_2 \cos(\theta_1 + \theta_2) + l_3 \cos(\theta_1 + \theta_2 + \theta_3)$$
$$y_{\text{end}} = y_0 - l_1 \sin(\theta_1) - l_2 \sin(\theta_1 + \theta_2) - l_3 \sin(\theta_1 + \theta_2 + \theta_3)$$

#### Closed-Loop PID Damping Control:
$$u(t) = K_p e(t) + K_i \int_0^t e(\tau) d\tau + K_d \frac{de(t)}{dt}$$
- Target precision error: $e_{\text{dist}} = \sqrt{(x_{\text{end}} - x_{\text{target}})^2 + (y_{\text{end}} - y_{\text{target}})^2} < 12\text{mm}$.
- Trajectory overshoot: $\text{Overshoot \%} = \max\left(0.5, 25.0 - K_p \times 3.0 - K_d \times 8.0\right) < 3\%$.

---

## 3. Game Module Taxonomies & Level Structure

| Game Title | Engineering Track | Core Objective | Key Metrics / Thresholds |
| :--- | :--- | :--- | :--- |
| **Cybercrime City** | Cybersecurity & Defense | Deploy SOC controls, defend municipal sectors, survive AI attack waves | Grid Health > 30%, Budget $\le \$10k$, CIA Balance > 80% |
| **Algorithm City** | Software Eng & DSA | Write search/sort code, step visualizer, Big-O stress testing | Latency $< 0.02\text{ms}$ at $N=1,000,000$ |
| **Neural Net & Data Pipeline Lab** | AI & Data Engineering | Architect deep networks, scale streaming ETL feature vectors | Val Accuracy $> 98.5\%$, Train Loss $< 0.01$ |
| **CloudReliability Grid** | Cloud & DevOps Arch | Configure NGINX load balancing, HPA auto-scaling, regional failover | SLA Uptime $\ge 99.999\%$, Latency $< 50\text{ms}$ |
| **Robotics Kinematics: Vector Realm** | Robotics & Autonomous Systems | Tune 3-DOF joint angles and closed-loop PID parameters | Distance Error $< 12\text{mm}$, Overshoot $< 3\%$ |

---

## 4. AI Mentor & Adaptive Intelligence Architectures

1. **Socratic AI Mentor System**:
   - Runs client-side with 0 external API cost.
   - Provides progressive 3-tier hints (Tier 1: Socratic Question, Tier 2: Conceptual Hint, Tier 3: Actionable Strategy).
2. **Adaptive AI Attacker Utility Loop**:
   - Evaluates target nodes in the attack graph:
     $$U(n) = \frac{\text{Impact}(n) \times \text{SuccessProb}(n)}{\text{DetectionProb}(n) \times \text{TimeRequired}(n)}$$
3. **Adaptive AI Defender Loop**:
   - Monitors active attacks, deploys counter controls, and triggers Incident Response (IR) actions dynamically every 6 seconds.
