import { type NextRequest, NextResponse } from "next/server"

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, phone, address } = body

    // Validation des données
    if (!name || !email) {
      return NextResponse.json({ error: "Le nom et l'email sont requis" }, { status: 400 })
    }

    // Ici, vous intégreriez avec votre base de données
    // Pour l'exemple, on simule une mise à jour réussie

    // Simulation d'une mise à jour en base de données
    const updatedProfile = {
      id: 1,
      name,
      email,
      phone,
      address,
      updatedAt: new Date().toISOString(),
    }

    return NextResponse.json({
      message: "Profil mis à jour avec succès",
      profile: updatedProfile,
    })
  } catch (error) {
    console.error("Erreur lors de la mise à jour du profil:", error)
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 })
  }
}

export async function GET() {
  try {
    // Ici, vous récupéreriez les données depuis votre base de données
    const profile = {
      id: 1,
      name: "Administrateur Principal",
      email: "admin@carloc-cameroun.com",
      phone: "+237 677 123 456",
      address: "Douala, Cameroun",
      role: "Super Administrateur",
      lastLogin: "2024-01-15 14:30",
      createdAt: "2023-06-01",
    }

    return NextResponse.json({ profile })
  } catch (error) {
    console.error("Erreur lors de la récupération du profil:", error)
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 })
  }
}
