"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, Users, Star, Play, Loader2 } from "lucide-react"
import { coursesAPI } from "@/services/api"

type Course = {
  id: number
  title: string
  description: string
  thumbnail?: string
  duration: string
  students: number
  rating: number
  level: string
  category: string
}

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const loadCourses = async () => {
      try {
        setLoading(true)
        const data = await coursesAPI.getAllCourses()
        setCourses(Array.isArray(data) ? (data as Course[]) : [])
      } catch (err) {
        setError("Failed to load courses")
        console.error("Error loading courses:", err)
      } finally {
        setLoading(false)
      }
    }

    loadCourses()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading courses...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-destructive mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    )
  }
  // </CHANGE>

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-balance mb-6 text-foreground">
            Financial Literacy Courses
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto text-pretty leading-relaxed">
            Master your finances with our comprehensive courses designed by experts and taught by passionate volunteers.
            Start your journey to financial independence today.
          </p>
        </div>

        {/* Course Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course) => (
            <Card key={course.id} className="border-border hover:shadow-lg transition-all duration-300 group">
              <div className="relative overflow-hidden rounded-t-lg">
                <img
                  src={course.thumbnail || "/placeholder.svg"}
                  alt={course.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4">
                  <Badge variant="secondary" className="bg-background/90 text-foreground">
                    {course.level}
                  </Badge>
                </div>
                <div className="absolute top-4 right-4">
                  <Badge className="bg-primary text-primary-foreground">{course.category}</Badge>
                </div>
              </div>

              <CardHeader>
                <CardTitle className="text-xl text-balance leading-tight">{course.title}</CardTitle>
                <CardDescription className="text-pretty leading-relaxed">{course.description}</CardDescription>
              </CardHeader>

              <CardContent>
                <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {course.duration}
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {course.students.toLocaleString()}
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-current text-accent" />
                    {course.rating}
                  </div>
                </div>

                <Link href={`/courses/${course.id}`}>
                  <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                    <Play className="h-4 w-4 mr-2" />
                    Start Learning
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16 p-8 bg-card rounded-lg border border-border">
          <h2 className="text-2xl font-bold text-balance mb-4 text-card-foreground">
            Ready to Start Your Financial Journey?
          </h2>
          <p className="text-muted-foreground mb-6 text-pretty leading-relaxed">
            Join our community of learners and take control of your financial future with expert-designed courses.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/volunteer/register">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                Get Started Free
              </Button>
            </Link>
            <Link href="/tools">
              <Button size="lg" variant="outline">
                Try Our Tools
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
