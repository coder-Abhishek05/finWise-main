import Link from "next/link"
import { GraduationCap, Facebook, Twitter, Instagram, Mail } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-card border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2 font-bold text-xl text-primary">
              <GraduationCap className="h-8 w-8" />
              <span className="text-balance">FinLit Academy</span>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Empowering underprivileged communities through accessible financial education and resources.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-card-foreground mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/courses" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  Courses
                </Link>
              </li>
              <li>
                <Link href="/tools" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  Financial Tools
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/quiz" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  Quiz
                </Link>
              </li>
            </ul>
          </div>

          {/* Get Involved */}
          <div>
            <h3 className="font-semibold text-card-foreground mb-4">Get Involved</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/volunteer/register"
                  className="text-muted-foreground hover:text-primary transition-colors text-sm"
                >
                  Become a Volunteer
                </Link>
              </li>
              <li>
                <Link
                  href="/volunteer/login"
                  className="text-muted-foreground hover:text-primary transition-colors text-sm"
                >
                  Volunteer Login
                </Link>
              </li>
              <li>
                <Link
                  href="/employee/login"
                  className="text-muted-foreground hover:text-primary transition-colors text-sm"
                >
                  Employee Login
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-card-foreground mb-4">Contact</h3>
            <div className="space-y-2">
              <p className="text-muted-foreground text-sm">
                <Mail className="h-4 w-4 inline mr-2" />
                info@finlitacademy.org
              </p>
              <div className="flex gap-4 pt-2">
                <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  <Facebook className="h-5 w-5" />
                </Link>
                <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  <Twitter className="h-5 w-5" />
                </Link>
                <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  <Instagram className="h-5 w-5" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 text-center">
          <p className="text-muted-foreground text-sm">
            © 2024 FinLit Academy. All rights reserved. Empowering financial literacy for all.
          </p>
        </div>
      </div>
    </footer>
  )
}
