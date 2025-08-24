from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Float, Boolean
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.database import Base


class RoutineData(Base):
    __tablename__ = "routine_data"

    id = Column(Integer, primary_key=True, index=True)
    farmer_id = Column(Integer, ForeignKey("farmers.id"), nullable=False)
    date = Column(DateTime(timezone=True), nullable=False)
    mortality_count = Column(Integer, default=0)
    feed_consumption_kg = Column(Float, nullable=False)
    average_bird_weight_g = Column(Float, nullable=False)
    water_consumption_liters = Column(Float)
    temperature_celsius = Column(Float)
    humidity_percentage = Column(Float)
    notes = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    farmer = relationship("Farmer", back_populates="routine_data")
    mortality_records = relationship("MortalityRecord", back_populates="routine_data")

    def __repr__(self):
        return f"<RoutineData(id={self.id}, farmer_id={self.farmer_id}, date='{self.date}')>"


class MortalityRecord(Base):
    __tablename__ = "mortality_records"

    id = Column(Integer, primary_key=True, index=True)
    routine_data_id = Column(Integer, ForeignKey("routine_data.id"), nullable=False)
    farmer_id = Column(Integer, ForeignKey("farmers.id"), nullable=False)
    count = Column(Integer, nullable=False)
    cause = Column(String(100))  # Disease, Accident, Natural, etc.
    age_days = Column(Integer)  # Age of birds when mortality occurred
    photo_url = Column(String(500))  # URL to uploaded photo
    notes = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    routine_data = relationship("RoutineData", back_populates="mortality_records")
    farmer = relationship("Farmer", back_populates="mortality_records")

    def __repr__(self):
        return f"<MortalityRecord(id={self.id}, count={self.count}, cause='{self.cause}')>" 