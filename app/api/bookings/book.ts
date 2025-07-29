// src/app/api/bookings/bookingApi.ts

import axiosInstance from "@/utils/axios";
import { axiosAuth } from "@/utils/axios";
import { BookingCreatePayload, BookingResponse } from "@/types/Booking"; // Import new type names

export const createBooking = async (bookingData: BookingCreatePayload): Promise<BookingResponse> => {
  try {
    const response = await axiosInstance.post<BookingResponse>("/reservation/reserve/", bookingData);
    return response.data;
  } catch (error: any) {
    console.error("Error creating booking:", error.response?.data || error.message);
    throw {
      error: error.response?.data?.detail || "Erreur lors de la création de la réservation.",
      statusCode: error.response?.status,
    };
  }
};


export const getBooking = async (email?: string, limit?: number) => { // Ajoutez 'email' comme paramètre optionnel
  try {
    // Créez un objet pour les paramètres de requête.
    // Utilisez un type plus flexible pour les paramètres.
    const params: { email?: string; limit?: number } = {}; 

    if (email !== undefined) { // Si 'email' est fourni
      params.email = email;   // Ajoutez-le aux paramètres
    }

    if (limit !== undefined) { // Si 'limit' est fourni
      params.limit = limit;   // Ajoutez-le aux paramètres
    }

    // Utilisez l'objet params dans la requête GET d'Axios.
    // Axios gérera automatiquement l'ajout des paramètres à l'URL (ex: /reservation/reserve/?email=test@example.com&limit=10).
    const response = await axiosInstance.get(`/reservation/reserve/`, { params });
    return response.data;
  } catch (error: any) {
    console.error("Error fetching booking:", error.response?.data || error.message);
    throw {
      error: error.response?.data?.detail || "Erreur lors de la récupération de la réservation.",
      statusCode: error.response?.status,
    };
  }
};

export async function getMostReservedCars(limit = 5) {
  try {
    const response = await axiosInstance.get(`/car/cars/most_reserved_cars/`, {
      params: {
        limit: limit,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des voitures les plus réservées:", error);
    // Gérer l'erreur plus spécifiquement si nécessaire (ex: afficher un message à l'utilisateur)
    throw error; // Propage l'erreur pour que le composant appelant puisse la gérer
  }
}

/**
 * Définit une période d'indisponibilité pour un véhicule spécifique.
 *
 * @param {object} payload - Les données de la période d'indisponibilité.
 * @param {number} payload.car - L'ID du véhicule concerné.
 * @param {string} payload.start_date - La date de début de l'indisponibilité (format 'YYYY-MM-DD').
 * @param {string} payload.end_date - La date de fin de l'indisponibilité (format 'YYYY-MM-DD').
 * @param {string} payload.reason - La raison de l'indisponibilité (ex: 'Maintenance', 'Nettoyage').
 * @returns {Promise<any>} Une promesse qui se résout avec les données de la réponse API en cas de succès.
 * @throws {Error} Lance une erreur si la requête échoue.
 */
export async function createAvailability(payload: {
  car: number;
  start_date: string;
  end_date: string;
  reason: string;
}): Promise<any> {
  try {
    const response = await axiosInstance.post('/availability/create/', payload); // Ajustez l'URL de votre endpoint Django
    return response.data; // Retourne les données de succès de l'API
  } catch (error: any) {
    console.error("Erreur lors de la création de l'indisponibilité:", error.response?.data || error.message);
    // Relancez l'erreur, potentiellement avec un message plus convivial provenant du backend
    throw error.response?.data || new Error("Une erreur inattendue est survenue lors de la création de l'indisponibilité.");
  }
}