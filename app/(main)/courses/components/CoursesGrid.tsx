import CourseCard from "./CourseCard";

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

interface CoursesGridProps {
  courses: Course[];
}

export default function CoursesGrid({ courses }: CoursesGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {courses.map((course) => (
        <CourseCard key={course._id} course={course} />
      ))}
    </div>
  );
}