'use client'

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { verifyEmail } from '@/app/api/register/verify/verify';
import Link from 'next/link';

export default function VerifyEmail() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [message, setMessage] = useState('Vérification en cours...');

  useEffect(() => {
  if (token) {
    verifyEmail(token)
      .then(() => {
        setMessage("Email vérifié avec succès !");
        setTimeout(() => {
          router.push('/login'); // redirige après 3 secondes
        }, 3000);
      })
      .catch(() => setMessage("Lien invalide ou expiré."));
  }
}, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white p-4">
        <div className="w-full max-w-md text-center">
            <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-4">Vérification de l'Email</h1>
                <p className="text-gray-700 mb-6">{message}</p>
                <Link href={'/register'}>S'inscrire</Link>
            </div>
        </div>
    </div>

  );
}
