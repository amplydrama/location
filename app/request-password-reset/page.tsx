'use client'; // Indique que c'est un composant client en Next.js App Router

import React, { useState } from 'react';
import { axiosAuth } from '@/utils/axios'; // Assurez-vous d'avoir le bon chemin vers votre axiosAuth
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Car } from "lucide-react";
import toast from 'react-hot-toast'; // Pour les notifications

const RequestPasswordResetPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); // Réinitialise l'erreur précédente
    setMessage(null); // Réinitialise le message précédent

    if (!email) {
      setError('Veuillez entrer votre adresse email.');
      return;
    }

    setSubmitting(true);
    try {
      const response = await axiosAuth.post('cars/request-password-reset/', { email });
      // Le message de succès est intentionnellement générique pour des raisons de sécurité.
      // Il ne doit pas indiquer si l'email existe ou non.
      setMessage(response.data.message || 'Si votre email est enregistré, un lien de réinitialisation a été envoyé.');
      toast.success(response.data.message || 'Un lien de réinitialisation a été envoyé à votre adresse email.');
      setEmail(''); // Vide le champ email après envoi
    } catch (err: any) {
      if (err.response) {
        // Erreur de l'API (ex: validation de l'email si non valide)
        if (err.response.data.email) {
          setError(err.response.data.email[0]);
        } else if (err.response.data.error) {
          setError(err.response.data.error);
        } else {
          setError('Une erreur est survenue. Veuillez réessayer.');
        }
      } else {
        // Erreur réseau ou autre
        setError('Impossible de se connecter au serveur. Veuillez vérifier votre connexion.');
      }
      toast.error(error || 'Échec de l\'envoi du lien de réinitialisation.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="flex items-center justify-center space-x-2 mb-4">
            <Car className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">CarLoc Cameroun</span>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Mot de passe oublié ?</h1>
          <p className="text-gray-600">Entrez votre adresse email pour recevoir un lien de réinitialisation.</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Réinitialiser le mot de passe</CardTitle>
            <CardDescription>
              Un email avec un lien de réinitialisation sera envoyé à l'adresse fournie.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Adresse email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="votre@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={submitting}
                />
              </div>

              {message && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
                  <p>{message}</p>
                </div>
              )}

              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                  <p>{error}</p>
                </div>
              )}

              <Button type="submit" className="w-full" disabled={submitting}>
                {submitting ? 'Envoi en cours...' : 'Envoyer le lien de réinitialisation'}
              </Button>
            </form>

            <p className="mt-6 text-center text-sm text-gray-600">
              <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500">
                Retour à la connexion
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RequestPasswordResetPage;