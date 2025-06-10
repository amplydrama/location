import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ success: false, error: "Aucun fichier fourni" }, { status: 400 })
    }

    // Vérifier le type de fichier
    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ success: false, error: "Le fichier doit être une image" }, { status: 400 })
    }

    // Vérifier la taille du fichier (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, error: "La taille du fichier ne doit pas dépasser 5MB" },
        { status: 400 },
      )
    }

    // Dans une implémentation réelle, vous utiliseriez un service de stockage comme Vercel Blob
    // const { url } = await put(`vehicles/${file.name}`, file, { access: 'public' });

    // Pour cette démo, nous simulons un URL de fichier
    const url = `/placeholder.svg?height=200&width=400&text=${encodeURIComponent(file.name)}`

    // Simuler un délai pour l'upload
    await new Promise((resolve) => setTimeout(resolve, 1000))

    return NextResponse.json({
      success: true,
      url,
      name: file.name,
      size: file.size,
      type: file.type,
    })
  } catch (error) {
    console.error("Erreur lors de l'upload de l'image:", error)
    return NextResponse.json({ success: false, error: "Erreur lors de l'upload de l'image" }, { status: 500 })
  }
}
