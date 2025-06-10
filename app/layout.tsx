import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { AIChatWidget } from "@/components/chat/ai-chat-widget"

export const metadata: Metadata = {
  title: "CarLoc Cameroun - Location de voitures",
  description: "Location de voitures au Cameroun - Service professionnel et fiable avec paiement Mobile Money",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr">
      <body>
        {children}
        <AIChatWidget />
      </body>
    </html>
  )
}
