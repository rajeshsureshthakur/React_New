import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Calendar } from "lucide-react";
import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export const CreateReleaseForm = ({ selectedProject, onReleaseCreated }) => {
  const [formData, setFormData] = useState({
    release_name: "",
    build_release: "",
    start_date: new Date().toISOString().split('T')[0],
    end_date: new Date().toISOString().split('T')[0],
    use_previous_structure: "no",
    previous_build_release: "",
    load_test_phases: "",
    endurance_test_phases: "",
    sanity_test_phases: "",
    standalone_test_phases: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const user = JSON.parse(localStorage.getItem("cqe_user") || "{}");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRadioChange = (value) => {
    setFormData(prev => ({
      ...prev,
      use_previous_structure: value,
      previous_build_release: value === "no" ? "" : prev.previous_build_release
    }));
  };

  const validateForm = () => {
    if (!formData.release_name.trim()) {
      setError("Release name is required");
      return false;
    }
    if (!formData.build_release.trim()) {
      setError("Build/Jira Release is required");
      return false;
    }
    if (!formData.start_date || !formData.end_date) {
      setError("Start date and End date are required");
      return false;
    }
    if (new Date(formData.start_date) > new Date(formData.end_date)) {
      setError("Start date cannot be after End date");
      return false;
    }
    if (formData.use_previous_structure === "yes" && !formData.previous_build_release.trim()) {
      setError("Previous Build Release is required when using previous structure");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(`${API}/zephyr/create-release`, {
        project_id: selectedProject.id,
        release_name: formData.release_name,
        build_release: formData.build_release,
        start_date: formData.start_date,
        end_date: formData.end_date,
        use_previous_structure: formData.use_previous_structure === "yes",
        previous_build_release: formData.previous_build_release,
        phases: {
          load_test: parseInt(formData.load_test_phases) || 0,
          endurance_test: parseInt(formData.endurance_test_phases) || 0,
          sanity_test: parseInt(formData.sanity_test_phases) || 0,
          standalone_test: parseInt(formData.standalone_test_phases) || 0
        },
        user_soeid: user.soeid
      });

      if (response.data.success) {
        setSuccess(`Release "${formData.release_name}" created successfully! Release ID: ${response.data.release_id}`);
        // Reset form
        setFormData({
          release_name: "",
          build_release: "",
          start_date: new Date().toISOString().split('T')[0],
          end_date: new Date().toISOString().split('T')[0],
          use_previous_structure: "no",
          previous_build_release: "",
          load_test_phases: "",
          endurance_test_phases: "",
          sanity_test_phases: "",
          standalone_test_phases: ""
        });
        
        // Notify parent to refresh release list
        if (onReleaseCreated) {
          onReleaseCreated();
        }
      }
    } catch (err) {
      const errorMessage = err.response?.data?.detail || "Failed to create release. Please try again.";
      setError(errorMessage);
      console.error("Create release error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in max-w-4xl">
      <Card className="shadow-elegant">
        <CardHeader>
          <CardTitle className="text-2xl">Create New Release</CardTitle>
          <CardDescription>
            Create a new release for project: <span className="font-semibold text-foreground">{selectedProject?.name}</span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {success && (
              <div className="bg-success/10 text-success px-4 py-3 rounded-lg text-sm">
                {success}
              </div>
            )}

            {/* Release Name */}
            <div className="space-y-2">
              <Label htmlFor="release_name">New Release Name <span className="text-destructive">*</span></Label>
              <Input
                id="release_name"
                name="release_name"
                type="text"
                placeholder="e.g., Release 2.0"
                value={formData.release_name}
                onChange={handleChange}
                disabled={loading}
              />
            </div>

            {/* Build/Jira Release */}
            <div className="space-y-2">
              <Label htmlFor="build_release">Build/Jira Release <span className="text-destructive">*</span></Label>
              <Input
                id="build_release"
                name="build_release"
                type="text"
                placeholder="e.g., BUILD-2024-001"
                value={formData.build_release}
                onChange={handleChange}
                disabled={loading}
              />
            </div>

            {/* Dates */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="start_date">Start Date <span className="text-destructive">*</span></Label>
                <div className="relative">
                  <Input
                    id="start_date"
                    name="start_date"
                    type="date"
                    value={formData.start_date}
                    onChange={handleChange}
                    disabled={loading}
                    className="pr-10"
                  />
                  <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="end_date">End Date <span className="text-destructive">*</span></Label>
                <div className="relative">
                  <Input
                    id="end_date"
                    name="end_date"
                    type="date"
                    value={formData.end_date}
                    onChange={handleChange}
                    disabled={loading}
                    className="pr-10"
                  />
                  <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Previous Structure */}
            <div className="space-y-3">
              <Label>Want to use previous release folder structure?</Label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="use_previous_structure"
                    value="yes"
                    checked={formData.use_previous_structure === "yes"}
                    onChange={() => handleRadioChange("yes")}
                    disabled={loading}
                    className="w-4 h-4 text-primary focus:ring-primary"
                  />
                  <span className="text-sm">Yes</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="use_previous_structure"
                    value="no"
                    checked={formData.use_previous_structure === "no"}
                    onChange={() => handleRadioChange("no")}
                    disabled={loading}
                    className="w-4 h-4 text-primary focus:ring-primary"
                  />
                  <span className="text-sm">No</span>
                </label>
              </div>

              {formData.use_previous_structure === "yes" && (
                <div className="space-y-2 animate-slide-down">
                  <Label htmlFor="previous_build_release">Previous Build Release (Jira Release) <span className="text-destructive">*</span></Label>
                  <Input
                    id="previous_build_release"
                    name="previous_build_release"
                    type="text"
                    placeholder="e.g., BUILD-2023-012"
                    value={formData.previous_build_release}
                    onChange={handleChange}
                    disabled={loading}
                  />
                </div>
              )}
            </div>

            {/* Phases */}
            <div className="space-y-3">
              <Label className="text-base font-semibold">How many Phases you want to create?</Label>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="load_test_phases">Load Test</Label>
                  <Input
                    id="load_test_phases"
                    name="load_test_phases"
                    type="number"
                    min="0"
                    placeholder="0"
                    value={formData.load_test_phases}
                    onChange={handleChange}
                    disabled={loading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endurance_test_phases">Endurance Test</Label>
                  <Input
                    id="endurance_test_phases"
                    name="endurance_test_phases"
                    type="number"
                    min="0"
                    placeholder="0"
                    value={formData.endurance_test_phases}
                    onChange={handleChange}
                    disabled={loading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sanity_test_phases">Sanity Test</Label>
                  <Input
                    id="sanity_test_phases"
                    name="sanity_test_phases"
                    type="number"
                    min="0"
                    placeholder="0"
                    value={formData.sanity_test_phases}
                    onChange={handleChange}
                    disabled={loading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="standalone_test_phases">Standalone Test</Label>
                  <Input
                    id="standalone_test_phases"
                    name="standalone_test_phases"
                    type="number"
                    min="0"
                    placeholder="0"
                    value={formData.standalone_test_phases}
                    onChange={handleChange}
                    disabled={loading}
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Creating Release..." : "Create Release"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
