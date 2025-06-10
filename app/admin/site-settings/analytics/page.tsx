"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Save, Check, AlertTriangle, BarChart, Code, Cookie } from "lucide-react"

interface AnalyticsSettings {
  googleAnalytics: {
    enabled: boolean
    measurementId: string
    anonymizeIp: boolean
    enhancedLinkAttribution: boolean
    demographicReports: boolean
  }
  facebookPixel: {
    enabled: boolean
    pixelId: string
    trackPageViews: boolean
    trackEvents: boolean
  }
  microsoftClarity: {
    enabled: boolean
    projectId: string
  }
  hotjar: {
    enabled: boolean
    siteId: string
    hotjarVersion: string
  }
  customScripts: {
    enabled: boolean
    headScripts: string
    bodyStartScripts: string
    bodyEndScripts: string
  }
  cookieConsent: {
    enabled: boolean
    position: "bottom" | "top" | "bottom-left" | "bottom-right"
    theme: "light" | "dark" | "auto"
    necessaryCookiesOnly: boolean
    showPreferences: boolean
    expireDays: number
    privacyPolicyUrl: string
  }
}

export default function AnalyticsSettingsPage() {
  const [settings, setSettings] = useState<AnalyticsSettings>({
    googleAnalytics: {
      enabled: false,
      measurementId: "",
      anonymizeIp: true,
      enhancedLinkAttribution: true,
      demographicReports: false,
    },
    facebookPixel: {
      enabled: false,
      pixelId: "",
      trackPageViews: true,
      trackEvents: true,
    },
    microsoftClarity: {
      enabled: false,
      projectId: "",
    },
    hotjar: {
      enabled: false,
      siteId: "",
      hotjarVersion: "6",
    },
    customScripts: {
      enabled: false,
      headScripts: "",
      bodyStartScripts: "",
      bodyEndScripts: "",
    },
    cookieConsent: {
      enabled: true,
      position: "bottom",
      theme: "auto",
      necessaryCookiesOnly: false,
      showPreferences: true,
      expireDays: 365,
      privacyPolicyUrl: "/privacy",
    },
  })

  const [isSaving, setIsSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">("idle")
  const [activeTab, setActiveTab] = useState("google-analytics")

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
      // await fetch('/api/admin/analytics-settings', {
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

  const updateGoogleAnalytics = (key: string, value: any) => {
    setSettings((prev) => ({
      ...prev,
      googleAnalytics: {
        ...prev.googleAnalytics,
        [key]: value,
      },
    }))
  }

  const updateFacebookPixel = (key: string, value: any) => {
    setSettings((prev) => ({
      ...prev,
      facebookPixel: {
        ...prev.facebookPixel,
        [key]: value,
      },
    }))
  }

  const updateMicrosoftClarity = (key: string, value: any) => {
    setSettings((prev) => ({
      ...prev,
      microsoftClarity: {
        ...prev.microsoftClarity,
        [key]: value,
      },
    }))
  }

  const updateHotjar = (key: string, value: any) => {
    setSettings((prev) => ({
      ...prev,
      hotjar: {
        ...prev.hotjar,
        [key]: value,
      },
    }))
  }

  const updateCustomScripts = (key: string, value: any) => {
    setSettings((prev) => ({
      ...prev,
      customScripts: {
        ...prev.customScripts,
        [key]: value,
      },
    }))
  }

  const updateCookieConsent = (key: string, value: any) => {
    setSettings((prev) => ({
      ...prev,
      cookieConsent: {
        ...prev.cookieConsent,
        [key]: value,
      },
    }))
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Outils d'analyse</h1>
          <p className="text-gray-600">Configurez les outils d'analyse et de suivi pour votre site</p>
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
              ? "Les paramètres d'analyse ont été sauvegardés avec succès."
              : "Une erreur est survenue lors de la sauvegarde."}
          </AlertDescription>
        </Alert>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="google-analytics" className="flex items-center">
            <BarChart className="mr-2 h-4 w-4" />
            Google Analytics
          </TabsTrigger>
          <TabsTrigger value="facebook-pixel" className="flex items-center">
            <BarChart className="mr-2 h-4 w-4" />
            Facebook Pixel
          </TabsTrigger>
          <TabsTrigger value="microsoft-clarity" className="flex items-center">
            <BarChart className="mr-2 h-4 w-4" />
            Microsoft Clarity
          </TabsTrigger>
          <TabsTrigger value="hotjar" className="flex items-center">
            <BarChart className="mr-2 h-4 w-4" />
            Hotjar
          </TabsTrigger>
          <TabsTrigger value="custom-scripts" className="flex items-center">
            <Code className="mr-2 h-4 w-4" />
            Scripts personnalisés
          </TabsTrigger>
          <TabsTrigger value="cookie-consent" className="flex items-center">
            <Cookie className="mr-2 h-4 w-4" />
            Consentement cookies
          </TabsTrigger>
        </TabsList>

        {/* Google Analytics */}
        <TabsContent value="google-analytics" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Google Analytics 4</CardTitle>
                  <CardDescription>Configurez Google Analytics pour suivre les visiteurs de votre site</CardDescription>
                </div>
                <Switch
                  checked={settings.googleAnalytics.enabled}
                  onCheckedChange={(checked) => updateGoogleAnalytics("enabled", checked)}
                />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="ga-measurement-id">ID de mesure (G-XXXXXXXXXX)</Label>
                <Input
                  id="ga-measurement-id"
                  value={settings.googleAnalytics.measurementId}
                  onChange={(e) => updateGoogleAnalytics("measurementId", e.target.value)}
                  placeholder="G-XXXXXXXXXX"
                  disabled={!settings.googleAnalytics.enabled}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Vous trouverez votre ID de mesure dans l'interface d'administration de Google Analytics
                </p>
              </div>

              <div className="pt-4 border-t border-gray-100">
                <h3 className="font-medium mb-3">Options avancées</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="ga-anonymize-ip">Anonymiser les adresses IP</Label>
                      <p className="text-sm text-gray-500">Masque la dernière partie de l'adresse IP des visiteurs</p>
                    </div>
                    <Switch
                      id="ga-anonymize-ip"
                      checked={settings.googleAnalytics.anonymizeIp}
                      onCheckedChange={(checked) => updateGoogleAnalytics("anonymizeIp", checked)}
                      disabled={!settings.googleAnalytics.enabled}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="ga-enhanced-link">Attribution de lien améliorée</Label>
                      <p className="text-sm text-gray-500">Améliore le suivi des clics sur les liens</p>
                    </div>
                    <Switch
                      id="ga-enhanced-link"
                      checked={settings.googleAnalytics.enhancedLinkAttribution}
                      onCheckedChange={(checked) => updateGoogleAnalytics("enhancedLinkAttribution", checked)}
                      disabled={!settings.googleAnalytics.enabled}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="ga-demographic">Rapports démographiques</Label>
                      <p className="text-sm text-gray-500">Collecte des données démographiques sur vos visiteurs</p>
                    </div>
                    <Switch
                      id="ga-demographic"
                      checked={settings.googleAnalytics.demographicReports}
                      onCheckedChange={(checked) => updateGoogleAnalytics("demographicReports", checked)}
                      disabled={!settings.googleAnalytics.enabled}
                    />
                  </div>
                </div>
              </div>

              <Alert className="mt-4 bg-blue-50 text-blue-800 border-blue-200">
                <AlertDescription>
                  <p className="font-medium">Comment configurer Google Analytics 4 :</p>
                  <ol className="list-decimal list-inside mt-2 space-y-1 text-sm">
                    <li>
                      Créez un compte sur{" "}
                      <a
                        href="https://analytics.google.com"
                        className="underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        analytics.google.com
                      </a>
                    </li>
                    <li>Créez une nouvelle propriété et sélectionnez Google Analytics 4</li>
                    <li>Suivez les instructions pour configurer votre flux de données web</li>
                    <li>Copiez l'ID de mesure (G-XXXXXXXXXX) et collez-le ci-dessus</li>
                    <li>Activez l'interrupteur pour activer le suivi</li>
                  </ol>
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Facebook Pixel */}
        <TabsContent value="facebook-pixel" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Facebook Pixel</CardTitle>
                  <CardDescription>Suivez les conversions et optimisez les publicités Facebook</CardDescription>
                </div>
                <Switch
                  checked={settings.facebookPixel.enabled}
                  onCheckedChange={(checked) => updateFacebookPixel("enabled", checked)}
                />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="fb-pixel-id">ID du Pixel Facebook</Label>
                <Input
                  id="fb-pixel-id"
                  value={settings.facebookPixel.pixelId}
                  onChange={(e) => updateFacebookPixel("pixelId", e.target.value)}
                  placeholder="XXXXXXXXXXXXXXXXXX"
                  disabled={!settings.facebookPixel.enabled}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Vous trouverez votre ID de Pixel dans le Gestionnaire d'événements Facebook
                </p>
              </div>

              <div className="pt-4 border-t border-gray-100">
                <h3 className="font-medium mb-3">Options de suivi</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="fb-page-views">Suivre les vues de page</Label>
                      <p className="text-sm text-gray-500">Enregistre automatiquement les vues de page</p>
                    </div>
                    <Switch
                      id="fb-page-views"
                      checked={settings.facebookPixel.trackPageViews}
                      onCheckedChange={(checked) => updateFacebookPixel("trackPageViews", checked)}
                      disabled={!settings.facebookPixel.enabled}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="fb-track-events">Suivre les événements</Label>
                      <p className="text-sm text-gray-500">
                        Enregistre les événements comme les réservations et les paiements
                      </p>
                    </div>
                    <Switch
                      id="fb-track-events"
                      checked={settings.facebookPixel.trackEvents}
                      onCheckedChange={(checked) => updateFacebookPixel("trackEvents", checked)}
                      disabled={!settings.facebookPixel.enabled}
                    />
                  </div>
                </div>
              </div>

              <Alert className="mt-4 bg-blue-50 text-blue-800 border-blue-200">
                <AlertDescription>
                  <p className="font-medium">Comment configurer Facebook Pixel :</p>
                  <ol className="list-decimal list-inside mt-2 space-y-1 text-sm">
                    <li>
                      Accédez au{" "}
                      <a
                        href="https://business.facebook.com/events_manager"
                        className="underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Gestionnaire d'événements
                      </a>
                    </li>
                    <li>Cliquez sur "Ajouter une nouvelle source de données" et sélectionnez "Pixel Facebook"</li>
                    <li>Suivez les instructions pour créer votre Pixel</li>
                    <li>Copiez l'ID du Pixel et collez-le ci-dessus</li>
                    <li>Activez l'interrupteur pour activer le suivi</li>
                  </ol>
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Microsoft Clarity */}
        <TabsContent value="microsoft-clarity" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Microsoft Clarity</CardTitle>
                  <CardDescription>
                    Analysez le comportement des utilisateurs avec des cartes thermiques
                  </CardDescription>
                </div>
                <Switch
                  checked={settings.microsoftClarity.enabled}
                  onCheckedChange={(checked) => updateMicrosoftClarity("enabled", checked)}
                />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="clarity-project-id">ID du projet Clarity</Label>
                <Input
                  id="clarity-project-id"
                  value={settings.microsoftClarity.projectId}
                  onChange={(e) => updateMicrosoftClarity("projectId", e.target.value)}
                  placeholder="xxxxxxxxxx"
                  disabled={!settings.microsoftClarity.enabled}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Vous trouverez votre ID de projet dans les paramètres de votre projet Clarity
                </p>
              </div>

              <Alert className="mt-4 bg-blue-50 text-blue-800 border-blue-200">
                <AlertDescription>
                  <p className="font-medium">Comment configurer Microsoft Clarity :</p>
                  <ol className="list-decimal list-inside mt-2 space-y-1 text-sm">
                    <li>
                      Créez un compte sur{" "}
                      <a
                        href="https://clarity.microsoft.com"
                        className="underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        clarity.microsoft.com
                      </a>
                    </li>
                    <li>Cliquez sur "Créer un projet" et suivez les instructions</li>
                    <li>Une fois le projet créé, accédez aux paramètres du projet</li>
                    <li>Copiez l'ID du projet et collez-le ci-dessus</li>
                    <li>Activez l'interrupteur pour activer le suivi</li>
                  </ol>
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Hotjar */}
        <TabsContent value="hotjar" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Hotjar</CardTitle>
                  <CardDescription>
                    Enregistrez les sessions utilisateurs et créez des cartes thermiques
                  </CardDescription>
                </div>
                <Switch
                  checked={settings.hotjar.enabled}
                  onCheckedChange={(checked) => updateHotjar("enabled", checked)}
                />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="hotjar-site-id">ID du site Hotjar</Label>
                  <Input
                    id="hotjar-site-id"
                    value={settings.hotjar.siteId}
                    onChange={(e) => updateHotjar("siteId", e.target.value)}
                    placeholder="1234567"
                    disabled={!settings.hotjar.enabled}
                  />
                </div>
                <div>
                  <Label htmlFor="hotjar-version">Version Hotjar</Label>
                  <Input
                    id="hotjar-version"
                    value={settings.hotjar.hotjarVersion}
                    onChange={(e) => updateHotjar("hotjarVersion", e.target.value)}
                    placeholder="6"
                    disabled={!settings.hotjar.enabled}
                  />
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Vous trouverez votre ID de site dans les paramètres de votre compte Hotjar
              </p>

              <Alert className="mt-4 bg-blue-50 text-blue-800 border-blue-200">
                <AlertDescription>
                  <p className="font-medium">Comment configurer Hotjar :</p>
                  <ol className="list-decimal list-inside mt-2 space-y-1 text-sm">
                    <li>
                      Créez un compte sur{" "}
                      <a href="https://www.hotjar.com" className="underline" target="_blank" rel="noopener noreferrer">
                        hotjar.com
                      </a>
                    </li>
                    <li>Ajoutez un nouveau site dans votre tableau de bord</li>
                    <li>Accédez aux paramètres du site et trouvez le code d'installation</li>
                    <li>Copiez l'ID du site (nombre à plusieurs chiffres) et collez-le ci-dessus</li>
                    <li>Activez l'interrupteur pour activer le suivi</li>
                  </ol>
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Scripts personnalisés */}
        <TabsContent value="custom-scripts" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Scripts personnalisés</CardTitle>
                  <CardDescription>Ajoutez vos propres scripts de suivi ou d'analyse</CardDescription>
                </div>
                <Switch
                  checked={settings.customScripts.enabled}
                  onCheckedChange={(checked) => updateCustomScripts("enabled", checked)}
                />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="head-scripts">Scripts dans l'en-tête (head)</Label>
                <Textarea
                  id="head-scripts"
                  value={settings.customScripts.headScripts}
                  onChange={(e) => updateCustomScripts("headScripts", e.target.value)}
                  placeholder="<!-- Vos scripts ici -->"
                  rows={4}
                  disabled={!settings.customScripts.enabled}
                  className="font-mono text-sm"
                />
                <p className="text-xs text-gray-500 mt-1">Ces scripts seront insérés dans la balise {"<head>"}</p>
              </div>

              <div>
                <Label htmlFor="body-start-scripts">Scripts au début du corps (body)</Label>
                <Textarea
                  id="body-start-scripts"
                  value={settings.customScripts.bodyStartScripts}
                  onChange={(e) => updateCustomScripts("bodyStartScripts", e.target.value)}
                  placeholder="<!-- Vos scripts ici -->"
                  rows={4}
                  disabled={!settings.customScripts.enabled}
                  className="font-mono text-sm"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Ces scripts seront insérés juste après la balise {"<body>"}
                </p>
              </div>

              <div>
                <Label htmlFor="body-end-scripts">Scripts à la fin du corps (body)</Label>
                <Textarea
                  id="body-end-scripts"
                  value={settings.customScripts.bodyEndScripts}
                  onChange={(e) => updateCustomScripts("bodyEndScripts", e.target.value)}
                  placeholder="<!-- Vos scripts ici -->"
                  rows={4}
                  disabled={!settings.customScripts.enabled}
                  className="font-mono text-sm"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Ces scripts seront insérés juste avant la fermeture de la balise {"</body>"}
                </p>
              </div>

              <Alert className="mt-4 bg-yellow-50 text-yellow-800 border-yellow-200">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <p className="font-medium">Attention :</p>
                  <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
                    <li>N'ajoutez que des scripts provenant de sources fiables</li>
                    <li>Les scripts incorrects peuvent causer des problèmes de performance ou de sécurité</li>
                    <li>Assurez-vous que vos scripts sont conformes au RGPD si nécessaire</li>
                  </ul>
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Consentement aux cookies */}
        <TabsContent value="cookie-consent" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Consentement aux cookies</CardTitle>
                  <CardDescription>Configurez la bannière de consentement aux cookies</CardDescription>
                </div>
                <Switch
                  checked={settings.cookieConsent.enabled}
                  onCheckedChange={(checked) => updateCookieConsent("enabled", checked)}
                />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="cookie-position">Position de la bannière</Label>
                  <select
                    id="cookie-position"
                    value={settings.cookieConsent.position}
                    onChange={(e) =>
                      updateCookieConsent(
                        "position",
                        e.target.value as "bottom" | "top" | "bottom-left" | "bottom-right",
                      )
                    }
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    disabled={!settings.cookieConsent.enabled}
                  >
                    <option value="bottom">Bas de page</option>
                    <option value="top">Haut de page</option>
                    <option value="bottom-left">Bas gauche</option>
                    <option value="bottom-right">Bas droite</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="cookie-theme">Thème</Label>
                  <select
                    id="cookie-theme"
                    value={settings.cookieConsent.theme}
                    onChange={(e) => updateCookieConsent("theme", e.target.value as "light" | "dark" | "auto")}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    disabled={!settings.cookieConsent.enabled}
                  >
                    <option value="light">Clair</option>
                    <option value="dark">Sombre</option>
                    <option value="auto">Automatique (selon le thème du site)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="cookie-expire">Durée de validité (jours)</Label>
                  <Input
                    id="cookie-expire"
                    type="number"
                    min="1"
                    value={settings.cookieConsent.expireDays}
                    onChange={(e) => updateCookieConsent("expireDays", Number.parseInt(e.target.value))}
                    disabled={!settings.cookieConsent.enabled}
                  />
                </div>
                <div>
                  <Label htmlFor="cookie-policy-url">URL de la politique de confidentialité</Label>
                  <Input
                    id="cookie-policy-url"
                    value={settings.cookieConsent.privacyPolicyUrl}
                    onChange={(e) => updateCookieConsent("privacyPolicyUrl", e.target.value)}
                    placeholder="/privacy"
                    disabled={!settings.cookieConsent.enabled}
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100">
                <h3 className="font-medium mb-3">Options avancées</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="necessary-only">Mode cookies nécessaires uniquement</Label>
                      <p className="text-sm text-gray-500">
                        N'utiliser que les cookies essentiels au fonctionnement du site
                      </p>
                    </div>
                    <Switch
                      id="necessary-only"
                      checked={settings.cookieConsent.necessaryCookiesOnly}
                      onCheckedChange={(checked) => updateCookieConsent("necessaryCookiesOnly", checked)}
                      disabled={!settings.cookieConsent.enabled}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="show-preferences">Afficher les préférences détaillées</Label>
                      <p className="text-sm text-gray-500">
                        Permettre aux utilisateurs de choisir les catégories de cookies
                      </p>
                    </div>
                    <Switch
                      id="show-preferences"
                      checked={settings.cookieConsent.showPreferences}
                      onCheckedChange={(checked) => updateCookieConsent("showPreferences", checked)}
                      disabled={!settings.cookieConsent.enabled || settings.cookieConsent.necessaryCookiesOnly}
                    />
                  </div>
                </div>
              </div>

              <Alert className="mt-4 bg-blue-50 text-blue-800 border-blue-200">
                <AlertDescription>
                  <p className="font-medium">Conformité RGPD :</p>
                  <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
                    <li>
                      La bannière de consentement est obligatoire pour les sites utilisant des cookies non essentiels
                    </li>
                    <li>Assurez-vous que votre politique de confidentialité est à jour et accessible</li>
                    <li>Les utilisateurs doivent pouvoir refuser les cookies non essentiels</li>
                    <li>Le consentement doit être explicite (pas de consentement présumé)</li>
                  </ul>
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
