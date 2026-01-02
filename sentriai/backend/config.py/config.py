# config.py
import os
from typing import Optional
from pydantic_settings import BaseSettings
from functools import lru_cache

class Settings(BaseSettings):
    """Application settings and configuration"""
    
    # Application Settings
    APP_NAME: str = "SentriAI"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = True
    ENVIRONMENT: str = "development"
    
    # Server Settings
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    RELOAD: bool = True
    
    # API Settings
    API_V1_PREFIX: str = "/api/v1"
    ALLOWED_ORIGINS: list = [
        "http://localhost:3000",
        "http://localhost:5173",
        "http://127.0.0.1:3000",
    ]
    
    # Security
    SECRET_KEY: str = os.getenv("SECRET_KEY", "your-secret-key-change-in-production")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    
    # Firebase Configuration
    FIREBASE_CREDENTIALS_PATH: str = os.getenv("FIREBASE_CREDENTIALS_PATH", "firebase-credentials.json")
    FIREBASE_DATABASE_URL: Optional[str] = os.getenv("FIREBASE_DATABASE_URL")
    
    # MongoDB Configuration
    MONGODB_URL: str = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
    MONGODB_DB_NAME: str = "sentriai_db"
    
    # Redis Configuration
    REDIS_HOST: str = os.getenv("REDIS_HOST", "localhost")
    REDIS_PORT: int = int(os.getenv("REDIS_PORT", "6379"))
    REDIS_DB: int = 0
    REDIS_PASSWORD: Optional[str] = os.getenv("REDIS_PASSWORD")
    
    # WebSocket Settings
    WS_HEARTBEAT_INTERVAL: int = 30  # seconds
    WS_TIMEOUT: int = 60  # seconds
    
    # AI Model Settings
    YOLO_MODEL_PATH: str = "models/yolov8n.pt"
    CROWD_DETECTION_MODEL: str = "models/crowd_detection.h5"
    PANIC_DETECTION_MODEL: str = "models/panic_audio.h5"
    
    # Computer Vision Settings
    FRAME_SKIP: int = 3  # Process every nth frame
    DETECTION_CONFIDENCE: float = 0.5
    NMS_THRESHOLD: float = 0.4
    
    # Crowd Density Thresholds
    CROWD_DENSITY_LOW: int = 30
    CROWD_DENSITY_MODERATE: int = 60
    CROWD_DENSITY_HIGH: int = 85
    CROWD_DENSITY_CRITICAL: int = 95
    
    # Risk Score Thresholds
    RISK_THRESHOLD_LOW: int = 30
    RISK_THRESHOLD_MEDIUM: int = 50
    RISK_THRESHOLD_HIGH: int = 75
    RISK_THRESHOLD_CRITICAL: int = 90
    
    # Alert Settings
    ALERT_COOLDOWN_SECONDS: int = 30  # Prevent duplicate alerts
    MAX_ALERTS_PER_MINUTE: int = 10
    AUTO_RESOLVE_ALERTS_AFTER: int = 3600  # 1 hour in seconds
    
    # Camera Settings
    CAMERA_RECONNECT_ATTEMPTS: int = 3
    CAMERA_TIMEOUT: int = 10  # seconds
    DEFAULT_CAMERA_FPS: int = 30
    
    # Social Media APIs
    TWITTER_API_KEY: Optional[str] = os.getenv("TWITTER_API_KEY")
    TWITTER_API_SECRET: Optional[str] = os.getenv("TWITTER_API_SECRET")
    TWITTER_ACCESS_TOKEN: Optional[str] = os.getenv("TWITTER_ACCESS_TOKEN")
    TWITTER_ACCESS_SECRET: Optional[str] = os.getenv("TWITTER_ACCESS_SECRET")
    
    REDDIT_CLIENT_ID: Optional[str] = os.getenv("REDDIT_CLIENT_ID")
    REDDIT_CLIENT_SECRET: Optional[str] = os.getenv("REDDIT_CLIENT_SECRET")
    REDDIT_USER_AGENT: str = "SentriAI/1.0"
    
    # Twilio (SMS Alerts - Optional)
    TWILIO_ACCOUNT_SID: Optional[str] = os.getenv("TWILIO_ACCOUNT_SID")
    TWILIO_AUTH_TOKEN: Optional[str] = os.getenv("TWILIO_AUTH_TOKEN")
    TWILIO_PHONE_NUMBER: Optional[str] = os.getenv("TWILIO_PHONE_NUMBER")
    
    # Email Settings (Optional)
    SMTP_HOST: Optional[str] = os.getenv("SMTP_HOST")
    SMTP_PORT: int = int(os.getenv("SMTP_PORT", "587"))
    SMTP_USER: Optional[str] = os.getenv("SMTP_USER")
    SMTP_PASSWORD: Optional[str] = os.getenv("SMTP_PASSWORD")
    
    # File Upload Settings
    MAX_UPLOAD_SIZE: int = 10 * 1024 * 1024  # 10MB
    ALLOWED_VIDEO_FORMATS: list = [".mp4", ".avi", ".mov", ".mkv"]
    ALLOWED_IMAGE_FORMATS: list = [".jpg", ".jpeg", ".png"]
    UPLOAD_DIR: str = "uploads"
    
    # Logging Settings
    LOG_LEVEL: str = "INFO"
    LOG_FILE: str = "logs/sentriai.log"
    LOG_MAX_BYTES: int = 10 * 1024 * 1024  # 10MB
    LOG_BACKUP_COUNT: int = 5
    
    # Celery (Background Tasks)
    CELERY_BROKER_URL: str = os.getenv("CELERY_BROKER_URL", "redis://localhost:6379/0")
    CELERY_RESULT_BACKEND: str = os.getenv("CELERY_RESULT_BACKEND", "redis://localhost:6379/0")
    
    # Analytics Settings
    ANALYTICS_RETENTION_DAYS: int = 90
    HEATMAP_GRID_SIZE: int = 50  # Grid cells for heatmap
    
    # Geolocation Settings
    DEFAULT_LOCATION_LAT: float = 17.385044  # Hyderabad
    DEFAULT_LOCATION_LNG: float = 78.486671
    GEOFENCE_RADIUS_METERS: float = 5000.0  # 5km
    
    # Rate Limiting
    RATE_LIMIT_REQUESTS: int = 100
    RATE_LIMIT_PERIOD: int = 60  # seconds
    
    # Drone Settings (Future Scope)
    DRONE_MAX_ALTITUDE: int = 120  # meters
    DRONE_MAX_SPEED: int = 15  # m/s
    DRONE_BATTERY_THRESHOLD: int = 20  # percent
    
    # Performance Settings
    MAX_WORKERS: int = 4
    THREAD_POOL_SIZE: int = 10
    
    # Panic Detection Keywords
    PANIC_KEYWORDS: list = [
        "stampede", "crush", "panic", "emergency", "help",
        "trapped", "danger", "fire", "fight", "chaos", "scared"
    ]
    
    # Audio Processing
    AUDIO_SAMPLE_RATE: int = 22050
    AUDIO_CHUNK_SIZE: int = 1024
    AUDIO_CHANNELS: int = 1
    
    # Model Update Settings
    MODEL_UPDATE_CHECK_HOURS: int = 24
    AUTO_UPDATE_MODELS: bool = False
    
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = True


