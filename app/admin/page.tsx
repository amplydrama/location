"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getBooking,getMostReservedCars } from "../api/bookings/book" // Adjust path if necessary
import { getDashboardStats } from "../api/login/auth" // Assuming you've put getDashboardStats here, adjust path
import { Car, Users, CreditCard, Download, Calendar, Loader2 } from "lucide-react"
import { logoutUser } from "../api/login/auth"
import toast from "react-hot-toast"
import { useRouter } from "next/navigation"
// --- Interfaces pour les réponses API ---
interface DashboardStats {
  totalBookings: number;
  totalRevenue: number;
  mtnRevenue: number;
  orangeRevenue: number;
  totalVehicles: number;
  availableVehicles: number;
  totalCustomers: number;
}

interface Booking {
  id: number;
  car_name: string; // Changed from 'vehicle' to 'car_name'
  start_date: string;
  end_date: string;
  email: string;
  created_at: string; // ISO 8601 string for datetime
  estimated_total_price: string; // Keep as string for now, or parse to number if always numeric
  is_paid: boolean;
  name: string; // This corresponds to your 'customer'
  phone: string;
  id_card: string;
  address: string;
  with_driver: boolean;
  town: string;
  status: string;
  token: string;
  user: number | null; // Assuming 'user' is a user ID (number) or null
  car: number; // Assuming 'car' is a car ID (number)
  // 'amount' and 'payment_method' were in your old interface but not in the new data.
  // If they are present in other contexts (e.g., when fetched specifically for payments),
  // you might need a separate interface or make them optional here.
  // For now, I've removed them to exactly match the provided example.
  user_renter: string;
}
interface Vehicle {
  id: number;
  model: string; // Correspond à 'model' dans la réponse
  year: number;
  price_WDT: string; // Prix avec chauffeur/tournée
  price_WDO: string; // Prix avec chauffeur/unidirectionnel
  price_WODT: string; // Prix sans chauffeur/tournée
  price_WODO: string; // Prix sans chauffeur/unidirectionnel
  description: string;
  image: string; // URL de l'image
  slug: string;
  created_at: string; // Date de création (ISO string)
  updated_at: string; // Date de mise à jour (ISO string)
  location: string;
  immatriculation: string;
  fuel_type: string;
  seats: number;
  transmission: string;
  color: string;
  brand: string;
  features: string[]; // Tableau de chaînes de caractères
  get_absolute_url: string; // URL absolue de la voiture
  type: string; // 'type' du véhicule (ex: 'Luxe', 'Économique')
  
  // Les champs suivants sont potentiellement ajoutés par annotation ou calculés côté client
  // Ils ne sont pas directement dans l'objet de réponse que vous avez fourni.
  // Si vous les obtenez via l'endpoint most_reserved_cars, ils seront présents.
  bookings_count?: number; // Optionnel, car ajouté par annotation dans most_reserved_cars
  status?: string; // Optionnel, si le statut est géré ailleurs ou non inclus dans cette réponse
}

export default function AdminDashboard() {
  // --- State for fetched data ---
  const [adminSession, setAdminSession] = useState<string | undefined>(undefined);
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
  const [recentBookings, setRecentBookings] = useState<Booking[]>([]);
  const [allVehicles, setAllVehicles] = useState<Vehicle[]>([]);

  // --- Loading states ---
  const [statsLoading, setStatsLoading] = useState(true);
  const [bookingsLoading, setBookingsLoading] = useState(true);
  const [vehiclesLoading, setVehiclesLoading] = useState(true);

  // --- Error states ---
  const [statsError, setStatsError] = useState<string | null>(null);
  const [bookingsError, setBookingsError] = useState<string | null>(null);
  const [vehiclesError, setVehiclesError] = useState<string | null>(null);

  // --- Active tab state ---
  const [activeTab, setActiveTab] = useState("dashboard");

  // Fetch dashboard statistics
  useEffect(() => {
    const fetchStats = async () => {
      setStatsLoading(true);
      setStatsError(null);
      try {
        const data = await getDashboardStats(); // Using the imported function
        setDashboardStats(data);
      } catch (error: any) {
        console.error("Failed to fetch dashboard stats:", error);
        setStatsError("Échec du chargement des statistiques du tableau de bord. Vérifiez votre connexion ou les permissions.");
      } finally {
        setStatsLoading(false);
      }
    };
    fetchStats();
  }, []); // Empty dependency array, as stats are generally static for initial load

  // Fetch recent bookings (using the getBooking function with a limit)
  useEffect(() => {
    const fetchRecentBookings = async () => {
      setBookingsLoading(true);
      setBookingsError(null);
      try {
        const data = await getBooking("",3); // Fetch only 3 recent bookings
        setRecentBookings(data);
      } catch (error: any) {
        console.error("Failed to fetch recent bookings:", error);
        setBookingsError("Échec du chargement des réservations récentes.");
      } finally {
        setBookingsLoading(false);
      }
    };
    fetchRecentBookings();
  }, []); // Empty dependency array, as recent bookings should load on mount

  // Fetch all vehicles
  useEffect(() => {
    const fetchAllVehicles = async () => {
      setVehiclesLoading(true);
      setVehiclesError(null);
      try {
        const data = await getMostReservedCars(); // Using the imported function
        setAllVehicles(data);
      } catch (error: any) {
        console.error("Failed to fetch all vehicles for reports:", error);
        setVehiclesError("Échec du chargement des véhicules pour les rapports.");
      } finally {
        setVehiclesLoading(false);
      }
    };
    fetchAllVehicles();
  }, []); // Empty dependency array, vehicles data load on mount

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return <Badge className="bg-green-100 text-green-800">Confirmée</Badge>
      case "pending":
        return <Badge className="bg-blue-100 text-blue-800">En attente</Badge>
      case "completed":
        return <Badge className="bg-gray-100 text-gray-800">Terminée</Badge>
      case "cancelled":
        return <Badge className="bg-red-100 text-red-800">Annulée</Badge>
      case "available":
        return <Badge className="bg-green-100 text-green-800">Disponible</Badge>
      case "rented":
        return <Badge className="bg-orange-100 text-orange-800">Loué</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }
  const router = useRouter();
