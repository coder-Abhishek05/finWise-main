// API service layer for backend integration
// Switched to real backend endpoints for blogs and courses

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

// Mock data storage
const mockData = {
  users: [
    { id: 1, email: "volunteer@example.com", password: "password", type: "volunteer", name: "Sarah Johnson" },
    { id: 2, email: "employee@example.com", password: "password", type: "employee", name: "Admin User" },
  ],
  volunteers: [
    {
      id: 1,
      name: "Sarah Johnson",
      email: "sarah.johnson@email.com",
      joinDate: "2024-01-15",
      status: "Active",
      bio: "Financial advisor with 10+ years of experience helping individuals achieve financial independence.",
      interests: ["Course Creation", "Mentoring", "Blog Writing"],
      hoursContributed: 127,
      studentsHelped: 45,
      coursesCreated: 3,
      articlesWritten: 8,
    },
  ],
  courses: [
    {
      id: 1,
      title: "Personal Finance Fundamentals",
      description: "Learn the basics of budgeting, saving, and managing your personal finances effectively.",
      thumbnail: "/personal-finance-course-thumbnail.jpg",
      duration: "4 weeks",
      students: 1250,
      rating: 4.8,
      level: "Beginner",
      category: "Budgeting",
    },
    {
      id: 2,
      title: "Understanding Credit and Debt",
      description: "Master credit scores, debt management, and strategies to improve your financial health.",
      thumbnail: "/credit-and-debt-course-thumbnail.jpg",
      duration: "3 weeks",
      students: 890,
      rating: 4.7,
      level: "Intermediate",
      category: "Credit",
    },
  ],
  blogs: [
    {
      id: 1,
      title: "5 Simple Steps to Create Your First Budget",
      description: "Learn how to create a budget that actually works for your lifestyle and financial goals.",
      author: "Sarah Johnson",
      date: "2024-01-15",
      category: "Budgeting",
      thumbnail: "/budgeting-blog-post-thumbnail.jpg",
      readTime: "5 min read",
      content: "Creating a budget is one of the most important steps in taking control of your finances...",
    },
  ],
}

// Simulate API delay
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

// Generic API call function with hardcoded responses (kept for legacy endpoints)
async function apiCall(endpoint, options = {}) {
  await delay(200)
  try {
    // Authentication endpoints
    if (endpoint === "/auth/volunteer/login") {
      const { email, password } = JSON.parse(options.body)
      const user = mockData.users.find((u) => u.email === email && u.password === password && u.type === "volunteer")
      if (user) {
        return { success: true, token: "mock-volunteer-token", user }
      }
      throw new Error("Invalid credentials")
    }

    if (endpoint === "/auth/employee/login") {
      const { email, password } = JSON.parse(options.body)
      const user = mockData.users.find((u) => u.email === email && u.password === password && u.type === "employee")
      if (user) {
        return { success: true, token: "mock-employee-token", user }
      }
      throw new Error("Invalid credentials")
    }

    if (endpoint === "/auth/volunteer/register") {
      const userData = JSON.parse(options.body)
      return { success: true, message: "Registration successful", id: Date.now() }
    }

    // For legacy mocked endpoints we fall through; real endpoints are implemented below

    // Volunteer endpoints
    if (endpoint === "/volunteer/profile") {
      return { success: true, data: mockData.volunteers[0] }
    }

    // Default success response for other endpoints
    return { success: true, message: "Operation completed successfully" }
  } catch (error) {
    console.error("API Error:", error)
    throw error
  }
}

// Authentication APIs
export const authAPI = {
  // Volunteer authentication
  volunteerLogin: async (email, password) => {
    const res = await fetch(`${BASE_URL}/volunteer/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
      credentials: "include",
    })
    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      throw new Error(err?.error || "Login failed")
    }
    return await res.json()
  },

  volunteerRegister: async (userData) => {
    // Map frontend fields to backend contract
    const payload = {
      email: userData.email,
      password: userData.password,
      name: userData.name,
      phone: userData.phone,
      initial_comment: userData.motivation,
    }
    const res = await fetch(`${BASE_URL}/volunteer/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      credentials: "include",
    })
    if (!res.ok) throw new Error("Failed to register")
    return await res.json()
  },

  // Employee authentication
  employeeLogin: async (email, password) => {
    return apiCall("/auth/employee/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    })
  },

  // Logout
  logout: async () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("authToken")
      localStorage.removeItem("userType")
    }
    return { success: true }
  },
}

