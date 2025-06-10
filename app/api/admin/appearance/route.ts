import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Dans une implémentation réelle, vous récupéreriez les données depuis la base de données
    const appearance = {
      logo: "/logo.png",
      favicon: "/favicon.ico",
      theme: "light",
      customColors: {
        primary: "#0f766e",
        secondary: "#f97316",
        accent: "#0ea5e9",
        background: "#ffffff",
        foreground: "#0f172a",
        muted: "#f1f5f9",
        card: "#ffffff",
      },
      fontFamily: "Inter",
      borderRadius: "medium",
      animations: true,
      heroImage: "/hero-image.jpg",
    }

    return NextResponse.json({ success: true, data: appearance })
  } catch (error) {
    console.error("Erreur lors de la récupération des paramètres d'apparence:", error)
    return NextResponse.json(
      { success: false, error: "Erreur lors de la récupération des paramètres d'apparence" },
      { status: 500 },
    )
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()

    // Validation des données
    if (!data) {
      return NextResponse.json({ success: false, error: "Données manquantes" }, { status: 400 })
    }

    // Dans une implémentation réelle, vous sauvegarderiez les données dans la base de données
    // await db.appearance.upsert({ where: { id: 1 }, update: data, create: { ...data, id: 1 } })

    return NextResponse.json({ success: true, message: "Paramètres d'apparence sauvegardés avec succès" })
  } catch (error) {
    console.error("Erreur lors de la sauvegarde des paramètres d'apparence:", error)
    return NextResponse.json(
      { success: false, error: "Erreur lors de la sauvegarde des paramètres d'apparence" },
      { status: 500 },
    )
  }
}
