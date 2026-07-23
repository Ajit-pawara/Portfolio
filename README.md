```
> PORTFOLIO::INIT
> A terminal-inspired interactive portfolio built with React & TypeScript
> 90-Day Cybersecurity Roadmap — Complete
```

🌐 **Live**: [https://ajit-pawara.github.io/Portfolio/](https://ajit-pawara.github.io/Portfolio/)

---

### Features

| Component | Details |
|-----------|---------|
| **90-Day Tracker** | Interactive grid with all 90 day logs, HTML previews, and 9 revision summaries. Days 1–10 open; 11+ passkey-gated. |
| **Skills Radar** | SVG chart + career pathways (Offensive, Defensive, DevSecOps). |
| **Projects** | Expandable cards with live GitHub code inspector. |
| **Admin Panel** | Authenticated editor for profile, tracks, skills, projects. |

---

### 🗺️ 90-Day Cybersecurity Roadmap

| Phase | Days | Theme | Topics |
|-------|------|-------|--------|
| 🟢 **Foundations** | 01–10 | Linux, Networking, Python, Web Basics | terminal, bash, HTTP, DNS, OSI, HTML/CSS/JS |
| 🔵 **Core Security** | 11–35 | Recon, Scanning, Web Vulnerabilities | subfinder, nmap, XSS, SQLi, SSRF, IDOR, OAuth |
| 🟠 **Offensive** | 36–55 | Exploitation, AD, Cloud, Bug Bounty | metasploit, bloodhound, AWS exploits, JWT, SSRF |
| 🔴 **Defensive/SOC** | 56–73 | Logs, SIEM, Forensics, Malware Analysis | ELK, Wireshark, Volatility, YARA, EDR |
| 🟣 **Career** | 74–90 | DevSecOps, CI/CD, Reporting, CTFs | SAST, IaC, CVE research, automation, reporting |

Every 10 days includes a **Revision Summary** (revision_day1_10 through revision_day81_90) with key takeaways, commands, and incident recaps.

---

### Stack

```
React 19    TypeScript 6    Vite 8    Tailwind CSS 4    Framer Motion
Electron    Monaco Editor    Recharts    Tauri
```

### Quick Start

```bash
git clone https://github.com/Ajit-pawara/Portfolio.git
cd Portfolio
npm install
npm run dev
```

```bash
npm run build    # outputs to docs/ (deployed via GitHub Actions)
npm run lint
npx tsc -b
```

### Project Structure

```
Portfolio/
├── public/              # Static assets + 90 day HTML files + 9 revision summaries
│   ├── day01.html → day90.html
│   ├── revision_day1_10.html → revision_day81_90.html
│   └── days-manifest.json
├── src/
│   ├── App.tsx
│   ├── data.json        # currentDay, completedDays, track config
│   ├── index.css
│   └── main.tsx
├── docs/                # Vite build output (gitignored, auto-deployed by CI)
├── electron/            # Desktop app config
├── index.html
├── vite.config.ts
└── .github/workflows/   # CI/CD — builds & deploys to GitHub Pages
```

### Deployment

- **Platform**: GitHub Pages (auto-deployed via GitHub Actions on push to `main`)
- **Build Output**: `docs/` directory (configured in `vite.config.ts`)
- **Domain**: [https://ajit-pawara.github.io/Portfolio/](https://ajit-pawara.github.io/Portfolio/)

### Access

- **Days 01–10**: Open access — no passkey required
- **Days 11–90**: Passkey-gated (contact for passkey)
- **Admin Panel**: Authenticated CRUD editor for all portfolio data
- **Certificates**: Sports & other certificates — also passkey-gated

---

### Contact

```
[?] Found a bug? Want a feature? Need the passkey?
[>] Drop a message on any platform below.
```

- **LinkedIn** → [linkedin.com/in/ajit-pawara-69541a305](https://linkedin.com/in/ajit-pawara-69541a305)
- **GitHub** → [github.com/Ajit-pawara](https://github.com/Ajit-pawara)
- **Instagram** → [instagram.com/robin_igl](https://instagram.com/robin_igl)
- **Threads** → [threads.net/@robin_igl](https://threads.net/@robin_igl)
- **Reddit** → [reddit.com/user/Robin_iii](https://reddit.com/user/Robin_iii)
- **TryHackMe** → [tryhackme.com/p/Robinx](https://tryhackme.com/p/Robinx)
- **HackTheBox** → [app.hackthebox.com/users/robin0x](https://app.hackthebox.com/users/robin0x)
- **HackerRank** → [hackerrank.com/profile/ajitdawar1729](https://hackerrank.com/profile/ajitdawar1729)

---

```
> PORTFOLIO::EOF
> Status: 90/90 days complete ✅
```