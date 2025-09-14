/**
 * SafarGo Design Tokens - Colors
 * Palette inspirée du drapeau algérien avec système complet
 */

export const colors = {
  // Couleurs du drapeau algérien (primaires)
  brand: {
    green: {
      50: '#f0f9f4',
      100: '#dcf2e3',
      200: '#bce5cc',
      300: '#8dd1a7',
      400: '#57b37c',
      500: '#006233', // Couleur principale du drapeau
      600: '#005129',
      700: '#004023',
      800: '#00331c',
      900: '#002817',
    },
    red: {
      50: '#fef2f2',
      100: '#fee2e2',
      200: '#fecaca',
      300: '#fca5a5',
      400: '#f87171',
      500: '#D21034', // Couleur principale du drapeau
      600: '#b91c1c',
      700: '#991b1b',
      800: '#7f1d1d',
      900: '#651818',
    },
    white: '#FFFFFF',
  },

  // Grays (système)
  gray: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
  },

  // Status colors
  success: {
    50: '#ecfdf5',
    100: '#d1fae5',
    200: '#a7f3d0',
    300: '#6ee7b7',
    400: '#34d399',
    500: '#10b981',
    600: '#059669',
    700: '#047857',
    800: '#065f46',
    900: '#064e3b',
  },

  warning: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309',
    800: '#92400e',
    900: '#78350f',
  },

  error: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c',
    800: '#991b1b',
    900: '#7f1d1d',
  },

  info: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',
  },

  // Semantic colors
  semantic: {
    primary: '#006233',
    secondary: '#D21034',
    accent: '#F59E0B',
    neutral: '#6B7280',
    
    // Backgrounds
    background: {
      primary: '#FFFFFF',
      secondary: '#F9FAFB',
      tertiary: '#F3F4F6',
      dark: '#111827',
    },

    // Text
    text: {
      primary: '#111827',
      secondary: '#6B7280',
      tertiary: '#9CA3AF',
      inverse: '#FFFFFF',
      link: '#006233',
      linkHover: '#004023',
    },

    // Borders
    border: {
      primary: '#E5E7EB',
      secondary: '#D1D5DB',
      focus: '#006233',
      error: '#EF4444',
    },

    // Surfaces
    surface: {
      primary: '#FFFFFF',
      secondary: '#F9FAFB',
      tertiary: '#F3F4F6',
      overlay: 'rgba(0, 0, 0, 0.5)',
      glass: 'rgba(255, 255, 255, 0.8)',
      glassDark: 'rgba(0, 0, 0, 0.2)',
    },
  },

  // Tourism category colors
  tourism: {
    beach: '#06B6D4',      // Cyan
    waterfall: '#0EA5E9',  // Blue
    mountain: '#8B5CF6',   // Purple
    desert: '#F59E0B',     // Amber
    heritage: '#DC2626',   // Red
    museum: '#7C3AED',     // Violet
    food: '#F97316',       // Orange
    viewpoint: '#10B981',  // Emerald
    park: '#22C55E',       // Green
    oasis: '#84CC16',      // Lime
    medina: '#EAB308',     // Yellow
    lake: '#3B82F6',       // Blue
    cave: '#6B7280',       // Gray
    thermal_spring: '#EC4899', // Pink
    archaeological_site: '#A855F7', // Purple
    mosque: '#059669',     // Emerald
    fort: '#B45309',       // Amber
  },

  // Alpha variants for overlays
  alpha: {
    black: {
      5: 'rgba(0, 0, 0, 0.05)',
      10: 'rgba(0, 0, 0, 0.1)',
      20: 'rgba(0, 0, 0, 0.2)',
      30: 'rgba(0, 0, 0, 0.3)',
      40: 'rgba(0, 0, 0, 0.4)',
      50: 'rgba(0, 0, 0, 0.5)',
      60: 'rgba(0, 0, 0, 0.6)',
      70: 'rgba(0, 0, 0, 0.7)',
      80: 'rgba(0, 0, 0, 0.8)',
      90: 'rgba(0, 0, 0, 0.9)',
    },
    white: {
      5: 'rgba(255, 255, 255, 0.05)',
      10: 'rgba(255, 255, 255, 0.1)',
      20: 'rgba(255, 255, 255, 0.2)',
      30: 'rgba(255, 255, 255, 0.3)',
      40: 'rgba(255, 255, 255, 0.4)',
      50: 'rgba(255, 255, 255, 0.5)',
      60: 'rgba(255, 255, 255, 0.6)',
      70: 'rgba(255, 255, 255, 0.7)',
      80: 'rgba(255, 255, 255, 0.8)',
      90: 'rgba(255, 255, 255, 0.9)',
    },
    green: {
      10: 'rgba(0, 98, 51, 0.1)',
      20: 'rgba(0, 98, 51, 0.2)',
      30: 'rgba(0, 98, 51, 0.3)',
    },
    red: {
      10: 'rgba(210, 16, 52, 0.1)',
      20: 'rgba(210, 16, 52, 0.2)',
      30: 'rgba(210, 16, 52, 0.3)',
    },
  },
} as const;

export type Colors = typeof colors;