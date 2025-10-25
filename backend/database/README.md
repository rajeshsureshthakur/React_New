# CQE Project Management - Database Setup Guide

## Overview
This directory contains all database-related files for the CQE Project Management system with Oracle DB integration.

---

## 📁 File Structure

```
database/
├── README.md           # This file - setup instructions
├── schema.sql          # Database table creation scripts
└── seed_data.sql       # Sample data for testing
```

---

## 🚀 Quick Start Guide

### Step 1: Setup Oracle Database Connection

Edit `/app/backend/config/config.py` and update Oracle connection details:

```python
ORACLE_CONFIG = {
    'user': 'your_oracle_username',
    'password': 'your_oracle_password',
    'dsn': 'your_host:1521/your_service_name',
    ...
}
```

**Or use environment variables (recommended for production):**

```bash
export ORACLE_USER=your_oracle_username
export ORACLE_PASSWORD=your_oracle_password
export ORACLE_DSN=your_host:1521/your_service_name
export APP_ENV=production
```

---

### Step 2: Create Database Tables

Connect to your Oracle database and run the schema script:

```bash
# Using SQL*Plus
sqlplus username/password@database @schema.sql

# Or using SQLcl
sql username/password@database @schema.sql
```

**What this creates:**
- ✅ USERS table (for authentication)
- ✅ PROJECTS table (for project management)
- ✅ RELEASES table (for release tracking)
- ✅ Indexes for performance
- ✅ Comments for documentation

---

### Step 3: Load Sample Data (Optional for Development)

```bash
# Using SQL*Plus
sqlplus username/password@database @seed_data.sql

# Or using SQLcl
sql username/password@database @seed_data.sql
```

**What this inserts:**
- 8 sample projects (CQE Platform, Test Automation Suite, etc.)
- 12 sample releases across different projects
- 6 test users with different roles

---

### Step 4: Verify Installation

Run these queries to verify tables were created:

```sql
-- Check if tables exist
SELECT table_name FROM user_tables 
WHERE table_name IN ('USERS', 'PROJECTS', 'RELEASES');

-- Check row counts
SELECT 'USERS' as table_name, COUNT(*) as row_count FROM USERS
UNION ALL
SELECT 'PROJECTS', COUNT(*) FROM PROJECTS
UNION ALL
SELECT 'RELEASES', COUNT(*) FROM RELEASES;
```

---

## 🔐 Test Login Credentials

After loading seed data, you can use these credentials to test:

| SOEID | Passcode | Role | Projects Access |
|-------|----------|------|----------------|
| TEST123 | 1234 | Admin | 1,2,3 |
| DEV001 | 1234 | Developer | 1,2 |
| QA001 | 1234 | QA Engineer | 2,3,4 |
| LEAD001 | 1234 | Team Lead | 1,2,3,4,5 |
| ARCH001 | 1234 | Architect | 3,4,5,6 |
| MGR001 | 1234 | Manager | All projects |

---

## 📋 Table Descriptions

### USERS Table
Stores user authentication and profile information.

**Key Columns:**
- `USER_ID` - Primary key, unique user identifier
- `USER_SOEID` - Login ID (unique)
- `USER_PASSWORD` - SHA256 hashed passcode
- `ZEPHYR_PROJECTLIST` - Comma-separated project IDs user can access
- `USER_ROLE` - User's role in the system

### PROJECTS Table
Stores project information.

**Key Columns:**
- `PROJECT_ID` - Primary key, unique project identifier
- `PROJECT_NAME` - Display name of the project

### RELEASES Table
Stores release information for projects.

**Key Columns:**
- `RELEASE_ID` - Primary key, unique release identifier
- `PROJECT_ID` - Links to PROJECTS table
- `RELEASE_NAME` - Display name of the release
- `RELEASE_START_DATE` - When release starts
- `RELEASE_END_DATE` - When release ends

---

## 🔧 Configuration Files

All application settings are in: `/app/backend/config/`

### config.py
Main configuration file containing:
- Oracle database connection settings
- API settings
- Authentication settings
- Logging configuration

### queries.py
All SQL queries with comments indicating where each is used:
- `UserQueries` - User authentication and management
- `ProjectQueries` - Project operations
- `ReleaseQueries` - Release management
- `DashboardQueries` - Analytics and stats
- `UtilityQueries` - Helper queries

### Environment-Specific Configs
- `environments/development.py` - Dev environment settings
- `environments/staging.py` - Staging environment settings
- `environments/production.py` - Production environment settings

---

## 🌍 Environment Management

To switch between environments:

```bash
# Development (default)
export APP_ENV=development

# Staging
export APP_ENV=staging

# Production
export APP_ENV=production
```

---

## 🔄 Schema Modifications

If you need to modify the schema:

1. **Update** `/app/backend/database/schema.sql`
2. **Update** corresponding queries in `/app/backend/config/queries.py`
3. **Add comments** indicating where the new queries are used
4. **Test** in development environment first
5. **Deploy** to staging, then production

---

## 📊 Query Reference

All queries are documented in `/app/backend/config/queries.py`.

**Example Usage:**
```python
from config.queries import UserQueries, ProjectQueries

# Get user by SOEID
query = UserQueries.GET_USER_BY_SOEID
# Used in: Login API (/api/auth/login)

# Get projects list
query = ProjectQueries.GET_ALL_PROJECTS
# Used in: Dashboard page - Project dropdown
```

---

## ⚠️ Important Notes

1. **No Foreign Keys**: As requested, no foreign key constraints are defined. Data integrity must be maintained at the application level.

2. **Unique Constraints**:
   - USER_ID and USER_SOEID must be unique in USERS table
   - PROJECT_ID must be unique in PROJECTS table
   - RELEASE_ID must be unique in RELEASES table

3. **Password Security**: All passwords are hashed using SHA256. Never store plain text passwords.

4. **Connection Pooling**: The application uses Oracle connection pooling for better performance.

5. **Environment Variables**: Always use environment variables for production credentials, never hardcode them.

---

## 🚨 Troubleshooting

### Cannot connect to Oracle DB
- Verify Oracle credentials in config.py
- Check if Oracle listener is running
- Verify DSN format: `host:port/service_name`
- Check firewall settings

### Tables already exist
```sql
-- Drop tables if you need to recreate them
DROP TABLE USERS;
DROP TABLE PROJECTS;
DROP TABLE RELEASES;
```

### Need to reset seed data
```sql
-- Delete all data
DELETE FROM RELEASES;
DELETE FROM PROJECTS;
DELETE FROM USERS;
COMMIT;

-- Then re-run seed_data.sql
```

---

## 📞 Support

For issues or questions, refer to:
- Configuration files in `/app/backend/config/`
- Query documentation in `/app/backend/config/queries.py`
- This README file

---

**Last Updated:** January 2025
**Version:** 1.0.0
