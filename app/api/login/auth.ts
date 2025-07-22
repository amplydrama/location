import axiosInstance from "@/utils/axios";
import Cookies from "js-cookie";

export async function login(data: { email: string; password: string }) {
  try {
    const response = await axiosInstance.post("cars/login/", data);
    const { access_token, refresh_token } = response.data;
    console.log(response.data);
    // Définir les cookies avec une durée (ex: 1h pour access, 7j pour refresh)
    Cookies.set("access_token", access_token, { expires: 1 / 24, secure: true, sameSite: "Strict" }); // 1h
    Cookies.set("refresh_token", refresh_token, { expires: 7, secure: true, sameSite: "Strict" }); // 7 jours
    if(response.data.is_admin) {
      Cookies.set("adminSession", "true", { expires: 7, secure: true, sameSite: "Strict" });
    }
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { error: "Erreur lors de la connexion" };
  }
}

