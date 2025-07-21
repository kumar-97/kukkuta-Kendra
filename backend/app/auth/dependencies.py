from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User, UserRole
from app.models.farmer import Farmer
from app.models.mill import Mill
from app.auth.security import get_current_user

security = HTTPBearer()


def get_current_active_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
) -> User:
    """Get current active user"""
    user_id = get_current_user(credentials.credentials)
    user = db.query(User).filter(User.id == user_id).first()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found"
        )
    
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Inactive user"
        )
    
    return user


def get_current_farmer(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
) -> Farmer:
    """Get current farmer"""
    if current_user.role != UserRole.FARMER:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied. Farmer role required."
        )
    
    farmer = db.query(Farmer).filter(Farmer.user_id == current_user.id).first()
    if not farmer:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Farmer profile not found"
        )
    
    return farmer


def get_current_mill(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
) -> Mill:
    """Get current mill"""
    if current_user.role != UserRole.MILL:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied. Mill role required."
        )
    
    mill = db.query(Mill).filter(Mill.user_id == current_user.id).first()
    if not mill:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Mill profile not found"
        )
    
    return mill


def get_current_admin(
    current_user: User = Depends(get_current_active_user)
) -> User:
    """Get current admin"""
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied. Admin role required."
        )
    
    return current_user 