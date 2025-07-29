import { axiosAuth } from "@/utils/axios";
import axiosInstance from "@/utils/axios";

interface RegisterData {
  email: string
  password: string
  phone_number : string
  first_name?: string
  username?: string
  [key: string]: any // pour d'autres champs éventuels
}

export async function register(data: RegisterData) {
  try {
    const response = await axiosAuth.post("cars/register/", data)
    return response.data
  } catch (error: any) {
    // Gestion d'erreur simple
    throw error.response?.data || { error: "Erreur lors de l'inscription" }
  }
}