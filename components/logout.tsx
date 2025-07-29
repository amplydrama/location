'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Cookies from 'js-cookie'; // Client-side cookie management
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import toast from 'react-hot-toast'; 
import { logoutUser } from '@/app/api/login/auth'; // Assurez-vous que le chemin est correct

interface LogoutButtonProps {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
  buttonText?: string;
}

/**
 * LogoutButton component that handles user logout with a confirmation dialog.
 * It checks for a specific cookie to determine if it should be displayed.
 */
export function LogoutButton({ variant = "ghost", size = "default", className, buttonText = "Déconnexion" }: LogoutButtonProps) {
  const router = useRouter();
  // State to manage the visibility based on the cookie
  const [hasAuthCookie, setHasAuthCookie] = useState<string | undefined>();

  useEffect(() => {
    // Check for the cookie on mount (client-side)
    const token = Cookies.get('UserSession'); // Remplacez 'token' par le nom réel de votre cookie d'authentification
    setHasAuthCookie(token); // Convertit en boolean
  }, []); // Exécuter une seule fois au montage du composant

  const handleLogout = () => {
    logoutUser()
      .then(() => {
        console.log("Logout successful from component.");
        toast.success("Déconnexion réussie ! À bientôt.", {
          duration: 3000,
          position: "top-right",
        });
        setHasAuthCookie(''); // Update state to hide the button immediately
        router.push('/login');
      })
      .catch((error) => {
        console.error("Logout failed from component:", error);
        const errorMessage = error.error || "Une erreur est survenue lors de la déconnexion.";
        toast.error(`Erreur : ${errorMessage}`, {
          duration: 5000,
          position: "top-right",
        });
        // Always redirect even on error to clear local state (e.g., tokens)
        router.push('/login');
      });
  };

  // Only render the button if the cookie is present
  if (!hasAuthCookie) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 z-50">
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant={variant} size={size} className={className}>
            <LogOut className="mr-2 h-4 w-4" />
            {buttonText}
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr de vouloir vous déconnecter ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action mettra fin à votre session actuelle. Vous devrez vous reconnecter pour accéder à nouveau à votre compte.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleLogout}>Se déconnecter</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}