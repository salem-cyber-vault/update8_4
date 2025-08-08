import type React from "react"
import type { Metadata, Viewport } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "Salem Cyber Vault - Cyber Forensics & Digital Investigation Platform",
  description:
    "Stunning, intuitive cyber forensics dashboard for digital investigation professionals and legal teams. Explore cyber data with AI-powered insights and beautiful visualizations.",
  generator: 'Salem Cyber Vault',
  keywords: ['cyber forensics', 'digital investigation', 'cybersecurity', 'Shodan', 'threat intelligence', 'evidence timeline'],
  authors: [{ name: 'Salem Cyber Vault' }],
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#4A148C" />
        <meta name="description" content="Stunning, intuitive cyber forensics dashboard for digital investigation professionals and legal teams" />
      </head>
      <body className="font-sans antialiased">{children}</body>
    </html>
  )
}
