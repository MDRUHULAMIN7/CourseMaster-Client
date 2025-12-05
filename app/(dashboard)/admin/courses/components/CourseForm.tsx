'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { X } from 'lucide-react';

interface Category {
  _id: string;
  name: string;
}

interface Instructor {
  _id: string;
  fullName: string;
  email: string;
}

interface Module {
  _id?: string;
  title: string;
  description?: string;
}

interface Course {
  _id: string;
  title: string;
  subtitle?: string;
  thumbnail?: string;
  description?: string;
  price: number;
  active: boolean;
  modules: Module[] | string[];
  category?: string;
  instructor?: string;
  testimonials: string[];
  quizSet?: string;
  learningTags: string[];
  createdAt: string;
  updatedAt: string;
}

interface CourseFormData {
  title: string;
  subtitle: string;
  thumbnail: string;
  description: string;
  price: number;
  active: boolean;
  modules: Module[];
  category: string;
  instructor: string;
  testimonials: string[];
  quizSet: string;
  learningTags: string[];
}

interface CourseFormProps {
  course?: Course;
  mode: 'create' | 'edit';
}

export default function CourseForm({ course, mode }: CourseFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [tagInput, setTagInput] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  
  const [formData, setFormData] = useState<CourseFormData>({
    title: course?.title || '',
    subtitle: course?.subtitle || '',
    thumbnail: course?.thumbnail || '',
    description: course?.description || '',
    price: course?.price || 0,
    active: course?.active ?? true,
    modules: Array.isArray(course?.modules) 
      ? course.modules.map((mod): Module => typeof mod === 'string' ? { _id: mod, title: '' } : mod)
      : [],
    category: course?.category || '',
    instructor: course?.instructor || '',
    testimonials: course?.testimonials || [],
    quizSet: course?.quizSet || '',
    learningTags: course?.learningTags || [],
  });

  const [errors, setErrors] = useState<Partial<Record<keyof CourseFormData, string>>>({});

  useEffect(() => {
    fetchCategories();
  }, []);
const fetchCategories = async () => {
  try {
    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/categories?active=true`;
    
    const res = await fetch(apiUrl);
    if (res.ok) {
      const data = await res.json();
      setCategories(data.data?.categories || data.data || []);
    } else {
      console.error('Failed to fetch categories, status:', res.status);
      const errorText = await res.text();
      setCategories([]);
    }
  } catch (error) {
    console.error('Error fetching categories:', error);
    setCategories([]);
  }
};

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof CourseFormData, string>> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length < 3) {
      newErrors.title = 'Title must be at least 3 characters';
    } else if (formData.title.length > 200) {
      newErrors.title = 'Title cannot exceed 200 characters';
    }

    if (formData.subtitle && formData.subtitle.length > 300) {
      newErrors.subtitle = 'Subtitle cannot exceed 300 characters';
    }

    if (formData.description && formData.description.length > 5000) {
      newErrors.description = 'Description cannot exceed 5000 characters';
    }

    if (formData.price < 0) {
      newErrors.price = 'Price cannot be negative';
    }

    if (formData.thumbnail && !isValidUrl(formData.thumbnail)) {
      newErrors.thumbnail = 'Please enter a valid URL';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof CourseFormData]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof CourseFormData]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: parseFloat(value) || 0 }));
    if (errors[name as keyof CourseFormData]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.learningTags.includes(tagInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        learningTags: [...prev.learningTags, tagInput.trim()],
      }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setFormData((prev) => ({
      ...prev,
      learningTags: prev.learningTags.filter((t) => t !== tag),
    }));
  };

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleAddModule = () => {
    setFormData((prev) => ({
      ...prev,
      modules: [...prev.modules, { title: '', _id: `temp-${Date.now()}` }],
    }));
  };

  const handleRemoveModule = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      modules: prev.modules.filter((_, i) => i !== index),
    }));
  };

  const handleModuleChange = (index: number, field: keyof Module, value: string) => {
    setFormData((prev) => {
      const updatedModules = [...prev.modules];
      updatedModules[index] = {
        ...updatedModules[index],
        [field]: value,
      };
      return { ...prev, modules: updatedModules };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        toast.error('Please login to continue');
        router.push('/login');
        return;
      }

      const url =
        mode === 'create'
          ? `${process.env.NEXT_PUBLIC_API_URL}/api/courses`
          : `${process.env.NEXT_PUBLIC_API_URL}/api/courses/${course?._id}`;

      const method = mode === 'create' ? 'POST' : 'PUT';

      // Prepare data for API
      const apiData = {
        title: formData.title,
        subtitle: formData.subtitle || undefined,
        thumbnail: formData.thumbnail || undefined,
        description: formData.description || undefined,
        price: formData.price,
        active: formData.active,
        category: formData.category || undefined,
        instructor: formData.instructor || undefined,
        learningTags: formData.learningTags,
        // Only send module IDs if they exist, otherwise send empty array
        modules: formData.modules
          .map(module => module._id?.startsWith('temp-') ? undefined : module._id)
          .filter(Boolean),
      };

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(apiData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      toast.success(
        mode === 'create'
          ? 'Course created successfully'
          : 'Course updated successfully'
      );
      
      router.push('/admin/courses');
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          {mode === 'create' ? 'Create New Course' : 'Edit Course'}
        </h2>

        {/* Title */}
        <div className="mb-4">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
              errors.title ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter course title"
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title}</p>
          )}
        </div>

        {/* Subtitle */}
        <div className="mb-4">
          <label htmlFor="subtitle" className="block text-sm font-medium text-gray-700 mb-1">
            Subtitle
          </label>
          <input
            type="text"
            id="subtitle"
            name="subtitle"
            value={formData.subtitle}
            onChange={handleInputChange}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
              errors.subtitle ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter course subtitle"
          />
          {errors.subtitle && (
            <p className="mt-1 text-sm text-red-600">{errors.subtitle}</p>
          )}
        </div>

        {/* Thumbnail */}
        <div className="mb-4">
          <label htmlFor="thumbnail" className="block text-sm font-medium text-gray-700 mb-1">
            Thumbnail URL
          </label>
          <input
            type="text"
            id="thumbnail"
            name="thumbnail"
            value={formData.thumbnail}
            onChange={handleInputChange}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
              errors.thumbnail ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="https://example.com/image.jpg"
          />
          {errors.thumbnail && (
            <p className="mt-1 text-sm text-red-600">{errors.thumbnail}</p>
          )}
        </div>

        {/* Description */}
        <div className="mb-4">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows={6}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-y ${
              errors.description ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter course description"
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">{errors.description}</p>
          )}
        </div>

        {/* Price */}
        <div className="mb-4">
          <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
            Price
          </label>
          <input
            type="number"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleNumberChange}
            min="0"
            step="0.01"
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
              errors.price ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="0.00"
          />
          {errors.price && (
            <p className="mt-1 text-sm text-red-600">{errors.price}</p>
          )}
        </div>

        {/* Category */}
        <div className="mb-4">
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleSelectChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
          >
            <option value="">Select a category</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Instructor */}
        <div className="mb-4">
          <label htmlFor="instructor" className="block text-sm font-medium text-gray-700 mb-1">
            Instructor
          </label>
          <select
            id="instructor"
            name="instructor"
            value={formData.instructor}
            onChange={handleSelectChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
          >
            <option value="">Select an instructor</option>
            {instructors.map((inst) => (
              <option key={inst._id} value={inst._id}>
                {inst.fullName} ({inst.email})
              </option>
            ))}
          </select>
        </div>

        {/* Learning Tags */}
        <div className="mb-4">
          <label htmlFor="tagInput" className="block text-sm font-medium text-gray-700 mb-1">
            Learning Tags
          </label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              id="tagInput"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleTagKeyDown}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              placeholder="Add a learning tag"
            />
            <button
              type="button"
              onClick={handleAddTag}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.learningTags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="hover:bg-blue-200 rounded-full p-0.5 transition-colors"
                >
                  <X size={14} />
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Modules Management */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Modules
          </label>
          <div className="space-y-3">
            {formData.modules.map((module, index) => (
              <div key={module._id || index} className="flex items-center gap-2">
                <input
                  type="text"
                  value={module.title}
                  onChange={(e) => handleModuleChange(index, 'title', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="Module title"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveModule(index)}
                  className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddModule}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Add Module
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Note: Modules will be saved as references. Create modules separately to link them here.
          </p>
        </div>

        {/* Active Status */}
        <div className="mb-6">
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              name="active"
              checked={formData.active}
              onChange={handleCheckboxChange}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="ml-2 text-sm font-medium text-gray-700">
              Active (Make this course visible to students)
            </span>
          </label>
        </div>

        {/* Submit Buttons */}
        <div className="flex gap-3 pt-4 border-t border-gray-200">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
          >
            {loading
              ? mode === 'create'
                ? 'Creating...'
                : 'Updating...'
              : mode === 'create'
              ? 'Create Course'
              : 'Update Course'}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            Cancel
          </button>
        </div>
      </div>
    </form>
  );
}