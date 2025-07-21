from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app.models.user import User
from app.models.mill import Mill, FeedOrder, FeedOrderItem, FeedType, OrderStatus
from app.schemas.mill import MillCreate, MillUpdate, MillResponse, FeedOrderCreate, FeedOrderUpdate, FeedOrderResponse
from app.auth.dependencies import get_current_active_user, get_current_mill, get_current_admin
from datetime import datetime
import uuid

router = APIRouter()


@router.post("/", response_model=MillResponse)
def create_mill(
    mill_data: MillCreate,
    current_admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Create a new mill profile (Admin only)"""
    # Check if user exists and is a mill
    user = db.query(User).filter(User.id == mill_data.user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    if user.role != User.MILL:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User must have mill role"
        )
    
    # Check if mill profile already exists
    existing_mill = db.query(Mill).filter(Mill.user_id == mill_data.user_id).first()
    if existing_mill:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Mill profile already exists"
        )
    
    # Create mill profile
    db_mill = Mill(**mill_data.dict())
    db.add(db_mill)
    db.commit()
    db.refresh(db_mill)
    
    return db_mill


@router.get("/me", response_model=MillResponse)
def get_my_mill_profile(current_mill: Mill = Depends(get_current_mill)):
    """Get current mill's profile"""
    return current_mill


@router.put("/me", response_model=MillResponse)
def update_my_mill_profile(
    mill_data: MillUpdate,
    current_mill: Mill = Depends(get_current_mill),
    db: Session = Depends(get_db)
):
    """Update current mill's profile"""
    for field, value in mill_data.dict(exclude_unset=True).items():
        setattr(current_mill, field, value)
    
    db.commit()
    db.refresh(current_mill)
    
    return current_mill


@router.get("/orders", response_model=List[FeedOrderResponse])
def get_my_orders(
    status_filter: Optional[OrderStatus] = Query(None),
    current_mill: Mill = Depends(get_current_mill),
    db: Session = Depends(get_db)
):
    """Get all orders for current mill"""
    query = db.query(FeedOrder).filter(FeedOrder.mill_id == current_mill.id)
    
    if status_filter:
        query = query.filter(FeedOrder.status == status_filter)
    
    orders = query.order_by(FeedOrder.created_at.desc()).all()
    return orders


@router.get("/orders/{order_id}", response_model=FeedOrderResponse)
def get_order_by_id(
    order_id: int,
    current_mill: Mill = Depends(get_current_mill),
    db: Session = Depends(get_db)
):
    """Get order by ID (must belong to current mill)"""
    order = db.query(FeedOrder).filter(
        FeedOrder.id == order_id,
        FeedOrder.mill_id == current_mill.id
    ).first()
    
    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Order not found"
        )
    
    return order


@router.put("/orders/{order_id}/status", response_model=FeedOrderResponse)
def update_order_status(
    order_id: int,
    order_data: FeedOrderUpdate,
    current_mill: Mill = Depends(get_current_mill),
    db: Session = Depends(get_db)
):
    """Update order status (must belong to current mill)"""
    order = db.query(FeedOrder).filter(
        FeedOrder.id == order_id,
        FeedOrder.mill_id == current_mill.id
    ).first()
    
    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Order not found"
        )
    
    # Update status
    if order_data.status:
        order.status = order_data.status
        
        # If status is dispatched, set actual delivery date
        if order_data.status == OrderStatus.DISPATCHED:
            order.actual_delivery_date = datetime.utcnow()
    
    if order_data.actual_delivery_date:
        order.actual_delivery_date = order_data.actual_delivery_date
    
    if order_data.notes:
        order.notes = order_data.notes
    
    db.commit()
    db.refresh(order)
    
    return order


@router.get("/feed-types", response_model=List[dict])
def get_feed_types(db: Session = Depends(get_db)):
    """Get all available feed types"""
    feed_types = db.query(FeedType).filter(FeedType.is_available == True).all()
    return [
        {
            "id": ft.id,
            "name": ft.name,
            "description": ft.description,
            "price_per_kg": ft.price_per_kg
        }
        for ft in feed_types
    ]


# Admin routes for mill management
@router.get("/", response_model=List[MillResponse])
def get_all_mills(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    current_admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Get all mills (Admin only)"""
    mills = db.query(Mill).offset(skip).limit(limit).all()
    return mills


@router.get("/{mill_id}", response_model=MillResponse)
def get_mill_by_id(
    mill_id: int,
    current_admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Get mill by ID (Admin only)"""
    mill = db.query(Mill).filter(Mill.id == mill_id).first()
    if not mill:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Mill not found"
        )
    
    return mill


@router.put("/{mill_id}", response_model=MillResponse)
def update_mill(
    mill_id: int,
    mill_data: MillUpdate,
    current_admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Update mill profile (Admin only)"""
    mill = db.query(Mill).filter(Mill.id == mill_id).first()
    if not mill:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Mill not found"
        )
    
    for field, value in mill_data.dict(exclude_unset=True).items():
        setattr(mill, field, value)
    
    db.commit()
    db.refresh(mill)
    
    return mill


@router.delete("/{mill_id}")
def delete_mill(
    mill_id: int,
    current_admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Delete mill (Admin only)"""
    mill = db.query(Mill).filter(Mill.id == mill_id).first()
    if not mill:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Mill not found"
        )
    
    db.delete(mill)
    db.commit()
    
    return {"message": "Mill deleted successfully"} 