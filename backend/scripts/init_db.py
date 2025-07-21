#!/usr/bin/env python3
"""
Database initialization script for Kukkuta Kendra
Creates tables and populates with sample data
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy.orm import Session
from app.database import SessionLocal, create_tables
from app.models.user import User, UserRole
from app.models.farmer import Farmer, Farm
from app.models.mill import Mill, FeedType, FeedOrder, FeedOrderItem, OrderStatus
from app.auth.security import get_password_hash
from datetime import datetime, timedelta

def create_sample_data():
    """Create sample data for testing"""
    db = SessionLocal()
    
    try:
        # Create sample users
        users_data = [
            {
                "email": "admin@kukkutakendra.com",
                "full_name": "System Administrator",
                "role": UserRole.ADMIN,
                "password": "admin123"
            },
            {
                "email": "farmer1@example.com",
                "full_name": "John Farmer",
                "role": UserRole.FARMER,
                "password": "farmer123"
            },
            {
                "email": "farmer2@example.com",
                "full_name": "Sarah Grower",
                "role": UserRole.FARMER,
                "password": "farmer123"
            },
            {
                "email": "mill1@example.com",
                "full_name": "ABC Feed Mill",
                "role": UserRole.MILL,
                "password": "mill123"
            },
            {
                "email": "report@example.com",
                "full_name": "Report Viewer",
                "role": UserRole.REPORT,
                "password": "report123"
            }
        ]
        
        users = []
        for user_data in users_data:
            hashed_password = get_password_hash(user_data["password"])
            user = User(
                email=user_data["email"],
                hashed_password=hashed_password,
                full_name=user_data["full_name"],
                role=user_data["role"],
                is_active=True,
                is_verified=True
            )
            db.add(user)
            db.flush()  # Get the ID
            users.append(user)
        
        # Create sample farmers
        farmers_data = [
            {
                "user_id": users[1].id,  # farmer1
                "phone": "9876543210",
                "address": "123 Farm Road, Countryside",
                "farm_type": "Poultry",
                "experience_years": 5,
                "is_verified": True
            },
            {
                "user_id": users[2].id,  # farmer2
                "phone": "9123456780",
                "address": "456 Orchard Lane, Farmville",
                "farm_type": "Poultry",
                "experience_years": 3,
                "is_verified": True
            }
        ]
        
        farmers = []
        for farmer_data in farmers_data:
            farmer = Farmer(**farmer_data)
            db.add(farmer)
            db.flush()
            farmers.append(farmer)
        
        # Create sample farms
        farms_data = [
            {
                "farmer_id": farmers[0].id,
                "name": "John's Poultry Farm",
                "location": "Countryside, State",
                "capacity": 5000,
                "current_stock": 4500,
                "farm_size": 2.5
            },
            {
                "farmer_id": farmers[1].id,
                "name": "Sarah's Farm",
                "location": "Farmville, State",
                "capacity": 3000,
                "current_stock": 2800,
                "farm_size": 1.8
            }
        ]
        
        for farm_data in farms_data:
            farm = Farm(**farm_data)
            db.add(farm)
        
        # Create sample mill
        mill_data = {
            "user_id": users[3].id,  # mill1
            "name": "ABC Feed Mill",
            "address": "789 Industrial Area, City",
            "phone": "9555666777",
            "capacity_per_day": 10000,
            "is_active": True
        }
        
        mill = Mill(**mill_data)
        db.add(mill)
        db.flush()
        
        # Create feed types
        feed_types_data = [
            {
                "name": "Prestarter",
                "description": "Feed for chicks 0-7 days",
                "price_per_kg": 45.0,
                "is_available": True
            },
            {
                "name": "Starter",
                "description": "Feed for chicks 8-21 days",
                "price_per_kg": 42.0,
                "is_available": True
            },
            {
                "name": "Finisher",
                "description": "Feed for birds 22+ days",
                "price_per_kg": 40.0,
                "is_available": True
            }
        ]
        
        feed_types = []
        for feed_data in feed_types_data:
            feed_type = FeedType(**feed_data)
            db.add(feed_type)
            db.flush()
            feed_types.append(feed_type)
        
        # Create sample feed orders
        orders_data = [
            {
                "order_number": "ORD001",
                "farmer_id": farmers[0].id,
                "mill_id": mill.id,
                "status": OrderStatus.PENDING,
                "total_amount": 2250.0,
                "delivery_address": "123 Farm Road, Countryside",
                "expected_delivery_date": datetime.now() + timedelta(days=3)
            },
            {
                "order_number": "ORD002",
                "farmer_id": farmers[1].id,
                "mill_id": mill.id,
                "status": OrderStatus.DISPATCHED,
                "total_amount": 1800.0,
                "delivery_address": "456 Orchard Lane, Farmville",
                "expected_delivery_date": datetime.now() + timedelta(days=1),
                "actual_delivery_date": datetime.now()
            }
        ]
        
        orders = []
        for order_data in orders_data:
            order = FeedOrder(**order_data)
            db.add(order)
            db.flush()
            orders.append(order)
        
        # Create order items
        order_items_data = [
            {
                "order_id": orders[0].id,
                "feed_type_id": feed_types[0].id,
                "quantity": 25.0,
                "unit_price": 45.0,
                "total_price": 1125.0
            },
            {
                "order_id": orders[0].id,
                "feed_type_id": feed_types[1].id,
                "quantity": 25.0,
                "unit_price": 42.0,
                "total_price": 1050.0
            },
            {
                "order_id": orders[0].id,
                "feed_type_id": feed_types[2].id,
                "quantity": 2.0,
                "unit_price": 40.0,
                "total_price": 80.0
            },
            {
                "order_id": orders[1].id,
                "feed_type_id": feed_types[1].id,
                "quantity": 30.0,
                "unit_price": 42.0,
                "total_price": 1260.0
            },
            {
                "order_id": orders[1].id,
                "feed_type_id": feed_types[2].id,
                "quantity": 13.5,
                "unit_price": 40.0,
                "total_price": 540.0
            }
        ]
        
        for item_data in order_items_data:
            order_item = FeedOrderItem(**item_data)
            db.add(order_item)
        
        db.commit()
        print("✅ Sample data created successfully!")
        
    except Exception as e:
        db.rollback()
        print(f"❌ Error creating sample data: {e}")
        raise
    finally:
        db.close()

def main():
    """Main function to initialize database"""
    print("🚀 Initializing Kukkuta Kendra Database...")
    
    # Create tables
    print("📋 Creating database tables...")
    create_tables()
    print("✅ Tables created successfully!")
    
    # Create sample data
    print("📊 Creating sample data...")
    create_sample_data()
    
    print("🎉 Database initialization completed!")
    print("\n📝 Sample credentials:")
    print("Admin: admin@kukkutakendra.com / admin123")
    print("Farmer 1: farmer1@example.com / farmer123")
    print("Farmer 2: farmer2@example.com / farmer123")
    print("Mill: mill1@example.com / mill123")
    print("Report: report@example.com / report123")

if __name__ == "__main__":
    main() 