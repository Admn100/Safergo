/**
 * Calculate distance between two coordinates using Haversine formula
 * @returns Distance in meters
 */
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  const R = 6371e3 // Earth radius in meters
  const φ1 = (lat1 * Math.PI) / 180
  const φ2 = (lat2 * Math.PI) / 180
  const Δφ = ((lat2 - lat1) * Math.PI) / 180
  const Δλ = ((lon2 - lon1) * Math.PI) / 180

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

  return R * c
}

/**
 * Check if a coordinate is within a radius of another coordinate
 */
export function isWithinRadius(
  centerLat: number,
  centerLng: number,
  pointLat: number,
  pointLng: number,
  radiusMeters: number,
): boolean {
  const distance = calculateDistance(centerLat, centerLng, pointLat, pointLng)
  return distance <= radiusMeters
}

/**
 * Get bounding box for a given center and radius
 * @returns [minLat, minLng, maxLat, maxLng]
 */
export function getBoundingBox(
  lat: number,
  lng: number,
  radiusMeters: number,
): [number, number, number, number] {
  const R = 6371e3 // Earth radius in meters
  const latRad = (lat * Math.PI) / 180
  
  const latDelta = (radiusMeters / R) * (180 / Math.PI)
  const lngDelta = (radiusMeters / (R * Math.cos(latRad))) * (180 / Math.PI)
  
  return [
    lat - latDelta,
    lng - lngDelta,
    lat + latDelta,
    lng + lngDelta,
  ]
}

/**
 * Parse coordinates string "lat,lng" to numbers
 */
export function parseCoordinates(coords: string): { lat: number; lng: number } | null {
  const parts = coords.split(',').map(p => p.trim())
  if (parts.length !== 2) return null
  
  const lat = parseFloat(parts[0])
  const lng = parseFloat(parts[1])
  
  if (isNaN(lat) || isNaN(lng)) return null
  if (lat < -90 || lat > 90 || lng < -180 || lng > 180) return null
  
  return { lat, lng }
}