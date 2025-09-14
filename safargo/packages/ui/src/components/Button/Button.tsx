import React from 'react';
import { motion, MotionProps } from 'framer-motion';
import { Slot } from '@radix-ui/react-slot';
import { clsx } from 'clsx';
import { cn } from '../../utils/cn';

export interface ButtonProps extends 
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof MotionProps>,
  MotionProps {
  /**
   * Variante visuelle du bouton
   */
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  
  /**
   * Taille du bouton
   */
  size?: 'sm' | 'md' | 'lg';
  
  /**
   * État de chargement
   */
  loading?: boolean;
  
  /**
   * Icône à afficher avant le texte
   */
  leftIcon?: React.ReactNode;
  
  /**
   * Icône à afficher après le texte
   */
  rightIcon?: React.ReactNode;
  
  /**
   * Si true, le bouton prend toute la largeur disponible
   */
  fullWidth?: boolean;
  
  /**
   * Si true, utilise Slot pour la composition
   */
  asChild?: boolean;
  
  /**
   * Direction du texte (pour le support RTL)
   */
  dir?: 'ltr' | 'rtl';
}

const buttonVariants = {
  primary: [
    'bg-brand-green-500 hover:bg-brand-green-600 active:bg-brand-green-700',
    'text-white',
    'border border-transparent',
    'shadow-sm hover:shadow-md',
    'focus:ring-2 focus:ring-brand-green-500 focus:ring-offset-2',
  ],
  secondary: [
    'bg-gray-100 hover:bg-gray-200 active:bg-gray-300',
    'text-gray-900',
    'border border-gray-200',
    'shadow-sm hover:shadow-md',
    'focus:ring-2 focus:ring-gray-500 focus:ring-offset-2',
  ],
  outline: [
    'bg-transparent hover:bg-brand-green-50 active:bg-brand-green-100',
    'text-brand-green-600 hover:text-brand-green-700',
    'border border-brand-green-300 hover:border-brand-green-400',
    'focus:ring-2 focus:ring-brand-green-500 focus:ring-offset-2',
  ],
  ghost: [
    'bg-transparent hover:bg-gray-100 active:bg-gray-200',
    'text-gray-700 hover:text-gray-900',
    'border border-transparent',
    'focus:ring-2 focus:ring-gray-500 focus:ring-offset-2',
  ],
  danger: [
    'bg-brand-red-500 hover:bg-brand-red-600 active:bg-brand-red-700',
    'text-white',
    'border border-transparent',
    'shadow-sm hover:shadow-md',
    'focus:ring-2 focus:ring-brand-red-500 focus:ring-offset-2',
  ],
};

const buttonSizes = {
  sm: [
    'h-8 px-3',
    'text-sm font-medium',
    'rounded-lg',
  ],
  md: [
    'h-10 px-4',
    'text-sm font-medium',
    'rounded-xl',
  ],
  lg: [
    'h-12 px-6',
    'text-base font-medium',
    'rounded-xl',
  ],
};

const LoadingSpinner = ({ className }: { className?: string }) => (
  <motion.div
    className={cn('inline-block', className)}
    animate={{ rotate: 360 }}
    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
  >
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeDasharray="60 40"
      />
    </svg>
  </motion.div>
);

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      loading = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      asChild = false,
      dir = 'ltr',
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : motion.button;
    
    const isRTL = dir === 'rtl';
    const isDisabled = disabled || loading;
    
    const baseClasses = [
      // Base styles
      'inline-flex items-center justify-center',
      'font-medium',
      'transition-all duration-200',
      'focus:outline-none',
      'disabled:opacity-50 disabled:cursor-not-allowed',
      'select-none',
      
      // RTL support
      isRTL && 'flex-row-reverse',
      
      // Full width
      fullWidth && 'w-full',
    ];

    const variantClasses = buttonVariants[variant];
    const sizeClasses = buttonSizes[size];

    return (
      <Comp
        ref={ref}
        className={cn(
          baseClasses,
          variantClasses,
          sizeClasses,
          className
        )}
        disabled={isDisabled}
        whileHover={{ scale: isDisabled ? 1 : 1.02 }}
        whileTap={{ scale: isDisabled ? 1 : 0.98 }}
        transition={{ type: 'spring', stiffness: 400, damping: 17 }}
        {...props}
      >
        {loading && (
          <LoadingSpinner 
            className={cn(
              isRTL ? 'ml-2' : 'mr-2',
              !children && 'mr-0 ml-0'
            )} 
          />
        )}
        
        {!loading && leftIcon && (
          <span className={cn(
            'inline-flex items-center',
            children && (isRTL ? 'ml-2' : 'mr-2')
          )}>
            {leftIcon}
          </span>
        )}
        
        {children && (
          <span className="inline-flex items-center">
            {children}
          </span>
        )}
        
        {!loading && rightIcon && (
          <span className={cn(
            'inline-flex items-center',
            children && (isRTL ? 'mr-2' : 'ml-2')
          )}>
            {rightIcon}
          </span>
        )}
      </Comp>
    );
  }
);

Button.displayName = 'Button';