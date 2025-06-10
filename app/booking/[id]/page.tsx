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
import { Car, CalendarIcon, MapPin, Star, Users, Fuel, Settings, Phone, CreditCard, FileText } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { format } from "date-fns"
import { fr } from "date-fns/locale"

// Mock vehicle data - in real app, this would come from API
const getVehicleById = (id: string) => {
  const vehicles = [
    {
      id: 1,
      name: "Toyota Corolla",
      type: "Berline",
      brand: "Toyota",
      price: 25000,
      image: "/placeholder.svg?height=300&width=400",
      features: ["5 places", "Climatisation", "Boîte automatique", "Bluetooth", "GPS", "Caméra de recul"],
      rating: 4.8,
      available: true,
      fuel: "Essence",
      transmission: "Automatique",
      location: "Douala",
      description: "Véhicule confortable et fiable, parfait pour vos déplacements en ville et sur route.",
    },
  ]
  return vehicles.find((v) => v.id === Number.parseInt(id))
}

export default function BookingPage({ params }: { params: { id: string } }) {
  const [vehicle, setVehicle] = useState<any>(null)
  const [startDate, setStartDate] = useState<Date>()
  const [endDate, setEndDate] = useState<Date>()
  const [totalDays, setTotalDays] = useState(0)
  const [totalPrice, setTotalPrice] = useState(0)
  const [paymentMethod, setPaymentMethod] = useState("")
  const [customerInfo, setCustomerInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    idNumber: "",
  })

  useEffect(() => {
    const vehicleData = getVehicleById(params.id)
    setVehicle(vehicleData)
  }, [params.id])

  useEffect(() => {
    if (startDate && endDate && vehicle) {
      const diffTime = Math.abs(endDate.getTime() - startDate.getTime())
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      setTotalDays(diffDays)
      setTotalPrice(diffDays * vehicle.price)
    }
  }, [startDate, endDate, vehicle])

  const handleBooking = async () => {
    if (!startDate || !endDate || !paymentMethod || !customerInfo.firstName) {
      alert("Veuillez remplir tous les champs obligatoires")
      return
    }

    // Here you would integrate with payment APIs (MTN MoMo, Orange Money)
    // For demo purposes, we'll simulate the booking process

    const bookingData = {
      vehicleId: vehicle.id,
      vehicleName: vehicle.name,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      totalDays,
      totalPrice,
      paymentMethod,
      customer: customerInfo,
      status: "pending",
    }

    console.log("Booking data:", bookingData)

    // Simulate payment processing
    alert("Redirection vers le paiement Mobile Money...")

    // After successful payment, redirect to confirmation
    // window.location.href = '/booking/confirmation'
  }

  if (!vehicle) {
    return <div className="min-h-screen flex items-center justify-center">Chargement...</div>
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
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Link href="/vehicles" className="text-blue-600 hover:text-blue-800">
            ← Retour aux véhicules
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Vehicle Details */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Image
                      src={vehicle.image || "/placeholder.svg"}
                      alt={vehicle.name}
                      width={400}
                      height={300}
                      className="w-full h-64 object-cover rounded-lg"
                    />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h1 className="text-2xl font-bold text-gray-900">{vehicle.name}</h1>
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
                        <span className="text-sm">{vehicle.features[0]}</span>
                      </div>
                      <div className="flex items-center">
                        <Fuel className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-sm">{vehicle.fuel}</span>
                      </div>
                      <div className="flex items-center">
                        <Settings className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-sm">{vehicle.transmission}</span>
                      </div>
                    </div>

                    <div className="text-2xl font-bold text-blue-600">
                      {vehicle.price.toLocaleString()} FCFA
                      <span className="text-sm font-normal text-gray-600">/jour</span>
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
                      <Label htmlFor="firstName">Prénom *</Label>
                      <Input
                        id="firstName"
                        value={customerInfo.firstName}
                        onChange={(e) => setCustomerInfo({ ...customerInfo, firstName: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Nom *</Label>
                      <Input
                        id="lastName"
                        value={customerInfo.lastName}
                        onChange={(e) => setCustomerInfo({ ...customerInfo, lastName: e.target.value })}
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
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="address">Adresse</Label>
                      <Input
                        id="address"
                        value={customerInfo.address}
                        onChange={(e) => setCustomerInfo({ ...customerInfo, address: e.target.value })}
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
                <div className="space-y-4">
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
                </div>
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
                    <span className="font-medium">{vehicle.name}</span>
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

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Prix par jour:</span>
                    <span>{vehicle.price.toLocaleString()} FCFA</span>
                  </div>
                  {totalDays > 0 && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Sous-total:</span>
                        <span>{totalPrice.toLocaleString()} FCFA</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Frais de service:</span>
                        <span>{Math.round(totalPrice * 0.05).toLocaleString()} FCFA</span>
                      </div>
                    </>
                  )}
                </div>

                <Separator />

                <div className="flex justify-between text-lg font-bold">
                  <span>Total:</span>
                  <span className="text-blue-600">
                    {totalDays > 0 ? Math.round(totalPrice * 1.05).toLocaleString() : "0"} FCFA
                  </span>
                </div>

                <Button
                  onClick={handleBooking}
                  className="w-full"
                  size="lg"
                  disabled={!startDate || !endDate || !paymentMethod || !customerInfo.firstName}
                >
                  <CreditCard className="mr-2 h-4 w-4" />
                  Procéder au paiement
                </Button>

                <div className="text-xs text-gray-500 text-center">
                  <FileText className="h-4 w-4 inline mr-1" />
                  Une facture PDF sera générée après le paiement
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
