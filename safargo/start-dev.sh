#!/bin/bash

# SafarGo Development Startup Script
echo "🚀 Starting SafarGo Development Environment..."

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check prerequisites
echo -e "${BLUE}🔍 Checking prerequisites...${NC}"

if ! command_exists pnpm; then
    echo -e "${RED}❌ pnpm is not installed. Please install it first:${NC}"
    echo "npm install -g pnpm@8.15.0"
    exit 1
fi

if ! command_exists docker; then
    echo -e "${RED}❌ Docker is not installed. Please install Docker first.${NC}"
    exit 1
fi

if ! command_exists docker-compose; then
    echo -e "${RED}❌ Docker Compose is not installed. Please install Docker Compose first.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Prerequisites check passed!${NC}"

# Create .env.local if it doesn't exist
if [ ! -f .env.local ]; then
    echo -e "${YELLOW}📝 Creating .env.local from .env.example...${NC}"
    cp .env.example .env.local
    echo -e "${YELLOW}⚠️  Please edit .env.local with your configuration before continuing.${NC}"
    echo "Press any key to continue..."
    read -n 1 -s
fi

# Install dependencies
echo -e "${BLUE}📦 Installing dependencies...${NC}"
pnpm install

# Build shared packages
echo -e "${BLUE}🏗️  Building shared packages...${NC}"
pnpm -C packages/shared build

# Start database and services
echo -e "${BLUE}🗄️  Starting database and services...${NC}"
docker-compose -f docker-compose.dev.yml up -d postgres redis minio mailhog

# Wait for database to be ready
echo -e "${BLUE}⏳ Waiting for database to be ready...${NC}"
sleep 10

# Generate Prisma client and run migrations
echo -e "${BLUE}🔧 Setting up database...${NC}"
pnpm -C apps/api prisma:generate
pnpm -C apps/api prisma:migrate
pnpm -C apps/api prisma:seed

# Start development servers
echo -e "${BLUE}🚀 Starting development servers...${NC}"

# Start API in background
echo -e "${BLUE}🔧 Starting API server...${NC}"
(cd apps/api && pnpm dev) &
API_PID=$!

# Wait a bit for API to start
sleep 5

# Start web app in background (if it exists)
if [ -d "apps/web" ]; then
    echo -e "${BLUE}🌐 Starting web server...${NC}"
    (cd apps/web && pnpm dev) &
    WEB_PID=$!
fi

# Function to cleanup on exit
cleanup() {
    echo -e "\n${YELLOW}🛑 Shutting down development environment...${NC}"
    
    if [ ! -z "$API_PID" ]; then
        kill $API_PID 2>/dev/null
    fi
    
    if [ ! -z "$WEB_PID" ]; then
        kill $WEB_PID 2>/dev/null
    fi
    
    echo -e "${BLUE}🔽 Stopping Docker services...${NC}"
    docker-compose -f docker-compose.dev.yml down
    
    echo -e "${GREEN}✅ Development environment stopped.${NC}"
    exit 0
}

# Trap SIGINT and SIGTERM
trap cleanup SIGINT SIGTERM

# Display startup information
echo -e "\n${GREEN}🎉 SafarGo Development Environment Started!${NC}"
echo -e "\n${BLUE}📍 Services:${NC}"
echo -e "  • API Server: http://localhost:3001"
echo -e "  • API Documentation: http://localhost:3001/docs"
echo -e "  • Health Check: http://localhost:3001/health"

if [ -d "apps/web" ]; then
    echo -e "  • Web App: http://localhost:3000"
fi

echo -e "\n${BLUE}🛠️  Development Tools:${NC}"
echo -e "  • PostgreSQL: localhost:5432 (user: safargo, password: safargo, db: safargo_dev)"
echo -e "  • Redis: localhost:6379"
echo -e "  • MinIO S3: http://localhost:9001 (admin/admin123)"
echo -e "  • MailHog: http://localhost:8025"

echo -e "\n${BLUE}👥 Demo Accounts:${NC}"
echo -e "  • Admin: admin@safargo.com / admin123"
echo -e "  • Driver: ahmed.driver@safargo.com / demo123"
echo -e "  • Passenger: youcef.passenger@safargo.com / demo123"

echo -e "\n${YELLOW}💡 Tips:${NC}"
echo -e "  • Use 'pnpm -r dev' to restart all dev servers"
echo -e "  • Use 'pnpm -C apps/api prisma:studio' to open Prisma Studio"
echo -e "  • Use 'docker-compose -f docker-compose.dev.yml logs -f' to view logs"

echo -e "\n${GREEN}Press Ctrl+C to stop all services${NC}\n"

# Wait for user to interrupt
wait