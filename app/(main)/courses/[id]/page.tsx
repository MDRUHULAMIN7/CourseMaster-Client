import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import CourseDetailsSkeleton from '../components/CourseDetailsSkeleton';
import CourseDetailsContent from '../components/CourseDetailsContent';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function CourseDetailsPage({ params }: PageProps) {
  const { id } = await params;

  if (!id) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50 mt-14">
      <Suspense fallback={<CourseDetailsSkeleton />}>
        <CourseDetailsContent courseId={id} />
      </Suspense>
    </div>
  );
}