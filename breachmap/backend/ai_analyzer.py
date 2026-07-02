import os
import json
import asyncio
from typing import Dict, Any, List, Optional
from groq import Groq
from dotenv import load_dotenv

# Ensure environment variables are loaded
load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), '.env'))


class AIAnalyzer:
    """
    Kept for backward compatibility.
    """
    pass


async def enhance_findings(findings: List[Dict[str, Any]], code_context: str = "") -> List[Dict[str, Any]]:
    """
    Calls Groq API for each finding to append explanation, fixed_code, 
    and cvss_justification. Implements an asyncio 1-second delay between calls.
    """
    api_key = os.getenv("GROQ_API_KEY")
    client = Groq(api_key=api_key) if api_key else None
    
    print(f"[AI] Starting enhancement for {len(findings)} findings")
    print(f"[AI] GROQ_API_KEY present: {bool(api_key)}")
    
    default_explanation = "Analysis unavailable"
    default_fixed_code = ""
    default_cvss_justification = ""

    for idx, finding in enumerate(findings):
        # Add 1-second delay between calls
        if idx > 0:
            await asyncio.sleep(1.0)
            
        user_msg = f"OWASP: {finding.get('owasp_id')} | Pattern: {finding.get('pattern_matched')} | Code: {finding.get('code_snippet')}"
        
        try:
            if not client:
                raise ValueError("Groq API key not configured.")
                
            response = client.chat.completions.create(
                messages=[
                    {
                        "role": "system",
                        "content": (
                            "You are an expert application security engineer. Given a vulnerability "
                            "finding, respond ONLY with valid JSON (no markdown, no backticks) with these "
                            "exact fields: explanation (string: why this is dangerous in 2 sentences), "
                            "fixed_code (string: corrected version of the vulnerable line), "
                            "cvss_justification (string: one sentence justifying the CVSS score)"
                        )
                    },
                    {
                        "role": "user",
                        "content": user_msg
                    }
                ],
                model="llama-3.1-8b-instant",
                response_format={"type": "json_object"},
                timeout=10.0
            )
            raw_text = response.choices[0].message.content.strip()
            print(f"[AI] Raw response for {finding['id'][:8]}: {raw_text[:100]}")
            
            # Strip markdown fences if present
            if raw_text.startswith("```"):
                raw_text = raw_text.split("```")[1]
                if raw_text.startswith("json"):
                    raw_text = raw_text[4:]
            
            parsed = json.loads(raw_text)
            finding["explanation"] = parsed.get("explanation", default_explanation)
            finding["fixed_code"] = parsed.get("fixed_code", default_fixed_code)
            finding["cvss_justification"] = parsed.get("cvss_justification", default_cvss_justification)
            
        except json.JSONDecodeError as e:
            print(f"[AI] JSON parse error for {finding['id'][:8]}: {e}")
            print(f"[AI] Raw text was: {raw_text}")
            finding["explanation"] = default_explanation
            finding["fixed_code"] = default_fixed_code
            finding["cvss_justification"] = default_cvss_justification
        except Exception as e:
            print(f"[AI] Groq call failed for {finding['id'][:8]}: {type(e).__name__}: {e}")
            finding["explanation"] = default_explanation
            finding["fixed_code"] = default_fixed_code
            finding["cvss_justification"] = default_cvss_justification
            
    return findings


def generate_executive_summary(findings: List[Dict[str, Any]], scan_target: str) -> str:
    """
    Generates a 3-sentence executive risk summary via a single Groq call.
    """
    api_key = os.getenv("GROQ_API_KEY")
    client = Groq(api_key=api_key) if api_key else None
    
    total = len(findings)
    crit = sum(1 for f in findings if f.get('severity') == 'Critical')
    high = sum(1 for f in findings if f.get('severity') == 'High')
    
    print(f"[AI] Generating executive summary for {scan_target} with {total} findings")
    print(f"[AI] GROQ_API_KEY present: {bool(api_key)}")
    
    user_msg = (
        f"Generate a 3-sentence executive summary for a code scan of {scan_target}. "
        f"Findings: {total} total, {crit} Critical, {high} High. "
        f"Be specific and actionable."
    )
    
    fallback_summary = (
        f"The security audit of {scan_target} was completed and identified {total} total vulnerabilities, including "
        f"{crit} critical and {high} high severity issues. These exposure vectors represent potential entry points for "
        f"unauthorized actions and security breaches. Immediate prioritization of these findings is recommended to "
        f"safeguard application resources."
    )
    
    if total == 0:
        fallback_summary = (
            f"The security audit of {scan_target} was successfully completed and identified zero vulnerabilities. "
            f"The analyzed application currently exhibits a resilient security posture. Standard monitoring and "
            f"continuous scanning are advised to maintain this level of system integrity."
        )

    try:
        if not client:
            raise ValueError("Groq API key not configured.")
            
        chat_completion = client.chat.completions.create(
            messages=[
                {
                    "role": "system",
                    "content": "You are a security consultant writing for a technical audience."
                },
                {
                    "role": "user",
                    "content": user_msg
                }
            ],
            model="llama-3.1-8b-instant",
            timeout=10.0
        )
        summary = chat_completion.choices[0].message.content.strip()
        print(f"[AI] Raw executive summary response: {summary[:100]}")
        return summary
    except Exception as e:
        print(f"[AI] Executive summary call failed: {type(e).__name__}: {e}")
        return fallback_summary
