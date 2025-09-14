/**
 * SafarGo Design Tokens - Typography
 * Support pour les langues latines (Inter) et arabes (Cairo)
 */

export const typography = {
  // Font families
  fontFamily: {
    sans: {
      latin: ['Inter', 'system-ui', 'sans-serif'],
      arabic: ['Cairo', 'system-ui', 'sans-serif'],
    },
    mono: ['JetBrains Mono', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
  },

  // Font sizes
  fontSize: {
    xs: ['0.75rem', { lineHeight: '1rem' }],      // 12px
    sm: ['0.875rem', { lineHeight: '1.25rem' }],  // 14px
    base: ['1rem', { lineHeight: '1.5rem' }],     // 16px
    lg: ['1.125rem', { lineHeight: '1.75rem' }],  // 18px
    xl: ['1.25rem', { lineHeight: '1.75rem' }],   // 20px
    '2xl': ['1.5rem', { lineHeight: '2rem' }],    // 24px
    '3xl': ['1.875rem', { lineHeight: '2.25rem' }], // 30px
    '4xl': ['2.25rem', { lineHeight: '2.5rem' }], // 36px
    '5xl': ['3rem', { lineHeight: '1' }],         // 48px
    '6xl': ['3.75rem', { lineHeight: '1' }],      // 60px
    '7xl': ['4.5rem', { lineHeight: '1' }],       // 72px
  },

  // Font weights
  fontWeight: {
    thin: '100',
    extralight: '200',
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
    black: '900',
  },

  // Line heights
  lineHeight: {
    none: '1',
    tight: '1.25',
    snug: '1.375',
    normal: '1.5',
    relaxed: '1.625',
    loose: '2',
  },

  // Letter spacing
  letterSpacing: {
    tighter: '-0.05em',
    tight: '-0.025em',
    normal: '0em',
    wide: '0.025em',
    wider: '0.05em',
    widest: '0.1em',
  },

  // Text styles (semantic)
  textStyles: {
    // Headings
    h1: {
      fontSize: ['2.25rem', { lineHeight: '2.5rem' }], // 36px
      fontWeight: '700',
      letterSpacing: '-0.025em',
    },
    h2: {
      fontSize: ['1.875rem', { lineHeight: '2.25rem' }], // 30px
      fontWeight: '600',
      letterSpacing: '-0.025em',
    },
    h3: {
      fontSize: ['1.5rem', { lineHeight: '2rem' }], // 24px
      fontWeight: '600',
    },
    h4: {
      fontSize: ['1.25rem', { lineHeight: '1.75rem' }], // 20px
      fontWeight: '600',
    },
    h5: {
      fontSize: ['1.125rem', { lineHeight: '1.75rem' }], // 18px
      fontWeight: '600',
    },
    h6: {
      fontSize: ['1rem', { lineHeight: '1.5rem' }], // 16px
      fontWeight: '600',
    },

    // Body text
    body: {
      large: {
        fontSize: ['1.125rem', { lineHeight: '1.75rem' }], // 18px
        fontWeight: '400',
      },
      base: {
        fontSize: ['1rem', { lineHeight: '1.5rem' }], // 16px
        fontWeight: '400',
      },
      small: {
        fontSize: ['0.875rem', { lineHeight: '1.25rem' }], // 14px
        fontWeight: '400',
      },
    },

    // Labels and UI text
    label: {
      large: {
        fontSize: ['1rem', { lineHeight: '1.5rem' }], // 16px
        fontWeight: '500',
      },
      base: {
        fontSize: ['0.875rem', { lineHeight: '1.25rem' }], // 14px
        fontWeight: '500',
      },
      small: {
        fontSize: ['0.75rem', { lineHeight: '1rem' }], // 12px
        fontWeight: '500',
      },
    },

    // Caption and helper text
    caption: {
      fontSize: ['0.75rem', { lineHeight: '1rem' }], // 12px
      fontWeight: '400',
      color: 'semantic.text.secondary',
    },

    // Button text
    button: {
      large: {
        fontSize: ['1rem', { lineHeight: '1.5rem' }], // 16px
        fontWeight: '600',
      },
      base: {
        fontSize: ['0.875rem', { lineHeight: '1.25rem' }], // 14px
        fontWeight: '600',
      },
      small: {
        fontSize: ['0.75rem', { lineHeight: '1rem' }], // 12px
        fontWeight: '600',
      },
    },

    // Links
    link: {
      fontSize: ['1rem', { lineHeight: '1.5rem' }], // 16px
      fontWeight: '500',
      textDecoration: 'underline',
      color: 'semantic.text.link',
    },

    // Code
    code: {
      fontSize: ['0.875rem', { lineHeight: '1.25rem' }], // 14px
      fontWeight: '400',
      fontFamily: 'mono',
    },
  },

  // RTL-specific adjustments
  rtl: {
    // Arabic text typically needs more line-height
    lineHeightAdjustment: 1.1,
    
    // Font size adjustments for Arabic
    fontSizeAdjustment: {
      xs: '0.8125rem',   // 13px instead of 12px
      sm: '0.9375rem',   // 15px instead of 14px
      base: '1.0625rem', // 17px instead of 16px
      lg: '1.1875rem',   // 19px instead of 18px
      xl: '1.3125rem',   // 21px instead of 20px
    },

    // Letter spacing for Arabic (usually tighter)
    letterSpacing: {
      normal: '-0.01em',
      tight: '-0.02em',
      tighter: '-0.03em',
    },
  },
} as const;

export type Typography = typeof typography;