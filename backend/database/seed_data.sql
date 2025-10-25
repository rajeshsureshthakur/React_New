-- ============================================================================
-- CQE Project Management - Seed Data
-- Oracle Database
-- ============================================================================
-- This file contains sample data for testing and development
-- Run this script after creating the schema
-- ============================================================================

-- ============================================================================
-- 1. INSERT PROJECTS
-- ============================================================================

INSERT INTO PROJECTS (PROJECT_ID, PROJECT_NAME) VALUES (1, 'CQE Platform');
INSERT INTO PROJECTS (PROJECT_ID, PROJECT_NAME) VALUES (2, 'Test Automation Suite');
INSERT INTO PROJECTS (PROJECT_ID, PROJECT_NAME) VALUES (3, 'API Gateway');
INSERT INTO PROJECTS (PROJECT_ID, PROJECT_NAME) VALUES (4, 'Analytics Engine');
INSERT INTO PROJECTS (PROJECT_ID, PROJECT_NAME) VALUES (5, 'Mobile Application');
INSERT INTO PROJECTS (PROJECT_ID, PROJECT_NAME) VALUES (6, 'Data Pipeline');
INSERT INTO PROJECTS (PROJECT_ID, PROJECT_NAME) VALUES (7, 'Cloud Infrastructure');
INSERT INTO PROJECTS (PROJECT_ID, PROJECT_NAME) VALUES (8, 'Security Framework');

COMMIT;

SELECT 'Projects inserted: ' || COUNT(*) FROM PROJECTS;


-- ============================================================================
-- 2. INSERT RELEASES
-- ============================================================================
-- Releases for CQE Platform (PROJECT_ID = 1)

INSERT INTO RELEASES (
    RELEASE_ID, PROJECT_ID, RELEASE_NAME, RELEASE_START_DATE, RELEASE_END_DATE,
    BUILD_RELEASE, CONFLUENCE_PAGEID, CONFTEAM_NAME, CONF_UPDATE
) VALUES (
    1, 1, 'Release v2.5.0', 
    TO_DATE('2024-01-01', 'YYYY-MM-DD'), 
    TO_DATE('2024-03-31', 'YYYY-MM-DD'),
    'BUILD-250', 'PAGE-12345', 'CQE Team Alpha', 'YES'
);

INSERT INTO RELEASES (
    RELEASE_ID, PROJECT_ID, RELEASE_NAME, RELEASE_START_DATE, RELEASE_END_DATE,
    BUILD_RELEASE, CONFLUENCE_PAGEID, CONFTEAM_NAME, CONF_UPDATE
) VALUES (
    2, 1, 'Release v2.4.1', 
    TO_DATE('2023-10-01', 'YYYY-MM-DD'), 
    TO_DATE('2023-12-31', 'YYYY-MM-DD'),
    'BUILD-241', 'PAGE-12346', 'CQE Team Alpha', 'YES'
);

INSERT INTO RELEASES (
    RELEASE_ID, PROJECT_ID, RELEASE_NAME, RELEASE_START_DATE, RELEASE_END_DATE,
    BUILD_RELEASE, CONFLUENCE_PAGEID, CONFTEAM_NAME, CONF_UPDATE
) VALUES (
    3, 1, 'Release v2.4.0', 
    TO_DATE('2023-07-01', 'YYYY-MM-DD'), 
    TO_DATE('2023-09-30', 'YYYY-MM-DD'),
    'BUILD-240', 'PAGE-12347', 'CQE Team Alpha', 'YES'
);

-- Releases for Test Automation Suite (PROJECT_ID = 2)

INSERT INTO RELEASES (
    RELEASE_ID, PROJECT_ID, RELEASE_NAME, RELEASE_START_DATE, RELEASE_END_DATE,
    BUILD_RELEASE, CONFLUENCE_PAGEID, CONFTEAM_NAME, CONF_UPDATE
) VALUES (
    4, 2, 'Release v1.8.0', 
    TO_DATE('2024-02-01', 'YYYY-MM-DD'), 
    TO_DATE('2024-04-30', 'YYYY-MM-DD'),
    'BUILD-180', 'PAGE-22345', 'Automation Team', 'YES'
);

INSERT INTO RELEASES (
    RELEASE_ID, PROJECT_ID, RELEASE_NAME, RELEASE_START_DATE, RELEASE_END_DATE,
    BUILD_RELEASE, CONFLUENCE_PAGEID, CONFTEAM_NAME, CONF_UPDATE
) VALUES (
    5, 2, 'Release v1.7.5', 
    TO_DATE('2023-11-01', 'YYYY-MM-DD'), 
    TO_DATE('2024-01-31', 'YYYY-MM-DD'),
    'BUILD-175', 'PAGE-22346', 'Automation Team', 'YES'
);

