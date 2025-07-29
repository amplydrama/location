"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Car, Plus, Edit, Eye, MapPin, Fuel, Users, Settings, Euro } from "lucide-react" // Ajout de l'icône Euro pour les prix
import { ImageUpload } from "@/components/ui/image-upload"
import { createCar, getCar,updateCar } from "@/app/api/admin/cars/car"
import { CarData,EditCarData } from "@/types/carData" // Importez CarData depuis son emplacement réel
import toast from "react-hot-toast" // Assurez-vous d'avoir installé react-hot-toast pour les notifications

// Importation des composants Popover pour l'affichage des prix détaillés
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"


const normalizeFeatures = (features: string[] | string | undefined | null): string[] => {
    // Cas de base : si les features sont null, undefined, ou une chaîne vide, on retourne un tableau vide.
    if (!features || (typeof features === 'string' && features.length === 0)) {
        return [];
    }

    let tempFeatures: string[] = [];

    // Cas 1: Si 'features' est un tableau
    if (Array.isArray(features)) {
        // Nous parcourons chaque élément du tableau.
        // Un élément peut être "Climatisation" ou "Climatisation,GPS"
        features.forEach(item => {
            if (item && item.includes(',')) {
                // Si l'élément est une chaîne contenant des virgules (ex: "Climatisation,GPS")
                // On la divise et ajoute les parties à notre tableau temporaire.
                tempFeatures.push(...item.split(',').map(f => f.trim()).filter(f => f.length > 0));
            } else if (item) {
                // Si l'élément est une chaîne simple (ex: "Climatisation")
                // On l'ajoute directement (après nettoyage)
                tempFeatures.push(item.trim());
            }
        });
    }
    // Cas 2: Si 'features' est une simple chaîne de caractères (par exemple, si l'API renvoie directement "Climatisation,GPS")
    // Ceci est moins probable si vous avez confirmé que c'est TOUJOURS un tableau, mais c'est une sécurité.
    else if (typeof features === 'string') {
        tempFeatures.push(...features.split(',').map(f => f.trim()).filter(f => f.length > 0));
    }

    // Après avoir traité tous les cas, on s'assure qu'il n'y a pas de doublons
    // et on retourne le tableau final.
    return Array.from(new Set(tempFeatures)).filter(f => f.length > 0);
};


