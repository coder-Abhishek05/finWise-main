"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { GraduationCap, Users, Shield } from "lucide-react"

export default function LoginPage() {
  const [volunteerForm, setVolunteerForm] = useState({ email: "", password: "" })
  const [employeeForm, setEmployeeForm] = useState({ email: "", password: "" })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleVolunteerLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const response = await fetch("http://127.0.0.1:5000/volunteer/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: volunteerForm.email,
          password: volunteerForm.password,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        // Store auth token and user type
        localStorage.setItem("authToken", "volunteer-token")
        localStorage.setItem("userType", "volunteer")
        localStorage.setItem("userName", data.name || "Volunteer")
        // Redirect to volunteer dashboard
        window.location.href = "/volunteer/dashboard"
      } else {
        setError(data.error || "Invalid email or password. Try: iit2023237@iiita.ac.in / ava")
      }
    } catch (error) {
      setError("Connection failed. Please check if the server is running.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleEmployeeLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const response = await fetch("http://127.0.0.1:5000/employee/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: employeeForm.email,
          password: employeeForm.password,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        // Store auth token and user type
        localStorage.setItem("authToken", "employee-token")
        localStorage.setItem("userType", "employee")
        localStorage.setItem("userName", data.name || "Employee")
        // Redirect to employee dashboard
        window.location.href = "/employee/dashboard"
      } else {
        setError(data.error || "Invalid email or password. Try: admin@example.com / password")
      }
    } catch (error) {
      setError("Connection failed. Please check if the server is running.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="flex items-center justify-center gap-2 font-bold text-2xl text-primary mb-4">
            <GraduationCap className="h-8 w-8" />
            <span className="text-balance">FinLit Academy</span>
          </Link>
          <h1 className="text-2xl font-bold text-balance text-foreground">Welcome Back</h1>
          <p className="text-muted-foreground text-pretty">Sign in to continue your financial education journey</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Login Tabs */}
        <Tabs defaultValue="volunteer" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="volunteer" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Volunteer
            </TabsTrigger>
            <TabsTrigger value="employee" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Employee
            </TabsTrigger>
          </TabsList>

          {/* Volunteer Login */}
          <TabsContent value="volunteer">
            <Card className="border-border">
              <CardHeader>
                <CardTitle>Volunteer Login</CardTitle>
                <CardDescription>Access your volunteer dashboard and continue making an impact</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleVolunteerLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="volunteer-email">Email</Label>
                    <Input
                      id="volunteer-email"
                      type="email"
                      placeholder="volunteer@example.com"
                      value={volunteerForm.email}
                      onChange={(e) => setVolunteerForm({ ...volunteerForm, email: e.target.value })}
                      required
                      disabled={isLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="volunteer-password">Password</Label>
                    <Input
                      id="volunteer-password"
                      type="password"
                      placeholder="password"
                      value={volunteerForm.password}
                      onChange={(e) => setVolunteerForm({ ...volunteerForm, password: e.target.value })}
                      required
                      disabled={isLoading}
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                    disabled={isLoading}
                  >
                    {isLoading ? "Signing In..." : "Sign In as Volunteer"}
                  </Button>
                </form>

                <div className="mt-6 text-center">
                  <p className="text-sm text-muted-foreground">
                    Don't have an account?{" "}
                    <Link href="/volunteer/register" className="text-primary hover:underline">
                      Register as Volunteer
                    </Link>
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Employee Login */}
          <TabsContent value="employee">
            <Card className="border-border">
              <CardHeader>
                <CardTitle>Employee Login</CardTitle>
                <CardDescription>Access the admin dashboard and manage the platform</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleEmployeeLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="employee-email">Email</Label>
                    <Input
                      id="employee-email"
                      type="email"
                      placeholder="employee@example.com"
                      value={employeeForm.email}
                      onChange={(e) => setEmployeeForm({ ...employeeForm, email: e.target.value })}
                      required
                      disabled={isLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="employee-password">Password</Label>
                    <Input
                      id="employee-password"
                      type="password"
                      placeholder="password"
                      value={employeeForm.password}
                      onChange={(e) => setEmployeeForm({ ...employeeForm, password: e.target.value })}
                      required
                      disabled={isLoading}
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
                    disabled={isLoading}
                  >
                    {isLoading ? "Signing In..." : "Sign In as Employee"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <Link href="/" className="text-sm text-muted-foreground hover:text-primary">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}