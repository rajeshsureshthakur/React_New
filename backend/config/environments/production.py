"""Production Environment Configuration"""

# Override for production environment
# IMPORTANT: Use environment variables for production credentials
import os

ORACLE_CONFIG_PROD = {
    'user': os.environ.get('ORACLE_USER'),
    'password': os.environ.get('ORACLE_PASSWORD'),
    'dsn': os.environ.get('ORACLE_DSN'),
}

# Merge with main config
from config.config import ORACLE_CONFIG
ORACLE_CONFIG.update(ORACLE_CONFIG_PROD)

# Production-specific settings
DEBUG = False
LOG_LEVEL = 'WARNING'
CORS_ORIGINS = [os.environ.get('FRONTEND_URL')]
