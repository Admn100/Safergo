# Runbook Opérationnel SafarGo

## 🚨 Procédures d'Urgence

### Contacts d'Urgence
- **On-call Primary**: +213 555 123 456
- **On-call Secondary**: +213 555 123 457
- **DevOps Lead**: devops@safargo.com
- **CTO**: cto@safargo.com
- **Slack**: #safargo-alerts

### Escalation Matrix
1. **Niveau 1**: Développeur on-call (0-15 min)
2. **Niveau 2**: DevOps Lead (15-30 min)
3. **Niveau 3**: CTO (30+ min)

## 🔍 Monitoring et Alertes

### Dashboards Principaux
- **Production**: https://grafana.safargo.com/d/production
- **API Metrics**: https://grafana.safargo.com/d/api-metrics
- **Database**: https://grafana.safargo.com/d/database
- **Tourism Module**: https://grafana.safargo.com/d/tourism

### Alertes Critiques
```yaml
# Alertes automatiques
- High Error Rate (>1% 5xx)
- High Latency (p95 > 200ms)
- Database Down
- Payment Failures (>5%)
- Low Disk Space (<10%)
- High Memory Usage (>90%)
```

### Métriques Clés
- **API Response Time**: p95 < 200ms
- **Error Rate**: < 1%
- **Database Connections**: < 80%
- **Payment Success Rate**: > 95%
- **Tourism Conversion**: > 2%

## 🚨 Incidents

### Classification
- **P1 - Critical**: Service down, data loss, security breach
- **P2 - High**: Major feature broken, performance degradation
- **P3 - Medium**: Minor feature issues, non-critical bugs
- **P4 - Low**: Cosmetic issues, enhancement requests

### Procédure d'Incident
1. **Détection**: Alertes automatiques ou signalement utilisateur
2. **Acknowledgment**: Confirmer l'incident dans Slack
3. **Assessment**: Évaluer l'impact et la gravité
4. **Communication**: Notifier l'équipe et les utilisateurs si nécessaire
5. **Resolution**: Fix ou workaround
6. **Post-mortem**: Analyse et amélioration

### Templates de Communication
```markdown
## 🚨 Incident P1 - API Down
**Status**: Investigating
**Impact**: All users affected
**ETA**: 30 minutes
**Updates**: Every 15 minutes
```

## 🔧 Troubleshooting

### API Issues

#### High Latency
```bash
# Vérifier les métriques
curl -s https://api.safargo.com/metrics | grep latency

# Vérifier les logs
docker logs safargo-api-prod --tail 100

# Vérifier la base de données
docker exec -it safargo-postgres-prod psql -U postgres -d safargo -c "SELECT * FROM pg_stat_activity;"
```

#### High Error Rate
```bash
# Vérifier les erreurs récentes
docker logs safargo-api-prod --tail 100 | grep ERROR

# Vérifier les métriques d'erreur
curl -s https://api.safargo.com/metrics | grep error_rate

# Vérifier la santé des services
curl -f https://api.safargo.com/health
```

#### Database Issues
```bash
# Vérifier les connexions
docker exec -it safargo-postgres-prod psql -U postgres -d safargo -c "SELECT count(*) FROM pg_stat_activity;"

# Vérifier l'espace disque
docker exec -it safargo-postgres-prod df -h

# Vérifier les requêtes lentes
docker exec -it safargo-postgres-prod psql -U postgres -d safargo -c "SELECT query, mean_time FROM pg_stat_statements ORDER BY mean_time DESC LIMIT 10;"
```

### Web App Issues

#### Build Failures
```bash
# Vérifier les logs de build
docker logs safargo-web-prod --tail 100

# Vérifier les variables d'environnement
docker exec -it safargo-web-prod env | grep NEXT_PUBLIC

# Redémarrer le service
docker-compose -f docker-compose.prod.yml restart web
```

#### Performance Issues
```bash
# Vérifier les métriques Lighthouse
curl -s https://app.safargo.com/api/lighthouse

# Vérifier les logs Nginx
docker logs safargo-nginx-prod --tail 100

# Vérifier la configuration CDN
curl -I https://app.safargo.com
```

### Mobile App Issues

#### Build Failures
```bash
# Vérifier les logs EAS
eas build:list --platform all --limit 10

# Vérifier la configuration
cat apps/mobile/eas.json

# Redémarrer le build
eas build --platform android --clear-cache
```

