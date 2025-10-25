"""Authentication API Routes with MongoDB"""

from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, Field, validator
import hashlib
import logging
import re
from typing import Optional
from datetime import datetime, timedelta
from jose import jwt

from database.mongodb import users_collection, get_est_time

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/auth", tags=["Authentication"])

# JWT Configuration
JWT_SECRET_KEY = "your-secret-key-change-in-production"
JWT_ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 480


class RegisterRequest(BaseModel):
    soeid: str = Field(..., description="SOEID in format: 2 letters + 5 digits")
    full_name: str = Field(..., description="Full name of the user")
    passcode: str = Field(..., min_length=4, max_length=4, description="4 digit passcode")
    zephyr_token: str = Field(..., description="Zephyr API token")
    jira_token: str = Field(..., description="Jira API token")
    project_id: str = Field(..., description="Project ID")
    project_name: str = Field(..., description="Project Name")
    manager_soeid: str = Field(..., description="Manager/Lead SOEID")
    
    @validator('soeid')
    def validate_soeid(cls, v):
        if not re.match(r'^[A-Za-z]{2}\d{5}$', v):
            raise ValueError('SOEID must be in format: 2 letters + 5 digits (e.g., AB12345)')
        return v.upper()
    
    @validator('passcode')
    def validate_passcode(cls, v):
        if not v.isdigit():
            raise ValueError('Passcode must be 4 digits')
        return v
    
    @validator('manager_soeid')
    def validate_manager_soeid(cls, v):
        if not re.match(r'^[A-Za-z]{2}\d{5}$', v):
            raise ValueError('Manager SOEID must be in format: 2 letters + 5 digits (e.g., AB12345)')
        return v.upper()


class LoginRequest(BaseModel):
    soeid: str
    passcode: str


class LoginResponse(BaseModel):
    success: bool
    message: str
    token: Optional[str] = None
    user: Optional[dict] = None


def hash_password(password: str) -> str:
    """Hash password using SHA256"""
    return hashlib.sha256(password.encode()).hexdigest()


def create_access_token(data: dict) -> str:
    """Create JWT access token"""
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, JWT_SECRET_KEY, algorithm=JWT_ALGORITHM)


@router.post("/register")
async def register(request: RegisterRequest):
    """Register a new user"""
    try:
        # Check if user already exists
        existing_user = await users_collection.find_one({"user_soeid": request.soeid})
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="User with this SOEID already exists"
            )
        
        # Get next user ID
        last_user = await users_collection.find_one(
            sort=[("user_id", -1)]
        )
        next_user_id = (last_user['user_id'] if last_user else 0) + 1
        
        # Hash password
        hashed_password = hash_password(request.passcode)
        
        # Create user document with specified defaults
        user_doc = {
            "user_id": next_user_id,
            "user_soeid": request.soeid,
            "user_name": request.full_name,
            "user_password": hashed_password,
            "user_role": "developer",  # Default as specified
            "user_teamid": "1",  # Default as specified
            "zephyr_token": request.zephyr_token,
            "jira_token": request.jira_token,
            "zephyr_projectid": request.project_id,
            "jira_projectid": request.project_id,  # Same as zephyr_projectid
            "project_name": request.project_name,
            "manager_soeid": request.manager_soeid,
            "last_login": get_est_time(),
            "manager_verified": "0",  # Default as specified
            "zephyr_projectlist": "1,2,3,4",  # Default as specified
            "curr_version": "1.4",  # Default as specified
            "lib_flag": "No",  # Default as specified
            "created_at": get_est_time()
        }
        
        # Insert user
        result = await users_collection.insert_one(user_doc)
        
        logger.info(f"✅ New user registered: {request.soeid}")
        
        return {
            "success": True,
            "message": "Registration successful. Please login.",
            "user_id": next_user_id
        }
        
    except HTTPException:
        raise
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        logger.error(f"❌ Registration error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred during registration"
        )


@router.post("/login", response_model=LoginResponse)
async def login(request: LoginRequest):
    """Authenticate user with SOEID and passcode"""
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
        user = await users_collection.find_one({"user_soeid": request.soeid.upper()})
        
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid SOEID or passcode"
            )
        
        # Verify password
        if hash_password(request.passcode) != user['user_password']:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid SOEID or passcode"
            )
        
        # Update last login
        await users_collection.update_one(
            {"user_id": user['user_id']},
            {"$set": {"last_login": get_est_time()}}
        )
        
        # Create JWT token
        token = create_access_token(
            data={
                "user_id": user['user_id'],
                "soeid": user['user_soeid'],
                "role": user['user_role']
            }
        )
        
        # Prepare user data (exclude password)
        user_data = {
            "user_id": user['user_id'],
            "soeid": user['user_soeid'],
            "name": user['user_name'],
            "role": user['user_role'],
            "team_id": user['user_teamid'],
            "project_list": user.get('zephyr_projectlist', '')
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
