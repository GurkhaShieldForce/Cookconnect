// src/components/common/Input.tsx
import { ReactNode } from 'react';
  
interface InputProps {
  label: string;
  type?: string;
  placeholder?: string;
  icon?: ReactNode;
  error?: string;
  required?: boolean;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function Input({
  label,
  type = 'text',
  placeholder,
  icon,
  error,
  required,
  value,
  onChange
}: InputProps) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`
            w-full rounded-lg border py-2
            ${icon ? 'pl-10' : 'pl-3'} pr-3
            ${error ? 'border-red-500' : 'border-gray-300'}
          `}
          required={required}
        />
      </div>
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
}