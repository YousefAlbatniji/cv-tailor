from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import shutil
import subprocess
import tempfile
from pathlib import Path
from services import ai_service, cv_modifier, pdf_editor, supabase_service

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

    original_bytes = supabase_service.download_original_cv(session["cv_original_path"])
    paragraphs, cv_text = session["paragraphs"], session["cv_text"]
    if session["file_type"] == "pdf":
        paragraphs = pdf_editor.units_as_paragraphs(pdf_editor.extract_units(original_bytes))
        cv_text = "\n".join(p["text"] for p in paragraphs)

    try:
        ai_result = ai_service.generate_content(
            cv_text=cv_text,
            paragraphs=paragraphs,
            job_description=req.job_description,
        )
    except ValueError as e:
        raise HTTPException(502, f"AI generation failed: {e}")

    modifications = ai_result.get("cv_modifications", [])

    if session["file_type"] == "pdf":
        pdf_bytes = pdf_editor.apply_modifications_pdf(original_bytes, modifications)
        docx_bytes = pdf_editor.pdf_to_docx(pdf_bytes)
    else:
        docx_bytes = cv_modifier.apply_modifications_docx(original_bytes, modifications)
        pdf_bytes = _docx_to_pdf(docx_bytes)

    modified_url = supabase_service.upload_modified_cv(docx_bytes, req.session_id, "docx")
    pdf_url = (
        supabase_service.upload_modified_cv(pdf_bytes, req.session_id, "pdf") if pdf_bytes else None
    )

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
        "cv_pdf_url": pdf_url,
        "modification_summary": ai_result.get("modification_summary", ""),
    }


def _docx_to_pdf(docx_bytes: bytes) -> bytes | None:
    """Needs LibreOffice; returns None when it is not installed."""
    soffice = shutil.which("soffice") or shutil.which("libreoffice")
    if not soffice:
        return None
    with tempfile.TemporaryDirectory() as tmp:
        src = Path(tmp) / "cv.docx"
        src.write_bytes(docx_bytes)
        subprocess.run([soffice, "--headless", "--convert-to", "pdf", "--outdir", tmp, str(src)],
                       check=True, capture_output=True, timeout=90)
        out = Path(tmp) / "cv.pdf"
        return out.read_bytes() if out.exists() else None