#### OTA Update Issues
```bash
# Vérifier les updates
eas update:list --branch production

# Publier un update
eas update --branch production --message "Hotfix"

# Rollback si nécessaire
eas update:rollback --branch production
```

## 🔄 Déploiements

### Déploiement Staging
```bash
# Déployer sur staging
git checkout develop
git pull origin develop
docker-compose -f docker-compose.prod.yml up -d

# Vérifier le déploiement
curl -f https://staging.safargo.com/health
```

### Déploiement Production
```bash
# Déployer sur production
git checkout main
git pull origin main
docker-compose -f docker-compose.prod.yml up -d

# Vérifier le déploiement
curl -f https://app.safargo.com/health
curl -f https://api.safargo.com/health

# Vérifier les métriques
curl -s https://api.safargo.com/metrics | grep -E "(error_rate|latency)"
```

### Rollback
```bash
# Rollback API
docker-compose -f docker-compose.prod.yml down
docker-compose -f docker-compose.prod.yml up -d --scale api=0
docker-compose -f docker-compose.prod.yml up -d api:previous-version

# Rollback Web
vercel rollback

# Rollback Database (si nécessaire)
psql -h prod-db -U postgres -d safargo -f backup.sql
```

## 💾 Sauvegardes

### Base de Données
```bash
# Sauvegarde quotidienne
pg_dump -h prod-db -U postgres -d safargo > backup_$(date +%Y%m%d).sql

# Sauvegarde incrémentale
pg_basebackup -h prod-db -U postgres -D /backup/incremental/$(date +%Y%m%d)

# Vérifier les sauvegardes
ls -la /backup/ | tail -10
```

### Fichiers et Assets
```bash
# Sauvegarde S3
aws s3 sync s3://safargo-prod-assets s3://safargo-backup-assets

# Vérifier la sauvegarde
aws s3 ls s3://safargo-backup-assets --recursive | wc -l
```

### Restauration
```bash
# Restaurer la base de données
psql -h prod-db -U postgres -d safargo < backup_20241201.sql

# Restaurer les assets
aws s3 sync s3://safargo-backup-assets s3://safargo-prod-assets
```

## 🔐 Sécurité

### Audit de Sécurité
```bash
# Vérifier les logs d'audit
docker logs safargo-api-prod | grep -i "audit\|security\|unauthorized"

# Vérifier les tentatives de connexion
docker exec -it safargo-postgres-prod psql -U postgres -d safargo -c "SELECT * FROM audit_logs WHERE action = 'LOGIN' ORDER BY created_at DESC LIMIT 10;"

# Vérifier les permissions
docker exec -it safargo-postgres-prod psql -U postgres -d safargo -c "SELECT * FROM information_schema.role_table_grants;"
```

### Incident de Sécurité
1. **Isolation**: Isoler les services affectés
2. **Assessment**: Évaluer l'étendue de l'incident
3. **Containment**: Contenir la menace
4. **Eradication**: Éliminer la cause
5. **Recovery**: Restaurer les services
6. **Lessons Learned**: Analyser et améliorer

### Rotation des Secrets
```bash
# Rotation JWT secret
export NEW_JWT_SECRET=$(openssl rand -base64 64)
docker-compose -f docker-compose.prod.yml up -d --force-recreate api

# Rotation des clés API
# Mettre à jour les variables d'environnement
# Redémarrer les services concernés
```

## 📊 Performance

### Optimisation API
```bash
# Vérifier les requêtes lentes
docker exec -it safargo-postgres-prod psql -U postgres -d safargo -c "SELECT query, mean_time FROM pg_stat_statements ORDER BY mean_time DESC LIMIT 10;"

# Vérifier les index
docker exec -it safargo-postgres-prod psql -U postgres -d safargo -c "SELECT schemaname, tablename, indexname FROM pg_indexes WHERE schemaname = 'public';"

# Analyser les performances
docker exec -it safargo-postgres-prod psql -U postgres -d safargo -c "ANALYZE;"
```

### Optimisation Web
```bash
# Vérifier le bundle size
cd apps/web && pnpm build && pnpm analyze

# Vérifier les métriques Lighthouse
curl -s https://app.safargo.com/api/lighthouse

# Optimiser les images
cd apps/web && pnpm optimize-images
```

