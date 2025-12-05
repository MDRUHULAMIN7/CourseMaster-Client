// app/admin/courses/[id]/components/CourseBatches.tsx
'use client';

import { useState, useEffect } from 'react';
import { Calendar, Users, Clock, Plus } from 'lucide-react';
import Link from 'next/link';

interface Batch {
  _id: string;
  name: string;
  startDate: string;
  endDate: string;
  maxStudents: number;
  currentStudents: number;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  schedule?: string;
}

interface CourseBatchesProps {
  courseId: string;
}

export default function CourseBatches({ courseId }: CourseBatchesProps) {
  const [batches, setBatches] = useState<Batch[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBatches();
  }, [courseId]);

  const fetchBatches = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/courses/${courseId}/batches`,
        { cache: 'no-store' }
      );
      
      if (res.ok) {
        const data = await res.json();
        setBatches(data.data.batches || []);
      }
    } catch (error) {
      console.error('Error fetching batches:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'bg-blue-100 text-blue-800';
      case 'ongoing': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-2">
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">Course Batches</h2>
        <Link
          href={`/admin/batches/create?course=${courseId}`}
          className="inline-flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
        >
          <Plus size={16} />
          Add Batch
        </Link>
      </div>

      {batches.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <Calendar className="mx-auto mb-3 text-gray-400" size={32} />
          <p>No batches scheduled yet</p>
          <p className="text-sm mt-1">Add batches to organize course schedules</p>
        </div>
      ) : (
        <div className="space-y-4">
          {batches.map((batch) => (
            <div
              key={batch._id}
              className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-bold text-gray-900">{batch.name}</h3>
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-2 ${getStatusColor(batch.status)}`}>
                    {batch.status.charAt(0).toUpperCase() + batch.status.slice(1)}
                  </span>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-600">
                    <Users size={14} className="inline mr-1" />
                    {batch.currentStudents}/{batch.maxStudents}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="space-y-1">
                  <div className="flex items-center text-gray-600">
                    <Calendar size={14} className="mr-2" />
                    <span>Start: {new Date(batch.startDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Calendar size={14} className="mr-2" />
                    <span>End: {new Date(batch.endDate).toLocaleDateString()}</span>
                  </div>
                </div>
                {batch.schedule && (
                  <div className="flex items-start text-gray-600">
                    <Clock size={14} className="mr-2 mt-0.5" />
                    <span>{batch.schedule}</span>
                  </div>
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-gray-100">
                <div className="flex justify-end gap-2">
                  <Link
                    href={`/admin/batches/${batch._id}`}
                    className="px-3 py-1 text-blue-600 hover:bg-blue-50 rounded text-sm"
                  >
                    View Details
                  </Link>
                  <Link
                    href={`/admin/batches/${batch._id}/students`}
                    className="px-3 py-1 text-green-600 hover:bg-green-50 rounded text-sm"
                  >
                    View Students
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}