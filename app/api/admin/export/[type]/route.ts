import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@vercel/postgres"

export async function GET(request: NextRequest, { params }: { params: { type: string } }) {
  try {
    const { type } = params
    const searchParams = request.nextUrl.searchParams
    const startDate = searchParams.get("startDate")
    const endDate = searchParams.get("endDate")

    if (!startDate || !endDate) {
      return NextResponse.json({ success: false, error: "Les dates de début et de fin sont requises" }, { status: 400 })
    }

    let data: any[] = []

    switch (type) {
      case "bookings":
        const bookingsResult = await sql`
          SELECT 
            b.id, 
            b.user_id, 
            u.name as client_name, 
            u.email as client_email,
            v.brand, 
            v.model, 
            b.start_date, 
            b.end_date, 
            b.total_price, 
            b.status, 
            b.created_at
          FROM 
            bookings b
          JOIN 
            users u ON b.user_id = u.id
          JOIN 
            vehicles v ON b.vehicle_id = v.id
          WHERE 
            b.created_at BETWEEN ${startDate}::date AND (${endDate}::date + interval '1 day')
          ORDER BY 
            b.created_at DESC;
        `
        data = bookingsResult.rows
        break

      case "vehicles":
        const vehiclesResult = await sql`
          SELECT 
            id, 
            brand, 
            model, 
            year, 
            color, 
            license_plate, 
            daily_rate, 
            status, 
            category,
            seats,
            transmission,
            fuel_type,
            created_at,
            updated_at
          FROM 
            vehicles
          ORDER BY 
            brand, model;
        `
        data = vehiclesResult.rows
        break

      case "customers":
        const customersResult = await sql`
          SELECT 
            id, 
            name, 
            email, 
            phone, 
            address, 
            created_at,
            last_login
          FROM 
            users
          WHERE 
            role = 'client'
            AND created_at BETWEEN ${startDate}::date AND (${endDate}::date + interval '1 day')
          ORDER BY 
            created_at DESC;
        `
        data = customersResult.rows
        break

      case "payments":
        const paymentsResult = await sql`
          SELECT 
            p.id, 
            p.booking_id, 
            u.name as client_name,
            p.amount, 
            p.payment_method, 
            p.status, 
            p.transaction_id,
            p.created_at
          FROM 
            payments p
          JOIN 
            bookings b ON p.booking_id = b.id
          JOIN 
            users u ON b.user_id = u.id
          WHERE 
            p.created_at BETWEEN ${startDate}::date AND (${endDate}::date + interval '1 day')
          ORDER BY 
            p.created_at DESC;
        `
        data = paymentsResult.rows
        break

      case "chat":
        try {
          const chatResult = await sql`
            SELECT 
              c.id, 
              c.client_id, 
              c.agent_id, 
              c.start_time, 
              c.end_time, 
              c.status, 
              c.category,
              c.rating,
              pc.participant_name as client_name,
              pa.participant_name as agent_name,
              (SELECT COUNT(*) FROM chat_messages WHERE conversation_id = c.id) as message_count,
              EXTRACT(EPOCH FROM (c.end_time - c.start_time))/60 as duration_minutes
            FROM 
              chat_conversations c
            LEFT JOIN 
              chat_participants pc ON c.id = pc.conversation_id AND pc.participant_type = 'client'
            LEFT JOIN 
              chat_participants pa ON c.id = pa.conversation_id AND pa.participant_type = 'agent'
            WHERE 
              c.start_time BETWEEN ${startDate}::date AND (${endDate}::date + interval '1 day')
            ORDER BY 
              c.start_time DESC;
          `
          data = chatResult.rows
        } catch (error) {
          console.error("Erreur lors de l'exportation des conversations:", error)
          return NextResponse.json(
            {
              success: false,
              error:
                "Erreur lors de l'exportation des conversations. Vérifiez que les tables de chat sont configurées.",
            },
            { status: 500 },
          )
        }
        break

      default:
        return NextResponse.json({ success: false, error: "Type de données non pris en charge" }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      data,
      count: data.length,
      type,
      period: { startDate, endDate },
    })
  } catch (error) {
    console.error(`Erreur lors de l'exportation des données de type ${params.type}:`, error)
    return NextResponse.json({ success: false, error: "Erreur lors de l'exportation des données" }, { status: 500 })
  }
}
