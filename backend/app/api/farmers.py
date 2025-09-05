from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Optional
from app.database import get_db
from app.models.user import User, UserRole
from app.models.farmer import Farmer, Farm
from app.schemas.farmer import (
    FarmerCreate, FarmerUpdate, FarmerResponse, FarmCreate, FarmUpdate, FarmResponse, 
    FarmerWithFarms, AdminFarmerCreate, AdminFarmerUpdate, FarmerListResponse
)
from app.auth.dependencies import get_current_active_user, get_current_farmer, get_current_admin
from app.auth.security import get_password_hash

router = APIRouter()


@router.post("/admin/create", response_model=FarmerListResponse)
def admin_create_farmer(
    farmer_data: AdminFarmerCreate,
    current_admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Create a new farmer with user account (Admin only)"""
    # Check if user email already exists
    existing_user = db.query(User).filter(User.email == farmer_data.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    try:
        # Create user account
        hashed_password = get_password_hash(farmer_data.password)
        db_user = User(
            email=farmer_data.email,
            hashed_password=hashed_password,
            full_name=farmer_data.full_name,
            role=UserRole.FARMER,
            is_active=True,
            is_verified=True
        )
        db.add(db_user)
        db.flush()  # Get the user ID
        
        # Create farmer profile
        db_farmer = Farmer(
            user_id=db_user.id,
            phone=farmer_data.phone,
            address=farmer_data.address,
            farm_type=farmer_data.farm_type,
            experience_years=farmer_data.experience_years,
            is_verified=farmer_data.is_verified
        )
        db.add(db_farmer)
        db.commit()
        db.refresh(db_farmer)
        
        # Return comprehensive farmer data
        farmer_response = FarmerListResponse(
            id=db_farmer.id,
            user_id=db_farmer.user_id,
            phone=db_farmer.phone,
            address=db_farmer.address,
            farm_type=db_farmer.farm_type,
            experience_years=db_farmer.experience_years,
            is_verified=db_farmer.is_verified,
            created_at=db_farmer.created_at,
            updated_at=db_farmer.updated_at,
            user_email=db_user.email,
            user_full_name=db_user.full_name,
            user_is_active=db_user.is_active,
            farm_count=0
        )
        
        return farmer_response
        
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create farmer: {str(e)}"
        )


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


@router.get("/", response_model=List[FarmerListResponse])
def get_all_farmers(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    search: Optional[str] = Query(None, description="Search by name, email, or phone"),
    farm_type: Optional[str] = Query(None, description="Filter by farm type"),
    is_verified: Optional[bool] = Query(None, description="Filter by verification status"),
    current_admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Get all farmers with enhanced filtering (Admin only)"""
    query = db.query(
        Farmer,
        User.email.label('user_email'),
        User.full_name.label('user_full_name'),
        User.is_active.label('user_is_active'),
        func.count(Farm.id).label('farm_count')
    ).join(User, Farmer.user_id == User.id).outerjoin(Farm, Farmer.id == Farm.farmer_id)
    
    # Apply filters
    if search:
        search_filter = f"%{search}%"
        query = query.filter(
            User.full_name.ilike(search_filter) | 
            User.email.ilike(search_filter) | 
            Farmer.phone.ilike(search_filter)
        )
    
    if farm_type:
        query = query.filter(Farmer.farm_type.ilike(f"%{farm_type}%"))
    
    if is_verified is not None:
        query = query.filter(Farmer.is_verified == is_verified)
    
    # Group by farmer and user fields
    query = query.group_by(
        Farmer.id, Farmer.user_id, Farmer.phone, Farmer.address, 
        Farmer.farm_type, Farmer.experience_years, Farmer.is_verified,
        Farmer.created_at, Farmer.updated_at,
        User.email, User.full_name, User.is_active
    )
    
    # Apply pagination
    results = query.offset(skip).limit(limit).all()
    
    # Transform results to response format
    farmers = []
    for result in results:
        farmer = result[0]  # Farmer object
        farmer_dict = {
            "id": farmer.id,
            "user_id": farmer.user_id,
            "phone": farmer.phone,
            "address": farmer.address,
            "farm_type": farmer.farm_type,
            "experience_years": farmer.experience_years,
            "is_verified": farmer.is_verified,
            "created_at": farmer.created_at,
            "updated_at": farmer.updated_at,
            "user_email": result.user_email,
            "user_full_name": result.user_full_name,
            "user_is_active": result.user_is_active,
            "farm_count": result.farm_count or 0
        }
        farmers.append(FarmerListResponse(**farmer_dict))
    
    return farmers


@router.get("/{farmer_id}", response_model=FarmerListResponse)
def get_farmer_by_id(
    farmer_id: int,
    current_admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Get farmer by ID with complete details (Admin only)"""
    result = db.query(
        Farmer,
        User.email.label('user_email'),
        User.full_name.label('user_full_name'),
        User.is_active.label('user_is_active'),
        func.count(Farm.id).label('farm_count')
    ).join(User, Farmer.user_id == User.id).outerjoin(Farm, Farmer.id == Farm.farmer_id).filter(
        Farmer.id == farmer_id
    ).group_by(
        Farmer.id, Farmer.user_id, Farmer.phone, Farmer.address, 
        Farmer.farm_type, Farmer.experience_years, Farmer.is_verified,
        Farmer.created_at, Farmer.updated_at,
        User.email, User.full_name, User.is_active
    ).first()
    
    if not result:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Farmer not found"
        )
    
    farmer = result[0]  # Farmer object
    farmer_response = FarmerListResponse(
        id=farmer.id,
        user_id=farmer.user_id,
        phone=farmer.phone,
        address=farmer.address,
        farm_type=farmer.farm_type,
        experience_years=farmer.experience_years,
        is_verified=farmer.is_verified,
        created_at=farmer.created_at,
        updated_at=farmer.updated_at,
        user_email=result.user_email,
        user_full_name=result.user_full_name,
        user_is_active=result.user_is_active,
        farm_count=result.farm_count or 0
    )
    
    return farmer_response


@router.put("/{farmer_id}", response_model=FarmerListResponse)
def update_farmer(
    farmer_id: int,
    farmer_data: AdminFarmerUpdate,
    current_admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Update farmer profile and user data (Admin only)"""
    farmer = db.query(Farmer).filter(Farmer.id == farmer_id).first()
    if not farmer:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Farmer not found"
        )
    
    user = db.query(User).filter(User.id == farmer.user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Associated user not found"
        )
    
    try:
        # Update user fields
        if farmer_data.full_name is not None:
            user.full_name = farmer_data.full_name
        if farmer_data.is_active is not None:
            user.is_active = farmer_data.is_active
        
        # Update farmer fields
        if farmer_data.phone is not None:
            farmer.phone = farmer_data.phone
        if farmer_data.address is not None:
            farmer.address = farmer_data.address
        if farmer_data.farm_type is not None:
            farmer.farm_type = farmer_data.farm_type
        if farmer_data.experience_years is not None:
            farmer.experience_years = farmer_data.experience_years
        if farmer_data.is_verified is not None:
            farmer.is_verified = farmer_data.is_verified
        
        db.commit()
        db.refresh(farmer)
        db.refresh(user)
        
        # Get farm count
        farm_count = db.query(Farm).filter(Farm.farmer_id == farmer.id).count()
        
        # Return comprehensive farmer data
        farmer_response = FarmerListResponse(
            id=farmer.id,
            user_id=farmer.user_id,
            phone=farmer.phone,
            address=farmer.address,
            farm_type=farmer.farm_type,
            experience_years=farmer.experience_years,
            is_verified=farmer.is_verified,
            created_at=farmer.created_at,
            updated_at=farmer.updated_at,
            user_email=user.email,
            user_full_name=user.full_name,
            user_is_active=user.is_active,
            farm_count=farm_count
        )
        
        return farmer_response
        
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update farmer: {str(e)}"
        )


