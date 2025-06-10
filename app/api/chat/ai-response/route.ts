import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@vercel/postgres"

// Simulation d'une base de connaissances pour CarLoc Cameroun
const knowledgeBase = {
  vehicles: {
    economique: {
      models: ["Hyundai Accent", "Toyota Yaris", "Nissan Micra"],
      price: "25,000 - 35,000 FCFA/jour",
      features: ["Climatisation", "Direction assistée", "Radio"],
    },
    berline: {
      models: ["Toyota Corolla", "Honda Civic", "Nissan Sentra"],
      price: "40,000 - 55,000 FCFA/jour",
      features: ["Climatisation", "GPS", "Bluetooth", "Sièges en cuir"],
    },
    suv: {
      models: ["Toyota RAV4", "Nissan Pathfinder", "Honda CR-V"],
      price: "60,000 - 85,000 FCFA/jour",
      features: ["4x4", "7 places", "GPS", "Climatisation automatique"],
    },
  },
  locations: ["Douala", "Yaoundé", "Bafoussam", "Bamenda", "Garoua"],
  services: {
    delivery: "Livraison gratuite dans un rayon de 10km",
    insurance: "Assurance tous risques incluse",
    support: "Support 24h/7j",
    payment: "MTN MoMo, Orange Money acceptés",
  },
  contact: {
    phone: "+237 677 123 456",
    whatsapp: "+237 677 123 456",
    email: "contact@carloc-cameroun.com",
    hours: "8h00 - 18h00, Lundi à Samedi",
  },
}

