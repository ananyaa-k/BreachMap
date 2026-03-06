import os
from google import genai
from google.genai import types
from pinecone import Pinecone
from dotenv import load_dotenv

load_dotenv()

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
pc = Pinecone(api_key=os.getenv("PINECONE_API_KEY"))
index = pc.Index(os.getenv("PINECONE_INDEX"))

OWASP_PATTERNS = [
    {"id": "A01-idor", "category": "A01:2021 Broken Access Control", "language": "php", "pattern": "Direct object reference without authorization check. User can access other users data by changing ID in URL or request.", "remediation": "Always verify the authenticated user owns the requested resource before returning it."},
    {"id": "A01-priv", "category": "A01:2021 Broken Access Control", "language": "python", "pattern": "Missing role check before privileged action. Any logged-in user can access admin endpoints.", "remediation": "Enforce role-based access control on every sensitive route using decorators or middleware."},
    {"id": "A02-md5", "category": "A02:2021 Cryptographic Failures", "language": "php", "pattern": "Passwords hashed with MD5 or SHA1 without salt. md5($password) or sha1($password).", "remediation": "Use password_hash() in PHP with PASSWORD_BCRYPT or PASSWORD_ARGON2ID."},
    {"id": "A02-hardcode", "category": "A02:2021 Cryptographic Failures", "language": "python", "pattern": "Hardcoded API keys, passwords, or secrets directly in source code.", "remediation": "Store all secrets in environment variables and load via os.getenv() or python-dotenv."},
    {"id": "A03-sqli-php", "category": "A03:2021 Injection", "language": "php", "pattern": "Raw SQL query built with string concatenation using user input. mysqli_query($conn, 'SELECT * FROM users WHERE id=' . $_GET['id'])", "remediation": "Use prepared statements with parameterized queries: $stmt = $pdo->prepare('SELECT * FROM users WHERE id = ?')"},
    {"id": "A03-sqli-py", "category": "A03:2021 Injection", "language": "python", "pattern": "SQL query built with f-string or format() using user input. cursor.execute(f'SELECT * FROM users WHERE id={user_id}')", "remediation": "Use parameterized queries: cursor.execute('SELECT * FROM users WHERE id = %s', (user_id,))"},
    {"id": "A03-cmdi", "category": "A03:2021 Injection", "language": "python", "pattern": "User input passed directly to os.system(), subprocess.call(shell=True), or eval().", "remediation": "Never pass user input to shell commands. Use subprocess with a list of arguments and shell=False."},
    {"id": "A03-xss", "category": "A03:2021 Injection", "language": "php", "pattern": "User input echoed directly into HTML without escaping. echo $_GET['name']", "remediation": "Always escape output with htmlspecialchars($var, ENT_QUOTES, 'UTF-8') before rendering."},
    {"id": "A05-debug", "category": "A05:2021 Security Misconfiguration", "language": "python", "pattern": "DEBUG=True in production Django/Flask app. Full stack traces exposed to users.", "remediation": "Set DEBUG=False in production. Use environment variables to control debug mode."},
    {"id": "A05-errors", "category": "A05:2021 Security Misconfiguration", "language": "php", "pattern": "display_errors=On in production. Detailed error messages reveal file paths and database structure.", "remediation": "Set display_errors=Off and log_errors=On in production php.ini."},
    {"id": "A07-session", "category": "A07:2021 Auth and Session Failures", "language": "php", "pattern": "Session ID not regenerated after login. Allows session fixation attacks.", "remediation": "Call session_regenerate_id(true) immediately after successful authentication."},
    {"id": "A07-bruteforce", "category": "A07:2021 Auth and Session Failures", "language": "python", "pattern": "No rate limiting or account lockout on login endpoint. Allows unlimited password attempts.", "remediation": "Implement rate limiting (e.g. Flask-Limiter) and lock account after N failed attempts."},
    {"id": "A07-jwt", "category": "A07:2021 Auth and Session Failures", "language": "python", "pattern": "JWT token verified without checking algorithm. Allows alg:none attack.", "remediation": "Always specify allowed algorithms explicitly: jwt.decode(token, key, algorithms=['HS256'])"},
    {"id": "A08-pickle", "category": "A08:2021 Software and Data Integrity Failures", "language": "python", "pattern": "Deserializing untrusted data with pickle.loads(). Allows remote code execution.", "remediation": "Never deserialize untrusted data with pickle. Use JSON or other safe formats instead."},
    {"id": "A09-logging", "category": "A09:2021 Security Logging and Monitoring Failures", "language": "python", "pattern": "No logging of authentication events, failed logins, or access control failures.", "remediation": "Log all auth events with timestamp, user ID, IP address. Use Python logging module with a secure handler."},
]

def embed(text: str) -> list:
    result = client.models.embed_content(
        model="gemini-embedding-001",
        contents=text,
        config=types.EmbedContentConfig(output_dimensionality=1024)
    )
    return result.embeddings[0].values

def seed():
    print(f"Seeding {len(OWASP_PATTERNS)} OWASP patterns into Pinecone...")
    vectors = []
    for item in OWASP_PATTERNS:
        text = f"{item['category']} | {item['pattern']} | {item['remediation']}"
        embedding = embed(text)
        vectors.append({
            "id": item["id"],
            "values": embedding,
            "metadata": {
                "category": item["category"],
                "language": item["language"],
                "pattern": item["pattern"],
                "remediation": item["remediation"]
            }
        })
        print(f"  ✓ {item['id']}")

    index.upsert(vectors=vectors)
    print(f"\n✅ Done! {len(vectors)} patterns seeded into Pinecone.")

if __name__ == "__main__":
    seed()