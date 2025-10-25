import React, { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { AlertCircle } from "lucide-react";

export const ProjectSelectionModal = ({ open, onSelect }) => {
  const [selectedProject, setSelectedProject] = useState("");
  const [selectedRelease, setSelectedRelease] = useState("");
  const [error, setError] = useState("");

  // Mock data
  const projects = [
    { value: "cqe-platform", label: "CQE Platform" },
    { value: "test-automation", label: "Test Automation Suite" },
    { value: "api-gateway", label: "API Gateway" },
    { value: "analytics-engine", label: "Analytics Engine" },
    { value: "mobile-app", label: "Mobile Application" },
  ];

  const getReleases = (project) => {
    const releaseMap = {
      "cqe-platform": [
        { value: "v2.5.0", label: "Release v2.5.0" },
        { value: "v2.4.1", label: "Release v2.4.1" },
        { value: "v2.4.0", label: "Release v2.4.0" },
      ],
      "test-automation": [
        { value: "v1.8.0", label: "Release v1.8.0" },
        { value: "v1.7.5", label: "Release v1.7.5" },
        { value: "v1.7.0", label: "Release v1.7.0" },
      ],
      "api-gateway": [
        { value: "v3.2.0", label: "Release v3.2.0" },
        { value: "v3.1.2", label: "Release v3.1.2" },
        { value: "v3.1.0", label: "Release v3.1.0" },
      ],
      "analytics-engine": [
        { value: "v4.0.0", label: "Release v4.0.0" },
        { value: "v3.9.1", label: "Release v3.9.1" },
        { value: "v3.9.0", label: "Release v3.9.0" },
      ],
      "mobile-app": [
        { value: "v1.5.0", label: "Release v1.5.0" },
        { value: "v1.4.8", label: "Release v1.4.8" },
        { value: "v1.4.5", label: "Release v1.4.5" },
      ],
    };
    return releaseMap[project] || [];
  };

  const releases = selectedProject ? getReleases(selectedProject) : [];

  const handleSubmit = () => {
    setError("");
    if (!selectedProject) {
      setError("Please select a project");
      return;
    }
    if (!selectedRelease) {
      setError("Please select a release");
      return;
    }

    const project = projects.find(p => p.value === selectedProject);
    const release = releases.find(r => r.value === selectedRelease);
    
    onSelect(project.label, release.label);
  };

  const handleProjectChange = (value) => {
    setSelectedProject(value);
    setSelectedRelease(""); // Reset release when project changes
    setError("");
  };

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent onClose={null}>
        <DialogHeader>
          <DialogTitle className="text-2xl">Select Project & Release</DialogTitle>
          <DialogDescription>
            Please select your project and release to continue. This selection will determine
            the data displayed across all dashboards.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {error && (
            <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-lg text-sm flex items-start gap-2">
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="project">Project</Label>
            <Select value={selectedProject} onValueChange={handleProjectChange}>
              <SelectTrigger id="project">
                <SelectValue placeholder="Select a project" options={projects} value={selectedProject} />
              </SelectTrigger>
              <SelectContent>
                {projects.map((project) => (
                  <SelectItem key={project.value} value={project.value}>
                    {project.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="release">Zephyr Release</Label>
            <Select 
              value={selectedRelease} 
              onValueChange={setSelectedRelease}
            >
              <SelectTrigger id="release" disabled={!selectedProject}>
                <SelectValue 
                  placeholder={selectedProject ? "Select a release" : "Select a project first"} 
                  options={releases} 
                  value={selectedRelease} 
                />
              </SelectTrigger>
              <SelectContent>
                {releases.map((release) => (
                  <SelectItem key={release.value} value={release.value}>
                    {release.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button 
            onClick={handleSubmit} 
            className="w-full"
          >
            Continue to Dashboard
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
