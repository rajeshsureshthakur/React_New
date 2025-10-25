"""Development Environment Configuration"""

# Override for development environment
ORACLE_CONFIG_DEV = {
    'user': 'dev_user',
    'password': 'dev_password',
    'dsn': 'localhost:1521/XEPDB1',
}

# Merge with main config
from config.config import ORACLE_CONFIG
ORACLE_CONFIG.update(ORACLE_CONFIG_DEV)

# Development-specific settings
DEBUG = True
LOG_LEVEL = 'DEBUG'
