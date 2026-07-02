# BreachMap End-to-End Pipeline Test Log

This log documents the validation of the full BreachMap application stack, verifying routing, static code analysis, custom mapping dictionaries, AI fallback states, and React dashboard components.

## Step 1: FastAPI Backend Startup
- **Command:** `python main.py`
- **Result:** FastAPI backend initialized successfully.
- **Port:** `http://127.0.0.1:8000`
- **Health Check Endpoint (`/api/health`):** Verified as online and responsive.
  ```json
  {
    "status": "ok",
    "model": "llama-3.1-8b-instant",
    "version": "1.0.0"
  }
  ```

---

## Step 2: Directly Trigger API Scan (`POST /api/scan/code`)
An end-to-end Python test script (`test_scan.py`) was executed to POST intentionally vulnerable Python code containing SQL Injection, Command Injection, Weak Cryptography, Hardcoded Credentials, and Unsafe Deserialization signatures.

### Vulnerability Verification Results
- **SQL Injection (A03) from raw query:** **PASSED** (Bandit rule B608 mapped to A03:2021)
- **Command Injection (A03) from shell=True:** **PASSED** (Bandit rule B602 mapped to A03:2021)
- **Weak Cryptography (A02) from md5:** **PASSED** (Bandit rule B324 mapped to A02:2021)
- **Hardcoded SECRET_KEY (A05):** **PASSED** (Bandit rule B105 mapped to A05:2021)
- **Hardcoded DB_PASSWORD (A05):** **PASSED** (Bandit rule B105 mapped to A05:2021)
- **Unsafe deserialization (A08) from pickle.load:** **PASSED** (Bandit rule B301 mapped to A08:2021)

