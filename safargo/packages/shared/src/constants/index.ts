// ============================================================================
// BRAND CONSTANTS
// ============================================================================

export const BRAND_COLORS = {
  // Drapeau Algérien
  green: '#006233',
  red: '#D21034',
  white: '#FFFFFF',
  
  // Système
  gray: {
    900: '#111827',
    800: '#1F2937',
    700: '#374151',
    600: '#4B5563',
    500: '#6B7280',
    400: '#9CA3AF',
    300: '#D1D5DB',
    200: '#E5E7EB',
    100: '#F3F4F6',
    50: '#F9FAFB',
  },
  
  // Status
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',
} as const;

export const TYPOGRAPHY = {
  fonts: {
    latin: {
      web: 'Inter, system-ui, sans-serif',
      mobile: 'SF Pro Display, system-ui, sans-serif',
    },
    arabic: {
      web: 'Cairo, system-ui, sans-serif',
      mobile: 'IBM Plex Arabic, system-ui, sans-serif',
    },
  },
  sizes: {
    xs: '0.75rem',    // 12px
    sm: '0.875rem',   // 14px
    base: '1rem',     // 16px
    lg: '1.125rem',   // 18px
    xl: '1.25rem',    // 20px
    '2xl': '1.5rem',  // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem', // 36px
    '5xl': '3rem',    // 48px
  },
  weights: {
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
  },
} as const;

export const SPACING = {
  0: '0',
  1: '0.25rem',   // 4px
  2: '0.5rem',    // 8px
  3: '0.75rem',   // 12px
  4: '1rem',      // 16px
  5: '1.25rem',   // 20px
  6: '1.5rem',    // 24px
  8: '2rem',      // 32px
  10: '2.5rem',   // 40px
  12: '3rem',     // 48px
  16: '4rem',     // 64px
  20: '5rem',     // 80px
  24: '6rem',     // 96px
  32: '8rem',     // 128px
} as const;

export const BORDER_RADIUS = {
  none: '0',
  sm: '0.125rem',   // 2px
  base: '0.25rem',  // 4px
  md: '0.375rem',   // 6px
  lg: '0.5rem',     // 8px
  xl: '0.75rem',    // 12px
  '2xl': '1rem',    // 16px
  '3xl': '1.5rem',  // 24px
  full: '9999px',
} as const;

// ============================================================================
// LOCALIZATION
// ============================================================================

export const LOCALES = {
  FR: 'fr',
  AR: 'ar',
} as const;

export const LOCALE_NAMES = {
  [LOCALES.FR]: 'Français',
  [LOCALES.AR]: 'العربية',
} as const;

export const RTL_LOCALES = [LOCALES.AR] as const;

export const DEFAULT_LOCALE = LOCALES.FR;

// ============================================================================
// ALGERIA WILAYAS
// ============================================================================

export const WILAYA_NAMES = {
  adrar: 'أدرار',
  chlef: 'الشلف',
  laghouat: 'الأغواط',
  oum_el_bouaghi: 'أم البواقي',
  batna: 'باتنة',
  bejaia: 'بجاية',
  biskra: 'بسكرة',
  bechar: 'بشار',
  blida: 'البليدة',
  bouira: 'البويرة',
  tamanrasset: 'تمنراست',
  tebessa: 'تبسة',
  tlemcen: 'تلمسان',
  tiaret: 'تيارت',
  tizi_ouzou: 'تيزي وزو',
  algiers: 'الجزائر',
  djelfa: 'الجلفة',
  jijel: 'جيجل',
  setif: 'سطيف',
  saida: 'سعيدة',
  skikda: 'سكيكدة',
  sidi_bel_abbes: 'سيدي بلعباس',
  annaba: 'عنابة',
  guelma: 'قالمة',
  constantine: 'قسنطينة',
  medea: 'المدية',
  mostaganem: 'مستغانم',
  msila: 'المسيلة',
  mascara: 'معسكر',
  ouargla: 'ورقلة',
  oran: 'وهران',
  el_bayadh: 'البيض',
  illizi: 'إيليزي',
  bordj_bou_arreridj: 'برج بوعريريج',
  boumerdes: 'بومرداس',
  el_tarf: 'الطارف',
  tindouf: 'تندوف',
  tissemsilt: 'تيسمسيلت',
  el_oued: 'الوادي',
  khenchela: 'خنشلة',
  souk_ahras: 'سوق أهراس',
  tipaza: 'تيبازة',
  mila: 'ميلة',
  ain_defla: 'عين الدفلى',
  naama: 'النعامة',
  ain_temouchent: 'عين تموشنت',
  ghardaia: 'غرداية',
  relizane: 'غليزان',
  timimoun: 'تيميمون',
  bordj_badji_mokhtar: 'برج باجي مختار',
  ouled_djellal: 'أولاد جلال',
  beni_abbes: 'بني عباس',
  in_salah: 'عين صالح',
  in_guezzam: 'عين قزام',
  touggourt: 'تقرت',
  djanet: 'جانت',
  el_meghaier: 'المغير',
  el_meniaa: 'المنيعة',
} as const;

