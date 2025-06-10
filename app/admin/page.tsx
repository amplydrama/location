"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Car, Users, CreditCard, Plus, Edit, Trash2, Download, Eye, Phone, Mail, Calendar, MapPin } from "lucide-react"

// Mock data
const dashboardStats = {
  totalBookings: 156,
  totalRevenue: 12450000,
  mtnRevenue: 7500000,
  orangeRevenue: 4950000,
  totalVehicles: 24,
  availableVehicles: 18,
  totalCustomers: 89,
}

const recentBookings = [
  {
    id: 1,
    customer: "Jean Dupont",
    vehicle: "Toyota Corolla",
    startDate: "2024-01-15",
    endDate: "2024-01-18",
    amount: 75000,
    paymentMethod: "MTN MoMo",
    status: "Confirmée",
  },
  {
    id: 2,
    customer: "Marie Ngono",
    vehicle: "Nissan Pathfinder",
    startDate: "2024-01-16",
    endDate: "2024-01-20",
    amount: 180000,
    paymentMethod: "Orange Money",
    status: "En cours",
  },
  {
    id: 3,
    customer: "Paul Mbarga",
    vehicle: "Hyundai Accent",
    startDate: "2024-01-14",
    endDate: "2024-01-16",
    amount: 40000,
    paymentMethod: "MTN MoMo",
    status: "Terminée",
  },
]

const vehicles = [
  {
    id: 1,
    name: "Toyota Corolla",
    type: "Berline",
    price: 25000,
    status: "Disponible",
    location: "Douala",
    bookings: 23,
  },
  {
    id: 2,
    name: "Nissan Pathfinder",
    type: "SUV",
    price: 45000,
    status: "Loué",
    location: "Yaoundé",
    bookings: 18,
  },
  {
    id: 3,
    name: "Hyundai Accent",
    type: "Économique",
    price: 20000,
    status: "Disponible",
    location: "Douala",
    bookings: 31,
  },
]

const customers = [
  {
    id: 1,
    name: "Jean Dupont",
    email: "jean.dupont@email.com",
    phone: "+237 677 123 456",
    totalBookings: 5,
    totalSpent: 425000,
    lastBooking: "2024-01-15",
  },
  {
    id: 2,
    name: "Marie Ngono",
    email: "marie.ngono@email.com",
    phone: "+237 699 987 654",
    totalBookings: 3,
    totalSpent: 320000,
    lastBooking: "2024-01-16",
  },
]

