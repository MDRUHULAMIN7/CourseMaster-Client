CourseMaster-Client (Frontend)

Overview
CourseMaster-Client is the frontend application for the CourseMaster Learning Management System (LMS), built with Next.js 16, TypeScript, and Tailwind CSS. This application provides a modern, responsive interface for managing courses, students, batches, and enrollments.

 Quick Start
Prerequisites
Node.js 18+ and npm

Backend API running (CourseMaster-Server)

Installation
Clone the repository:

1. git clone https://github.com/yourusername/CourseMaster-Client.git
cd CourseMaster-Client


Install dependencies:


2. npm install
Set up environment variables:
Create a  .env.local file in the root directory:

env

NEXT_PUBLIC_API_URL=http://localhost:5000

Start the development server:


npm run dev
Open your browser:
Navigate to http://localhost:3000

 Key Features
Admin Dashboard: Complete course management system

Course Management: Create, read, update, delete courses

Batch Management: Schedule and manage course batches

Student Enrollment: Track student progress and enrollments

Real-time Stats: Course statistics and analytics

Responsive Design: Mobile-first approach with Tailwind CSS

Type Safety: Full TypeScript support

Available Scripts
npm run dev - Start development server

npm run build - Build for production

npm start - Start production server

npm run lint - Run ESLint

npm run format - Format code with Prettier

 Styling
This project uses Tailwind CSS for styling with a custom design system:

Colors: Consistent color palette in tailwind.config.js

Components: Reusable component library

Responsive: Fully responsive on all devices
