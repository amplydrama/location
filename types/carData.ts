// src/types/carData.ts

export interface CarData {
    // Champs renvoyés par votre API GET
    // (Utilisés pour l'affichage)
    model: string;
    brand: string;
    year: number;
    price_WDT: number
    price_WDO: number
    price_WODT: number
    price_WODO: number
    description: string;
    image: string ;
    slug?: string; // C'est l'identifiant unique de l'API, nous l'utiliserons pour 'key'
    // Autres champs de l'API GET
    location: string;
    immatriculation: string; // Nom de l'API pour la plaque
    fuel_type: string; // Nom de l'API pour le type de carburant
    seats: number;
    transmission: string;
    color: string;
    features: string[]; // <-- CORRECTED: This should be an array of strings
    available?: boolean; // Nom de l'API pour la disponibilité

    // Champs qui ne sont PAS directement renvoyés par l'API GET,
    // mais que votre UI s'attend à utiliser.
    // Nous leur donnerons des valeurs par défaut dans le composant.
    id?: string; // Optionnel, mais sera défini comme 'slug' pour React key
    type: string; // Type de véhicule (ex: Berline, SUV). Non fourni par l'API
    status?: string; // Statut du véhicule (ex: Disponible, Loué). Non fourni par l'API
    mileage?: number; // Kilométrage. Non fourni par l'API
    bookings?: number; // Nombre de réservations. Non fourni par l'API
    rating?: number; // Note moyenne. Non fourni par l'API
    insurance?: { // Informations d'assurance. Non fourni par l'API
        company: string;
        policyNumber: string;
        expiryDate: string;
    };
    maintenance?: { // Informations de maintenance. Non fourni par l'API
        lastService: string;
        nextService: string;
        status: string;
    };
}

export interface DisplayVehicle extends CarData {
    name: string; // Maps to model
    price: number; // Maps to price_per_day
    available?: boolean; // Derived from 'available' from API directly
    features: string[]; // <-- CORRECTED: This should also be an array of strings
}