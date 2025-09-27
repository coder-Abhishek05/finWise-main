"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Plus, Edit, Trash2, Eye, Loader2 } from "lucide-react"
import { quizAPI } from "@/services/api"

type Quiz = {
  id: number
  title: string
  data: any
  created_at: string
}

export default function QuizManagementPage() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    data: "",
  })

  useEffect(() => {
    loadQuizzes()
  }, [])

  const loadQuizzes = async () => {
    try {
      setLoading(true)
      const data = await quizAPI.getAllQuizzes()
      setQuizzes(Array.isArray(data) ? data : [])
    } catch (err) {
      setError("Failed to load quizzes")
      console.error("Error loading quizzes:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateQuiz = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")

    try {
      let quizData
      try {
        quizData = JSON.parse(formData.data)
      } catch {
        setError("Invalid JSON format for quiz data")
        setIsSubmitting(false)
        return
      }

      const response = await fetch("http://127.0.0.1:5000/quiz", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: formData.title,
          data: quizData,
        }),
      })

      if (response.ok) {
        setFormData({ title: "", data: "" })
        setShowCreateForm(false)
        loadQuizzes()
      } else {
        const data = await response.json()
        setError(data.error || "Failed to create quiz")
      }
    } catch (error) {
      setError("Failed to create quiz. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteQuiz = async (id: number) => {
    if (!confirm("Are you sure you want to delete this quiz?")) return

    try {
      const response = await fetch(`http://127.0.0.1:5000/quiz/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        loadQuizzes()
      } else {
        setError("Failed to delete quiz")
      }
    } catch (error) {
      setError("Failed to delete quiz")
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading quizzes...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Quiz Management</h1>
            <p className="text-muted-foreground">Create and manage financial literacy quizzes</p>
          </div>
          <div className="flex gap-2">
            <Link href="/volunteer/dashboard">
              <Button variant="ghost" className="text-muted-foreground hover:text-primary">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <Button onClick={() => setShowCreateForm(true)} className="bg-primary hover:bg-primary/90 text-primary-foreground">
              <Plus className="h-4 w-4 mr-2" />
              Create Quiz
            </Button>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Create Quiz Form */}
        {showCreateForm && (
          <Card className="mb-8 border-border">
            <CardHeader>
              <CardTitle>Create New Quiz</CardTitle>
              <CardDescription>Design a quiz to test financial knowledge</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateQuiz} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Quiz Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter quiz title"
                    required
                    disabled={isSubmitting}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="data">Quiz Data (JSON)</Label>
                  <Textarea
                    id="data"
                    value={formData.data}
                    onChange={(e) => setFormData((prev) => ({ ...prev, data: e.target.value }))}
                    placeholder='{"questions": [{"question": "What is APR?", "options": ["Annual Percentage Rate", "Average Payment Rate"], "correct": 0}]}'
                    rows={10}
                    required
                    disabled={isSubmitting}
                  />
                  <p className="text-xs text-muted-foreground">
                    Enter quiz data in JSON format with questions, options, and correct answers
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Creating..." : "Create Quiz"}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setShowCreateForm(false)}>
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Quizzes List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quizzes.map((quiz) => (
            <Card key={quiz.id} className="border-border">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{quiz.title}</CardTitle>
                  <Badge variant="secondary">
                    {quiz.data?.questions?.length || 0} questions
                  </Badge>
                </div>
                <CardDescription>
                  Created {new Date(quiz.created_at).toLocaleDateString()}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteQuiz(quiz.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {quizzes.length === 0 && !showCreateForm && (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">No quizzes created yet</p>
            <Button onClick={() => setShowCreateForm(true)} className="bg-primary hover:bg-primary/90 text-primary-foreground">
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Quiz
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
