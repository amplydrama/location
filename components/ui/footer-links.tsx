"use client"

import Link from "next/link"

export function FooterLinks() {
  return (
    <div className="bg-gray-900 text-white py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Location Cameroun</h3>
            <p className="text-gray-400 text-sm mb-4">
              Votre partenaire de confiance pour la location de véhicules au Cameroun.
            </p>
            <div className="space-y-2 text-sm text-gray-400">
              <p>📍 Douala, Cameroun</p>
              <p>📞 +237 6XX XXX XXX</p>
              <p>✉️ contact@location-cameroun.com</p>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Services</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link href="/vehicles" className="hover:text-white transition-colors">
                  Location de véhicules
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  À propos
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-white transition-colors">
                  Espace Admin
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Légal</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link href="/terms" className="hover:text-white transition-colors">
                  Conditions d'utilisation
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-white transition-colors">
                  Politique de confidentialité
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="hover:text-white transition-colors">
                  Politique des cookies
                </Link>
              </li>
              <li>
                <Link href="/legal" className="hover:text-white transition-colors">
                  Mentions légales
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link href="/help" className="hover:text-white transition-colors">
                  Centre d'aide
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-white transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Nous contacter
                </Link>
              </li>
              <li>
                <div className="flex items-center gap-2 mt-4">
                  <span className="text-xs bg-green-600 px-2 py-1 rounded">Chat 24/7</span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-sm text-gray-400">© {new Date().getFullYear()} Location Cameroun. Tous droits réservés.</p>
          <p className="text-xs text-gray-500 mt-2">Paiements sécurisés via MTN MoMo et Orange Money</p>
        </div>
      </div>
    </div>
  )
}
