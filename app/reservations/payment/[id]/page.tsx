"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { CheckCircle, XCircle, Loader2, Calendar, DollarSign, User, Mail, Phone, MapPin, Car } from "lucide-react"

// Importez votre instance axiosAuth pour les requêtes authentifiées
import axiosInstance from "@/utils/axios" // Assurez-vous que le chemin est correct
import Link from "next/link"

// Interface pour les données de réservation nécessaires au paiement et au récapitulatif
interface BookingDetails {
    id: number;
    estimated_total_price: number;
    is_paid: boolean;
    name: string | null;
    email: string;
    phone: string | null;
    status: string; // Statut de la réservation
    car: number; // ID de la voiture

    // Champs ajoutés pour le récapitulatif de la réservation
    start_date: string;
    end_date: string;
    with_driver: boolean;
    town: string;
    // Vous pouvez ajouter d'autres champs du véhicule si nécessaire, par exemple:
    // vehicle_name?: string;
    // vehicle_plate?: string;
}

// Fonction pour récupérer les détails de la réservation par son ID
const fetchBookingDetails = async (bookingId: string): Promise<BookingDetails> => {
    try {
        // Remplacez ceci par votre véritable endpoint API pour récupérer les détails de la réservation
        // Exemple: GET /api/bookings/{bookingId}/
        const response = await axiosInstance.get<BookingDetails>(`/reservation/reserve/${bookingId}/`);
        return response.data;
    } catch (error) {
        console.error("Erreur lors de la récupération des détails de la réservation:", error);
        throw error; // Propage l'erreur pour que le composant puisse la gérer
    }
};

// Composant pour afficher un message personnalisé (remplace alert())
const MessageDialog = ({ isOpen, onOpenChange, title, description, type }: {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    description: string;
    type: 'success' | 'error' | 'info';
}) => {
    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader className="flex flex-col items-center text-center">
                    {type === 'success' && <CheckCircle className="h-12 w-12 text-green-500 mb-2" />}
                    {type === 'error' && <XCircle className="h-12 w-12 text-red-500 mb-2" />}
                    {type === 'info' && <Loader2 className="h-12 w-12 text-blue-500 mb-2 animate-spin" />}
                    <DialogTitle className="text-xl">{title}</DialogTitle>
                    <DialogDescription className="text-sm text-gray-600">
                        {description}
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button onClick={() => onOpenChange(false)}>Fermer</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};


