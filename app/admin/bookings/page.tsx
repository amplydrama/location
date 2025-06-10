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
import { Calendar, Search, Download, Eye, Edit, Phone, Mail, MapPin, Clock, CreditCard } from "lucide-react"
import { exportToCSV } from "@/lib/csv-export"

// Mock data pour les réservations
const bookings = [
  {
    id: "BK001",
    customer: {
      name: "Jean Dupont",
      email: "jean.dupont@email.com",
      phone: "+237 677 123 456",
    },
    vehicle: {
      name: "Toyota Corolla",
      plate: "LT-123-CM",
      type: "Berline",
    },
    startDate: "2024-01-15",
    endDate: "2024-01-18",
    startTime: "09:00",
    endTime: "18:00",
    pickupLocation: "Aéroport de Douala",
    dropoffLocation: "Hôtel Akwa Palace",
    amount: 75000,
    deposit: 25000,
    paymentMethod: "MTN MoMo",
    paymentStatus: "Payé",
    status: "Confirmée",
    createdAt: "2024-01-10",
    notes: "Client VIP - Service premium",
  },
  {
    id: "BK002",
    customer: {
      name: "Marie Ngono",
      email: "marie.ngono@email.com",
      phone: "+237 699 987 654",
    },
    vehicle: {
      name: "Nissan Pathfinder",
      plate: "YA-456-CM",
      type: "SUV",
    },
    startDate: "2024-01-16",
    endDate: "2024-01-20",
    startTime: "08:00",
    endTime: "20:00",
    pickupLocation: "Centre-ville Yaoundé",
    dropoffLocation: "Centre-ville Yaoundé",
    amount: 180000,
    deposit: 50000,
    paymentMethod: "Orange Money",
    paymentStatus: "Payé",
    status: "En cours",
    createdAt: "2024-01-12",
    notes: "Voyage d'affaires",
  },
  {
    id: "BK003",
    customer: {
      name: "Paul Mbarga",
      email: "paul.mbarga@email.com",
      phone: "+237 655 111 222",
    },
    vehicle: {
      name: "Hyundai Accent",
      plate: "DLA-789-CM",
      type: "Économique",
    },
    startDate: "2024-01-14",
    endDate: "2024-01-16",
    startTime: "10:00",
    endTime: "16:00",
    pickupLocation: "Gare de Douala",
    dropoffLocation: "Université de Douala",
    amount: 40000,
    deposit: 15000,
    paymentMethod: "MTN MoMo",
    paymentStatus: "En attente",
    status: "En attente",
    createdAt: "2024-01-13",
    notes: "Étudiant - Réduction appliquée",
  },
  {
    id: "BK004",
    customer: {
      name: "Fatima Bello",
      email: "fatima.bello@email.com",
      phone: "+237 677 333 444",
    },
    vehicle: {
      name: "Toyota RAV4",
      plate: "BF-321-CM",
      type: "SUV",
    },
    startDate: "2024-01-12",
    endDate: "2024-01-14",
    startTime: "07:00",
    endTime: "19:00",
    pickupLocation: "Hôtel Hilton Yaoundé",
    dropoffLocation: "Aéroport de Yaoundé",
    amount: 90000,
    deposit: 30000,
    paymentMethod: "Orange Money",
    paymentStatus: "Payé",
    status: "Terminée",
    createdAt: "2024-01-08",
    notes: "Mission diplomatique",
  },
]

