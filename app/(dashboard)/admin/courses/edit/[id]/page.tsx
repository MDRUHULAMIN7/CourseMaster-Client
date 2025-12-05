
import { notFound } from 'next/navigation';
import CourseForm from '../../components/CourseForm';

interface PageProps {
  params: Promise<{ id: string }>;
}

async function getCourse(id: string) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/courses/${id}`,
      {
        cache: 'no-store',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!res.ok) {
      return null;
    }

    const data = await res.json();
    return data.data.course;
  } catch (error) {
    console.error('Error fetching course:', error);
    return null;
  }
}

export default async function EditCoursePage({ params }: PageProps) {
  const { id } = await params;
  const course = await getCourse(id);

  if (!course) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <CourseForm course={course} mode="edit" />
    </div>
  );
}

// Generate metadata
export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  const course = await getCourse(id);

  return {
    title: course ? `Edit ${course.title}` : 'Edit Course',
    description: 'Edit course details',
  };
}