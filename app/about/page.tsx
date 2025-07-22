"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Car, Shield, MapPin, Phone, Mail, Award, CheckCircle, Heart, Target, Zap, Menu } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useState } from "react"

const teamMembers = [
  {
    name: "Jean-Paul Mbarga",
    role: "Directeur Général",
    image: "/placeholder.svg?height=200&width=200",
    description: "15 ans d'expérience dans l'industrie automobile au Cameroun",
  },
  {
    name: "Marie Ngono",
    role: "Directrice Commerciale",
    image: "/placeholder.svg?height=200&width=200",
    description: "Spécialiste en service client et développement commercial",
  },
  {
    name: "Paul Kouam",
    role: "Responsable Technique",
    image: "/placeholder.svg?height=200&width=200",
    description: "Expert en maintenance et gestion de flotte automobile",
  },
  {
    name: "Fatima Bello",
    role: "Responsable Financière",
    image: "/placeholder.svg?height=200&width=200",
    description: "Gestion financière et partenariats Mobile Money",
  },
]

const values = [
  {
    icon: Shield,
    title: "Fiabilité",
    description: "Véhicules entretenus et contrôlés régulièrement pour votre sécurité",
  },
  {
    icon: Heart,
    title: "Service Client",
    description: "Une équipe dédiée à votre satisfaction, disponible 24h/7j",
  },
  {
    icon: Target,
    title: "Transparence",
    description: "Prix clairs, sans frais cachés, factures détaillées",
  },
  {
    icon: Zap,
    title: "Innovation",
    description: "Paiement mobile, réservation en ligne, technologies modernes",
  },
]

const services = [
  {
    title: "Location courte durée",
    description: "De quelques heures à plusieurs jours",
    features: ["Tarifs compétitifs", "Véhicules récents", "Assurance incluse"],
  },
  {
    title: "Location longue durée",
    description: "Solutions pour entreprises et particuliers",
    features: ["Tarifs dégressifs", "Maintenance incluse", "Remplacement garanti"],
  },
  {
    title: "Transferts aéroport",
    description: "Service de navette depuis/vers les aéroports",
    features: ["Ponctualité garantie", "Chauffeurs professionnels", "Suivi en temps réel"],
  },
  {
    title: "Véhicules avec chauffeur",
    description: "Chauffeurs expérimentés et professionnels",
    features: ["Chauffeurs certifiés", "Connaissance locale", "Service premium"],
  },
]

const cities = [
  { name: "Douala", description: "Centre économique", vehicles: 12 },
  { name: "Yaoundé", description: "Capitale politique", vehicles: 8 },
  { name: "Bafoussam", description: "Région de l'Ouest", vehicles: 4 },
  { name: "Bamenda", description: "Région du Nord-Ouest", vehicles: 3 },
]

const stats = [
  { number: "500+", label: "Clients satisfaits" },
  { number: "25", label: "Véhicules disponibles" },
  { number: "4", label: "Villes desservies" },
  { number: "3", label: "Années d'expérience" },
]

