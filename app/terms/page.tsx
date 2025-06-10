"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, FileText, Shield, Car, CreditCard, Phone } from "lucide-react"
import Link from "next/link"

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour à l'accueil
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <FileText className="h-6 w-6 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">Conditions d'Utilisation</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-green-600" />
              Conditions Générales d'Utilisation
            </CardTitle>
            <p className="text-sm text-gray-600">Dernière mise à jour : {new Date().toLocaleDateString("fr-FR")}</p>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* Section 1 */}
            <section>
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">1</span>
                Objet et Champ d'Application
              </h2>
              <div className="space-y-3 text-gray-700">
                <p>
                  Les présentes conditions générales d'utilisation (CGU) régissent l'utilisation de la plateforme de
                  location de véhicules opérant au Cameroun. En utilisant nos services, vous acceptez intégralement ces
                  conditions.
                </p>
                <p>
                  Notre service permet la location de véhicules particuliers et utilitaires sur le territoire
                  camerounais, avec paiement via Mobile Money (MTN MoMo, Orange Money) et autres moyens de paiement
                  acceptés.
                </p>
              </div>
            </section>

            {/* Section 2 */}
            <section>
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">2</span>
                Conditions d'Éligibilité
              </h2>
              <div className="space-y-3 text-gray-700">
                <p>
                  <strong>Pour louer un véhicule, vous devez :</strong>
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Être âgé d'au moins 21 ans (25 ans pour certains véhicules de luxe)</li>
                  <li>Posséder un permis de conduire valide depuis au moins 2 ans</li>
                  <li>Présenter une pièce d'identité valide (CNI, passeport)</li>
                  <li>Fournir une adresse de résidence au Cameroun</li>
                  <li>Disposer d'un moyen de paiement valide (Mobile Money, carte bancaire)</li>
                </ul>
              </div>
            </section>

            {/* Section 3 */}
            <section>
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Car className="h-5 w-5 text-blue-600" />
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">3</span>
                Réservation et Location
              </h2>
              <div className="space-y-4 text-gray-700">
                <div>
                  <h3 className="font-semibold mb-2">3.1 Processus de Réservation</h3>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>La réservation s'effectue en ligne via notre plateforme</li>
                    <li>Un acompte de 30% est requis pour confirmer la réservation</li>
                    <li>Le solde est payable à la prise du véhicule</li>
                    <li>Une caution est bloquée sur votre compte Mobile Money</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">3.2 Prise et Restitution du Véhicule</h3>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Inspection conjointe obligatoire à la prise et à la restitution</li>
                    <li>État des lieux photographique systématique</li>
                    <li>Vérification du niveau de carburant (restitution au même niveau)</li>
                    <li>Remise des clés et documents du véhicule</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Section 4 */}
            <section>
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-green-600" />
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">4</span>
                Tarifs et Paiements
              </h2>
              <div className="space-y-4 text-gray-700">
                <div>
                  <h3 className="font-semibold mb-2">4.1 Tarification</h3>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Tarifs exprimés en Francs CFA (XAF)</li>
                    <li>Prix incluant l'assurance de base</li>
                    <li>Kilométrage illimité sauf mention contraire</li>
                    <li>Frais supplémentaires pour services optionnels</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">4.2 Moyens de Paiement</h3>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>MTN Mobile Money</li>
                    <li>Orange Money</li>
                    <li>Virement bancaire</li>
                    <li>Espèces (selon conditions)</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">4.3 Caution</h3>
                  <p>
                    Une caution de 100 000 à 500 000 XAF selon le véhicule est bloquée sur votre compte Mobile Money.
                    Elle est libérée sous 48h après restitution du véhicule en bon état.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 5 */}
            <section>
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">5</span>
                Obligations du Locataire
              </h2>
              <div className="space-y-3 text-gray-700">
                <ul className="list-disc pl-6 space-y-2">
                  <li>Utiliser le véhicule conformément à sa destination</li>
                  <li>Respecter le code de la route camerounais</li>
                  <li>Ne pas sous-louer ou prêter le véhicule</li>
                  <li>Signaler immédiatement tout accident ou panne</li>
                  <li>Maintenir le véhicule en bon état de propreté</li>
                  <li>Ne pas fumer dans le véhicule</li>
                  <li>Ne pas transporter de matières dangereuses</li>
                  <li>Respecter les limitations de poids et de passagers</li>
                </ul>
              </div>
            </section>

            {/* Section 6 */}
            <section>
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">6</span>
                Assurance et Responsabilité
              </h2>
              <div className="space-y-4 text-gray-700">
                <div>
                  <h3 className="font-semibold mb-2">6.1 Couverture d'Assurance</h3>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Assurance responsabilité civile obligatoire</li>
                    <li>Assurance tous risques avec franchise</li>
                    <li>Protection vol avec conditions</li>
                    <li>Assistance dépannage 24h/24</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">6.2 Exclusions</h3>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Conduite en état d'ivresse ou sous stupéfiants</li>
                    <li>Utilisation non conforme du véhicule</li>
                    <li>Négligence grave du conducteur</li>
                    <li>Dommages aux effets personnels</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Section 7 */}
            <section>
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">7</span>
                Annulation et Modification
              </h2>
              <div className="space-y-3 text-gray-700">
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2 text-yellow-800">Conditions d'Annulation</h3>
                  <ul className="list-disc pl-6 space-y-1 text-yellow-700">
                    <li>
                      <strong>Plus de 48h avant :</strong> Remboursement intégral
                    </li>
                    <li>
                      <strong>24-48h avant :</strong> Retenue de 25% de l'acompte
                    </li>
                    <li>
                      <strong>Moins de 24h :</strong> Retenue de 50% de l'acompte
                    </li>
                    <li>
                      <strong>Non-présentation :</strong> Perte totale de l'acompte
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Section 8 */}
            <section>
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Phone className="h-5 w-5 text-blue-600" />
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">8</span>
                Support Client et Réclamations
              </h2>
              <div className="space-y-3 text-gray-700">
                <p>
                  Notre service client est disponible 24h/24 via chat en ligne, WhatsApp, ou téléphone pour toute
                  assistance ou réclamation.
                </p>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2 text-blue-800">Contacts d'Urgence</h3>
                  <ul className="space-y-1 text-blue-700">
                    <li>
                      <strong>Assistance 24h/24 :</strong> +237 6XX XXX XXX
                    </li>
                    <li>
                      <strong>WhatsApp :</strong> +237 6XX XXX XXX
                    </li>
                    <li>
                      <strong>Email :</strong> support@location-cameroun.com
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Section 9 */}
            <section>
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">9</span>
                Droit Applicable et Juridiction
              </h2>
              <div className="space-y-3 text-gray-700">
                <p>
                  Les présentes conditions sont régies par le droit camerounais. Tout litige relève de la compétence
                  exclusive des tribunaux de Douala, Cameroun.
                </p>
                <p>En cas de litige, une solution amiable sera recherchée avant tout recours judiciaire.</p>
              </div>
            </section>

            {/* Footer */}
            <div className="border-t pt-6 mt-8">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 text-center">
                  En utilisant nos services, vous reconnaissez avoir lu, compris et accepté l'intégralité de ces
                  conditions d'utilisation.
                </p>
                <p className="text-xs text-gray-500 text-center mt-2">
                  Document généré le {new Date().toLocaleDateString("fr-FR")} - Version 1.0
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
