"""SQL Queries Configuration

All SQL queries are defined here with proper comments indicating where they are used.
This makes it easy to maintain and update queries in one central location.

Naming Convention:
- SELECT queries: GET_*
- INSERT queries: INSERT_*
- UPDATE queries: UPDATE_*
- DELETE queries: DELETE_*
"""

# ============================================================================
# USER QUERIES
# ============================================================================

class UserQueries:
    """All user-related database queries"""
    
    # Used in: Login API (/api/auth/login)
    # Validates user credentials and retrieves user information
    GET_USER_BY_SOEID = """
        SELECT 
            USER_ID,
            USER_SOEID,
            USER_NAME,
            MANAGER_SOEID,
            MANAGER_ID,
            USER_ROLE,
            USER_PASSWORD,
            USER_TEAMID,
            ZEPHYR_PROJECTID,
            JIRA_PROJECTID,
            ZEPHYR_TOKEN,
            JIRA_TOKEN,
            ZEPHYR_BASEFOLDERID,
            LAST_LOGIN,
            MANAGER_VERIFIED,
            ZEPHYR_PROJECTLIST,
            CURR_VERSION,
            LIB_FLAG
        FROM USERS
        WHERE USER_SOEID = :soeid
    """
    
    # Used in: User Profile API (/api/users/profile)
    # Retrieves user information by user ID
    GET_USER_BY_ID = """
        SELECT 
            USER_ID,
            USER_SOEID,
            USER_NAME,
            MANAGER_SOEID,
            MANAGER_ID,
            USER_ROLE,
            USER_TEAMID,
            ZEPHYR_PROJECTID,
            JIRA_PROJECTID,
            LAST_LOGIN,
            MANAGER_VERIFIED,
            ZEPHYR_PROJECTLIST,
            CURR_VERSION,
            LIB_FLAG
        FROM USERS
        WHERE USER_ID = :user_id
    """
    
    # Used in: Registration API (/api/auth/register)
    # Creates a new user account
    INSERT_USER = """
        INSERT INTO USERS (
            USER_ID,
            USER_SOEID,
            USER_NAME,
            USER_PASSWORD,
            USER_ROLE,
            USER_TEAMID,
            LAST_LOGIN,
            MANAGER_VERIFIED,
            CURR_VERSION,
            LIB_FLAG
        ) VALUES (
            :user_id,
            :soeid,
            :user_name,
            :password,
            :role,
            :team_id,
            SYSDATE,
            :manager_verified,
            :version,
            :lib_flag
        )
    """
    
    # Used in: Login API (/api/auth/login)
    # Updates last login timestamp
    UPDATE_LAST_LOGIN = """
        UPDATE USERS
        SET LAST_LOGIN = SYSDATE
        WHERE USER_ID = :user_id
    """
    
    # Used in: Change Passcode API (/api/users/change-passcode)
    # Updates user's passcode
    UPDATE_PASSWORD = """
        UPDATE USERS
        SET USER_PASSWORD = :password
        WHERE USER_ID = :user_id
    """
    
    # Used in: Change Role API (/api/users/change-role)
    # Updates user's role
    UPDATE_USER_ROLE = """
        UPDATE USERS
        SET USER_ROLE = :role
        WHERE USER_ID = :user_id
    """
    
    # Used in: Update User Tokens API (/api/users/update-tokens)
    # Updates Zephyr and Jira tokens for API integration
    UPDATE_USER_TOKENS = """
        UPDATE USERS
        SET ZEPHYR_TOKEN = :zephyr_token,
            JIRA_TOKEN = :jira_token
        WHERE USER_ID = :user_id
    """
    
    # Used in: User List API (/api/users/list)
    # Retrieves all users for admin panel
    GET_ALL_USERS = """
        SELECT 
            USER_ID,
            USER_SOEID,
            USER_NAME,
            USER_ROLE,
            USER_TEAMID,
            LAST_LOGIN,
            MANAGER_VERIFIED
        FROM USERS
        ORDER BY USER_NAME
    """


