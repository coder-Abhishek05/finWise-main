"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, User, ArrowLeft, Loader2 } from "lucide-react"
import { blogAPI } from "@/services/api"

type Blog = {
  id: number
  title: string
  description: string
  content: string
  author: string
  date: string
  category: string
  thumbnail?: string
  imageAlt?: string
  imageCaption?: string
  readTime?: string
}

export default function BlogDetailPage({ params }: { params: { id: string } }) {
  const [blog, setBlog] = useState<Blog | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const loadBlog = async () => {
      try {
        setLoading(true)
        const data = await blogAPI.getBlogById(params.id)
        setBlog(data as Blog)
      } catch (err) {
        setError("Failed to load blog post")
        console.error("Error loading blog:", err)
      } finally {
        setLoading(false)
      }
    }

    loadBlog()
  }, [params.id])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading blog post...</p>
        </div>
      </div>
    )
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-destructive mb-4">{error || "Blog post not found"}</p>
          <Link href="/blog">
            <Button>Back to Blog</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <div className="mb-8">
          <Link href="/blog">
            <Button variant="ghost" className="text-muted-foreground hover:text-primary">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Blog
            </Button>
          </Link>
        </div>

        {/* Blog Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Badge variant="secondary">{blog.category}</Badge>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              {new Date(blog.date).toLocaleDateString()}
            </div>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <User className="h-4 w-4" />
              {blog.author}
            </div>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-balance mb-6 text-foreground">
            {blog.title}
          </h1>

          <p className="text-xl text-muted-foreground text-pretty leading-relaxed mb-8">
            {blog.description}
          </p>
        </div>

        {/* Featured Image */}
        {blog.thumbnail && (
          <div className="mb-8">
            <img
              src={blog.thumbnail}
              alt={blog.imageAlt || blog.title}
              className="w-full h-64 md:h-96 object-cover rounded-lg"
            />
            {blog.imageCaption && (
              <p className="text-sm text-muted-foreground mt-2 text-center italic">
                {blog.imageCaption}
              </p>
            )}
          </div>
        )}

        {/* Blog Content */}
        <Card className="border-border">
          <CardContent className="p-8">
            <div className="prose prose-lg max-w-none text-foreground">
              {blog.content ? (
                <div dangerouslySetInnerHTML={{ __html: blog.content }} />
              ) : (
                <p>{blog.description}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Author Info */}
        <Card className="mt-8 border-border">
          <CardHeader>
            <CardTitle>About the Author</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">{blog.author}</h3>
                <p className="text-sm text-muted-foreground">
                  Financial education volunteer and content creator
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Related Posts CTA */}
        <div className="text-center mt-12 p-8 bg-card rounded-lg border border-border">
          <h2 className="text-2xl font-bold text-balance mb-4 text-card-foreground">
            Want to Read More?
          </h2>
          <p className="text-muted-foreground mb-6 text-pretty leading-relaxed">
            Explore more financial insights and tips from our community of experts.
          </p>
          <Link href="/blog">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
              View All Posts
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}