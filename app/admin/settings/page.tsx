"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import {
  Settings,
  Globe,
  CreditCard,
  Bell,
  Shield,
  Mail,
  Smartphone,
  Save,
  AlertTriangle,
  CheckCircle,
} from "lucide-react"

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    // Paramètres généraux
    companyName: "CarLoc Cameroun",
    companyEmail: "contact@carloc-cameroun.com",
    companyPhone: "+237 677 123 456",
    companyAddress: "Akwa, Douala, Cameroun",
    website: "https://carloc-cameroun.com",
    currency: "FCFA",
    timezone: "Africa/Douala",
    language: "fr",

    // Paramètres de paiement
    mtnMomoEnabled: true,
    mtnMomoApiKey: "MTN_API_KEY_***",
    mtnMomoSubscriptionKey: "MTN_SUB_KEY_***",
    orangeMoneyEnabled: true,
    orangeMoneyClientId: "ORANGE_CLIENT_***",
    orangeMoneyClientSecret: "ORANGE_SECRET_***",
    paymentTimeout: 300,
    autoRefund: true,

    // Notifications
    emailNotifications: true,
    smsNotifications: true,
    whatsappNotifications: false,
    bookingConfirmation: true,
    paymentAlerts: true,
    maintenanceReminders: true,

    // Sécurité
    twoFactorAuth: false,
    sessionTimeout: 30,
    passwordExpiry: 90,
    loginAttempts: 5,

    // Réservations
    advanceBookingDays: 30,
    minimumRentalHours: 4,
    cancellationDeadline: 24,
    lateFeePerHour: 5000,
    depositPercentage: 30,

    // Chat
    chatEnabled: true,
    autoAssignment: true,
    businessHours: "08:00-18:00",
    maxConcurrentChats: 5,
    chatTimeout: 30,
  })

  const [isSaving, setIsSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">("idle")

  const handleSave = async () => {
    setIsSaving(true)
    try {
      // Simuler la sauvegarde
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setSaveStatus("success")
      setTimeout(() => setSaveStatus("idle"), 3000)
    } catch (error) {
      setSaveStatus("error")
      setTimeout(() => setSaveStatus("idle"), 3000)
    } finally {
      setIsSaving(false)
    }
  }

  const updateSetting = (key: string, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Paramètres système</h1>
          <p className="text-gray-600">Configurez votre application de location</p>
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
        <Card
          className={`border-l-4 ${saveStatus === "success" ? "border-green-500 bg-green-50" : "border-red-500 bg-red-50"}`}
        >
          <CardContent className="p-4">
            <div className="flex items-center">
              {saveStatus === "success" ? (
                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
              ) : (
                <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
              )}
              <span className={`text-sm font-medium ${saveStatus === "success" ? "text-green-800" : "text-red-800"}`}>
                {saveStatus === "success" ? "Paramètres sauvegardés avec succès" : "Erreur lors de la sauvegarde"}
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="general">Général</TabsTrigger>
          <TabsTrigger value="payments">Paiements</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Sécurité</TabsTrigger>
          <TabsTrigger value="bookings">Réservations</TabsTrigger>
          <TabsTrigger value="chat">Chat</TabsTrigger>
        </TabsList>

        {/* Paramètres généraux */}
        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Globe className="mr-2 h-5 w-5" />
                Informations de l'entreprise
              </CardTitle>
              <CardDescription>Configurez les informations de base de votre entreprise</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="companyName">Nom de l'entreprise</Label>
                  <Input
                    id="companyName"
                    value={settings.companyName}
                    onChange={(e) => updateSetting("companyName", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="companyEmail">Email</Label>
                  <Input
                    id="companyEmail"
                    type="email"
                    value={settings.companyEmail}
                    onChange={(e) => updateSetting("companyEmail", e.target.value)}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="companyPhone">Téléphone</Label>
                  <Input
                    id="companyPhone"
                    value={settings.companyPhone}
                    onChange={(e) => updateSetting("companyPhone", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website">Site web</Label>
                  <Input
                    id="website"
                    value={settings.website}
                    onChange={(e) => updateSetting("website", e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="companyAddress">Adresse</Label>
                <Textarea
                  id="companyAddress"
                  value={settings.companyAddress}
                  onChange={(e) => updateSetting("companyAddress", e.target.value)}
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="currency">Devise</Label>
                  <Select value={settings.currency} onValueChange={(value) => updateSetting("currency", value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="FCFA">FCFA (Franc CFA)</SelectItem>
                      <SelectItem value="EUR">EUR (Euro)</SelectItem>
                      <SelectItem value="USD">USD (Dollar)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone">Fuseau horaire</Label>
                  <Select value={settings.timezone} onValueChange={(value) => updateSetting("timezone", value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Africa/Douala">Africa/Douala</SelectItem>
                      <SelectItem value="Africa/Lagos">Africa/Lagos</SelectItem>
                      <SelectItem value="UTC">UTC</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="language">Langue</Label>
                  <Select value={settings.language} onValueChange={(value) => updateSetting("language", value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fr">Français</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Paramètres de paiement */}
        <TabsContent value="payments" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CreditCard className="mr-2 h-5 w-5" />
                Configuration Mobile Money
              </CardTitle>
              <CardDescription>Configurez les API de paiement MTN MoMo et Orange Money</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* MTN MoMo */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-yellow-400 rounded-full"></div>
                    <h3 className="text-lg font-medium">MTN Mobile Money</h3>
                  </div>
                  <Switch
                    checked={settings.mtnMomoEnabled}
                    onCheckedChange={(checked) => updateSetting("mtnMomoEnabled", checked)}
                  />
                </div>
                {settings.mtnMomoEnabled && (
                  <div className="grid grid-cols-2 gap-4 pl-8">
                    <div className="space-y-2">
                      <Label htmlFor="mtnApiKey">Clé API</Label>
                      <Input
                        id="mtnApiKey"
                        type="password"
                        value={settings.mtnMomoApiKey}
                        onChange={(e) => updateSetting("mtnMomoApiKey", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="mtnSubKey">Clé d'abonnement</Label>
                      <Input
                        id="mtnSubKey"
                        type="password"
                        value={settings.mtnMomoSubscriptionKey}
                        onChange={(e) => updateSetting("mtnMomoSubscriptionKey", e.target.value)}
                      />
                    </div>
                  </div>
                )}
              </div>

              <Separator />

              {/* Orange Money */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-orange-500 rounded-full"></div>
                    <h3 className="text-lg font-medium">Orange Money</h3>
                  </div>
                  <Switch
                    checked={settings.orangeMoneyEnabled}
                    onCheckedChange={(checked) => updateSetting("orangeMoneyEnabled", checked)}
                  />
                </div>
                {settings.orangeMoneyEnabled && (
                  <div className="grid grid-cols-2 gap-4 pl-8">
                    <div className="space-y-2">
                      <Label htmlFor="orangeClientId">Client ID</Label>
                      <Input
                        id="orangeClientId"
                        type="password"
                        value={settings.orangeMoneyClientId}
                        onChange={(e) => updateSetting("orangeMoneyClientId", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="orangeClientSecret">Client Secret</Label>
                      <Input
                        id="orangeClientSecret"
                        type="password"
                        value={settings.orangeMoneyClientSecret}
                        onChange={(e) => updateSetting("orangeMoneyClientSecret", e.target.value)}
                      />
                    </div>
                  </div>
                )}
              </div>

              <Separator />

              {/* Paramètres généraux de paiement */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Paramètres généraux</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="paymentTimeout">Timeout de paiement (secondes)</Label>
                    <Input
                      id="paymentTimeout"
                      type="number"
                      value={settings.paymentTimeout}
                      onChange={(e) => updateSetting("paymentTimeout", Number.parseInt(e.target.value))}
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={settings.autoRefund}
                      onCheckedChange={(checked) => updateSetting("autoRefund", checked)}
                    />
                    <Label>Remboursement automatique</Label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bell className="mr-2 h-5 w-5" />
                Paramètres de notification
              </CardTitle>
              <CardDescription>Configurez les notifications par email, SMS et WhatsApp</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Canaux de notification</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Mail className="h-5 w-5 text-blue-500" />
                      <span>Notifications par email</span>
                    </div>
                    <Switch
                      checked={settings.emailNotifications}
                      onCheckedChange={(checked) => updateSetting("emailNotifications", checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Smartphone className="h-5 w-5 text-green-500" />
                      <span>Notifications SMS</span>
                    </div>
                    <Switch
                      checked={settings.smsNotifications}
                      onCheckedChange={(checked) => updateSetting("smsNotifications", checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Smartphone className="h-5 w-5 text-green-600" />
                      <span>Notifications WhatsApp</span>
                    </div>
                    <Switch
                      checked={settings.whatsappNotifications}
                      onCheckedChange={(checked) => updateSetting("whatsappNotifications", checked)}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Types de notification</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span>Confirmation de réservation</span>
                    <Switch
                      checked={settings.bookingConfirmation}
                      onCheckedChange={(checked) => updateSetting("bookingConfirmation", checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Alertes de paiement</span>
                    <Switch
                      checked={settings.paymentAlerts}
                      onCheckedChange={(checked) => updateSetting("paymentAlerts", checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Rappels de maintenance</span>
                    <Switch
                      checked={settings.maintenanceReminders}
                      onCheckedChange={(checked) => updateSetting("maintenanceReminders", checked)}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Sécurité */}
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="mr-2 h-5 w-5" />
                Paramètres de sécurité
              </CardTitle>
              <CardDescription>Configurez la sécurité et l'authentification</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-medium">Authentification à deux facteurs</span>
                    <p className="text-sm text-gray-500">Sécurité renforcée pour les comptes admin</p>
                  </div>
                  <Switch
                    checked={settings.twoFactorAuth}
                    onCheckedChange={(checked) => updateSetting("twoFactorAuth", checked)}
                  />
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="sessionTimeout">Timeout de session (minutes)</Label>
                  <Input
                    id="sessionTimeout"
                    type="number"
                    value={settings.sessionTimeout}
                    onChange={(e) => updateSetting("sessionTimeout", Number.parseInt(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="passwordExpiry">Expiration mot de passe (jours)</Label>
                  <Input
                    id="passwordExpiry"
                    type="number"
                    value={settings.passwordExpiry}
                    onChange={(e) => updateSetting("passwordExpiry", Number.parseInt(e.target.value))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="loginAttempts">Tentatives de connexion max</Label>
                <Input
                  id="loginAttempts"
                  type="number"
                  value={settings.loginAttempts}
                  onChange={(e) => updateSetting("loginAttempts", Number.parseInt(e.target.value))}
                  className="w-32"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Réservations */}
        <TabsContent value="bookings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="mr-2 h-5 w-5" />
                Paramètres de réservation
              </CardTitle>
              <CardDescription>Configurez les règles de réservation et de tarification</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="advanceBookingDays">Réservation à l'avance (jours max)</Label>
                  <Input
                    id="advanceBookingDays"
                    type="number"
                    value={settings.advanceBookingDays}
                    onChange={(e) => updateSetting("advanceBookingDays", Number.parseInt(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="minimumRentalHours">Durée minimum de location (heures)</Label>
                  <Input
                    id="minimumRentalHours"
                    type="number"
                    value={settings.minimumRentalHours}
                    onChange={(e) => updateSetting("minimumRentalHours", Number.parseInt(e.target.value))}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cancellationDeadline">Délai d'annulation (heures)</Label>
                  <Input
                    id="cancellationDeadline"
                    type="number"
                    value={settings.cancellationDeadline}
                    onChange={(e) => updateSetting("cancellationDeadline", Number.parseInt(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lateFeePerHour">Frais de retard par heure (FCFA)</Label>
                  <Input
                    id="lateFeePerHour"
                    type="number"
                    value={settings.lateFeePerHour}
                    onChange={(e) => updateSetting("lateFeePerHour", Number.parseInt(e.target.value))}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="depositPercentage">Pourcentage de caution (%)</Label>
                <Input
                  id="depositPercentage"
                  type="number"
                  value={settings.depositPercentage}
                  onChange={(e) => updateSetting("depositPercentage", Number.parseInt(e.target.value))}
                  className="w-32"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Chat */}
        <TabsContent value="chat" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="mr-2 h-5 w-5" />
                Paramètres du chat
              </CardTitle>
              <CardDescription>Configurez le système de chat client</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-medium">Activer le chat</span>
                  <p className="text-sm text-gray-500">Permettre aux clients de contacter le support</p>
                </div>
                <Switch
                  checked={settings.chatEnabled}
                  onCheckedChange={(checked) => updateSetting("chatEnabled", checked)}
                />
              </div>

              {settings.chatEnabled && (
                <>
                  <Separator />

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>Attribution automatique des agents</span>
                      <Switch
                        checked={settings.autoAssignment}
                        onCheckedChange={(checked) => updateSetting("autoAssignment", checked)}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="businessHours">Heures d'ouverture</Label>
                        <Input
                          id="businessHours"
                          value={settings.businessHours}
                          onChange={(e) => updateSetting("businessHours", e.target.value)}
                          placeholder="08:00-18:00"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="maxConcurrentChats">Chats simultanés max par agent</Label>
                        <Input
                          id="maxConcurrentChats"
                          type="number"
                          value={settings.maxConcurrentChats}
                          onChange={(e) => updateSetting("maxConcurrentChats", Number.parseInt(e.target.value))}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="chatTimeout">Timeout d'inactivité (minutes)</Label>
                      <Input
                        id="chatTimeout"
                        type="number"
                        value={settings.chatTimeout}
                        onChange={(e) => updateSetting("chatTimeout", Number.parseInt(e.target.value))}
                        className="w-32"
                      />
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
