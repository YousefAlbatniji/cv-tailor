import os
import uuid
import requests
from dotenv import load_dotenv

load_dotenv()

_url = os.getenv("SUPABASE_URL", "").rstrip("/")
_key = os.getenv("SUPABASE_KEY", "")

if not _url or not _key:
    raise RuntimeError("SUPABASE_URL and SUPABASE_KEY must be set in .env")

_HEADERS = {
    "apikey": _key,
    "Authorization": f"Bearer {_key}",
}

ORIGINALS_BUCKET = "cv-originals"
MODIFIED_BUCKET = "cv-modified"


def _storage_path(bucket: str, path: str) -> str:
    return f"{_url}/storage/v1/object/{bucket}/{path}"


def _public_url(bucket: str, path: str) -> str:
    return f"{_url}/storage/v1/object/public/{bucket}/{path}"


def upload_original_cv(file_bytes: bytes, filename: str) -> tuple[str, str]:
    path = f"{uuid.uuid4()}/{filename}"
    headers = {**_HEADERS, "Content-Type": "application/octet-stream", "x-upsert": "true"}
    resp = requests.post(_storage_path(ORIGINALS_BUCKET, path), data=file_bytes, headers=headers)
    resp.raise_for_status()
    return path, _public_url(ORIGINALS_BUCKET, path)


def download_original_cv(cv_path: str) -> bytes:
    resp = requests.get(_storage_path(ORIGINALS_BUCKET, cv_path), headers=_HEADERS)
    resp.raise_for_status()
    return resp.content


def upload_modified_cv(file_bytes: bytes, session_id: str, ext: str = "docx") -> str:
    path = f"{session_id}/modified_cv.{ext}"
    headers = {**_HEADERS, "Content-Type": "application/octet-stream", "x-upsert": "true"}
    resp = requests.post(_storage_path(MODIFIED_BUCKET, path), data=file_bytes, headers=headers)
    resp.raise_for_status()
    return _public_url(MODIFIED_BUCKET, path)


def create_session(
    cv_original_path: str,
    cv_original_url: str,
    cv_text: str,
    paragraphs: list,
    file_type: str,
    file_name: str,
) -> str:
    headers = {**_HEADERS, "Content-Type": "application/json", "Prefer": "return=representation"}
    resp = requests.post(
        f"{_url}/rest/v1/cv_sessions",
        json={
            "cv_original_path": cv_original_path,
            "cv_original_url": cv_original_url,
            "cv_text": cv_text,
            "paragraphs": paragraphs,
            "file_type": file_type,
            "file_name": file_name,
        },
        headers=headers,
    )
    resp.raise_for_status()
    return resp.json()[0]["id"]


def get_session(session_id: str) -> dict | None:
    resp = requests.get(
        f"{_url}/rest/v1/cv_sessions",
        params={"id": f"eq.{session_id}", "limit": "1"},
        headers=_HEADERS,
    )
    resp.raise_for_status()
    data = resp.json()
    return data[0] if data else None


def create_application(
    session_id: str,
    job_description: str,
    cover_letters: dict,
    cv_modified_url: str,
    modification_summary: str,
) -> str:
    headers = {**_HEADERS, "Content-Type": "application/json", "Prefer": "return=representation"}
    resp = requests.post(
        f"{_url}/rest/v1/applications",
        json={
            "session_id": session_id,
            "job_description": job_description,
            "cover_letters": cover_letters,
            "cv_modified_url": cv_modified_url,
            "modification_summary": modification_summary,
        },
        headers=headers,
    )
    resp.raise_for_status()
    return resp.json()[0]["id"]
