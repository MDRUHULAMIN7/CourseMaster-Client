'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useTransition } from 'react';

interface CoursesPaginationProps {
  currentPage: number;
  totalPages: number;
}

export default function CoursesPagination({
  currentPage,
  totalPages,
}: CoursesPaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const goToPage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', page.toString());
    
    startTransition(() => {
      router.push(`/courses?${params.toString()}`, { scroll: true });
      // Scroll to top smoothly
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  };

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisiblePages = 7;
    
    if (totalPages <= maxVisiblePages) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);
      
      if (currentPage <= 3) {
        // Near start
        for (let i = 2; i <= 5; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        // Near end
        pages.push('...');
        for (let i = totalPages - 4; i < totalPages; i++) {
          pages.push(i);
        }
        pages.push(totalPages);
      } else {
        // Middle
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  return (
    <nav className="flex items-center justify-center gap-2" aria-label="Pagination">
      {/* Previous Button */}
      <button
        onClick={() => goToPage(currentPage - 1)}
        disabled={currentPage === 1 || isPending}
        className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        aria-label="Previous page"
      >
        <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Previous
      </button>

      {/* Page Numbers */}
      <div className="hidden sm:flex gap-2">
        {getPageNumbers().map((page, index) => (
          <button
            key={index}
            onClick={() => typeof page === 'number' && goToPage(page)}
            disabled={page === currentPage || page === '...' || isPending}
            className={`min-w-40px px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
              page === currentPage
                ? 'bg-blue-600 text-white'
                : page === '...'
                ? 'cursor-default text-gray-400'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 disabled:opacity-50'
            }`}
            aria-label={page === '...' ? 'More pages' : `Go to page ${page}`}
            aria-current={page === currentPage ? 'page' : undefined}
          >
            {page}
          </button>
        ))}
      </div>

      {/* Mobile: Current Page Indicator */}
      <div className="sm:hidden px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg">
        {currentPage} / {totalPages}
      </div>

      {/* Next Button */}
      <button
        onClick={() => goToPage(currentPage + 1)}
        disabled={currentPage === totalPages || isPending}
        className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        aria-label="Next page"
      >
        Next
        <svg className="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </nav>
  );
}