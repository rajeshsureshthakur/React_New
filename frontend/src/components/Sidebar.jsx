import React, { useState, useEffect } from "react";
import { cn } from "../lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Label } from "./ui/label";
import axios from "axios";
import { 
  FolderPlus, 
  Database, 
  Eye, 
  Users, 
  BarChart3, 
  TrendingUp, 
  Settings,
  ChevronDown,
  ChevronRight,
  FileText,
  Link2,
  FileEdit,
  Upload,
  FolderCog,
  CheckSquare,
  FolderSync,
  ArchiveRestore
} from "lucide-react";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export const Sidebar = ({ activeTab, selectedRelease, onProjectChange, onReleaseChange, onMenuAction }) => {
  const [expandedSection, setExpandedSection] = useState(null);
  const [projects, setProjects] = useState([]);
  const [releases, setReleases] = useState([]);
  const [selectedProject, setSelectedProject] = useState("");
  const [selectedReleaseId, setSelectedReleaseId] = useState("");
  const [loading, setLoading] = useState(false);
  const [releaseSearchTerm, setReleaseSearchTerm] = useState("");

  useEffect(() => {
    // Get user from localStorage
    const user = JSON.parse(localStorage.getItem("cqe_user") || "{}");
    if (user.soeid) {
      fetchUserProjects(user.soeid);
    }
  }, []); // Only run once on mount

  useEffect(() => {
    if (selectedProject) {
      fetchReleases();
    } else {
      setReleases([]);
    }
  }, [selectedProject]);

  const fetchUserProjects = async (soeid) => {
    setLoading(true);
    try {
      const response = await axios.get(`${API}/projects/user/${soeid}`);
      if (response.data.success) {
        setProjects(response.data.projects);
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchReleases = async () => {
    try {
      const response = await axios.get(`${API}/releases/by-project/${selectedProject}`);
      if (response.data.success) {
        setReleases(response.data.releases);
      }
    } catch (error) {
      console.error("Error fetching releases:", error);
    }
  };

  const handleProjectSelect = (projectId) => {
    setSelectedProject(projectId);
    setSelectedReleaseId("");
    const project = projects.find(p => p.id === parseInt(projectId));
    if (project && onProjectChange) {
      onProjectChange(project.id, project.name);
    }
  };

  const handleReleaseSelect = (releaseId) => {
    setSelectedReleaseId(releaseId);
    const release = releases.find(r => r.id === parseInt(releaseId));
    if (release && onReleaseChange) {
      onReleaseChange(release.id, release.name);
    }
    setReleaseSearchTerm(""); // Clear search term after selection
  };

  // Filter releases based on search term
  const filteredReleases = releases.filter(release =>
    release.name.toLowerCase().includes(releaseSearchTerm.toLowerCase())
  );

  const zephyrMenuItems = [
    {
      id: "create-release",
      label: "Create Release",
      icon: FolderPlus,
      alwaysEnabled: true,
    },
    {
      id: "manage-release",
      label: "Manage Release Data",
      icon: Database,
      expandable: true,
      subItems: [
        { id: "import-requirements", label: "Import Requirements", icon: FileText },
        { id: "map-requirements", label: "Map Requirements", icon: Link2 },
        { id: "create-test-case", label: "Create Test Case", icon: FileEdit },
        { id: "import-bulk-testcases", label: "Import Bulk Testcases", icon: Upload },
        { id: "manage-cycles-phases", label: "Manage Cycles & Phases", icon: FolderCog },
        { id: "update-execution-status", label: "Update Execution Status", icon: CheckSquare },
        { id: "import-regression", label: "Import Regression Testcases", icon: FolderSync },
        { id: "update-central-repo", label: "Update Central Test Repo", icon: ArchiveRestore },
      ],
    },
    {
      id: "view-my-bow",
      label: "View My BOW",
      icon: Eye,
    },
    {
      id: "view-team-bow",
      label: "View My Team's BOW",
      icon: Users,
    },
    {
      id: "release-summary",
      label: "Release Summary View",
      icon: BarChart3,
    },
    {
      id: "capability-metrics",
      label: "View Capability Metrics",
      icon: TrendingUp,
    },
    {
      id: "configure-confluence",
      label: "Configure Confluence",
      icon: Settings,
    },
  ];

  const jiraMenuItems = [
    {
      id: "jira-dashboard",
      label: "Jira Dashboard",
      icon: BarChart3,
    },
    {
      id: "jira-issues",
      label: "View Issues",
      icon: Eye,
    },
    {
      id: "jira-reports",
      label: "Reports",
      icon: TrendingUp,
    },
  ];

  const menuItems = activeTab === "zephyr" ? zephyrMenuItems : jiraMenuItems;

  const isItemEnabled = (item) => {
    // Create Release is enabled only when project is selected
    if (item.id === "create-release") {
      return selectedProject !== null && selectedProject !== "";
    }
    // All other items need release selection
    return selectedReleaseId !== "";
  };

  const handleItemClick = (item) => {
    if (!isItemEnabled(item)) {
      return;
    }

    if (item.id === "create-release") {
      // Trigger create release form
      if (onMenuAction) {
        onMenuAction("create-release");
      }
      return;
    }

    if (item.expandable) {
      setExpandedSection(expandedSection === item.id ? null : item.id);
    } else {
      alert(`${item.label} - This functionality will be fully implemented soon`);
    }
  };

  const handleSubItemClick = (subItem) => {
    if (!selectedReleaseId) {
      return;
    }
    alert(`${subItem.label} - This functionality will be fully implemented soon`);
  };

  return (
    <aside className="w-80 bg-card border-r border-border overflow-y-auto">
      <div className="p-4 space-y-4">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
          {activeTab === "zephyr" ? "Zephyr Options" : "Jira Options"}
        </h2>

        {/* Project Selection */}
        {activeTab === "zephyr" && (
          <div className="space-y-3 pb-4 border-b border-border">
            <div className="space-y-2">
              <Label className="text-xs font-medium text-muted-foreground">Select Project</Label>
              <Select value={selectedProject} onValueChange={handleProjectSelect}>
                <SelectTrigger>
                  <SelectValue 
                    placeholder={loading ? "Loading..." : "Select project"} 
                    options={projects.map(p => ({value: String(p.id), label: p.name}))} 
                    value={selectedProject} 
                  />
                </SelectTrigger>
                <SelectContent>
                  {projects.map((project) => (
                    <SelectItem key={project.id} value={String(project.id)}>
                      {project.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Release Selection */}
            {selectedProject && (
              <div className="space-y-2">
                <Label className="text-xs font-medium text-muted-foreground">Select Release</Label>
                <Select value={selectedReleaseId} onValueChange={handleReleaseSelect}>
                  <SelectTrigger disabled={!selectedProject}>
                    <SelectValue 
                      placeholder={selectedProject ? "Select release" : "Select project first"} 
                      options={releases.map(r => ({value: String(r.id), label: r.name}))} 
                      value={selectedReleaseId} 
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {releases.map((release) => (
                      <SelectItem key={release.id} value={String(release.id)}>
                        {release.name} (ID: {release.id})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        )}

        <nav className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isExpanded = expandedSection === item.id;
            const enabled = isItemEnabled(item);

            return (
              <div key={item.id}>
                <button
                  onClick={() => handleItemClick(item)}
                  disabled={!enabled}
                  className={cn(
                    "w-full sidebar-item",
                    !enabled && "opacity-50 cursor-not-allowed"
                  )}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span className="flex-1 text-left">{item.label}</span>
                  {item.expandable && enabled && (
                    isExpanded ? 
                      <ChevronDown className="w-4 h-4 flex-shrink-0" /> : 
                      <ChevronRight className="w-4 h-4 flex-shrink-0" />
                  )}
                </button>

                {/* Sub Items */}
                {item.expandable && isExpanded && enabled && (
                  <div className="ml-4 mt-1 space-y-1 animate-slide-down">
                    {item.subItems.map((subItem) => {
                      const SubIcon = subItem.icon;
                      return (
                        <button
                          key={subItem.id}
                          onClick={() => handleSubItemClick(subItem)}
                          disabled={!selectedReleaseId}
                          className={cn(
                            "w-full flex items-center gap-3 px-4 py-2 rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors duration-200",
                            !selectedReleaseId && "opacity-50 cursor-not-allowed"
                          )}
                        >
                          <SubIcon className="w-3.5 h-3.5 flex-shrink-0" />
                          <span className="flex-1 text-left text-xs">{subItem.label}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </div>
    </aside>
  );
};
