import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Heart, Users, BookOpen, Award, CheckCircle, ArrowRight } from "lucide-react"

export default function VolunteerPage() {
  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-balance mb-6 text-foreground">
            Make a <span className="text-primary">Difference</span> Today
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto text-pretty leading-relaxed">
            Join our community of passionate volunteers and help empower others through financial education. Your
            knowledge can change lives.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/volunteer/register">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3">
                <Heart className="h-5 w-5 mr-2" />
                Become a Volunteer
              </Button>
            </Link>
            <Link href="/volunteer/login">
              <Button size="lg" variant="outline" className="px-8 py-3 bg-transparent">
                Volunteer Login
              </Button>
            </Link>
          </div>
        </div>

        {/* Impact Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-16">
          <Card className="text-center border-border">
            <CardHeader>
              <div className="text-3xl font-bold text-primary mb-2">500+</div>
              <CardTitle className="text-lg">Active Volunteers</CardTitle>
            </CardHeader>
          </Card>
          <Card className="text-center border-border">
            <CardHeader>
              <div className="text-3xl font-bold text-accent mb-2">10K+</div>
              <CardTitle className="text-lg">Students Helped</CardTitle>
            </CardHeader>
          </Card>
          <Card className="text-center border-border">
            <CardHeader>
              <div className="text-3xl font-bold text-primary mb-2">50+</div>
              <CardTitle className="text-lg">Courses Created</CardTitle>
            </CardHeader>
          </Card>
          <Card className="text-center border-border">
            <CardHeader>
              <div className="text-3xl font-bold text-accent mb-2">95%</div>
              <CardTitle className="text-lg">Satisfaction Rate</CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Why Volunteer */}
        <div className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-balance text-center mb-12 text-foreground">
            Why Volunteer with Us?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-border hover:shadow-lg transition-shadow">
              <CardHeader>
                <Heart className="h-12 w-12 text-primary mb-4" />
                <CardTitle className="text-xl">Make Real Impact</CardTitle>
                <CardDescription>
                  Directly help individuals and families improve their financial well-being and break cycles of poverty.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border hover:shadow-lg transition-shadow">
              <CardHeader>
                <Users className="h-12 w-12 text-accent mb-4" />
                <CardTitle className="text-xl">Join a Community</CardTitle>
                <CardDescription>
                  Connect with like-minded individuals who share your passion for financial education and social impact.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border hover:shadow-lg transition-shadow">
              <CardHeader>
                <BookOpen className="h-12 w-12 text-primary mb-4" />
                <CardTitle className="text-xl">Share Your Knowledge</CardTitle>
                <CardDescription>
                  Use your expertise to create courses, write articles, and mentor others on their financial journey.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border hover:shadow-lg transition-shadow">
              <CardHeader>
                <Award className="h-12 w-12 text-accent mb-4" />
                <CardTitle className="text-xl">Develop Skills</CardTitle>
                <CardDescription>
                  Enhance your teaching, writing, and communication skills while building your professional network.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border hover:shadow-lg transition-shadow">
              <CardHeader>
                <CheckCircle className="h-12 w-12 text-primary mb-4" />
                <CardTitle className="text-xl">Flexible Commitment</CardTitle>
                <CardDescription>
                  Volunteer on your own schedule with opportunities ranging from a few hours to ongoing projects.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border hover:shadow-lg transition-shadow">
              <CardHeader>
                <Users className="h-12 w-12 text-accent mb-4" />
                <CardTitle className="text-xl">Recognition</CardTitle>
                <CardDescription>
                  Get recognized for your contributions with certificates, recommendations, and volunteer appreciation
                  events.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>

        {/* Volunteer Opportunities */}
        <div className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-balance text-center mb-12 text-foreground">
            Volunteer Opportunities
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="text-2xl text-primary">Content Creator</CardTitle>
                <CardDescription className="text-lg">
                  Create engaging courses, write blog posts, and develop educational materials
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                    Design and develop financial literacy courses
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                    Write informative blog articles and guides
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                    Create quizzes and interactive content
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardHeader>
                <CardTitle className="text-2xl text-accent">Mentor & Tutor</CardTitle>
                <CardDescription className="text-lg">
                  Provide one-on-one guidance and support to learners
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                    Mentor individuals on their financial journey
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                    Answer questions in community forums
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                    Host virtual Q&A sessions
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center p-8 bg-gradient-to-br from-primary/5 via-background to-accent/5 rounded-lg border border-border">
          <h2 className="text-3xl md:text-4xl font-bold text-balance mb-6 text-foreground">Ready to Make an Impact?</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto text-pretty leading-relaxed">
            Join our mission to make financial education accessible to everyone. Your contribution, no matter how small,
            can create lasting change.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/volunteer/register">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3">
                Start Volunteering Today
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </Link>
            <Link href="/courses">
              <Button size="lg" variant="outline" className="px-8 py-3 bg-transparent">
                Explore Our Courses
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
