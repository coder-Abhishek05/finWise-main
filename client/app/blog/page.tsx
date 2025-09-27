"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, User, ArrowRight, Loader2 } from "lucide-react"
import { blogAPI } from "@/services/api"

type Blog = {
  id: number
  title: string
  description: string
  author: string
  date: string
  category: string
  thumbnail?: string
  readTime?: string
}

export default function BlogPage() {
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const loadBlogs = async () => {
      try {
        setLoading(true)
        const data = await blogAPI.getAllBlogs()
        setBlogs(Array.isArray(data) ? (data as Blog[]) : [])
      } catch (err) {
        setError("Failed to load blog posts")
        console.error("Error loading blogs:", err)
      } finally {
        setLoading(false)
      }
    }

    loadBlogs()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading blog posts...</p>
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

  if (blogs.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">No blog posts available</p>
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
            Financial Insights & Tips
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto text-pretty leading-relaxed">
            Stay informed with expert advice, practical tips, and real-world insights from our community of financial
            educators and volunteers.
          </p>
        </div>

        {/* Featured Post */}
        <Card className="mb-12 border-border overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="relative">
              <img
                src={blogs[0].thumbnail || "/placeholder.svg"}
                alt={blogs[0].title}
                className="w-full h-64 lg:h-full object-cover"
              />
              <div className="absolute top-4 left-4">
                <Badge className="bg-primary text-primary-foreground">Featured</Badge>
              </div>
            </div>
            <div className="p-8 flex flex-col justify-center">
              <Badge variant="secondary" className="w-fit mb-4">
                {blogs[0].category}
              </Badge>
              <h2 className="text-2xl md:text-3xl font-bold text-balance mb-4 text-foreground">{blogs[0].title}</h2>
              <p className="text-muted-foreground text-pretty leading-relaxed mb-6">{blogs[0].description}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    {blogs[0].author}
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {new Date(blogs[0].date).toLocaleDateString()}
                  </div>
                </div>
                <Link href={`/blog/${blogs[0].id}`}>
                  <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                    Read More
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </Card>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.slice(1).map((blog) => (
            <Card key={blog.id} className="border-border hover:shadow-lg transition-all duration-300 group">
              <div className="relative overflow-hidden rounded-t-lg">
                <img
                  src={blog.thumbnail || "/placeholder.svg"}
                  alt={blog.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4">
                  <Badge variant="secondary" className="bg-background/90 text-foreground">
                    {blog.category}
                  </Badge>
                </div>
              </div>

              <CardHeader>
                <CardTitle className="text-xl text-balance leading-tight">{blog.title}</CardTitle>
                <CardDescription className="text-pretty leading-relaxed">{blog.description}</CardDescription>
              </CardHeader>

              <CardContent>
                <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                  <div className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    {blog.author}
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {new Date(blog.date).toLocaleDateString()}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{blog.readTime}</span>
                  <Link href={`/blog/${blog.id}`}>
                    <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">
                      Read More
                      <ArrowRight className="h-4 w-4 ml-1" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16 p-8 bg-card rounded-lg border border-border">
          <h2 className="text-2xl font-bold text-balance mb-4 text-card-foreground">Want to Share Your Knowledge?</h2>
          <p className="text-muted-foreground mb-6 text-pretty leading-relaxed">
            Join our community of volunteer writers and help others on their financial journey by sharing your insights
            and experiences.
          </p>
          <Link href="/volunteer/register">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
              Become a Volunteer Writer
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
