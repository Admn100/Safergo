import * as React from "react"
import { cn, getTourismCategoryColor, getTourismCategoryEmoji, getTourismCategoryLabel } from "../lib/utils"

export interface TourismChipProps extends React.HTMLAttributes<HTMLDivElement> {
  category: string
  locale?: string
  showEmoji?: boolean
  variant?: 'default' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
}

const TourismChip = React.forwardRef<HTMLDivElement, TourismChipProps>(
  ({ 
    className, 
    category, 
    locale = 'fr', 
    showEmoji = true, 
    variant = 'default',
    size = 'md',
    ...props 
  }, ref) => {
    const colorClass = getTourismCategoryColor(category)
    const emoji = getTourismCategoryEmoji(category)
    const label = getTourismCategoryLabel(category, locale)

    const variants = {
      default: `tourism-${category} border rounded-full px-3 py-1 text-sm font-medium`,
      outline: `border-2 border-current text-current bg-transparent rounded-full px-3 py-1 text-sm font-medium`,
      ghost: `text-current bg-transparent rounded-full px-3 py-1 text-sm font-medium hover:bg-current/10`,
    }

    const sizes = {
      sm: 'text-xs px-2 py-0.5',
      md: 'text-sm px-3 py-1',
      lg: 'text-base px-4 py-2',
    }

    return (
      <div
        ref={ref}
        className={cn(
          'inline-flex items-center gap-1.5 transition-colors duration-200',
          variants[variant],
          sizes[size],
          colorClass,
          className
        )}
        {...props}
      >
        {showEmoji && (
          <span className="text-base" role="img" aria-label={label}>
            {emoji}
          </span>
        )}
        <span>{label}</span>
      </div>
    )
  }
)
TourismChip.displayName = "TourismChip"

export { TourismChip }