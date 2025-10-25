import React, { useState } from "react";
import { Button } from "./ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Shield, User, ChevronDown, Key, UserCog, LogOut } from "lucide-react";
import { cn } from "../lib/utils";

export const Navbar = ({ activeTab, setActiveTab, onLogout, selectedProject, selectedRelease }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const user = JSON.parse(localStorage.getItem("cqe_user") || "{}");

  const handleChangePasscode = () => {
    alert("Change passcode functionality will be implemented soon");
    setDropdownOpen(false);
  };

  const handleChangeRole = () => {
    alert("Change role functionality will be implemented soon");
    setDropdownOpen(false);
  };

  const handleSignOut = () => {
    localStorage.removeItem("cqe_user");
    localStorage.removeItem("cqe_token");
    onLogout();
  };

  return (
    <nav className="h-16 bg-card border-b border-border flex items-center justify-between px-6 shadow-sm">
      {/* Brand */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center shadow-sm">
          <Shield className="w-5 h-5 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-foreground">CQE Project Management</h1>
          {selectedProject && selectedRelease && (
            <p className="text-xs text-muted-foreground">
              {selectedProject.name} • {selectedRelease.name}
            </p>
          )}
        </div>
      </div>

      {/* Tabs and User Menu */}
      <div className="flex items-center gap-6">
        {/* Tabs */}
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab("zephyr")}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200",
              activeTab === "zephyr"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground hover:bg-secondary"
            )}
          >
            Zephyr
          </button>
          <button
            onClick={() => setActiveTab("jira")}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200",
              activeTab === "jira"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground hover:bg-secondary"
            )}
          >
            Jira
          </button>
        </div>

        {/* User Dropdown */}
        <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
          <DropdownMenuTrigger>
            <Button variant="ghost" className="gap-2">
              <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
                <User className="w-4 h-4" />
              </div>
              <span className="text-sm font-medium">{user.soeid || "User"}</span>
              <ChevronDown className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={handleChangePasscode}>
              <Key className="w-4 h-4 mr-2" />
              Change Passcode
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleChangeRole}>
              <UserCog className="w-4 h-4 mr-2" />
              Change Role
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut} className="text-destructive">
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
};
