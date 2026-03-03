# 🗺️ BreachMap

> **Map the breach before it happens.**
> BreachMap is a structured, expert-led secure code review tool for PHP and Python web applications — identifying vulnerabilities, mapping them to OWASP Top 10 (2021), and delivering developer-ready remediation guidance.

## 🧭 What is BreachMap?

Most security vulnerabilities in web applications aren't introduced by bad intentions — they're introduced by fast delivery cycles, missing context, and the limits of automated tools.

**BreachMap** closes that gap. It combines deep manual source code analysis with targeted static analysis tooling to surface the vulnerabilities that scanners miss: logic flaws, business rule violations, session weaknesses, and authentication bypasses — across both PHP and Python codebases in a single engagement.

Every finding is:
- 📌 Mapped to **OWASP Top 10 (2021)**
- 📊 Scored with **CVSS v3.1**
- 🛠️ Paired with **language-specific fix guidance** and corrected code

---

## ⚡ Quick Start

```bash
# Clone the repository
git clone https://github.com/yourusername/breachmap.git
cd breachmap

# Install Python analysis tools
pip install bandit semgrep

# Install PHP analysis tools
composer require --dev phpstan/phpstan vimeo/psalm

# Run BreachMap scan
bash breachmap.sh --target ./src --output ./reports
```

---

## 🎯 Objectives

- Identify insecure coding practices across PHP and Python codebases
- Detect improper or missing input validation enabling injection and bypass attacks
- Evaluate session management for fixation, hijacking, and entropy weaknesses
- Assess authentication flows for credential storage flaws, brute-force gaps, and token handling issues
- Map every finding to OWASP Top 10 and assign CVSS-based severity ratings
- Deliver a prioritised, actionable remediation roadmap

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      INPUT SURFACE                          │
│   User Input · External APIs · Auth Entry · Config Files   │
└────────────────────────┬────────────────────────────────────┘
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                  BREACHMAP ANALYSIS ENGINE                  │
│  Input Validation · Session & Auth Review · Cryptography   │
└────────────────────────┬────────────────────────────────────┘
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                    STATIC TOOLING                           │
│       Semgrep · Bandit · PHPStan · Manual Review           │
└────────────────────────┬────────────────────────────────────┘
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                    BREACHMAP OUTPUT                         │
│  Vulnerability Report · Remediation Playbook · Exec Summary│
└─────────────────────────────────────────────────────────────┘
```

---

## 🔍 What BreachMap Covers

### 1. Insecure Coding Practices
- Hardcoded credentials and API keys
- Use of deprecated or unsafe functions (`mysql_*`, `pickle`, `eval`)
- Unsafe deserialization of untrusted data
- Violation of the principle of least privilege
- Insecure direct object references (IDOR)

### 2. Input Validation
- SQL Injection (raw queries, ORM misuse)
- Command Injection (`exec`, `shell_exec`, `subprocess`)
- Cross-Site Scripting (reflected, stored, DOM-based)
- Path Traversal and Local File Inclusion
- Unsafe file upload handling
- Template Injection (Twig, Jinja2)

### 3. Session Management
- Session token entropy and predictability
- Session fixation and hijacking vectors
- Missing `HttpOnly`, `Secure`, `SameSite` cookie flags
- CSRF protection gaps
- Improper session invalidation on logout
- Session expiry and timeout enforcement

### 4. Authentication Flaws
- Weak or deprecated password hashing (`MD5`, `SHA1`, unsalted)
- Missing brute-force and account lockout protections
- Account enumeration via timing or error message differences
- Insecure password reset flows
- MFA bypass or absence
- OAuth / JWT implementation weaknesses

---

## 🗺️ OWASP Top 10 Coverage

| ID | Category | Severity |
|---|---|---|
| A01:2021 | Broken Access Control | 🔴 Critical |
| A02:2021 | Cryptographic Failures | 🟠 High |
| A03:2021 | Injection | 🔴 Critical |
| A05:2021 | Security Misconfiguration | 🟠 High |
| A07:2021 | Identification & Authentication Failures | 🔴 Critical |
| A08:2021 | Software & Data Integrity Failures | 🟠 High |
| A09:2021 | Security Logging & Monitoring Failures | 🟡 Medium |

---

## 🛠️ Running the Tools

**Bandit — Python security linter**
```bash
bandit -r ./src -f json -o reports/bandit_report.json
```

**Semgrep — Cross-language SAST**
```bash
semgrep --config=auto ./src --json > reports/semgrep_report.json
```

**PHPStan — PHP static analysis**
```bash
vendor/bin/phpstan analyse src --level=8 --error-format=json > reports/phpstan_report.json
```

---

## 📊 Deliverables

| # | Deliverable | Description | Format |
|---|---|---|---|
| 1 | Vulnerability Report | Full findings with CVSS scores and PoC evidence | PDF / DOCX |
| 2 | OWASP Mapping Matrix | Each issue linked to OWASP Top 10 category | XLSX / PDF |
| 3 | Remediation Playbook | Step-by-step fixes with corrected code snippets | DOCX / MD |
| 4 | Executive Summary | Non-technical risk overview for stakeholders | PDF |
| 5 | Risk Scorecard | Prioritised risk register with CVSS scores | XLSX |

---

## 🔄 BreachMap Methodology

```
Phase 1 — Reconnaissance
  └── Architecture review, data flow mapping, dependency audit

Phase 2 — Analysis
  └── Manual review of security-critical components
  └── Static tooling: Semgrep, Bandit, PHPStan
  └── Business logic and context-sensitive flaw detection

Phase 3 — Reporting
  └── Finding documentation with root cause and PoC
  └── OWASP mapping and CVSS v3.1 scoring
  └── Remediation playbook with corrected code snippets
  └── Immediate escalation of Critical severity findings
```

---

## ⚙️ Prerequisites

Before running BreachMap, ensure the following are in place:

- [ ] Full read access to the source code repository (Git with commit history)
- [ ] Application README or architecture documentation
- [ ] Dependency manifests (`composer.json`, `requirements.txt`)
- [ ] Sanitised configuration file samples
- [ ] Engineering team contact for business logic clarification

---

## 🚨 Severity Scale

| Rating | CVSS Score | Action |
|---|---|---|
| 🔴 Critical | 9.0 – 10.0 | Immediate escalation — fix before next deployment |
| 🟠 High | 7.0 – 8.9 | Priority remediation within current sprint |
| 🟡 Medium | 4.0 – 6.9 | Scheduled fix in next release cycle |
| 🟢 Low | 0.1 – 3.9 | Best effort — address in backlog |
| ⚪ Info | N/A | Advisory only — no immediate action required |

--

---

## 🤝 Contributing

Security rule contributions, tooling improvements, and OWASP mapping enhancements are welcome. Please open an issue before submitting a pull request for significant changes.

---

> ⚠️ **Authorised Use Only** — BreachMap is intended for security assessments conducted with explicit written permission from the application owner. Unauthorised use against systems you do not own is illegal.
