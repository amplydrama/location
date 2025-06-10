"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Calendar, Car, MapPin, Phone, Star, Users } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

const featuredCars = [
  {
    id: 1,
    name: "Toyota Corolla",
    type: "Berline",
    price: 25000,
    image: "/placeholder.svg?height=200&width=300",
    features: ["5 places", "Climatisation", "Boîte automatique"],
    rating: 4.8,
    available: true,
  },
  {
    id: 2,
    name: "Nissan Pathfinder",
    type: "SUV",
    price: 45000,
    image: "/placeholder.svg?height=200&width=300",
    features: ["7 places", "4x4", "GPS intégré"],
    rating: 4.9,
    available: true,
  },
  {
    id: 3,
    name: "Hyundai Accent",
    type: "Économique",
    price: 20000,
    image: "/placeholder.svg?height=200&width=300",
    features: ["5 places", "Économique", "Bluetooth"],
    rating: 4.6,
    available: false,
  },
]

export default function HomePage() {
  const [searchLocation, setSearchLocation] = useState("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Car className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">CarLoc Cameroun</span>
            </div>
            <nav className="hidden md:flex space-x-8">
              <Link href="/" className="text-gray-700 hover:text-blue-600">
                Accueil
              </Link>
              <Link href="/vehicles" className="text-gray-700 hover:text-blue-600">
                Véhicules
              </Link>
              <Link href="/about" className="text-gray-700 hover:text-blue-600">
                À propos
              </Link>
              <Link href="/contact" className="text-gray-700 hover:text-blue-600">
                Contact
              </Link>
            </nav>
            <div className="flex items-center space-x-4">
              <Link href="/login">
                <Button variant="outline">Connexion</Button>
              </Link>
              <Link href="/register">
                <Button>Inscription</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Location de voitures au <span className="text-blue-600">Cameroun</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Réservez votre véhicule en ligne et payez facilement avec MTN MoMo ou Orange Money. Service fiable dans tout
            le Cameroun.
          </p>

          {/* Search Form */}
          <Card className="max-w-4xl mx-auto">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Lieu de prise</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Douala, Yaoundé..."
                      className="pl-10"
                      value={searchLocation}
                      onChange={(e) => setSearchLocation(e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Date de début</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      type="date"
                      className="pl-10"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Date de fin</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input type="date" className="pl-10" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                  </div>
                </div>
                <div className="flex items-end">
                  <Link href="/vehicles" className="w-full">
                    <Button className="w-full h-10">Rechercher</Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Featured Cars */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Véhicules populaires</h2>
            <p className="text-lg text-gray-600">Découvrez notre sélection de véhicules les plus demandés</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredCars.map((car) => (
              <Card key={car.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative">
                  <Image
                    src={car.image || "/placeholder.svg"}
                    alt={car.name}
                    width={300}
                    height={200}
                    className="w-full h-48 object-cover"
                  />
                  {!car.available && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                      <Badge variant="secondary" className="text-white bg-red-600">
                        Non disponible
                      </Badge>
                    </div>
                  )}
                </div>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-semibold text-gray-900">{car.name}</h3>
                    <Badge variant="outline">{car.type}</Badge>
                  </div>

                  <div className="flex items-center mb-3">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="text-sm text-gray-600 ml-1">{car.rating}</span>
                  </div>

                  <div className="space-y-2 mb-4">
                    {car.features.map((feature, index) => (
                      <div key={index} className="flex items-center text-sm text-gray-600">
                        <div className="w-2 h-2 bg-blue-600 rounded-full mr-2"></div>
                        {feature}
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-2xl font-bold text-blue-600">{car.price.toLocaleString()}</span>
                      <span className="text-gray-600"> FCFA/jour</span>
                    </div>
                    <Link href={`/booking/${car.id}`}>
                      <Button disabled={!car.available}>{car.available ? "Réserver" : "Indisponible"}</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Payment Methods */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Paiement sécurisé</h2>
          <p className="text-lg text-gray-600 mb-8">Payez facilement avec vos moyens de paiement préférés</p>

          <div className="flex justify-center items-center space-x-8">
            <div className="flex items-center space-x-2">
              <div className="w-12 h-12 bg-yellow-400 rounded-lg flex items-center justify-center">
                <Phone className="h-6 w-6 text-white" />
              </div>
              <span className="font-semibold">MTN MoMo</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center">
                <Phone className="h-6 w-6 text-white" />
              </div>
              <span className="font-semibold">Orange Money</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Pourquoi nous choisir ?</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Car className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Véhicules récents</h3>
              <p className="text-gray-600">Flotte moderne et bien entretenue pour votre sécurité</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Paiement mobile</h3>
              <p className="text-gray-600">Paiement rapide et sécurisé via Mobile Money</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Service client 24/7</h3>
              <p className="text-gray-600">Support disponible à tout moment pour vous aider</p>
            </div>
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
                <li>+237 6XX XXX XXX</li>
                <li>info@carloc-cameroun.com</li>
                <li>Douala, Cameroun</li>
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
