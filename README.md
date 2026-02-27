<div align="center">
  <img src="https://res.cloudinary.com/djacophq7/image/upload/v1767510149/logo_k21ded.svg" width="200px" alt="GitHub Readme Stats" />
  <h1 style="font-size: 30px; margin: 10px 0;">GitHub Readme Stats </h1>
  <p><b>Dynamically generated GitHub statistics for your READMEs — powered by Cloudflare Edge.</b></p>

  <p>
    <a href="https://github.com/itwaasyou/readme-stats-github/actions">
      <img alt="Build Status" src="https://img.shields.io/github/actions/workflow/status/itwaasyou/readme-stats-github/deployment.yml?style=flat-square" />
    </a>
    <a href="https://github.com/itwaasyou/readme-stats-github/graphs/contributors">
      <img alt="Contributors" src="https://img.shields.io/github/contributors/itwaasyou/readme-stats-github?style=flat-square" />
    </a>
    <a href="https://github.com/itwaasyou/readme-stats-github/issues">
      <img alt="Issues" src="https://img.shields.io/github/issues/itwaasyou/readme-stats-github?style=flat-square" />
    </a>
    <a href="https://github.com/itwaasyou/readme-stats-github/pulls">
      <img alt="Pull Requests" src="https://img.shields.io/github/issues-pr/itwaasyou/readme-stats-github?style=flat-square" />
    </a>
    <br />
    <img src="https://img.shields.io/badge/deployed%20on-Cloudflare%20Pages-orange?style=flat-square&logo=cloudflare" />
  </p>

  <p>
    <a href="https://readme-stats-github.pages.dev/">View Demo</a>
    ·
    <a href="https://github.com/itwaasyou/readme-stats-github/issues/new?labels=bug">Report Bug</a>
    ·
    <a href="https://github.com/itwaasyou/readme-stats-github/issues/new?labels=enhancement">Request Feature</a>
  </p>
</div>

---

##  Overview

This project is a specialized deployment of **GitHub Readme Stats** designed to run on **Cloudflare Pages** using the **Edge Runtime**. It generates dynamic SVG images of your GitHub profile statistics to display on your profile README.

### Why Cloudflare Edge?

> [!IMPORTANT]
> **No Hard Request Limits**: Unlike Vercel, Cloudflare Pages does not enforce strict serverless function invocation limits, making this instance highly suitable for public-facing GitHub READMEs with high traffic.

> [!NOTE]
> **Smart Caching**: Responses are cached at the **Cloudflare Edge** to significantly reduce latency and conserve GitHub API rate limits (5,000 requests/hour per token).

## ⚡ Usage

Copy and paste the following markdown into your GitHub profile `README.md`, replacing `YOUR_USERNAME` with your actual GitHub username.

### Basic Stats
---

#### Core Stats
- Total Stars
- Total Commits
- Total Pull Requests
- Repositories Contributed To
- Unified score (0–100)
- Rank grading system



