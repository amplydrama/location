"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Download, Upload, FileText, Check, AlertTriangle, X, Copy, Package, Tag, Calendar, User } from "lucide-react"

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

interface ThemeConfiguration {
  name: string
  description: string
  version: string
  createdAt: string
  author: string
  appearance: SiteAppearance
  metadata: {
    tags: string[]
    category: string
    compatibility: string
  }
}

interface ThemeExportImportProps {
  appearance: SiteAppearance
  onImport: (appearance: SiteAppearance) => void
  onClose: () => void
}

export function ThemeExportImport({ appearance, onImport, onClose }: ThemeExportImportProps) {
  const [activeTab, setActiveTab] = useState<"export" | "import" | "library">("export")
  const [exportConfig, setExportConfig] = useState({
    name: "Mon Thème Personnalisé",
    description: "Configuration de thème exportée depuis l'administration",
    author: "Administrateur",
    tags: ["personnalisé", "export"],
    category: "business",
  })
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle")
  const [statusMessage, setStatusMessage] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Thèmes prédéfinis dans la bibliothèque
  const themeLibrary: ThemeConfiguration[] = [
    {
      name: "Thème Cameroun Officiel",
      description: "Thème aux couleurs officielles du Cameroun avec design moderne",
      version: "1.0.0",
      createdAt: "2024-01-15T10:00:00Z",
      author: "Équipe Design",
      appearance: {
        logo: "/logo.png",
        favicon: "/favicon.ico",
        theme: "custom",
        customColors: {
          primary: "#007a5e",
          secondary: "#ce1126",
          accent: "#fcd116",
          background: "#ffffff",
          foreground: "#0f172a",
          muted: "#f1f5f9",
          card: "#ffffff",
        },
        fontFamily: "Poppins",
        borderRadius: "medium",
        animations: true,
        heroImage: "/hero-cameroon.jpg",
      },
      metadata: {
        tags: ["cameroun", "officiel", "patriotique"],
        category: "national",
        compatibility: "v1.0+",
      },
    },
    {
      name: "Thème Sombre Élégant",
      description: "Design sombre moderne avec accents colorés pour une expérience premium",
      version: "1.2.0",
      createdAt: "2024-01-10T14:30:00Z",
      author: "Designer Pro",
      appearance: {
        logo: "/logo-dark.png",
        favicon: "/favicon.ico",
        theme: "custom",
        customColors: {
          primary: "#22d3ee",
          secondary: "#f43f5e",
          accent: "#a855f7",
          background: "#0f172a",
          foreground: "#f8fafc",
          muted: "#1e293b",
          card: "#1e293b",
        },
        fontFamily: "Inter",
        borderRadius: "large",
        animations: true,
        heroImage: "/hero-dark.jpg",
      },
      metadata: {
        tags: ["sombre", "moderne", "premium"],
        category: "dark",
        compatibility: "v1.0+",
      },
    },
    {
      name: "Thème Tropical",
      description: "Couleurs vives inspirées de la nature tropicale africaine",
      version: "1.1.0",
      createdAt: "2024-01-05T09:15:00Z",
      author: "Nature Studio",
      appearance: {
        logo: "/logo.png",
        favicon: "/favicon.ico",
        theme: "custom",
        customColors: {
          primary: "#059669",
          secondary: "#f59e0b",
          accent: "#dc2626",
          background: "#f0fdf4",
          foreground: "#064e3b",
          muted: "#dcfce7",
          card: "#ffffff",
        },
        fontFamily: "Montserrat",
        borderRadius: "small",
        animations: true,
        heroImage: "/hero-tropical.jpg",
      },
      metadata: {
        tags: ["tropical", "nature", "coloré"],
        category: "nature",
        compatibility: "v1.0+",
      },
    },
  ]

  const showStatus = (type: "success" | "error", message: string) => {
    setStatus(type)
    setStatusMessage(message)
    setTimeout(() => {
      setStatus("idle")
      setStatusMessage("")
    }, 3000)
  }

  const handleExport = () => {
    try {
      const themeConfig: ThemeConfiguration = {
        name: exportConfig.name,
        description: exportConfig.description,
        version: "1.0.0",
        createdAt: new Date().toISOString(),
        author: exportConfig.author,
        appearance: appearance,
        metadata: {
          tags: exportConfig.tags,
          category: exportConfig.category,
          compatibility: "v1.0+",
        },
      }

      const dataStr = JSON.stringify(themeConfig, null, 2)
      const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr)

      const exportFileDefaultName = `theme-${exportConfig.name.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}.json`

      const linkElement = document.createElement("a")
      linkElement.setAttribute("href", dataUri)
      linkElement.setAttribute("download", exportFileDefaultName)
      linkElement.click()

      showStatus("success", "Thème exporté avec succès!")
    } catch (error) {
      showStatus("error", "Erreur lors de l'export du thème")
    }
  }

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string
        const themeConfig: ThemeConfiguration = JSON.parse(content)

        // Validation de la structure du fichier
        if (!themeConfig.appearance || !themeConfig.version) {
          throw new Error("Format de fichier invalide")
        }

        // Vérification de compatibilité
        if (themeConfig.metadata?.compatibility && !themeConfig.metadata.compatibility.includes("v1.0")) {
          console.warn("Ce thème pourrait ne pas être compatible avec cette version")
        }

        // Appliquer la configuration importée
        onImport(themeConfig.appearance)
        showStatus("success", `Thème "${themeConfig.name}" importé avec succès!`)
      } catch (error) {
        showStatus("error", "Erreur lors de l'import: format de fichier invalide")
      }
    }
    reader.readAsText(file)

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleLibraryImport = (themeConfig: ThemeConfiguration) => {
    onImport(themeConfig.appearance)
    showStatus("success", `Thème "${themeConfig.name}" appliqué avec succès!`)
  }

  const copyThemeCode = (themeConfig: ThemeConfiguration) => {
    const codeStr = JSON.stringify(themeConfig, null, 2)
    navigator.clipboard.writeText(codeStr)
    showStatus("success", "Code du thème copié dans le presse-papiers!")
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Package className="mr-2 h-5 w-5" />
            Gestion des thèmes
          </DialogTitle>
          <DialogDescription>Exportez, importez ou choisissez des thèmes depuis la bibliothèque</DialogDescription>
        </DialogHeader>

        {/* Status Alert */}
        {status !== "idle" && (
          <Alert
            variant={status === "success" ? "default" : "destructive"}
            className={status === "success" ? "bg-green-50 text-green-800 border-green-200" : ""}
          >
            {status === "success" ? <Check className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
            <AlertDescription>{statusMessage}</AlertDescription>
          </Alert>
        )}

        {/* Tabs */}
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab("export")}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
              activeTab === "export" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <Download className="inline mr-2 h-4 w-4" />
            Exporter
          </button>
          <button
            onClick={() => setActiveTab("import")}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
              activeTab === "import" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <Upload className="inline mr-2 h-4 w-4" />
            Importer
          </button>
          <button
            onClick={() => setActiveTab("library")}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
              activeTab === "library" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <FileText className="inline mr-2 h-4 w-4" />
            Bibliothèque
          </button>
        </div>

        <div className="mt-6">
          {/* Export Tab */}
          {activeTab === "export" && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Exporter le thème actuel</CardTitle>
                  <CardDescription>Configurez les métadonnées de votre thème avant l'export</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="theme-name">Nom du thème</Label>
                      <Input
                        id="theme-name"
                        value={exportConfig.name}
                        onChange={(e) => setExportConfig((prev) => ({ ...prev, name: e.target.value }))}
                        placeholder="Mon Thème Personnalisé"
                      />
                    </div>
                    <div>
                      <Label htmlFor="theme-author">Auteur</Label>
                      <Input
                        id="theme-author"
                        value={exportConfig.author}
                        onChange={(e) => setExportConfig((prev) => ({ ...prev, author: e.target.value }))}
                        placeholder="Votre nom"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="theme-description">Description</Label>
                    <Textarea
                      id="theme-description"
                      value={exportConfig.description}
                      onChange={(e) => setExportConfig((prev) => ({ ...prev, description: e.target.value }))}
                      placeholder="Décrivez votre thème..."
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="theme-tags">Tags (séparés par des virgules)</Label>
                      <Input
                        id="theme-tags"
                        value={exportConfig.tags.join(", ")}
                        onChange={(e) =>
                          setExportConfig((prev) => ({
                            ...prev,
                            tags: e.target.value
                              .split(",")
                              .map((tag) => tag.trim())
                              .filter(Boolean),
                          }))
                        }
                        placeholder="moderne, coloré, business"
                      />
                    </div>
                    <div>
                      <Label htmlFor="theme-category">Catégorie</Label>
                      <select
                        id="theme-category"
                        value={exportConfig.category}
                        onChange={(e) => setExportConfig((prev) => ({ ...prev, category: e.target.value }))}
                        className="w-full rounded-md border border-gray-300 p-2"
                      >
                        <option value="business">Business</option>
                        <option value="dark">Sombre</option>
                        <option value="light">Clair</option>
                        <option value="colorful">Coloré</option>
                        <option value="minimal">Minimal</option>
                        <option value="national">National</option>
                        <option value="nature">Nature</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button onClick={handleExport} className="flex items-center">
                      <Download className="mr-2 h-4 w-4" />
                      Exporter le thème
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Import Tab */}
          {activeTab === "import" && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Importer un thème</CardTitle>
                  <CardDescription>Sélectionnez un fichier de configuration de thème (.json)</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Glissez-déposez votre fichier de thème</h3>
                    <p className="text-gray-600 mb-4">ou cliquez pour sélectionner un fichier</p>
                    <Button variant="outline" onClick={() => fileInputRef.current?.click()} className="mb-2">
                      Choisir un fichier
                    </Button>
                    <input ref={fileInputRef} type="file" accept=".json" onChange={handleImport} className="hidden" />
                    <p className="text-xs text-gray-500">Formats acceptés: .json (max 5MB)</p>
                  </div>
                </CardContent>
              </Card>

              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Attention:</strong> L'import d'un thème remplacera votre configuration actuelle. Assurez-vous
                  d'avoir exporté votre thème actuel si vous souhaitez le conserver.
                </AlertDescription>
              </Alert>
            </div>
          )}

          {/* Library Tab */}
          {activeTab === "library" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-medium">Bibliothèque de thèmes</h3>
                  <p className="text-gray-600">Choisissez parmi nos thèmes prédéfinis</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {themeLibrary.map((theme, index) => (
                  <Card key={index} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{theme.name}</CardTitle>
                          <CardDescription className="mt-1">{theme.description}</CardDescription>
                        </div>
                        <Badge variant="secondary">v{theme.version}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Aperçu des couleurs */}
                      <div>
                        <Label className="text-sm font-medium">Palette de couleurs</Label>
                        <div className="flex space-x-2 mt-2">
                          {Object.values(theme.appearance.customColors)
                            .slice(0, 5)
                            .map((color, i) => (
                              <div
                                key={i}
                                className="w-8 h-8 rounded-full border-2 border-white shadow-sm"
                                style={{ backgroundColor: color }}
                                title={color}
                              />
                            ))}
                        </div>
                      </div>

                      {/* Métadonnées */}
                      <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex items-center">
                          <User className="mr-2 h-4 w-4" />
                          {theme.author}
                        </div>
                        <div className="flex items-center">
                          <Calendar className="mr-2 h-4 w-4" />
                          {new Date(theme.createdAt).toLocaleDateString("fr-FR")}
                        </div>
                        <div className="flex items-center">
                          <Tag className="mr-2 h-4 w-4" />
                          <div className="flex flex-wrap gap-1">
                            {theme.metadata.tags.slice(0, 3).map((tag, i) => (
                              <Badge key={i} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex space-x-2 pt-2">
                        <Button onClick={() => handleLibraryImport(theme)} className="flex-1" size="sm">
                          Appliquer
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => copyThemeCode(theme)}>
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            <X className="mr-2 h-4 w-4" />
            Fermer
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
