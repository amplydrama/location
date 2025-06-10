import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const conversationId = params.id

    // Récupérer la conversation
    const [conversation] = await sql`
      SELECT * FROM chat_conversations 
      WHERE conversation_id = ${conversationId}
    `

    if (!conversation) {
      return NextResponse.json({ success: false, error: "Conversation non trouvée" }, { status: 404 })
    }

    // Récupérer les messages
    const messages = await sql`
      SELECT * FROM chat_messages 
      WHERE conversation_id = ${conversationId}
      ORDER BY created_at ASC
    `

    return NextResponse.json({
      success: true,
      data: {
        conversation,
        messages,
      },
    })
  } catch (error) {
    console.error("Erreur lors de la récupération de la conversation:", error)
    return NextResponse.json(
      { success: false, error: "Erreur lors de la récupération de la conversation" },
      { status: 500 },
    )
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const conversationId = params.id
    const body = await request.json()
    const { status, agentId, agentName, rating, feedback } = body

    let updatedConversation

    if (status === "ended") {
      updatedConversation = await sql`
        UPDATE chat_conversations 
        SET status = ${status}, ended_at = NOW(), updated_at = NOW()
        WHERE conversation_id = ${conversationId}
        RETURNING *
      `
    } else if (agentId && agentName) {
      updatedConversation = await sql`
        UPDATE chat_conversations 
        SET agent_id = ${agentId}, agent_name = ${agentName}, status = ${status || "active"}, updated_at = NOW()
        WHERE conversation_id = ${conversationId}
        RETURNING *
      `
    } else if (rating && feedback !== undefined) {
      updatedConversation = await sql`
        UPDATE chat_conversations 
        SET rating = ${rating}, feedback = ${feedback}, updated_at = NOW()
        WHERE conversation_id = ${conversationId}
        RETURNING *
      `
    } else if (status) {
      updatedConversation = await sql`
        UPDATE chat_conversations 
        SET status = ${status}, updated_at = NOW()
        WHERE conversation_id = ${conversationId}
        RETURNING *
      `
    }

    if (!updatedConversation || updatedConversation.length === 0) {
      return NextResponse.json({ success: false, error: "Conversation non trouvée" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: updatedConversation[0],
      message: "Conversation mise à jour avec succès",
    })
  } catch (error) {
    console.error("Erreur lors de la mise à jour de la conversation:", error)
    return NextResponse.json(
      { success: false, error: "Erreur lors de la mise à jour de la conversation" },
      { status: 500 },
    )
  }
}
