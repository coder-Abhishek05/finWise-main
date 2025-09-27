"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import {
  Users,
  FileText,
  BookOpen,
  MessageSquare,
  TrendingUp,
  Settings,
  CheckCircle,
  XCircle,
  Search,
  Filter,
  Download,
  Eye,
  AlertTriangle,
  Shield,
  BarChart3,
  Loader2,
} from "lucide-react"
import { adminAPI } from "@/services/api"
import type { AdminDashboardData } from "@/types/admin"

export default function EmployeeDashboard() {
  const [activeTab, setActiveTab] = useState("overview")
  const [searchTerm, setSearchTerm] = useState("")
  const [adminData, setAdminData] = useState<AdminDashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const loadAdminData = async () => {
      try {
        setLoading(true)
        const data = await adminAPI.getDashboardData()
        setAdminData(data as AdminDashboardData)
      } catch (err) {
        setError("Failed to load admin dashboard data")
        console.error("Error loading admin data:", err)
      } finally {
        setLoading(false)
      }
    }

    loadAdminData()
  }, [])

  const handleApproveVolunteer = async (id: number) => {
    try {
      await adminAPI.approveVolunteer(id)
      // Reload data to reflect changes
      const updatedData = await adminAPI.getDashboardData()
      setAdminData(updatedData as AdminDashboardData)
    } catch (err) {
      console.error("Error approving volunteer:", err)
    }
  }

  const handleRejectVolunteer = async (id: number) => {
    try {
      await adminAPI.rejectVolunteer(id)
      // Reload data to reflect changes
      const updatedData = await adminAPI.getDashboardData()
      setAdminData(updatedData as AdminDashboardData)
    } catch (err) {
      console.error("Error rejecting volunteer:", err)
    }
  }

  const handleApproveContent = async (id: number) => {
    try {
      await adminAPI.approveContent(id)
      // Reload data to reflect changes
      const updatedData = await adminAPI.getDashboardData()
      setAdminData(updatedData as AdminDashboardData)
    } catch (err) {
      console.error("Error approving content:", err)
    }
  }

  const handleRejectContent = async (id: number) => {
    try {
      await adminAPI.rejectContent(id)
      // Reload data to reflect changes
      const updatedData = await adminAPI.getDashboardData()
      setAdminData(updatedData as AdminDashboardData)
    } catch (err) {
      console.error("Error rejecting content:", err)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading admin dashboard...</p>
        </div>
      </div>
    )
  }

  if (error || !adminData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-destructive mb-4">{error || "No admin data found"}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    )
  }
  // </CHANGE>

  return (
    <div className="min-h-screen py-8 px-4 bg-background">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div className="flex items-center gap-4 mb-4 md:mb-0">
            <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center">
              <Shield className="h-6 w-6 text-accent" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">Admin Dashboard</h1>
              <p className="text-muted-foreground">Manage platform operations and content</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export Data
            </Button>
            <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{adminData.stats.totalUsers.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">+{adminData.stats.monthlyGrowth}% from last month</p>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Volunteers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-accent">{adminData.stats.activeVolunteers}</div>
              <p className="text-xs text-muted-foreground">{adminData.stats.pendingApplications} pending approval</p>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{adminData.stats.totalCourses}</div>
              <p className="text-xs text-muted-foreground">{adminData.stats.pendingContent} pending review</p>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Support Tickets</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-accent">{adminData.stats.supportTickets}</div>
              <p className="text-xs text-muted-foreground">3 high priority</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="volunteers">Volunteers</TabsTrigger>
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="support">Support</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Activity */}
              <Card className="border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {adminData.recentActivity.map((activity, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="mt-1">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground">{activity.action}</p>
                          <p className="text-xs text-muted-foreground">{activity.timestamp}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="border-border">
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button className="w-full justify-start bg-primary hover:bg-primary/90 text-primary-foreground">
                    <Users className="h-4 w-4 mr-2" />
                    Review Volunteer Applications ({adminData.stats.pendingApplications})
                  </Button>
                  <Button className="w-full justify-start bg-accent hover:bg-accent/90 text-accent-foreground">
                    <FileText className="h-4 w-4 mr-2" />
                    Review Pending Content ({adminData.stats.pendingContent})
                  </Button>
                  <Button className="w-full justify-start bg-transparent" variant="outline">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Handle Support Tickets ({adminData.stats.supportTickets})
                  </Button>
                  <Button className="w-full justify-start bg-transparent" variant="outline">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    View Analytics Report
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Platform Health */}
            <Card className="border-border">
              <CardHeader>
                <CardTitle>Platform Health</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">User Engagement</span>
                      <span className="text-sm text-muted-foreground">87%</span>
                    </div>
                    <Progress value={87} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Content Quality</span>
                      <span className="text-sm text-muted-foreground">94%</span>
                    </div>
                    <Progress value={94} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">System Performance</span>
                      <span className="text-sm text-muted-foreground">99%</span>
                    </div>
                    <Progress value={99} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="volunteers" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-foreground">Volunteer Management</h2>
              <div className="flex gap-2">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search volunteers..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8"
                  />
                </div>
                <Button variant="outline">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </div>
            </div>

            <Card className="border-border">
              <CardHeader>
                <CardTitle>Pending Applications ({adminData.pendingVolunteers.length})</CardTitle>
                <CardDescription>Review and approve new volunteer applications</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {adminData.pendingVolunteers.map((volunteer) => (
                    <div
                      key={volunteer.id}
                      className="flex items-center justify-between p-4 border border-border rounded-lg"
                    >
                      <div className="flex items-center gap-4">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback>
                            {volunteer.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-medium text-foreground">{volunteer.name}</h3>
                          <p className="text-sm text-muted-foreground">{volunteer.email}</p>
                          <div className="flex gap-2 mt-1">
                            <Badge variant="secondary">{volunteer.experience}</Badge>
                            {volunteer.interests.slice(0, 2).map((interest) => (
                              <Badge key={interest} variant="outline" className="text-xs">
                                {interest}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => handleRejectVolunteer(volunteer.id)}>
                          <XCircle className="h-4 w-4 mr-1" />
                          Reject
                        </Button>
                        <Button
                          size="sm"
                          className="bg-primary hover:bg-primary/90 text-primary-foreground"
                          onClick={() => handleApproveVolunteer(volunteer.id)}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="content" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-foreground">Content Management</h2>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Filter by Type
              </Button>
            </div>

            <Card className="border-border">
              <CardHeader>
                <CardTitle>Pending Content Review ({adminData.pendingContent.length})</CardTitle>
                <CardDescription>Review and approve content submitted by volunteers</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {adminData.pendingContent.map((content) => (
                    <div
                      key={content.id}
                      className="flex items-center justify-between p-4 border border-border rounded-lg"
                    >
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          {content.type === "course" ? (
                            <BookOpen className="h-5 w-5 text-primary" />
                          ) : (
                            <FileText className="h-5 w-5 text-accent" />
                          )}
                        </div>
                        <div>
                          <h3 className="font-medium text-foreground">{content.title}</h3>
                          <p className="text-sm text-muted-foreground">By {content.author}</p>
                          <div className="flex gap-2 mt-1">
                            <Badge variant={content.type === "course" ? "default" : "secondary"}>{content.type}</Badge>
                            <Badge variant="outline" className="text-xs">
                              {content.submittedDate}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4 mr-1" />
                          Preview
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleRejectContent(content.id)}>
                          <XCircle className="h-4 w-4 mr-1" />
                          Reject
                        </Button>
                        <Button
                          size="sm"
                          className="bg-primary hover:bg-primary/90 text-primary-foreground"
                          onClick={() => handleApproveContent(content.id)}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="support" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-foreground">Support Management</h2>
              <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">
                <MessageSquare className="h-4 w-4 mr-2" />
                New Ticket
              </Button>
            </div>

            <Card className="border-border">
              <CardHeader>
                <CardTitle>Support Tickets ({adminData.supportTickets.length})</CardTitle>
                <CardDescription>Manage user support requests and issues</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {adminData.supportTickets.map((ticket) => (
                    <div
                      key={ticket.id}
                      className="flex items-center justify-between p-4 border border-border rounded-lg"
                    >
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center">
                          {ticket.priority === "high" ? (
                            <AlertTriangle className="h-5 w-5 text-red-500" />
                          ) : (
                            <MessageSquare className="h-5 w-5 text-accent" />
                          )}
                        </div>
                        <div>
                          <h3 className="font-medium text-foreground">{ticket.subject}</h3>
                          <p className="text-sm text-muted-foreground">From {ticket.user}</p>
                          <div className="flex gap-2 mt-1">
                            <Badge
                              variant={
                                ticket.priority === "high"
                                  ? "destructive"
                                  : ticket.priority === "medium"
                                    ? "default"
                                    : "secondary"
                              }
                            >
                              {ticket.priority}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {ticket.status}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                        <Button size="sm" className="bg-accent hover:bg-accent/90 text-accent-foreground">
                          <MessageSquare className="h-4 w-4 mr-1" />
                          Respond
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-foreground">Analytics & Reports</h2>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-border">
                <CardHeader>
                  <CardTitle>User Growth</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-primary mb-2">+{adminData.stats.monthlyGrowth}%</div>
                  <p className="text-muted-foreground">Monthly growth rate</p>
                  <Progress value={adminData.stats.monthlyGrowth} className="mt-4" />
                </CardContent>
              </Card>

              <Card className="border-border">
                <CardHeader>
                  <CardTitle>Course Completion Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-accent mb-2">78%</div>
                  <p className="text-muted-foreground">Average completion rate</p>
                  <Progress value={78} className="mt-4" />
                </CardContent>
              </Card>

              <Card className="border-border">
                <CardHeader>
                  <CardTitle>Volunteer Engagement</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-primary mb-2">92%</div>
                  <p className="text-muted-foreground">Active volunteer rate</p>
                  <Progress value={92} className="mt-4" />
                </CardContent>
              </Card>

              <Card className="border-border">
                <CardHeader>
                  <CardTitle>Support Resolution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-accent mb-2">24h</div>
                  <p className="text-muted-foreground">Average response time</p>
                  <Progress value={85} className="mt-4" />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
