import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { GraduationCap, Calculator, BookOpen, Users, Award, TrendingUp } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/5 via-background to-accent/5 py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-balance mb-6 text-foreground">
            Empowering Financial
            <span className="text-primary"> Literacy</span> for All
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto text-pretty leading-relaxed">
            Breaking barriers to financial education. Learn, grow, and build a secure financial future with our
            comprehensive platform designed for everyone.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/courses">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3">
                Explore Courses
              </Button>
            </Link>
            <Link href="/volunteer/register">
              <Button size="lg" variant="outline" className="px-8 py-3 bg-transparent">
                Join as Volunteer
              </Button>
            </Link>
            <Link href="/tools">
              <Button
                size="lg"
                variant="secondary"
                className="bg-accent hover:bg-accent/90 text-accent-foreground px-8 py-3"
              >
                Try Financial Tools
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-balance mb-4 text-foreground">
              Everything You Need to Succeed
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty leading-relaxed">
              Our comprehensive platform provides tools, education, and community support to help you master your
              finances.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-border hover:shadow-lg transition-shadow">
              <CardHeader>
                <GraduationCap className="h-12 w-12 text-primary mb-4" />
                <CardTitle className="text-xl">Interactive Courses</CardTitle>
                <CardDescription>
                  Learn at your own pace with our structured financial literacy courses designed for all skill levels.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border hover:shadow-lg transition-shadow">
              <CardHeader>
                <Calculator className="h-12 w-12 text-accent mb-4" />
                <CardTitle className="text-xl">Financial Tools</CardTitle>
                <CardDescription>
                  Access powerful calculators and planning tools to make informed financial decisions.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border hover:shadow-lg transition-shadow">
              <CardHeader>
                <BookOpen className="h-12 w-12 text-primary mb-4" />
                <CardTitle className="text-xl">Expert Content</CardTitle>
                <CardDescription>
                  Read insights and tips from financial experts and community volunteers.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border hover:shadow-lg transition-shadow">
              <CardHeader>
                <Users className="h-12 w-12 text-accent mb-4" />
                <CardTitle className="text-xl">Community Support</CardTitle>
                <CardDescription>
                  Connect with volunteers and peers who are on the same financial journey.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border hover:shadow-lg transition-shadow">
              <CardHeader>
                <Award className="h-12 w-12 text-primary mb-4" />
                <CardTitle className="text-xl">Track Progress</CardTitle>
                <CardDescription>Monitor your learning journey with quizzes and achievement tracking.</CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border hover:shadow-lg transition-shadow">
              <CardHeader>
                <TrendingUp className="h-12 w-12 text-accent mb-4" />
                <CardTitle className="text-xl">Real Results</CardTitle>
                <CardDescription>
                  Join thousands who have improved their financial well-being through our platform.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="bg-card py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-balance mb-6 text-card-foreground">
                About Our Mission
              </h2>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                FinLit Academy was created with a simple yet powerful vision: to make financial education accessible to
                everyone, regardless of their background or economic status.
              </p>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                We believe that financial literacy is a fundamental right that can break cycles of poverty and create
                opportunities for a better future. Our platform combines expert knowledge with community support to
                create a comprehensive learning experience.
              </p>
              <Link href="/volunteer/register">
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">Join Our Community</Button>
              </Link>
            </div>
            <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg p-8">
              <div className="grid grid-cols-2 gap-6 text-center">
                <div>
                  <div className="text-3xl font-bold text-primary mb-2">10K+</div>
                  <div className="text-muted-foreground">Students Helped</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-accent mb-2">500+</div>
                  <div className="text-muted-foreground">Volunteers</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary mb-2">50+</div>
                  <div className="text-muted-foreground">Courses</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-accent mb-2">95%</div>
                  <div className="text-muted-foreground">Success Rate</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-balance mb-6 text-foreground">
            Ready to Transform Your Financial Future?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 text-pretty leading-relaxed">
            Join thousands of learners who have already started their journey to financial independence. Start learning
            today, completely free.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/courses">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3">
                Start Learning Now
              </Button>
            </Link>
            <Link href="/tools">
              <Button size="lg" variant="outline" className="px-8 py-3 bg-transparent">
                Explore Tools
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
