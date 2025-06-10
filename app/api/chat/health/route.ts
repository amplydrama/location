import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET() {
  try {
    // Vérifier l'existence des tables de chat
    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_name IN ('chat_participants', 'chat_conversations', 'chat_messages', 'chat_sessions', 'chat_metrics')
      AND table_schema = 'public'
    `

    const tableNames = tables.map((t) => t.table_name)
    const requiredTables = ["chat_participants", "chat_conversations", "chat_messages", "chat_sessions", "chat_metrics"]
    const missingTables = requiredTables.filter((table) => !tableNames.includes(table))

    // Compter les enregistrements dans chaque table existante
    const stats: any = {}

    for (const tableName of tableNames) {
      try {
        const [{ count }] = await sql`SELECT COUNT(*) as count FROM ${sql(tableName)}`
        stats[tableName] = Number.parseInt(count)
      } catch (error) {
        stats[tableName] = "Erreur de lecture"
      }
    }

    return NextResponse.json({
      success: true,
      database: {
        connected: true,
        tables: {
          existing: tableNames,
          missing: missingTables,
          total: tableNames.length,
          required: requiredTables.length,
        },
        stats,
        ready: missingTables.length === 0,
      },
    })
  } catch (error) {
    console.error("Erreur lors de la vérification de la base de données:", error)
    return NextResponse.json(
      {
        success: false,
        database: {
          connected: false,
          error: error instanceof Error ? error.message : "Erreur inconnue",
        },
      },
      { status: 500 },
    )
  }
}