const handleLogout = () => {
  const confirmLogout = window.confirm("Es-tu sûr de vouloir te déconnecter ?");

  if (confirmLogout) {
    // Le bloc try-catch englobe l'appel asynchrone à logoutUser()
    // et la gestion de ses promesses.
    try {
      logoutUser()
        .then(() => {
          console.log("Logout successful from component.");
          toast.success("Déconnexion réussie ! À bientôt.", {
            duration: 3000,
            position: "top-right",
          });
          router.push('/login'); // Redirige l'utilisateur après succès
        })
        .catch((error) => {
          // Ce .catch capture les rejets de la promesse retournée par logoutUser()
          console.error("Logout failed from component (via .catch):", error);
          const errorMessage = error.error || "Une erreur est survenue lors de la déconnexion.";
          toast.error(`Erreur : ${errorMessage}`, {
            duration: 5000,
            position: "top-right",
          });
          router.push('/login'); // Redirige même en cas d'erreur de la promesse
        });
    } catch (syncError: any) {
      // Ce bloc catch capture les erreurs SYNCHRONES qui pourraient survenir
      // AVANT que la promesse ne soit rejetée ou résolue (par exemple, si logoutUser n'était pas une fonction)
      console.error("Synchronous error in handleLogout:", syncError);
      toast.error(`Une erreur inattendue est survenue : ${syncError.message || 'Vérifiez la console.'}`, {
        duration: 7000,
        position: "top-center", // Peut-être une position différente pour les erreurs synchrones graves
      });
      router.push('/login'); // Redirige en cas d'erreur synchrone grave
    }
  }
};

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
              <Button variant="outline" onClick={handleLogout}>Déconnexion</Button>
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
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="dashboard">Tableau de bord</TabsTrigger>
            <TabsTrigger value="reports">Rapports</TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            {statsLoading ? (
              <div className="flex flex-col justify-center items-center h-48 bg-white rounded-lg shadow-sm">
                <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                <span className="ml-2 text-gray-600 mt-2">Chargement des statistiques...</span>
              </div>
            ) : statsError ? (
              <div className="text-center text-red-600 bg-red-50 p-4 rounded-lg border border-red-200">
                <p>{statsError}</p>
                <p className="text-sm text-red-500 mt-1">Veuillez réessayer plus tard.</p>
              </div>
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
                      <div className="text-2xl font-bold">{dashboardStats?.totalRevenue?.toLocaleString('fr-CM', { style: 'currency', currency: 'XAF' }) || '0 FCFA'}</div>
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
                        <span className="font-semibold">{dashboardStats?.mtnRevenue?.toLocaleString('fr-CM', { style: 'currency', currency: 'XAF' }) || '0 FCFA'}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 bg-orange-500 rounded"></div>
                          <span>Orange Money</span>
                        </div>
                        <span className="font-semibold">{dashboardStats?.orangeRevenue?.toLocaleString('fr-CM', { style: 'currency', currency: 'XAF' }) || '0 FCFA'}</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Réservations récentes</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {bookingsLoading ? (
                        <div className="flex flex-col justify-center items-center h-24 bg-white rounded-lg shadow-sm">
                          <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
                          <span className="ml-2 text-gray-600 mt-2">Chargement des réservations...</span>
                        </div>
                      ) : bookingsError ? (
                        <div className="text-center text-red-600 bg-red-50 p-4 rounded-lg border border-red-200">
                          <p>{bookingsError}</p>
                          <p className="text-sm text-red-500 mt-1">Veuillez réessayer plus tard.</p>
                        </div>
                      ) : recentBookings.length === 0 ? (
                        <div className="text-center text-gray-500 bg-gray-50 p-4 rounded-lg border border-gray-200">
                          <p>Aucune réservation récente trouvée.</p>
                          <p className="text-sm mt-1">Les dernières réservations apparaîtront ici.</p>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {recentBookings.map((booking) => (
                            <div key={booking.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                              <div>
                                <p className="font-medium">{booking.user_renter}</p>
                                <p className="text-sm text-gray-600">{booking.car_name}</p>
                              </div>
                              <div className="text-right">
                                <p className="font-semibold">{booking.estimated_total_price.toLocaleString()}</p>
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
                    <div className="flex flex-col justify-center items-center h-24 bg-white rounded-lg shadow-sm">
                      <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
                      <span className="ml-2 text-gray-600 mt-2">Chargement des données de paiement...</span>
                    </div>
                  ) : statsError ? (
                    <div className="text-center text-red-600 bg-red-50 p-4 rounded-lg border border-red-200">
                      <p>{statsError}</p>
                      <p className="text-sm text-red-500 mt-1">Veuillez réessayer plus tard.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-yellow-50 rounded-lg">
                        <div className="text-2xl font-bold text-yellow-600">
                          {dashboardStats && dashboardStats.totalRevenue !== null && dashboardStats.totalRevenue > 0
                            ? `${Math.round((dashboardStats.mtnRevenue / dashboardStats.totalRevenue) * 100)}%`
                            : '0%'}
                        </div>
                        <div className="text-sm text-gray-600">MTN MoMo</div>
                      </div>
                      <div className="text-center p-4 bg-orange-50 rounded-lg">
                        <div className="text-2xl font-bold text-orange-600">
                          {dashboardStats && dashboardStats.totalRevenue !== null && dashboardStats.totalRevenue > 0
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
                      <div className="flex flex-col justify-center items-center h-48 bg-white rounded-lg shadow-sm">
                          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                          <span className="ml-2 text-gray-600 mt-2">Chargement des données véhicules...</span>
                      </div>
                  ) : vehiclesError ? (
                      <div className="text-center text-red-600 bg-red-50 p-4 rounded-lg border border-red-200">
                          <p>{vehiclesError}</p>
                          <p className="text-sm text-red-500 mt-1">Veuillez réessayer plus tard.</p>
                      </div>
                  ) : allVehicles.length === 0 ? (
                      <div className="text-center text-gray-500 bg-gray-50 p-4 rounded-lg border border-gray-200">
                          <p>Aucun véhicule trouvé.</p>
                          <p className="text-sm mt-1">Les données sur les véhicules apparaîtront ici une fois disponibles.</p>
                      </div>
                  ) : (
                      <div className="space-y-4">
                          {allVehicles
                              // Sort by bookings_count, which is now an optional field.
                              // It will only be present if this list is populated from the 'most_reserved_cars' endpoint.
                              // If populated from a general 'getVehicles' endpoint, bookings_count might be undefined or 0.
                              // Adjust sorting logic if 'allVehicles' comes from a different API that doesn't include bookings_count.
                              .sort((a, b) => (b.bookings_count || 0) - (a.bookings_count || 0))
                              .map((vehicle, index) => (
                                  <div key={vehicle.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                      <div className="flex items-center space-x-3">
                                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-bold text-blue-600">
                                              {index + 1}
                                          </div>
                                          <div>
                                              {/* Use brand and model for the vehicle name */}
                                              <p className="font-medium">{vehicle.brand} - {vehicle.model}</p>
                                              <p className="text-sm text-gray-600">
                                                  {vehicle.type} - {vehicle.location}
                                              </p>
                                          </div>
                                      </div>
                                      <div className="text-right">
                                          {/* Display bookings_count if available, otherwise "N/A" */}
                                          <p className="font-semibold">{vehicle.bookings_count !== undefined ? `${vehicle.bookings_count} réservations` : 'N/A'}</p>
                                          {/* Display price_WDT. Ensure to parse it to a number if you need currency formatting */}
                                          <p className="text-sm text-gray-600">
                                              {
                                                  parseFloat(vehicle.price_WDT).toLocaleString('fr-CM', { style: 'currency', currency: 'XAF' })
                                              }/jour
                                          </p>
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