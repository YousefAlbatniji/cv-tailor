# CV Tailor

An AI-powered tool that tailors your CV and generates cover letters based on any job description — in seconds.

Upload your CV, paste the job description, and get:
- A **modified CV** with the same exact layout and template, with content rewritten to match the role
- **3 cover letter styles** (Professional, Creative, Concise) with your real info auto-filled

Built with React, FastAPI, Groq AI (LLaMA 3.3 70B), and Supabase.

---

## Screenshots

### Home — Upload & Generate
![Home Page](docs/screenshots/home.png)

### Results — Cover Letters
![Cover Letters](docs/screenshots/cover-letters.png)

### Results — Modified CV Download
![Modified CV](docs/screenshots/modified-cv.png)

---

## Features

- **CV Upload** — supports PDF and DOCX (DOCX recommended for layout preservation)
- **AI Cover Letters** — 3 distinct templates generated in one click
  - Professional — formal, structured, traditional business tone
  - Creative — conversational, storytelling, shows personality
  - Concise — 3 short punchy paragraphs, under 220 words
- **Smart CV Modification** — rewrites only bullet points and summary to match the job, keeps your exact layout, fonts, and formatting untouched
- **One-click Copy** — copy any cover letter to clipboard instantly
- **Download** — get your modified CV as a DOCX file

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, TypeScript, Tailwind CSS, Vite |
| Backend | Python, FastAPI |
| AI | Groq API — LLaMA 3.3 70B Versatile |
| Storage & DB | Supabase (Storage + PostgreSQL) |
| CV Parsing | pdfplumber, python-docx |

---

## Project Structure

```
cv-tailor/
├── backend/
│   ├── main.py                  # FastAPI app entry point
│   ├── requirements.txt
│   ├── .env.example             # Environment variables template
│   ├── routers/
│   │   ├── upload.py            # POST /api/upload
│   │   └── generate.py          # POST /api/generate
│   └── services/
│       ├── cv_parser.py         # PDF & DOCX text extraction
│       ├── ai_service.py        # Groq AI integration
│       ├── cv_modifier.py       # In-place DOCX modification
│       └── supabase_service.py  # Storage & database calls
├── frontend/
│   └── src/
│       ├── pages/
│       │   ├── Home.tsx         # Upload form
│       │   └── Results.tsx      # Cover letters + CV download
│       ├── components/
│       │   ├── FileUpload.tsx   # Drag & drop upload zone
│       │   └── CoverLetterTabs.tsx  # Template switcher
│       ├── services/
│       │   └── api.ts           # API calls
│       └── types/index.ts
├── supabase/
│   └── schema.sql               # Database schema
├── .gitignore
├── LICENSE
└── README.md
```

---

## Getting Started

### Prerequisites

- Python 3.11+
- Node.js 18+
- A [Supabase](https://supabase.com) project
- A [Groq](https://console.groq.com) API key (free)

### 1. Supabase Setup

Run [`supabase/schema.sql`](supabase/schema.sql) in your Supabase SQL editor, then create two public storage buckets:
- `cv-originals`
- `cv-modified`

### 2. Backend

```bash
cd backend
cp .env.example .env
# Fill in your keys in .env
pip install -r requirements.txt
uvicorn main:app --reload
```

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

---

## Environment Variables

Create `backend/.env` from `.env.example`:

```env
GROQ_API_KEY=your_groq_api_key
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your_supabase_service_role_key
```

---

## How It Works

1. **Upload** — your CV is parsed (text + paragraph structure extracted) and stored in Supabase
2. **Generate** — Groq's LLaMA 3.3 70B reads your CV and job description, returns 3 cover letters + targeted CV modifications as structured JSON
3. **Modify** — for DOCX uploads, text is replaced in-place paragraph by paragraph (including table cells for multi-column layouts), so formatting is never touched
4. **Download** — the modified DOCX is stored in Supabase and returned for download

---

## License

MIT License — see [LICENSE](LICENSE) for details.

Copyright (c) 2026 [Yousef Albatniji](https://github.com/yousef7577)
