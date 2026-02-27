import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const lines = (searchParams.get("lines") || "Open Source Contributor;Building cool things")
    .split(";")
    .map((s) => s.trim());

  const width = parseInt(searchParams.get("width") || "700");
  const height = parseInt(searchParams.get("height") || "150");
  const color = searchParams.get("color") || "000000";
  const particleColorParam = searchParams.get("particleColor") || "ffffff";
  const background = searchParams.get("bg") || searchParams.get("background") || "0d1117";
  const font = searchParams.get("font") || "monospace";
  const size = parseInt(searchParams.get("size") || "24");
  const duration = parseInt(searchParams.get("speed") || searchParams.get("duration") || "120");
  const pause = parseInt(searchParams.get("pause") || "1000");
  const vCenter = searchParams.get("vCenter") !== "false";
  const loop = searchParams.get("loop") === "true";
  const align = searchParams.get("align") || "left";

  const fixColor = (c: string) => (/^[0-9a-fA-F]{3,6}$/.test(c) ? `#${c}` : c);
  const textColor = fixColor(color);
  const bgColor = fixColor(background);
  const particleColor = fixColor(particleColorParam);

  const charWidth = size * 0.6;
  const lineHeight = size * 1.5;
  const totalTextHeight = lines.length * lineHeight;

  const startY = vCenter ? (height - totalTextHeight) / 2 + size : size + 10;

  const particles = Array.from({ length: 1000 }).map(() => ({
    x: Math.round(Math.random() * width),
    y: Math.round(height + Math.random() * 20),
    s: Math.floor(Math.random() * 5),
    d: (Math.random() * 5).toFixed(1),
    du: (Math.random() * 3 + 3).toFixed(1),
    st: Math.floor(Math.random() * 3),
    c: particleColor,
  }));

  let css = `
    text {
      font-family: ${font};
      font-size: ${size}px;
      fill: ${textColor};
      white-space: pre;
      filter: url(#glow);
      letter-spacing: 1px;
    }
    .cursor {
      fill: ${textColor};
      filter: url(#glow);
    }
    .p {
      animation: var(--a) var(--d) linear infinite;
      animation-delay: var(--y);
    }
    @keyframes blink {
      0%, 100% { opacity: 1; }
      50% { opacity: 0; }
    }
    @keyframes rise-0 {
      0% { opacity: 0; transform: translate(0, 0) scale(1); }
      15% { opacity: 0.8; transform: translate(8px, -${(height + 50) * 0.15}px) scale(1.5); }
      50% { opacity: 0.4; transform: translate(-12px, -${(height + 50) * 0.5}px) scale(2.5); }
      100% { opacity: 0; transform: translate(6px, -${height + 50}px) scale(4); }
    }
    @keyframes rise-1 {
      0% { opacity: 0; transform: translate(0, 0) scale(1); }
      20% { opacity: 0.8; transform: translate(-10px, -${(height + 50) * 0.2}px) scale(1.5); }
      60% { opacity: 0.4; transform: translate(10px, -${(height + 50) * 0.6}px) scale(2.5); }
      100% { opacity: 0; transform: translate(-5px, -${height + 50}px) scale(4); }
    }
    @keyframes rise-2 {
      0% { opacity: 0; transform: translate(0, 0) scale(1); }
      25% { opacity: 0.8; transform: translate(5px, -${(height + 50) * 0.25}px) scale(1.5); }
      55% { opacity: 0.4; transform: translate(-8px, -${(height + 50) * 0.55}px) scale(2.5); }
      100% { opacity: 0; transform: translate(4px, -${height + 50}px) scale(4); }
    }
  `;

  if (!loop) {
    css += `
      @keyframes appear { to { opacity: 1; } }
      @keyframes disappear { to { opacity: 0; } }
    `;
  }

  let content = "";
  let currentDelay = 0;

  const lineDurations = lines.map((line) => line.length * duration);
  const totalDuration = lineDurations.reduce((a, b) => a + b + pause, 0);

  lines.forEach((line, i) => {
    const len = line.length;
    const lineDuration = lineDurations[i];
    const lineWidth = len * charWidth;
    const typeKey = `type${i}`;
    const moveKey = `move${i}`;

    if (loop) {
      const startPct = (currentDelay / totalDuration) * 100;
      const typeEndPct = ((currentDelay + lineDuration) / totalDuration) * 100;
      const showEndPct = ((currentDelay + lineDuration + pause) / totalDuration) * 100;

      css += `
        @keyframes ${typeKey} {
          0% { width: 0; }
          ${startPct}% { width: 0; animation-timing-function: steps(${len || 1}, end); }
          ${typeEndPct}% { width: ${lineWidth}px; animation-timing-function: step-end; }
          100% { width: ${lineWidth}px; }
        }
        @keyframes ${moveKey} {
          0% { transform: translateX(0); }
          ${startPct}% { transform: translateX(0); animation-timing-function: steps(${len || 1}, end); }
          ${typeEndPct}% { transform: translateX(${lineWidth}px); animation-timing-function: step-end; }
          100% { transform: translateX(${lineWidth}px); }
        }
        @keyframes vis${i} {
          0% { opacity: 0; }
          ${startPct}% { opacity: 1; }
          ${showEndPct}% { opacity: 0; }
          100% { opacity: 0; }
        }
        .clip-${i} { width: 0; animation: ${typeKey} ${totalDuration}ms infinite; }
        .cursor-vis-${i} { opacity: 0; animation: vis${i} ${totalDuration}ms step-end infinite; }
        .cursor-move-${i} { animation: ${moveKey} ${totalDuration}ms infinite, blink 1s step-end infinite; }
      `;
    } else {
      css += `
        @keyframes ${typeKey} { to { width: ${lineWidth}px; } }
        @keyframes ${moveKey} { to { transform: translateX(${lineWidth}px); } }
        .clip-${i} { width: 0; animation: ${typeKey} ${lineDuration}ms steps(${len || 1}, end) ${currentDelay}ms forwards; }
        .cursor-vis-${i} { opacity: 0; animation: appear 0s step-end ${currentDelay}ms forwards${i < lines.length - 1 ? `, disappear 0s step-end ${currentDelay + lineDuration + pause}ms forwards` : ""}; }
        .cursor-move-${i} { 
          animation-name: ${moveKey}, blink; 
          animation-duration: ${lineDuration}ms, 1s; 
          animation-timing-function: steps(${len || 1}, end), step-end; 
          animation-delay: ${currentDelay}ms, ${currentDelay + lineDuration}ms; 
          animation-fill-mode: forwards, none; 
          animation-iteration-count: 1, infinite;
        }
      `;
    }

    let xPos = 20;
    if (align === "center") {
      xPos = (width - lineWidth) / 2;
    } else if (align === "right") {
      xPos = width - lineWidth - 20;
    }

    const yPos = startY + i * lineHeight;
    const cursorHeight = 3;
    const cursorY = 2;

    content += `
      <g transform="translate(${xPos}, ${yPos})">
        <defs><clipPath id="clip${i}"><rect class="clip-${i}" x="0" y="-${size}" width="0" height="${lineHeight}" /></clipPath></defs>
        <text clip-path="url(#clip${i})">${line}</text>
        <g class="cursor-vis-${i}"><rect class="cursor cursor-move-${i}" x="0" y="${cursorY}" width="${charWidth}" height="${cursorHeight}" /></g>
      </g>
    `;

    currentDelay += lineDuration + pause;
  });

  const svg = `
<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="2" result="blur"/>
      <feMerge>
        <feMergeNode in="blur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
    <filter id="smoke" filterUnits="userSpaceOnUse" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur in="SourceGraphic" stdDeviation="2" /></filter>
    <circle id="p0" r="5" />
    <circle id="p1" r="8" />
    <circle id="p2" r="11" />
    <circle id="p3" r="14" />
    <circle id="p4" r="17" />
  </defs>
  <style>
    ${css}
  </style>
  <rect width="100%" height="100%" fill="${bgColor}" rx="6" />
  <g filter="url(#smoke)">${particles.map((p) => `<g transform="translate(${p.x}, ${p.y})"><use href="#p${p.s}" class="p" style="--a:rise-${p.st};--d:${p.du}s;--y:-${p.d}s;fill:${p.c}" /></g>`).join("")}</g>
  ${content}
</svg>
`.trim();

  return new NextResponse(svg, {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
