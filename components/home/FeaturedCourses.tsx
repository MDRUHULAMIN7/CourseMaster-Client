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
  learningTags?: string[];
}

// function getApiUrl() {
//   return    'http://localhost:5000/api';
// }
function getApiUrl() {
  const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
  return `${base.replace(/\/+$/, '')}/api`;
}
async function fetchFeaturedCourses(): Promise<Course[]> {
  try {
    const response = await fetch(
      `${getApiUrl()}/courses?active=true&limit=4&page=1`,
      {
        next: { revalidate: 3600 }, // Revalidate every hour
        headers: { 'Content-Type': 'application/json' },
      }
    );

    if (!response.ok) {
      console.error('Failed to fetch featured courses');
      return [];
    }

    const data = await response.json();
    return data.data.courses || [];
  } catch (error) {
    console.error('Error fetching featured courses:', error);
    return [];
  }
}

export default async function FeaturedCourses() {
  const courses = await fetchFeaturedCourses();

  if (courses.length === 0) {
    return null; 
  }

  return (
    <section className=" bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Featured Courses
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore our most popular courses and start learning today
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {courses.map((course) => (
            <Link 
              key={course._id} 
              href={`/courses/${course._id}`}
              className="group"
            >
              <div className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden h-full flex flex-col transform hover:-translate-y-2">
                {/* Thumbnail */}
                <div className="relative w-full h-48 bg-linear-to-br from-purple-100 to-purple-200 overflow-hidden">
                  {course.thumbnail ? (
                    <Image
                      src={course.thumbnail}
                      alt={course.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <svg 
                        className="w-16 h-16 text-purple-300" 
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

                  {course.category && (
                    <div className="absolute top-3 left-3">
                      <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-purple-600 text-xs font-semibold rounded-full">
                        {course.category.name}
                      </span>
                    </div>
                  )}
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-purple-600 transition-colors">
                    {course.title}
                  </h3>
                  {course.subtitle ? (
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2 flex-1">
                      {course.subtitle}
                    </p>
                  ) : (
                    <p className="text-sm text-gray-400 italic mb-4 flex-1">
                      No description available
                    </p>
                  )}
                  {course.learningTags && course.learningTags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {course.learningTags.slice(0, 3).map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-purple-50 text-purple-600 text-xs rounded"
                        >
                          {tag}
                        </span>
                      ))}
                      {course.learningTags.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                          +{course.learningTags.length - 3}
                        </span>
                      )}
                    </div>
                  )}

                  <div className="mt-auto pt-4 border-t border-gray-100">
                    {course.instructor ? (
                      <div className="flex items-center text-sm text-gray-500 mb-3">
                        <svg 
                          className="w-4 h-4 mr-2 shrink-0" 
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
                        <span className="truncate">{course.instructor.fullName}</span>
                      </div>
                    ) : (
                      <div className="flex items-center text-sm text-gray-400 mb-3 italic">
                        <svg 
                          className="w-4 h-4 mr-2 shrink-0" 
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
                        <span className="truncate">No instructor</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-gray-900">
                        ${course.price.toFixed(2)}
                      </span>
                      
                      <div className="flex items-center text-purple-600 font-medium text-sm group-hover:text-purple-700">
                        View Course
                        <svg 
                          className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={2} 
                            d="M9 5l7 7-7 7" 
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
        <div className="text-center">
          <Link
            href="/courses"
            className="inline-flex items-center px-8 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors shadow-lg hover:shadow-xl"
          >
            View All Courses
            <svg 
              className="w-5 h-5 ml-2" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M13 7l5 5m0 0l-5 5m5-5H6" 
              />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
