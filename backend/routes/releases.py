"""Release API Routes

Handles release listing and management.
"""

from fastapi import APIRouter, HTTPException
import logging

from config.queries import ReleaseQueries
from utils.database import db_manager

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/releases", tags=["Releases"])


@router.get("/by-project/{project_id}")
async def get_releases_by_project(project_id: int):
    """Get all releases for a specific project
    
    Used in: Dashboard - Release selection dropdown
    """
    try:
        releases = db_manager.execute_query(
            ReleaseQueries.GET_RELEASES_BY_PROJECT,
            {"project_id": project_id}
        )
        
        # Convert to frontend format
        result = [
            {
                "value": str(r['RELEASE_ID']),
                "label": r['RELEASE_NAME'],
                "start_date": r['RELEASE_START_DATE'].isoformat() if r['RELEASE_START_DATE'] else None,
                "end_date": r['RELEASE_END_DATE'].isoformat() if r['RELEASE_END_DATE'] else None
            }
            for r in releases
        ]
        
        logger.info(f"✅ Retrieved {len(result)} releases for project {project_id}")
        return {"success": True, "releases": result}
        
    except Exception as e:
        logger.error(f"❌ Error fetching releases: {e}")
        raise HTTPException(status_code=500, detail="Error fetching releases")


@router.get("/{release_id}")
async def get_release_by_id(release_id: int):
    """Get specific release details
    
    Used in: Release details page
    """
    try:
        release = db_manager.execute_one(
            ReleaseQueries.GET_RELEASE_BY_ID,
            {"release_id": release_id}
        )
        
        if not release:
            raise HTTPException(status_code=404, detail="Release not found")
        
        return {
            "success": True,
            "release": {
                "release_id": release['RELEASE_ID'],
                "project_id": release['PROJECT_ID'],
                "release_name": release['RELEASE_NAME'],
                "start_date": release['RELEASE_START_DATE'].isoformat() if release['RELEASE_START_DATE'] else None,
                "end_date": release['RELEASE_END_DATE'].isoformat() if release['RELEASE_END_DATE'] else None,
                "build_release": release['BUILD_RELEASE'],
                "confluence_pageid": release['CONFLUENCE_PAGEID']
            }
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ Error fetching release: {e}")
        raise HTTPException(status_code=500, detail="Error fetching release")


@router.get("/active")
async def get_active_releases():
    """Get currently active releases
    
    Used in: Dashboard - Active releases widget
    """
    try:
        releases = db_manager.execute_query(ReleaseQueries.GET_ACTIVE_RELEASES)
        
        result = [
            {
                "release_id": r['RELEASE_ID'],
                "project_id": r['PROJECT_ID'],
                "release_name": r['RELEASE_NAME'],
                "start_date": r['RELEASE_START_DATE'].isoformat() if r['RELEASE_START_DATE'] else None,
                "end_date": r['RELEASE_END_DATE'].isoformat() if r['RELEASE_END_DATE'] else None
            }
            for r in releases
        ]
        
        logger.info(f"✅ Retrieved {len(result)} active releases")
        return {"success": True, "releases": result}
        
    except Exception as e:
        logger.error(f"❌ Error fetching active releases: {e}")
        raise HTTPException(status_code=500, detail="Error fetching active releases")
