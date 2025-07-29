import { type NextRequest, NextResponse } from "next/server"

// Mock storage for contact messages
const contactMessages: any[] = []

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validation des données
    const { firstName, lastName, email, phone, subject, message, city } = body

    if (!firstName || !lastName || !email || !phone || !subject || !message) {
      return NextResponse.json(
        { success: false, error: "Tous les champs obligatoires doivent être remplis" },
        { status: 400 },
      )
    }

    // Validation de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ success: false, error: "Format d'email invalide" }, { status: 400 })
    }

    // Validation du téléphone camerounais
    const phoneRegex = /^(\+237|237)?[6-9]\d{8}$/
    if (!phoneRegex.test(phone.replace(/\s/g, ""))) {
      return NextResponse.json({ success: false, error: "Format de téléphone invalide" }, { status: 400 })
    }

    // Création du message de contact
    const contactMessage = {
      id: contactMessages.length + 1,
      firstName,
      lastName,
      email,
      phone,
      subject,
      message,
      city: city || "Non spécifiée",
      status: "nouveau",
      createdAt: new Date().toISOString(),
    }

    contactMessages.push(contactMessage)

    // En production, ici vous pourriez :
    // 1. Sauvegarder en base de données
    // 2. Envoyer un email de notification à l'équipe
    // 3. Envoyer un email de confirmation au client
    // 4. Créer un ticket dans un système de support

    console.log("Nouveau message de contact reçu:", contactMessage)

    // Simulation de l'envoi d'email de notification
    await sendNotificationEmail(contactMessage)

    // Simulation de l'envoi d'email de confirmation au client
    await sendConfirmationEmail(contactMessage)

    return NextResponse.json({
      success: true,
      data: {
        id: contactMessage.id,
        message: "Votre message a été envoyé avec succès. Nous vous répondrons dans les plus brefs délais.",
      },
    })
  } catch (error) {
    console.error("Erreur lors de l'envoi du message de contact:", error)
    return NextResponse.json(
      { success: false, error: "Erreur lors de l'envoi du message. Veuillez réessayer." },
      { status: 500 },
    )
  }
}

// GET - Récupérer tous les messages de contact (pour l'admin)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")
    const limit = Number.parseInt(searchParams.get("limit") || "50")

    let filteredMessages = contactMessages

    if (status && status !== "all") {
      filteredMessages = contactMessages.filter((msg) => msg.status === status)
    }

    // Trier par date de création (plus récent en premier)
    filteredMessages.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    // Limiter le nombre de résultats
    filteredMessages = filteredMessages.slice(0, limit)

    return NextResponse.json({
      success: true,
      data: filteredMessages,
      total: contactMessages.length,
    })
  } catch (error) {
    console.error("Erreur lors de la récupération des messages:", error)
    return NextResponse.json({ success: false, error: "Erreur lors de la récupération des messages" }, { status: 500 })
  }
}

// Fonction pour envoyer un email de notification à l'équipe (simulation)
async function sendNotificationEmail(contactMessage: any) {
  // En production, utiliser un service d'email comme SendGrid, Mailgun, etc.
  console.log("Email de notification envoyé à l'équipe pour le message:", contactMessage.id)

  const emailContent = `
    Nouveau message de contact reçu sur CarLoc Cameroun

    De: ${contactMessage.firstName} ${contactMessage.lastName}
    Email: ${contactMessage.email}
    Téléphone: ${contactMessage.phone}
    Ville: ${contactMessage.city}
    Sujet: ${contactMessage.subject}

    Message:
    ${contactMessage.message}

    Reçu le: ${new Date(contactMessage.createdAt).toLocaleString("fr-FR")}
  `

  // Simulation de l'envoi
  return Promise.resolve(emailContent)
}

// Fonction pour envoyer un email de confirmation au client (simulation)
async function sendConfirmationEmail(contactMessage: any) {
  // En production, utiliser un service d'email
  console.log("Email de confirmation envoyé à:", contactMessage.email)

  const emailContent = `
    Bonjour ${contactMessage.firstName},

    Nous avons bien reçu votre message concernant "${contactMessage.subject}".

    Notre équipe vous répondra dans les plus brefs délais à l'adresse ${contactMessage.email}.

    Merci de votre confiance.

    L'équipe CarLoc Cameroun
  `

  // Simulation de l'envoi
  return Promise.resolve(emailContent)
}
