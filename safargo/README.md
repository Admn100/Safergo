# SafarGo 🇩🇿

**Plateforme de covoiturage avec module tourisme Algérie**

SafarGo est une application complète de covoiturage inspirée de BlaBlaCar, enrichie d'un module tourisme dédié à l'Algérie. L'application propose une expérience premium avec une identité visuelle aux couleurs du drapeau algérien.

## 🌟 Fonctionnalités

### Covoiturage Core
- 🚗 Recherche et publication de trajets
- 💳 Paiement sécurisé (hold → capture après trajet)
- 💬 Messagerie in-app anti-fraude
- 👤 Profils utilisateurs et KYC conducteurs
- ⭐ Système d'avis et notations
- 🔧 Gestion des litiges et remboursements

### Module Tourisme Algérie
- 🗺️ Carte interactive de l'Algérie avec POI
- 🏖️ Points d'intérêt : plages, cascades, montagnes, désert, patrimoine
- 🛤️ Itinéraires thématiques prédéfinis
- 📍 Création de trajets depuis les lieux touristiques
- 🏛️ Back-office admin pour gestion des POI

### Fonctionnalités Techniques
- 🌍 Internationalisation FR/AR avec support RTL complet
- ♿ Accessibilité WCAG AA
- 📱 Applications mobile (iOS/Android) et web responsive
- 🔒 Sécurité OWASP ASVS Level 1
- 📊 Observabilité et monitoring complets

## 🏗️ Architecture

### Monorepo Structure
```
safargo/
├── apps/
│   ├── api/          # Backend NestJS + PostgreSQL
│   ├── web/          # Frontend Next.js
│   └── mobile/       # React Native + Expo
├── packages/
│   ├── ui/           # Design System partagé
│   └── shared/       # Types et utilitaires
├── infra/            # Infrastructure as Code
└── docs/             # Documentation
```

### Stack Technologique
- **Backend**: NestJS, PostgreSQL, Prisma, Zod, OpenAPI
- **Web**: Next.js (App Router), Tailwind CSS, i18next, Mapbox
- **Mobile**: React Native, Expo, React Navigation
- **Paiement**: Stripe (sandbox) avec escrow
- **Auth**: JWT + OTP email/SMS
- **Infra**: Docker, GitHub Actions, Terraform

## 🎨 Design System

### Palette Couleurs (Drapeau Algérien)
- **Vert**: `#006233` - CTAs et accents principaux
- **Rouge**: `#D21034` - Alertes et badges importants  
- **Blanc**: `#FFFFFF` - Arrière-plans clairs
- **Gris foncé**: `#111827` - Textes principaux
- **Gris neutre**: `#6B7280` - Textes secondaires

### Typographie
- **Latin**: Inter (web) / SF Pro (mobile)
- **Arabe**: Cairo ou IBM Plex Arabic

### Composants Signature
- Cards glass-light avec backdrop-blur
- Cocarde animée (Lottie) dans le header
- Micro-interactions Framer Motion
- Chips de filtres cartographiques

## 🚀 Démarrage Rapide

### Prérequis
- Node.js ≥ 20.0.0
- pnpm ≥ 8.0.0
- Docker & Docker Compose
- PostgreSQL (local ou conteneur)

### Installation
```bash
# Cloner le repo
git clone https://github.com/safargo/safargo.git
cd safargo

# Installer les dépendances
pnpm install

# Configurer les variables d'environnement
cp .env.example .env.local
# Éditer .env.local avec vos clés

# Démarrer la base de données
docker compose up -d postgres

# Migrations et seed
pnpm db:migrate
pnpm db:seed

# Démarrer tous les services en dev
pnpm dev
```

### URLs de Développement
- **Web App**: http://localhost:3000
- **API**: http://localhost:3001
- **API Docs**: http://localhost:3001/docs
- **Admin**: http://localhost:3000/admin
- **Storybook**: http://localhost:6006

## 📱 Applications

### Web (Next.js)
- **Production**: https://app.safargo.com
- **Staging**: https://staging.safargo.com
- **Admin**: https://admin.safargo.com

### Mobile (React Native/Expo)
- **iOS**: [TestFlight Link]
- **Android**: [Play Console Internal Testing]

## 🧪 Tests & Qualité

### Tests d'Acceptation Clés
- [x] Flux covoiturage complet (publication → réservation → paiement → avis)
- [x] Recherche multicritères avec carte synchronisée
- [x] Module tourisme (POI → création trajet → réservation)
- [x] Internationalisation FR/AR avec RTL
- [x] Accessibilité WCAG AA
- [x] Performance (p95 < 200ms API, Lighthouse ≥ 90)

### Commandes de Test
```bash
# Tests unitaires et e2e
pnpm test

# Tests de sécurité
pnpm security:scan

# Tests d'accessibilité
pnpm a11y:test

# Tests de performance
pnpm perf:test
```

## 🔐 Sécurité & Conformité

- **OWASP ASVS Level 1** - Tests automatisés SAST/DAST
- **RGPD-like** - Consent center, DSR, rétention données
- **Chiffrement** - TLS 1.3, secrets chiffrés au repos
- **Rate Limiting** - Protection anti-brute force
- **Audit Logs** - Traçabilité complète des actions

## 📊 Monitoring & Observabilité

### Métriques Produit
- DAU/WAU, taux d'activation
- Conversion place touristique → réservation
- NPS et satisfaction utilisateur

### Métriques Techniques
- Latence p95 < 200ms (CRUD), < 500ms (recherche géo)
- Taux d'erreur 5xx < 0.1%
- Uptime > 99.9%

### Dashboards
- **Grafana**: https://monitoring.safargo.com
- **Sentry**: Erreurs et performance
- **Alerts**: PagerDuty/Slack

## 🌍 Internationalisation

### Langues Supportées
- **Français** (fr) - Langue principale
- **Arabe** (ar) - Support RTL complet

### Localisation
- Interface utilisateur complète
- Emails et notifications
- Contenu touristique (POI, itinéraires)
- Conditions d'utilisation et politique de confidentialité

## 📈 Roadmap

### Phase 1 - MVP (Actuel)
- [x] Covoiturage de base
- [x] Module tourisme Algérie
- [x] Apps web et mobile
- [x] Paiement escrow

### Phase 2 - Croissance
- [ ] Assurance trajets
- [ ] Programme de parrainage
- [ ] Système de coupons
- [ ] Intégration réseaux sociaux

### Phase 3 - Expansion
- [ ] Extension autres pays Maghreb
- [ ] API partenaires B2B
- [ ] Covoiturage professionnel
- [ ] Marketplace services voyage

## 🤝 Contribution

Voir [CONTRIBUTING.md](./CONTRIBUTING.md) pour les guidelines de contribution.

## 📄 License

Copyright © 2025 SafarGo. Tous droits réservés.

---

**Made with ❤️ in Algeria 🇩🇿**