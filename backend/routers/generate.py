from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from services import ai_service, cv_modifier, supabase_service

router = APIRouter()


class GenerateRequest(BaseModel):
    session_id: str
    job_description: str


@router.post("/generate")
def generate(req: GenerateRequest):
    if not req.job_description.strip():
        raise HTTPException(400, "Job description cannot be empty")

    session = supabase_service.get_session(req.session_id)
    if not session:
        raise HTTPException(404, "Session not found — please re-upload your CV")

    try:
        ai_result = ai_service.generate_content(
            cv_text=session["cv_text"],
            paragraphs=session["paragraphs"],
            job_description=req.job_description,
        )
    except ValueError as e:
        raise HTTPException(502, f"AI generation failed: {e}")

    modifications = ai_result.get("cv_modifications", [])

    if session["file_type"] == "docx":
        original_bytes = supabase_service.download_original_cv(session["cv_original_path"])
        modified_bytes = cv_modifier.apply_modifications_docx(original_bytes, modifications)
    else:
        modified_bytes = cv_modifier.build_docx_from_text(
            paragraphs=session["paragraphs"],
            modifications=modifications,
        )

    modified_url = supabase_service.upload_modified_cv(modified_bytes, req.session_id)

    application_id = supabase_service.create_application(
        session_id=req.session_id,
        job_description=req.job_description,
        cover_letters=ai_result["cover_letters"],
        cv_modified_url=modified_url,
        modification_summary=ai_result.get("modification_summary", ""),
    )

    return {
        "application_id": application_id,
        "cover_letters": ai_result["cover_letters"],
        "cv_modified_url": modified_url,
        "modification_summary": ai_result.get("modification_summary", ""),
    }
