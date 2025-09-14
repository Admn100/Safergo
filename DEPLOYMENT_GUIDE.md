# SafarGo - Guide de Déploiement Production

## 🚀 Déploiement Production SafarGo

Ce guide vous accompagne dans le déploiement de SafarGo en production avec toutes les bonnes pratiques de sécurité et de performance.

---

## 📋 **Prérequis**

### **Infrastructure**
- **Serveur** : Ubuntu 20.04+ ou équivalent
- **RAM** : 8GB minimum (16GB recommandé)
- **CPU** : 4 cœurs minimum
- **Stockage** : 100GB SSD minimum
- **Réseau** : IP publique avec domaine

### **Services Externes**
- **Base de données** : PostgreSQL 15+ (AWS RDS recommandé)
- **Cache** : Redis 7+ (AWS ElastiCache recommandé)
- **Stockage** : S3-compatible (AWS S3, Backblaze, MinIO)
- **CDN** : CloudFlare ou AWS CloudFront
- **Monitoring** : Grafana + Prometheus + Sentry

---

## 🔧 **Configuration des Services**

### **1. Base de Données PostgreSQL**

```bash
# Créer la base de données
CREATE DATABASE safargo_prod;
CREATE USER safargo_user WITH PASSWORD 'secure_password';
GRANT ALL PRIVILEGES ON DATABASE safargo_prod TO safargo_user;

# Configuration recommandée
ALTER SYSTEM SET shared_preload_libraries = 'pg_stat_statements';
ALTER SYSTEM SET max_connections = 200;
ALTER SYSTEM SET shared_buffers = '256MB';
ALTER SYSTEM SET effective_cache_size = '1GB';
```

### **2. Redis Cache**

```bash
# Configuration Redis
maxmemory 512mb
maxmemory-policy allkeys-lru
save 900 1
save 300 10
save 60 10000
```

### **3. Stockage S3**

```bash
# Créer les buckets
aws s3 mb s3://safargo-uploads-prod
aws s3 mb s3://safargo-backups-prod

# Configuration CORS
aws s3api put-bucket-cors --bucket safargo-uploads-prod --cors-configuration file://cors.json
```

---

## 🔐 **Variables d'Environnement Production**

```env
# Base de données
DATABASE_URL="postgresql://safargo_user:secure_password@db.safargo.com:5432/safargo_prod?schema=public&sslmode=require"

# JWT
JWT_SECRET="your-super-secure-jwt-secret-256-bits-minimum"
JWT_EXPIRES_IN="7d"

# Redis
REDIS_URL="redis://redis.safargo.com:6379"

# Stockage S3
STORAGE_ENDPOINT="https://s3.amazonaws.com"
STORAGE_BUCKET="safargo-uploads-prod"
STORAGE_ACCESS_KEY="AKIA..."
STORAGE_SECRET_KEY="..."
STORAGE_REGION="us-east-1"

# Paiements Stripe
STRIPE_SECRET_KEY="sk_live_..."
STRIPE_PUBLISHABLE_KEY="pk_live_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Email SendGrid
SENDGRID_API_KEY="SG..."
SENDGRID_FROM_EMAIL="noreply@safargo.com"

# SMS Twilio
TWILIO_ACCOUNT_SID="AC..."
TWILIO_AUTH_TOKEN="..."
TWILIO_PHONE_NUMBER="+1234567890"

# Cartes Mapbox
MAPBOX_ACCESS_TOKEN="pk..."

# Push Notifications
FCM_SERVER_KEY="AAAA..."
APNS_KEY_ID="..."
APNS_TEAM_ID="..."
APNS_BUNDLE_ID="com.safargo.app"

# Monitoring
SENTRY_DSN="https://..."
GRAFANA_URL="https://monitoring.safargo.com"
PROMETHEUS_URL="https://prometheus.safargo.com"

# URLs Production
FRONTEND_URL="https://app.safargo.com"
API_URL="https://api.safargo.com"
ADMIN_URL="https://admin.safargo.com"

# Sécurité
NODE_ENV="production"
PORT="3001"
RATE_LIMIT_TTL="60"
RATE_LIMIT_LIMIT="100"

# SSL/TLS
SSL_CERT_PATH="/etc/ssl/certs/safargo.com.crt"
SSL_KEY_PATH="/etc/ssl/private/safargo.com.key"
```

---

## 🐳 **Déploiement avec Docker**

### **1. Docker Compose Production**

