// src/types/bookingData.ts (or wherever you keep your types)

// For the data you SEND to the backend to create a booking
export interface BookingCreatePayload {
  car: string | undefined;
  start_date: string; // YYYY-MM-DD
  end_date: string;   // YYYY-MM-DD
  estimated_total_price: number; // Frontend calculated price
  name: string;
  email: string;
  phone: string;
  address?: string; // Make address optional if it's not strictly required
  id_card: string;
  with_driver: boolean; // true if chauffeur is selected, false otherwise
  carname?: string; // Optional, if you want to send the car name too
}

export interface params_app {
  params: Promise<{ slug: string }>; // params is now a Promise
}
// For the data you RECEIVE from the backend after creating a booking
export interface BookingResponse {
  id: number; // The ID generated by the backend
  car: number | string; // Assuming it returns car ID or slug
  start_date: string;
  end_date: string;
  total_price: number; // The final, validated price from backend
  status: 'pending_payment' | 'confirmed' | 'cancelled' | 'completed' | 'expired'; // Possible statuses
  name: string;
  customer_email: string;
  customer_phone: string;
  customer_address: string | null;
  customer_id_number: string;
  created_at: string;
  updated_at: string;
  // ... any other fields returned by your Django BookingSerializer
}