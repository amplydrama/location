import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")
    const type = searchParams.get("type")
    const location = searchParams.get("location")
    const search = searchParams.get("search")

    let query = `
      SELECT v.*, 
             COUNT(b.id) as total_bookings,
             AVG(b.rating) as average_rating,
             SUM(CASE WHEN b.status = 'confirmed' THEN b.total_amount ELSE 0 END) as total_revenue
      FROM vehicles v
      LEFT JOIN bookings b ON v.id = b.vehicle_id
      WHERE 1=1
    `

    const params: any[] = []
    let paramIndex = 1

    if (status && status !== "all") {
      query += ` AND v.status = $${paramIndex}`
      params.push(status)
      paramIndex++
    }

    if (type && type !== "all") {
      query += ` AND v.type = $${paramIndex}`
      params.push(type)
      paramIndex++
    }

    if (location && location !== "all") {
      query += ` AND v.location = $${paramIndex}`
      params.push(location)
      paramIndex++
    }

    if (search) {
      query += ` AND (v.name ILIKE $${paramIndex} OR v.brand ILIKE $${paramIndex} OR v.plate_number ILIKE $${paramIndex})`
      params.push(`%${search}%`)
      paramIndex++
    }

    query += ` GROUP BY v.id ORDER BY v.created_at DESC`

    const vehicles = await sql(query, params)

    return NextResponse.json({ vehicles })
  } catch (error) {
    console.error("Erreur lors de la récupération des véhicules:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      name,
      brand,
      model,
      year,
      type,
      plateNumber,
      color,
      seats,
      transmission,
      fuelType,
      pricePerDay,
      location,
      description,
      features,
      images,
      insurance,
      specifications,
    } = body

    // Validation des données requises
    if (!name || !brand || !model || !year || !type || !plateNumber || !pricePerDay || !location) {
      return NextResponse.json({ error: "Champs requis manquants" }, { status: 400 })
    }

    // Vérifier si la plaque d'immatriculation existe déjà
    const existingVehicle = await sql("SELECT id FROM vehicles WHERE plate_number = $1", [plateNumber])

    if (existingVehicle.length > 0) {
      return NextResponse.json({ error: "Cette plaque d'immatriculation existe déjà" }, { status: 400 })
    }

    // Insérer le nouveau véhicule
    const result = await sql(
      `
      INSERT INTO vehicles (
        name, brand, model, year, type, plate_number, color, seats,
        transmission, fuel_type, price_per_day, location, description,
        features, images, insurance_info, specifications, status, created_at
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, 'available', NOW()
      ) RETURNING *
    `,
      [
        name,
        brand,
        model,
        year,
        type,
        plateNumber,
        color,
        seats,
        transmission,
        fuelType,
        pricePerDay,
        location,
        description,
        JSON.stringify(features || []),
        JSON.stringify(images || []),
        JSON.stringify(insurance || {}),
        JSON.stringify(specifications || {}),
      ],
    )

    return NextResponse.json({
      success: true,
      vehicle: result[0],
      message: "Véhicule ajouté avec succès",
    })
  } catch (error) {
    console.error("Erreur lors de l'ajout du véhicule:", error)
    return NextResponse.json({ error: "Erreur serveur lors de l'ajout" }, { status: 500 })
  }
}
