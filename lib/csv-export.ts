export function exportToCSV(data: any[], filename: string) {
  if (!data || data.length === 0) {
    console.warn("Aucune donnée à exporter")
    return
  }

  // Obtenir les en-têtes à partir du premier objet
  const headers = Object.keys(data[0])

  // Traduire les en-têtes en français si nécessaire
  const headerTranslations: Record<string, string> = {
    id: "ID",
    client_id: "ID Client",
    client_name: "Nom du Client",
    agent_id: "ID Agent",
    agent_name: "Nom de l'Agent",
    start_time: "Heure de Début",
    end_time: "Heure de Fin",
    status: "Statut",
    category: "Catégorie",
    rating: "Évaluation",
    duration_minutes: "Durée (min)",
    message_count: "Nombre de Messages",
    date: "Date",
    conversations: "Conversations",
    completed: "Terminées",
    avg_rating: "Note Moyenne",
    count: "Nombre",
    satisfaction_rate: "Taux de Satisfaction",
    total_conversations: "Total Conversations",
    completed_conversations: "Conversations Terminées",
    average_rating: "Note Moyenne",
    avg_duration_minutes: "Durée Moyenne (min)",
    avg_response_time: "Temps de Réponse Moyen (s)",
    avg_resolution_time: "Temps de Résolution Moyen (s)",
  }

  // Formater les en-têtes
  const formattedHeaders = headers.map((header) => headerTranslations[header] || header)

  // Créer le contenu CSV avec des en-têtes traduits
  const csvContent = [
    // En-têtes
    formattedHeaders.join(","),
    // Données
    ...data.map((row) =>
      headers
        .map((header) => {
          let value = row[header]

          // Formater les dates
          if (header.includes("time") || (header.includes("date") && value)) {
            try {
              if (typeof value === "string") {
                const date = new Date(value)
                if (!isNaN(date.getTime())) {
                  value = date.toLocaleString("fr-FR")
                }
              }
            } catch (e) {
              // Garder la valeur originale en cas d'erreur
            }
          }

          // Formater les nombres décimaux
          if (typeof value === "number" && !Number.isInteger(value)) {
            value = value.toFixed(2)
          }

          // Échapper les guillemets et entourer de guillemets si nécessaire
          if (typeof value === "string" && (value.includes(",") || value.includes('"') || value.includes("\n"))) {
            return `"${value.replace(/"/g, '""')}"`
          }
          return value !== undefined && value !== null ? value : ""
        })
        .join(","),
    ),
  ].join("\n")

  // Créer et télécharger le fichier avec BOM pour support UTF-8 dans Excel
  const blob = new Blob(["\ufeff" + csvContent], { type: "text/csv;charset=utf-8;" })
  const link = document.createElement("a")

  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", `${filename}_${new Date().toISOString().slice(0, 10)}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }
}

export function exportToExcel(data: any[], filename: string) {
  // Pour une future implémentation Excel
  console.log("Export Excel à implémenter", data, filename)
}
