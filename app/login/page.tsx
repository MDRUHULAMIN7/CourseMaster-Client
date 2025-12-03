
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import FormInput from '../register/_components/FormInput';

import { Mail, Lock} from 'lucide-react';
import toast from 'react-hot-toast';
interface LoginData {
  email: string;
  password: string;
}

interface FormErrors {
  email?: string;
  password?: string;
}

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<LoginData>({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!formData.email || !emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError('');

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {      
        toast.success('Login Successfully',{
        duration: 3000,
      })
      }else{
        toast.error(data.message || 'Login failed',{
        duration: 3000,
      })
        throw new Error(data.message || 'Login failed');
      }

      // Store token and user
      localStorage.setItem('token', data.data.token);
      localStorage.setItem('user', JSON.stringify(data.data.user));

      // Redirect based on role
      // if (data.data.user.role === 'student') {
      //   router.push('/dashboard/student');
      // } else if (data.data.user.role === 'instructor') {
      //   router.push('/dashboard/instructor');
      // } else if (data.data.user.role === 'admin') {
      //   router.push('/dashboard/admin');
      // }
    } catch (error: any) {
      setApiError(error.message || 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Welcome Back </h2>
          <p className="mt-2 text-sm text-gray-600">
            Login to continue your learning journey with Course Master
          </p>
        </div>

        {apiError && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {apiError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
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
                />

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-linear-to-br from-blue-600 to-purple-700 text-white py-3 rounded-lg font-medium  transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>

          <p className="text-center text-sm text-gray-600">
            Don't have an account?{' '}
            <Link
              href="/register"
              className="text-purple-500 hover:text-purple-700 font-medium"
            >
              Register here
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}