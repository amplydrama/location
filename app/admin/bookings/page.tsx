"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Calendar, Search, Download, Eye, Edit, Phone, Mail, MapPin, Clock, CreditCard, Loader2 } from "lucide-react"
import { exportToCSV } from "@/lib/csv-export"

// --- Import your API functions ---
// Assuming getBookings is available from a file like './api/bookings' or './lib/api'
import { getBooking } from "@/app/api/bookings/book"; // Adjust path as needed
import  {createAvailability} from "@/app/api/bookings/book"  // Assuming you'll create this API function

// --- Your defined Booking interface ---
export interface Booking {
  id: number;
  car_name: string; // From backend: This should be the car's name, not the car ID.
                    // If your backend `ReservationSerializer` returns `car` as an object
                    // with `name`, adjust or create `car_name` in the serializer.
                    // For now, I'll assume your backend directly provides `car_name` (string)
                    // or you'll derive it from `car` (number) later.
                    // Given your provided interface has `car: number;` and `car_name: string;`,
                    // it implies `car_name` is a direct field on the serialized booking.
  start_date: string;
  end_date: string;
  email: string;
  created_at: string; // ISO 8601 string for datetime
  estimated_total_price: string; // Keep as string for now, or parse to number if always numeric
  is_paid: boolean;
  name: string; // Customer's name
  phone: string;
  id_card: string;
  address: string;
  with_driver: boolean;
  town: string;
  status: string; // 'pending', 'confirmed', 'partial_paid', 'cancelled'
  token: string;
  user: number | null; // Assuming 'user' is a user ID (number) or null
  car: number; // Assuming 'car' is a car ID (number)
  user_renter: string; // Renamed from `user` in mock to differentiate `user` ID.
                        // This likely corresponds to `user.username` or similar in your backend.
                        // Let's assume this is the name of the user who made the reservation.
}

// Interface for setting unavailability
interface UnavailabilityFormState {
  carId: number | null;
  startDate: string;
  endDate: string;
  reason: string;
}

