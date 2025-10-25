"""MongoDB Database Connection and Utilities"""

from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from datetime import datetime
import pytz

logger = logging.getLogger(__name__)

# MongoDB connection
mongo_url = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ.get('DB_NAME', 'cqe_management')]

# Collections
users_collection = db['users']
projects_collection = db['projects']
releases_collection = db['releases']
zephyrdata_collection = db['zephyrdata']


async def test_connection():
    """Test database connectivity"""
    try:
        await client.admin.command('ping')
        return True
    except Exception as e:
        logger.error(f"Database connection failed: {e}")
        return False


def get_est_time():
    """Get current time in EST timezone"""
    return datetime.now(pytz.timezone('US/Eastern'))
