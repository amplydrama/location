"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MessageCircle, X, Send, Bot, Phone, Clock, Minimize2, Maximize2 } from "lucide-react"

interface Message {
  id: string
  content: string
  sender: "user" | "ai" | "agent"
  timestamp: Date
  type?: "text" | "quick_reply" | "info"
}

interface QuickReply {
  id: string
  text: string
  action: string
}

const quickReplies: QuickReply[] = [
  { id: "1", text: "Voir les véhicules disponibles", action: "show_vehicles" },
  { id: "2", text: "Faire une réservation", action: "make_booking" },
  { id: "3", text: "Contacter le support", action: "contact_support" },
  { id: "4", text: "Tarifs et conditions", action: "pricing_info" },
]

const aiResponses = {
  greeting: "Bonjour ! Je suis l'assistant virtuel de CarLoc Cameroun. Comment puis-je vous aider aujourd'hui ?",
  vehicles:
    "Nous avons plusieurs véhicules disponibles : berlines, SUV, véhicules économiques. Quelle catégorie vous intéresse ?",
  booking:
    "Pour faire une réservation, j'ai besoin de quelques informations : dates souhaitées, lieu de prise en charge, et type de véhicule préféré.",
  pricing:
    "Nos tarifs commencent à partir de 25 000 FCFA/jour pour les véhicules économiques. Paiement possible via MTN MoMo et Orange Money.",
  contact: "Vous pouvez nous contacter au +237 677 123 456 ou par WhatsApp. Nos bureaux sont ouverts de 8h à 18h.",
  default:
    "Je comprends votre question. Laissez-moi vous mettre en contact avec un de nos agents pour une assistance personnalisée.",
}

