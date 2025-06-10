"use client"

import { useEffect } from "react"
import Script from "next/script"

interface AnalyticsScriptsProps {
  googleAnalytics?: {
    enabled: boolean
    measurementId: string
    anonymizeIp?: boolean
    enhancedLinkAttribution?: boolean
    demographicReports?: boolean
  }
  facebookPixel?: {
    enabled: boolean
    pixelId: string
    trackPageViews?: boolean
  }
  microsoftClarity?: {
    enabled: boolean
    projectId: string
  }
  hotjar?: {
    enabled: boolean
    siteId: string
    hotjarVersion: string
  }
  customScripts?: {
    enabled: boolean
    headScripts?: string
    bodyStartScripts?: string
    bodyEndScripts?: string
  }
}

export function AnalyticsScripts({
  googleAnalytics,
  facebookPixel,
  microsoftClarity,
  hotjar,
  customScripts,
}: AnalyticsScriptsProps) {
  // Fonction pour initialiser Google Analytics
  useEffect(() => {
    if (googleAnalytics?.enabled && googleAnalytics.measurementId && typeof window !== "undefined") {
      // Configuration de GA4
      window.dataLayer = window.dataLayer || []
      function gtag(...args: any[]) {
        window.dataLayer.push(args)
      }
      gtag("js", new Date())

      // Options de configuration
      const gaConfig: Record<string, any> = {}

      if (googleAnalytics.anonymizeIp) {
        gaConfig.anonymize_ip = true
      }

      if (googleAnalytics.enhancedLinkAttribution) {
        gaConfig.link_attribution = true
      }

      gtag("config", googleAnalytics.measurementId, gaConfig)
    }
  }, [googleAnalytics])

  // Fonction pour initialiser Facebook Pixel
  useEffect(() => {
    if (facebookPixel?.enabled && facebookPixel.pixelId && typeof window !== "undefined") {
      // Initialisation du Pixel Facebook
      !((f, b, e, v, n, t, s) => {
        if (f.fbq) return
        n = f.fbq = () => {
          n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments)
        }
        if (!f._fbq) f._fbq = n
        n.push = n
        n.loaded = !0
        n.version = "2.0"
        n.queue = []
        t = b.createElement(e)
        t.async = !0
        t.src = v
        s = b.getElementsByTagName(e)[0]
        s.parentNode.insertBefore(t, s)
      })(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js")

      window.fbq("init", facebookPixel.pixelId)

      if (facebookPixel.trackPageViews) {
        window.fbq("track", "PageView")
      }
    }
  }, [facebookPixel])

  return (
    <>
      {/* Google Analytics */}
      {googleAnalytics?.enabled && googleAnalytics.measurementId && (
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${googleAnalytics.measurementId}`}
          strategy="afterInteractive"
        />
      )}

      {/* Microsoft Clarity */}
      {microsoftClarity?.enabled && microsoftClarity.projectId && (
        <Script id="microsoft-clarity" strategy="afterInteractive">
          {`
            (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "${microsoftClarity.projectId}");
          `}
        </Script>
      )}

      {/* Hotjar */}
      {hotjar?.enabled && hotjar.siteId && (
        <Script id="hotjar" strategy="afterInteractive">
          {`
            (function(h,o,t,j,a,r){
                h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
                h._hjSettings={hjid:${hotjar.siteId},hjsv:${hotjar.hotjarVersion}};
                a=o.getElementsByTagName('head')[0];
                r=o.createElement('script');r.async=1;
                r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
                a.appendChild(r);
            })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
          `}
        </Script>
      )}

      {/* Scripts personnalisés - Head */}
      {customScripts?.enabled && customScripts.headScripts && (
        <Script id="custom-head-scripts" dangerouslySetInnerHTML={{ __html: customScripts.headScripts }} />
      )}

      {/* Scripts personnalisés - Body Start */}
      {customScripts?.enabled && customScripts.bodyStartScripts && (
        <Script
          id="custom-body-start-scripts"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{ __html: customScripts.bodyStartScripts }}
        />
      )}

      {/* Scripts personnalisés - Body End */}
      {customScripts?.enabled && customScripts.bodyEndScripts && (
        <Script
          id="custom-body-end-scripts"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: customScripts.bodyEndScripts }}
        />
      )}
    </>
  )
}
