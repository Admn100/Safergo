#!/bin/bash

# SafarGo - Script de Configuration
# Ce script configure l'environnement de développement

set -e

echo "🚀 SafarGo - Configuration de l'environnement"
echo "============================================="

# Couleurs pour les logs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Fonction pour logger
log() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

# Vérifier les prérequis
check_prerequisites() {
    log "Vérification des prérequis..."
    
    # Node.js
    if ! command -v node &> /dev/null; then
        error "Node.js n'est pas installé. Veuillez installer Node.js 20+"
        exit 1
    fi
    
    NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -lt 20 ]; then
        error "Node.js version 20+ requis. Version actuelle: $(node --version)"
        exit 1
    fi
    
    # pnpm
    if ! command -v pnpm &> /dev/null; then
        log "Installation de pnpm..."
        npm install -g pnpm
    fi
    
    # Docker
    if ! command -v docker &> /dev/null; then
        warn "Docker n'est pas installé. Certaines fonctionnalités ne seront pas disponibles."
    fi
    
    # Docker Compose
    if ! command -v docker-compose &> /dev/null; then
        warn "Docker Compose n'est pas installé. Certaines fonctionnalités ne seront pas disponibles."
    fi
    
    log "✅ Prérequis vérifiés"
}

# Installer les dépendances
install_dependencies() {
    log "Installation des dépendances..."
    
    pnpm install
    
    log "✅ Dépendances installées"
}

# Configurer l'environnement
setup_environment() {
    log "Configuration de l'environnement..."
    
    # Copier le fichier .env.example si .env n'existe pas
    if [ ! -f .env ]; then
        cp .env.example .env
        log "Fichier .env créé depuis .env.example"
        warn "Veuillez configurer les variables d'environnement dans .env"
    else
        log "Fichier .env existe déjà"
    fi
    
    log "✅ Environnement configuré"
}

# Démarrer les services Docker
start_docker_services() {
    if command -v docker-compose &> /dev/null; then
        log "Démarrage des services Docker..."
        
        # Démarrer PostgreSQL et Redis
        docker-compose up -d postgres redis
        
        # Attendre que PostgreSQL soit prêt
        log "Attente de PostgreSQL..."
        sleep 10
        
        log "✅ Services Docker démarrés"
    else
        warn "Docker Compose non disponible. Veuillez démarrer PostgreSQL et Redis manuellement."
    fi
}

# Configurer la base de données
setup_database() {
    log "Configuration de la base de données..."
    
    # Générer le client Prisma
    pnpm -C apps/api prisma:generate
    
    # Exécuter les migrations
    pnpm -C apps/api prisma:migrate
    
    # Seeder la base de données
    pnpm -C apps/api prisma:seed
    
    log "✅ Base de données configurée"
}

# Construire les applications
build_applications() {
    log "Construction des applications..."
    
    # Type check
    pnpm type-check
    
    # Lint
    pnpm lint
    
    # Build
    pnpm build
    
    log "✅ Applications construites"
}

# Afficher les informations de démarrage
show_startup_info() {
    echo ""
    echo "🎉 SafarGo est configuré et prêt !"
    echo "=================================="
    echo ""
    echo "📋 Comptes de démonstration :"
    echo "   👑 Admin: admin@safargo.com"
    echo "   🚗 Driver: ahmed@safargo.com"
    echo "   👤 Passenger: amina@safargo.com"
    echo ""
    echo "🌐 URLs de développement :"
    echo "   Web App: http://localhost:3000"
    echo "   API: http://localhost:3001"
    echo "   API Docs: http://localhost:3001/api/docs"
    echo "   Admin: http://localhost:3000/admin"
    echo ""
    echo "📱 Commandes utiles :"
    echo "   pnpm dev          # Démarrer en développement"
    echo "   pnpm test         # Exécuter les tests"
    echo "   pnpm build        # Construire pour production"
    echo "   pnpm db:studio    # Interface Prisma Studio"
    echo ""
    echo "🇩🇿 Made in Algeria with ❤️"
    echo ""
}

# Fonction principale
main() {
    info "Configuration de SafarGo - Covoiturage & Tourisme Algérie"
    
    check_prerequisites
    install_dependencies
    setup_environment
    start_docker_services
    setup_database
    build_applications
    show_startup_info
    
    log "Configuration terminée avec succès !"
}

# Exécution
main "$@"