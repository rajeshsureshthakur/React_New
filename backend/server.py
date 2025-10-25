from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import logging
import os
from datetime import datetime
import pytz

from routes import auth, projects, releases, dashboard
from database.mongodb import db, test_connection

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='[%(asctime)s] %(levelname)s in %(name)s: %(message)s'
)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="CQE Project Management",
    version="1.4",
    description="CQE Project Management System - Backend API"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=os.environ.get('CORS_ORIGINS', 'http://localhost:3000').split(','),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routers
app.include_router(auth.router, prefix="/api")
app.include_router(projects.router, prefix="/api")
app.include_router(releases.router, prefix="/api")
app.include_router(dashboard.router, prefix="/api")


@app.on_event("startup")
async def startup_event():
    """Test database connection on startup"""
    logger.info("🚀 Starting CQE Project Management v1.4")
    
    # Test database connection
    if await test_connection():
        logger.info("✅ Database connection verified")
    else:
        logger.warning("⚠️ Database connection test failed")


@app.get("/api")
async def root():
    return {
        "message": "CQE Project Management API",
        "version": "1.4",
        "status": "running"
    }


@app.get("/api/health")
async def health_check():
    """Health check endpoint"""
    db_status = "connected" if await test_connection() else "disconnected"
    
    return {
        "status": "healthy",
        "database": db_status,
        "version": "1.4",
        "timestamp": datetime.now(pytz.timezone('US/Eastern')).isoformat()
    }
