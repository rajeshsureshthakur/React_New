"""Staging Environment Configuration"""

# Override for staging environment
ORACLE_CONFIG_STAGING = {
    'user': 'staging_user',
    'password': 'staging_password',
    'dsn': 'staging-db-host:1521/staging_service',
}

# Merge with main config
from config.config import ORACLE_CONFIG
ORACLE_CONFIG.update(ORACLE_CONFIG_STAGING)

# Staging-specific settings
DEBUG = False
LOG_LEVEL = 'INFO'
