import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const conversationId = searchParams.get("conversationId")
    const limit = Number.parseInt(searchParams.get("limit") || "100")
    const offset = Number.parseInt(searchParams.get("offset") || "0")

    if (!conversationId) {
      return NextResponse.json({ success: false, error: "ID de conversation manquant" }, { status: 400 })
    }

    const messages = await sql`
      SELECT * FROM chat_messages 
      WHERE conversation_id = ${conversationId}
      ORDER BY created_at ASC
      LIMIT ${limit} OFFSET ${offset}
    `

    return NextResponse.json({
      success: true,
      data: messages,
    })
  } catch (error) {
    console.error("Erreur lors de la récupération des messages:", error)
    return NextResponse.json({ success: false, error: "Erreur lors de la récupération des messages" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { messageId, conversationId, senderId, senderName, senderType, content, messageType = "text" } = body

    if (!messageId || !conversationId || !senderId || !senderName || !senderType || !content) {
      return NextResponse.json({ success: false, error: "Données manquantes" }, { status: 400 })
    }

    // Insérer le message
    const [message] = await sql`
      INSERT INTO chat_messages (
        message_id, conversation_id, sender_id, sender_name, 
        sender_type, content, message_type
      ) VALUES (
        ${messageId}, ${conversationId}, ${senderId}, ${senderName},
        ${senderType}, ${content}, ${messageType}
      )
      RETURNING *
    `

    // Mettre à jour le timestamp de la dernière activité de la conversation
    await sql`
      UPDATE chat_conversations 
      SET last_message_at = NOW(), updated_at = NOW()
      WHERE conversation_id = ${conversationId}
    `

    return NextResponse.json({
      success: true,
      data: message,
      message: "Message envoyé avec succès",
    })
  } catch (error) {
    console.error("Erreur lors de l'envoi du message:", error)
    return NextResponse.json({ success: false, error: "Erreur lors de l'envoi du message" }, { status: 500 })
  }
}
