



import axios from "axios";
import Cookies from "js-cookie";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;


const axiosInstance = axios.create({
    baseURL: apiUrl, // Utilise l'URL de l'API stockée dans l'env
    timeout: 10000,   // Timeout de 10 secondes pour chaque requête
  });
  
  // Ajouter un intercepteur pour injecter le token d'authentification
axiosInstance.interceptors.request.use(
    async (config) => {
      // Récupérer le token d'accès depuis les cookies
      const token = Cookies.get('access_token');
      
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
  
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Ajouter un intercepteur pour gérer les erreurs
axiosInstance.interceptors.response.use(
    response => response, // Si la réponse est valide, retourne-la
    async (error) => {
      // Vérifie si le token est expiré (code 401)
      if (error.response && error.response.status === 401) {
        // Token expiré ou invalide
  
        console.log('Token expiré ou invalide, tentative de rafraîchissement du token');
  
        // Essayer de rafraîchir le token
        const refreshToken = Cookies.get('refresh_token'); // Récupère le refresh token stocké
  
        if (!refreshToken){
          //Si aucun refresh token n'est trouvé, rediriger vers la page de connexion
          console.log('Aucun refresh token trouvé, redirection vers la page de login');
          window.location.href = '/login';
          return Promise.reject(error); // Ne continue pas l'exécution
        }

        try {
          // Faire une requête pour rafraîchir le token
          const response = await axios.post('http://localhost:8000/api/token/refresh/', {
            refresh: refreshToken,
          });
          
          // Sauvegarder le nouveau access token
          Cookies.set('access_token', response.data.access, { expires: 0.5 }); // Le token expire après 30 minutes (0.5 jours)
          // Si la requête réussie, on stocke le nouveau token et réessaie la requête initiale
          const newAccessToken = Cookies.get('access_token');
          console.log(newAccessToken)
          // Redemander la requête initiale avec le nouveau token
          error.config.headers['Authorization'] = `Bearer ${newAccessToken}`;
          
          // Retenter la requête avec le nouveau token

          return axiosInstance(error.config);
        } catch (refreshError) {
          // Si le rafraîchissement échoue, rediriger vers la page de login
          console.log('Échec du rafraîchissement du token, redirection vers la page de login');
          window.location.href = '/login';
          return Promise.reject(refreshError); // Refuser la promesse
        }
    }

    // Si l'erreur n'est pas liée au token expiré, propagée l'erreur
    return Promise.reject(error);
  }
);


export const axiosAuth  = axios.create({
  baseURL: apiUrl, // Utilise l'URL de l'API stockée dans l'env
  timeout: 10000,   // Timeout de 10 secondes pour chaque requête
});


export default axiosInstance;

