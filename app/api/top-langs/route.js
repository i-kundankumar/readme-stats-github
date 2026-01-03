import { NextResponse } from "next/server";

export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const username = searchParams.get("username") || "octocat";
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

        const svg = generateCardSVG(languages, totalSize);

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

function generateCardSVG(languages, totalSize) {
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
        <rect x="140" y="2" width="${barWidth}" height="8" rx="4" fill="rgba(255,255,255,0.1)" />
        <rect x="140" y="2" width="${filledWidth}" height="8" rx="4" fill="${color}" class="bar-fill" style="--target-width: ${filledWidth}px; animation-delay: ${delay + 200}ms" />
        <text x="270" y="10" class="lang-percent">${percentage.toFixed(1)}%</text>
      </g>
    </g>`;
    }).join("");

    return `
<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0d1117"/>
      <stop offset="100%" stop-color="#161b22"/>
    </linearGradient>
  </defs>
  <rect width="100%" height="100%" rx="14" fill="url(#bg)"/>
  <style>
    .title { fill:#58a6ff; font-size:18px; font-weight:700; font-family:Segoe UI, sans-serif }
    .lang-name { fill:#c9d1d9; font-size:13px; font-weight:600; font-family:Segoe UI, sans-serif }
    .lang-percent { fill:#8b949e; font-size:12px; font-family:Segoe UI, sans-serif }
    
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes growBar {
      from { width: 0; }
      to { width: var(--target-width); }
    }
    .lang-row { opacity: 0; animation: fadeIn 0.5s ease-out forwards; }
    .bar-fill { width: 0; animation: growBar 1s ease-out forwards; }
  </style>
  <text x="25" y="35" class="title">Most Used Languages</text>
  ${langItems}
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
