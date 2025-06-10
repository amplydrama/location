"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { MessageCircle, Clock, Star, TrendingUp, Users, AlertCircle, RefreshCw } from "lucide-react"
import { exportToCSV } from "@/lib/csv-export"
import { Download } from "lucide-react"

interface Analytics {
  period: string
  stats: {
    total_conversations: number
    completed_conversations: number
    active_conversations: number
    average_rating: number | null
    avg_duration_minutes: number | null
    avg_response_time: number
    avg_resolution_time: number
  }
  dailyStats: Array<{
    date: string
    conversations: number
    completed: number
  }>
  categoryStats: Array<{
    category: string
    count: number
    avg_rating: number | null
  }>
  agentStats: Array<{
    agent_id: string
    agent_name: string
    total_conversations: number
    completed_conversations: number
    average_rating: number | null
    avg_duration_minutes: number | null
    satisfaction_rate: number
  }>
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]

export default function ChatAnalyticsPage() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null)
  const [period, setPeriod] = useState("7d")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadAnalytics()
  }, [period])

  const loadAnalytics = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch(`/api/chat/analytics?period=${period}`)
      const data = await response.json()

      if (data.success) {
        setAnalytics(data.data)
      } else {
        if (data.needsSetup) {
          setError("Tables de chat non configurées. Veuillez exécuter le script de configuration.")
        } else {
          setError(data.error || "Erreur lors du chargement des données")
        }
      }
    } catch (error) {
      console.error("Erreur lors du chargement des analytics:", error)
      setError("Impossible de charger les analytics. Vérifiez la configuration de la base de données.")
    } finally {
      setLoading(false)
    }
  }

  const formatDuration = (minutes: number | null) => {
    if (!minutes) return "N/A"
    if (minutes < 60) {
      return `${Math.round(minutes)}min`
    }
    const hours = Math.floor(minutes / 60)
    const remainingMinutes = Math.round(minutes % 60)
    return `${hours}h ${remainingMinutes}min`
  }

  const formatSeconds = (seconds: number) => {
    if (seconds < 60) {
      return `${Math.round(seconds)}s`
    }
    return `${Math.round(seconds / 60)}min`
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Chargement des analytics...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Analytics du Chat</h1>
            <p className="text-gray-600">Analysez les performances de votre service client</p>
          </div>
        </div>

        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <span>{error}</span>
            <div className="flex gap-2">
              <Button onClick={loadAnalytics} variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Réessayer
              </Button>
            </div>
          </AlertDescription>
        </Alert>

        <Card>
          <CardHeader>
            <CardTitle>Configuration requise</CardTitle>
            <CardDescription>Les tables de chat ne sont pas encore configurées</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 className="font-medium text-yellow-800 mb-2">Étapes de configuration :</h4>
                <ol className="list-decimal list-inside space-y-1 text-sm text-yellow-700">
                  <li>
                    Exécutez le script{" "}
                    <code className="bg-yellow-100 px-1 rounded">setup_complete_chat_system.sql</code>
                  </li>
                  <li>
                    Vérifiez l'état avec l'endpoint <code className="bg-yellow-100 px-1 rounded">/api/chat/health</code>
                  </li>
                  <li>Rechargez cette page</li>
                </ol>
              </div>

              <div className="flex gap-2">
                <Button onClick={loadAnalytics} variant="outline">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Vérifier à nouveau
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!analytics) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Aucune donnée disponible</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics du Chat</h1>
          <p className="text-gray-600">Analysez les performances de votre service client</p>
        </div>
        <Select value={period} onValueChange={setPeriod}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1d">Dernières 24h</SelectItem>
            <SelectItem value="7d">7 derniers jours</SelectItem>
            <SelectItem value="30d">30 derniers jours</SelectItem>
            <SelectItem value="90d">90 derniers jours</SelectItem>
          </SelectContent>
        </Select>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => analytics && exportToCSV(analytics.dailyStats, "chat_statistiques_journalieres")}
            disabled={!analytics || analytics.dailyStats.length === 0}
          >
            <Download className="h-4 w-4 mr-2" />
            Exporter Statistiques
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => analytics && exportToCSV(analytics.agentStats, "chat_performance_agents")}
            disabled={!analytics || analytics.agentStats.length === 0}
          >
            <Download className="h-4 w-4 mr-2" />
            Exporter Perf. Agents
          </Button>
        </div>
      </div>

      {/* Statistiques principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Conversations</CardTitle>
            <MessageCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.stats.total_conversations}</div>
            <p className="text-xs text-muted-foreground">{analytics.stats.completed_conversations} terminées</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Note Moyenne</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analytics.stats.average_rating ? analytics.stats.average_rating.toFixed(1) : "N/A"}
            </div>
            <div className="flex items-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-3 w-3 ${
                    star <= (analytics.stats.average_rating || 0) ? "text-yellow-400 fill-current" : "text-gray-300"
                  }`}
                />
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Temps de Réponse</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatSeconds(analytics.stats.avg_response_time)}</div>
            <p className="text-xs text-muted-foreground">Temps moyen</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Durée Moyenne</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatDuration(analytics.stats.avg_duration_minutes)}</div>
            <p className="text-xs text-muted-foreground">Par conversation</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="agents">Performance des agents</TabsTrigger>
          <TabsTrigger value="categories">Catégories</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Graphique des conversations par jour */}
            <Card>
              <CardHeader>
                <CardTitle>Conversations par jour</CardTitle>
                <CardDescription>Évolution du nombre de conversations</CardDescription>
              </CardHeader>
              <CardContent>
                {analytics.dailyStats.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={analytics.dailyStats}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="date"
                        tickFormatter={(value) =>
                          new Date(value).toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit" })
                        }
                      />
                      <YAxis />
                      <Tooltip
                        labelFormatter={(value) => new Date(value).toLocaleDateString("fr-FR")}
                        formatter={(value, name) => [value, name === "conversations" ? "Total" : "Terminées"]}
                      />
                      <Line type="monotone" dataKey="conversations" stroke="#8884d8" strokeWidth={2} />
                      <Line type="monotone" dataKey="completed" stroke="#82ca9d" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-[300px] flex items-center justify-center text-gray-500">
                    Aucune donnée disponible pour cette période
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Graphique des catégories */}
            <Card>
              <CardHeader>
                <CardTitle>Répartition par catégorie</CardTitle>
                <CardDescription>Types de demandes les plus fréquents</CardDescription>
              </CardHeader>
              <CardContent>
                {analytics.categoryStats.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={analytics.categoryStats}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ category, percent }) => `${category} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="count"
                      >
                        {analytics.categoryStats.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-[300px] flex items-center justify-center text-gray-500">
                    Aucune donnée de catégorie disponible
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="agents" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Performance des agents</CardTitle>
              <CardDescription>Statistiques détaillées par agent</CardDescription>
              <div className="flex justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => analytics && exportToCSV(analytics.agentStats, "chat_performance_agents_detaillee")}
                  disabled={!analytics || analytics.agentStats.length === 0}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Exporter CSV
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.agentStats.length > 0 ? (
                  analytics.agentStats.map((agent) => (
                    <div key={agent.agent_id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <Users className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold">{agent.agent_name}</h3>
                            <p className="text-sm text-gray-500">ID: {agent.agent_id}</p>
                          </div>
                        </div>
                        <Badge variant="outline">{Math.round(agent.satisfaction_rate)}% satisfaction</Badge>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-gray-500">Conversations</p>
                          <p className="font-semibold">{agent.total_conversations}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Terminées</p>
                          <p className="font-semibold">{agent.completed_conversations}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Note moyenne</p>
                          <div className="flex items-center">
                            <p className="font-semibold mr-1">
                              {agent.average_rating ? agent.average_rating.toFixed(1) : "N/A"}
                            </p>
                            <Star className="h-3 w-3 text-yellow-400 fill-current" />
                          </div>
                        </div>
                        <div>
                          <p className="text-gray-500">Durée moyenne</p>
                          <p className="font-semibold">{formatDuration(agent.avg_duration_minutes)}</p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">Aucun agent trouvé pour cette période</div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Analyse par catégorie</CardTitle>
              <CardDescription>Performance et satisfaction par type de demande</CardDescription>
              <div className="flex justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => analytics && exportToCSV(analytics.categoryStats, "chat_categories_performance")}
                  disabled={!analytics || analytics.categoryStats.length === 0}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Exporter CSV
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {analytics.categoryStats.length > 0 ? (
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={analytics.categoryStats}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Bar yAxisId="left" dataKey="count" fill="#8884d8" name="Nombre de conversations" />
                    <Bar yAxisId="right" dataKey="avg_rating" fill="#82ca9d" name="Note moyenne" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[400px] flex items-center justify-center text-gray-500">
                  Aucune donnée de catégorie disponible
                </div>
              )}
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {analytics.categoryStats.map((category) => (
              <Card key={category.category}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg capitalize">{category.category}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Conversations</span>
                      <span className="font-semibold">{category.count}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Note moyenne</span>
                      <div className="flex items-center">
                        <span className="font-semibold mr-1">
                          {category.avg_rating ? category.avg_rating.toFixed(1) : "N/A"}
                        </span>
                        <Star className="h-3 w-3 text-yellow-400 fill-current" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
