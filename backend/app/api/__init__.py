from fastapi import APIRouter
from .auth import router as auth_router
from .farmers import router as farmers_router
from .mills import router as mills_router
from .routine import router as routine_router
from .production import router as production_router
from .admin import router as admin_router

# Create main API router
api_router = APIRouter()

# Include all route modules
api_router.include_router(auth_router, prefix="/auth", tags=["Authentication"])
api_router.include_router(farmers_router, prefix="/farmers", tags=["Farmers"])
api_router.include_router(mills_router, prefix="/mills", tags=["Mills"])
api_router.include_router(routine_router, prefix="/routine", tags=["Routine Data"])
api_router.include_router(production_router, prefix="/production", tags=["Production Reports"])
api_router.include_router(admin_router, prefix="/admin", tags=["Admin"]) 