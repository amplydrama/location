"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Car, Plus, Edit, Eye, MapPin, Fuel, Users, Settings } from "lucide-react"
import { ImageUpload } from "@/components/ui/image-upload"

// Mock data pour les véhicules
const vehicles = [
  {
    id: 1,
    name: "Toyota Corolla",
    brand: "Toyota",
    model: "Corolla",
    year: 2022,
    type: "Berline",
    plate: "LT-123-CM",
    color: "Blanc",
    seats: 5,
    transmission: "Automatique",
    fuelType: "Essence",
    mileage: 15000,
    pricePerDay: 25000,
    status: "Disponible",
    location: "Douala",
    features: ["Climatisation", "GPS", "Bluetooth", "Caméra de recul"],
    insurance: {
      company: "ACTIVA Assurance",
      policyNumber: "ACT-2024-001",
      expiryDate: "2024-12-31",
    },
    maintenance: {
      lastService: "2024-01-01",
      nextService: "2024-04-01",
      status: "À jour",
    },
    bookings: 23,
    revenue: 575000,
    rating: 4.8,
    images: ["/placeholder.svg?height=200&width=300"],
    description: "Véhicule économique et fiable, parfait pour les déplacements en ville.",
  },
  {
    id: 2,
    name: "Nissan Pathfinder",
    brand: "Nissan",
    model: "Pathfinder",
    year: 2021,
    type: "SUV",
    plate: "YA-456-CM",
    color: "Noir",
    seats: 7,
    transmission: "Automatique",
    fuelType: "Essence",
    mileage: 28000,
    pricePerDay: 45000,
    status: "Loué",
    location: "Yaoundé",
    features: ["Climatisation", "GPS", "Bluetooth", "7 places", "Toit ouvrant"],
    insurance: {
      company: "SUNU Assurance",
      policyNumber: "SUN-2024-002",
      expiryDate: "2024-11-30",
    },
    maintenance: {
      lastService: "2023-12-15",
      nextService: "2024-03-15",
      status: "À jour",
    },
    bookings: 18,
    revenue: 810000,
    rating: 4.6,
    images: ["/placeholder.svg?height=200&width=300"],
    description: "SUV spacieux idéal pour les familles et les voyages longue distance.",
  },
  {
    id: 3,
    name: "Hyundai Accent",
    brand: "Hyundai",
    model: "Accent",
    year: 2023,
    type: "Économique",
    plate: "DLA-789-CM",
    color: "Rouge",
    seats: 5,
    transmission: "Manuelle",
    fuelType: "Essence",
    mileage: 8000,
    pricePerDay: 20000,
    status: "Maintenance",
    location: "Douala",
    features: ["Climatisation", "Radio", "USB"],
    insurance: {
      company: "ACTIVA Assurance",
      policyNumber: "ACT-2024-003",
      expiryDate: "2024-12-31",
    },
    maintenance: {
      lastService: "2024-01-10",
      nextService: "2024-04-10",
      status: "En cours",
    },
    bookings: 31,
    revenue: 620000,
    rating: 4.4,
    images: ["/placeholder.svg?height=200&width=300"],
    description: "Véhicule économique parfait pour les budgets serrés.",
  },
  {
    id: 4,
    name: "Toyota RAV4",
    brand: "Toyota",
    model: "RAV4",
    year: 2022,
    type: "SUV",
    plate: "BF-321-CM",
    color: "Gris",
    seats: 5,
    transmission: "Automatique",
    fuelType: "Hybride",
    mileage: 12000,
    pricePerDay: 40000,
    status: "Disponible",
    location: "Bafoussam",
    features: ["Climatisation", "GPS", "Bluetooth", "Hybride", "AWD"],
    insurance: {
      company: "SUNU Assurance",
      policyNumber: "SUN-2024-004",
      expiryDate: "2024-10-31",
    },
    maintenance: {
      lastService: "2023-11-20",
      nextService: "2024-02-20",
      status: "Bientôt dû",
    },
    bookings: 15,
    revenue: 600000,
    rating: 4.9,
    images: ["/placeholder.svg?height=200&width=300"],
    description: "SUV hybride moderne avec excellente consommation.",
  },
]

