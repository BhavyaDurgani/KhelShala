import type { LevelConfig } from '../../types/cyber';

export const LEVEL_CONFIGS: LevelConfig[] = [
  // LEVEL 0: Home Office & Personal Brand
  {
    id: 'lvl_0',
    levelNumber: 0,
    title: 'Level 0: Fundamentals (Home Office)',
    subtitle: 'Protect personal remote workstation and cloud identity credentials.',
    budget: 3500,
    maxTime: 120,
    objectives: [
      'Maintain Confidentiality and Integrity above 70%',
      'Mitigate initial phishing attack vector',
      'Keep operational risk below $1,000'
    ],
    introCutscene: [
      {
        speakerName: 'Commander Alex Vance',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
        text: 'Welcome to CyberCrime City operative. Before we tackle power grids and financial exchanges, let’s secure our remote home office boundary.',
        emotion: 'TACTICAL'
      },
      {
        speakerName: 'Maya Patel',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
        text: 'Sensors report suspicious phishing emails targeting our workstation credentials. Allocate our limited budget wisely!',
        emotion: 'SERIOUS'
      }
    ],
    sectors: [
      {
        id: 'sec_home_workstation',
        name: 'Remote Workstation',
        code: 'SEC-0A',
        category: 'ENDPOINT',
        health: 100,
        status: 'NORMAL',
        x: -4, y: 0, z: -2,
        deployedControlIds: [],
        assets: [
          { id: 'ast_pc', name: 'Dev Laptop', category: 'WORKSTATION', value: 2500, vulnerabilityLevel: 0.7, baseLikelihood: 0.6, currentLikelihood: 0.6, impact: 1750, risk: 1050, sectorId: 'sec_home_workstation' },
          { id: 'ast_creds', name: 'VPN Credentials', category: 'USER_CREDENTIALS', value: 3000, vulnerabilityLevel: 0.8, baseLikelihood: 0.7, currentLikelihood: 0.7, impact: 2400, risk: 1680, sectorId: 'sec_home_workstation' }
        ]
      },
      {
        id: 'sec_home_router',
        name: 'Smart Router & Gateway',
        code: 'SEC-0B',
        category: 'NETWORK',
        health: 100,
        status: 'NORMAL',
        x: 4, y: 0, z: 2,
        deployedControlIds: [],
        assets: [
          { id: 'ast_router', name: 'Wi-Fi Gateway', category: 'SERVER', value: 1500, vulnerabilityLevel: 0.5, baseLikelihood: 0.5, currentLikelihood: 0.5, impact: 750, risk: 375, sectorId: 'sec_home_router' }
        ]
      }
    ],
    attackGraph: {
      currentStepId: 'node_recon_0',
      objectiveNodeId: 'node_impact_0',
      nodes: [
        {
          id: 'node_recon_0',
          name: 'OSINT & Social Engineering',
          phase: 'RECON',
          description: 'Attacker scans social media for employee email format.',
          successProb: 0.9,
          detectionProb: 0.1,
          timeSeconds: 10,
          prerequisites: [],
          mitigatedByControlIds: ['ctrl_security_training'],
          status: 'AVAILABLE',
          position3D: [-6, 2, -4]
        },
        {
          id: 'node_init_0',
          name: 'Phishing Email Attachment',
          phase: 'INITIAL_ACCESS',
          description: 'Delivers payload via fake invoice email attachment.',
          successProb: 0.8,
          detectionProb: 0.2,
          timeSeconds: 15,
          prerequisites: ['node_recon_0'],
          mitigatedByControlIds: ['ctrl_security_training', 'ctrl_edr'],
          status: 'LOCKED',
          position3D: [-2, 2, -2]
        },
        {
          id: 'node_impact_0',
          name: 'Credential Theft & Data Exfiltration',
          phase: 'IMPACT',
          description: 'Exfiltrates browser passwords and session tokens.',
          successProb: 0.95,
          detectionProb: 0.3,
          timeSeconds: 20,
          prerequisites: ['node_init_0'],
          mitigatedByControlIds: ['ctrl_mfa', 'ctrl_encryption_at_rest'],
          status: 'LOCKED',
          position3D: [4, 2, 2]
        }
      ],
      edges: [
        { source: 'node_recon_0', target: 'node_init_0' },
        { source: 'node_init_0', target: 'node_impact_0' }
      ]
    }
  },

  // LEVEL 1: Smart Warehouse & Logistics
  {
    id: 'lvl_1',
    levelNumber: 1,
    title: 'Level 1: Smart Warehouse & Logistics',
    subtitle: 'Protect automated fulfillment inventory and IoT cargo controllers.',
    budget: 8500,
    maxTime: 180,
    objectives: [
      'Protect IoT inventory DB and cargo conveyor SCADA',
      'Prevent physical breach and network infection',
      'Maintain Availability above 80%'
    ],
    introCutscene: [
      {
        speakerName: 'Commander Alex Vance',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
        text: 'Neo-Logistics Hub sector is experiencing automated intruder scans against cargo conveyor SCADA controllers.',
        emotion: 'SERIOUS'
      },
      {
        speakerName: 'Dr. Evelyn Reed',
        avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80',
        text: 'Deploy network segmentation and biometric physical locks to prevent physical rogue drops.',
        emotion: 'CONFIDENT'
      }
    ],
    sectors: [
      {
        id: 'sec_wh_scada',
        name: 'Conveyor & SCADA Terminal',
        code: 'SEC-1A',
        category: 'SCADA',
        health: 100,
        status: 'NORMAL',
        x: -6, y: 0, z: -3,
        deployedControlIds: [],
        assets: [
          { id: 'ast_plc', name: 'PLC Controllers', category: 'SCADA', value: 8000, vulnerabilityLevel: 0.6, baseLikelihood: 0.65, currentLikelihood: 0.65, impact: 4800, risk: 3120, sectorId: 'sec_wh_scada' }
        ]
      },
      {
        id: 'sec_wh_db',
        name: 'Inventory Database Server',
        code: 'SEC-1B',
        category: 'DATABASE',
        health: 100,
        status: 'NORMAL',
        x: 0, y: 0, z: 0,
        deployedControlIds: [],
        assets: [
          { id: 'ast_inv_db', name: 'Supply Chain DB', category: 'DATABASE', value: 12000, vulnerabilityLevel: 0.55, baseLikelihood: 0.7, currentLikelihood: 0.7, impact: 6600, risk: 4620, sectorId: 'sec_wh_db' }
        ]
      },
      {
        id: 'sec_wh_gate',
        name: 'Automated Loading Dock',
        code: 'SEC-1C',
        category: 'PHYSICAL',
        health: 100,
        status: 'NORMAL',
        x: 6, y: 0, z: 3,
        deployedControlIds: [],
        assets: [
          { id: 'ast_dock', name: 'RFID Scanner Gate', category: 'WORKSTATION', value: 4000, vulnerabilityLevel: 0.7, baseLikelihood: 0.5, currentLikelihood: 0.5, impact: 2800, risk: 1400, sectorId: 'sec_wh_gate' }
        ]
      }
    ],
    attackGraph: {
      currentStepId: 'node_recon_1',
      objectiveNodeId: 'node_impact_1',
      nodes: [
        {
          id: 'node_recon_1',
          name: 'Wi-Fi Wardriving Scan',
          phase: 'RECON',
          description: 'Scans warehouse perimeter for vulnerable Wi-Fi access points.',
          successProb: 0.85,
          detectionProb: 0.15,
          timeSeconds: 12,
          prerequisites: [],
          mitigatedByControlIds: ['ctrl_nextgen_firewall'],
          status: 'AVAILABLE',
          position3D: [-8, 2, -5]
        },
        {
          id: 'node_init_1',
          name: 'Rogue Pi Drop / Default Login',
          phase: 'INITIAL_ACCESS',
          description: 'Plugs covert physical device into unmonitored loading dock port.',
          successProb: 0.75,
          detectionProb: 0.25,
          timeSeconds: 18,
          prerequisites: ['node_recon_1'],
          mitigatedByControlIds: ['ctrl_guards', 'ctrl_locks_biometrics'],
          status: 'LOCKED',
          position3D: [-3, 2, -2]
        },
        {
          id: 'node_lat_1',
          name: 'SCADA Protocol Pivot',
          phase: 'LATERAL_MOVE',
          description: 'Pivots from dock terminal into Modbus SCADA network.',
          successProb: 0.7,
          detectionProb: 0.35,
          timeSeconds: 22,
          prerequisites: ['node_init_1'],
          mitigatedByControlIds: ['ctrl_network_segmentation', 'ctrl_ids_ips'],
          status: 'LOCKED',
          position3D: [2, 2, 1]
        },
        {
          id: 'node_impact_1',
          name: 'Inventory Sabotage & Extortion',
          phase: 'IMPACT',
          description: 'Overwrites inventory records and locks conveyor PLCs.',
          successProb: 0.9,
          detectionProb: 0.5,
          timeSeconds: 25,
          prerequisites: ['node_lat_1'],
          mitigatedByControlIds: ['ctrl_immutable_backups', 'ctrl_edr'],
          status: 'LOCKED',
          position3D: [7, 2, 4]
        }
      ],
      edges: [
        { source: 'node_recon_1', target: 'node_init_1' },
        { source: 'node_init_1', target: 'node_lat_1' },
        { source: 'node_lat_1', target: 'node_impact_1' }
      ]
    }
  },

  // LEVEL 2: SMB Corporate Office
  {
    id: 'lvl_2',
    levelNumber: 2,
    title: 'Level 2: Corporate SMB Office',
    subtitle: 'Protect active directory, executive email, and customer billing servers.',
    budget: 18000,
    maxTime: 240,
    objectives: [
      'Protect Active Directory and Billing DB',
      'Prevent Pass-the-Hash lateral movement',
      'Keep CIA balance above 75%'
    ],
    introCutscene: [
      {
        speakerName: 'Maya Patel',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
        text: 'Warning! Attackers are staging a multi-phase credential harvesting campaign targeting our corporate domain controller.',
        emotion: 'CRITICAL'
      },
      {
        speakerName: 'Commander Alex Vance',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
        text: 'Deploy MFA, EDR, and SIEM monitoring to catch them before privilege escalation occurs.',
        emotion: 'TACTICAL'
      }
    ],
    sectors: [
      {
        id: 'sec_corp_ad',
        name: 'Domain Controller (AD)',
        code: 'SEC-2A',
        category: 'SERVER',
        health: 100,
        status: 'NORMAL',
        x: -7, y: 0, z: -4,
        deployedControlIds: [],
        assets: [
          { id: 'ast_ad_server', name: 'Active Directory Core', category: 'SERVER', value: 25000, vulnerabilityLevel: 0.65, baseLikelihood: 0.75, currentLikelihood: 0.75, impact: 16250, risk: 12187, sectorId: 'sec_corp_ad' }
        ]
      },
      {
        id: 'sec_corp_billing',
        name: 'Customer Billing DB',
        code: 'SEC-2B',
        category: 'DATABASE',
        health: 100,
        status: 'NORMAL',
        x: 0, y: 0, z: -1,
        deployedControlIds: [],
        assets: [
          { id: 'ast_billing_db', name: 'Credit Card Billing DB', category: 'DATABASE', value: 35000, vulnerabilityLevel: 0.6, baseLikelihood: 0.7, currentLikelihood: 0.7, impact: 21000, risk: 14700, sectorId: 'sec_corp_billing' }
        ]
      },
      {
        id: 'sec_corp_workstations',
        name: 'Finance & HR Floor',
        code: 'SEC-2C',
        category: 'WORKSTATION',
        health: 100,
        status: 'NORMAL',
        x: 7, y: 0, z: 4,
        deployedControlIds: [],
        assets: [
          { id: 'ast_hr_pc', name: 'HR PCs & Payroll', category: 'WORKSTATION', value: 15000, vulnerabilityLevel: 0.75, baseLikelihood: 0.8, currentLikelihood: 0.8, impact: 11250, risk: 9000, sectorId: 'sec_corp_workstations' }
        ]
      }
    ],
    attackGraph: {
      currentStepId: 'node_recon_2',
      objectiveNodeId: 'node_impact_2',
      nodes: [
        {
          id: 'node_recon_2',
          name: 'Executive OSINT & LinkedIn Profiling',
          phase: 'RECON',
          description: 'Profiles CFO and HR staff for spearphishing vectors.',
          successProb: 0.9,
          detectionProb: 0.1,
          timeSeconds: 15,
          prerequisites: [],
          mitigatedByControlIds: ['ctrl_security_training'],
          status: 'AVAILABLE',
          position3D: [-9, 2, -6]
        },
        {
          id: 'node_init_2',
          name: 'Spearphishing Wire Transfer Trap',
          phase: 'INITIAL_ACCESS',
          description: 'Tricks HR manager into executing malicious macros.',
          successProb: 0.8,
          detectionProb: 0.25,
          timeSeconds: 20,
          prerequisites: ['node_recon_2'],
          mitigatedByControlIds: ['ctrl_security_training', 'ctrl_edr'],
          status: 'LOCKED',
          position3D: [-4, 2, -3]
        },
        {
          id: 'node_priv_2',
          name: 'Local LSASS Memory Dump',
          phase: 'PRIV_ESC',
          description: 'Extracts NTLM hashes from workstation memory.',
          successProb: 0.75,
          detectionProb: 0.4,
          timeSeconds: 25,
          prerequisites: ['node_init_2'],
          mitigatedByControlIds: ['ctrl_least_privilege', 'ctrl_edr'],
          status: 'LOCKED',
          position3D: [1, 2, 0]
        },
        {
          id: 'node_lat_2',
          name: 'Pass-the-Hash to Domain Controller',
          phase: 'LATERAL_MOVE',
          description: 'Uses stolen admin hash to authenticate across network.',
          successProb: 0.85,
          detectionProb: 0.35,
          timeSeconds: 30,
          prerequisites: ['node_priv_2'],
          mitigatedByControlIds: ['ctrl_mfa', 'ctrl_network_segmentation'],
          status: 'LOCKED',
          position3D: [5, 2, 3]
        },
        {
          id: 'node_impact_2',
          name: 'Domain Takeover & Ransomware Exfiltration',
          phase: 'IMPACT',
          description: 'Encrypts Active Directory and exfiltrates customer billing records.',
          successProb: 0.95,
          detectionProb: 0.6,
          timeSeconds: 35,
          prerequisites: ['node_lat_2'],
          mitigatedByControlIds: ['ctrl_immutable_backups', 'ctrl_siem_soc'],
          status: 'LOCKED',
          position3D: [9, 2, 6]
        }
      ],
      edges: [
        { source: 'node_recon_2', target: 'node_init_2' },
        { source: 'node_init_2', target: 'node_priv_2' },
        { source: 'node_priv_2', target: 'node_lat_2' },
        { source: 'node_lat_2', target: 'node_impact_2' }
      ]
    }
  },

  // LEVEL 5: Central Bank & Financial Exchange
  {
    id: 'lvl_5',
    levelNumber: 5,
    title: 'Level 5: Central Bank & Financial Exchange',
    subtitle: 'High stakes defense of SWIFT wire transaction core and trading exchange.',
    budget: 100000,
    maxTime: 360,
    objectives: [
      'Protect SWIFT Core and Automated Trading Engine',
      'Prevent zero-day exfiltration by nation-state APT',
      'Maintain Availability and Integrity at 90%+'
    ],
    introCutscene: [
      {
        speakerName: 'Dr. Evelyn Reed',
        avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80',
        text: 'ALERT CODE RED! Advanced Persistent Threat Phantom_X has mounted a multi-vector zero-day operation against our SWIFT core!',
        emotion: 'CRITICAL'
      },
      {
        speakerName: 'Commander Alex Vance',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
        text: 'We have $100,000 budget. Deploy full defense-in-depth: NGFW, Zero-Trust, EDR, AES-256, and 24/7 SOC!',
        emotion: 'TACTICAL'
      }
    ],
    sectors: [
      {
        id: 'sec_bank_swift',
        name: 'SWIFT Settlement Engine',
        code: 'SEC-5A',
        category: 'SERVER',
        health: 100,
        status: 'NORMAL',
        x: -8, y: 0, z: -5,
        deployedControlIds: [],
        assets: [
          { id: 'ast_swift', name: 'SWIFT Core', category: 'SERVER', value: 200000, vulnerabilityLevel: 0.5, baseLikelihood: 0.8, currentLikelihood: 0.8, impact: 100000, risk: 80000, sectorId: 'sec_bank_swift' }
        ]
      },
      {
        id: 'sec_bank_trading',
        name: 'HFT Algorithmic Engine',
        code: 'SEC-5B',
        category: 'SERVER',
        health: 100,
        status: 'NORMAL',
        x: 0, y: 0, z: 0,
        deployedControlIds: [],
        assets: [
          { id: 'ast_trading', name: 'Trading Engine', category: 'SERVER', value: 150000, vulnerabilityLevel: 0.6, baseLikelihood: 0.75, currentLikelihood: 0.75, impact: 90000, risk: 67500, sectorId: 'sec_bank_trading' }
        ]
      },
      {
        id: 'sec_bank_vault',
        name: 'Encrypted Account Ledger DB',
        code: 'SEC-5C',
        category: 'DATABASE',
        health: 100,
        status: 'NORMAL',
        x: 8, y: 0, z: 5,
        deployedControlIds: [],
        assets: [
          { id: 'ast_ledger', name: 'Account Ledger DB', category: 'DATABASE', value: 250000, vulnerabilityLevel: 0.5, baseLikelihood: 0.85, currentLikelihood: 0.85, impact: 125000, risk: 106250, sectorId: 'sec_bank_vault' }
        ]
      }
    ],
    attackGraph: {
      currentStepId: 'node_recon_5',
      objectiveNodeId: 'node_impact_5',
      nodes: [
        {
          id: 'node_recon_5',
          name: 'Zero-Day Vulnerability Research',
          phase: 'RECON',
          description: 'Purchases unpatched Zero-Day Web Gateway exploit.',
          successProb: 0.95,
          detectionProb: 0.05,
          timeSeconds: 20,
          prerequisites: [],
          mitigatedByControlIds: ['ctrl_vuln_scanner'],
          status: 'AVAILABLE',
          position3D: [-10, 2, -7]
        },
        {
          id: 'node_init_5',
          name: 'Web Portal Exploit Injection',
          phase: 'INITIAL_ACCESS',
          description: 'Exploits remote zero-day flaw in public banking API.',
          successProb: 0.85,
          detectionProb: 0.2,
          timeSeconds: 25,
          prerequisites: ['node_recon_5'],
          mitigatedByControlIds: ['ctrl_nextgen_firewall', 'ctrl_ids_ips'],
          status: 'LOCKED',
          position3D: [-5, 2, -3]
        },
        {
          id: 'node_priv_5',
          name: 'Kernel Token Impersonation',
          phase: 'PRIV_ESC',
          description: 'Gains SYSTEM privileges on DMZ gateway host.',
          successProb: 0.8,
          detectionProb: 0.3,
          timeSeconds: 30,
          prerequisites: ['node_init_5'],
          mitigatedByControlIds: ['ctrl_edr', 'ctrl_patch_management'],
          status: 'LOCKED',
          position3D: [0, 2, 0]
        },
        {
          id: 'node_lat_5',
          name: 'Encrypted Tunneling to SWIFT',
          phase: 'LATERAL_MOVE',
          description: 'Establishes covert SSH tunnel into SWIFT VLAN.',
          successProb: 0.75,
          detectionProb: 0.4,
          timeSeconds: 35,
          prerequisites: ['node_priv_5'],
          mitigatedByControlIds: ['ctrl_network_segmentation', 'ctrl_mfa'],
          status: 'LOCKED',
          position3D: [5, 2, 3]
        },
        {
          id: 'node_impact_5',
          name: 'Fraudulent Wire Injection & Siphoning',
          phase: 'IMPACT',
          description: 'Injects unauthorized SWIFT wire transfers and wipes transaction logs.',
          successProb: 0.95,
          detectionProb: 0.7,
          timeSeconds: 40,
          prerequisites: ['node_lat_5'],
          mitigatedByControlIds: ['ctrl_encryption_at_rest', 'ctrl_siem_soc', 'ctrl_immutable_backups'],
          status: 'LOCKED',
          position3D: [10, 2, 7]
        }
      ],
      edges: [
        { source: 'node_recon_5', target: 'node_init_5' },
        { source: 'node_init_5', target: 'node_priv_5' },
        { source: 'node_priv_5', target: 'node_lat_5' },
        { source: 'node_lat_5', target: 'node_impact_5' }
      ]
    }
  }
];
