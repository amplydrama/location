import { type NextRequest, NextResponse } from "next/server"

// Configuration Orange Money (à remplacer par vos vraies clés)
const ORANGE_MONEY_CONFIG = {
  clientId: process.env.ORANGE_MONEY_CLIENT_ID || "your-client-id",
  clientSecret: process.env.ORANGE_MONEY_CLIENT_SECRET || "your-client-secret",
  merchantKey: process.env.ORANGE_MONEY_MERCHANT_KEY || "your-merchant-key",
  baseUrl: process.env.ORANGE_MONEY_BASE_URL || "https://api.orange.com/orange-money-webpay/dev/v1",
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { amount, phoneNumber, bookingId, externalId } = body

    // Validation des données
    if (!amount || !phoneNumber || !bookingId) {
      return NextResponse.json({ success: false, error: "Données manquantes pour le paiement" }, { status: 400 })
    }

    // Simulation de l'appel à l'API Orange Money
    // En production, remplacer par le vrai appel API
    const paymentRequest = {
      merchant_key: ORANGE_MONEY_CONFIG.merchantKey,
      currency: "XAF",
      order_id: externalId || `booking-${bookingId}-${Date.now()}`,
      amount: amount,
      return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/cancel`,
      notif_url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/payments/orange-money/webhook`,
      lang: "fr",
      reference: `CarLoc-${bookingId}`,
    }

    // Simulation de la réponse Orange Money
    // En production, faire l'appel réel à l'API
    const mockResponse = {
      success: true,
      transactionId: `om-${Date.now()}`,
      paymentUrl: `https://webpay.orange.cm/payment?token=mock-token-${Date.now()}`,
      status: "PENDING",
      message: "Redirection vers Orange Money pour finaliser le paiement.",
    }

    // Log pour le développement
    console.log("Orange Money Payment Request:", paymentRequest)
    console.log("Orange Money Mock Response:", mockResponse)

    return NextResponse.json({
      success: true,
      data: {
        transactionId: mockResponse.transactionId,
        paymentUrl: mockResponse.paymentUrl,
        status: mockResponse.status,
        message: mockResponse.message,
        paymentMethod: "Orange Money",
      },
    })
  } catch (error) {
    console.error("Erreur paiement Orange Money:", error)
    return NextResponse.json(
      { success: false, error: "Erreur lors du traitement du paiement Orange Money" },
      { status: 500 },
    )
  }
}

// Endpoint pour le webhook Orange Money
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()

    // Traitement du webhook Orange Money
    // Vérifier la signature et traiter la notification
    console.log("Orange Money Webhook:", body)

    const { order_id, status, transaction_id } = body

    // Mettre à jour le statut de la réservation en base de données
    // En production, mettre à jour la vraie base de données

    return NextResponse.json({
      success: true,
      message: "Webhook traité avec succès",
    })
  } catch (error) {
    console.error("Erreur webhook Orange Money:", error)
    return NextResponse.json({ success: false, error: "Erreur lors du traitement du webhook" }, { status: 500 })
  }
}
