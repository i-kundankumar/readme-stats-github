"use client";

import { useState, useEffect } from "react";

export default function Home() {
  const [username, setUsername] = useState("octocat");
  const [debouncedUsername, setDebouncedUsername] = useState("octocat");
  const [copiedStats, setCopiedStats] = useState(false);
  const [copiedLangs, setCopiedLangs] = useState(false);

  // Debounce input to prevent rate-limiting the API
  useEffect(() => {
    const handler = setTimeout(() => {
      if (username.trim()) {
        setDebouncedUsername(username.trim());
      }
    }, 600);
    return () => clearTimeout(handler);
  }, [username]);

  const origin =
    typeof window !== "undefined"
      ? window.location.origin
      : "https://readme-stats-github.pages.dev";

  const cardUrl = `${origin}/api?username=${debouncedUsername}`;
  const markdown = `![${debouncedUsername}'s GitHub Stats](${cardUrl})`;

  const topLangsUrl = `${origin}/api/top-langs?username=${debouncedUsername}`;
  const topLangsMarkdown = `![Top Languages](${topLangsUrl})`;

  const handleCopy = (text: string, setCopied: (val: boolean) => void) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 gap-10 max-w-6xl mx-auto font-sans">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-5xl font-extrabold tracking-tight bg-gradient-to-r from-blue-500 to-teal-400 bg-clip-text text-transparent">
          GitHub Stats Generator
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-lg mx-auto">
          Generate dynamic, real-time SVG stats cards for your GitHub profile
          README.
        </p>
      </div>

      {/* Input */}
      <div className="w-full max-w-sm space-y-2">
        <label
          htmlFor="username"
          className="text-sm font-semibold text-gray-700 dark:text-gray-300"
        >
          GitHub Username
        </label>
        <input
          id="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-sm"
          placeholder="e.g. octocat"
        />
      </div>

      {/* Preview */}
      <div className="flex flex-col xl:flex-row gap-8 items-center justify-center w-full">
        {/* Main Stats */}
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-teal-400 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
          <div className="relative bg-white dark:bg-[#0d1117] rounded-xl border border-gray-200 dark:border-gray-800 p-2 shadow-2xl">
            <img
              src={cardUrl}
              alt={`${debouncedUsername}'s github stats`}
              className="w-full h-auto rounded-lg"
              width={450}
              height={200}
            />
          </div>
        </div>

        {/* Top Langs */}
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-pink-600 to-purple-400 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
          <div className="relative bg-white dark:bg-[#0d1117] rounded-xl border border-gray-200 dark:border-gray-800 p-2 shadow-2xl">
            <img
              src={topLangsUrl}
              alt={`${debouncedUsername}'s top languages`}
              className="w-full h-auto rounded-lg"
              width={450}
              height={200}
            />
          </div>
        </div>
      </div>

      {/* Code Snippet */}
      <div className="w-full max-w-5xl grid md:grid-cols-2 gap-6">
        {/* Stats Markdown */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              Stats Card Markdown
            </label>
            <button
              onClick={() => handleCopy(markdown, setCopiedStats)}
              className={`text-xs px-3 py-1.5 rounded-md font-medium transition-all ${copiedStats
                ? "bg-green-500 text-white"
                : "bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700"
                }`}
            >
              {copiedStats ? "Copied!" : "Copy"}
            </button>
          </div>
          <div className="relative">
            <pre className="p-4 rounded-lg bg-gray-100 dark:bg-[#161b22] overflow-x-auto text-sm font-mono border border-gray-200 dark:border-gray-800 text-gray-800 dark:text-gray-300">
              <code>{markdown}</code>
            </pre>
          </div>
        </div>

        {/* Langs Markdown */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              Top Langs Markdown
            </label>
            <button
              onClick={() => handleCopy(topLangsMarkdown, setCopiedLangs)}
              className={`text-xs px-3 py-1.5 rounded-md font-medium transition-all ${copiedLangs
                ? "bg-green-500 text-white"
                : "bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700"
                }`}
            >
              {copiedLangs ? "Copied!" : "Copy"}
            </button>
          </div>
          <div className="relative">
            <pre className="p-4 rounded-lg bg-gray-100 dark:bg-[#161b22] overflow-x-auto text-sm font-mono border border-gray-200 dark:border-gray-800 text-gray-800 dark:text-gray-300">
              <code>{topLangsMarkdown}</code>
            </pre>
          </div>
        </div>
      </div>
    </main>
  );
}
