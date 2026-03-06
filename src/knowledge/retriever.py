import os
from google import genai
from google.genai import types
from pinecone import Pinecone
from dotenv import load_dotenv

load_dotenv()

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
pc = Pinecone(api_key=os.getenv("PINECONE_API_KEY"))
index = pc.Index(os.getenv("PINECONE_INDEX"))

def embed(text: str) -> list:
    result = client.models.embed_content(
        model="gemini-embedding-001",
        contents=text,
        config=types.EmbedContentConfig(output_dimensionality=1024)
    )
    return result.embeddings[0].values

def retrieve_owasp_context(code_chunk: str) -> list:
    embedding = embed(code_chunk)
    results = index.query(vector=embedding, top_k=3, include_metadata=True)
    context = []
    for match in results.matches:
        context.append({
            "score": round(match.score, 3),
            "category": match.metadata["category"],
            "pattern": match.metadata["pattern"],
            "remediation": match.metadata["remediation"]
        })
    return context

if __name__ == "__main__":
    # Quick test
    test_code = "cursor.execute(f'SELECT * FROM users WHERE id={user_id}')"
    results = retrieve_owasp_context(test_code)
    print("Top OWASP matches for test code:")
    for r in results:
        print(f"\n  [{r['score']}] {r['category']}")
        print(f"  Pattern: {r['pattern'][:80]}...")