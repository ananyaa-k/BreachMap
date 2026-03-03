# BreachMap - Secure Code Review — PHP / Python Application
A structured, expert-led security assessment framework for identifying and remediating vulnerabilities in PHP and Python web applications — mapped to OWASP Top 10 (2021) with CVSS v3.1 scoring.

📋 Overview
This project delivers a comprehensive Secure Code Review of dual-language web applications built on PHP and Python. It combines deep manual analysis with targeted static analysis tooling to uncover vulnerabilities that automated scanners routinely miss — including logic flaws, business rule violations, and context-sensitive weaknesses.

Every finding is:
- Mapped to the OWASP Top 10 (2021)
- Scored using CVSS v3.1
- Accompanied by language-specific remediation guidance and corrected code snippets


🎯 Objectives
1. Identify insecure coding practices across PHP and Python codebases
2. Detect improper or missing input validation enabling injection and bypass attacks
3. Evaluate session management for fixation, hijacking, and entropy weaknesses
4. Assess authentication flows for credential storage flaws, brute-force gaps, and token handling issues
5. Map every finding to OWASP Top 10 and assign CVSS-based severity ratings
6. Deliver a prioritised, actionable remediation roadmap


🏗️ Architecture
┌─────────────────────────────────────────────────────────────┐
│                      INPUT SURFACE                          │
│   User Input · External APIs · Auth Entry · Config Files   │
└────────────────────────┬────────────────────────────────────┘
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                    ANALYSIS ENGINE                          │
│  Input Validation · Session & Auth Review · Cryptography   │
└────────────────────────┬────────────────────────────────────┘
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                    STATIC TOOLING                           │
│       Semgrep · Bandit · PHPStan · Manual Review           │
└────────────────────────┬────────────────────────────────────┘
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                    REPORT OUTPUT                            │
│  Vulnerability Report · Remediation Playbook · Exec Summary│
└─────────────────────────────────────────────────────────────┘

🔍 Scope of Review
1. Insecure Coding Practices
Hardcoded credentials and API keys
Use of deprecated or unsafe functions (mysql_*, pickle, eval)
Unsafe deserialization of untrusted data
Violation of the principle of least privilege
Insecure direct object references (IDOR)

2. Input Validation
SQL Injection (raw queries, ORM misuse)
Command Injection (exec, shell_exec, subprocess)
Cross-Site Scripting (reflected, stored, DOM-based)
Path Traversal and Local File Inclusion
Unsafe File Upload handling
Template Injection (Twig, Jinja2)

3. Session Management
Session token entropy and predictability
Session fixation and hijacking vectors
Missing HttpOnly, Secure, SameSite cookie flags
CSRF protection gaps
Improper session invalidation on logout
Session expiry and timeout enforcement

4. Authentication Flaws
Weak or deprecated password hashing (MD5, SHA1, unsalted)
Missing brute-force and account lockout protections
Account enumeration via timing or error message differences
Insecure password reset flows
Multi-factor authentication (MFA) bypass or absence
OAuth / JWT implementation weaknesses



🛠️ Technical Requirements
Languages & Runtimes
- PHP 8.1+
- Python 3.10+

Static Analysis Tools
bash# Python
> pip install bandit semgrep

# PHP
composer require --dev phpstan/phpstan
composer require --dev vimeo/psalm

# Cross-language
pip install semgrep
Running the Tools
Bandit (Python)
bashbandit -r ./src -f json -o bandit_report.json
Semgrep (Multi-language)
bashsemgrep --config=auto ./src --json > semgrep_report.json
PHPStan (PHP)
bashvendor/bin/phpstan analyse src --level=8 --error-format=json > phpstan_report.json

📁 Project Structure
secure-code-review-php-python/
├── 📂 src/                        # Application source code under review
│   ├── php/                       # PHP components
│   └── python/                    # Python components
├── 📂 review/                     # Review artefacts
│   ├── findings/                  # Individual vulnerability write-ups
│   ├── owasp-mapping.md           # OWASP Top 10 findings matrix
│   └── cvss-scores.md             # CVSS v3.1 scoring breakdown
├── 📂 tools/                      # Static analysis configuration
│   ├── semgrep-rules/             # Custom Semgrep rules
│   ├── bandit.yaml                # Bandit configuration
│   └── phpstan.neon               # PHPStan configuration
├── 📂 reports/                    # Final deliverables
│   ├── vulnerability-report.pdf   # Full technical findings
│   ├── remediation-playbook.md    # Fix guidance with code examples
│   └── executive-summary.pdf      # Stakeholder-facing summary
├── 📂 docs/                       # Supporting documentation
│   ├── methodology.md             # Review methodology
│   └── architecture.md            # Application architecture notes
└── README.md

📊 Deliverables
#DeliverableDescriptionFormat1Vulnerability ReportFull findings with CVSS scores and PoCPDF / DOCX2OWASP Mapping MatrixEach issue linked to OWASP categoryXLSX / PDF3Remediation PlaybookStep-by-step fixes with code examplesDOCX / MD4Executive SummaryNon-technical risk overviewPDF5Risk ScorecardPrioritised risk registerXLSX

🔄 Methodology
Phase 1 — Reconnaissance
  └── Architecture review, data flow mapping, dependency audit

Phase 2 — Manual Source Code Analysis
  └── Security-critical component review
  └── Static analysis tooling (Semgrep, Bandit, PHPStan)
  └── Business logic and context-sensitive flaw detection

Phase 3 — Reporting & Remediation
  └── Finding documentation with root cause and PoC
  └── OWASP mapping and CVSS scoring
  └── Remediation guidance with corrected code snippets
  └── Immediate escalation of Critical findings

⚙️ Prerequisites
Before the review begins, ensure the following are in place:

 Full read access to the source code repository (Git with commit history)
 Application README or architecture documentation
 Dependency manifests (composer.json, requirements.txt)
 Sanitised configuration file samples
 Engineering team point of contact for business logic queries


🤝 Contributing
Security findings, rule improvements, and tooling enhancements are welcome. Please open an issue before submitting a pull request for significant changes.


Note: This repository is intended for authorised security assessment use only. All review activities must be conducted with explicit written permission from the application owner.
