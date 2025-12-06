import Image from 'next/image';
import Link from 'next/link';

interface Course {
  _id: string;
  title: string;
  subtitle?: string;
  thumbnail?: string;
  price: number;
  active: boolean;
  category?: { _id: string; name: string };
  instructor?: { _id: string; fullName: string };
}

interface CourseCardProps {
  course: Course;
}

export default function CourseCard({ course }: CourseCardProps) {
  return (
    <Link href={`/courses/${course._id}`}>
      <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden h-full flex flex-col">
        <div className="relative w-full h-48 bg-gray-200">
          {course.thumbnail ? (
            <Image
              src={course.thumbnail}
              alt={course.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-blue-100 to-blue-200">
              <svg 
                className="w-16 h-16 text-blue-300" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" 
                />
              </svg>
            </div>
          )}
          {!course.active && (
            <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
              Inactive
            </div>
          )}
          {course.active && (
            <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
              Active
            </div>
          )}
        </div>

        <div className="p-4 flex-1 flex flex-col">
          {course.category && (
            <span className="text-xs text-blue-600 font-medium mb-2">
              {course.category.name}
            </span>
          )}
          
          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
            {course.title}
          </h3>
          
          {course.subtitle && (
            <p className="text-sm text-gray-600 mb-3 line-clamp-2 flex-1">
              {course.subtitle}
            </p>
          )}
          
          <div className="mt-auto">
            {course.instructor && (
              <div className="flex items-center text-sm text-gray-500 mb-3">
                <svg 
                  className="w-4 h-4 mr-1" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" 
                  />
                </svg>
                {course.instructor.fullName}
              </div>
            )}
            
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-gray-900">
                ${course.price.toFixed(2)}
              </span>
              
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                View Details
              </button>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}