INSERT INTO RELEASES (
    RELEASE_ID, PROJECT_ID, RELEASE_NAME, RELEASE_START_DATE, RELEASE_END_DATE,
    BUILD_RELEASE, CONFLUENCE_PAGEID, CONFTEAM_NAME, CONF_UPDATE
) VALUES (
    6, 2, 'Release v1.7.0', 
    TO_DATE('2023-08-01', 'YYYY-MM-DD'), 
    TO_DATE('2023-10-31', 'YYYY-MM-DD'),
    'BUILD-170', 'PAGE-22347', 'Automation Team', 'YES'
);

-- Releases for API Gateway (PROJECT_ID = 3)

INSERT INTO RELEASES (
    RELEASE_ID, PROJECT_ID, RELEASE_NAME, RELEASE_START_DATE, RELEASE_END_DATE,
    BUILD_RELEASE, CONFLUENCE_PAGEID, CONFTEAM_NAME, CONF_UPDATE
) VALUES (
    7, 3, 'Release v3.2.0', 
    TO_DATE('2024-01-15', 'YYYY-MM-DD'), 
    TO_DATE('2024-03-15', 'YYYY-MM-DD'),
    'BUILD-320', 'PAGE-32345', 'API Team', 'YES'
);

INSERT INTO RELEASES (
    RELEASE_ID, PROJECT_ID, RELEASE_NAME, RELEASE_START_DATE, RELEASE_END_DATE,
    BUILD_RELEASE, CONFLUENCE_PAGEID, CONFTEAM_NAME, CONF_UPDATE
) VALUES (
    8, 3, 'Release v3.1.2', 
    TO_DATE('2023-10-15', 'YYYY-MM-DD'), 
    TO_DATE('2023-12-15', 'YYYY-MM-DD'),
    'BUILD-312', 'PAGE-32346', 'API Team', 'YES'
);

-- Releases for Analytics Engine (PROJECT_ID = 4)

INSERT INTO RELEASES (
    RELEASE_ID, PROJECT_ID, RELEASE_NAME, RELEASE_START_DATE, RELEASE_END_DATE,
    BUILD_RELEASE, CONFLUENCE_PAGEID, CONFTEAM_NAME, CONF_UPDATE
) VALUES (
    9, 4, 'Release v4.0.0', 
    TO_DATE('2024-03-01', 'YYYY-MM-DD'), 
    TO_DATE('2024-06-30', 'YYYY-MM-DD'),
    'BUILD-400', 'PAGE-42345', 'Analytics Team', 'YES'
);

INSERT INTO RELEASES (
    RELEASE_ID, PROJECT_ID, RELEASE_NAME, RELEASE_START_DATE, RELEASE_END_DATE,
    BUILD_RELEASE, CONFLUENCE_PAGEID, CONFTEAM_NAME, CONF_UPDATE
) VALUES (
    10, 4, 'Release v3.9.1', 
    TO_DATE('2023-12-01', 'YYYY-MM-DD'), 
    TO_DATE('2024-02-28', 'YYYY-MM-DD'),
    'BUILD-391', 'PAGE-42346', 'Analytics Team', 'YES'
);

-- Releases for Mobile Application (PROJECT_ID = 5)

INSERT INTO RELEASES (
    RELEASE_ID, PROJECT_ID, RELEASE_NAME, RELEASE_START_DATE, RELEASE_END_DATE,
    BUILD_RELEASE, CONFLUENCE_PAGEID, CONFTEAM_NAME, CONF_UPDATE
) VALUES (
    11, 5, 'Release v1.5.0', 
    TO_DATE('2024-02-01', 'YYYY-MM-DD'), 
    TO_DATE('2024-04-30', 'YYYY-MM-DD'),
    'BUILD-150', 'PAGE-52345', 'Mobile Team', 'YES'
);

INSERT INTO RELEASES (
    RELEASE_ID, PROJECT_ID, RELEASE_NAME, RELEASE_START_DATE, RELEASE_END_DATE,
    BUILD_RELEASE, CONFLUENCE_PAGEID, CONFTEAM_NAME, CONF_UPDATE
) VALUES (
    12, 5, 'Release v1.4.8', 
    TO_DATE('2023-11-01', 'YYYY-MM-DD'), 
    TO_DATE('2024-01-31', 'YYYY-MM-DD'),
    'BUILD-148', 'PAGE-52346', 'Mobile Team', 'YES'
);

COMMIT;

SELECT 'Releases inserted: ' || COUNT(*) FROM RELEASES;


-- ============================================================================
-- 3. INSERT USERS
-- ============================================================================
-- Note: Passwords are hashed using SHA256
-- Default passcode for all test users: 1234
-- Hashed value: 03ac674216f3e15c761ee1a5e255f067953623c8b388b4459e13f978d7c846f4

INSERT INTO USERS (
    USER_ID, USER_SOEID, USER_NAME, USER_PASSWORD, USER_ROLE, USER_TEAMID,
    MANAGER_SOEID, MANAGER_ID, ZEPHYR_PROJECTLIST, MANAGER_VERIFIED,
    CURR_VERSION, LIB_FLAG, LAST_LOGIN
) VALUES (
    1, 'TEST123', 'John Smith', 
    '03ac674216f3e15c761ee1a5e255f067953623c8b388b4459e13f978d7c846f4',
    'Admin', 'TEAM-A', 'MGR001', 100, '1,2,3', 'YES', '1.0', 'Y',
    SYSDATE
);

