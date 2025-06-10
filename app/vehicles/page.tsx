"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Car, Filter, Star, Users, Fuel, Settings, MapPin } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

const vehicles = [
  {
    id: 1,
    name: "Toyota Corolla",
    type: "Berline",
    brand: "Toyota",
    price: 25000,
    image: "/placeholder.svg?height=200&width=300",
    features: ["5 places", "Climatisation", "Boîte automatique", "Bluetooth"],
    rating: 4.8,
    available: true,
    fuel: "Essence",
    transmission: "Automatique",
    location: "Douala",
  },
  {
    id: 2,
    name: "Nissan Pathfinder",
    type: "SUV",
    brand: "Nissan",
    price: 45000,
    image: "/placeholder.svg?height=200&width=300",
    features: ["7 places", "4x4", "GPS intégré", "Caméra de recul"],
    rating: 4.9,
    available: true,
    fuel: "Essence",
    transmission: "Automatique",
    location: "Yaoundé",
  },
  {
    id: 3,
    name: "Hyundai Accent",
    type: "Économique",
    brand: "Hyundai",
    price: 20000,
    image: "/placeholder.svg?height=200&width=300",
    features: ["5 places", "Économique", "Bluetooth", "USB"],
    rating: 4.6,
    available: true,
    fuel: "Essence",
    transmission: "Manuelle",
    location: "Douala",
  },
  {
    id: 4,
    name: "Toyota Hilux",
    type: "Pick-up",
    brand: "Toyota",
    price: 55000,
    image: "/placeholder.svg?height=200&width=300",
    features: ["4 places", "4x4", "Robuste", "Climatisation"],
    rating: 4.7,
    available: true,
    fuel: "Diesel",
    transmission: "Manuelle",
    location: "Bafoussam",
  },
  {
    id: 5,
    name: "Kia Picanto",
    type: "Citadine",
    brand: "Kia",
    price: 18000,
    image: "/placeholder.svg?height=200&width=300",
    features: ["4 places", "Compact", "Économique", "Facile à garer"],
    rating: 4.5,
    available: false,
    fuel: "Essence",
    transmission: "Manuelle",
    location: "Yaoundé",
  },
  {
    id: 6,
    name: "Honda CR-V",
    type: "SUV",
    brand: "Honda",
    price: 42000,
    image: "/placeholder.svg?height=200&width=300",
    features: ["5 places", "AWD", "Spacieux", "Sécurité avancée"],
    rating: 4.8,
    available: true,
    fuel: "Essence",
    transmission: "Automatique",
    location: "Douala",
  },
]

