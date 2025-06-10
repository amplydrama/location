import { NextResponse } from "next/server"

// Interface pour les configurations de thèmes
interface ThemeConfiguration {
  id?: string
  name: string
  description: string
  version: string
  createdAt: string
  author: string
  appearance: any
  metadata: {
    tags: string[]
    category: string
    compatibility: string
  }
}

// Simuler une base de données de thèmes
const themeDatabase: ThemeConfiguration[] = [
  {
    id: "1",
    name: "Thème Cameroun Officiel",
    description: "Thème aux couleurs officielles du Cameroun avec design moderne",
    version: "1.0.0",
    createdAt: "2024-01-15T10:00:00Z",
    author: "Équipe Design",
    appearance: {
      logo: "/logo.png",
      favicon: "/favicon.ico",
      theme: "custom",
      customColors: {
        primary: "#007a5e",
        secondary: "#ce1126",
        accent: "#fcd116",
        background: "#ffffff",
        foreground: "#0f172a",
        muted: "#f1f5f9",
        card: "#ffffff",
      },
      fontFamily: "Poppins",
      borderRadius: "medium",
      animations: true,
      heroImage: "/hero-cameroon.jpg",
    },
    metadata: {
      tags: ["cameroun", "officiel", "patriotique"],
      category: "national",
      compatibility: "v1.0+",
    },
  },
]

// GET - Récupérer tous les thèmes ou un thème spécifique
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")
    const category = searchParams.get("category")
    const tags = searchParams.get("tags")

    let filteredThemes = themeDatabase

    // Filtrer par ID
    if (id) {
      const theme = themeDatabase.find((t) => t.id === id)
      if (!theme) {
        return NextResponse.json({ success: false, error: "Thème non trouvé" }, { status: 404 })
      }
      return NextResponse.json({ success: true, data: theme })
    }

    // Filtrer par catégorie
    if (category) {
      filteredThemes = filteredThemes.filter((t) => t.metadata.category === category)
    }

    // Filtrer par tags
    if (tags) {
      const tagList = tags.split(",").map((tag) => tag.trim().toLowerCase())
      filteredThemes = filteredThemes.filter((t) => t.metadata.tags.some((tag) => tagList.includes(tag.toLowerCase())))
    }

    return NextResponse.json({
      success: true,
      data: filteredThemes,
      total: filteredThemes.length,
    })
  } catch (error) {
    console.error("Erreur lors de la récupération des thèmes:", error)
    return NextResponse.json({ success: false, error: "Erreur lors de la récupération des thèmes" }, { status: 500 })
  }
}

// POST - Sauvegarder un nouveau thème
export async function POST(request: Request) {
  try {
    const themeData: Omit<ThemeConfiguration, "id" | "createdAt"> = await request.json()

    // Validation des données
    if (!themeData.name || !themeData.appearance) {
      return NextResponse.json({ success: false, error: "Données de thème invalides" }, { status: 400 })
    }

    // Créer un nouveau thème
    const newTheme: ThemeConfiguration = {
      ...themeData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    }

    // Ajouter à la "base de données"
    themeDatabase.push(newTheme)

    return NextResponse.json({
      success: true,
      message: "Thème sauvegardé avec succès",
      data: newTheme,
    })
  } catch (error) {
    console.error("Erreur lors de la sauvegarde du thème:", error)
    return NextResponse.json({ success: false, error: "Erreur lors de la sauvegarde du thème" }, { status: 500 })
  }
}

// PUT - Mettre à jour un thème existant
export async function PUT(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ success: false, error: "ID du thème requis" }, { status: 400 })
    }

    const themeData: Partial<ThemeConfiguration> = await request.json()
    const themeIndex = themeDatabase.findIndex((t) => t.id === id)

    if (themeIndex === -1) {
      return NextResponse.json({ success: false, error: "Thème non trouvé" }, { status: 404 })
    }

    // Mettre à jour le thème
    themeDatabase[themeIndex] = {
      ...themeDatabase[themeIndex],
      ...themeData,
      id, // Garder l'ID original
    }

    return NextResponse.json({
      success: true,
      message: "Thème mis à jour avec succès",
      data: themeDatabase[themeIndex],
    })
  } catch (error) {
    console.error("Erreur lors de la mise à jour du thème:", error)
    return NextResponse.json({ success: false, error: "Erreur lors de la mise à jour du thème" }, { status: 500 })
  }
}

// DELETE - Supprimer un thème
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ success: false, error: "ID du thème requis" }, { status: 400 })
    }

    const themeIndex = themeDatabase.findIndex((t) => t.id === id)

    if (themeIndex === -1) {
      return NextResponse.json({ success: false, error: "Thème non trouvé" }, { status: 404 })
    }

    // Supprimer le thème
    const deletedTheme = themeDatabase.splice(themeIndex, 1)[0]

    return NextResponse.json({
      success: true,
      message: "Thème supprimé avec succès",
      data: deletedTheme,
    })
  } catch (error) {
    console.error("Erreur lors de la suppression du thème:", error)
    return NextResponse.json({ success: false, error: "Erreur lors de la suppression du thème" }, { status: 500 })
  }
}
