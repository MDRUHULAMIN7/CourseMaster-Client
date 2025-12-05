import CourseForm from "../components/CourseForm";


export const metadata = {
  title: 'Create Course',
  description: 'Create a new course',
};

export default function CreateCoursePage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <CourseForm mode="create" />
    </div>
  );
}