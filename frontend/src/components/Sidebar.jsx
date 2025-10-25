import React, { useState } from "react";
import { cn } from "../lib/utils";
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

export const Sidebar = ({ activeTab }) => {
  const [expandedSection, setExpandedSection] = useState(null);

  const zephyrMenuItems = [
    {
      id: "create-release",
      label: "Create Release",
      icon: FolderPlus,
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

  const handleItemClick = (item) => {
    if (item.expandable) {
      setExpandedSection(expandedSection === item.id ? null : item.id);
    } else {
      alert(`Mock: ${item.label} - This functionality will be implemented in the next phase`);
    }
  };

  const handleSubItemClick = (subItem) => {
    alert(`Mock: ${subItem.label} - This functionality will be implemented in the next phase`);
  };

  return (
    <aside className="w-72 bg-card border-r border-border overflow-y-auto">
      <div className="p-4">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
          {activeTab === "zephyr" ? "Zephyr Options" : "Jira Options"}
        </h2>
        <nav className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isExpanded = expandedSection === item.id;

            return (
              <div key={item.id}>
                <button
                  onClick={() => handleItemClick(item)}
                  className={cn(
                    "w-full sidebar-item",
                    !item.expandable && "cursor-pointer"
                  )}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span className="flex-1 text-left">{item.label}</span>
                  {item.expandable && (
                    isExpanded ? 
                      <ChevronDown className="w-4 h-4 flex-shrink-0" /> : 
                      <ChevronRight className="w-4 h-4 flex-shrink-0" />
                  )}
                </button>

                {/* Sub Items */}
                {item.expandable && isExpanded && (
                  <div className="ml-4 mt-1 space-y-1 animate-slide-down">
                    {item.subItems.map((subItem) => {
                      const SubIcon = subItem.icon;
                      return (
                        <button
                          key={subItem.id}
                          onClick={() => handleSubItemClick(subItem)}
                          className="w-full flex items-center gap-3 px-4 py-2 rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors duration-200"
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
