# SafarGo - Diagramme de Conteneurs C4

## Architecture des Conteneurs

```mermaid
C4Container
    title Diagramme de Conteneurs - SafarGo

    Person(passenger, "Passager")
    Person(driver, "Conducteur")
    Person(admin, "Administrateur")
    
    Container_Boundary(safargo, "SafarGo") {
        Container(web, "Application Web", "Next.js, React", "Interface web responsive")
        Container(mobile, "Application Mobile", "React Native, Expo", "Apps iOS/Android")
        Container(admin_ui, "Admin Dashboard", "Next.js, React", "Back-office")
        
        Container(api, "API REST", "NestJS, Node.js", "Logique métier et endpoints")
        Container(db, "Base de données", "PostgreSQL", "Stockage des données")
        Container(cache, "Cache", "Redis", "Sessions et cache")
        Container(queue, "File de messages", "Bull/Redis", "Tâches asynchrones")
    }
    
    System_Ext(payment, "Stripe/Adyen")
    System_Ext(email, "SendGrid")
    System_Ext(sms, "Twilio")
    System_Ext(maps, "Mapbox")
    System_Ext(storage, "S3/MinIO")
    
    Rel(passenger, web, "Utilise", "HTTPS")
    Rel(passenger, mobile, "Utilise", "HTTPS")
    Rel(driver, web, "Utilise", "HTTPS")
    Rel(driver, mobile, "Utilise", "HTTPS")
    Rel(admin, admin_ui, "Utilise", "HTTPS")
    
    Rel(web, api, "API calls", "HTTPS/JSON")
    Rel(mobile, api, "API calls", "HTTPS/JSON")
    Rel(admin_ui, api, "API calls", "HTTPS/JSON")
    
    Rel(api, db, "Lecture/Écriture", "SQL")
    Rel(api, cache, "Cache", "Redis Protocol")
    Rel(api, queue, "Enqueue jobs", "Redis Protocol")
    
    Rel(api, payment, "Process payments", "HTTPS")
    Rel(api, email, "Send emails", "HTTPS")
    Rel(api, sms, "Send SMS", "HTTPS")
    Rel(api, maps, "Geocoding", "HTTPS")
    Rel(api, storage, "Store files", "S3 API")
```

## Description des Conteneurs

### Frontend

#### Application Web (Next.js)
- **Technologies**: Next.js 14, React 18, TypeScript, Tailwind CSS
- **Responsabilités**:
  - Interface utilisateur responsive
  - SSR pour le SEO
  - i18n FR/AR avec RTL
  - PWA capabilities

#### Application Mobile (React Native)
- **Technologies**: React Native, Expo, TypeScript
- **Responsabilités**:
  - Apps natives iOS/Android
  - Deep linking
  - Push notifications
  - Offline capabilities

#### Admin Dashboard (Next.js)
- **Technologies**: Next.js, React, TypeScript, Charts
- **Responsabilités**:
  - Gestion des utilisateurs
  - Modération du contenu
  - Import/export POI
  - Analytics et rapports

### Backend

#### API REST (NestJS)
- **Technologies**: NestJS, TypeScript, Prisma ORM
- **Responsabilités**:
  - Logique métier
  - Authentification JWT
  - Validation des données
  - Intégrations externes

#### Base de données (PostgreSQL)
- **Version**: PostgreSQL 15+
- **Caractéristiques**:
  - PostGIS pour les données géospatiales
  - Indexes optimisés
  - Réplication pour la haute disponibilité
  - Backups automatiques

#### Cache (Redis)
- **Usage**:
  - Sessions utilisateurs
  - Cache des requêtes fréquentes
  - Rate limiting
  - Real-time features

#### Queue (Bull/Redis)
- **Jobs asynchrones**:
  - Envoi d'emails/SMS
  - Traitement des paiements
  - Génération de rapports
  - Nettoyage des données