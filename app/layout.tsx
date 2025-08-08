import type React from "react"
import type { Metadata } from "next"
import { Toaster } from "sonner"
import "./globals.css"

export const metadata: Metadata = {
  title: "Cyber Watch Vault - Internet Intelligence Platform",
  description:
    "Advanced cybersecurity intelligence platform for discovering and analyzing internet-connected devices and services.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className="font-sans">
        {children}
        <Toaster 
          theme="dark" 
          position="bottom-right"
          toastOptions={{
            style: {
              background: 'rgb(30 41 59)',
              border: '1px solid rgb(71 85 105)',
              color: 'rgb(241 245 249)',
            },
          }}
        />
      </body>
    </html>
  )
}
