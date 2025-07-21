from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import func, and_
from typing import List, Dict, Any, Optional
from datetime import datetime, date, timedelta
from app.database import get_db
from app.models.user import User, UserRole
from app.models.farmer import Farmer
from app.models.mill import Mill, FeedOrder, OrderStatus
from app.models.routine import RoutineData
from app.models.production import ProductionReport, CostDetail
from app.models.routine import MortalityRecord
from app.models.admin import AdminLog, AdminAction
from app.auth.dependencies import get_current_admin

router = APIRouter()


@router.get("/dashboard")
def get_admin_dashboard(
    current_admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Get admin dashboard statistics"""
    # Get counts
    total_farmers = db.query(Farmer).count()
    total_mills = db.query(Mill).count()
    total_orders = db.query(FeedOrder).count()
    total_reports = db.query(ProductionReport).count()
    
    # Get pending orders
    pending_orders = db.query(FeedOrder).filter(FeedOrder.status == OrderStatus.PENDING).count()
    
    # Get unapproved reports
    unapproved_reports = db.query(ProductionReport).filter(ProductionReport.is_approved == False).count()
    
    # Get recent activity
    recent_orders = db.query(FeedOrder).order_by(FeedOrder.created_at.desc()).limit(5).all()
    recent_reports = db.query(ProductionReport).order_by(ProductionReport.created_at.desc()).limit(5).all()
    
    # Get monthly statistics
    current_month = datetime.now().replace(day=1, hour=0, minute=0, second=0, microsecond=0)
    monthly_orders = db.query(FeedOrder).filter(FeedOrder.created_at >= current_month).count()
    monthly_reports = db.query(ProductionReport).filter(ProductionReport.created_at >= current_month).count()
    
    return {
        "total_farmers": total_farmers,
        "total_mills": total_mills,
        "total_orders": total_orders,
        "total_reports": total_reports,
        "pending_orders": pending_orders,
        "unapproved_reports": unapproved_reports,
        "monthly_orders": monthly_orders,
        "monthly_reports": monthly_reports,
        "recent_orders": [
            {
                "id": order.id,
                "order_number": order.order_number,
                "farmer_id": order.farmer_id,
                "status": order.status,
                "total_amount": order.total_amount,
                "created_at": order.created_at
            }
            for order in recent_orders
        ],
        "recent_reports": [
            {
                "id": report.id,
                "report_number": report.report_number,
                "farmer_name": report.farmer_name,
                "is_approved": report.is_approved,
                "created_at": report.created_at
            }
            for report in recent_reports
        ]
    }


@router.get("/analytics/farmers")
def get_farmer_analytics(
    start_date: Optional[date] = Query(None),
    end_date: Optional[date] = Query(None),
    current_admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Get farmer analytics"""
    query = db.query(Farmer)
    
    if start_date:
        query = query.filter(Farmer.created_at >= start_date)
    
    if end_date:
        query = query.filter(Farmer.created_at <= end_date)
    
    farmers = query.all()
    
    # Group by farm type
    farm_types = {}
    for farmer in farmers:
        farm_type = farmer.farm_type
        if farm_type not in farm_types:
            farm_types[farm_type] = 0
        farm_types[farm_type] += 1
    
    # Get verification status
    verified_farmers = sum(1 for f in farmers if f.is_verified)
    unverified_farmers = len(farmers) - verified_farmers
    
    return {
        "total_farmers": len(farmers),
        "farm_types": farm_types,
        "verified_farmers": verified_farmers,
        "unverified_farmers": unverified_farmers,
        "verification_rate": (verified_farmers / len(farmers) * 100) if farmers else 0
    }


@router.get("/analytics/orders")
def get_order_analytics(
    start_date: Optional[date] = Query(None),
    end_date: Optional[date] = Query(None),
    current_admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Get order analytics"""
    query = db.query(FeedOrder)
    
    if start_date:
        query = query.filter(FeedOrder.created_at >= start_date)
    
    if end_date:
        query = query.filter(FeedOrder.created_at <= end_date)
    
    orders = query.all()
    
    # Group by status
    status_counts = {}
    for order in orders:
        status = order.status.value
        if status not in status_counts:
            status_counts[status] = 0
        status_counts[status] += 1
    
    # Calculate total revenue
    total_revenue = sum(order.total_amount for order in orders)
    
    # Get average order value
    avg_order_value = total_revenue / len(orders) if orders else 0
    
    return {
        "total_orders": len(orders),
        "status_distribution": status_counts,
        "total_revenue": total_revenue,
        "average_order_value": avg_order_value
    }


@router.get("/analytics/production")
def get_production_analytics(
    start_date: Optional[date] = Query(None),
    end_date: Optional[date] = Query(None),
    current_admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Get production analytics"""
    query = db.query(ProductionReport)
    
    if start_date:
        query = query.filter(ProductionReport.hatch_date >= start_date)
    
    if end_date:
        query = query.filter(ProductionReport.hatch_date <= end_date)
    
    reports = query.all()
    
    if not reports:
        return {
            "total_reports": 0,
            "approved_reports": 0,
            "approval_rate": 0,
            "average_mortality": 0,
            "average_fcr": 0,
            "average_weight": 0
        }
    
    # Calculate statistics
    approved_reports = sum(1 for r in reports if r.is_approved)
    approval_rate = (approved_reports / len(reports)) * 100
    
    avg_mortality = sum(r.total_mortality_percent for r in reports) / len(reports)
    avg_fcr = sum(r.fcr_percent for r in reports) / len(reports)
    avg_weight = sum(r.avg_weight_kg for r in reports) / len(reports)
    
    return {
        "total_reports": len(reports),
        "approved_reports": approved_reports,
        "approval_rate": approval_rate,
        "average_mortality": avg_mortality,
        "average_fcr": avg_fcr,
        "average_weight": avg_weight
    }


@router.get("/logs", response_model=List[Dict[str, Any]])
def get_admin_logs(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    action: Optional[AdminAction] = Query(None),
    user_id: Optional[int] = Query(None),
    current_admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Get admin activity logs"""
    query = db.query(AdminLog)
    
    if action:
        query = query.filter(AdminLog.action == action)
    
    if user_id:
        query = query.filter(AdminLog.user_id == user_id)
    
    logs = query.order_by(AdminLog.created_at.desc()).offset(skip).limit(limit).all()
    
    return [
        {
            "id": log.id,
            "action": log.action.value,
            "target_type": log.target_type,
            "target_id": log.target_id,
            "description": log.description,
            "user_id": log.user_id,
            "ip_address": log.ip_address,
            "created_at": log.created_at
        }
        for log in logs
    ]


@router.post("/logs")
def create_admin_log(
    action: AdminAction,
    target_type: Optional[str] = None,
    target_id: Optional[int] = None,
    description: str = "",
    ip_address: Optional[str] = None,
    current_admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Create admin activity log"""
    log = AdminLog(
        user_id=current_admin.id,
        action=action,
        target_type=target_type,
        target_id=target_id,
        description=description,
        ip_address=ip_address
    )
    
    db.add(log)
    db.commit()
    db.refresh(log)
    
    return {"message": "Log created successfully", "log_id": log.id}


@router.get("/system-stats")
def get_system_stats(
    current_admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Get system statistics"""
    # Database statistics
    total_users = db.query(User).count()
    active_users = db.query(User).filter(User.is_active == True).count()
    
    # Storage statistics (approximate)
    total_routine_records = db.query(RoutineData).count()
    total_mortality_records = db.query(MortalityRecord).count()
    total_production_reports = db.query(ProductionReport).count()
    total_cost_details = db.query(CostDetail).count()
    
    # Recent activity (last 7 days)
    week_ago = datetime.now() - timedelta(days=7)
    recent_users = db.query(User).filter(User.created_at >= week_ago).count()
    recent_orders = db.query(FeedOrder).filter(FeedOrder.created_at >= week_ago).count()
    recent_reports = db.query(ProductionReport).filter(ProductionReport.created_at >= week_ago).count()
    
    return {
        "users": {
            "total": total_users,
            "active": active_users,
            "recent": recent_users
        },
        "data": {
            "routine_records": total_routine_records,
            "mortality_records": total_mortality_records,
            "production_reports": total_production_reports,
            "cost_details": total_cost_details
        },
        "activity": {
            "recent_orders": recent_orders,
            "recent_reports": recent_reports
        }
    } 