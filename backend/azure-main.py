from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import api_router
from app.database import engine
from app.models import Base
import os
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Try to create tables, but don't fail if database is not available
try:
    Base.metadata.create_all(bind=engine)
    logger.info("Database tables created successfully")
except Exception as e:
    logger.warning(f"Could not create database tables during startup: {e}")
    logger.info("Application will start without database tables. They will be created when first accessed.")

app = FastAPI(
    title="Kukkuta Kendra API",
    version="1.0.0",
    openapi_url="/api/v1/openapi.json"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API router
app.include_router(api_router, prefix="/api/v1")

# Health check endpoint
@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "kukkuta-kendra-api"}

# Root endpoint
@app.get("/")
async def root():
    return {
        "message": "Welcome to Kukkuta Kendra API",
        "version": "1.0.0",
        "docs": "/api/v1/docs"
    }

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port) 