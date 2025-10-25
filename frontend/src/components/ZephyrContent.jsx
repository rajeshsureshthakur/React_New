import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export const ZephyrContent = ({ selectedProject, selectedRelease }) => {
  const [stats, setStats] = useState({
    total_projects: 0,
    total_releases: 0,
    total_users: 0,
    total_testcases: 0,
    active_cycles: 3,
    requirements: 156
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const response = await axios.get(`${API}/dashboard/stats`);
      if (response.data.success) {
        setStats(response.data.stats);
      }
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground mb-2">Zephyr Dashboard</h1>
        <p className="text-muted-foreground">
          {selectedProject && selectedRelease
            ? `${selectedProject.name} - ${selectedRelease.name}`
            : "Select a project and release from the sidebar to get started"}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Total Projects */}
        <Card className="card-hover">
          <CardHeader>
            <CardTitle className="text-lg">Total Projects</CardTitle>
            <CardDescription>All projects</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">
              {loading ? "..." : stats.total_projects}
            </div>
          </CardContent>
        </Card>

        {/* Total Releases */}
        <Card className="card-hover">
          <CardHeader>
            <CardTitle className="text-lg">Total Releases</CardTitle>
            <CardDescription>All releases</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">
              {loading ? "..." : stats.total_releases}
            </div>
          </CardContent>
        </Card>

        {/* Total Users */}
        <Card className="card-hover">
          <CardHeader>
            <CardTitle className="text-lg">Total Users</CardTitle>
            <CardDescription>Registered users</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">
              {loading ? "..." : stats.total_users}
            </div>
          </CardContent>
        </Card>

        {/* Total Testcases */}
        <Card className="card-hover">
          <CardHeader>
            <CardTitle className="text-lg">Total Testcases</CardTitle>
            <CardDescription>All test cases</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-success">
              {loading ? "..." : stats.total_testcases}
            </div>
          </CardContent>
        </Card>

        {/* Active Cycles */}
        <Card className="card-hover">
          <CardHeader>
            <CardTitle className="text-lg">Active Cycles</CardTitle>
            <CardDescription>Current test cycles</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{stats.active_cycles}</div>
            <p className="text-xs text-muted-foreground mt-1">2 in progress</p>
          </CardContent>
        </Card>

        {/* Requirements */}
        <Card className="card-hover">
          <CardHeader>
            <CardTitle className="text-lg">Requirements</CardTitle>
            <CardDescription>Mapped requirements</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{stats.requirements}</div>
            <p className="text-xs text-muted-foreground mt-1">94% coverage</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