export default function VehiclesPage() {
  const [filteredVehicles, setFilteredVehicles] = useState(vehicles)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const [selectedVehicle, setSelectedVehicle] = useState<any>(null)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [vehicleImages, setVehicleImages] = useState<string[]>([])
  const [newVehicle, setNewVehicle] = useState({
    name: "",
    brand: "",
    model: "",
    year: "",
    type: "",
    plate: "",
    color: "",
    seats: "",
    transmission: "",
    fuelType: "",
    pricePerDay: "",
    location: "",
    description: "",
    features: [] as string[],
    images: [] as string[],
  })

  // Filtrage des véhicules
  useEffect(() => {
    let filtered = vehicles

    if (searchTerm) {
      filtered = filtered.filter(
        (vehicle) =>
          vehicle.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          vehicle.plate.toLowerCase().includes(searchTerm.toLowerCase()) ||
          vehicle.brand.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((vehicle) => vehicle.status === statusFilter)
    }

    if (typeFilter !== "all") {
      filtered = filtered.filter((vehicle) => vehicle.type === typeFilter)
    }

    setFilteredVehicles(filtered)
  }, [searchTerm, statusFilter, typeFilter])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Disponible":
        return <Badge className="bg-green-100 text-green-800">Disponible</Badge>
      case "Loué":
        return <Badge className="bg-blue-100 text-blue-800">Loué</Badge>
      case "Maintenance":
        return <Badge className="bg-yellow-100 text-yellow-800">Maintenance</Badge>
      case "Hors service":
        return <Badge className="bg-red-100 text-red-800">Hors service</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getMaintenanceStatusBadge = (status: string) => {
    switch (status) {
      case "À jour":
        return <Badge className="bg-green-100 text-green-800">À jour</Badge>
      case "Bientôt dû":
        return <Badge className="bg-yellow-100 text-yellow-800">Bientôt dû</Badge>
      case "En retard":
        return <Badge className="bg-red-100 text-red-800">En retard</Badge>
      case "En cours":
        return <Badge className="bg-blue-100 text-blue-800">En cours</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const handleViewVehicle = (vehicle: any) => {
    setSelectedVehicle(vehicle)
    setIsViewDialogOpen(true)
  }

  const handleAddVehicle = async () => {
    try {
      const vehicleData = {
        ...newVehicle,
        plateNumber: newVehicle.plate,
        images: vehicleImages,
        features: ["Climatisation", "GPS"], // Vous pouvez ajouter un sélecteur d'équipements
        year: Number.parseInt(newVehicle.year),
        seats: Number.parseInt(newVehicle.seats),
        pricePerDay: Number.parseInt(newVehicle.pricePerDay),
      }

      const response = await fetch("/api/vehicles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(vehicleData),
      })

      const result = await response.json()

      if (response.ok) {
        alert("Véhicule ajouté avec succès!")
        setIsAddDialogOpen(false)
        setNewVehicle({
          name: "",
          brand: "",
          model: "",
          year: "",
          type: "",
          plate: "",
          color: "",
          seats: "",
          transmission: "",
          fuelType: "",
          pricePerDay: "",
          location: "",
          description: "",
          features: [],
          images: [],
        })
        setVehicleImages([])
        // Recharger la liste des véhicules
        window.location.reload()
      } else {
        alert(result.error || "Erreur lors de l'ajout du véhicule")
      }
    } catch (error) {
      console.error("Erreur:", error)
      alert("Erreur lors de l'ajout du véhicule")
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestion des véhicules</h1>
          <p className="text-gray-600">Gérez votre flotte de véhicules</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Ajouter un véhicule
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Ajouter un nouveau véhicule</DialogTitle>
              <DialogDescription>Remplissez les informations du véhicule à ajouter à votre flotte.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4 max-h-96 overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="brand">Marque</Label>
                  <Input
                    id="brand"
                    value={newVehicle.brand}
                    onChange={(e) => setNewVehicle({ ...newVehicle, brand: e.target.value })}
                    placeholder="Toyota"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="model">Modèle</Label>
                  <Input
                    id="model"
                    value={newVehicle.model}
                    onChange={(e) => setNewVehicle({ ...newVehicle, model: e.target.value })}
                    placeholder="Corolla"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="year">Année</Label>
                  <Input
                    id="year"
                    type="number"
                    value={newVehicle.year}
                    onChange={(e) => setNewVehicle({ ...newVehicle, year: e.target.value })}
                    placeholder="2023"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Type</Label>
                  <Select
                    value={newVehicle.type}
                    onValueChange={(value) => setNewVehicle({ ...newVehicle, type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner le type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Berline">Berline</SelectItem>
                      <SelectItem value="SUV">SUV</SelectItem>
                      <SelectItem value="Économique">Économique</SelectItem>
                      <SelectItem value="Pick-up">Pick-up</SelectItem>
                      <SelectItem value="Citadine">Citadine</SelectItem>
                      <SelectItem value="Luxe">Luxe</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="plate">Plaque d'immatriculation</Label>
                  <Input
                    id="plate"
                    value={newVehicle.plate}
                    onChange={(e) => setNewVehicle({ ...newVehicle, plate: e.target.value })}
                    placeholder="LT-123-CM"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="color">Couleur</Label>
                  <Input
                    id="color"
                    value={newVehicle.color}
                    onChange={(e) => setNewVehicle({ ...newVehicle, color: e.target.value })}
                    placeholder="Blanc"
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="seats">Nombre de places</Label>
                  <Input
                    id="seats"
                    type="number"
                    value={newVehicle.seats}
                    onChange={(e) => setNewVehicle({ ...newVehicle, seats: e.target.value })}
                    placeholder="5"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="transmission">Transmission</Label>
                  <Select
                    value={newVehicle.transmission}
                    onValueChange={(value) => setNewVehicle({ ...newVehicle, transmission: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Manuelle">Manuelle</SelectItem>
                      <SelectItem value="Automatique">Automatique</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fuelType">Carburant</Label>
                  <Select
                    value={newVehicle.fuelType}
                    onValueChange={(value) => setNewVehicle({ ...newVehicle, fuelType: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Essence">Essence</SelectItem>
                      <SelectItem value="Diesel">Diesel</SelectItem>
                      <SelectItem value="Hybride">Hybride</SelectItem>
                      <SelectItem value="Électrique">Électrique</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="pricePerDay">Prix par jour (FCFA)</Label>
                  <Input
                    id="pricePerDay"
                    type="number"
                    value={newVehicle.pricePerDay}
                    onChange={(e) => setNewVehicle({ ...newVehicle, pricePerDay: e.target.value })}
                    placeholder="25000"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Localisation</Label>
                  <Select
                    value={newVehicle.location}
                    onValueChange={(value) => setNewVehicle({ ...newVehicle, location: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner la ville" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Douala">Douala</SelectItem>
                      <SelectItem value="Yaoundé">Yaoundé</SelectItem>
                      <SelectItem value="Bafoussam">Bafoussam</SelectItem>
                      <SelectItem value="Bamenda">Bamenda</SelectItem>
                      <SelectItem value="Garoua">Garoua</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newVehicle.description}
                  onChange={(e) => setNewVehicle({ ...newVehicle, description: e.target.value })}
                  placeholder="Description du véhicule..."
                />
              </div>
              <div className="space-y-2">
                <Label>Images du véhicule</Label>
                <ImageUpload images={vehicleImages} onImagesChange={setVehicleImages} maxImages={8} />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Annuler
              </Button>
              <Button onClick={handleAddVehicle}>Ajouter</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total véhicules</p>
                <p className="text-2xl font-bold">{vehicles.length}</p>
              </div>
              <Car className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Disponibles</p>
                <p className="text-2xl font-bold">{vehicles.filter((v) => v.status === "Disponible").length}</p>
              </div>
              <Car className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">En location</p>
                <p className="text-2xl font-bold">{vehicles.filter((v) => v.status === "Loué").length}</p>
              </div>
              <Car className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Maintenance</p>
                <p className="text-2xl font-bold">{vehicles.filter((v) => v.status === "Maintenance").length}</p>
              </div>
              <Settings className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtres et recherche */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Rechercher par nom, plaque ou marque..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filtrer par statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="Disponible">Disponible</SelectItem>
                <SelectItem value="Loué">Loué</SelectItem>
                <SelectItem value="Maintenance">Maintenance</SelectItem>
                <SelectItem value="Hors service">Hors service</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filtrer par type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les types</SelectItem>
                <SelectItem value="Berline">Berline</SelectItem>
                <SelectItem value="SUV">SUV</SelectItem>
                <SelectItem value="Économique">Économique</SelectItem>
                <SelectItem value="Pick-up">Pick-up</SelectItem>
                <SelectItem value="Citadine">Citadine</SelectItem>
                <SelectItem value="Luxe">Luxe</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Grille des véhicules */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVehicles.map((vehicle) => (
          <Card key={vehicle.id} className="overflow-hidden">
            <div className="aspect-video bg-gray-100 relative">
              <img
                src={vehicle.images[0] || "/placeholder.svg"}
                alt={vehicle.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 right-2">{getStatusBadge(vehicle.status)}</div>
            </div>
            <CardContent className="p-4">
              <div className="space-y-2">
                <div className="flex justify-between items-start">
                  <h3 className="font-semibold text-lg">{vehicle.name}</h3>
                  <div className="text-right">
                    <div className="font-bold text-blue-600">{vehicle.pricePerDay.toLocaleString()} FCFA</div>
                    <div className="text-xs text-gray-500">par jour</div>
                  </div>
                </div>
                <div className="text-sm text-gray-600">
                  {vehicle.year} • {vehicle.plate}
                </div>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-1" />
                    {vehicle.seats}
                  </div>
                  <div className="flex items-center">
                    <Fuel className="h-4 w-4 mr-1" />
                    {vehicle.fuelType}
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    {vehicle.location}
                  </div>
                </div>
                <div className="flex justify-between items-center pt-2">
                  <div className="text-sm">
                    <div className="font-medium">{vehicle.bookings} réservations</div>
                    <div className="text-gray-500">Note: {vehicle.rating}/5</div>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="ghost" size="sm" onClick={() => handleViewVehicle(vehicle)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Dialog de détails du véhicule */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>{selectedVehicle?.name}</DialogTitle>
            <DialogDescription>Informations détaillées du véhicule</DialogDescription>
          </DialogHeader>
          {selectedVehicle && (
            <div className="grid gap-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <img
                    src={selectedVehicle.images[0] || "/placeholder.svg"}
                    alt={selectedVehicle.name}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <Card>
                      <CardContent className="p-3">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-600">{selectedVehicle.bookings}</div>
                          <div className="text-sm text-gray-500">Réservations</div>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-3">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-600">{selectedVehicle.rating}</div>
                          <div className="text-sm text-gray-500">Note moyenne</div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
                <div className="space-y-4">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm">Informations générales</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="font-medium">Marque:</span> {selectedVehicle.brand}
                        </div>
                        <div>
                          <span className="font-medium">Modèle:</span> {selectedVehicle.model}
                        </div>
                        <div>
                          <span className="font-medium">Année:</span> {selectedVehicle.year}
                        </div>
                        <div>
                          <span className="font-medium">Type:</span> {selectedVehicle.type}
                        </div>
                        <div>
                          <span className="font-medium">Couleur:</span> {selectedVehicle.color}
                        </div>
                        <div>
                          <span className="font-medium">Places:</span> {selectedVehicle.seats}
                        </div>
                        <div>
                          <span className="font-medium">Transmission:</span> {selectedVehicle.transmission}
                        </div>
                        <div>
                          <span className="font-medium">Carburant:</span> {selectedVehicle.fuelType}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm">Statut et localisation</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Statut:</span>
                        {getStatusBadge(selectedVehicle.status)}
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Localisation:</span>
                        <span className="text-sm">{selectedVehicle.location}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Kilométrage:</span>
                        <span className="text-sm">{selectedVehicle.mileage.toLocaleString()} km</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Prix/jour:</span>
                        <span className="text-sm font-medium">{selectedVehicle.pricePerDay.toLocaleString()} FCFA</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Assurance</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="text-sm">
                      <div>
                        <span className="font-medium">Compagnie:</span> {selectedVehicle.insurance.company}
                      </div>
                      <div>
                        <span className="font-medium">Police:</span> {selectedVehicle.insurance.policyNumber}
                      </div>
                      <div>
                        <span className="font-medium">Expiration:</span> {selectedVehicle.insurance.expiryDate}
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Maintenance</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="text-sm">
                      <div>
                        <span className="font-medium">Dernier service:</span> {selectedVehicle.maintenance.lastService}
                      </div>
                      <div>
                        <span className="font-medium">Prochain service:</span> {selectedVehicle.maintenance.nextService}
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Statut:</span>
                        {getMaintenanceStatusBadge(selectedVehicle.maintenance.status)}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Équipements</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {selectedVehicle.features.map((feature: string, index: number) => (
                      <Badge key={index} variant="outline">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
              {selectedVehicle.description && (
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Description</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600">{selectedVehicle.description}</p>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
              Fermer
            </Button>
            <Button>Modifier le véhicule</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
