// app/admin/courses/page.tsx
import { Suspense } from 'react';
import Link from 'next/link';
import { Plus, AlertCircle } from 'lucide-react';
import CourseTableSkeleton from '../_components/CourseTableSkeleton';
import CourseTable from '../_components/CourseTable';
import Pagination from '../_components/Pagination';
interface SearchParams {
  page?: string;
  limit?: string;
  search?: string;
  active?: string;
  category?: string;
}

interface PageProps {
  searchParams: Promise<SearchParams>;
}

async function getCourses(params: SearchParams) {
  const page = params.page || '1';
  const limit = params.limit || '10';
  const search = params.search || '';
  const active = params.active || '';
  const category = params.category || '';

  const queryParams = new URLSearchParams({
    page,
    limit,
    ...(search && { search }),
    ...(active && { active }),
    ...(category && { category }),
  });

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/courses?${queryParams}`,
      {
        cache: 'no-store',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    // Get response text first to debug
    const responseText = await res.text();
    console.log('API Response Status:', res.status);
    console.log('API Response:', responseText);

    if (!res.ok) {
      let errorMessage = 'Failed to fetch courses';
      try {
        const errorData = JSON.parse(responseText);
        errorMessage = errorData.message || errorMessage;
      } catch (e) {
        // If response is not JSON, use the text
        errorMessage = responseText || errorMessage;
      }
      
      return {
        error: true,
        message: errorMessage,
        status: res.status,
      };
    }

    // Parse the successful response
    const data = JSON.parse(responseText);
    return {
      error: false,
      ...data,
    };
  } catch (error) {
    console.error('Fetch error:', error);
    return {
      error: true,
      message: error instanceof Error ? error.message : 'Network error occurred',
      status: 0,
    };
  }
}

export default async function CoursesPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const result = await getCourses(params);

  if (result.error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-sm border border-red-200 p-8 text-center">
            <div className="flex items-center justify-center w-16 h-16 mx-auto bg-red-100 rounded-full mb-4">
              <AlertCircle className="text-red-600" size={32} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Failed to Load Courses
            </h2>
            <p className="text-gray-600 mb-2">
              {result.message}
            </p>
            <p className="text-sm text-gray-500 mb-6">
              Status Code: {result.status}
            </p>
            <div className="space-y-3">
              <p className="text-sm text-gray-700">
                Possible issues:
              </p>
              <ul className="text-sm text-gray-600 text-left max-w-md mx-auto space-y-1">
                <li>• API server might not be running (check localhost:5000)</li>
                <li>• Database connection issue</li>
                <li>• Course model/schema problem</li>
                <li>• Mongoose population error</li>
              </ul>
            </div>
            <div className="flex justify-center gap-3 mt-6">
              <Link
                href="/admin/courses"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Retry
              </Link>
              <Link
                href="/admin/courses/create"
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Create New Course
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const data = result.data;
  if (!data || !data.courses) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              No Courses Found
            </h2>
            <p className="text-gray-600 mb-6">
              Get started by creating your first course
            </p>
            <Link
              href="/admin/courses/create"
              className="inline-flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              <Plus size={20} />
              Create Course
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Course Management</h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage all your courses from here
            </p>
          </div>
          <Link
            href="/admin/courses/create"
            className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm"
          >
            <Plus size={20} />
            Create Course
          </Link>
        </div>

        {/* Table Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <Suspense fallback={<CourseTableSkeleton />}>
            <CourseTable courses={data.courses} />
          </Suspense>

          {data.pagination && data.pagination.pages > 1 && (
            <div className="px-6 py-4 border-t border-gray-200">
              <Pagination
                currentPage={data.pagination.page}
                totalPages={data.pagination.pages}
                total={data.pagination.total}
              />
            </div>
          )}
        </div>

        {data.pagination && (
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="text-sm text-gray-500">Total Courses</div>
              <div className="text-2xl font-bold text-gray-900 mt-1">
                {data.pagination.total}
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="text-sm text-gray-500">Current Page</div>
              <div className="text-2xl font-bold text-gray-900 mt-1">
                {data.pagination.page}
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="text-sm text-gray-500">Total Pages</div>
              <div className="text-2xl font-bold text-gray-900 mt-1">
                {data.pagination.pages}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}