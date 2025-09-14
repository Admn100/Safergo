# Guide de Développement SafarGo

## 🚀 Démarrage Rapide

### Prérequis
- Node.js 20+
- pnpm 8+
- Docker & Docker Compose
- PostgreSQL 15+
- Git

### Installation
```bash
# Cloner le repository
git clone https://github.com/your-org/safargo.git
cd safargo

# Installer les dépendances
pnpm install

# Copier les variables d'environnement
cp .env.example .env

# Démarrer les services de base
docker-compose up -d postgres redis minio

# Générer le client Prisma
pnpm -C apps/api prisma:generate

# Exécuter les migrations
pnpm -C apps/api prisma:migrate

# Peupler la base de données
pnpm -C apps/api prisma:seed

# Démarrer en mode développement
pnpm dev
```

## 🏗️ Architecture du Projet

### Structure du Monorepo
```
safargo/
├── apps/
│   ├── api/                 # API NestJS
│   │   ├── src/
│   │   │   ├── auth/        # Authentification
│   │   │   ├── users/       # Gestion utilisateurs
│   │   │   ├── trips/       # Trajets
│   │   │   ├── bookings/    # Réservations
│   │   │   ├── payments/    # Paiements
│   │   │   ├── places/      # Lieux touristiques
│   │   │   ├── itineraries/ # Itinéraires
│   │   │   ├── admin/       # Administration
│   │   │   └── prisma/      # Base de données
│   │   ├── prisma/
│   │   │   ├── schema.prisma
│   │   │   └── seed.ts
│   │   └── Dockerfile
│   ├── web/                 # App Next.js
│   │   ├── src/
│   │   │   ├── app/         # App Router
│   │   │   ├── components/  # Composants
│   │   │   ├── lib/         # Utilitaires
│   │   │   └── styles/      # Styles
│   │   └── Dockerfile
│   └── mobile/              # App React Native
│       ├── src/
│       │   ├── components/  # Composants
│       │   ├── screens/     # Écrans
│       │   ├── services/    # Services API
│       │   ├── stores/      # État global
│       │   └── theme/       # Thème
│       └── app.json
├── packages/
│   ├── ui/                  # Design System
│   │   ├── src/
│   │   │   ├── components/  # Composants réutilisables
│   │   │   ├── lib/         # Utilitaires
│   │   │   └── styles/      # Styles globaux
│   │   └── tailwind.config.js
│   └── shared/              # Utilitaires partagés
├── infra/                   # Infrastructure
│   ├── nginx/               # Configuration Nginx
│   ├── prometheus/          # Monitoring
│   └── grafana/             # Dashboards
└── docs/                    # Documentation
```

## 🔧 Configuration

### Variables d'Environnement

#### API (.env)
```bash
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/safargo"

# JWT
JWT_SECRET="your-super-secret-jwt-key-64-chars-minimum"
JWT_EXPIRES_IN="7d"

# Storage (S3-compatible)
STORAGE_ENDPOINT="https://s3.amazonaws.com"
STORAGE_BUCKET="safargo-assets"
STORAGE_KEY="your-access-key"
STORAGE_SECRET="your-secret-key"
STORAGE_REGION="us-east-1"

# Payment (Stripe)
PAYMENT_KEY="sk_test_..."
PAYMENT_WEBHOOK_SECRET="whsec_..."

# Maps
MAPBOX_TOKEN="pk.eyJ1IjoieW91ci10b2tlbiIsImEiOiJjbGV4YW1wbGUifQ"

# Email (SendGrid)
EMAIL_API_KEY="SG.your-sendgrid-api-key"
EMAIL_FROM="noreply@safargo.com"

# SMS (Twilio)
SMS_API_KEY="your-twilio-account-sid"
SMS_SECRET="your-twilio-auth-token"
SMS_FROM="+1234567890"

# Push Notifications
FCM_SERVER_KEY="your-fcm-server-key"
APNS_KEY_ID="your-apns-key-id"
APNS_TEAM_ID="your-apns-team-id"
APNS_BUNDLE_ID="com.safargo.app"

# Monitoring
SENTRY_DSN="https://your-sentry-dsn@sentry.io/project-id"

# App URLs
NEXT_PUBLIC_API_URL="http://localhost:3001"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_ADMIN_URL="http://localhost:3000/admin"

# Feature Flags
ENABLE_TOURISM_MODULE="true"
ENABLE_PAYMENTS="true"
ENABLE_SMS="true"
```

