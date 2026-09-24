export interface CyberCodeTemplate {
  id: string;
  title: string;
  description: string;
  starterCode: string;
}

export const CYBER_CODE_TEMPLATES: CyberCodeTemplate[] = [
  {
    id: 'firewall_ip_filter',
    title: 'ROUGE IP & FIREWALL PACKET FILTER',
    description: 'Inspect packet headers and payload contents. Return true to block malicious traffic.',
    starterCode: `// Mission: Block malicious attack vectors & rogue subnet IPs
function inspectPacket(packet) {
  // Check for malicious payload strings or exploit signatures
  if (packet.payload.includes("1=1") || packet.payload.includes("DROP TABLE") || packet.payload.includes("<script>")) {
    return true; // BLOCK THREAT
  }

  // Block compromised subnet 192.168.99.x
  if (packet.ip.startsWith("192.168.99")) {
    return true; // BLOCK SUBNET
  }

  return false; // ALLOW CLEAN TRAFFIC
}`,
  },
  {
    id: 'sql_sanitizer',
    title: 'SQL INJECTION & XSS WAF SHIELD',
    description: 'Sanitize incoming payloads against SQL injection and cross-site scripting threats.',
    starterCode: `// Mission: Detect SQL Injection & XSS Payloads
function inspectPacket(packet) {
  const threatRegex = /('|--|OR 1=1|UNION SELECT|DROP TABLE|<script>|RANSOMWARE)/i;
  
  if (threatRegex.test(packet.payload)) {
    return true; // BLOCK THREAT
  }

  return false; // ALLOW SAFE TRAFFIC
}`,
  }
];
