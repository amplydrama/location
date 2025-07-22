import axiosInstance from "@/utils/axios";

export async function verifyEmail(token: string) {
  try {
    const response = await axiosInstance.post("cars/verify-email/", { token });
    return response.data;
  } catch (error: any) {
    // Gestion d'erreur simple
    throw error.response?.data || { error: "Erreur lors de la vérification de l'email" };
  }
}