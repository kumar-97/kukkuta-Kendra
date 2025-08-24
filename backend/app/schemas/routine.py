from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


class RoutineDataBase(BaseModel):
    date: datetime
    mortality_count: Optional[int] = 0
    feed_consumption_kg: float
    average_bird_weight_g: float
    water_consumption_liters: Optional[float] = None
    temperature_celsius: Optional[float] = None
    humidity_percentage: Optional[float] = None
    notes: Optional[str] = None


class RoutineDataCreate(RoutineDataBase):
    farmer_id: int


class RoutineDataUpdate(BaseModel):
    mortality_count: Optional[int] = None
    feed_consumption_kg: Optional[float] = None
    average_bird_weight_g: Optional[float] = None
    water_consumption_liters: Optional[float] = None
    temperature_celsius: Optional[float] = None
    humidity_percentage: Optional[float] = None
    notes: Optional[str] = None


class RoutineDataResponse(RoutineDataBase):
    id: int
    farmer_id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class MortalityRecordBase(BaseModel):
    count: int
    cause: Optional[str] = None
    age_days: Optional[int] = None
    photo_url: Optional[str] = None
    notes: Optional[str] = None


class MortalityRecordCreate(MortalityRecordBase):
    routine_data_id: int
    farmer_id: int


class MortalityRecordResponse(MortalityRecordBase):
    id: int
    routine_data_id: int
    farmer_id: int
    created_at: datetime

    class Config:
        from_attributes = True


class RoutineDataWithMortality(RoutineDataResponse):
    mortality_records: List[MortalityRecordResponse] = [] 