```
┌─────────────────────────────────────────────┐
│                                             │
│   ██████  ██████  ██████   ████  ██████     │
│   ██   ██ ██   ██ ██   ██   ██  ██   ██    │
│   ██████  ██████  ██████    ██  ██    ██    │
│   ██   ██ ██   ██ ██   ██   ██  ██   ██    │
│   ██   ██ ██████  ██████   ████ ██████     │
│                                             │
│   TERMINAL-THEMED PORTFOLIO                 │
│   React 19  •  TypeScript 6  •  Vite 8     │
│                                             │
└─────────────────────────────────────────────┘
```

A terminal-inspired interactive portfolio — challenge tracker, skills radar, project showcase, and admin panel with a cybersecurity aesthetic.

🌐 **Live**: [https://ajit-pawara.github.io/Portfolio/](https://ajit-pawara.github.io/Portfolio/)

---

### What's Inside

| Feature | What It Does |
|---------|-------------|
| **90-Day Challenge Tracker** | Grid of 90 days with logs, HTML previews, and revision summaries. Days 1–10 are open; days 11+ require a passkey. |
| **Skills Radar** | Interactive SVG chart + career pathways (Offensive, Defensive, DevSecOps). |
| **Projects** | Expandable cards with live GitHub code inspector. |
| **Admin Panel** | Authenticated panel to edit profile, tracks, skills, and projects. |

### Tech Stack

```
React 19    TypeScript 6    Vite 8    Tailwind CSS 4    Framer Motion
```

### Quick Start

```bash
git clone https://github.com/Ajit-pawara/Portfolio.git
cd Portfolio
npm install
npm run dev
```

```bash
# Build for production (outputs to docs/)
npm run build

# Lint & type-check
npm run lint
npx tsc -b
```

### Structure

```
Portfolio/
├── public/         # Static assets (images, favicon)
├── src/
│   ├── App.tsx     # Main application (~3100 lines)
│   ├── data.json   # Content database (profile, projects, tracks)
│   ├── index.css   # Terminal-themed styles
│   └── main.tsx    # React entry point
├── docs/           # Production build → GitHub Pages
├── index.html
└── vite.config.ts
```

### Contact

Reach out through the social links on the site.

---

<p align="center">
  <sub>© 2026 Robin</sub>
</p>
