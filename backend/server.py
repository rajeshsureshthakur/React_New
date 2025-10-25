from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import logging
import os

from config.config import CORS_ORIGINS, API_PREFIX, APP_NAME, APP_VERSION
from routes import auth, projects, releases, dashboard
from utils.database import db_manager

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='[%(asctime)s] %(levelname)s in %(name)s: %(message)s'
)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title=APP_NAME,
    version=APP_VERSION,
    description="CQE Project Management System - Backend API with Oracle DB"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routers
app.include_router(auth.router, prefix=API_PREFIX)
app.include_router(projects.router, prefix=API_PREFIX)
app.include_router(releases.router, prefix=API_PREFIX)
app.include_router(dashboard.router, prefix=API_PREFIX)


@app.on_event("startup")
async def startup_event():
    """Test database connection on startup"""
    logger.info(f"🚀 Starting {APP_NAME} v{APP_VERSION}")
    
    # Test database connection
    try:
        if db_manager.test_connection():
            logger.info("✅ Database connection verified")
        else:
            logger.warning("⚠️ Database connection test failed - check config")
    except Exception as e:
        logger.error(f"❌ Database initialization error: {e}")
        logger.warning("⚠️ Application starting without database connection")


@app.on_event("shutdown")
async def shutdown_event():
    """Cleanup on shutdown"""
    logger.info("🛑 Shutting down application")
    db_manager.close_pool()


@app.get("/api")
async def root():
    return {
        "message": "CQE Project Management API",
        "version": APP_VERSION,
        "status": "running"
    }


@app.get("/api/health")
async def health_check():
    """Health check endpoint"""
    try:
        db_status = "connected" if db_manager.test_connection() else "disconnected"
    except:
        db_status = "disconnected"
    
    return {
        "status": "healthy",
        "database": db_status,
        "version": APP_VERSION
    }
