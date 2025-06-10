"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MessageCircle, X, Send } from "lucide-react"
import { io, type Socket } from "socket.io-client"
import { v4 as uuidv4 } from "uuid"

interface Message {
  id: string
  chatId: string
  senderId: string
  content: string
  senderType: "client" | "agent"
  timestamp: Date
}

interface ChatWidgetProps {
  userId?: string
  userName?: string
}

export function ChatWidget({ userId = "", userName = "" }: ChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState<Message[]>([])
  const [chatId, setChatId] = useState<string | null>(null)
  const [agentName, setAgentName] = useState<string | null>(null)
  const [agentTyping, setAgentTyping] = useState(false)
  const [clientId] = useState(userId || `client_${uuidv4().substring(0, 8)}`)
  const [clientName] = useState(userName || "Visiteur")
  const [chatStatus, setChatStatus] = useState<"idle" | "connecting" | "connected" | "ended">("idle")

  const socketRef = useRef<Socket | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Connexion au serveur Socket.IO
  useEffect(() => {
    if (isOpen && !socketRef.current) {
      setIsConnecting(true)
      setChatStatus("connecting")

      // Initialiser la connexion Socket.IO
      const socket = io({
        path: "/api/socket",
        autoConnect: true,
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      })

      socket.on("connect", () => {
        console.log("Connecté au serveur Socket.IO")
        setIsConnected(true)
        setIsConnecting(false)

        // S'identifier comme client
        socket.emit("client:connect", { userId: clientId, userName: clientName })

        // Ajouter un message de bienvenue
        setMessages([
          {
            id: `welcome_${Date.now()}`,
            chatId: "system",
            senderId: "system",
            content: "Bienvenue sur le chat de CarLoc Cameroun. Un agent va vous répondre dans quelques instants...",
            senderType: "agent",
            timestamp: new Date(),
          },
        ])
      })

      socket.on("disconnect", () => {
        console.log("Déconnecté du serveur Socket.IO")
        setIsConnected(false)
      })

      socket.on("chat:started", (data) => {
        console.log("Chat démarré:", data)
        setChatId(data.chatId)
        setChatStatus("connected")

        // Ajouter un message de connexion
        setMessages((prev) => [
          ...prev,
          {
            id: `connected_${Date.now()}`,
            chatId: data.chatId,
            senderId: "system",
            content: "Un agent est maintenant connecté et prêt à vous aider.",
            senderType: "agent",
            timestamp: new Date(data.timestamp),
          },
        ])
      })

      socket.on("message:received", (message) => {
        console.log("Message reçu:", message)
        setMessages((prev) => [...prev, message])
        setAgentTyping(false)
      })

      socket.on("agent:typing", () => {
        setAgentTyping(true)
      })

      socket.on("agent:stopped-typing", () => {
        setAgentTyping(false)
      })

      socket.on("chat:ended", (data) => {
        console.log("Chat terminé:", data)
        setChatStatus("ended")

        // Ajouter un message de fin
        setMessages((prev) => [
          ...prev,
          {
            id: `ended_${Date.now()}`,
            chatId: data.chatId,
            senderId: "system",
            content: "La conversation est terminée. Merci d'avoir contacté CarLoc Cameroun.",
            senderType: "agent",
            timestamp: new Date(data.timestamp),
          },
        ])
      })

      socketRef.current = socket

      // Nettoyage à la déconnexion
      return () => {
        if (socketRef.current) {
          socketRef.current.disconnect()
          socketRef.current = null
        }
      }
    }
  }, [isOpen, clientId, clientName])

  // Faire défiler vers le bas à chaque nouveau message
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  const handleSendMessage = () => {
    if (!message.trim() || !socketRef.current || !chatId) return

    const newMessage = {
      id: `msg_${Date.now()}`,
      chatId,
      senderId: clientId,
      content: message,
      senderType: "client" as const,
      timestamp: new Date(),
    }

    // Ajouter le message à la liste locale
    setMessages((prev) => [...prev, newMessage])

    // Envoyer le message au serveur
    socketRef.current.emit("message:send", newMessage)

    // Réinitialiser le champ de message
    setMessage("")
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSendMessage()
    }
  }

  const toggleChat = () => {
    setIsOpen(!isOpen)
  }

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
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
                <p className="text-xs opacity-90">CarLoc Cameroun</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={toggleChat} className="text-white hover:bg-blue-700">
              <X className="h-5 w-5" />
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <div className="h-80 overflow-y-auto p-4 space-y-4">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.senderType === "client" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      msg.senderType === "client"
                        ? "bg-blue-600 text-white"
                        : msg.senderId === "system"
                          ? "bg-gray-100 text-gray-700"
                          : "bg-gray-200 text-gray-800"
                    }`}
                  >
                    <p className="text-sm">{msg.content}</p>
                    <p className="text-xs opacity-70 text-right mt-1">{formatTime(msg.timestamp)}</p>
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
            {chatStatus === "ended" ? (
              <div className="w-full text-center">
                <p className="text-sm text-gray-600 mb-2">Cette conversation est terminée</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setChatStatus("idle")
                    setMessages([])
                    setChatId(null)
                    if (socketRef.current) {
                      socketRef.current.disconnect()
                      socketRef.current = null
                    }
                    setIsOpen(false)
                    setTimeout(() => setIsOpen(true), 500)
                  }}
                >
                  Démarrer une nouvelle conversation
                </Button>
              </div>
            ) : (
              <div className="flex w-full space-x-2">
                <Input
                  placeholder={
                    chatStatus === "connecting"
                      ? "Connexion en cours..."
                      : chatStatus === "connected"
                        ? "Tapez votre message..."
                        : "En attente d'un agent..."
                  }
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={chatStatus !== "connected"}
                />
                <Button
                  size="icon"
                  onClick={handleSendMessage}
                  disabled={!message.trim() || chatStatus !== "connected"}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            )}
          </CardFooter>
        </Card>
      ) : (
        <Button onClick={toggleChat} className="rounded-full h-14 w-14 shadow-lg bg-blue-600 hover:bg-blue-700">
          <MessageCircle className="h-6 w-6" />
        </Button>
      )}
    </div>
  )
}
