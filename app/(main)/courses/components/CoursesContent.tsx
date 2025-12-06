import CoursesFilters from "./CoursesFilter";
import CoursesGrid from "./CoursesGrid";
import CoursesPagination from "./CoursesPagination";

interface SearchParams {
  page?: string;
  search?: string;
  category?: string;
  sortBy?: string;
  minPrice?: string;
  maxPrice?: string;
  active?: string;
}

interface CoursesContentProps {
  searchParams: SearchParams;
}

interface Course {
  _id: string;
  title: string;
  subtitle?: string;
  thumbnail?: string;
  price: number;
  active: boolean;
  category?: { _id: string; name: string };
  instructor?: { _id: string; fullName: string; email?: string; photo?: string };
  createdAt?: string;
}

interface Category {
  _id: string;
  name: string;
  description?: string;
}

function getApiUrl() {
  const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
  return `${base.replace(/\/+$/, '')}/api`;
}

async function fetchCourses(params: SearchParams) {
  const page = params.page || '1';
  const limit = '10';
  
  const queryParams = new URLSearchParams({
    page,
    limit,
    ...(params.search && { search: params.search }),
    ...(params.category && { category: params.category }),
    ...(params.active !== undefined && { active: params.active }),
  });

  try {
    const response = await fetch(
      `${getApiUrl()}/courses?${queryParams}`,
      {
        cache: 'no-store',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      console.error('Course fetch failed:', response.status, response.statusText);
      return {
        data: {
          courses: [],
          pagination: { page: 1, limit: 10, total: 0, pages: 0 }
        }
      };
    }

    return response.json();
  } catch (error) {
    console.error('Failed to fetch courses:', error);
    return {
      data: {
        courses: [],
        pagination: { page: 1, limit: 10, total: 0, pages: 0 }
      }
    };
  }
}

async function fetchCategories() {
  try {
    const response = await fetch(
      `${getApiUrl()}/categories/active`,
      {
        next: { revalidate: 3600 },
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      console.error('Categories fetch failed:', response.status);
      return { data: { categories: [] } };
    }

    return response.json();
  } catch (error) {
    console.error('Failed to fetch categories:', error);
    return { data: { categories: [] } };
  }
}

function sortCourses(courses: Course[], sortBy?: string): Course[] {
  if (!sortBy) return courses;

  const sorted = [...courses];
  
  switch (sortBy) {
    case 'price-asc':
      return sorted.sort((a, b) => a.price - b.price);
    case 'price-desc':
      return sorted.sort((a, b) => b.price - a.price);
    case 'title-asc':
      return sorted.sort((a, b) => a.title.localeCompare(b.title));
    case 'title-desc':
      return sorted.sort((a, b) => b.title.localeCompare(a.title));
    default:
      return sorted;
  }
}

function filterByPrice(courses: Course[], minPrice?: string, maxPrice?: string): Course[] {
  let filtered = [...courses];
  
  if (minPrice) {
    const min = Number(minPrice);
    if (!isNaN(min)) {
      filtered = filtered.filter(course => course.price >= min);
    }
  }
  
  if (maxPrice) {
    const max = Number(maxPrice);
    if (!isNaN(max)) {
      filtered = filtered.filter(course => course.price <= max);
    }
  }
  
  return filtered;
}

export default async function CoursesContent({ searchParams }: CoursesContentProps) {
  const [coursesData, categoriesData] = await Promise.all([
    fetchCourses(searchParams),
    fetchCategories(),
  ]);

  let courses = coursesData.data.courses || [];
  const pagination = coursesData.data.pagination;
  const categories = categoriesData.data.categories || [];

  // Apply client-side filters
  courses = filterByPrice(courses, searchParams.minPrice, searchParams.maxPrice);
  courses = sortCourses(courses, searchParams.sortBy);

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Left Sidebar - Filters */}
      <aside className="lg:w-64 shrink-0">
        <CoursesFilters
          categories={categories}
          currentCategory={searchParams.category}
          currentSort={searchParams.sortBy}
          currentMinPrice={searchParams.minPrice}
          currentMaxPrice={searchParams.maxPrice}
        />
      </aside>

      {/* Main Content */}
      <main className="flex-1">
        {courses.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <svg 
              className="mx-auto h-12 w-12 text-gray-400" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
              />
            </svg>
            <p className="text-gray-500 text-lg mt-4">No courses found</p>
            <p className="text-gray-400 mt-2">Try adjusting your filters or search terms</p>
          </div>
        ) : (
          <>
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Showing <span className="font-medium">{courses.length}</span> of{' '}
                <span className="font-medium">{pagination.total}</span> courses
              </p>
              {pagination.pages > 1 && (
                <p className="text-sm text-gray-500">
                  Page {pagination.page} of {pagination.pages}
                </p>
              )}
            </div>
            
            <CoursesGrid courses={courses} />
            
            {pagination.pages > 1 && (
              <div className="mt-8">
                <CoursesPagination 
                  currentPage={pagination.page}
                  totalPages={pagination.pages}
                />
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}