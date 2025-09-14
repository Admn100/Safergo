.PHONY: help install dev build test clean setup

# Default target
help:
	@echo "SafarGo Development Commands"
	@echo "==========================="
	@echo "make setup     - Initial project setup"
	@echo "make install   - Install dependencies"
	@echo "make dev       - Start development servers"
	@echo "make build     - Build all packages"
	@echo "make test      - Run tests"
	@echo "make clean     - Clean build artifacts"
	@echo "make docker-up - Start Docker services"
	@echo "make docker-down - Stop Docker services"
	@echo "make db-migrate - Run database migrations"
	@echo "make db-seed   - Seed database"

# Setup project
setup:
	@./scripts/setup.sh

# Install dependencies
install:
	pnpm install

# Development
dev:
	pnpm dev

# Build
build:
	pnpm build

# Test
test:
	pnpm test

# Clean
clean:
	pnpm clean
	rm -rf node_modules
	rm -rf apps/*/node_modules
	rm -rf packages/*/node_modules
	rm -rf apps/*/dist
	rm -rf packages/*/dist
	rm -rf apps/web/.next

# Docker
docker-up:
	docker compose up -d

docker-down:
	docker compose down

docker-logs:
	docker compose logs -f

# Database
db-migrate:
	pnpm --filter @safargo/database prisma:migrate:dev

db-seed:
	pnpm --filter @safargo/database prisma:seed

db-studio:
	pnpm --filter @safargo/database studio