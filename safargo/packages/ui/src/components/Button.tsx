import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../utils/cn'
import { Loader2 } from 'lucide-react'

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-2xl text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-algeria-green focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:ring-offset-neutral-900 dark:focus-visible:ring-algeria-green',
  {
    variants: {
      variant: {
        default:
          'bg-algeria-green text-white hover:bg-primary-600 dark:bg-algeria-green dark:text-white dark:hover:bg-primary-600',
        destructive:
          'bg-algeria-red text-white hover:bg-secondary-600 dark:bg-algeria-red dark:text-white dark:hover:bg-secondary-600',
        outline:
          'border border-neutral-200 bg-white hover:bg-neutral-100 hover:text-neutral-900 dark:border-neutral-800 dark:bg-neutral-900 dark:hover:bg-neutral-800 dark:hover:text-neutral-50',
        secondary:
          'bg-neutral-100 text-neutral-900 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-50 dark:hover:bg-neutral-700',
        ghost:
          'hover:bg-neutral-100 hover:text-neutral-900 dark:hover:bg-neutral-800 dark:hover:text-neutral-50',
        link: 'text-algeria-green underline-offset-4 hover:underline dark:text-primary-400',
        glass:
          'backdrop-blur-md bg-white/80 border border-white/20 text-neutral-900 hover:bg-white/90 dark:bg-neutral-900/80 dark:border-neutral-800/20 dark:text-neutral-50 dark:hover:bg-neutral-900/90',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-xl px-3',
        lg: 'h-11 rounded-2xl px-8',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  loading?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, loading = false, children, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={loading || props.disabled}
        {...props}
      >
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {children}
      </Comp>
    )
  },
)
Button.displayName = 'Button'

export { Button, buttonVariants }