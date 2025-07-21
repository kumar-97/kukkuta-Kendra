from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime, date
from app.database import get_db
from app.models.farmer import Farmer
from app.models.production import ProductionReport, CostDetail
from app.schemas.production import ProductionReportCreate, ProductionReportUpdate, ProductionReportResponse, CostDetailCreate, CostDetailResponse
from app.auth.dependencies import get_current_farmer, get_current_admin
from app.models.user import User
import uuid

router = APIRouter()


@router.post("/reports", response_model=ProductionReportResponse)
def create_production_report(
    report_data: ProductionReportCreate,
    current_farmer: Farmer = Depends(get_current_farmer),
    db: Session = Depends(get_db)
):
    """Create new production report for current farmer"""
    # Generate unique report number
    report_number = f"RPT{datetime.now().strftime('%Y%m%d')}{uuid.uuid4().hex[:8].upper()}"
    
    # Create production report
    db_report = ProductionReport(
        **report_data.dict(exclude={'cost_details'}),
        report_number=report_number
    )
    db.add(db_report)
    db.commit()
    db.refresh(db_report)
    
    # Create cost details
    for cost_detail in report_data.cost_details:
        db_cost_detail = CostDetail(
            **cost_detail.dict(),
            production_report_id=db_report.id
        )
        db.add(db_cost_detail)
    
    db.commit()
    db.refresh(db_report)
    
    return db_report


@router.get("/reports", response_model=List[ProductionReportResponse])
def get_my_production_reports(
    start_date: Optional[date] = Query(None),
    end_date: Optional[date] = Query(None),
    is_approved: Optional[bool] = Query(None),
    current_farmer: Farmer = Depends(get_current_farmer),
    db: Session = Depends(get_db)
):
    """Get production reports for current farmer with optional filters"""
    query = db.query(ProductionReport).filter(ProductionReport.farmer_id == current_farmer.id)
    
    if start_date:
        query = query.filter(ProductionReport.hatch_date >= start_date)
    
    if end_date:
        query = query.filter(ProductionReport.hatch_date <= end_date)
    
    if is_approved is not None:
        query = query.filter(ProductionReport.is_approved == is_approved)
    
    reports = query.order_by(ProductionReport.created_at.desc()).all()
    return reports


@router.get("/reports/{report_id}", response_model=ProductionReportResponse)
def get_production_report_by_id(
    report_id: int,
    current_farmer: Farmer = Depends(get_current_farmer),
    db: Session = Depends(get_db)
):
    """Get production report by ID (must belong to current farmer)"""
    report = db.query(ProductionReport).filter(
        ProductionReport.id == report_id,
        ProductionReport.farmer_id == current_farmer.id
    ).first()
    
    if not report:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Production report not found"
        )
    
    return report


@router.put("/reports/{report_id}", response_model=ProductionReportResponse)
def update_production_report(
    report_id: int,
    report_data: ProductionReportUpdate,
    current_farmer: Farmer = Depends(get_current_farmer),
    db: Session = Depends(get_db)
):
    """Update production report (must belong to current farmer)"""
    report = db.query(ProductionReport).filter(
        ProductionReport.id == report_id,
        ProductionReport.farmer_id == current_farmer.id
    ).first()
    
    if not report:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Production report not found"
        )
    
    # Only allow updates if report is not approved
    if report.is_approved:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot update approved report"
        )
    
    for field, value in report_data.dict(exclude_unset=True).items():
        setattr(report, field, value)
    
    db.commit()
    db.refresh(report)
    
    return report


@router.delete("/reports/{report_id}")
def delete_production_report(
    report_id: int,
    current_farmer: Farmer = Depends(get_current_farmer),
    db: Session = Depends(get_db)
):
    """Delete production report (must belong to current farmer)"""
    report = db.query(ProductionReport).filter(
        ProductionReport.id == report_id,
        ProductionReport.farmer_id == current_farmer.id
    ).first()
    
    if not report:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Production report not found"
        )
    
    # Only allow deletion if report is not approved
    if report.is_approved:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot delete approved report"
        )
    
    db.delete(report)
    db.commit()
    
    return {"message": "Production report deleted successfully"}


