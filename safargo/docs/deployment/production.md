# Guide de Déploiement Production - SafarGo

## Architecture de Production

### Infrastructure Cloud (AWS/GCP/Azure)

```
┌─────────────────────────────────────────────────────────────┐
│                        CDN (CloudFront)                      │
├─────────────────────────┬───────────────────────────────────┤
│                         │                                     │
│   ┌─────────────┐      │      ┌─────────────────────┐      │
│   │  Web App    │      │      │    Assets (S3)      │      │
│   │  (Vercel)   │      │      │  Images/Uploads     │      │
│   └─────────────┘      │      └─────────────────────┘      │
│                         │                                     │
├─────────────────────────┴───────────────────────────────────┤
│                    Load Balancer (ALB)                       │
├─────────────────────────┬───────────────────────────────────┤
│                         │                                     │
│   ┌─────────────┐      │      ┌─────────────────────┐      │
│   │   API (1)   │      │      │      API (2)        │      │
│   │   ECS/K8s   │      │      │     ECS/K8s         │      │
│   └─────────────┘      │      └─────────────────────┘      │
│                         │                                     │
├─────────────────────────┴───────────────────────────────────┤
│   ┌─────────────┐   ┌─────────┐   ┌──────────────────┐    │
│   │ PostgreSQL  │   │  Redis  │   │   ElasticSearch  │    │
│   │   (RDS)     │   │(ElastiC)│   │    (OpenSearch)  │    │
│   └─────────────┘   └─────────┘   └──────────────────┘    │
└─────────────────────────────────────────────────────────────┘
```

## Prérequis

- Compte cloud (AWS/GCP/Azure)
- Domaine configuré
- Certificats SSL
- Secrets configurés
- Terraform installé (optionnel)

## Étapes de Déploiement

### 1. Infrastructure de Base

#### PostgreSQL (RDS)
```bash
# Configuration recommandée
- Instance: db.t3.medium (prod) / db.r6g.large (haute charge)
- Storage: 100GB SSD (gp3)
- Multi-AZ: Activé
- Backups: 7 jours de rétention
- Encryption: Activée
```

#### Redis (ElastiCache)
```bash
# Configuration recommandée
- Node type: cache.t3.micro (prod) / cache.r6g.large (haute charge)
- Cluster mode: Activé (3 shards)
- Replicas: 1 par shard
- Backup: Quotidien
```

#### S3 Buckets
```bash
# Buckets nécessaires
- safargo-uploads (photos profil, KYC)
- safargo-places (images touristiques)
- safargo-backups (backups DB)
- safargo-logs (logs applicatifs)
```

### 2. Déploiement de l'API

#### Build Docker
```bash
# Build de l'image
docker build -f apps/api/Dockerfile -t safargo-api:latest .

# Tag pour le registry
docker tag safargo-api:latest your-registry/safargo-api:latest

# Push vers le registry
docker push your-registry/safargo-api:latest
```

#### Configuration ECS/K8s

**ECS Task Definition**:
```json
{
  "family": "safargo-api",
  "taskRoleArn": "arn:aws:iam::ACCOUNT:role/safargo-api-task",
  "executionRoleArn": "arn:aws:iam::ACCOUNT:role/safargo-api-execution",
  "networkMode": "awsvpc",
  "cpu": "512",
  "memory": "1024",
  "containerDefinitions": [{
    "name": "api",
    "image": "your-registry/safargo-api:latest",
    "portMappings": [{
      "containerPort": 3000,
      "protocol": "tcp"
    }],
    "environment": [
      {"name": "NODE_ENV", "value": "production"},
      {"name": "PORT", "value": "3000"}
    ],
    "secrets": [
      {"name": "DATABASE_URL", "valueFrom": "arn:aws:secretsmanager:region:account:secret:safargo/db"},
      {"name": "JWT_SECRET", "valueFrom": "arn:aws:secretsmanager:region:account:secret:safargo/jwt"}
    ],
    "healthCheck": {
      "command": ["CMD-SHELL", "curl -f http://localhost:3000/api/v1/health || exit 1"],
      "interval": 30,
      "timeout": 5,
      "retries": 3
    }
  }]
}
```

### 3. Déploiement Web

#### Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
cd apps/web
vercel --prod

