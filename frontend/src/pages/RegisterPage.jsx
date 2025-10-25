import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card";
import { Shield, User, Lock, Key, Info, CheckCircle2, Loader2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export const RegisterPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    soeid: "",
    full_name: "",
    passcode: "",
    zephyr_token: "",
    jira_token: "",
    selected_project_id: "",
    manager_soeid: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [tokenValidating, setTokenValidating] = useState(false);
  const [tokenValidated, setTokenValidated] = useState(false);
  const [projects, setProjects] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleZephyrTokenBlur = async () => {
    if (!formData.zephyr_token || formData.zephyr_token.length < 10) {
      return;
    }

    setTokenValidating(true);
    setError("");

    try {
      const response = await axios.post(`${API}/auth/validate-zephyr-token`, {
        token: formData.zephyr_token
      });

      if (response.data.success) {
        setProjects(response.data.projects);
        setTokenValidated(true);
      }
    } catch (err) {
      const errorMessage = err.response?.data?.detail || "Invalid Zephyr token. Please check and try again.";
      setError(errorMessage);
      setTokenValidated(false);
      setProjects([]);
    } finally {
      setTokenValidating(false);
    }
  };

  const validateForm = () => {
    // Validate SOEID format (2 letters + 5 digits)
    const soeidPattern = /^[A-Za-z]{2}\d{5}$/;
    if (!soeidPattern.test(formData.soeid)) {
      setError("SOEID must be in format: 2 letters + 5 digits (e.g., AB12345)");
      return false;
    }

    // Validate passcode (4 digits)
    if (!/^\d{4}$/.test(formData.passcode)) {
      setError("Passcode must be exactly 4 digits");
      return false;
    }

    // Validate manager SOEID
    if (!soeidPattern.test(formData.manager_soeid)) {
      setError("Manager SOEID must be in format: 2 letters + 5 digits (e.g., AB12345)");
      return false;
    }

    // Check Zephyr token validated
    if (!tokenValidated) {
      setError("Please enter a valid Zephyr token");
      return false;
    }

    // Check project selected
    if (!formData.selected_project_id) {
      setError("Please select a project");
      return false;
    }

    // Check all required fields
    const requiredFields = ['soeid', 'full_name', 'passcode', 'zephyr_token', 'jira_token', 'manager_soeid'];
    for (const field of requiredFields) {
      if (!formData[field].trim()) {
        setError("All fields are required");
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(`${API}/auth/register`, {
        soeid: formData.soeid,
        full_name: formData.full_name,
        passcode: formData.passcode,
        zephyr_token: formData.zephyr_token,
        jira_token: formData.jira_token,
        selected_project_id: formData.selected_project_id,
        manager_soeid: formData.manager_soeid,
        projects_data: projects
      });
      
      if (response.data.success) {
        alert("Registration successful! Please login.");
        navigate("/");
      }
    } catch (err) {
      const errorMessage = err.response?.data?.detail || "Registration failed. Please try again.";
      setError(errorMessage);
      console.error("Registration error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted to-background flex items-center justify-center p-4">
      <div className="w-full max-w-xl animate-fade-in">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-2xl mb-4 shadow-elegant">
            <Shield className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-2">CQE Project Management</h1>
          <p className="text-muted-foreground">Create your account</p>
        </div>

        {/* Registration Card */}
        <Card className="shadow-elegant border-border/50">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-semibold">Register</CardTitle>
            <CardDescription>Fill in your details to create an account</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-3">
              {error && (
                <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}
              
              {/* SOEID */}
              <div className="flex items-center gap-4">
                <Label htmlFor="soeid" className="text-foreground w-32 text-right">
                  SOEID <span className="text-destructive">*</span>:
                </Label>
                <div className="flex-1 relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="soeid"
                    name="soeid"
                    type="text"
                    placeholder="e.g., AB12345"
                    value={formData.soeid}
                    onChange={handleChange}
                    className="pl-10"
                    maxLength={7}
                  />
                </div>
              </div>

              {/* Full Name */}
              <div className="flex items-center gap-4">
                <Label htmlFor="full_name" className="text-foreground w-32 text-right">
                  Full Name <span className="text-destructive">*</span>:
                </Label>
                <div className="flex-1">
                  <Input
                    id="full_name"
                    name="full_name"
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.full_name}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Passcode */}
              <div className="flex items-center gap-4">
                <Label htmlFor="passcode" className="text-foreground w-32 text-right">
                  Passcode <span className="text-destructive">*</span>:
                </Label>
                <div className="flex-1 relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="passcode"
                    name="passcode"
                    type="password"
                    placeholder="4 digits"
                    maxLength={4}
                    value={formData.passcode}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^0-9]/g, '');
                      setFormData(prev => ({ ...prev, passcode: value }));
                    }}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Zephyr Token */}
              <div className="flex items-center gap-4">
                <Label htmlFor="zephyr_token" className="text-foreground w-32 text-right flex items-center justify-end gap-1">
                  Zephyr Token <span className="text-destructive">*</span>:
                  <div className="group relative">
                    <Info className="w-4 h-4 text-muted-foreground cursor-help" />
                    <div className="absolute left-0 top-6 w-64 p-2 bg-popover text-popover-foreground text-xs rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                      API token for Zephyr integration
                    </div>
                  </div>
                </Label>
                <div className="flex-1 relative">
                  <Key className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  {tokenValidating && (
                    <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary animate-spin" />
                  )}
                  {tokenValidated && !tokenValidating && (
                    <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-success" />
                  )}
                  <Input
                    id="zephyr_token"
                    name="zephyr_token"
                    type="text"
                    placeholder="Enter Zephyr API token"
                    value={formData.zephyr_token}
                    onChange={handleChange}
                    onBlur={handleZephyrTokenBlur}
                    className="pl-10 pr-10"
                  />
                </div>
              </div>

              {/* Project Selection - shown after token validation */}
              {tokenValidated && projects.length > 0 && (
                <div className="flex items-center gap-4">
                  <Label htmlFor="selected_project_id" className="text-foreground w-32 text-right">
                    Project <span className="text-destructive">*</span>:
                  </Label>
                  <div className="flex-1">
                    <Select 
                      value={formData.selected_project_id} 
                      onValueChange={(value) => setFormData(prev => ({...prev, selected_project_id: value}))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a project" options={projects} value={formData.selected_project_id} />
                      </SelectTrigger>
                      <SelectContent>
                        {projects.map((project) => (
                          <SelectItem key={project.id} value={project.id}>
                            {project.name} (ID: {project.id})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              {/* Jira Token */}
              <div className="flex items-center gap-4">
                <Label htmlFor="jira_token" className="text-foreground w-32 text-right flex items-center justify-end gap-1">
                  Jira Token <span className="text-destructive">*</span>:
                  <div className="group relative">
                    <Info className="w-4 h-4 text-muted-foreground cursor-help" />
                    <div className="absolute left-0 top-6 w-64 p-2 bg-popover text-popover-foreground text-xs rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                      API token for Jira integration
                    </div>
                  </div>
                </Label>
                <div className="flex-1 relative">
                  <Key className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="jira_token"
                    name="jira_token"
                    type="text"
                    placeholder="Enter Jira API token"
                    value={formData.jira_token}
                    onChange={handleChange}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Manager SOEID */}
              <div className="flex items-center gap-4">
                <Label htmlFor="manager_soeid" className="text-foreground w-32 text-right">
                  Manager SOEID <span className="text-destructive">*</span>:
                </Label>
                <div className="flex-1 relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="manager_soeid"
                    name="manager_soeid"
                    type="text"
                    placeholder="e.g., AB12345"
                    value={formData.manager_soeid}
                    onChange={handleChange}
                    className="pl-10"
                    maxLength={7}
                  />
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col gap-3">
              <Button type="submit" className="w-full" disabled={loading || !tokenValidated}>
                {loading ? "Registering..." : "Register"}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => navigate("/")}
              >
                Back to Login
              </Button>
            </CardFooter>
          </form>
        </Card>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Protected by enterprise security standards
        </p>
      </div>
    </div>
  );
};
