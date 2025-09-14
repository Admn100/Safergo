import { z } from 'zod';

// ============================================================================
// BASE TYPES
// ============================================================================

export const CoordinatesSchema = z.object({
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
});

export type Coordinates = z.infer<typeof CoordinatesSchema>;

export const LocationSchema = z.object({
  lat: z.number(),
  lng: z.number(),
  label: z.string(),
  city: z.string().optional(),
  country: z.string().optional(),
});

export type Location = z.infer<typeof LocationSchema>;

// ============================================================================
// USER & AUTH
// ============================================================================

export const UserRoleSchema = z.enum(['user', 'driver', 'admin', 'moderator']);
export type UserRole = z.infer<typeof UserRoleSchema>;

export const UserStatusSchema = z.enum(['active', 'suspended', 'banned', 'pending']);
export type UserStatus = z.infer<typeof UserStatusSchema>;

export const UserSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  phone: z.string().optional(),
  name: z.string(),
  photo: z.string().url().optional(),
  locale: z.enum(['fr', 'ar']).default('fr'),
  roles: z.array(UserRoleSchema).default(['user']),
  status: UserStatusSchema.default('active'),
  emailVerified: z.boolean().default(false),
  phoneVerified: z.boolean().default(false),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type User = z.infer<typeof UserSchema>;

// ============================================================================
// DRIVER & KYC
// ============================================================================

export const KycStatusSchema = z.enum(['pending', 'under_review', 'approved', 'rejected']);
export type KycStatus = z.infer<typeof KycStatusSchema>;

export const DriverBadgeSchema = z.enum(['verified', 'experienced', 'eco_friendly', 'top_rated']);
export type DriverBadge = z.infer<typeof DriverBadgeSchema>;

export const DriverSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  kycStatus: KycStatusSchema.default('pending'),
  licenseNumber: z.string(),
  licenseExpiryDate: z.date(),
  badges: z.array(DriverBadgeSchema).default([]),
  rating: z.number().min(0).max(5).default(0),
  reviewCount: z.number().default(0),
  totalTrips: z.number().default(0),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Driver = z.infer<typeof DriverSchema>;

// ============================================================================
// VEHICLE
// ============================================================================

