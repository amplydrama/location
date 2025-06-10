"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MessageCircle, X, Send, AlertCircle } from "lucide-react"
import { v4 as uuidv4 } from "uuid"

interface Message {
  id: string
  sender: "client" | "agent" | "system"
  content: string
  timestamp: Date
}

interface ChatWidgetSimpleProps {
  userId?: string
  userName?: string
}

export function ChatWidgetSimple({ userId = "", userName = "" }: ChatWidgetSimpleProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState<Message[]>([])
  const [isConnected, setIsConnected] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [clientId] = useState(userId || `client_${uuidv4().substring(0, 8)}`)
  const [clientName] = useState(userName || "Visiteur")

  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Vérifier l'état de la base de données au démarrage
  useEffect(() => {
    if (isOpen) {
      checkDatabaseHealth()
    }
  }, [isOpen])

  // Faire défiler vers le bas à chaque nouveau message
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  const checkDatabaseHealth = async () => {
    try {
      const response = await fetch("/api/chat/health")
      const data = await response.json()

      if (data.success && data.database.ready) {
        setIsConnected(true)
        setError(null)
        addSystemMessage(
          "Bienvenue sur le chat de CarLoc Cameroun ! Un agent va vous répondre dans quelques instants...",
        )
      } else {
        setError("Le système de chat n'est pas encore configuré. Veuillez contacter l'administrateur.")
        setIsConnected(false)
      }
    } catch (err) {
      setError("Impossible de se connecter au service de chat.")
      setIsConnected(false)
    }
  }

  const addSystemMessage = (content: string) => {
    const systemMessage: Message = {
      id: `system_${Date.now()}`,
      sender: "system",
      content,
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, systemMessage])
  }

  const addMessage = (sender: "client" | "agent", content: string) => {
    const newMessage: Message = {
      id: `msg_${Date.now()}`,
      sender,
      content,
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, newMessage])
  }

  const handleSendMessage = async () => {
    if (!message.trim() || !isConnected) return

    // Ajouter le message du client
    addMessage("client", message)

    // Simuler une réponse d'agent (en attendant l'implémentation complète)
    setTimeout(
      () => {
        const responses = [
          "Merci pour votre message. Un agent va vous répondre dans quelques instants.",
          "Nous avons bien reçu votre demande. Comment puis-je vous aider ?",
          "Bonjour ! Je suis là pour vous aider avec vos questions sur nos véhicules.",
          "Merci de nous avoir contactés. Pouvez-vous me donner plus de détails sur votre besoin ?",
        ]
        const randomResponse = responses[Math.floor(Math.random() * responses.length)]
        addMessage("agent", randomResponse)
      },
      1000 + Math.random() * 2000,
    )

    setMessage("")
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSendMessage()
    }
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  const getStatusText = () => {
    if (error) return "Service indisponible"
    if (!isConnected) return "Connexion..."
    return "Agent disponible"
  }

  const getStatusColor = () => {
    if (error) return "text-red-500"
    if (!isConnected) return "text-yellow-500"
    return "text-green-500"
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isOpen ? (
        <Card className="w-80 md:w-96 shadow-lg">
          <CardHeader className="bg-blue-600 text-white p-3 flex flex-row items-center justify-between">
            <div className="flex items-center space-x-2">
              <Avatar className="h-8 w-8 bg-blue-800">
                <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Agent" />
                <AvatarFallback>SC</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-medium text-sm">Service Client</h3>
                <p className={`text-xs ${getStatusColor()}`}>{getStatusText()}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-blue-700"
            >
              <X className="h-5 w-5" />
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <div className="h-80 overflow-y-auto p-4 space-y-4">
              {error ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center text-gray-500">
                    <AlertCircle className="h-8 w-8 mx-auto mb-2" />
                    <p className="text-sm">{error}</p>
                    <Button variant="outline" size="sm" className="mt-2" onClick={checkDatabaseHealth}>
                      Réessayer
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  {messages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.sender === "client" ? "justify-end" : "justify-start"}`}>
                      <div
                        className={`max-w-[80%] rounded-lg p-3 ${
                          msg.sender === "client"
                            ? "bg-blue-600 text-white"
                            : msg.sender === "system"
                              ? "bg-gray-100 text-gray-700"
                              : "bg-gray-200 text-gray-800"
                        }`}
                      >
                        <p className="text-sm">{msg.content}</p>
                        <p className="text-xs opacity-70 text-right mt-1">{formatTime(msg.timestamp)}</p>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </>
              )}
            </div>
          </CardContent>
          <CardFooter className="p-3 border-t">
            <div className="flex w-full space-x-2">
              <Input
                placeholder={isConnected ? "Tapez votre message..." : "Service indisponible..."}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={!isConnected}
              />
              <Button size="icon" onClick={handleSendMessage} disabled={!message.trim() || !isConnected}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </CardFooter>
        </Card>
      ) : (
        <Button
          onClick={() => setIsOpen(true)}
          className="rounded-full h-14 w-14 shadow-lg bg-blue-600 hover:bg-blue-700"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      )}
    </div>
  )
}