function generateAIResponse(message: string): string {
  const lowerMessage = message.toLowerCase()

  // Salutations
  if (lowerMessage.includes("bonjour") || lowerMessage.includes("salut") || lowerMessage.includes("hello")) {
    return "Bonjour ! Bienvenue chez CarLoc Cameroun. Je suis votre assistant virtuel. Comment puis-je vous aider aujourd'hui ? Vous pouvez me poser des questions sur nos véhicules, tarifs, réservations ou services."
  }

  // Questions sur les véhicules
  if (lowerMessage.includes("véhicule") || lowerMessage.includes("voiture") || lowerMessage.includes("auto")) {
    if (lowerMessage.includes("économique") || lowerMessage.includes("pas cher")) {
      return `Nos véhicules économiques incluent : ${knowledgeBase.vehicles.economique.models.join(", ")}. Prix : ${knowledgeBase.vehicles.economique.price}. Équipements : ${knowledgeBase.vehicles.economique.features.join(", ")}.`
    }
    if (lowerMessage.includes("berline") || lowerMessage.includes("confort")) {
      return `Nos berlines disponibles : ${knowledgeBase.vehicles.berline.models.join(", ")}. Prix : ${knowledgeBase.vehicles.berline.price}. Équipements : ${knowledgeBase.vehicles.berline.features.join(", ")}.`
    }
    if (lowerMessage.includes("suv") || lowerMessage.includes("4x4") || lowerMessage.includes("famille")) {
      return `Nos SUV disponibles : ${knowledgeBase.vehicles.suv.models.join(", ")}. Prix : ${knowledgeBase.vehicles.suv.price}. Équipements : ${knowledgeBase.vehicles.suv.features.join(", ")}.`
    }
    return "Nous proposons 3 catégories de véhicules : Économique (25-35k FCFA/jour), Berline (40-55k FCFA/jour), et SUV (60-85k FCFA/jour). Quelle catégorie vous intéresse ?"
  }

  // Questions sur les prix
  if (lowerMessage.includes("prix") || lowerMessage.includes("tarif") || lowerMessage.includes("coût")) {
    return "Nos tarifs démarrent à 25,000 FCFA/jour pour les véhicules économiques. Berlines : 40,000-55,000 FCFA/jour. SUV : 60,000-85,000 FCFA/jour. Réductions disponibles pour locations longue durée."
  }

  // Questions sur la réservation
  if (lowerMessage.includes("réservation") || lowerMessage.includes("réserver") || lowerMessage.includes("louer")) {
    return "Pour réserver, j'ai besoin de : 1) Dates de location, 2) Lieu de prise en charge, 3) Type de véhicule souhaité. Vous pouvez réserver en ligne ou nous appeler au +237 677 123 456. Acompte de 30% requis."
  }

  // Questions sur les lieux
  if (lowerMessage.includes("où") || lowerMessage.includes("lieu") || lowerMessage.includes("ville")) {
    return `Nous sommes présents dans les villes suivantes : ${knowledgeBase.locations.join(", ")}. Livraison gratuite dans un rayon de 10km de nos agences.`
  }

  // Questions sur le paiement
  if (
    lowerMessage.includes("paiement") ||
    lowerMessage.includes("payer") ||
    lowerMessage.includes("momo") ||
    lowerMessage.includes("orange money")
  ) {
    return "Nous acceptons : MTN Mobile Money, Orange Money, et paiement en espèces. Acompte de 30% à la réservation, solde à la prise en charge du véhicule."
  }

  // Questions sur le contact
  if (lowerMessage.includes("contact") || lowerMessage.includes("téléphone") || lowerMessage.includes("appeler")) {
    return `Contactez-nous : Téléphone/WhatsApp : ${knowledgeBase.contact.phone}, Email : ${knowledgeBase.contact.email}. Horaires : ${knowledgeBase.contact.hours}.`
  }

  // Questions sur l'assurance
  if (lowerMessage.includes("assurance") || lowerMessage.includes("accident") || lowerMessage.includes("dommage")) {
    return "Tous nos véhicules sont couverts par une assurance tous risques. En cas d'accident, contactez immédiatement notre service d'urgence au +237 677 123 456. Franchise de 50,000 FCFA selon les cas."
  }

  // Questions sur les horaires
  if (lowerMessage.includes("heure") || lowerMessage.includes("ouvert") || lowerMessage.includes("horaire")) {
    return `Nos horaires : ${knowledgeBase.contact.hours}. Service d'urgence 24h/24 pour nos clients en location.`
  }

  // Réponse par défaut
  return "Je comprends votre question mais j'aimerais vous mettre en contact avec un de nos conseillers pour une réponse plus précise. Vous pouvez nous appeler au +237 677 123 456 ou utiliser WhatsApp. Puis-je vous aider avec autre chose ?"
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { message, conversationId } = body

    if (!message) {
      return NextResponse.json({ error: "Message requis" }, { status: 400 })
    }

    // Générer la réponse IA
    const response = generateAIResponse(message)

    let conversation_id = conversationId

    // Sauvegarder la conversation en base de données si possible
    try {
      if (!conversationId) {
        // Créer une nouvelle conversation
        const result = await sql`
          INSERT INTO chat_conversations (client_id, agent_id, status, category)
          VALUES ('ai_client', 'ai_agent', 'active', 'assistance_automatique')
          RETURNING id;
        `
        conversation_id = result.rows[0].id

        // Ajouter les participants
        await sql`
          INSERT INTO chat_participants (conversation_id, participant_id, participant_name, participant_type)
          VALUES (${conversation_id}, 'ai_client', 'Visiteur Web', 'client'),
                 (${conversation_id}, 'ai_agent', 'Assistant IA', 'agent');
        `
      }

      // Ajouter le message du client
      await sql`
        INSERT INTO chat_messages (conversation_id, sender_id, sender_type, content)
        VALUES (${conversation_id}, 'ai_client', 'client', ${message});
      `

      // Ajouter la réponse de l'IA
      await sql`
        INSERT INTO chat_messages (conversation_id, sender_id, sender_type, content)
        VALUES (${conversation_id}, 'ai_agent', 'agent', ${response});
      `
    } catch (dbError) {
      // Continuer même si la sauvegarde échoue
      console.error("Erreur de base de données:", dbError)
    }

    return NextResponse.json({
      response,
      conversationId: conversation_id || `conv_${Date.now()}`,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Erreur IA:", error)
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 })
  }
}
