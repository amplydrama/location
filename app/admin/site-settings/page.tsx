"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ImageUpload } from "@/components/ui/image-upload"
import { ColorPicker } from "@/components/ui/color-picker"
import { ThemePreview } from "@/components/admin/theme-preview"
import { Save, Check, AlertTriangle, Settings, Palette, Globe, Phone, Zap, Car } from "lucide-react"

interface SiteSettings {
  // Informations générales
  siteName: string
  siteDescription: string
  siteUrl: string
  contactEmail: string
  contactPhone: string
  whatsappNumber: string
  address: string

  // Heures d'ouverture
  openingHours: {
    monday: { open: string; close: string; closed: boolean }
    tuesday: { open: string; close: string; closed: boolean }
    wednesday: { open: string; close: string; closed: boolean }
    thursday: { open: string; close: string; closed: boolean }
    friday: { open: string; close: string; closed: boolean }
    saturday: { open: string; close: string; closed: boolean }
    sunday: { open: string; close: string; closed: boolean }
  }

  // Apparence
  logo: string
  favicon: string
  heroImage: string
  primaryColor: string
  secondaryColor: string
  accentColor: string

  // Fonctionnalités
  enableChat: boolean
  enableBooking: boolean
  enablePayments: boolean
  enableNotifications: boolean

  // SEO
  metaTitle: string
  metaDescription: string
  metaKeywords: string

  // Réseaux sociaux
  socialMedia: {
    facebook: string
    instagram: string
    twitter: string
    linkedin: string
    youtube: string
  }

  // Paramètres de réservation
  bookingSettings: {
    minBookingDays: number
    maxBookingDays: number
    advanceBookingDays: number
    cancellationHours: number
    depositPercentage: number
  }
}

