import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userType = searchParams.get("userType") // 'client' ou 'agent'
    const isOnline = searchParams.get("isOnline") // 'true' ou 'false'

    let participants

    if (userType && isOnline !== null) {
      participants = await sql`
        SELECT * FROM chat_participants 
        WHERE user_type = ${userType} AND is_online = ${isOnline === "true"}
        ORDER BY last_seen DESC
      `
    } else if (userType) {
      participants = await sql`
        SELECT * FROM chat_participants 
        WHERE user_type = ${userType}
        ORDER BY last_seen DESC
      `
    } else if (isOnline !== null) {
      participants = await sql`
        SELECT * FROM chat_participants 
        WHERE is_online = ${isOnline === "true"}
        ORDER BY last_seen DESC
      `
    } else {
      participants = await sql`
        SELECT * FROM chat_participants 
        ORDER BY last_seen DESC
      `
    }

    return NextResponse.json({
      success: true,
      data: participants,
    })
  } catch (error) {
    console.error("Erreur lors de la récupération des participants:", error)
    return NextResponse.json(
      { success: false, error: "Erreur lors de la récupération des participants" },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, userName, userType, email, phone, socketId } = body

    if (!userId || !userName || !userType) {
      return NextResponse.json({ success: false, error: "Données manquantes" }, { status: 400 })
    }

    // Insérer ou mettre à jour le participant
    const [participant] = await sql`
      INSERT INTO chat_participants (
        user_id, user_name, user_type, email, phone, socket_id, is_online, last_seen
      ) VALUES (
        ${userId}, ${userName}, ${userType}, ${email}, ${phone}, ${socketId}, true, NOW()
      )
      ON CONFLICT (user_id) 
      DO UPDATE SET 
        user_name = EXCLUDED.user_name,
        email = EXCLUDED.email,
        phone = EXCLUDED.phone,
        socket_id = EXCLUDED.socket_id,
        is_online = true,
        last_seen = NOW(),
        updated_at = NOW()
      RETURNING *
    `

    return NextResponse.json({
      success: true,
      data: participant,
      message: "Participant enregistré avec succès",
    })
  } catch (error) {
    console.error("Erreur lors de l'enregistrement du participant:", error)
    return NextResponse.json(
      { success: false, error: "Erreur lors de l'enregistrement du participant" },
      { status: 500 },
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, isOnline, socketId } = body

    if (!userId) {
      return NextResponse.json({ success: false, error: "ID utilisateur manquant" }, { status: 400 })
    }

    let updatedParticipant

    if (typeof isOnline === "boolean" && socketId) {
      updatedParticipant = await sql`
        UPDATE chat_participants 
        SET is_online = ${isOnline}, socket_id = ${socketId}, last_seen = NOW(), updated_at = NOW()
        WHERE user_id = ${userId}
        RETURNING *
      `
    } else if (typeof isOnline === "boolean") {
      updatedParticipant = await sql`
        UPDATE chat_participants 
        SET is_online = ${isOnline}, last_seen = NOW(), updated_at = NOW()
        WHERE user_id = ${userId}
        RETURNING *
      `
    } else if (socketId) {
      updatedParticipant = await sql`
        UPDATE chat_participants 
        SET socket_id = ${socketId}, last_seen = NOW(), updated_at = NOW()
        WHERE user_id = ${userId}
        RETURNING *
      `
    } else {
      updatedParticipant = await sql`
        UPDATE chat_participants 
        SET last_seen = NOW(), updated_at = NOW()
        WHERE user_id = ${userId}
        RETURNING *
      `
    }

    if (!updatedParticipant || updatedParticipant.length === 0) {
      return NextResponse.json({ success: false, error: "Participant non trouvé" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: updatedParticipant[0],
      message: "Participant mis à jour avec succès",
    })
  } catch (error) {
    console.error("Erreur lors de la mise à jour du participant:", error)
    return NextResponse.json({ success: false, error: "Erreur lors de la mise à jour du participant" }, { status: 500 })
  }
}
