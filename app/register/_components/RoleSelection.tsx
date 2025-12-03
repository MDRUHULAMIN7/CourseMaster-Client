// client/components/register/RoleSelection.tsx
import { BookOpen, User } from 'lucide-react';
import type { RegisterFormData } from '../../../types/Types';

interface RoleSelectionProps {
  formData: RegisterFormData;
  setFormData: (data: RegisterFormData) => void;
}

export default function RoleSelection({ formData, setFormData }: RoleSelectionProps) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-3">
        Register as *
      </label>
      <div className="grid grid-cols-2 gap-4">
        <button
          type="button"
          onClick={() => setFormData({ ...formData, role: 'student' })}
          className={`p-2 rounded-xl border-2 transition-all duration-300 transform hover:scale-[1.02] ${
            formData.role === 'student'
              ? 'border-purple-500 bg-linear-to-r from-purple-50 to-purple-100 shadow-lg'
              : 'border-gray-200 hover:border-gray-300 bg-gray-50'
          }`}
        >
          <div className="flex justify-center  items-center space-y-2">
            <div className={`h-12 w-12 rounded-full flex items-center justify-center ${
              formData.role === 'student' 
                ? 'bg-purple-100 text-purple-600' 
                : 'bg-gray-100 text-gray-600'
            }`}>
              <BookOpen className="h-6 w-6" />
            </div>
            <div className="font-semibold text-gray-900">Student</div>
          </div>
        </button>
        
        <button
          type="button"
          onClick={() => setFormData({ ...formData, role: 'instructor' })}
          className={`p-2 rounded-xl border-2 transition-all duration-300 transform hover:scale-[1.02] ${
            formData.role === 'instructor'
              ? 'border-purple-500 bg-linear-to-r from-purple-50 to-purple-100 shadow-lg'
              : 'border-gray-200 hover:border-gray-300 bg-gray-50'
          }`}
        >
          <div className="flex  items-center justify-center space-y-2">
            <div className={`h-12 w-12 rounded-full flex items-center justify-center ${
              formData.role === 'instructor' 
                ? 'bg-purple-100 text-purple-600' 
                : 'bg-gray-100 text-gray-600'
            }`}>
              <User className="h-6 w-6" />
            </div>
            <div className="font-semibold text-gray-900">Instructor</div>
          </div>
        </button>
      </div>
    </div>
  );
}