#### Web (.env.local)
```bash
NEXT_PUBLIC_API_URL="http://localhost:3001"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_ADMIN_URL="http://localhost:3000/admin"
MAPBOX_TOKEN="pk.eyJ1IjoieW91ci10b2tlbiIsImEiOiJjbGV4YW1wbGUifQ"
```

#### Mobile (app.json)
```json
{
  "expo": {
    "extra": {
      "apiUrl": "http://localhost:3001",
      "mapboxToken": "pk.eyJ1IjoieW91ci10b2tlbiIsImEiOiJjbGV4YW1wbGUifQ"
    }
  }
}
```

## 🗄️ Base de Données

### Schéma Prisma
```prisma
// Entités principales
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  phone     String?  @unique
  name      String
  photo     String?
  locale    String   @default("fr")
  roles     Role[]   @default([USER])
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  driverProfile Driver?
  bookings      Booking[]
  reviews       Review[]
  // ... autres relations
}

model Trip {
  id          String    @id @default(cuid())
  driverId    String
  vehicleId   String
  origin      Json      // {lat, lng, label}
  destination Json      // {lat, lng, label}
  dateTime    DateTime
  seats       Int
  pricePerSeat Float
  rules       String[]  @default([])
  status      TripStatus @default(DRAFT)
  placeId     String?   // Tourism mode
  itineraryId String?   // Tourism mode
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  driver     Driver    @relation(fields: [driverId], references: [id])
  vehicle    Vehicle   @relation(fields: [vehicleId], references: [id])
  bookings   Booking[]
  place      Place?    @relation(fields: [placeId], references: [id])
  itinerary  Itinerary? @relation(fields: [itineraryId], references: [id])
}

model Place {
  id           String      @id @default(cuid())
  name         String
  slug         String      @unique
  type         PlaceType
  wilaya       String
  coords       Json        // {lat, lng}
  coverUrl     String?
  gallery      String[]    @default([])
  openHours    Json?
  priceHint    String?
  tags         String[]    @default([])
  ratingAgg    Float       @default(0)
  reviewCount  Int         @default(0)
  safetyNotes  String?
  createdAt    DateTime    @default(now())
  updatedAt    DateTime    @updatedAt

  trips        Trip[]
  reviews      PlaceReview[]
  itineraryStops ItineraryStop[]
}
```

### Commandes Prisma
```bash
# Générer le client
pnpm -C apps/api prisma:generate

# Créer une migration
pnpm -C apps/api prisma migrate dev --name add_new_field

# Appliquer les migrations
pnpm -C apps/api prisma migrate deploy

# Réinitialiser la base
pnpm -C apps/api prisma migrate reset

# Peupler la base
pnpm -C apps/api prisma:seed

# Ouvrir Prisma Studio
pnpm -C apps/api prisma studio
```

## 🎨 Design System

### Palette de Couleurs
```typescript
// SafarGo Brand Colors (Algérie)
const colors = {
  primary: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e',
    600: '#006233', // Main green
    700: '#15803d',
    800: '#166534',
    900: '#14532d',
    950: '#052e16',
  },
  secondary: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#ef4444',
    600: '#D21034', // Main red
    700: '#b91c1c',
    800: '#991b1b',
    900: '#7f1d1d',
    950: '#450a0a',
  },
  // Tourism categories
  tourism: {
    beach: '#0ea5e9',
    waterfall: '#06b6d4',
    mountain: '#8b5cf6',
    desert: '#f59e0b',
    heritage: '#ef4444',
    food: '#f97316',
    park: '#22c55e',
    oasis: '#10b981',
    medina: '#6366f1',
    lake: '#3b82f6',
    viewpoint: '#ec4899',
  }
}
```

