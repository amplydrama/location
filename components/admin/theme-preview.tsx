"use client"

import type React from "react"

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { Car, Calendar, CreditCard, MessageSquare, Menu, Search } from "lucide-react"

interface ThemePreviewProps {
  appearance: any
  mode: "desktop" | "mobile"
}

export function ThemePreview({ appearance, mode }: ThemePreviewProps) {
  const { customColors, logo, theme } = appearance

  // Appliquer les couleurs personnalisées si le thème est personnalisé
  const colors =
    theme === "custom"
      ? customColors
      : {
          primary: "#0f766e",
          secondary: "#f97316",
          accent: "#0ea5e9",
          background: "#ffffff",
          foreground: "#0f172a",
          muted: "#f1f5f9",
          card: "#ffffff",
        }

  // Styles CSS personnalisés basés sur les couleurs du thème
  const customStyles = {
    "--color-primary": colors.primary,
    "--color-secondary": colors.secondary,
    "--color-accent": colors.accent,
    "--color-background": colors.background,
    "--color-foreground": colors.foreground,
    "--color-muted": colors.muted,
    "--color-card": colors.card,
  } as React.CSSProperties

  return (
    <div
      className={cn(
        "overflow-hidden transition-all border rounded-lg",
        mode === "mobile" ? "w-[320px] mx-auto" : "w-full",
      )}
      style={{
        ...customStyles,
        backgroundColor: "var(--color-background)",
        color: "var(--color-foreground)",
      }}
    >
      {/* Header */}
      <div className="p-3 flex items-center justify-between border-b" style={{ backgroundColor: "var(--color-card)" }}>
        <div className="flex items-center space-x-2">
          {logo ? (
            <img src={logo || "/placeholder.svg"} alt="Logo" className="h-6" />
          ) : (
            <div className="font-bold text-lg" style={{ color: "var(--color-primary)" }}>
              CarLoc
            </div>
          )}
        </div>
        <div className="flex items-center space-x-2">
          {mode === "mobile" ? (
            <Menu size={20} />
          ) : (
            <>
              <Button size="sm" variant="ghost" className="text-xs" style={{ color: "var(--color-foreground)" }}>
                Véhicules
              </Button>
              <Button size="sm" variant="ghost" className="text-xs" style={{ color: "var(--color-foreground)" }}>
                Réservation
              </Button>
              <Button size="sm" variant="ghost" className="text-xs" style={{ color: "var(--color-foreground)" }}>
                Contact
              </Button>
              <Button
                size="sm"
                className="text-xs"
                style={{
                  backgroundColor: "var(--color-primary)",
                  color: "#ffffff",
                }}
              >
                Connexion
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4">
        {/* Search */}
        <div className="flex items-center p-2 rounded-md" style={{ backgroundColor: "var(--color-muted)" }}>
          <Search size={16} className="mr-2" style={{ color: "var(--color-foreground)" }} />
          <span className="text-xs opacity-70">Rechercher un véhicule...</span>
        </div>

        {/* Featured car */}
        <Card
          style={{
            backgroundColor: "var(--color-card)",
            borderColor: "var(--color-muted)",
          }}
        >
          <CardHeader className="p-3 pb-0">
            <div className="flex justify-between items-center">
              <CardTitle className="text-sm" style={{ color: "var(--color-foreground)" }}>
                Toyota Corolla
              </CardTitle>
              <Badge
                style={{
                  backgroundColor: "var(--color-accent)",
                  color: "#ffffff",
                }}
                className="text-[10px]"
              >
                Populaire
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-3">
            <div
              className="w-full h-20 rounded flex items-center justify-center"
              style={{ backgroundColor: "var(--color-muted)" }}
            >
              <Car size={mode === "mobile" ? 24 : 32} style={{ color: "var(--color-primary)" }} />
            </div>
            <div className="grid grid-cols-2 gap-1 mt-2">
              <div className="flex items-center text-[10px]">
                <Calendar size={10} className="mr-1" />
                <span>2023</span>
              </div>
              <div className="flex items-center text-[10px]">
                <CreditCard size={10} className="mr-1" />
                <span>25,000 FCFA/jour</span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="p-3 pt-0">
            <Button
              size="sm"
              className="w-full text-[10px]"
              style={{
                backgroundColor: "var(--color-primary)",
                color: "#ffffff",
              }}
            >
              Réserver maintenant
            </Button>
          </CardFooter>
        </Card>

        {/* Chat widget */}
        <div className="flex justify-end">
          <Button
            size="sm"
            className="rounded-full w-8 h-8 p-0 flex items-center justify-center"
            style={{
              backgroundColor: "var(--color-secondary)",
              color: "#ffffff",
            }}
          >
            <MessageSquare size={14} />
          </Button>
        </div>
      </div>

      {/* Footer */}
      <div
        className="p-2 border-t text-center text-[10px]"
        style={{
          backgroundColor: "var(--color-card)",
          color: "var(--color-foreground)",
          opacity: 0.7,
        }}
      >
        © 2023 CarLoc Cameroun. Tous droits réservés.
      </div>
    </div>
  )
}
