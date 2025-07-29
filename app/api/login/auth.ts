import axiosInstance from "@/utils/axios";
import Cookies from "js-cookie";
import axios from 'axios'; // <<< AJOUTE CETTE LIGNE pour importer le module original
import { axiosAuth } from "@/utils/axios";

export async function login(data: { email: string; password: string }) {
  try {
    const response = await axiosAuth.post("cars/login/", data);
    
    // LOG CRUCIAL : Affiche le contenu exact de la réponse 200 du backend.
    // Vérifiez ce log dans la console de votre navigateur.
    console.log("Réponse API de connexion (200 OK) :", response.data);

    // Vérifier si les données essentielles sont présentes dans la réponse
    if (!response.data || typeof response.data.access_token === 'undefined' || typeof response.data.refresh_token === 'undefined') {
      console.error("Erreur de connexion : jeton d'accès ou de rafraîchissement manquant dans les données de réponse.");
      // Lancer une erreur spécifique si les jetons essentiels sont absents
      throw { error: "Données d'authentification incomplètes reçues du serveur." };
    }

    const { access_token, refresh_token, is_admin, email } = response.data;

    // Définir les cookies avec une durée (ex: 1h pour access, 7j pour refresh)
    // 'expires' pour js-cookie est en jours pour les entiers, ou une date pour les objets Date
    // 1 / 24 = 1 heure
    Cookies.set("access_token", access_token, { expires: 1 / 24, secure: true, sameSite: "Strict" }); // 1 heure
    Cookies.set("refresh_token", refresh_token, { expires: 7, secure: true, sameSite: "Strict" }); // 7 jours

    // Vérifier et définir le cookie adminSession si l'utilisateur est admin
    if (is_admin) {
      Cookies.set("adminSession", "true", { expires: 7, secure: true, sameSite: "Strict" });
      Cookies.set('admin_email', email, {expires: 7, secure: true, sameSite: "Strict"}); // Enregistrer l'email de l'admin dans un cookie
      Cookies.set('user_email', email, {
        secure: process.env.NODE_ENV === 'production', // 'secure' uniquement en production pour HTTPS
        sameSite: 'strict',
        expires: 60 * 60 * 24 * 30, // Durée de vie en secondes (30 jours pour cet exemple)
        path: '/', // Le cookie est disponible sur tout le site
      });
    }else {
      Cookies.set("UserSession", "true", { expires: 7, secure: true, sameSite: "Strict" });
      Cookies.set('mail_user', email, {expires: 7, secure: true, sameSite: "Strict"}); // Enregistrer l'email de l'utilisateur dans un cookie

    }
    
    // Retourner les données complètes de la réponse si tout s'est bien passé
    return response.data;
  } catch (error: any) {
    // LOG D'ERREUR : Affiche l'erreur réelle qui a été capturée
    console.error("Erreur dans la fonction login :", error);

    // Gérer les erreurs Axios spécifiquement
    if (axios.isAxiosError(error) && error.response) {
      // Si le backend a envoyé un message d'erreur, utilisez-le
      throw error.response.data || { error: "Erreur réseau ou du serveur lors de la connexion." };
    } else {
      // Pour d'autres types d'erreurs (ex: déstructuration, problème de cookie si non géré ci-dessus)
      throw { error: "Une erreur inattendue est survenue lors de la connexion." };
    }
  }
}

export async function getDashboardStats() {
  try {
    const response = await axiosInstance.get("/cars/dashboard/stats/");
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { error: "Erreur lors de la récupération des statistiques du tableau de bord" };
  }
}


export interface UserData {
    id: number;
    email: string;
    username: string;
    name: string;
    phone_number: string;
    date_joined: string; // Ou Date, si vous le convertissez
    is_email_verified: boolean;
    is_active: boolean;
    is_staff: boolean;
    is_superuser: boolean;
    is_customer: boolean;
    last_login: string; // Optionnel, si votre UserSerializer l'inclut
    // ... ajoutez d'autres champs si votre UserSerializer les inclut
}

