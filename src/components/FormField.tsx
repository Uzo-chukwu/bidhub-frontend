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
        <label className="block text-sm font-medium text-gray-700">{label}</label>
        <input
          ref={ref}
          className={cn(
            'w-full px-4 py-2.5 border rounded-lg transition-colors',
            'focus:ring-2 focus:ring-indigo-500 focus:border-transparent',
            error ? 'border-red-500' : 'border-gray-300',
            'disabled:bg-gray-100 disabled:cursor-not-allowed'
          )}
          {...props}
        />
        {error && <p className="text-sm text-red-600">{error}</p>}
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
        <label className="block text-sm font-medium text-gray-700">{label}</label>
        <textarea
          ref={ref}
          className={cn(
            'w-full px-4 py-2.5 border rounded-lg transition-colors resize-none',
            'focus:ring-2 focus:ring-indigo-500 focus:border-transparent',
            error ? 'border-red-500' : 'border-gray-300',
            'disabled:bg-gray-100 disabled:cursor-not-allowed'
          )}
          {...props}
        />
        {error && <p className="text-sm text-red-600">{error}</p>}
      </div>
    );
  }
);

FormTextarea.displayName = 'FormTextarea';
