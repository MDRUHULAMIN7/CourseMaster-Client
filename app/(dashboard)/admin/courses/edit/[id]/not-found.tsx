// app/admin/courses/edit/[id]/not-found.tsx
import Link from 'next/link';
import { AlertCircle } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="flex items-center justify-center w-16 h-16 mx-auto bg-red-100 rounded-full mb-6">
          <AlertCircle className="text-red-600" size={32} />
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Course Not Found
        </h1>
        
        <p className="text-gray-600 mb-8">
          The course you're looking for doesn't exist or has been deleted.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/admin/courses"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Back to Courses
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
  );
}