export default function BookingsPage() {
  const [filteredBookings, setFilteredBookings] = useState(bookings)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedBooking, setSelectedBooking] = useState<any>(null)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)

  // Filtrage des réservations
  useEffect(() => {
    let filtered = bookings

    if (searchTerm) {
      filtered = filtered.filter(
        (booking) =>
          booking.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          booking.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          booking.vehicle.name.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((booking) => booking.status === statusFilter)
    }

    setFilteredBookings(filtered)
  }, [searchTerm, statusFilter])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Confirmée":
        return <Badge className="bg-green-100 text-green-800">Confirmée</Badge>
      case "En cours":
        return <Badge className="bg-blue-100 text-blue-800">En cours</Badge>
      case "Terminée":
        return <Badge className="bg-gray-100 text-gray-800">Terminée</Badge>
      case "En attente":
        return <Badge className="bg-yellow-100 text-yellow-800">En attente</Badge>
      case "Annulée":
        return <Badge className="bg-red-100 text-red-800">Annulée</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case "Payé":
        return <Badge className="bg-green-100 text-green-800">Payé</Badge>
      case "En attente":
        return <Badge className="bg-yellow-100 text-yellow-800">En attente</Badge>
      case "Échoué":
        return <Badge className="bg-red-100 text-red-800">Échoué</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const handleViewBooking = (booking: any) => {
    setSelectedBooking(booking)
    setIsViewDialogOpen(true)
  }

  const handleExportCSV = () => {
    const csvData = filteredBookings.map((booking) => ({
      "ID Réservation": booking.id,
      Client: booking.customer.name,
      Email: booking.customer.email,
      Téléphone: booking.customer.phone,
      Véhicule: booking.vehicle.name,
      Plaque: booking.vehicle.plate,
      Type: booking.vehicle.type,
      "Date début": booking.startDate,
      "Date fin": booking.endDate,
      "Heure début": booking.startTime,
      "Heure fin": booking.endTime,
      "Lieu prise en charge": booking.pickupLocation,
      "Lieu retour": booking.dropoffLocation,
      "Montant (FCFA)": booking.amount,
      "Caution (FCFA)": booking.deposit,
      "Méthode paiement": booking.paymentMethod,
      "Statut paiement": booking.paymentStatus,
      "Statut réservation": booking.status,
      "Date création": booking.createdAt,
      Notes: booking.notes,
    }))

    exportToCSV(csvData, `reservations_${new Date().toISOString().split("T")[0]}`)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestion des réservations</h1>
          <p className="text-gray-600">Gérez toutes les réservations de véhicules</p>
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
                <p className="text-sm font-medium text-gray-600">Total</p>
                <p className="text-2xl font-bold">{bookings.length}</p>
              </div>
              <Calendar className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">En cours</p>
                <p className="text-2xl font-bold">{bookings.filter((b) => b.status === "En cours").length}</p>
              </div>
              <Clock className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">En attente</p>
                <p className="text-2xl font-bold">{bookings.filter((b) => b.status === "En attente").length}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Revenus</p>
                <p className="text-2xl font-bold">
                  {bookings.reduce((sum, b) => sum + b.amount, 0).toLocaleString()} FCFA
                </p>
              </div>
              <CreditCard className="h-8 w-8 text-purple-600" />
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
                  placeholder="Rechercher par nom, ID ou véhicule..."
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
                <SelectItem value="Confirmée">Confirmée</SelectItem>
                <SelectItem value="En cours">En cours</SelectItem>
                <SelectItem value="Terminée">Terminée</SelectItem>
                <SelectItem value="En attente">En attente</SelectItem>
                <SelectItem value="Annulée">Annulée</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tableau des réservations */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
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
              {filteredBookings.map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell className="font-medium">{booking.id}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{booking.customer.name}</div>
                      <div className="text-sm text-gray-500 flex items-center">
                        <Phone className="h-3 w-3 mr-1" />
                        {booking.customer.phone}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{booking.vehicle.name}</div>
                      <div className="text-sm text-gray-500">{booking.vehicle.plate}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>Du: {booking.startDate}</div>
                      <div>Au: {booking.endDate}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{booking.amount.toLocaleString()} FCFA</div>
                      <div className="text-sm text-gray-500">Caution: {booking.deposit.toLocaleString()} FCFA</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      {getPaymentStatusBadge(booking.paymentStatus)}
                      <div className="text-xs text-gray-500">{booking.paymentMethod}</div>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(booking.status)}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="sm" onClick={() => handleViewBooking(booking)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
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

      {/* Dialog de détails de réservation */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Détails de la réservation {selectedBooking?.id}</DialogTitle>
            <DialogDescription>Informations complètes de la réservation</DialogDescription>
          </DialogHeader>
          {selectedBooking && (
            <div className="grid gap-6">
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Informations client</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 mr-2 text-gray-400" />
                      <span className="text-sm">{selectedBooking.customer.email}</span>
                    </div>
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 mr-2 text-gray-400" />
                      <span className="text-sm">{selectedBooking.customer.phone}</span>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Véhicule</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="text-sm font-medium">{selectedBooking.vehicle.name}</div>
                    <div className="text-sm text-gray-500">{selectedBooking.vehicle.type}</div>
                    <div className="text-sm text-gray-500">Plaque: {selectedBooking.vehicle.plate}</div>
                  </CardContent>
                </Card>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Dates et heures</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="text-sm">
                      <span className="font-medium">Début:</span> {selectedBooking.startDate} à{" "}
                      {selectedBooking.startTime}
                    </div>
                    <div className="text-sm">
                      <span className="font-medium">Fin:</span> {selectedBooking.endDate} à {selectedBooking.endTime}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Lieux</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-start">
                      <MapPin className="h-4 w-4 mr-2 text-green-500 mt-0.5" />
                      <div className="text-sm">
                        <div className="font-medium">Prise en charge</div>
                        <div className="text-gray-500">{selectedBooking.pickupLocation}</div>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <MapPin className="h-4 w-4 mr-2 text-red-500 mt-0.5" />
                      <div className="text-sm">
                        <div className="font-medium">Retour</div>
                        <div className="text-gray-500">{selectedBooking.dropoffLocation}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Paiement</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Montant total:</span>
                    <span className="text-sm font-medium">{selectedBooking.amount.toLocaleString()} FCFA</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Caution:</span>
                    <span className="text-sm font-medium">{selectedBooking.deposit.toLocaleString()} FCFA</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Méthode:</span>
                    <span className="text-sm">{selectedBooking.paymentMethod}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Statut:</span>
                    {getPaymentStatusBadge(selectedBooking.paymentStatus)}
                  </div>
                </CardContent>
              </Card>
              {selectedBooking.notes && (
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Notes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600">{selectedBooking.notes}</p>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
              Fermer
            </Button>
            <Button>Modifier la réservation</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
