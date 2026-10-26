"""Edit a PDF CV in place: only the paragraphs the AI rewrote are replaced,
everything else (layout, fonts, colours, lines, icons) stays untouched."""
import os
import re
import tempfile
import unicodedata

import pymupdf

_MARKERS = set("▪•●◦■·-–")
_CP1252_OK = re.compile(r"[\x20-\x7e\xa0-\xff–—‘’“”•…]")


def _line_text(line: dict) -> str:
    return "".join(s["text"] for s in line["spans"]).replace("​", "").strip()


def _first_span(line: dict) -> dict | None:
    for s in line["spans"]:
        if s["text"].replace("​", "").strip():
            return s
    return None


def extract_units(pdf_bytes: bytes) -> list[dict]:
    """Split the PDF into editable paragraphs (a bullet + its wrapped lines = one unit)."""
    doc = pymupdf.open(stream=pdf_bytes, filetype="pdf")
    units: list[dict] = []

    for pn, page in enumerate(doc):
        for block in page.get_text("dict")["blocks"]:
            if block["type"] != 0:
                continue
            cur: dict | None = None
            prev_bbox = None

            for line in block["lines"]:
                text = _line_text(line)
                span = _first_span(line)
                if not text or span is None:
                    continue
                bbox = line["bbox"]

                if text in _MARKERS:  # lone bullet marker line: starts a bullet unit, never edited
                    cur = {"page": pn, "bullet": True, "lines": [], "prefix": ""}
                    units.append(cur)
                    prev_bbox = bbox
                    continue

                starts_with_marker = len(text) > 1 and text[0] in _MARKERS and text[1] == " "

                can_continue = False
                if cur is not None and not starts_with_marker:
                    if not cur["lines"]:
                        can_continue = cur["bullet"]
                    else:
                        first = cur["lines"][0]
                        gap = bbox[1] - prev_bbox[3]
                        can_continue = (
                            abs(first["size"] - span["size"]) < 0.1
                            and first["font"] == span["font"]
                            and abs(cur["lines"][-1]["x0"] - bbox[0]) < 2
                            and gap < 0.6 * span["size"]
                        )

                if not can_continue:
                    cur = {"page": pn, "bullet": False, "lines": [], "prefix": ""}
                    units.append(cur)
                    if starts_with_marker:
                        cur["prefix"] = text[0] + " "
                        text = text[2:]

                cur["lines"].append({
                    "text": text, "bbox": bbox, "x0": bbox[0], "size": span["size"],
                    "font": span["font"], "flags": span["flags"], "color": span["color"],
                    "origin_y": span["origin"][1],
                })
                prev_bbox = bbox

    units = [u for u in units if u["lines"]]
    for i, u in enumerate(units):
        u["index"] = i
        u["text"] = " ".join(l["text"] for l in u["lines"])
    return units


def units_as_paragraphs(units: list[dict]) -> list[dict]:
    return [{"index": u["index"], "text": u["text"]} for u in units]


def _pick_font(name: str, flags: int) -> pymupdf.Font:
    n = name.lower()
    bold = "bold" in n or bool(flags & 16)
    italic = "italic" in n or "oblique" in n or bool(flags & 2)
    if "times" in n or "serif" in n and "sans" not in n or "georgia" in n or "garamond" in n:
        code = {(0, 0): "tiro", (1, 0): "tibo", (0, 1): "tiit", (1, 1): "tibi"}[(bold, italic)]
    elif "courier" in n or "mono" in n:
        code = {(0, 0): "cour", (1, 0): "cobo", (0, 1): "coit", (1, 1): "cobi"}[(bold, italic)]
    else:
        code = {(0, 0): "helv", (1, 0): "hebo", (0, 1): "heit", (1, 1): "hebi"}[(bold, italic)]
    return pymupdf.Font(code), code


def _clean(text: str) -> str:
    text = text.replace("‑", "-").replace("‐", "-").replace(" ", " ")
    out = []
    for ch in text:
        if _CP1252_OK.match(ch):
            out.append(ch)
        else:
            ascii_ch = unicodedata.normalize("NFKD", ch).encode("ascii", "ignore").decode()
            out.append(ascii_ch)
    return "".join(out)


