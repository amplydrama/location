"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

interface CookieConsentProps {
  enabled?: boolean
  position?: "bottom" | "top" | "bottom-left" | "bottom-right"
  theme?: "light" | "dark" | "auto"
  privacyPolicyUrl?: string
  expireDays?: number
  necessaryCookiesOnly?: boolean
  showPreferences?: boolean
  onAccept?: (preferences: { analytics: boolean; marketing: boolean; preferences: boolean }) => void
}

export function CookieConsent({
  enabled = true,
  position = "bottom",
  theme = "auto",
  privacyPolicyUrl = "/privacy",
  expireDays = 365,
  necessaryCookiesOnly = false,
  showPreferences = true,
  onAccept,
}: CookieConsentProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [showDetails, setShowDetails] = useState(false)
  const [preferences, setPreferences] = useState({
    analytics: true,
    marketing: true,
    preferences: true,
  })

  useEffect(() => {
    // Vérifier si le consentement a déjà été donné
    const consent = localStorage.getItem("cookie-consent")
    if (!consent && enabled) {
      // Attendre un peu avant d'afficher la bannière
      const timer = setTimeout(() => {
        setIsVisible(true)
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [enabled])

  const acceptAll = () => {
    localStorage.setItem(
      "cookie-consent",
      JSON.stringify({
        accepted: true,
        date: new Date().toISOString(),
        preferences: {
          analytics: true,
          marketing: true,
          preferences: true,
        },
      }),
    )
    setIsVisible(false)
    if (onAccept) {
      onAccept({
        analytics: true,
        marketing: true,
        preferences: true,
      })
    }
  }

  const acceptNecessaryOnly = () => {
    localStorage.setItem(
      "cookie-consent",
      JSON.stringify({
        accepted: true,
        date: new Date().toISOString(),
        preferences: {
          analytics: false,
          marketing: false,
          preferences: false,
        },
      }),
    )
    setIsVisible(false)
    if (onAccept) {
      onAccept({
        analytics: false,
        marketing: false,
        preferences: false,
      })
    }
  }

  const acceptSelected = () => {
    localStorage.setItem(
      "cookie-consent",
      JSON.stringify({
        accepted: true,
        date: new Date().toISOString(),
        preferences,
      }),
    )
    setIsVisible(false)
    if (onAccept) {
      onAccept(preferences)
    }
  }

  const handlePreferenceChange = (key: keyof typeof preferences) => {
    setPreferences((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  if (!isVisible) {
    return null
  }

  // Déterminer les classes de position
  let positionClasses = "fixed left-0 right-0 bottom-0 p-4 z-50"
  if (position === "top") {
    positionClasses = "fixed left-0 right-0 top-0 p-4 z-50"
  } else if (position === "bottom-left") {
    positionClasses = "fixed left-0 bottom-0 p-4 max-w-md z-50"
  } else if (position === "bottom-right") {
    positionClasses = "fixed right-0 bottom-0 p-4 max-w-md z-50"
  }

  // Déterminer les classes de thème
  let themeClasses = "bg-white text-gray-800 border border-gray-200 shadow-lg"
  if (theme === "dark") {
    themeClasses = "bg-gray-900 text-gray-100 border border-gray-700 shadow-lg"
  }

  return (
    <div className={positionClasses}>
      <div className={`rounded-lg ${themeClasses} overflow-hidden`}>
        <div className="p-4 sm:p-6">
          <div className="flex justify-between items-start">
            <div className="pr-8">
              <h3 className="text-lg font-semibold mb-2">Nous utilisons des cookies</h3>
              <p className="text-sm mb-4">
                Ce site utilise des cookies pour améliorer votre expérience. En continuant à naviguer sur ce site, vous
                acceptez notre utilisation des cookies.
              </p>
            </div>
            <button
              onClick={() => setIsVisible(false)}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              aria-label="Fermer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {showPreferences && !necessaryCookiesOnly && showDetails && (
            <div className="mt-4 border-t pt-4 border-gray-200 dark:border-gray-700">
              <h4 className="text-sm font-medium mb-3">Préférences de cookies</h4>
              <div className="space-y-3">
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="cookie-necessary"
                      type="checkbox"
                      checked
                      disabled
                      className="w-4 h-4 border-gray-300 rounded"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="cookie-necessary" className="font-medium">
                      Nécessaires
                    </label>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Ces cookies sont essentiels au fonctionnement du site.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="cookie-analytics"
                      type="checkbox"
                      checked={preferences.analytics}
                      onChange={() => handlePreferenceChange("analytics")}
                      className="w-4 h-4 border-gray-300 rounded"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="cookie-analytics" className="font-medium">
                      Analytiques
                    </label>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Ces cookies nous aident à comprendre comment les visiteurs interagissent avec le site.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="cookie-marketing"
                      type="checkbox"
                      checked={preferences.marketing}
                      onChange={() => handlePreferenceChange("marketing")}
                      className="w-4 h-4 border-gray-300 rounded"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="cookie-marketing" className="font-medium">
                      Marketing
                    </label>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Ces cookies sont utilisés pour suivre les visiteurs sur les sites web afin d'afficher des
                      publicités pertinentes.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="cookie-preferences"
                      type="checkbox"
                      checked={preferences.preferences}
                      onChange={() => handlePreferenceChange("preferences")}
                      className="w-4 h-4 border-gray-300 rounded"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="cookie-preferences" className="font-medium">
                      Préférences
                    </label>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Ces cookies permettent au site de se souvenir de vos préférences et choix.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="mt-4 flex flex-wrap gap-2">
            {showPreferences && !necessaryCookiesOnly && !showDetails ? (
              <>
                <Button variant="outline" size="sm" onClick={() => setShowDetails(true)}>
                  Personnaliser
                </Button>
                <Button variant="outline" size="sm" onClick={acceptNecessaryOnly}>
                  Cookies essentiels uniquement
                </Button>
                <Button size="sm" onClick={acceptAll}>
                  Accepter tous les cookies
                </Button>
              </>
            ) : showPreferences && !necessaryCookiesOnly && showDetails ? (
              <>
                <Button variant="outline" size="sm" onClick={acceptNecessaryOnly}>
                  Cookies essentiels uniquement
                </Button>
                <Button size="sm" onClick={acceptSelected}>
                  Enregistrer mes préférences
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" size="sm" onClick={acceptNecessaryOnly}>
                  Refuser
                </Button>
                <Button size="sm" onClick={acceptAll}>
                  Accepter
                </Button>
              </>
            )}
          </div>

          <div className="mt-3 text-xs text-gray-500 dark:text-gray-400">
            <a href={privacyPolicyUrl} className="underline hover:text-gray-700 dark:hover:text-gray-300">
              Politique de confidentialité
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
