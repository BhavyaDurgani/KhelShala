import type { User, Track, Game, UserGameProgress, Achievement, LeaderboardEntry } from '../types';

export const currentUserMock: User = {
  id: 'guest_operative',
  name: 'Guest Operative',
  email: 'guest@khelshala.in',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
  selectedTrack: 'software_engineering',
  totalXP: 0,
  currentLevel: 1,
  gamesPlayed: 0,
  gamesCompleted: 0,
  createdAt: new Date().toISOString()
};

export const mockTracks: Track[] = [
  {
    id: 'cybersecurity',
    name: 'Cybersecurity & Network Defense',
    slug: 'cybersecurity',
    description: 'Master threat detection, SOC incident response, network defense, firewalls, and ethical hacking through real-time defense simulations.',
    icon: 'ShieldAlert',
    banner: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1200',
    color: '#6C63FF',
    difficulty: 'Intermediate',
    skills: ['Threat Detection', 'Incident Response', 'Network Defense', 'Firewall Rules', 'Risk Mitigation'],
    active: true,
    gameCount: 3
  },
  {
    id: 'software_engineering',
    name: 'Software Engineering & DSA',
    slug: 'software-engineering',
    description: 'Master Data Structures & Algorithms (DSA), asymptotic Big-O optimization, WebGL 3D execution, and production code architecture.',
    icon: 'Code',
    banner: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=1200',
    color: '#00D4FF',
    difficulty: 'Intermediate',
    skills: ['Binary Search', 'Sorting Algorithms', 'Big-O Analysis', 'System Optimization', 'JavaScript'],
    active: true,
    gameCount: 3
  },
  {
    id: 'ai_data_engineering',
    name: 'AI & Data Engineering',
    slug: 'ai-data-engineering',
    description: 'Train neural network architectures, build scalable ETL data pipelines, optimize vector embeddings, and deploy ML models.',
    icon: 'Cpu',
    banner: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&q=80&w=1200',
    color: '#9B51E0',
    difficulty: 'Advanced',
    skills: ['Neural Networks', 'ETL Pipelines', 'Vector Search', 'Model Fine-tuning', 'Data Processing'],
    active: true,
    gameCount: 2
  },
  {
    id: 'cloud_devops',
    name: 'Cloud & DevOps Architecture',
    slug: 'cloud-devops',
    description: 'Design distributed microservices, automate CI/CD deployment pipelines, balance global server traffic, and prevent system outages.',
    icon: 'Server',
    banner: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1200',
    color: '#F59E0B',
    difficulty: 'Advanced',
    skills: ['Kubernetes', 'Docker Containerization', 'CI/CD Pipelines', 'Load Balancing', 'High Availability'],
    active: true,
    gameCount: 2
  },
  {
    id: 'robotics_embedded',
    name: 'Robotics & Embedded Systems',
    slug: 'robotics-embedded',
    description: 'Program autonomous robotic kinematic controls, sensor loops, micro-controller firmware, and spatial trajectory vector mathematics.',
    icon: 'Bot',
    banner: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=1200',
    color: '#22C55E',
    difficulty: 'Intermediate',
    skills: ['Autonomous Navigation', 'Kinematics', 'Embedded C/C++', 'Sensor Fusion', 'PID Controllers'],
    active: true,
    gameCount: 2
  }
];

