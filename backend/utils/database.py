"""Database Connection Manager

Handles Oracle database connections, query execution, and connection pooling.
"""

import oracledb
import logging
from typing import List, Dict, Any, Optional
from contextlib import contextmanager
from config.config import ORACLE_CONFIG
import os

logger = logging.getLogger(__name__)

# Mock mode for development when Oracle DB is not available
MOCK_MODE = os.environ.get('DB_MOCK_MODE', 'true').lower() == 'true'


class MockDatabase:
    """Mock database for development/testing without Oracle DB"""
    
    def __init__(self):
        logger.info("⚠️ Running in MOCK DATABASE mode - no real Oracle connection")
        self._load_mock_data()
    
    def _load_mock_data(self):
        """Load mock data for testing"""
        # Mock users (passcode: 1234 hashed)
        self.users = [
            {
                'USER_ID': 1, 'USER_SOEID': 'TEST123', 'USER_NAME': 'John Smith',
                'USER_PASSWORD': '03ac674216f3e15c761ee1a5e255f067953623c8b388b4459e13f978d7c846f4',
                'USER_ROLE': 'Admin', 'USER_TEAMID': 'TEAM-A', 'MANAGER_SOEID': 'MGR001',
                'MANAGER_ID': 100, 'ZEPHYR_PROJECTLIST': '1,2,3', 'MANAGER_VERIFIED': 'YES',
                'CURR_VERSION': '1.0', 'LIB_FLAG': 'Y', 'ZEPHYR_TOKEN': None, 'JIRA_TOKEN': None,
                'ZEPHYR_BASEFOLDERID': None, 'ZEPHYR_PROJECTID': None, 'JIRA_PROJECTID': None
            }
        ]
        
        # Mock projects
        self.projects = [
            {'PROJECT_ID': 1, 'PROJECT_NAME': 'CQE Platform'},
            {'PROJECT_ID': 2, 'PROJECT_NAME': 'Test Automation Suite'},
            {'PROJECT_ID': 3, 'PROJECT_NAME': 'API Gateway'},
            {'PROJECT_ID': 4, 'PROJECT_NAME': 'Analytics Engine'},
            {'PROJECT_ID': 5, 'PROJECT_NAME': 'Mobile Application'},
        ]
        
        # Mock releases
        from datetime import datetime
        self.releases = [
            {'RELEASE_ID': 1, 'PROJECT_ID': 1, 'RELEASE_NAME': 'Release v2.5.0',
             'RELEASE_START_DATE': datetime(2024, 1, 1), 'RELEASE_END_DATE': datetime(2024, 3, 31),
             'BUILD_RELEASE': 'BUILD-250', 'CONFLUENCE_PAGEID': 'PAGE-12345',
             'CONFLUENCE_TOKEN': None, 'CONF_UPDATE': 'YES', 'CONFTEAM_NAME': 'CQE Team Alpha',
             'CONFEND_DATE': None},
            {'RELEASE_ID': 2, 'PROJECT_ID': 1, 'RELEASE_NAME': 'Release v2.4.1',
             'RELEASE_START_DATE': datetime(2023, 10, 1), 'RELEASE_END_DATE': datetime(2023, 12, 31),
             'BUILD_RELEASE': 'BUILD-241', 'CONFLUENCE_PAGEID': 'PAGE-12346',
             'CONFLUENCE_TOKEN': None, 'CONF_UPDATE': 'YES', 'CONFTEAM_NAME': 'CQE Team Alpha',
             'CONFEND_DATE': None},
            {'RELEASE_ID': 3, 'PROJECT_ID': 1, 'RELEASE_NAME': 'Release v2.4.0',
             'RELEASE_START_DATE': datetime(2023, 7, 1), 'RELEASE_END_DATE': datetime(2023, 9, 30),
             'BUILD_RELEASE': 'BUILD-240', 'CONFLUENCE_PAGEID': 'PAGE-12347',
             'CONFLUENCE_TOKEN': None, 'CONF_UPDATE': 'YES', 'CONFTEAM_NAME': 'CQE Team Alpha',
             'CONFEND_DATE': None},
        ]
    
    def execute_query(self, query: str, params: Dict[str, Any] = None) -> List[Dict[str, Any]]:
        """Mock execute query"""
        params = params or {}
        
        # Simple query matching
        if 'FROM USERS' in query:
            if 'USER_SOEID = :soeid' in query:
                soeid = params.get('soeid')
                return [u for u in self.users if u['USER_SOEID'] == soeid]
            return self.users
        
        elif 'FROM PROJECTS' in query:
            if 'PROJECT_ID = :project_id' in query:
                project_id = params.get('project_id')
                return [p for p in self.projects if p['PROJECT_ID'] == project_id]
            return self.projects
        
        elif 'FROM RELEASES' in query:
            if 'PROJECT_ID = :project_id' in query:
                project_id = params.get('project_id')
                return [r for r in self.releases if r['PROJECT_ID'] == project_id]
            elif 'RELEASE_ID = :release_id' in query:
                release_id = params.get('release_id')
                return [r for r in self.releases if r['RELEASE_ID'] == release_id]
            return self.releases
        
        elif 'FROM DUAL' in query:
            return [{'1': 1}]
        
        return []
    
    def execute_one(self, query: str, params: Dict[str, Any] = None) -> Optional[Dict[str, Any]]:
        """Mock execute one"""
        results = self.execute_query(query, params)
        return results[0] if results else None
    
    def execute_update(self, query: str, params: Dict[str, Any] = None) -> int:
        """Mock execute update"""
        logger.info(f"Mock update: {query[:50]}...")
        return 1
    
    def test_connection(self) -> bool:
        """Mock connection test"""
        return True
    
    def close_pool(self):
        """Mock close pool"""
        pass


