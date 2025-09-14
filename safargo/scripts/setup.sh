#!/bin/bash

# SafarGo Setup Script
echo "🚀 Setting up SafarGo development environment..."

# Check prerequisites
command -v node >/dev/null 2>&1 || { echo "❌ Node.js is required but not installed. Aborting." >&2; exit 1; }
command -v pnpm >/dev/null 2>&1 || { echo "❌ pnpm is required but not installed. Run: npm install -g pnpm" >&2; exit 1; }
command -v docker >/dev/null 2>&1 || { echo "❌ Docker is required but not installed. Aborting." >&2; exit 1; }

# Install dependencies
echo "📦 Installing dependencies..."
pnpm install

# Copy environment files
echo "📝 Setting up environment files..."
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env
cp packages/database/.env.example packages/database/.env

# Start Docker services
echo "🐳 Starting Docker services..."
docker compose up -d

# Wait for PostgreSQL to be ready
echo "⏳ Waiting for PostgreSQL to be ready..."
sleep 5

# Generate Prisma client
echo "🔧 Generating Prisma client..."
pnpm --filter @safargo/database prisma:generate

# Run migrations
echo "🗄️  Running database migrations..."
pnpm --filter @safargo/database prisma:migrate:dev

# Seed database
echo "🌱 Seeding database with demo data..."
pnpm --filter @safargo/database prisma:seed

echo "✅ Setup complete! Run 'pnpm dev' to start the development servers."
echo ""
echo "📚 Available URLs:"
echo "   - Web App: http://localhost:3001"
echo "   - API: http://localhost:3000"
echo "   - API Docs: http://localhost:3000/docs"
echo "   - MinIO: http://localhost:9001 (user: safargo, pass: safargo123)"
echo ""
echo "🔑 Demo accounts:"
echo "   - Passenger: passenger@demo.com"
echo "   - Driver: driver@demo.com"
echo "   - Admin: admin@demo.com"