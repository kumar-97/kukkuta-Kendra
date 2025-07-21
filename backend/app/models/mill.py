from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Float, Boolean, Enum
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.database import Base
import enum


class OrderStatus(str, enum.Enum):
    PENDING = "pending"
    PROCESSING = "processing"
    DISPATCHED = "dispatched"
    DELIVERED = "delivered"
    CANCELLED = "cancelled"


class FeedType(Base):
    __tablename__ = "feed_types"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(50), nullable=False, unique=True)  # Prestarter, Starter, Finisher
    description = Column(Text)
    price_per_kg = Column(Float, nullable=False)
    is_available = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    feed_orders = relationship("FeedOrderItem", back_populates="feed_type")

    def __repr__(self):
        return f"<FeedType(id={self.id}, name='{self.name}', price={self.price_per_kg})>"


class Mill(Base):
    __tablename__ = "mills"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)
    name = Column(String(100), nullable=False)
    address = Column(Text, nullable=False)
    phone = Column(String(15), nullable=False)
    capacity_per_day = Column(Float, nullable=False)  # kg per day
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    user = relationship("User", back_populates="mill")
    feed_orders = relationship("FeedOrder", back_populates="mill")

    def __repr__(self):
        return f"<Mill(id={self.id}, name='{self.name}', user_id={self.user_id})>"


class FeedOrder(Base):
    __tablename__ = "feed_orders"

    id = Column(Integer, primary_key=True, index=True)
    order_number = Column(String(20), unique=True, nullable=False)
    farmer_id = Column(Integer, ForeignKey("farmers.id"), nullable=False)
    mill_id = Column(Integer, ForeignKey("mills.id"), nullable=False)
    status = Column(Enum(OrderStatus), default=OrderStatus.PENDING)
    total_amount = Column(Float, nullable=False)
    delivery_address = Column(Text, nullable=False)
    expected_delivery_date = Column(DateTime(timezone=True))
    actual_delivery_date = Column(DateTime(timezone=True))
    notes = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    farmer = relationship("Farmer", back_populates="feed_orders")
    mill = relationship("Mill", back_populates="feed_orders")
    items = relationship("FeedOrderItem", back_populates="order")

    def __repr__(self):
        return f"<FeedOrder(id={self.id}, order_number='{self.order_number}', status='{self.status}')>"


class FeedOrderItem(Base):
    __tablename__ = "feed_order_items"

    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("feed_orders.id"), nullable=False)
    feed_type_id = Column(Integer, ForeignKey("feed_types.id"), nullable=False)
    quantity = Column(Float, nullable=False)  # in kg
    unit_price = Column(Float, nullable=False)
    total_price = Column(Float, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    order = relationship("FeedOrder", back_populates="items")
    feed_type = relationship("FeedType", back_populates="feed_orders")

    def __repr__(self):
        return f"<FeedOrderItem(id={self.id}, feed_type_id={self.feed_type_id}, quantity={self.quantity})>" 