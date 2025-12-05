// app/admin/courses/[id]/components/EnrolledStudents.tsx
'use client';

import { useState, useEffect } from 'react';

interface Student {
  _id: string;
  fullName: string;
  email: string;
  photo?: string;
}

interface Enrollment {
  _id: string;
  student: Student;
  enrolledAt: string;
  status: string;
  progress: number;
}

interface EnrolledStudentsProps {
  courseId: string;
}

export default function EnrolledStudents({ courseId }: EnrolledStudentsProps) {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEnrollments();
  }, [courseId]);

  const fetchEnrollments = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/courses/${courseId}/enrollments?limit=5`,
        { cache: 'no-store' }
      );
      
      if (res.ok) {
        const data = await res.json();
        setEnrollments(data.data?.enrollments || []);
      }
    } catch (error) {
      console.error('Error fetching enrollments:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'dropped': return 'bg-red-100 text-red-800';
      case 'suspended': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-2">
            <div className="h-16 bg-gray-200 rounded"></div>
            <div className="h-16 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">Enrolled Students</h2>
        <button
          onClick={() => fetchEnrollments()}
          className="text-sm text-blue-600 hover:text-blue-800"
        >
          Refresh
        </button>
      </div>

      {enrollments.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <svg className="mx-auto mb-3 text-gray-400" width="32" height="32" fill="none" viewBox="0 0 24 24">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5 0a4 4 0 11-8 0 4 4 0 018 0z"/>
          </svg>
          <p>No students enrolled yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {enrollments.map((enrollment) => (
            <div
              key={enrollment._id}
              className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  {enrollment.student.photo ? (
                    <img
                      src={enrollment.student.photo}
                      alt={enrollment.student.fullName}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-blue-600 font-medium">
                      {enrollment.student.fullName.charAt(0)}
                    </span>
                  )}
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">
                    {enrollment.student.fullName}
                  </h4>
                  <p className="text-sm text-gray-600">{enrollment.student.email}</p>
                </div>
              </div>

              <div className="text-right">
                <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(enrollment.status)}`}>
                  {enrollment.status}
                </span>
                <div className="mt-2">
                  <div className="text-sm text-gray-600">
                    Progress: {enrollment.progress}%
                  </div>
                  <div className="w-24 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-green-500 rounded-full"
                      style={{ width: `${enrollment.progress}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {enrollments.length > 0 && (
        <div className="mt-6 pt-4 border-t border-gray-200 text-center">
          <a
            href={`/admin/courses/${courseId}/enrollments`}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            View All Students →
          </a>
        </div>
      )}
    </div>
  );
}