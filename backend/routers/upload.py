from fastapi import APIRouter, UploadFile, File, HTTPException
from services.cv_parser import parse_cv
from services import supabase_service

router = APIRouter()

ALLOWED_TYPES = {
    "application/pdf": "pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "docx",
}
MAX_SIZE_BYTES = 10 * 1024 * 1024  # 10 MB


@router.post("/upload")
async def upload_cv(file: UploadFile = File(...)):
    if file.content_type not in ALLOWED_TYPES:
        raise HTTPException(400, "Only PDF and DOCX files are supported")

    file_bytes = await file.read()

    if len(file_bytes) > MAX_SIZE_BYTES:
        raise HTTPException(400, "File exceeds the 10 MB limit")

    file_type = ALLOWED_TYPES[file.content_type]

    try:
        cv_text, paragraphs = parse_cv(file_bytes, file_type)
    except Exception as e:
        raise HTTPException(422, f"Could not parse the file: {e}")

    if not cv_text.strip():
        raise HTTPException(422, "No text could be extracted from the uploaded file")

    cv_path, cv_url = supabase_service.upload_original_cv(file_bytes, file.filename)
    session_id = supabase_service.create_session(
        cv_original_path=cv_path,
        cv_original_url=cv_url,
        cv_text=cv_text,
        paragraphs=paragraphs,
        file_type=file_type,
        file_name=file.filename,
    )

    return {"session_id": session_id, "file_name": file.filename, "file_type": file_type}
