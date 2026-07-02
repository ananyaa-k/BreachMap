export interface Finding {
  id: string;
  owasp_id: string;
  owasp_name: string;
  severity: "Critical" | "High" | "Medium" | "Low";
  cvss_score: number;
  line_number: number | null;
  filename: string | null;
  code_snippet: string;
  pattern_matched: string;
  explanation: string;
  fixed_code: string;
  cvss_justification: string;
  color_code: string;
  priority_action: string;
}

export interface ScanReport {
  scan_id: string;
  timestamp: string;
  scan_target: string;
  scan_type: "code" | "repo";
  total_findings: number;
  findings_by_severity: { Critical: number; High: number; Medium: number; Low: number };
  owasp_coverage: Record<string, number>;
  overall_risk_score: number;
  executive_summary: string;
  findings: Finding[];
}
