// components/admin/CourseTableSkeleton.tsx
export default function CourseTableSkeleton() {
  return (
    <div className="overflow-x-auto animate-pulse">
      <table className="w-full">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="px-6 py-3 text-left">
              <div className="h-3 bg-gray-300 rounded w-24"></div>
            </th>
            <th className="px-6 py-3 text-left hidden md:table-cell">
              <div className="h-3 bg-gray-300 rounded w-20"></div>
            </th>
            <th className="px-6 py-3 text-left hidden lg:table-cell">
              <div className="h-3 bg-gray-300 rounded w-24"></div>
            </th>
            <th className="px-6 py-3 text-left hidden sm:table-cell">
              <div className="h-3 bg-gray-300 rounded w-16"></div>
            </th>
            <th className="px-6 py-3 text-left">
              <div className="h-3 bg-gray-300 rounded w-16"></div>
            </th>
            <th className="px-6 py-3 text-left hidden xl:table-cell">
              <div className="h-3 bg-gray-300 rounded w-20"></div>
            </th>
            <th className="px-6 py-3 text-left hidden xl:table-cell">
              <div className="h-3 bg-gray-300 rounded w-20"></div>
            </th>
            <th className="px-6 py-3 text-right">
              <div className="h-3 bg-gray-300 rounded w-16 ml-auto"></div>
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {[...Array(5)].map((_, index) => (
            <tr key={index}>
              <td className="px-6 py-4">
                <div className="h-4 bg-gray-200 rounded w-48"></div>
              </td>
              <td className="px-6 py-4 hidden md:table-cell">
                <div className="h-4 bg-gray-200 rounded w-24"></div>
              </td>
              <td className="px-6 py-4 hidden lg:table-cell">
                <div className="h-4 bg-gray-200 rounded w-32"></div>
              </td>
              <td className="px-6 py-4 hidden sm:table-cell">
                <div className="h-4 bg-gray-200 rounded w-16"></div>
              </td>
              <td className="px-6 py-4">
                <div className="h-6 bg-gray-200 rounded-full w-16"></div>
              </td>
              <td className="px-6 py-4 hidden xl:table-cell">
                <div className="h-4 bg-gray-200 rounded w-24"></div>
              </td>
              <td className="px-6 py-4 hidden xl:table-cell">
                <div className="h-4 bg-gray-200 rounded w-24"></div>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center justify-end gap-2">
                  <div className="h-8 w-8 bg-gray-200 rounded"></div>
                  <div className="h-8 w-8 bg-gray-200 rounded"></div>
                  <div className="h-8 w-8 bg-gray-200 rounded"></div>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}