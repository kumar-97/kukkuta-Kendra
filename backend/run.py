#!/usr/bin/env python3
"""
Run script for Kukkuta Kendra Backend API
"""

import uvicorn
from app.config import settings

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=settings.debug,
        log_level="info",
        access_log=True
    ) 