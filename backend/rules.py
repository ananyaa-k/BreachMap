from typing import Dict, Any, List, Optional

BANDIT_TO_OWASP: Dict[str, str] = {
    # A03 Injection
    "B601": "A03:2021", "B602": "A03:2021", "B603": "A03:2021",
    "B604": "A03:2021", "B605": "A03:2021", "B606": "A03:2021",
    "B607": "A03:2021", "B608": "A03:2021", "B609": "A03:2021",
    "B610": "A03:2021", "B611": "A03:2021",
    # A02 Cryptographic Failures
    "B303": "A02:2021", "B304": "A02:2021", "B305": "A02:2021",
    "B323": "A02:2021", "B324": "A02:2021",
    # A08 Software & Data Integrity
    "B301": "A08:2021", "B302": "A08:2021", "B306": "A08:2021",
    "B403": "A08:2021", "B311": "A08:2021",
    # A05 Security Misconfiguration
    "B105": "A05:2021", "B106": "A05:2021", "B107": "A05:2021",
    "B404": "A05:2021", "B501": "A05:2021", "B502": "A05:2021",
    "B503": "A05:2021", "B504": "A05:2021", "B505": "A05:2021",
    "B506": "A05:2021",
    # A07 Authentication Failures
    "B401": "A07:2021", "B402": "A07:2021",
    # A01 Broken Access Control
    "B113": "A01:2021",
    # A09 Logging Failures
    "B110": "A09:2021", "B112": "A09:2021",
}

OWASP_MAP: Dict[str, Dict[str, Any]] = {
    "A01:2021": {
        "owasp_id": "A01:2021",
        "name": "Broken Access Control",
        "severity": "High",
        "base_cvss_score": 8.5,
        "color_code": "orange",
        "priority_action": "Priority remediation within current sprint",
        "remediation_summary": "Enforce access control policies on the server side and verify user permissions for every request. Ensure IDOR vulnerabilities are mitigated by authorizing object ownership.",
        "patterns": [r"IDOR", r"\$_GET\['id'\]", r"user_id.*request"]
    },
    "A02:2021": {
        "owasp_id": "A02:2021",
        "name": "Cryptographic Failures",
        "severity": "High",
        "base_cvss_score": 7.5,
        "color_code": "orange",
        "priority_action": "Priority remediation within current sprint",
        "remediation_summary": "Avoid deprecated algorithms (MD5, SHA1, DES). Use secure protocols, enforce Secure flags on cookies, and apply modern hashing like Bcrypt/Argon2.",
        "patterns": [r"md5\(", r"sha1\(", r"hashlib\.md5", r"DES\(", r"SESSION_COOKIE_SECURE\s*=\s*False"]
    },
    "A03:2021": {
        "owasp_id": "A03:2021",
        "name": "Injection",
        "severity": "Critical",
        "base_cvss_score": 9.8,
        "color_code": "red",
        "priority_action": "Immediate escalation — fix before next deployment",
        "remediation_summary": "Prevent raw command injection and query construction by using parameterized queries/ORMs, escaping inputs, or using secure subprocess API execution.",
        "patterns": [r"execute\(.*\+", r"shell_exec\(", r"subprocess\.call.*shell=True", r"eval\(", r"pickle\.load"]
    },
    "A05:2021": {
        "owasp_id": "A05:2021",
        "name": "Security Misconfiguration",
        "severity": "High",
        "base_cvss_score": 7.0,
        "color_code": "orange",
        "priority_action": "Priority remediation within current sprint",
        "remediation_summary": "Ensure debug modes are disabled in production, change default credentials immediately, and avoid storing secrets in plain text configuration files.",
        "patterns": [r"DEBUG\s*=\s*True", r"SECRET_KEY\s*=\s*['\"]", r"password\s*=\s*['\"]", r"api_key\s*=\s*['\"]"]
    },
    "A07:2021": {
        "owasp_id": "A07:2021",
        "name": "Identification and Authentication Failures",
        "severity": "Critical",
        "base_cvss_score": 9.1,
        "color_code": "red",
        "priority_action": "Immediate escalation — fix before next deployment",
        "remediation_summary": "Implement secure authentication systems, verify session tokens properly, and avoid weak hashing mechanisms for password authentication routines.",
        "patterns": [r"md5.*password", r"sha1.*password", r"no_auth", r"verify\s*=\s*False"]
    },
    "A08:2021": {
        "owasp_id": "A08:2021",
        "name": "Software and Data Integrity Failures",
        "severity": "High",
        "base_cvss_score": 8.2,
        "color_code": "orange",
        "priority_action": "Priority remediation within current sprint",
        "remediation_summary": "Avoid deserializing untrusted data with unsafe parsers (like pickle or PyYAML's unsafe loader). Use secure serialization formats such as JSON.",
        "patterns": [r"pickle\.loads", r"yaml\.load\(", r"deserializ"]
    },
    "A09:2021": {
        "owasp_id": "A09:2021",
        "name": "Security Logging and Monitoring Failures",
        "severity": "Medium",
        "base_cvss_score": 5.3,
        "color_code": "yellow",
        "priority_action": "Scheduled fix in next release cycle",
        "remediation_summary": "Ensure logs capture relevant security events (access control failures, input errors) and avoid passing exceptions silently without trace logging.",
        "patterns": [r"except.*pass", r"except:$", r"logging\.disable"]
    }
}

OWASP_CATEGORIES = OWASP_MAP


def map_rule_to_owasp(rule_id: str) -> Optional[str]:
    """
    Maps a Bandit rule ID to its corresponding OWASP Top 10 category ID.
    """
    return BANDIT_TO_OWASP.get(rule_id)


def get_owasp_details(category_id: str) -> Optional[Dict[str, Any]]:
    """
    Retrieves the details for a given OWASP Top 10 category.
    """
    return OWASP_MAP.get(category_id)