// ============================================================================
// PLACE TYPES
// ============================================================================

export const PLACE_TYPE_NAMES = {
  beach: {
    fr: 'Plage',
    ar: 'شاطئ',
    emoji: '🏖️',
  },
  waterfall: {
    fr: 'Cascade',
    ar: 'شلال',
    emoji: '💧',
  },
  mountain: {
    fr: 'Montagne',
    ar: 'جبل',
    emoji: '🏔️',
  },
  desert: {
    fr: 'Désert',
    ar: 'صحراء',
    emoji: '🏜️',
  },
  heritage: {
    fr: 'Patrimoine',
    ar: 'تراث',
    emoji: '🏛️',
  },
  museum: {
    fr: 'Musée',
    ar: 'متحف',
    emoji: '🏛️',
  },
  food: {
    fr: 'Gastronomie',
    ar: 'مطبخ',
    emoji: '🍽️',
  },
  viewpoint: {
    fr: 'Point de vue',
    ar: 'إطلالة',
    emoji: '👁️',
  },
  park: {
    fr: 'Parc',
    ar: 'حديقة',
    emoji: '🌳',
  },
  oasis: {
    fr: 'Oasis',
    ar: 'واحة',
    emoji: '🌴',
  },
  medina: {
    fr: 'Médina',
    ar: 'مدينة قديمة',
    emoji: '🕌',
  },
  lake: {
    fr: 'Lac',
    ar: 'بحيرة',
    emoji: '🌊',
  },
  cave: {
    fr: 'Grotte',
    ar: 'كهف',
    emoji: '🕳️',
  },
  thermal_spring: {
    fr: 'Source thermale',
    ar: 'ينبوع حار',
    emoji: '♨️',
  },
  archaeological_site: {
    fr: 'Site archéologique',
    ar: 'موقع أثري',
    emoji: '🏺',
  },
  mosque: {
    fr: 'Mosquée',
    ar: 'مسجد',
    emoji: '🕌',
  },
  fort: {
    fr: 'Fort',
    ar: 'قلعة',
    emoji: '🏰',
  },
} as const;

// ============================================================================
// BUSINESS CONSTANTS
// ============================================================================

export const CURRENCY = {
  DZD: 'DZD',
  EUR: 'EUR',
  USD: 'USD',
} as const;

export const DEFAULT_CURRENCY = CURRENCY.DZD;

export const TRIP_RULES_DEFAULTS = {
  smokingAllowed: false,
  petsAllowed: false,
  musicAllowed: true,
  conversationLevel: 'normal' as const,
  luggageSize: 'medium' as const,
};

export const BOOKING_LIMITS = {
  maxSeatsPerBooking: 4,
  minBookingHours: 2, // Minimum 2 hours before departure
  maxBookingDays: 30, // Maximum 30 days in advance
} as const;

export const PAGINATION_DEFAULTS = {
  page: 1,
  limit: 20,
  maxLimit: 100,
} as const;

export const FILE_UPLOAD = {
  maxSize: 10 * 1024 * 1024, // 10MB
  allowedTypes: ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'],
  allowedImageTypes: ['image/jpeg', 'image/png', 'image/webp'],
} as const;

// ============================================================================
// VALIDATION CONSTANTS
// ============================================================================

export const VALIDATION = {
  password: {
    minLength: 8,
    maxLength: 128,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: false,
  },
  phone: {
    minLength: 8,
    maxLength: 15,
  },
  text: {
    shortText: 255,
    mediumText: 1000,
    longText: 5000,
  },
  coordinates: {
    latMin: -90,
    latMax: 90,
    lngMin: -180,
    lngMax: 180,
  },
  rating: {
    min: 1,
    max: 5,
  },
} as const;

// ============================================================================
// NOTIFICATION TEMPLATES
// ============================================================================

