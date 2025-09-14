import * as React from 'react'
import { motion } from 'framer-motion'
import { cn } from '../utils/cn'

export interface AlgeriaFlagProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg'
  animated?: boolean
}

const sizeMap = {
  sm: 'w-6 h-4',
  md: 'w-8 h-6',
  lg: 'w-12 h-8',
}

export const AlgeriaFlag = React.forwardRef<HTMLDivElement, AlgeriaFlagProps>(
  ({ className, size = 'md', animated = true, ...props }, ref) => {
    const MotionDiv = animated ? motion.div : 'div'
    
    return (
      <MotionDiv
        ref={ref}
        className={cn(
          'relative overflow-hidden rounded-sm shadow-sm',
          sizeMap[size],
          className,
        )}
        initial={animated ? { scale: 0.8, opacity: 0 } : undefined}
        animate={animated ? { scale: 1, opacity: 1 } : undefined}
        whileHover={animated ? { scale: 1.1 } : undefined}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        {...props}
      >
        {/* Green half */}
        <div className="absolute inset-y-0 left-0 w-1/2 bg-algeria-green" />
        
        {/* White half */}
        <div className="absolute inset-y-0 right-0 w-1/2 bg-white" />
        
        {/* Star and crescent */}
        <svg
          viewBox="0 0 60 40"
          className="absolute inset-0 h-full w-full"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g transform="translate(30,20)">
            {/* Crescent */}
            <path
              d="M 0,-12 A 12,12 0 1,1 0,12 A 9.6,9.6 0 1,0 0,-12"
              fill="#D21034"
            />
            {/* Star */}
            <path
              d="M 5,0 L 6.5,4.5 L 11,4.5 L 7.5,7.5 L 9,12 L 5,9 L 1,12 L 2.5,7.5 L -1,4.5 L 3.5,4.5 Z"
              fill="#D21034"
              transform="translate(4,0) scale(0.7)"
            />
          </g>
        </svg>
      </MotionDiv>
    )
  },
)
AlgeriaFlag.displayName = 'AlgeriaFlag'