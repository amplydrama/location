"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Switch } from "@/components/ui/switch"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ImageUpload } from "@/components/ui/image-upload"
import { ColorPicker } from "@/components/ui/color-picker"
import { ThemePreview } from "@/components/admin/theme-preview"
import { ThemeExportImport } from "@/components/admin/theme-export-import"
import { Save, Undo, Check, AlertTriangle, Palette, ImageIcon, Download, Upload, FileText, Share2 } from "lucide-react"

// Types pour les thèmes
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

export default function AppearancePage() {
  const [appearance, setAppearance] = useState<SiteAppearance>({
    logo: "/logo.png",
    favicon: "/favicon.ico",
    theme: "light",
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
  })

  const [isSaving, setIsSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">("idle")
  const [previewMode, setPreviewMode] = useState<"desktop" | "mobile">("desktop")
  const [showExportImport, setShowExportImport] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Simuler le chargement des données existantes
  useEffect(() => {
    const loadAppearanceSettings = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 500))
      } catch (error) {
        console.error("Erreur lors du chargement des paramètres d'apparence:", error)
      }
    }

    loadAppearanceSettings()
  }, [])

  const handleSave = async () => {
    setIsSaving(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setSaveStatus("success")
      setTimeout(() => setSaveStatus("idle"), 3000)
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error)
      setSaveStatus("error")
      setTimeout(() => setSaveStatus("idle"), 3000)
    } finally {
      setIsSaving(false)
    }
  }

  const updateAppearance = (key: keyof SiteAppearance, value: any) => {
    setAppearance((prev) => ({ ...prev, [key]: value }))
  }

  const updateCustomColor = (colorKey: keyof ThemeColors, value: string) => {
    setAppearance((prev) => ({
      ...prev,
      customColors: {
        ...prev.customColors,
        [colorKey]: value,
      },
    }))
  }

  const resetToDefaults = () => {
    setAppearance({
      logo: "/logo.png",
      favicon: "/favicon.ico",
      theme: "light",
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
    })
  }

  // Fonction d'export de thème
  const exportTheme = () => {
    const themeConfig: ThemeConfiguration = {
      name: "Mon Thème Personnalisé",
      description: "Configuration de thème exportée depuis l'administration",
      version: "1.0.0",
      createdAt: new Date().toISOString(),
      author: "Administrateur",
      appearance: appearance,
      metadata: {
        tags: ["personnalisé", "export", "cameroun"],
        category: "business",
        compatibility: "v1.0+",
      },
    }

    const dataStr = JSON.stringify(themeConfig, null, 2)
    const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr)

    const exportFileDefaultName = `theme-${Date.now()}.json`

    const linkElement = document.createElement("a")
    linkElement.setAttribute("href", dataUri)
    linkElement.setAttribute("download", exportFileDefaultName)
    linkElement.click()
  }

  // Fonction d'import de thème
  const importTheme = (event: React.ChangeEvent<HTMLInputElement>) => {
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

        // Appliquer la configuration importée
        setAppearance(themeConfig.appearance)

        // Afficher un message de succès
        setSaveStatus("success")
        setTimeout(() => setSaveStatus("idle"), 3000)
      } catch (error) {
        console.error("Erreur lors de l'import:", error)
        setSaveStatus("error")
        setTimeout(() => setSaveStatus("idle"), 3000)
      }
    }
    reader.readAsText(file)

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const predefinedThemes = [
    {
      name: "Classique",
      colors: {
        primary: "#0f766e",
        secondary: "#f97316",
        accent: "#0ea5e9",
        background: "#ffffff",
        foreground: "#0f172a",
        muted: "#f1f5f9",
        card: "#ffffff",
      },
    },
    {
      name: "Moderne",
      colors: {
        primary: "#6d28d9",
        secondary: "#ec4899",
        accent: "#8b5cf6",
        background: "#ffffff",
        foreground: "#1e293b",
        muted: "#f8fafc",
        card: "#ffffff",
      },
    },
    {
      name: "Sombre",
      colors: {
        primary: "#22d3ee",
        secondary: "#f43f5e",
        accent: "#a855f7",
        background: "#0f172a",
        foreground: "#f8fafc",
        muted: "#1e293b",
        card: "#1e293b",
      },
    },
    {
      name: "Cameroun",
      colors: {
        primary: "#007a5e",
        secondary: "#ce1126",
        accent: "#fcd116",
        background: "#ffffff",
        foreground: "#0f172a",
        muted: "#f1f5f9",
        card: "#ffffff",
      },
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Apparence du site</h1>
          <p className="text-gray-600">Personnalisez le logo et le thème de votre site</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => setShowExportImport(true)}>
            <Share2 className="mr-2 h-4 w-4" />
            Export/Import
          </Button>
          <Button variant="outline" onClick={resetToDefaults}>
            <Undo className="mr-2 h-4 w-4" />
            Réinitialiser
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Sauvegarde...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Sauvegarder
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Actions rapides d'export/import */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FileText className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-medium text-blue-900">Gestion des thèmes</h3>
                <p className="text-sm text-blue-700">Exportez ou importez vos configurations de thèmes</p>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={exportTheme}
                className="border-blue-300 text-blue-700 hover:bg-blue-50"
              >
                <Download className="mr-2 h-4 w-4" />
                Exporter
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                className="border-blue-300 text-blue-700 hover:bg-blue-50"
              >
                <Upload className="mr-2 h-4 w-4" />
                Importer
              </Button>
              <input ref={fileInputRef} type="file" accept=".json" onChange={importTheme} className="hidden" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statut de sauvegarde */}
      {saveStatus !== "idle" && (
        <Alert
          variant={saveStatus === "success" ? "default" : "destructive"}
          className={saveStatus === "success" ? "bg-green-50 text-green-800 border-green-200" : ""}
        >
          {saveStatus === "success" ? <Check className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
          <AlertDescription>
            {saveStatus === "success"
              ? "Les paramètres d'apparence ont été sauvegardés avec succès."
              : "Une erreur est survenue lors de la sauvegarde des paramètres."}
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Panneau de configuration */}
        <div className="lg:col-span-2 space-y-6">
          <Tabs defaultValue="logo" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="logo" className="flex items-center">
                <ImageIcon className="mr-2 h-4 w-4" />
                Logo et images
              </TabsTrigger>
              <TabsTrigger value="theme" className="flex items-center">
                <Palette className="mr-2 h-4 w-4" />
                Thème et couleurs
              </TabsTrigger>
            </TabsList>

            {/* Logo et images */}
            <TabsContent value="logo" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Logo du site</CardTitle>
                  <CardDescription>
                    Téléchargez votre logo d'entreprise. Format recommandé: PNG ou SVG avec fond transparent.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label>Logo principal</Label>
                      <ImageUpload
                        images={appearance.logo ? [appearance.logo] : []}
                        onImagesChange={(images) => updateAppearance("logo", images[0] || "")}
                        maxImages={1}
                        className="mt-2"
                      />
                      <p className="text-xs text-gray-500 mt-1">Dimensions recommandées: 200x60px. Taille max: 2MB.</p>
                    </div>
                    <div>
                      <Label>Favicon</Label>
                      <ImageUpload
                        images={appearance.favicon ? [appearance.favicon] : []}
                        onImagesChange={(images) => updateAppearance("favicon", images[0] || "")}
                        maxImages={1}
                        className="mt-2"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Format carré, dimensions recommandées: 32x32px ou 64x64px.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Image d'accueil</CardTitle>
                  <CardDescription>Personnalisez l'image principale affichée sur votre page d'accueil.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div>
                    <Label>Image hero</Label>
                    <ImageUpload
                      images={appearance.heroImage ? [appearance.heroImage] : []}
                      onImagesChange={(images) => updateAppearance("heroImage", images[0] || "")}
                      maxImages={1}
                      className="mt-2"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Image de haute qualité, dimensions recommandées: 1920x1080px.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Thème et couleurs */}
            <TabsContent value="theme" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Mode de thème</CardTitle>
                  <CardDescription>Choisissez le mode de thème par défaut pour votre site.</CardDescription>
                </CardHeader>
                <CardContent>
                  <RadioGroup
                    value={appearance.theme}
                    onValueChange={(value) => updateAppearance("theme", value)}
                    className="grid grid-cols-2 md:grid-cols-4 gap-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="light" id="theme-light" />
                      <Label htmlFor="theme-light">Clair</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="dark" id="theme-dark" />
                      <Label htmlFor="theme-dark">Sombre</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="system" id="theme-system" />
                      <Label htmlFor="theme-system">Système</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="custom" id="theme-custom" />
                      <Label htmlFor="theme-custom">Personnalisé</Label>
                    </div>
                  </RadioGroup>
                </CardContent>
              </Card>

              {appearance.theme === "custom" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Thèmes prédéfinis</CardTitle>
                    <CardDescription>Choisissez un thème prédéfini comme point de départ.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {predefinedThemes.map((theme) => (
                        <div
                          key={theme.name}
                          className={`border rounded-md p-4 cursor-pointer hover:border-primary transition-all ${
                            JSON.stringify(theme.colors) === JSON.stringify(appearance.customColors)
                              ? "border-primary ring-2 ring-primary ring-opacity-50"
                              : "border-gray-200"
                          }`}
                          onClick={() => updateAppearance("customColors", { ...theme.colors })}
                        >
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="font-medium text-sm">{theme.name}</span>
                              {JSON.stringify(theme.colors) === JSON.stringify(appearance.customColors) && (
                                <Check className="h-4 w-4 text-primary" />
                              )}
                            </div>
                            <div className="flex space-x-1">
                              {Object.values(theme.colors)
                                .slice(0, 3)
                                .map((color, i) => (
                                  <div
                                    key={i}
                                    className="w-4 h-4 rounded-full"
                                    style={{ backgroundColor: color }}
                                  ></div>
                                ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {appearance.theme === "custom" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Couleurs personnalisées</CardTitle>
                    <CardDescription>Personnalisez les couleurs de votre thème.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <Label>Couleur primaire</Label>
                          <div className="flex items-center mt-2">
                            <ColorPicker
                              color={appearance.customColors.primary}
                              onChange={(color) => updateCustomColor("primary", color)}
                            />
                            <span className="ml-2 text-sm">{appearance.customColors.primary}</span>
                          </div>
                        </div>
                        <div>
                          <Label>Couleur secondaire</Label>
                          <div className="flex items-center mt-2">
                            <ColorPicker
                              color={appearance.customColors.secondary}
                              onChange={(color) => updateCustomColor("secondary", color)}
                            />
                            <span className="ml-2 text-sm">{appearance.customColors.secondary}</span>
                          </div>
                        </div>
                        <div>
                          <Label>Couleur d'accent</Label>
                          <div className="flex items-center mt-2">
                            <ColorPicker
                              color={appearance.customColors.accent}
                              onChange={(color) => updateCustomColor("accent", color)}
                            />
                            <span className="ml-2 text-sm">{appearance.customColors.accent}</span>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <Label>Arrière-plan</Label>
                          <div className="flex items-center mt-2">
                            <ColorPicker
                              color={appearance.customColors.background}
                              onChange={(color) => updateCustomColor("background", color)}
                            />
                            <span className="ml-2 text-sm">{appearance.customColors.background}</span>
                          </div>
                        </div>
                        <div>
                          <Label>Texte</Label>
                          <div className="flex items-center mt-2">
                            <ColorPicker
                              color={appearance.customColors.foreground}
                              onChange={(color) => updateCustomColor("foreground", color)}
                            />
                            <span className="ml-2 text-sm">{appearance.customColors.foreground}</span>
                          </div>
                        </div>
                        <div>
                          <Label>Fond des cartes</Label>
                          <div className="flex items-center mt-2">
                            <ColorPicker
                              color={appearance.customColors.card}
                              onChange={(color) => updateCustomColor("card", color)}
                            />
                            <span className="ml-2 text-sm">{appearance.customColors.card}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              <Card>
                <CardHeader>
                  <CardTitle>Options supplémentaires</CardTitle>
                  <CardDescription>Personnalisez d'autres aspects visuels de votre site.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="fontFamily">Police de caractères</Label>
                      <div className="mt-2">
                        <select
                          id="fontFamily"
                          value={appearance.fontFamily}
                          onChange={(e) => updateAppearance("fontFamily", e.target.value)}
                          className="w-full rounded-md border border-gray-300 p-2"
                        >
                          <option value="Inter">Inter</option>
                          <option value="Roboto">Roboto</option>
                          <option value="Open Sans">Open Sans</option>
                          <option value="Poppins">Poppins</option>
                          <option value="Montserrat">Montserrat</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="borderRadius">Arrondi des coins</Label>
                      <RadioGroup
                        id="borderRadius"
                        value={appearance.borderRadius}
                        onValueChange={(value) => updateAppearance("borderRadius", value)}
                        className="grid grid-cols-4 gap-4 mt-2"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="none" id="radius-none" />
                          <Label htmlFor="radius-none">Aucun</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="small" id="radius-small" />
                          <Label htmlFor="radius-small">Petit</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="medium" id="radius-medium" />
                          <Label htmlFor="radius-medium">Moyen</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="large" id="radius-large" />
                          <Label htmlFor="radius-large">Grand</Label>
                        </div>
                      </RadioGroup>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="animations">Animations</Label>
                        <p className="text-sm text-gray-500">Activer les animations et transitions</p>
                      </div>
                      <Switch
                        id="animations"
                        checked={appearance.animations}
                        onCheckedChange={(checked) => updateAppearance("animations", checked)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Prévisualisation */}
        <div className="space-y-4">
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle>Prévisualisation</CardTitle>
              <CardDescription>Aperçu en temps réel de vos modifications</CardDescription>
              <div className="flex space-x-2 mt-2">
                <Button
                  variant={previewMode === "desktop" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setPreviewMode("desktop")}
                  className="w-full"
                >
                  Desktop
                </Button>
                <Button
                  variant={previewMode === "mobile" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setPreviewMode("mobile")}
                  className="w-full"
                >
                  Mobile
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <ThemePreview appearance={appearance} mode={previewMode} />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Modal Export/Import */}
      {showExportImport && (
        <ThemeExportImport
          appearance={appearance}
          onImport={setAppearance}
          onClose={() => setShowExportImport(false)}
        />
      )}
    </div>
  )
}
