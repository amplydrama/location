"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { Sidebar } from "@/components/admin/Sidebar"
import  Cookies  from "js-cookie";
import { Toaster } from 'react-hot-toast';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkAuth = () => {
      const session = Cookies.get("adminSession")
      if (session) {
        setIsAuthenticated(true)
      } else if (pathname !== "/login") {
        router.push("/login")
        return
      }
      setIsLoading(false)
    }

    checkAuth()
  }, [pathname, router])

  // Si on est sur la page de login, afficher seulement le contenu
  if (pathname === "/login") {
    return <>{children}</>
  }

  // Afficher un loader pendant la vérification
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  // Si pas authentifié, ne rien afficher (redirection en cours)
  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 overflow-auto">
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
        <div className="p-6">{children}</div>
      </main>
    </div>
  )
}
