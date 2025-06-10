import { NextResponse } from "next/server"
import { sql } from "@vercel/postgres"

export async function GET() {
  try {
    // Récupérer les compteurs pour chaque type de données
    const bookingsResult = await sql`SELECT COUNT(*) FROM bookings;`
    const vehiclesResult = await sql`SELECT COUNT(*) FROM vehicles;`
    const customersResult = await sql`SELECT COUNT(*) FROM users WHERE role = 'client';`
    const paymentsResult = await sql`SELECT COUNT(*) FROM payments;`

    // Vérifier si la table chat_conversations existe
    let chatCount = 0
    try {
      const chatResult = await sql`SELECT COUNT(*) FROM chat_conversations;`
      chatCount = Number.parseInt(chatResult.rows[0].count)
    } catch (error) {
      console.error("Table chat_conversations non disponible:", error)
    }

    return NextResponse.json({
      success: true,
      counts: {
        bookings: Number.parseInt(bookingsResult.rows[0].count),
        vehicles: Number.parseInt(vehiclesResult.rows[0].count),
        customers: Number.parseInt(customersResult.rows[0].count),
        payments: Number.parseInt(paymentsResult.rows[0].count),
        chat: chatCount,
      },
    })
  } catch (error) {
    console.error("Erreur lors de la récupération des compteurs:", error)
    return NextResponse.json({ success: false, error: "Erreur lors de la récupération des compteurs" }, { status: 500 })
  }
}
