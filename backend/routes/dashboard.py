"""Dashboard API Routes"""

from fastapi import APIRouter, HTTPException
import logging

from database.mongodb import (
    projects_collection,
    releases_collection,
    users_collection,
    zephyrdata_collection
)

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


@router.get("/stats")
async def get_dashboard_stats():
    """Get dashboard statistics
    
    Returns counts for projects, releases, users, and testcases
    """
    try:
        # Count totals from each collection
        total_projects = await projects_collection.count_documents({})
        total_releases = await releases_collection.count_documents({})
        total_users = await users_collection.count_documents({})
        total_testcases = await zephyrdata_collection.count_documents({})
        
        logger.info(f"✅ Dashboard stats retrieved")
        
        return {
            "success": True,
            "stats": {
                "total_projects": total_projects,
                "total_releases": total_releases,
                "total_users": total_users,
                "total_testcases": total_testcases,
                "active_cycles": 3,  # Mock data as specified
                "requirements": 156  # Mock data as specified
            }
        }
        
    except Exception as e:
        logger.error(f"❌ Error fetching dashboard stats: {e}")
        raise HTTPException(status_code=500, detail="Error fetching dashboard stats")