# Admin routes for production reports
@router.get("/admin/reports", response_model=List[ProductionReportResponse])
def get_all_production_reports(
    farmer_id: Optional[int] = Query(None),
    start_date: Optional[date] = Query(None),
    end_date: Optional[date] = Query(None),
    is_approved: Optional[bool] = Query(None),
    current_admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Get all production reports (Admin only)"""
    query = db.query(ProductionReport)
    
    if farmer_id:
        query = query.filter(ProductionReport.farmer_id == farmer_id)
    
    if start_date:
        query = query.filter(ProductionReport.hatch_date >= start_date)
    
    if end_date:
        query = query.filter(ProductionReport.hatch_date <= end_date)
    
    if is_approved is not None:
        query = query.filter(ProductionReport.is_approved == is_approved)
    
    reports = query.order_by(ProductionReport.created_at.desc()).all()
    return reports


@router.get("/admin/reports/{report_id}", response_model=ProductionReportResponse)
def get_production_report_admin(
    report_id: int,
    current_admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Get production report by ID (Admin only)"""
    report = db.query(ProductionReport).filter(ProductionReport.id == report_id).first()
    
    if not report:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Production report not found"
        )
    
    return report


@router.put("/admin/reports/{report_id}/approve", response_model=ProductionReportResponse)
def approve_production_report(
    report_id: int,
    current_admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Approve production report (Admin only)"""
    report = db.query(ProductionReport).filter(ProductionReport.id == report_id).first()
    
    if not report:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Production report not found"
        )
    
    if report.is_approved:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Report is already approved"
        )
    
    report.is_approved = True
    report.approved_by = current_admin.id
    report.approved_at = datetime.utcnow()
    
    db.commit()
    db.refresh(report)
    
    return report


@router.put("/admin/reports/{report_id}/reject", response_model=ProductionReportResponse)
def reject_production_report(
    report_id: int,
    current_admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Reject production report (Admin only)"""
    report = db.query(ProductionReport).filter(ProductionReport.id == report_id).first()
    
    if not report:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Production report not found"
        )
    
    if not report.is_approved:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Report is not approved"
        )
    
    report.is_approved = False
    report.approved_by = None
    report.approved_at = None
    
    db.commit()
    db.refresh(report)
    
    return report


# Cost detail routes
@router.post("/cost-details", response_model=CostDetailResponse)
def create_cost_detail(
    cost_detail: CostDetailCreate,
    current_farmer: Farmer = Depends(get_current_farmer),
    db: Session = Depends(get_db)
):
    """Create new cost detail"""
    # Verify the production report belongs to the farmer
    report = db.query(ProductionReport).filter(
        ProductionReport.id == cost_detail.production_report_id,
        ProductionReport.farmer_id == current_farmer.id
    ).first()
    
    if not report:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Production report not found"
        )
    
    # Check if report is approved
    if report.is_approved:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot add cost details to approved report"
        )
    
    db_cost_detail = CostDetail(**cost_detail.dict())
    db.add(db_cost_detail)
    db.commit()
    db.refresh(db_cost_detail)
    
    return db_cost_detail


@router.get("/cost-details", response_model=List[CostDetailResponse])
def get_cost_details(
    production_report_id: int,
    current_farmer: Farmer = Depends(get_current_farmer),
    db: Session = Depends(get_db)
):
    """Get cost details for a production report"""
    # Verify the production report belongs to the farmer
    report = db.query(ProductionReport).filter(
        ProductionReport.id == production_report_id,
        ProductionReport.farmer_id == current_farmer.id
    ).first()
    
    if not report:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Production report not found"
        )
    
    cost_details = db.query(CostDetail).filter(
        CostDetail.production_report_id == production_report_id
    ).all()
    
    return cost_details 