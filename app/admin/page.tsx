"use client"

import { useState, useEffect, useMemo } from "react"
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
import { Car, Users, CreditCard, Plus, Edit, Trash2, Download, Eye, Phone, Mail, Calendar, MapPin, Loader2, Search } from "lucide-react"

import axios from 'axios'; // Replace with axiosAuth in your actual project

// --- Interfaces for API Responses ---
interface DashboardStats {
    totalBookings: number;
    totalRevenue: number;
    mtnRevenue: number;
    orangeRevenue: number;
    totalVehicles: number;
    availableVehicles: number;
    totalCustomers: number;
}

interface Booking { // Kept for fetchRecentBookings on Dashboard tab, but won't be displayed in its own tab
    id: number;
    customer: string;
    vehicle: string;
    startDate: string;
    endDate: string;
    amount: number;
    paymentMethod: string;
    status: string;
}

interface Vehicle { // Kept for fetchVehicles on Reports tab, but won't be displayed in its own tab
    id: number;
    name: string;
    type: string;
    price: number;
    status: string;
    location: string;
    bookings: number;
}

// --- Mock API Functions (Replace with actual axiosAuth calls) ---
const fetchDashboardStats = async (): Promise<DashboardStats> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    return {
        totalBookings: 156,
        totalRevenue: 12450000,
        mtnRevenue: 7500000,
        orangeRevenue: 4950000,
        totalVehicles: 24,
        availableVehicles: 18,
        totalCustomers: 89,
    };
};

const fetchRecentBookings = async (): Promise<Booking[]> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return [
        { id: 1, customer: "Jean Dupont", vehicle: "Toyota Corolla", startDate: "2024-01-15", endDate: "2024-01-18", amount: 75000, paymentMethod: "MTN MoMo", status: "Confirmée" },
        { id: 2, customer: "Marie Ngono", vehicle: "Nissan Pathfinder", startDate: "2024-01-16", endDate: "2024-01-20", amount: 180000, paymentMethod: "Orange Money", status: "En cours" },
        { id: 3, customer: "Paul Mbarga", vehicle: "Hyundai Accent", startDate: "2024-01-14", endDate: "2024-01-16", amount: 40000, paymentMethod: "MTN MoMo", status: "Terminée" },
    ];
};

const fetchVehicles = async (): Promise<Vehicle[]> => {
    await new Promise(resolve => setTimeout(resolve, 1200));
    return [
        { id: 1, name: "Toyota Corolla", type: "Berline", price: 25000, status: "Disponible", location: "Douala", bookings: 23 },
        { id: 2, name: "Nissan Pathfinder", type: "SUV", price: 45000, status: "Loué", location: "Yaoundé", bookings: 18 },
        { id: 3, name: "Hyundai Accent", type: "Économique", price: 20000, status: "Disponible", location: "Douala", bookings: 31 },
        { id: 4, name: "Mercedes-pajero-2010-LT-Flex", type: "SUV", price: 60000, status: "Disponible", location: "Douala", bookings: 10 },
        { id: 5, name: "Nissan-Prado v-2025-LT-234-cr", type: "Pick-up", price: 55000, status: "Loué", location: "Yaoundé", bookings: 5 },
    ];
};


