"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Search,
  Download,
  Eye,
  RefreshCw,
  CreditCard,
  Smartphone,
  AlertCircle,
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react"
import { exportToCSV } from "@/lib/csv-export"

// Mock data pour les paiements
const payments = [
  {
    id: "PAY001",
    bookingId: "BK001",
    customer: "Jean Dupont",
    amount: 75000,
    method: "MTN MoMo",
    type: "Paiement complet",
    status: "Réussi",
    transactionId: "MTN-2024-001-789",
    phoneNumber: "+237677123456",
    date: "2024-01-15",
    time: "14:30",
    fees: 750,
    netAmount: 74250,
    reference: "REF-001-2024",
  },
  {
    id: "PAY002",
    bookingId: "BK002",
    customer: "Marie Ngono",
    amount: 50000,
    method: "Orange Money",
    type: "Acompte",
    status: "Réussi",
    transactionId: "OM-2024-002-456",
    phoneNumber: "+237699987654",
    date: "2024-01-16",
    time: "09:15",
    fees: 500,
    netAmount: 49500,
    reference: "REF-002-2024",
  },
  {
    id: "PAY003",
    bookingId: "BK003",
    customer: "Paul Mbarga",
    amount: 40000,
    method: "MTN MoMo",
    type: "Paiement complet",
    status: "En attente",
    transactionId: "MTN-2024-003-123",
    phoneNumber: "+237655111222",
    date: "2024-01-14",
    time: "16:45",
    fees: 400,
    netAmount: 39600,
    reference: "REF-003-2024",
  },
  {
    id: "PAY004",
    bookingId: "BK004",
    customer: "Fatima Bello",
    amount: 90000,
    method: "Orange Money",
    type: "Paiement complet",
    status: "Échoué",
    transactionId: "OM-2024-004-789",
    phoneNumber: "+237677333444",
    date: "2024-01-12",
    time: "11:20",
    fees: 900,
    netAmount: 89100,
    reference: "REF-004-2024",
    errorMessage: "Solde insuffisant",
  },
  {
    id: "PAY005",
    bookingId: "BK001",
    customer: "Jean Dupont",
    amount: 25000,
    method: "MTN MoMo",
    type: "Caution",
    status: "Remboursé",
    transactionId: "MTN-2024-005-456",
    phoneNumber: "+237677123456",
    date: "2024-01-18",
    time: "10:00",
    fees: 250,
    netAmount: 24750,
    reference: "REF-005-2024",
  },
]