### Optimisation Mobile
```bash
# Vérifier la taille de l'app
eas build:list --platform android --limit 1

# Analyser les performances
cd apps/mobile && pnpm analyze

# Optimiser les assets
cd apps/mobile && pnpm optimize-assets
```

## 🔧 Maintenance

### Maintenance Préventive
```bash
# Nettoyage des logs
docker system prune -f
docker volume prune -f

# Mise à jour des dépendances
pnpm update
pnpm audit fix

# Vérification de la santé
curl -f https://api.safargo.com/health
curl -f https://app.safargo.com/health
```

### Maintenance de la Base de Données
```bash
# VACUUM et ANALYZE
docker exec -it safargo-postgres-prod psql -U postgres -d safargo -c "VACUUM ANALYZE;"

# Vérifier l'espace disque
docker exec -it safargo-postgres-prod df -h

# Vérifier les connexions
docker exec -it safargo-postgres-prod psql -U postgres -d safargo -c "SELECT count(*) FROM pg_stat_activity;"
```

### Maintenance des Services
```bash
# Redémarrage des services
docker-compose -f docker-compose.prod.yml restart

# Mise à jour des images
docker-compose -f docker-compose.prod.yml pull
docker-compose -f docker-compose.prod.yml up -d

# Vérification des services
docker-compose -f docker-compose.prod.yml ps
```

## 📱 Support Utilisateur

### Problèmes Courants

#### Connexion
```bash
# Vérifier l'authentification
curl -X POST https://api.safargo.com/api/v1/auth/otp/request -d '{"email":"test@safargo.com"}'

# Vérifier les tokens
curl -H "Authorization: Bearer TOKEN" https://api.safargo.com/api/v1/users/profile
```

#### Paiements
```bash
# Vérifier les webhooks Stripe
curl -s https://api.safargo.com/api/v1/payments/webhook

# Vérifier les transactions
docker exec -it safargo-postgres-prod psql -U postgres -d safargo -c "SELECT * FROM payments ORDER BY created_at DESC LIMIT 10;"
```

#### Tourisme
```bash
# Vérifier les POI
curl -s https://api.safargo.com/api/v1/places | jq '.data | length'

# Vérifier les itinéraires
curl -s https://api.safargo.com/api/v1/itineraries | jq '.data | length'
```

### Escalation Support
1. **Niveau 1**: Support utilisateur (FAQ, guides)
2. **Niveau 2**: Équipe technique (bugs, problèmes)
3. **Niveau 3**: Développement (nouvelles fonctionnalités)

## 📋 Checklists

### Checklist de Déploiement
- [ ] Tests passent (unit, integration, e2e)
- [ ] Code review approuvé
- [ ] Variables d'environnement configurées
- [ ] Base de données migrée
- [ ] Secrets mis à jour
- [ ] Monitoring configuré
- [ ] Build des images Docker
- [ ] Déploiement des services
- [ ] Vérification de la santé des services
- [ ] Tests de smoke
- [ ] Vérification des métriques
- [ ] Notification de l'équipe

### Checklist de Maintenance
- [ ] Sauvegardes vérifiées
- [ ] Logs nettoyés
- [ ] Métriques vérifiées
- [ ] Alertes testées
- [ ] Documentation mise à jour
- [ ] Équipe notifiée

### Checklist d'Incident
- [ ] Incident documenté
- [ ] Impact évalué
- [ ] Équipe notifiée
- [ ] Communication utilisateurs
- [ ] Résolution implémentée
- [ ] Post-mortem planifié
- [ ] Améliorations identifiées

## 📞 Contacts et Ressources

### Équipe
- **CTO**: cto@safargo.com
- **DevOps Lead**: devops@safargo.com
- **Backend Lead**: backend@safargo.com
- **Frontend Lead**: frontend@safargo.com
- **Mobile Lead**: mobile@safargo.com

### Services Externes
- **Stripe Support**: https://support.stripe.com
- **SendGrid Support**: https://support.sendgrid.com
- **Twilio Support**: https://support.twilio.com
- **Mapbox Support**: https://support.mapbox.com
- **Sentry Support**: https://sentry.io/support

### Documentation
- [Guide de Développement](development.md)
- [Guide de Déploiement](deployment.md)
- [Guide de Sécurité](security.md)
- [Documentation API](api.md)

---

**Dernière mise à jour**: 2024-12-01
**Version**: 1.0.0
**Maintenu par**: Équipe DevOps SafarGo