# Guide de Déploiement SafarGo

## 🚀 Vue d'Ensemble

Ce guide couvre le déploiement de SafarGo en environnements de staging et production, incluant l'infrastructure, la configuration, et les procédures de déploiement.

## 🏗️ Architecture de Déploiement

### Environnements
- **Development**: Local avec Docker Compose
- **Staging**: https://staging.safargo.com
- **Production**: https://app.safargo.com

### Infrastructure
- **API**: Conteneurs Docker sur Render/Fly.io
- **Web**: Next.js SSR sur Vercel/Render
- **Database**: PostgreSQL managé (AWS RDS/Render)
- **Storage**: S3-compatible (Backblaze/MinIO)
- **CDN**: Cloudflare pour les assets statiques
- **Monitoring**: Grafana + Prometheus + Loki

## 🔧 Configuration des Environnements

### Variables d'Environnement

#### Staging
```bash
# Database
DATABASE_URL="postgresql://staging_user:staging_pass@staging-db:5432/safargo_staging"

# JWT
JWT_SECRET="staging-jwt-secret-key-64-chars-minimum"
JWT_EXPIRES_IN="7d"

# Storage
STORAGE_ENDPOINT="https://staging-storage.safargo.com"
STORAGE_BUCKET="safargo-staging-assets"
STORAGE_KEY="staging-access-key"
STORAGE_SECRET="staging-secret-key"
STORAGE_REGION="us-east-1"

# Payment (Sandbox)
PAYMENT_KEY="sk_test_staging_..."
PAYMENT_WEBHOOK_SECRET="whsec_staging_..."

# Maps
MAPBOX_TOKEN="pk.staging_token"

# Email (Staging)
EMAIL_API_KEY="SG.staging_sendgrid_key"
EMAIL_FROM="staging@safargo.com"

# SMS (Staging)
SMS_API_KEY="staging_twilio_sid"
SMS_SECRET="staging_twilio_token"
SMS_FROM="+1234567890"

# Monitoring
SENTRY_DSN="https://staging-sentry-dsn@sentry.io/project-id"

# URLs
NEXT_PUBLIC_API_URL="https://staging-api.safargo.com"
NEXT_PUBLIC_APP_URL="https://staging.safargo.com"
NEXT_PUBLIC_ADMIN_URL="https://staging.safargo.com/admin"

# Feature Flags
ENABLE_TOURISM_MODULE="true"
ENABLE_PAYMENTS="true"
ENABLE_SMS="false"
```

#### Production
```bash
# Database
DATABASE_URL="postgresql://prod_user:prod_pass@prod-db:5432/safargo_prod"

# JWT
JWT_SECRET="production-jwt-secret-key-64-chars-minimum"
JWT_EXPIRES_IN="7d"

# Storage
STORAGE_ENDPOINT="https://storage.safargo.com"
STORAGE_BUCKET="safargo-prod-assets"
STORAGE_KEY="prod-access-key"
STORAGE_SECRET="prod-secret-key"
STORAGE_REGION="us-east-1"

# Payment (Live)
PAYMENT_KEY="sk_live_prod_..."
PAYMENT_WEBHOOK_SECRET="whsec_prod_..."

# Maps
MAPBOX_TOKEN="pk.prod_token"

# Email (Production)
EMAIL_API_KEY="SG.prod_sendgrid_key"
EMAIL_FROM="noreply@safargo.com"

# SMS (Production)
SMS_API_KEY="prod_twilio_sid"
SMS_SECRET="prod_twilio_token"
SMS_FROM="+213555123456"

# Monitoring
SENTRY_DSN="https://prod-sentry-dsn@sentry.io/project-id"

# URLs
NEXT_PUBLIC_API_URL="https://api.safargo.com"
NEXT_PUBLIC_APP_URL="https://app.safargo.com"
NEXT_PUBLIC_ADMIN_URL="https://admin.safargo.com"

# Feature Flags
ENABLE_TOURISM_MODULE="true"
ENABLE_PAYMENTS="true"
ENABLE_SMS="true"
```

## 🐳 Déploiement avec Docker

### Build des Images
```bash
# Build API
docker build -t safargo-api:latest ./apps/api

# Build Web
docker build -t safargo-web:latest ./apps/web

# Build avec Docker Compose
docker-compose -f docker-compose.prod.yml build
```

