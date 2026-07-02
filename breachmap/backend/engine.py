import subprocess
import json
import os
import sys
import tempfile
import re
import uuid
import httpx
from pathlib import Path
from typing import List, Dict, Any, Optional

# Import local backend modules
from rules import OWASP_CATEGORIES, map_rule_to_owasp, get_owasp_details


def analyze_code(code: str, language: str, filename: str = "uploaded_file") -> List[Dict[str, Any]]:
    """
    Analyzes raw code input and aggregates tool findings (Bandit) with pattern matching results.
    
    Returns:
        List of findings.
    """
    findings: List[Dict[str, Any]] = []
    
    # 1. Write code to a temp file
    fd, temp_file_path = tempfile.mkstemp(suffix=".py" if language.lower() == "python" else ".php", text=True)
    try:
        with os.fdopen(fd, "w", encoding="utf-8") as f:
            f.write(code)
            
        # 2. If Python: run bandit via subprocess
        if language.lower() == "python":
            # command: bandit -r <tempfile> -f json -q
            cmd = [sys.executable, "-m", "bandit", "-r", temp_file_path, "-f", "json", "-q"]
            result = subprocess.run(cmd, capture_output=True, text=True, check=False)
            
            if result.returncode == 127 or "No module named" in result.stderr:
                cmd_fallback = ["bandit", "-r", temp_file_path, "-f", "json", "-q"]
                result = subprocess.run(cmd_fallback, capture_output=True, text=True, check=False)
                
            if result.stdout:
                try:
                    data = json.loads(result.stdout)
                    issues = data.get("results", [])
                    for issue in issues:
                        from rules import BANDIT_TO_OWASP, OWASP_MAP
                        bandit_test_id = issue.get("test_id", "")
                        owasp_id = BANDIT_TO_OWASP.get(bandit_test_id, "A05:2021")
                        owasp_entry = OWASP_MAP.get(owasp_id, OWASP_MAP["A05:2021"])
                        
                        findings.append({
                            "id": str(uuid.uuid4()),
                            "owasp_id": owasp_id,
                            "owasp_name": owasp_entry.get("name", "Unknown Category"),
                            "severity": owasp_entry.get("severity", "Medium"),
                            "base_cvss_score": owasp_entry.get("base_cvss_score", 5.0),
                            "line_number": issue.get("line_number", 1),
                            "filename": filename,
                            "code_snippet": issue.get("code", "").strip(),
                            "pattern_matched": bandit_test_id,
                            "color_code": owasp_entry.get("color_code", "yellow"),
                            "priority_action": owasp_entry.get("priority_action", "Scheduled fix in next release cycle")
                        })
                except json.JSONDecodeError:
                    pass
    except Exception:
        pass
    finally:
        # 6. Clean up temp file
        if os.path.exists(temp_file_path):
            try:
                os.unlink(temp_file_path)
            except Exception:
                pass

    # 3. For ALL languages: run pattern matching against all rules in rules.py
    lines = code.splitlines()
    for line_idx, line in enumerate(lines):
        line_num = line_idx + 1
        for owasp_id, category in OWASP_CATEGORIES.items():
            for pattern in category.get("patterns", []):
                try:
                    # Use re.search for each pattern across each line of code
                    if re.search(pattern, line, re.IGNORECASE):
                        findings.append({
                            "id": str(uuid.uuid4()),
                            "owasp_id": owasp_id,
                            "owasp_name": category.get("name"),
                            "severity": category.get("severity"),
                            "base_cvss_score": category.get("base_cvss_score"),
                            "line_number": line_num,
                            "filename": filename,
                            "code_snippet": line.strip(),
                            "pattern_matched": pattern,
                            "color_code": category.get("color_code"),
                            "priority_action": category.get("priority_action")
                        })
                except Exception:
                    # Fallback to simple substring in case of bad regex compilation
                    if pattern.lower() in line.lower():
                        findings.append({
                            "id": str(uuid.uuid4()),
                            "owasp_id": owasp_id,
                            "owasp_name": category.get("name"),
                            "severity": category.get("severity"),
                            "base_cvss_score": category.get("base_cvss_score"),
                            "line_number": line_num,
                            "filename": filename,
                            "code_snippet": line.strip(),
                            "pattern_matched": pattern,
                            "color_code": category.get("color_code"),
                            "priority_action": category.get("priority_action")
                        })

    # 4. Merge bandit findings and pattern findings, deduplicate by line_number + owasp_id
    deduplicated = []
    seen = set()
    for finding in findings:
        key = (finding.get("line_number"), finding.get("owasp_id"))
        if key not in seen:
            seen.add(key)
            deduplicated.append(finding)
            
    return deduplicated


