import React, { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { CheckCircle2, Plus, Trash2 } from "lucide-react";
import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export const ImportRequirementsForm = ({ selectedProject, selectedRelease }) => {
  const initialRow = { folder_name: "", jql: "" };
  const [rows, setRows] = useState([
    { ...initialRow },
    { ...initialRow },
    { ...initialRow },
    { ...initialRow }
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  const handleRowChange = (index, field, value) => {
    const newRows = [...rows];
    newRows[index][field] = value;
    setRows(newRows);
  };

  const addRow = () => {
    setRows([...rows, { ...initialRow }]);
  };

  const removeRow = (index) => {
    if (rows.length > 1) {
      const newRows = rows.filter((_, i) => i !== index);
      setRows(newRows);
    }
  };

  const validateForm = () => {
    // Check if at least one row has both folder name and JQL
    const validRows = rows.filter(row => row.folder_name.trim() && row.jql.trim());
    if (validRows.length === 0) {
      setError("Please fill at least one row with both Folder Name and JQL");
      return false;
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
      // Filter out empty rows
      const validRows = rows.filter(row => row.folder_name.trim() && row.jql.trim());

      const response = await axios.post(`${API}/zephyr/import-requirements`, {
        release_id: selectedRelease.id,
        project_id: selectedProject.id,
        requirements: validRows
      });

      if (response.data.success) {
        setShowSuccessDialog(true);
        // Reset form to initial 4 rows
        setRows([
          { ...initialRow },
          { ...initialRow },
          { ...initialRow },
          { ...initialRow }
        ]);
      }
    } catch (err) {
      const errorMessage = err.response?.data?.detail || "Failed to import requirements. Please try again.";
      setError(errorMessage);
      console.error("Import requirements error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in flex justify-center">
      {/* Success Dialog */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-success">
              <CheckCircle2 className="w-5 h-5" />
              Requirements Imported Successfully
            </DialogTitle>
            <DialogDescription className="pt-2">
              Requirements have been successfully imported from Jira to Zephyr.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end pt-4">
            <Button onClick={() => setShowSuccessDialog(false)}>Close</Button>
          </div>
        </DialogContent>
      </Dialog>

      <Card className="shadow-elegant w-full max-w-5xl">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl">Import Requirements</CardTitle>
          <CardDescription className="text-sm">
            Project: <span className="font-semibold text-foreground">{selectedProject?.name}</span> • 
            Release: <span className="font-semibold text-foreground">{selectedRelease?.name}</span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4 px-8">
            {error && (
              <div className="bg-destructive/10 text-destructive px-3 py-2 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Progress indicator while loading */}
            {loading && (
              <div className="bg-primary/10 text-primary px-3 py-2 rounded-lg text-sm flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                Importing requirements...
              </div>
            )}

            {/* Header Row */}
            <div className="grid grid-cols-[1fr_2fr_auto] gap-4 pb-2 border-b border-border">
              <Label className="text-sm font-semibold text-center">Folder Name</Label>
              <Label className="text-sm font-semibold text-center">JQL</Label>
              <div className="w-9"></div>
            </div>

            {/* Data Rows */}
            <div className="space-y-3">
              {rows.map((row, index) => (
                <div key={index} className="grid grid-cols-[1fr_2fr_auto] gap-4 items-center">
                  <Input
                    value={row.folder_name}
                    onChange={(e) => handleRowChange(index, "folder_name", e.target.value)}
                    disabled={loading}
                    className="h-9"
                  />
                  <Input
                    value={row.jql}
                    onChange={(e) => handleRowChange(index, "jql", e.target.value)}
                    disabled={loading}
                    className="h-9"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeRow(index)}
                    disabled={loading || rows.length === 1}
                    className="h-9 w-9 p-0"
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))}
            </div>

            {/* Add Row Button */}
            <div className="pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addRow}
                disabled={loading}
                className="h-9"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Row
              </Button>
            </div>

            {/* Submit Button */}
            <div className="pt-4 flex justify-end border-t border-border">
              <Button type="submit" className="px-8 h-9" disabled={loading}>
                {loading ? "Importing..." : "Import Requirements"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