### Composants Réutilisables
```typescript
// Button avec variants
<Button variant="primary" size="lg">Publier un trajet</Button>
<Button variant="secondary" size="md">Annuler</Button>
<Button variant="outline" size="sm">Voir plus</Button>
<Button variant="glass">Explorer</Button>

// TourismChip avec catégories
<TourismChip category="beach" locale="fr" />
<TourismChip category="waterfall" locale="ar" />

// Card avec effet glass
<Card variant="glass">
  <CardContent>
    <h3>Plage de Sidi Fredj</h3>
    <p>Une des plus belles plages d'Alger</p>
  </CardContent>
</Card>

// FlagIcon animé
<FlagIcon animated size="lg" />
```

## 🔐 Authentification

### Flow OTP
```typescript
// 1. Demander un code OTP
const requestOTP = async (identifier: string) => {
  const response = await api.post('/auth/otp/request', {
    [identifier.includes('@') ? 'email' : 'phone']: identifier
  })
  return response.data
}

// 2. Vérifier le code OTP
const verifyOTP = async (identifier: string, otp: string, name?: string) => {
  const response = await api.post('/auth/otp/verify', {
    identifier,
    otp,
    name
  })
  const { access_token, user } = response.data
  
  // Stocker le token
  await SecureStore.setItemAsync('auth_token', access_token)
  
  return { user, token: access_token }
}
```

### Guards et Middleware
```typescript
// JWT Guard
@UseGuards(JwtAuthGuard)
@Get('profile')
async getProfile(@CurrentUser() user: User) {
  return this.usersService.getProfile(user.id)
}

// Rôles
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
@Get('admin/dashboard')
async getDashboard() {
  return this.adminService.getDashboard()
}
```

## 💳 Paiements

### Flow Escrow
```typescript
// 1. Créer une intention de paiement
const createPaymentIntent = async (bookingId: string, amount: number) => {
  const response = await api.post('/payments/intent', {
    bookingId,
    amount,
    currency: 'DZD'
  })
  return response.data
}

// 2. Mettre en attente (hold)
const holdPayment = async (paymentId: string) => {
  const response = await api.post(`/payments/${paymentId}/hold`)
  return response.data
}

// 3. Capturer après le trajet
const capturePayment = async (paymentId: string) => {
  const response = await api.post(`/payments/${paymentId}/capture`)
  return response.data
}

// 4. Rembourser si annulation
const refundPayment = async (paymentId: string) => {
  const response = await api.post(`/payments/${paymentId}/refund`)
  return response.data
}
```

## 🗺️ Cartographie

### Configuration Mapbox
```typescript
// Style personnalisé pour l'Algérie
const mapStyle = {
  version: 8,
  sources: {
    'safargo-style': {
      type: 'raster',
      tiles: ['https://api.mapbox.com/styles/v1/your-style/tiles/{z}/{x}/{y}'],
      tileSize: 256
    }
  },
  layers: [
    {
      id: 'background',
      type: 'raster',
      source: 'safargo-style'
    }
  ]
}

// Clusters pour les POI
const clusterConfig = {
  radius: 50,
  maxZoom: 14,
  minPoints: 2
}
```

### Marqueurs par Catégorie
```typescript
const getMarkerColor = (type: string) => {
  const colors = {
    beach: '#0ea5e9',
    waterfall: '#06b6d4',
    mountain: '#8b5cf6',
    desert: '#f59e0b',
    heritage: '#ef4444',
    // ...
  }
  return colors[type] || '#6b7280'
}

const getMarkerEmoji = (type: string) => {
  const emojis = {
    beach: '🏖️',
    waterfall: '🌊',
    mountain: '⛰️',
    desert: '🏜️',
    heritage: '🏛️',
    // ...
  }
  return emojis[type] || '📍'
}
```

