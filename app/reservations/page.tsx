'use client'; // Don't forget this if you're using React hooks in a client component with Next.js App Router

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation"; // Correct import for useRouter

// Import Lucide React icons
import { Menu, Car, Search, Mail, Phone, User, MapPin, Eye, Edit, XCircle, DollarSign,Loader2, } from "lucide-react";

// Import your Shadcn/UI components
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

// Import your axiosAuth instance for authenticated requests
import { axiosAuth } from "@/utils/axios"; // Ensure the path is correct
import { getBooking } from "../api/bookings/book"; // Ensure the path is correct

// Interface for booking data received from the API, strictly based on the provided response
interface BookingData {
    id: number;
    start_date: string;
    end_date: string;
    email: string;
    created_at: string;
    estimated_total_price: number;
    is_paid: boolean;
    name: string | null;
    phone: string | null;
    id_card: string | null;
    address: string | null;
    with_driver: boolean;
    town: string;
    status: string;
    token: string;
    user: number;
    car_name: string;
}

const getUserBookings = async (): Promise<BookingData[]> => {
    const mockBookings = await getBooking();
    return mockBookings;
};

export default function UserBookingsPage() {
    const [bookings, setBookings] = useState<BookingData[]>([]);
    const [filteredBookings, setFilteredBookings] = useState<BookingData[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [selectedBooking, setSelectedBooking] = useState<BookingData | null>(null);
    const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // State for mobile menu
    const router = useRouter();

    // --- Pagination States ---
    const [currentPage, setCurrentPage] = useState(1);
    const [bookingsPerPage] = useState(10); // Number of bookings per page

    // Effect for initial fetching of bookings
    useEffect(() => {
        const fetchBookings = async () => {
            try {
                setIsLoading(true);
                setError(null);
                const data = await getUserBookings(); // Call the API function

                if (Array.isArray(data)) {
                    // Convert estimated_total_price to number if not already done by the API
                    const processedData = data.map(booking => ({
                        ...booking,
                        estimated_total_price: parseFloat(booking.estimated_total_price.toString()),
                    }));
                    setBookings(processedData);
                    setFilteredBookings(processedData); // Initialize filtered bookings with all bookings
                } else {
                    console.error("API returned unexpected data (not an array):", data);
                    setError("Format de données inattendu de l'API. Veuillez contacter le support.");
                    setBookings([]);
                    setFilteredBookings([]);
                }
            } catch (err: any) {
                console.error("Erreur lors du chargement des réservations:", err);
                setError("Impossible de charger vos réservations. " + (err.message || "Veuillez réessayer plus tard."));
            } finally {
                setIsLoading(false);
            }
        };

        fetchBookings();
    }, []);

    // Filtering bookings (depends on filters and raw data)
    useEffect(() => {
    let currentFiltered = [...bookings];

    if (searchTerm) {
        const lowerCaseSearchTerm = searchTerm.toLowerCase(); // Convert search term once

        currentFiltered = currentFiltered.filter(
            (booking) =>
                (booking.name && booking.name.toLowerCase().includes(lowerCaseSearchTerm)) ||
                booking.id.toString().includes(lowerCaseSearchTerm) ||
                // Apply toLowerCase to booking.car_name as well!
                (booking.car_name && booking.car_name.toLowerCase().trim().includes(lowerCaseSearchTerm)) ||
                (booking.email && booking.email.toLowerCase().includes(lowerCaseSearchTerm))
        );
    }

    if (statusFilter !== "all") {
        currentFiltered = currentFiltered.filter((booking) => booking.status === statusFilter);
    }

    setFilteredBookings(currentFiltered);
    setCurrentPage(1); // Reset to first page when filters change
}, [searchTerm, statusFilter, bookings]); // Depend on 'bookings' to re-run when data loads/changes

    // Get current bookings for the current page
    const indexOfLastBooking = currentPage * bookingsPerPage;
    const indexOfFirstBooking = indexOfLastBooking - bookingsPerPage;
    const currentBookings = filteredBookings.slice(indexOfFirstBooking, indexOfLastBooking);

    // Calculate total pages
    const totalPages = Math.ceil(filteredBookings.length / bookingsPerPage);

    // Change page
    const paginate = (pageNumber: number) => {
        if (pageNumber < 1 || pageNumber > totalPages) return; // Prevent going out of bounds
        setCurrentPage(pageNumber);
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "confirmed":
                return <Badge className="bg-green-100 text-green-800">Confirmée</Badge>;
            case "pending":
                return <Badge className="bg-yellow-100 text-yellow-800">En attente</Badge>;
            case "cancelled":
                return <Badge className="bg-red-100 text-red-800">Annulée</Badge>;
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    const getPaymentStatusBadge = (isPaid: boolean) => {
        return isPaid ? <Badge className="bg-green-100 text-green-800">Payé</Badge> : <Badge className="bg-yellow-100 text-yellow-800">Non payé</Badge>;
    };

    const handleViewBooking = (booking: BookingData) => {
        setSelectedBooking(booking);
        setIsViewDialogOpen(true);
    };

    const handleCancelBooking = (bookingId: number) => {
        // IMPORTANT: Do NOT use alert() in production apps or within iframes.
        // Replace with a custom modal/dialog for user confirmation.
        alert(`Annuler la réservation : ${bookingId}`);
        // Implement API logic to cancel the booking here
        // After successful cancellation, you might want to refetch bookings or update state
        // fetchBookings(); // If you have a way to refetch all bookings
        setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: 'cancelled' } : b));
    };

    const handleEditBooking = (bookingId: number) => {
        // IMPORTANT: Do NOT use alert() in production apps or within iframes.
        // Replace with a custom modal/dialog or direct navigation.
        alert(`Modifier la réservation : ${bookingId}`);
        // Implement logic to redirect to an edit page or open a form here
    };

    const handlePayBooking = (bookingId: number) => {
        router.push(`/reservations/payment/${bookingId}`);
        // Implement logic to redirect to the payment page here
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
                <p className="text-xl text-gray-700">Chargement de vos réservations...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-xl text-red-600">{error}</p>
            </div>
        );
    }

    return (
        <div className="relative min-h-screen flex flex-col">
            {/* Fixed Header */}
            <header className="bg-white shadow-sm border-b fixed top-0 left-0 w-full z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <Link href="/" className="flex items-center space-x-2">
                            <Car className="h-8 w-8 text-blue-600" />
                            <span className="text-xl font-bold text-gray-900">CarLoc Cameroun</span>
                        </Link>

                        {/* Desktop Navigation: HIDDEN on 'xs' screens (<= 425px), FLEX otherwise (desktop) */}
                        <nav className="me:hidden xs:flex space-x-8">
                            <Link href="/" className="text-gray-700 hover:text-blue-600">
                                Accueil
                            </Link>
                            <Link href="/vehicles" className="text-gray-700 hover:text-blue-600">
                                Véhicules
                            </Link>
                            <Link href="/reservations" className="text-blue-600 font-medium">
                                Mes réservations
                            </Link>
                            <Link href="/about" className="text-gray-700 hover:text-blue-600">
                                À propos
                            </Link>
                            <Link href="/contact" className="text-gray-700 hover:text-blue-600">
                                Contact
                            </Link>
                        </nav>

                        {/* Desktop Action Buttons: HIDDEN on 'xs' screens (<= 425px), FLEX otherwise (desktop) */}
                        <div className="me:hidden xs:flex items-center space-x-4">
                            <Link href="/login">
                                <Button variant="outline">Connexion</Button>
                            </Link>
                            <Link href="/dashboard">
                                <Button>Mon compte</Button>
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
                    </div>
                </div>

                {/* Mobile Menu Content: Appears when `isMobileMenuOpen` is true AND the screen is <= 425px */}
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
            </header>

            {/* Main Content Area - Pushes down to account for the fixed header */}
            <main className="flex-1 container mx-auto py-8 px-4 mt-16">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Mes réservations</h1>
                        <p className="text-gray-600">Consultez et gérez vos réservations de véhicules.</p>
                    </div>
                </div>

                <Card className="mb-6">
                    <CardContent className="p-4">
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1">
                                <div className="relative">
                                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                    <Input
                                        placeholder="Rechercher par nom, email, ID ou ID véhicule..."
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
                                    <SelectItem value="confirmed">Confirmée</SelectItem>
                                    <SelectItem value="pending">En attente</SelectItem>
                                    <SelectItem value="cancelled">Annulée</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>ID</TableHead>
                                    <TableHead>Client</TableHead>
                                    <TableHead>Véhicule</TableHead>
                                    <TableHead>Dates</TableHead>
                                    <TableHead>Montant Estimé</TableHead>
                                    <TableHead>Paiement</TableHead>
                                    <TableHead>Statut</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {currentBookings.length > 0 ? (
                                    currentBookings.map((booking) => (
                                        <TableRow key={booking.id}>
                                            <TableCell className="font-medium">{booking.id}</TableCell>
                                            <TableCell>
                                                <div>
                                                    <div className="font-medium">{booking.name || "N/A"}</div>
                                                    <div className="text-sm text-gray-500 flex items-center">
                                                        <Mail className="h-3 w-3 mr-1" />
                                                        {booking.email}
                                                    </div>
                                                    {booking.phone && (
                                                        <div className="text-sm text-gray-500 flex items-center">
                                                            <Phone className="h-3 w-3 mr-1" />
                                                            {booking.phone}
                                                        </div>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div>
                                                    <div className="font-medium">{booking.car_name}</div>
                                                    <div className="text-sm text-gray-500">
                                                        <User className="h-3 w-3 mr-1 inline-block" /> Utilisateur ID: {booking.user}
                                                    </div>
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
                                                    <div className="font-medium">{booking.estimated_total_price.toLocaleString()} FCFA</div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="space-y-1">
                                                    {getPaymentStatusBadge(booking.is_paid)}
                                                </div>
                                            </TableCell>
                                            <TableCell>{getStatusBadge(booking.status)}</TableCell>
                                            <TableCell>
                                                <div className="flex space-x-2">
                                                    <Button variant="ghost" size="sm" onClick={() => handleViewBooking(booking)}>
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                    <Button variant="ghost" size="sm" onClick={() => handleEditBooking(booking.id)}>
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                    <Button variant="ghost" size="sm" onClick={() => handleCancelBooking(booking.id)}>
                                                        <XCircle className="h-4 w-4 text-red-500" />
                                                    </Button>
                                                    <Button variant="ghost" size="sm" onClick={() => handlePayBooking(booking.id)}>
                                                        <DollarSign className="h-4 w-4 text-green-500" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={8} className="text-center text-gray-500 py-8">
                                            Aucune réservation pour le moment. <br />
                                            pour pouvoir afficher vos reservations si elles existent vous devez etre connecter
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                    <div className="flex justify-center items-center space-x-2 mt-4">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => paginate(currentPage - 1)}
                            disabled={currentPage === 1}
                        >
                            Précédent
                        </Button>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                            <Button
                                key={page}
                                variant={currentPage === page ? "default" : "outline"}
                                size="sm"
                                onClick={() => paginate(page)}
                            >
                                {page}
                            </Button>
                        ))}
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => paginate(currentPage + 1)}
                            disabled={currentPage === totalPages}
                        >
                            Suivant
                        </Button>
                    </div>
                )}

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
                                            {selectedBooking.name && (
                                                <div className="flex items-center">
                                                    <User className="h-4 w-4 mr-2 text-gray-400" />
                                                    <span className="text-sm">{selectedBooking.name}</span>
                                                </div>
                                            )}
                                            <div className="flex items-center">
                                                <Mail className="h-4 w-4 mr-2 text-gray-400" />
                                                <span className="text-sm">{selectedBooking.email}</span>
                                            </div>
                                            {selectedBooking.phone && (
                                                <div className="flex items-center">
                                                    <Phone className="h-4 w-4 mr-2 text-gray-400" />
                                                    <span className="text-sm">{selectedBooking.phone}</span>
                                                </div>
                                            )}
                                            {selectedBooking.address && (
                                                <div className="flex items-center">
                                                    <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                                                    <span className="text-sm">{selectedBooking.address}</span>
                                                </div>
                                            )}
                                            {selectedBooking.id_card && (
                                                <div className="flex items-center">
                                                    <span className="text-sm font-medium">ID Card:</span>
                                                    <span className="text-sm ml-2">{selectedBooking.id_card}</span>
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                    <Card>
                                        <CardHeader className="pb-3">
                                            <CardTitle className="text-sm">Véhicule & Chauffeur</CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-2">
                                            <div className="flex items-center">
                                                <Car className="h-4 w-4 mr-2 text-gray-400" />
                                                <span className="text-sm font-medium">Véhicule:</span>
                                                <span className="text-sm ml-2">{selectedBooking.car_name}</span>
                                            </div>
                                            <div className="flex items-center">
                                                <User className="h-4 w-4 mr-2 text-gray-400" />
                                                <span className="text-sm font-medium">ID Utilisateur:</span>
                                                <span className="text-sm ml-2">{selectedBooking.user}</span>
                                            </div>
                                            <div className="flex items-center">
                                                <span className="text-sm font-medium">Avec chauffeur:</span>
                                                <span className="text-sm ml-2">{selectedBooking.with_driver ? "Oui" : "Non"}</span>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <Card>
                                        <CardHeader className="pb-3">
                                            <CardTitle className="text-sm">Dates et Ville</CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-2">
                                            <div className="text-sm">
                                                <span className="font-medium">Début:</span> {selectedBooking.start_date}
                                            </div>
                                            <div className="text-sm">
                                                <span className="font-medium">Fin:</span> {selectedBooking.end_date}
                                            </div>
                                            <div className="flex items-center">
                                                <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                                                <span className="text-sm font-medium">Ville:</span>
                                                <span className="text-sm ml-2 capitalize">{selectedBooking.town}</span>
                                            </div>
                                            <div className="text-sm">
                                                <span className="font-medium">Créée le:</span> {new Date(selectedBooking.created_at).toLocaleDateString()}
                                            </div>
                                        </CardContent>
                                    </Card>
                                    <Card>
                                        <CardHeader className="pb-3">
                                            <CardTitle className="text-sm">Statuts</CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-2">
                                            <div className="flex justify-between">
                                                <span className="text-sm">Statut Réservation:</span>
                                                {getStatusBadge(selectedBooking.status)}
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-sm">Statut Paiement:</span>
                                                {getPaymentStatusBadge(selectedBooking.is_paid)}
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                                <Card>
                                    <CardHeader className="pb-3">
                                        <CardTitle className="text-sm">Détails Financiers & Jeton</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-2">
                                        <div className="flex justify-between">
                                            <span className="text-sm">Montant total estimé:</span>
                                            <span className="text-sm font-medium">{selectedBooking.estimated_total_price.toLocaleString()} FCFA</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-sm">Jeton de réservation:</span>
                                            <span className="text-sm font-mono break-all">{selectedBooking.token}</span>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        )}
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
                                Fermer
                            </Button>
                            <Button onClick={() => handleEditBooking(selectedBooking!.id)}>
                                <Edit className="h-4 w-4 mr-2" /> Modifier
                            </Button>
                            <Button variant="destructive" onClick={() => handleCancelBooking(selectedBooking!.id)}>
                                <XCircle className="h-4 w-4 mr-2" /> Annuler
                            </Button>
                            <Button onClick={() => handlePayBooking(selectedBooking!.id)}>
                                <DollarSign className="h-4 w-4 mr-2" /> Régler
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </main>
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
