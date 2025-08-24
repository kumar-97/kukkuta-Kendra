from pydantic_settings import BaseSettings
from pydantic import field_validator
from typing import Optional, Union, List
import os

class AzureSettings(BaseSettings):
    # Database
    database_url: str = os.getenv("DATABASE_URL", "postgresql://username:password@localhost/kukkuta_kendra")
    
    # Security
    secret_key: str = os.getenv("SECRET_KEY", "your-secret-key-change-in-production")
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30
    
    # API
    api_v1_prefix: str = "/api/v1"
    project_name: str = "Kukkuta Kendra API"
    version: str = "1.0.0"
    
    # CORS
    allowed_origins: Union[str, List[str]] = ["*"]  # Configure properly for production
    
    @field_validator('allowed_origins', mode='before')
    @classmethod
    def parse_allowed_origins(cls, v):
        if isinstance(v, str):
            if v == "*":
                return ["*"]
            return [v]
        return v
    
    # File Upload
    upload_dir: str = "/tmp/uploads"
    max_file_size: int = 10 * 1024 * 1024  # 10MB
    
    class Config:
        env_file = ".env"

# Create settings instance
azure_settings = AzureSettings() 