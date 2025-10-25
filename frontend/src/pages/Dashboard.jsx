import React, { useState, useEffect } from "react";
import { Navbar } from "../components/Navbar";
import { Sidebar } from "../components/Sidebar";
import { ZephyrContent } from "../components/ZephyrContent";
import { JiraContent } from "../components/JiraContent";
import { CreateReleaseForm } from "../components/CreateReleaseForm";
import { ImportRequirementsForm } from "../components/ImportRequirementsForm";

export const Dashboard = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState("zephyr");
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedRelease, setSelectedRelease] = useState(null);
  const [activeView, setActiveView] = useState("dashboard"); // "dashboard" or "create-release"

  const handleProjectChange = (projectId, projectName) => {
    setSelectedProject({ id: projectId, name: projectName });
    setSelectedRelease(null); // Reset release when project changes
    setActiveView("dashboard"); // Go back to dashboard when project changes
  };

  const handleReleaseChange = (releaseId, releaseName) => {
    setSelectedRelease({ id: releaseId, name: releaseName });
    setActiveView("dashboard"); // Go back to dashboard when release changes
  };

  const handleMenuAction = (action) => {
    if (action === "create-release") {
      setActiveView("create-release");
    } else if (action === "import-requirements") {
      setActiveView("import-requirements");
    } else {
      setActiveView("dashboard");
    }
  };

  const handleReleaseCreated = () => {
    // Refresh will happen automatically when user selects the project again
    setActiveView("dashboard");
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
          selectedProject={selectedProject}
          selectedRelease={selectedRelease}
          onProjectChange={handleProjectChange}
          onReleaseChange={handleReleaseChange}
          onMenuAction={handleMenuAction}
        />

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-muted/30 p-6">
          {activeView === "create-release" ? (
            <CreateReleaseForm 
              selectedProject={selectedProject}
              onReleaseCreated={handleReleaseCreated}
            />
          ) : activeView === "import-requirements" ? (
            <ImportRequirementsForm
              selectedProject={selectedProject}
              selectedRelease={selectedRelease}
            />
          ) : (
            activeTab === "zephyr" ? (
              <ZephyrContent 
                selectedProject={selectedProject}
                selectedRelease={selectedRelease}
              />
            ) : (
              <JiraContent 
                selectedProject={selectedProject}
                selectedRelease={selectedRelease}
              />
            )
          )}
        </main>
      </div>
    </div>
  );
};
