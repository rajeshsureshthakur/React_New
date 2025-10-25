"""Release routes placeholder"""
from fastapi import APIRouter

router = APIRouter(prefix="/releases", tags=["Releases"])

@router.get("/by-project/{project_id}")
async def get_releases(project_id: str):
    return {"success": True, "releases": []}
