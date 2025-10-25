import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card";
import { Shield, User, Lock, Key, Info } from "lucide-react";
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
    project_id: "",
    project_name: "",
    manager_soeid: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
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

    // Check all required fields
    const requiredFields = ['soeid', 'full_name', 'passcode', 'zephyr_token', 'jira_token', 'project_id', 'project_name', 'manager_soeid'];
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
      const response = await axios.post(`${API}/auth/register`, formData);
      
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
      <div className="w-full max-w-2xl animate-fade-in">
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
            <CardContent className="space-y-4">
              {error && (
                <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}
              
              {/* SOEID */}
              <div className="space-y-2">
                <Label htmlFor="soeid" className="text-foreground">
                  SOEID <span className="text-destructive">*</span>
                  <span className="text-xs text-muted-foreground ml-2">(2 letters + 5 digits, e.g., AB12345)</span>
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="soeid"
                    name="soeid"
                    type="text"
                    placeholder="AB12345"
                    value={formData.soeid}
                    onChange={handleChange}
                    className="pl-10"
                    maxLength={7}
                  />
                </div>
              </div>

              {/* Full Name */}
              <div className="space-y-2">
                <Label htmlFor="full_name" className="text-foreground">
                  Full Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="full_name"
                  name="full_name"
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.full_name}
                  onChange={handleChange}
                />
              </div>

              {/* Passcode */}
              <div className="space-y-2">
                <Label htmlFor="passcode" className="text-foreground">
                  Passcode <span className="text-destructive">*</span>
                  <span className="text-xs text-muted-foreground ml-2">(4 digits)</span>
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="passcode"
                    name="passcode"
                    type="password"
                    placeholder="••••"
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
              <div className="space-y-2">
                <Label htmlFor="zephyr_token" className="text-foreground flex items-center gap-2">
                  Zephyr Token <span className="text-destructive">*</span>
                  <div className="group relative">
                    <Info className="w-4 h-4 text-muted-foreground cursor-help" />
                    <div className="absolute left-0 top-6 w-64 p-2 bg-popover text-popover-foreground text-xs rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                      API token for Zephyr integration
                    </div>
                  </div>
                </Label>
                <div className="relative">
                  <Key className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="zephyr_token"
                    name="zephyr_token"
                    type="text"
                    placeholder="Enter Zephyr API token"
                    value={formData.zephyr_token}
                    onChange={handleChange}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Jira Token */}
              <div className="space-y-2">
                <Label htmlFor="jira_token" className="text-foreground flex items-center gap-2">
                  Jira Token <span className="text-destructive">*</span>
                  <div className="group relative">
                    <Info className="w-4 h-4 text-muted-foreground cursor-help" />
                    <div className="absolute left-0 top-6 w-64 p-2 bg-popover text-popover-foreground text-xs rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                      API token for Jira integration
                    </div>
                  </div>
                </Label>
                <div className="relative">
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

              {/* Project ID */}
              <div className="space-y-2">
                <Label htmlFor="project_id" className="text-foreground">
                  Project ID <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="project_id"
                  name="project_id"
                  type="text"
                  placeholder="Enter project ID"
                  value={formData.project_id}
                  onChange={handleChange}
                />
              </div>

              {/* Project Name */}
              <div className="space-y-2">
                <Label htmlFor="project_name" className="text-foreground">
                  Project Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="project_name"
                  name="project_name"
                  type="text"
                  placeholder="Enter project name"
                  value={formData.project_name}
                  onChange={handleChange}
                />
              </div>

              {/* Manager SOEID */}
              <div className="space-y-2">
                <Label htmlFor="manager_soeid" className="text-foreground">
                  Manager/Lead SOEID <span className="text-destructive">*</span>
                  <span className="text-xs text-muted-foreground ml-2">(2 letters + 5 digits)</span>
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="manager_soeid"
                    name="manager_soeid"
                    type="text"
                    placeholder="AB12345"
                    value={formData.manager_soeid}
                    onChange={handleChange}
                    className="pl-10"
                    maxLength={7}
                  />
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col gap-3">
              <Button type="submit" className="w-full" disabled={loading}>
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