export const VehicleSchema = z.object({
  id: z.string().uuid(),
  driverId: z.string().uuid(),
  make: z.string(),
  model: z.string(),
  year: z.number().min(1990).max(new Date().getFullYear() + 1),
  color: z.string(),
  seats: z.number().min(1).max(8),
  plate: z.string(),
  photos: z.array(z.string().url()).default([]),
  isVerified: z.boolean().default(false),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Vehicle = z.infer<typeof VehicleSchema>;

// ============================================================================
// TRIP
// ============================================================================

export const TripStatusSchema = z.enum(['draft', 'open', 'confirmed', 'in_progress', 'completed', 'cancelled']);
export type TripStatus = z.infer<typeof TripStatusSchema>;

export const TripRulesSchema = z.object({
  smokingAllowed: z.boolean().default(false),
  petsAllowed: z.boolean().default(false),
  musicAllowed: z.boolean().default(true),
  conversationLevel: z.enum(['quiet', 'normal', 'chatty']).default('normal'),
  luggageSize: z.enum(['none', 'small', 'medium', 'large']).default('medium'),
});

export type TripRules = z.infer<typeof TripRulesSchema>;

export const TripSchema = z.object({
  id: z.string().uuid(),
  driverId: z.string().uuid(),
  vehicleId: z.string().uuid(),
  origin: LocationSchema,
  destination: LocationSchema,
  departureDateTime: z.date(),
  arrivalDateTime: z.date().optional(),
  availableSeats: z.number().min(1).max(8),
  pricePerSeat: z.number().min(0),
  currency: z.string().default('DZD'),
  rules: TripRulesSchema.default({}),
  status: TripStatusSchema.default('draft'),
  description: z.string().optional(),
  // Tourism specific fields
  placeId: z.string().uuid().optional(),
  itineraryId: z.string().uuid().optional(),
  tourismMode: z.boolean().default(false),
  // Metadata
  totalDistance: z.number().optional(),
  estimatedDuration: z.number().optional(), // in minutes
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Trip = z.infer<typeof TripSchema>;

// ============================================================================
// BOOKING
// ============================================================================

export const BookingStatusSchema = z.enum(['pending', 'held', 'confirmed', 'cancelled', 'completed', 'refunded']);
export type BookingStatus = z.infer<typeof BookingStatusSchema>;

export const BookingSchema = z.object({
  id: z.string().uuid(),
  tripId: z.string().uuid(),
  userId: z.string().uuid(),
  seats: z.number().min(1),
  priceTotal: z.number().min(0),
  currency: z.string().default('DZD'),
  status: BookingStatusSchema.default('pending'),
  paymentIntentId: z.string().optional(),
  notes: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Booking = z.infer<typeof BookingSchema>;

// ============================================================================
// PAYMENT
// ============================================================================

export const PaymentStatusSchema = z.enum(['intent', 'hold', 'captured', 'refunded', 'failed']);
export type PaymentStatus = z.infer<typeof PaymentStatusSchema>;

export const PaymentSchema = z.object({
  id: z.string().uuid(),
  bookingId: z.string().uuid(),
  intentId: z.string(),
  status: PaymentStatusSchema.default('intent'),
  amount: z.number().min(0),
  currency: z.string().default('DZD'),
  provider: z.string(),
  providerData: z.record(z.any()).optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Payment = z.infer<typeof PaymentSchema>;

// ============================================================================
// MESSAGING
// ============================================================================

export const MessageStatusSchema = z.enum(['sent', 'delivered', 'read', 'flagged']);
export type MessageStatus = z.infer<typeof MessageStatusSchema>;

export const MessageSchema = z.object({
  id: z.string().uuid(),
  conversationId: z.string().uuid(),
  senderId: z.string().uuid(),
  text: z.string(),
  status: MessageStatusSchema.default('sent'),
  flagged: z.boolean().default(false),
  flagReason: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Message = z.infer<typeof MessageSchema>;

export const ConversationSchema = z.object({
  id: z.string().uuid(),
  tripId: z.string().uuid(),
  participants: z.array(z.string().uuid()).min(2),
  lastMessageAt: z.date().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Conversation = z.infer<typeof ConversationSchema>;

// ============================================================================
// REVIEWS
// ============================================================================

export const ReviewSchema = z.object({
  id: z.string().uuid(),
  fromUserId: z.string().uuid(),
  toUserId: z.string().uuid(),
  tripId: z.string().uuid(),
  rating: z.number().min(1).max(5),
  text: z.string().optional(),
  moderated: z.boolean().default(false),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Review = z.infer<typeof ReviewSchema>;

// ============================================================================
// TOURISM
// ============================================================================

export const PlaceTypeSchema = z.enum([
  'beach', 'waterfall', 'mountain', 'desert', 'heritage', 'museum', 
  'food', 'viewpoint', 'park', 'oasis', 'medina', 'lake', 'cave',
  'thermal_spring', 'archaeological_site', 'mosque', 'fort'
]);
export type PlaceType = z.infer<typeof PlaceTypeSchema>;

export const WilayaSchema = z.enum([
  'adrar', 'chlef', 'laghouat', 'oum_el_bouaghi', 'batna', 'bejaia',
  'biskra', 'bechar', 'blida', 'bouira', 'tamanrasset', 'tebessa',
  'tlemcen', 'tiaret', 'tizi_ouzou', 'algiers', 'djelfa', 'jijel',
  'setif', 'saida', 'skikda', 'sidi_bel_abbes', 'annaba', 'guelma',
  'constantine', 'medea', 'mostaganem', 'msila', 'mascara', 'ouargla',
  'oran', 'el_bayadh', 'illizi', 'bordj_bou_arreridj', 'boumerdes',
  'el_tarf', 'tindouf', 'tissemsilt', 'el_oued', 'khenchela', 'souk_ahras',
  'tipaza', 'mila', 'ain_defla', 'naama', 'ain_temouchent', 'ghardaia',
  'relizane', 'timimoun', 'bordj_badji_mokhtar', 'ouled_djellal',
  'beni_abbes', 'in_salah', 'in_guezzam', 'touggourt', 'djanet',
  'el_meghaier', 'el_meniaa'
]);
export type Wilaya = z.infer<typeof WilayaSchema>;

export const PlaceSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  slug: z.string(),
  type: PlaceTypeSchema,
  wilaya: WilayaSchema,
  coords: CoordinatesSchema,
  coverUrl: z.string().url(),
  gallery: z.array(z.string().url()).default([]),
  description: z.string().optional(),
  openHours: z.string().optional(),
  priceHint: z.string().optional(),
  tags: z.array(z.string()).default([]),
  ratingAgg: z.number().min(0).max(5).default(0),
  reviewCount: z.number().default(0),
  safetyNotes: z.string().optional(),
  accessibility: z.string().optional(),
  bestSeason: z.array(z.enum(['spring', 'summer', 'autumn', 'winter'])).default([]),
  difficulty: z.enum(['easy', 'moderate', 'hard']).optional(),
  isActive: z.boolean().default(true),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Place = z.infer<typeof PlaceSchema>;

export const ItineraryStopSchema = z.object({
  placeId: z.string().uuid(),
  order: z.number().min(1),
  dwellMinutes: z.number().min(0).default(60),
  notes: z.string().optional(),
});

export type ItineraryStop = z.infer<typeof ItineraryStopSchema>;

export const ItinerarySchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  slug: z.string(),
  description: z.string(),
  coverUrl: z.string().url(),
  stops: z.array(ItineraryStopSchema).min(2),
  durationHint: z.string(), // e.g., "2-3 jours"
  seasonality: z.enum(['spring', 'summer', 'autumn', 'winter', 'all']).default('all'),
  difficulty: z.enum(['easy', 'moderate', 'hard']).default('easy'),
  tags: z.array(z.string()).default([]),
  estimatedCost: z.string().optional(),
  isActive: z.boolean().default(true),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Itinerary = z.infer<typeof ItinerarySchema>;

export const PlaceReviewSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  placeId: z.string().uuid(),
  rating: z.number().min(1).max(5),
  text: z.string().optional(),
  photos: z.array(z.string().url()).default([]),
  moderated: z.boolean().default(false),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type PlaceReview = z.infer<typeof PlaceReviewSchema>;

// ============================================================================
// NOTIFICATIONS
// ============================================================================

export const NotificationChannelSchema = z.enum(['email', 'sms', 'push', 'in_app']);
export type NotificationChannel = z.infer<typeof NotificationChannelSchema>;

export const NotificationStatusSchema = z.enum(['pending', 'sent', 'delivered', 'failed']);
export type NotificationStatus = z.infer<typeof NotificationStatusSchema>;

export const NotificationSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  channel: NotificationChannelSchema,
  template: z.string(),
  payload: z.record(z.any()),
  status: NotificationStatusSchema.default('pending'),
  sentAt: z.date().optional(),
  deliveredAt: z.date().optional(),
  readAt: z.date().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Notification = z.infer<typeof NotificationSchema>;

// ============================================================================
// DISPUTES
// ============================================================================

export const DisputeReasonSchema = z.enum([
  'no_show', 'late_arrival', 'unsafe_driving', 'uncomfortable_vehicle',
  'route_change', 'payment_issue', 'inappropriate_behavior', 'other'
]);
export type DisputeReason = z.infer<typeof DisputeReasonSchema>;

export const DisputeStatusSchema = z.enum(['open', 'under_review', 'resolved', 'closed']);
export type DisputeStatus = z.infer<typeof DisputeStatusSchema>;

export const DisputeSchema = z.object({
  id: z.string().uuid(),
  bookingId: z.string().uuid(),
  reporterId: z.string().uuid(),
  reason: DisputeReasonSchema,
  description: z.string(),
  status: DisputeStatusSchema.default('open'),
  resolution: z.string().optional(),
  resolvedBy: z.string().uuid().optional(),
  resolvedAt: z.date().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Dispute = z.infer<typeof DisputeSchema>;

// ============================================================================
// AUDIT LOG
// ============================================================================

export const AuditActionSchema = z.enum([
  'user_created', 'user_updated', 'user_deleted', 'user_suspended',
  'trip_created', 'trip_updated', 'trip_cancelled', 'trip_completed',
  'booking_created', 'booking_confirmed', 'booking_cancelled',
  'payment_processed', 'payment_refunded',
  'kyc_submitted', 'kyc_approved', 'kyc_rejected',
  'place_created', 'place_updated', 'place_deleted',
  'itinerary_created', 'itinerary_updated',
  'admin_login', 'admin_action'
]);
export type AuditAction = z.infer<typeof AuditActionSchema>;

export const AuditLogSchema = z.object({
  id: z.string().uuid(),
  actorId: z.string().uuid().optional(),
  action: AuditActionSchema,
  entity: z.string(),
  entityId: z.string(),
  meta: z.record(z.any()).optional(),
  ipAddress: z.string().optional(),
  userAgent: z.string().optional(),
  createdAt: z.date(),
});

export type AuditLog = z.infer<typeof AuditLogSchema>;

// ============================================================================
// API RESPONSES
// ============================================================================

export const ApiResponseSchema = <T extends z.ZodType>(dataSchema: T) =>
  z.object({
    success: z.boolean(),
    data: dataSchema.optional(),
    error: z.string().optional(),
    message: z.string().optional(),
    timestamp: z.date(),
  });

export type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp: Date;
};

export const PaginationSchema = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(20),
  total: z.number().min(0),
  totalPages: z.number().min(0),
});

export type Pagination = z.infer<typeof PaginationSchema>;

export const PaginatedResponseSchema = <T extends z.ZodType>(dataSchema: T) =>
  z.object({
    success: z.boolean(),
    data: z.array(dataSchema),
    pagination: PaginationSchema,
    error: z.string().optional(),
    message: z.string().optional(),
    timestamp: z.date(),
  });

export type PaginatedResponse<T> = {
  success: boolean;
  data: T[];
  pagination: Pagination;
  error?: string;
  message?: string;
  timestamp: Date;
};