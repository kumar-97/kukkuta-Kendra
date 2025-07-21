from pydantic_settings import BaseSettings
from typing import List, Optional
import os


class Settings(BaseSettings):
    # Database
    database_url: str = "sqlite:///./kukkuta_kendra.db"
    test_database_url: str = "sqlite:///./kukkuta_kendra_test.db"
    
    # Security
    secret_key: str = "09d25e094faa6ca2556c818166b7a9563b93f7099f6f0f4caa6cf63b88e8d3e7"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30
    
    # File Upload
    upload_dir: str = "uploads"
    max_file_size: int = 10485760  # 10MB
    
    # AWS S3
    aws_access_key_id: Optional[str] = None
    aws_secret_access_key: Optional[str] = None
    aws_region: str = "us-east-1"
    aws_bucket_name: Optional[str] = None
    
    # Redis
    redis_url: str = "redis://localhost:6379"
    
    # Email
    smtp_host: str = "smtp.gmail.com"
    smtp_port: int = 587
    smtp_user: Optional[str] = None
    smtp_password: Optional[str] = None
    
    # API
    api_v1_str: str = "/api/v1"
    project_name: str = "Kukkuta Kendra API"
    backend_cors_origins: List[str] = ["http://localhost:3000", "http://localhost:8081"]
    
    # Environment
    environment: str = "development"
    debug: bool = True
    
    class Config:
        env_file = ".env"
        case_sensitive = False


settings = Settings() 