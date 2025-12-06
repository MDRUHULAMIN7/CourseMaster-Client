'use client';

import { useState } from 'react';

interface EnrollButtonProps {
  courseId: string;
  isActive: boolean;
}

export default function EnrollButton({ courseId, isActive }: EnrollButtonProps) {
  const [isEnrolling, setIsEnrolling] = useState(false);

  const handleEnroll = async () => {
    if (!isActive) {
      alert('This course is currently inactive and not accepting enrollments.');
      return;
    }

    setIsEnrolling(true);
    try {
      console.log('Enrolling in course:', courseId);
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert('Successfully enrolled! (Demo)');
    } catch (error) {
      console.error('Enrollment failed:', error);
      alert('Enrollment failed. Please try again.');
    } finally {
      setIsEnrolling(false);
    }
  };

  return (
    <button
      onClick={handleEnroll}
      disabled={!isActive || isEnrolling}
      className={`w-full py-3 px-6 rounded-lg font-semibold text-white transition-all ${
        isActive
          ? 'bg-purple-600 hover:bg-purple-700 hover:shadow-lg active:scale-95'
          : 'bg-gray-400 cursor-not-allowed'
      } disabled:opacity-70`}
    >
      {isEnrolling ? (
        <span className="flex items-center justify-center">
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Enrolling...
        </span>
      ) : isActive ? (
        'Enroll Now'
      ) : (
        'Course Inactive'
      )}
    </button>
  );
}