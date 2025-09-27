"use client"

import { useState, useEffect } from "react"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  BookOpen,
  Users,
  MessageSquare,
  Award,
  Calendar,
  TrendingUp,
  Edit,
  Plus,
  Clock,
  CheckCircle,
  Star,
  Loader2,
} from "lucide-react"
import Link from "next/link"
import { volunteerAPI } from "@/services/api"

type VolunteerProfile = {
  id: number
  name: string
  email: string
  joinDate?: string
  status?: string
  bio?: string
  interests: string[]
  hoursContributed?: number
  studentsHelped?: number
  coursesCreated?: number
  articlesWritten?: number
  avatar?: string
}

type VolunteerCourse = {
  id: number
  title: string
  students: number
  rating: number
  status: string
}

type VolunteerActivity = {
  type: "course" | "blog" | "mentoring"
  title: string
  date: string
  status?: string
}

type VolunteerTask = {
  title: string
  dueDate: string
  priority: "high" | "medium" | "low"
}

type VolunteerDashboardData = {
  profile: VolunteerProfile
  recentActivity: VolunteerActivity[]
  courses: VolunteerCourse[]
  upcomingTasks: VolunteerTask[]
}

export default function VolunteerDashboard() {
  const [activeTab, setActiveTab] = useState("overview")
  const [volunteerData, setVolunteerData] = useState<VolunteerDashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const loadVolunteerData = async () => {
      try {
        setLoading(true)
        // In a real app, you'd get the volunteer ID from authentication context
        const data = await volunteerAPI.getVolunteerProfile("current-user")
        setVolunteerData(data as VolunteerDashboardData)
      } catch (err) {
        setError("Failed to load volunteer data")
        console.error("Error loading volunteer data:", err)
      } finally {
        setLoading(false)
      }
    }

    loadVolunteerData()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (error || !volunteerData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-destructive mb-4">{error || "No volunteer data found"}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div className="flex items-center gap-4 mb-4 md:mb-0">
            <Avatar className="h-16 w-16">
              <AvatarImage src={volunteerData.profile.avatar || "/placeholder.svg"} alt={volunteerData.profile.name} />
              <AvatarFallback>
                {volunteerData.profile.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                Welcome back, {volunteerData.profile.name.split(" ")[0]}!
              </h1>
              <p className="text-muted-foreground">
                Volunteer since {volunteerData.profile.joinDate ? new Date(volunteerData.profile.joinDate).toLocaleDateString() : "N/A"}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Edit className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
            <Link href="/volunteer/blog/new">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                <Plus className="h-4 w-4 mr-2" />
                Add Blog
              </Button>
            </Link>
            <Link href="/volunteer/course/new">
              <Button variant="outline" className="bg-transparent">
                <Plus className="h-4 w-4 mr-2" />
                Add Course
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Hours Contributed</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{volunteerData.profile.hoursContributed}</div>
              <p className="text-xs text-muted-foreground">+12 hours this month</p>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Students Helped</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-accent">{volunteerData.profile.studentsHelped}</div>
              <p className="text-xs text-muted-foreground">+8 new this month</p>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Courses Created</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{volunteerData.profile.coursesCreated}</div>
              <p className="text-xs text-muted-foreground">1 in progress</p>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Articles Written</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-accent">{volunteerData.profile.articlesWritten}</div>
              <p className="text-xs text-muted-foreground">2 pending review</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="courses">My Courses</TabsTrigger>
            <TabsTrigger value="quizzes">Quizzes</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
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
                    {volunteerData.recentActivity.map((activity, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="mt-1">
                          {activity.type === "course" && <BookOpen className="h-4 w-4 text-primary" />}
                          {activity.type === "blog" && <MessageSquare className="h-4 w-4 text-accent" />}
                          {activity.type === "mentoring" && <Users className="h-4 w-4 text-primary" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground">{activity.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(activity.date).toLocaleDateString()}
                          </p>
                        </div>
                        <CheckCircle className="h-4 w-4 text-green-500 mt-1" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Upcoming Tasks */}
              <Card className="border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Upcoming Tasks
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {volunteerData.upcomingTasks.map((task, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-foreground">{task.title}</p>
                          <p className="text-xs text-muted-foreground">Due: {task.dueDate}</p>
                        </div>
                        <Badge variant={task.priority === "high" ? "destructive" : "secondary"}>{task.priority}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Impact Summary */}
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Your Impact This Month
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Course Engagement</span>
                      <span className="text-sm text-muted-foreground">85%</span>
                    </div>
                    <Progress value={85} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Student Satisfaction</span>
                      <span className="text-sm text-muted-foreground">4.8/5</span>
                    </div>
                    <Progress value={96} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Content Quality</span>
                      <span className="text-sm text-muted-foreground">92%</span>
                    </div>
                    <Progress value={92} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="courses" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-foreground">My Courses</h2>
              <Link href="/volunteer/course/new">
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  <Plus className="h-4 w-4 mr-2" />
                  Create New Course
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {volunteerData.courses.map((course) => (
                <Card key={course.id} className="border-border">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <Badge variant={course.status === "published" ? "default" : "secondary"}>{course.status}</Badge>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        <span className="text-sm">{course.rating}</span>
                      </div>
                    </div>
                    <CardTitle className="text-lg">{course.title}</CardTitle>
                    <CardDescription>{course.students} students enrolled</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                        Edit
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                        View
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="quizzes" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-foreground">Quiz Management</h2>
              <Link href="/volunteer/quiz">
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  <Plus className="h-4 w-4 mr-2" />
                  Manage Quizzes
                </Button>
              </Link>
            </div>

            <Card className="border-border">
              <CardHeader>
                <CardTitle>Quick Quiz Actions</CardTitle>
                <CardDescription>Create and manage financial literacy quizzes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Link href="/volunteer/quiz">
                    <Button className="w-full justify-start bg-primary hover:bg-primary/90 text-primary-foreground">
                      <Plus className="h-4 w-4 mr-2" />
                      Create New Quiz
                    </Button>
                  </Link>
                  <Link href="/quiz">
                    <Button variant="outline" className="w-full justify-start bg-transparent">
                      <Eye className="h-4 w-4 mr-2" />
                      View All Quizzes
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity" className="space-y-6">
            <h2 className="text-2xl font-bold text-foreground">Activity History</h2>
            <Card className="border-border">
              <CardContent className="p-6">
                <div className="space-y-6">
                  {volunteerData.recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-start gap-4 pb-4 border-b border-border last:border-0">
                      <div className="mt-1">
                        {activity.type === "course" && <BookOpen className="h-5 w-5 text-primary" />}
                        {activity.type === "blog" && <MessageSquare className="h-5 w-5 text-accent" />}
                        {activity.type === "mentoring" && <Users className="h-5 w-5 text-primary" />}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-foreground">{activity.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {new Date(activity.date).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                      <Badge variant="outline" className="text-green-600 border-green-600">
                        {activity.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profile" className="space-y-6">
            <h2 className="text-2xl font-bold text-foreground">Profile Settings</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-border">
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium">Name</Label>
                    <p className="text-foreground">{volunteerData.profile.name}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Email</Label>
                    <p className="text-foreground">{volunteerData.profile.email}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Bio</Label>
                    <p className="text-muted-foreground text-sm">{volunteerData.profile.bio}</p>
                  </div>
                  <Button variant="outline">Edit Profile</Button>
                </CardContent>
              </Card>

              <Card className="border-border">
                <CardHeader>
                  <CardTitle>Volunteer Preferences</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium">Areas of Interest</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {volunteerData.profile.interests.map((interest) => (
                        <Badge key={interest} variant="secondary">
                          {interest}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Status</Label>
                    <p className="text-foreground">{volunteerData.profile.status}</p>
                  </div>
                  <Button variant="outline">Update Preferences</Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
