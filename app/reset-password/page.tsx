'use client'; // Indique que c'est un composant client en Next.js App Router

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation'; // Pour l'App Router
import { axiosAuth } from '@/utils/axios'; // Assurez-vous d'avoir le bon chemin vers votre axiosAuth
import Link from 'next/link';

// Composants Shadcn/ui
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Icônes Lucide React
import { Eye, EyeOff, Car } from "lucide-react";

// Pour les notifications
import toast from 'react-hot-toast';

const ResetPasswordPage: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // --- États du formulaire et du processus ---
  const [password, setPassword] = useState(''); // Contient le nouveau mot de passe
  const [confirmPassword, setConfirmPassword] = useState(''); // Contient la confirmation du nouveau mot de passe
  const [token, setToken] = useState<string | null>(null); // Contient le token de réinitialisation extrait de l'URL
  
  const [loading, setLoading] = useState(true); // Gère l'état de chargement initial de la page (attente du token de l'URL)
  const [submitting, setSubmitting] = useState(false); // Indique si le formulaire est en cours de soumission à l'API

  // --- États pour la visibilité des mots de passe ---
  const [passwordVisible, setPasswordVisible] = useState(false); // Gère la visibilité du champ 'Nouveau mot de passe'
  const [passwordConfirmVisible, setPasswordConfirmVisible] = useState(false); // Gère la visibilité du champ 'Confirmer le nouveau mot de passe'
  // ---------------------------------------------

  useEffect(() => {
    // Récupérer le token de l'URL au chargement du composant
    const urlToken = searchParams.get('token');
    if (urlToken) {
      setToken(urlToken);
    } else {
      // Si le token est manquant, afficher une erreur via toast
      toast.error('Token de réinitialisation manquant dans l\'URL.');
    }
    setLoading(false); // Le token a été vérifié (présent ou non), on peut arrêter l'état de chargement initial.
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    toast.dismiss(); // Masque tous les toasts actuellement affichés avant une nouvelle opération

    // Validation du token
    if (!token) {
      toast.error('Token de réinitialisation invalide ou manquant. Veuillez demander un nouveau lien.');
      return;
    }

    // Validation de la correspondance des mots de passe
    if (password !== confirmPassword) {
      toast.error('Les mots de passe ne correspondent pas.');
      return;
    }

    // Validation de la longueur minimale du mot de passe
    if (password.length < 8) {
      toast.error('Le mot de passe doit contenir au moins 8 caractères.');
      return;
    }

    setSubmitting(true); // Active l'état de soumission
    try {
      const response = await axiosAuth.post('cars/set-new-password/', {
        password_reset_token: token,
        new_password: password,
        confirm_new_password: confirmPassword,
      });
      toast.success(response.data.message || 'Votre mot de passe a été réinitialisé avec succès !');
      
      // Rediriger l'utilisateur vers la page de connexion après un court délai
      setTimeout(() => {
        router.push('/login');
      }, 3000);
    } catch (err: any) {
      // Gestion des erreurs de l'API ou réseau
      if (err.response) {
        // Erreurs renvoyées par le serializer Django
        if (err.response.data.password_reset_token) {
          toast.error(err.response.data.password_reset_token[0]);
        } else if (err.response.data.new_password) {
          toast.error(err.response.data.new_password[0]);
        } else if (err.response.data.password) { // Erreur spécifique si les deux mots de passe ne correspondent pas côté backend
          toast.error(err.response.data.password[0]);
        } else if (err.response.data.detail) { // Erreurs génériques (ex: permission denied si non AllowAny, ce qui ne devrait pas arriver ici)
            toast.error(err.response.data.detail);
        } else {
          // Erreur inattendue de l'API
          toast.error(err.response.data.error || 'Une erreur est survenue lors de la réinitialisation du mot de passe.');
        }
      } else {
        // Erreurs réseau (pas de réponse du serveur)
        toast.error('Une erreur réseau ou inattendue est survenue. Veuillez vérifier votre connexion.');
      }
    } finally {
      setSubmitting(false); // Désactive l'état de soumission, que l'opération ait réussi ou échoué
    }
  };

  // Afficher un écran de chargement tant que le token n'est pas vérifié dans l'URL
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <p className="text-lg text-gray-700">Chargement...</p>
      </div>
    );
  }

  // Afficher un message d'erreur et un lien de retour si le token est manquant après le chargement initial
  if (!token) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md text-center">
          <h1 className="text-2xl font-bold mb-4 text-red-600">Erreur de Token</h1>
          <p className="text-red-500 mb-4">Le lien de réinitialisation est invalide ou manquant.</p>
          <Link href="/request-password-reset" className="text-blue-600 hover:underline font-medium">
            Demander un nouveau lien de réinitialisation
          </Link>
        </div>
      </div>
    );
  }

  // Rendu du formulaire de réinitialisation si le token est présent
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="flex items-center justify-center space-x-2 mb-4">
            <Car className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">CarLoc Cameroun</span>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Réinitialiser le mot de passe</h1>
          <p className="text-gray-600">Entrez votre nouveau mot de passe</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Nouveau mot de passe</CardTitle>
            <CardDescription>
              Veuillez entrer et confirmer votre nouveau mot de passe.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">Nouveau mot de passe</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={passwordVisible ? "text" : "password"}
                    placeholder="Votre nouveau mot de passe"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={submitting} // Désactiver l'input pendant la soumission
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setPasswordVisible(!passwordVisible)}
                  >
                    {passwordVisible ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </Button>
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Minimum 8 caractères.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmer le nouveau mot de passe</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={passwordConfirmVisible ? "text" : "password"}
                    placeholder="Confirmez votre nouveau mot de passe"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    disabled={submitting} // Désactiver l'input pendant la soumission
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setPasswordConfirmVisible(!passwordConfirmVisible)}
                  >
                    {passwordConfirmVisible ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </Button>
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={submitting}>
                {submitting ? 'Réinitialisation en cours...' : 'Réinitialiser le mot de passe'}
              </Button>
            </form>

            <p className="mt-6 text-center text-sm text-gray-600">
              Vous souvenez de votre mot de passe ?{' '}
              <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500">
                Connectez-vous ici
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ResetPasswordPage;