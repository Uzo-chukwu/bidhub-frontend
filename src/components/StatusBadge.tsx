import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';

const badgeVariants = cva(
  'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-colors',
  {
    variants: {
      variant: {
        PENDING: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
        APPROVED: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
        REJECTED: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
        CLOSED: 'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400',
      },
    },
    defaultVariants: {
      variant: 'PENDING',
    },
  }
);

export interface StatusBadgeProps {
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'CLOSED';
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(badgeVariants({ variant: status }), className)}
    >
      {status}
    </span>
  );
}
