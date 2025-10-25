"""Authentication API Routes

Handles user login, registration, and token management.
"""

from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel
import logging
from typing import Optional

from config.queries import UserQueries
from utils.database import db_manager
from utils.auth import verify_password, create_access_token, hash_password

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/auth", tags=["Authentication"])


class LoginRequest(BaseModel):
    soeid: str
    passcode: str


class LoginResponse(BaseModel):
    success: bool
    message: str
    token: Optional[str] = None
    user: Optional[dict] = None


class RegisterRequest(BaseModel):
    soeid: str
    name: str
    passcode: str
    role: str = "Developer"
    team_id: str = "TEAM-A"


@router.post("/login", response_model=LoginResponse)
async def login(request: LoginRequest):
    """Authenticate user with SOEID and passcode
    
    Used in: Login page
    """
    try:
        # Validate inputs
        if not request.soeid or not request.passcode:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="SOEID and passcode are required"
            )
        
        if len(request.passcode) != 4:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Passcode must be exactly 4 digits"
            )
        
        # Get user from database
        user = db_manager.execute_one(
            UserQueries.GET_USER_BY_SOEID,
            {"soeid": request.soeid}
        )
        
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid SOEID or passcode"
            )
        
        # Verify password
        if not verify_password(request.passcode, user['USER_PASSWORD']):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid SOEID or passcode"
            )
        
        # Update last login
        db_manager.execute_update(
            UserQueries.UPDATE_LAST_LOGIN,
            {"user_id": user['USER_ID']}
        )
        
        # Create JWT token
        token = create_access_token(
            data={
                "user_id": user['USER_ID'],
                "soeid": user['USER_SOEID'],
                "role": user['USER_ROLE']
            }
        )
        
        # Prepare user data (exclude password)
        user_data = {
            "user_id": user['USER_ID'],
            "soeid": user['USER_SOEID'],
            "name": user['USER_NAME'],
            "role": user['USER_ROLE'],
            "team_id": user['USER_TEAMID'],
            "project_list": user['ZEPHYR_PROJECTLIST']
        }
        
        logger.info(f"✅ User logged in: {request.soeid}")
        
        return LoginResponse(
            success=True,
            message="Login successful",
            token=token,
            user=user_data
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ Login error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred during login"
        )


@router.post("/register")
async def register(request: RegisterRequest):
    """Register a new user
    
    Used in: Registration page
    """
    try:
        # Check if user already exists
        existing_user = db_manager.execute_one(
            UserQueries.GET_USER_BY_SOEID,
            {"soeid": request.soeid}
        )
        
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="User with this SOEID already exists"
            )
        
        # Get next user ID
        from config.queries import UtilityQueries
        result = db_manager.execute_one(UtilityQueries.GET_NEXT_USER_ID)
        next_id = result['NEXT_ID']
        
        # Hash password
        hashed_password = hash_password(request.passcode)
        
        # Insert user
        db_manager.execute_update(
            UserQueries.INSERT_USER,
            {
                "user_id": next_id,
                "soeid": request.soeid,
                "user_name": request.name,
                "password": hashed_password,
                "role": request.role,
                "team_id": request.team_id,
                "manager_verified": "NO",
                "version": "1.0",
                "lib_flag": "N"
            }
        )
        
        logger.info(f"✅ New user registered: {request.soeid}")
        
        return {
            "success": True,
            "message": "Registration successful. Please login."
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ Registration error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred during registration"
        )
