import { type NextRequest, NextResponse } from "next/server"

// Configuration MTN MoMo (à remplacer par vos vraies clés)
const MTN_MOMO_CONFIG = {
  subscriptionKey: process.env.MTN_MOMO_SUBSCRIPTION_KEY || "your-subscription-key",
  apiUser: process.env.MTN_MOMO_API_USER || "your-api-user",
  apiKey: process.env.MTN_MOMO_API_KEY || "your-api-key",
  baseUrl: process.env.MTN_MOMO_BASE_URL || "https://sandbox.momodeveloper.mtn.com",
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { amount, phoneNumber, bookingId, externalId } = body

    // Validation des données
    if (!amount || !phoneNumber || !bookingId) {
      return NextResponse.json({ success: false, error: "Données manquantes pour le paiement" }, { status: 400 })
    }

    // Simulation de l'appel à l'API MTN MoMo
    // En production, remplacer par le vrai appel API
    const paymentRequest = {
      amount: amount.toString(),
      currency: "XAF",
      externalId: externalId || `booking-${bookingId}-${Date.now()}`,
      payer: {
        partyIdType: "MSISDN",
        partyId: phoneNumber.replace("+237", "237"),
      },
      payerMessage: `Paiement location véhicule - Réservation #${bookingId}`,
      payeeNote: `CarLoc Cameroun - Réservation #${bookingId}`,
    }

    // Simulation de la réponse MTN MoMo
    // En production, faire l'appel réel à l'API
    const mockResponse = {
      success: true,
      transactionId: `mtn-${Date.now()}`,
      status: "PENDING",
      message: "Demande de paiement envoyée. Veuillez confirmer sur votre téléphone.",
    }

    // Log pour le développement
    console.log("MTN MoMo Payment Request:", paymentRequest)
    console.log("MTN MoMo Mock Response:", mockResponse)

    return NextResponse.json({
      success: true,
      data: {
        transactionId: mockResponse.transactionId,
        status: mockResponse.status,
        message: mockResponse.message,
        paymentMethod: "MTN MoMo",
      },
    })
  } catch (error) {
    console.error("Erreur paiement MTN MoMo:", error)
    return NextResponse.json(
      { success: false, error: "Erreur lors du traitement du paiement MTN MoMo" },
      { status: 500 },
    )
  }
}

// Endpoint pour vérifier le statut du paiement
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const transactionId = searchParams.get("transactionId")

    if (!transactionId) {
      return NextResponse.json({ success: false, error: "ID de transaction manquant" }, { status: 400 })
    }

    // Simulation de la vérification du statut
    // En production, appeler l'API MTN MoMo pour vérifier le statut
    const mockStatusResponse = {
      transactionId,
      status: "SUCCESSFUL", // PENDING, SUCCESSFUL, FAILED
      amount: "75000",
      currency: "XAF",
      financialTransactionId: `ft-${Date.now()}`,
    }

    return NextResponse.json({
      success: true,
      data: mockStatusResponse,
    })
  } catch (error) {
    console.error("Erreur vérification statut MTN MoMo:", error)
    return NextResponse.json({ success: false, error: "Erreur lors de la vérification du statut" }, { status: 500 })
  }
}
