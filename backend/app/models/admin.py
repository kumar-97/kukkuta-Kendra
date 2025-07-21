from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Enum
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.database import Base
import enum


class AdminAction(str, enum.Enum):
    CREATE_FARMER = "create_farmer"
    UPDATE_FARMER = "update_farmer"
    DELETE_FARMER = "delete_farmer"
    VERIFY_FARMER = "verify_farmer"
    CREATE_MILL = "create_mill"
    UPDATE_MILL = "update_mill"
    DELETE_MILL = "delete_mill"
    APPROVE_REPORT = "approve_report"
    REJECT_REPORT = "reject_report"
    SYSTEM_CONFIG = "system_config"


class AdminLog(Base):
    __tablename__ = "admin_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    action = Column(Enum(AdminAction), nullable=False)
    target_type = Column(String(50))  # farmer, mill, report, etc.
    target_id = Column(Integer)  # ID of the target object
    description = Column(Text, nullable=False)
    ip_address = Column(String(45))  # IPv4 or IPv6
    user_agent = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    user = relationship("User", back_populates="admin_logs")

    def __repr__(self):
        return f"<AdminLog(id={self.id}, action='{self.action}', user_id={self.user_id})>" 