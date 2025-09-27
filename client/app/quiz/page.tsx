"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { CheckCircle, XCircle, Trophy, RotateCcw, BookOpen, TrendingUp, Clock, Loader2 } from "lucide-react"
import { quizAPI } from "@/services/api"

type QuizQuestion = {
  question: string
  options: string[]
  correct: number
  explanation: string
}

type QuizData = {
  title: string
  description: string
  timeLimit: number
  questions: QuizQuestion[]
}

export default function QuizPage() {
  const [quizData, setQuizData] = useState<QuizData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([])
  const [showResults, setShowResults] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState(0)
  const [quizStarted, setQuizStarted] = useState(false)

  useEffect(() => {
    loadQuiz()
  }, [])

  const loadQuiz = async () => {
    try {
      setLoading(true)
      const data = await quizAPI.getAllQuizzes()
      if (Array.isArray(data) && data.length > 0) {
        const quiz = data[0] // Use the first quiz
        const quizData = {
          title: quiz.title || "Financial Literacy Assessment",
          description: "Test your knowledge of personal finance fundamentals",
          timeLimit: 15,
          questions: quiz.data?.questions || []
        }
        setQuizData(quizData)
        setTimeRemaining(quizData.timeLimit * 60)
      } else {
        // Fallback to default quiz data
        setQuizData({
          title: "Financial Literacy Assessment",
          description: "Test your knowledge of personal finance fundamentals",
          timeLimit: 15,
          questions: [
            {
              question: "What is the recommended percentage of your income to save for emergencies?",
              options: ["5-10%", "10-20%", "20-30%", "30-40%"],
              correct: 1,
              explanation: "Financial experts recommend saving 10-20% of your income for emergencies, with a goal of building an emergency fund that covers 3-6 months of expenses.",
            },
            {
              question: "What does APR stand for in credit card terms?",
              options: ["Annual Percentage Rate", "Average Payment Rate", "Annual Premium Rate", "Automatic Payment Rate"],
              correct: 0,
              explanation: "APR stands for Annual Percentage Rate, which represents the yearly cost of borrowing money, including interest and fees.",
            },
            {
              question: "Which investment typically offers the highest potential returns over the long term?",
              options: ["Savings accounts", "Government bonds", "Stock market", "Certificates of deposit"],
              correct: 2,
              explanation: "Historically, the stock market has provided the highest long-term returns, though it also comes with higher risk and volatility.",
            },
          ]
        })
      }
    } catch (err) {
      setError("Failed to load quiz")
      console.error("Error loading quiz:", err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading quiz...</p>
        </div>
      </div>
    )
  }

  if (error || !quizData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-destructive mb-4">{error || "Quiz not found"}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    )
  }

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers]
    newAnswers[currentQuestion] = answerIndex
    setSelectedAnswers(newAnswers)
  }

  const handleNext = () => {
    if (currentQuestion < quizData.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      setShowResults(true)
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const calculateScore = () => {
    let correct = 0
    selectedAnswers.forEach((answer, index) => {
      if (answer === quizData.questions[index].correct) {
        correct++
      }
    })
    return correct
  }

  const getScoreLevel = (score: number) => {
    const percentage = (score / quizData.questions.length) * 100
    if (percentage >= 90) return { level: "Expert", color: "text-green-600", bgColor: "bg-green-100" }
    if (percentage >= 80) return { level: "Advanced", color: "text-blue-600", bgColor: "bg-blue-100" }
    if (percentage >= 70) return { level: "Intermediate", color: "text-yellow-600", bgColor: "bg-yellow-100" }
    if (percentage >= 60) return { level: "Beginner", color: "text-orange-600", bgColor: "bg-orange-100" }
    return { level: "Needs Improvement", color: "text-red-600", bgColor: "bg-red-100" }
  }

  const resetQuiz = () => {
    setCurrentQuestion(0)
    setSelectedAnswers([])
    setShowResults(false)
    setTimeRemaining(quizData.timeLimit * 60)
    setQuizStarted(false)
  }

  const startQuiz = () => {
    setQuizStarted(true)
  }

  if (!quizStarted) {
    return (
      <div className="min-h-screen py-12 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Quiz Introduction */}
          <div className="text-center mb-12">
            <div className="mx-auto mb-6 h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
              <Trophy className="h-10 w-10 text-primary" />
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-balance mb-6 text-foreground">{quizData.title}</h1>
            <p className="text-xl text-muted-foreground mb-8 text-pretty leading-relaxed">{quizData.description}</p>
          </div>

          {/* Quiz Info */}
          <Card className="max-w-2xl mx-auto border-border mb-8">
            <CardHeader>
              <CardTitle className="text-2xl text-center">Quiz Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div className="space-y-2">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                    <BookOpen className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <div className="font-semibold text-foreground">{quizData.questions.length} Questions</div>
                    <div className="text-sm text-muted-foreground">Multiple choice</div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center mx-auto">
                    <Clock className="h-6 w-6 text-accent" />
                  </div>
                  <div>
                    <div className="font-semibold text-foreground">{quizData.timeLimit} Minutes</div>
                    <div className="text-sm text-muted-foreground">Time limit</div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                    <TrendingUp className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <div className="font-semibold text-foreground">Instant Results</div>
                    <div className="text-sm text-muted-foreground">With explanations</div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-foreground">Instructions:</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    Read each question carefully and select the best answer
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    You can navigate back and forth between questions
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    Complete all questions before submitting
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    Review your results and explanations at the end
                  </li>
                </ul>
              </div>

              <Button
                onClick={startQuiz}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-3 text-lg"
              >
                Start Quiz
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (showResults) {
    const score = calculateScore()
    const percentage = Math.round((score / quizData.questions.length) * 100)
    const scoreLevel = getScoreLevel(score)

    return (
      <div className="min-h-screen py-12 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Results Header */}
          <div className="text-center mb-12">
            <div className="mx-auto mb-6 h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
              <Trophy className="h-10 w-10 text-primary" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-balance mb-4 text-foreground">Quiz Complete!</h1>
            <p className="text-lg text-muted-foreground">Here are your results and detailed explanations</p>
          </div>

          {/* Score Summary */}
          <Card className="border-border mb-8">
            <CardHeader>
              <CardTitle className="text-center text-2xl">Your Score</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-6">
              <div className="space-y-4">
                <div className="text-6xl font-bold text-primary">{percentage}%</div>
                <div className="space-y-2">
                  <Badge className={`${scoreLevel.bgColor} ${scoreLevel.color} text-lg px-4 py-2`}>
                    {scoreLevel.level}
                  </Badge>
                  <p className="text-muted-foreground">
                    You got {score} out of {quizData.questions.length} questions correct
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button onClick={resetQuiz} variant="outline" className="bg-transparent">
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Retake Quiz
                </Button>
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Explore Courses
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Detailed Results */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle>Detailed Results</CardTitle>
              <CardDescription>Review your answers and learn from the explanations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {quizData.questions.map((question, index) => {
                  const userAnswer = selectedAnswers[index]
                  const isCorrect = userAnswer === question.correct

                  return (
                    <div key={index} className="p-4 border border-border rounded-lg">
                      <div className="flex items-start gap-3 mb-3">
                        {isCorrect ? (
                          <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-500 mt-1 flex-shrink-0" />
                        )}
                        <div className="flex-1">
                          <h3 className="font-medium text-foreground mb-2">
                            Question {index + 1}: {question.question}
                          </h3>
                          <div className="space-y-1 text-sm">
                            <p className="text-muted-foreground">
                              Your answer:{" "}
                              <span className={isCorrect ? "text-green-600" : "text-red-600"}>
                                {question.options[userAnswer]}
                              </span>
                            </p>
                            {!isCorrect && (
                              <p className="text-muted-foreground">
                                Correct answer:{" "}
                                <span className="text-green-600">{question.options[question.correct]}</span>
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="ml-8 p-3 bg-muted/50 rounded-lg">
                        <p className="text-sm text-muted-foreground">
                          <strong>Explanation:</strong> {question.explanation}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const progress = ((currentQuestion + 1) / quizData.questions.length) * 100
  const currentQ = quizData.questions[currentQuestion]

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Progress Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-foreground">Financial Literacy Quiz</h1>
            <Badge variant="outline">
              Question {currentQuestion + 1} of {quizData.questions.length}
            </Badge>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Question Card */}
        <Card className="border-border mb-8">
          <CardHeader>
            <CardTitle className="text-xl text-balance leading-relaxed">{currentQ.question}</CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup
              value={selectedAnswers[currentQuestion]?.toString()}
              onValueChange={(value) => handleAnswerSelect(Number.parseInt(value))}
              className="space-y-4"
            >
              {currentQ.options.map((option, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-3 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                >
                  <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                  <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer text-foreground">
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Button
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            variant="outline"
            className="bg-transparent"
          >
            Previous
          </Button>

          <div className="text-sm text-muted-foreground">
            {selectedAnswers.filter((answer) => answer !== undefined).length} of {quizData.questions.length} answered
          </div>

          <Button
            onClick={handleNext}
            disabled={selectedAnswers[currentQuestion] === undefined}
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            {currentQuestion === quizData.questions.length - 1 ? "Finish Quiz" : "Next"}
          </Button>
        </div>
      </div>
    </div>
  )
}
