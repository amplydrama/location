"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Car, CalendarIcon, MapPin, Star, Users, Fuel, Settings, Phone, CreditCard, FileText,Menu } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { createBooking } from "@/app/api/bookings/book"
import { BookingCreatePayload } from "@/types/Booking" // Adjust the import path based on your project structure
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"
// --- IMPORT THE API FUNCTION ---
import { getCarBySlug } from "@/app/api/admin/cars/car" // Adjust path as per your project structure
import { CarData } from "@/types/carData" // Assuming you have a CarData interface defined
import Cookies from "js-cookie"
import React from "react"
import { params_app } from "@/types/Booking"
export default function BookingPage({ params }: { params: Promise<{ slug: string }> }) {
  // const { slug } = React.use(params)
 
  const resolvedParams = React.use(params);
  const slug = resolvedParams.slug

  const router = useRouter()
  // Use CarData interface for better type safety
  const [vehicle, setVehicle] = useState<CarData | null>(null)
  const [startDate, setStartDate] = useState<Date>()
  const [endDate, setEndDate] = useState<Date>()
  const [totalDays, setTotalDays] = useState(0)
  const [totalPrice, setTotalPrice] = useState(0)
  const [paymentMethod, setPaymentMethod] = useState("")
  const [selectedCity, setSelectedCity] = useState(""); // ville choisie par l'utilisateur
  const [chauffeur, setChauffeur] = useState<"1" | "0">("1"); // "1" = avec chauffeur, "0" = sans chauffeur
  const [customerInfo, setCustomerInfo] = useState({
    
    name: "",
    email: "",
    phone: "",
    address: "",
    idNumber: "",
  })
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  useEffect(() => {
    const fetchVehicle = async () => {
      // --- ADD THIS CHECK HERE ---
      
      if (!slug) {
        setLoading(false);
        setError("L'identifiant du véhicule est manquant dans l'URL.");
        return;
      }
      // --- END OF CHECK ---

      setLoading(true);
      setError(null);
      try {
        const carData = await getCarBySlug(slug);
        if (carData) {
          setVehicle(carData);
        } else {
          setError("Véhicule introuvable.");
        }
      } catch (err: any) {
        console.error("Failed to fetch vehicle:", err);
        setError(err.error || "Erreur lors du chargement du véhicule.");
      } finally {
        setLoading(false);
      }
    };

    fetchVehicle();
  },[slug]); // Depend on params.id to refetch if the slug changes


  useEffect(() => {
  if (startDate && endDate && vehicle && selectedCity) {
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    setTotalDays(diffDays);

    // Comparaison ville véhicule vs ville choisie
    const isSameCity = selectedCity.trim().toLowerCase() === vehicle.location.trim().toLowerCase();

    let price = 0;
    if (chauffeur === "1" && isSameCity) price = vehicle.price_WDT;
    else if (chauffeur === "1" && !isSameCity) price = vehicle.price_WDO;
    else if (chauffeur === "0" && isSameCity) price = vehicle.price_WODT;
    else if (chauffeur === "0" && !isSameCity) price = vehicle.price_WODO;

    setTotalPrice(diffDays * price);
  }
}, [startDate, endDate, vehicle, chauffeur, selectedCity]);
  const handleBooking = async (e: React.FormEvent) => {
  e.preventDefault();

  // --- Client-side validation with toasts ---
  if (
    !startDate ||
    !endDate ||
    !customerInfo.name ||
    !customerInfo.email ||
    !customerInfo.phone ||
    !customerInfo.idNumber ||
    !vehicle
  ) {
    toast.error("Veuillez remplir tous les champs obligatoires (Dates et Informations personnelles).");
    return;
  }

  const phoneRegex = /^(6(?:7|8|5|9)\d{7}|2(?:2|3|4)\d{7})$/;
  if (!phoneRegex.test(customerInfo.phone)) {
    toast.error("Veuillez entrer un numéro de téléphone camerounais valide (ex: 67xxxxxxx, 68xxxxxxx, 65xxxxxxx, 69xxxxxxx, 22xxxxxxx, 23xxxxxxx, 24xxxxxxx).");
    return;
  }

  if (!vehicle?.slug) {
    toast.error("Véhicule introuvable. Veuillez sélectionner un véhicule.");
    return;
  }

  // --- Prepare Booking Data for Backend ---
  const bookingPayload: BookingCreatePayload = {
    car: vehicle.id,
    start_date: format(startDate!, "yyyy-MM-dd"),
    end_date: format(endDate!, "yyyy-MM-dd"),
    estimated_total_price: Math.round(totalPrice * 1.05), // Include 5% fee
    name: customerInfo.name,
    email: customerInfo.email,
    phone: customerInfo.phone,
    address: customerInfo.address,
    id_card: customerInfo.idNumber,
    with_driver: chauffeur === "1" ? true : false,
    carname: vehicle.slug
  };

  console.log("Données de réservation envoyées:", bookingPayload);

  try {
    const response = await createBooking(bookingPayload);
    const bookingId = response.id;

    console.log("Réservation enregistrée avec succès. ID de réservation:", bookingId);
    toast.success("Votre réservation a été enregistrée avec succès. Vous allez être redirigé pour le paiement.");

    
    // router.push("/reservations/payment/" + bookingId);
  } catch (err: any) {
    console.error("Échec de la création de la réservation:", err);
    console.log("données de réservation:", bookingPayload);
    // Access 'err.error' here, as per the structure you throw from createBooking
    const errorMessage = err.error || "Une erreur inconnue est survenue lors de l'enregistrement de votre réservation. Veuillez réessayer.";
    toast.error(`Erreur: ${errorMessage}`);
  }
};

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Chargement du véhicule...</div>
  }

  if (error) {
    return <div className="min-h-screen flex items-center justify-center text-red-600">{error}</div>
  }

  // If loading is false and there's no vehicle (due to an error or not found), display a message
  if (!vehicle) {
    return <div className="min-h-screen flex items-center justify-center">Véhicule non trouvé.</div>;
  }

  const uniqueCities = Array.from(new Set([
    "Douala", "Yaoundé", "Bafoussam", "Bamenda", "Garoua", "Maroua", "Ngaoundéré", "Bertoua", "Ebolowa", "Limbé", "Kribi", "Dschang", "Edéa", "Nkongsamba", "Kumba", "Bafia", "Foumban", "Mbouda", "Tiko", "Mbalmayo", "Meiganga", "Yagoua", "Mokolo", "Wum", "Buea", "Sangmélima", "Guider", "Kaélé", "Tibati", "Kousséri", "Abong-Mbang", "Mora", "Eséka", "Obala", "Batouri", "Banyo", "Manjo", "Akonolinga", "Bafang", "Bali", "Bélabo", "Bertoua", "Bogo", "Buea", "Dimako", "Fundong", "Garoua-Boulaï", "Kaélé", "Kousseri", "Kumba", "Loum", "Mamfe", "Mbanga", "Mbandjock", "Mbalmayo", "Meiganga", "Melong", "Mokolo", "Mora", "Muyuka", "Nanga-Eboko", "Ndop", "Ngaoundal", "Obala", "Penja", "Sangmélima", "Tibati", "Tiko", "Wum", "Yagoua"
  ])).sort(); // Optionally sort them alphabetically

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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Link href="/vehicles" className="text-blue-600 hover:text-blue-800">
            ← Retour aux véhicules
          </Link>
        </div>
        <form onSubmit={handleBooking}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Vehicle Details */}
            
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Image
                        // Ensure vehicle.image is correctly accessed (it's the URL from Django)
                        src={vehicle.image || "/placeholder.svg"}
                        alt={vehicle.model}
                        width={400}
                        height={300}
                        className="w-full h-64 object-cover rounded-lg"
                      />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h1 className="text-2xl font-bold text-gray-900">{vehicle.model}</h1>
                        <Badge variant="outline">{vehicle.type}</Badge>
                      </div>

                      <div className="flex items-center mb-4">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="text-sm text-gray-600 ml-1">{vehicle.rating}</span>
                        <MapPin className="h-4 w-4 text-gray-400 ml-4" />
                        <span className="text-sm text-gray-600 ml-1">{vehicle.location}</span>
                      </div>

                      <p className="text-gray-600 mb-4">{vehicle.description}</p>

                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="flex items-center">
                          <Users className="h-4 w-4 text-gray-400 mr-2" />
                          {/* Assuming features is an array, adjust if your API returns different structure */}
                          <span className="text-sm">{vehicle.features?.[0] || 'N/A'}</span>
                        </div>
                        <div className="flex items-center">
                          <Fuel className="h-4 w-4 text-gray-400 mr-2" />
                          <span className="text-sm">{vehicle.fuel_type}</span>
                        </div>
                        <div className="flex items-center">
                          <Settings className="h-4 w-4 text-gray-400 mr-2" />
                          <span className="text-sm">{vehicle.transmission}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-4">
                        <div className="text-sm">
                          <span className="font-semibold">Avec chauffeur (Ville): </span>
                          {vehicle.price_WDT?.toLocaleString()} FCFA/jour
                        </div>
                        <div className="text-sm">
                          <span className="font-semibold">Avec chauffeur (Hors Ville): </span>
                          {vehicle.price_WDO?.toLocaleString()} FCFA/jour
                        </div>
                        <div className="text-sm">
                          <span className="font-semibold">Sans chauffeur (Ville): </span>
                          {vehicle.price_WODT?.toLocaleString()} FCFA/jour
                        </div>
                        <div className="text-sm">
                          <span className="font-semibold">Sans chauffeur (Hors Ville): </span>
                          {vehicle.price_WODO?.toLocaleString()} FCFA/jour
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Booking Form */}
              
              <Card>
                <CardHeader>
                  <CardTitle>Informations de réservation</CardTitle>
                  <CardDescription>Remplissez vos informations pour finaliser la réservation</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">

                  <RadioGroup
                    value={chauffeur}
                    onValueChange={value => setChauffeur(value as "1" | "0")}
                    className="flex gap-4"
                  >
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="1" id="avec" />
                      <Label htmlFor="avec">Avec chauffeur</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="0" id="sans" />
                      <Label htmlFor="sans">Sans chauffeur</Label>
                    </div>
                  </RadioGroup>

                  <div className="space-y-2">
                    <Label htmlFor="city">Ville de location</Label>
                    <select
                      id="city"
                      className="w-full border rounded px-3 py-2"
                      value={selectedCity}
                      onChange={e => setSelectedCity(e.target.value)}
                      required
                    >
                      <option value="">Sélectionner une ville</option>
                      {uniqueCities.map(city => (
                        <option key={city} value={city}>{city}</option>
                      ))}
                    </select>
                  </div>
                  {/* Date Selection */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Date de début</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-full justify-start text-left font-normal">
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {startDate ? format(startDate, "PPP", { locale: fr }) : "Sélectionner une date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={startDate}
                            onSelect={setStartDate}
                            disabled={(date) => date < new Date()}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div className="space-y-2">
                      <Label>Date de fin</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-full justify-start text-left font-normal">
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {endDate ? format(endDate, "PPP", { locale: fr }) : "Sélectionner une date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={endDate}
                            onSelect={setEndDate}
                            disabled={(date) => date < (startDate || new Date())}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>

                  {/* Customer Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Informations personnelles</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Nom complet *</Label>
                        <Input
                          id="name"
                          value={customerInfo.name}
                          onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="adresse">Adresse *</Label>
                        <Input
                          id="lastName"
                          value={customerInfo.address}
                          onChange={(e) => setCustomerInfo({ ...customerInfo, address: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={customerInfo.email}
                          onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Téléphone *</Label>
                        <Input
                          id="phone"
                          value={customerInfo.phone}
                          onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                          placeholder="+237 6XX XXX XXX"
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="idNumber">Numéro CNI *</Label>
                        <Input
                          id="idNumber"
                          value={customerInfo.idNumber}
                          onChange={(e) => setCustomerInfo({ ...customerInfo, idNumber: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                  </div>


                  {/* Payment Method */}
                  {/* <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Mode de paiement</h3>
                    <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                      <div className="flex items-center space-x-2 p-4 border rounded-lg">
                        <RadioGroupItem value="mtn-momo" id="mtn-momo" />
                        <Label htmlFor="mtn-momo" className="flex items-center space-x-2 cursor-pointer">
                          <div className="w-8 h-8 bg-yellow-400 rounded flex items-center justify-center">
                            <Phone className="h-4 w-4 text-white" />
                          </div>
                          <span>MTN Mobile Money</span>
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 p-4 border rounded-lg">
                        <RadioGroupItem value="orange-money" id="orange-money" />
                        <Label htmlFor="orange-money" className="flex items-center space-x-2 cursor-pointer">
                          <div className="w-8 h-8 bg-orange-500 rounded flex items-center justify-center">
                            <Phone className="h-4 w-4 text-white" />
                          </div>
                          <span>Orange Money</span>
                        </Label>
                      </div>
                    </RadioGroup>
                  </div> */}
                </CardContent>
              </Card>
            </div>

            {/* Booking Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-4">
                <CardHeader>
                  <CardTitle>Récapitulatif de réservation</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Véhicule:</span>
                      <span className="font-medium">{vehicle.model}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Lieu:</span>
                      <span>{vehicle.location}</span>
                    </div>
                    {startDate && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Date de début:</span>
                        <span>{format(startDate, "dd/MM/yyyy", { locale: fr })}</span>
                      </div>
                    )}
                    {endDate && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Date de fin:</span>
                        <span>{format(endDate, "dd/MM/yyyy", { locale: fr })}</span>
                      </div>
                    )}
                    {totalDays > 0 && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Durée:</span>
                        <span>{totalDays} jour(s)</span>
                      </div>
                    )}
                  </div>

                  <Separator />

                  <div className="flex justify-between">
                    <span className="text-gray-600">Prix par jour:</span>
                    <span>
                      {(() => {
                        if (!vehicle) return "N/A";
                        const isSameCity = selectedCity.trim().toLowerCase() === vehicle.location.trim().toLowerCase();
                        let price = 0;
                        if (chauffeur === "1" && isSameCity) price = vehicle.price_WDT;
                        else if (chauffeur === "1" && !isSameCity) price = vehicle.price_WDO;
                        else if (chauffeur === "0" && isSameCity) price = vehicle.price_WODT;
                        else if (chauffeur === "0" && !isSameCity) price = vehicle.price_WODO;
                        return price ? price.toLocaleString() + " FCFA" : "N/A";
                      })()}
                    </span>
                  </div>

                  <Separator />

                  <div className="flex justify-between text-lg font-bold">
                    <span>Total:</span>
                    <span className="text-blue-600">
                      {totalDays > 0 ? Math.round(totalPrice * 1.05).toLocaleString() : "0"} FCFA
                    </span>
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    size="lg"
                    disabled={!startDate || !endDate || !customerInfo.name}
                  >
                    <CreditCard className="mr-2 h-4 w-4" />
                    Enregistrer la réservation
                  </Button>
                
                  <div className="text-xs text-gray-500 text-center">
                    <FileText className="h-4 w-4 inline mr-1" />
                    Une facture PDF sera générée après le paiement
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}