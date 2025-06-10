"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Shield, Eye, Lock, Database, Phone, Mail } from "lucide-react"
import Link from "next/link"

export default function PrivacyPolicy() {
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
              <Shield className="h-6 w-6 text-green-600" />
              <h1 className="text-2xl font-bold text-gray-900">Politique de Confidentialité</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-green-600" />
              Protection de vos Données Personnelles
            </CardTitle>
            <p className="text-sm text-gray-600">Dernière mise à jour : {new Date().toLocaleDateString("fr-FR")}</p>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* Introduction */}
            <section>
              <div className="bg-green-50 p-4 rounded-lg mb-6">
                <h2 className="text-lg font-semibold text-green-800 mb-2">Notre Engagement</h2>
                <p className="text-green-700">
                  Nous nous engageons à protéger et respecter votre vie privée. Cette politique explique comment nous
                  collectons, utilisons et protégeons vos données personnelles conformément à la réglementation
                  camerounaise et aux standards internationaux.
                </p>
              </div>
            </section>

            {/* Section 1 */}
            <section>
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Database className="h-5 w-5 text-blue-600" />
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">1</span>
                Données Collectées
              </h2>
              <div className="space-y-4 text-gray-700">
                <div>
                  <h3 className="font-semibold mb-2">1.1 Informations d'Identification</h3>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Nom, prénom, date de naissance</li>
                    <li>Numéro de CNI ou passeport</li>
                    <li>Numéro de permis de conduire</li>
                    <li>Adresse de résidence</li>
                    <li>Numéro de téléphone</li>
                    <li>Adresse email</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">1.2 Informations de Paiement</h3>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Numéro de téléphone Mobile Money</li>
                    <li>Historique des transactions</li>
                    <li>Informations bancaires (si applicable)</li>
                    <li>Données de facturation</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">1.3 Données d'Utilisation</h3>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Historique des locations</li>
                    <li>Préférences de véhicules</li>
                    <li>Évaluations et commentaires</li>
                    <li>Données de navigation sur le site</li>
                    <li>Conversations du chat client</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Section 2 */}
            <section>
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Eye className="h-5 w-5 text-purple-600" />
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">2</span>
                Utilisation des Données
              </h2>
              <div className="space-y-4 text-gray-700">
                <div>
                  <h3 className="font-semibold mb-2">2.1 Finalités Principales</h3>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Traitement des réservations et locations</li>
                    <li>Vérification d'identité et éligibilité</li>
                    <li>Traitement des paiements Mobile Money</li>
                    <li>Gestion du service client</li>
                    <li>Facturation et comptabilité</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">2.2 Amélioration des Services</h3>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Personnalisation de l'expérience utilisateur</li>
                    <li>Analyse statistique et amélioration du service</li>
                    <li>Développement de nouveaux services</li>
                    <li>Prévention de la fraude</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">2.3 Communication</h3>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Notifications de réservation (SMS, WhatsApp)</li>
                    <li>Rappels et confirmations</li>
                    <li>Support client et assistance</li>
                    <li>Informations promotionnelles (avec consentement)</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Section 3 */}
            <section>
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">3</span>
                Partage des Données
              </h2>
              <div className="space-y-4 text-gray-700">
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2 text-yellow-800">Principe de Non-Vente</h3>
                  <p className="text-yellow-700">
                    Nous ne vendons jamais vos données personnelles à des tiers. Le partage est limité aux cas
                    strictement nécessaires ci-dessous.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">3.1 Partenaires Techniques</h3>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>
                      <strong>MTN Cameroun :</strong> Traitement des paiements MoMo
                    </li>
                    <li>
                      <strong>Orange Cameroun :</strong> Traitement des paiements Orange Money
                    </li>
                    <li>
                      <strong>Prestataires SMS :</strong> Envoi de notifications
                    </li>
                    <li>
                      <strong>Hébergement :</strong> Stockage sécurisé des données
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">3.2 Obligations Légales</h3>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Autorités judiciaires sur réquisition</li>
                    <li>Administrations fiscales</li>
                    <li>Forces de l'ordre dans le cadre d'enquêtes</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Section 4 */}
            <section>
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Lock className="h-5 w-5 text-red-600" />
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">4</span>
                Sécurité des Données
              </h2>
              <div className="space-y-4 text-gray-700">
                <div>
                  <h3 className="font-semibold mb-2">4.1 Mesures Techniques</h3>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Chiffrement SSL/TLS pour toutes les communications</li>
                    <li>Chiffrement des données sensibles en base</li>
                    <li>Authentification à deux facteurs</li>
                    <li>Surveillance continue des accès</li>
                    <li>Sauvegardes automatiques sécurisées</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">4.2 Mesures Organisationnelles</h3>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Accès limité aux données selon les besoins</li>
                    <li>Formation du personnel à la protection des données</li>
                    <li>Audits de sécurité réguliers</li>
                    <li>Procédures de gestion des incidents</li>
                  </ul>
                </div>
                <div className="bg-red-50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2 text-red-800">En Cas de Violation</h3>
                  <p className="text-red-700">
                    En cas de violation de données, nous nous engageons à vous informer dans les 72 heures et à prendre
                    toutes les mesures correctives nécessaires.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 5 */}
            <section>
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">5</span>
                Vos Droits
              </h2>
              <div className="space-y-4 text-gray-700">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="font-semibold mb-2 text-blue-800">Droit d'Accès</h3>
                    <p className="text-blue-700 text-sm">
                      Vous pouvez demander une copie de toutes les données que nous détenons sur vous.
                    </p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h3 className="font-semibold mb-2 text-green-800">Droit de Rectification</h3>
                    <p className="text-green-700 text-sm">
                      Vous pouvez corriger ou mettre à jour vos informations personnelles.
                    </p>
                  </div>
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <h3 className="font-semibold mb-2 text-yellow-800">Droit d'Effacement</h3>
                    <p className="text-yellow-700 text-sm">
                      Vous pouvez demander la suppression de vos données (sous conditions légales).
                    </p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h3 className="font-semibold mb-2 text-purple-800">Droit de Portabilité</h3>
                    <p className="text-purple-700 text-sm">
                      Vous pouvez récupérer vos données dans un format structuré.
                    </p>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">5.1 Comment Exercer vos Droits</h3>
                  <p>
                    Pour exercer vos droits, contactez-nous via les moyens indiqués ci-dessous. Nous répondrons dans un
                    délai maximum de 30 jours.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 6 */}
            <section>
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">6</span>
                Conservation des Données
              </h2>
              <div className="space-y-3 text-gray-700">
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-300">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="border border-gray-300 px-4 py-2 text-left">Type de Données</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">Durée de Conservation</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border border-gray-300 px-4 py-2">Données de compte actif</td>
                        <td className="border border-gray-300 px-4 py-2">Tant que le compte est actif</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 px-4 py-2">Historique des locations</td>
                        <td className="border border-gray-300 px-4 py-2">5 ans après la dernière location</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 px-4 py-2">Données de paiement</td>
                        <td className="border border-gray-300 px-4 py-2">10 ans (obligations comptables)</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 px-4 py-2">Conversations chat</td>
                        <td className="border border-gray-300 px-4 py-2">2 ans</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 px-4 py-2">Données de navigation</td>
                        <td className="border border-gray-300 px-4 py-2">13 mois</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </section>

            {/* Section 7 */}
            <section>
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">7</span>
                Cookies et Technologies Similaires
              </h2>
              <div className="space-y-4 text-gray-700">
                <div>
                  <h3 className="font-semibold mb-2">7.1 Types de Cookies Utilisés</h3>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>
                      <strong>Cookies essentiels :</strong> Fonctionnement du site
                    </li>
                    <li>
                      <strong>Cookies de performance :</strong> Analyse d'utilisation
                    </li>
                    <li>
                      <strong>Cookies de préférence :</strong> Mémorisation de vos choix
                    </li>
                    <li>
                      <strong>Cookies marketing :</strong> Personnalisation (avec consentement)
                    </li>
                  </ul>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2 text-blue-800">Gestion des Cookies</h3>
                  <p className="text-blue-700">
                    Vous pouvez gérer vos préférences de cookies via les paramètres de votre navigateur ou notre bandeau
                    de consentement.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 8 */}
            <section>
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Phone className="h-5 w-5 text-green-600" />
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">8</span>
                Contact et Réclamations
              </h2>
              <div className="space-y-4 text-gray-700">
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-3 text-green-800">Délégué à la Protection des Données</h3>
                  <div className="space-y-2 text-green-700">
                    <p className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      <strong>Email :</strong> dpo@location-cameroun.com
                    </p>
                    <p className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      <strong>Téléphone :</strong> +237 6XX XXX XXX
                    </p>
                    <p>
                      <strong>Adresse :</strong> [Adresse complète], Douala, Cameroun
                    </p>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">8.1 Procédure de Réclamation</h3>
                  <ol className="list-decimal pl-6 space-y-1">
                    <li>Contactez notre DPO par email ou téléphone</li>
                    <li>Décrivez précisément votre demande ou réclamation</li>
                    <li>Joignez les justificatifs nécessaires</li>
                    <li>Nous accusons réception sous 48h</li>
                    <li>Réponse définitive sous 30 jours maximum</li>
                  </ol>
                </div>
              </div>
            </section>

            {/* Section 9 */}
            <section>
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">9</span>
                Modifications de la Politique
              </h2>
              <div className="space-y-3 text-gray-700">
                <p>
                  Cette politique peut être modifiée pour refléter les évolutions légales, techniques ou de nos
                  services. Toute modification importante vous sera notifiée par email ou via notre site web.
                </p>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">
                    <strong>Historique des versions :</strong>
                  </p>
                  <ul className="text-sm text-gray-600 mt-2">
                    <li>• Version 1.0 - {new Date().toLocaleDateString("fr-FR")} - Version initiale</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Footer */}
            <div className="border-t pt-6 mt-8">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 text-center">
                  Cette politique de confidentialité est conforme à la réglementation camerounaise sur la protection des
                  données personnelles et aux standards internationaux.
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