export function AIChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [conversationId, setConversationId] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Message de bienvenue
      const welcomeMessage: Message = {
        id: "welcome",
        content: aiResponses.greeting,
        sender: "ai",
        timestamp: new Date(),
        type: "text",
      }
      setMessages([welcomeMessage])
    }
  }, [isOpen])

  const generateAIResponse = async (userMessage: string): Promise<string> => {
    // Simulation d'une réponse IA basée sur des mots-clés
    const message = userMessage.toLowerCase()

    if (message.includes("véhicule") || message.includes("voiture") || message.includes("auto")) {
      return aiResponses.vehicles
    }
    if (message.includes("réservation") || message.includes("réserver") || message.includes("louer")) {
      return aiResponses.booking
    }
    if (message.includes("prix") || message.includes("tarif") || message.includes("coût")) {
      return aiResponses.pricing
    }
    if (message.includes("contact") || message.includes("téléphone") || message.includes("appeler")) {
      return aiResponses.contact
    }
    if (message.includes("bonjour") || message.includes("salut") || message.includes("hello")) {
      return aiResponses.greeting
    }

    // Pour des questions plus complexes, on peut intégrer une vraie IA
    try {
      const response = await fetch("/api/chat/ai-response", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage, conversationId }),
      })

      if (response.ok) {
        const data = await response.json()
        return data.response
      }
    } catch (error) {
      console.error("Erreur IA:", error)
    }

    return aiResponses.default
  }

  const saveConversationToDatabase = async () => {
    if (messages.length <= 1) return // Ne pas sauvegarder si seulement le message de bienvenue

    try {
      const response = await fetch("/api/chat/conversations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          client_id: "ai_client_" + Date.now(),
          client_name: "Visiteur Web",
          agent_id: "ai_agent",
          agent_name: "Assistant IA",
          status: "completed",
          category: "assistance_automatique",
          messages: messages.map((msg) => ({
            content: msg.content,
            sender_type: msg.sender,
            timestamp: msg.timestamp,
          })),
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setConversationId(data.conversation_id)
        console.log("Conversation sauvegardée:", data.conversation_id)
      }
    } catch (error) {
      console.error("Erreur lors de la sauvegarde de la conversation:", error)
    }
  }

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: "user",
      timestamp: new Date(),
      type: "text",
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsTyping(true)

    // Simulation du délai de réponse
    setTimeout(
      async () => {
        const aiResponse = await generateAIResponse(inputValue)
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: aiResponse,
          sender: "ai",
          timestamp: new Date(),
          type: "text",
        }

        setMessages((prev) => [...prev, aiMessage])
        setIsTyping(false)

        // Sauvegarder la conversation après quelques échanges
        if (messages.length >= 3) {
          saveConversationToDatabase()
        }
      },
      1000 + Math.random() * 2000,
    )
  }

  const handleQuickReply = async (reply: QuickReply) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      content: reply.text,
      sender: "user",
      timestamp: new Date(),
      type: "quick_reply",
    }

    setMessages((prev) => [...prev, userMessage])
    setIsTyping(true)

    setTimeout(async () => {
      let response = ""
      switch (reply.action) {
        case "show_vehicles":
          response = aiResponses.vehicles
          break
        case "make_booking":
          response = aiResponses.booking
          break
        case "contact_support":
          response = aiResponses.contact
          break
        case "pricing_info":
          response = aiResponses.pricing
          break
        default:
          response = aiResponses.default
      }

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response,
        sender: "ai",
        timestamp: new Date(),
        type: "text",
      }

      setMessages((prev) => [...prev, aiMessage])
      setIsTyping(false)
    }, 1500)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  if (!isOpen) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          className="rounded-full w-14 h-14 bg-blue-600 hover:bg-blue-700 shadow-lg"
          size="icon"
        >
          <MessageCircle className="h-6 w-6 text-white" />
        </Button>
      </div>
    )
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Card className={`w-80 shadow-xl transition-all duration-300 ${isMinimized ? "h-16" : "h-96"}`}>
        <CardHeader className="flex flex-row items-center justify-between p-4 bg-blue-600 text-white rounded-t-lg">
          <div className="flex items-center space-x-2">
            <Avatar className="w-8 h-8">
              <AvatarImage src="/placeholder.svg?height=32&width=32" />
              <AvatarFallback>
                <Bot className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-sm">Assistant CarLoc</CardTitle>
              <p className="text-xs opacity-90">En ligne</p>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-white hover:bg-blue-700"
              onClick={() => setIsMinimized(!isMinimized)}
            >
              {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-white hover:bg-blue-700"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        {!isMinimized && (
          <CardContent className="p-0 flex flex-col h-80">
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg p-3 ${
                        message.sender === "user" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-900 border"
                      }`}
                    >
                      <div className="flex items-start space-x-2">
                        {message.sender !== "user" && (
                          <Avatar className="w-6 h-6">
                            <AvatarFallback>
                              <Bot className="h-3 w-3" />
                            </AvatarFallback>
                          </Avatar>
                        )}
                        <div className="flex-1">
                          <p className="text-sm">{message.content}</p>
                          <p
                            className={`text-xs mt-1 ${message.sender === "user" ? "text-blue-100" : "text-gray-500"}`}
                          >
                            {message.timestamp.toLocaleTimeString("fr-FR", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 rounded-lg p-3 border">
                      <div className="flex items-center space-x-2">
                        <Avatar className="w-6 h-6">
                          <AvatarFallback>
                            <Bot className="h-3 w-3" />
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div
                            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                            style={{ animationDelay: "0.1s" }}
                          ></div>
                          <div
                            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                            style={{ animationDelay: "0.2s" }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {messages.length === 1 && (
                  <div className="space-y-2">
                    <p className="text-xs text-gray-500 text-center">Réponses rapides :</p>
                    <div className="grid grid-cols-1 gap-2">
                      {quickReplies.map((reply) => (
                        <Button
                          key={reply.id}
                          variant="outline"
                          size="sm"
                          className="text-left justify-start h-auto p-2"
                          onClick={() => handleQuickReply(reply)}
                        >
                          {reply.text}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
                {messages.length > 2 && (
                  <div className="mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full text-center"
                      onClick={() => {
                        const systemMessage: Message = {
                          id: Date.now().toString(),
                          content:
                            "Votre demande a été transférée à un agent humain. Un conseiller vous contactera bientôt.",
                          sender: "ai",
                          timestamp: new Date(),
                          type: "info",
                        }
                        setMessages((prev) => [...prev, systemMessage])
                        saveConversationToDatabase()
                      }}
                    >
                      Parler à un agent humain
                    </Button>
                  </div>
                )}
              </div>
              <div ref={messagesEndRef} />
            </ScrollArea>

            <div className="p-4 border-t">
              <div className="flex space-x-2">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Tapez votre message..."
                  className="flex-1"
                  disabled={isTyping}
                />
                <Button onClick={handleSendMessage} disabled={!inputValue.trim() || isTyping} size="icon">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center space-x-4 text-xs text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Phone className="h-3 w-3" />
                    <span>+237 677 123 456</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="h-3 w-3" />
                    <span>8h-18h</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  )
}
