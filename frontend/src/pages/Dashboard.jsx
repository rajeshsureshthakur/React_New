import React, { useState, useEffect } from "react";
import { Navbar } from "../components/Navbar";
import { Sidebar } from "../components/Sidebar";
import { ZephyrContent } from "../components/ZephyrContent";
import { JiraContent } from "../components/JiraContent";
import { ProjectSelectionModal } from "../components/ProjectSelectionModal";

export const Dashboard = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState("zephyr");
  const [showModal, setShowModal] = useState(true);
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedRelease, setSelectedRelease] = useState(null);

  useEffect(() => {
    // Check if project and release are already selected
    const savedProject = localStorage.getItem("cqe_selected_project");
    const savedRelease = localStorage.getItem("cqe_selected_release");
    
    if (savedProject && savedRelease) {
      setSelectedProject(JSON.parse(savedProject));
      setSelectedRelease(JSON.parse(savedRelease));
      setShowModal(false);
    }
  }, []);

  const handleProjectSelection = (project, release) => {
    setSelectedProject(project);
    setSelectedRelease(release);
    localStorage.setItem("cqe_selected_project", JSON.stringify(project));
    localStorage.setItem("cqe_selected_release", JSON.stringify(release));
    setShowModal(false);
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
        <Sidebar activeTab={activeTab} />

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

      {/* Project Selection Modal */}
      <ProjectSelectionModal
        open={showModal}
        onSelect={handleProjectSelection}
      />
    </div>
  );
};
