-- ============================================================================
-- CQE Project Management - Database Schema
-- Oracle Database
-- ============================================================================
-- This file contains all table creation scripts
-- Run this script to create the database schema in your Oracle environment
-- ============================================================================

-- ============================================================================
-- 1. USERS TABLE
-- ============================================================================
-- Stores user authentication and profile information
-- USER_ID and USER_SOEID must be unique

CREATE TABLE USERS (
    USER_ID NUMBER PRIMARY KEY,
    USER_SOEID VARCHAR2(50) NOT NULL UNIQUE,
    USER_NAME VARCHAR2(200),
    MANAGER_SOEID VARCHAR2(50),
    MANAGER_ID NUMBER,
    USER_ROLE VARCHAR2(50),
    USER_PASSWORD VARCHAR2(255) NOT NULL,
    USER_TEAMID VARCHAR2(50),
    ZEPHYR_PROJECTID VARCHAR2(50),
    JIRA_PROJECTID VARCHAR2(50),
    ZEPHYR_TOKEN VARCHAR2(500),
    JIRA_TOKEN VARCHAR2(500),
    ZEPHYR_BASEFOLDERID VARCHAR2(100),
    LAST_LOGIN TIMESTAMP,
    MANAGER_VERIFIED VARCHAR2(10),
    ZEPHYR_PROJECTLIST VARCHAR2(500),
    CURR_VERSION VARCHAR2(50),
    LIB_FLAG VARCHAR2(10)
);

-- Create index for faster lookups
CREATE INDEX idx_user_soeid ON USERS(USER_SOEID);
CREATE INDEX idx_user_role ON USERS(USER_ROLE);

COMMENT ON TABLE USERS IS 'Stores user information and authentication details';
COMMENT ON COLUMN USERS.USER_ID IS 'Unique user identifier';
COMMENT ON COLUMN USERS.USER_SOEID IS 'User SOEID for login';
COMMENT ON COLUMN USERS.USER_PASSWORD IS 'Hashed user password/passcode';
COMMENT ON COLUMN USERS.ZEPHYR_PROJECTLIST IS 'Comma-separated list of project IDs user has access to';


-- ============================================================================
-- 2. PROJECTS TABLE
-- ============================================================================
-- Stores project information
-- PROJECT_ID must be unique

CREATE TABLE PROJECTS (
    PROJECT_ID NUMBER PRIMARY KEY,
    PROJECT_NAME VARCHAR2(200) NOT NULL
);

-- Create index for faster lookups
CREATE INDEX idx_project_name ON PROJECTS(PROJECT_NAME);

COMMENT ON TABLE PROJECTS IS 'Stores project information';
COMMENT ON COLUMN PROJECTS.PROJECT_ID IS 'Unique project identifier';
COMMENT ON COLUMN PROJECTS.PROJECT_NAME IS 'Project display name';


-- ============================================================================
-- 3. RELEASES TABLE
-- ============================================================================
-- Stores release information for projects
-- RELEASE_ID must be unique
-- PROJECT_ID links to PROJECTS table (no foreign key constraint as requested)

CREATE TABLE RELEASES (
    RELEASE_ID NUMBER PRIMARY KEY,
    PROJECT_ID NUMBER NOT NULL,
    RELEASE_NAME VARCHAR2(200) NOT NULL,
    RELEASE_START_DATE DATE,
    RELEASE_END_DATE DATE,
    BUILD_RELEASE VARCHAR2(100),
    CONFLUENCE_PAGEID VARCHAR2(100),
    CONFLUENCE_TOKEN VARCHAR2(500),
    CONF_UPDATE VARCHAR2(50),
    CONFTEAM_NAME VARCHAR2(200),
    CONFEND_DATE DATE
);

-- Create indexes for faster lookups
CREATE INDEX idx_release_project ON RELEASES(PROJECT_ID);
CREATE INDEX idx_release_name ON RELEASES(RELEASE_NAME);
CREATE INDEX idx_release_dates ON RELEASES(RELEASE_START_DATE, RELEASE_END_DATE);

COMMENT ON TABLE RELEASES IS 'Stores release information for projects';
COMMENT ON COLUMN RELEASES.RELEASE_ID IS 'Unique release identifier';
COMMENT ON COLUMN RELEASES.PROJECT_ID IS 'Links to PROJECTS table';
COMMENT ON COLUMN RELEASES.RELEASE_NAME IS 'Release display name';
COMMENT ON COLUMN RELEASES.RELEASE_START_DATE IS 'Release start date';
COMMENT ON COLUMN RELEASES.RELEASE_END_DATE IS 'Release end date';

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================
-- Run these queries to verify tables were created successfully

-- Check if tables exist
-- SELECT table_name FROM user_tables WHERE table_name IN ('USERS', 'PROJECTS', 'RELEASES');

-- Check table structure
-- DESC USERS;
-- DESC PROJECTS;
-- DESC RELEASES;

-- ============================================================================
-- NOTES
-- ============================================================================
-- 1. No foreign key constraints added as per requirement
-- 2. Unique constraints on USER_ID, USER_SOEID, PROJECT_ID, RELEASE_ID
-- 3. Indexes created for performance optimization
-- 4. All columns match the provided schema images
-- ============================================================================
