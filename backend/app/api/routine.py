from fastapi import APIRouter, Depends, HTTPException, status, Query, UploadFile, File
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime, date
from app.database import get_db
from app.models.farmer import Farmer, Farm
from app.models.routine import RoutineData, MortalityRecord
from app.schemas.routine import RoutineDataCreate, RoutineDataUpdate, RoutineDataResponse, MortalityRecordCreate, MortalityRecordResponse, RoutineDataWithMortality
from app.auth.dependencies import get_current_farmer
import uuid
import os

router = APIRouter()


@router.post("/", response_model=RoutineDataResponse)
def create_routine_data(
    routine_data: RoutineDataCreate,
    current_farmer: Farmer = Depends(get_current_farmer),
    db: Session = Depends(get_db)
):
    """Create new routine data for current farmer"""
    # Verify the farm belongs to the farmer
    farm = db.query(Farm).filter(
        Farm.id == routine_data.farm_id,
        Farm.farmer_id == current_farmer.id
    ).first()
    
    if not farm:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Farm not found or does not belong to you"
        )
    
    # Check if routine data already exists for this date and farm
    existing_routine = db.query(RoutineData).filter(
        RoutineData.farm_id == routine_data.farm_id,
        RoutineData.date == routine_data.date
    ).first()
    
    if existing_routine:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Routine data already exists for this date and farm"
        )
    
    # Create routine data
    db_routine = RoutineData(**routine_data.dict())
    db.add(db_routine)
    db.commit()
    db.refresh(db_routine)
    
    return db_routine


@router.get("/", response_model=List[RoutineDataResponse])
def get_my_routine_data(
    farm_id: Optional[int] = Query(None),
    start_date: Optional[date] = Query(None),
    end_date: Optional[date] = Query(None),
    current_farmer: Farmer = Depends(get_current_farmer),
    db: Session = Depends(get_db)
):
    """Get routine data for current farmer with optional filters"""
    query = db.query(RoutineData).filter(RoutineData.farmer_id == current_farmer.id)
    
    if farm_id:
        query = query.filter(RoutineData.farm_id == farm_id)
    
    if start_date:
        query = query.filter(RoutineData.date >= start_date)
    
    if end_date:
        query = query.filter(RoutineData.date <= end_date)
    
    routine_data = query.order_by(RoutineData.date.desc()).all()
    return routine_data


@router.get("/{routine_id}", response_model=RoutineDataWithMortality)
def get_routine_data_by_id(
    routine_id: int,
    current_farmer: Farmer = Depends(get_current_farmer),
    db: Session = Depends(get_db)
):
    """Get routine data by ID (must belong to current farmer)"""
    routine_data = db.query(RoutineData).filter(
        RoutineData.id == routine_id,
        RoutineData.farmer_id == current_farmer.id
    ).first()
    
    if not routine_data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Routine data not found"
        )
    
    return routine_data


@router.put("/{routine_id}", response_model=RoutineDataResponse)
def update_routine_data(
    routine_id: int,
    routine_data: RoutineDataUpdate,
    current_farmer: Farmer = Depends(get_current_farmer),
    db: Session = Depends(get_db)
):
    """Update routine data (must belong to current farmer)"""
    db_routine = db.query(RoutineData).filter(
        RoutineData.id == routine_id,
        RoutineData.farmer_id == current_farmer.id
    ).first()
    
    if not db_routine:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Routine data not found"
        )
    
    for field, value in routine_data.dict(exclude_unset=True).items():
        setattr(db_routine, field, value)
    
    db.commit()
    db.refresh(db_routine)
    
    return db_routine


@router.delete("/{routine_id}")
def delete_routine_data(
    routine_id: int,
    current_farmer: Farmer = Depends(get_current_farmer),
    db: Session = Depends(get_db)
):
    """Delete routine data (must belong to current farmer)"""
    routine_data = db.query(RoutineData).filter(
        RoutineData.id == routine_id,
        RoutineData.farmer_id == current_farmer.id
    ).first()
    
    if not routine_data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Routine data not found"
        )
    
    db.delete(routine_data)
    db.commit()
    
    return {"message": "Routine data deleted successfully"}


