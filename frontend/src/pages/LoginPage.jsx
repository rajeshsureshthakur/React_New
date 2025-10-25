import React, { useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card";
import { Shield, Lock, User } from "lucide-react";
import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export const LoginPage = ({ onLogin }) => {
  const [soeid, setSoeid] = useState("");
  const [passcode, setPasscode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!soeid.trim()) {
      setError("Please enter your SOEID");
      return;
    }
    if (!passcode || passcode.length !== 4) {
      setError("Passcode must be exactly 4 digits");
      return;
    }

    setLoading(true);

    try {
      // Call backend API
      const response = await axios.post(`${API}/auth/login`, {
        soeid: soeid.toUpperCase(),
        passcode: passcode
      });

      if (response.data.success) {
        // Save user data and token to localStorage
        localStorage.setItem("cqe_user", JSON.stringify(response.data.user));
        localStorage.setItem("cqe_token", response.data.token);
        onLogin();
      }
    } catch (err) {
      const errorMessage = err.response?.data?.detail || "Login failed. Please check your credentials.";
      setError(errorMessage);
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted to-background flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-fade-in">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-2xl mb-4 shadow-elegant">
            <Shield className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-2">CQE Project Management</h1>
          <p className="text-muted-foreground">Sign in to access your dashboard</p>
        </div>

        {/* Login Card */}
        <Card className="shadow-elegant border-border/50">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-semibold">Welcome Back</CardTitle>
            <CardDescription>Enter your credentials to continue</CardDescription>
          </CardHeader>
          <form onSubmit={handleLogin}>
            <CardContent className="space-y-4">
              {error && (
                <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="soeid" className="text-foreground">Login (SOEID)</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="soeid"
                    type="text"
                    placeholder="Enter your SOEID"
                    value={soeid}
                    onChange={(e) => setSoeid(e.target.value)}
                    className="pl-10"
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="passcode" className="text-foreground">Passcode (4 digits)</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="passcode"
                    type="password"
                    placeholder="••••"
                    maxLength={4}
                    value={passcode}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^0-9]/g, '');
                      setPasscode(value);
                    }}
                    className="pl-10"
                    disabled={loading}
                  />
                </div>
              </div>

              <button
                type="button"
                className="text-sm text-primary hover:underline"
                onClick={() => alert("Please contact your administrator to reset your passcode")}
              >
                Forgot passcode?
              </button>
            </CardContent>

            <CardFooter className="flex flex-col gap-3">
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Signing In..." : "Sign In"}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => window.location.href = "/register"}
              >
                Register
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
