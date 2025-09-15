import * as React from "react"
import { cn } from "../lib/utils"

export interface FlagIconProps extends React.SVGAttributes<SVGElement> {
  animated?: boolean
  size?: 'sm' | 'md' | 'lg'
}

const FlagIcon = React.forwardRef<SVGSVGElement, FlagIconProps>(
  ({ className, animated = false, size = 'md', ...props }, ref) => {
    const sizes = {
      sm: 'w-4 h-4',
      md: 'w-6 h-6',
      lg: 'w-8 h-8',
    }

    return (
      <svg
        ref={ref}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={cn(
          sizes[size],
          animated && 'flag-wave',
          className
        )}
        {...props}
      >
        {/* Algerian Flag - Green and White with Red Crescent and Star */}
        <rect width="24" height="24" rx="2" fill="#FFFFFF" />
        
        {/* Green half */}
        <rect width="12" height="24" fill="#006233" />
        
        {/* Red crescent */}
        <path
          d="M8 8C8 6.5 9 5.5 10.5 5.5C12 5.5 13 6.5 13 8C13 9.5 12 10.5 10.5 10.5C9 10.5 8 9.5 8 8Z"
          fill="#D21034"
        />
        <path
          d="M8.5 8C8.5 6.8 9.3 6 10.5 6C11.7 6 12.5 6.8 12.5 8C12.5 9.2 11.7 10 10.5 10C9.3 10 8.5 9.2 8.5 8Z"
          fill="#FFFFFF"
        />
        
        {/* Red star */}
        <path
          d="M15 6L16.5 9L20 9L17.25 11.25L18 14.75L15 12.5L12 14.75L12.75 11.25L10 9L13.5 9L15 6Z"
          fill="#D21034"
        />
      </svg>
    )
  }
)
FlagIcon.displayName = "FlagIcon"

export { FlagIcon }