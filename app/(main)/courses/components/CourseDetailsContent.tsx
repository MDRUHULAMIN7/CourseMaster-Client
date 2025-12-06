import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import EnrollButton from './EnrollButton';

interface CourseDetailsContentProps {
  courseId: string;
}

interface Course {
  _id: string;
  title: string;
  subtitle?: string;
  thumbnail?: string;
  description?: string;
  price: number;
  active: boolean;
  modules?: any[];
  category?: { _id: string; name: string; description?: string } | null;
  instructor?: { 
    _id: string; 
    fullName: string; 
    email?: string; 
    photo?: string;
    bio?: string;
  } | null;
  testimonials?: any[];
  quizSet?: any;
  learningTags?: string[];
  createdAt: string;
  updatedAt: string;
}

interface EnrollmentStats {
  total: number;
  active: number;
}

function getApiUrl() {
  const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
  return `${base.replace(/\/+$/, '')}/api`;
}

async function fetchCourseDetails(id: string): Promise<Course | null> {
  try {
    const response = await fetch(`${getApiUrl()}/courses/${id}`, {
      cache: 'no-store',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      if (response.status === 404) return null;
      throw new Error('Failed to fetch course');
    }

    const data = await response.json();
    return data.data.course;
  } catch (error) {
    console.error('Error fetching course:', error);
    return null;
  }
}

async function fetchEnrollmentStats(courseId: string): Promise<EnrollmentStats> {
  try {
    const response = await fetch(`${getApiUrl()}/courses/${courseId}/stats`, {
      cache: 'no-store',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      return { total: 0, active: 0 };
    }

    const data = await response.json();
    return {
      total: data.data.enrollments?.total || 0,
      active: data.data.enrollments?.active || 0,
    };
  } catch (error) {
    console.error('Error fetching enrollment stats:', error);
    return { total: 0, active: 0 };
  }
}

export default async function CourseDetailsContent({ courseId }: CourseDetailsContentProps) {
  const [course, enrollmentStats] = await Promise.all([
    fetchCourseDetails(courseId),
    fetchEnrollmentStats(courseId),
  ]);

  if (!course) {
    notFound();
  }

  const formattedDate = new Date(course.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <>
      {/* Hero Section */}
      <div className="bg-linear-to-br from-blue-600 to-purple-500 text-white">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl">
         
            <div className="mb-4">
              {course.active ? (
                <span className="inline-flex items-center px-3 py-1 bg-green-500 text-white text-sm font-medium rounded-full">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Active Course
                </span>
              ) : (
                <span className="inline-flex items-center px-3 py-1 bg-red-500 text-white text-sm font-medium rounded-full">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  Inactive Course
                </span>
              )}
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{course.title}</h1>
            {course.subtitle ? (
              <p className="text-xl text-purple-100 mb-6">{course.subtitle}</p>
            ) : (
              <p className="text-xl text-purple-100 mb-6 italic">No subtitle available</p>
            )}

            <div className="flex flex-wrap items-center gap-6 text-sm">
              {course.category ? (
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                  <span>{course.category.name}</span>
                </div>
              ) : (
                <div className="flex items-center text-purple-200 italic">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                  <span>No category</span>
                </div>
              )}

              {/* Enrollments */}
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span>{enrollmentStats.total} student{enrollmentStats.total !== 1 ? 's' : ''} enrolled</span>
              </div>

              {/* Created Date */}
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>Created {formattedDate}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Thumbnail */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="relative w-full h-96 bg-linear-to-br from-purple-100 to-purple-200">
                {course.thumbnail ? (
                  <Image
                    src={course.thumbnail}
                    alt={course.title}
                    fill
                    className="object-cover"
                    priority
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <svg className="w-24 h-24 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">About This Course</h2>
              {course.description ? (
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">{course.description}</p>
              ) : (
                <p className="text-gray-400 italic">No description available for this course.</p>
              )}
            </div>

            {/* Learning Tags */}
            {course.learningTags && course.learningTags.length > 0 ? (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">What You'll Learn</h2>
                <div className="flex flex-wrap gap-2">
                  {course.learningTags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-4 py-2 bg-purple-50 text-purple-700 rounded-full text-sm font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">What You'll Learn</h2>
                <p className="text-gray-400 italic">No learning tags available.</p>
              </div>
            )}

            {/* Instructor */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Instructor</h2>
              {course.instructor ? (
                <div className="flex items-start gap-4">
                  <div className="relative w-16 h-16 rounded-full overflow-hidden bg-gray-200 shrink-0">
                    {course.instructor.photo ? (
                      <Image
                        src={course.instructor.photo}
                        alt={course.instructor.fullName}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-purple-100 text-purple-600 font-bold text-xl">
                        {course.instructor.fullName.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{course.instructor.fullName}</h3>
                    {course.instructor.email && (
                      <p className="text-sm text-gray-500">{course.instructor.email}</p>
                    )}
                    {course.instructor.bio && (
                      <p className="text-gray-700 mt-2">{course.instructor.bio}</p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3 text-gray-400">
                  <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div>
                    <p className="italic">No instructor assigned yet</p>
                  </div>
                </div>
              )}
            </div>

            {/* Modules */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Course Curriculum</h2>
              {course.modules && course.modules.length > 0 ? (
                <div className="space-y-3">
                  {course.modules.map((module, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <p className="font-medium text-gray-900">Module {index + 1}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-lg">
                  <svg className="w-12 h-12 mx-auto text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className="text-gray-400 italic">No modules available yet</p>
                </div>
              )}
            </div>

            {/* Testimonials */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Student Reviews</h2>
              {course.testimonials && course.testimonials.length > 0 ? (
                <div className="space-y-4">
                  {course.testimonials.map((testimonial, index) => (
                    <div key={index} className="border-b border-gray-200 pb-4 last:border-0">
                      <p className="text-gray-700">{testimonial}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-lg">
                  <svg className="w-12 h-12 mx-auto text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                  <p className="text-gray-400 italic">No reviews yet. Be the first to review!</p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-4">
              {/* Price */}
              <div className="mb-6">
                <p className="text-sm text-gray-600 mb-2">Course Price</p>
                <p className="text-4xl font-bold text-gray-900">${course.price.toFixed(2)}</p>
              </div>

              {/* Enrollment Stats */}
              <div className="mb-6 pb-6 border-b border-gray-200">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <p className="text-2xl font-bold text-purple-600">{enrollmentStats.total}</p>
                    <p className="text-xs text-gray-600 mt-1">Total Enrolled</p>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <p className="text-2xl font-bold text-green-600">{enrollmentStats.active}</p>
                    <p className="text-xs text-gray-600 mt-1">Active Students</p>
                  </div>
                </div>
              </div>

              {/* Enroll Button */}
              <EnrollButton courseId={course._id} isActive={course.active} />

              {/* Course Info */}
              <div className="mt-6 space-y-3 text-sm">
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Modules</span>
                  <span className="font-medium text-gray-900">
                    {course.modules?.length || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Quiz Available</span>
                  <span className="font-medium text-gray-900">
                    {course.quizSet ? 'Yes' : 'No'}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-gray-600">Reviews</span>
                  <span className="font-medium text-gray-900">
                    {course.testimonials?.length || 0}
                  </span>
                </div>
              </div>

              {/* Share */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-sm font-medium text-gray-700 mb-3">Share this course</p>
                <div className="flex gap-2">
                  <button className="flex-1 px-3 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors text-sm">
                    Facebook
                  </button>
                  <button className="flex-1 px-3 py-2 bg-sky-500 text-white rounded hover:bg-sky-600 transition-colors text-sm">
                    Twitter
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}