### Déploiement Staging
```bash
# Déployer sur staging
docker-compose -f docker-compose.prod.yml up -d

# Vérifier les services
docker-compose -f docker-compose.prod.yml ps

# Voir les logs
docker-compose -f docker-compose.prod.yml logs -f api
```

### Déploiement Production
```bash
# Déployer sur production
docker-compose -f docker-compose.prod.yml up -d

# Vérifier la santé des services
curl -f https://api.safargo.com/health || exit 1

# Vérifier les métriques
curl -f https://api.safargo.com/metrics || exit 1
```

## ☁️ Déploiement Cloud

### Render (Recommandé)

#### API
```yaml
# render.yaml
services:
  - type: web
    name: safargo-api
    env: node
    plan: starter
    buildCommand: cd apps/api && pnpm install && pnpm build
    startCommand: cd apps/api && pnpm start:prod
    envVars:
      - key: NODE_ENV
        value: production
      - key: DATABASE_URL
        fromDatabase:
          name: safargo-db
          property: connectionString
      - key: JWT_SECRET
        generateValue: true
      - key: STORAGE_ENDPOINT
        value: https://storage.safargo.com
      - key: PAYMENT_KEY
        sync: false
```

#### Web
```yaml
  - type: web
    name: safargo-web
    env: static
    buildCommand: cd apps/web && pnpm install && pnpm build
    staticPublishPath: ./apps/web/out
    envVars:
      - key: NEXT_PUBLIC_API_URL
        value: https://api.safargo.com
      - key: MAPBOX_TOKEN
        sync: false
```

#### Database
```yaml
databases:
  - name: safargo-db
    plan: starter
    databaseName: safargo
    user: safargo_user
```

### Vercel (Alternative)

#### Configuration
```json
// vercel.json
{
  "version": 2,
  "builds": [
    {
      "src": "apps/web/package.json",
      "use": "@vercel/next"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "https://api.safargo.com/api/$1"
    }
  ],
  "env": {
    "NEXT_PUBLIC_API_URL": "https://api.safargo.com",
    "MAPBOX_TOKEN": "@mapbox-token"
  }
}
```

## 📱 Déploiement Mobile

### EAS Build (Expo)

#### Configuration
```json
// eas.json
{
  "cli": {
    "version": ">= 5.9.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal",
      "android": {
        "buildType": "apk"
      }
    },
    "production": {
      "android": {
        "buildType": "aab"
      }
    }
  },
  "submit": {
    "production": {
      "android": {
        "serviceAccountKeyPath": "./android-service-account.json",
        "track": "production"
      },
      "ios": {
        "appleId": "your-apple-id@example.com",
        "ascAppId": "1234567890",
        "appleTeamId": "ABCD123456"
      }
    }
  }
}
```

#### Build et Déploiement
```bash
# Build Android
eas build --platform android --profile production

# Build iOS
eas build --platform ios --profile production

# Submit to stores
eas submit --platform android --profile production
eas submit --platform ios --profile production

# OTA Updates
eas update --branch production --message "Bug fixes and improvements"
```

## 🔄 CI/CD Pipeline

### GitHub Actions

#### Workflow de Déploiement
```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    environment: production
    
    steps:
      - name: Checkout
        uses: actions/checkout@v4
        
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          
      - name: Setup pnpm
        uses: pnpm/action-setup@v2
        
      - name: Install dependencies
        run: pnpm install --frozen-lockfile
        
      - name: Run tests
        run: pnpm test
        
      - name: Build
        run: pnpm build
        
      - name: Deploy to Render
        uses: johnbeynon/render-deploy-action@v0.0.8
        with:
          service-id: ${{ secrets.RENDER_SERVICE_ID }}
          api-key: ${{ secrets.RENDER_API_KEY }}
          
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          working-directory: ./apps/web
```

### Secrets GitHub
```bash
# Render
RENDER_API_KEY="your-render-api-key"
RENDER_SERVICE_ID="your-service-id"

# Vercel
VERCEL_TOKEN="your-vercel-token"
VERCEL_ORG_ID="your-org-id"
VERCEL_PROJECT_ID="your-project-id"

# Database
DATABASE_URL="postgresql://user:pass@host:5432/db"

# External Services
STRIPE_SECRET_KEY="sk_live_..."
SENDGRID_API_KEY="SG.your-key"
TWILIO_ACCOUNT_SID="your-sid"
TWILIO_AUTH_TOKEN="your-token"
MAPBOX_TOKEN="pk.your-token"
SENTRY_DSN="https://your-dsn@sentry.io/project-id"
```

