import React from 'react';
import { cn } from '../../utils/cn';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  /**
   * Variante visuelle du badge
   */
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info' | 'brand' | 'tourism';
  
  /**
   * Taille du badge
   */
  size?: 'sm' | 'md' | 'lg';
  
  /**
   * Type de lieu touristique (pour variant="tourism")
   */
  tourismType?: 'beach' | 'waterfall' | 'mountain' | 'desert' | 'heritage' | 'museum' | 'food' | 'viewpoint' | 'park' | 'oasis' | 'medina' | 'lake' | 'cave';
  
  /**
   * Si true, affiche un point d'état
   */
  dot?: boolean;
  
  /**
   * Icône à afficher
   */
  icon?: React.ReactNode;
}

const badgeVariants = {
  default: 'bg-gray-100 text-gray-800 border-gray-200',
  success: 'bg-green-100 text-green-800 border-green-200',
  warning: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  error: 'bg-red-100 text-red-800 border-red-200',
  info: 'bg-blue-100 text-blue-800 border-blue-200',
  brand: 'bg-brand-green-100 text-brand-green-800 border-brand-green-200',
  tourism: 'bg-blue-100 text-blue-800 border-blue-200', // Default, overridden by tourismType
};

const tourismVariants = {
  beach: 'bg-cyan-100 text-cyan-800 border-cyan-200',
  waterfall: 'bg-blue-100 text-blue-800 border-blue-200',
  mountain: 'bg-purple-100 text-purple-800 border-purple-200',
  desert: 'bg-amber-100 text-amber-800 border-amber-200',
  heritage: 'bg-red-100 text-red-800 border-red-200',
  museum: 'bg-violet-100 text-violet-800 border-violet-200',
  food: 'bg-orange-100 text-orange-800 border-orange-200',
  viewpoint: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  park: 'bg-green-100 text-green-800 border-green-200',
  oasis: 'bg-lime-100 text-lime-800 border-lime-200',
  medina: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  lake: 'bg-blue-100 text-blue-800 border-blue-200',
  cave: 'bg-gray-100 text-gray-800 border-gray-200',
};

const badgeSizes = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-0.5 text-sm',
  lg: 'px-3 py-1 text-sm',
};

// Emojis pour les types de lieux touristiques
const tourismEmojis = {
  beach: '🏖️',
  waterfall: '💧',
  mountain: '🏔️',
  desert: '🏜️',
  heritage: '🏛️',
  museum: '🏛️',
  food: '🍽️',
  viewpoint: '👁️',
  park: '🌳',
  oasis: '🌴',
  medina: '🕌',
  lake: '🌊',
  cave: '🕳️',
};

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  (
    {
      className,
      variant = 'default',
      size = 'md',
      tourismType,
      dot = false,
      icon,
      children,
      ...props
    },
    ref
  ) => {
    const baseClasses = [
      'inline-flex items-center',
      'rounded-full',
      'border',
      'font-medium',
      'transition-colors',
      'select-none',
    ];

    // Détermine la variante finale
    let finalVariant = variant;
    if (variant === 'tourism' && tourismType) {
      finalVariant = tourismVariants[tourismType];
    } else {
      finalVariant = badgeVariants[variant];
    }

    const sizeClasses = badgeSizes[size];

    // Icône ou emoji à afficher
    let displayIcon = icon;
    if (variant === 'tourism' && tourismType && !icon) {
      displayIcon = tourismEmojis[tourismType];
    }

    return (
      <span
        ref={ref}
        className={cn(
          baseClasses,
          finalVariant,
          sizeClasses,
          className
        )}
        {...props}
      >
        {dot && (
          <span className="w-2 h-2 bg-current rounded-full mr-1.5" />
        )}
        
        {displayIcon && (
          <span className={cn(
            'inline-flex items-center',
            children && 'mr-1'
          )}>
            {displayIcon}
          </span>
        )}
        
        {children}
      </span>
    );
  }
);

Badge.displayName = 'Badge';