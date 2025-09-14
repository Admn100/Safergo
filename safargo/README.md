# 🚗 SafarGo - Application de Covoiturage avec Module Tourisme Algérie

[![CI](https://github.com/safargo/safargo/actions/workflows/ci.yml/badge.svg)](https://github.com/safargo/safargo/actions/workflows/ci.yml)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

SafarGo est une plateforme de covoiturage moderne inspirée de BlaBlaCar, enrichie d'un module tourisme dédié à la découverte de l'Algérie. L'application permet de partager des trajets tout en mettant en valeur les destinations touristiques algériennes.

## 🎯 Fonctionnalités Principales

### Covoiturage
- 🔍 Recherche et publication de trajets
- 💳 Paiement sécurisé avec système d'escrow (hold → capture)
- 💬 Messagerie in-app avec protection anti-fraude
- ⭐ Système d'évaluation et avis
- 👤 Profils conducteurs avec KYC
- 🚗 Gestion des véhicules

### Module Tourisme Algérie
- 🗺️ Carte interactive avec 24+ POI (plages, cascades, montagnes, désert, patrimoine)
- 📍 Fiches détaillées des lieux touristiques
- 🛤️ Itinéraires thématiques prédéfinis
- 🚀 Création de trajets touristiques en un clic
- 🏷️ Filtres par type de lieu et wilaya
- 📸 Galeries photos et avis communautaires

### Technique
- 🌐 Multiplateforme : Web, iOS, Android
- 🌍 Internationalisation FR/AR avec support RTL complet
- ♿ Accessibilité WCAG AA
- 🔒 Sécurité OWASP ASVS L1
- ⚡ Performance optimisée (p95 < 200ms)
- 📊 Observabilité complète (traces, métriques, logs)

## 🏗️ Architecture

```
safargo/
├── apps/
│   ├── api/          # API NestJS
│   ├── web/          # Web App Next.js
│   ├── mobile/       # App React Native
│   └── admin/        # Back-office Admin
├── packages/
│   ├── ui/           # Design System & Composants
│   ├── shared/       # Types & Utilités partagés
│   └── database/     # Schéma Prisma & Client
└── infra/            # Docker, Terraform, K8s
```

## 🚀 Démarrage Rapide

### Prérequis
- Node.js 20+
- pnpm 8.14+
- Docker & Docker Compose
- PostgreSQL 15+ (ou utiliser Docker)

### Installation

```bash
# Cloner le repository
git clone https://github.com/safargo/safargo.git
cd safargo

# Installer les dépendances
pnpm install

# Démarrer les services (DB, Redis, MinIO)
docker compose up -d

# Copier les variables d'environnement
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env
cp apps/mobile/.env.example apps/mobile/.env

# Générer le client Prisma
pnpm --filter @safargo/database prisma:generate

# Appliquer les migrations
pnpm --filter @safargo/database prisma:migrate:dev

# Seed de la base de données
pnpm --filter @safargo/database prisma:seed

# Démarrer en mode développement
pnpm dev
```

### URLs de développement
- 🌐 Web App: http://localhost:3001
- 🔧 API: http://localhost:3000
- 📚 API Docs: http://localhost:3000/docs
- 👨‍💼 Admin: http://localhost:3002
- 📖 Storybook: http://localhost:6006
- 🗄️ MinIO Console: http://localhost:9001

### Comptes de démonstration
- **Passager**: passenger@demo.com
- **Conducteur**: driver@demo.com
- **Admin**: admin@demo.com
- **Code OTP** (dev): Voir les logs console de l'API

## 🎨 Design System

Notre design system reflète l'identité algérienne avec :
- 🟢 Vert algérien (#006233) - Actions principales
- 🔴 Rouge algérien (#D21034) - Actions secondaires
- 🏳️ Drapeau animé dans le header
- 📱 Composants glass-morphism
- 🎭 Support complet du mode sombre
- 🌍 RTL pour l'arabe

## 🧪 Tests

```bash
# Tests unitaires
pnpm test

# Tests avec couverture
pnpm test:cov

# Tests e2e
pnpm test:e2e

# Tests d'accessibilité
pnpm test:a11y
```

## 📦 Build & Déploiement

```bash
# Build de production
pnpm build

# Build Docker
docker build -f apps/api/Dockerfile -t safargo-api .
docker build -f apps/web/Dockerfile -t safargo-web .

# Déploiement staging
pnpm deploy:staging

# Déploiement production
pnpm deploy:prod
```

## 📊 Monitoring & Observabilité

- **Traces**: OpenTelemetry → Tempo
- **Métriques**: Prometheus → Grafana
- **Logs**: Structured logging → Loki
- **Erreurs**: Sentry
- **Uptime**: Health checks & probes

### Dashboards disponibles
- Performance API (latence p50/p95/p99)
- Taux de conversion tourisme
- Métriques business (DAU, bookings, revenue)
- Infrastructure (CPU, mémoire, réseau)

## 🔒 Sécurité

- ✅ JWT avec rotation automatique
- ✅ Rate limiting par IP/User
- ✅ Headers de sécurité (CSP, HSTS)
- ✅ Chiffrement en transit (TLS) et au repos
- ✅ Validation des entrées (Zod)
- ✅ Protection CSRF
- ✅ Audit logs complets

## 🌍 Internationalisation

L'application supporte :
- 🇫🇷 Français (défaut)
- 🇩🇿 Arabe algérien avec RTL complet
- 📅 Formats de date/heure localisés
- 💰 Devise DZD

## 🤝 Contribution

Les contributions sont les bienvenues ! Veuillez consulter notre [guide de contribution](CONTRIBUTING.md).

## 📝 License

Ce projet est sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

## 🚀 Roadmap

### Phase 2 (Q2 2025)
- [ ] Assurance trajets intégrée
- [ ] Programme de parrainage
- [ ] Coupons de réduction
- [ ] API partenaires (hôtels, restaurants)

### Phase 3 (Q3 2025)
- [ ] Application conducteur dédiée
- [ ] Trajets récurrents
- [ ] Intégration wallets mobiles
- [ ] Expansion Maghreb

---

**SafarGo** - Voyagez ensemble, découvrez l'Algérie 🇩🇿