export default function PaymentsPage() {
  const [filteredPayments, setFilteredPayments] = useState(payments)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [methodFilter, setMethodFilter] = useState("all")
  const [selectedPayment, setSelectedPayment] = useState<any>(null)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)

  // Filtrage des paiements
  useEffect(() => {
    let filtered = payments

    if (searchTerm) {
      filtered = filtered.filter(
        (payment) =>
          payment.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
          payment.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          payment.transactionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
          payment.phoneNumber.includes(searchTerm),
      )
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((payment) => payment.status === statusFilter)
    }

    if (methodFilter !== "all") {
      filtered = filtered.filter((payment) => payment.method === methodFilter)
    }

    setFilteredPayments(filtered)
  }, [searchTerm, statusFilter, methodFilter])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Réussi":
        return (
          <Badge className="bg-green-100 text-green-800">
            <CheckCircle className="h-3 w-3 mr-1" />
            Réussi
          </Badge>
        )
      case "En attente":
        return (
          <Badge className="bg-yellow-100 text-yellow-800">
            <Clock className="h-3 w-3 mr-1" />
            En attente
          </Badge>
        )
      case "Échoué":
        return (
          <Badge className="bg-red-100 text-red-800">
            <XCircle className="h-3 w-3 mr-1" />
            Échoué
          </Badge>
        )
      case "Remboursé":
        return (
          <Badge className="bg-blue-100 text-blue-800">
            <RefreshCw className="h-3 w-3 mr-1" />
            Remboursé
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getMethodIcon = (method: string) => {
    switch (method) {
      case "MTN MoMo":
        return <div className="w-4 h-4 bg-yellow-400 rounded-full"></div>
      case "Orange Money":
        return <div className="w-4 h-4 bg-orange-500 rounded-full"></div>
      default:
        return <CreditCard className="h-4 w-4" />
    }
  }

  const handleViewPayment = (payment: any) => {
    setSelectedPayment(payment)
    setIsViewDialogOpen(true)
  }

  const handleRefreshPayment = (paymentId: string) => {
    console.log("Refreshing payment status for:", paymentId)
  }

  const handleExportCSV = () => {
    const csvData = filteredPayments.map((payment) => ({
      "ID Paiement": payment.id,
      "ID Réservation": payment.bookingId,
      Client: payment.customer,
      Téléphone: payment.phoneNumber,
      "Montant (FCFA)": payment.amount,
      "Frais (FCFA)": payment.fees,
      "Montant net (FCFA)": payment.netAmount,
      Méthode: payment.method,
      Type: payment.type,
      Statut: payment.status,
      "ID Transaction": payment.transactionId,
      Date: payment.date,
      Heure: payment.time,
      Référence: payment.reference,
      "Message erreur": payment.errorMessage || "",
    }))

    exportToCSV(csvData, `paiements_${new Date().toISOString().split("T")[0]}`)
  }

  const totalAmount = payments.reduce((sum, p) => (p.status === "Réussi" ? sum + p.amount : sum), 0)
  const totalFees = payments.reduce((sum, p) => (p.status === "Réussi" ? sum + p.fees : sum), 0)
  const mtnAmount = payments
    .filter((p) => p.method === "MTN MoMo" && p.status === "Réussi")
    .reduce((sum, p) => sum + p.amount, 0)
  const orangeAmount = payments
    .filter((p) => p.method === "Orange Money" && p.status === "Réussi")
    .reduce((sum, p) => sum + p.amount, 0)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestion des paiements</h1>
          <p className="text-gray-600">Suivez tous les paiements Mobile Money</p>
        </div>
        <Button onClick={handleExportCSV}>
          <Download className="mr-2 h-4 w-4" />
          Exporter CSV
        </Button>
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total encaissé</p>
                <p className="text-2xl font-bold">{totalAmount.toLocaleString()} FCFA</p>
              </div>
              <CreditCard className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">MTN MoMo</p>
                <p className="text-2xl font-bold">{mtnAmount.toLocaleString()} FCFA</p>
              </div>
              <div className="w-8 h-8 bg-yellow-400 rounded-full"></div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Orange Money</p>
                <p className="text-2xl font-bold">{orangeAmount.toLocaleString()} FCFA</p>
              </div>
              <div className="w-8 h-8 bg-orange-500 rounded-full"></div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Frais totaux</p>
                <p className="text-2xl font-bold">{totalFees.toLocaleString()} FCFA</p>
              </div>
              <Smartphone className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtres et recherche */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Rechercher par client, ID ou numéro de téléphone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filtrer par statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="Réussi">Réussi</SelectItem>
                <SelectItem value="En attente">En attente</SelectItem>
                <SelectItem value="Échoué">Échoué</SelectItem>
                <SelectItem value="Remboursé">Remboursé</SelectItem>
              </SelectContent>
            </Select>
            <Select value={methodFilter} onValueChange={setMethodFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filtrer par méthode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les méthodes</SelectItem>
                <SelectItem value="MTN MoMo">MTN MoMo</SelectItem>
                <SelectItem value="Orange Money">Orange Money</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tableau des paiements */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID Paiement</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Montant</TableHead>
                <TableHead>Méthode</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Date/Heure</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPayments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell className="font-medium">{payment.id}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{payment.customer}</div>
                      <div className="text-sm text-gray-500 flex items-center">
                        <Smartphone className="h-3 w-3 mr-1" />
                        {payment.phoneNumber}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{payment.amount.toLocaleString()} FCFA</div>
                      <div className="text-sm text-gray-500">Frais: {payment.fees.toLocaleString()} FCFA</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {getMethodIcon(payment.method)}
                      <span className="text-sm">{payment.method}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{payment.type}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>{payment.date}</div>
                      <div className="text-gray-500">{payment.time}</div>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(payment.status)}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="sm" onClick={() => handleViewPayment(payment)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      {payment.status === "En attente" && (
                        <Button variant="ghost" size="sm" onClick={() => handleRefreshPayment(payment.id)}>
                          <RefreshCw className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Dialog de détails du paiement */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Détails du paiement {selectedPayment?.id}</DialogTitle>
            <DialogDescription>Informations complètes de la transaction</DialogDescription>
          </DialogHeader>
          {selectedPayment && (
            <div className="grid gap-6">
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Informations de base</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>ID Paiement:</span>
                      <span className="font-medium">{selectedPayment.id}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>ID Réservation:</span>
                      <span className="font-medium">{selectedPayment.bookingId}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Référence:</span>
                      <span className="font-medium">{selectedPayment.reference}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Type:</span>
                      <Badge variant="outline">{selectedPayment.type}</Badge>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Client</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Nom:</span>
                      <span className="font-medium">{selectedPayment.customer}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Téléphone:</span>
                      <span className="font-medium">{selectedPayment.phoneNumber}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Méthode:</span>
                      <div className="flex items-center space-x-1">
                        {getMethodIcon(selectedPayment.method)}
                        <span>{selectedPayment.method}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Montants</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Montant brut:</span>
                      <span className="font-medium">{selectedPayment.amount.toLocaleString()} FCFA</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Frais:</span>
                      <span className="text-red-600">-{selectedPayment.fees.toLocaleString()} FCFA</span>
                    </div>
                    <div className="flex justify-between text-sm border-t pt-2">
                      <span className="font-medium">Montant net:</span>
                      <span className="font-bold text-green-600">
                        {selectedPayment.netAmount.toLocaleString()} FCFA
                      </span>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Transaction</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>ID Transaction:</span>
                      <span className="font-medium text-xs">{selectedPayment.transactionId}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Date:</span>
                      <span className="font-medium">{selectedPayment.date}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Heure:</span>
                      <span className="font-medium">{selectedPayment.time}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Statut:</span>
                      {getStatusBadge(selectedPayment.status)}
                    </div>
                  </CardContent>
                </Card>
              </div>
              {selectedPayment.errorMessage && (
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center">
                      <AlertCircle className="h-4 w-4 mr-2 text-red-500" />
                      Erreur
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-red-600">{selectedPayment.errorMessage}</p>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
              Fermer
            </Button>
            {selectedPayment?.status === "En attente" && (
              <Button onClick={() => handleRefreshPayment(selectedPayment.id)}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Actualiser le statut
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