def _wrap(text: str, font: pymupdf.Font, size: float, width: float) -> list[str]:
    lines, cur = [], ""
    for word in text.split():
        trial = f"{cur} {word}".strip()
        if font.text_length(trial, fontsize=size) <= width or not cur:
            cur = trial
        else:
            lines.append(cur)
            cur = word
    if cur:
        lines.append(cur)
    return lines


def apply_modifications_pdf(pdf_bytes: bytes, modifications: list[dict]) -> bytes:
    units = extract_units(pdf_bytes)
    mod_map = {int(m["index"]): _clean(str(m["new_text"])).strip() for m in modifications}
    targets = [u for u in units if mod_map.get(u["index"]) and mod_map[u["index"]] != u["text"]]

    doc = pymupdf.open(stream=pdf_bytes, filetype="pdf")

    # Content right edge per page (so single-line paragraphs can use the full width)
    right_edge: dict[int, float] = {}
    for u in units:
        for l in u["lines"]:
            right_edge[u["page"]] = max(right_edge.get(u["page"], 0), l["bbox"][2])

    # 1. erase the old text (no fill, so backgrounds/lines stay)
    for u in targets:
        page = doc[u["page"]]
        for l in u["lines"]:
            r = pymupdf.Rect(l["bbox"])
            r = pymupdf.Rect(r.x0 - 0.5, r.y0 + 0.5, r.x1 + 0.5, r.y1 - 0.5)
            page.add_redact_annot(r, fill=False)
    for pn in {u["page"] for u in targets}:
        kwargs = {"images": getattr(pymupdf, "PDF_REDACT_IMAGE_NONE", 0)}
        if hasattr(pymupdf, "PDF_REDACT_LINE_ART_NONE"):
            kwargs["graphics"] = pymupdf.PDF_REDACT_LINE_ART_NONE
        doc[pn].apply_redactions(**kwargs)

    # 2. write the new text in the same spot, same style
    for u in targets:
        page = doc[u["page"]]
        first, last = u["lines"][0], u["lines"][-1]
        font, code = _pick_font(first["font"], first["flags"])
        color = pymupdf.sRGB_to_pdf(first["color"])

        x0 = min(l["x0"] for l in u["lines"])
        x1 = max(l["bbox"][2] for l in u["lines"])
        edge = right_edge[u["page"]]
        if x1 - x0 > 0.5 * (edge - x0):
            x1 = edge
        width = x1 - x0 - (font.text_length(u["prefix"], fontsize=first["size"]) if u["prefix"] else 0)
        x_text = x0 + (font.text_length(u["prefix"], fontsize=first["size"]) if u["prefix"] else 0)

        n_orig = len(u["lines"])
        pitch = (last["origin_y"] - first["origin_y"]) / (n_orig - 1) if n_orig > 1 else first["size"] * 1.15

        size = first["size"]
        wrapped = _wrap(mod_map[u["index"]], font, size, width)
        while len(wrapped) > n_orig and size > first["size"] * 0.8:
            size -= 0.25
            wrapped = _wrap(mod_map[u["index"]], font, size, width)

        if u["prefix"]:
            page.insert_text((x0, first["origin_y"]), u["prefix"], fontname=code, fontsize=size, color=color)
        for i, text_line in enumerate(wrapped):
            page.insert_text(
                (x_text, first["origin_y"] + i * pitch), text_line,
                fontname=code, fontsize=size, color=color,
            )

    return doc.tobytes(garbage=3, deflate=True)


def pdf_to_docx(pdf_bytes: bytes) -> bytes:
    """Convert the (edited) PDF to an editable Word file, keeping the layout."""
    from pdf2docx import Converter

    with tempfile.TemporaryDirectory() as tmp:
        src, dst = os.path.join(tmp, "cv.pdf"), os.path.join(tmp, "cv.docx")
        with open(src, "wb") as f:
            f.write(pdf_bytes)
        cv = Converter(src)
        try:
            cv.convert(dst)
        finally:
            cv.close()
        with open(dst, "rb") as f:
            return f.read()
