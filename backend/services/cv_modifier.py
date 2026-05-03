import io
from docx import Document


def _iter_docx_paragraphs(doc):
    """Yield all paragraphs in document order: body first, then table cells."""
    for para in doc.paragraphs:
        yield para
    for table in doc.tables:
        for row in table.rows:
            for cell in row.cells:
                for para in cell.paragraphs:
                    yield para


def apply_modifications_docx(file_bytes: bytes, modifications: list[dict]) -> bytes:
    """Modify a DOCX in-place — works for body paragraphs and table cell paragraphs."""
    doc = Document(io.BytesIO(file_bytes))
    mod_map = {int(m["index"]): m["new_text"] for m in modifications}

    idx = 0
    for para in _iter_docx_paragraphs(doc):
        if para.text.strip():
            if idx in mod_map:
                _replace_paragraph_text(para, mod_map[idx])
            idx += 1

    output = io.BytesIO()
    doc.save(output)
    return output.getvalue()


def build_docx_from_text(paragraphs: list[dict], modifications: list[dict]) -> bytes:
    """For PDF uploads: build a clean DOCX with the modified content."""
    mod_map = {int(m["index"]): m["new_text"] for m in modifications}
    doc = Document()

    style = doc.styles["Normal"]
    style.font.name = "Calibri"

    _HEADINGS = {
        "EXPERIENCE", "EDUCATION", "SKILLS", "SUMMARY", "OBJECTIVE",
        "PROJECTS", "CERTIFICATIONS", "AWARDS", "PUBLICATIONS", "REFERENCES",
        "WORK EXPERIENCE", "PROFESSIONAL EXPERIENCE", "PROFESSIONAL AND PROJECT EXPERIENCE",
        "EXTRACURRICULAR ACTIVITIES & INTERESTS",
    }

    for p in paragraphs:
        text = mod_map.get(p["index"], p["text"])
        if not text.strip():
            continue
        para = doc.add_paragraph()
        run = para.add_run(text)
        if text.upper().strip(":") in _HEADINGS or p["index"] < 3:
            run.bold = True

    output = io.BytesIO()
    doc.save(output)
    return output.getvalue()


def _replace_paragraph_text(para, new_text: str) -> None:
    if not para.runs:
        return
    para.runs[0].text = new_text
    for run in para.runs[1:]:
        run.text = ""