# Mortality record routes
@router.post("/mortality", response_model=MortalityRecordResponse)
def create_mortality_record(
    mortality_data: MortalityRecordCreate,
    current_farmer: Farmer = Depends(get_current_farmer),
    db: Session = Depends(get_db)
):
    """Create new mortality record"""
    # Verify the routine data belongs to the farmer
    routine_data = db.query(RoutineData).filter(
        RoutineData.id == mortality_data.routine_data_id,
        RoutineData.farmer_id == current_farmer.id
    ).first()
    
    if not routine_data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Routine data not found"
        )
    
    # Create mortality record
    db_mortality = MortalityRecord(**mortality_data.dict())
    db.add(db_mortality)
    db.commit()
    db.refresh(db_mortality)
    
    return db_mortality


@router.get("/mortality", response_model=List[MortalityRecordResponse])
def get_mortality_records(
    routine_data_id: Optional[int] = Query(None),
    current_farmer: Farmer = Depends(get_current_farmer),
    db: Session = Depends(get_db)
):
    """Get mortality records for current farmer"""
    query = db.query(MortalityRecord).filter(MortalityRecord.farmer_id == current_farmer.id)
    
    if routine_data_id:
        query = query.filter(MortalityRecord.routine_data_id == routine_data_id)
    
    mortality_records = query.order_by(MortalityRecord.created_at.desc()).all()
    return mortality_records


@router.put("/mortality/{mortality_id}", response_model=MortalityRecordResponse)
def update_mortality_record(
    mortality_id: int,
    mortality_data: MortalityRecordCreate,
    current_farmer: Farmer = Depends(get_current_farmer),
    db: Session = Depends(get_db)
):
    """Update mortality record (must belong to current farmer)"""
    db_mortality = db.query(MortalityRecord).filter(
        MortalityRecord.id == mortality_id,
        MortalityRecord.farmer_id == current_farmer.id
    ).first()
    
    if not db_mortality:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Mortality record not found"
        )
    
    for field, value in mortality_data.dict(exclude_unset=True).items():
        setattr(db_mortality, field, value)
    
    db.commit()
    db.refresh(db_mortality)
    
    return db_mortality


@router.delete("/mortality/{mortality_id}")
def delete_mortality_record(
    mortality_id: int,
    current_farmer: Farmer = Depends(get_current_farmer),
    db: Session = Depends(get_db)
):
    """Delete mortality record (must belong to current farmer)"""
    mortality_record = db.query(MortalityRecord).filter(
        MortalityRecord.id == mortality_id,
        MortalityRecord.farmer_id == current_farmer.id
    ).first()
    
    if not mortality_record:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Mortality record not found"
        )
    
    db.delete(mortality_record)
    db.commit()
    
    return {"message": "Mortality record deleted successfully"}


# File upload for mortality photos
@router.post("/upload-photo")
async def upload_mortality_photo(
    file: UploadFile = File(...),
    current_farmer: Farmer = Depends(get_current_farmer)
):
    """Upload mortality photo"""
    # Validate file type
    if not file.content_type.startswith('image/'):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="File must be an image"
        )
    
    # Generate unique filename
    file_extension = file.filename.split('.')[-1]
    filename = f"mortality_{current_farmer.id}_{uuid.uuid4()}.{file_extension}"
    
    # Save file (in production, this would be uploaded to S3 or similar)
    upload_dir = "uploads/mortality"
    os.makedirs(upload_dir, exist_ok=True)
    file_path = os.path.join(upload_dir, filename)
    
    with open(file_path, "wb") as buffer:
        content = await file.read()
        buffer.write(content)
    
    # Return file URL
    file_url = f"/uploads/mortality/{filename}"
    
    return {"file_url": file_url, "filename": filename} 