```yaml
version: '3.8'

services:
  api:
    image: safargo/api:latest
    container_name: safargo-api-prod
    environment:
      - NODE_ENV=production
      - DATABASE_URL=${DATABASE_URL}
      - REDIS_URL=${REDIS_URL}
      - JWT_SECRET=${JWT_SECRET}
    ports:
      - "3001:3001"
    volumes:
      - /var/log/safargo:/app/logs
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3001/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  web:
    image: safargo/web:latest
    container_name: safargo-web-prod
    environment:
      - NODE_ENV=production
      - NEXT_PUBLIC_API_URL=https://api.safargo.com
    ports:
      - "3000:3000"
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/api/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  nginx:
    image: nginx:alpine
    container_name: safargo-nginx-prod
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - /etc/ssl/certs:/etc/ssl/certs
      - /etc/ssl/private:/etc/ssl/private
    depends_on:
      - api
      - web
    restart: unless-stopped
```

### **2. Configuration Nginx**

```nginx
events {
    worker_connections 1024;
}

http {
    upstream api {
        server api:3001;
    }
    
    upstream web {
        server web:3000;
    }
    
    # Rate limiting
    limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
    limit_req_zone $binary_remote_addr zone=web:10m rate=30r/s;
    
    # Security headers
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains";
    
    server {
        listen 80;
        server_name app.safargo.com api.safargo.com admin.safargo.com;
        return 301 https://$server_name$request_uri;
    }
    
    server {
        listen 443 ssl http2;
        server_name app.safargo.com;
        
        ssl_certificate /etc/ssl/certs/safargo.com.crt;
        ssl_certificate_key /etc/ssl/private/safargo.com.key;
        
        ssl_protocols TLSv1.2 TLSv1.3;
        ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512;
        ssl_prefer_server_ciphers off;
        
        limit_req zone=web burst=20 nodelay;
        
        location / {
            proxy_pass http://web;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }
    }
    
    server {
        listen 443 ssl http2;
        server_name api.safargo.com;
        
        ssl_certificate /etc/ssl/certs/safargo.com.crt;
        ssl_certificate_key /etc/ssl/private/safargo.com.key;
        
        limit_req zone=api burst=10 nodelay;
        
        location / {
            proxy_pass http://api;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }
    }
}
```

---

## 🚀 **Script de Déploiement**

```bash
#!/bin/bash
# deploy.sh - Script de déploiement production

set -e

echo "🚀 Déploiement SafarGo Production"
echo "================================="

# Variables
ENVIRONMENT="production"
VERSION="1.0.0"
REGISTRY="your-registry.com/safargo"

# 1. Build des images
echo "📦 Construction des images Docker..."
docker build -t $REGISTRY/api:$VERSION -f apps/api/Dockerfile .
docker build -t $REGISTRY/web:$VERSION -f apps/web/Dockerfile .

# 2. Push vers le registry
echo "⬆️ Push des images..."
docker push $REGISTRY/api:$VERSION
docker push $REGISTRY/web:$VERSION

# 3. Déploiement
echo "🚀 Déploiement..."
docker-compose -f docker-compose.prod.yml down
docker-compose -f docker-compose.prod.yml up -d

# 4. Migrations
echo "🗄️ Exécution des migrations..."
docker exec safargo-api-prod pnpm prisma:migrate

# 5. Vérification
echo "✅ Vérification du déploiement..."
sleep 30
curl -f https://api.safargo.com/health || exit 1
curl -f https://app.safargo.com || exit 1

echo "🎉 Déploiement réussi !"
echo "🌐 Web: https://app.safargo.com"
echo "📱 API: https://api.safargo.com"
echo "👑 Admin: https://admin.safargo.com"
```

---

## 📊 **Monitoring & Alertes**

### **1. Métriques Clés**

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
```

### **2. Alertes Grafana**

```yaml
# alerts.yml
groups:
  - name: safargo
    rules:
      - alert: HighErrorRate
        expr: rate(http_requests_total{status=~"5.."}[5m]) > 0.1
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: "High error rate detected"
          
      - alert: HighLatency
        expr: histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m])) > 0.5
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "High latency detected"
```

---

## 🔒 **Sécurité Production**

### **1. Firewall**

```bash
# UFW Configuration
ufw default deny incoming
ufw default allow outgoing
ufw allow ssh
ufw allow 80/tcp
ufw allow 443/tcp
ufw enable
```

### **2. Fail2Ban**

```ini
# /etc/fail2ban/jail.local
[DEFAULT]
bantime = 3600
findtime = 600
maxretry = 5