export async function getAllUsers(onlySuperusers?: boolean): Promise<UserData[]> { // Ajout du paramètre optionnel
    try {
        const params: { only_superusers?: string } = {}; // Crée un objet pour les paramètres de requête

        if (onlySuperusers !== undefined) { // Si 'onlySuperusers' est fourni
            // Convertit le booléen en chaîne "true" ou "false" car les paramètres d'URL sont des chaînes.
            params.only_superusers = String(onlySuperusers); 
        }

        // Utilise l'objet params dans la requête GET d'Axios
        const response = await axiosInstance.get('/cars/user/list/', { params }); 
        return response.data;
    } catch (error: any) {
        // MAINTENANT, tu peux utiliser axios.isAxiosError() car le module axios est importé.
        if (axios.isAxiosError(error)) { // Correct : axios (le module) est utilisé
            if (error.response) {
                const status = error.response.status;
                const message = error.response.data?.detail || error.response.data?.error || "Erreur inconnue";

                if (status === 401) {
                    throw new Error("Non autorisé. Votre session a peut-être expiré.");
                } else if (status === 403) {
                    throw new Error(`Accès refusé: ${message}. Vous devez être un administrateur avec un email vérifié.`);
                } else if (status === 404) {
                    throw new Error("Endpoint de la liste d'utilisateurs non trouvé. Vérifiez l'URL de l'API.");
                } else {
                    throw new Error(`Erreur serveur (${status}): ${message}`);
                }
            } else if (error.request) {
                throw new Error("Aucune réponse du serveur. Vérifiez votre connexion internet.");
            } else {
                throw new Error(`Erreur de requête: ${error.message}`);
            }
        }
        throw new Error("Une erreur inattendue est survenue lors de la récupération des utilisateurs.");
    }
}

export const logoutUser = async () => {
  const refreshToken = Cookies.get("refresh_token");
  const accessToken = Cookies.get("access_token"); // Tu peux aussi avoir besoin de l'access token pour t'authentifier à la vue de logout

  // LOG DE DÉBOGAGE : Vérifie si les tokens sont présents avant de tenter la déconnexion
  console.log("Logout: Refresh Token found in cookie:", refreshToken ? "Yes" : "No");
  console.log("Logout: Access Token found in cookie:", accessToken ? "Yes" : "No");

  // Si aucun refresh token n'est trouvé, l'utilisateur est déjà "déconnecté" du côté client.
  // On procède au nettoyage des cookies au cas où.
  if (!refreshToken) {
    console.warn("No refresh token found. User likely already logged out or token expired.");
    // Nettoie tous les cookies liés à l'authentification pour être sûr
    Cookies.remove("access_token");
    Cookies.remove("refresh_token");
    Cookies.remove("adminSession");
    Cookies.remove("admin_email");
    Cookies.remove("user_email");
    Cookies.remove("mail_user"); // Supprime aussi le cookie mail_user
    Cookies.remove("UserSession");
    return; // Pas besoin de faire d'appel API si pas de refresh token
  }

  try {
    // Envoie le refresh token au backend pour le mettre sur liste noire.
    // L'en-tête Authorization avec l'access_token est nécessaire pour s'authentifier
    // auprès de la vue de logout qui a `permission_classes = [IsAuthenticated]`.
    await axiosAuth.post("/cars/logout/", {
      refresh: refreshToken,
    }, {
      headers: {
        Authorization: `Bearer ${accessToken}` // Utilise l'access token ici
      }
    });

    // LOG DE SUCCÈS : La requête backend a réussi
    console.log("Refresh token blacklisted successfully on server.");

  } catch (error: any) {
    // LOG D'ERREUR : Capture et affiche l'erreur, mais continue le nettoyage côté client
    console.error("Error blacklisting refresh token on server:", error.response?.data || error.message);
    // Note: Même en cas d'erreur côté serveur (ex: token déjà invalide),
    // il est crucial de nettoyer les tokens côté client.
  } finally {
    // Nettoie tous les cookies liés à l'authentification, qu'il y ait eu une erreur ou non
    console.log("Cleaning up authentication cookies...");
    Cookies.remove("access_token");
    Cookies.remove("refresh_token");
    Cookies.remove("adminSession");
    Cookies.remove("admin_email");
    Cookies.remove("user_email"); // Supprime aussi le cookie user_email
    console.log("All authentication cookies removed.");
  }

  // Optionnel : Rediriger l'utilisateur vers la page de connexion ou d'accueil
  // window.location.href = '/login';
};