export default function BookingsPage() {
  const [allBookings, setAllBookings] = useState<Booking[]>([]); // State for all fetched bookings
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentStatusFilter, setPaymentStatusFilter] = useState("all"); // Added payment status filter
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [bookingsLoading, setBookingsLoading] = useState(true);
  const [bookingsError, setBookingsError] = useState<string | null>(null);

  // State for unavailability dialog
  const [isUnavailabilityDialogOpen, setIsUnavailabilityDialogOpen] = useState(false);
  const [unavailabilityForm, setUnavailabilityForm] = useState<UnavailabilityFormState>({
    carId: null,
    startDate: '',
    endDate: '',
    reason: ''
  });
  const [unavailabilityLoading, setUnavailabilityLoading] = useState(false);
  const [unavailabilityError, setUnavailabilityError] = useState<string | null>(null);
  const [unavailabilitySuccess, setUnavailabilitySuccess] = useState<string | null>(null);


  // --- Fetch Bookings from API ---
  useEffect(() => {
    const fetchBookings = async () => {
      setBookingsLoading(true);
      setBookingsError(null);
      try {
        const data = await getBooking(); // Call your API function
        setAllBookings(data);
        setFilteredBookings(data); // Initialize filtered bookings with all data
      } catch (error: any) {
        console.error("Failed to fetch bookings:", error);
        setBookingsError("Échec du chargement des réservations.");
      } finally {
        setBookingsLoading(false);
      }
    };
    fetchBookings();
  }, []); // Empty dependency array means this runs once on mount

  // --- Filtering Logic ---
  useEffect(() => {
    let filtered = allBookings;

    if (searchTerm) {
      filtered = filtered.filter(
        (booking) =>
          booking.name?.toLowerCase().includes(searchTerm.toLowerCase()) || // customer name
          booking.id?.toString().includes(searchTerm.toLowerCase()) || // booking ID
          booking.car_name?.toLowerCase().includes(searchTerm.toLowerCase()) || // vehicle name
          booking.email?.toLowerCase().includes(searchTerm.toLowerCase()) || // email
          booking.phone?.toLowerCase().includes(searchTerm.toLowerCase()) // phone
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((booking) => booking.status === statusFilter);
    }

    if (paymentStatusFilter !== "all") {
        // Your backend 'is_paid' is a boolean, not a string like "Payé" or "En attente".
        // We'll map 'Payé' to true and 'En attente' to false.
        const targetIsPaid = paymentStatusFilter === "Payé";
        filtered = filtered.filter((booking) => booking.is_paid === targetIsPaid);
    }

    setFilteredBookings(filtered);
  }, [searchTerm, statusFilter, paymentStatusFilter, allBookings]); // Added allBookings to dependencies

  // --- Badge Helpers (Updated to match API status values) ---
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return <Badge className="bg-green-100 text-green-800">Confirmée</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">En attente</Badge>;
      case "partial_paid":
        return <Badge className="bg-purple-100 text-purple-800">Avancée</Badge>; // New status
      case "cancelled":
        return <Badge className="bg-red-100 text-red-800">Annulée</Badge>;
      // Add more cases if your API has other statuses (e.g., 'completed', 'in_progress')
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPaymentStatusBadge = (isPaid: boolean) => {
    if (isPaid) {
      return <Badge className="bg-green-100 text-green-800">Payé</Badge>;
    } else {
      return <Badge className="bg-yellow-100 text-yellow-800">En attente</Badge>;
    }
  };

  // --- Handlers ---
  const handleViewBooking = (booking: Booking) => { // Type 'Booking'
    setSelectedBooking(booking);
    setIsViewDialogOpen(true);
  };

  const handleExportCSV = () => {
    const csvData = filteredBookings.map((booking) => ({
      "ID Réservation": booking.id,
      Client: booking.name,
      Email: booking.email,
      Téléphone: booking.phone,
      Véhicule: booking.car_name,
      // "Plaque": "N/A", // Not in your Booking interface
      // "Type": "N/A", // Not in your Booking interface
      "Date début": booking.start_date,
      "Date fin": booking.end_date,
      // "Heure début": "N/A", // Not in your Booking interface
      // "Heure fin": "N/A", // Not in your Booking interface
      "Lieu prise en charge": booking.town, // Assuming 'town' is the pickup/dropoff location
      "Lieu retour": booking.town, // Assuming 'town' is the pickup/dropoff location
      "Montant (FCFA)": parseFloat(booking.estimated_total_price),
      // "Caution (FCFA)": "N/A", // Not in your Booking interface
      "Méthode paiement": "Unset", // As requested, since operator is not available
      "Statut paiement": booking.is_paid ? "Payé" : "En attente",
      "Statut réservation": booking.status,
      "Date création": booking.created_at,
      // "Notes": "N/A", // Not in your Booking interface
      "Avec chauffeur": booking.with_driver ? "Oui" : "Non",
    }));

    exportToCSV(csvData, `reservations_${new Date().toISOString().split("T")[0]}`);
  };

  const handleOpenUnavailabilityDialog = (carId: number | null = null) => {
    setUnavailabilityForm({ carId, startDate: '', endDate: '', reason: '' });
    setUnavailabilityError(null);
    setUnavailabilitySuccess(null);
    setIsUnavailabilityDialogOpen(true);
  };

  const handleUnavailabilityFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setUnavailabilityForm(prev => ({ ...prev, [name]: value }));
  };

  const handleUnavailabilitySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUnavailabilityLoading(true);
    setUnavailabilityError(null);
    setUnavailabilitySuccess(null);

    if (!unavailabilityForm.carId || !unavailabilityForm.startDate || !unavailabilityForm.endDate || !unavailabilityForm.reason) {
      setUnavailabilityError("Veuillez remplir tous les champs obligatoires.");
      setUnavailabilityLoading(false);
      return;
    }

    try {
      // Call your API to create an unavailability entry
      // This function needs to be created in your frontend API layer (e.g., api/availability.ts)
      await createAvailability({ // Assuming a function like this
        car: unavailabilityForm.carId,
        start_date: unavailabilityForm.startDate,
        end_date: unavailabilityForm.endDate,
        reason: unavailabilityForm.reason,
      });
      setUnavailabilitySuccess("Période d'indisponibilité ajoutée avec succès !");
      // Optionally re-fetch bookings or update local state if needed
      // fetchBookings(); // Re-fetch all bookings to reflect changes
      setIsUnavailabilityDialogOpen(false); // Close dialog on success
    } catch (error: any) {
      console.error("Erreur lors de l'ajout d'indisponibilité:", error);
      setUnavailabilityError(error.message || "Échec de l'ajout d'indisponibilité.");
    } finally {
      setUnavailabilityLoading(false);
    }
  };


  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestion des réservations</h1>
          <p className="text-gray-600">Gérez toutes les réservations de véhicules</p>
        </div>
        <div className="flex gap-2">
            <Button>
              Voir les indisponibilité
            </Button>
            <Button variant="outline" onClick={() => handleOpenUnavailabilityDialog()}>
                Définir une indisponibilité
            </Button>
            <Button onClick={handleExportCSV}>
              <Download className="mr-2 h-4 w-4" />
              Exporter CSV
            </Button>
            
            
        </div>
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4"> {/* Changed to grid-cols-5 */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total</p>
                <p className="text-2xl font-bold">{allBookings.length}</p>
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
                {/* Assuming 'En cours' maps to 'confirmed' bookings with current date within range */}
                <p className="text-2xl font-bold">{allBookings.filter((b) => b.status === "confirmed" && new Date(b.start_date) <= new Date() && new Date(b.end_date) >= new Date()).length}</p>
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
                <p className="text-2xl font-bold">{allBookings.filter((b) => b.status === "pending").length}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Revenus Estimés</p>
                <p className="text-2xl font-bold">
                  {allBookings.reduce((sum, b) => sum + parseFloat(b.estimated_total_price || '0'), 0).toLocaleString('fr-CM', { style: 'currency', currency: 'XAF' })}
                </p>
              </div>
              <CreditCard className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        {/* Nouvelle carte pour les revenus réels */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Revenus Réels</p>
                <p className="text-2xl font-bold">
                  {allBookings.filter(b => b.is_paid).reduce((sum, b) => sum + parseFloat(b.estimated_total_price || '0'), 0).toLocaleString('fr-CM', { style: 'currency', currency: 'XAF' })}
                </p>
              </div>
              {/* Vous pouvez choisir une icône différente si vous le souhaitez */}
              <CreditCard className="h-8 w-8 text-teal-600" /> {/* Changed color for distinction */}
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
                  placeholder="Rechercher par nom client, ID réservation, email, téléphone ou nom véhicule..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            {/* Status Filter */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filtrer par statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="confirmed">Confirmée</SelectItem>
                <SelectItem value="pending">En attente</SelectItem>
                <SelectItem value="partial_paid">Avancée</SelectItem>
                <SelectItem value="cancelled">Annulée</SelectItem>
                {/* Add other statuses if applicable from your backend */}
              </SelectContent>
            </Select>
            {/* Payment Status Filter */}
            <Select value={paymentStatusFilter} onValueChange={setPaymentStatusFilter}>
                <SelectTrigger className="w-full md:w-48">
                    <SelectValue placeholder="Filtrer par statut paiement" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">Tous les statuts de paiement</SelectItem>
                    <SelectItem value="Payé">Payé</SelectItem>
                    <SelectItem value="En attente">En attente</SelectItem>
                </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tableau des réservations */}
      <Card>
        <CardContent className="p-0">
          {bookingsLoading ? (
            <div className="flex flex-col justify-center items-center h-48 bg-white rounded-lg shadow-sm">
              <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
              <span className="ml-2 text-gray-600 mt-2">Chargement des réservations...</span>
            </div>
          ) : bookingsError ? (
            <div className="text-center text-red-600 bg-red-50 p-4 rounded-lg border border-red-200">
              <p>{bookingsError}</p>
              <p className="text-sm text-red-500 mt-1">Veuillez vérifier votre connexion ou réessayer plus tard.</p>
            </div>
          ) : filteredBookings.length === 0 ? (
            <div className="text-center text-gray-500 bg-gray-50 p-4 rounded-lg border border-gray-200">
              <p>Aucune réservation trouvée avec les filtres actuels.</p>
              <p className="text-sm mt-1">Essayez d'ajuster vos critères de recherche.</p>
            </div>
          ) : (
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
                        <div className="font-medium">{booking.name}</div> {/* Customer name */}
                        <div className="text-sm text-gray-500 flex items-center">
                          <Phone className="h-3 w-3 mr-1" />
                          {booking.phone}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{booking.car_name}</div> {/* Car name */}
                        {/* Plate number and vehicle type are not directly in your Booking interface */}
                        {/* <div className="text-sm text-gray-500">Plaque: N/A</div> */}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>Du: {booking.start_date}</div>
                        <div>Au: {booking.end_date}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{parseFloat(booking.estimated_total_price).toLocaleString('fr-CM', { style: 'currency', currency: 'XAF' })}</div>
                        {/* Deposit is not in your Booking interface */}
                        {/* <div className="text-sm text-gray-500">Caution: N/A</div> */}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        {getPaymentStatusBadge(booking.is_paid)}
                        <div className="text-xs text-gray-500">Unset</div> {/* Payment method is not directly in Booking interface */}
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
                        <Button variant="ghost" size="sm" onClick={() => handleOpenUnavailabilityDialog(booking.car)}>
                          <Clock className="h-4 w-4 text-red-500" /> {/* Icon to set car unavailable */}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
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
                    <div className="text-sm">
                        <span className="font-medium">Nom:</span> {selectedBooking.name}
                    </div>
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 mr-2 text-gray-400" />
                      <span className="text-sm">{selectedBooking.email}</span>
                    </div>
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 mr-2 text-gray-400" />
                      <span className="text-sm">{selectedBooking.phone}</span>
                    </div>
                    <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                        <span className="text-sm">{selectedBooking.town}</span>
                    </div>
                    <div className="text-sm">
                        <span className="font-medium">CNI:</span> {selectedBooking.id_card || 'N/A'}
                    </div>
                    <div className="text-sm">
                        <span className="font-medium">Adresse:</span> {selectedBooking.address || 'N/A'}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Véhicule</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="text-sm font-medium">{selectedBooking.car_name}</div>
                    <div className="text-sm text-gray-500">ID Véhicule: {selectedBooking.car}</div>
                    <div className="text-sm text-gray-500">Avec chauffeur: {selectedBooking.with_driver ? 'Oui' : 'Non'}</div>
                    {/* Plate number and vehicle type are not in your Booking interface */}
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
                      <span className="font-medium">Début:</span> {selectedBooking.start_date}
                    </div>
                    <div className="text-sm">
                      <span className="font-medium">Fin:</span> {selectedBooking.end_date}
                    </div>
                    <div className="text-sm text-gray-500">Créée le: {new Date(selectedBooking.created_at).toLocaleString()}</div>
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
                        <div className="font-medium">Lieu (Ville)</div>
                        <div className="text-gray-500">{selectedBooking.town}</div>
                      </div>
                    </div>
                    {/* Pickup/dropoff specific locations are not in your Booking interface */}
                  </CardContent>
                </Card>
              </div>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Paiement et Statut</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Montant total estimé:</span>
                    <span className="text-sm font-medium">{parseFloat(selectedBooking.estimated_total_price).toLocaleString('fr-CM', { style: 'currency', currency: 'XAF' })}</span>
                  </div>
                  {/* Deposit is not in your Booking interface */}
                  <div className="flex justify-between">
                    <span className="text-sm">Méthode:</span>
                    <span className="text-sm">Unset</span> {/* As requested */}
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Statut paiement:</span>
                    {getPaymentStatusBadge(selectedBooking.is_paid)}
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Statut réservation:</span>
                    {getStatusBadge(selectedBooking.status)}
                  </div>
                </CardContent>
              </Card>
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

      {/* Dialog for setting Unavailability */}
      <Dialog open={isUnavailabilityDialogOpen} onOpenChange={setIsUnavailabilityDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Définir une indisponibilité pour un véhicule</DialogTitle>
            <DialogDescription>
              Bloquez une période pour un véhicule spécifique.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUnavailabilitySubmit} className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="carId" className="text-right">
                ID Véhicule
              </label>
              <Input
                id="carId"
                name="carId"
                type="number"
                value={unavailabilityForm.carId || ''}
                onChange={(e) => setUnavailabilityForm(prev => ({ ...prev, carId: parseInt(e.target.value) || null }))}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="startDate" className="text-right">
                Date début
              </label>
              <Input
                id="startDate"
                name="startDate"
                type="date"
                value={unavailabilityForm.startDate}
                onChange={handleUnavailabilityFormChange}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="endDate" className="text-right">
                Date fin
              </label>
              <Input
                id="endDate"
                name="endDate"
                type="date"
                value={unavailabilityForm.endDate}
                onChange={handleUnavailabilityFormChange}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="reason" className="text-right">
                Raison
              </label>
              <Input
                id="reason"
                name="reason"
                value={unavailabilityForm.reason}
                onChange={handleUnavailabilityFormChange}
                className="col-span-3"
                placeholder="Ex: Maintenance, Nettoyage, etc."
                required
              />
            </div>
            {unavailabilityError && <p className="text-red-500 text-sm col-span-4 text-center">{unavailabilityError}</p>}
            {unavailabilitySuccess && <p className="text-green-500 text-sm col-span-4 text-center">{unavailabilitySuccess}</p>}
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsUnavailabilityDialogOpen(false)}>
                Annuler
              </Button>
              <Button type="submit" disabled={unavailabilityLoading}>
                {unavailabilityLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Définir l'indisponibilité
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}