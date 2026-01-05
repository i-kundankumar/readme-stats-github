<div align="center">
  <img src="https://res.cloudinary.com/djacophq7/image/upload/v1767510149/logo_k21ded.svg" width="200px" alt="GitHub Readme Stats" />
  <h1 style="font-size: 30px; margin: 10px 0;">GitHub Readme Stats </h1>
  <p><b>Dynamically generated GitHub statistics for your READMEs — powered by Cloudflare Edge.</b></p>

  <p>
    <a href="https://github.com/i-kundankumar/readme-stats-github/actions">
      <img alt="Build Status" src="https://img.shields.io/github/actions/workflow/status/i-kundankumar/readme-stats-github/deployment.yml?style=flat-square" />
    </a>
    <a href="https://github.com/i-kundankumar/readme-stats-github/graphs/contributors">
      <img alt="Contributors" src="https://img.shields.io/github/contributors/i-kundankumar/readme-stats-github?style=flat-square" />
    </a>
    <a href="https://github.com/i-kundankumar/readme-stats-github/issues">
      <img alt="Issues" src="https://img.shields.io/github/issues/i-kundankumar/readme-stats-github?style=flat-square" />
    </a>
    <a href="https://github.com/i-kundankumar/readme-stats-github/pulls">
      <img alt="Pull Requests" src="https://img.shields.io/github/issues-pr/i-kundankumar/readme-stats-github?style=flat-square" />
    </a>
    <br />
    <img src="https://img.shields.io/badge/deployed%20on-Cloudflare%20Pages-orange?style=flat-square&logo=cloudflare" />
  </p>

  <p>
    <a href="https://readme-stats-github.pages.dev/">View Demo</a>
    ·
    <a href="https://github.com/i-kundankumar/readme-stats-github/issues/new?labels=bug">Report Bug</a>
    ·
    <a href="https://github.com/i-kundankumar/readme-stats-github/issues/new?labels=enhancement">Request Feature</a>
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

![i-kundankumar](https://readme-stats-github.pages.dev/api?username=i-kundankumar)

```md
![GitHub Stats](https://readme-stats-github.pages.dev/api?username=YOUR_USERNAME)
```

### Top Languages

![Top Languages](https://readme-stats-github.pages.dev/api/top-langs?username=i-kundankumar)

```md
![Top Languages](https://readme-stats-github.pages.dev/api/top-langs?username=YOUR_USERNAME)
```

### Selected Repositories

![Repositories](https://readme-stats-github.pages.dev/api/repo?username=i-kundankumar&repo=readme-stats-github)

```md
![Repositories](https://readme-stats-github.pages.dev/api/repo?username=YOUR_USERNAME&repo=YOUR_REPO)
```

