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

export const getBooking = async () => {
  try {
    const response = await axiosInstance.get(`/reservation/reserve/`);
    return response.data;
  } catch (error: any) {
    console.error("Error fetching booking:", error.response?.data || error.message);
    throw {
      error: error.response?.data?.detail || "Erreur lors de la récupération de la réservation.",
      statusCode: error.response?.status,
    };
  }
};