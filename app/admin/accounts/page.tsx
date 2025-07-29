"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch" // Keep if you want to toggle active status
import { Badge } from "@/components/ui/badge"
import { Car, Plus, Edit, Trash2, Eye, EyeOff,ShieldAlert  } from "lucide-react"
import Link from "next/link"
import { UserData,getAllUsers } from "@/app/api/login/auth" // Make sure getAllUsers is imported
import toast from "react-hot-toast" // For toasts
import axios from "axios" // Import axios for isAxiosError and direct calls
import { logoutUser } from "@/app/api/login/auth" // Import your logout function
import { useRouter } from "next/navigation"

// Assume you have an axios instance for authenticated requests,
// or use the default export from your axios config
import axiosInstance from "@/utils/axios" // Your configured axios instance

export default function AdminAccountsPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [isAddAdminOpen, setIsAddAdminOpen] = useState(false)
  const [isEditAdminOpen, setIsEditAdminOpen] = useState(false)
  const [selectedAdmin, setSelectedAdmin] = useState<UserData | null>(null)
  const [newAdmin, setNewAdmin] = useState({
    username: "",
    name: "",
    email: "",
    phone_number: "",
    password: "",
    confirmPassword: "",
  })
  const [superusers, setSuperusers] = useState<UserData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchSuperusers();
  }, [])

  const fetchSuperusers = async () => {
    setLoading(true);
    setError(null);
    try {
      // MODIFICATION ICI : Passe true à getAllUsers pour obtenir directement les super-utilisateurs
      const data = await getAllUsers(true); // Assuming getAllUsers(true) returns only superusers
      setSuperusers(data);
    } catch (err: any) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.detail || "Failed to fetch superusers.");
        toast.error(err.response?.data?.detail || "Échec du chargement des super-utilisateurs.");
      } else {
        setError("An unexpected error occurred.");
        toast.error("Une erreur inattendue est survenue.");
      }
      console.error("Error fetching superusers:", err);
    } finally {
      setLoading(false);
    }
  }

  const router = useRouter()
  const handleLogout = () => {
    
      const confirmLogout = window.confirm("Es-tu sûr de vouloir te déconnecter ?");
  
      if (confirmLogout) {
          logoutUser()
              .then(() => {
                  console.log("Logout successful from component.");
                  // --- Toast de succès (react-hot-toast) ---
                  toast.success("Déconnexion réussie ! À bientôt.", {
                      duration: 3000,    // Durée en millisecondes (3 secondes)
                      position: "top-right", // Position du toast
                      // Tu peux ajouter d'autres options ici comme icon, style, className, etc.
                  });
                  // --- Fin Toast de succès ---
  
                  router.push('/login'); // Redirige l'utilisateur
              })
              .catch((error) => {
                  console.error("Logout failed from component:", error);
                  // --- Toast d'erreur (react-hot-toast) ---
                  const errorMessage = error.error || "Une erreur est survenue lors de la déconnexion.";
                  toast.error(`Erreur : ${errorMessage}`, {
                      duration: 5000,    // Durée en millisecondes (5 secondes pour les erreurs)
                      position: "top-right",
                  });
                  // --- Fin Toast d'erreur ---
                  
                  // Toujours rediriger même en cas d'erreur pour vider le state local
                  router.push('/login'); 
              });
      }
  };
  

  const handleAddAdmin = async () => {
    // Validation
    if (
      !newAdmin.username ||
      !newAdmin.name ||
      !newAdmin.email ||
      !newAdmin.phone_number ||
      !newAdmin.password ||
      !newAdmin.confirmPassword
    ) {
      toast.error("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    if (newAdmin.password !== newAdmin.confirmPassword) {
      toast.error("Les mots de passe ne correspondent pas.");
      return;
    }

    try {
      const response = await axiosInstance.post('/cars/register/', {
        username: newAdmin.username,
        name: newAdmin.name,
        email: newAdmin.email,
        phone_number: newAdmin.phone_number,
        password: newAdmin.password,
        is_superuser: true,
        is_staff: true,
        is_active: true, // New admins are typically active by default
        is_email_verified: true, // Assuming admins created here are verified
      });
      console.log("New superuser added:", response.data);
      toast.success("Administrateur ajouté avec succès !");
      setIsAddAdminOpen(false);
      resetForm();
      fetchSuperusers(); // Refresh the list
    } catch (err: any) {
      if (axios.isAxiosError(err)) {
        console.error("Error adding superuser:", err.response?.data);
        const errorMessage = err.response?.data?.detail || err.response?.data?.email?.[0] || "Échec de l'ajout de l'administrateur.";
        toast.error(errorMessage);
      } else {
        console.error("Unexpected error adding superuser:", err);
        toast.error("Une erreur inattendue est survenue lors de l'ajout.");
      }
    }
  }

  const handleEditAdmin = async () => {
    if (!selectedAdmin) {
      toast.error("Aucun administrateur sélectionné pour la modification.");
      return;
    }

    try {
      const updatePayload: Partial<UserData> = {
        username: selectedAdmin.username,
        name: selectedAdmin.name,
        email: selectedAdmin.email,
        phone_number: selectedAdmin.phone_number,
        is_active: selectedAdmin.is_active,
      };

      const response = await axiosInstance.put(`/cars/users/${selectedAdmin.id}/`, updatePayload);
      console.log("Admin updated:", response.data);
      toast.success("Administrateur modifié avec succès !");
      setIsEditAdminOpen(false);
      fetchSuperusers();
    } catch (err: any) {
      if (axios.isAxiosError(err)) {
        console.error("Error editing admin:", err.response?.data);
        const errorMessage = err.response?.data?.detail || err.response?.data?.email?.[0] || "Échec de la modification de l'administrateur.";
        toast.error(errorMessage);
      } else {
        console.error("Unexpected error editing admin:", err);
        toast.error("Une erreur inattendue est survenue lors de la modification.");
      }
    }
  }

  const handleDeleteAdmin = async (adminId: number) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cet administrateur ? Cette action est irréversible.")) {
      try {
        await axiosInstance.delete(`/user/users/${adminId}/`);
        console.log("Admin deleted:", adminId);
        toast.success("Administrateur supprimé avec succès !");
        fetchSuperusers();
      } catch (err: any) {
        if (axios.isAxiosError(err)) {
          console.error("Error deleting admin:", err.response?.data);
          const errorMessage = err.response?.data?.detail || "Échec de la suppression de l'administrateur.";
          toast.error(errorMessage);
        } else {
          console.error("Unexpected error deleting admin:", err);
          toast.error("Une erreur inattendue est survenue lors de la suppression.");
        }
      }
    }
  }

  const openEditDialog = (admin: UserData) => {
    setSelectedAdmin(admin);
    setIsEditAdminOpen(true);
  }

  const resetForm = () => {
    setNewAdmin({
      username: "",
      name: "",
      email: "",
      phone_number: "",
      password: "",
      confirmPassword: "",
    });
  }

  const getStatusBadge = (isActive: boolean) => {
    return isActive ? (
      <Badge className="bg-green-100 text-green-800">Actif</Badge>
    ) : (
      <Badge className="bg-red-100 text-red-800">Inactif</Badge>
    )
  }

  const getRoleIcon = () => {
    return <ShieldAlert className="h-5 w-5 text-purple-600" />;
  }

  const getRoleBadge = () => {
    return <Badge className="bg-purple-100 text-purple-800">Super Admin</Badge>;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-xl text-gray-700">Chargement des administrateurs...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <p className="text-xl text-red-600 mb-4">Erreur: {error}</p>
        <Button onClick={fetchSuperusers}>Réessayer</Button>
      </div>
    );
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
              <Link href="/admin">
                <Button variant="outline">Tableau de bord</Button>
              </Link>
              <Button variant="outline" onClick={handleLogout}>Déconnexion</Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestion des comptes administrateurs</h1>
            <p className="text-gray-600">Créez et gérez les comptes des super-utilisateurs de la plateforme</p>
          </div>
          <Dialog open={isAddAdminOpen} onOpenChange={setIsAddAdminOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Ajouter un administrateur
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Ajouter un nouvel administrateur</DialogTitle>
                <DialogDescription>
                  Créez un nouveau compte super-utilisateur.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="username">Nom d'utilisateur *</Label>
                    <Input
                      id="username"
                      value={newAdmin.username}
                      onChange={(e) => setNewAdmin({ ...newAdmin, username: e.target.value })}
                      placeholder="Nom d'utilisateur"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="name">Nom Complet *</Label>
                    <Input
                      id="name"
                      value={newAdmin.name}
                      onChange={(e) => setNewAdmin({ ...newAdmin, name: e.target.value })}
                      placeholder="Nom complet"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={newAdmin.email}
                      onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
                      placeholder="email@carloc-cameroun.com"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone_number">Téléphone *</Label>
                    <Input
                      id="phone_number"
                      value={newAdmin.phone_number}
                      onChange={(e) => setNewAdmin({ ...newAdmin, phone_number: e.target.value })}
                      placeholder="+237 6XX XXX XXX"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="password">Mot de passe *</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={newAdmin.password}
                        onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })}
                        placeholder="Mot de passe"
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-gray-400" />
                        ) : (
                          <Eye className="h-4 w-4 text-gray-400" />
                        )}
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirmer le mot de passe *</Label>
                    <Input
                      id="confirmPassword"
                      type={showPassword ? "text" : "password"}
                      value={newAdmin.confirmPassword}
                      onChange={(e) => setNewAdmin({ ...newAdmin, confirmPassword: e.target.value })}
                      placeholder="Confirmer le mot de passe"
                      required
                    />
                  </div>
                </div>
              </div>
              <p className="text-red-700">veillez memoriser ou noter le mot de passe pour plus de securite</p>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddAdminOpen(false)}>
                  Annuler
                </Button>
                <Button onClick={handleAddAdmin}>Créer le compte</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Comptes administrateurs</CardTitle>
            <CardDescription>Liste des super-utilisateurs ayant un accès complet à la plateforme</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom d'utilisateur</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Téléphone</TableHead>
                  <TableHead>Rôle</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Dernière connexion</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {superusers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-4">
                      Aucun super-utilisateur trouvé.
                    </TableCell>
                  </TableRow>
                ) : (
                  superusers.map((admin) => (
                    <TableRow key={admin.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center space-x-2">
                          {getRoleIcon()}
                          <span>
                            {admin.username}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>{admin.email}</TableCell>
                      <TableCell>{admin.phone_number}</TableCell>
                      <TableCell>{getRoleBadge()}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                            {getStatusBadge(admin.is_active)}
                            <Switch
                                checked={admin.is_active}
                                onCheckedChange={(checked) => {
                                    // Update local state immediately for responsiveness
                                    setSuperusers(prev => prev.map(u => u.id === admin.id ? { ...u, is_active: checked } : u));
                                    // Then, make the API call to persist the change
                                    axiosInstance.patch(`/cars/users/${admin.id}/`, { is_active: checked })
                                        .then(response => {
                                            toast.success(`Statut de ${admin.username} mis à jour.`);
                                            console.log("Admin active status updated:", response.data);
                                        })
                                        .catch(err => {
                                            console.error("Error updating admin active status:", err);
                                            toast.error("Échec de la mise à jour du statut.");
                                            // Revert local state if API call fails
                                            setSuperusers(prev => prev.map(u => u.id === admin.id ? { ...u, is_active: !checked } : u));
                                        });
                                }}
                                id={`status-switch-${admin.id}`}
                            />
                        </div>
                      </TableCell>
                      <TableCell>{admin.last_login ? new Date(admin.last_login).toLocaleString() : 'N/A'}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="sm" onClick={() => openEditDialog(admin)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDeleteAdmin(admin.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Edit Admin Dialog */}
        {selectedAdmin && (
          <Dialog open={isEditAdminOpen} onOpenChange={setIsEditAdminOpen}>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Modifier un administrateur</DialogTitle>
                <DialogDescription>Modifiez les informations de cet administrateur.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-username">Nom d'utilisateur</Label>
                    <Input
                      id="edit-username"
                      value={selectedAdmin.username}
                      onChange={(e) => setSelectedAdmin({ ...selectedAdmin, username: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-name">Nom Complet</Label>
                    <Input
                      id="edit-name"
                      value={selectedAdmin.name}
                      onChange={(e) => setSelectedAdmin({ ...selectedAdmin, name: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-email">Email</Label>
                    <Input
                      id="edit-email"
                      type="email"
                      value={selectedAdmin.email}
                      onChange={(e) => setSelectedAdmin({ ...selectedAdmin, email: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-phone_number">Téléphone</Label>
                    <Input
                      id="edit-phone_number"
                      value={selectedAdmin.phone_number}
                      onChange={(e) => setSelectedAdmin({ ...selectedAdmin, phone_number: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-status">Statut</Label>
                  <Select
                    value={selectedAdmin.is_active ? "active" : "inactive"}
                    onValueChange={(value) => setSelectedAdmin({ ...selectedAdmin, is_active: value === "active" })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Actif</SelectItem>
                      <SelectItem value="inactive">Inactif</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsEditAdminOpen(false)}>
                  Annuler
                </Button>
                <Button onClick={handleEditAdmin}>Enregistrer les modifications</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  )
}