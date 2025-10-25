import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { AlertCircle } from "lucide-react";

export const JiraContent = ({ selectedProject, selectedRelease }) => {
  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground mb-2">Jira Dashboard</h1>
        <p className="text-muted-foreground">
          Project management for {selectedProject} - {selectedRelease}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Quick Stats Cards */}
        <Card className="card-hover">
          <CardHeader>
            <CardTitle className="text-lg">Open Issues</CardTitle>
            <CardDescription>Currently active</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-destructive">42</div>
            <p className="text-xs text-muted-foreground mt-1">8 high priority</p>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardHeader>
            <CardTitle className="text-lg">In Progress</CardTitle>
            <CardDescription>Being worked on</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">28</div>
            <p className="text-xs text-muted-foreground mt-1">Across 5 sprints</p>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardHeader>
            <CardTitle className="text-lg">Resolved</CardTitle>
            <CardDescription>This sprint</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-success">134</div>
            <p className="text-xs text-muted-foreground mt-1">+15% from last sprint</p>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardHeader>
            <CardTitle className="text-lg">Backlog Items</CardTitle>
            <CardDescription>Pending work</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">89</div>
            <p className="text-xs text-muted-foreground mt-1">23 ready for sprint</p>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardHeader>
            <CardTitle className="text-lg">Sprint Progress</CardTitle>
            <CardDescription>Current sprint</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">67%</div>
            <p className="text-xs text-muted-foreground mt-1">5 days remaining</p>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardHeader>
            <CardTitle className="text-lg">Team Velocity</CardTitle>
            <CardDescription>Story points/sprint</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">45</div>
            <p className="text-xs text-muted-foreground mt-1">Average over 4 sprints</p>
          </CardContent>
        </Card>
      </div>

      {/* Coming Soon Notice */}
      <Card className="mt-6 bg-muted/50 border-primary/20">
        <CardContent className="py-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <AlertCircle className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-1">Phase 1 - UI Preview</h3>
              <p className="text-sm text-muted-foreground">
                This is a functional UI prototype showing the interface design and layout. 
                All data displayed is mock data for demonstration purposes. 
                Backend integration, database connectivity, and full functionality will be implemented in the next phase.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
