"""Seed MongoDB with initial data for CQE Project Management"""

import asyncio
from database.mongodb import (
    projects_collection,
    releases_collection,
    users_collection,
    zephyrdata_collection
)


async def seed_database():
    """Seed the database with initial test data"""
    
    print("🌱 Starting database seeding...")
    
    # Clear existing data
    await projects_collection.delete_many({})
    await releases_collection.delete_many({})
    await zephyrdata_collection.delete_many({})
    print("✅ Cleared existing data")
    
    # Seed Projects
    projects = [
        {
            "id": 1,
            "project_id": 1,
            "name": "CQE Platform",
            "project_name": "CQE Platform",
            "description": "Core CQE testing platform"
        },
        {
            "id": 2,
            "project_id": 2,
            "name": "Test Automation Suite",
            "project_name": "Test Automation Suite",
            "description": "Automated testing framework"
        },
        {
            "id": 3,
            "project_id": 3,
            "name": "Performance Testing",
            "project_name": "Performance Testing",
            "description": "Load and performance testing project"
        },
        {
            "id": 4,
            "project_id": 4,
            "name": "API Testing Framework",
            "project_name": "API Testing Framework",
            "description": "RESTful API testing suite"
        },
        {
            "id": 5,
            "project_id": 5,
            "name": "Mobile App Testing",
            "project_name": "Mobile App Testing",
            "description": "Mobile application testing"
        }
    ]
    
    await projects_collection.insert_many(projects)
    print(f"✅ Seeded {len(projects)} projects")
    
    # Seed Releases for each project
    releases = [
        # CQE Platform releases
        {"id": 1, "project_id": 1, "name": "Release v2.5.0", "build_release": "BUILD-2024-050", 
         "start_date": "2024-10-01", "end_date": "2024-12-31", "use_previous_structure": False,
         "previous_build_release": None, "phases": {"load_test": 2, "endurance_test": 1, "sanity_test": 3, "standalone_test": 1},
         "created_by": "SYSTEM", "created_at": "2024-10-01T10:00:00"},
        {"id": 2, "project_id": 1, "name": "Release v2.4.1", "build_release": "BUILD-2024-041",
         "start_date": "2024-07-01", "end_date": "2024-09-30", "use_previous_structure": False,
         "previous_build_release": None, "phases": {"load_test": 1, "endurance_test": 1, "sanity_test": 2, "standalone_test": 1},
         "created_by": "SYSTEM", "created_at": "2024-07-01T10:00:00"},
        {"id": 3, "project_id": 1, "name": "Release v2.4.0", "build_release": "BUILD-2024-040",
         "start_date": "2024-04-01", "end_date": "2024-06-30", "use_previous_structure": False,
         "previous_build_release": None, "phases": {"load_test": 2, "endurance_test": 1, "sanity_test": 2, "standalone_test": 0},
         "created_by": "SYSTEM", "created_at": "2024-04-01T10:00:00"},
        
        # Test Automation Suite releases
        {"id": 4, "project_id": 2, "name": "Automation v3.0", "build_release": "AUTO-2024-030",
         "start_date": "2024-09-01", "end_date": "2024-11-30", "use_previous_structure": False,
         "previous_build_release": None, "phases": {"load_test": 1, "endurance_test": 1, "sanity_test": 4, "standalone_test": 2},
         "created_by": "SYSTEM", "created_at": "2024-09-01T10:00:00"},
        {"id": 5, "project_id": 2, "name": "Automation v2.8", "build_release": "AUTO-2024-028",
         "start_date": "2024-06-01", "end_date": "2024-08-31", "use_previous_structure": True,
         "previous_build_release": "AUTO-2024-027", "phases": {"load_test": 1, "endurance_test": 0, "sanity_test": 3, "standalone_test": 1},
         "created_by": "SYSTEM", "created_at": "2024-06-01T10:00:00"},
        
        # Performance Testing releases
        {"id": 6, "project_id": 3, "name": "Perf Test Q4", "build_release": "PERF-2024-Q4",
         "start_date": "2024-10-01", "end_date": "2024-12-31", "use_previous_structure": False,
         "previous_build_release": None, "phases": {"load_test": 5, "endurance_test": 3, "sanity_test": 2, "standalone_test": 0},
         "created_by": "SYSTEM", "created_at": "2024-10-01T10:00:00"},
        
        # API Testing Framework releases
        {"id": 7, "project_id": 4, "name": "API Test v1.5", "build_release": "API-2024-015",
         "start_date": "2024-08-01", "end_date": "2024-10-31", "use_previous_structure": False,
         "previous_build_release": None, "phases": {"load_test": 2, "endurance_test": 1, "sanity_test": 5, "standalone_test": 2},
         "created_by": "SYSTEM", "created_at": "2024-08-01T10:00:00"},
        
        # Mobile App Testing releases
        {"id": 8, "project_id": 5, "name": "Mobile v2.0", "build_release": "MOBILE-2024-020",
         "start_date": "2024-09-15", "end_date": "2024-12-15", "use_previous_structure": False,
         "previous_build_release": None, "phases": {"load_test": 1, "endurance_test": 1, "sanity_test": 3, "standalone_test": 3},
         "created_by": "SYSTEM", "created_at": "2024-09-15T10:00:00"},
    ]
    
    await releases_collection.insert_many(releases)
    print(f"✅ Seeded {len(releases)} releases")
    
    # Seed Zephyr Data (for dashboard tiles)
    zephyr_data = [
        {
            "type": "testcases",
            "project_id": 1,
            "release_id": 1,
            "count": 245
        },
        {
            "type": "testcases",
            "project_id": 2,
            "release_id": 4,
            "count": 189
        },
        {
            "type": "testcases",
            "project_id": 3,
            "release_id": 6,
            "count": 312
        }
    ]
    
    await zephyrdata_collection.insert_many(zephyr_data)
    print(f"✅ Seeded {len(zephyr_data)} zephyr data records")
    
    print("🎉 Database seeding completed successfully!")


if __name__ == "__main__":
    asyncio.run(seed_database())