## 🌍 Internationalisation

### Configuration i18next
```typescript
// Configuration
const i18n = {
  lng: 'fr',
  fallbackLng: 'fr',
  supportedLngs: ['fr', 'ar'],
  interpolation: {
    escapeValue: false
  },
  resources: {
    fr: {
      translation: {
        common: {
          search: 'Rechercher',
          cancel: 'Annuler',
          confirm: 'Confirmer'
        },
        tourism: {
          beach: 'Plage',
          waterfall: 'Cascade',
          mountain: 'Montagne'
        }
      }
    },
    ar: {
      translation: {
        common: {
          search: 'بحث',
          cancel: 'إلغاء',
          confirm: 'تأكيد'
        },
        tourism: {
          beach: 'شاطئ',
          waterfall: 'شلال',
          mountain: 'جبل'
        }
      }
    }
  }
}
```

### Support RTL
```css
/* RTL Support */
[dir="rtl"] {
  direction: rtl;
}

[dir="rtl"] .rtl\:mirror {
  transform: scaleX(-1);
}

/* Arabic font */
[lang="ar"] {
  font-family: 'Cairo', 'IBM Plex Arabic', system-ui, sans-serif;
}
```

## 🧪 Tests

### Tests API
```typescript
// Test d'intégration
describe('Trips API', () => {
  it('should create a trip', async () => {
    const tripData = {
      origin: { lat: 36.7833, lng: 3.0667, label: 'Alger' },
      destination: { lat: 36.3667, lng: 6.6167, label: 'Constantine' },
      dateTime: new Date('2024-06-15T08:00:00Z'),
      seats: 3,
      pricePerSeat: 500
    }

    const response = await request(app)
      .post('/api/v1/trips')
      .set('Authorization', `Bearer ${token}`)
      .send(tripData)
      .expect(201)

    expect(response.body).toHaveProperty('id')
    expect(response.body.seats).toBe(3)
  })
})
```

### Tests Frontend
```typescript
// Test de composant
import { render, screen } from '@testing-library/react'
import { TourismChip } from '@safargo/ui'

test('renders tourism chip with correct category', () => {
  render(<TourismChip category="beach" locale="fr" />)
  
  expect(screen.getByText('Plage')).toBeInTheDocument()
  expect(screen.getByText('🏖️')).toBeInTheDocument()
})
```

### Tests E2E
```typescript
// Test de flux complet
test('complete trip booking flow', async () => {
  // 1. Rechercher un trajet
  await page.goto('/search')
  await page.fill('[data-testid="origin"]', 'Alger')
  await page.fill('[data-testid="destination"]', 'Constantine')
  await page.click('[data-testid="search-button"]')

  // 2. Sélectionner un trajet
  await page.click('[data-testid="trip-card"]:first-child')
  await page.click('[data-testid="book-button"]')

  // 3. Confirmer la réservation
  await page.fill('[data-testid="seats"]', '2')
  await page.click('[data-testid="confirm-booking"]')

  // 4. Vérifier la confirmation
  await expect(page.locator('[data-testid="booking-confirmed"]')).toBeVisible()
})
```

## 📊 Monitoring

### Métriques Personnalisées
```typescript
// Métriques de tourisme
const tourismMetrics = {
  exploreMapOpen: 'counter',
  filterUse: 'counter',
  placeView: 'counter',
  tripCreatedFromPlace: 'counter',
  itineraryFollowed: 'counter',
  conversionPlaceToBooking: 'histogram'
}

// Alertes
const alerts = {
  highLatency: {
    condition: 'p95_latency > 200ms',
    severity: 'warning'
  },
  highErrorRate: {
    condition: 'error_rate > 1%',
    severity: 'critical'
  },
  paymentFailures: {
    condition: 'payment_failure_rate > 5%',
    severity: 'critical'
  }
}
```

