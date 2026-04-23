import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface FormFieldProps {
  label: string;
  error?: string;
  className?: string;
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const FormInput = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, ...props }, ref) => {
    return (
      <div className={cn('space-y-2', className)}>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
        <input
          ref={ref}
          className={cn(
            'w-full px-4 py-2.5 border rounded-lg transition-colors',
            'focus:ring-2 focus:ring-blue-500 focus:border-transparent',
            'bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100',
            error 
              ? 'border-red-500 dark:border-red-500' 
              : 'border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600',
            'disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:cursor-not-allowed',
            'placeholder:text-gray-400 dark:placeholder:text-gray-600'
          )}
          {...props}
        />
        {error && <p className="text-sm text-red-600 dark:text-red-500">{error}</p>}
      </div>
    );
  }
);

FormInput.displayName = 'FormInput';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
}

export const FormTextarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, className, ...props }, ref) => {
    return (
      <div className={cn('space-y-2', className)}>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
        <textarea
          ref={ref}
          className={cn(
            'w-full px-4 py-2.5 border rounded-lg transition-colors resize-none',
            'focus:ring-2 focus:ring-blue-500 focus:border-transparent',
            'bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100',
            error 
              ? 'border-red-500 dark:border-red-500' 
              : 'border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600',
            'disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:cursor-not-allowed',
            'placeholder:text-gray-400 dark:placeholder:text-gray-600'
          )}
          {...props}
        />
        {error && <p className="text-sm text-red-600 dark:text-red-500">{error}</p>}
      </div>
    );
  }
);

FormTextarea.displayName = 'FormTextarea';
