import { LOCALES, RTL_LOCALES, REGEX_PATTERNS, VALIDATION } from '../constants';
import type { Coordinates, Pagination, ApiResponse } from '../types';

// ============================================================================
// VALIDATION UTILITIES
// ============================================================================

export const isValidEmail = (email: string): boolean => {
  return REGEX_PATTERNS.email.test(email);
};

export const isValidPhone = (phone: string): boolean => {
  return REGEX_PATTERNS.phone.test(phone);
};

export const isValidUUID = (uuid: string): boolean => {
  return REGEX_PATTERNS.uuid.test(uuid);
};

export const isValidSlug = (slug: string): boolean => {
  return REGEX_PATTERNS.slug.test(slug);
};

export const isValidCoordinates = (coords: string): boolean => {
  return REGEX_PATTERNS.coordinates.test(coords);
};

export const validatePassword = (password: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  const { minLength, maxLength, requireUppercase, requireLowercase, requireNumbers } = VALIDATION.password;

  if (password.length < minLength) {
    errors.push(`Le mot de passe doit contenir au moins ${minLength} caractères`);
  }
  
  if (password.length > maxLength) {
    errors.push(`Le mot de passe ne doit pas dépasser ${maxLength} caractères`);
  }

  if (requireUppercase && !/[A-Z]/.test(password)) {
    errors.push('Le mot de passe doit contenir au moins une majuscule');
  }

  if (requireLowercase && !/[a-z]/.test(password)) {
    errors.push('Le mot de passe doit contenir au moins une minuscule');
  }

  if (requireNumbers && !/\d/.test(password)) {
    errors.push('Le mot de passe doit contenir au moins un chiffre');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

// ============================================================================
// LOCALIZATION UTILITIES
// ============================================================================

export const isRTLLocale = (locale: string): boolean => {
  return RTL_LOCALES.includes(locale as any);
};

export const getDirection = (locale: string): 'ltr' | 'rtl' => {
  return isRTLLocale(locale) ? 'rtl' : 'ltr';
};

export const formatLocale = (locale: string): string => {
  return locale.toLowerCase().replace('_', '-');
};

export const createSlug = (text: string): string => {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .replace(/[^a-z0-9\s-]/g, '') // Remove special chars
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Remove duplicate hyphens
    .trim('-'); // Remove leading/trailing hyphens
};

// ============================================================================
// GEOGRAPHIC UTILITIES
// ============================================================================

export const calculateDistance = (coord1: Coordinates, coord2: Coordinates): number => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRad(coord2.lat - coord1.lat);
  const dLng = toRad(coord2.lng - coord1.lng);
  
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(coord1.lat)) * Math.cos(toRad(coord2.lat)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const toRad = (value: number): number => {
  return (value * Math.PI) / 180;
};

export const isWithinRadius = (
  center: Coordinates, 
  point: Coordinates, 
  radiusKm: number
): boolean => {
  return calculateDistance(center, point) <= radiusKm;
};

export const getBounds = (coordinates: Coordinates[], padding = 0.01) => {
  if (coordinates.length === 0) {
    return null;
  }

  const lats = coordinates.map(c => c.lat);
  const lngs = coordinates.map(c => c.lng);

  return {
    north: Math.max(...lats) + padding,
    south: Math.min(...lats) - padding,
    east: Math.max(...lngs) + padding,
    west: Math.min(...lngs) - padding,
  };
};

export const formatCoordinates = (coords: Coordinates, precision = 6): string => {
  return `${coords.lat.toFixed(precision)},${coords.lng.toFixed(precision)}`;
};

// ============================================================================
// DATE & TIME UTILITIES
// ============================================================================

export const formatDateTime = (
  date: Date, 
  locale: string = LOCALES.FR, 
  options: Intl.DateTimeFormatOptions = {}
): string => {
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  };

  return new Intl.DateTimeFormat(
    formatLocale(locale), 
    { ...defaultOptions, ...options }
  ).format(date);
};

export const formatDate = (
  date: Date, 
  locale: string = LOCALES.FR
): string => {
  return formatDateTime(date, locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const formatTime = (
  date: Date, 
  locale: string = LOCALES.FR
): string => {
  return formatDateTime(date, locale, {
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const getTimeAgo = (date: Date, locale: string = LOCALES.FR): string => {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (locale === LOCALES.AR) {
    if (diffMins < 1) return 'الآن';
    if (diffMins < 60) return `منذ ${diffMins} دقيقة`;
    if (diffHours < 24) return `منذ ${diffHours} ساعة`;
    if (diffDays < 7) return `منذ ${diffDays} يوم`;
    return formatDate(date, locale);
  }

  if (diffMins < 1) return 'À l\'instant';
  if (diffMins < 60) return `Il y a ${diffMins} minute${diffMins > 1 ? 's' : ''}`;
  if (diffHours < 24) return `Il y a ${diffHours} heure${diffHours > 1 ? 's' : ''}`;
  if (diffDays < 7) return `Il y a ${diffDays} jour${diffDays > 1 ? 's' : ''}`;
  return formatDate(date, locale);
};

export const addMinutes = (date: Date, minutes: number): Date => {
  return new Date(date.getTime() + minutes * 60000);
};

export const addHours = (date: Date, hours: number): Date => {
  return addMinutes(date, hours * 60);
};

export const addDays = (date: Date, days: number): Date => {
  return new Date(date.getTime() + days * 24 * 60 * 60 * 1000);
};

export const isSameDay = (date1: Date, date2: Date): boolean => {
  return date1.toDateString() === date2.toDateString();
};

export const isToday = (date: Date): boolean => {
  return isSameDay(date, new Date());
};

export const isTomorrow = (date: Date): boolean => {
  const tomorrow = addDays(new Date(), 1);
  return isSameDay(date, tomorrow);
};

// ============================================================================
// NUMBER & CURRENCY UTILITIES
// ============================================================================

export const formatCurrency = (
  amount: number, 
  currency: string = 'DZD', 
  locale: string = LOCALES.FR
): string => {
  try {
    return new Intl.NumberFormat(formatLocale(locale), {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    // Fallback if currency is not supported
    return `${amount.toLocaleString(formatLocale(locale))} ${currency}`;
  }
};

export const formatNumber = (
  number: number, 
  locale: string = LOCALES.FR,
  options: Intl.NumberFormatOptions = {}
): string => {
  return new Intl.NumberFormat(formatLocale(locale), options).format(number);
};

export const formatDistance = (
  distanceKm: number, 
  locale: string = LOCALES.FR
): string => {
  if (distanceKm < 1) {
    const meters = Math.round(distanceKm * 1000);
    return locale === LOCALES.AR ? `${meters} متر` : `${meters} m`;
  }
  
  const rounded = Math.round(distanceKm * 10) / 10;
  return locale === LOCALES.AR ? `${rounded} كم` : `${rounded} km`;
};

export const formatDuration = (
  minutes: number, 
  locale: string = LOCALES.FR
): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  if (locale === LOCALES.AR) {
    if (hours === 0) return `${mins} دقيقة`;
    if (mins === 0) return `${hours} ساعة`;
    return `${hours} ساعة ${mins} دقيقة`;
  }

  if (hours === 0) return `${mins} min`;
  if (mins === 0) return `${hours}h`;
  return `${hours}h ${mins}min`;
};

// ============================================================================
// STRING UTILITIES
// ============================================================================

export const truncate = (text: string, length: number, suffix = '...'): string => {
  if (text.length <= length) return text;
  return text.substring(0, length - suffix.length) + suffix;
};

export const capitalize = (text: string): string => {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

export const capitalizeWords = (text: string): string => {
  return text.split(' ').map(capitalize).join(' ');
};

export const removeAccents = (text: string): string => {
  return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
};

export const sanitizeHtml = (html: string): string => {
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<[^>]*>/g, '')
    .trim();
};

export const generateRandomString = (length: number): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

export const generateOTP = (length: number = 6): string => {
  const digits = '0123456789';
  let otp = '';
  for (let i = 0; i < length; i++) {
    otp += digits.charAt(Math.floor(Math.random() * digits.length));
  }
  return otp;
};

// ============================================================================
// ARRAY UTILITIES
// ============================================================================

export const chunk = <T>(array: T[], size: number): T[][] => {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
};

export const unique = <T>(array: T[]): T[] => {
  return Array.from(new Set(array));
};

export const shuffle = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export const groupBy = <T, K extends keyof T>(
  array: T[], 
  key: K
): Record<string, T[]> => {
  return array.reduce((groups, item) => {
    const group = String(item[key]);
    groups[group] = groups[group] || [];
    groups[group].push(item);
    return groups;
  }, {} as Record<string, T[]>);
};

// ============================================================================
// OBJECT UTILITIES
// ============================================================================

export const omit = <T extends object, K extends keyof T>(
  obj: T, 
  keys: K[]
): Omit<T, K> => {
  const result = { ...obj };
  keys.forEach(key => delete result[key]);
  return result;
};

export const pick = <T extends object, K extends keyof T>(
  obj: T, 
  keys: K[]
): Pick<T, K> => {
  const result = {} as Pick<T, K>;
  keys.forEach(key => {
    if (key in obj) {
      result[key] = obj[key];
    }
  });
  return result;
};

export const isEmpty = (value: any): boolean => {
  if (value == null) return true;
  if (typeof value === 'string') return value.trim().length === 0;
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'object') return Object.keys(value).length === 0;
  return false;
};

export const deepClone = <T>(obj: T): T => {
  return JSON.parse(JSON.stringify(obj));
};

// ============================================================================
// API UTILITIES
// ============================================================================

export const createSuccessResponse = <T>(
  data: T, 
  message?: string
): ApiResponse<T> => ({
  success: true,
  data,
  message,
  timestamp: new Date(),
});

export const createErrorResponse = (
  error: string, 
  message?: string
): ApiResponse<null> => ({
  success: false,
  data: null,
  error,
  message,
  timestamp: new Date(),
});

export const createPagination = (
  page: number,
  limit: number,
  total: number
): Pagination => ({
  page,
  limit,
  total,
  totalPages: Math.ceil(total / limit),
});

export const parsePaginationQuery = (query: {
  page?: string | number;
  limit?: string | number;
}): { page: number; limit: number } => {
  const page = Math.max(1, parseInt(String(query.page || 1), 10) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(String(query.limit || 20), 10) || 20));
  
  return { page, limit };
};

// ============================================================================
// URL UTILITIES
// ============================================================================

export const buildUrl = (base: string, path: string, params?: Record<string, any>): string => {
  const url = new URL(path, base);
  
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value != null && value !== '') {
        url.searchParams.set(key, String(value));
      }
    });
  }
  
  return url.toString();
};

export const parseQuery = (queryString: string): Record<string, string> => {
  const params = new URLSearchParams(queryString);
  const result: Record<string, string> = {};
  
  params.forEach((value, key) => {
    result[key] = value;
  });
  
  return result;
};

// ============================================================================
// DEBOUNCE & THROTTLE
// ============================================================================

export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};