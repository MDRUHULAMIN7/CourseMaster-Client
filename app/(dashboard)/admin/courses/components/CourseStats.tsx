
'use client';

import { Users, Calendar, Target, FileCheck } from 'lucide-react';

interface CourseStatsProps {
  courseId: string;
  stats: {
    students: number;
    assignments: number;
    batches: number;
    completionRate: number;
  };
}

export default function CourseStats({ stats }: CourseStatsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-blue-600 font-medium">Enrolled Students</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">
              {stats.students.toLocaleString()}
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
              {stats.batches.toLocaleString()}
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
              {stats.assignments.toLocaleString()}
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
              {stats.completionRate}%
            </p>
          </div>
          <Target className="text-orange-500" size={24} />
        </div>
      </div>
    </div>
  );
}