import { NextResponse } from "next/server";

export const runtime = "edge";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const username = searchParams.get("username") || "octocat";
  const theme = searchParams.get("theme") || "shadow";
  const token = process.env.GITHUB_TOKEN;

  if (!token) {
    console.error("GITHUB_TOKEN is missing");
    return new NextResponse(generateErrorSVG("Server Error: Missing Token"), {
      status: 500,
      headers: { "Content-Type": "image/svg+xml" },
    });
  }

  const query = `
    query($login: String!) {
      user(login: $login) {
        repositories(ownerAffiliations: OWNER, isFork: false, first: 100, orderBy: {field: UPDATED_AT, direction: DESC}) {
          nodes {
            name
            languages(first: 10, orderBy: {field: SIZE, direction: DESC}) {
              edges {
                size
                node {
                  color
                  name
                }
              }
            }
          }
        }
      }
    }
  `;

  try {
    const res = await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query,
        variables: { login: username },
      }),
    });

    if (!res.ok) {
      return new NextResponse(generateErrorSVG("GitHub API Error"), {
        status: res.status,
        headers: { "Content-Type": "image/svg+xml" },
      });
    }

    const data = await res.json();

    if (data.errors) {
      return new NextResponse(generateErrorSVG(data.errors[0].message), {
        status: 400,
        headers: { "Content-Type": "image/svg+xml" },
      });
    }

    const repos = data.data.user?.repositories?.nodes || [];
    const stats = {};
    let totalSize = 0;

    repos.forEach((repo) => {
      if (repo.languages && repo.languages.edges) {
        repo.languages.edges.forEach((edge) => {
          const { size, node } = edge;
          const { name, color } = node;

          if (size > 0) {
            if (!stats[name]) {
              stats[name] = { name, color, size: 0 };
            }
            stats[name].size += size;
            totalSize += size;
          }
        });
      }
    });

    const languages = Object.values(stats)
      .sort((a, b) => b.size - a.size)
      .slice(0, 5);

    const themes = {
      light: {
        bg: ["#ffffff", "#f8fafc", "#f1f5f9"],
        title: "#0f172a",
        label: "#475569",
        value: "#334155",
        particle1: "#6366f1", // Indigo
        particle2: "#0ea5e9", // Sky Blue
        auraStart: "#818cf8",
        auraEnd: "#38bdf8",
        ringBg: "#e2e8f0",
      },
      dark: {
        bg: ["#0d1117", "#0d1117", "#161b22"],
        title: "#58a6ff",
        label: "#8b949e",
        value: "#c9d1d9",
        particle1: "#238636", // Green
        particle2: "#1f6feb", // Blue
        auraStart: "#2ea043",
        auraEnd: "#1f6feb",
        ringBg: "#30363d",
      },
      shadow: {
        bg: ["#020617", "#0f0c29", "#1e1b4b"],
        title: "#58a6ff",
        label: "#7ee787",
        value: "#c9d1d9",
        particle1: "#a855f7", // Violet
        particle2: "#60a5fa", // Cold Blue
        auraStart: "#a855f7",
        auraEnd: "#3b82f6",
        ringBg: "#1e1b4b",
      },
    };

    const t = themes[theme] || themes.shadow;
    const svg = generateCardSVG(languages, totalSize, t);

    return new NextResponse(svg, {
      headers: {
        "Content-Type": "image/svg+xml",
        "Cache-Control": "public, max-age=3600, s-maxage=3600",
      },
    });
  } catch (error) {
    console.error("API Error:", error);
    return new NextResponse(generateErrorSVG("Internal Server Error"), {
      status: 500,
      headers: { "Content-Type": "image/svg+xml" },
    });
  }
}

function escapeXml(unsafe) {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case "<": return "&lt;";
      case ">": return "&gt;";
      case "&": return "&amp;";
      case "'": return "&apos;";
      case '"': return "&quot;";
      default: return c;
    }
  });
}

