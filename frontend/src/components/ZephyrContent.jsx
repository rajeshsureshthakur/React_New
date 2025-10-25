import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { AlertCircle } from "lucide-react";

export const ZephyrContent = ({ selectedProject, selectedRelease }) => {
  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground mb-2">Zephyr Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to Zephyr test management for {selectedProject} - {selectedRelease}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Quick Stats Cards */}
        <Card className="card-hover">
          <CardHeader>
            <CardTitle className="text-lg">Total Test Cases</CardTitle>
            <CardDescription>Active test cases</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">245</div>
            <p className="text-xs text-muted-foreground mt-1">+12 from last week</p>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardHeader>
            <CardTitle className="text-lg">Execution Rate</CardTitle>
            <CardDescription>Tests executed</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-success">87%</div>
            <p className="text-xs text-muted-foreground mt-1">213 of 245 executed</p>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardHeader>
            <CardTitle className="text-lg">Pass Rate</CardTitle>
            <CardDescription>Successful tests</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">92%</div>
            <p className="text-xs text-muted-foreground mt-1">196 passed tests</p>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardHeader>
            <CardTitle className="text-lg">Open Defects</CardTitle>
            <CardDescription>Issues to resolve</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-destructive">17</div>
            <p className="text-xs text-muted-foreground mt-1">5 critical priority</p>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardHeader>
            <CardTitle className="text-lg">Active Cycles</CardTitle>
            <CardDescription>Current test cycles</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">3</div>
            <p className="text-xs text-muted-foreground mt-1">2 in progress</p>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardHeader>
            <CardTitle className="text-lg">Requirements</CardTitle>
            <CardDescription>Mapped requirements</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">156</div>
            <p className="text-xs text-muted-foreground mt-1">94% coverage</p>
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
