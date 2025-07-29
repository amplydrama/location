'use client'

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { verifyEmail } from '@/app/api/register/verify/verify';
import Link from 'next/link';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react'; // Import icons from lucide-react

export default function VerifyEmail() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  
  // State to manage the verification status and message
  const [status, setStatus] = useState<'pending' | 'success' | 'error'>('pending');
  const [message, setMessage] = useState('Vérification de votre adresse e-mail en cours...');

  useEffect(() => {
    if (token) {
      verifyEmail(token)
        .then(() => {
          setStatus('success');
          setMessage("Félicitations ! Votre adresse e-mail a été vérifiée avec succès.");
          setTimeout(() => {
            router.push('/login'); // Redirect after 3 seconds
          }, 3000);
        })
        .catch((error) => {
          setStatus('error');
          // More specific error messages could be handled here if your API provides them
          setMessage("Oups ! Le lien de vérification est invalide ou a expiré. Veuillez réessayer.");
          console.error("Email verification error:", error); // Log the error for debugging
        });
    } else {
      setStatus('error');
      setMessage("Aucun jeton de vérification n'a été trouvé. Veuillez vérifier le lien.");
    }
  }, [token, router]); // Add router to dependency array as recommended by Next.js

  const getStatusIcon = () => {
    switch (status) {
      case 'pending':
        return <Loader2 className="h-12 w-12 text-blue-500 animate-spin" />;
      case 'success':
        return <CheckCircle className="h-12 w-12 text-green-500" />;
      case 'error':
        return <XCircle className="h-12 w-12 text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-xl p-8 text-center space-y-6">
        <div className="flex justify-center mb-6">
          {getStatusIcon()}
        </div>
        
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
          {status === 'pending' ? 'Vérification en cours' : 
           status === 'success' ? 'Vérification Réussie !' : 
           'Problème de Vérification'}
        </h1>
        
        <p className="text-lg text-gray-700 leading-relaxed">
          {message}
        </p>

        {status === 'success' && (
          <p className="text-md text-gray-600">
            Vous serez redirigé vers la page de connexion dans quelques instants...
          </p>
        )}

        {status === 'error' && (
          <div className="pt-4">
            <Link 
              href="/register" 
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition duration-300 ease-in-out shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Réessayer de s'inscrire
            </Link>
            <p className="mt-4 text-sm text-gray-500">
              Si le problème persiste, veuillez contacter le support.
            </p>
          </div>
        )}

        {status === 'pending' && (
          <p className="text-md text-gray-600">
            Merci de patienter pendant que nous confirmons votre adresse e-mail.
          </p>
        )}
      </div>
    </div>
  );
}