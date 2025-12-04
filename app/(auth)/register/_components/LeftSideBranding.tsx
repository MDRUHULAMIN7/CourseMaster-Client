import { BookOpen, User, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function LeftSideBranding() {
  return (
    <div className="md:w-2/5 bg-linear-to-br from-blue-600 to-purple-700 p-8 text-white flex flex-col justify-between">
      <div>
        <div className="flex items-center space-x-2 mb-8">
          <BookOpen className="h-8 w-8" />
          <span className="text-2xl font-bold">CourseMaster</span>
        </div>
        
        <h1 className="text-3xl font-bold mb-4">
          Start Your Learning Journey
        </h1>
        <p className="text-purple-100 mb-6">
          Join thousands of students and instructors in our premier educational platform
        </p>
        
        <div className="space-y-4 mt-8">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-full bg-purple-500/30 flex items-center justify-center">
              <User className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-semibold">Personalized Learning</h3>
              <p className="text-sm text-purple-200">Customized course recommendations</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-full bg-purple-400/30 flex items-center justify-center">
              <BookOpen className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-semibold">Expert Instructors</h3>
              <p className="text-sm text-purple-200">Learn from industry professionals</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-8 pt-6 border-t border-purple-500/30">
        <p className="text-sm text-purple-200">
          Already have an account?{' '}
          <Link href="/login" className="font-semibold text-white hover:text-purple-200 transition-colors inline-flex items-center">
            Sign In <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </p>
      </div>
    </div>
  );
}