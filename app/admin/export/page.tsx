"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { CalendarIcon, Download, FileSpreadsheet, FileText, Loader2 } from "lucide-react"
import { exportToCSV } from "@/lib/csv-export"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface ExportOptions {
  startDate: Date | undefined
  endDate: Date | undefined
  dataType: string
  format: "csv" | "excel"
}

export default function ExportPage() {
  const [options, setOptions] = useState<ExportOptions>({
    startDate: undefined,
    endDate: undefined,
    dataType: "bookings",
    format: "csv",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [exportCount, setExportCount] = useState<Record<string, number>>({
    bookings: 0,
    vehicles: 0,
    customers: 0,
    payments: 0,
    chat: 0,
  })

  useEffect(() => {
    // Charger les compteurs pour chaque type de données
    const fetchCounts = async () => {
      try {
        const response = await fetch("/api/admin/export/counts")
        if (response.ok) {
          const data = await response.json()
          setExportCount(data.counts)
        }
      } catch (error) {
        console.error("Erreur lors du chargement des compteurs:", error)
      }
    }

    fetchCounts()
  }, [])

  const handleExport = async () => {
    setIsLoading(true)
    setError(null)

    try {
      // Vérifier les dates
      if (!options.startDate || !options.endDate) {
        setError("Veuillez sélectionner une période d'exportation")
        setIsLoading(false)
        return
      }

      // Formater les dates pour l'API
      const startDate = format(options.startDate, "yyyy-MM-dd")
      const endDate = format(options.endDate, "yyyy-MM-dd")

      // Récupérer les données
      const response = await fetch(`/api/admin/export/${options.dataType}?startDate=${startDate}&endDate=${endDate}`)

      if (!response.ok) {
        throw new Error(`Erreur lors de l'exportation: ${response.statusText}`)
      }

      const data = await response.json()

      if (!data.data || data.data.length === 0) {
        setError("Aucune donnée disponible pour cette période")
        setIsLoading(false)
        return
      }

      // Exporter les données
      const filename = `${options.dataType}_${startDate}_${endDate}`
      exportToCSV(data.data, filename)
    } catch (error) {
      console.error("Erreur d'exportation:", error)
      setError(`Erreur lors de l'exportation: ${(error as Error).message}`)
    } finally {
      setIsLoading(false)
    }
  }

  const dataTypeOptions = [
    { value: "bookings", label: "Réservations", icon: <FileText className="h-4 w-4 mr-2" /> },
    { value: "vehicles", label: "Véhicules", icon: <FileText className="h-4 w-4 mr-2" /> },
    { value: "customers", label: "Clients", icon: <FileText className="h-4 w-4 mr-2" /> },
    { value: "payments", label: "Paiements", icon: <FileText className="h-4 w-4 mr-2" /> },
    { value: "chat", label: "Conversations", icon: <FileText className="h-4 w-4 mr-2" /> },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Exportation de données</h1>
        <p className="text-gray-600">Exportez vos données dans différents formats pour analyse</p>
      </div>

      <Tabs defaultValue="standard" className="space-y-4">
        <TabsList>
          <TabsTrigger value="standard">Exportation standard</TabsTrigger>
          <TabsTrigger value="advanced">Options avancées</TabsTrigger>
        </TabsList>

        <TabsContent value="standard" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Exportation rapide</CardTitle>
              <CardDescription>Exportez vos données par catégorie</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {dataTypeOptions.map((option) => (
                  <Card key={option.value} className="bg-gray-50">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-center">
                        {option.icon}
                        {option.label}
                      </CardTitle>
                      <CardDescription>{exportCount[option.value]} enregistrements disponibles</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-between items-center">
                        <div className="text-sm text-gray-500">Format:</div>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setOptions({
                                ...options,
                                dataType: option.value,
                                format: "csv",
                                startDate: new Date(new Date().setDate(new Date().getDate() - 30)),
                                endDate: new Date(),
                              })
                              handleExport()
                            }}
                            disabled={isLoading}
                          >
                            <FileText className="h-4 w-4 mr-2" />
                            CSV
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setOptions({
                                ...options,
                                dataType: option.value,
                                format: "excel",
                                startDate: new Date(new Date().setDate(new Date().getDate() - 30)),
                                endDate: new Date(),
                              })
                              handleExport()
                            }}
                            disabled={isLoading || true}
                          >
                            <FileSpreadsheet className="h-4 w-4 mr-2" />
                            Excel
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {error && (
                <Alert className="mt-4">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="advanced" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Options d'exportation avancées</CardTitle>
              <CardDescription>Personnalisez votre exportation</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Type de données</label>
                    <Select
                      value={options.dataType}
                      onValueChange={(value) => setOptions({ ...options, dataType: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez un type de données" />
                      </SelectTrigger>
                      <SelectContent>
                        {dataTypeOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            <div className="flex items-center">
                              {option.icon}
                              {option.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Format d'exportation</label>
                    <Select
                      value={options.format}
                      onValueChange={(value) => setOptions({ ...options, format: value as "csv" | "excel" })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez un format" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="csv">CSV (Comma Separated Values)</SelectItem>
                        <SelectItem value="excel" disabled>
                          Excel (Bientôt disponible)
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Date de début</label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start text-left font-normal">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {options.startDate ? (
                            format(options.startDate, "PPP", { locale: fr })
                          ) : (
                            <span>Sélectionnez une date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={options.startDate}
                          onSelect={(date) => setOptions({ ...options, startDate: date })}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Date de fin</label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start text-left font-normal">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {options.endDate ? (
                            format(options.endDate, "PPP", { locale: fr })
                          ) : (
                            <span>Sélectionnez une date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={options.endDate}
                          onSelect={(date) => setOptions({ ...options, endDate: date })}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                {error && (
                  <Alert>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div className="flex justify-end">
                  <Button onClick={handleExport} disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Exportation en cours...
                      </>
                    ) : (
                      <>
                        <Download className="mr-2 h-4 w-4" />
                        Exporter les données
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
