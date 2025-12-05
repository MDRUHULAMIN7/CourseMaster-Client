
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
  Layers,
  Users,
  Target,
  FileCheck,
} from 'lucide-react';
import CourseImage from '../components/CourseImage';
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

// Static stats data for all courses
const STATIC_STATS = {
  students: 0,
  assignments: 0,
  batches: 0,
  completionRate: 0
};

function CourseStats() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-blue-600 font-medium">Enrolled Students</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">
              {STATIC_STATS.students.toLocaleString()}
            </p>
          </div>
          <Users className="text-blue-500" size={24} />
        </div>
      </div>

      <div className="bg-green-50 border border-green-100 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-green-600 font-medium">Active Batches</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">
              {STATIC_STATS.batches.toLocaleString()}
            </p>
          </div>
          <Calendar className="text-green-500" size={24} />
        </div>
      </div>

      <div className="bg-purple-50 border border-purple-100 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-purple-600 font-medium">Assignments</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">
              {STATIC_STATS.assignments.toLocaleString()}
            </p>
          </div>
          <FileCheck className="text-purple-500" size={24} />
        </div>
      </div>

      <div className="bg-orange-50 border border-orange-100 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-orange-600 font-medium">Completion Rate</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">
              {STATIC_STATS.completionRate}%
            </p>
          </div>
          <Target className="text-orange-500" size={24} />
        </div>
      </div>
    </div>
  );
}

function CourseBatches() {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">Course Batches</h2>
        <button className="inline-flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm cursor-not-allowed opacity-50">
          <span>Add Batch</span>
        </button>
      </div>

      <div className="text-center py-8 text-gray-500">
        <Calendar className="mx-auto mb-3 text-gray-400" size={32} />
        <p>No batches scheduled yet</p>
        <p className="text-sm mt-1">Add batches to organize course schedules</p>
      </div>
    </div>
  );
}

function EnrolledStudents() {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">Enrolled Students</h2>
      </div>

      <div className="text-center py-8 text-gray-500">
        <Users className="mx-auto mb-3 text-gray-400" size={32} />
        <p>No students enrolled yet</p>
      </div>
    </div>
  );
}

export default async function CourseDetailsPage({ params }: PageProps) {
  const { id } = await params;
  const course = await getCourse(id);

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

        {/* Thumbnail Banner Section */}
        {course.thumbnail && (
          <div className="mb-6 rounded-xl overflow-hidden shadow-lg">
            <div className="relative h-64 md:h-80 lg:h-96">
             
           <CourseImage src={course.thumbnail} title={course.title} />

              {/* Gradient overlay for better text visibility */}
              <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent"></div>
              
              {/* Course info on banner */}
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <div className="max-w-3xl">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      course.active 
                        ? 'bg-green-500/90 text-white' 
                        : 'bg-red-500/90 text-white'
                    }`}>
                      {course.active ? 'Active' : 'Inactive'}
                    </span>
                    {course.category && (
                      <span className="inline-flex items-center px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm">
                        {course.category.name}
                      </span>
                    )}
                  </div>
                  <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-2 drop-shadow-lg">
                    {course.title}
                  </h1>
                  {course.subtitle && (
                    <p className="text-lg md:text-xl text-gray-200 drop-shadow">
                      {course.subtitle}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Header Section (without the title/thumbnail) */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div className="flex-1">
              {/* If no thumbnail, show title here */}
              {!course.thumbnail && (
                <div className="mb-4">
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
                </div>
              )}

              <div className="flex flex-wrap gap-4 mt-4">
                <div className="flex items-center gap-2 text-gray-600">
                  <DollarSign size={18} />
                  <span className="font-medium">${course.price}</span>
                </div>
                {course.category && !course.thumbnail && (
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
                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar size={18} />
                  <span className="font-medium">
                    Updated: {new Date(course.updatedAt).toLocaleDateString()}
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
          <CourseStats />
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
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm cursor-not-allowed opacity-50">
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

            {/* Thumbnail preview section (if not shown in banner) */}
            {course.thumbnail && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              
                  Thumbnail
                </h2>
                <div className="flex flex-col items-center">
                  <div className="relative w-full max-w-md overflow-hidden rounded-lg shadow-md">
                     <CourseImage src={course.thumbnail} title={course.title}  />
                  </div>
                  <p className="text-sm text-gray-500 mt-3 text-center">
                    Course thumbnail image
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Management Sections */}
          <div className="space-y-6">
            {/* Batches Section */}
            <CourseBatches />

            {/* Enrolled Students */}
            <EnrolledStudents />
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
    openGraph: {
      images: course?.thumbnail ? [course.thumbnail] : [],
    },
  };
}