export const NOTIFICATION_TEMPLATES = {
  // Auth
  WELCOME: 'welcome',
  EMAIL_VERIFICATION: 'email_verification',
  OTP_CODE: 'otp_code',
  PASSWORD_RESET: 'password_reset',
  
  // Trip
  TRIP_PUBLISHED: 'trip_published',
  TRIP_CANCELLED: 'trip_cancelled',
  TRIP_REMINDER: 'trip_reminder',
  
  // Booking
  BOOKING_CONFIRMED: 'booking_confirmed',
  BOOKING_CANCELLED: 'booking_cancelled',
  BOOKING_REMINDER: 'booking_reminder',
  
  // Payment
  PAYMENT_HELD: 'payment_held',
  PAYMENT_CAPTURED: 'payment_captured',
  PAYMENT_REFUNDED: 'payment_refunded',
  
  // Reviews
  REVIEW_REQUEST: 'review_request',
  REVIEW_RECEIVED: 'review_received',
  
  // KYC
  KYC_APPROVED: 'kyc_approved',
  KYC_REJECTED: 'kyc_rejected',
  
  // Admin
  DISPUTE_CREATED: 'dispute_created',
  ACCOUNT_SUSPENDED: 'account_suspended',
} as const;

// ============================================================================
// ERROR CODES
// ============================================================================

export const ERROR_CODES = {
  // Generic
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  NOT_FOUND: 'NOT_FOUND',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  RATE_LIMITED: 'RATE_LIMITED',
  
  // Auth
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  EMAIL_NOT_VERIFIED: 'EMAIL_NOT_VERIFIED',
  PHONE_NOT_VERIFIED: 'PHONE_NOT_VERIFIED',
  OTP_EXPIRED: 'OTP_EXPIRED',
  OTP_INVALID: 'OTP_INVALID',
  
  // Trip
  TRIP_FULL: 'TRIP_FULL',
  TRIP_EXPIRED: 'TRIP_EXPIRED',
  TRIP_CANCELLED: 'TRIP_CANCELLED',
  CANNOT_BOOK_OWN_TRIP: 'CANNOT_BOOK_OWN_TRIP',
  
  // Payment
  PAYMENT_FAILED: 'PAYMENT_FAILED',
  PAYMENT_DECLINED: 'PAYMENT_DECLINED',
  INSUFFICIENT_FUNDS: 'INSUFFICIENT_FUNDS',
  
  // KYC
  KYC_REQUIRED: 'KYC_REQUIRED',
  KYC_PENDING: 'KYC_PENDING',
  KYC_REJECTED: 'KYC_REJECTED',
  
  // File Upload
  FILE_TOO_LARGE: 'FILE_TOO_LARGE',
  INVALID_FILE_TYPE: 'INVALID_FILE_TYPE',
} as const;

// ============================================================================
// API ENDPOINTS
// ============================================================================

export const API_ROUTES = {
  // Auth
  AUTH_OTP_REQUEST: '/auth/otp/request',
  AUTH_OTP_VERIFY: '/auth/otp/verify',
  AUTH_LOGOUT: '/auth/logout',
  AUTH_REFRESH: '/auth/refresh',
  
  // Users
  USERS: '/users',
  USER_PROFILE: '/users/profile',
  USER_PREFERENCES: '/users/preferences',
  
  // Trips
  TRIPS: '/trips',
  TRIP_SEARCH: '/trips/search',
  TRIP_PUBLISH: '/trips',
  
  // Bookings
  BOOKINGS: '/bookings',
  BOOKING_CONFIRM: '/bookings/:id/confirm',
  BOOKING_CANCEL: '/bookings/:id/cancel',
  
  // Places
  PLACES: '/places',
  PLACE_REVIEWS: '/places/:id/reviews',
  
  // Itineraries
  ITINERARIES: '/itineraries',
  
  // Admin
  ADMIN_USERS: '/admin/users',
  ADMIN_TRIPS: '/admin/trips',
  ADMIN_PLACES: '/admin/places',
  ADMIN_DISPUTES: '/admin/disputes',
} as const;

// ============================================================================
// REGEX PATTERNS
// ============================================================================

export const REGEX_PATTERNS = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^\+?[1-9]\d{1,14}$/,
  uuid: /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
  slug: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
  coordinates: /^-?([1-8]?\d(\.\d+)?|90(\.0+)?),\s*-?(180(\.0+)?|((1[0-7]\d)|([1-9]?\d))(\.\d+)?)$/,
} as const;