# ============================================================================
# PROJECT QUERIES
# ============================================================================

class ProjectQueries:
    """All project-related database queries"""
    
    # Used in: Dashboard page - Project dropdown (/api/projects/list)
    # Retrieves all available projects
    GET_ALL_PROJECTS = """
        SELECT 
            PROJECT_ID,
            PROJECT_NAME
        FROM PROJECTS
        ORDER BY PROJECT_NAME
    """
    
    # Used in: Project Details API (/api/projects/:id)
    # Retrieves specific project information
    GET_PROJECT_BY_ID = """
        SELECT 
            PROJECT_ID,
            PROJECT_NAME
        FROM PROJECTS
        WHERE PROJECT_ID = :project_id
    """
    
    # Used in: User's Project List (/api/projects/user-projects)
    # Retrieves projects assigned to a specific user from ZEPHYR_PROJECTLIST
    GET_USER_PROJECTS = """
        SELECT 
            PROJECT_ID,
            PROJECT_NAME
        FROM PROJECTS
        WHERE PROJECT_ID IN (
            SELECT REGEXP_SUBSTR(ZEPHYR_PROJECTLIST, '[^,]+', 1, LEVEL)
            FROM USERS
            WHERE USER_ID = :user_id
            CONNECT BY LEVEL <= REGEXP_COUNT(ZEPHYR_PROJECTLIST, ',') + 1
        )
        ORDER BY PROJECT_NAME
    """
    
    # Used in: Create Project API (/api/projects/create)
    # Creates a new project
    INSERT_PROJECT = """
        INSERT INTO PROJECTS (
            PROJECT_ID,
            PROJECT_NAME
        ) VALUES (
            :project_id,
            :project_name
        )
    """
    
    # Used in: Update Project API (/api/projects/:id)
    # Updates project name
    UPDATE_PROJECT = """
        UPDATE PROJECTS
        SET PROJECT_NAME = :project_name
        WHERE PROJECT_ID = :project_id
    """


# ============================================================================
# RELEASE QUERIES
# ============================================================================

class ReleaseQueries:
    """All release-related database queries"""
    
    # Used in: Dashboard page - Release dropdown (/api/releases/by-project)
    # Retrieves all releases for a specific project
    GET_RELEASES_BY_PROJECT = """
        SELECT 
            RELEASE_ID,
            PROJECT_ID,
            RELEASE_NAME,
            RELEASE_START_DATE,
            RELEASE_END_DATE,
            BUILD_RELEASE,
            CONFLUENCE_PAGEID,
            CONFLUENCE_TOKEN,
            CONF_UPDATE,
            CONFTEAM_NAME,
            CONFEND_DATE
        FROM RELEASES
        WHERE PROJECT_ID = :project_id
        ORDER BY RELEASE_START_DATE DESC
    """
    
    # Used in: Release Details API (/api/releases/:id)
    # Retrieves specific release information
    GET_RELEASE_BY_ID = """
        SELECT 
            RELEASE_ID,
            PROJECT_ID,
            RELEASE_NAME,
            RELEASE_START_DATE,
            RELEASE_END_DATE,
            BUILD_RELEASE,
            CONFLUENCE_PAGEID,
            CONFLUENCE_TOKEN,
            CONF_UPDATE,
            CONFTEAM_NAME,
            CONFEND_DATE
        FROM RELEASES
        WHERE RELEASE_ID = :release_id
    """
    
    # Used in: Create Release API (/api/releases/create)
    # Creates a new release
    INSERT_RELEASE = """
        INSERT INTO RELEASES (
            RELEASE_ID,
            PROJECT_ID,
            RELEASE_NAME,
            RELEASE_START_DATE,
            RELEASE_END_DATE,
            BUILD_RELEASE,
            CONFLUENCE_PAGEID,
            CONFLUENCE_TOKEN,
            CONF_UPDATE,
            CONFTEAM_NAME,
            CONFEND_DATE
        ) VALUES (
            :release_id,
            :project_id,
            :release_name,
            TO_DATE(:start_date, 'YYYY-MM-DD'),
            TO_DATE(:end_date, 'YYYY-MM-DD'),
            :build_release,
            :confluence_pageid,
            :confluence_token,
            :conf_update,
            :confteam_name,
            TO_DATE(:confend_date, 'YYYY-MM-DD')
        )
    """
    
    # Used in: Update Release API (/api/releases/:id)
    # Updates release information
    UPDATE_RELEASE = """
        UPDATE RELEASES
        SET RELEASE_NAME = :release_name,
            RELEASE_START_DATE = TO_DATE(:start_date, 'YYYY-MM-DD'),
            RELEASE_END_DATE = TO_DATE(:end_date, 'YYYY-MM-DD'),
            BUILD_RELEASE = :build_release,
            CONFLUENCE_PAGEID = :confluence_pageid,
            CONFLUENCE_TOKEN = :confluence_token,
            CONF_UPDATE = :conf_update,
            CONFTEAM_NAME = :confteam_name,
            CONFEND_DATE = TO_DATE(:confend_date, 'YYYY-MM-DD')
        WHERE RELEASE_ID = :release_id
    """
    
    # Used in: Delete Release API (/api/releases/:id)
    # Deletes a release
    DELETE_RELEASE = """
        DELETE FROM RELEASES
        WHERE RELEASE_ID = :release_id
    """
    
    # Used in: Get Active Releases (/api/releases/active)
    # Retrieves currently active releases (within start and end dates)
    GET_ACTIVE_RELEASES = """
        SELECT 
            RELEASE_ID,
            PROJECT_ID,
            RELEASE_NAME,
            RELEASE_START_DATE,
            RELEASE_END_DATE
        FROM RELEASES
        WHERE SYSDATE BETWEEN RELEASE_START_DATE AND RELEASE_END_DATE
        ORDER BY RELEASE_START_DATE DESC
    """


