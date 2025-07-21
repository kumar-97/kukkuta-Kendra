# Kukkuta Kendra Backend API

A comprehensive Python FastAPI backend for the Kukkuta Kendra poultry farming management system.

## 🚀 Features

- **Multi-role Authentication**: Support for Farmers, Mills, Admins, and Report viewers
- **Farmer Management**: Profile management, farm registration, and verification
- **Mill Operations**: Feed order management, inventory tracking, and delivery status
- **Routine Data Tracking**: Daily farm routine data, mortality records, and performance metrics
- **Production Reports**: Comprehensive production reporting with cost analysis
- **Admin Dashboard**: Analytics, user management, and system monitoring
- **File Upload**: Support for mortality photos and document uploads
- **RESTful API**: Clean, documented API endpoints with automatic OpenAPI documentation

## 🏗️ Architecture

```
backend/
├── app/
│   ├── __init__.py
│   ├── config.py              # Configuration management
│   ├── database.py            # Database connection and session
│   ├── models/                # SQLAlchemy models
│   │   ├── __init__.py
│   │   ├── user.py           # User and authentication models
│   │   ├── farmer.py         # Farmer and farm models
│   │   ├── mill.py           # Mill and feed order models
│   │   ├── routine.py        # Daily routine data models
│   │   ├── production.py     # Production report models
│   │   └── admin.py          # Admin activity models
│   ├── schemas/              # Pydantic schemas for API
│   │   ├── __init__.py
│   │   ├── user.py
│   │   ├── farmer.py
│   │   ├── mill.py
│   │   ├── routine.py
│   │   └── production.py
│   ├── auth/                 # Authentication and security
│   │   ├── __init__.py
│   │   ├── security.py       # Password hashing and JWT
│   │   └── dependencies.py   # Role-based access control
│   └── api/                  # API routes
│       ├── __init__.py
│       ├── auth.py           # Authentication endpoints
│       ├── farmers.py        # Farmer management
│       ├── mills.py          # Mill operations
│       ├── routine.py        # Routine data management
│       ├── production.py     # Production reports
│       └── admin.py          # Admin dashboard
├── scripts/
│   └── init_db.py           # Database initialization
├── main.py                  # FastAPI application
├── requirements.txt         # Python dependencies
└── README.md               # This file
```

## 🛠️ Installation

### Prerequisites

- Python 3.8+
- PostgreSQL database
- Redis (optional, for caching)

### Setup

1. **Clone and navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Create virtual environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure environment**
   ```bash
   cp env_example.txt .env
   # Edit .env with your database and other settings
   ```

5. **Initialize database**
   ```bash
   python scripts/init_db.py
   ```

6. **Run the application**
   ```bash
   python main.py
   # Or with uvicorn
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

## 📚 API Documentation

Once the server is running, visit:
- **Interactive API Docs**: http://localhost:8000/docs
- **ReDoc Documentation**: http://localhost:8000/redoc
- **Health Check**: http://localhost:8000/health

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

### User Roles

1. **Farmer**: Can manage farms, routine data, and production reports
2. **Mill**: Can manage feed orders and inventory
3. **Admin**: Full system access and user management
4. **Report**: Read-only access to reports and analytics

## 📋 API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login and get token
- `GET /api/v1/auth/me` - Get current user info
- `POST /api/v1/auth/refresh` - Refresh access token

### Farmers
- `GET /api/v1/farmers/me` - Get current farmer profile
- `PUT /api/v1/farmers/me` - Update farmer profile
- `GET /api/v1/farmers/farms` - Get farmer's farms
- `POST /api/v1/farmers/farms` - Create new farm
- `PUT /api/v1/farmers/farms/{id}` - Update farm
- `DELETE /api/v1/farmers/farms/{id}` - Delete farm

### Mills
- `GET /api/v1/mills/me` - Get current mill profile
- `PUT /api/v1/mills/me` - Update mill profile
- `GET /api/v1/mills/orders` - Get mill's orders
- `PUT /api/v1/mills/orders/{id}/status` - Update order status
- `GET /api/v1/mills/feed-types` - Get available feed types

### Routine Data
- `POST /api/v1/routine/` - Create routine data
- `GET /api/v1/routine/` - Get routine data with filters
- `PUT /api/v1/routine/{id}` - Update routine data
- `DELETE /api/v1/routine/{id}` - Delete routine data
- `POST /api/v1/routine/mortality` - Create mortality record
- `POST /api/v1/routine/upload-photo` - Upload mortality photo

### Production Reports
- `POST /api/v1/production/reports` - Create production report
- `GET /api/v1/production/reports` - Get production reports
- `PUT /api/v1/production/reports/{id}` - Update production report
- `DELETE /api/v1/production/reports/{id}` - Delete production report
- `POST /api/v1/production/cost-details` - Add cost details

### Admin
- `GET /api/v1/admin/dashboard` - Get admin dashboard stats
- `GET /api/v1/admin/analytics/farmers` - Farmer analytics
- `GET /api/v1/admin/analytics/orders` - Order analytics
- `GET /api/v1/admin/analytics/production` - Production analytics
- `GET /api/v1/admin/logs` - Get admin activity logs
- `GET /api/v1/admin/system-stats` - System statistics

## 🗄️ Database Schema

### Core Tables
- **users**: User accounts and authentication
- **farmers**: Farmer profiles and details
- **farms**: Farm information and capacity
- **mills**: Mill profiles and operations
- **feed_types**: Available feed types and pricing
- **feed_orders**: Feed order management
- **feed_order_items**: Individual order items
- **routine_data**: Daily farm routine data
- **mortality_records**: Mortality tracking
- **production_reports**: Production reports
- **cost_details**: Cost breakdown for reports
- **admin_logs**: Admin activity tracking

## 🔧 Configuration

Key configuration options in `.env`:

```env
# Database
DATABASE_URL=postgresql://username:password@localhost:5432/kukkuta_kendra

# Security
SECRET_KEY=your-secret-key-here
ACCESS_TOKEN_EXPIRE_MINUTES=30

# File Upload
UPLOAD_DIR=uploads
MAX_FILE_SIZE=10485760

# API
API_V1_STR=/api/v1
BACKEND_CORS_ORIGINS=["http://localhost:3000", "http://localhost:8081"]
```

## 🧪 Testing

Run tests with pytest:

```bash
pytest tests/ -v
```

## 🚀 Deployment

### Production Setup

1. **Environment Variables**: Set all production environment variables
2. **Database**: Use production PostgreSQL instance
3. **File Storage**: Configure AWS S3 or similar for file uploads
4. **SSL**: Enable HTTPS with proper certificates
5. **Monitoring**: Set up logging and monitoring

### Docker Deployment

```dockerfile
FROM python:3.9-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .
EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

## 📊 Sample Data

The initialization script creates sample data with these credentials:

- **Admin**: admin@kukkutakendra.com / admin123
- **Farmer 1**: farmer1@example.com / farmer123
- **Farmer 2**: farmer2@example.com / farmer123
- **Mill**: mill1@example.com / mill123
- **Report**: report@example.com / report123

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the API documentation at `/docs`
- Review the logs for debugging information 