@router.delete("/{farmer_id}")
def delete_farmer(
    farmer_id: int,
    delete_user_account: bool = Query(False, description="Also delete the associated user account"),
    current_admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Delete farmer and optionally the associated user account (Admin only)"""
    farmer = db.query(Farmer).filter(Farmer.id == farmer_id).first()
    if not farmer:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Farmer not found"
        )
    
    try:
        user_id = farmer.user_id
        
        # Delete farmer profile first (due to foreign key constraints)
        db.delete(farmer)
        
        # Optionally delete user account
        if delete_user_account:
            user = db.query(User).filter(User.id == user_id).first()
            if user:
                db.delete(user)
        
        db.commit()
        
        message = "Farmer deleted successfully"
        if delete_user_account:
            message += " along with user account"
        
        return {"message": message, "farmer_id": farmer_id, "user_deleted": delete_user_account}
        
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to delete farmer: {str(e)}"
        )


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


# Additional admin endpoints
@router.get("/admin/count")
def get_farmers_count(
    current_admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Get farmers count and statistics (Admin only)"""
    total_farmers = db.query(Farmer).count()
    verified_farmers = db.query(Farmer).filter(Farmer.is_verified == True).count()
    active_users = db.query(Farmer).join(User).filter(User.is_active == True).count()
    
    # Farm type distribution
    farm_types = db.query(Farmer.farm_type, func.count(Farmer.id)).group_by(Farmer.farm_type).all()
    farm_type_distribution = {farm_type: count for farm_type, count in farm_types}
    
    return {
        "total_farmers": total_farmers,
        "verified_farmers": verified_farmers,
        "unverified_farmers": total_farmers - verified_farmers,
        "active_users": active_users,
        "inactive_users": total_farmers - active_users,
        "verification_rate": (verified_farmers / total_farmers * 100) if total_farmers > 0 else 0,
        "farm_type_distribution": farm_type_distribution
    }


@router.put("/admin/bulk-verify")
def bulk_verify_farmers(
    farmer_ids: List[int],
    is_verified: bool = True,
    current_admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Bulk verify/unverify farmers (Admin only)"""
    if not farmer_ids:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Farmer IDs list cannot be empty"
        )
    
    try:
        # Update verification status for specified farmers
        updated_count = db.query(Farmer).filter(
            Farmer.id.in_(farmer_ids)
        ).update(
            {"is_verified": is_verified},
            synchronize_session=False
        )
        
        db.commit()
        
        action = "verified" if is_verified else "unverified"
        return {
            "message": f"Successfully {action} {updated_count} farmers",
            "updated_count": updated_count,
            "farmer_ids": farmer_ids,
            "is_verified": is_verified
        }
        
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update farmers: {str(e)}"
        )


@router.get("/admin/search")
def search_farmers(
    query: str = Query(..., min_length=2, description="Search query (minimum 2 characters)"),
    limit: int = Query(10, ge=1, le=50, description="Maximum number of results"),
    current_admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Quick search farmers by name, email, or phone (Admin only)"""
    search_filter = f"%{query}%"
    
    results = db.query(
        Farmer.id,
        Farmer.phone,
        User.full_name,
        User.email,
        Farmer.farm_type,
        Farmer.is_verified
    ).join(User, Farmer.user_id == User.id).filter(
        User.full_name.ilike(search_filter) | 
        User.email.ilike(search_filter) | 
        Farmer.phone.ilike(search_filter)
    ).limit(limit).all()
    
    farmers = []
    for result in results:
        farmers.append({
            "id": result.id,
            "full_name": result.full_name,
            "email": result.email,
            "phone": result.phone,
            "farm_type": result.farm_type,
            "is_verified": result.is_verified
        })
    
    return {
        "query": query,
        "results_count": len(farmers),
        "farmers": farmers
    } 