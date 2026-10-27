import traceback
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from routers import upload, generate

app = FastAPI(title="CV Tailor API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(upload.router, prefix="/api")
app.include_router(generate.router, prefix="/api")


@app.exception_handler(Exception)
async def _debug_handler(request: Request, exc: Exception):  # TEMP debug
    return JSONResponse(status_code=500, content={"detail": f"{type(exc).__name__}: {exc}", "tb": traceback.format_exc()[-1500:]})
