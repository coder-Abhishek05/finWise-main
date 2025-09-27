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
import { blogAPI } from "@/services/api"

type BlogFormData = {
  title: string
  slug: string
  content: string
  image_url: string
  image_alt: string
  image_caption: string
}

export default function NewBlogPage() {
  const router = useRouter()
  const [formData, setFormData] = useState<BlogFormData>({
    title: "",
    slug: "",
    content: "",
    image_url: "",
    image_alt: "",
    image_caption: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [preview, setPreview] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")

    // Validate required fields
    if (!formData.title || !formData.slug || !formData.content) {
      setError("Please fill in all required fields")
      setIsSubmitting(false)
      return
    }

    try {
      await blogAPI.createBlog(formData)
      router.push("/volunteer/dashboard")
    } catch (error) {
      setError("Failed to create blog post. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
  }

  const handleTitleChange = (title: string) => {
    setFormData((prev) => ({
      ...prev,
      title,
      slug: generateSlug(title),
    }))
  }

  if (preview) {
    return (
      <div className="min-h-screen py-12 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Preview Header */}
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-bold text-foreground">Blog Preview</h1>
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
              {formData.image_url && (
                <img
                  src={formData.image_url}
                  alt={formData.image_alt}
                  className="w-full h-64 object-cover rounded-lg mb-6"
                />
              )}
              <div
                className="prose prose-lg max-w-none text-foreground"
                dangerouslySetInnerHTML={{ __html: formData.content }}
              />
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
            <h1 className="text-2xl font-bold text-foreground">Create New Blog Post</h1>
            <p className="text-muted-foreground">Share your financial knowledge with the community</p>
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

        {/* Blog Form */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle>Blog Post Details</CardTitle>
            <CardDescription>Fill in the information for your blog post</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="Enter blog post title"
                  required
                  disabled={isSubmitting}
                />
              </div>

              {/* Slug */}
              <div className="space-y-2">
                <Label htmlFor="slug">URL Slug *</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))}
                  placeholder="url-friendly-slug"
                  required
                  disabled={isSubmitting}
                />
                <p className="text-xs text-muted-foreground">
                  This will be used in the URL: /blog/{formData.slug}
                </p>
              </div>

              {/* Content */}
              <div className="space-y-2">
                <Label htmlFor="content">Content *</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData((prev) => ({ ...prev, content: e.target.value }))}
                  placeholder="Write your blog post content here. You can use HTML tags for formatting."
                  rows={15}
                  required
                  disabled={isSubmitting}
                />
                <p className="text-xs text-muted-foreground">
                  You can use HTML tags for formatting (e.g., &lt;p&gt;, &lt;h2&gt;, &lt;ul&gt;, etc.)
                </p>
              </div>

              {/* Image URL */}
              <div className="space-y-2">
                <Label htmlFor="image_url">Featured Image URL</Label>
                <Input
                  id="image_url"
                  value={formData.image_url}
                  onChange={(e) => setFormData((prev) => ({ ...prev, image_url: e.target.value }))}
                  placeholder="https://example.com/image.jpg"
                  disabled={isSubmitting}
                />
              </div>

              {/* Image Alt Text */}
              <div className="space-y-2">
                <Label htmlFor="image_alt">Image Alt Text</Label>
                <Input
                  id="image_alt"
                  value={formData.image_alt}
                  onChange={(e) => setFormData((prev) => ({ ...prev, image_alt: e.target.value }))}
                  placeholder="Describe the image for accessibility"
                  disabled={isSubmitting}
                />
              </div>

              {/* Image Caption */}
              <div className="space-y-2">
                <Label htmlFor="image_caption">Image Caption</Label>
                <Input
                  id="image_caption"
                  value={formData.image_caption}
                  onChange={(e) => setFormData((prev) => ({ ...prev, image_caption: e.target.value }))}
                  placeholder="Optional caption for the image"
                  disabled={isSubmitting}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setPreview(true)}
                  disabled={!formData.title || !formData.content}
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
                  {isSubmitting ? "Publishing..." : "Publish Blog Post"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}