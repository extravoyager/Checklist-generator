# CheckWise EHS

Enterprise-grade Environment, Health & Safety (EHS) checklist generator and inspection platform. Polished MVP built with Vue 3, Vite, Tailwind, Express, and ECharts.

## Features

- 15 modules: Dashboard, Checklist Generator, Template Library, Pre-built Library (30+ templates), Template Builder, Inspections, Mobile Inspection Runner, Actions (Kanban + Table), Findings, Assets, Reports, Analytics, Admin Settings, Roles & Permissions, Scoring Settings
- Deterministic checklist generator across hazard taxonomy
- Configurable scoring engine (percentage, weighted, deduction) with critical-failure caps
- Mock role-based auth with 12 default roles + permission matrix
- Mobile-first Inspection Runner with autosave + offline queue placeholder
- Print-friendly inspection reports
- Rich seed data: 12 users, 6 sites, 25 assets, 40 inspections, 80 actions, 60 findings

## Stack

- Frontend: Vue 3, Vite, Tailwind CSS, Vue Router, Pinia, ECharts (vue-echarts), lucide-vue-next
- Backend: Node.js, Express, JSON-file persistence (no database required)
- Monorepo: root `package.json` with `concurrently` running both apps

## Setup

```bash
npm install        # installs root, client, and server deps
npm run dev        # starts client (5173) and server (4000) concurrently
```

Then open http://localhost:5173.

## Production build

```bash
npm run build      # builds client into client/dist
npm start          # serves API on port 4000
```

## Demo Login

Login is a dropdown user picker (no password). Demo users:

- Alex Reynolds - Super Admin
- Priya Shah - EHS Admin
- Marcus Chen - Corporate EHS Manager
- Linda Okafor - Regional EHS Manager
- Diego Alvarez - Site EHS Manager
- Sara Whitman - Site Manager
- Tom Becker - Supervisor
- Jenna Liu - Inspector
- Rashid Khan - Contractor Inspector
- Olu Adebayo - Template Builder
- Maya Patel - Action Owner
- Sam Jordan - Viewer

Switch user from the top-right user menu.

## Project structure

```
client/  Vue 3 SPA
server/  Express API with JSON persistence
```

## Roadmap (deferred)

- Signature capture (photo capture is implemented - up to 6 client-resized JPEGs per question)
- IndexedDB-backed offline queue
- WebSocket multi-user sync
- PDF export via library
- Real LLM-backed generator (adapter stub included)
- E2E tests
