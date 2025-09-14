import { format, formatDistanceToNow, parseISO } from 'date-fns'
import { fr, arDZ } from 'date-fns/locale'

export function formatDate(date: string | Date, locale: string = 'fr'): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  const localeObj = locale === 'ar' ? arDZ : fr
  
  return format(dateObj, 'PPP', { locale: localeObj })
}

export function formatTime(date: string | Date, locale: string = 'fr'): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  const localeObj = locale === 'ar' ? arDZ : fr
  
  return format(dateObj, 'HH:mm', { locale: localeObj })
}

export function formatDateTime(date: string | Date, locale: string = 'fr'): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  const localeObj = locale === 'ar' ? arDZ : fr
  
  return format(dateObj, 'PPP à HH:mm', { locale: localeObj })
}

export function formatRelativeTime(date: string | Date, locale: string = 'fr'): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  const localeObj = locale === 'ar' ? arDZ : fr
  
  return formatDistanceToNow(dateObj, { addSuffix: true, locale: localeObj })
}

export function formatPrice(amount: number, currency: string = 'DZD'): string {
  return new Intl.NumberFormat('fr-DZ', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatDistance(meters: number, locale: string = 'fr'): string {
  if (meters < 1000) {
    return `${Math.round(meters)} m`
  }
  
  const km = meters / 1000
  if (km < 10) {
    return `${km.toFixed(1)} km`
  }
  
  return `${Math.round(km)} km`
}

export function formatDuration(minutes: number, locale: string = 'fr'): string {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  
  if (hours === 0) {
    return `${mins} min`
  }
  
  if (mins === 0) {
    return `${hours}h`
  }
  
  return `${hours}h ${mins}min`
}