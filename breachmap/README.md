# BreachMap

BreachMap is a secure code review and static analysis tool targeting PHP and Python web applications. It leverages local static analysis engines (Bandit, Semgrep) and enhances findings using a Groq AI layer, classifying issues by OWASP Top 10 categories and scoring them using CVSS v3.1.

## Project Structure

```
breachmap/
├── backend/             # FastAPI Backend
│   ├── main.py          # API gateway and routes
│   ├── engine.py        # Static analysis orchestrator
│   ├── ai_analyzer.py   # AI code analyzer (Groq)
│   ├── scorer.py        # CVSS v3.1 calculation
│   ├── report.py        # Report generation (JSON/Markdown)
│   ├── rules.py         # OWASP mapping rules
│   └── requirements.txt
├── frontend/            # React + Vite + TypeScript Frontend
│   ├── src/
│   │   ├── components/  # Reusable UI elements (shadcn/ui, framer-motion)
│   │   ├── pages/       # Application views (Dashboard, Reports, etc.)
│   │   └── main.tsx     # React application entry point
│   ├── package.json
│   ├── vite.config.ts
│   ├── tailwind.config.ts
│   └── .env.example
├── .gitignore
├── render.yaml          # Render deployment blueprint
└── README.md            # This documentation file
```

## Getting Started

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```
3. Install the dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Create a `.env` file from `.env.example` and fill in your `GROQ_API_KEY`:
   ```bash
   cp .env.example .env
   ```
5. Run the FastAPI development server:
   ```bash
   uvicorn main:app --reload
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install npm dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file from `.env.example` and set `VITE_API_URL`:
   ```bash
   cp .env.example .env
   ```
4. Start the Vite development server:
   ```bash
   npm run dev
   ```
