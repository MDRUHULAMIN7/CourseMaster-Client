// client/components/register/FormInput.tsx
import { LucideIcon } from 'lucide-react';

interface FormInputProps {
  id: string;
  name: string;
  type: string;
  label: string;
  value: string;
  placeholder: string;
  error?: string;
  icon: LucideIcon;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  optionalText?: string;
}

export default function FormInput({
  id,
  name,
  type,
  label,
  value,
  placeholder,
  error,
  icon: Icon,
  onChange,
  optionalText
}: FormInputProps) {
  const isError = !!error;
  
  return (
    <div>
      <label htmlFor={id} className="text-sm font-medium text-gray-700 mb-2 flex items-center">
        <Icon className="h-4 w-4 mr-2 text-gray-400" />
        {label}
      </label>
      <input
        type={type}
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        className={`w-full px-4 py-3 pl-10 border rounded-xl   transition-all `}
        placeholder={placeholder}
      />
      {error && (
        <p className="mt-2 text-sm text-red-600 flex items-center">
          <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </p>
      )}
      {optionalText && !error && (
        <p className="mt-2 text-xs text-gray-500">{optionalText}</p>
      )}
    </div>
  );
}