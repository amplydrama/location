import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { AIChatWidget } from "@/components/chat/ai-chat-widget"
import { Toaster } from 'react-hot-toast'
import { LogoutButton } from "@/components/logout"

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
    <html lang="fr" className="">
      <body>
        <Toaster
          position="bottom-right" // Position des toasts
          reverseOrder={false}     // Pour que les nouveaux toasts apparaissent en bas
          toastOptions={{
            // Styles pour tous les toasts
            style: {
              background: '#363636',
              color: '#fff',
            },
            // Styles pour les succès
            success: {
              style: {
                background: '#4CAF50', // Vert pour le succès
              },
            },
            // Styles pour les erreurs
            error: {
              style: {
                background: '#F44336', // Rouge pour l'erreur
              },
            },
          }}
        />
        {children}
          <LogoutButton 
            variant="destructive" // Par exemple, un bouton rouge pour la déconnexion
            className="w-full" // Prend toute la largeur de son conteneur
            buttonText="Déconnexion"
          />
      
        <AIChatWidget />
        
      </body>
    </html>
  )
}
