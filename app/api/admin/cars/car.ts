import { axiosAuth } from "@/utils/axios";
import axiosInstance from "@/utils/axios";
import { CarData } from "@/types/carData";

export async function createCar(carData: CarData) {
  const formData = new FormData();

  Object.entries(carData).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      formData.append(key, value);
    }
  });

  try {
    const response = await axiosInstance.post("/car/cars/", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { error: "Erreur lors de la création de la voiture" };
  }
}


export async function updateCar(carId: string, carData: CarData) {
  const formData = new FormData();

  Object.entries(carData).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      formData.append(key, value);
    }
  });

  try {
    const response = await axiosInstance.put(`/cars/${carId}/`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { error: "Erreur lors de la mise à jour de la voiture" };
  }
}

export async function getCar(){
    try {
        const response = await axiosAuth.get("/car/cars/");
        return response.data;
    }catch (error: any) {
        throw error.response?.data || { error: "Erreur lors de la récupération des voitures" };
    }

}

/**
 * Fetches a single car's data by its slug from the API.
 * @param {string} slug The unique slug identifier for the car.
 * @returns {Promise<CarData | null>} A promise that resolves to a CarData object or null if not found.
 * @throws {object} An error object with details if the API call fails.
 */
export async function getCarBySlug(slug: string): Promise<CarData | null> {
    try {
        const response = await axiosAuth.get(`/car/cars/${slug}/`); // Note the trailing slash if your DRF setup requires it
        return response.data;
    } catch (error: any) {
        // Specifically handle 404 Not Found if you want to return null instead of throwing for "not found"
        if (error.response && error.response.status === 404) {
            return null; // Return null if the car is not found
        }
        console.error(`Error fetching car with slug ${slug}:`, error);
        throw error.response?.data || { error: `Erreur lors de la récupération de la voiture ${slug}` };
    }
}



