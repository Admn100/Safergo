import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number, currency: string = 'DZD'): string {
  return new Intl.NumberFormat('fr-DZ', {
    style: 'currency',
    currency: currency,
  }).format(amount)
}

export function formatDate(date: Date | string, locale: string = 'fr'): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(d)
}

export function formatDateTime(date: Date | string, locale: string = 'fr'): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d)
}

export function formatTime(date: Date | string, locale: string = 'fr'): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat(locale, {
    hour: '2-digit',
    minute: '2-digit',
  }).format(d)
}

export function getTourismCategoryColor(category: string): string {
  const colors: Record<string, string> = {
    beach: 'tourism-beach',
    waterfall: 'tourism-waterfall',
    mountain: 'tourism-mountain',
    desert: 'tourism-desert',
    heritage: 'tourism-heritage',
    food: 'tourism-food',
    park: 'tourism-park',
    oasis: 'tourism-oasis',
    medina: 'tourism-medina',
    lake: 'tourism-lake',
    viewpoint: 'tourism-viewpoint',
  }
  return colors[category] || 'tourism-heritage'
}

export function getTourismCategoryEmoji(category: string): string {
  const emojis: Record<string, string> = {
    beach: '🏖️',
    waterfall: '🌊',
    mountain: '⛰️',
    desert: '🏜️',
    heritage: '🏛️',
    food: '🍽️',
    park: '🌳',
    oasis: '🌴',
    medina: '🏘️',
    lake: '🏞️',
    viewpoint: '🌅',
  }
  return emojis[category] || '📍'
}

export function getTourismCategoryLabel(category: string, locale: string = 'fr'): string {
  const labels: Record<string, Record<string, string>> = {
    fr: {
      beach: 'Plage',
      waterfall: 'Cascade',
      mountain: 'Montagne',
      desert: 'Désert',
      heritage: 'Patrimoine',
      food: 'Gastronomie',
      park: 'Parc',
      oasis: 'Oasis',
      medina: 'Médina',
      lake: 'Lac',
      viewpoint: 'Panorama',
    },
    ar: {
      beach: 'شاطئ',
      waterfall: 'شلال',
      mountain: 'جبل',
      desert: 'صحراء',
      heritage: 'تراث',
      food: 'مطبخ',
      park: 'حديقة',
      oasis: 'واحة',
      medina: 'مدينة قديمة',
      lake: 'بحيرة',
      viewpoint: 'منظر',
    },
  }
  return labels[locale]?.[category] || category
}

export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371 // Radius of the Earth in kilometers
  const dLat = (lat2 - lat1) * (Math.PI / 180)
  const dLon = (lon2 - lon1) * (Math.PI / 180)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

export function formatDistance(distance: number): string {
  if (distance < 1) {
    return `${Math.round(distance * 1000)}m`
  }
  return `${distance.toFixed(1)}km`
}

export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .trim()
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength).trim() + '...'
}

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function isValidPhoneNumber(phone: string): boolean {
  const phoneRegex = /^(\+213|0)[5-7][0-9]{8}$/
  return phoneRegex.test(phone.replace(/\s/g, ''))
}

export function formatPhoneNumber(phone: string): string {
  const cleaned = phone.replace(/\D/g, '')
  if (cleaned.startsWith('213')) {
    return `+${cleaned.slice(0, 3)} ${cleaned.slice(3, 5)} ${cleaned.slice(5, 8)} ${cleaned.slice(8)}`
  }
  if (cleaned.startsWith('0')) {
    return `+213 ${cleaned.slice(1, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6)}`
  }
  return phone
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}