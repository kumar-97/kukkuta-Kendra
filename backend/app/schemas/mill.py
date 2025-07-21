from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from app.models.mill import OrderStatus


class MillBase(BaseModel):
    name: str
    address: str
    phone: str
    capacity_per_day: float


class MillCreate(MillBase):
    user_id: int


class MillUpdate(BaseModel):
    name: Optional[str] = None
    address: Optional[str] = None
    phone: Optional[str] = None
    capacity_per_day: Optional[float] = None
    is_active: Optional[bool] = None


class MillResponse(MillBase):
    id: int
    user_id: int
    is_active: bool
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class FeedOrderItemBase(BaseModel):
    feed_type_id: int
    quantity: float


class FeedOrderItemCreate(FeedOrderItemBase):
    pass


class FeedOrderItemResponse(FeedOrderItemBase):
    id: int
    order_id: int
    unit_price: float
    total_price: float
    created_at: datetime

    class Config:
        from_attributes = True


class FeedOrderBase(BaseModel):
    delivery_address: str
    expected_delivery_date: Optional[datetime] = None
    notes: Optional[str] = None


class FeedOrderCreate(FeedOrderBase):
    farmer_id: int
    mill_id: int
    items: List[FeedOrderItemCreate]


class FeedOrderUpdate(BaseModel):
    status: Optional[OrderStatus] = None
    actual_delivery_date: Optional[datetime] = None
    notes: Optional[str] = None


class FeedOrderResponse(FeedOrderBase):
    id: int
    order_number: str
    farmer_id: int
    mill_id: int
    status: OrderStatus
    total_amount: float
    actual_delivery_date: Optional[datetime] = None
    created_at: datetime
    updated_at: Optional[datetime] = None
    items: List[FeedOrderItemResponse] = []

    class Config:
        from_attributes = True 