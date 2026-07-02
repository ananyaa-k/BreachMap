import httpx
import json
import sys

vulnerable_code = """
import sqlite3
import subprocess
import pickle
import hashlib

def get_user(username):
    conn = sqlite3.connect('users.db')
    cursor = conn.cursor()
    query = "SELECT * FROM users WHERE username = '" + username + "'"
    cursor.execute(query)
    return cursor.fetchone()

def run_command(user_input):
    result = subprocess.call(user_input, shell=True)
    return result

def hash_password(password):
    return hashlib.md5(password.encode()).hexdigest()

def load_data(file_path):
    with open(file_path, 'rb') as f:
        return pickle.load(f)

SECRET_KEY = "hardcoded_secret_123"
DB_PASSWORD = "admin123"
"""

def run_test():
    url = "http://127.0.0.1:8000/api/scan/code"
    data = {
        "code": vulnerable_code,
        "language": "python"
    }
    
    print("Sending POST request to FastAPI backend...")
    try:
        response = httpx.post(url, data=data, timeout=30.0)
        if response.status_code != 200:
            print(f"Error: status code {response.status_code}")
            print(response.text)
            sys.exit(1)
            
        report = response.json()
        print("\n=== SCAN REPORT JSON RESPONSE ===")
        print(json.dumps(report, indent=2))
        print("=================================\n")
        
        # Verify findings
        findings = report.get("findings", [])
        print(f"Total findings found: {len(findings)}")
        
        print("\nVerifying requested vulnerability targets:")
        all_passed = True
        
        # SQL Injection (A03)
        sql_inj = any(f.get("owasp_id") == "A03:2021" and f.get("pattern_matched") in ["B608", "execute\\(.*\\+"] for f in findings)
        print(f"- SQL Injection (A03) from raw query: {'PASSED' if sql_inj else 'FAILED'}")
        if not sql_inj: all_passed = False
        
        # Command Injection (A03)
        cmd_inj = any(f.get("owasp_id") == "A03:2021" and f.get("pattern_matched") in ["B602", "subprocess\\.call.*shell=True"] for f in findings)
        print(f"- Command Injection (A03) from shell=True: {'PASSED' if cmd_inj else 'FAILED'}")
        if not cmd_inj: all_passed = False
        
        # Weak Cryptography (A02)
        weak_crypto = any(f.get("owasp_id") == "A02:2021" and f.get("pattern_matched") in ["B324", "md5\\(", "hashlib\\.md5"] for f in findings)
        print(f"- Weak Cryptography (A02) from md5: {'PASSED' if weak_crypto else 'FAILED'}")
        if not weak_crypto: all_passed = False
        
        # Hardcoded Credentials (A05)
        hardcoded_sec = any(f.get("owasp_id") == "A05:2021" and f.get("line_number") == 25 and f.get("pattern_matched") in ["B105", "SECRET_KEY\\s*=\\s*['\\\"]"] for f in findings)
        hardcoded_pass = any(f.get("owasp_id") == "A05:2021" and f.get("line_number") == 26 and f.get("pattern_matched") in ["B105", "password\\s*=\\s*['\\\"]"] for f in findings)
        print(f"- Hardcoded SECRET_KEY (A05): {'PASSED' if hardcoded_sec else 'FAILED'}")
        print(f"- Hardcoded DB_PASSWORD (A05): {'PASSED' if hardcoded_pass else 'FAILED'}")
        if not (hardcoded_sec and hardcoded_pass): all_passed = False
        
        # Unsafe Deserialization (A08)
        unsafe_deser = any(f.get("owasp_id") == "A08:2021" and f.get("pattern_matched") in ["B301", "pickle\\.loads", "yaml\\.load\\(", "deserializ"] for f in findings)
        print(f"- Unsafe deserialization (A08) from pickle.load: {'PASSED' if unsafe_deser else 'FAILED'}")
        if not unsafe_deser: all_passed = False
        
        if all_passed:
            print("\nSUCCESS: All required vulnerability patterns identified correctly!")
            sys.exit(0)
        else:
            print("\nFAILURE: Some vulnerability patterns were missed.")
            sys.exit(1)
            
    except Exception as e:
        print(f"Failed to connect to backend: {e}")
        sys.exit(1)

if __name__ == "__main__":
    run_test()
