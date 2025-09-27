"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Save, Eye } from "lucide-react"
import Link from "next/link"
import { coursesAPI } from "@/services/api"

type CourseFormData = {
  title: string
  description: string
  rating: number
  thumbnail_url: string
  video_url: string
  content: string
}

export default function NewCoursePage() {
  const router = useRouter()
  const [formData, setFormData] = useState<CourseFormData>({
    title: "",
    description: "",
    rating: 0,
    thumbnail_url: "",
    video_url: "",
    content: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [preview, setPreview] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")

    // Validate required fields
    if (!formData.title || !formData.description) {
      setError("Please fill in all required fields")
      setIsSubmitting(false)
      return
    }

    try {
      const response = await fetch("http://127.0.0.1:5000/course", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        router.push("/volunteer/dashboard")
      } else {
        const data = await response.json()
        setError(data.error || "Failed to create course")
      }
    } catch (error) {
      setError("Failed to create course. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (preview) {
    return (
      <div className="min-h-screen py-12 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Preview Header */}
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-bold text-foreground">Course Preview</h1>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setPreview(false)}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Edit
              </Button>
            </div>
          </div>

          {/* Preview Content */}
          <Card className="border-border">
            <CardContent className="p-8">
              <h1 className="text-3xl font-bold text-balance mb-4 text-foreground">
                {formData.title}
              </h1>
              <p className="text-lg text-muted-foreground mb-6">{formData.description}</p>
              {formData.thumbnail_url && (
                <img
                  src={formData.thumbnail_url}
                  alt={formData.title}
                  className="w-full h-64 object-cover rounded-lg mb-6"
                />
              )}
              {formData.video_url && (
                <div className="aspect-video bg-muted rounded-lg overflow-hidden mb-6">
                  <iframe src={formData.video_url} title={formData.title} className="w-full h-full" allowFullScreen />
                </div>
              )}
              {formData.content && (
                <div
                  className="prose prose-lg max-w-none text-foreground"
                  dangerouslySetInnerHTML={{ __html: formData.content }}
                />
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Create New Course</h1>
            <p className="text-muted-foreground">Share your financial expertise with learners</p>
          </div>
          <Link href="/volunteer/dashboard">
            <Button variant="ghost" className="text-muted-foreground hover:text-primary">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Course Form */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle>Course Details</CardTitle>
            <CardDescription>Fill in the information for your course</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title">Course Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter course title"
                  required
                  disabled={isSubmitting}
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Course Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe what students will learn in this course"
                  rows={4}
                  required
                  disabled={isSubmitting}
                />
              </div>

              {/* Rating */}
              <div className="space-y-2">
                <Label htmlFor="rating">Course Rating (0-5)</Label>
                <Input
                  id="rating"
                  type="number"
                  min="0"
                  max="5"
                  step="0.1"
                  value={formData.rating}
                  onChange={(e) => setFormData((prev) => ({ ...prev, rating: parseFloat(e.target.value) || 0 }))}
                  placeholder="4.5"
                  disabled={isSubmitting}
                />
              </div>

              {/* Thumbnail URL */}
              <div className="space-y-2">
                <Label htmlFor="thumbnail_url">Thumbnail Image URL</Label>
                <Input
                  id="thumbnail_url"
                  value={formData.thumbnail_url}
                  onChange={(e) => setFormData((prev) => ({ ...prev, thumbnail_url: e.target.value }))}
                  placeholder="https://example.com/thumbnail.jpg"
                  disabled={isSubmitting}
                />
              </div>

              {/* Video URL */}
              <div className="space-y-2">
                <Label htmlFor="video_url">Video URL (YouTube embed)</Label>
                <Input
                  id="video_url"
                  value={formData.video_url}
                  onChange={(e) => setFormData((prev) => ({ ...prev, video_url: e.target.value }))}
                  placeholder="https://www.youtube.com/embed/VIDEO_ID"
                  disabled={isSubmitting}
                />
                <p className="text-xs text-muted-foreground">
                  Use YouTube embed URL format: https://www.youtube.com/embed/VIDEO_ID
                </p>
              </div>

              {/* Content */}
              <div className="space-y-2">
                <Label htmlFor="content">Course Content</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData((prev) => ({ ...prev, content: e.target.value }))}
                  placeholder="Write detailed course content here. You can use HTML tags for formatting."
                  rows={10}
                  disabled={isSubmitting}
                />
                <p className="text-xs text-muted-foreground">
                  You can use HTML tags for formatting (e.g., &lt;p&gt;, &lt;h2&gt;, &lt;ul&gt;, etc.)
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setPreview(true)}
                  disabled={!formData.title || !formData.description}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Preview
                </Button>
                <Button
                  type="submit"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                  disabled={isSubmitting}
                >
                  <Save className="h-4 w-4 mr-2" />
                  {isSubmitting ? "Creating..." : "Create Course"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
