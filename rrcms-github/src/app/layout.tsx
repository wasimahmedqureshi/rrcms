import type { Metadata } from "next";
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

export const metadata: Metadata = {
  title: "RRCMS - Rajasthan Revenue Court Management System",
  description: "A comprehensive web application for managing revenue court cases in Rajasthan. Features include case registration, disposal tracking, MPR reports, and real-time analytics.",
  keywords: ["RRCMS", "Rajasthan", "Revenue Court", "Case Management", "Government Portal", "MPR Reports"],
  authors: [{ name: "RRCMS Team" }],
  icons: {
    icon: "/logo.svg",
  },
  manifest: "/manifest.json",
  openGraph: {
    title: "RRCMS - Rajasthan Revenue Court Management System",
    description: "Comprehensive revenue court case management for Rajasthan Government",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#1d4ed8" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
      </body>
    </html>
  );
}
