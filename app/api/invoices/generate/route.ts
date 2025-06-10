import { type NextRequest, NextResponse } from "next/server"

// Simulation de génération de facture PDF
// En production, utiliser une bibliothèque comme jsPDF, PDFKit ou Puppeteer
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { bookingId, customerInfo, vehicleInfo, paymentInfo } = body

    // Validation des données
    if (!bookingId || !customerInfo || !vehicleInfo || !paymentInfo) {
      return NextResponse.json(
        { success: false, error: "Données manquantes pour la génération de facture" },
        { status: 400 },
      )
    }

    // Génération du numéro de facture
    const invoiceNumber = `INV-${new Date().getFullYear()}-${String(bookingId).padStart(6, "0")}`

    // Données de la facture
    const invoiceData = {
      invoiceNumber,
      date: new Date().toISOString().split("T")[0],
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],

      // Informations de l'agence
      company: {
        name: "CarLoc Cameroun",
        address: "123 Avenue de la Liberté",
        city: "Douala, Cameroun",
        phone: "+237 6XX XXX XXX",
        email: "info@carloc-cameroun.com",
        website: "www.carloc-cameroun.com",
      },

      // Informations client
      customer: {
        name: `${customerInfo.firstName} ${customerInfo.lastName}`,
        email: customerInfo.email,
        phone: customerInfo.phone,
        address: customerInfo.address || "Non spécifiée",
        idNumber: customerInfo.idNumber,
      },

      // Détails de la réservation
      booking: {
        id: bookingId,
        vehicle: vehicleInfo.name,
        startDate: vehicleInfo.startDate,
        endDate: vehicleInfo.endDate,
        totalDays: vehicleInfo.totalDays,
        pricePerDay: vehicleInfo.pricePerDay,
        subtotal: vehicleInfo.subtotal,
        serviceFee: vehicleInfo.serviceFee,
        total: vehicleInfo.total,
      },

      // Informations de paiement
      payment: {
        method: paymentInfo.method,
        reference: paymentInfo.reference,
        status: paymentInfo.status,
        date: paymentInfo.date,
      },
    }

    // Simulation de la génération PDF
    // En production, générer le vrai PDF ici
    const pdfPath = `/invoices/${invoiceNumber}.pdf`

    // Template HTML pour la facture (simplifié)
    const invoiceHTML = generateInvoiceHTML(invoiceData)

    // Log pour le développement
    console.log("Facture générée:", invoiceData)
    console.log("HTML de la facture:", invoiceHTML.substring(0, 200) + "...")

    return NextResponse.json({
      success: true,
      data: {
        invoiceNumber,
        pdfPath,
        downloadUrl: `/api/invoices/download/${invoiceNumber}`,
        invoiceData,
      },
      message: "Facture générée avec succès",
    })
  } catch (error) {
    console.error("Erreur génération facture:", error)
    return NextResponse.json({ success: false, error: "Erreur lors de la génération de la facture" }, { status: 500 })
  }
}

function generateInvoiceHTML(data: any): string {
  return `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Facture ${data.invoiceNumber}</title>
        <style>
            body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .company-info { margin-bottom: 30px; }
            .invoice-details { display: flex; justify-content: space-between; margin-bottom: 30px; }
            .customer-info { margin-bottom: 30px; }
            .booking-details { margin-bottom: 30px; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
            th, td { padding: 10px; text-align: left; border-bottom: 1px solid #ddd; }
            .total { font-weight: bold; font-size: 1.2em; }
            .footer { margin-top: 50px; text-align: center; font-size: 0.9em; color: #666; }
        </style>
    </head>
    <body>
        <div class="header">
            <h1>${data.company.name}</h1>
            <h2>FACTURE</h2>
        </div>
        
        <div class="company-info">
            <p><strong>${data.company.name}</strong></p>
            <p>${data.company.address}</p>
            <p>${data.company.city}</p>
            <p>Tél: ${data.company.phone}</p>
            <p>Email: ${data.company.email}</p>
        </div>
        
        <div class="invoice-details">
            <div>
                <p><strong>Facture N°:</strong> ${data.invoiceNumber}</p>
                <p><strong>Date:</strong> ${data.date}</p>
                <p><strong>Échéance:</strong> ${data.dueDate}</p>
            </div>
        </div>
        
        <div class="customer-info">
            <h3>Informations Client</h3>
            <p><strong>Nom:</strong> ${data.customer.name}</p>
            <p><strong>Email:</strong> ${data.customer.email}</p>
            <p><strong>Téléphone:</strong> ${data.customer.phone}</p>
            <p><strong>Adresse:</strong> ${data.customer.address}</p>
            <p><strong>N° CNI:</strong> ${data.customer.idNumber}</p>
        </div>
        
        <div class="booking-details">
            <h3>Détails de la Réservation</h3>
            <table>
                <tr>
                    <th>Description</th>
                    <th>Période</th>
                    <th>Durée</th>
                    <th>Prix unitaire</th>
                    <th>Total</th>
                </tr>
                <tr>
                    <td>Location ${data.booking.vehicle}</td>
                    <td>${data.booking.startDate} au ${data.booking.endDate}</td>
                    <td>${data.booking.totalDays} jour(s)</td>
                    <td>${data.booking.pricePerDay.toLocaleString()} FCFA</td>
                    <td>${data.booking.subtotal.toLocaleString()} FCFA</td>
                </tr>
                <tr>
                    <td>Frais de service</td>
                    <td>-</td>
                    <td>-</td>
                    <td>-</td>
                    <td>${data.booking.serviceFee.toLocaleString()} FCFA</td>
                </tr>
                <tr class="total">
                    <td colspan="4"><strong>TOTAL</strong></td>
                    <td><strong>${data.booking.total.toLocaleString()} FCFA</strong></td>
                </tr>
            </table>
        </div>
        
        <div class="payment-info">
            <h3>Informations de Paiement</h3>
            <p><strong>Mode de paiement:</strong> ${data.payment.method}</p>
            <p><strong>Référence:</strong> ${data.payment.reference}</p>
            <p><strong>Statut:</strong> ${data.payment.status}</p>
            <p><strong>Date de paiement:</strong> ${data.payment.date}</p>
        </div>
        
        <div class="footer">
            <p>Merci de votre confiance !</p>
            <p>${data.company.name} - ${data.company.website}</p>
        </div>
    </body>
    </html>
  `
}
