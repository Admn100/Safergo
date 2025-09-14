import { z } from 'zod'
import { PLACE_TYPES, WILAYAS } from '../constants/places'

const placeTypes = Object.keys(PLACE_TYPES) as [string, ...string[]]
const wilayas = WILAYAS as unknown as [string, ...string[]]

export const searchPlacesSchema = z.object({
  type: z.enum(placeTypes as any).optional(),
  wilaya: z.enum(wilayas).optional(),
  q: z.string().optional(),
  near: z.string().optional(), // format: "lat,lng"
  radiusKm: z.number().int().positive().default(50),
  sort: z.enum(['rating', 'popularity', 'distance']).default('rating'),
  page: z.number().int().positive().default(1),
  limit: z.number().int().min(1).max(100).default(20),
})

export const createPlaceReviewSchema = z.object({
  rating: z.number().int().min(1).max(5),
  text: z.string().min(10).max(1000).optional(),
  photos: z.array(z.string().url()).max(5).default([]),
})

export type SearchPlacesDto = z.infer<typeof searchPlacesSchema>
export type CreatePlaceReviewDto = z.infer<typeof createPlaceReviewSchema>