"""Release API Routes"""

from fastapi import APIRouter, HTTPException
import logging

from database.mongodb import releases_collection

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/releases", tags=["Releases"])


@router.get("/by-project/{project_id}")
async def get_releases_by_project(project_id: int):
    """Get all releases for a specific project
    
    Args:
        project_id: Project ID
        
    Returns:
        List of releases for the project
    """
    try:
        # Fetch releases from database
        releases = await releases_collection.find(
            {"project_id": project_id}
        ).sort("id", -1).to_list(length=None)
        
        # Format response
        result = [
            {
                "id": r['id'],
                "name": r.get('name', f"Release {r['id']}"),
                "project_id": r['project_id']
            }
            for r in releases
        ]
        
        logger.info(f"✅ Retrieved {len(result)} releases for project {project_id}")
        return {"success": True, "releases": result}
        
    except Exception as e:
        logger.error(f"❌ Error fetching releases: {e}")
        raise HTTPException(status_code=500, detail="Error fetching releases")
