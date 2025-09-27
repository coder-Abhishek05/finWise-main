export interface AdminStats {
  totalUsers: number
  activeVolunteers: number
  pendingApplications: number
  totalCourses: number
  pendingContent: number
  supportTickets: number
  monthlyGrowth: number
}

export interface PendingVolunteer {
  id: number
  name: string
  email: string
  experience: string
  interests: string[]
  appliedDate: string
  status: "pending" | "approved" | "rejected"
}

export interface PendingContentItem {
  id: number
  title: string
  type: "course" | "blog"
  author: string
  submittedDate: string
  status: "review" | "approved" | "rejected"
}

export interface SupportTicket {
  id: number
  subject: string
  user: string
  priority: "high" | "medium" | "low"
  status: "open" | "in-progress" | "closed"
  createdDate: string
}

export interface RecentActivityItem {
  action: string
  content?: string
  user?: string
  ticket?: string
  timestamp: string
}

export interface AdminDashboardData {
  stats: AdminStats
  pendingVolunteers: PendingVolunteer[]
  pendingContent: PendingContentItem[]
  supportTickets: SupportTicket[]
  recentActivity: RecentActivityItem[]
}


