import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: "#0d1117",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: {
    default: "GitHub Stats Card Generator",
    template: "%s | GitHub Stats",
  },
  description:
    "Generate dynamic, real-time SVG stats cards for your GitHub profile README. Showcase your stars, commits, PRs, and contributions.",
  keywords: ["GitHub", "Stats", "SVG", "Profile", "Readme", "Generator"],
  openGraph: {
    type: "website",
    locale: "en_US",
    title: "GitHub Stats Card Generator",
    description: "Generate dynamic SVG stats cards for your GitHub profile.",
    siteName: "GitHub Stats Card",
  },
  twitter: {
    card: "summary_large_image",
    title: "GitHub Stats Card Generator",
    description: "Generate dynamic SVG stats cards for your GitHub profile.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
