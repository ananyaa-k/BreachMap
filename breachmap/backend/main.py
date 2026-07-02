import uvicorn
from fastapi import FastAPI, Form, HTTPException, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from typing import Dict, Any, List, Optional
from pydantic import BaseModel

# Import modules from local backend packages
from engine import analyze_code, analyze_repo
from ai_analyzer import enhance_findings
from scorer import calculate_cvss
from report import reports, generate_report

# Pydantic request models
class RepoScanRequest(BaseModel):
    github_url: str

app = FastAPI(
    title="BreachMap API",
    description="Static Analysis Orchestrator & AI-Enhanced Security Auditing Backend",
    version="1.0.0"
)

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:8080",
        "http://localhost:5173",
        "http://localhost:3000",
        "http://localhost:8000"
    ],
    allow_origin_regex="https://.*\\.vercel\\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/health")
def health_check() -> Dict[str, str]:
    """
    Returns API status, underlying model, and version info.
    """
    return {
        "status": "ok",
        "model": "llama-3.1-8b-instant",
        "version": "1.0.0"
    }


@app.post("/api/scan/code")
async def scan_raw_code(
    code: str = Form(...),
    language: str = Form(...)
) -> Dict[str, Any]:
    """
    Accepts raw code string + language via Form inputs, runs static scan,
    calls AI enhancement, calculates CVSS, builds and stores report.
    """
    target_name = f"pasted_code.{'py' if language.lower() == 'python' else 'php'}"
    
    try:
        # 1. Run basic static analysis
        raw_findings = analyze_code(code, language, target_name)
        
        # 2. Call AI enhancement layer (which handles missing key/errors internally without crashing)
        enhanced_findings = await enhance_findings(raw_findings, code)
        
        # 3. Calculate CVSS for each finding
        for finding in enhanced_findings:
            calculate_cvss(finding)
            
        # 4. Generate full report dict matching ScanReport
        report = generate_report(enhanced_findings, target_name, "code")
        
        # 5. Store in reports dict
        reports[report["scan_id"]] = report
        return report
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Code scan failed: {str(e)}")


@app.post("/api/scan/repo")
async def scan_repository(request: RepoScanRequest) -> Dict[str, Any]:
    """
    Accepts JSON target github_url, lists and scans all py/php files (up to 50),
    runs AI checks + CVSS calculation, builds and caches report.
    """
    github_url = request.github_url.strip()
    if not github_url:
        raise HTTPException(status_code=400, detail="github_url parameter is required.")

    try:
        # 1. Run analyze_repo (downloads & scans all target repo files)
        raw_findings = analyze_repo(github_url)
        
        # 2. Call AI enhancement (with empty code context since findings hold code lines)
        enhanced_findings = await enhance_findings(raw_findings, "")
        
        # 3. Calculate CVSS for each finding
        for finding in enhanced_findings:
            calculate_cvss(finding)
            
        # 4. Generate report dict matching ScanReport
        report = generate_report(enhanced_findings, github_url, "repo")
        
        # 5. Store in reports dict
        reports[report["scan_id"]] = report
        return report
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Repository scan failed: {str(e)}")


@app.get("/api/report/{scan_id}")
def get_report(scan_id: str) -> Dict[str, Any]:
    """
    Retrieves stored report by scan_id from in-memory dict.
    """
    report = reports.get(scan_id)
    if not report:
        raise HTTPException(status_code=404, detail="Security report not found.")
    return report


if __name__ == "__main__":
    import os
    from dotenv import load_dotenv
    load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), '.env'))
    
    host = os.getenv("HOST", "127.0.0.1")
    port = int(os.getenv("PORT", 8000))
    
    uvicorn.run("main:app", host=host, port=port, reload=True)
