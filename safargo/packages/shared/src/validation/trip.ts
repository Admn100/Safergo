import { z } from 'zod'

export const coordinatesSchema = z.object({
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
})

export const createTripSchema = z.object({
  originLat: z.number().min(-90).max(90),
  originLng: z.number().min(-180).max(180),
  originLabel: z.string().min(1).max(255),
  destinationLat: z.number().min(-90).max(90),
  destinationLng: z.number().min(-180).max(180),
  destinationLabel: z.string().min(1).max(255),
  dateTime: z.string().datetime(),
  seats: z.number().int().min(1).max(8),
  pricePerSeat: z.number().positive(),
  rules: z.array(z.string()).default([]),
  vehicleId: z.string().cuid().optional(),
  tourismMode: z.boolean().default(false),
  placeId: z.string().cuid().optional(),
  itineraryId: z.string().cuid().optional(),
})

export const searchTripsSchema = z.object({
  near: z.string().optional(), // format: "lat,lng"
  radiusKm: z.number().int().positive().default(50),
  date: z.string().datetime().optional(),
  seats: z.number().int().min(1).max(8).optional(),
  priceMax: z.number().positive().optional(),
  tourismMode: z.boolean().optional(),
  sort: z.enum(['price', 'date', 'distance']).default('date'),
  page: z.number().int().positive().default(1),
  limit: z.number().int().min(1).max(100).default(20),
})

export type CreateTripDto = z.infer<typeof createTripSchema>
export type SearchTripsDto = z.infer<typeof searchTripsSchema>