INSERT INTO USERS (
    USER_ID, USER_SOEID, USER_NAME, USER_PASSWORD, USER_ROLE, USER_TEAMID,
    MANAGER_SOEID, MANAGER_ID, ZEPHYR_PROJECTLIST, MANAGER_VERIFIED,
    CURR_VERSION, LIB_FLAG, LAST_LOGIN
) VALUES (
    2, 'DEV001', 'Sarah Johnson', 
    '03ac674216f3e15c761ee1a5e255f067953623c8b388b4459e13f978d7c846f4',
    'Developer', 'TEAM-A', 'MGR001', 100, '1,2', 'YES', '1.0', 'Y',
    SYSDATE - 1
);

INSERT INTO USERS (
    USER_ID, USER_SOEID, USER_NAME, USER_PASSWORD, USER_ROLE, USER_TEAMID,
    MANAGER_SOEID, MANAGER_ID, ZEPHYR_PROJECTLIST, MANAGER_VERIFIED,
    CURR_VERSION, LIB_FLAG, LAST_LOGIN
) VALUES (
    3, 'QA001', 'Mike Chen', 
    '03ac674216f3e15c761ee1a5e255f067953623c8b388b4459e13f978d7c846f4',
    'QA Engineer', 'TEAM-B', 'MGR002', 101, '2,3,4', 'YES', '1.0', 'Y',
    SYSDATE - 2
);

INSERT INTO USERS (
    USER_ID, USER_SOEID, USER_NAME, USER_PASSWORD, USER_ROLE, USER_TEAMID,
    MANAGER_SOEID, MANAGER_ID, ZEPHYR_PROJECTLIST, MANAGER_VERIFIED,
    CURR_VERSION, LIB_FLAG, LAST_LOGIN
) VALUES (
    4, 'LEAD001', 'Emily Davis', 
    '03ac674216f3e15c761ee1a5e255f067953623c8b388b4459e13f978d7c846f4',
    'Team Lead', 'TEAM-A', 'MGR001', 100, '1,2,3,4,5', 'YES', '1.0', 'Y',
    SYSDATE - 3
);

INSERT INTO USERS (
    USER_ID, USER_SOEID, USER_NAME, USER_PASSWORD, USER_ROLE, USER_TEAMID,
    MANAGER_SOEID, MANAGER_ID, ZEPHYR_PROJECTLIST, MANAGER_VERIFIED,
    CURR_VERSION, LIB_FLAG, LAST_LOGIN
) VALUES (
    5, 'ARCH001', 'Robert Wilson', 
    '03ac674216f3e15c761ee1a5e255f067953623c8b388b4459e13f978d7c846f4',
    'Architect', 'TEAM-C', 'MGR003', 102, '3,4,5,6', 'YES', '1.0', 'Y',
    SYSDATE - 5
);

INSERT INTO USERS (
    USER_ID, USER_SOEID, USER_NAME, USER_PASSWORD, USER_ROLE, USER_TEAMID,
    MANAGER_SOEID, MANAGER_ID, ZEPHYR_PROJECTLIST, MANAGER_VERIFIED,
    CURR_VERSION, LIB_FLAG, LAST_LOGIN
) VALUES (
    100, 'MGR001', 'Manager One', 
    '03ac674216f3e15c761ee1a5e255f067953623c8b388b4459e13f978d7c846f4',
    'Manager', 'TEAM-MGR', NULL, NULL, '1,2,3,4,5,6,7,8', 'YES', '1.0', 'Y',
    SYSDATE
);

COMMIT;

SELECT 'Users inserted: ' || COUNT(*) FROM USERS;


-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================

-- Check all data
SELECT 'Total Projects: ' || COUNT(*) as projects FROM PROJECTS;
SELECT 'Total Releases: ' || COUNT(*) as releases FROM RELEASES;
SELECT 'Total Users: ' || COUNT(*) as users FROM USERS;

-- Check project-release relationship
SELECT 
    p.PROJECT_NAME,
    COUNT(r.RELEASE_ID) as release_count
FROM PROJECTS p
LEFT JOIN RELEASES r ON p.PROJECT_ID = r.PROJECT_ID
GROUP BY p.PROJECT_NAME
ORDER BY p.PROJECT_NAME;

-- Check user access
SELECT 
    USER_SOEID,
    USER_NAME,
    USER_ROLE,
    ZEPHYR_PROJECTLIST
FROM USERS
ORDER BY USER_ID;

-- ============================================================================
-- NOTES
-- ============================================================================
-- Test Login Credentials:
-- SOEID: TEST123, Passcode: 1234
-- SOEID: DEV001, Passcode: 1234
-- SOEID: QA001, Passcode: 1234
-- SOEID: LEAD001, Passcode: 1234
-- SOEID: ARCH001, Passcode: 1234
-- SOEID: MGR001, Passcode: 1234
-- ============================================================================