export const mockGames: Game[] = [
  {
    id: 'game_cybercrime_city',
    title: 'Cybercrime City',
    slug: 'cybercrime-city',
    description: 'Build. Defend. Survive. Step into the role of Chief Information Security Officer (CISO) for Neo-Metropolis. Analyze incoming threat telemetry, configure Intrusion Detection Systems (IDS), balance defense budget allocations, and isolate zero-day ransomware before core power grid infrastructure experiences total blackout.',
    shortDescription: 'Defend a smart futuristic city against live multi-vector cyber attacks in this strategic SOC incident response simulator.',
    thumbnail: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=600',
    banner: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1200',
    domainId: 'cybersecurity',
    difficulty: 'Intermediate',
    estimatedTime: '15 min',
    skills: ['Threat Detection', 'Resource Allocation', 'Incident Response', 'Network Quarantine', 'Risk Assessment'],
    learningObjectives: [
      'Master perimeter firewall rule configuration and Intrusion Detection System (IDS) node placement.',
      'Analyze live network traffic metrics to distinguish legitimate spikes from 500 Gbps DDoS botnet assaults.',
      'Allocate SOC security budget strategically between preventive analysts, automated endpoint isolation, and zero-day hotfixes.',
      'Execute rapid network air-gapping under attack wave progression to prevent lateral kernel ransomware propagation.'
    ],
    rules: [
      'Rule 1 (Security Budget & SOC Allocation): You begin with $10,000 security credits. Deploy SOC Analysts to active sectors (Power Grid, Smart Transit, Healthcare Vaults, Financial Hub).',
      'Rule 2 (Live Threat Monitoring): Inspect the tactical grid monitor for incoming threats ranging from reconnaissance port scans to zero-day ransomware bursts.',
      'Rule 3 (Targeted Countermeasures): Click active sectors to trigger defenses: IDS Telemetry ($1,500), Firewall Patch ($2,500), Cloud Scrubbing ($3,500), or Air-Gap Isolation ($4,000).',
      'Rule 4 (Grid Integrity Threshold): Maintain municipal sector health above 30% across all attack waves. If any core sector drops to 0%, a citywide blackout occurs.',
      'Rule 5 (Scoring & Completion): Neutralize all attack waves with sub-3-second response times to earn up to +350 XP and top global leaderboard placement.'
    ],
    gameEngine: 'phaser',
    status: 'Active',
    featured: true,
    xpReward: 350,
    playerCount: 14280,
    rating: 4.9,
    createdAt: '2026-01-10T10:00:00.000Z',
    levels: [
      {
        id: 'lvl_cc_1',
        gameId: 'game_cybercrime_city',
        levelNumber: 1,
        title: 'Wave 1: Reconnaissance & Phishing Probes',
        description: 'Identify suspicious port scans and block spear-phishing payloads targeting municipal water telemetry gateways.',
        difficulty: 'Beginner',
        requiredXP: 0,
        objectives: ['Deploy 2 SOC Analysts to Power Grid', 'Neutralize 5 Malicious Phishing Payloads', 'Maintain Grid Health > 85%']
      },
      {
        id: 'lvl_cc_2',
        gameId: 'game_cybercrime_city',
        levelNumber: 2,
        title: 'Wave 2: Distributed Denial of Service (DDoS)',
        description: 'Filter massive 500 Gbps botnet traffic assaults bombarding smart transit routing and traffic signaling servers.',
        difficulty: 'Intermediate',
        requiredXP: 200,
        objectives: ['Activate Cloud Traffic Scrubbing Center', 'Mitigate 3 Escalating DDoS Botnet Waves', 'Keep Server Latency < 100ms']
      },
      {
        id: 'lvl_cc_3',
        gameId: 'game_cybercrime_city',
        levelNumber: 3,
        title: 'Wave 3: Zero-Day Lateral Ransomware',
        description: 'Isolate compromised hospital network segments before kernel-level data encryption spreads to central emergency databases.',
        difficulty: 'Advanced',
        requiredXP: 500,
        objectives: ['Air-Gap Central Healthcare Data Vaults', 'Quarantine Zero-Day Ransomware Host Nodes', 'Achieve 100% Zero Data Encrypted Status']
      }
    ]
  },
  {
    id: 'game_algorithm_city',
    title: 'Algorithm City',
    slug: 'algorithm-city',
    description: 'Diagnose industrial logistics bottlenecks, write production code in an in-world WebGL terminal, observe step-by-step array pointer swaps in 3D space, and stress-test data structures up to 1,000,000 items to achieve sub-millisecond execution.',
    shortDescription: 'Game-first Data Structures & Algorithms simulator. Write code, visualize execution in 3D, and master Big-O scalability.',
    thumbnail: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=600',
    banner: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=1200',
    domainId: 'software_engineering',
    difficulty: 'Intermediate',
    estimatedTime: '15 min',
    skills: ['Binary Search', 'Sorting Algorithms', 'Big-O Analysis', 'System Optimization', 'JavaScript'],
    learningObjectives: [
      'Compare Linear Search O(N) vs Binary Search O(log N) efficiency in physical fulfillment warehouse environments.',
      'Visualize array pointer movements, pivot selections, and swap operations in real-time WebGL 3D space.',
      'Identify CPU thermal throttling and memory buffer queue overflow during high-volume stress testing.',
      'Apply asymptotic Big-O optimization to scale algorithms from 10 to 1,000,000 array items without system crashes.'
    ],
    rules: [
      'Rule 1 (Diagnostic Briefing): Review the operational incident log to identify latency bottlenecks in the cargo dispatch pipeline.',
      'Rule 2 (3D Warehouse Inspection): Navigate the 3D fulfillment center grid to inspect stalled package queues.',
      'Rule 3 (In-World Terminal Coding): Open the In-World Terminal and code optimal search/sort algorithms (Binary Search, QuickSort, MergeSort).',
      'Rule 4 (3D Step Execution Playback): Execute code to watch index pointers move step-by-step across 3D array containers.',
      'Rule 5 (Big-O Scalability Stress Test): Run stress tests up to 1,000,000 items. Reduce lookup execution latency from 8,700ms to < 0.02ms to pass.'
    ],
    gameEngine: 'custom',
    status: 'Active',
    featured: true,
    xpReward: 500,
    playerCount: 18450,
    rating: 5.0,
    createdAt: '2026-01-18T10:00:00.000Z',
    levels: [
      {
        id: 'lvl_ac_1',
        gameId: 'game_algorithm_city',
        levelNumber: 1,
        title: 'Level 1: High-Priority Cargo Binary Search',
        description: 'Optimize high-priority cargo lookup from 8,700ms down to 0.02ms using Binary Search O(log N).',
        difficulty: 'Intermediate',
        requiredXP: 0,
        objectives: ['Implement Binary Search in In-World Terminal', 'Achieve Execution Latency < 1ms', 'Pass 10,000 Item Scalability Test']
      },
      {
        id: 'lvl_ac_2',
        gameId: 'game_algorithm_city',
        levelNumber: 2,
        title: 'Level 2: High-Speed Conveyor Belt Sorting',
        description: 'Replace slow O(N^2) Bubble Sort with O(N log N) Merge/Quick Sort to prevent physical conveyor belt congestion.',
        difficulty: 'Advanced',
        requiredXP: 300,
        objectives: ['Implement Quick Sort / Merge Sort Function', 'Sort 50,000 Packages Simultaneously', 'Zero Overflow Bottleneck Crashes']
      }
    ]
  },
  {
    id: 'game_robotics_vector',
    title: 'Robotics Kinematics: Vector Realm',
    slug: 'robotics-kinematics',
    description: 'Program autonomous robotic arm manipulators, compute 3D directional vector forces, solve forward & inverse kinematics equations, and tune Proportional-Integral-Derivative (PID) feedback controllers for zero-overshoot industrial assembly.',
    shortDescription: 'Solve spatial robotic vector math, kinematic joint trajectories, and PID feedback loops in an interactive physics arena.',
    thumbnail: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=600',
    banner: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=1200',
    domainId: 'robotics_embedded',
    difficulty: 'Intermediate',
    estimatedTime: '12 min',
    skills: ['Vector Math', 'Kinematics', 'Autonomous Navigation', 'PID Loops', 'Embedded Control'],
    learningObjectives: [
      'Decompose robotic velocity and torque vectors into 3D directional components (x, y, z).',
      'Calculate gravitational load torque and joint motor friction across multi-joint arm links.',
      'Tune PID controller gain parameters (Kp, Ki, Kd) to achieve zero overshoot positioning and prevent mechanical vibration.'
    ],
    rules: [
      'Rule 1 (Joint Vector Alignment): Drag vector handles to adjust joint angles theta_1, theta_2, theta_3 and motor thrust magnitude.',
      'Rule 2 (PID Gain Tuning): Adjust Proportional (Kp), Integral (Ki), and Derivative (Kd) gains to eliminate trajectory overshoot.',
      'Rule 3 (Obstacle Vector Avoidance): Steer robotic arm end-effector along target waypoint trajectory without colliding with factory barriers.',
      'Rule 4 (Precision Placement): Reach target precision coordinates with 0.00% collision impact force to clear the stage.',
      'Rule 5 (Cycle Time Mastery): Complete spatial trajectories in under 15 seconds to earn maximum +250 XP.'
    ],
    gameEngine: 'canvas',
    status: 'Active',
    featured: true,
    xpReward: 250,
    playerCount: 9840,
    rating: 4.8,
    createdAt: '2026-01-12T10:00:00.000Z',
    levels: [
      {
        id: 'lvl_rv_1',
        gameId: 'game_robotics_vector',
        levelNumber: 1,
        title: 'Level 1: 3-Axis Kinematic Joint Alignment',
        description: 'Calculate joint vector angles to guide a 3-DOF manipulator end-effector to precise target coordinates.',
        difficulty: 'Beginner',
        requiredXP: 0,
        objectives: ['Align 3-Axis Joint Vector Handles', 'Achieve Position Precision < 0.1mm', 'Zero Structural Collisions']
      },
      {
        id: 'lvl_rv_2',
        gameId: 'game_robotics_vector',
        levelNumber: 2,
        title: 'Level 2: Closed-Loop PID Trajectory Tracking',
        description: 'Tune PID feedback parameters to maintain smooth trajectory tracking during high-speed robotic assembly.',
        difficulty: 'Intermediate',
        requiredXP: 250,
        objectives: ['Set Proportional (Kp) and Derivative (Kd) Gain Values', 'Eliminate Mechanical Oscillation', 'Complete Path in < 15 seconds']
      }
    ]
  },
  {
    id: 'game_ai_pipeline',
    title: 'Neural Net & Data Pipeline Lab',
    slug: 'ai-neural-pipeline',
    description: 'Step into an MLOps command center. Clean streaming feature vectors, architect deep neural networks, set hyperparameters, tune backpropagation gradient descent, and eliminate training loss while preventing model overfitting.',
    shortDescription: 'Real-time deep neural network architecture training and high-throughput streaming ETL data pipeline simulator.',
    thumbnail: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&q=80&w=600',
    banner: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=1200',
    domainId: 'ai_data_engineering',
    difficulty: 'Intermediate',
    estimatedTime: '20 min',
    skills: ['Neural Networks', 'ETL Pipelines', 'Model Accuracy', 'Vector Embedding', 'Data Preprocessing'],
    learningObjectives: [
      'Master hyperparameter tuning, learning rate (alpha) selection, and gradient descent backpropagation.',
      'Detect and resolve training data drift, class imbalance, and model overfitting on unseen validation test sets.',
      'Architect resilient ETL streaming data pipelines capable of ingesting 100,000 feature vectors per second.'
    ],
    rules: [
      'Rule 1 (ETL Feature Scaling): Preprocess incoming raw data telemetry streams using Z-score and Min-Max normalization.',
      'Rule 2 (Neural Layer Architecture): Configure dense layer depth, node counts (16-256), activation functions (ReLU, Sigmoid), and dropout regularization (0.2).',
      'Rule 3 (Hyperparameter Selection): Set learning rate alpha (0.001 - 0.05) and batch size (64 - 256).',
      'Rule 4 (Backpropagation Training): Click Train Model to execute backpropagation iterations across validation data.',
      'Rule 5 (Model Validation Benchmark): Reach > 98.5% validation accuracy with loss < 0.005 to complete the mission for +300 XP.'
    ],
    gameEngine: 'canvas',
    status: 'Active',
    featured: false,
    xpReward: 300,
    playerCount: 6510,
    rating: 4.7,
    createdAt: '2026-01-14T10:00:00.000Z',
    levels: [
      {
        id: 'lvl_ai_1',
        gameId: 'game_ai_pipeline',
        levelNumber: 1,
        title: 'Level 1: Feature Vector Normalization',
        description: 'Clean raw input telemetry streams and apply Z-score feature normalization to prevent gradient explosion.',
        difficulty: 'Beginner',
        requiredXP: 0,
        objectives: ['Filter Outlier Telemetry Values', 'Apply Z-score Feature Normalization', 'Stream 10,000 Clean Vectors']
      },
      {
        id: 'lvl_ai_2',
        gameId: 'game_ai_pipeline',
        levelNumber: 2,
        title: 'Level 2: Deep Learning Layer Backpropagation',
        description: 'Configure hidden dense layers and learning rates to train a classification neural model to 99% accuracy.',
        difficulty: 'Intermediate',
        requiredXP: 300,
        objectives: ['Add 3 Dense Hidden Layers with Dropout 0.2', 'Achieve Model Accuracy > 98.5%', 'Pass Validation Test Set']
      }
    ]
  },
  {
    id: 'game_cloud_devops',
    title: 'CloudReliability: Microservices Grid',
    slug: 'cloud-reliability-grid',
    description: 'Architect high-availability multi-region cloud microservices clusters. Configure NGINX reverse proxy load balancing, set Kubernetes Horizontal Pod Autoscaler (HPA) policies, trigger automated regional failover, and maintain 99.999% SLA uptime.',
    shortDescription: 'Dynamic microservices load balancing, Kubernetes auto-scaling, and cloud infrastructure SRE simulator.',
    thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=600',
    banner: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&q=80&w=1200',
    domainId: 'cloud_devops',
    difficulty: 'Advanced',
    estimatedTime: '15 min',
    skills: ['Kubernetes', 'Load Balancing', 'Microservices', 'Failover Automation', 'Docker Containers'],
    learningObjectives: [
      'Configure NGINX Round-Robin, Least Connections, and IP Hash reverse proxy traffic routing algorithms.',
      'Establish Kubernetes Horizontal Pod Autoscaler (HPA) policies to manage unexpected HTTP traffic surges.',
      'Execute zero-downtime rolling container deployments to preserve 99.999% high availability during live maintenance.'
    ],
    rules: [
      'Rule 1 (Multi-Region Cluster Setup): Provision microservice Docker container pods across US-East, EU-Central, and AP-South cloud regions.',
      'Rule 2 (NGINX Traffic Load Balancing): Route incoming web traffic through NGINX load balancer proxies to prevent server CPU overload.',
      'Rule 3 (Kubernetes Pod Auto-Scaling): Set HPA CPU thresholds (65%) to scale container replicas dynamically during traffic spikes.',
      'Rule 4 (Automated Regional Failover): Configure automated health probes to detect server crashes and trigger instantaneous traffic rerouting.',
      'Rule 5 (SLA 99.999% Uptime Benchmark): Maintain 99.999% SLA availability and sub-50ms latency under 250,000 req/sec stress events to clear for +280 XP.'
    ],
    gameEngine: 'canvas',
    status: 'Active',
    featured: true,
    xpReward: 280,
    playerCount: 11200,
    rating: 4.9,
    createdAt: '2026-01-18T10:00:00.000Z',
    levels: [
      {
        id: 'lvl_cd_1',
        gameId: 'game_cloud_devops',
        levelNumber: 1,
        title: 'Level 1: NGINX Reverse Proxy Load Balancing',
        description: 'Distribute 50,000 HTTP requests/sec evenly across 4 backend microservice container pods.',
        difficulty: 'Intermediate',
        requiredXP: 0,
        objectives: ['Configure NGINX Least-Connections Strategy', 'Keep Server CPU Usage < 65%', 'Zero Dropped HTTP Requests']
      },
      {
        id: 'lvl_cd_2',
        gameId: 'game_cloud_devops',
        levelNumber: 2,
        title: 'Level 2: Kubernetes Multi-Region Auto Failover',
        description: 'Simulate a data center fiber outage and trigger automated DNS failover to backup cloud regions.',
        difficulty: 'Advanced',
        requiredXP: 280,
        objectives: ['Set Up Active Health Probe Monitoring', 'Trigger Auto Failover in < 2 seconds', 'Maintain 99.999% SLA Uptime']
      }
    ]
  }
];

