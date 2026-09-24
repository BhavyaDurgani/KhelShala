export interface CyberPacket {
  id: string;
  ip: string;
  port: number;
  protocol: 'TCP' | 'UDP' | 'HTTP' | 'SQL';
  payload: string;
  isMalicious: boolean;
  threatType: string;
}

export interface CyberExecutionFrame {
  packetId: string;
  ip: string;
  payload: string;
  blockedByScript: boolean;
  isMalicious: boolean;
  message: string;
}

export interface CyberScriptResult {
  success: boolean;
  detectedRuleType: string;
  threatsBlocked: number;
  falsePositives: number;
  totalPacketsProcessed: number;
  executionTimeMs: number;
  riskReductionPct: number;
  error?: string;
  frames: CyberExecutionFrame[];
}

const MOCK_PACKETS: CyberPacket[] = [
  { id: 'pkt_101', ip: '192.168.99.14', port: 80, protocol: 'SQL', payload: "SELECT * FROM users WHERE '1'='1' --", isMalicious: true, threatType: 'SQL Injection' },
  { id: 'pkt_102', ip: '10.0.4.12', port: 443, protocol: 'HTTP', payload: "<script>document.cookie='session_stolen'</script>", isMalicious: true, threatType: 'XSS Exploit' },
  { id: 'pkt_103', ip: '172.16.0.44', port: 80, protocol: 'HTTP', payload: "GET /api/v1/health HTTP/1.1", isMalicious: false, threatType: 'Normal Traffic' },
  { id: 'pkt_104', ip: '192.168.99.200', port: 445, protocol: 'TCP', payload: "EXEC RANSOMWARE_ENCRYPT_STORAGE_VOLUME", isMalicious: true, threatType: 'Ransomware Payload' },
  { id: 'pkt_105', ip: '10.0.1.5', port: 80, protocol: 'HTTP', payload: "POST /login username=employee_alex", isMalicious: false, threatType: 'Normal Traffic' },
  { id: 'pkt_106', ip: '192.168.99.88', port: 8080, protocol: 'UDP', payload: "SYN FLOOD DDOS PACKET OVERLOAD", isMalicious: true, threatType: 'DDoS Attack Vector' },
  { id: 'pkt_107', ip: '192.168.99.45', port: 3306, protocol: 'SQL', payload: "DROP TABLE financial_audit_logs;", isMalicious: true, threatType: 'SQL Destructive Payload' },
  { id: 'pkt_108', ip: '10.0.2.19', port: 443, protocol: 'HTTP', payload: "GET /dashboard/metrics HTTP/1.1", isMalicious: false, threatType: 'Normal Traffic' },
];

export function runCyberDefenseScript(userCode: string): CyberScriptResult {
  const startTime = performance.now();
  const frames: CyberExecutionFrame[] = [];
  let threatsBlocked = 0;
  let falsePositives = 0;

  try {
    // 1. Sanitize pseudo C/C++ keywords to JS
    const executableCode = userCode
      .replace(/\bint\s+/g, 'let ')
      .replace(/\bbool\s+/g, 'let ')
      .replace(/\bstring\s+/g, 'let ')
      .replace(/\bauto\s+/g, 'let ');

    // 2. Wrap function in dynamic sandbox runner
    const runSandbox = new Function('packet', `
      ${executableCode}
      if (typeof inspectPacket === 'function') {
        return inspectPacket(packet);
      } else if (typeof blockThreat === 'function') {
        return blockThreat(packet);
      } else if (typeof sanitizePayload === 'function') {
        const res = sanitizePayload(packet.payload);
        return res === null || res === false;
      } else if (typeof decryptPayload === 'function') {
        return false;
      } else {
        throw new Error("Missing required function definition. Define 'function inspectPacket(packet) { ... }' or 'function blockThreat(packet) { ... }'.");
      }
    `);

    // 3. Process packet stream dynamically
    for (const packet of MOCK_PACKETS) {
      let isBlocked = false;
      try {
        const res = runSandbox(packet);
        isBlocked = Boolean(res);
      } catch (err: unknown) {
        const errMsg = err instanceof Error ? err.message : String(err);
        throw new Error(`Runtime Exception on packet ${packet.id} (${packet.ip}): ${errMsg}`);
      }

      if (isBlocked && packet.isMalicious) {
        threatsBlocked++;
      } else if (isBlocked && !packet.isMalicious) {
        falsePositives++;
      }

      frames.push({
        packetId: packet.id,
        ip: packet.ip,
        payload: packet.payload,
        blockedByScript: isBlocked,
        isMalicious: packet.isMalicious,
        message: isBlocked
          ? packet.isMalicious
            ? `[BLOCKED THREAT] ${packet.threatType} neutralized from IP ${packet.ip}!`
            : `[FALSE POSITIVE] Clean packet blocked from IP ${packet.ip}.`
          : packet.isMalicious
            ? `[BREACH MISSED] Malicious ${packet.threatType} bypassed rules from IP ${packet.ip}!`
            : `[PASS THROUGH] Clean packet delivered from IP ${packet.ip}.`,
      });
    }

    const endTime = performance.now();
    const totalMalicious = MOCK_PACKETS.filter(p => p.isMalicious).length;
    const riskReductionPct = Math.round((threatsBlocked / totalMalicious) * 100);

    // Live Rule Detection
    const codeNorm = userCode.toLowerCase();
    let detectedRuleType = 'Custom Network Defense Filter';
    if (codeNorm.includes('sql') || codeNorm.includes('drop table') || codeNorm.includes('1=1')) {
      detectedRuleType = 'SQL Injection Firewall Rule';
    } else if (codeNorm.includes('script') || codeNorm.includes('cookie') || codeNorm.includes('xss')) {
      detectedRuleType = 'XSS WAF Sanitizer';
    } else if (codeNorm.includes('192.168.99') || codeNorm.includes('ip')) {
      detectedRuleType = 'Subnet & Rogue IP Filter';
    }

    return {
      success: true,
      detectedRuleType,
      threatsBlocked,
      falsePositives,
      totalPacketsProcessed: MOCK_PACKETS.length,
      executionTimeMs: Math.max(0.01, Math.round((endTime - startTime) * 100) / 100),
      riskReductionPct,
      frames,
    };
  } catch (err: unknown) {
    const endTime = performance.now();
    const errorMsg = err instanceof Error ? err.message : String(err);

    return {
      success: false,
      detectedRuleType: 'Execution Error',
      threatsBlocked: 0,
      falsePositives: 0,
      totalPacketsProcessed: 0,
      executionTimeMs: Math.round((endTime - startTime) * 100) / 100,
      riskReductionPct: 0,
      error: errorMsg,
      frames: [{
        packetId: 'ERR',
        ip: '0.0.0.0',
        payload: 'N/A',
        blockedByScript: false,
        isMalicious: true,
        message: `COMPILATION / RUNTIME ERROR: ${errorMsg}`,
      }],
    };
  }
}
