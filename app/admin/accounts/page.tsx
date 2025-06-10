"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Car, Plus, Edit, Trash2, Eye, EyeOff, Shield, ShieldAlert, ShieldCheck } from "lucide-react"
import Link from "next/link"

// Mock data for admin accounts
const adminAccounts = [
  {
    id: 1,
    firstName: "Admin",
    lastName: "Principal",
    email: "admin@carloc-cameroun.com",
    phone: "+237 600 000 000",
    role: "super_admin",
    permissions: ["all"],
    lastLogin: "2024-01-15 10:30:45",
    status: "active",
  },
  {
    id: 2,
    firstName: "Jean",
    lastName: "Kouam",
    email: "jean.kouam@carloc-cameroun.com",
    phone: "+237 677 111 222",
    role: "admin",
    permissions: ["vehicles", "bookings", "customers"],
    lastLogin: "2024-01-14 16:22:10",
    status: "active",
  },
  {
    id: 3,
    firstName: "Marie",
    lastName: "Tagne",
    email: "marie.tagne@carloc-cameroun.com",
    phone: "+237 699 333 444",
    role: "manager",
    permissions: ["bookings", "customers"],
    lastLogin: "2024-01-10 09:15:30",
    status: "inactive",
  },
]

// Available roles and their descriptions
const roles = [
  {
    value: "super_admin",
    label: "Super Admin",
    description: "Accès complet à toutes les fonctionnalités du système",
  },
  {
    value: "admin",
    label: "Administrateur",
    description: "Gestion des véhicules, réservations et clients",
  },
  {
    value: "manager",
    label: "Gestionnaire",
    description: "Gestion des réservations et clients uniquement",
  },
  {
    value: "support",
    label: "Support",
    description: "Visualisation des données et support client",
  },
]

// Available permissions
const permissions = [
  { value: "vehicles", label: "Gestion des véhicules" },
  { value: "bookings", label: "Gestion des réservations" },
  { value: "customers", label: "Gestion des clients" },
  { value: "payments", label: "Gestion des paiements" },
  { value: "reports", label: "Rapports et analyses" },
  { value: "settings", label: "Paramètres système" },
  { value: "admin_accounts", label: "Gestion des comptes admin" },
]

