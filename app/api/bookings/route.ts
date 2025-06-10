import { type NextRequest, NextResponse } from "next/server"

// Mock database - in production, use a real database
const bookings = [
  {
    id: 1,
    userId: 1,
    vehicleId: 1,
    vehicleName: "Toyota Corolla",
    customerName: "Jean Dupont",
    startDate: "2024-01-15",
    endDate: "2024-01-18",
    totalDays: 3,
    totalAmount: 78750,
    paymentMethod: "MTN MoMo",
    paymentReference: "MTN123456789",
    status: "confirmed",
    createdAt: "2024-01-15T10:30:00Z",
  },
]

export async function GET(request: NextRequest) {
  try {
    return NextResponse.json({
      success: true,
      data: bookings,
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Erreur lors de la récupération des réservations" },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validation des données
    const { vehicleId, startDate, endDate, customerInfo, paymentMethod, totalAmount } = body

    if (!vehicleId || !startDate || !endDate || !customerInfo || !paymentMethod || !totalAmount) {
      return NextResponse.json({ success: false, error: "Données manquantes" }, { status: 400 })
    }

    // Calcul des jours
    const start = new Date(startDate)
    const end = new Date(endDate)
    const totalDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))

    // Création de la réservation
    const newBooking = {
      id: bookings.length + 1,
      userId: 1, // Mock user ID
      vehicleId,
      vehicleName: "Toyota Corolla", // Mock vehicle name
      customerName: `${customerInfo.firstName} ${customerInfo.lastName}`,
      startDate,
      endDate,
      totalDays,
      totalAmount,
      paymentMethod,
      paymentReference: `${paymentMethod.toUpperCase()}-${Date.now()}`,
      status: "pending",
      createdAt: new Date().toISOString(),
    }

    bookings.push(newBooking)

    // Simulation du processus de paiement
    // En production, intégrer les APIs MTN MoMo et Orange Money ici

    return NextResponse.json({
      success: true,
      data: newBooking,
      message: "Réservation créée avec succès",
    })
  } catch (error) {
    console.error("Erreur lors de la création de la réservation:", error)
    return NextResponse.json({ success: false, error: "Erreur lors de la création de la réservation" }, { status: 500 })
  }
}
