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
import { getAllUsers, UserData } from "@/app/api/login/auth" // Assurez-vous que ce chemin est correct
import toast from "react-hot-toast"
import { getBooking } from "@/app/api/bookings/book"
import { Booking } from "../bookings/page"
// REMARQUE IMPORTANTE : Le "Mock data pour les clients" doit être supprimé ou commenté
// si vous ne l'utilisez plus pour éviter les conflits et vous baser uniquement sur l'API.
// Par exemple:
// const mockCustomers = [...]
// Vous pouvez le garder pour le développement initial, mais il devra être retiré.


export default function CustomersPage() {
  // L'état 'users' contiendra les données brutes de l'API
  const [users, setUsers] = useState<UserData[]>([]);
  // L'état 'filteredCustomers' sera la liste affichée, basée sur 'users' après filtrage
  const [filteredCustomers, setFilteredCustomers] = useState<UserData[]>([]);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all"); // Attention: le type client n'est pas directement dans UserData
  const [selectedCustomer, setSelectedCustomer] = useState<UserData | null>(null); // Type le client sélectionné

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [customerReservations, setCustomerReservations] = useState<Booking[]>([]);
  // État pour gérer l'état de chargement des réservations
  const [isLoadingReservations, setIsLoadingReservations] = useState(false);
  // État pour gérer les erreurs lors de la récupération des réservations
  const [reservationError, setReservationError] = useState<string | null>(null);


  useEffect(() => {
    const fetchCustomerReservations = async () => {
      // Vérifier si le dialogue est ouvert ET qu'un client est sélectionné ET qu'il a un email
      if (isViewDialogOpen && selectedCustomer?.email) {
        setIsLoadingReservations(true); // Démarre le chargement
        setReservationError(null);     // Réinitialise les erreurs précédentes
        try {
          // Appel à la fonction getBooking avec l'email du client sélectionné
          // (et optionnellement une limite, par exemple les 10 dernières réservations)
          const data: Booking[] = await getBooking(selectedCustomer.email, 10); 
          setCustomerReservations(data); // Met à jour l'état avec les réservations récupérées
        } catch (error: any) {
          console.error("Failed to fetch customer reservations:", error);
          setReservationError(error.error || "Impossible de charger les réservations.");
        } finally {
          setIsLoadingReservations(false); // Termine le chargement, qu'il y ait eu succès ou échec
        }
      } else if (!isViewDialogOpen) {
        // Réinitialiser les réservations et les erreurs lorsque le dialogue se ferme
        setCustomerReservations([]);
        setReservationError(null);
      }
    };

    fetchCustomerReservations(); // Appelle la fonction de récupération
  }, [isViewDialogOpen, selectedCustomer?.email]); // Dépendances du useEffect:
  // Le hook se re-déclenchera si le dialogue s'ouvre/se ferme ou si l'email du client change.

  // 1. **FETCH DES UTILISATEURS LORSQUE LE COMPOSANT MONTE**
  useEffect(() => {
    const fetchUsersData = async () => { // Renommé pour éviter la confusion avec le hook useState
      setLoading(true);
      setError(null);
      try {
        const fetchedUsers = await getAllUsers();
        setUsers(fetchedUsers); // Met à jour l'état 'users' avec les données de l'API
        // Initialise filteredCustomers avec toutes les données au premier chargement
        setFilteredCustomers(fetchedUsers);
      } catch (err: any) {
        console.error("Erreur lors de la récupération des utilisateurs:", err);
        setError(err.message || "Impossible de charger les utilisateurs.");
        toast.error(err.message || "Échec du chargement des utilisateurs.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsersData();
  }, []); // Exécute une seule fois au montage du composant

  // 2. **LOGIQUE DE FILTRAGE DES UTILISATEURS**
  // Ce useEffect s'exécutera à chaque fois que searchTerm, statusFilter, typeFilter ou 'users' (la liste brute) changent.
  useEffect(() => {
    let currentFilteredUsers = users; // Commence avec la liste complète des utilisateurs de l'API

    if (searchTerm) {
      const lowercasedSearchTerm = searchTerm.toLowerCase();
      currentFilteredUsers = currentFilteredUsers.filter(
        (user) =>
          user.email.toLowerCase().includes(lowercasedSearchTerm) ||
          // Utilisez 'username' ou 'name' selon ce qui est le plus pertinent pour la recherche de nom
          (user.username && user.username.toLowerCase().includes(lowercasedSearchTerm)) || 
          (user.name && user.name.toLowerCase().includes(lowercasedSearchTerm)) || 
          (user.phone_number && user.phone_number.includes(lowercasedSearchTerm)), // Utilisez phone_number
      );
    }

    // Gestion du filtre de statut (is_active, is_email_verified, is_superuser)
    // Les statuts "Actif", "VIP", "Inactif", "Suspendu" de votre mock data
    // n'ont pas de correspondance directe avec UserData.
    // Vous devez décider comment mapper ces statuts à is_active, is_email_verified, etc.
    // Par exemple, "Actif" pourrait signifier is_active && is_email_verified
    // "VIP" pourrait être un champ is_vip sur votre modèle User, ou basé sur totalBookings/totalSpent
    // Pour l'instant, je vais adapter 'Actif' et 'Inactif' à 'is_active'.
    // Les autres nécessiteraient une logique métier supplémentaire sur le backend ou le frontend.
    if (statusFilter !== "all") {
      currentFilteredUsers = currentFilteredUsers.filter((user) => {
        if (statusFilter === "Actif") {
          return user.is_active && user.is_email_verified; // Considéré actif si compte actif et email vérifié
        }
        if (statusFilter === "Inactif") {
          return !user.is_active; // Considéré inactif si le compte n'est pas actif
        }
        // Pour "VIP", "Suspendu", vous devrez définir une logique basée sur vos données UserData.
        // Si ces statuts existent sur votre modèle Django, ajoutez-les à UserData.
        // Par exemple: if (statusFilter === "VIP") return user.is_vip;
        return true; // Retourne tous les clients si le statut n'est pas mappé
      });
    }

    // Gestion du filtre de type (Particulier, Entreprise, etc.)
    // UserData n'a pas de propriété 'customerType'.
    // Vous devez ajouter ce champ à votre modèle User Django et à UserSerializer
    // si vous voulez filtrer dessus. Pour l'instant, ce filtre ne fera rien d'utile.
    if (typeFilter !== "all") {
        // currentFilteredUsers = currentFilteredUsers.filter((user) => user.customerType === typeFilter);
        // Cette ligne est commentée car 'customerType' n'existe pas dans UserData.
        // Vous devrez implémenter une logique de type de client si votre backend la supporte.
    }

    setFilteredCustomers(currentFilteredUsers);
  }, [searchTerm, statusFilter, typeFilter, users]); // Dépend de 'users' maintenant

  // Adapter les badges de statut pour utiliser les propriétés de UserData
  const getStatusBadge = (user: UserData) => {
    if (!user.is_email_verified) {
      return <Badge className="bg-red-100 text-red-800">Non Vérifié</Badge>;
    }
    if (!user.is_active) {
      return <Badge className="bg-gray-100 text-gray-800">Inactif</Badge>;
    }
    if (user.is_superuser) { // Exemple de "VIP" pour les administrateurs
      return <Badge className="bg-purple-100 text-purple-800">Admin</Badge>;
    }
    // Si vous avez un champ 'is_suspended' ou une logique de suspension dans UserData
    // if (user.is_suspended) { return <Badge className="bg-red-100 text-red-800">Suspendu</Badge>; }

    return <Badge className="bg-green-100 text-green-800">Actif</Badge>; // Statut par défaut
  };

  // Le type de client n'est pas dans UserData, cette fonction est donc désactivée pour l'instant.
  // Vous devrez ajouter 'customerType' à votre modèle User et à UserData si vous voulez l'utiliser.
  const getCustomerTypeBadge = (type: string) => {
    // Exemple : si vous aviez un champ 'type' dans UserData
    // switch (type) {
    //   case "Particulier": return <Badge variant="outline">Particulier</Badge>;
    //   case "Entreprise": return <Badge className="bg-blue-100 text-blue-800">Entreprise</Badge>;
    //   default: return <Badge variant="outline">{type}</Badge>;
    // }
    return <Badge variant="outline">N/A</Badge>; // Retourne N/A si le type n'est pas géré
  };

  const handleViewCustomer = (customer: UserData) => { // Type correctement 'customer'
    setSelectedCustomer(customer);
    setIsViewDialogOpen(true);
  };

  const handleExportCSV = () => {
    const csvData = filteredCustomers.map((user) => ({
      ID: user.id,
      Nom: user.name || user.username, // Utilise 'name' si disponible, sinon 'username'
      Email: user.email,
      Téléphone: user.phone_number || '', // Utilisez 'phone_number'
      // Adresse et Ville ne sont pas dans UserData par défaut. Vous devez les ajouter à votre UserSerializer
      // et à l'interface UserData si vous voulez les exporter.
      // Adresse: user.address,
      // Ville: user.city,
      "Date inscription": new Date(user.date_joined).toLocaleDateString("fr-FR"), // Utilisez date_joined
      // Ces champs (totalBookings, totalSpent, lastBooking, rating, preferredVehicles, paymentMethods, notes)
      // ne sont PAS dans UserData par défaut. Vous devrez les obtenir via une autre API ou les ajouter
      // à votre modèle User si vous voulez les afficher/exporter.
      "Nombre réservations": 'N/A', // Donnée non présente dans UserData
      "Total dépensé (FCFA)": 'N/A', // Donnée non présente dans UserData
      "Dernière réservation": 'N/A', // Donnée non présente dans UserData
      Statut: user.is_active && user.is_email_verified ? 'Actif' : 'Inactif/Non Vérifié', // Logique simplifiée
      "Type client": 'N/A', // Donnée non présente dans UserData
      Note: 'N/A', // Donnée non présente dans UserData
      "Véhicules préférés": 'N/A', // Donnée non présente dans UserData
      "Moyens paiement": 'N/A', // Donnée non présente dans UserData
      Notes: 'N/A', // Donnée non présente dans UserData
    }));

    exportToCSV(csvData, `clients_${new Date().toISOString().split("T")[0]}`);
  };

  // --- RENDU DU COMPOSANT ---
  if (loading) {
    return <div className="p-4 text-center">Chargement des clients...</div>;
  }

  if (error) {
    return <div className="p-4 text-center text-red-500">Erreur: {error}</div>;
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
                {/* Utilisez la longueur de 'users' qui contient tous les clients chargés */}
                <p className="text-2xl font-bold">{users.length}</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Clients Admin</p>
                {/* Adaptez pour compter les super-utilisateurs/administrateurs */}
                <p className="text-2xl font-bold">{users.filter((u) => u.is_superuser).length}</p>
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
                {/* Ces données (totalSpent) ne sont pas dans UserData. Elles proviendraient de Payment/Reservation. */}
                {/* Pour l'instant, affichez un placeholder ou récupérez-les via une autre API. */}
                <p className="text-2xl font-bold">N/A FCFA</p>
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
                {/* Nécessite une logique pour filtrer les utilisateurs par date d'inscription ce mois-ci */}
                <p className="text-2xl font-bold">N/A</p>
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
            {/* Le filtre de statut est basé sur la logique 'is_active', 'is_email_verified' */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filtrer par statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="Actif">Actif (Vérifié & Actif)</SelectItem>
                <SelectItem value="Inactif">Inactif (Désactivé)</SelectItem>
                <SelectItem value="Non Vérifié">Email Non Vérifié</SelectItem> {/* Ajouté pour un meilleur filtrage */}
                <SelectItem value="Admin">Administrateur</SelectItem> {/* Ajouté pour un meilleur filtrage */}
                {/* Pour "VIP" ou "Suspendu", vous auriez besoin de champs spécifiques dans UserData */}
              </SelectContent>
            </Select>
            {/* Le filtre de type est commenté car 'customerType' n'est pas dans UserData */}
            {/* Si vous ajoutez 'customerType' à UserData, décommentez et adaptez cette section */}
            {/* <Select value={typeFilter} onValueChange={setTypeFilter}>
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
            </Select> */}
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
                <TableHead>Statut</TableHead> {/* Renommé pour être plus générique */}
                <TableHead>Infos Complémentaires</TableHead> {/* Renommé pour regrouper des infos */}
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCustomers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4">
                    Aucun client trouvé avec les critères de recherche ou de filtre.
                  </TableCell>
                </TableRow>
              ) : (
                filteredCustomers.map((user) => ( // Itération sur les 'users' filtrés
                  <TableRow key={user.id}>
                    <TableCell>
                      <div>
                        {/* Utilisez 'name' ou 'username' selon ce que vous préférez afficher comme nom principal */}
                        <div className="font-medium">{user.name || user.username}</div>
                        {/* L'adresse et la ville ne sont pas dans UserData, les afficher nécessiterait d'ajouter ces champs */}
                        {/* <div className="text-sm text-gray-500 flex items-center">
                          <MapPin className="h-3 w-3 mr-1" />
                          {user.city}
                        </div> */}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center text-sm">
                          <Mail className="h-3 w-3 mr-1 text-gray-400" />
                          {user.email}
                        </div>
                        <div className="flex items-center text-sm">
                          <Phone className="h-3 w-3 mr-1 text-gray-400" />
                          {user.phone_number || 'N/A'} {/* Utilisez phone_number */}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(user)}</TableCell> {/* Passe l'objet user entier */}
                    <TableCell>
                      <div className="text-sm">
                         {/* Ces champs ne sont pas dans UserData par défaut */}
                        <div>Email vérifié : {user.is_email_verified ? 'Oui' : 'Non'}</div>
                        <div>Compte actif : {user.is_active ? 'Oui' : 'Non'}</div>
                        <div>Admin : {user.is_superuser ? 'Oui' : 'Non'}</div>
                        <div className="text-gray-500">
                          Membre depuis {new Date(user.date_joined).toLocaleDateString("fr-FR")}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" onClick={() => handleViewCustomer(user)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Dialog de détails du client */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
      {/* Correction ici: Appliquer max-h-screen et overflow-y-auto à DialogContent */}
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto"> 
        <DialogHeader>
          <DialogTitle>Profil client - {selectedCustomer?.name || selectedCustomer?.username}</DialogTitle>
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
                    {selectedCustomer.phone_number || 'N/A'}
                  </div>
                  <div className="flex items-center text-sm">
                    <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                    Membre depuis {new Date(selectedCustomer.date_joined).toLocaleDateString("fr-FR")}
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
                    <span className="font-medium">{customerReservations.length || 0}</span>
                  </div>
                  {/* Calcul du total dépensé à partir des réservations chargées */}
                  <div className="flex justify-between text-sm">
                    <span>Total dépensé:</span>
                    <span className="font-medium">
                      {/* Correction ici : Assurez-vous que estimated_total_price est un nombre */}
                      {customerReservations.reduce((sum, res) => sum + (parseFloat(String(res.estimated_total_price)) || 0), 0).toFixed(2)} FCFA
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Note moyenne:</span>
                    <div className="flex items-center">
                      <Star className="h-3 w-3 mr-1 text-yellow-400" />
                      <span className="font-medium">N/A /5</span> {/* Nécessite une logique de notation */}
                    </div>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Dernière réservation:</span>
                    <span className="font-medium">
                      {customerReservations.length > 0
                        ? new Date(customerReservations[0].created_at).toLocaleDateString("fr-FR")
                        : 'N/A'}
                    </span>
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
                      <Badge variant="outline" className="text-xs">N/A</Badge> {/* Ces données doivent venir du backend */}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium mb-1">Moyens de paiement:</div>
                    <div className="flex flex-wrap gap-1">
                      <Badge variant="outline" className="text-xs">N/A</Badge> {/* Ces données doivent venir du backend */}
                    </div>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Type:</span>
                    {getCustomerTypeBadge(selectedCustomer.is_customer ? 'Customer' : 'Other')}
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Statut:</span>
                    {getStatusBadge(selectedCustomer)}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* La carte des notes n'est affichée que si selectedCustomer existe */}
            {selectedCustomer && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Notes</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">Aucune note</p> {/* Si 'notes' est un champ dans UserData, affichez-le ici */}
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Historique des réservations</CardTitle>
              </CardHeader>
              {/* Le max-h-[400px] est retiré d'ici car le défilement est géré par le DialogContent parent */}
              <CardContent className="overflow-y-auto"> 
                {isLoadingReservations ? (
                  <div className="text-center text-gray-500 py-4">Chargement des réservations...</div>
                ) : reservationError ? (
                  <div className="text-center text-red-500 py-4">{reservationError}</div>
                ) : (
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
                      {customerReservations.length > 0 ? (
                        // Trie les réservations par date de création décroissante pour afficher la plus récente en premier
                        customerReservations
                          .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                          .map((booking) => ( // Renommé 'reservation' en 'booking' pour correspondre à BookingData
                            <TableRow key={booking.id}>
                              <TableCell>
                                {new Date(booking.start_date).toLocaleDateString("fr-FR")} -{" "}
                                {new Date(booking.end_date).toLocaleDateString("fr-FR")}
                              </TableCell>
                              <TableCell>{booking.car_name || 'N/A'}</TableCell> {/* Utilise car_name */}
                              <TableCell>
                                {/* Correction ici : Assurez-vous que estimated_total_price est un nombre avant toFixed */}
                                {booking.estimated_total_price !== null && booking.estimated_total_price !== undefined
                                  ? `${parseFloat(String(booking.estimated_total_price)).toFixed(2)} FCFA`
                                  : 'N/A'}
                              </TableCell> {/* Utilise estimated_total_price */}
                              <TableCell>{booking.status}</TableCell>
                            </TableRow>
                          ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center text-gray-500">
                            Aucun historique de réservation disponible pour l'instant.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                )}
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
    </Dialog>    </div>
  );
}