# Variables d'environnement à configurer
NEXT_PUBLIC_API_URL=https://api.safargo.com/api/v1
NEXT_PUBLIC_MAPBOX_TOKEN=your-mapbox-token
```

#### Configuration CDN
- Cache statique: 1 an
- Cache API: Désactivé
- Compression: Brotli/Gzip
- HTTP/2: Activé

### 4. Monitoring et Alertes

#### CloudWatch/Datadog Config
```yaml
alerts:
  - name: API High Latency
    metric: api.latency.p95
    threshold: 500ms
    duration: 5m
    
  - name: API Error Rate
    metric: api.errors.5xx
    threshold: 1%
    duration: 5m
    
  - name: Database Connection Pool
    metric: db.connections.active
    threshold: 80%
    duration: 10m
    
  - name: Payment Failures
    metric: payments.failed
    threshold: 5%
    duration: 15m
```

### 5. Sécurité

#### WAF Rules
```json
{
  "rules": [
    {
      "name": "RateLimitRule",
      "action": "BLOCK",
      "rateLimit": 100,
      "period": "MINUTE"
    },
    {
      "name": "SQLiProtection",
      "managedRule": "AWSManagedRulesSQLiRuleSet"
    },
    {
      "name": "XSSProtection",
      "managedRule": "AWSManagedRulesKnownBadInputsRuleSet"
    }
  ]
}
```

#### Secrets Management
```bash
# AWS Secrets Manager
aws secretsmanager create-secret \
  --name safargo/production \
  --secret-string file://secrets.json

# Structure secrets.json
{
  "DATABASE_URL": "postgresql://...",
  "JWT_SECRET": "...",
  "STRIPE_SECRET_KEY": "...",
  "SENDGRID_API_KEY": "...",
  "TWILIO_AUTH_TOKEN": "..."
}
```

### 6. Backup et Disaster Recovery

#### Stratégie de Backup
- **Database**: Snapshots quotidiens (30j), PITR activé
- **Files (S3)**: Versioning + Lifecycle (90j)
- **Code**: Tags Git pour chaque release
- **Config**: Infrastructure as Code (Terraform)

#### Plan de Recovery
1. **RPO** (Recovery Point Objective): 1 heure
2. **RTO** (Recovery Time Objective): 4 heures
3. **Procédures**:
   - Restore DB depuis snapshot
   - Redéployer l'infra via Terraform
   - Restore des fichiers S3
   - Vérification santé complète

### 7. Performance

#### Optimisations
```nginx
# Nginx config
gzip on;
gzip_types text/plain text/css application/json application/javascript;
gzip_min_length 1000;

# Cache headers
location ~* \.(jpg|jpeg|png|gif|ico|css|js)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

#### Database Indexes
```sql
-- Indexes critiques
CREATE INDEX idx_trips_search ON trips(origin_lat, origin_lng, destination_lat, destination_lng, date_time, status);
CREATE INDEX idx_places_geo ON places USING GIST(point(lat, lng));
CREATE INDEX idx_bookings_user ON bookings(user_id, status);
```

### 8. Checklist Pre-Production

- [ ] Tests de charge passés (1000 req/s)
- [ ] Scan de sécurité OK
- [ ] Backups testés
- [ ] Monitoring configuré
- [ ] Documentation à jour
- [ ] Runbooks créés
- [ ] Équipe formée
- [ ] Plan de rollback prêt

### 9. Go-Live

```bash
# 1. Deploy database migrations
pnpm --filter @safargo/database prisma:migrate:deploy

# 2. Deploy API (Blue/Green)
./scripts/deploy-api.sh --env production --strategy blue-green

# 3. Deploy Web
vercel --prod

# 4. Update DNS
# Point safargo.com to new infrastructure

# 5. Monitor
watch -n 1 'curl -s https://api.safargo.com/api/v1/health | jq'
```

### 10. Post-Deployment

- Monitor les métriques pendant 24h
- Vérifier les logs d'erreur
- Tester les parcours critiques
- Communiquer avec les early adopters
- Préparer le support

## Support et Escalade

### Niveau 1 (Support)
- Email: support@safargo.com
- Response time: < 2h

### Niveau 2 (Tech Lead)
- Slack: #safargo-incidents
- Response time: < 30min

### Niveau 3 (CTO)
- Phone: +213 XXX XXX XXX
- Response time: < 15min

## Commandes Utiles

```bash
# Logs API
kubectl logs -f deployment/safargo-api

# Restart API
kubectl rollout restart deployment/safargo-api

# Scale API
kubectl scale deployment/safargo-api --replicas=5

# Database console
kubectl exec -it postgres-0 -- psql -U safargo

# Redis CLI
kubectl exec -it redis-0 -- redis-cli
```