export default function AboutPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b fixed top-0 left-0 w-full z-50 ">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2">
              <Car className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">CarLoc Cameroun</span>
            </Link>
            <nav className="me:hidden xs:flex space-x-8">
              <Link href="/" className="text-gray-700 hover:text-blue-600">
                Accueil
              </Link>
              <Link href="/vehicles" className="text-gray-700 hover:text-blue-600">
                Véhicules
              </Link>
              <Link href="/reservations" className="text-gray-700 hover:text-blue-600">
                Mes réservations
              </Link>
              <Link href="/about" className="text-blue-600 font-medium">
                À propos
              </Link>
              <Link href="/contact" className="text-gray-700 hover:text-blue-600">
                Contact
              </Link>
            </nav>
            <div className="me:hidden xs:flex items-center space-x-4">
              <Link href="/login">
                <Button variant="outline">Connexion</Button>
              </Link>
              <Link href="/register">
                <Button>Inscription</Button>
              </Link>
            </div>

            <div className="flex xs:hidden items-center">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                    <Menu className="h-6 w-6" />
                </Button>
            </div>
            {isMobileMenuOpen && (
                <div className="flex flex-col xs:hidden absolute z-100 top-16 left-0 w-full bg-white shadow-lg px-4 pt-2 pb-4 space-y-2 border-t border-gray-200">
                    <Link href="/" className="block text-gray-700 hover:text-blue-600 py-2" onClick={() => setIsMobileMenuOpen(false)}>
                        Accueil
                    </Link>
                    <Link href="/vehicles" className="block text-gray-700 hover:text-blue-600 py-2" onClick={() => setIsMobileMenuOpen(false)}>
                        Véhicules
                    </Link>
                    <Link href="/reservations" className="block text-blue-600 font-medium py-2" onClick={() => setIsMobileMenuOpen(false)}>
                        Mes réservations
                    </Link>
                    <Link href="/about" className="block text-gray-700 hover:text-blue-600 py-2" onClick={() => setIsMobileMenuOpen(false)}>
                        À propos
                    </Link>
                    <Link href="/contact" className="block text-gray-700 hover:text-blue-600 py-2" onClick={() => setIsMobileMenuOpen(false)}>
                        Contact
                    </Link>
                    <div className="pt-4 space-y-2 border-t border-gray-100">
                        <Link href="/login">
                            <Button variant="outline" className="w-full" onClick={() => setIsMobileMenuOpen(false)}>Connexion</Button>
                        </Link>
                        <Link href="/dashboard">
                            <Button className="w-full" onClick={() => setIsMobileMenuOpen(false)}>Mon compte</Button>
                        </Link>
                    </div>
                </div>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-blue-800 text-white mt-[65px]">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            À propos de <span className="text-yellow-400">CarLoc Cameroun</span>
          </h1>
          <p className="text-xl mb-8 max-w-3xl mx-auto opacity-90">
            Votre partenaire de confiance pour la location de véhicules au Cameroun depuis 2021. Nous révolutionnons la
            mobilité avec des solutions modernes et accessibles.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-12">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-yellow-400">{stat.number}</div>
                <div className="text-sm md:text-base opacity-90">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Notre Histoire */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Notre Histoire</h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  Fondée en 2021 à Douala, CarLoc Cameroun est née de la vision de démocratiser l'accès à la mobilité au
                  Cameroun. Nos fondateurs, passionnés d'automobile et de technologie, ont identifié le besoin d'une
                  solution de location moderne et accessible.
                </p>
                <p>
                  Nous avons commencé avec une flotte de 5 véhicules et une équipe de 3 personnes. Aujourd'hui, nous
                  comptons plus de 25 véhicules répartis dans 4 villes du Cameroun et une équipe dédiée de 15
                  professionnels.
                </p>
                <p>
                  Notre innovation principale : l'intégration des paiements Mobile Money (MTN MoMo et Orange Money) pour
                  rendre nos services accessibles à tous les Camerounais, où qu'ils soient.
                </p>
              </div>
              <div className="mt-8">
                <Link href="/vehicles">
                  <Button size="lg">Découvrir nos véhicules</Button>
                </Link>
              </div>
            </div>
            <div className="relative">
              <Image
                src="/placeholder.svg?height=400&width=600"
                alt="Histoire CarLoc Cameroun"
                width={600}
                height={400}
                className="rounded-lg shadow-lg"
              />
              <div className="absolute -bottom-6 -left-6 bg-yellow-400 text-gray-900 p-4 rounded-lg shadow-lg">
                <div className="flex items-center space-x-2">
                  <Award className="h-6 w-6" />
                  <div>
                    <div className="font-bold">Entreprise certifiée</div>
                    <div className="text-sm">Ministère des Transports</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Nos Valeurs */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Nos Valeurs</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Les principes qui guident notre action quotidienne et notre engagement envers nos clients
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <value.icon className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                  <p className="text-gray-600">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Notre Équipe */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Notre Équipe</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Des professionnels passionnés et expérimentés au service de votre mobilité
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <Image
                    src={member.image || "/placeholder.svg"}
                    alt={member.name}
                    width={200}
                    height={200}
                    className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                  />
                  <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
                  <p className="text-blue-600 font-medium mb-2">{member.role}</p>
                  <p className="text-gray-600 text-sm">{member.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Nos Services */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Nos Services</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Une gamme complète de services pour répondre à tous vos besoins de mobilité
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {services.map((service, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
                  <p className="text-gray-600 mb-4">{service.description}</p>
                  <ul className="space-y-2">
                    {service.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center text-sm">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Nos Villes */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Nos Villes de Service</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Présents dans les principales villes du Cameroun pour vous servir au plus près
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {cities.map((city, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <MapPin className="h-8 w-8 text-blue-600 mx-auto mb-3" />
                  <h3 className="text-lg font-semibold mb-1">{city.name}</h3>
                  <p className="text-gray-600 text-sm mb-2">{city.description}</p>
                  <Badge variant="outline">{city.vehicles} véhicules</Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Prêt à commencer votre voyage ?</h2>
          <p className="text-xl mb-8 opacity-90">
            Rejoignez les centaines de clients qui nous font confiance pour leurs déplacements
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/vehicles">
              <Button size="lg" variant="secondary">
                Voir nos véhicules
              </Button>
            </Link>
            <Link href="/contact">
              <Button
                size="lg"
                variant="outline"
                className="text-white border-white hover:bg-white hover:text-blue-600"
              >
                Nous contacter
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Car className="h-8 w-8 text-blue-400" />
                <span className="text-xl font-bold">CarLoc Cameroun</span>
              </div>
              <p className="text-gray-400">Votre partenaire de confiance pour la location de véhicules au Cameroun.</p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Services</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Location courte durée</li>
                <li>Location longue durée</li>
                <li>Véhicules avec chauffeur</li>
                <li>Transferts aéroport</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Villes</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Douala</li>
                <li>Yaoundé</li>
                <li>Bafoussam</li>
                <li>Bamenda</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Contact</h3>
              <ul className="space-y-2 text-gray-400">
                <li className="flex items-center">
                  <Phone className="h-4 w-4 mr-2" />
                  +237 6XX XXX XXX
                </li>
                <li className="flex items-center">
                  <Mail className="h-4 w-4 mr-2" />
                  info@carloc-cameroun.com
                </li>
                <li className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2" />
                  Douala, Cameroun
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 CarLoc Cameroun. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
