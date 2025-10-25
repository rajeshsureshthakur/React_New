"""Main Configuration File

This file contains all application settings and database configuration.
Update this file to adapt the application to different environments.
"""

import os
from pathlib import Path

# Base Directory
BASE_DIR = Path(__file__).resolve().parent.parent

# ============================================================================
# APPLICATION SETTINGS
# ============================================================================
APP_NAME = "CQE Project Management"
APP_VERSION = "1.0.0"
APP_ENV = os.environ.get('APP_ENV', 'development')  # development, staging, production

# ============================================================================
# ORACLE DATABASE CONFIGURATION
# ============================================================================
# Update these settings for your environment
ORACLE_CONFIG = {
    'user': os.environ.get('ORACLE_USER', 'your_username'),
    'password': os.environ.get('ORACLE_PASSWORD', 'your_password'),
    'dsn': os.environ.get('ORACLE_DSN', 'localhost:1521/XEPDB1'),  # Format: host:port/service_name
    'encoding': 'UTF-8',
    'nencoding': 'UTF-8',
    'threaded': True,
    
    # Connection Pool Settings
    'min_pool': 2,
    'max_pool': 10,
    'increment': 1,
    'pool_timeout': 30,
    'max_lifetime_session': 3600
}

# ============================================================================
# API SETTINGS
# ============================================================================
API_PREFIX = '/api'
CORS_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    # Add your production frontend URL here
]

# ============================================================================
# AUTHENTICATION SETTINGS
# ============================================================================
JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY', 'your-secret-key-change-in-production')
JWT_ALGORITHM = 'HS256'
ACCESS_TOKEN_EXPIRE_MINUTES = 480  # 8 hours

# Passcode Settings
PASSCODE_LENGTH = 4
PASSCODE_HASH_ALGORITHM = 'sha256'

# ============================================================================
# LOGGING CONFIGURATION
# ============================================================================
LOGGING_CONFIG = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'default': {
            'format': '[%(asctime)s] %(levelname)s in %(module)s: %(message)s',
        },
    },
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
            'formatter': 'default',
        },
    },
    'root': {
        'level': 'INFO',
        'handlers': ['console'],
    },
}

# ============================================================================
# PAGINATION SETTINGS
# ============================================================================
DEFAULT_PAGE_SIZE = 50
MAX_PAGE_SIZE = 500

# ============================================================================
# FILE UPLOAD SETTINGS
# ============================================================================
UPLOAD_FOLDER = os.path.join(BASE_DIR, 'uploads')
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10 MB
ALLOWED_EXTENSIONS = {'csv', 'xlsx', 'xls', 'txt'}

# ============================================================================
# ENVIRONMENT SPECIFIC OVERRIDES
# ============================================================================
if APP_ENV == 'production':
    from config.environments.production import *
elif APP_ENV == 'staging':
    from config.environments.staging import *
else:
    from config.environments.development import *