function generateCardSVG(languages, totalSize, t) {
  const width = 350;
  const height = 200;

  const langItems = languages.map((lang, index) => {
    const percentage = totalSize > 0 ? (lang.size / totalSize) * 100 : 0;
    const y = 65 + index * 25;
    const color = lang.color || "#ccc";
    const barWidth = 120;
    const filledWidth = (percentage / 100) * barWidth;
    const delay = index * 150;

    return `
    <g transform="translate(25, ${y})">
      <g class="lang-row" style="animation-delay: ${delay}ms">
        <circle cx="5" cy="6" r="5" fill="${color}" />
        <text x="20" y="10" class="lang-name">${escapeXml(lang.name)}</text>
        <rect x="140" y="2" width="${barWidth}" height="8" rx="4" fill="${t.ringBg}" />
        <rect x="140" y="2" width="${filledWidth}" height="8" rx="4" fill="${color}" class="bar-fill" style="--target-width: ${filledWidth}px; animation-delay: ${delay + 200}ms" />
        <text x="270" y="10" class="lang-percent">${percentage.toFixed(1)}%</text>
      </g>
    </g>`;
  }).join("");

  return `
<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${t.bg[0]}"/>
      <stop offset="50%" stop-color="${t.bg[1]}"/>
      <stop offset="100%" stop-color="${t.bg[2]}"/>
    </linearGradient>
    
    <!-- Shadow Glow -->
    <filter id="shadow-glow" x="-70%" y="-70%" width="240%" height="240%">
      <feGaussianBlur stdDeviation="8" in="SourceGraphic" result="blur"/>
      <feMerge>
        <feMergeNode in="blur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>

  <style>
    .title { fill:${t.title}; font-size:18px; font-weight:700; font-family:Segoe UI, sans-serif }
    .lang-name { fill:${t.value}; font-size:13px; font-weight:600; font-family:Segoe UI, sans-serif }
    .lang-percent { fill:${t.label}; font-size:12px; font-family:Segoe UI, sans-serif }
    
    .card-animation {
      animation: fade-in 0.8s ease-out forwards;
      transform-origin: center;
      transform-box: fill-box;
    }
    @keyframes fade-in {
      from { opacity: 0; transform: scale(0.95); }
      to { opacity: 1; transform: scale(1); }
    }
    @keyframes growBar {
      from { width: 0; }
      to { width: var(--target-width); }
    }
    @keyframes slideIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .lang-row { opacity: 0; animation: slideIn 0.5s ease-out forwards; }
    .bar-fill { width: 0; animation: growBar 1s ease-out forwards; }

    .particle { animation: float 8s ease-in-out infinite; }
    @keyframes float {
      0% { transform: translateY(10px); opacity: 0; }
      50% { opacity: 0.6; }
      100% { transform: translateY(-20px); opacity: 0; }
    }
  </style>

  <g class="card-animation">
    <rect width="100%" height="100%" rx="14" fill="url(#bg)"/>

    <!-- Floating Particles -->
    <g filter="url(#shadow-glow)">
      <circle cx="40" cy="160" r="1" fill="${t.particle1}" class="particle" style="animation-delay: 0s"/>
      <circle cx="300" cy="30" r="1.5" fill="${t.particle2}" class="particle" style="animation-delay: 2s"/>
      <circle cx="200" cy="180" r="1" fill="${t.particle1}" class="particle" style="animation-delay: 4s"/>
      <circle cx="320" cy="140" r="1" fill="${t.particle2}" class="particle" style="animation-delay: 1s"/>
      <circle cx="100" cy="20" r="1.5" fill="${t.particle1}" class="particle" style="animation-delay: 3s"/>
    </g>

    <text x="25" y="35" class="title">Most Used Languages</text>
    ${langItems}
  </g>
</svg>
`.trim();
}

function generateErrorSVG(message) {
  return `
<svg width="350" height="100" viewBox="0 0 350 100" xmlns="http://www.w3.org/2000/svg">
  <rect width="100%" height="100%" rx="10" fill="#0d1117" stroke="#30363d" stroke-width="1"/>
  <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#c9d1d9" font-family="Segoe UI, sans-serif" font-size="14" font-weight="600">
    ${escapeXml(message)}
  </text>
</svg>`.trim();
}
