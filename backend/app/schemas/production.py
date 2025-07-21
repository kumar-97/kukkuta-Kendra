from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


class CostDetailBase(BaseModel):
    item: str
    quantity: Optional[str] = None
    rate: Optional[str] = None
    amount: float


class CostDetailCreate(CostDetailBase):
    production_report_id: int


class CostDetailResponse(CostDetailBase):
    id: int
    production_report_id: int
    created_at: datetime

    class Config:
        from_attributes = True


class ProductionReportBase(BaseModel):
    farmer_name: str
    place: str
    hatch_date: datetime
    total_mortality_percent: float
    chicks_housed: int
    mortality_nos: int
    bird_lifted: int
    shortage: Optional[int] = 0
    bird_weight_kg: float
    fcr_percent: float
    lifting_percent: float
    avg_weight_kg: float
    mean_age_days: Optional[int] = None
    farmer_profit_kg: Optional[float] = None
    msp_kg: Optional[float] = None
    lot_grade: str
    production_cost_per_kg: float
    basic_rate: float
    performance_bonus: Optional[str] = None
    balance: Optional[float] = None
    shorting_bird_kg: Optional[str] = None
    extra_mortality: Optional[str] = None
    minimum_growing_charge: Optional[str] = None
    final_amount: float


class ProductionReportCreate(ProductionReportBase):
    farmer_id: int
    cost_details: List[CostDetailCreate]


class ProductionReportUpdate(BaseModel):
    is_approved: Optional[bool] = None
    approved_by: Optional[int] = None


class ProductionReportResponse(ProductionReportBase):
    id: int
    farmer_id: int
    report_number: str
    is_approved: bool
    approved_by: Optional[int] = None
    approved_at: Optional[datetime] = None
    created_at: datetime
    updated_at: Optional[datetime] = None
    cost_details: List[CostDetailResponse] = []

    class Config:
        from_attributes = True 