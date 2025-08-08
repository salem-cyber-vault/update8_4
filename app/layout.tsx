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
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      </head>
      <body className="font-sans antialiased">{children}</body>
    </html>
  )
}
