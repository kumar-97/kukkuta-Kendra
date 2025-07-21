from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Float, Boolean
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.database import Base


class Farmer(Base):
    __tablename__ = "farmers"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)
    phone = Column(String(15), nullable=False)
    address = Column(Text, nullable=False)
    farm_type = Column(String(50), nullable=False)  # Poultry, Dairy, etc.
    experience_years = Column(Integer, default=0)
    is_verified = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    user = relationship("User", back_populates="farmer")
    farms = relationship("Farm", back_populates="farmer")
    routine_data = relationship("RoutineData", back_populates="farmer")
    mortality_records = relationship("MortalityRecord", back_populates="farmer")
    production_reports = relationship("ProductionReport", back_populates="farmer")
    feed_orders = relationship("FeedOrder", back_populates="farmer")

    def __repr__(self):
        return f"<Farmer(id={self.id}, user_id={self.user_id}, farm_type='{self.farm_type}')>"


class Farm(Base):
    __tablename__ = "farms"

    id = Column(Integer, primary_key=True, index=True)
    farmer_id = Column(Integer, ForeignKey("farmers.id"), nullable=False)
    name = Column(String(100), nullable=False)
    location = Column(String(200), nullable=False)
    capacity = Column(Integer, nullable=False)  # Number of birds capacity
    current_stock = Column(Integer, default=0)
    farm_size = Column(Float, nullable=False)  # in acres
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    farmer = relationship("Farmer", back_populates="farms")

    def __repr__(self):
        return f"<Farm(id={self.id}, name='{self.name}', farmer_id={self.farmer_id})>" 