def fetch_github_repo(github_url: str) -> List[Dict[str, Any]]:
    """
    Calls GitHub API to fetch .py and .php files from the repository.
    Limits to a maximum of 50 files.
    """
    url_pattern = r"(?:https?://)?(?:www\.)?github\.com/([^/]+)/([^/]+?)(?:\.git)?(?:/|$)"
    match = re.match(url_pattern, github_url)
    if not match:
        return []
        
    owner, repo = match.groups()
    repo = repo.split('/')[0] # sanitize repo name
    
    headers = {
        "User-Agent": "BreachMap-Scanner",
        "Accept": "application/vnd.github.v3+json"
    }
    github_token = os.getenv("GITHUB_TOKEN")
    if github_token:
        headers["Authorization"] = f"token {github_token}"

    try:
        # Call HEAD recursive Git Tree
        tree_api = f"https://api.github.com/repos/{owner}/{repo}/git/trees/HEAD?recursive=1"
        response = httpx.get(tree_api, headers=headers, timeout=15.0)
        
        if response.status_code != 200:
            return []
            
        tree_data = response.json()
        tree = tree_data.get("tree", [])
        
        files_list = []
        count = 0
        
        for item in tree:
            if item.get("type") == "blob":
                path = item.get("path", "")
                if path.endswith(".py") or path.endswith(".php"):
                    # max 50 files to avoid timeout
                    if count >= 50:
                        break
                    lang = "python" if path.endswith(".py") else "php"
                    
                    # Fetch raw content from raw.githubusercontent.com
                    raw_cdn_url = f"https://raw.githubusercontent.com/{owner}/{repo}/HEAD/{path}"
                    raw_response = httpx.get(raw_cdn_url, headers=headers, timeout=10.0)
                    
                    if raw_response.status_code == 200:
                        files_list.append({
                            "filename": path,
                            "content": raw_response.text,
                            "language": lang
                        })
                        count += 1
                    else:
                        # Fallback to blob API if raw.githubusercontent fails (useful for local github enterprise/etc)
                        blob_response = httpx.get(item.get("url"), headers=headers, timeout=10.0)
                        if blob_response.status_code == 200:
                            import base64
                            blob_data = blob_response.json()
                            b64_content = blob_data.get("content", "")
                            encoding = blob_data.get("encoding", "")
                            if encoding == "base64":
                                try:
                                    content = base64.b64decode(b64_content).decode("utf-8", errors="replace")
                                    files_list.append({
                                        "filename": path,
                                        "content": content,
                                        "language": lang
                                    })
                                    count += 1
                                except Exception:
                                    pass
        return files_list
    except Exception:
        return []


def analyze_repo(github_url: str) -> List[Dict[str, Any]]:
    """
    Calls fetch_github_repo, executes analyze_code for each file,
    flattening and returning all findings with filename attached.
    """
    files = fetch_github_repo(github_url)
    all_findings = []
    
    for f in files:
        filename = f.get("filename", "")
        content = f.get("content", "")
        language = f.get("language", "")
        
        # Calling analyze_code attaches filename in findings list
        file_findings = analyze_code(content, language, filename)
        all_findings.extend(file_findings)
        
    return all_findings
