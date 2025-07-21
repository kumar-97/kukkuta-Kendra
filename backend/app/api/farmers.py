from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app.models.user import User
from app.models.farmer import Farmer, Farm
from app.schemas.farmer import FarmerCreate, FarmerUpdate, FarmerResponse, FarmCreate, FarmUpdate, FarmResponse, FarmerWithFarms
from app.auth.dependencies import get_current_active_user, get_current_farmer, get_current_admin

router = APIRouter()


@router.post("/", response_model=FarmerResponse)
def create_farmer(
    farmer_data: FarmerCreate,
    current_admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Create a new farmer profile (Admin only)"""
    # Check if user exists and is a farmer
    user = db.query(User).filter(User.id == farmer_data.user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    if user.role != User.FARMER:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User must have farmer role"
        )
    
    # Check if farmer profile already exists
    existing_farmer = db.query(Farmer).filter(Farmer.user_id == farmer_data.user_id).first()
    if existing_farmer:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Farmer profile already exists"
        )
    
    # Create farmer profile
    db_farmer = Farmer(**farmer_data.dict())
    db.add(db_farmer)
    db.commit()
    db.refresh(db_farmer)
    
    return db_farmer


@router.get("/me", response_model=FarmerWithFarms)
def get_my_farmer_profile(current_farmer: Farmer = Depends(get_current_farmer)):
    """Get current farmer's profile with farms"""
    return current_farmer


@router.put("/me", response_model=FarmerResponse)
def update_my_farmer_profile(
    farmer_data: FarmerUpdate,
    current_farmer: Farmer = Depends(get_current_farmer),
    db: Session = Depends(get_db)
):
    """Update current farmer's profile"""
    for field, value in farmer_data.dict(exclude_unset=True).items():
        setattr(current_farmer, field, value)
    
    db.commit()
    db.refresh(current_farmer)
    
    return current_farmer


@router.get("/", response_model=List[FarmerResponse])
def get_all_farmers(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    current_admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Get all farmers (Admin only)"""
    farmers = db.query(Farmer).offset(skip).limit(limit).all()
    return farmers


@router.get("/{farmer_id}", response_model=FarmerWithFarms)
def get_farmer_by_id(
    farmer_id: int,
    current_admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Get farmer by ID (Admin only)"""
    farmer = db.query(Farmer).filter(Farmer.id == farmer_id).first()
    if not farmer:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Farmer not found"
        )
    
    return farmer


@router.put("/{farmer_id}", response_model=FarmerResponse)
def update_farmer(
    farmer_id: int,
    farmer_data: FarmerUpdate,
    current_admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Update farmer profile (Admin only)"""
    farmer = db.query(Farmer).filter(Farmer.id == farmer_id).first()
    if not farmer:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Farmer not found"
        )
    
    for field, value in farmer_data.dict(exclude_unset=True).items():
        setattr(farmer, field, value)
    
    db.commit()
    db.refresh(farmer)
    
    return farmer


@router.delete("/{farmer_id}")
def delete_farmer(
    farmer_id: int,
    current_admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Delete farmer (Admin only)"""
    farmer = db.query(Farmer).filter(Farmer.id == farmer_id).first()
    if not farmer:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Farmer not found"
        )
    
    db.delete(farmer)
    db.commit()
    
    return {"message": "Farmer deleted successfully"}


# Farm management routes
@router.post("/farms", response_model=FarmResponse)
def create_farm(
    farm_data: FarmCreate,
    current_farmer: Farmer = Depends(get_current_farmer),
    db: Session = Depends(get_db)
):
    """Create a new farm for current farmer"""
    db_farm = Farm(**farm_data.dict())
    db.add(db_farm)
    db.commit()
    db.refresh(db_farm)
    
    return db_farm


@router.get("/farms", response_model=List[FarmResponse])
def get_my_farms(current_farmer: Farmer = Depends(get_current_farmer)):
    """Get all farms for current farmer"""
    return current_farmer.farms


@router.get("/farms/{farm_id}", response_model=FarmResponse)
def get_farm_by_id(
    farm_id: int,
    current_farmer: Farmer = Depends(get_current_farmer),
    db: Session = Depends(get_db)
):
    """Get farm by ID (must belong to current farmer)"""
    farm = db.query(Farm).filter(Farm.id == farm_id, Farm.farmer_id == current_farmer.id).first()
    if not farm:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Farm not found"
        )
    
    return farm


@router.put("/farms/{farm_id}", response_model=FarmResponse)
def update_farm(
    farm_id: int,
    farm_data: FarmUpdate,
    current_farmer: Farmer = Depends(get_current_farmer),
    db: Session = Depends(get_db)
):
    """Update farm (must belong to current farmer)"""
    farm = db.query(Farm).filter(Farm.id == farm_id, Farm.farmer_id == current_farmer.id).first()
    if not farm:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Farm not found"
        )
    
    for field, value in farm_data.dict(exclude_unset=True).items():
        setattr(farm, field, value)
    
    db.commit()
    db.refresh(farm)
    
    return farm


@router.delete("/farms/{farm_id}")
def delete_farm(
    farm_id: int,
    current_farmer: Farmer = Depends(get_current_farmer),
    db: Session = Depends(get_db)
):
    """Delete farm (must belong to current farmer)"""
    farm = db.query(Farm).filter(Farm.id == farm_id, Farm.farmer_id == current_farmer.id).first()
    if not farm:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Farm not found"
        )
    
    db.delete(farm)
    db.commit()
    
    return {"message": "Farm deleted successfully"} 