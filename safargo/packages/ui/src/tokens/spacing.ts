/**
 * SafarGo Design Tokens - Spacing
 * Système d'espacement cohérent basé sur une échelle de 4px
 */

export const spacing = {
  // Base spacing scale (4px increments)
  0: '0',
  1: '0.25rem',   // 4px
  2: '0.5rem',    // 8px
  3: '0.75rem',   // 12px
  4: '1rem',      // 16px
  5: '1.25rem',   // 20px
  6: '1.5rem',    // 24px
  7: '1.75rem',   // 28px
  8: '2rem',      // 32px
  9: '2.25rem',   // 36px
  10: '2.5rem',   // 40px
  11: '2.75rem',  // 44px
  12: '3rem',     // 48px
  14: '3.5rem',   // 56px
  16: '4rem',     // 64px
  20: '5rem',     // 80px
  24: '6rem',     // 96px
  28: '7rem',     // 112px
  32: '8rem',     // 128px
  36: '9rem',     // 144px
  40: '10rem',    // 160px
  44: '11rem',    // 176px
  48: '12rem',    // 192px
  52: '13rem',    // 208px
  56: '14rem',    // 224px
  60: '15rem',    // 240px
  64: '16rem',    // 256px
  72: '18rem',    // 288px
  80: '20rem',    // 320px
  96: '24rem',    // 384px

  // Fractional spacing
  px: '1px',
  0.5: '0.125rem', // 2px
  1.5: '0.375rem', // 6px
  2.5: '0.625rem', // 10px
  3.5: '0.875rem', // 14px

  // Semantic spacing
  semantic: {
    // Component internal spacing
    component: {
      xs: '0.25rem',   // 4px
      sm: '0.5rem',    // 8px
      md: '0.75rem',   // 12px
      lg: '1rem',      // 16px
      xl: '1.25rem',   // 20px
      '2xl': '1.5rem', // 24px
    },

    // Layout spacing
    layout: {
      xs: '0.5rem',    // 8px
      sm: '1rem',      // 16px
      md: '1.5rem',    // 24px
      lg: '2rem',      // 32px
      xl: '3rem',      // 48px
      '2xl': '4rem',   // 64px
      '3xl': '6rem',   // 96px
      '4xl': '8rem',   // 128px
    },

    // Container spacing
    container: {
      xs: '1rem',      // 16px
      sm: '1.5rem',    // 24px
      md: '2rem',      // 32px
      lg: '3rem',      // 48px
      xl: '4rem',      // 64px
      '2xl': '6rem',   // 96px
    },

    // Section spacing
    section: {
      xs: '2rem',      // 32px
      sm: '3rem',      // 48px
      md: '4rem',      // 64px
      lg: '6rem',      // 96px
      xl: '8rem',      // 128px
      '2xl': '12rem',  // 192px
    },
  },

  // Mobile-specific adjustments
  mobile: {
    component: {
      xs: '0.25rem',   // 4px
      sm: '0.375rem',  // 6px
      md: '0.5rem',    // 8px
      lg: '0.75rem',   // 12px
      xl: '1rem',      // 16px
      '2xl': '1.25rem', // 20px
    },

    layout: {
      xs: '0.5rem',    // 8px
      sm: '0.75rem',   // 12px
      md: '1rem',      // 16px
      lg: '1.5rem',    // 24px
      xl: '2rem',      // 32px
      '2xl': '3rem',   // 48px
    },

    container: {
      xs: '0.75rem',   // 12px
      sm: '1rem',      // 16px
      md: '1.5rem',    // 24px
      lg: '2rem',      // 32px
      xl: '3rem',      // 48px
    },

    section: {
      xs: '1.5rem',    // 24px
      sm: '2rem',      // 32px
      md: '3rem',      // 48px
      lg: '4rem',      // 64px
      xl: '6rem',      // 96px
    },
  },
} as const;

export type Spacing = typeof spacing;