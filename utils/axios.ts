// utils/axios.ts

import axios, { AxiosError, InternalAxiosRequestConfig } from "axios"; // Import InternalAxiosRequestConfig
import Cookies from "js-cookie";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

// Extend InternalAxiosRequestConfig to include our custom property
// This tells TypeScript that `__isRetryRequest` might exist on the config.
declare module 'axios' {
  interface InternalAxiosRequestConfig {
    __isRetryRequest?: boolean; // Make it optional
  }
}

const axiosInstance = axios.create({
  baseURL: apiUrl,
  timeout: 10000,
});

axiosInstance.interceptors.request.use(
  async (config) => {
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

axiosInstance.interceptors.response.use(
  response => response,
  async (error: AxiosError) => {
    // --- Type Guard for the 401 token refresh logic ---
    if (error.response && error.response.status === 401 && error.config && !error.config.__isRetryRequest) {
      // Mark the request to prevent infinite loops
      (error.config as InternalAxiosRequestConfig).__isRetryRequest = true; // Assert the type here

      console.log('Token expiré ou invalide, tentative de rafraîchissement du token');
      const refreshToken = Cookies.get('refresh_token');

      if (!refreshToken) {
        console.log('Aucun refresh token trouvé, redirection vers la page de login');
        window.location.href = '/login';
        return Promise.reject(new Error("Authentication required. Please log in."));
      }

      try {
        const refreshResponse = await axios.post(`${apiUrl}api/token/refresh/`, {
          refresh: refreshToken,
        });

        Cookies.set('access_token', refreshResponse.data.access, { expires: 0.5 }); // 30 minutes
        Cookies.set('refresh_token', refreshResponse.data.refresh, { expires: 7 }); // 7 days

        if (error.config.headers) {
            error.config.headers['Authorization'] = `Bearer ${refreshResponse.data.access}`;
        }
        
        return axiosInstance(error.config); // Retry the original request
      } catch (refreshError: any) {
        console.log('Échec du rafraîchissement du token, redirection vers la page de login');
        Cookies.remove('access_token');
        Cookies.remove('refresh_token');
        window.location.href = '/login';
        return Promise.reject(new Error("Failed to refresh token. Please log in again."));
      }
    }

    // --- Logic for other errors (400, 404, 500, etc.) ---
    let errorMessage = "Une erreur inconnue est survenue.";

    if (error.response) {
      const { data, status, statusText } = error.response;

      // Define a type for expected DRF error response structure
      interface DRFErrorData {
        detail?: string;
        non_field_errors?: string[];
        [key: string]: any; // Allow for other fields like 'start_date', 'end_date', etc.
      }

      // Type guard to narrow down 'data' to DRFErrorData
      function isDRFErrorData(value: any): value is DRFErrorData {
        return typeof value === 'object' && value !== null;
      }
      
      if (isDRFErrorData(data)) { // Use the type guard here
        if (typeof data === 'string') { // Check if it's a raw string error
          errorMessage = data;
        } else if (data.detail) { // Standard DRF 'detail' message
          errorMessage = data.detail;
        } else if (data.non_field_errors && Array.isArray(data.non_field_errors)) {
          errorMessage = `Erreur: ${data.non_field_errors.join(', ')}`;
        } else {
          // For field-specific validation errors (e.g., { "field_name": ["error message"] })
          const fieldErrors = Object.keys(data)
            .map(key => {
              const messages = Array.isArray(data[key]) ? data[key].join(', ') : data[key];
              // Ensure messages are not empty to avoid "key: "
              return messages ? `${key}: ${messages}` : '';
            })
            .filter(Boolean) // Filter out any empty strings from mapping
            .join('; ');
          
          if (fieldErrors) {
            errorMessage = `Erreur de validation: ${fieldErrors}`;
          } else {
            // If data is an object but doesn't match known patterns, stringify it
            errorMessage = `Erreur serveur (${status}): ${JSON.stringify(data)}`;
          }
        }
      } else {
        // Fallback if data is not an object (e.g., null, undefined, or unexpected primitive)
        errorMessage = `Erreur serveur (${status}): ${statusText || 'Réponse vide ou inattendue'}`;
      }
    } else if (error.request) {
      // The request was made but no response was received (e.g., network down)
      errorMessage = "Erreur réseau: Impossible d'atteindre le serveur. Vérifiez votre connexion internet.";
    } else {
      // Something happened in setting up the request that triggered an Error
      errorMessage = `Erreur de requête: ${error.message}`;
    }

    // Reject a new Error with the detailed message
    return Promise.reject(new Error(errorMessage));
  }
);

export const axiosAuth = axios.create({
  baseURL: apiUrl,
  timeout: 10000,
});

export default axiosInstance;