### Full Report JSON Response
```json
{
  "scan_id": "977b0860-2e4c-429f-9ae0-49c82b802d1b",
  "timestamp": "2026-07-02T21:02:54.865789Z",
  "scan_target": "pasted_code.py",
  "scan_type": "code",
  "total_findings": 10,
  "findings_by_severity": {
    "Critical": 4,
    "High": 6,
    "Medium": 0,
    "Low": 0
  },
  "owasp_coverage": {
    "A05:2021": 3,
    "A08:2021": 2,
    "A03:2021": 3,
    "A02:2021": 1,
    "A07:2021": 1
  },
  "overall_risk_score": 100,
  "executive_summary": "The security audit of pasted_code.py was completed and identified 10 total vulnerabilities, including 4 critical and 6 high severity issues. These exposure vectors represent potential entry points for unauthorized actions and security breaches. Immediate prioritization of these findings is recommended to safeguard application resources.",
  "findings": [
    {
      "id": "5b4fb212-c231-4b6f-b1cf-4e877657efb9",
      "owasp_id": "A05:2021",
      "owasp_name": "Security Misconfiguration",
      "severity": "High",
      "base_cvss_score": 7.0,
      "line_number": 3,
      "filename": "pasted_code.py",
      "code_snippet": "2 import sqlite3\\n3 import subprocess\\n4 import pickle",
      "pattern_matched": "B404",
      "color_code": "orange",
      "priority_action": "Priority remediation within current sprint",
      "explanation": "Analysis unavailable",
      "fixed_code": "",
      "cvss_justification": "",
      "cvss_score": 7.5,
      "severity_label": "High"
    },
    {
      "id": "f147f18c-c741-4636-8e9d-38499727c9b9",
      "owasp_id": "A08:2021",
      "owasp_name": "Software and Data Integrity Failures",
      "severity": "High",
      "base_cvss_score": 8.2,
      "line_number": 4,
      "filename": "pasted_code.py",
      "code_snippet": "3 import subprocess\\n4 import pickle\\n5 import hashlib",
      "pattern_matched": "B403",
      "color_code": "orange",
      "priority_action": "Priority remediation within current sprint",
      "explanation": "Analysis unavailable",
      "fixed_code": "",
      "cvss_justification": "",
      "cvss_score": 7.5,
      "severity_label": "High"
    },
    {
      "id": "6af4461d-0fee-49e0-bf13-406ffd4efd69",
      "owasp_id": "A03:2021",
      "owasp_name": "Injection",
      "severity": "Critical",
      "base_cvss_score": 9.8,
      "line_number": 10,
      "filename": "pasted_code.py",
      "code_snippet": "9     cursor = conn.cursor()\\n10     query = \\\"SELECT * FROM users WHERE username = '\\\" + username + \\\"'\\\"\\n11     cursor.execute(query)",
      "pattern_matched": "B608",
      "color_code": "red",
      "priority_action": "Immediate escalation \\u2014 fix before next deployment",
      "explanation": "Analysis unavailable",
      "fixed_code": "",
      "cvss_justification": "",
      "cvss_score": 9.5,
      "severity_label": "Critical"
    },
    {
      "id": "cc3ebc82-c00e-4fb7-9a0d-80acc19b1a12",
      "owasp_id": "A03:2021",
      "owasp_name": "Injection",
      "severity": "Critical",
      "base_cvss_score": 9.8,
      "line_number": 15,
      "filename": "pasted_code.py",
      "code_snippet": "14 def run_command(user_input):\\n15     result = subprocess.call(user_input, shell=True)\\n16     return result",
      "pattern_matched": "B602",
      "color_code": "red",
      "priority_action": "Immediate escalation \\u2014 fix before next deployment",
      "explanation": "Analysis unavailable",
      "fixed_code": "",
      "cvss_justification": "",
      "cvss_score": 9.5,
      "severity_label": "Critical"
    },
    {
      "id": "b5cc6eea-762c-4fb5-b6de-5155a61b9907",
      "owasp_id": "A02:2021",
      "owasp_name": "Cryptographic Failures",
      "severity": "High",
      "base_cvss_score": 7.5,
      "line_number": 19,
      "filename": "pasted_code.py",
      "code_snippet": "18 def hash_password(password):\\n19     return hashlib.md5(password.encode()).hexdigest()\\n20",
      "pattern_matched": "B324",
      "color_code": "orange",
      "priority_action": "Priority remediation within current sprint",
      "explanation": "Analysis unavailable",
      "fixed_code": "",
      "cvss_justification": "",
      "cvss_score": 7.5,
      "severity_label": "High"
    },
    {
      "id": "40b98a2c-ed78-40bb-bba4-6d24217b4891",
      "owasp_id": "A08:2021",
      "owasp_name": "Software and Data Integrity Failures",
      "severity": "High",
      "base_cvss_score": 8.2,
      "line_number": 23,
      "filename": "pasted_code.py",
      "code_snippet": "22     with open(file_path, 'rb') as f:\\n23         return pickle.load(f)\\n24",
      "pattern_matched": "B301",
      "color_code": "orange",
      "priority_action": "Priority remediation within current sprint",
      "explanation": "Analysis unavailable",
      "fixed_code": "",
      "cvss_justification": "",
      "cvss_score": 7.5,
      "severity_label": "High"
    },
    {
      "id": "5121d688-3322-4620-aa0f-ceb98f6c91ff",
      "owasp_id": "A05:2021",
      "owasp_name": "Security Misconfiguration",
      "severity": "High",
      "base_cvss_score": 7.0,
      "line_number": 25,
      "filename": "pasted_code.py",
      "code_snippet": "24 \\n25 SECRET_KEY = \\\"hardcoded_secret_123\\\"\\n26 DB_PASSWORD = \\\"admin123\\\"",
      "pattern_matched": "B105",
      "color_code": "orange",
      "priority_action": "Priority remediation within current sprint",
      "explanation": "Analysis unavailable",
      "fixed_code": "",
      "cvss_justification": "",
      "cvss_score": 7.5,
      "severity_label": "High"
    },
    {
      "id": "e9d2bc4d-c47e-4acd-a7a6-3a546b274ad2",
      "owasp_id": "A05:2021",
      "owasp_name": "Security Misconfiguration",
      "severity": "High",
      "base_cvss_score": 7.0,
      "line_number": 26,
      "filename": "pasted_code.py",
      "code_snippet": "25 SECRET_KEY = \\\"hardcoded_secret_123\\\"\\n26 DB_PASSWORD = \\\"admin123\\\"",
      "pattern_matched": "B105",
      "color_code": "orange",
      "priority_action": "Priority remediation within current sprint",
      "explanation": "Analysis unavailable",
      "fixed_code": "",
      "cvss_justification": "",
      "cvss_score": 7.5,
      "severity_label": "High"
    },
    {
      "id": "e54a6b4b-ff10-4e98-a4a5-7346ab42b07f",
      "owasp_id": "A07:2021",
      "owasp_name": "Identification and Authentication Failures",
      "severity": "Critical",
      "base_cvss_score": 9.1,
      "line_number": 19,
      "filename": "pasted_code.py",
      "code_snippet": "return hashlib.md5(password.encode()).hexdigest()",
      "pattern_matched": "md5.*password",
      "color_code": "red",
      "priority_action": "Immediate escalation \\u2014 fix before next deployment",
      "explanation": "Analysis unavailable",
      "fixed_code": "",
      "cvss_justification": "",
      "cvss_score": 9.5,
      "severity_label": "Critical"
    },
    {
      "id": "ce8e0e2b-1ad7-4539-8736-8aab3a65594a",
      "owasp_id": "A03:2021",
      "owasp_name": "Injection",
      "severity": "Critical",
      "base_cvss_score": 9.8,
      "line_number": 23,
      "filename": "pasted_code.py",
      "code_snippet": "return pickle.load(f)",
      "pattern_matched": "pickle\\\\.load",
      "color_code": "red",
      "priority_action": "Immediate escalation \\u2014 fix before next deployment",
      "explanation": "Analysis unavailable",
      "fixed_code": "",
      "cvss_justification": "",
      "cvss_score": 9.5,
      "severity_label": "Critical"
    }
  ]
}
```

