import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../utils/cn'

const badgeVariants = cva(
  'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-algeria-green focus:ring-offset-2',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-algeria-green text-white hover:bg-primary-600',
        secondary:
          'border-transparent bg-algeria-red text-white hover:bg-secondary-600',
        outline: 'text-neutral-900 border border-neutral-200 dark:text-neutral-50 dark:border-neutral-800',
        success: 'border-transparent bg-success-500 text-white',
        warning: 'border-transparent bg-warning-500 text-white',
        error: 'border-transparent bg-error-500 text-white',
        info: 'border-transparent bg-info-500 text-white',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }