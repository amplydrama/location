"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MessageCircle, X, Send, Star } from "lucide-react"
import { io, type Socket } from "socket.io-client"
import { v4 as uuidv4 } from "uuid"

interface Message {
  id: string
  message_id: string
  conversation_id: string
  sender_id: string
  sender_name: string
  sender_type: "client" | "agent" | "system"
  content: string
  message_type: string
  created_at: string
}

interface Conversation {
  id: string
  conversation_id: string
  client_id: string
  agent_id: string | null
  client_name: string
  agent_name: string | null
  status: "waiting" | "active" | "ended"
  started_at: string
  ended_at: string | null
}

interface ChatWidgetPersistentProps {
  userId?: string
  userName?: string
  userEmail?: string
  userPhone?: string
}

export function ChatWidgetPersistent({
  userId = "",
  userName = "",
  userEmail = "",
  userPhone = "",
}: ChatWidgetPersistentProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState<Message[]>([])
  const [conversation, setConversation] = useState<Conversation | null>(null)
  const [agentTyping, setAgentTyping] = useState(false)
  const [clientId] = useState(userId || `client_${uuidv4().substring(0, 8)}`)
  const [clientName] = useState(userName || "Visiteur")
  const [showRating, setShowRating] = useState(false)
  const [rating, setRating] = useState(0)
  const [feedback, setFeedback] = useState("")

  const socketRef = useRef<Socket | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Charger l'historique des conversations
  useEffect(() => {
    if (isOpen && !conversation) {
      loadConversationHistory()
    }
  }, [isOpen])

  // Connexion au serveur Socket.IO
  useEffect(() => {
    if (isOpen && !socketRef.current) {
      connectToSocket()
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect()
        socketRef.current = null
      }
    }
  }, [isOpen])

  // Faire défiler vers le bas à chaque nouveau message
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  const loadConversationHistory = async () => {
    try {
      // Chercher une conversation active ou récente pour ce client
      const response = await fetch(`/api/chat/conversations?status=active&clientId=${clientId}`)
      const data = await response.json()

      if (data.success && data.data.length > 0) {
        const activeConversation = data.data[0]
        setConversation(activeConversation)

        // Charger les messages de cette conversation
        const messagesResponse = await fetch(`/api/chat/messages?conversationId=${activeConversation.conversation_id}`)
        const messagesData = await messagesResponse.json()

        if (messagesData.success) {
          setMessages(messagesData.data)
        }
      }
    } catch (error) {
      console.error("Erreur lors du chargement de l'historique:", error)
    }
  }

  const connectToSocket = () => {
    setIsConnecting(true)

    const socket = io({
      path: "/api/socket",
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    })

    socket.on("connect", async () => {
      console.log("Connecté au serveur Socket.IO")
      setIsConnected(true)
      setIsConnecting(false)

      // Enregistrer le participant dans la base de données
      await registerParticipant(socket.id)

      // S'identifier comme client
      socket.emit("client:connect", { userId: clientId, userName: clientName })

      // Si pas de conversation active, en créer une nouvelle
      if (!conversation) {
        await createNewConversation()
      }
    })

    socket.on("disconnect", () => {
      console.log("Déconnecté du serveur Socket.IO")
      setIsConnected(false)
      updateParticipantStatus(false)
    })

    socket.on("chat:started", async (data) => {
      console.log("Chat démarré:", data)

      // Mettre à jour la conversation dans la base de données
      await updateConversation(data.chatId, {
        status: "active",
        agentId: data.agentId,
      })

      // Recharger la conversation
      await loadConversationHistory()
    })

    socket.on("message:received", async (message) => {
      console.log("Message reçu:", message)

      // Sauvegarder le message dans la base de données
      await saveMessage(message)

      // Ajouter le message à la liste locale
      setMessages((prev) => [...prev, message])
      setAgentTyping(false)
    })

    socket.on("agent:typing", () => {
      setAgentTyping(true)
    })

    socket.on("agent:stopped-typing", () => {
      setAgentTyping(false)
    })

    socket.on("chat:ended", async (data) => {
      console.log("Chat terminé:", data)

      // Mettre à jour la conversation dans la base de données
      await updateConversation(data.chatId, {
        status: "ended",
      })

      setShowRating(true)
    })

    socketRef.current = socket
  }

  const registerParticipant = async (socketId: string) => {
    try {
      await fetch("/api/chat/participants", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: clientId,
          userName: clientName,
          userType: "client",
          email: userEmail,
          phone: userPhone,
          socketId,
        }),
      })
    } catch (error) {
      console.error("Erreur lors de l'enregistrement du participant:", error)
    }
  }

  const updateParticipantStatus = async (isOnline: boolean) => {
    try {
      await fetch("/api/chat/participants", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: clientId,
          isOnline,
        }),
      })
    } catch (error) {
      console.error("Erreur lors de la mise à jour du statut:", error)
    }
  }

  const createNewConversation = async () => {
    try {
      const conversationId = `chat_${Date.now()}_${clientId}`

      const response = await fetch("/api/chat/conversations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversationId,
          clientId,
          clientName,
          category: "general",
        }),
      })

      const data = await response.json()

      if (data.success) {
        setConversation(data.data)

        // Ajouter un message de bienvenue
        const welcomeMessage = {
          id: `welcome_${Date.now()}`,
          message_id: `welcome_${Date.now()}`,
          conversation_id: conversationId,
          sender_id: "system",
          sender_name: "Système",
          sender_type: "system" as const,
          content: "Bienvenue sur le chat de CarLoc Cameroun. Un agent va vous répondre dans quelques instants...",
          message_type: "text",
          created_at: new Date().toISOString(),
        }

        setMessages([welcomeMessage])
      }
    } catch (error) {
      console.error("Erreur lors de la création de la conversation:", error)
    }
  }

  const updateConversation = async (conversationId: string, updates: any) => {
    try {
      await fetch(`/api/chat/conversations/${conversationId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      })
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la conversation:", error)
    }
  }

  const saveMessage = async (message: any) => {
    try {
      await fetch("/api/chat/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(message),
      })
    } catch (error) {
      console.error("Erreur lors de la sauvegarde du message:", error)
    }
  }

  const handleSendMessage = async () => {
    if (!message.trim() || !socketRef.current || !conversation) return

    const newMessage = {
      id: `msg_${Date.now()}`,
      message_id: `msg_${Date.now()}`,
      conversation_id: conversation.conversation_id,
      sender_id: clientId,
      sender_name: clientName,
      sender_type: "client" as const,
      content: message,
      message_type: "text",
      created_at: new Date().toISOString(),
    }

    // Ajouter le message à la liste locale
    setMessages((prev) => [...prev, newMessage])

    // Sauvegarder dans la base de données
    await saveMessage(newMessage)

    // Envoyer via Socket.IO
    socketRef.current.emit("message:send", newMessage)

    // Réinitialiser le champ de message
    setMessage("")
  }

  const handleSubmitRating = async () => {
    if (!conversation || rating === 0) return

    try {
      await updateConversation(conversation.conversation_id, {
        rating,
        feedback,
      })

      setShowRating(false)
      setRating(0)
      setFeedback("")

      // Ajouter un message de remerciement
      const thankYouMessage = {
        id: `thanks_${Date.now()}`,
        message_id: `thanks_${Date.now()}`,
        conversation_id: conversation.conversation_id,
        sender_id: "system",
        sender_name: "Système",
        sender_type: "system" as const,
        content: "Merci pour votre évaluation ! N'hésitez pas à nous recontacter si vous avez d'autres questions.",
        message_type: "text",
        created_at: new Date().toISOString(),
      }

      setMessages((prev) => [...prev, thankYouMessage])
      await saveMessage(thankYouMessage)
    } catch (error) {
      console.error("Erreur lors de l'envoi de l'évaluation:", error)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSendMessage()
    }
  }

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  const getStatusText = () => {
    if (!isConnected) return "Déconnecté"
    if (!conversation) return "Initialisation..."
    if (conversation.status === "waiting") return "En attente d'un agent"
    if (conversation.status === "active") return "Agent connecté"
    if (conversation.status === "ended") return "Conversation terminée"
    return "En ligne"
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
                <p className="text-xs opacity-90">{getStatusText()}</p>
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
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.sender_type === "client" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      msg.sender_type === "client"
                        ? "bg-blue-600 text-white"
                        : msg.sender_type === "system"
                          ? "bg-gray-100 text-gray-700"
                          : "bg-gray-200 text-gray-800"
                    }`}
                  >
                    <p className="text-sm">{msg.content}</p>
                    <p className="text-xs opacity-70 text-right mt-1">{formatTime(msg.created_at)}</p>
                  </div>
                </div>
              ))}
              {agentTyping && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 rounded-lg p-3 max-w-[80%]">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.4s" }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </CardContent>
          <CardFooter className="p-3 border-t">
            {showRating ? (
              <div className="w-full space-y-3">
                <div className="text-center">
                  <p className="text-sm font-medium mb-2">Évaluez notre service</p>
                  <div className="flex justify-center space-x-1 mb-3">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => setRating(star)}
                        className={`p-1 ${star <= rating ? "text-yellow-400" : "text-gray-300"}`}
                      >
                        <Star className="h-5 w-5 fill-current" />
                      </button>
                    ))}
                  </div>
                  <Input
                    placeholder="Commentaire (optionnel)"
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    className="mb-2"
                  />
                  <Button onClick={handleSubmitRating} disabled={rating === 0} size="sm" className="w-full">
                    Envoyer l'évaluation
                  </Button>
                </div>
              </div>
            ) : conversation?.status === "ended" ? (
              <div className="w-full text-center">
                <p className="text-sm text-gray-600 mb-2">Cette conversation est terminée</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setConversation(null)
                    setMessages([])
                    createNewConversation()
                  }}
                >
                  Nouvelle conversation
                </Button>
              </div>
            ) : (
              <div className="flex w-full space-x-2">
                <Input
                  placeholder={
                    isConnecting
                      ? "Connexion..."
                      : conversation?.status === "active"
                        ? "Tapez votre message..."
                        : "En attente d'un agent..."
                  }
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={!isConnected || conversation?.status !== "active"}
                />
                <Button
                  size="icon"
                  onClick={handleSendMessage}
                  disabled={!message.trim() || !isConnected || conversation?.status !== "active"}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            )}
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