![itwaasyou](https://readme-stats-github.pages.dev/api?username=itwaasyou)

```md
![GitHub Stats](https://readme-stats-github.pages.dev/api?username=YOUR_USERNAME)
```

| Grade | Meaning |
|------|--------|
| **S** | Elite / Premium open-source impact |
| A+ | Strong contributor |
| A | Consistent developer |
| B+ | Active |
| B | Moderate |
| C | Early stage |

> Grades are **calibrated to be fair and inclusive**, not competitive rankings.

### Top Languages

![Top Languages](https://readme-stats-github.pages.dev/api/top-langs?username=itwaasyou)

```md
![Top Languages](https://readme-stats-github.pages.dev/api/top-langs?username=YOUR_USERNAME)
```

### Selected Repositories

![Repositories](https://readme-stats-github.pages.dev/api/repo?username=itwaasyou&repo=readme-stats-github)

```md
![Repositories](https://readme-stats-github.pages.dev/api/repo?username=YOUR_USERNAME&repo=YOUR_REPO)
```
### Themes
---
Choose how your card looks using the `theme` query parameter:

| Theme | Description |
|-----|------------|
| `dark` | GitHub-style dark mode (default) |
| `light` | Clean, minimal light theme |
| `shadow` | **Premium S-Rank theme** |

---

### 👑 S-Rank (Premium Visual)

When a user reaches **S-Rank**:

- Subtle **tiny particles**
- Soft purple/blue glow
- Calm, elite visual presence
- No rotating rings
- No distracting animations

> Premium effects are **quiet and controlled**, not flashy.

---

### Light Theme
![GitHub Stats](https://readme-stats-github.pages.dev/api?username=octocat&theme=light)

```md
![GitHub Stats](https://readme-stats-github.pages.dev/api?username=YOUR_USERNAME&theme=light)
```

### Dark Theme
![GitHub Stats](https://readme-stats-github.pages.dev/api?username=octocat&theme=dark)
```md
![GitHub Stats](https://readme-stats-github.pages.dev/api?username=YOUR_USERNAME&theme=dark)
```

### Shadow Theme (Premium)
![GitHub Stats](https://readme-stats-github.pages.dev/api?username=mattsse&theme=shadow)
```md
![GitHub Stats](https://readme-stats-github.pages.dev/api?username=YOUR_USERNAME&theme=shadow)
```
## How the Score Is Calculated

The score reflects public GitHub impact, not developer skill.

It uses three signals:

- ⭐ Stars → adoption & usefulness

- 📦 Public repositories → activity & consistency

- 👥 Followers → community interest
 
Each signal is:
- normalized
- capped
- weighted
- combined into a final score (0–100)

This prevents:

- star inflation
- repo spam
- follower bias

## Typing SVG (Terminal-Style Intro)
Generate a **typewriter-style animated SVG** for your GitHub README, inspired by terminal typing with full customization via URL parameters.

> Works on GitHub READMEs  
> No JavaScript required  
> SVG-only (fast & lightweight)  
> Fully customizable via query params  

---

### Endpoint
```/api/typing```

---

### ✨ Basic Usage

```md
![Typing](https://readme-stats-github.pages.dev/api/typing)
```

### Custom Text

Use `;` to separate multiple lines.

![Typing](<https://readme-stats-github.pages.dev/api/typing?lines=Hello!%20I'm%20Kundan;I%20break%20things%20to%20learn%20:)>)

```md
![Typing](<https://readme-stats-github.pages.dev/api/typing?lines=Hello!%20I'm%20Kundan;I%20break%20things%20to%20learn%20:)>)
```

### Customization Options

| Parameter	| Description	| Default |
|---	|---	|---	|
| `lines`	| Text lines (separated by `;`)	| `Hello! I'm Kundan;I break things to learn :)`	|
| `width`	| SVG width	| `700`	|
| `height`	| SVG height	| `150`	|
| `size`	| Font size (px)	| `24`	|
| `font`	| Font family	| `monospace`	|
| `color`	| Text color (hex)	| `000000`	|
| `bg`	| Smoke color (hex)	| `000000`	|
| `speed`	| Typing speed (ms per char)	| `120`	|
| `pause`	| Pause between lines (ms)	| `1000`	|
| `loop`	| Loop typing animation	| `false`	|
| `align`	| Text alignment (`left`, `center`, `right`)	| `left`	|
| `vCenter`	| Vertical centering	| `true`	|
| `particleColor` | Background (hex| `ffffff` |

---

## Examples
### Centered Typing
![Typing](https://readme-stats-github.pages.dev/api/typing?lines=Hello!%20I'm%20Kundan;Full-Stack%20Developer&align=center)

### Looping Animation
![Typing](https://readme-stats-github.pages.dev/api/typing?lines=Open%20Source%20Contributor;Building%20cool%20things&loop=true)

### Custom Theme
![Typing](https://readme-stats-github.pages.dev/api/typing?color=58a6ff&bg=000000&size=28)




## Design Philosophy

- SVG-only (README-safe)
- No JavaScript on the client
- No external assets
- Lightweight & fast
- Calm > flashy
- Premium effects only where earned

This project focuses on clarity, restraint, and trust.

This project does not rank developers or measure skill.
It visualizes public GitHub signals only.

Private work, offline contributions, and non-GitHub activity are not included.

## License

MIT License — free to use, modify, and share.

### Acknowledgements

Inspired by the GitHub open-source ecosystem and modern developer tooling.

If you like this project, consider giving it a star!

## Attribution

This project is inspired by the original **GitHub Readme Stats** project by  
**Anurag Hazra**.

- Original project: https://github.com/anuraghazra/github-readme-stats
- Author: Anurag Hazra
- License: MIT

This is an independent implementation with additional features, themes, and visual systems.
