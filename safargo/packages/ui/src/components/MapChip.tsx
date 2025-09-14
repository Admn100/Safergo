import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../utils/cn'
import { motion } from 'framer-motion'
import { X } from 'lucide-react'

const mapChipVariants = cva(
  'inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition-all cursor-pointer select-none',
  {
    variants: {
      variant: {
        default:
          'bg-white/90 text-neutral-900 hover:bg-white border border-neutral-200/50 shadow-sm backdrop-blur-sm',
        active:
          'bg-algeria-green text-white hover:bg-primary-600 shadow-md',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

export interface MapChipProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof mapChipVariants> {
  icon?: React.ReactNode
  label: string
  onRemove?: () => void
  active?: boolean
}

const MapChip = React.forwardRef<HTMLDivElement, MapChipProps>(
  ({ className, variant, icon, label, onRemove, active, onClick, ...props }, ref) => {
    return (
      <motion.div
        ref={ref}
        className={cn(mapChipVariants({ variant: active ? 'active' : variant }), className)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onClick}
        {...props}
      >
        {icon && <span className="text-base">{icon}</span>}
        <span>{label}</span>
        {onRemove && (
          <button
            onClick={(e) => {
              e.stopPropagation()
              onRemove()
            }}
            className="ml-1 rounded-full p-0.5 hover:bg-neutral-200/50 dark:hover:bg-neutral-700/50"
          >
            <X className="h-3 w-3" />
          </button>
        )}
      </motion.div>
    )
  },
)
MapChip.displayName = 'MapChip'

export { MapChip, mapChipVariants }