// Composant de la page de paiement
export default function PaymentFormPage({ params }: { params: { id: string } }) {
    const { id } = params; // Récupère l'ID de réservation depuis les paramètres de l'URL

    const [bookingDetails, setBookingDetails] = useState<BookingDetails | null>(null);
    const [paymentAmount, setPaymentAmount] = useState<string>(""); // Montant à payer par l'utilisateur
    const [paymentMethod, setPaymentMethod] = useState<string>(""); // 'MTN' ou 'Orange'
    const [phoneNumber, setPhoneNumber] = useState<string>("");
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isProcessingPayment, setIsProcessingPayment] = useState(false);
    const [messageDialog, setMessageDialog] = useState({
        isOpen: false,
        title: '',
        description: '',
        type: 'info' as 'success' | 'error' | 'info',
    });

    // Regex pour les numéros de téléphone camerounais (67/68/65/69 ou 22/23/24)
    const phoneRegex = /^(6(?:7|8|5|9)\d{7}|2(?:2|3|4)\d{7})$/;

    useEffect(() => {
        const loadBookingDetails = async () => {
            if (!id) {
                setError("ID de réservation manquant.");
                setIsLoading(false);
                return;
            }
            try {
                setIsLoading(true);
                const details = await fetchBookingDetails(id);
                setBookingDetails(details);
                // Pré-remplir le montant avec le prix total estimé de la réservation
                setPaymentAmount(details.estimated_total_price.toString());
                // Pré-remplir le numéro de téléphone si disponible dans les détails de la réservation
                if (details.phone) {
                    setPhoneNumber(details.phone);
                }
            } catch (err: any) {
                console.error("Erreur lors du chargement des détails de la réservation:", err);
                setError("Impossible de charger les détails de la réservation. " + (err.response?.data?.message || err.message || "Veuillez réessayer."));
            } finally {
                setIsLoading(false);
            }
        };

        loadBookingDetails();
    }, [id]);

    const handlePayment = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!bookingDetails) {
            setMessageDialog({
                isOpen: true,
                title: "Erreur",
                description: "Détails de la réservation non chargés.",
                type: "error",
            });
            return;
        }

        if (!paymentAmount || parseFloat(paymentAmount) <= 0) {
            setMessageDialog({
                isOpen: true,
                title: "Montant invalide",
                description: "Veuillez entrer un montant de paiement valide.",
                type: "error",
            });
            return;
        }

        if (!paymentMethod) {
            setMessageDialog({
                isOpen: true,
                title: "Méthode de paiement manquante",
                description: "Veuillez sélectionner une méthode de paiement (MTN MoMo ou Orange Money).",
                type: "error",
            });
            return;
        }

        if (!phoneNumber || !phoneRegex.test(phoneNumber)) {
            setMessageDialog({
                isOpen: true,
                title: "Numéro de téléphone invalide",
                description: "Veuillez entrer un numéro de téléphone camerounais valide (ex: 67xxxxxxx, 69xxxxxxx, 22xxxxxxx).",
                type: "error",
            });
            return;
        }

        setIsProcessingPayment(true);
        setMessageDialog({
            isOpen: true,
            title: "Traitement du paiement",
            description: "Veuillez patienter pendant que nous traitons votre paiement...",
            type: "info",
        });

        try {
            // Remplacez ceci par votre véritable appel API de paiement
            // Exemple: POST /api/payments/initiate/
            const paymentData = {
                booking_id: bookingDetails.id,
                amount: parseFloat(paymentAmount),
                payment_method: paymentMethod, // 'MTN' ou 'Orange'
                phone_number: phoneNumber,
            };

            const response = await axiosInstance.post('/api/payments/initiate/', paymentData);

            setMessageDialog({
                isOpen: true,
                title: "Paiement initié",
                description: response.data.message || "Votre paiement a été initié avec succès. Veuillez suivre les instructions sur votre téléphone pour finaliser.",
                type: "success",
            });
            // Vous pourriez vouloir rafraîchir les détails de la réservation après l'initiation
            // ou rediriger l'utilisateur vers une page de suivi.
            // loadBookingDetails(); // Pour rafraîchir le statut de paiement
            // router.push(`/reservations/${bookingDetails.id}`); // Si vous avez un router
        } catch (err: any) {
            console.error("Erreur lors du paiement:", err);
            setMessageDialog({
                isOpen: true,
                title: "Échec du paiement",
                description: err.response?.data?.message || err.message || "Une erreur est survenue lors du paiement. Veuillez vérifier vos informations et réessayer.",
                type: "error",
            });
        } finally {
            setIsProcessingPayment(false);
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "confirmed":
                return <span className="bg-green-100 text-green-800 px-2.5 py-0.5 rounded-full text-xs font-medium">Confirmée</span>;
            case "pending":
                return <span className="bg-yellow-100 text-yellow-800 px-2.5 py-0.5 rounded-full text-xs font-medium">En attente</span>;
            case "cancelled":
                return <span className="bg-red-100 text-red-800 px-2.5 py-0.5 rounded-full text-xs font-medium">Annulée</span>;
            default:
                return <span className="bg-gray-100 text-gray-800 px-2.5 py-0.5 rounded-full text-xs font-medium">{status}</span>;
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
                <p className="ml-4 text-xl text-gray-700">Chargement des détails de la réservation...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-screen">
                <XCircle className="h-12 w-12 text-red-500" />
                <p className="ml-4 text-xl text-red-600">{error}</p>
            </div>
        );
    }

    if (!bookingDetails) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-xl text-gray-700">Réservation introuvable.</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col lg:flex-row items-start justify-center min-h-screen p-4 lg:p-8 space-y-8 lg:space-y-0 lg:space-x-8 max-w-6xl mx-auto">
            {/* Colonne de récapitulatif de la réservation (à gauche) */}
            <Card className="w-full lg:w-1/2 shadow-lg rounded-lg flex-shrink-0">
                <div className="flex justify-between items-center p-4 border-b">
                    <p className="text-blue-600 font-bold hover:blue-800"><Link href="\reservations" >Retour à mes reservations</Link></p>
                </div>
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-gray-800">Récapitulatif de la Réservation</CardTitle>
                    <p className="text-gray-600">ID de réservation: #{bookingDetails.id}</p>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center text-gray-700">
                        <User className="h-5 w-5 mr-3 text-blue-500" />
                        <span className="font-semibold">Client:</span> {bookingDetails.name || "N/A"}
                    </div>
                    <div className="flex items-center text-gray-700">
                        <Mail className="h-5 w-5 mr-3 text-blue-500" />
                        <span className="font-semibold">Email:</span> {bookingDetails.email}
                    </div>
                    {bookingDetails.phone && (
                        <div className="flex items-center text-gray-700">
                            <Phone className="h-5 w-5 mr-3 text-blue-500" />
                            <span className="font-semibold">Téléphone:</span> {bookingDetails.phone}
                        </div>
                    )}
                    <div className="flex items-center text-gray-700">
                        <Car className="h-5 w-5 mr-3 text-blue-500" />
                        <span className="font-semibold">ID Véhicule:</span> {bookingDetails.car}
                        {/* Ajoutez le nom/plaque du véhicule si disponible dans BookingDetails */}
                        {/* {bookingDetails.vehicle_name && ` (${bookingDetails.vehicle_name})`} */}
                    </div>
                    <div className="flex items-center text-gray-700">
                        <Calendar className="h-5 w-5 mr-3 text-blue-500" />
                        <span className="font-semibold">Dates:</span> Du {bookingDetails.start_date} au {bookingDetails.end_date}
                    </div>
                    <div className="flex items-center text-gray-700">
                        <MapPin className="h-5 w-5 mr-3 text-blue-500" />
                        <span className="font-semibold">Ville:</span> <span className="capitalize">{bookingDetails.town}</span>
                    </div>
                    <div className="flex items-center text-gray-700">
                        <span className="font-semibold mr-3">Avec chauffeur:</span> {bookingDetails.with_driver ? "Oui" : "Non"}
                    </div>
                    <div className="flex items-center text-gray-700">
                        <DollarSign className="h-5 w-5 mr-3 text-blue-500" />
                        <span className="font-semibold">Montant Total Estimé:</span>
                        <span className="ml-2 text-xl font-bold text-blue-600">{bookingDetails.estimated_total_price.toLocaleString()} FCFA</span>
                    </div>
                    <div className="flex items-center text-gray-700">
                        <span className="font-semibold mr-3">Statut de la Réservation:</span>
                        {getStatusBadge(bookingDetails.status)}
                    </div>
                    <div className="flex items-center text-gray-700">
                        <span className="font-semibold mr-3">Statut du Paiement:</span>
                        {bookingDetails.is_paid ? (
                            <span className="bg-green-100 text-green-800 px-2.5 py-0.5 rounded-full text-xs font-medium">Payé</span>
                        ) : (
                            <span className="bg-yellow-100 text-yellow-800 px-2.5 py-0.5 rounded-full text-xs font-medium">Non payé</span>
                        )}
                    </div>
                </CardContent>
                
            </Card>

            

            {/* Colonne du formulaire de paiement (à droite) */}
            <Card className="w-full lg:w-1/2 shadow-lg rounded-lg">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl font-bold text-gray-800">Effectuer le Paiement</CardTitle>
                    <p className="text-gray-600">Réglez le montant de votre réservation.</p>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="text-center mb-4">
                        <p className="text-lg font-semibold text-gray-700">Montant à payer:</p>
                        <p className="text-4xl font-extrabold text-blue-600">
                            {bookingDetails.estimated_total_price.toLocaleString()} FCFA
                        </p>
                        {bookingDetails.is_paid && (
                            <p className="text-green-500 font-medium mt-2">Cette réservation est déjà payée.</p>
                        )}
                    </div>

                    <form onSubmit={handlePayment} className="space-y-5">
                        <div className="space-y-2">
                            <Label htmlFor="paymentAmount">Montant du paiement (FCFA)</Label>
                            <Input
                                id="paymentAmount"
                                type="number"
                                value={paymentAmount}
                                onChange={(e) => setPaymentAmount(e.target.value)}
                                placeholder="Ex: 25000"
                                required
                                disabled={isProcessingPayment || bookingDetails.is_paid}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="paymentMethod">Mode de paiement mobile</Label>
                            <Select
                                value={paymentMethod}
                                onValueChange={setPaymentMethod}
                                required
                                disabled={isProcessingPayment || bookingDetails.is_paid}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Sélectionner le mode de paiement" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="MTN" className="flex items-center">
                                        <div className="flex items-center">
                                            {/* MTN MoMo SVG */}
                                            <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <rect width="24" height="24" rx="4" fill="#FFCC00"/>
                                                <path d="M12 4L12 20M12 4C10.5 4 9 5 9 7C9 9 10.5 10 12 10C13.5 10 15 9 15 7C15 5 13.5 4 12 4Z" stroke="#333333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                <path d="M12 14L12 20M12 14C10.5 14 9 15 9 17C9 19 10.5 20 12 20C13.5 20 15 19 15 17C15 15 13.5 14 12 14Z" stroke="#333333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                            </svg>
                                            MTN MoMo
                                        </div>
                                    </SelectItem>
                                    <SelectItem value="Orange" className="flex items-center">
                                        <div className="flex items-center">
                                            {/* Orange Money SVG */}
                                            <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <rect width="24" height="24" rx="4" fill="#FF7900"/>
                                                <path d="M12 4C10.3431 4 9 5.34315 9 7V17C9 18.6569 10.3431 20 12 20C13.6569 20 15 18.6569 15 17V7C15 5.34315 13.6569 4 12 4Z" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                <path d="M12 4L12 20" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                            </svg>
                                            Orange Money
                                        </div>
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="phoneNumber">Numéro de téléphone mobile</Label>
                            <Input
                                id="phoneNumber"
                                type="tel"
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                placeholder="Ex: 67XXXXXXXX"
                                required
                                disabled={isProcessingPayment || bookingDetails.is_paid}
                            />
                        </div>

                        <Button type="submit" className="w-full" disabled={isProcessingPayment || bookingDetails.is_paid}>
                            {isProcessingPayment ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Traitement...
                                </>
                            ) : (
                                "Payer maintenant"
                            )}
                        </Button>
                    </form>

                    <div className="text-sm text-gray-500 mt-6 p-4 bg-gray-50 rounded-md border border-gray-200">
                        <p className="font-semibold mb-2">Informations importantes concernant le paiement :</p>
                        <ul className="list-disc list-inside space-y-1">
                            <li>Vous avez la possibilité d'avancer une partie du paiement, mais le montant total doit être réglé avant la prise du véhicule.</li>
                            <li>Pour toute question relative à un remboursement ou à l'annulation d'un paiement, veuillez consulter les responsables aux numéros suivants :</li>
                            <li className="font-medium text-gray-700">Responsable 1: +237 6XX XXX XXX</li>
                            <li className="font-medium text-gray-700">Responsable 2: +237 6YY YYY YYY</li>
                        </ul>
                    </div>
                </CardContent>
            </Card>

            <MessageDialog
                isOpen={messageDialog.isOpen}
                onOpenChange={setMessageDialog.bind(null, { ...messageDialog, isOpen: false })}
                title={messageDialog.title}
                description={messageDialog.description}
                type={messageDialog.type}
            />
        </div>
    );
}
