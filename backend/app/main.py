from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings

from app.api.transactions import router as transactions_router
from app.api.recovery import router as recovery_router
from app.api.telemetry import router as telemetry_router
from app.api.analytics import router as analytics_router
from app.api.demo import router as demo_router
from app.api.razorpay_live import router as razorpay_router
from app.api.ws import router as ws_router

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Resilio — Autonomous Payment Recovery Intelligence Layer for Razorpay Hackathon"
)

# Enable CORS for Vite frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register Routers under /api/v1
app.include_router(transactions_router, prefix=settings.API_V1_STR)
app.include_router(recovery_router, prefix=settings.API_V1_STR)
app.include_router(telemetry_router, prefix=settings.API_V1_STR)
app.include_router(analytics_router, prefix=settings.API_V1_STR)
app.include_router(demo_router, prefix=settings.API_V1_STR)
app.include_router(razorpay_router, prefix=settings.API_V1_STR)
app.include_router(ws_router)

@app.get("/api/v1/health", tags=["Health"])
def health_check():
    return {
        "status": "HEALTHY",
        "system": "RESILIO Autonomous Recovery Engine",
        "version": settings.VERSION,
        "mode": "SIMULATION MODE — NO REAL MONEY MOVEMENT"
    }

@app.get("/", tags=["Root"])
def root():
    return {
        "message": "Welcome to RESILIO — Autonomous Payment Recovery Intelligence Layer",
        "docs": "/docs",
        "health": "/api/v1/health"
    }
