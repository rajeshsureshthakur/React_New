"""Dashboard routes placeholder"""
from fastapi import APIRouter

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])

@router.get("/stats")
async def get_stats():
    return {"success": True, "stats": {}}