### Dashboards Grafana
```json
{
  "dashboard": {
    "title": "SafarGo - Métriques Produit",
    "panels": [
      {
        "title": "DAU/WAU",
        "type": "stat",
        "targets": [
          {
            "expr": "sum(rate(user_activity[1d]))"
          }
        ]
      },
      {
        "title": "Conversion Tourisme",
        "type": "graph",
        "targets": [
          {
            "expr": "rate(tourism_conversion[1h])"
          }
        ]
      }
    ]
  }
}
```

## 🚀 Déploiement

### Build et Test
```bash
# Tests
pnpm test
pnpm lint
pnpm type-check

# Build
pnpm build

# Docker
docker-compose -f docker-compose.prod.yml build
docker-compose -f docker-compose.prod.yml up -d
```

### Variables d'Environnement Production
```bash
# Database
DATABASE_URL="postgresql://user:password@prod-db:5432/safargo"

# JWT
JWT_SECRET="production-secret-key-64-chars-minimum"

# Storage
STORAGE_ENDPOINT="https://s3.amazonaws.com"
STORAGE_BUCKET="safargo-prod-assets"
STORAGE_KEY="prod-access-key"
STORAGE_SECRET="prod-secret-key"

# Payment
PAYMENT_KEY="sk_live_..."
PAYMENT_WEBHOOK_SECRET="whsec_prod_..."

# Monitoring
SENTRY_DSN="https://prod-sentry-dsn@sentry.io/project-id"
```

## 🔧 Outils de Développement

### Scripts Utiles
```bash
# Développement
pnpm dev                    # Démarrer tous les services
pnpm -C apps/api dev        # API seulement
pnpm -C apps/web dev        # Web seulement
pnpm -C apps/mobile start   # Mobile seulement

# Base de données
pnpm -C apps/api prisma studio    # Interface graphique
pnpm -C apps/api prisma migrate   # Migrations
pnpm -C apps/api prisma seed      # Données de test

# Tests
pnpm test                   # Tous les tests
pnpm test:watch            # Tests en mode watch
pnpm test:coverage         # Coverage
pnpm test:e2e              # Tests E2E

# Build
pnpm build                 # Build complet
pnpm clean                 # Nettoyer les builds
pnpm type-check            # Vérification TypeScript

# Linting
pnpm lint                  # Linter
pnpm format                # Formatter
pnpm lint:fix              # Corriger automatiquement
```

### Extensions VS Code Recommandées
```json
{
  "recommendations": [
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "ms-vscode.vscode-typescript-next",
    "prisma.prisma",
    "ms-vscode.vscode-json",
    "formulahendry.auto-rename-tag",
    "christian-kohler.path-intellisense",
    "ms-vscode.vscode-eslint"
  ]
}
```

## 📚 Ressources

### Documentation
- [NestJS](https://docs.nestjs.com/)
- [Next.js](https://nextjs.org/docs)
- [React Native](https://reactnative.dev/docs/getting-started)
- [Prisma](https://www.prisma.io/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Mapbox GL JS](https://docs.mapbox.com/mapbox-gl-js/)

### Outils
- [Expo](https://docs.expo.dev/)
- [React Query](https://tanstack.com/query/latest)
- [Zustand](https://github.com/pmndrs/zustand)
- [Framer Motion](https://www.framer.com/motion/)
- [React Hook Form](https://react-hook-form.com/)

### Services
- [Stripe](https://stripe.com/docs)
- [SendGrid](https://docs.sendgrid.com/)
- [Twilio](https://www.twilio.com/docs)
- [Mapbox](https://docs.mapbox.com/)
- [Sentry](https://docs.sentry.io/)

---

Pour plus d'informations, consultez la [documentation complète](README.md) ou contactez l'équipe de développement.