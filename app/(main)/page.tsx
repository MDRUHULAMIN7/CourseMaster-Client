import FeaturedCourses from "@/components/home/FeaturedCourses";
import HeroSection from "@/components/home/HeroSection";


export default function HomePage() {
  return (
    <section className="mt-18">
      <HeroSection/>
      <FeaturedCourses/>
    </section>
  );
}