export default function VehiclesPage() {
    const [vehicles, setVehicles] = useState<CarData[]>([])
    const [filteredVehicles, setFilteredVehicles] = useState<CarData[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    
    const [searchTerm, setSearchTerm] = useState("")
    const [statusFilter, setStatusFilter] = useState("all")
    const [typeFilter, setTypeFilter] = useState("all")
    const [selectedVehicle, setSelectedVehicle] = useState<CarData | null>(null)
    const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
    const [vehicleImages, setVehicleImages] = useState<string>("") // Pour l'URL de l'image

    // États spécifiques pour la modale d'édition
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [editedVehicle, setEditedVehicle] = useState<CarData | null>(null);
        
    // `newVehicle` pour le formulaire d'ajout, avec les nouveaux champs de prix
    const [newVehicle, setNewVehicle] = useState({
        brand: "",
        model: "",
        year: "",
        type: "",
        plate: "",
        color: "",
        seats: "",
        transmission: "",
        fuelType: "",
        // Ce champ pourrait devenir le prix par défaut ou être retiré si les 4 nouveaux sont exclusifs
        location: "",
        description: "",
        features: [] as string[],
        images: "",
        status: "Disponible",
        // Nouveaux champs de prix
        price_WDT: "", // prix avec chauffeur dans la ville
        price_WDO: "", // prix avec chauffeur hors de la ville
        price_WODT: "", // prix sans chauffeur et dans la ville
        price_WODO: "", // prix sans chauffeur et hors de la ville
    })

    // --- EFFET POUR LA RÉCUPÉRATION INITIALE DES VÉHICULES ---
    useEffect(() => {
        const fetchVehicles = async () => {
            try {
                setIsLoading(true);
                setError(null);
                const response = await getCar();
                console.log("Réponse complète de l'API getCar:", response);
                
                // Assurez-vous que response.data est bien un tableau de CarData
                if (response && Array.isArray(response.data)) { // Assumer que getCar retourne { data: CarData[] }
                    setVehicles(response.data);
                    setFilteredVehicles(response.data);
                } else if (Array.isArray(response)) { // Fallback si getCar retourne directement CarData[]
                    setVehicles(response);
                    setFilteredVehicles(response);
                }
                else {
                    console.error("L'API n'a pas renvoyé un tableau de véhicules:", response);
                    setError("Format de données inattendu de l'API.");
                }
            } catch (err: any) {
                console.error("Erreur lors de la récupération des véhicules:", err);
                setError("Impossible de charger les véhicules. " + (err.message || "Veuillez réessayer plus tard."));
            } finally {
                setIsLoading(false);
            }
        };

        fetchVehicles();
    }, []);

    
    // --- EFFET POUR LE FILTRAGE DES VÉHICULES (DÉPEND DES FILTRES ET DES DONNÉES BRUTES) ---
    useEffect(() => {
        let currentFiltered = Array.isArray(vehicles) ? [...vehicles] : [];

        if (searchTerm) {
            currentFiltered = currentFiltered.filter(
                (vehicle) =>
                    vehicle.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    (vehicle.immatriculation && vehicle.immatriculation.toLowerCase().includes(searchTerm.toLowerCase())) ||
                    vehicle.brand.toLowerCase().includes(searchTerm.toLowerCase()),
            )
        }
        if (statusFilter !== "all") {
            currentFiltered = currentFiltered.filter((vehicle) => vehicle.status === statusFilter)
        }
        if (typeFilter !== "all") {
            currentFiltered = currentFiltered.filter((vehicle) => vehicle.type === typeFilter)
        }
        setFilteredVehicles(currentFiltered)
    }, [searchTerm, statusFilter, typeFilter, vehicles])

    const getStatusBadge = (status: string | undefined) => { // status peut être undefined
        if (!status) return <Badge variant="outline">Inconnu</Badge>; // Gérer le cas undefined
        switch (status) {
            case "Disponible":
                return <Badge className="bg-green-100 text-green-800">Disponible</Badge>
            case "Loué":
                return <Badge className="bg-blue-100 text-blue-800">Loué</Badge>
            case "Maintenance":
                return <Badge className="bg-yellow-100 text-yellow-800">Maintenance</Badge>
            case "Hors service":
                return <Badge className="bg-red-100 text-red-800">Hors service</Badge>
            default:
                return <Badge variant="outline">{status}</Badge>
        }
    }

    const getMaintenanceStatusBadge = (status: string | undefined) => { // status peut être undefined
        if (!status) return <Badge variant="outline">Inconnu</Badge>; // Gérer le cas undefined
        switch (status) {
            case "À jour":
                return <Badge className="bg-green-100 text-green-800">À jour</Badge>
            case "Bientôt dû":
                return <Badge className="bg-yellow-100 text-yellow-800">Bientôt dû</Badge>
            case "En retard":
                return <Badge className="bg-red-100 text-red-800">En retard</Badge>
            case "En cours":
                return <Badge className="bg-blue-100 text-blue-800">En cours</Badge>
            default:
                return <Badge variant="outline">{status}</Badge>
        }
    }

    const handleViewVehicle = (vehicle: CarData) => {
        setSelectedVehicle(vehicle)
        setIsViewDialogOpen(true)
    }

    const handleViewEditVehicle = (vehicle: CarData) => {
        setEditedVehicle(vehicle)
        setIsEditDialogOpen(true)
    }

    const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setEditedVehicle(prev => {
        if (!prev) return null;
        return { ...prev, [id]: value };
    });
};

const handleSelectChange = (id: string, value: string) => {
    setEditedVehicle(prev => {
        if (!prev) return null;
        return { ...prev, [id]: value };
    });
};

    const handleEditFeaturesChange = (feature: string, isChecked: boolean) => {
        setEditedVehicle(prev => {
            if (!prev) return null;
            const currentFeatures = normalizeFeatures(prev.features); // Utilise la fonction de normalisation

            let updatedFeatures: string[];
            if (isChecked) {
                updatedFeatures = [...currentFeatures, feature];
            } else {
                updatedFeatures = currentFeatures.filter(f => f !== feature);
            }
            // IMPORTANT : décidez si vous voulez enregistrer 'features' en tant que tableau ou chaîne
            // Si votre backend attend une chaîne unique (ex: "Climatisation,GPS"), faites :
            // return { ...prev, features: updatedFeatures.join(',') };
            // Si votre backend attend un tableau de chaînes (ex: ["Climatisation", "GPS"]), faites :
            return { ...prev, features: updatedFeatures };
        });
    };

    // Assurez-vous que cette fonction est placée dans la portée de votre composant principal
    const handleImageChange = (newImageUrl: string) => { // <-- CHANGEMENT ICI : 'newImageUrl' est maintenant une string
        setEditedVehicle(prev => {
            if (!prev) return null;
            // Puisque ImageUpload émet une seule string, nous l'assignons directement.
            return { ...prev, image: newImageUrl || '' }; // Utilisation directe de newImageUrl
        });
    };

    const handleSaveEdit = async (e: React.FormEvent) => { // <<< Rendre la fonction async
    e.preventDefault(); // Empêche le rechargement de la page

    if (!editedVehicle || !editedVehicle.slug) {
        console.error("Impossible d'enregistrer: Véhicule édité ou slug manquant.");
        return;
    }

    const id = editedVehicle.slug; // Utiliser editedVehicle.slug comme ID

    try {
        // Appeler la fonction updateCar et ATTENDRE sa réponse
        const updatedCarResponse = await updateCar(id, editedVehicle);

    
        setVehicles(prevCars =>
            prevCars.map(car =>
                car.slug === id ? updatedCarResponse : car // Remplace le véhicule par la version mise à jour
            )
        );

        setIsEditDialogOpen(false); // Ferme la modale
        toast.success("Véhicule mis à jour avec succès !"); // Si vous utilisez une bibliothèque de toasts

    } catch (error) {
        console.error("Erreur lors de la mise à jour du véhicule:", error);
    
        toast.error("Échec de la mise à jour du véhicule."); // Si vous utilisez une bibliothèque de toasts
    }
};
    
    const handleAddVehicle = async (e: React.FormEvent) => {
        e.preventDefault()
        
        // Préparer les données pour l'API, incluant les 4 nouveaux prix
        const payload: CarData = {
            model: newVehicle.model,
            year: newVehicle.year ? Number.parseInt(newVehicle.year) : 0,
            description: newVehicle.description,
            image: vehicleImages,
            location: newVehicle.location,
            immatriculation: newVehicle.plate,
            fuel_type: newVehicle.fuelType,
            seats: newVehicle.seats ? Number.parseInt(newVehicle.seats) : 0,
            transmission: newVehicle.transmission,
            color: newVehicle.color,
            brand: newVehicle.brand,
            features: newVehicle.features,
            type: newVehicle.type,
            status: newVehicle.status,
            // Conversion des nouveaux champs de prix en nombres
            price_WDT: newVehicle.price_WDT ? Number.parseFloat(newVehicle.price_WDT) : 0,
            price_WDO: newVehicle.price_WDO ? Number.parseFloat(newVehicle.price_WDO) : 0,
            price_WODT: newVehicle.price_WODT ? Number.parseFloat(newVehicle.price_WODT) : 0,
            price_WODO: newVehicle.price_WODO ? Number.parseFloat(newVehicle.price_WODO) : 0,
        }

        try {
            console.log("Ajout du véhicule (payload envoyé):", payload)
            const response = await createCar(payload)
            console.log("Véhicule ajouté avec succès:", response.data)
            setIsAddDialogOpen(false)
            
            // Re-fetcher les véhicules après un ajout réussi pour mettre à jour la liste
            const updatedVehiclesResponse = await getCar();
            if (updatedVehiclesResponse && Array.isArray(updatedVehiclesResponse.data)) {
                setVehicles(updatedVehiclesResponse.data);
                setFilteredVehicles(updatedVehiclesResponse.data);
            } else if (Array.isArray(updatedVehiclesResponse)) {
                setVehicles(updatedVehiclesResponse);
                setFilteredVehicles(updatedVehiclesResponse);
            }

            // Réinitialiser le formulaire
            setNewVehicle({
                brand: "", model: "", year: "", type: "", plate: "", color: "", seats: "", transmission: "", fuelType: "", location: "", description: "", features: [],
                images: "",
                status: "Disponible",
                price_WDT: "", price_WDO: "", price_WODT: "", price_WODO: "", // Réinitialisation des nouveaux prix
            });
            setVehicleImages("");
            toast.success("Véhicule ajouter avec success!");
        } catch (error: any) {
            console.error("Erreur lors de l'ajout du véhicule:", error)
            toast.error("echec de l'ajout du Véhicule!");
        }
    }
    

    
    
    // --- RENDU CONDITIONNEL POUR LE CHARGEMENT ET LES ERREURS ---
    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-xl text-gray-700">Chargement des véhicules...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-xl text-red-600">{error}</p>
            </div>
        );
    }
    // --- FIN RENDU CONDITIONNEL ---

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Gestion des véhicules</h1>
                    <p className="text-gray-600">Gérez votre flotte de véhicules</p>
                </div>
                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Ajouter un véhicule
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                        <DialogHeader>
                            <DialogTitle>Ajouter un nouveau véhicule</DialogTitle>
                            <DialogDescription>Remplissez les informations du véhicule à ajouter à votre flotte.</DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleAddVehicle}>
                            <div className="grid gap-4 py-4 max-h-96 overflow-y-auto pr-4">
                                {/* Champ "Modèle" qui servira de nom */}
                                <div className="space-y-2">
                                    <Label htmlFor="model">Modèle du véhicule</Label>
                                    <Input
                                        id="model"
                                        value={newVehicle.model}
                                        onChange={(e) => setNewVehicle({ ...newVehicle, model: e.target.value })}
                                        placeholder="Modèle (ex: Corolla)"
                                        required
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="brand">Marque</Label>
                                        <Input
                                            id="brand"
                                            value={newVehicle.brand}
                                            onChange={(e) => setNewVehicle({ ...newVehicle, brand: e.target.value })}
                                            placeholder="Toyota"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="year">Année</Label>
                                        <Input
                                            id="year"
                                            type="number"
                                            value={newVehicle.year}
                                            onChange={(e) => setNewVehicle({ ...newVehicle, year: e.target.value })}
                                            placeholder="2023"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="type">Type</Label>
                                        <Select
                                            value={newVehicle.type}
                                            onValueChange={(value) => setNewVehicle({ ...newVehicle, type: value })}
                                            required
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Sélectionner le type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Berline">Berline</SelectItem><SelectItem value="SUV">SUV</SelectItem>
                                                <SelectItem value="Économique">Économique</SelectItem><SelectItem value="Pick-up">Pick-up</SelectItem>
                                                <SelectItem value="Citadine">Citadine</SelectItem><SelectItem value="Luxe">Luxe</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="plate">Plaque d'immatriculation</Label>
                                        <Input
                                            id="plate"
                                            value={newVehicle.plate}
                                            onChange={(e) => setNewVehicle({ ...newVehicle, plate: e.target.value })}
                                            placeholder="LT-123-CM"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="color">Couleur</Label>
                                        <Input
                                            id="color"
                                            value={newVehicle.color}
                                            onChange={(e) => setNewVehicle({ ...newVehicle, color: e.target.value })}
                                            placeholder="Blanc"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="seats">Nombre de places</Label>
                                        <Input
                                            id="seats"
                                            type="number"
                                            value={newVehicle.seats}
                                            onChange={(e) => setNewVehicle({ ...newVehicle, seats: e.target.value })}
                                            placeholder="5"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="transmission">Transmission</Label>
                                        <Select
                                            value={newVehicle.transmission}
                                            onValueChange={(value) => setNewVehicle({ ...newVehicle, transmission: value })}
                                            required
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Manuelle">Manuelle</SelectItem><SelectItem value="Automatique">Automatique</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="fuelType">Carburant</Label>
                                        <Select
                                            value={newVehicle.fuelType}
                                            onValueChange={(value) => setNewVehicle({ ...newVehicle, fuelType: value })}
                                            required
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Essence">Essence</SelectItem><SelectItem value="Diesel">Diesel</SelectItem>
                                                <SelectItem value="Hybride">Hybride</SelectItem><SelectItem value="Électrique">Électrique</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                {/* Nouveaux champs de prix */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="price_WDT">Prix avec chauffeur (Ville)</Label>
                                        <Input
                                            id="price_WDT"
                                            type="number"
                                            value={newVehicle.price_WDT}
                                            onChange={(e) => setNewVehicle({ ...newVehicle, price_WDT: e.target.value })}
                                            placeholder="Ex: 30000"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="price_WDO">Prix avec chauffeur (Hors Ville)</Label>
                                        <Input
                                            id="price_WDO"
                                            type="number"
                                            value={newVehicle.price_WDO}
                                            onChange={(e) => setNewVehicle({ ...newVehicle, price_WDO: e.target.value })}
                                            placeholder="Ex: 45000"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="price_WODT">Prix sans chauffeur (Ville)</Label>
                                        <Input
                                            id="price_WODT"
                                            type="number"
                                            value={newVehicle.price_WODT}
                                            onChange={(e) => setNewVehicle({ ...newVehicle, price_WODT: e.target.value })}
                                            placeholder="Ex: 20000"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="price_WODO">Prix sans chauffeur (Hors Ville)</Label>
                                        <Input
                                            id="price_WODO"
                                            type="number"
                                            value={newVehicle.price_WODO}
                                            onChange={(e) => setNewVehicle({ ...newVehicle, price_WODO: e.target.value })}
                                            placeholder="Ex: 35000"
                                            required
                                        />
                                    </div>
                                </div>
                                {/* Fin des nouveaux champs de prix */}
                                <div className="space-y-2">
                                    <Label htmlFor="location">Localisation</Label>
                                    <Select
                                        value={newVehicle.location}
                                        onValueChange={(value) => setNewVehicle({ ...newVehicle, location: value })}
                                        required
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Sélectionner la ville" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Douala">Douala</SelectItem><SelectItem value="Yaoundé">Yaoundé</SelectItem>
                                            <SelectItem value="Bafoussam">Bafoussam</SelectItem><SelectItem value="Bamenda">Bamenda</SelectItem>
                                            <SelectItem value="Garoua">Garoua</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Équipements</Label>
                                    <div className="flex flex-wrap gap-3">
                                      {["Climatisation", "GPS", "Assistance", "Bluetooth", "Caméra de recul", "Sièges chauffants", "ABS", "Airbags"].map((feature) => (
                                        <label key={feature} className="flex items-center gap-1 text-sm cursor-pointer">
                                          <input
                                            type="checkbox"
                                            checked={newVehicle.features.includes(feature)}
                                            onChange={(e) => {
                                              if (e.target.checked) {
                                                setNewVehicle({ ...newVehicle, features: [...newVehicle.features, feature] });
                                              } else {
                                                setNewVehicle({ ...newVehicle, features: newVehicle.features.filter(f => f !== feature) });
                                              }
                                            }}
                                          />
                                          {feature}
                                        </label>
                                      ))}
                                    </div>
                                  </div>
                                <div className="space-y-2">
                                    <Label htmlFor="description">Description</Label>
                                    <Textarea
                                        id="description"
                                        value={newVehicle.description}
                                        onChange={(e) => setNewVehicle({ ...newVehicle, description: e.target.value })}
                                        placeholder="Description du véhicule..."
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Images du véhicule</Label>
                                    <ImageUpload images={vehicleImages} onImagesChange={setVehicleImages}/>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                                    Annuler
                                </Button>
                                <Button type="submit">Ajouter</Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Statistiques rapides */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Total véhicules</p>
                                <p className="text-2xl font-bold">{Array.isArray(vehicles) ? vehicles.length : 0}</p>
                            </div>
                            <Car className="h-8 w-8 text-blue-600" />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Disponibles</p>
                                <p className="text-2xl font-bold">{Array.isArray(vehicles) ? vehicles.filter((v) => v.status === "Disponible").length : 0}</p>
                            </div>
                            <Car className="h-8 w-8 text-green-600" />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">En location</p>
                                <p className="text-2xl font-bold">{Array.isArray(vehicles) ? vehicles.filter((v) => v.status === "Loué").length : 0}</p>
                            </div>
                            <Car className="h-8 w-8 text-blue-600" />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Maintenance</p>
                                <p className="text-2xl font-bold">{Array.isArray(vehicles) ? vehicles.filter((v) => v.status === "Maintenance").length : 0}</p>
                            </div>
                            <Settings className="h-8 w-8 text-yellow-600" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Filtres et recherche */}
            <Card>
                <CardContent className="p-4">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1">
                            <Input
                                placeholder="Rechercher par modèle, plaque ou marque..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-full md:w-48">
                                <SelectValue placeholder="Filtrer par statut" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Tous les statuts</SelectItem><SelectItem value="Disponible">Disponible</SelectItem>
                                <SelectItem value="Loué">Loué</SelectItem><SelectItem value="Maintenance">Maintenance</SelectItem>
                                <SelectItem value="Hors service">Hors service</SelectItem></SelectContent>
                        </Select>
                        <Select value={typeFilter} onValueChange={setTypeFilter}>
                            <SelectTrigger className="w-full md:w-48">
                                <SelectValue placeholder="Filtrer par type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Tous les types</SelectItem><SelectItem value="Berline">Berline</SelectItem>
                                <SelectItem value="SUV">SUV</SelectItem><SelectItem value="Économique">Économique</SelectItem>
                                <SelectItem value="Pick-up">Pick-up</SelectItem><SelectItem value="Citadine">Citadine</SelectItem>
                                <SelectItem value="Luxe">Luxe</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Grille des véhicules */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.isArray(filteredVehicles) && filteredVehicles.length > 0 ? (
                    filteredVehicles.map((vehicle) => (
                        <Card key={vehicle.id || vehicle.immatriculation} className="overflow-hidden">
                            <div className="aspect-video bg-gray-100 relative">
                                <img
                                    src={vehicle.image || "/placeholder.svg"}
                                    alt={vehicle.model}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute top-2 right-2">{getStatusBadge(vehicle.status)}</div>
                            </div>
                            <CardContent className="p-4">
                                <div className="space-y-2">
                                    <div className="flex justify-between items-start">
                                        <h3 className="font-semibold text-lg">{vehicle.model}</h3>
                                        <Popover>
                                          <PopoverTrigger asChild>
                                        <div className="text-right flex items-center block gap-2 cursor-pointer bg-gray-100 p-2 rounded">
                                            {/* Affichage du prix principal (price_per_day ou un des nouveaux prix) */}
                                            <div className="font-bold text-blue-600">
                                                Les prix 
                                            </div>
                                            <div className="text-xs text-gray-500">par jour</div>

                                            {/* Popover pour afficher les différents prix */}
                                            
                                                
                                                    <Button variant="ghost" size="icon" className="bg-green h-6 w-6">
                                                        <span className="text-gray-500 font-bold text-xs">FCFA</span>
                                                    </Button>
                                                
                                                <PopoverContent className="w-auto p-2 text-sm">
                                                    <div className="font-semibold mb-1">Tarifs par jour:</div>
                                                    {vehicle.price_WDT !== undefined && (
                                                        <div className="flex justify-between items-center py-0.5">
                                                            <span>Avec Chauffeur (Ville):</span>
                                                            <span className="font-medium">{vehicle.price_WDT.toLocaleString()} FCFA</span>
                                                        </div>
                                                    )}
                                                    {vehicle.price_WDO !== undefined && (
                                                        <div className="flex justify-between items-center py-0.5">
                                                            <span>Avec Chauffeur (Hors Ville):</span>
                                                            <span className="font-medium">{vehicle.price_WDO.toLocaleString()} FCFA</span>
                                                        </div>
                                                    )}
                                                    {vehicle.price_WODT !== undefined && (
                                                        <div className="flex justify-between items-center py-0.5">
                                                            <span>Sans Chauffeur (Ville):</span>
                                                            <span className="font-medium">{vehicle.price_WODT.toLocaleString()} FCFA</span>
                                                        </div>
                                                    )}
                                                    {vehicle.price_WODO !== undefined && (
                                                        <div className="flex justify-between items-center py-0.5">
                                                            <span>Sans Chauffeur (Hors Ville):</span>
                                                            <span className="font-medium">{vehicle.price_WODO.toLocaleString()} FCFA</span>
                                                        </div>
                                                    )}                
                                                    {(vehicle.price_WDT === undefined && vehicle.price_WDO === undefined &&
                                                      vehicle.price_WODT === undefined && vehicle.price_WODO === undefined ) && (
                                                        <div className="text-gray-500">Aucun prix détaillé disponible.</div>
                                                    )}
                                                </PopoverContent>
                                            
                                        </div>
                                        </PopoverTrigger>
                                        </Popover>
                                    </div>
                                    <div className="text-sm text-gray-600">
                                        {vehicle.year} • {vehicle.immatriculation}
                                    </div>
                                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                                        <div className="flex items-center">
                                            <Users className="h-4 w-4 mr-1" />
                                            {vehicle.seats}
                                        </div>
                                        <div className="flex items-center">
                                            <Fuel className="h-4 w-4 mr-1" />
                                            {vehicle.fuel_type}
                                        </div>
                                        <div className="flex items-center">
                                            <MapPin className="h-4 w-4 mr-1" />
                                            {vehicle.location}
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center pt-2">
                                        <div className="text-sm">
                                            <div className="font-medium">{vehicle.bookings || 0} réservations</div>
                                            <div className="text-gray-500">Note: {vehicle.rating || 0}/5</div>
                                        </div>
                                        <div className="flex space-x-2">
                                            <Button variant="ghost" size="sm" onClick={() => handleViewVehicle(vehicle)}>
                                                <Eye className="h-4 w-4" />
                                            </Button>
                                            <Button variant="ghost" size="sm" onClick={() => handleViewEditVehicle(vehicle)}>
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    <p className="text-center text-gray-500 col-span-full">Aucun véhicule trouvé correspondant aux critères.</p>
                )}
            </div>

            {/* Dialog de détails du véhicule */}
            <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>{selectedVehicle?.model}</DialogTitle>
                        <DialogDescription>Informations détaillées du véhicule</DialogDescription>
                    </DialogHeader>
                    {selectedVehicle && (
                        <div className="grid gap-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <img
                                        src={selectedVehicle.image || "/placeholder.svg"}
                                        alt={selectedVehicle.model}
                                        className="w-full h-48 object-cover rounded-lg"
                                    />
                                    <div className="grid grid-cols-2 gap-4">
                                        <Card>
                                            <CardContent className="p-3">
                                                <div className="text-center">
                                                    <div className="text-2xl font-bold text-blue-600">{selectedVehicle.bookings || 0}</div>
                                                    <div className="text-sm text-gray-500">Réservations</div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                        <Card>
                                            <CardContent className="p-3">
                                                <div className="text-center">
                                                    <div className="text-2xl font-bold text-green-600">{selectedVehicle.rating || 0}</div>
                                                    <div className="text-sm text-gray-500">Note moyenne</div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <Card>
                                        <CardHeader className="pb-3">
                                            <CardTitle className="text-sm">Informations générales</CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-2">
                                            <div className="grid grid-cols-2 gap-2 text-sm">
                                                <div>
                                                    <span className="font-medium">Marque:</span> {selectedVehicle.brand}
                                                </div>
                                                <div>
                                                    <span className="font-medium">Modèle:</span> {selectedVehicle.model}
                                                </div>
                                                <div>
                                                    <span className="font-medium">Année:</span> {selectedVehicle.year}
                                                </div>
                                                <div>
                                                    <span className="font-medium">Type:</span> {selectedVehicle.type}
                                                </div>
                                                <div>
                                                    <span className="font-medium">Couleur:</span> {selectedVehicle.color}
                                                </div>
                                                <div>
                                                    <span className="font-medium">Places:</span> {selectedVehicle.seats}
                                                </div>
                                                <div>
                                                    <span className="font-medium">Transmission:</span> {selectedVehicle.transmission}
                                                </div>
                                                <div>
                                                    <span className="font-medium">Carburant:</span> {selectedVehicle.fuel_type}
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                    <Card>
                                        <CardHeader className="pb-3">
                                            <CardTitle className="text-sm">Statut et localisation</CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-2">
                                            <div className="flex justify-between">
                                                <span className="text-sm">Statut:</span>
                                                {getStatusBadge(selectedVehicle.status)}
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-sm">Localisation:</span>
                                                <span className="text-sm">{selectedVehicle.location}</span>
                                            </div>
                                            {selectedVehicle.mileage !== undefined && (
                                                <div className="flex justify-between">
                                                    <span className="text-sm">Kilométrage:</span>
                                                    <span className="text-sm">{selectedVehicle.mileage.toLocaleString()} km</span>
                                                </div>
                                            )}
                                            {/* Affichage des nouveaux prix dans la popup de détails */}
                                            {selectedVehicle.price_WDT !== undefined && (
                                                <div className="flex justify-between">
                                                    <span className="text-sm">Prix avec chauffeur (Ville):</span>
                                                    <span className="text-sm font-medium">{selectedVehicle.price_WDT.toLocaleString()} FCFA</span>
                                                </div>
                                            )}
                                            {selectedVehicle.price_WDO !== undefined && (
                                                <div className="flex justify-between">
                                                    <span className="text-sm">Prix avec chauffeur (Hors Ville):</span>
                                                    <span className="text-sm font-medium">{selectedVehicle.price_WDO.toLocaleString()} FCFA</span>
                                                </div>
                                            )}
                                            {selectedVehicle.price_WODT !== undefined && (
                                                <div className="flex justify-between">
                                                    <span className="text-sm">Prix sans chauffeur (Ville):</span>
                                                    <span className="text-sm font-medium">{selectedVehicle.price_WODT.toLocaleString()} FCFA</span>
                                                </div>
                                            )}
                                            {selectedVehicle.price_WODO !== undefined && (
                                                <div className="flex justify-between">
                                                    <span className="text-sm">Prix sans chauffeur (Hors Ville):</span>
                                                    <span className="text-sm font-medium">{selectedVehicle.price_WODO.toLocaleString()} FCFA</span>
                                                </div>
                                            )}
                                            {/* Si price_per_day est toujours une base, l'afficher aussi */}
                                            {selectedVehicle.price_WODO !== undefined && (
                                                <div className="flex justify-between">
                                                    <span className="text-sm">Prix par défaut:</span>
                                                    <span className="text-sm font-medium">{selectedVehicle.price_WDO} FCFA</span>
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                </div>
                            </div>
                            {selectedVehicle.insurance && (
                                <Card>
                                    <CardHeader className="pb-3">
                                        <CardTitle className="text-sm">Assurance</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-2">
                                        <div className="text-sm">
                                            <div>
                                                <span className="font-medium">Compagnie:</span> {selectedVehicle.insurance.company}
                                            </div>
                                            <div>
                                                <span className="font-medium">Police:</span> {selectedVehicle.insurance.policyNumber}
                                            </div>
                                            <div>
                                                <span className="font-medium">Expiration:</span> {selectedVehicle.insurance.expiryDate}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}
                            {selectedVehicle.maintenance && (
                                <Card>
                                    <CardHeader className="pb-3">
                                        <CardTitle className="text-sm">Maintenance</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-2">
                                        <div className="text-sm">
                                            <div>
                                                <span className="font-medium">Dernier service:</span> {selectedVehicle.maintenance.lastService}
                                            </div>
                                            <div>
                                                <span className="font-medium">Prochain service:</span> {selectedVehicle.maintenance.nextService}
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="font-medium">Statut:</span>
                                                {getMaintenanceStatusBadge(selectedVehicle.maintenance.status)}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}
                          <Card>
                            <CardHeader className="pb-3">
                              <CardTitle className="text-sm">Équipements</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 flex flex-wrap gap-2 min-h-[48px]">
                                {Array.isArray(selectedVehicle.features) && selectedVehicle.features.length > 0 ? (
                                  selectedVehicle.features.map((feature, idx) => (
                                    <Badge
                                      key={idx}
                                      variant="outline"
                                      className="bg-blue-50 text-blue-700 border-blue-200 font-medium px-3 py-1 rounded-full"
                                    >
                                      {feature}
                                    </Badge>
                                  ))
                                ) : (
                                  <span className="text-gray-400">Aucun équipement</span>
                                )}
                              </div>
                            </CardContent>
                        </Card>
                            {selectedVehicle.description && (
                                <Card>
                                    <CardHeader className="pb-3">
                                        <CardTitle className="text-sm">Description</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm text-gray-600">{selectedVehicle.description}</p>
                                    </CardContent>
                                </Card>
                            )}
                        </div>
                    )}
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
                            Fermer
                        </Button>
                        <Button onClick={() => setIsEditDialogOpen(true)}>Modifier le véhicule</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
                <DialogTitle>
                    Modifier le véhicule: {editedVehicle?.model || ''}
                </DialogTitle>
                <DialogDescription>
                    Modifiez les informations du véhicule sélectionné.
                </DialogDescription>
            </DialogHeader>

            {editedVehicle ? (
                <form onSubmit={handleSaveEdit}> {/* L'événement onSubmit doit appeler handleSaveEdit */}
                    <div className="grid gap-4 py-4 pr-4 max-h-[calc(90vh-200px)] overflow-y-auto">
                        {/* Champ "Modèle" */}
                        <div className="space-y-2">
                            <Label htmlFor="model">Modèle du véhicule</Label>
                            <Input
                                id="model"
                                value={editedVehicle.model || ''}
                                onChange={handleEditChange} 
                                placeholder="Modèle (ex: Corolla)"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            {/* Champ "Marque" */}
                            <div className="space-y-2">
                                <Label htmlFor="brand">Marque</Label>
                                <Input
                                    id="brand"
                                    value={editedVehicle.brand || ''}
                                    onChange={handleEditChange} 
                                    placeholder="Toyota"
                                    required
                                />
                            </div>
                            {/* Champ "Année" */}
                            <div className="space-y-2">
                                <Label htmlFor="year">Année</Label>
                                <Input
                                    id="year"
                                    type="number"
                                    value={editedVehicle.year || ''}
                                    onChange={handleEditChange} 
                                    placeholder="2023"
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            {/* Champ "Type" */}
                            <div className="space-y-2">
                                <Label htmlFor="type">Type</Label>
                                <Select
                                    value={editedVehicle.type || ''}
                                    onValueChange={(value) => handleSelectChange('type', value)} 
                                    required
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Sélectionner le type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Berline">Berline</SelectItem>
                                        <SelectItem value="SUV">SUV</SelectItem>
                                        <SelectItem value="Économique">Économique</SelectItem>
                                        <SelectItem value="Pick-up">Pick-up</SelectItem>
                                        <SelectItem value="Citadine">Citadine</SelectItem>
                                        <SelectItem value="Luxe">Luxe</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            {/* Champ "Plaque d'immatriculation" */}
                            <div className="space-y-2">
                                <Label htmlFor="immatriculation">Plaque d'immatriculation</Label>
                                <Input
                                    id="immatriculation"
                                    value={editedVehicle.immatriculation || ''}
                                    onChange={handleEditChange} 
                                    placeholder="LT-123-CM"
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            {/* Champ "Couleur" */}
                            <div className="space-y-2">
                                <Label htmlFor="color">Couleur</Label>
                                <Input
                                    id="color"
                                    value={editedVehicle.color || ''}
                                    onChange={handleEditChange} 
                                    placeholder="Blanc"
                                    required
                                />
                            </div>
                            {/* Champ "Nombre de places" */}
                            <div className="space-y-2">
                                <Label htmlFor="seats">Nombre de places</Label>
                                <Input
                                    id="seats"
                                    type="number"
                                    value={editedVehicle.seats || ''}
                                    onChange={handleEditChange} 
                                    placeholder="5"
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            {/* Champ "Transmission" */}
                            <div className="space-y-2">
                                <Label htmlFor="transmission">Transmission</Label>
                                <Select
                                    value={editedVehicle.transmission || ''}
                                    onValueChange={(value) => handleSelectChange('transmission', value)} 
                                    required
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Manuelle">Manuelle</SelectItem>
                                        <SelectItem value="Automatique">Automatique</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            {/* Champ "Carburant" */}
                            <div className="space-y-2">
                                <Label htmlFor="fuel_type">Carburant</Label>
                                <Select
                                    value={editedVehicle.fuel_type || ''}
                                    onValueChange={(value) => handleSelectChange('fuel_type', value)} 
                                    required
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Essence">Essence</SelectItem>
                                        <SelectItem value="Diesel">Diesel</SelectItem>
                                        <SelectItem value="Hybride">Hybride</SelectItem>
                                        <SelectItem value="Électrique">Électrique</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* Champs de prix */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="price_WDT">Prix avec chauffeur (Ville)</Label>
                                <Input
                                    id="price_WDT"
                                    type="number"
                                    value={editedVehicle.price_WDT || ''}
                                    onChange={handleEditChange} 
                                    placeholder="Ex: 30000"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="price_WDO">Prix avec chauffeur (Hors Ville)</Label>
                                <Input
                                    id="price_WDO"
                                    type="number"
                                    value={editedVehicle.price_WDO || ''}
                                    onChange={handleEditChange} 
                                    placeholder="Ex: 45000"
                                    required
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="price_WODT">Prix sans chauffeur (Ville)</Label>
                                <Input
                                    id="price_WODT"
                                    type="number"
                                    value={editedVehicle.price_WODT || ''}
                                    onChange={handleEditChange} 
                                    placeholder="Ex: 20000"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="price_WODO">Prix sans chauffeur (Hors Ville)</Label>
                                <Input
                                    id="price_WODO"
                                    type="number"
                                    value={editedVehicle.price_WODO || ''}
                                    onChange={handleEditChange} 
                                    placeholder="Ex: 35000"
                                    required
                                />
                            </div>
                        </div>
                        {/* Fin des champs de prix */}

                        {/* Champ "Localisation" */}
                        <div className="space-y-2">
                            <Label htmlFor="location">Localisation</Label>
                            <Select
                                value={editedVehicle.location || ''}
                                onValueChange={(value) => handleSelectChange('location', value)} 
                                required
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Sélectionner la ville" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Douala">Douala</SelectItem>
                                    <SelectItem value="Yaoundé">Yaoundé</SelectItem>
                                    <SelectItem value="Bafoussam">Bafoussam</SelectItem>
                                    <SelectItem value="Bamenda">Bamenda</SelectItem>
                                    <SelectItem value="Garoua">Garoua</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Champ "Équipements" (Features) */}
                        <div className="space-y-2">
                            <Label>Équipements</Label>
                            <div className="flex flex-wrap gap-3">
                                {["Climatisation", "GPS", "Assistance", "Bluetooth", "Caméra de recul", "Sièges chauffants", "ABS", "Airbags"].map((feature) => {
                                    const normalizedVehicleFeatures = normalizeFeatures(editedVehicle?.features);
                                    // Le console.log est utile pour le débogage, mais peut être retiré en production
                                    
                                    return (
                                        <label key={feature} className="flex items-center gap-1 text-sm cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={normalizedVehicleFeatures.includes(feature)}
                                                onChange={(e) => handleEditFeaturesChange(feature, e.target.checked)} 
                                            />
                                            {feature}
                                        </label>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Champ "Description" */}
                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                value={editedVehicle.description || ''}
                                onChange={handleEditChange} 
                                placeholder="Description du véhicule..."
                                required
                            />
                        </div>

                        {/* Champ "Image du véhicule" avec ImageUpload */}
                        <div className="space-y-2">
                            <Label>Image du véhicule</Label>
                            <ImageUpload
                                images={editedVehicle.image}
                                onImagesChange={handleImageChange}
                            />
                        </div>
                    </div>

                    <DialogFooter className="mt-4">
                        <Button variant="outline" onClick={() => setIsEditDialogOpen(false)} type="button">
                            Annuler
                        </Button>
                        <Button type="submit">Enregistrer les modifications</Button>
                    </DialogFooter>
                </form>
            ) : (
                <div className="flex items-center justify-center h-48 text-gray-500">
                    <p>Aucune donnée de véhicule à afficher pour l'édition. Veuillez sélectionner un véhicule.</p>
                </div>
            )}
        </DialogContent>
    </Dialog>
        </div>
    )
}
