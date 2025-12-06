export default function CourseDetailsSkeleton() {
  return (
    <>
      {/* Hero Skeleton */}
      <div className="bg-linear-to-br from-blue-600 to-blue-800">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl animate-pulse">
            <div className="h-4 bg-blue-500 rounded w-64 mb-6"></div>
            <div className="h-6 bg-blue-500 rounded w-32 mb-4"></div>
            <div className="h-12 bg-blue-500 rounded w-full mb-4"></div>
            <div className="h-6 bg-blue-500 rounded w-3/4 mb-6"></div>
            <div className="flex gap-6">
              <div className="h-5 bg-blue-500 rounded w-32"></div>
              <div className="h-5 bg-blue-500 rounded w-32"></div>
              <div className="h-5 bg-blue-500 rounded w-32"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8 animate-pulse">
            <div className="bg-white rounded-lg shadow-sm">
              <div className="w-full h-96 bg-gray-200"></div>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="h-8 bg-gray-200 rounded w-64 mb-4"></div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            </div>
          </div>
          <div className="lg:col-span-1 animate-pulse">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="h-12 bg-gray-200 rounded w-32 mb-6"></div>
              <div className="h-12 bg-gray-200 rounded w-full mb-6"></div>
              <div className="h-40 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}