// Course APIs
export const coursesAPI = {
  getAllCourses: async () => {
    const res = await fetch(`${BASE_URL}/course`, { credentials: "include" })
    if (!res.ok) throw new Error("Failed to fetch courses")
    const data = await res.json()
    return Array.isArray(data) ? data : []
  },

  getCourseById: async (id) => {
    const res = await fetch(`${BASE_URL}/course/${id}`, { credentials: "include" })
    if (!res.ok) throw new Error("Failed to fetch course")
    return await res.json()
  },

  enrollInCourse: async (courseId) => {
    return apiCall("/courses/enroll", {
      method: "POST",
      body: JSON.stringify({ courseId }),
    })
  },
}

// Keep the old export for backward compatibility
export const courseAPI = coursesAPI

// Blog APIs
export const blogAPI = {
  getAllBlogs: async () => {
    const res = await fetch(`${BASE_URL}/blog`, { credentials: "include" })
    if (!res.ok) throw new Error("Failed to fetch blogs")
    const data = await res.json()
    return Array.isArray(data) ? data : []
  },

  getBlogById: async (id) => {
    const res = await fetch(`${BASE_URL}/blog/${id}`, { credentials: "include" })
    if (!res.ok) throw new Error("Failed to fetch blog")
    return await res.json()
  },

  createBlog: async (blogData) => {
    const payload = {
      title: blogData.title,
      slug: blogData.slug,
      content: blogData.content,
      image_url: blogData.image_url,
      image_alt: blogData.image_alt,
      image_caption: blogData.image_caption,
    }
    const res = await fetch(`${BASE_URL}/blog`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      credentials: "include",
    })
    if (!res.ok) throw new Error("Failed to create blog")
    return await res.json()
  },

  updateBlog: async (id, blogData) => {
    const res = await fetch(`${BASE_URL}/blog/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(blogData),
      credentials: "include",
    })
    if (!res.ok) throw new Error("Failed to update blog")
    return await res.json()
  },

  deleteBlog: async (id) => {
    const res = await fetch(`${BASE_URL}/blog/${id}`, {
      method: "DELETE",
      credentials: "include",
    })
    if (!res.ok) throw new Error("Failed to delete blog")
    return await res.json()
  },
}

// Volunteer APIs
export const volunteerAPI = {
  getVolunteerProfile: async (userId) => {
    const response = await apiCall("/volunteer/profile")
    return {
      profile: mockData.volunteers[0],
      recentActivity: [
        { type: "course", title: "Updated 'Personal Finance Basics'", date: "2024-01-20", status: "completed" },
        { type: "blog", title: "Published 'Emergency Fund Guide'", date: "2024-01-18", status: "completed" },
        { type: "mentoring", title: "Mentoring session with Alex M.", date: "2024-01-17", status: "completed" },
        { type: "course", title: "Created 'Investment Fundamentals'", date: "2024-01-15", status: "completed" },
      ],
      courses: [
        { id: 1, title: "Personal Finance Basics", students: 234, rating: 4.8, status: "published" },
        { id: 2, title: "Investment Fundamentals", students: 156, rating: 4.9, status: "published" },
        { id: 3, title: "Retirement Planning 101", students: 89, rating: 4.7, status: "draft" },
      ],
      upcomingTasks: [
        { title: "Review course feedback", dueDate: "2024-01-25", priority: "high" },
        { title: "Update blog post", dueDate: "2024-01-27", priority: "medium" },
        { title: "Mentoring session", dueDate: "2024-01-28", priority: "high" },
      ],
    }
  },

  getProfile: async () => {
    const response = await apiCall("/volunteer/profile")
    return response.data
  },

  updateProfile: async (profileData) => {
    return apiCall("/volunteer/profile", {
      method: "PUT",
      body: JSON.stringify(profileData),
    })
  },

  getMyBlogs: async () => {
    return apiCall("/volunteer/blogs")
  },

  getMyCourses: async () => {
    return apiCall("/volunteer/courses")
  },
}

// Employee/Admin APIs
export const adminAPI = {
  getDashboardData: async () => {
    return {
      stats: {
        totalUsers: 2847,
        activeVolunteers: 156,
        pendingApplications: 23,
        totalCourses: 47,
        pendingContent: 12,
        supportTickets: 8,
        monthlyGrowth: 15.2,
      },
      pendingVolunteers: [
        {
          id: 1,
          name: "Alex Rodriguez",
          email: "alex.r@email.com",
          experience: "Advanced",
          interests: ["Course Creation", "Mentoring"],
          appliedDate: "2024-01-20",
          status: "pending",
        },
        {
          id: 2,
          name: "Maria Chen",
          email: "maria.c@email.com",
          experience: "Intermediate",
          interests: ["Blog Writing", "Community Support"],
          appliedDate: "2024-01-19",
          status: "pending",
        },
        {
          id: 3,
          name: "David Kim",
          email: "david.k@email.com",
          experience: "Expert",
          interests: ["Course Creation", "Content Review"],
          appliedDate: "2024-01-18",
          status: "pending",
        },
      ],
      pendingContent: [
        {
          id: 1,
          title: "Advanced Investment Strategies",
          type: "course",
          author: "Sarah Johnson",
          submittedDate: "2024-01-21",
          status: "review",
        },
        {
          id: 2,
          title: "Understanding Cryptocurrency Basics",
          type: "blog",
          author: "Michael Chen",
          submittedDate: "2024-01-20",
          status: "review",
        },
        {
          id: 3,
          title: "Small Business Financial Planning",
          type: "course",
          author: "Emily Rodriguez",
          submittedDate: "2024-01-19",
          status: "review",
        },
      ],
      supportTickets: [
        {
          id: 1,
          subject: "Unable to access course materials",
          user: "John Doe",
          priority: "high",
          status: "open",
          createdDate: "2024-01-21",
        },
        {
          id: 2,
          subject: "Payment processing issue",
          user: "Jane Smith",
          priority: "medium",
          status: "in-progress",
          createdDate: "2024-01-20",
        },
        {
          id: 3,
          subject: "Feature request: Dark mode",
          user: "Bob Wilson",
          priority: "low",
          status: "open",
          createdDate: "2024-01-19",
        },
      ],
      recentActivity: [
        { action: "Approved volunteer application", user: "Lisa Park", timestamp: "2024-01-21 14:30" },
        { action: "Published course", content: "Personal Finance 101", timestamp: "2024-01-21 13:15" },
        { action: "Resolved support ticket", ticket: "#1234", timestamp: "2024-01-21 11:45" },
        { action: "Updated platform settings", user: "Admin", timestamp: "2024-01-21 10:20" },
      ],
    }
  },

  approveContent: async (contentId) => {
    return apiCall(`/admin/content/${contentId}/approve`, {
      method: "POST",
    })
  },

  rejectContent: async (contentId) => {
    return apiCall(`/admin/content/${contentId}/reject`, {
      method: "POST",
    })
  },

  // Volunteer management
  getPendingVolunteers: async () => {
    return apiCall("/admin/volunteers/pending")
  },

  approveVolunteer: async (volunteerId) => {
    return apiCall(`/admin/volunteers/${volunteerId}/approve`, {
      method: "POST",
    })
  },

  rejectVolunteer: async (volunteerId) => {
    return apiCall(`/admin/volunteers/${volunteerId}/reject`, {
      method: "POST",
    })
  },

  getAllVolunteers: async () => {
    return apiCall("/admin/volunteers")
  },

  blockVolunteer: async (volunteerId) => {
    return apiCall(`/admin/volunteers/${volunteerId}/block`, {
      method: "POST",
    })
  },

  deleteVolunteer: async (volunteerId) => {
    return apiCall(`/admin/volunteers/${volunteerId}`, {
      method: "DELETE",
    })
  },

  // Query management
  getAllQueries: async () => {
    return apiCall("/admin/queries")
  },

  respondToQuery: async (queryId, response) => {
    return apiCall(`/admin/queries/${queryId}/respond`, {
      method: "POST",
      body: JSON.stringify({ response }),
    })
  },
}

// Quiz APIs
export const quizAPI = {
  getAllQuizzes: async () => {
    return apiCall("/quizzes")
  },

  getQuizById: async (id) => {
    return apiCall(`/quizzes/${id}`)
  },

  submitQuizAnswers: async (quizId, answers) => {
    return apiCall(`/quizzes/${quizId}/submit`, {
      method: "POST",
      body: JSON.stringify({ answers }),
    })
  },
}

// Contact/Query APIs
export const contactAPI = {
  submitQuery: async (queryData) => {
    return apiCall("/contact/query", {
      method: "POST",
      body: JSON.stringify(queryData),
    })
  },
}