@lru_cache()
def get_settings() -> Settings:
    """
    Get cached settings instance.
    Uses lru_cache to avoid recreating settings on every call.
    """
    return Settings()


# Create settings instance
settings = get_settings()


# Database connection strings
def get_mongodb_url() -> str:
    """Get MongoDB connection URL"""
    return settings.MONGODB_URL


def get_redis_url() -> str:
    """Get Redis connection URL"""
    if settings.REDIS_PASSWORD:
        return f"redis://:{settings.REDIS_PASSWORD}@{settings.REDIS_HOST}:{settings.REDIS_PORT}/{settings.REDIS_DB}"
    return f"redis://{settings.REDIS_HOST}:{settings.REDIS_PORT}/{settings.REDIS_DB}"


# Validate critical settings on startup
def validate_settings():
    """Validate critical configuration settings"""
    errors = []
    
    if settings.SECRET_KEY == "your-secret-key-change-in-production" and settings.ENVIRONMENT == "production":
        errors.append("SECRET_KEY must be changed in production")
    
    if not os.path.exists(settings.FIREBASE_CREDENTIALS_PATH):
        errors.append(f"Firebase credentials file not found: {settings.FIREBASE_CREDENTIALS_PATH}")
    
    if not os.path.exists(settings.UPLOAD_DIR):
        os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
    
    if not os.path.exists("logs"):
        os.makedirs("logs", exist_ok=True)
    
    if errors:
        raise ValueError(f"Configuration errors: {', '.join(errors)}")
    
    return True


# Export commonly used settings
__all__ = [
    "settings",
    "get_settings",
    "get_mongodb_url",
    "get_redis_url",
    "validate_settings"
]