export default function SiteSettingsPage() {
  const [settings, setSettings] = useState<SiteSettings>({
    siteName: "CarLoc Cameroun",
    siteDescription: "Location de voitures au Cameroun - Service professionnel et fiable",
    siteUrl: "https://carloc-cameroun.com",
    contactEmail: "contact@carloc-cameroun.com",
    contactPhone: "+237 6XX XXX XXX",
    whatsappNumber: "+237 6XX XXX XXX",
    address: "Douala, Cameroun",

    openingHours: {
      monday: { open: "08:00", close: "18:00", closed: false },
      tuesday: { open: "08:00", close: "18:00", closed: false },
      wednesday: { open: "08:00", close: "18:00", closed: false },
      thursday: { open: "08:00", close: "18:00", closed: false },
      friday: { open: "08:00", close: "18:00", closed: false },
      saturday: { open: "09:00", close: "17:00", closed: false },
      sunday: { open: "10:00", close: "16:00", closed: false },
    },

    logo: "/logo.png",
    favicon: "/favicon.ico",
    heroImage: "/hero-car.jpg",
    primaryColor: "#0f766e",
    secondaryColor: "#f97316",
    accentColor: "#0ea5e9",

    enableChat: true,
    enableBooking: true,
    enablePayments: true,
    enableNotifications: true,

    metaTitle: "CarLoc Cameroun - Location de voitures",
    metaDescription:
      "Louez votre voiture au Cameroun avec CarLoc. Service professionnel, prix compétitifs, paiement Mobile Money.",
    metaKeywords: "location voiture cameroun, car rental cameroon, mobile money, douala, yaoundé",

    socialMedia: {
      facebook: "",
      instagram: "",
      twitter: "",
      linkedin: "",
      youtube: "",
    },

    bookingSettings: {
      minBookingDays: 1,
      maxBookingDays: 30,
      advanceBookingDays: 90,
      cancellationHours: 24,
      depositPercentage: 30,
    },
  })

  const [isSaving, setIsSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">("idle")
  const [activeTab, setActiveTab] = useState("general")

  useEffect(() => {
    // Charger les paramètres existants
    const loadSettings = async () => {
      try {
        // Simuler un appel API
        await new Promise((resolve) => setTimeout(resolve, 500))
        // Dans une vraie app, vous chargeriez depuis l'API
      } catch (error) {
        console.error("Erreur lors du chargement des paramètres:", error)
      }
    }

    loadSettings()
  }, [])

  const handleSave = async () => {
    setIsSaving(true)
    try {
      // Simuler la sauvegarde
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Dans une vraie app, vous enverriez à l'API
      // await fetch('/api/admin/site-settings', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(settings)
      // })

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

  const updateSettings = (key: keyof SiteSettings, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  const updateNestedSettings = (section: string, key: string, value: any) => {
    setSettings((prev) => ({
      ...prev,
      [section]: {
        ...prev[section as keyof SiteSettings],
        [key]: value,
      },
    }))
  }

  const updateOpeningHours = (day: string, field: string, value: any) => {
    setSettings((prev) => ({
      ...prev,
      openingHours: {
        ...prev.openingHours,
        [day]: {
          ...prev.openingHours[day as keyof typeof prev.openingHours],
          [field]: value,
        },
      },
    }))
  }

  const daysOfWeek = [
    { key: "monday", label: "Lundi" },
    { key: "tuesday", label: "Mardi" },
    { key: "wednesday", label: "Mercredi" },
    { key: "thursday", label: "Jeudi" },
    { key: "friday", label: "Vendredi" },
    { key: "saturday", label: "Samedi" },
    { key: "sunday", label: "Dimanche" },
  ]

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Paramètres du site</h1>
          <p className="text-gray-600">Configurez tous les aspects de votre site web</p>
        </div>
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

      {/* Statut de sauvegarde */}
      {saveStatus !== "idle" && (
        <Alert
          variant={saveStatus === "success" ? "default" : "destructive"}
          className={saveStatus === "success" ? "bg-green-50 text-green-800 border-green-200" : ""}
        >
          {saveStatus === "success" ? <Check className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
          <AlertDescription>
            {saveStatus === "success"
              ? "Les paramètres ont été sauvegardés avec succès."
              : "Une erreur est survenue lors de la sauvegarde."}
          </AlertDescription>
        </Alert>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="general" className="flex items-center">
            <Settings className="mr-2 h-4 w-4" />
            Général
          </TabsTrigger>
          <TabsTrigger value="appearance" className="flex items-center">
            <Palette className="mr-2 h-4 w-4" />
            Apparence
          </TabsTrigger>
          <TabsTrigger value="contact" className="flex items-center">
            <Phone className="mr-2 h-4 w-4" />
            Contact
          </TabsTrigger>
          <TabsTrigger value="features" className="flex items-center">
            <Zap className="mr-2 h-4 w-4" />
            Fonctionnalités
          </TabsTrigger>
          <TabsTrigger value="booking" className="flex items-center">
            <Car className="mr-2 h-4 w-4" />
            Réservation
          </TabsTrigger>
          <TabsTrigger value="seo" className="flex items-center">
            <Globe className="mr-2 h-4 w-4" />
            SEO
          </TabsTrigger>
        </TabsList>

        {/* Onglet Général */}
        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informations générales</CardTitle>
              <CardDescription>Configurez les informations de base de votre site</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="siteName">Nom du site</Label>
                  <Input
                    id="siteName"
                    value={settings.siteName}
                    onChange={(e) => updateSettings("siteName", e.target.value)}
                    placeholder="CarLoc Cameroun"
                  />
                </div>
                <div>
                  <Label htmlFor="siteUrl">URL du site</Label>
                  <Input
                    id="siteUrl"
                    value={settings.siteUrl}
                    onChange={(e) => updateSettings("siteUrl", e.target.value)}
                    placeholder="https://carloc-cameroun.com"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="siteDescription">Description du site</Label>
                <Textarea
                  id="siteDescription"
                  value={settings.siteDescription}
                  onChange={(e) => updateSettings("siteDescription", e.target.value)}
                  placeholder="Description de votre service de location de voitures"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Heures d'ouverture</CardTitle>
              <CardDescription>Définissez vos horaires de service</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {daysOfWeek.map((day) => (
                  <div key={day.key} className="flex items-center space-x-4">
                    <div className="w-20">
                      <Label className="text-sm font-medium">{day.label}</Label>
                    </div>
                    <Switch
                      checked={!settings.openingHours[day.key as keyof typeof settings.openingHours].closed}
                      onCheckedChange={(checked) => updateOpeningHours(day.key, "closed", !checked)}
                    />
                    {!settings.openingHours[day.key as keyof typeof settings.openingHours].closed && (
                      <>
                        <Input
                          type="time"
                          value={settings.openingHours[day.key as keyof typeof settings.openingHours].open}
                          onChange={(e) => updateOpeningHours(day.key, "open", e.target.value)}
                          className="w-32"
                        />
                        <span className="text-gray-500">à</span>
                        <Input
                          type="time"
                          value={settings.openingHours[day.key as keyof typeof settings.openingHours].close}
                          onChange={(e) => updateOpeningHours(day.key, "close", e.target.value)}
                          className="w-32"
                        />
                      </>
                    )}
                    {settings.openingHours[day.key as keyof typeof settings.openingHours].closed && (
                      <span className="text-gray-500 italic">Fermé</span>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Apparence */}
        <TabsContent value="appearance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Logo et images</CardTitle>
                  <CardDescription>Personnalisez l'identité visuelle de votre site</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Logo principal</Label>
                    <ImageUpload
                      images={settings.logo ? [settings.logo] : []}
                      onImagesChange={(images) => updateSettings("logo", images[0] || "")}
                      maxImages={1}
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label>Favicon</Label>
                    <ImageUpload
                      images={settings.favicon ? [settings.favicon] : []}
                      onImagesChange={(images) => updateSettings("favicon", images[0] || "")}
                      maxImages={1}
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label>Image d'accueil</Label>
                    <ImageUpload
                      images={settings.heroImage ? [settings.heroImage] : []}
                      onImagesChange={(images) => updateSettings("heroImage", images[0] || "")}
                      maxImages={1}
                      className="mt-2"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Couleurs du thème</CardTitle>
                  <CardDescription>Personnalisez les couleurs de votre site</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Couleur primaire</Label>
                    <div className="flex items-center mt-2">
                      <ColorPicker
                        color={settings.primaryColor}
                        onChange={(color) => updateSettings("primaryColor", color)}
                      />
                      <span className="ml-2 text-sm">{settings.primaryColor}</span>
                    </div>
                  </div>
                  <div>
                    <Label>Couleur secondaire</Label>
                    <div className="flex items-center mt-2">
                      <ColorPicker
                        color={settings.secondaryColor}
                        onChange={(color) => updateSettings("secondaryColor", color)}
                      />
                      <span className="ml-2 text-sm">{settings.secondaryColor}</span>
                    </div>
                  </div>
                  <div>
                    <Label>Couleur d'accent</Label>
                    <div className="flex items-center mt-2">
                      <ColorPicker
                        color={settings.accentColor}
                        onChange={(color) => updateSettings("accentColor", color)}
                      />
                      <span className="ml-2 text-sm">{settings.accentColor}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div>
              <Card className="sticky top-6">
                <CardHeader>
                  <CardTitle>Aperçu</CardTitle>
                  <CardDescription>Prévisualisation de votre site</CardDescription>
                </CardHeader>
                <CardContent>
                  <ThemePreview
                    appearance={{
                      logo: settings.logo,
                      favicon: settings.favicon,
                      theme: "custom",
                      customColors: {
                        primary: settings.primaryColor,
                        secondary: settings.secondaryColor,
                        accent: settings.accentColor,
                        background: "#ffffff",
                        foreground: "#0f172a",
                        muted: "#f1f5f9",
                        card: "#ffffff",
                      },
                      fontFamily: "Inter",
                      borderRadius: "medium",
                      animations: true,
                      heroImage: settings.heroImage,
                    }}
                    mode="desktop"
                  />
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Onglet Contact */}
        <TabsContent value="contact" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informations de contact</CardTitle>
              <CardDescription>Configurez vos moyens de contact</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="contactEmail">Email de contact</Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    value={settings.contactEmail}
                    onChange={(e) => updateSettings("contactEmail", e.target.value)}
                    placeholder="contact@carloc-cameroun.com"
                  />
                </div>
                <div>
                  <Label htmlFor="contactPhone">Téléphone</Label>
                  <Input
                    id="contactPhone"
                    value={settings.contactPhone}
                    onChange={(e) => updateSettings("contactPhone", e.target.value)}
                    placeholder="+237 6XX XXX XXX"
                  />
                </div>
                <div>
                  <Label htmlFor="whatsappNumber">WhatsApp</Label>
                  <Input
                    id="whatsappNumber"
                    value={settings.whatsappNumber}
                    onChange={(e) => updateSettings("whatsappNumber", e.target.value)}
                    placeholder="+237 6XX XXX XXX"
                  />
                </div>
                <div>
                  <Label htmlFor="address">Adresse</Label>
                  <Input
                    id="address"
                    value={settings.address}
                    onChange={(e) => updateSettings("address", e.target.value)}
                    placeholder="Douala, Cameroun"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Réseaux sociaux</CardTitle>
              <CardDescription>Liens vers vos profils sociaux</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="facebook">Facebook</Label>
                  <Input
                    id="facebook"
                    value={settings.socialMedia.facebook}
                    onChange={(e) => updateNestedSettings("socialMedia", "facebook", e.target.value)}
                    placeholder="https://facebook.com/votre-page"
                  />
                </div>
                <div>
                  <Label htmlFor="instagram">Instagram</Label>
                  <Input
                    id="instagram"
                    value={settings.socialMedia.instagram}
                    onChange={(e) => updateNestedSettings("socialMedia", "instagram", e.target.value)}
                    placeholder="https://instagram.com/votre-compte"
                  />
                </div>
                <div>
                  <Label htmlFor="twitter">Twitter</Label>
                  <Input
                    id="twitter"
                    value={settings.socialMedia.twitter}
                    onChange={(e) => updateNestedSettings("socialMedia", "twitter", e.target.value)}
                    placeholder="https://twitter.com/votre-compte"
                  />
                </div>
                <div>
                  <Label htmlFor="linkedin">LinkedIn</Label>
                  <Input
                    id="linkedin"
                    value={settings.socialMedia.linkedin}
                    onChange={(e) => updateNestedSettings("socialMedia", "linkedin", e.target.value)}
                    placeholder="https://linkedin.com/company/votre-entreprise"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Fonctionnalités */}
        <TabsContent value="features" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Fonctionnalités du site</CardTitle>
              <CardDescription>Activez ou désactivez les fonctionnalités</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="enableChat">Chat en direct</Label>
                  <p className="text-sm text-gray-500">Permettre aux clients de discuter avec le support</p>
                </div>
                <Switch
                  id="enableChat"
                  checked={settings.enableChat}
                  onCheckedChange={(checked) => updateSettings("enableChat", checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="enableBooking">Réservations en ligne</Label>
                  <p className="text-sm text-gray-500">Permettre les réservations directement sur le site</p>
                </div>
                <Switch
                  id="enableBooking"
                  checked={settings.enableBooking}
                  onCheckedChange={(checked) => updateSettings("enableBooking", checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="enablePayments">Paiements Mobile Money</Label>
                  <p className="text-sm text-gray-500">Accepter les paiements MTN MoMo et Orange Money</p>
                </div>
                <Switch
                  id="enablePayments"
                  checked={settings.enablePayments}
                  onCheckedChange={(checked) => updateSettings("enablePayments", checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="enableNotifications">Notifications</Label>
                  <p className="text-sm text-gray-500">Envoyer des notifications par email et SMS</p>
                </div>
                <Switch
                  id="enableNotifications"
                  checked={settings.enableNotifications}
                  onCheckedChange={(checked) => updateSettings("enableNotifications", checked)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Réservation */}
        <TabsContent value="booking" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Paramètres de réservation</CardTitle>
              <CardDescription>Configurez les règles de réservation</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="minBookingDays">Durée minimum (jours)</Label>
                  <Input
                    id="minBookingDays"
                    type="number"
                    min="1"
                    value={settings.bookingSettings.minBookingDays}
                    onChange={(e) =>
                      updateNestedSettings("bookingSettings", "minBookingDays", Number.parseInt(e.target.value))
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="maxBookingDays">Durée maximum (jours)</Label>
                  <Input
                    id="maxBookingDays"
                    type="number"
                    min="1"
                    value={settings.bookingSettings.maxBookingDays}
                    onChange={(e) =>
                      updateNestedSettings("bookingSettings", "maxBookingDays", Number.parseInt(e.target.value))
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="advanceBookingDays">Réservation à l'avance (jours)</Label>
                  <Input
                    id="advanceBookingDays"
                    type="number"
                    min="1"
                    value={settings.bookingSettings.advanceBookingDays}
                    onChange={(e) =>
                      updateNestedSettings("bookingSettings", "advanceBookingDays", Number.parseInt(e.target.value))
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="cancellationHours">Annulation gratuite (heures)</Label>
                  <Input
                    id="cancellationHours"
                    type="number"
                    min="1"
                    value={settings.bookingSettings.cancellationHours}
                    onChange={(e) =>
                      updateNestedSettings("bookingSettings", "cancellationHours", Number.parseInt(e.target.value))
                    }
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="depositPercentage">Acompte requis (%)</Label>
                  <Input
                    id="depositPercentage"
                    type="number"
                    min="0"
                    max="100"
                    value={settings.bookingSettings.depositPercentage}
                    onChange={(e) =>
                      updateNestedSettings("bookingSettings", "depositPercentage", Number.parseInt(e.target.value))
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet SEO */}
        <TabsContent value="seo" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Référencement (SEO)</CardTitle>
              <CardDescription>Optimisez votre site pour les moteurs de recherche</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="metaTitle">Titre de la page (Meta Title)</Label>
                <Input
                  id="metaTitle"
                  value={settings.metaTitle}
                  onChange={(e) => updateSettings("metaTitle", e.target.value)}
                  placeholder="CarLoc Cameroun - Location de voitures"
                />
                <p className="text-xs text-gray-500 mt-1">Recommandé: 50-60 caractères</p>
              </div>
              <div>
                <Label htmlFor="metaDescription">Description (Meta Description)</Label>
                <Textarea
                  id="metaDescription"
                  value={settings.metaDescription}
                  onChange={(e) => updateSettings("metaDescription", e.target.value)}
                  placeholder="Description de votre service pour les moteurs de recherche"
                  rows={3}
                />
                <p className="text-xs text-gray-500 mt-1">Recommandé: 150-160 caractères</p>
              </div>
              <div>
                <Label htmlFor="metaKeywords">Mots-clés</Label>
                <Input
                  id="metaKeywords"
                  value={settings.metaKeywords}
                  onChange={(e) => updateSettings("metaKeywords", e.target.value)}
                  placeholder="location voiture, cameroun, mobile money"
                />
                <p className="text-xs text-gray-500 mt-1">Séparez les mots-clés par des virgules</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