export default function AdminDashboard() {
    // --- State for fetched data ---
    const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
    const [recentBookings, setRecentBookings] = useState<Booking[]>([]); // Only for dashboard tab
    const [allVehicles, setAllVehicles] = useState<Vehicle[]>([]); // Only for reports tab (most requested vehicles)

    // --- Loading states ---
    const [statsLoading, setStatsLoading] = useState(true);
    const [bookingsLoading, setBookingsLoading] = useState(true); // Only for dashboard tab
    const [vehiclesLoading, setVehiclesLoading] = useState(true); // Only for reports tab

    // --- Error states ---
    const [statsError, setStatsError] = useState<string | null>(null);
    const [bookingsError, setBookingsError] = useState<string | null>(null); // Only for dashboard tab
    const [vehiclesError, setVehiclesError] = useState<string | null>(null); // Only for reports tab

    // --- Tab state ---
    const [activeTab, setActiveTab] = useState("dashboard");

    // --- Fetch Dashboard Stats ---
    useEffect(() => {
        const getStats = async () => {
            setStatsLoading(true);
            setStatsError(null);
            try {
                const data = await fetchDashboardStats();
                setDashboardStats(data);
            } catch (error) {
                console.error("Failed to fetch dashboard stats:", error);
                setStatsError("Échec du chargement des statistiques.");
            } finally {
                setStatsLoading(false);
            }
        };
        getStats();
    }, []);

    // --- Fetch Recent Bookings (for Dashboard tab) ---
    useEffect(() => {
        const getRecentBookings = async () => {
            setBookingsLoading(true);
            setBookingsError(null);
            try {
                const data = await fetchRecentBookings();
                setRecentBookings(data);
            } catch (error) {
                console.error("Failed to fetch recent bookings:", error);
                setBookingsError("Échec du chargement des réservations récentes.");
            } finally {
                setBookingsLoading(false);
            }
        };
        getRecentBookings();
    }, []);

    // --- Fetch ALL Vehicles (for Reports tab - most requested) ---
    useEffect(() => {
        const getVehicles = async () => {
            setVehiclesLoading(true);
            setVehiclesError(null);
            try {
                const data = await fetchVehicles();
                setAllVehicles(data);
            } catch (error) {
                console.error("Failed to fetch all vehicles for reports:", error);
                setVehiclesError("Échec du chargement des véhicules pour les rapports.");
            } finally {
                setVehiclesLoading(false);
            }
        };
        getVehicles();
    }, []);

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

                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                    <TabsList className="grid w-full grid-cols-2"> {/* Changed to 2 columns */}
                        <TabsTrigger value="dashboard">Tableau de bord</TabsTrigger>
                        <TabsTrigger value="reports">Rapports</TabsTrigger>
                    </TabsList>

                    {/* Dashboard Tab */}
                    <TabsContent value="dashboard" className="space-y-6">
                        {statsLoading ? (
                            <div className="flex justify-center items-center h-48">
                                <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                                <span className="ml-2 text-gray-600">Chargement des statistiques...</span>
                            </div>
                        ) : statsError ? (
                            <div className="text-center text-red-500 py-8">{statsError}</div>
                        ) : (
                            <>
                                {/* Stats Cards */}
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                    <Card>
                                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                            <CardTitle className="text-sm font-medium">Total Réservations</CardTitle>
                                            <Calendar className="h-4 w-4 text-muted-foreground" />
                                        </CardHeader>
                                        <CardContent>
                                            <div className="text-2xl font-bold">{dashboardStats?.totalBookings || 0}</div>
                                            <p className="text-xs text-muted-foreground">+12% ce mois</p>
                                        </CardContent>
                                    </Card>

                                    <Card>
                                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                            <CardTitle className="text-sm font-medium">Revenus Total</CardTitle>
                                            <CreditCard className="h-4 w-4 text-muted-foreground" />
                                        </CardHeader>
                                        <CardContent>
                                            <div className="text-2xl font-bold">{dashboardStats?.totalRevenue.toLocaleString() || 0} FCFA</div>
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
                                                {dashboardStats?.availableVehicles || 0}/{dashboardStats?.totalVehicles || 0}
                                            </div>
                                            <p className="text-xs text-muted-foreground">
                                                {dashboardStats?.totalVehicles
                                                    ? `${Math.round((dashboardStats.availableVehicles / dashboardStats.totalVehicles) * 100)}%`
                                                    : '0%'}{" "}
                                                de disponibilité
                                            </p>
                                        </CardContent>
                                    </Card>

                                    <Card>
                                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                            <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
                                            <Users className="h-4 w-4 text-muted-foreground" />
                                        </CardHeader>
                                        <CardContent>
                                            <div className="text-2xl font-bold">{dashboardStats?.totalCustomers || 0}</div>
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
                                                <span className="font-semibold">{dashboardStats?.mtnRevenue.toLocaleString() || 0} FCFA</span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center space-x-2">
                                                    <div className="w-4 h-4 bg-orange-500 rounded"></div>
                                                    <span>Orange Money</span>
                                                </div>
                                                <span className="font-semibold">{dashboardStats?.orangeRevenue.toLocaleString() || 0} FCFA</span>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Réservations récentes</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            {bookingsLoading ? (
                                                <div className="flex justify-center items-center h-24">
                                                    <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
                                                    <span className="ml-2 text-gray-600">Chargement des réservations...</span>
                                                </div>
                                            ) : bookingsError ? (
                                                <div className="text-center text-red-500 py-4">{bookingsError}</div>
                                            ) : recentBookings.length === 0 ? (
                                                <div className="text-center text-gray-500 py-4">Aucune réservation récente trouvée.</div>
                                            ) : (
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
                                            )}
                                        </CardContent>
                                    </Card>
                                </div>
                            </>
                        )}
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
                                    {statsLoading ? (
                                        <div className="flex justify-center items-center h-24">
                                            <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
                                        </div>
                                    ) : statsError ? (
                                        <div className="text-center text-red-500 py-4">{statsError}</div>
                                    ) : (
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="text-center p-4 bg-yellow-50 rounded-lg">
                                                <div className="text-2xl font-bold text-yellow-600">
                                                    {dashboardStats?.totalRevenue
                                                        ? `${Math.round((dashboardStats.mtnRevenue / dashboardStats.totalRevenue) * 100)}%`
                                                        : '0%'}
                                                </div>
                                                <div className="text-sm text-gray-600">MTN MoMo</div>
                                            </div>
                                            <div className="text-center p-4 bg-orange-50 rounded-lg">
                                                <div className="text-2xl font-bold text-orange-600">
                                                    {dashboardStats?.totalRevenue
                                                        ? `${Math.round((dashboardStats.orangeRevenue / dashboardStats.totalRevenue) * 100)}%`
                                                        : '0%'}
                                                </div>
                                                <div className="text-sm text-gray-600">Orange Money</div>
                                            </div>
                                        </div>
                                    )}
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
                                {vehiclesLoading ? (
                                    <div className="flex justify-center items-center h-48">
                                        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                                        <span className="ml-2 text-gray-600">Chargement des données véhicules...</span>
                                    </div>
                                ) : vehiclesError ? (
                                    <div className="text-center text-red-500 py-8">{vehiclesError}</div>
                                ) : allVehicles.length === 0 ? (
                                    <div className="text-center text-gray-500 py-8">Aucune donnée de véhicule trouvée.</div>
                                ) : (
                                    <div className="space-y-4">
                                        {allVehicles
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
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}