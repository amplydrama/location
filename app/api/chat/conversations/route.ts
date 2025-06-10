import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status") || "all"
    const clientId = searchParams.get("clientId")
    const agentId = searchParams.get("agentId")
    const limit = Number.parseInt(searchParams.get("limit") || "50")
    const offset = Number.parseInt(searchParams.get("offset") || "0")

    // Construire la requête de base
    let conversations
    let total

    if (status === "all" && !clientId && !agentId) {
      // Requête simple sans filtres
      conversations = await sql`
        SELECT 
          c.*,
          COUNT(m.id) as message_count,
          MAX(m.created_at) as last_message_time
        FROM chat_conversations c
        LEFT JOIN chat_messages m ON c.conversation_id = m.conversation_id
        GROUP BY c.id, c.conversation_id, c.client_id, c.agent_id, c.client_name, c.agent_name, 
                 c.status, c.priority, c.category, c.started_at, c.ended_at, c.last_message_at, 
                 c.rating, c.feedback, c.created_at, c.updated_at
        ORDER BY c.last_message_at DESC
        LIMIT ${limit} OFFSET ${offset}
      `

      const [{ count }] = await sql`
        SELECT COUNT(*) as count FROM chat_conversations
      `
      total = count
    } else if (status !== "all" && clientId) {
      // Filtrer par statut et client
      conversations = await sql`
        SELECT 
          c.*,
          COUNT(m.id) as message_count,
          MAX(m.created_at) as last_message_time
        FROM chat_conversations c
        LEFT JOIN chat_messages m ON c.conversation_id = m.conversation_id
        WHERE c.status = ${status} AND c.client_id = ${clientId}
        GROUP BY c.id, c.conversation_id, c.client_id, c.agent_id, c.client_name, c.agent_name, 
                 c.status, c.priority, c.category, c.started_at, c.ended_at, c.last_message_at, 
                 c.rating, c.feedback, c.created_at, c.updated_at
        ORDER BY c.last_message_at DESC
        LIMIT ${limit} OFFSET ${offset}
      `

      const [{ count }] = await sql`
        SELECT COUNT(*) as count 
        FROM chat_conversations 
        WHERE status = ${status} AND client_id = ${clientId}
      `
      total = count
    } else if (status !== "all") {
      // Filtrer par statut seulement
      conversations = await sql`
        SELECT 
          c.*,
          COUNT(m.id) as message_count,
          MAX(m.created_at) as last_message_time
        FROM chat_conversations c
        LEFT JOIN chat_messages m ON c.conversation_id = m.conversation_id
        WHERE c.status = ${status}
        GROUP BY c.id, c.conversation_id, c.client_id, c.agent_id, c.client_name, c.agent_name, 
                 c.status, c.priority, c.category, c.started_at, c.ended_at, c.last_message_at, 
                 c.rating, c.feedback, c.created_at, c.updated_at
        ORDER BY c.last_message_at DESC
        LIMIT ${limit} OFFSET ${offset}
      `

      const [{ count }] = await sql`
        SELECT COUNT(*) as count 
        FROM chat_conversations 
        WHERE status = ${status}
      `
      total = count
    } else if (clientId) {
      // Filtrer par client seulement
      conversations = await sql`
        SELECT 
          c.*,
          COUNT(m.id) as message_count,
          MAX(m.created_at) as last_message_time
        FROM chat_conversations c
        LEFT JOIN chat_messages m ON c.conversation_id = m.conversation_id
        WHERE c.client_id = ${clientId}
        GROUP BY c.id, c.conversation_id, c.client_id, c.agent_id, c.client_name, c.agent_name, 
                 c.status, c.priority, c.category, c.started_at, c.ended_at, c.last_message_at, 
                 c.rating, c.feedback, c.created_at, c.updated_at
        ORDER BY c.last_message_at DESC
        LIMIT ${limit} OFFSET ${offset}
      `

      const [{ count }] = await sql`
        SELECT COUNT(*) as count 
        FROM chat_conversations 
        WHERE client_id = ${clientId}
      `
      total = count
    } else if (agentId) {
      // Filtrer par agent seulement
      conversations = await sql`
        SELECT 
          c.*,
          COUNT(m.id) as message_count,
          MAX(m.created_at) as last_message_time
        FROM chat_conversations c
        LEFT JOIN chat_messages m ON c.conversation_id = m.conversation_id
        WHERE c.agent_id = ${agentId}
        GROUP BY c.id, c.conversation_id, c.client_id, c.agent_id, c.client_name, c.agent_name, 
                 c.status, c.priority, c.category, c.started_at, c.ended_at, c.last_message_at, 
                 c.rating, c.feedback, c.created_at, c.updated_at
        ORDER BY c.last_message_at DESC
        LIMIT ${limit} OFFSET ${offset}
      `

      const [{ count }] = await sql`
        SELECT COUNT(*) as count 
        FROM chat_conversations 
        WHERE agent_id = ${agentId}
      `
      total = count
    }

    return NextResponse.json({
      success: true,
      data: conversations || [],
      pagination: {
        total: Number.parseInt(total?.toString() || "0"),
        limit,
        offset,
        hasMore: offset + limit < Number.parseInt(total?.toString() || "0"),
      },
    })
  } catch (error) {
    console.error("Erreur lors de la récupération des conversations:", error)
    return NextResponse.json(
      { success: false, error: "Erreur lors de la récupération des conversations" },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { conversationId, clientId, agentId, clientName, agentName, category = "general" } = body

    if (!conversationId || !clientId || !clientName) {
      return NextResponse.json({ success: false, error: "Données manquantes" }, { status: 400 })
    }

    // Créer la conversation
    const [conversation] = await sql`
      INSERT INTO chat_conversations (
        conversation_id, client_id, agent_id, client_name, agent_name, 
        status, category, started_at, last_message_at
      ) VALUES (
        ${conversationId}, ${clientId}, ${agentId}, ${clientName}, ${agentName},
        'waiting', ${category}, NOW(), NOW()
      )
      RETURNING *
    `

    // Ajouter un message système de bienvenue
    await sql`
      INSERT INTO chat_messages (
        message_id, conversation_id, sender_id, sender_name, sender_type, content
      ) VALUES (
        ${"system_" + Date.now()}, ${conversationId}, 'system', 'Système', 'system',
        'Conversation démarrée. Un agent va vous répondre dans quelques instants...'
      )
    `

    return NextResponse.json({
      success: true,
      data: conversation,
      message: "Conversation créée avec succès",
    })
  } catch (error) {
    console.error("Erreur lors de la création de la conversation:", error)
    return NextResponse.json(
      { success: false, error: "Erreur lors de la création de la conversation" },
      { status: 500 },
    )
  }
}
