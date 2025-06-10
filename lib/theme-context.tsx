"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

interface ThemeColors {
  primary: string
  secondary: string
  accent: string
  background: string
  foreground: string
  muted: string
  card: string
}

interface SiteAppearance {
  logo: string
  favicon: string
  theme: "light" | "dark" | "system" | "custom"
  customColors: ThemeColors
  fontFamily: string
  borderRadius: "none" | "small" | "medium" | "large"
  animations: boolean
  heroImage: string
}

interface ThemeContextType {
  appearance: SiteAppearance
  setAppearance: React.Dispatch<React.SetStateAction<SiteAppearance>>
  currentTheme: "light" | "dark" | "custom"
}

const defaultAppearance: SiteAppearance = {
  logo: "/logo.png",
  favicon: "/favicon.ico",
  theme: "system",
  customColors: {
    primary: "#0f766e",
    secondary: "#f97316",
    accent: "#0ea5e9",
    background: "#ffffff",
    foreground: "#0f172a",
    muted: "#f1f5f9",
    card: "#ffffff",
  },
  fontFamily: "Inter",
  borderRadius: "medium",
  animations: true,
  heroImage: "/hero-image.jpg",
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [appearance, setAppearance] = useState<SiteAppearance>(defaultAppearance)
  const [currentTheme, setCurrentTheme] = useState<"light" | "dark" | "custom">("light")

  // Charger les paramètres d'apparence depuis l'API
  useEffect(() => {
    const loadAppearance = async () => {
      try {
        const response = await fetch("/api/admin/appearance")
        if (response.ok) {
          const { data } = await response.json()
          if (data) {
            setAppearance(data)
          }
        }
      } catch (error) {
        console.error("Erreur lors du chargement des paramètres d'apparence:", error)
      }
    }

    loadAppearance()
  }, [])

  // Déterminer le thème actuel en fonction des préférences
  useEffect(() => {
    if (appearance.theme === "custom") {
      setCurrentTheme("custom")
    } else if (appearance.theme === "light") {
      setCurrentTheme("light")
    } else if (appearance.theme === "dark") {
      setCurrentTheme("dark")
    } else if (appearance.theme === "system") {
      // Détecter le thème du système
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
      setCurrentTheme(systemTheme)

      // Écouter les changements de thème du système
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
      const handleChange = (e: MediaQueryListEvent) => {
        setCurrentTheme(e.matches ? "dark" : "light")
      }

      mediaQuery.addEventListener("change", handleChange)
      return () => mediaQuery.removeEventListener("change", handleChange)
    }
  }, [appearance.theme])

  // Appliquer les styles CSS personnalisés
  useEffect(() => {
    if (currentTheme === "custom" && appearance.theme === "custom") {
      const root = document.documentElement
      const colors = appearance.customColors

      root.style.setProperty("--color-primary", colors.primary)
      root.style.setProperty("--color-secondary", colors.secondary)
      root.style.setProperty("--color-accent", colors.accent)
      root.style.setProperty("--color-background", colors.background)
      root.style.setProperty("--color-foreground", colors.foreground)
      root.style.setProperty("--color-muted", colors.muted)
      root.style.setProperty("--color-card", colors.card)

      // Appliquer la police
      root.style.setProperty("--font-family", appearance.fontFamily)

      // Appliquer le rayon de bordure
      let borderRadiusValue = "0.5rem"
      switch (appearance.borderRadius) {
        case "none":
          borderRadiusValue = "0"
          break
        case "small":
          borderRadiusValue = "0.25rem"
          break
        case "medium":
          borderRadiusValue = "0.5rem"
          break
        case "large":
          borderRadiusValue = "1rem"
          break
      }
      root.style.setProperty("--border-radius", borderRadiusValue)

      // Appliquer les animations
      if (!appearance.animations) {
        root.style.setProperty("--transition-duration", "0s")
      } else {
        root.style.setProperty("--transition-duration", "0.2s")
      }

      // Mettre à jour le favicon
      const faviconLink = document.querySelector('link[rel="icon"]') as HTMLLinkElement
      if (faviconLink && appearance.favicon) {
        faviconLink.href = appearance.favicon
      }
    }
  }, [currentTheme, appearance])

  return <ThemeContext.Provider value={{ appearance, setAppearance, currentTheme }}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}
