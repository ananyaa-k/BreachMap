import json
import uuid
from typing import List, Dict, Any, Union
from datetime import datetime
from ai_analyzer import generate_executive_summary

# Module-level dictionary database for caching report profiles
reports: Dict[str, Any] = {}


def generate_report(
    findings: List[Dict[str, Any]], 
    scan_target: str, 
    scan_type: str
) -> Dict[str, Any]:
    """
    Assembles a scan findings summary following the ScanReport TypeScript specification.
    
    Args:
        findings: List of vulnerability findings decorated with CVSS scores.
        scan_target: Name or URL of the analyzed codebase.
        scan_type: "code" or "repo".
        
    Returns:
        The generated report dictionary.
    """
    scan_id = str(uuid.uuid4())
    timestamp = datetime.utcnow().isoformat() + "Z"
    
    severity_counts = {"Critical": 0, "High": 0, "Medium": 0, "Low": 0}
    owasp_counts: Dict[str, int] = {}
    
    for f in findings:
        sev = f.get("severity_label") or f.get("severity") or "Medium"
        sev = str(sev).capitalize()
        if sev in severity_counts:
            severity_counts[sev] += 1
            
        owasp_id = f.get("owasp_id")
        if owasp_id:
            owasp_counts[owasp_id] = owasp_counts.get(owasp_id, 0) + 1

    # overall_risk_score: (Critical*25 + High*10 + Medium*5 + Low*1) capped at 100
    weighted_sum = (
        (severity_counts.get("Critical", 0) * 25) +
        (severity_counts.get("High", 0) * 10) +
        (severity_counts.get("Medium", 0) * 5) +
        (severity_counts.get("Low", 0) * 1)
    )
    overall_risk_score = min(100, weighted_sum)

    # Call AI executive summary generator
    exec_summary = generate_executive_summary(findings, scan_target)

    # Prepare standard findings by severity payload
    findings_by_severity = {
        "Critical": severity_counts["Critical"],
        "High": severity_counts["High"],
        "Medium": severity_counts["Medium"],
        "Low": severity_counts["Low"]
    }

    return {
        "scan_id": scan_id,
        "timestamp": timestamp,
        "scan_target": scan_target,
        "scan_type": scan_type,
        "total_findings": len(findings),
        "findings_by_severity": findings_by_severity,
        "owasp_coverage": owasp_counts,
        "overall_risk_score": overall_risk_score,
        "executive_summary": exec_summary,
        "findings": findings,
    }
