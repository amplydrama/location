"use client"

// --- React & Next.js Imports ---
import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"

// --- Shadcn UI Components Imports ---
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

// --- Lucide Icons Imports ---
import { Calendar, Car, MapPin, Phone, Star, Users, Menu, Loader2 } from "lucide-react"

// --- API Function Import ---
// This is your actual API call. Ensure the path is correct.
import { getCar } from "@/app/api/admin/cars/car"

// --- Type Definitions Imports ---
// Importing CarData and DisplayVehicle directly from your type file
import { CarData, DisplayVehicle } from "@/types/carData"


// --- Main HomePage Component ---
export default function HomePage() {
  const [searchLocation, setSearchLocation] = useState("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Pagination States
  const [allCars, setAllCars] = useState<DisplayVehicle[]>([]); // Stores all fetched and processed cars
  const [displayedCars, setDisplayedCars] = useState<DisplayVehicle[]>([]); // Cars for the current page
  const [currentPage, setCurrentPage] = useState(1);
  const carsPerPage = 6; // Number of cars to display per page
  const totalPages = Math.ceil(allCars.length / carsPerPage);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Effect to fetch all cars on component mount
  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Call your actual API function to get car data
        // We're assuming getCar() returns an array conforming to your CarData type
        const response: CarData[] = await getCar(); 

        console.log("Full API response from getCar:", response);

        if (Array.isArray(response)) {
          // Process the received data to match DisplayVehicle structure
          const processedVehicles: DisplayVehicle[] = response.map((car: CarData) => {
            return {
              ...car, // Spread all fields from the original CarData
              id: car.slug, // Use slug as the unique id for React keys
              name: car.model, // Map 'model' to 'name' for display
              price: Math.min(
                ...[
                  car.price_WDT,
                  car.price_WDO,
                  car.price_WODT,
                  car.price_WODO
                ].filter(p => typeof p === "number" && !isNaN(p))
              ),  
            };
          });
          setAllCars(processedVehicles); // Store all processed cars
          setCurrentPage(1); // Reset to the first page when new data is fetched
        } else {
          console.error("API did not return an array of vehicles:", response);
          setError("Unexpected data format from the API.");
        }
      } catch (err: any) {
        console.error("Error fetching vehicles:", err);
        setError("Failed to load vehicles. " + (err.message || "Please try again later."));
      } finally {
        setIsLoading(false);
      }
    };

    fetchVehicles();
  }, []); // Empty dependency array: runs once on mount

  // Effect to update displayed cars based on current page and `allCars`
  useEffect(() => {
    const startIndex = (currentPage - 1) * carsPerPage;
    const endIndex = startIndex + carsPerPage;
    setDisplayedCars(allCars.slice(startIndex, endIndex));
  }, [currentPage, allCars, carsPerPage]); // Rerun when page, allCars, or carsPerPage changes

  // Handler for page change
  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // --- Loading and Error States UI ---
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
        <p className="text-xl text-gray-700">Chargement des véhicules...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <p className="text-xl text-red-600">{error}</p>
      </div>
    );
  }

  // --- Main Component Render ---
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-50 to-white">
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
              <Link href="/vehicles" className="text-gray-700 hover:text-blue-600">
                Véhicules
              </Link>
              <Link href="/reservations" className="font-medium">
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
              <Link href="/login">
                <Button variant="outline">Connexion</Button>
              </Link>
              <Link href="/register">
                <Button>Inscription</Button>
              </Link>
            </div>

            {/* Mobile Menu Button (Hamburger): FLEX by default, HIDDEN from 'xs' (425px) upwards */}
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
                <div className="flex flex-col xs:hidden absolute top-16 left-0 w-full bg-white shadow-lg px-4 pt-2 pb-4 space-y-2 border-t border-gray-200">
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
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 mt-[50px]">
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

      {/* Featured Cars Section (with Pagination) */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50 flex-grow">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Véhicules populaires</h2>
            <p className="text-lg text-gray-600">Découvrez notre sélection de véhicules les plus demandés</p>
            <p className="text-gray-600 mt-2">
              {allCars.length} véhicule(s) disponible(s){" "}
              {totalPages > 0 && `(Page ${currentPage} sur ${totalPages})`}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayedCars.length > 0 ? (
              displayedCars.map((car) => (
                <Card key={car.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative">
                    <Image
                      src={car.image || "/placeholder.svg"}
                      alt={car.name || "Car image"}
                      width={300}
                      height={200}
                      className="w-full h-48 object-cover"
                      priority={false}
                    />
                    {!car.available && (
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <Badge variant="secondary" className="text-white bg-red-600">
                          {/* revoir cette logique */}
                          Disponible
                        </Badge>
                      </div>
                    )}
                    <div className="absolute top-2 left-2">
                      <Badge variant="secondary">{car.type}</Badge>
                    </div>
                    <div className="absolute top-2 right-2 flex items-center space-x-1 bg-white rounded-full px-2 py-1">
                      <MapPin className="h-3 w-3 text-gray-500" />
                      <span className="text-xs text-gray-600">{car.location}</span>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-semibold text-gray-900">{car.name}</h3>
                    </div>
                    <div className="flex items-center mb-3">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm text-gray-600 ml-1">{car.rating?.toFixed(1) || 'N/A'}</span>
                    </div>
                    <div className="space-y-2 mb-4">
                      {Array.isArray(car.features) && car.features.length > 0 ? (
                          car.features.map((feature, index) => (
                            <div key={index} className="flex items-center text-sm text-gray-600">
                              <div className="w-2 h-2 bg-blue-600 rounded-full mr-2"></div>
                              {feature}
                            </div>
                          ))
                      ) : (
                          <p className="text-sm text-gray-500">Aucune caractéristique</p>
                      )}
                    </div>
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="text-2xl font-bold text-blue-600">{car.price.toLocaleString()}</span>
                        <span className="text-gray-600"> FCFA/jour</span>
                      </div>
                      <Link href={`/booking/${car.id}`}>
                        <Button >Reserver</Button>
                        {/* revoir cette logique imperativement */}
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-12 col-span-full">
                <Car className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun véhicule trouvé</h3>
                <p className="text-gray-600">Veuillez réessayer plus tard.</p>
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
  );
}