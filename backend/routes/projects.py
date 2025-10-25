"""Project API Routes"""

from fastapi import APIRouter, HTTPException
import logging

from database.mongodb import projects_collection, users_collection

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/projects", tags=["Projects"])


@router.get("/user/{user_soeid}")
async def get_user_projects(user_soeid: str):
    """Get projects for a specific user from their zephyr_projectlist
    
    Args:
        user_soeid: User's SOEID
        
    Returns:
        List of projects user has access to
    """
    try:
        # Get user from database
        user = await users_collection.find_one({"user_soeid": user_soeid.upper()})
        
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        # Get project IDs from zephyr_projectlist (comma-separated)
        project_list = user.get('zephyr_projectlist', '')
        if not project_list:
            return {"success": True, "projects": []}
        
        # Split project IDs
        project_ids = [int(pid.strip()) for pid in project_list.split(',') if pid.strip()]
        
        # Fetch projects from database
        projects = await projects_collection.find(
            {"project_id": {"$in": project_ids}}
        ).to_list(length=None)
        
        # Format response
        result = [
            {
                "id": p['project_id'],
                "name": p['project_name']
            }
            for p in projects
        ]
        
        logger.info(f"✅ Retrieved {len(result)} projects for user {user_soeid}")
        return {"success": True, "projects": result}
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ Error fetching user projects: {e}")
        raise HTTPException(status_code=500, detail="Error fetching user projects")
