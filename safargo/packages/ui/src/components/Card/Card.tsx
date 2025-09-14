import React from 'react';
import { motion, MotionProps } from 'framer-motion';
import { cn } from '../../utils/cn';

export interface CardProps extends 
  Omit<React.HTMLAttributes<HTMLDivElement>, keyof MotionProps>,
  MotionProps {
  /**
   * Variante visuelle de la carte
   */
  variant?: 'default' | 'glass' | 'bordered' | 'elevated';
  
  /**
   * Taille de padding interne
   */
  padding?: 'sm' | 'md' | 'lg';
  
  /**
   * Si true, la carte est interactive (hover effects)
   */
  interactive?: boolean;
  
  /**
   * Si true, la carte est sélectionnée
   */
  selected?: boolean;
}

const cardVariants = {
  default: [
    'bg-white',
    'border border-gray-200',
    'shadow-sm',
  ],
  glass: [
    'bg-white/80 backdrop-blur-lg',
    'border border-white/20',
    'shadow-lg',
  ],
  bordered: [
    'bg-white',
    'border-2 border-gray-200',
    'shadow-none',
  ],
  elevated: [
    'bg-white',
    'border border-gray-100',
    'shadow-lg',
  ],
};

const paddingVariants = {
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

const interactiveStyles = [
  'cursor-pointer',
  'transition-all duration-200',
  'hover:shadow-md',
  'hover:border-gray-300',
  'active:scale-[0.98]',
];

const selectedStyles = [
  'border-brand-green-500',
  'ring-2 ring-brand-green-500 ring-offset-2',
];

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      className,
      variant = 'default',
      padding = 'md',
      interactive = false,
      selected = false,
      children,
      ...props
    },
    ref
  ) => {
    const baseClasses = [
      'rounded-2xl',
      'overflow-hidden',
    ];

    const variantClasses = cardVariants[variant];
    const paddingClasses = paddingVariants[padding];

    return (
      <motion.div
        ref={ref}
        className={cn(
          baseClasses,
          variantClasses,
          paddingClasses,
          interactive && interactiveStyles,
          selected && selectedStyles,
          className
        )}
        whileHover={interactive ? { y: -2 } : undefined}
        whileTap={interactive ? { scale: 0.98 } : undefined}
        transition={{ type: 'spring', stiffness: 400, damping: 17 }}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);

Card.displayName = 'Card';

// Card sub-components
export const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex flex-col space-y-1.5', className)}
    {...props}
  />
));

CardHeader.displayName = 'CardHeader';

export const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn('text-lg font-semibold leading-none tracking-tight', className)}
    {...props}
  />
));

CardTitle.displayName = 'CardTitle';

export const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('text-sm text-gray-600', className)}
    {...props}
  />
));

CardDescription.displayName = 'CardDescription';

export const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('pt-0', className)}
    {...props}
  />
));

CardContent.displayName = 'CardContent';

export const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex items-center pt-6', className)}
    {...props}
  />
));

CardFooter.displayName = 'CardFooter';