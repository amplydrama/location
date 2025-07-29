"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Car, Filter, Star, Users, Fuel, Settings, MapPin, Menu, Loader2 } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { getCar } from "../api/admin/cars/car" // Adjust the import path based on your project structure
import { CarData } from "@/types/carData" // Adjust the import path based on your project structure
import Cookies from "js-cookie"


// Extend CarData for display purposes to simplify property access in JSX
interface DisplayVehicle extends CarData {
  name: string; // Maps to model
  price: number; // Maps to price_per_day
  available: boolean; // Derived from status
}

export default function VehiclesPage() {
  const [allVehicles, setAllVehicles] = useState<DisplayVehicle[]>([]) // Stores all fetched & processed vehicles
  const [filteredVehicles, setFilteredVehicles] = useState<DisplayVehicle[]>([]) // Stores vehicles after filtering
  const [displayedVehicles, setDisplayedVehicles] = useState<DisplayVehicle[]>([]) // Stores vehicles for the current page
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  

  const [filters, setFilters] = useState({
    type: "all", brand: "all", priceRange: "all", location: "all", transmission: "all", fuel: "all",
  })

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1)
  const vehiclesPerPage = 6 // You can adjust this number
  const totalPages = Math.ceil(filteredVehicles.length / vehiclesPerPage)

  // 1. Fetch Vehicles on component mount
  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        setIsLoading(true)
        setError(null)
        // Using a mock getCar function for demonstration if the actual one isn't available
        // In your real application, ensure `getCar` fetches from your Django backend.
        const response: CarData[] = await getCar(); // Call your API function

        console.log("Full API response from getCar:", response);

        if (Array.isArray(response)) {
          const processedVehicles: DisplayVehicle[] = response.map((car: CarData) => ({
            ...car,
            id: car.id || car.model.toLowerCase().replace(/\s+/g, '-'), // Ensure a unique ID, fallback to slug-like model
            name: car.model, // Map `model` from API to `name` for display
            price: Math.min(
              ...[
                car.price_WDT,
                car.price_WDO,
                car.price_WODT,
                car.price_WODO
              ].filter(p => typeof p === "number" && !isNaN(p))
            ),
            available: car.status === "available", // Derive `available` from API `status`
            rating: car.rating || 0, // Default rating if not provided
            features: Array.isArray(car.features) ? car.features : [], // Ensure features is an array
            image: car.image || "/placeholder.svg", // Default image if none from API
          }));
          setAllVehicles(processedVehicles) // Store all fetched vehicles
          setFilteredVehicles(processedVehicles) // Initially, all vehicles are filtered
          setCurrentPage(1) // Reset to first page
        } else {
          console.error("API did not return an array of vehicles:", response)
          setError("Unexpected data format from the API.")
        }
      } catch (err: any) {
        console.error("Error fetching vehicles:", err)
        setError("Failed to load vehicles. " + (err.message || "Please try again later."))
      } finally {
        setIsLoading(false)
      }
    }
    fetchVehicles()
  }, []) // Empty dependency array means this runs only once on mount

  // 2. Apply filters whenever 'allVehicles' or 'filters' change
  useEffect(() => {
    const newFiltered = allVehicles.filter((vehicle) => {
      // Convert API values to lowercase for case-insensitive comparison if necessary
      const vehicleType = vehicle.type?.toLowerCase() || '';
      const vehicleBrand = vehicle.brand?.toLowerCase() || '';
      const vehicleLocation = vehicle.location?.toLowerCase() || '';
      const vehicleTransmission = vehicle.transmission?.toLowerCase() || '';
      const vehicleFuel = vehicle.fuel_type?.toLowerCase() || '';

      const filterType = filters.type.toLowerCase();
      const filterBrand = filters.brand.toLowerCase();
      const filterLocation = filters.location.toLowerCase();
      const filterTransmission = filters.transmission.toLowerCase();
      const filterFuel = filters.fuel.toLowerCase();

      return (
        (filterType === "all" || vehicleType === filterType) &&
        (filterBrand === "all" || vehicleBrand === filterBrand) &&
        (filterLocation === "all" || vehicleLocation === filterLocation) &&
        (filterTransmission === "all" || vehicleTransmission === filterTransmission) &&
        (filterFuel === "all" || vehicleFuel === filterFuel) &&
        (filters.priceRange === "all" ||
          (filters.priceRange === "low" && vehicle.price <= 25000) ||
          (filters.priceRange === "medium" && vehicle.price > 25000 && vehicle.price <= 40000) ||
          (filters.priceRange === "high" && vehicle.price > 40000))
      );
    });
    setFilteredVehicles(newFiltered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [filters, allVehicles]); // Depend on filters and allVehicles

  // 3. Update displayed vehicles based on current page and filtered vehicles
  useEffect(() => {
    const startIndex = (currentPage - 1) * vehiclesPerPage
    const endIndex = startIndex + vehiclesPerPage
    setDisplayedVehicles(filteredVehicles.slice(startIndex, endIndex))
  }, [currentPage, filteredVehicles, vehiclesPerPage]) // Depend on these states

  const resetFilters = () => {
    setFilters({
      type: "all",
      brand: "all",
      priceRange: "all",
      location: "all",
      transmission: "all",
      fuel: "all",
    })
    // The useEffect hooks will automatically handle updating filteredVehicles and currentPage
  }

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page)
    }
  }
  // Render loading and error states
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
        <p className="text-xl text-gray-700">Chargement des véhicules...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <p className="text-xl text-red-600">{error}</p>
      </div>
    )
  }
    const cook = Cookies.get("UserSession")
    
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b fixed top-0 left-0 w-full z-50">
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
              <Link href="/vehicles" className="text-blue-600 font-medium">
                Véhicules
              </Link>
              <Link href="/reservations" className="text-gray-700 hover:text-blue-600">
                Mes réservations
              </Link>
              <Link href="/about" className="text-gray-700 hover:text-blue-600">
                À propos
              </Link>
              <Link href="/contact" className="text-gray-700 hover:text-blue-600">
                Contact
              </Link>
            </nav>
            <div className="me:hidden xs:flex items-center space-x-4">
              <Link href="/register">
                      <Button variant="outline">s'inscrire</Button>
                    </Link>
              {cook ?
                      <Link href="/profile">
                        <Button>Mon compte</Button>
                      </Link> 
                    :<Link href="/login">
                      <Button>Connexion</Button>
                    </Link>
              }
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
                      <Link href="/vehicles" className="block text-blue-600 font-medium py-2" onClick={() => setIsMobileMenuOpen(false)}>
                          Véhicules
                      </Link>
                      <Link href="/reservations" className="block text-gray-700 hover:text-blue-600 py-2" onClick={() => setIsMobileMenuOpen(false)}>
                          Mes réservations
                      </Link>
                      <Link href="/about" className="block text-gray-700 hover:text-blue-600 py-2" onClick={() => setIsMobileMenuOpen(false)}>
                          À propos
                      </Link>
                      <Link href="/contact" className="block text-gray-700 hover:text-blue-600 py-2" onClick={() => setIsMobileMenuOpen(false)}>
                          Contact
                      </Link>
                      <div className="pt-4 space-y-2 border-t border-gray-100">
                          <Link href="/register" onClick={() => setIsMobileMenuOpen(false)}>
                            <Button className="w-full mt-2" variant="outline">S'inscrire</Button>
                          </Link>
                          { cook ?
                                <Link href="/profile">
                                    <Button className="w-full mt-2" onClick={() => setIsMobileMenuOpen(false)}>Mon compte</Button>
                                </Link>
                                :<Link href="/login">
                                    <Button className="w-full mt-2" onClick={() => setIsMobileMenuOpen(false)}>Connexion</Button>
                                </Link>
                          }
                      </div>
                  </div>
              )}
          </div>
        </div>
      </header>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-[60px]">
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
                  <label htmlFor="type-select" className="text-sm font-medium text-gray-700 mb-2 block">Type de véhicule</label>
                  <Select value={filters.type} onValueChange={(value) => setFilters({ ...filters, type: value })}>
                    <SelectTrigger id="type-select">
                      <SelectValue placeholder="Tous les types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous les types</SelectItem>
                      {/* Dynamically populate types from fetched data */}
                      {[...new Set(allVehicles.map(v => v.type))].map(type => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label htmlFor="brand-select" className="text-sm font-medium text-gray-700 mb-2 block">Marque</label>
                  <Select value={filters.brand} onValueChange={(value) => setFilters({ ...filters, brand: value })}>
                    <SelectTrigger id="brand-select">
                      <SelectValue placeholder="Toutes les marques" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Toutes les marques</SelectItem>
                      {/* Dynamically populate brands from fetched data */}
                      {[...new Set(allVehicles.map(v => v.brand))].map(brand => (
                        <SelectItem key={brand} value={brand}>{brand}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label htmlFor="location-select" className="text-sm font-medium text-gray-700 mb-2 block">Ville</label>
                  <Select
                    value={filters.location}
                    onValueChange={(value) => setFilters({ ...filters, location: value })}
                  >
                    <SelectTrigger id="location-select">
                      <SelectValue placeholder="Toutes les villes" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Toutes les villes</SelectItem>
                      {/* Dynamically populate locations from fetched data */}
                      {[...new Set(allVehicles.map(v => v.location))].map(location => (
                        <SelectItem key={location} value={location}>{location}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label htmlFor="price-select" className="text-sm font-medium text-gray-700 mb-2 block">Gamme de prix</label>
                  <Select
                    value={filters.priceRange}
                    onValueChange={(value) => setFilters({ ...filters, priceRange: value })}
                  >
                    <SelectTrigger id="price-select">
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
                  <label htmlFor="transmission-select" className="text-sm font-medium text-gray-700 mb-2 block">Transmission</label>
                  <Select
                    value={filters.transmission}
                    onValueChange={(value) => setFilters({ ...filters, transmission: value })}
                  >
                    <SelectTrigger id="transmission-select">
                      <SelectValue placeholder="Toutes" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Toutes</SelectItem>
                      {/* Dynamically populate transmissions from fetched data */}
                      {[...new Set(allVehicles.map(v => v.transmission))].map(transmission => (
                        <SelectItem key={transmission} value={transmission}>{transmission}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label htmlFor="fuel-select" className="text-sm font-medium text-gray-700 mb-2 block">Carburant</label>
                  <Select value={filters.fuel} onValueChange={(value) => setFilters({ ...filters, fuel: value })}>
                    <SelectTrigger id="fuel-select">
                      <SelectValue placeholder="Tous" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous</SelectItem>
                      {/* Dynamically populate fuels from fetched data */}
                      {[...new Set(allVehicles.map(v => v.fuel_type))].map(fuel => (
                        <SelectItem key={fuel} value={fuel}>{fuel}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </Card>
          </div>
          {/* Vehicles Grid */}
          <div className="lg:col-span-3">
            <div className="mb-4 flex justify-between items-center">
              <p className="text-gray-600">
                {filteredVehicles.length} véhicule(s) trouvé(s){" "}
                {totalPages > 0 && `(Page ${currentPage} sur ${totalPages})`}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {displayedVehicles.length > 0 ? (
                displayedVehicles.map((vehicle) => (
                  <Card key={vehicle.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="relative">
                      <Image
                        src={vehicle.image}
                        alt={vehicle.name}
                        width={300}
                        height={200}
                        className="w-full h-48 object-cover"
                        priority // Use priority for images likely to be in the initial viewport
                      />
                      {!vehicle.available && (
                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                          <Badge variant="secondary" className="text-white bg-red-600">
                            {/* revoir cette logique */}
                            Disponible
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
                          <span className="text-sm text-gray-600 ml-1">{vehicle.rating?.toFixed(1)}</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-x-2 gap-y-1 mb-3 text-xs text-gray-600">
                          {/* Affichage de toutes les fonctionnalités du véhicule */}
                          {vehicle.features && vehicle.features.map((feature, index) => (
                              <div key={index} className="flex items-center min-w-0"> {/* Removed flex-shrink-0, added min-w-0 */}
                                  <Users className="h-3 w-3 mr-1" />
                                  <span className="break-words">{feature}</span> {/* Ensure text breaks words if necessary */}
                              </div>
                          ))}
                          {/* Affichage du type de carburant */}  
                          <div className="flex items-center min-w-0"> {/* Removed flex-shrink-0, added min-w-0 */}
                              <Fuel className="h-3 w-3 mr-1" />
                              <span className="break-words">{vehicle.fuel_type}</span>
                          </div>
                          {/* Affichage de la transmission */}
                          <div className="flex items-center min-w-0"> {/* Removed flex-shrink-0, added min-w-0 */}
                              <Settings className="h-3 w-3 mr-1" />
                              <span className="break-words">{vehicle.transmission}</span>
                          </div>
                      </div>


                      <div className="flex justify-between items-center">
                        <div>
                          <span className="text-xl font-bold text-blue-600">{vehicle.price.toLocaleString()}</span>
                          <span className="text-gray-600 text-sm"> FCFA/jour</span>
                        </div>
                        <Link href={`/booking/${vehicle.slug}`}>
                          <Button  size="sm">Reserver
                            {/*disabled={!vehicle.available} {vehicle.available ? "Réserver" : "Indisponible"} */}
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center py-12 lg:col-span-3">
                  <Car className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun véhicule trouvé</h3>
                  <p className="text-gray-600">Essayez de modifier vos critères de recherche</p>
                  <Button onClick={resetFilters} className="mt-4">
                    Réinitialiser les filtres
                  </Button>
                </div>
              )}
            </div>
            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center space-x-2 mt-8">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Précédent
                </Button>
                {Array.from({ length: totalPages }, (_, i) => (
                  <Button
                    key={i + 1}
                    variant={currentPage === i + 1 ? "default" : "outline"}
                    size="sm"
                    onClick={() => handlePageChange(i + 1)}
                  >
                    {i + 1}
                  </Button>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Suivant
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}