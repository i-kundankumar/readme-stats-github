import { NextResponse } from "next/server";

export const runtime = "edge";

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

    const headers = {
        Authorization: `Bearer ${token}`,
        "User-Agent": "Github-Stats-Card",
    };

    try {
        //Prepare Requests (Parallel)
        const userReq = fetch(`https://api.github.com/users/${username}`, {
            headers,
            next: { revalidate: 3600 },
        });

        const repoReq = fetch(
            `https://api.github.com/users/${username}/repos?per_page=100`,
            { headers }
        );

        const query = `
    query($login:String!) {
      user(login: $login) {
        contributionsCollection {
          totalCommitContributions
          totalPullRequestContributions
          totalRepositoryContributions
        }
      }
    }
  `;

        const graphqlReq = fetch("https://api.github.com/graphql", {
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

        // Await Responses
        const [userRes, repoRes, graphqlRes] = await Promise.all([
            userReq,
            repoReq,
            graphqlReq,
        ]);

        // Check for Rate Limiting
        if (userRes.status === 403 || repoRes.status === 403 || graphqlRes.status === 403) {
            return new NextResponse(generateErrorSVG("GitHub Rate Limit Exceeded"), {
                status: 403,
                headers: { "Content-Type": "image/svg+xml" },
            });
        }

        if (!userRes.ok) {
            return new NextResponse(generateErrorSVG("User not found"), {
                status: 404,
                headers: { "Content-Type": "image/svg+xml" },
            });
        }

        const user = await userRes.json();
        const repos = repoRes.ok ? await repoRes.json() : [];
        const contributions = graphqlRes.ok
            ? (await graphqlRes.json()).data?.user?.contributionsCollection
            : {};

        // Calculate stats
        const totalStars = Array.isArray(repos)
            ? repos.reduce((sum, repo) => sum + repo.stargazers_count, 0)
            : 0;

        const totalPRs = contributions?.totalPullRequestContributions || 0;
        const totalCommits = contributions?.totalCommitContributions || 0;
        const contributedTo = contributions?.totalRepositoryContributions || 0;

        // Score calculation
        function normalizeStars(stars) {
            return Math.min(40, Math.log10(stars + 1) * 15);
        }

        function normalizeRepos(repos) {
            return Math.min(25, Math.sqrt(repos) * 4);
        }

        function normalizeFollowers(followers) {
            return Math.min(20, Math.log10(followers + 1) * 10);
        }

        function getGradeMeta(score) {
            if (score >= 80)
                return {
                    grade: "S",
                    color: "#a855f7",   // Shadow Monarch violet
                    glow: true
                };

            if (score >= 70)
                return { grade: "A+", color: "#6fdd8b", glow: false };

            if (score >= 60)
                return { grade: "A", color: "#58a6ff", glow: false };

            if (score >= 50)
                return { grade: "B+", color: "#e3b341", glow: false };

            if (score >= 40)
                return { grade: "B", color: "#d29922", glow: false };

            return { grade: "C", color: "#f85149", glow: false };
        }


        const starScore = normalizeStars(totalStars);
        const repoScore = normalizeRepos(user.public_repos);
        const followerScore = normalizeFollowers(user.followers);

        const score = Math.round(
            Math.min(100, starScore + repoScore + followerScore)
        );

        const { grade, color, glow } = getGradeMeta(score);

        const radius = 52;
        const circumference = 2 * Math.PI * radius;
        const progress = (score / 100) * circumference;

        //SVG
        const svg = `
<svg width="450" height="200" viewBox="0 0 450 200" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- Background -->
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#020617"/>
      <stop offset="50%" stop-color="#0f0c29"/>
      <stop offset="100%" stop-color="#1e1b4b"/>
    </linearGradient>

    <!-- Halo Gradient -->
    <linearGradient id="halo-gradient" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#4c1d95"/>
      <stop offset="100%" stop-color="#3b82f6"/>
    </linearGradient>

    <!-- Shadow Monarch Glow -->
    <filter id="shadow-glow" x="-70%" y="-70%" width="240%" height="240%">
      <feGaussianBlur stdDeviation="10" result="blur"/>
      <feColorMatrix
        in="blur"
        type="matrix"
        values="
          0 0 0 0 0.40
          0 0 0 0 0.15
          0 0 0 0 0.85
          0 0 0 1 0"/>
      <feMerge>
        <feMergeNode/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>

    <radialGradient id="aura-gradient">
      <stop offset="0%" stop-color="#a855f7" stop-opacity="0.3"/>
      <stop offset="60%" stop-color="#3b82f6" stop-opacity="0.1"/>
      <stop offset="100%" stop-color="transparent"/>
    </radialGradient>
  </defs>

  <style>
    .card-animation {
      animation: fade-in 0.8s ease-out forwards;
      transform-origin: center;
      transform-box: fill-box;
    }

    @keyframes fade-in {
      from { opacity: 0; transform: scale(0.95); }
      to { opacity: 1; transform: scale(1); }
    }

    .shadow-monarch {
      animation: monarch-pulse 4s ease-in-out infinite;
    }

    @keyframes monarch-pulse {
      0% { opacity: 0.8; filter: drop-shadow(0 0 8px #a855f7); }
      50% { opacity: 1; filter: drop-shadow(0 0 15px #60a5fa); }
      100% { opacity: 0.8; filter: drop-shadow(0 0 8px #a855f7); }
    }

    .particle {
      animation: float 8s ease-in-out infinite;
    }

    @keyframes float {
      0% { transform: translateY(10px); opacity: 0; }
      50% { opacity: 0.6; }
      100% { transform: translateY(-20px); opacity: 0; }
    }

    .title { fill:#58a6ff; font-size:18px; font-weight:700; font-family:Segoe UI }
    .label { fill:#7ee787; font-size:14px; font-family:Segoe UI }
    .value { fill:#c9d1d9; font-size:14px; font-family:Segoe UI }
  </style>

  <g class="card-animation">
    <rect width="100%" height="100%" rx="14" fill="url(#bg)"/>

    <!-- Floating Particles -->
    <g filter="url(#shadow-glow)">
      <circle cx="40" cy="160" r="1" fill="#a855f7" class="particle" style="animation-delay: 0s"/>
      <circle cx="400" cy="30" r="1.5" fill="#60a5fa" class="particle" style="animation-delay: 2s"/>
      <circle cx="200" cy="180" r="1" fill="#a855f7" class="particle" style="animation-delay: 4s"/>
      <circle cx="320" cy="140" r="1" fill="#60a5fa" class="particle" style="animation-delay: 1s"/>
      <circle cx="100" cy="20" r="1.5" fill="#a855f7" class="particle" style="animation-delay: 3s"/>
    </g>

    <!-- Title -->
    <text x="24" y="32" class="title">${escapeXml(user.login)}'s GitHub Stats</text>

    <!-- Stats -->
    <text x="24" y="64" class="label">Total Stars:</text>
    <text x="160" y="64" class="value">${formatNumber(totalStars)}</text>

    <text x="24" y="88" class="label">Total Commits:</text>
    <text x="160" y="88" class="value">${formatNumber(totalCommits)}</text>

    <text x="24" y="112" class="label">Total PRs:</text>
    <text x="160" y="112" class="value">${formatNumber(totalPRs)}</text>

    <text x="24" y="136" class="label">Contributed To:</text>
    <text x="160" y="136" class="value">${formatNumber(contributedTo)}</text>

    <!-- Score Ring -->
    <g transform="translate(350 100)">
      <!-- Aura / Mist -->
      <circle r="60" fill="url(#aura-gradient)" class="shadow-monarch" filter="url(#shadow-glow)"/>
      
      <circle r="52" fill="none" stroke="#1e1b4b" stroke-width="10" opacity="0.5"/>
      <circle
        r="52"
        fill="none"
        stroke="${color}"
        stroke-width="10"
        stroke-linecap="round"
        stroke-dasharray="${progress} ${circumference}"
        transform="rotate(-90)"
        class="${glow ? 'shadow-monarch' : ''}"
      />

      <!-- Orbiting Particles -->
      <g class="particle" style="animation-duration: 4s;">
         <circle cx="30" cy="-20" r="1" fill="#a855f7" opacity="0.6"/>
         <circle cx="-25" cy="35" r="1.5" fill="#3b82f6" opacity="0.5"/>
      </g>

      <text
        y="8"
        text-anchor="middle"
        font-size="26"
        font-weight="900"
        font-family="Segoe UI"
        class="${glow ? 'shadow-monarch' : ''}"
        fill="${color}">
        ${grade}
      </text>
    </g>
  </g>
</svg>
`;


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

function generateErrorSVG(message) {
    return `
<svg width="400" height="100" viewBox="0 0 400 100" xmlns="http://www.w3.org/2000/svg">
  <rect width="100%" height="100%" rx="10" fill="#0d1117" stroke="#30363d" stroke-width="1"/>
  <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#c9d1d9" font-family="Segoe UI, sans-serif" font-size="14" font-weight="600">
    ${escapeXml(message)}
  </text>
</svg>`.trim();
}

function formatNumber(num) {
    if (!Number.isFinite(num)) return "0K";

    const format = (value) =>
        value.toFixed(2).replace(/\.?0+$/, "");

    if (num >= 1000) {
        return `${format(num / 1000)}K`;
    }

    return format(num);
}
