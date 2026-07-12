# Ajit Pawara | Cybersecurity Portfolio

A terminal-inspired cybersecurity portfolio built with React and TypeScript. Features an interactive 90-day learning challenge tracker with password-protected content, skills radar, project showcase, and an admin control panel.

🌐 **Live Website**: [https://ajit-pawara.github.io/Portfolio/](https://ajit-pawara.github.io/Portfolio/)

---

## Features

- **90-Day Challenge Tracker** — Interactive contribution-style grid with day-by-day log viewer, HTML previews, and revision summaries. Days 1–10 are free; days 11–90 require a passkey (`ignite`).
- **Skills Radar** — Custom SVG radar chart and specialized career pathways (Offensive Security, Defensive Security, DevSecOps).
- **Project Dossier** — Project cards with expandable descriptions and an interactive GitHub code inspector.
- **Admin Control Panel** — Authenticated settings panel (password: `root@robin`) for customising profile details, track logs, skills, and projects. Changes persist in local storage.
- **Responsive Design** — Fully responsive layout optimised for desktop and mobile devices.

## Tech Stack

| Category | Technology |
|----------|------------|
| Framework | React 19 (TypeScript) |
| Bundler | Vite 8 |
| Styling | Custom CSS + Tailwind CSS v4 |
| Icons | Lucide React |
| Animations | Framer Motion |
| Linting | oxlint |
| Deployment | GitHub Pages (via `docs/` folder) |

## Getting Started

```bash
# Clone the repository
git clone https://github.com/Ajit-pawara/Portfolio.git
cd Portfolio

# Install dependencies
npm install

# Start the development server
npm run dev

# Run the linter
npm run lint

# Type-check the project
npx tsc -b

# Build for production
npm run build
```

The development server runs at `http://localhost:5173/` by default.

## Project Structure

```
Portfolio/
├── public/              # Static assets (favicon, profile image)
├── src/
│   ├── App.tsx          # Main application component
│   ├── data.json        # Profile, skills, projects, challenge data
│   ├── index.css        # Global styles
│   ├── main.tsx         # React entry point
│   └── seo.ts           # SEO meta tags helper
├── docs/                # Production build output (GitHub Pages)
├── index.html           # Entry HTML
├── vite.config.ts       # Vite configuration
└── package.json
```

## Authentication

| Area | Password | Scope |
|------|----------|-------|
| Day tracker (days 11–90) | `ignite` | Session-scoped (cleared on tab close) |
| Revision files (days 11+) | `ignite` | Session-scoped (cleared on tab close) |
| Admin control panel | `root@robin` | Session-scoped (cleared on tab close) |

## Deployment

The project is configured to build into the `docs/` directory for GitHub Pages hosting:

```bash
npm run build
git add docs/ && git commit -m "chore: build"
git push origin main
```

GitHub Pages automatically serves the content from `docs/` on the `main` branch.

## License

MIT
