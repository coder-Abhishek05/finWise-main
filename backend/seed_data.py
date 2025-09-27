#!/usr/bin/env python3
"""
Script to seed the database with sample data for testing
"""

import mysql.connector
from mysql.connector import Error
import hashlib
import json

def _sha256_hex(s: str) -> str:
    return hashlib.sha256(s.encode("utf-8")).hexdigest()

def get_db_connection():
    try:
        connection = mysql.connector.connect(
            host="localhost",
            user="root",
            password="abhishek@0123",
            database="finwise",
            autocommit=True
        )
        if connection.is_connected():
            print("Connected to MySQL database")
            return connection
    except Error as e:
        print(f"Error connecting to MySQL: {e}")
        return None

def seed_data():
    connection = get_db_connection()
    if not connection:
        return

    cursor = connection.cursor()

    try:
        # Clear existing data
        print("Clearing existing data...")
        cursor.execute("DELETE FROM approvals")
        cursor.execute("DELETE FROM blogs")
        cursor.execute("DELETE FROM quizzes")
        cursor.execute("DELETE FROM courses")
        cursor.execute("DELETE FROM volunteers")
        cursor.execute("DELETE FROM employees")

        # Insert sample volunteers
        print("Inserting volunteers...")
        volunteers_data = [
            ("volunteer1@example.com", _sha256_hex("password123"), "Sarah Johnson", "+1-555-0101", 1),
            ("volunteer2@example.com", _sha256_hex("password123"), "Michael Chen", "+1-555-0102", 1),
            ("volunteer3@example.com", _sha256_hex("password123"), "Emily Rodriguez", "+1-555-0103", 0),
        ]
        
        for volunteer in volunteers_data:
            cursor.execute(
                "INSERT INTO volunteers (email, password, name, phone, is_approved) VALUES (%s, %s, %s, %s, %s)",
                volunteer
            )

        # Insert sample employees
        print("Inserting employees...")
        employees_data = [
            ("admin@example.com", _sha256_hex("admin123"), "Admin User", "admin", "+1-555-0001"),
            ("employee@example.com", _sha256_hex("employee123"), "John Manager", "manager", "+1-555-0002"),
        ]
        
        for employee in employees_data:
            cursor.execute(
                "INSERT INTO employees (email, password, name, role, phone) VALUES (%s, %s, %s, %s, %s)",
                employee
            )

        # Insert sample courses
        print("Inserting courses...")
        courses_data = [
            (
                "Personal Finance Fundamentals",
                "Learn the basics of budgeting, saving, and managing your personal finances effectively. This comprehensive course covers everything you need to know to take control of your money.",
                4.8,
                "/personal-finance-course-thumbnail.jpg",
                "https://www.youtube.com/embed/dQw4w9WgXcQ",
                "<h2>Course Overview</h2><p>This comprehensive course is designed for anyone who wants to take control of their personal finances. Whether you're just starting your financial journey or looking to improve your money management skills, this course provides practical, actionable strategies you can implement immediately.</p><h2>What You'll Learn</h2><p>Throughout this course, you'll master the fundamentals of personal finance through interactive lessons, real-world examples, and practical exercises.</p>"
            ),
            (
                "Understanding Credit and Debt",
                "Master credit scores, debt management, and strategies to improve your financial health. Learn how to build and maintain good credit while managing existing debt effectively.",
                4.7,
                "/credit-and-debt-course-thumbnail.jpg",
                "https://www.youtube.com/embed/dQw4w9WgXcQ",
                "<h2>Course Overview</h2><p>This course will help you understand the complex world of credit and debt management. Learn how to build credit, manage debt, and make informed financial decisions.</p>"
            ),
            (
                "Investment Basics for Beginners",
                "Start your investment journey with confidence. Learn about different investment options, risk management, and how to build a diversified portfolio.",
                4.9,
                "/investment-basics-course-thumbnail.jpg",
                "https://www.youtube.com/embed/dQw4w9WgXcQ",
                "<h2>Course Overview</h2><p>This beginner-friendly course introduces you to the world of investing. Learn about stocks, bonds, mutual funds, and other investment vehicles.</p>"
            ),
        ]
        
        for course in courses_data:
            cursor.execute(
                "INSERT INTO courses (title, course_description, rating, thumbnail_url, video_url, content) VALUES (%s, %s, %s, %s, %s, %s)",
                course
            )

        # Insert sample blogs
        print("Inserting blogs...")
        blogs_data = [
            (
                "5 Simple Steps to Create Your First Budget",
                "5-simple-steps-to-create-your-first-budget",
                "<h2>Introduction</h2><p>Creating a budget is one of the most important steps in taking control of your finances. Here are 5 simple steps to get you started:</p><h3>Step 1: Calculate Your Income</h3><p>Start by determining your total monthly income from all sources.</p><h3>Step 2: List Your Expenses</h3><p>Track all your monthly expenses, both fixed and variable.</p><h3>Step 3: Categorize Your Spending</h3><p>Organize your expenses into categories like housing, food, transportation, etc.</p><h3>Step 4: Set Financial Goals</h3><p>Define what you want to achieve with your budget.</p><h3>Step 5: Monitor and Adjust</h3><p>Regularly review your budget and make adjustments as needed.</p>",
                "/budgeting-blog-post-thumbnail.jpg",
                "Budget creation guide",
                "Learn how to create a budget that actually works for your lifestyle and financial goals.",
                1
            ),
            (
                "Emergency Fund: Your Financial Safety Net",
                "emergency-fund-your-financial-safety-net",
                "<h2>What is an Emergency Fund?</h2><p>An emergency fund is a savings account set aside specifically for unexpected expenses or financial emergencies.</p><h2>Why You Need One</h2><p>Life is full of surprises, and many of them come with a price tag. An emergency fund provides financial security and peace of mind.</p><h2>How Much Should You Save?</h2><p>Most financial experts recommend saving 3-6 months' worth of living expenses in your emergency fund.</p>",
                "/emergency-fund-blog-post-thumbnail.jpg",
                "Emergency fund guide",
                "Build your financial safety net with a proper emergency fund strategy.",
                1
            ),
            (
                "Understanding Credit Scores: A Complete Guide",
                "understanding-credit-scores-complete-guide",
                "<h2>What is a Credit Score?</h2><p>A credit score is a three-digit number that represents your creditworthiness to lenders.</p><h2>How Credit Scores are Calculated</h2><p>Credit scores are based on several factors including payment history, credit utilization, length of credit history, and more.</p><h2>How to Improve Your Credit Score</h2><p>There are several strategies you can use to improve your credit score over time.</p>",
                "/credit-score-blog-post-thumbnail.jpg",
                "Credit score guide",
                "Everything you need to know about credit scores and how to improve them.",
                2
            ),
        ]
        
        for blog in blogs_data:
            cursor.execute(
                "INSERT INTO blogs (title, slug, content, image_url, image_alt, image_caption, author_id) VALUES (%s, %s, %s, %s, %s, %s, %s)",
                blog
            )

        # Insert sample quizzes
        print("Inserting quizzes...")
        quiz_data = {
            "questions": [
                {
                    "question": "What is the recommended percentage of your income to save for emergencies?",
                    "options": ["5-10%", "10-20%", "20-30%", "30-40%"],
                    "correct": 1,
                    "explanation": "Financial experts recommend saving 10-20% of your income for emergencies, with a goal of building an emergency fund that covers 3-6 months of expenses."
                },
                {
                    "question": "What does APR stand for in credit card terms?",
                    "options": ["Annual Percentage Rate", "Average Payment Rate", "Annual Premium Rate", "Automatic Payment Rate"],
                    "correct": 0,
                    "explanation": "APR stands for Annual Percentage Rate, which represents the yearly cost of borrowing money, including interest and fees."
                },
                {
                    "question": "Which investment typically offers the highest potential returns over the long term?",
                    "options": ["Savings accounts", "Government bonds", "Stock market", "Certificates of deposit"],
                    "correct": 2,
                    "explanation": "Historically, the stock market has provided the highest long-term returns, though it also comes with higher risk and volatility."
                }
            ]
        }
        
        cursor.execute(
            "INSERT INTO quizzes (title, data) VALUES (%s, %s)",
            ("Financial Literacy Assessment", json.dumps(quiz_data))
        )

        # Insert sample approvals
        print("Inserting approvals...")
        approvals_data = [
            (1, 1, "approved", "Great experience and motivation"),
            (2, 1, "approved", "Excellent background in finance"),
            (3, None, "pending", "Application under review"),
        ]
        
        for approval in approvals_data:
            cursor.execute(
                "INSERT INTO approvals (volunteer_id, admin_id, status, comment) VALUES (%s, %s, %s, %s)",
                approval
            )

        print("Sample data inserted successfully!")

    except Error as e:
        print(f"Error inserting data: {e}")
    finally:
        cursor.close()
        connection.close()
        print("Database connection closed")

if __name__ == "__main__":
    seed_data()
