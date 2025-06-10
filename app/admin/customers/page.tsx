"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Search, Download, Eye, Mail, Phone, MapPin, Calendar, CreditCard, Star, Users, TrendingUp } from "lucide-react"
import { exportToCSV } from "@/lib/csv-export"

// Mock data pour les clients
const customers = [
  {
    id: 1,
    name: "Jean Dupont",
    email: "jean.dupont@email.com",
    phone: "+237 677 123 456",
    address: "Akwa, Douala",
    city: "Douala",
    dateJoined: "2023-06-15",
    totalBookings: 5,
    totalSpent: 425000,
    lastBooking: "2024-01-15",
    status: "Actif",
    customerType: "Particulier",
    rating: 4.8,
    preferredVehicles: ["Berline", "SUV"],
    paymentMethods: ["MTN MoMo", "Orange Money"],
    notes: "Client VIP - Service premium",
    bookingHistory: [
      { date: "2024-01-15", vehicle: "Toyota Corolla", amount: 75000, status: "Terminée" },
      { date: "2023-12-20", vehicle: "Nissan Pathfinder", amount: 180000, status: "Terminée" },
      { date: "2023-11-10", vehicle: "Toyota Corolla", amount: 50000, status: "Terminée" },
    ],
  },
  {
    id: 2,
    name: "Marie Ngono",
    email: "marie.ngono@email.com",
    phone: "+237 699 987 654",
    address: "Bastos, Yaoundé",
    city: "Yaoundé",
    dateJoined: "2023-08-22",
    totalBookings: 3,
    totalSpent: 320000,
    lastBooking: "2024-01-16",
    status: "Actif",
    customerType: "Entreprise",
    rating: 4.6,
    preferredVehicles: ["SUV"],
    paymentMethods: ["Orange Money"],
    notes: "Directrice commerciale - Voyages d'affaires fréquents",
    bookingHistory: [
      { date: "2024-01-16", vehicle: "Nissan Pathfinder", amount: 180000, status: "En cours" },
      { date: "2023-12-05", vehicle: "Toyota RAV4", amount: 90000, status: "Terminée" },
      { date: "2023-10-15", vehicle: "Nissan Pathfinder", amount: 50000, status: "Terminée" },
    ],
  },
  {
    id: 3,
    name: "Paul Mbarga",
    email: "paul.mbarga@email.com",
    phone: "+237 655 111 222",
    address: "Bonanjo, Douala",
    city: "Douala",
    dateJoined: "2023-09-10",
    totalBookings: 2,
    totalSpent: 65000,
    lastBooking: "2024-01-14",
    status: "Actif",
    customerType: "Étudiant",
    rating: 4.2,
    preferredVehicles: ["Économique"],
    paymentMethods: ["MTN MoMo"],
    notes: "Étudiant - Réductions appliquées",
    bookingHistory: [
      { date: "2024-01-14", vehicle: "Hyundai Accent", amount: 40000, status: "En attente" },
      { date: "2023-11-20", vehicle: "Hyundai Accent", amount: 25000, status: "Terminée" },
    ],
  },
  {
    id: 4,
    name: "Fatima Bello",
    email: "fatima.bello@email.com",
    phone: "+237 677 333 444",
    address: "Melen, Yaoundé",
    city: "Yaoundé",
    dateJoined: "2023-05-30",
    totalBookings: 4,
    totalSpent: 380000,
    lastBooking: "2024-01-12",
    status: "Actif",
    customerType: "Diplomate",
    rating: 4.9,
    preferredVehicles: ["SUV", "Luxe"],
    paymentMethods: ["Orange Money"],
    notes: "Mission diplomatique - Protocole spécial",
    bookingHistory: [
      { date: "2024-01-12", vehicle: "Toyota RAV4", amount: 90000, status: "Terminée" },
      { date: "2023-12-15", vehicle: "Nissan Pathfinder", amount: 120000, status: "Terminée" },
      { date: "2023-11-05", vehicle: "Toyota RAV4", amount: 80000, status: "Terminée" },
    ],
  },
  {
    id: 5,
    name: "Dr. Michel Atangana",
    email: "m.atangana@hopital.cm",
    phone: "+237 699 555 666",
    address: "Omnisport, Yaoundé",
    city: "Yaoundé",
    dateJoined: "2023-03-12",
    totalBookings: 8,
    totalSpent: 720000,
    lastBooking: "2024-01-08",
    status: "VIP",
    customerType: "Professionnel",
    rating: 5.0,
    preferredVehicles: ["Berline", "SUV"],
    paymentMethods: ["MTN MoMo", "Orange Money"],
    notes: "Médecin - Urgences médicales prioritaires",
    bookingHistory: [
      { date: "2024-01-08", vehicle: "Toyota Corolla", amount: 60000, status: "Terminée" },
      { date: "2023-12-28", vehicle: "Nissan Pathfinder", amount: 100000, status: "Terminée" },
      { date: "2023-12-10", vehicle: "Toyota Corolla", amount: 45000, status: "Terminée" },
    ],
  },
]

