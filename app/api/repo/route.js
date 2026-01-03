import { NextResponse } from "next/server";

export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const username = searchParams.get("username");
    const repo = searchParams.get("repo");

    if (!username || !repo) {
        return new NextResponse(
            "username and repo query parameters are required",
            { status: 400 }
        );
    }

    const headers = {
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        "User-Agent": "Github-Stats-Card",
    };

    // Fetch repo data
    const res = await fetch(
        `https://api.github.com/repos/${username}/${repo}`,
        { headers, next: { revalidate: 3600 } }
    );

    if (!res.ok) {
        return new NextResponse("Repository not found", { status: 404 });
    }

    const data = await res.json();

    const starPath = "M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.75.75 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Z";
    const forkPath = "M5 3.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm0 2.122a2.25 2.25 0 1 0-1.5 0v.878A2.25 2.25 0 0 0 5.75 8.5h1.5v2.128a2.251 2.251 0 1 0 1.5 0V8.5h1.5a2.25 2.25 0 0 0 2.25-2.25v-.878a2.25 2.25 0 1 0-1.5 0v.878a.75.75 0 0 1-.75.75h-4.5A.75.75 0 0 1 5 6.25v-.878Zm3.75 7.378a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm3-8.75a.75.75 0 1 0 0-1.5 .75.75 0 0 0 0 1.5Z";
    const eyePath = "M8 2c1.981 0 3.671.992 4.933 2.078 1.27 1.091 2.187 2.345 2.637 3.023a1.62 1.62 0 0 1 0 1.798c-.45.678-1.367 1.932-2.637 3.023C11.67 13.008 9.981 14 8 14c-1.981 0-3.671-.992-4.933-2.078C1.797 10.83.88 9.576.43 8.898a1.62 1.62 0 0 1 0-1.798c.45-.678 1.367-1.932 2.637-3.023C4.33 2.992 6.019 2 8 2ZM1.679 7.932a.12.12 0 0 0 0 .136c.411.622 1.241 1.75 2.366 2.717C5.175 11.758 6.527 12.5 8 12.5c1.473 0 2.825-.742 3.955-1.715 1.124-.967 1.954-2.096 2.366-2.717a.12.12 0 0 0 0-.136c-.412-.621-1.242-1.75-2.366-2.717C10.825 4.242 9.473 3.5 8 3.5c-1.473 0-2.825.742-3.955 1.715-1.124.967-1.954 2.096-2.366 2.717ZM8 10a2 2 0 1 1 0-4 2 2 0 0 1 0 4Zm0-1.5a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1Z";

    // Language Colors
    const colors = {
        JavaScript: "#f1e05a", TypeScript: "#3178c6", Python: "#3572A5", Java: "#b07219",
        Go: "#00ADD8", Rust: "#dea584", C: "#555555", "C++": "#f34b7d", "C#": "#178600",
        PHP: "#4F5D95", Ruby: "#701516", Swift: "#F05138", Kotlin: "#A97BFF", Dart: "#00B4AB",
        HTML: "#e34c26", CSS: "#563d7c", Vue: "#41b883", React: "#61dafb"
    };
    const langColor = colors[data.language] || "#8b949e";

    const description = data.description || "No description provided";

    // Wrap description (max 2 lines)
    const maxLen = 55;
    let descLines = [description];
    if (description.length > maxLen) {
        let splitIndex = description.lastIndexOf(" ", maxLen);
        if (splitIndex === -1) splitIndex = maxLen;
        descLines = [
            description.substring(0, splitIndex),
            description.substring(splitIndex).trim().substring(0, maxLen) + (description.length > maxLen * 2 ? "..." : "")
        ];
    }

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
    .title { fill: #58a6ff; font-size: 18px; font-weight: 700; font-family: 'Segoe UI', Ubuntu, Sans-Serif; }
    .desc { fill: #c9d1d9; font-size: 14px; font-family: 'Segoe UI', Ubuntu, Sans-Serif; }
    .stat-text { fill: #8b949e; font-size: 12px; font-family: 'Segoe UI', Ubuntu, Sans-Serif; }
    .icon { fill: #c9d1d9; }
    
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .card-content { opacity: 0; animation: fadeIn 0.5s ease-out forwards; }
  </style>

  <g class="card-content">
    <!-- Repo Icon & Name -->
    <g transform="translate(25, 35)">
        <path class="icon" d="M2 2.5A2.5 2.5 0 014.5 0h8.75a.75.75 0 01.75.75v12.5a.75.75 0 01-.75.75h-2.5a.75.75 0 010-1.5h1.75V2h-8a1 1 0 00-1 1v6.75a.75.75 0 01-1.5 0V3zm3 11a.75.75 0 01.75-.75h2.75a.75.75 0 010 1.5h-2.75a.75.75 0 01-.75-.75zm0-3a.75.75 0 01.75-.75h5.75a.75.75 0 010 1.5h-5.75a.75.75 0 01-.75-.75z" transform="scale(1.2)"/>
        <text x="28" y="12" class="title">${escapeXml(data.name)}</text>
    </g>

    <!-- Description -->
    <g transform="translate(25, 80)">
        ${descLines.map((line, i) => `<text y="${i * 20}" class="desc">${escapeXml(line)}</text>`).join("")}
    </g>

    <!-- Stats -->
    <g transform="translate(25, 145)">
        <!-- Language -->
        <circle cx="5" cy="6" r="5" fill="${langColor}"/>
        <text x="18" y="10" class="stat-text">${escapeXml(data.language || "Unknown")}</text>

        <!-- Stars -->
        <g transform="translate(120, 0)">
            <path d="${starPath}" fill="#e3b341" transform="translate(0, 2) scale(0.8)"/>
            <text x="18" y="10" class="stat-text">${data.stargazers_count}</text>
        </g>

        <!-- Forks -->
        <g transform="translate(200, 0)">
            <path d="${forkPath}" fill="#8b949e" transform="translate(0, 2) scale(0.8)"/>
            <text x="18" y="10" class="stat-text">${data.forks_count}</text>
        </g>

        <!-- Watchers -->
        <g transform="translate(280, 0)">
            <path d="${eyePath}" fill="#8b949e" transform="translate(0, 2) scale(0.8)"/>
            <text x="22" y="10" class="stat-text">${data.subscribers_count || 0}</text>
        </g>
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
