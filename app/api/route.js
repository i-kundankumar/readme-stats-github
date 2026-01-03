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

    const headers = {
        Authorization: `Bearer ${token}`,
        "User-Agent": "Github-Stats-Card",
    };

    try {
        // 1️⃣ Prepare Requests (Parallel)
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

        // 2️⃣ Await Responses
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

        // 3️⃣ Calculate stats
        const totalStars = Array.isArray(repos)
            ? repos.reduce((sum, repo) => sum + repo.stargazers_count, 0)
            : 0;

        const totalPRs = contributions?.totalPullRequestContributions || 0;
        const totalCommits = contributions?.totalCommitContributions || 0;
        const contributedTo = contributions?.totalRepositoryContributions || 0;

        // Score calculation
        const score = Math.min(
            100,
            totalStars + user.followers + user.public_repos * 2
        );

        const grade =
            score > 90 ? "A++" : score > 75 ? "A+" : score > 60 ? "A" : "B";

        const circumference = 2 * Math.PI * 52;
        const progress = (score / 100) * circumference;

        // 3️⃣ SVG
        const svg = `
<svg width="450" height="200" viewBox="0 0 450 200" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0d1117"/>
      <stop offset="100%" stop-color="#161b22"/>
    </linearGradient>
  </defs>

  <rect width="100%" height="100%" rx="14" fill="url(#bg)"/>

  <style>
    .title { fill:#58a6ff; font-size:18px; font-weight:700; font-family:Segoe UI, sans-serif }
    .label { fill:#7ee787; font-size:14px; font-family:Segoe UI, sans-serif }
    .value { fill:#c9d1d9; font-size:14px; font-family:Segoe UI, sans-serif }
  </style>

  <!-- Title -->
  <text x="24" y="32" class="title">${escapeXml(user.login)}'s GitHub Stats</text>

  <!-- Left stats -->
  <text x="24" y="64" class="label">Total Stars:</text>
  <text x="160" y="64" class="value">${totalStars}</text>

  <text x="24" y="88" class="label">Total Commits:</text>
  <text x="160" y="88" class="value">${totalCommits}</text>

  <text x="24" y="112" class="label">Total PRs:</text>
  <text x="160" y="112" class="value">${totalPRs}</text>

  <text x="24" y="136" class="label">Contributed To:</text>
  <text x="160" y="136" class="value">${contributedTo}</text>

  <!-- Right circular score -->
  <g transform="translate(350 100)">
    <circle r="52" fill="none" stroke="#30363d" stroke-width="10"/>
    <circle
      r="52"
      fill="none"
      stroke="#58a6ff"
      stroke-width="10"
      stroke-dasharray="${progress} ${circumference}"
      transform="rotate(-90)"
    />

    <text y="8" text-anchor="middle" fill="#7ee787"
      font-size="26" font-weight="700" font-family="Segoe UI">
      ${grade}
    </text>
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
