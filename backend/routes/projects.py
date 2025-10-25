"""Project routes placeholder"""
from fastapi import APIRouter

router = APIRouter(prefix="/projects", tags=["Projects"])

@router.get("/list")
async def get_projects():
    return {"success": True, "projects": []}
