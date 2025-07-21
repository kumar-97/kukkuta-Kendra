from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class FarmerBase(BaseModel):
    phone: str
    address: str
    farm_type: str
    experience_years: Optional[int] = 0

class FarmerCreate(FarmerBase):
    user_id: int

class FarmerUpdate(BaseModel):
    phone: Optional[str] = None
    address: Optional[str] = None
    farm_type: Optional[str] = None
    experience_years: Optional[int] = None
    is_verified: Optional[bool] = None

class FarmerResponse(FarmerBase):
    id: int
    user_id: int
    is_verified: bool
    created_at: datetime
    updated_at: Optional[datetime] = None
    class Config:
        from_attributes = True

class FarmBase(BaseModel):
    name: str
    location: str
    capacity: int
    current_stock: Optional[int] = 0
    farm_size: float

class FarmCreate(FarmBase):
    farmer_id: int

class FarmUpdate(BaseModel):
    name: Optional[str] = None
    location: Optional[str] = None
    capacity: Optional[int] = None
    current_stock: Optional[int] = None
    farm_size: Optional[float] = None
    is_active: Optional[bool] = None

class FarmResponse(FarmBase):
    id: int
    farmer_id: int
    is_active: bool
    created_at: datetime
    updated_at: Optional[datetime] = None
    class Config:
        from_attributes = True

class FarmerWithFarms(FarmerResponse):
    farms: List[FarmResponse] = [] 