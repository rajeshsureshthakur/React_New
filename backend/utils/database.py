"""Database Connection Manager

Handles Oracle database connections, query execution, and connection pooling.
"""

import oracledb
import logging
from typing import List, Dict, Any, Optional
from contextlib import contextmanager
from config.config import ORACLE_CONFIG

logger = logging.getLogger(__name__)


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
                increment=ORACLE_CONFIG.get('increment', 1),
                encoding=ORACLE_CONFIG.get('encoding', 'UTF-8')
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
db_manager = DatabaseManager()