[nginx-http-auth]
enabled = true
port = http,https
logpath = /var/log/nginx/error.log

[nginx-limit-req]
enabled = true
port = http,https
logpath = /var/log/nginx/error.log
maxretry = 10
```

### **3. SSL/TLS**

```bash
# Let's Encrypt avec Certbot
certbot --nginx -d app.safargo.com -d api.safargo.com -d admin.safargo.com
```

---

## 📱 **Déploiement Mobile**

### **1. iOS (App Store)**

```bash
# Build iOS
cd apps/mobile
eas build --platform ios --profile production

# Submit to App Store
eas submit --platform ios --profile production
```

### **2. Android (Play Store)**

```bash
# Build Android
cd apps/mobile
eas build --platform android --profile production

# Submit to Play Store
eas submit --platform android --profile production
```

---

## 🔄 **Backup & Recovery**

### **1. Backup Base de Données**

```bash
#!/bin/bash
# backup-db.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="safargo_backup_$DATE.sql"

# Backup PostgreSQL
pg_dump $DATABASE_URL > $BACKUP_FILE

# Upload vers S3
aws s3 cp $BACKUP_FILE s3://safargo-backups-prod/database/

# Nettoyage local
rm $BACKUP_FILE

echo "✅ Backup terminé: $BACKUP_FILE"
```

### **2. Restore Base de Données**

```bash
#!/bin/bash
# restore-db.sh

BACKUP_FILE=$1

if [ -z "$BACKUP_FILE" ]; then
    echo "Usage: $0 <backup_file>"
    exit 1
fi

# Download depuis S3
aws s3 cp s3://safargo-backups-prod/database/$BACKUP_FILE .

# Restore
psql $DATABASE_URL < $BACKUP_FILE

echo "✅ Restore terminé: $BACKUP_FILE"
```

---

## 🚨 **Procédures d'Urgence**

### **1. Rollback**

```bash
#!/bin/bash
# rollback.sh

PREVIOUS_VERSION=$1

if [ -z "$PREVIOUS_VERSION" ]; then
    echo "Usage: $0 <previous_version>"
    exit 1
fi

echo "🔄 Rollback vers la version $PREVIOUS_VERSION..."

# Stop services
docker-compose -f docker-compose.prod.yml down

# Update images
docker-compose -f docker-compose.prod.yml pull

# Start with previous version
docker-compose -f docker-compose.prod.yml up -d

echo "✅ Rollback terminé"
```

### **2. Maintenance Mode**

```bash
#!/bin/bash
# maintenance.sh

MODE=$1

if [ "$MODE" = "on" ]; then
    echo "🔧 Activation du mode maintenance..."
    docker exec safargo-nginx-prod nginx -s reload
    echo "✅ Mode maintenance activé"
elif [ "$MODE" = "off" ]; then
    echo "🚀 Désactivation du mode maintenance..."
    docker exec safargo-nginx-prod nginx -s reload
    echo "✅ Mode maintenance désactivé"
else
    echo "Usage: $0 [on|off]"
fi
```

---

## 📋 **Checklist de Déploiement**

### **Pré-déploiement**
- [ ] Tests d'acceptation passés
- [ ] Variables d'environnement configurées
- [ ] Certificats SSL valides
- [ ] Base de données migrée
- [ ] Services externes configurés
- [ ] Monitoring activé

### **Déploiement**
- [ ] Images Docker construites
- [ ] Services déployés
- [ ] Health checks passés
- [ ] SSL/TLS configuré
- [ ] Firewall configuré
- [ ] Backup configuré

### **Post-déploiement**
- [ ] Tests de régression
- [ ] Monitoring vérifié
- [ ] Alertes configurées
- [ ] Documentation mise à jour
- [ ] Équipe notifiée

---

## 🎯 **URLs de Production**

- **Web App** : https://app.safargo.com
- **API** : https://api.safargo.com
- **Admin** : https://admin.safargo.com
- **API Docs** : https://api.safargo.com/docs
- **Monitoring** : https://monitoring.safargo.com

---

## 📞 **Support Production**

- **On-call** : +213 XXX XXX XXX
- **Email** : ops@safargo.com
- **Slack** : #safargo-ops
- **PagerDuty** : SafarGo Production

---

**🇩🇿 SafarGo - Made in Algeria with ❤️**