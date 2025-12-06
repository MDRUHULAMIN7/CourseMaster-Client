import { Suspense } from 'react';
import CoursesContent from './components/CoursesContent';


interface SearchParams {
  page?: string;
  search?: string;
  category?: string;
  sortBy?: string;
  minPrice?: string;
  maxPrice?: string;
  active?: string;
}

interface PageProps {
  searchParams: Promise<SearchParams>;
}

export default async function CoursesPage({ searchParams }: PageProps) {
  const params = await searchParams;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Explore Courses</h1>
          <p className="text-gray-600 mt-2">
            Discover and enroll in courses that match your interests
          </p>
        </div>

        <Suspense >
          <CoursesContent searchParams={params} />
        </Suspense>
      </div>
    </div>
  );
}