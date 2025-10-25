"""Project API Routes

Handles project listing and management.
"""

from fastapi import APIRouter, HTTPException
import logging

from config.queries import ProjectQueries
from utils.database import db_manager

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/projects", tags=["Projects"])


@router.get("/list")
async def get_all_projects():
    """Get all available projects
    
    Used in: Dashboard - Project selection dropdown
    """
    try:
        projects = db_manager.execute_query(ProjectQueries.GET_ALL_PROJECTS)
        
        # Convert to frontend format
        result = [
            {
                "value": str(p['PROJECT_ID']),
                "label": p['PROJECT_NAME']
            }
            for p in projects
        ]
        
        logger.info(f"✅ Retrieved {len(result)} projects")
        return {"success": True, "projects": result}
        
    except Exception as e:
        logger.error(f"❌ Error fetching projects: {e}")
        raise HTTPException(status_code=500, detail="Error fetching projects")


@router.get("/user-projects/{user_id}")
async def get_user_projects(user_id: int):
    """Get projects accessible by a specific user
    
    Used in: Dashboard - Filtered project list based on user access
    """
    try:
        projects = db_manager.execute_query(
            ProjectQueries.GET_USER_PROJECTS,
            {"user_id": user_id}
        )
        
        # Convert to frontend format
        result = [
            {
                "value": str(p['PROJECT_ID']),
                "label": p['PROJECT_NAME']
            }
            for p in projects
        ]
        
        logger.info(f"✅ Retrieved {len(result)} projects for user {user_id}")
        return {"success": True, "projects": result}
        
    except Exception as e:
        logger.error(f"❌ Error fetching user projects: {e}")
        raise HTTPException(status_code=500, detail="Error fetching user projects")


@router.get("/{project_id}")
async def get_project_by_id(project_id: int):
    """Get specific project details
    
    Used in: Project details page
    """
    try:
        project = db_manager.execute_one(
            ProjectQueries.GET_PROJECT_BY_ID,
            {"project_id": project_id}
        )
        
        if not project:
            raise HTTPException(status_code=404, detail="Project not found")
        
        return {
            "success": True,
            "project": {
                "project_id": project['PROJECT_ID'],
                "project_name": project['PROJECT_NAME']
            }
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ Error fetching project: {e}")
        raise HTTPException(status_code=500, detail="Error fetching project")
