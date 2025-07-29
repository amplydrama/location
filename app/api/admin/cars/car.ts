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


export async function updateCar(carId: string | undefined , carData: CarData | null) { // <<< IMPORTANT : carData peut être null
  if (!carData) { // Vérification ajoutée pour s'assurer que carData n'est pas null
    throw new Error("Les données du véhicule sont manquantes.");
  }

  const formData = new FormData();

  Object.entries(carData).forEach(([key, value]) => {
    // Vérifier si la valeur n'est pas undefined, null, ET qu'elle est d'un type gérable par FormData.append
    // Pour les objets non-Blob/File qui ne sont pas des primitives, on les convertit en JSON string.
    if (value !== undefined && value !== null) {
      if (typeof value === 'object' && value !== null && !(value instanceof Blob) && !(value instanceof File)) {
        // Si c'est un objet (mais pas un Blob/File), convertissez-le en chaîne JSON.
        // Cela est crucial pour des objets complexes comme 'features' si elles sont stockées en objet ou tableau.
        // Par exemple, si features est un tableau ['GPS', 'AC'], il sera transformé en "[\"GPS\",\"AC\"]"
        formData.append(key, JSON.stringify(value));
      } else if (typeof value === 'boolean') {
        // Les booléens doivent être convertis en string
        formData.append(key, value.toString());
      }
      else {
        // Pour les strings, numbers, Files, Blobs
        formData.append(key, value as string | Blob); // Cast pour aider TypeScript, car `value` est `unknown` ici.
      }
    }
  });

  try {
    const response = await axiosInstance.put(`/car/cars/${carId}/`, formData, {
      headers: {
        // Ne définissez PAS "Content-Type" manuellement pour FormData si vous utilisez Axios.
        // Axios et le navigateur le définiront correctement, y compris la 'boundary'.
        // Le laisser commenté ou le retirer est la meilleure pratique ici.
        // "Content-Type": "multipart/form-data",
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
export async function getCarBySlug(slug: string | undefined): Promise<CarData | null> {
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



