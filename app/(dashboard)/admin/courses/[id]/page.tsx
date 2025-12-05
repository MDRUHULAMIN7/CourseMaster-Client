// app/admin/courses/[id]/page.tsx
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Edit, 
  Calendar, 
  Tag, 
  FileText, 
  DollarSign,
  CheckCircle,
  XCircle,
  Layers
} from 'lucide-react';
import CourseStats from './components/CourseStats';
import CourseBatches from './components/CourseBatches';
import EnrolledStudents from './components/EnrolledStudents';

interface PageProps {
  params: Promise<{ id: string }>;
}

async function getCourse(id: string) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/courses/${id}?populate=full`,
      {
        cache: 'no-store',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!res.ok) {
      return null;
    }

    const data = await res.json();
    return data.data.course;
  } catch (error) {
    console.error('Error fetching course:', error);
    return null;
  }
}

async function getCourseStats(id: string) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/courses/${id}/stats`,
      {
        cache: 'no-store',
      }
    );

    if (!res.ok) {
      return { students: 0, assignments: 0, batches: 0, completionRate: 0 };
    }

    const data = await res.json();
    return data.data;
  } catch (error) {
    return { students: 0, assignments: 0, batches: 0, completionRate: 0 };
  }
}

export default async function CourseDetailsPage({ params }: PageProps) {
  const { id } = await params;
  const course = await getCourse(id);
  const stats = await getCourseStats(id);

  if (!course) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Navigation */}
        <div className="mb-6">
          <Link
            href="/admin/courses"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft size={20} />
            Back to Courses
          </Link>
        </div>

        {/* Header Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-gray-900">
                  {course.title}
                </h1>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  course.active 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {course.active ? (
                    <>
                      <CheckCircle size={14} className="mr-1" />
                      Active
                    </>
                  ) : (
                    <>
                      <XCircle size={14} className="mr-1" />
                      Inactive
                    </>
                  )}
                </span>
              </div>
              
              {course.subtitle && (
                <p className="text-lg text-gray-600 mb-4">{course.subtitle}</p>
              )}

              <div className="flex flex-wrap gap-4 mt-4">
                <div className="flex items-center gap-2 text-gray-600">
                  <DollarSign size={18} />
                  <span className="font-medium">${course.price}</span>
                </div>
                {course.category && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Tag size={18} />
                    <span className="font-medium">{course.category.name}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar size={18} />
                  <span className="font-medium">
                    Created: {new Date(course.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Link
                href={`/admin/courses/edit/${id}`}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                <Edit size={20} />
                Edit Course
              </Link>
            </div>
          </div>

          {/* Course Stats */}
          <CourseStats courseId={id} stats={stats} />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Course Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            {course.description && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <FileText size={22} />
                  Description
                </h2>
                <div className="prose max-w-none text-gray-700">
                  <p className="whitespace-pre-line">{course.description}</p>
                </div>
              </div>
            )}

            {/* Modules Section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Layers size={22} />
                  Modules
                </h2>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm">
                  Add Module
                </button>
              </div>
              
              {course.modules && course.modules.length > 0 ? (
                <div className="space-y-4">
                  {course.modules.map((module: any, index: number) => (
                    <div
                      key={module._id}
                      className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium text-gray-900">
                            Module {index + 1}: {module.title}
                          </h3>
                          {module.description && (
                            <p className="text-sm text-gray-600 mt-1">
                              {module.description}
                            </p>
                          )}
                        </div>
                        <span className="text-sm text-gray-500">
                          {module.lessons?.length || 0} lessons
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>No modules added yet</p>
                  <p className="text-sm mt-1">Add modules to organize your course content</p>
                </div>
              )}
            </div>

            {/* Learning Tags */}
            {course.learningTags && course.learningTags.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Learning Tags
                </h2>
                <div className="flex flex-wrap gap-2">
                  {course.learningTags.map((tag: string) => (
                    <span
                      key={tag}
                      className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Management Sections */}
          <div className="space-y-6">
            {/* Batches Section */}
            <CourseBatches courseId={id} />

            {/* Enrolled Students */}
            <EnrolledStudents courseId={id} />
          </div>
        </div>
      </div>
    </div>
  );
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  const course = await getCourse(id);

  return {
    title: course ? course.title : 'Course Details',
    description: course?.description || 'Course details page',
  };
}