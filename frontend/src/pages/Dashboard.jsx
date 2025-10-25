import React, { useState, useEffect } from "react";
import { Navbar } from "../components/Navbar";
import { Sidebar } from "../components/Sidebar";
import { ZephyrContent } from "../components/ZephyrContent";
import { JiraContent } from "../components/JiraContent";

export const Dashboard = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState("zephyr");
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedRelease, setSelectedRelease] = useState(null);

  const handleProjectChange = (projectId, projectName) => {
    setSelectedProject({ id: projectId, name: projectName });
    setSelectedRelease(null); // Reset release when project changes
  };

  const handleReleaseChange = (releaseId, releaseName) => {
    setSelectedRelease({ id: releaseId, name: releaseName });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onLogout={onLogout}
        selectedProject={selectedProject}
        selectedRelease={selectedRelease}
      />

      {/* Main Content Area */}
      <div className="flex h-[calc(100vh-4rem)]">
        {/* Sidebar */}
        <Sidebar 
          activeTab={activeTab}
          selectedRelease={selectedRelease}
          onProjectChange={handleProjectChange}
          onReleaseChange={handleReleaseChange}
        />

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-muted/30 p-6">
          {activeTab === "zephyr" ? (
            <ZephyrContent 
              selectedProject={selectedProject}
              selectedRelease={selectedRelease}
            />
          ) : (
            <JiraContent 
              selectedProject={selectedProject}
              selectedRelease={selectedRelease}
            />
          )}
        </main>
      </div>
    </div>
  );
};
