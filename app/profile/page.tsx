'use client';

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Mail, Calendar, Shield, Key, Save, Upload,Car,Menu } from "lucide-react";
import axiosInstance from "@/utils/axios";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import Link from "next/link";
// Définition de l'interface pour les données de profil pour une meilleure typage
interface UserProfile {
  id: number;
  username: string;
  email: string;
  phone_number?: string;
  is_admin: boolean;
  last_login?: string;
  date_joined?: string;
  profile_picture?: string | null;
  role?: string; // Peut être "Super Administrateur", "Administrateur", etc.
  // Note: is_superuser et is_staff sont déjà inclus via is_admin pour l'affichage
  // mais ils ne sont pas directement modifiables par le frontend dans ce profil utilisateur "simple"
  // sauf si l'utilisateur est un superuser et modifie ces champs pour un autre utilisateur.
}

export default function AdminProfilePage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const cook = Cookies.get('UserSession')

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // State for mobile menu
  const [profileData, setProfileData] = useState<UserProfile>({
    id: 0,
    username: "",
    email: "",
    phone_number: "",
    is_admin: false, // is_admin correspond à is_superuser ou is_staff pour l'affichage du rôle
    last_login: "",
    date_joined: "",
    profile_picture: null,
  });

  // --- Chargement des données de l'utilisateur au montage du composant ---
  useEffect(() => {
    const fetchUserProfile = async () => {
      setIsLoading(true);
      try {
        const response = await axiosInstance.get<UserProfile>('cars/me/'); // Supposons que 'cars/me/' est la route pour récupérer les infos de l'utilisateur connecté

        setProfileData({
          id: response.data.id,
          username: response.data.username,
          email: response.data.email,
          phone_number: response.data.phone_number || '',
          is_admin: response.data.is_admin, // Ou calculez ici si is_superuser ou is_staff
          last_login: response.data.last_login ? new Date(response.data.last_login).toLocaleString() : 'N/A',
          date_joined: response.data.date_joined ? new Date(response.data.date_joined).toLocaleDateString() : 'N/A',
          profile_picture: response.data.profile_picture,
          role: response.data.role
        });
      } catch (error: any) {
        toast.error("Erreur lors du chargement du profil : " + (error.response?.data?.detail || error.message || ""));
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  // --- Fonction unifiée de mise à jour du profil et/ou du mot de passe ---
  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdatingProfile(true);

    const dataToUpdate: any = {
      username: profileData.username,
      email: profileData.email,
      phone_number: profileData.phone_number,
    };

    // Vérifie si l'utilisateur tente de changer le mot de passe
    // La présence de n'importe quel champ de mot de passe indique une tentative de modification
    const changingPassword = passwordData.newPassword || passwordData.confirmPassword || passwordData.currentPassword;

    if (changingPassword) {
      if (!passwordData.currentPassword) {
        toast.error("Le mot de passe actuel est requis pour changer votre mot de passe.");
        setIsUpdatingProfile(false);
        return;
      }
      if (passwordData.newPassword !== passwordData.confirmPassword) {
        toast.error("Les nouveaux mots de passe ne correspondent pas.");
        setIsUpdatingProfile(false);
        return;
      }
      if (passwordData.newPassword.length < 8) {
        toast.error("Le nouveau mot de passe doit contenir au moins 8 caractères.");
        setIsUpdatingProfile(false);
        return;
      }

      // Ajoute les champs du mot de passe aux données à envoyer
      dataToUpdate.current_password = passwordData.currentPassword;
      dataToUpdate.password = passwordData.newPassword; // 'password' est le champ pour le nouveau mot de passe dans UserUpdateSerializer
    }

    try {
      // Envoyer la requête PATCH à la vue de mise à jour du profil
      const response = await axiosInstance.patch(`cars/users/${profileData.id}/`, dataToUpdate);

      toast.success("Profil mis à jour avec succès !");
      
      // Mettre à jour les données du profil localement
      // Utilisez l'opérateur de coalescence nulle pour les valeurs non définies
      setProfileData({
          ...profileData,
          ...response.data, // Si le backend renvoie les données mises à jour
          last_login: response.data.last_login ? new Date(response.data.last_login).toLocaleString() : 'N/A',
          date_joined: response.data.date_joined ? new Date(response.data.date_joined).toLocaleDateString() : 'N/A',
      });

      // Réinitialiser le formulaire de mot de passe si un changement a eu lieu
      if (changingPassword) {
        setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
      }

    } catch (error: any) {
      let errorMessage = "Erreur lors de la mise à jour du profil.";
      if (error.response?.data) {
        if (error.response.data.detail) {
          errorMessage = error.response.data.detail;
        } else if (error.response.data.current_password?.[0]) {
          errorMessage = error.response.data.current_password[0];
        } else if (error.response.data.password?.[0]) {
          errorMessage = error.response.data.password[0];
        } else if (error.response.data.email?.[0]) {
          errorMessage = error.response.data.email[0];
        } else if (typeof error.response.data === 'string') {
          errorMessage = error.response.data;
        } else {
          errorMessage = "Détails de l'erreur : " + JSON.stringify(error.response.data);
        }
      } else if (error.message) {
        errorMessage = error.message;
      }
      toast.error(errorMessage);
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error("La taille du fichier ne doit pas dépasser 2MB.");
      return;
    }
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Seuls les formats JPG, PNG, GIF sont autorisés.");
      return;
    }

    const formData = new FormData();
    formData.append("profile_picture", file);

    try {
      const response = await axiosInstance.patch(`cars/users/${profileData.id}/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.success("Photo de profil mise à jour !");
      setProfileData(prev => ({ ...prev, profile_picture: response.data.profile_picture }));
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || error.response?.data?.profile_picture?.[0] || error.message || "Erreur lors de l'upload de la photo de profil.";
      toast.error(errorMessage);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-700">Chargement du profil...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4">

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
                            <Link href="/reservations" className="text-gray-700 hover:text-blue-600">
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
                            <Link href="/register">
                                    <Button variant="outline">S'inscrire</Button>
                                </Link>
                            {cook ?
                                    <Link href="/profile">
                                    <Button>Mon compte</Button>
                                    </Link> 
                                :<Link href="/login">
                                    <Button>Connexion</Button>
                                </Link>
                            }
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
                        <Link href="/reservations" className="block text-gray-700 hover:text-blue-600 py-2" onClick={() => setIsMobileMenuOpen(false)}>
                            Mes réservations
                        </Link>
                        <Link href="/about" className="block text-gray-700 hover:text-blue-600 py-2" onClick={() => setIsMobileMenuOpen(false)}>
                            À propos
                        </Link>
                        <Link href="/contact" className="block text-gray-700 hover:text-blue-600 py-2" onClick={() => setIsMobileMenuOpen(false)}>
                            Contact
                        </Link>
                        <div className="pt-4 space-y-2 border-t border-gray-100">
                            <Link href="/register" onClick={() => setIsMobileMenuOpen(false)}>
                            <Button className="w-full mt-2" variant="outline">S'inscrire</Button>
                            </Link>
                            { cook ?
                                <Link href="/profile">
                                    <Button className="w-full mt-2" onClick={() => setIsMobileMenuOpen(false)}>Mon compte</Button>
                                </Link>
                                :<Link href="/login">
                                    <Button  className="w-full mt-2" onClick={() => setIsMobileMenuOpen(false)}>Connexion</Button>
                                </Link>
                            }
                        </div>
                    </div>
                )}
            </header>

      <div className="pt-[70px]">
        <h1 className="text-3xl font-bold text-gray-900">Mon profil</h1>
        <p className="text-gray-600">Gérez vos informations personnelles et paramètres de sécurité</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Informations du profil */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>Informations personnelles</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Le formulaire est maintenant le même pour les infos et le mot de passe */}
              <form onSubmit={handleProfileUpdate} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="username">Nom d'utilisateur</Label>
                    <Input
                      id="username"
                      value={profileData.username}
                      onChange={(e) => setProfileData({ ...profileData, username: e.target.value })}
                      required
                      disabled={isUpdatingProfile}
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                      required
                      disabled={isUpdatingProfile}
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Téléphone</Label>
                    <Input
                      id="phone"
                      value={profileData.phone_number}
                      onChange={(e) => setProfileData({ ...profileData, phone_number: e.target.value })}
                      disabled={isUpdatingProfile}
                    />
                  </div>
                </div>

                {/* --- Section Changement de mot de passe intégrée --- */}
                <Separator className="my-6" />
                <CardHeader className="p-0"> {/* Réinitialiser le padding pour l'intégration */}
                    <CardTitle className="flex items-center space-x-2">
                        <Key className="h-5 w-5" />
                        <span>Changer le mot de passe</span>
                    </CardTitle>
                </CardHeader>
                {/* Texte explicatif ajouté ici */}
                <p className="text-sm text-gray-600 mt-2 mb-4">
                  Remplissez les champs ci-dessous **seulement si** vous souhaitez modifier votre mot de passe.
                </p>
                <div className="space-y-4 pt-4"> {/* Ajouter un padding top */}
                    <div>
                        <Label htmlFor="currentPassword">Mot de passe actuel</Label>
                        <Input
                            id="currentPassword"
                            type="password"
                            value={passwordData.currentPassword}
                            onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                            disabled={isUpdatingProfile}
                        />
                    </div>
                    <div>
                        <Label htmlFor="newPassword">Nouveau mot de passe</Label>
                        <Input
                            id="newPassword"
                            type="password"
                            value={passwordData.newPassword}
                            onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                            minLength={8}
                            disabled={isUpdatingProfile}
                        />
                        <p className="text-sm text-gray-500 mt-1">Minimum 8 caractères</p>
                    </div>
                    <div>
                        <Label htmlFor="confirmPassword">Confirmer le nouveau mot de passe</Label>
                        <Input
                            id="confirmPassword"
                            type="password"
                            value={passwordData.confirmPassword}
                            onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                            disabled={isUpdatingProfile}
                        />
                    </div>
                </div>
                {/* --- Fin de la section Changement de mot de passe --- */}

                <Button type="submit" disabled={isUpdatingProfile}>
                  <Save className="mr-2 h-4 w-4" />
                  {isUpdatingProfile ? "Sauvegarde..." : "Sauvegarder les modifications"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar avec photo et infos (inchangé) */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Photo de profil</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <Avatar className="w-24 h-24 mx-auto mb-4">
                <AvatarImage src={profileData.profile_picture || "/placeholder.svg"} alt="Photo de profil" />
                <AvatarFallback className="text-2xl">
                  {profileData.username
                    ? profileData.username.split(" ").map((n) => n[0]).join("")
                    : "U"}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-2">
                <Label htmlFor="avatar-upload" className="cursor-pointer">
                  <Button variant="outline" size="sm" asChild>
                    <span>
                      <Upload className="mr-2 h-4 w-4" />
                      Changer la photo
                    </span>
                  </Button>
                </Label>
                <Input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  className="hidden"
                />
                <p className="text-xs text-gray-500">JPG, PNG, GIF max 2MB</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5" />
                <span>Informations du compte</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-gray-400" />
                <div>
                  <p className="text-sm font-medium">Email</p>
                  <p className="text-sm text-gray-600">{profileData.email}</p>
                </div>
              </div>
              <Separator />
              <div className="flex items-center space-x-3">
                <Shield className="h-4 w-4 text-gray-400" />
                <div>
                  <p className="text-sm font-medium">Rôle</p>
                  <p className="text-sm text-gray-600">
                    {profileData.role}
                  </p>
                </div>
              </div>
              <Separator />
              <div className="flex items-center space-x-3">
                <Calendar className="h-4 w-4 text-gray-400" />
                <div>
                  <p className="text-sm font-medium">Dernière connexion</p>
                  <p className="text-sm text-gray-600">{profileData.last_login}</p>
                </div>
              </div>
              <Separator />
              <div className="flex items-center space-x-3">
                <Calendar className="h-4 w-4 text-gray-400" />
                <div>
                  <p className="text-sm font-medium">Membre depuis</p>
                  <p className="text-sm text-gray-600">{profileData.date_joined}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}