class DatabaseManager:
    """Manages Oracle database connections and operations"""
    
    def __init__(self):
        self.pool = None
        self._initialize_pool()
    
    def _initialize_pool(self):
        """Initialize Oracle connection pool"""
        try:
            self.pool = oracledb.create_pool(
                user=ORACLE_CONFIG['user'],
                password=ORACLE_CONFIG['password'],
                dsn=ORACLE_CONFIG['dsn'],
                min=ORACLE_CONFIG.get('min_pool', 2),
                max=ORACLE_CONFIG.get('max_pool', 10),
                increment=ORACLE_CONFIG.get('increment', 1)
            )
            logger.info("✅ Oracle connection pool created successfully")
        except Exception as e:
            logger.error(f"❌ Failed to create Oracle connection pool: {e}")
            raise
    
    @contextmanager
    def get_connection(self):
        """Context manager for database connections"""
        connection = None
        try:
            connection = self.pool.acquire()
            yield connection
        except Exception as e:
            logger.error(f"Database connection error: {e}")
            if connection:
                connection.rollback()
            raise
        finally:
            if connection:
                self.pool.release(connection)
    
    def execute_query(self, query: str, params: Dict[str, Any] = None) -> List[Dict[str, Any]]:
        """Execute SELECT query and return results as list of dictionaries"""
        with self.get_connection() as conn:
            cursor = conn.cursor()
            try:
                cursor.execute(query, params or {})
                
                # Get column names
                columns = [col[0] for col in cursor.description]
                
                # Fetch all rows and convert to list of dictionaries
                rows = cursor.fetchall()
                results = [dict(zip(columns, row)) for row in rows]
                
                return results
            finally:
                cursor.close()
    
    def execute_one(self, query: str, params: Dict[str, Any] = None) -> Optional[Dict[str, Any]]:
        """Execute SELECT query and return single result as dictionary"""
        with self.get_connection() as conn:
            cursor = conn.cursor()
            try:
                cursor.execute(query, params or {})
                
                # Get column names
                columns = [col[0] for col in cursor.description]
                
                # Fetch one row
                row = cursor.fetchone()
                
                if row:
                    return dict(zip(columns, row))
                return None
            finally:
                cursor.close()
    
    def execute_update(self, query: str, params: Dict[str, Any] = None) -> int:
        """Execute INSERT/UPDATE/DELETE query and return affected rows"""
        with self.get_connection() as conn:
            cursor = conn.cursor()
            try:
                cursor.execute(query, params or {})
                conn.commit()
                return cursor.rowcount
            except Exception as e:
                conn.rollback()
                logger.error(f"Update query failed: {e}")
                raise
            finally:
                cursor.close()
    
    def test_connection(self) -> bool:
        """Test database connectivity"""
        try:
            with self.get_connection() as conn:
                cursor = conn.cursor()
                cursor.execute("SELECT 1 FROM DUAL")
                cursor.fetchone()
                cursor.close()
            logger.info("✅ Database connection test successful")
            return True
        except Exception as e:
            logger.error(f"❌ Database connection test failed: {e}")
            return False
    
    def close_pool(self):
        """Close the connection pool"""
        if self.pool:
            self.pool.close()
            logger.info("Connection pool closed")


# Global database manager instance
if MOCK_MODE:
    logger.warning("🧪 Using MOCK database mode. Set DB_MOCK_MODE=false to use real Oracle DB")
    db_manager = MockDatabase()
else:
    db_manager = DatabaseManager()
