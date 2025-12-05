
export interface Course {
  _id?: string;
  title: string;
  subtitle?: string;
  thumbnail?: string;
  description?: string;
  price?: number;
  active: boolean;
  modules?: string[];
  category?: string;
  instructor?: string;
  testimonials?: string[];
  quizSet?: string;
  learningTags?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CourseFormData {
  title: string;
  subtitle: string;
  thumbnail: string;
  description: string;
  price: number;
  active: boolean;
  modules: string[];
  category: string;
  instructor: string;
  testimonials: string[];
  quizSet: string;
  learningTags: string[];
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  thumbnail?: string;
}

export interface Instructor {
  _id: string;
  fullName: string;
  email: string;
  photo?: string;
  bio?: string;
  expertise?: string[];
}

export interface Module {
  _id: string;
  title: string;
  description?: string;
  order: number;
  lessons: Lesson[];
}

export interface Lesson {
  _id: string;
  title: string;
  description?: string;
  videoUrl?: string;
  duration?: number;
  order: number;
}

export interface Testimonial {
  _id: string;
  user: string | User;
  course: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface User {
  _id: string;
  fullName: string;
  email: string;
  photo?: string;
}

export interface QuizSet {
  _id: string;
  title: string;
  description?: string;
  questions: Question[];
}

export interface Question {
  _id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}