// app/api/chat/analytics/route.js

import { type NextRequest, NextResponse } from "next/server"

// --- DÉBUT DES MODIFICATIONS : NEUTRALISATION DU CODE ---

// Nous commentons tout le code qui se connecte à la base de données
// ou qui tente de faire des requêtes SQL directement depuis Next.js.

export async function GET(request: NextRequest) {
  try {
    // Message de console pour indiquer que cette API route est neutralisée
    console.warn("API Route /api/chat/analytics est actuellement neutralisée. Les données proviendront de valeurs par défaut.");

    // Vous pouvez renvoyer des données par défaut ici,
    // ou simplement un message indiquant que le service n'est pas encore actif.
    // Cela permettra à votre frontend de se charger sans erreur.

    return NextResponse.json({
      success: true,
      data: {
        period: "7d", // Période par défaut
        stats: {
          total_conversations: 0,
          completed_conversations: 0,
          active_conversations: 0,
          average_rating: null,
          avg_duration_minutes: null,
          avg_response_time: 0,
          avg_resolution_time: 0,
        },
        dailyStats: [],
        categoryStats: [],
        agentStats: [],
        // Vous pouvez ajouter un message pour le frontend pour l'informer
        message: "Les données d'analyse ne sont pas encore disponibles car le backend n'est pas connecté."
      },
    });

  } catch (error) {
    // En cas d'erreur inattendue (ce qui devrait être rare avec le code neutralisé)
    console.error("Erreur inattendue dans l'API Route /api/chat/analytics neutralisée:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Fonctionnalité d'analyse temporairement indisponible.",
        details: error instanceof Error ? error.message : "Erreur inconnue",
      },
      { status: 500 },
    );
  }
}

// --- FIN DES MODIFICATIONS : NEUTRALISATION DU CODE ---