export default function AdminAccountsPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [isAddAdminOpen, setIsAddAdminOpen] = useState(false)
  const [isEditAdminOpen, setIsEditAdminOpen] = useState(false)
  const [selectedAdmin, setSelectedAdmin] = useState<any>(null)
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([])
  const [newAdmin, setNewAdmin] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    role: "",
  })

  const handleAddAdmin = () => {
    // Validation
    if (
      !newAdmin.firstName ||
      !newAdmin.lastName ||
      !newAdmin.email ||
      !newAdmin.phone ||
      !newAdmin.password ||
      !newAdmin.role
    ) {
      alert("Veuillez remplir tous les champs obligatoires")
      return
    }

    if (newAdmin.password !== newAdmin.confirmPassword) {
      alert("Les mots de passe ne correspondent pas")
      return
    }

    // In a real app, this would be an API call
    console.log("Ajout d'un nouvel administrateur:", { ...newAdmin, permissions: selectedPermissions })
    setIsAddAdminOpen(false)
    resetForm()
  }

  const handleEditAdmin = () => {
    if (!selectedAdmin) return

    // In a real app, this would be an API call
    console.log("Modification de l'administrateur:", { ...selectedAdmin, permissions: selectedPermissions })
    setIsEditAdminOpen(false)
  }

  const handleDeleteAdmin = (adminId: number) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cet administrateur ?")) {
      // In a real app, this would be an API call
      console.log("Suppression de l'administrateur:", adminId)
    }
  }

  const openEditDialog = (admin: any) => {
    setSelectedAdmin(admin)
    setSelectedPermissions(admin.permissions)
    setIsEditAdminOpen(true)
  }

  const resetForm = () => {
    setNewAdmin({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      role: "",
    })
    setSelectedPermissions([])
  }

  const togglePermission = (permission: string) => {
    if (selectedPermissions.includes(permission)) {
      setSelectedPermissions(selectedPermissions.filter((p) => p !== permission))
    } else {
      setSelectedPermissions([...selectedPermissions, permission])
    }
  }

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "super_admin":
        return <Badge className="bg-purple-100 text-purple-800">Super Admin</Badge>
      case "admin":
        return <Badge className="bg-blue-100 text-blue-800">Administrateur</Badge>
      case "manager":
        return <Badge className="bg-green-100 text-green-800">Gestionnaire</Badge>
      case "support":
        return <Badge className="bg-gray-100 text-gray-800">Support</Badge>
      default:
        return <Badge variant="outline">{role}</Badge>
    }
  }

  const getStatusBadge = (status: string) => {
    return status === "active" ? (
      <Badge className="bg-green-100 text-green-800">Actif</Badge>
    ) : (
      <Badge className="bg-red-100 text-red-800">Inactif</Badge>
    )
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "super_admin":
        return <ShieldAlert className="h-5 w-5 text-purple-600" />
      case "admin":
        return <ShieldCheck className="h-5 w-5 text-blue-600" />
      case "manager":
        return <Shield className="h-5 w-5 text-green-600" />
      case "support":
        return <Shield className="h-5 w-5 text-gray-600" />
      default:
        return <Shield className="h-5 w-5" />
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
              <Link href="/admin">
                <Button variant="outline">Tableau de bord</Button>
              </Link>
              <Button variant="outline">Déconnexion</Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestion des comptes administrateurs</h1>
            <p className="text-gray-600">Créez et gérez les comptes administrateurs de la plateforme</p>
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
                  Créez un nouveau compte administrateur avec les permissions appropriées.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">Prénom *</Label>
                    <Input
                      id="firstName"
                      value={newAdmin.firstName}
                      onChange={(e) => setNewAdmin({ ...newAdmin, firstName: e.target.value })}
                      placeholder="Prénom"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Nom *</Label>
                    <Input
                      id="lastName"
                      value={newAdmin.lastName}
                      onChange={(e) => setNewAdmin({ ...newAdmin, lastName: e.target.value })}
                      placeholder="Nom"
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
                    <Label htmlFor="phone">Téléphone *</Label>
                    <Input
                      id="phone"
                      value={newAdmin.phone}
                      onChange={(e) => setNewAdmin({ ...newAdmin, phone: e.target.value })}
                      placeholder="+237 6XX XXX XXX"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role">Rôle *</Label>
                  <Select value={newAdmin.role} onValueChange={(value) => setNewAdmin({ ...newAdmin, role: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un rôle" />
                    </SelectTrigger>
                    <SelectContent>
                      {roles.map((role) => (
                        <SelectItem key={role.value} value={role.value}>
                          <div className="flex items-center">
                            <span>{role.label}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {newAdmin.role && (
                    <p className="text-sm text-gray-500 mt-1">
                      {roles.find((r) => r.value === newAdmin.role)?.description}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Permissions</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {permissions.map((permission) => (
                      <div key={permission.value} className="flex items-center space-x-2">
                        <Switch
                          checked={selectedPermissions.includes(permission.value)}
                          onCheckedChange={() => togglePermission(permission.value)}
                          id={`permission-${permission.value}`}
                        />
                        <Label htmlFor={`permission-${permission.value}`}>{permission.label}</Label>
                      </div>
                    ))}
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
            <CardDescription>Liste des utilisateurs avec accès administratif à la plateforme</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Téléphone</TableHead>
                  <TableHead>Rôle</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Dernière connexion</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {adminAccounts.map((admin) => (
                  <TableRow key={admin.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center space-x-2">
                        {getRoleIcon(admin.role)}
                        <span>
                          {admin.firstName} {admin.lastName}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>{admin.email}</TableCell>
                    <TableCell>{admin.phone}</TableCell>
                    <TableCell>{getRoleBadge(admin.role)}</TableCell>
                    <TableCell>{getStatusBadge(admin.status)}</TableCell>
                    <TableCell>{admin.lastLogin}</TableCell>
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
                ))}
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
                <DialogDescription>Modifiez les informations et permissions de cet administrateur.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-firstName">Prénom</Label>
                    <Input
                      id="edit-firstName"
                      value={selectedAdmin.firstName}
                      onChange={(e) => setSelectedAdmin({ ...selectedAdmin, firstName: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-lastName">Nom</Label>
                    <Input
                      id="edit-lastName"
                      value={selectedAdmin.lastName}
                      onChange={(e) => setSelectedAdmin({ ...selectedAdmin, lastName: e.target.value })}
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
                    <Label htmlFor="edit-phone">Téléphone</Label>
                    <Input
                      id="edit-phone"
                      value={selectedAdmin.phone}
                      onChange={(e) => setSelectedAdmin({ ...selectedAdmin, phone: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-role">Rôle</Label>
                  <Select
                    value={selectedAdmin.role}
                    onValueChange={(value) => setSelectedAdmin({ ...selectedAdmin, role: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {roles.map((role) => (
                        <SelectItem key={role.value} value={role.value}>
                          {role.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Permissions</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {permissions.map((permission) => (
                      <div key={permission.value} className="flex items-center space-x-2">
                        <Switch
                          checked={selectedPermissions.includes(permission.value)}
                          onCheckedChange={() => togglePermission(permission.value)}
                          id={`edit-permission-${permission.value}`}
                        />
                        <Label htmlFor={`edit-permission-${permission.value}`}>{permission.label}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-status">Statut</Label>
                  <Select
                    value={selectedAdmin.status}
                    onValueChange={(value) => setSelectedAdmin({ ...selectedAdmin, status: value })}
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

                <div className="space-y-2">
                  <Label htmlFor="edit-password">Nouveau mot de passe (laisser vide pour ne pas changer)</Label>
                  <div className="relative">
                    <Input
                      id="edit-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Nouveau mot de passe"
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
