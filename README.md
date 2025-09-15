# 🚗 SafarGo - Covoiturage & Tourisme Algérie

SafarGo est une plateforme complète de covoiturage avec un module tourisme intégré, conçue spécifiquement pour découvrir l'Algérie. La plateforme combine transport et tourisme pour offrir une expérience unique de voyage.

## 🌟 Fonctionnalités

### 🚗 Covoiturage
- **Recherche et publication de trajets** avec filtres avancés
- **Système de réservation** avec paiement sécurisé en escrow
- **Messagerie in-app** avec protection anti-fraude
- **Profils utilisateurs** avec système de KYC pour les conducteurs
- **Avis et notes** pour garantir la qualité
- **Gestion des litiges** et remboursements

### 🏛️ Module Tourisme
- **Carte interactive de l'Algérie** avec clusters de POI
- **24+ lieux touristiques** (plages, cascades, montagnes, patrimoine, etc.)
- **Itinéraires thématiques** (Côte & Plages, Montagnes & Cascades, Patrimoine)
- **Création de trajets tourisme** depuis les POI
- **Admin panel** pour la gestion des lieux et itinéraires

### 🌍 Internationalisation
- **Support FR/AR** avec RTL complet
- **Accessibilité WCAG AA** pour web et mobile
- **Notifications multi-canal** (email, SMS, push)

## 🏗️ Architecture

### Stack Technique
- **Frontend Web**: Next.js 14 + Tailwind CSS + Framer Motion
- **Frontend Mobile**: React Native + Expo + React Navigation
- **Backend**: NestJS + PostgreSQL + Prisma
- **Design System**: Composants réutilisables avec palette DZ
- **Cartographie**: Mapbox GL JS avec style personnalisé
- **Paiements**: Stripe avec système escrow (hold → capture)
- **Notifications**: SendGrid + Twilio + FCM/APNs
- **Stockage**: S3-compatible (MinIO/Backblaze)
- **Observabilité**: OpenTelemetry + Grafana + Prometheus

### Structure du Monorepo
```
safargo/
├── apps/
│   ├── api/          # API NestJS
│   ├── web/          # App Next.js
│   └── mobile/       # App React Native
├── packages/
│   ├── ui/           # Design System
│   └── shared/       # Utilitaires partagés
├── infra/            # Infrastructure & DevOps
└── docs/             # Documentation
```

## 🚀 Démarrage Rapide

### Prérequis
- Node.js 20+
- pnpm 8+
- Docker & Docker Compose
- PostgreSQL 15+

### Installation
```bash
# Cloner le repository
git clone https://github.com/your-org/safargo.git
cd safargo

# Installer les dépendances
pnpm install

# Copier les variables d'environnement
cp .env.example .env

# Démarrer les services
docker-compose up -d

# Générer le client Prisma
pnpm -C apps/api prisma:generate

# Exécuter les migrations
pnpm -C apps/api prisma:migrate

# Peupler la base de données
pnpm -C apps/api prisma:seed

# Démarrer en mode développement
pnpm dev
```

### URLs de Développement
- **Web App**: http://localhost:3000
- **API**: http://localhost:3001
- **API Docs**: http://localhost:3001/api/docs
- **Admin**: http://localhost:3000/admin

## 📱 Applications

### Web App (Next.js)
```bash
cd apps/web
pnpm dev
```

### Mobile App (React Native)
```bash
cd apps/mobile
pnpm start
```

### API (NestJS)
```bash
cd apps/api
pnpm dev
```

## 🎨 Design System

### Palette de Couleurs (Algérie)
- **Vert Principal**: `#006233` (couleur du drapeau algérien)
- **Rouge Secondaire**: `#D21034` (couleur du drapeau algérien)
- **Blanc**: `#FFFFFF`
- **Gris Foncé**: `#111827`
- **Gris Neutre**: `#6B7280`

### Composants
- **Cards Glass**: Effet glassmorphism avec backdrop-blur
- **TourismChip**: Badges colorés par catégorie de lieu
- **FlagIcon**: Icône animée du drapeau algérien
- **Button**: Variants primary, secondary, outline, glass

