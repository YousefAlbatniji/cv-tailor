from fastapi import FastAPI
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
