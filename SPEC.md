# SPEC — Wayhhow Personal Portfolio

## 1. Concept & Vision

A cyberpunk-themed personal portfolio for **Weihao Wu (Wayhhow)** — a developer who builds tools that matter. The site feels like booting into a futuristic terminal: dark space backgrounds, neon glows, and data streams. It's bold, modern, and instantly memorable — not another generic dev homepage.

**URL:** `https://wayhhow.github.io` (GitHub Pages)

---

## 2. Design Language

### Aesthetic Direction
Cyberpunk Terminal — deep void backgrounds, neon glow effects, grid overlays, data-driven visual language. Inspired by sci-fi interfaces and dark-mode GitHub.

### Color Palette
| Role | Color | Hex |
|------|-------|-----|
| Background (void) | Deep black | `#0a0a0f` |
| Surface (card) | Dark slate | `#0f1117` |
| Surface border | Neon edge | `#1a1a2e` |
| Primary accent | Electric cyan | `#00f5ff` |
| Secondary accent | Neon pink | `#ff2d78` |
| Tertiary accent | Neon green | `#39ff14` |
| Gold accent | Neon yellow | `#ffe600` |
| Text primary | Bright white | `#e0e0e0` |
| Text muted | Slate gray | `#8b8b9e` |

### Typography
- **Headings:** `Orbitron` (Google Fonts) — futuristic, geometric
- **Body / Code:** `JetBrains Mono` (Google Fonts) — developer-authentic monospace
- **Fallback:** `monospace`

### Spatial System
- Base unit: 8px
- Section padding: 80px vertical, 5% horizontal
- Card gap: 24px
- Max content width: 1100px

### Motion Philosophy
- **Entrance animations:** Staggered fade-up on scroll-into-view (IntersectionObserver)
- **Hero typewriter:** Cycling through tech stack labels, 100ms per character, 2s pause between
- **Neon pulse:** Subtle glow intensity oscillation on accent elements (3s cycle)
- **Cursor glow:** Mouse-move creates a radial gradient glow that follows the cursor
- **Card hover:** Scale 1.02 + border glow intensify + slight translateY(-4px)
- **Language bars:** Animated width on load (0 → actual%, 1.2s ease-out, staggered 150ms)

### Visual Assets
- **Icons:** Lucide icons (CDN) — minimal, consistent stroke weight
- **Background:** CSS grid pattern overlay + animated floating particles (canvas)
- **Avatar:** GitHub avatar with CSS neon ring animation
- **Achievement badge:** Inline SVG with glow filter

---

## 3. Layout & Structure

```
┌─────────────────────────────────────────┐
│  [CANVAS PARTICLES BACKGROUND]          │
│  ┌─────────────────────────────────┐    │
│  │  HERO                            │    │
│  │  Avatar (neon ring) + Name      │    │
│  │  Typewriter tagline              │    │
│  │  GitHub / Stars / Achievements   │    │
│  └─────────────────────────────────┘    │
│                                         │
│  ┌─────────────────────────────────┐    │
│  │  STATS BAR                      │    │
│  │  ⭐ Stars  🔧 Projects  🏅 Badge │    │
│  └─────────────────────────────────┘    │
│                                         │
│  ┌─────────────────────────────────┐    │
│  │  PROJECTS (2-col grid)          │    │
│  │  [Card] [Card]  [Card] [Card]   │    │
│  │  [Card] [Card]                  │    │
│  └─────────────────────────────────┘    │
│                                         │
│  ┌─────────────────────────────────┐    │
│  │  SKILLS                         │    │
│  │  [JS] [Python] [Java] [HTML]   │    │
│  └─────────────────────────────────┘    │
│                                         │
│  ┌─────────────────────────────────┐    │
│  │  FOOTER                         │    │
│  └─────────────────────────────────┘    │
└─────────────────────────────────────────┘
```

**Responsive:** Single column below 768px. Cards go full-width.

---

## 4. Features & Interactions

### Hero Section
- GitHub avatar with animated neon cyan ring
- Name: `Weihao Wu` in Orbitron, large
- Subtitle: `@wayhhow` with `[Pair Extraordinaire]` badge
- Typewriter cycling: `// Building tools for accessibility`, `// Automating the mundane`, `// Hardware meets software`
- GitHub link with hover glow

### Stats Bar
- 3 stat pills: `25 ⭐ Stars`, `6 Projects`, `🏅 Pair Extraordinaire`
- Subtle glassmorphism background

### Projects Section
- Section heading: `// Projects` with glitch underline
- 2-column responsive grid
- Each card: name, description, language tag (neon colored by language), star count, link icon
- Hover: neon border glow + lift
- **Selected projects (6):**
  1. **survey-map** — Accessibility Urban Visualization Platform (JS)
  2. **electric-bike-system** — Smart Hardware Display Interface (HTML)
  3. **NewBingGoGo-MagicURL-java** — AI Proxy Service Backend (Java)
  4. **AutoNeteaseMusic** — Music Platform Automation Tool (Python)
  5. **bing-auto-rewards** — Automated Efficiency Scripts (Python)
  6. **image_processing** — FPGA Edge Detection System (Verilog)

### Skills Section
- Language skill bars with neon colors:
  - JavaScript: `#f7df1e` (yellow)
  - Python: `#3572A5` (blue-gray)
  - Java: `#b07219` (orange)
  - HTML: `#e34c26` (red-orange)
  - Verilog: `#717870` (gray)

### Footer
- `© 2025–2026 Wayhhow · Built with neon & code`
- Back-to-top button (top-right floating)

### Interactions
- Smooth scroll navigation
- IntersectionObserver scroll reveal for each section
- Canvas particle system runs continuously in background

---

## 5. Component Inventory

### Avatar
- 120px circle, GitHub image
- `box-shadow: 0 0 20px #00f5ff, 0 0 40px #00f5ff40`
- Pulsing animation: glow cycles 3s

### Project Card
- Background: `#0f1117`
- Border: 1px solid `#1a1a2e`
- Hover: border → `#00f5ff`, glow, scale(1.02)
- Content: name (Orbitron), description (JetBrains Mono, muted), language pill, star icon + count, external link icon

### Language Pill
- Small badge, rounded full
- Background: language color at 15% opacity
- Text: language color at full
- Font: JetBrains Mono, 12px

### Skill Bar
- Track: `#1a1a2e`
- Fill: language neon color with glow
- Label above: language name + percentage
- Animate on scroll-into-view

### Stats Pill
- Glassmorphism: `rgba(255,255,255,0.05)` + `backdrop-filter: blur(8px)`
- Border: `rgba(0,245,255,0.2)`
- Neon text glow on number

---

## 6. Technical Approach

- **Stack:** Single HTML file + embedded CSS + embedded JS (no build step)
- **CDN dependencies:**
  - Google Fonts (Orbitron, JetBrains Mono)
  - Lucide Icons (ESM)
- **GitHub API:** Fetch user data (public) to populate stats dynamically
- **Canvas:** Lightweight particle system (~50 particles)
- **GitHub Pages:** Deploy from `main` branch, `/(root)` source
- **CI/CD:** GitHub Actions workflow on push to main
