from typing import Dict, Any


def calculate_cvss(finding: Dict[str, Any]) -> Dict[str, Any]:
    """
    Sets the CVSS score, severity label, display color, and action priority
    based on the qualitative severity parameter of a finding.
    
    Args:
        finding: Dictionary representing a scan finding.
        
    Returns:
        The updated finding dictionary.
    """
    severity = finding.get("severity") or "Medium"
    
    if severity == "Critical":
        score = 9.5
        color = "red"
        action = "Immediate escalation — fix before next deployment"
    elif severity == "High":
        score = 7.5
        color = "orange"
        action = "Priority remediation within current sprint"
    elif severity == "Medium":
        score = 5.0
        color = "yellow"
        action = "Scheduled fix in next release cycle"
    elif severity == "Low":
        score = 2.0
        color = "green"
        action = "Best effort — address in backlog"
    else:
        score = finding.get("base_cvss_score") or 0.0
        color = finding.get("color_code") or "green"
        action = finding.get("priority_action") or "Advisory only — no immediate action required"

    finding["cvss_score"] = float(score)
    finding["severity_label"] = severity
    finding["color_code"] = color
    finding["priority_action"] = action
    
    return finding
