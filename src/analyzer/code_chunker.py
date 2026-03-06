import os
import ast

def detect_language(filepath: str) -> str:
    if filepath.endswith(".php"):
        return "php"
    elif filepath.endswith(".py"):
        return "python"
    return "unknown"

def chunk_python(source: str, filepath: str) -> list:
    chunks = []
    try:
        tree = ast.parse(source)
        for node in ast.walk(tree):
            if isinstance(node, (ast.FunctionDef, ast.AsyncFunctionDef, ast.ClassDef)):
                start = node.lineno - 1
                end = node.end_lineno
                snippet = "\n".join(source.splitlines()[start:end])
                if len(snippet.strip()) > 10:
                    chunks.append({
                        "id": f"{filepath}::{node.name}",
                        "language": "python",
                        "name": node.name,
                        "code": snippet,
                        "filepath": filepath
                    })
    except SyntaxError:
        # fallback: chunk by 50 lines
        chunks = chunk_by_lines(source, filepath, "python")
    
    if not chunks:
        chunks = chunk_by_lines(source, filepath, "python")
    return chunks

def chunk_php(source: str, filepath: str) -> list:
    import re
    chunks = []
    # match functions and methods
    pattern = re.compile(
        r'((?:public|private|protected|static|\s)*function\s+\w+\s*\([^)]*\)\s*\{)',
        re.MULTILINE
    )
    matches = list(pattern.finditer(source))
    lines = source.splitlines()

    for i, match in enumerate(matches):
        start_line = source[:match.start()].count('\n')
        # find end by counting braces
        brace_count = 0
        end_line = start_line
        for j, line in enumerate(lines[start_line:], start=start_line):
            brace_count += line.count('{') - line.count('}')
            if brace_count <= 0 and j > start_line:
                end_line = j + 1
                break
        snippet = "\n".join(lines[start_line:end_line])
        func_name = re.search(r'function\s+(\w+)', match.group()).group(1)
        if len(snippet.strip()) > 10:
            chunks.append({
                "id": f"{filepath}::{func_name}",
                "language": "php",
                "name": func_name,
                "code": snippet,
                "filepath": filepath
            })

    if not chunks:
        chunks = chunk_by_lines(source, filepath, "php")
    return chunks

def chunk_by_lines(source: str, filepath: str, language: str, size: int = 50) -> list:
    lines = source.splitlines()
    chunks = []
    for i in range(0, len(lines), size):
        snippet = "\n".join(lines[i:i+size])
        if len(snippet.strip()) > 10:
            chunks.append({
                "id": f"{filepath}::lines_{i}_{i+size}",
                "language": language,
                "name": f"lines_{i}_{i+size}",
                "code": snippet,
                "filepath": filepath
            })
    return chunks

def chunk_file(filepath: str) -> list:
    language = detect_language(filepath)
    if language == "unknown":
        return []
    with open(filepath, "r", encoding="utf-8", errors="ignore") as f:
        source = f.read()
    if language == "python":
        return chunk_python(source, filepath)
    elif language == "php":
        return chunk_php(source, filepath)

def chunk_directory(target_dir: str) -> list:
    all_chunks = []
    for root, dirs, files in os.walk(target_dir):
        # skip venv and hidden folders
        dirs[:] = [d for d in dirs if d not in ["venv", ".git", "__pycache__", "node_modules"]]
        for file in files:
            if file.endswith((".py", ".php")):
                filepath = os.path.join(root, file)
                chunks = chunk_file(filepath)
                all_chunks.extend(chunks)
                print(f"  chunked {filepath} → {len(chunks)} chunks")
    return all_chunks

if __name__ == "__main__":
    # test on itself
    chunks = chunk_file("src/analyzer/code_chunker.py")
    print(f"\nFound {len(chunks)} chunks:")
    for c in chunks:
        print(f"  → {c['name']} ({len(c['code'].splitlines())} lines)")