export default function VehiclesPage() {
  const [filteredVehicles, setFilteredVehicles] = useState(vehicles)
  const [filters, setFilters] = useState({
    type: "all",
    brand: "all",
    priceRange: "all",
    location: "all",
    transmission: "all",
    fuel: "all",
  })

  const applyFilters = () => {
    const filtered = vehicles.filter((vehicle) => {
      return (
        (filters.type === "all" || vehicle.type === filters.type) &&
        (filters.brand === "all" || vehicle.brand === filters.brand) &&
        (filters.location === "all" || vehicle.location === filters.location) &&
        (filters.transmission === "all" || vehicle.transmission === filters.transmission) &&
        (filters.fuel === "all" || vehicle.fuel === filters.fuel) &&
        (filters.priceRange === "all" ||
          (filters.priceRange === "low" && vehicle.price <= 25000) ||
          (filters.priceRange === "medium" && vehicle.price > 25000 && vehicle.price <= 40000) ||
          (filters.priceRange === "high" && vehicle.price > 40000))
      )
    })
    setFilteredVehicles(filtered)
  }

  const resetFilters = () => {
    setFilters({
      type: "all",
      brand: "all",
      priceRange: "all",
      location: "all",
      transmission: "all",
      fuel: "all",
    })
    setFilteredVehicles(vehicles)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2">
              <Car className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">CarLoc Cameroun</span>
            </Link>
            <nav className="hidden md:flex space-x-8">
              <Link href="/" className="text-gray-700 hover:text-blue-600">
                Accueil
              </Link>
              <Link href="/vehicles" className="text-blue-600 font-medium">
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
              <Link href="/dashboard">
                <Button>Mon compte</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Nos véhicules</h1>
          <p className="text-gray-600">Trouvez le véhicule parfait pour vos besoins</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold flex items-center">
                  <Filter className="h-5 w-5 mr-2" />
                  Filtres
                </h2>
                <Button variant="ghost" size="sm" onClick={resetFilters}>
                  Réinitialiser
                </Button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Type de véhicule</label>
                  <Select value={filters.type} onValueChange={(value) => setFilters({ ...filters, type: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Tous les types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous les types</SelectItem>
                      <SelectItem value="Berline">Berline</SelectItem>
                      <SelectItem value="SUV">SUV</SelectItem>
                      <SelectItem value="Économique">Économique</SelectItem>
                      <SelectItem value="Pick-up">Pick-up</SelectItem>
                      <SelectItem value="Citadine">Citadine</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Marque</label>
                  <Select value={filters.brand} onValueChange={(value) => setFilters({ ...filters, brand: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Toutes les marques" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Toutes les marques</SelectItem>
                      <SelectItem value="Toyota">Toyota</SelectItem>
                      <SelectItem value="Nissan">Nissan</SelectItem>
                      <SelectItem value="Hyundai">Hyundai</SelectItem>
                      <SelectItem value="Kia">Kia</SelectItem>
                      <SelectItem value="Honda">Honda</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Ville</label>
                  <Select
                    value={filters.location}
                    onValueChange={(value) => setFilters({ ...filters, location: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Toutes les villes" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Toutes les villes</SelectItem>
                      <SelectItem value="Douala">Douala</SelectItem>
                      <SelectItem value="Yaoundé">Yaoundé</SelectItem>
                      <SelectItem value="Bafoussam">Bafoussam</SelectItem>
                      <SelectItem value="Bamenda">Bamenda</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Gamme de prix</label>
                  <Select
                    value={filters.priceRange}
                    onValueChange={(value) => setFilters({ ...filters, priceRange: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Tous les prix" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous les prix</SelectItem>
                      <SelectItem value="low">Moins de 25 000 FCFA</SelectItem>
                      <SelectItem value="medium">25 000 - 40 000 FCFA</SelectItem>
                      <SelectItem value="high">Plus de 40 000 FCFA</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Transmission</label>
                  <Select
                    value={filters.transmission}
                    onValueChange={(value) => setFilters({ ...filters, transmission: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Toutes" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Toutes</SelectItem>
                      <SelectItem value="Automatique">Automatique</SelectItem>
                      <SelectItem value="Manuelle">Manuelle</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Carburant</label>
                  <Select value={filters.fuel} onValueChange={(value) => setFilters({ ...filters, fuel: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Tous" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous</SelectItem>
                      <SelectItem value="Essence">Essence</SelectItem>
                      <SelectItem value="Diesel">Diesel</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button onClick={applyFilters} className="w-full">
                  Appliquer les filtres
                </Button>
              </div>
            </Card>
          </div>

          {/* Vehicles Grid */}
          <div className="lg:col-span-3">
            <div className="mb-4 flex justify-between items-center">
              <p className="text-gray-600">{filteredVehicles.length} véhicule(s) trouvé(s)</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredVehicles.map((vehicle) => (
                <Card key={vehicle.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative">
                    <Image
                      src={vehicle.image || "/placeholder.svg"}
                      alt={vehicle.name}
                      width={300}
                      height={200}
                      className="w-full h-48 object-cover"
                    />
                    {!vehicle.available && (
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <Badge variant="secondary" className="text-white bg-red-600">
                          Non disponible
                        </Badge>
                      </div>
                    )}
                    <div className="absolute top-2 left-2">
                      <Badge variant="secondary">{vehicle.type}</Badge>
                    </div>
                    <div className="absolute top-2 right-2 flex items-center space-x-1 bg-white rounded-full px-2 py-1">
                      <MapPin className="h-3 w-3 text-gray-500" />
                      <span className="text-xs text-gray-600">{vehicle.location}</span>
                    </div>
                  </div>

                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{vehicle.name}</h3>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="text-sm text-gray-600 ml-1">{vehicle.rating}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mb-3 text-xs text-gray-600">
                      <div className="flex items-center">
                        <Users className="h-3 w-3 mr-1" />
                        {vehicle.features[0]}
                      </div>
                      <div className="flex items-center">
                        <Fuel className="h-3 w-3 mr-1" />
                        {vehicle.fuel}
                      </div>
                      <div className="flex items-center">
                        <Settings className="h-3 w-3 mr-1" />
                        {vehicle.transmission}
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <div>
                        <span className="text-xl font-bold text-blue-600">{vehicle.price.toLocaleString()}</span>
                        <span className="text-gray-600 text-sm"> FCFA/jour</span>
                      </div>
                      <Link href={`/booking/${vehicle.id}`}>
                        <Button disabled={!vehicle.available} size="sm">
                          {vehicle.available ? "Réserver" : "Indisponible"}
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredVehicles.length === 0 && (
              <div className="text-center py-12">
                <Car className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun véhicule trouvé</h3>
                <p className="text-gray-600">Essayez de modifier vos critères de recherche</p>
                <Button onClick={resetFilters} className="mt-4">
                  Réinitialiser les filtres
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
