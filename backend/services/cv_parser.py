import io
import pdfplumber
from docx import Document


def parse_cv(file_bytes: bytes, file_type: str) -> tuple[str, list[dict]]:
    if file_type == "pdf":
        return _parse_pdf(file_bytes)
    elif file_type == "docx":
        return _parse_docx(file_bytes)
    raise ValueError(f"Unsupported file type: {file_type}")


def _iter_docx_paragraphs(doc):
    """Yield all paragraphs in document order: body first, then table cells."""
    for para in doc.paragraphs:
        yield para
    for table in doc.tables:
        for row in table.rows:
            for cell in row.cells:
                for para in cell.paragraphs:
                    yield para


def _parse_pdf(file_bytes: bytes) -> tuple[str, list[dict]]:
    from services.pdf_editor import extract_units, units_as_paragraphs

    paragraphs = units_as_paragraphs(extract_units(file_bytes))
    full_text = "\n".join(p["text"] for p in paragraphs)
    return full_text, paragraphs


def _parse_docx(file_bytes: bytes) -> tuple[str, list[dict]]:
    doc = Document(io.BytesIO(file_bytes))
    paragraphs = []
    idx = 0
    for para in _iter_docx_paragraphs(doc):
        if para.text.strip():
            paragraphs.append({"index": idx, "text": para.text.strip()})
            idx += 1
    full_text = "\n".join(p["text"] for p in paragraphs)
    return full_text, paragraphs