export default function CustomersPage() {
  const [filteredCustomers, setFilteredCustomers] = useState(customers)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)

  // Filtrage des clients
  useEffect(() => {
    let filtered = customers

    if (searchTerm) {
      filtered = filtered.filter(
        (customer) =>
          customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          customer.phone.includes(searchTerm),
      )
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((customer) => customer.status === statusFilter)
    }

    if (typeFilter !== "all") {
      filtered = filtered.filter((customer) => customer.customerType === typeFilter)
    }

    setFilteredCustomers(filtered)
  }, [searchTerm, statusFilter, typeFilter])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Actif":
        return <Badge className="bg-green-100 text-green-800">Actif</Badge>
      case "VIP":
        return <Badge className="bg-purple-100 text-purple-800">VIP</Badge>
      case "Inactif":
        return <Badge className="bg-gray-100 text-gray-800">Inactif</Badge>
      case "Suspendu":
        return <Badge className="bg-red-100 text-red-800">Suspendu</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getCustomerTypeBadge = (type: string) => {
    switch (type) {
      case "Particulier":
        return <Badge variant="outline">Particulier</Badge>
      case "Entreprise":
        return <Badge className="bg-blue-100 text-blue-800">Entreprise</Badge>
      case "Étudiant":
        return <Badge className="bg-yellow-100 text-yellow-800">Étudiant</Badge>
      case "Diplomate":
        return <Badge className="bg-purple-100 text-purple-800">Diplomate</Badge>
      case "Professionnel":
        return <Badge className="bg-green-100 text-green-800">Professionnel</Badge>
      default:
        return <Badge variant="outline">{type}</Badge>
    }
  }

  const handleViewCustomer = (customer: any) => {
    setSelectedCustomer(customer)
    setIsViewDialogOpen(true)
  }

  const handleExportCSV = () => {
    const csvData = filteredCustomers.map((customer) => ({
      ID: customer.id,
      Nom: customer.name,
      Email: customer.email,
      Téléphone: customer.phone,
      Adresse: customer.address,
      Ville: customer.city,
      "Date inscription": customer.dateJoined,
      "Nombre réservations": customer.totalBookings,
      "Total dépensé (FCFA)": customer.totalSpent,
      "Dernière réservation": customer.lastBooking,
      Statut: customer.status,
      "Type client": customer.customerType,
      Note: customer.rating,
      "Véhicules préférés": customer.preferredVehicles.join(", "),
      "Moyens paiement": customer.paymentMethods.join(", "),
      Notes: customer.notes,
    }))

    exportToCSV(csvData, `clients_${new Date().toISOString().split("T")[0]}`)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestion des clients</h1>
          <p className="text-gray-600">Gérez votre base de clients</p>
        </div>
        <Button onClick={handleExportCSV}>
          <Download className="mr-2 h-4 w-4" />
          Exporter CSV
        </Button>
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total clients</p>
                <p className="text-2xl font-bold">{customers.length}</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Clients VIP</p>
                <p className="text-2xl font-bold">{customers.filter((c) => c.status === "VIP").length}</p>
              </div>
              <Star className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Revenus totaux</p>
                <p className="text-2xl font-bold">
                  {customers.reduce((sum, c) => sum + c.totalSpent, 0).toLocaleString()} FCFA
                </p>
              </div>
              <CreditCard className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Nouveaux ce mois</p>
                <p className="text-2xl font-bold">3</p>
              </div>
              <TrendingUp className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtres et recherche */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Rechercher par nom, email ou téléphone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filtrer par statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="Actif">Actif</SelectItem>
                <SelectItem value="VIP">VIP</SelectItem>
                <SelectItem value="Inactif">Inactif</SelectItem>
                <SelectItem value="Suspendu">Suspendu</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filtrer par type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les types</SelectItem>
                <SelectItem value="Particulier">Particulier</SelectItem>
                <SelectItem value="Entreprise">Entreprise</SelectItem>
                <SelectItem value="Étudiant">Étudiant</SelectItem>
                <SelectItem value="Diplomate">Diplomate</SelectItem>
                <SelectItem value="Professionnel">Professionnel</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tableau des clients */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Client</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Réservations</TableHead>
                <TableHead>Total dépensé</TableHead>
                <TableHead>Dernière visite</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCustomers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{customer.name}</div>
                      <div className="text-sm text-gray-500 flex items-center">
                        <MapPin className="h-3 w-3 mr-1" />
                        {customer.city}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center text-sm">
                        <Mail className="h-3 w-3 mr-1 text-gray-400" />
                        {customer.email}
                      </div>
                      <div className="flex items-center text-sm">
                        <Phone className="h-3 w-3 mr-1 text-gray-400" />
                        {customer.phone}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{getCustomerTypeBadge(customer.customerType)}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{customer.totalBookings}</div>
                      <div className="text-sm text-gray-500 flex items-center">
                        <Star className="h-3 w-3 mr-1 text-yellow-400" />
                        {customer.rating}/5
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{customer.totalSpent.toLocaleString()} FCFA</div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>{customer.lastBooking}</div>
                      <div className="text-gray-500">
                        Membre depuis {new Date(customer.dateJoined).toLocaleDateString("fr-FR")}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(customer.status)}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" onClick={() => handleViewCustomer(customer)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Dialog de détails du client */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Profil client - {selectedCustomer?.name}</DialogTitle>
            <DialogDescription>Informations détaillées et historique du client</DialogDescription>
          </DialogHeader>
          {selectedCustomer && (
            <div className="grid gap-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Informations personnelles</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-center text-sm">
                      <Mail className="h-4 w-4 mr-2 text-gray-400" />
                      {selectedCustomer.email}
                    </div>
                    <div className="flex items-center text-sm">
                      <Phone className="h-4 w-4 mr-2 text-gray-400" />
                      {selectedCustomer.phone}
                    </div>
                    <div className="flex items-center text-sm">
                      <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                      {selectedCustomer.address}
                    </div>
                    <div className="flex items-center text-sm">
                      <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                      Membre depuis {new Date(selectedCustomer.dateJoined).toLocaleDateString("fr-FR")}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Statistiques</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Réservations:</span>
                      <span className="font-medium">{selectedCustomer.totalBookings}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Total dépensé:</span>
                      <span className="font-medium">{selectedCustomer.totalSpent.toLocaleString()} FCFA</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Note moyenne:</span>
                      <div className="flex items-center">
                        <Star className="h-3 w-3 mr-1 text-yellow-400" />
                        <span className="font-medium">{selectedCustomer.rating}/5</span>
                      </div>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Dernière réservation:</span>
                      <span className="font-medium">{selectedCustomer.lastBooking}</span>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Préférences</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div>
                      <div className="text-sm font-medium mb-1">Véhicules préférés:</div>
                      <div className="flex flex-wrap gap-1">
                        {selectedCustomer.preferredVehicles.map((vehicle: string, index: number) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {vehicle}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-medium mb-1">Moyens de paiement:</div>
                      <div className="flex flex-wrap gap-1">
                        {selectedCustomer.paymentMethods.map((method: string, index: number) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {method}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Type:</span>
                      {getCustomerTypeBadge(selectedCustomer.customerType)}
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Statut:</span>
                      {getStatusBadge(selectedCustomer.status)}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {selectedCustomer.notes && (
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Notes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600">{selectedCustomer.notes}</p>
                  </CardContent>
                </Card>
              )}

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Historique des réservations</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Véhicule</TableHead>
                        <TableHead>Montant</TableHead>
                        <TableHead>Statut</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedCustomer.bookingHistory.map((booking: any, index: number) => (
                        <TableRow key={index}>
                          <TableCell>{booking.date}</TableCell>
                          <TableCell>{booking.vehicle}</TableCell>
                          <TableCell>{booking.amount.toLocaleString()} FCFA</TableCell>
                          <TableCell>
                            <Badge variant={booking.status === "Terminée" ? "default" : "secondary"}>
                              {booking.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
              Fermer
            </Button>
            <Button>Contacter le client</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
