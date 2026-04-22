import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';

const badgeVariants = cva(
  'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
  {
    variants: {
      variant: {
        PENDING: 'bg-yellow-100 text-yellow-800',
        APPROVED: 'bg-green-100 text-green-800',
        REJECTED: 'bg-red-100 text-red-800',
        CLOSED: 'bg-gray-100 text-gray-800',
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