export default function AdminDashboard() {
  const [selectedVehicle, setSelectedVehicle] = useState<any>(null)
  const [isAddVehicleOpen, setIsAddVehicleOpen] = useState(false)
  const [newVehicle, setNewVehicle] = useState({
    name: "",
    type: "",
    price: "",
    location: "",
  })

  const handleAddVehicle = () => {
    console.log("Adding vehicle:", newVehicle)
    setIsAddVehicleOpen(false)
    setNewVehicle({ name: "", type: "", price: "", location: "" })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Confirmée":
        return <Badge className="bg-green-100 text-green-800">Confirmée</Badge>
      case "En cours":
        return <Badge className="bg-blue-100 text-blue-800">En cours</Badge>
      case "Terminée":
        return <Badge className="bg-gray-100 text-gray-800">Terminée</Badge>
      case "Disponible":
        return <Badge className="bg-green-100 text-green-800">Disponible</Badge>
      case "Loué":
        return <Badge className="bg-orange-100 text-orange-800">Loué</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Car className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">Admin - CarLoc Cameroun</span>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline">Déconnexion</Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Tableau de bord</h1>
          <p className="text-gray-600">Gérez votre flotte et suivez vos performances</p>
        </div>

        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="dashboard">Tableau de bord</TabsTrigger>
            <TabsTrigger value="bookings">Réservations</TabsTrigger>
            <TabsTrigger value="vehicles">Véhicules</TabsTrigger>
            <TabsTrigger value="customers">Clients</TabsTrigger>
            <TabsTrigger value="reports">Rapports</TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Réservations</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{dashboardStats.totalBookings}</div>
                  <p className="text-xs text-muted-foreground">+12% ce mois</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Revenus Total</CardTitle>
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{dashboardStats.totalRevenue.toLocaleString()} FCFA</div>
                  <p className="text-xs text-muted-foreground">+8% ce mois</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Véhicules Disponibles</CardTitle>
                  <Car className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {dashboardStats.availableVehicles}/{dashboardStats.totalVehicles}
                  </div>
                  <p className="text-xs text-muted-foreground">75% de disponibilité</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{dashboardStats.totalCustomers}</div>
                  <p className="text-xs text-muted-foreground">+5 nouveaux ce mois</p>
                </CardContent>
              </Card>
            </div>

            {/* Payment Methods Revenue */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Revenus par mode de paiement</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 bg-yellow-400 rounded"></div>
                      <span>MTN Mobile Money</span>
                    </div>
                    <span className="font-semibold">{dashboardStats.mtnRevenue.toLocaleString()} FCFA</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 bg-orange-500 rounded"></div>
                      <span>Orange Money</span>
                    </div>
                    <span className="font-semibold">{dashboardStats.orangeRevenue.toLocaleString()} FCFA</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Réservations récentes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {recentBookings.slice(0, 3).map((booking) => (
                      <div key={booking.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium">{booking.customer}</p>
                          <p className="text-sm text-gray-600">{booking.vehicle}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">{booking.amount.toLocaleString()} FCFA</p>
                          {getStatusBadge(booking.status)}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Bookings Tab */}
          <TabsContent value="bookings" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Réservations</h2>
              <Button>
                <Download className="mr-2 h-4 w-4" />
                Exporter CSV
              </Button>
            </div>

            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Client</TableHead>
                      <TableHead>Véhicule</TableHead>
                      <TableHead>Dates</TableHead>
                      <TableHead>Montant</TableHead>
                      <TableHead>Paiement</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentBookings.map((booking) => (
                      <TableRow key={booking.id}>
                        <TableCell className="font-medium">{booking.customer}</TableCell>
                        <TableCell>{booking.vehicle}</TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div>Du: {booking.startDate}</div>
                            <div>Au: {booking.endDate}</div>
                          </div>
                        </TableCell>
                        <TableCell>{booking.amount.toLocaleString()} FCFA</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-1">
                            <Phone className="h-3 w-3" />
                            <span className="text-sm">{booking.paymentMethod}</span>
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(booking.status)}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Vehicles Tab */}
          <TabsContent value="vehicles" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Gestion des véhicules</h2>
              <Dialog open={isAddVehicleOpen} onOpenChange={setIsAddVehicleOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Ajouter un véhicule
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Ajouter un nouveau véhicule</DialogTitle>
                    <DialogDescription>
                      Remplissez les informations du véhicule à ajouter à votre flotte.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nom du véhicule</Label>
                      <Input
                        id="name"
                        value={newVehicle.name}
                        onChange={(e) => setNewVehicle({ ...newVehicle, name: e.target.value })}
                        placeholder="Toyota Corolla"
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
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="price">Prix par jour (FCFA)</Label>
                      <Input
                        id="price"
                        type="number"
                        value={newVehicle.price}
                        onChange={(e) => setNewVehicle({ ...newVehicle, price: e.target.value })}
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
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsAddVehicleOpen(false)}>
                      Annuler
                    </Button>
                    <Button onClick={handleAddVehicle}>Ajouter</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Véhicule</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Prix/jour</TableHead>
                      <TableHead>Localisation</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead>Réservations</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {vehicles.map((vehicle) => (
                      <TableRow key={vehicle.id}>
                        <TableCell className="font-medium">{vehicle.name}</TableCell>
                        <TableCell>{vehicle.type}</TableCell>
                        <TableCell>{vehicle.price.toLocaleString()} FCFA</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-1 text-gray-400" />
                            {vehicle.location}
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(vehicle.status)}</TableCell>
                        <TableCell>{vehicle.bookings}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Customers Tab */}
          <TabsContent value="customers" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Gestion des clients</h2>
              <Button>
                <Download className="mr-2 h-4 w-4" />
                Exporter la liste
              </Button>
            </div>

            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nom</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Réservations</TableHead>
                      <TableHead>Total dépensé</TableHead>
                      <TableHead>Dernière réservation</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {customers.map((customer) => (
                      <TableRow key={customer.id}>
                        <TableCell className="font-medium">{customer.name}</TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center text-sm">
                              <Mail className="h-3 w-3 mr-1" />
                              {customer.email}
                            </div>
                            <div className="flex items-center text-sm">
                              <Phone className="h-3 w-3 mr-1" />
                              {customer.phone}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{customer.totalBookings}</TableCell>
                        <TableCell>{customer.totalSpent.toLocaleString()} FCFA</TableCell>
                        <TableCell>{customer.lastBooking}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Rapports et analyses</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Rapport mensuel</CardTitle>
                  <CardDescription>Générer un rapport détaillé du mois</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner le mois" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2024-01">Janvier 2024</SelectItem>
                      <SelectItem value="2023-12">Décembre 2023</SelectItem>
                      <SelectItem value="2023-11">Novembre 2023</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button className="w-full">
                    <Download className="mr-2 h-4 w-4" />
                    Télécharger PDF
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Rapport des paiements</CardTitle>
                  <CardDescription>Analyse des transactions Mobile Money</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-yellow-50 rounded-lg">
                      <div className="text-2xl font-bold text-yellow-600">
                        {Math.round((dashboardStats.mtnRevenue / dashboardStats.totalRevenue) * 100)}%
                      </div>
                      <div className="text-sm text-gray-600">MTN MoMo</div>
                    </div>
                    <div className="text-center p-4 bg-orange-50 rounded-lg">
                      <div className="text-2xl font-bold text-orange-600">
                        {Math.round((dashboardStats.orangeRevenue / dashboardStats.totalRevenue) * 100)}%
                      </div>
                      <div className="text-sm text-gray-600">Orange Money</div>
                    </div>
                  </div>
                  <Button className="w-full">
                    <Download className="mr-2 h-4 w-4" />
                    Exporter CSV
                  </Button>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Véhicules les plus demandés</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {vehicles
                    .sort((a, b) => b.bookings - a.bookings)
                    .map((vehicle, index) => (
                      <div key={vehicle.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-bold text-blue-600">
                            {index + 1}
                          </div>
                          <div>
                            <p className="font-medium">{vehicle.name}</p>
                            <p className="text-sm text-gray-600">
                              {vehicle.type} - {vehicle.location}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">{vehicle.bookings} réservations</p>
                          <p className="text-sm text-gray-600">{vehicle.price.toLocaleString()} FCFA/jour</p>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
