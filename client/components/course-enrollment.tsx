"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Play, CheckCircle, Clock } from "lucide-react"

interface CourseEnrollmentProps {
  courseId: string
  isEnrolled?: boolean
  progress?: number
}

export function CourseEnrollment({ courseId, isEnrolled = false, progress = 0 }: CourseEnrollmentProps) {
  const [enrolled, setEnrolled] = useState(isEnrolled)
  const [loading, setLoading] = useState(false)

  const handleEnrollment = async () => {
    setLoading(true)
    // TODO: Implement actual enrollment logic with API
    setTimeout(() => {
      setEnrolled(true)
      setLoading(false)
    }, 1000)
  }

  if (enrolled) {
    return (
      <Card className="border-border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <Badge className="bg-green-100 text-green-800 border-green-200">Enrolled</Badge>
            <span className="text-sm text-muted-foreground">{progress}% Complete</span>
          </div>
          <CardTitle className="text-lg">Continue Learning</CardTitle>
          <CardDescription>Pick up where you left off</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Progress value={progress} className="w-full" />
          <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
            <Play className="h-4 w-4 mr-2" />
            Continue Course
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle className="text-lg">Start Learning Today</CardTitle>
        <CardDescription>Join thousands of students who have transformed their financial lives</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button
          onClick={handleEnrollment}
          disabled={loading}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
          size="lg"
        >
          {loading ? (
            <>
              <Clock className="h-4 w-4 mr-2 animate-spin" />
              Enrolling...
            </>
          ) : (
            <>
              <Play className="h-4 w-4 mr-2" />
              Enroll Now - Free
            </>
          )}
        </Button>

        <div className="space-y-3 pt-4 border-t border-border">
          <h4 className="font-semibold text-foreground">What's included:</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
              Lifetime access to course materials
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
              Interactive exercises and quizzes
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
              Community support and discussions
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
              Certificate of completion
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
