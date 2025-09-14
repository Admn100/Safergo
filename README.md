# SafarGo Monorepo

Monorepo for SafarGo: carpooling + Algeria tourism module. Contains API, Web, Mobile, UI, and Infra.

## Structure

- apps/
  - api
  - web
  - mobile
- packages/
  - ui
- infra/

## Requirements

- Node.js >= 20
- pnpm >= 9
- Docker (for local infra)

## Workspace commands

```bash
pnpm i
pnpm -r dev
pnpm -C apps/api prisma:migrate
pnpm -C apps/api prisma:seed
pnpm -r test
pnpm -r build
docker compose up --build
```

## Environments

Use `.env` files per app. See `.env.example` at the repo root for required variables.

## Coding standards

- TypeScript strict
- Prettier + EditorConfig
- Tabs with width 2 (kept consistent across the repo)