# ============================================================================
# DASHBOARD / ANALYTICS QUERIES
# ============================================================================

class DashboardQueries:
    """Dashboard and analytics queries
    
    Note: These are placeholder queries. In Phase 2, you'll add actual
    test case, execution, and defect tracking tables.
    """
    
    # Used in: Zephyr Dashboard (/api/dashboard/zephyr-stats)
    # Get summary statistics for Zephyr dashboard
    # TODO: Replace with actual test case table queries in Phase 2
    GET_ZEPHYR_STATS = """
        SELECT 
            COUNT(*) as total_releases,
            :release_id as current_release_id
        FROM RELEASES
        WHERE PROJECT_ID = :project_id
    """
    
    # Used in: Jira Dashboard (/api/dashboard/jira-stats)
    # Get summary statistics for Jira dashboard
    # TODO: Replace with actual Jira integration queries in Phase 2
    GET_JIRA_STATS = """
        SELECT 
            COUNT(*) as total_releases
        FROM RELEASES
        WHERE PROJECT_ID = :project_id
    """


# ============================================================================
# UTILITY QUERIES
# ============================================================================

class UtilityQueries:
    """Utility and helper queries"""
    
    # Used in: Database health check (/api/health)
    # Tests database connectivity
    TEST_CONNECTION = """
        SELECT 1 FROM DUAL
    """
    
    # Used in: Generate unique IDs
    # Gets next sequence value for user IDs
    GET_NEXT_USER_ID = """
        SELECT NVL(MAX(USER_ID), 0) + 1 as next_id
        FROM USERS
    """
    
    # Used in: Generate unique IDs
    # Gets next sequence value for project IDs
    GET_NEXT_PROJECT_ID = """
        SELECT NVL(MAX(PROJECT_ID), 0) + 1 as next_id
        FROM PROJECTS
    """
    
    # Used in: Generate unique IDs
    # Gets next sequence value for release IDs
    GET_NEXT_RELEASE_ID = """
        SELECT NVL(MAX(RELEASE_ID), 0) + 1 as next_id
        FROM RELEASES
    """
