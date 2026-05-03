import json
import os
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

_client = Groq(api_key=os.getenv("GROQ_API_KEY"))


def generate_content(cv_text: str, paragraphs: list[dict], job_description: str) -> dict:
    numbered_cv = "\n".join(f"[{p['index']}] {p['text']}" for p in paragraphs[:80])

    prompt = f"""You are an expert career coach and professional resume writer.

CV Content (each line has an index in brackets):
{numbered_cv}

Job Description:
{job_description}

Extract the candidate's full name, phone number, email, and location from the CV above.

Return ONLY valid JSON in this exact structure:
{{
  "cover_letters": {{
    "professional": "<full cover letter — see format below>",
    "creative": "<full cover letter — see format below>",
    "concise": "<full cover letter — see format below>"
  }},
  "cv_modifications": [
    {{"index": <line_index_integer>, "new_text": "<rewritten line>"}}
  ],
  "modification_summary": "1-2 sentence explanation of what was changed and why"
}}

Each cover letter MUST follow this exact format:
[Candidate Full Name]
[Phone] | [Email] | [City, Country]

[Today's date]

Dear Hiring Manager,

[Body paragraphs tailored to the job description]

Sincerely,
[Candidate Full Name]
[Phone] | [Email]

Cover letter style rules:
- professional: formal tone, 4 structured paragraphs, traditional business language
- creative: conversational and storytelling tone with personality, 4 paragraphs
- concise: direct and impactful, 3 short paragraphs, under 220 words in the body

Cover letter content rules:
- Use ONLY the candidate's real experience from the CV — never invent anything
- Reference the specific company and role from the job description
- Each template must feel distinctly different in tone

Rules for cv_modifications:
- ONLY modify: summary/objective paragraphs and experience bullet points
- DO NOT modify: name, contact info, section headings, company names, job titles, or dates
- Keep the exact same number of bullet points per job — never add or remove
- Weave in keywords from the job description naturally
- If the CV already matches well, return an empty array"""

    response = _client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": prompt}],
        response_format={"type": "json_object"},
        temperature=0.7,
    )

    try:
        result = json.loads(response.choices[0].message.content)
    except json.JSONDecodeError as e:
        raise ValueError(f"Groq returned invalid JSON: {e}")

    if "cover_letters" not in result:
        raise ValueError("Unexpected response structure from Groq")

    return result
