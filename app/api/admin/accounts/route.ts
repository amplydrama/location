import { type NextRequest, NextResponse } from "next/server"

// Mock database - in production, use a real database
const adminAccounts = [
  {
    id: 1,
    firstName: "Admin",
    lastName: "Principal",
    email: "admin@carloc-cameroun.com",
    phone: "+237 600 000 000",
    role: "super_admin",
    permissions: ["all"],
    lastLogin: "2024-01-15 10:30:45",
    status: "active",
  },
  {
    id: 2,
    firstName: "Jean",
    lastName: "Kouam",
    email: "jean.kouam@carloc-cameroun.com",
    phone: "+237 677 111 222",
    role: "admin",
    permissions: ["vehicles", "bookings", "customers"],
    lastLogin: "2024-01-14 16:22:10",
    status: "active",
  },
]

// GET - Récupérer tous les comptes administrateurs
export async function GET(request: NextRequest) {
  try {
    return NextResponse.json({
      success: true,
      data: adminAccounts,
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Erreur lors de la récupération des comptes administrateurs" },
      { status: 500 },
    )
  }
}

// POST - Créer un nouveau compte administrateur
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validation des données
    const { firstName, lastName, email, phone, password, role, permissions } = body

    if (!firstName || !lastName || !email || !phone || !password || !role) {
      return NextResponse.json({ success: false, error: "Données manquantes" }, { status: 400 })
    }

    // Vérifier si l'email existe déjà
    const emailExists = adminAccounts.some((admin) => admin.email === email)
    if (emailExists) {
      return NextResponse.json({ success: false, error: "Cet email est déjà utilisé" }, { status: 400 })
    }

    // Création du compte (dans une vraie application, le mot de passe serait haché)
    const newAdmin = {
      id: adminAccounts.length + 1,
      firstName,
      lastName,
      email,
      phone,
      role,
      permissions: permissions || [],
      lastLogin: null,
      status: "active",
    }

    adminAccounts.push(newAdmin)

    return NextResponse.json({
      success: true,
      data: newAdmin,
      message: "Compte administrateur créé avec succès",
    })
  } catch (error) {
    console.error("Erreur lors de la création du compte administrateur:", error)
    return NextResponse.json(
      { success: false, error: "Erreur lors de la création du compte administrateur" },
      { status: 500 },
    )
  }
}

// PUT - Mettre à jour un compte administrateur
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, firstName, lastName, email, phone, role, permissions, status } = body

    if (!id) {
      return NextResponse.json({ success: false, error: "ID administrateur manquant" }, { status: 400 })
    }

    // Trouver l'administrateur à mettre à jour
    const adminIndex = adminAccounts.findIndex((admin) => admin.id === id)
    if (adminIndex === -1) {
      return NextResponse.json({ success: false, error: "Administrateur non trouvé" }, { status: 404 })
    }

    // Mettre à jour les informations
    const updatedAdmin = {
      ...adminAccounts[adminIndex],
      firstName: firstName || adminAccounts[adminIndex].firstName,
      lastName: lastName || adminAccounts[adminIndex].lastName,
      email: email || adminAccounts[adminIndex].email,
      phone: phone || adminAccounts[adminIndex].phone,
      role: role || adminAccounts[adminIndex].role,
      permissions: permissions || adminAccounts[adminIndex].permissions,
      status: status || adminAccounts[adminIndex].status,
    }

    adminAccounts[adminIndex] = updatedAdmin

    return NextResponse.json({
      success: true,
      data: updatedAdmin,
      message: "Compte administrateur mis à jour avec succès",
    })
  } catch (error) {
    console.error("Erreur lors de la mise à jour du compte administrateur:", error)
    return NextResponse.json(
      { success: false, error: "Erreur lors de la mise à jour du compte administrateur" },
      { status: 500 },
    )
  }
}

// DELETE - Supprimer un compte administrateur
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ success: false, error: "ID administrateur manquant" }, { status: 400 })
    }

    const adminId = Number.parseInt(id)
    const adminIndex = adminAccounts.findIndex((admin) => admin.id === adminId)

    if (adminIndex === -1) {
      return NextResponse.json({ success: false, error: "Administrateur non trouvé" }, { status: 404 })
    }

    // Empêcher la suppression du super admin principal
    if (adminId === 1) {
      return NextResponse.json(
        { success: false, error: "Impossible de supprimer le super administrateur principal" },
        { status: 403 },
      )
    }

    // Supprimer l'administrateur
    adminAccounts.splice(adminIndex, 1)

    return NextResponse.json({
      success: true,
      message: "Compte administrateur supprimé avec succès",
    })
  } catch (error) {
    console.error("Erreur lors de la suppression du compte administrateur:", error)
    return NextResponse.json(
      { success: false, error: "Erreur lors de la suppression du compte administrateur" },
      { status: 500 },
    )
  }
}