export const mockUserProgress: UserGameProgress[] = [];

export const mockAchievements: Achievement[] = [
  {
    id: 'ach_first_game',
    title: 'First Step to Mastery',
    description: 'Launch and complete your first interactive game session on KhelShala.',
    icon: 'Play',
    requirement: 'Complete 1 Game',
    category: 'General',
    XPReward: 100,
    unlocked: false
  },
  {
    id: 'ach_cyber_defender',
    title: 'Shield of Neo-Metropolis',
    description: 'Neutralize 20 cyber attack vectors in Cybercrime City without sector blackout.',
    icon: 'Shield',
    requirement: 'Cybercrime City Level 2 Clear',
    category: 'Cybersecurity',
    XPReward: 250,
    unlocked: false
  },
  {
    id: 'ach_quick_thinker',
    title: 'Sub-Second Responder',
    description: 'Make 10 consecutive zero-error defensive decisions in under 3 seconds each.',
    icon: 'Zap',
    requirement: 'Decision Speed < 3s',
    category: 'Speed',
    XPReward: 200,
    unlocked: false
  },
  {
    id: 'ach_algo_master',
    title: 'Algorithm Wizard',
    description: 'Optimize high-throughput code execution to achieve 99.9% sub-millisecond efficiency.',
    icon: 'Code',
    requirement: 'Algorithm City 100% Complete',
    category: 'Software Engineering',
    XPReward: 300,
    unlocked: false
  },
  {
    id: 'ach_ai_pipeline',
    title: 'Neural Pipeline Architect',
    description: 'Tune deep neural network hyperparameters and achieve > 98.5% validation accuracy.',
    icon: 'Cpu',
    requirement: 'AI Neural Pipeline Clear',
    category: 'AI Engineering',
    XPReward: 300,
    unlocked: false
  },
  {
    id: 'ach_cloud_devops',
    title: 'Cloud Uptime Guardian',
    description: 'Maintain 99.999% SLA uptime under 250,000 req/sec multi-region stress tests.',
    icon: 'Server',
    requirement: 'Cloud DevOps Level 1 Clear',
    category: 'Cloud DevOps',
    XPReward: 280,
    unlocked: false
  },
  {
    id: 'ach_robotics_kinematics',
    title: 'Kinematic Vector Specialist',
    description: 'Eliminate mechanical joint oscillation using 3-DOF PID derivative damping.',
    icon: 'Bot',
    requirement: 'Robotics Kinematics Clear',
    category: 'Robotics',
    XPReward: 250,
    unlocked: false
  },
  {
    id: 'ach_domain_master',
    title: 'Tech Architect Champion',
    description: 'Play games across 4 distinct engineering technology tracks.',
    icon: 'Award',
    requirement: 'Play 4 Tech Domains',
    category: 'Mastery',
    XPReward: 500,
    unlocked: false
  },
  {
    id: 'ach_perfect_score',
    title: 'Flawless Operation',
    description: 'Achieve 100% precision score in any intermediate or advanced simulator.',
    icon: 'Target',
    requirement: 'Score 100% in a game',
    category: 'Mastery',
    XPReward: 400,
    unlocked: false
  }
];

export const mockLeaderboard: LeaderboardEntry[] = [];
