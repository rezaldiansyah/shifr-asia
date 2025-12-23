# Shifr Asia Monorepo

Platform e-commerce untuk UMKM Indonesia & Asia.

## Structure

```
shifr-asia/
├── apps/
│   ├── api/          # Laravel 11 Backend
│   ├── web-shifr/    # Next.js - shifr.asia
│   └── web-bizup/    # Next.js - bizup.id
├── packages/
│   ├── ui/           # Shared UI components
│   └── shared/       # Shared utilities
└── docs/             # Documentation
```

## Quick Start

```bash
# Install dependencies
npm install

# Run all apps
npm run dev
```

## Apps

| App | Port | Description |
|-----|------|-------------|
| API | 8000 | Laravel backend |
| web-shifr | 3000 | shifr.asia frontend |
| web-bizup | 3001 | bizup.id frontend |

## Documentation

- [PRD](./docs/PRD.md)
- [MoM Brainstorming](./docs/MoM_Brainstorming.md)
