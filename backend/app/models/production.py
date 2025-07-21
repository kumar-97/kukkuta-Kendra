from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Float, Boolean
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.database import Base


class ProductionReport(Base):
    __tablename__ = "production_reports"

    id = Column(Integer, primary_key=True, index=True)
    farmer_id = Column(Integer, ForeignKey("farmers.id"), nullable=False)
    report_number = Column(String(20), unique=True, nullable=False)
    farmer_name = Column(String(100), nullable=False)
    place = Column(String(200), nullable=False)
    hatch_date = Column(DateTime(timezone=True), nullable=False)
    
    # Production Summary
    total_mortality_percent = Column(Float, nullable=False)
    chicks_housed = Column(Integer, nullable=False)
    mortality_nos = Column(Integer, nullable=False)
    bird_lifted = Column(Integer, nullable=False)
    shortage = Column(Integer, default=0)
    bird_weight_kg = Column(Float, nullable=False)
    
    # Performance Metrics
    fcr_percent = Column(Float, nullable=False)  # Feed Conversion Ratio
    lifting_percent = Column(Float, nullable=False)
    avg_weight_kg = Column(Float, nullable=False)
    mean_age_days = Column(Integer)
    farmer_profit_kg = Column(Float)
    msp_kg = Column(Float)  # Minimum Support Price
    
    # Grading
    lot_grade = Column(String(10), nullable=False)  # A, B, C, etc.
    
    # Cost Analysis
    production_cost_per_kg = Column(Float, nullable=False)
    basic_rate = Column(Float, nullable=False)
    performance_bonus = Column(String(100))
    balance = Column(Float)
    shorting_bird_kg = Column(String(100))
    extra_mortality = Column(String(100))
    minimum_growing_charge = Column(String(100))
    final_amount = Column(Float, nullable=False)
    
    # Report Status
    is_approved = Column(Boolean, default=False)
    approved_by = Column(Integer, ForeignKey("users.id"))
    approved_at = Column(DateTime(timezone=True))
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    farmer = relationship("Farmer", back_populates="production_reports")
    cost_details = relationship("CostDetail", back_populates="production_report")

    def __repr__(self):
        return f"<ProductionReport(id={self.id}, report_number='{self.report_number}', farmer='{self.farmer_name}')>"


class CostDetail(Base):
    __tablename__ = "cost_details"

    id = Column(Integer, primary_key=True, index=True)
    production_report_id = Column(Integer, ForeignKey("production_reports.id"), nullable=False)
    item = Column(String(100), nullable=False)  # Chicks, Feed, Medicine, Admin, etc.
    quantity = Column(String(50))  # Can be number or "ACTUAL"
    rate = Column(String(50))  # Can be number or empty
    amount = Column(Float, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    production_report = relationship("ProductionReport", back_populates="cost_details")

    def __repr__(self):
        return f"<CostDetail(id={self.id}, item='{self.item}', amount={self.amount})>" 