## 🗄️ Base de Données

### Entités Principales
- **User**: Utilisateurs avec rôles (USER, DRIVER, ADMIN)
- **Trip**: Trajets avec support tourisme (placeId, itineraryId)
- **Booking**: Réservations avec statuts (PENDING, HELD, CONFIRMED, etc.)
- **Payment**: Paiements avec escrow (INTENT, HOLD, CAPTURED, REFUNDED)
- **Place**: Lieux touristiques avec types et coordonnées
- **Itinerary**: Itinéraires avec étapes ordonnées

### Seed de Démo
- 24+ POI algériens (plages, cascades, montagnes, patrimoine)
- 3+ itinéraires thématiques
- 10+ trajets tourisme générés
- Comptes démo (driver/passenger/admin)

## 🔐 Sécurité

### Authentification
- **OTP par email/SMS** (sans mot de passe)
- **JWT avec rotation** automatique
- **Rate limiting** sur toutes les routes
- **Audit logs** pour toutes les actions

### Conformité
- **RGPD-like** avec consentement et DSR
- **OWASP ASVS L1** minimum
- **Chiffrage** en transit et au repos
- **CSP stricte** et headers de sécurité

## 📊 Observabilité

### Métriques
- **Latence p95** < 200ms (CRUD), < 500ms (recherche)
- **Taux d'erreur 5xx** < 1%
- **Lighthouse Score** ≥ 90 (web)
- **Taux de crash mobile** < 0.1%

### Dashboards
- **Produit**: DAU/WAU, activation, taux de remboursement
- **Tourisme**: exploration carte, filtres, conversion POI → booking
- **Technique**: latence, erreurs, paiements, crashes

## 🚀 Déploiement

### Environnements
- **Staging**: https://staging.safargo.com
- **Production**: https://app.safargo.com
- **Admin**: https://admin.safargo.com
- **API**: https://api.safargo.com

### CI/CD
- **GitHub Actions** avec tests automatisés
- **Déploiement automatique** staging/production
- **Builds mobiles** via EAS (Expo)
- **Snapshots visuels** avec Percy/Chromatic

## 📚 Documentation

### API
- **OpenAPI/Swagger**: https://api.safargo.com/docs
- **Postman Collection**: [docs/api/postman.json](docs/api/postman.json)
- **Tests E2E**: Coverage ≥ 85% des services critiques

### Guides
- [Guide de Développement](docs/development.md)
- [Guide de Déploiement](docs/deployment.md)
- [Guide de Sécurité](docs/security.md)
- [Runbook Opérationnel](docs/runbook.md)

## 🧪 Tests

### Tests d'Acceptation
- ✅ **Covoiturage**: Création → Réservation → Paiement → Avis
- ✅ **Recherche**: Multicritères avec carte synchronisée
- ✅ **Tourisme**: Carte DZ, filtres, POI → trajets
- ✅ **I18n/RTL**: FR/AR complets avec screenshots CI
- ✅ **Accessibilité**: axe-lints OK, contrastes AA
- ✅ **Sécurité**: SAST/DAST verts, 0 secret en clair
- ✅ **Performance**: p95 < 200/500ms, Lighthouse ≥ 90

## 👥 Équipe

- **CTO**: Orchestration et architecture
- **Backend**: API NestJS, base de données, paiements
- **Frontend Web**: Next.js, design system, cartographie
- **Mobile**: React Native, navigation, push notifications
- **DevOps**: CI/CD, infrastructure, observabilité
- **Sécurité**: Conformité, audit, tests de sécurité

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📞 Support

- **Email**: contact@safargo.com
- **Téléphone**: +213 555 123 456
- **Documentation**: https://docs.safargo.com
- **Issues**: https://github.com/your-org/safargo/issues

---

**Fait avec ❤️ en Algérie** 🇩🇿

*SafarGo - Découvrez l'Algérie en covoiturage*