// Le code original est commenté ci-dessous, vous pouvez le supprimer complètement une fois que vous êtes sûr.
/*
// Ancien code (COMMENTÉ ET INACTIF)
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: NextRequest) {
  try {
    // Vérifier si les tables existent avant de faire les requêtes
    try {
      await sql`SELECT 1 FROM chat_conversations LIMIT 1`
    } catch (error) {
      return NextResponse.json(
        {
          success: false,
          error: "Les tables de chat n'existent pas. Veuillez exécuter le script de création des tables.",
          needsSetup: true,
          details: "Exécutez le script 'setup_complete_chat_system.sql' pour créer les tables nécessaires.",
        },
        { status: 404 },
      )
    }

    const { searchParams } = new URL(request.url)
    const period = searchParams.get("period") || "7d"
    const agentId = searchParams.get("agentId")

    // Calculer la date de début selon la période
    let startDate: Date
    const now = new Date()
    switch (period) {
      case "1d":
        startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000)
        break
      case "7d":
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        break
      case "30d":
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
        break
      case "90d":
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)
        break
      default:
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    }

    // Statistiques générales
    let stats
    if (agentId) {
      const result = await sql`
        SELECT 
          COUNT(*) as total_conversations,
          COUNT(CASE WHEN status = 'ended' THEN 1 END) as completed_conversations,
          COUNT(CASE WHEN status = 'active' THEN 1 END) as active_conversations,
          AVG(CASE WHEN rating IS NOT NULL THEN rating END) as average_rating,
          AVG(EXTRACT(EPOCH FROM (ended_at - started_at))/60) as avg_duration_minutes
        FROM chat_conversations 
        WHERE started_at >= ${startDate.toISOString()}
          AND agent_id = ${agentId}
      `
      stats = result[0]
    } else {
      const result = await sql`
        SELECT 
          COUNT(*) as total_conversations,
          COUNT(CASE WHEN status = 'ended' THEN 1 END) as completed_conversations,
          COUNT(CASE WHEN status = 'active' THEN 1 END) as active_conversations,
          AVG(CASE WHEN rating IS NOT NULL THEN rating END) as average_rating,
          AVG(EXTRACT(EPOCH FROM (ended_at - started_at))/60) as avg_duration_minutes
        FROM chat_conversations 
        WHERE started_at >= ${startDate.toISOString()}
      `
      stats = result[0]
    }

    // Conversations par jour
    let dailyStats
    if (agentId) {
      dailyStats = await sql`
        SELECT 
          DATE(started_at) as date,
          COUNT(*) as conversations,
          COUNT(CASE WHEN status = 'ended' THEN 1 END) as completed
        FROM chat_conversations 
        WHERE started_at >= ${startDate.toISOString()}
          AND agent_id = ${agentId}
        GROUP BY DATE(started_at) 
        ORDER BY date
      `
    } else {
      dailyStats = await sql`
        SELECT 
          DATE(started_at) as date,
          COUNT(*) as conversations,
          COUNT(CASE WHEN status = 'ended' THEN 1 END) as completed
        FROM chat_conversations 
        WHERE started_at >= ${startDate.toISOString()}
        GROUP BY DATE(started_at) 
        ORDER BY date
      `
    }

    // Conversations par catégorie
    let categoryStats
    if (agentId) {
      categoryStats = await sql`
        SELECT 
          category,
          COUNT(*) as count,
          AVG(CASE WHEN rating IS NOT NULL THEN rating END) as avg_rating
        FROM chat_conversations 
        WHERE started_at >= ${startDate.toISOString()}
          AND agent_id = ${agentId}
        GROUP BY category 
        ORDER BY count DESC
      `
    } else {
      categoryStats = await sql`
        SELECT 
          category,
          COUNT(*) as count,
          AVG(CASE WHEN rating IS NOT NULL THEN rating END) as avg_rating
        FROM chat_conversations 
        WHERE started_at >= ${startDate.toISOString()}
        GROUP BY category 
        ORDER BY count DESC
      `
    }

    // Performance des agents (si pas d'agent spécifique)
    let agentStats = []
    if (!agentId) {
      agentStats = await sql`
        SELECT 
          c.agent_id,
          c.agent_name,
          COUNT(*) as total_conversations,
          COUNT(CASE WHEN c.status = 'ended' THEN 1 END) as completed_conversations,
          AVG(CASE WHEN c.rating IS NOT NULL THEN c.rating END) as average_rating,
          AVG(EXTRACT(EPOCH FROM (c.ended_at - c.started_at))/60) as avg_duration_minutes,
          COUNT(CASE WHEN c.rating >= 4 THEN 1 END)::float / NULLIF(COUNT(CASE WHEN c.rating IS NOT NULL THEN 1 END), 0) * 100 as satisfaction_rate
        FROM chat_conversations c
        WHERE c.started_at >= ${startDate.toISOString()}
          AND c.agent_id IS NOT NULL
        GROUP BY c.agent_id, c.agent_name
        ORDER BY total_conversations DESC
      `
    }

    // Temps de réponse moyen (données simulées pour l'instant)
    const responseTimeStats = {
      avg_response_time: 45 + Math.random() * 30, // 45-75 secondes
      avg_resolution_time: 300 + Math.random() * 200, // 5-8 minutes
    }

    return NextResponse.json({
      success: true,
      data: {
        period,
        stats: {
          total_conversations: Number(stats?.total_conversations || 0),
          completed_conversations: Number(stats?.completed_conversations || 0),
          active_conversations: Number(stats?.active_conversations || 0),
          average_rating: stats?.average_rating ? Number(stats.average_rating) : null,
          avg_duration_minutes: stats?.avg_duration_minutes ? Number(stats.avg_duration_minutes) : null,
          avg_response_time: responseTimeStats.avg_response_time,
          avg_resolution_time: responseTimeStats.avg_resolution_time,
        },
        dailyStats: dailyStats.map((day: any) => ({
          date: day.date,
          conversations: Number(day.conversations),
          completed: Number(day.completed),
        })),
        categoryStats: categoryStats.map((cat: any) => ({
          category: cat.category,
          count: Number(cat.count),
          avg_rating: cat.avg_rating ? Number(cat.avg_rating) : null,
        })),
        agentStats: agentStats.map((agent: any) => ({
          agent_id: agent.agent_id,
          agent_name: agent.agent_name,
          total_conversations: Number(agent.total_conversations),
          completed_conversations: Number(agent.completed_conversations),
          average_rating: agent.average_rating ? Number(agent.average_rating) : null,
          avg_duration_minutes: agent.avg_duration_minutes ? Number(agent.avg_duration_minutes) : null,
          satisfaction_rate: agent.satisfaction_rate ? Number(agent.satisfaction_rate) : 0,
        })),
      },
    })
  } catch (error) {
    console.error("Erreur lors de la récupération des analytics:", error)

    // Vérifier si c'est une erreur de table manquante
    if (error instanceof Error && error.message.includes("does not exist")) {
      return NextResponse.json(
        {
          success: false,
          error: "Les tables de chat n'existent pas",
          needsSetup: true,
          details: "Veuillez exécuter le script de création des tables de chat",
        },
        { status: 404 },
      )
    }

    return NextResponse.json(
      {
        success: false,
        error: "Erreur lors de la récupération des analytics",
        details: error instanceof Error ? error.message : "Erreur inconnue",
      },
      { status: 500 },
    )
  }
}
*/