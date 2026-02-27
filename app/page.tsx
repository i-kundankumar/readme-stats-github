"use client";

import { useState, useEffect } from "react";

function StatsCard({
  title,
  imgUrl,
  markdown,
  onCopy,
  copied,
  hasError,
  onError,
}: {
  title: string;
  imgUrl: string;
  markdown: string;
  onCopy: () => void;
  copied: boolean;
  hasError: boolean;
  onError: () => void;
}) {
  return (
    <div className="group relative flex flex-col bg-white dark:bg-[#0d1117] rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      {/* Header */}
      <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between bg-gray-50/50 dark:bg-gray-900/50 rounded-t-2xl">
        <h3 className="font-semibold text-gray-700 dark:text-gray-200 text-sm tracking-wide uppercase">
          {title}
        </h3>
        <div className="flex space-x-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-400/80"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/80"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-green-400/80"></div>
        </div>
      </div>

      {/* Image Area */}
      <div className="p-6 flex items-center justify-center min-h-[200px] bg-gray-50/30 dark:bg-[#010409]">
        {hasError ? (
          <div className="flex flex-col items-center justify-center text-gray-400 dark:text-gray-500 animate-pulse">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-10 h-10 mb-3 opacity-50"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
              />
            </svg>
            <span className="text-sm font-medium">Preview unavailable</span>
          </div>
        ) : (
          <img
            src={imgUrl}
            alt={`${title} Preview`}
            className="max-w-full h-auto rounded-lg shadow-lg transform transition-transform duration-500 group-hover:scale-[1.02]"
            onError={onError}
            loading="lazy"
          />
        )}
      </div>

      {/* Code Area */}
      <div className="bg-gray-50 dark:bg-[#161b22] p-4 rounded-b-2xl border-t border-gray-100 dark:border-gray-800">
        <div className="relative">
          <pre className="text-xs font-mono text-gray-600 dark:text-gray-300 overflow-x-auto p-3 pr-10 rounded-lg bg-white dark:bg-[#0d1117] border border-gray-200 dark:border-gray-700 shadow-inner">
            <code>{markdown}</code>
          </pre>
          <button
            onClick={onCopy}
            className={`absolute top-2 right-2 p-1.5 rounded-md transition-all duration-200 ${copied
              ? "bg-green-500 text-white shadow-lg shadow-green-500/30"
              : "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
            title="Copy Markdown"
          >
            {copied ? (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const [username, setUsername] = useState("octocat");
  const [debouncedUsername, setDebouncedUsername] = useState("octocat");
  const [repo, setRepo] = useState("Hello-World");
  const [debouncedRepo, setDebouncedRepo] = useState("Hello-World");
  const [copiedStats, setCopiedStats] = useState(false);
  const [copiedLangs, setCopiedLangs] = useState(false);
  const [copiedRepo, setCopiedRepo] = useState(false);
  const [copiedTyping, setCopiedTyping] = useState(false);
  const [imageErrors, setImageErrors] = useState({
    stats: false,
    langs: false,
    repo: false,
    typing: false,
  });
  const [mounted, setMounted] = useState(false);

  // Debounce input to prevent rate-limiting the API
  useEffect(() => {
    const handler = setTimeout(() => {
      if (username.trim()) {
        setDebouncedUsername(username.trim());
      }
    }, 600);
    return () => clearTimeout(handler);
  }, [username]);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (repo.trim()) {
        setDebouncedRepo(repo.trim());
      }
    }, 600);
    return () => clearTimeout(handler);
  }, [repo]);

  // Reset errors when username changes
  useEffect(() => {
    setImageErrors((prev) => ({
      ...prev,
      stats: false,
      langs: false,
      repo: false,
      typing: false,
    }));
  }, [debouncedUsername]);

  useEffect(() => {
    setImageErrors((prev) => ({ ...prev, repo: false }));
  }, [debouncedRepo]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const origin =
    mounted && typeof window !== "undefined"
      ? window.location.origin
      : "https://readme-stats-github.pages.dev";

  const cardUrl = `${origin}/api?username=${debouncedUsername}`;
  const markdown = `![${debouncedUsername}'s GitHub Stats](${cardUrl})`;

  const topLangsUrl = `${origin}/api/top-langs?username=${debouncedUsername}`;
  const topLangsMarkdown = `![Top Languages](${topLangsUrl})`;

  const repoUrl = `${origin}/api/repo?username=${debouncedUsername}&repo=${debouncedRepo}`;
  const repoMarkdown = `!Repo Stats`;

  const typingUrl = `${origin}/api/typing?username=${debouncedUsername}`;
  const typingMarkdown = `!Typing SVG`;

  const handleCopy = async (text: string, setCopied: (val: boolean) => void) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#050505] text-gray-900 dark:text-gray-100 font-sans selection:bg-blue-500/20">
      {/* Background Grid Pattern */}
      <div className="fixed inset-0 -z-10 h-full w-full bg-white dark:bg-[#050505] bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]"></div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500 dark:from-blue-400 dark:to-cyan-300">
            GitHub Stats Generator
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Create dynamic, real-time SVG stats cards for your GitHub README.
            Showcase your stars, commits, languages, and more with style.
          </p>
        </div>

        {/* Inputs */}
        <div className="max-w-3xl mx-auto bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label
                htmlFor="username"
                className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-blue-500">
                  <path d="M10 8a3 3 0 100-6 3 3 0 000 6zM3.465 14.493a1.23 1.23 0 00.41 1.412A9.957 9.957 0 0010 18c2.31 0 4.438-.784 6.131-2.1.43-.333.604-.903.408-1.41a7.002 7.002 0 00-13.074.003z" />
                </svg>
                GitHub Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all shadow-sm"
                placeholder="e.g. octocat"
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="repo"
                className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-green-500">
                  <path d="M6.5 3c-1.051 0-2.093.04-3.125.117A1.49 1.49 0 002 4.607V10.5h9V4.606c0-.771-.59-1.43-1.375-1.489A41.568 41.568 0 006.5 3zM2 12v2.5A1.5 1.5 0 003.5 16h.041a3 3 0 015.918 0h.791a.75.75 0 00.75-.75V12H2z" />
                  <path d="M6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3zM13.25 5a.75.75 0 00-.75.75v8.514a3.001 3.001 0 014.893 1.44c.37-.275.61-.719.595-1.227a24.905 24.905 0 00-1.784-8.549A1.486 1.486 0 0014.823 5H13.25z" />
                </svg>
                Repository Name
              </label>
              <input
                id="repo"
                type="text"
                value={repo}
                onChange={(e) => setRepo(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 focus:ring-2 focus:ring-green-500/50 focus:border-green-500 outline-none transition-all shadow-sm"
                placeholder="e.g. readme-stats-github"
              />
            </div>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          <StatsCard
            title="Profile Stats"
            imgUrl={cardUrl}
            markdown={markdown}
            onCopy={() => handleCopy(markdown, setCopiedStats)}
            copied={copiedStats}
            hasError={imageErrors.stats}
            onError={() => setImageErrors((prev) => ({ ...prev, stats: true }))}
          />
          <StatsCard
            title="Top Languages"
            imgUrl={topLangsUrl}
            markdown={topLangsMarkdown}
            onCopy={() => handleCopy(topLangsMarkdown, setCopiedLangs)}
            copied={copiedLangs}
            hasError={imageErrors.langs}
            onError={() => setImageErrors((prev) => ({ ...prev, langs: true }))}
          />
          <StatsCard
            title="Repository Stats"
            imgUrl={repoUrl}
            markdown={repoMarkdown}
            onCopy={() => handleCopy(repoMarkdown, setCopiedRepo)}
            copied={copiedRepo}
            hasError={imageErrors.repo}
            onError={() => setImageErrors((prev) => ({ ...prev, repo: true }))}
          />
          <StatsCard
            title="Typing SVG"
            imgUrl={typingUrl}
            markdown={typingMarkdown}
            onCopy={() => handleCopy(typingMarkdown, setCopiedTyping)}
            copied={copiedTyping}
            hasError={imageErrors.typing}
            onError={() => setImageErrors((prev) => ({ ...prev, typing: true }))}
          />
        </div>
      </main>
    </div>
  );
}