## 📊 Monitoring et Observabilité

### Configuration Prometheus
```yaml
# prometheus.yml
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: 'safargo-api'
    static_configs:
      - targets: ['api:3001']
    metrics_path: '/metrics'
    
  - job_name: 'safargo-web'
    static_configs:
      - targets: ['web:3000']
    metrics_path: '/api/metrics'
    
  - job_name: 'postgres'
    static_configs:
      - targets: ['postgres:5432']
      
  - job_name: 'redis'
    static_configs:
      - targets: ['redis:6379']
```

### Dashboards Grafana
```json
{
  "dashboard": {
    "title": "SafarGo - Production",
    "panels": [
      {
        "title": "Request Rate",
        "type": "graph",
        "targets": [
          {
            "expr": "rate(http_requests_total[5m])"
          }
        ]
      },
      {
        "title": "Response Time",
        "type": "graph",
        "targets": [
          {
            "expr": "histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m]))"
          }
        ]
      },
      {
        "title": "Error Rate",
        "type": "stat",
        "targets": [
          {
            "expr": "rate(http_requests_total{status=~\"5..\"}[5m]) / rate(http_requests_total[5m])"
          }
        ]
      }
    ]
  }
}
```

### Alertes
```yaml
# alerts.yml
groups:
  - name: safargo
    rules:
      - alert: HighErrorRate
        expr: rate(http_requests_total{status=~"5.."}[5m]) / rate(http_requests_total[5m]) > 0.01
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: "High error rate detected"
          
      - alert: HighLatency
        expr: histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m])) > 0.2
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "High latency detected"
          
      - alert: DatabaseDown
        expr: up{job="postgres"} == 0
        for: 1m
        labels:
          severity: critical
        annotations:
          summary: "Database is down"
```

## 🔒 Sécurité

### SSL/TLS
```nginx
# nginx.conf
server {
    listen 443 ssl http2;
    server_name app.safargo.com;
    
    ssl_certificate /etc/nginx/ssl/cert.pem;
    ssl_certificate_key /etc/nginx/ssl/key.pem;
    
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512;
    ssl_prefer_server_ciphers off;
    
    # Security headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options DENY always;
    add_header X-Content-Type-Options nosniff always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    
    location / {
        proxy_pass http://web:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### Firewall
```bash
# UFW Configuration
ufw default deny incoming
ufw default allow outgoing
ufw allow ssh
ufw allow 80/tcp
ufw allow 443/tcp
ufw enable
```

## 📋 Checklist de Déploiement

### Pré-déploiement
- [ ] Tests passent (unit, integration, e2e)
- [ ] Code review approuvé
- [ ] Variables d'environnement configurées
- [ ] Base de données migrée
- [ ] Secrets mis à jour
- [ ] Monitoring configuré

### Déploiement
- [ ] Build des images Docker
- [ ] Déploiement des services
- [ ] Vérification de la santé des services
- [ ] Tests de smoke
- [ ] Vérification des métriques
- [ ] Notification de l'équipe

### Post-déploiement
- [ ] Monitoring des alertes
- [ ] Vérification des logs
- [ ] Tests fonctionnels
- [ ] Performance check
- [ ] Documentation mise à jour

## 🚨 Procédures d'Urgence

### Rollback
```bash
# Rollback API
docker-compose -f docker-compose.prod.yml down
docker-compose -f docker-compose.prod.yml up -d --scale api=0
docker-compose -f docker-compose.prod.yml up -d api:previous-version

# Rollback Web
vercel rollback

# Rollback Database
psql -h prod-db -U postgres -d safargo -f backup.sql
```

### Incident Response
1. **Détection**: Alertes automatiques
2. **Évaluation**: Impact et gravité
3. **Communication**: Notification équipe
4. **Résolution**: Fix ou rollback
5. **Post-mortem**: Analyse et amélioration

## 📞 Support

### Contacts
- **DevOps**: devops@safargo.com
- **On-call**: +213 555 123 456
- **Slack**: #safargo-alerts

### Ressources
- [Runbook Opérationnel](runbook.md)
- [Guide de Sécurité](security.md)
- [Documentation API](api.md)

---

Pour plus d'informations, consultez la [documentation complète](README.md) ou contactez l'équipe DevOps.