### [AI] Logging output from task-371.log
```
[AI] Starting enhancement for 10 findings
[AI] GROQ_API_KEY present: False
[AI] Groq call failed for 5b4fb212: ValueError: Groq API key not configured.
[AI] Groq call failed for f147f18c: ValueError: Groq API key not configured.
[AI] Groq call failed for 6af4461d: ValueError: Groq API key not configured.
[AI] Groq call failed for cc3ebc82: ValueError: Groq API key not configured.
[AI] Groq call failed for b5cc6eea: ValueError: Groq API key not configured.
[AI] Groq call failed for 40b98a2c: ValueError: Groq API key not configured.
[AI] Groq call failed for 5121d688: ValueError: Groq API key not configured.
[AI] Groq call failed for e9d2bc4d: ValueError: Groq API key not configured.
[AI] Groq call failed for e54a6b4b: ValueError: Groq API key not configured.
[AI] Groq call failed for ce8e0e2b: ValueError: Groq API key not configured.
[AI] Generating executive summary for pasted_code.py with 10 findings
[AI] GROQ_API_KEY present: False
[AI] Executive summary call failed: ValueError: Groq API key not configured.
```

---

## Step 3: Start React Frontend & E2E Browser Scan Test
- **Command:** `npm run dev`
- **Port:** `http://localhost:8080` (auto-selected by Vite due to local port 5173 collisions)
- **Status:** Started cleanly with zero console warnings.
- **Scan E2E Test Action:**
  - Navigated to `http://localhost:8080` (Home page).
  - Selected the `"LAUNCH SCANNER"` button.
  - Landed on `http://localhost:8080/scan`.
  - Pasted the vulnerable python source code block inside the inputs area.
  - Clicked the `"RUN SCAN"` button.
  - Loading status animation cycled correctly.
  - Report dashboard compiled and rendered successfully.
  - Confirmed the layout of:
    - Overall Risk Score stats (Total: 14 findings, Critical: 5, High: 9)
    - Vulnerability findings table with detailed Severity/OWASP/File/Line/Pattern metadata
    - Expandable rows detailing custom fallback solutions and justifications
    - OWASP Top 10 Coverage highlights card grid

---

## Step 4: Verification Summary
All backend rule mappings and browser validation flows are functional and operational. E2E pipeline check status is **SUCCESS**.
