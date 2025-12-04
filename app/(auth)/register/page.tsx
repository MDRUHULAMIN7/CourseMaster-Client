
'use client'
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { Mail, Lock, UserPlus } from 'lucide-react';
import type { RegisterFormData } from '../../../types/Types';
import LeftSideBranding from './_components/LeftSideBranding';
import RoleSelection from './_components/RoleSelection';
import FormInput from './_components/FormInput';
interface FormErrors {
  [key: string]: string;
}

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<RegisterFormData>({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.fullName || formData.fullName.length < 3) {
      newErrors.fullName = 'Full name must be at least 3 characters';
    }

    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!formData.email || !emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.password || formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (formData.phoneNumber && !/^[0-9]{10,15}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Phone number must be 10-15 digits';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError('');

    if (!validateForm()) return;

    setIsLoading(true);
    const loadingToast = toast.loading('Creating your account...');

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }
      toast.dismiss(loadingToast);
      toast.success('Account created successfully! Redirecting...', {
        duration: 3000,
      });

      // Store token
      localStorage.setItem('token', data.data.token);
      localStorage.setItem('user', JSON.stringify(data.data.user));
      setTimeout(() => {
        if (data.data.user.role) {
          router.push('/');
        } 
      }, 1500);

    } catch (error: any) {
      toast.dismiss(loadingToast);
      const errorMessage = error.message || 'Something went wrong';
      setApiError(errorMessage);
      toast.error(errorMessage, {
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen  flex items-center justify-center py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden">
        <div className="md:flex">
          {/* Left side - Branding/Info */}
          <LeftSideBranding />

          {/* Right side - Registration Form */}
          <div className="md:w-3/5 p-4 md:p-8">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-gray-900">
                Create Your Account
              </h2>
              <p className="mt-2 text-gray-600">
                Join CourseMaster and unlock endless learning opportunities
              </p>
            </div>

            {apiError && (
              <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-r animate-fade-in">
                <div className="flex">
                  <div className="shrink-0">
                    <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{apiError}</p>
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Role Selection */}
              <RoleSelection formData={formData} setFormData={setFormData} />

              {/* Full Name */}
              <FormInput
                id="fullName"
                name="fullName"
                type="text"
                label="Full Name *"
                value={formData.fullName}
                placeholder="John Doe"
                error={errors.fullName}
                icon={UserPlus}
                onChange={handleChange}
              />

              {/* Email */}
              <FormInput
                id="email"
                name="email"
                type="email"
                label="Email Address *"
                value={formData.email}
                placeholder="john@example.com"
                error={errors.email}
                icon={Mail}
                onChange={handleChange}
              />

              {/* Password Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormInput
                  id="password"
                  name="password"
                  type="password"
                  label="Password *"
                  value={formData.password}
                  placeholder="••••••••"
                  error={errors.password}
                  icon={Lock}
                  onChange={handleChange}
                  optionalText="At least 6 characters"
                />

                <FormInput
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  label="Confirm Password *"
                  value={formData.confirmPassword}
                  placeholder="••••••••"
                  error={errors.confirmPassword}
                  icon={Lock}
                  onChange={handleChange}
                />
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-linear-to-r from-blue-600 to-purple-700 text-white py-3.5 rounded-xl font-semibold hover:from-purple-700 hover:to-blue-800 transition-all duration-300 transform hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center"
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creating Account...
                    </>
                  ) : (
                    <>
                      <UserPlus className="h-5 w-5 mr-2" />
                      Create Account
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      
    </div>
  );
}