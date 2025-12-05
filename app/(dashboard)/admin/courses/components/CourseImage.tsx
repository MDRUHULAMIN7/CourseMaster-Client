"use client";

interface Props {
  src: string;
  title: string;
}

export default function CourseImage({ src, title }: Props) {
  const fallback = `https://ui-avatars.com/api/?name=${encodeURIComponent(
    title
  )}&background=3B82F6&color=fff&size=400`;

  return (
    <img
      src={src}
      alt={title}
      className="w-full h-48 object-cover"
      onError={(e) => {
        e.currentTarget.src = fallback;
        e.currentTarget.className =
          "w-full h-48 object-cover bg-blue-600";
      }}
    />
  );
}
