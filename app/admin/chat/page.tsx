"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MessageCircle, Send, Clock, MoreVertical, Search, Archive, Users } from "lucide-react"
import { io, type Socket } from "socket.io-client"
import { v4 as uuidv4 } from "uuid"
import { exportToCSV } from "@/lib/csv-export"
import { Download } from "lucide-react"

interface Client {
  socketId: string
  userId: string
  userName: string
  timestamp: Date
}

interface Message {
  id: string
  chatId: string
  senderId: string
  content: string
  senderType: "client" | "agent"
  timestamp: Date
}

interface Chat {
  id: string
  clientId: string
  agentId: string
  messages: Message[]
  startedAt: Date
  endedAt?: Date
  status: "active" | "ended"
}

export default function AdminChatPage() {
  const [clients, setClients] = useState<Client[]>([])
  const [activeChats, setActiveChats] = useState<Chat[]>([])
  const [archivedChats, setArchivedChats] = useState<Chat[]>([])
  const [selectedClient, setSelectedClient] = useState<Client | null>(null)
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null)
  const [message, setMessage] = useState("")
  const [isConnected, setIsConnected] = useState(false)
  const [agentId] = useState(`agent_${uuidv4().substring(0, 8)}`)
  const [agentName] = useState("Agent Support")
  const [isTyping, setIsTyping] = useState(false)
  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(null)

  const socketRef = useRef<Socket | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Connexion au serveur Socket.IO
  useEffect(() => {
    if (!socketRef.current) {
      // Initialiser la connexion Socket.IO
      const socket = io({
        path: "/api/socket",
        autoConnect: true,
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      })

      socket.on("connect", () => {
        console.log("Agent connecté au serveur Socket.IO")
        setIsConnected(true)

        // S'identifier comme agent
        socket.emit("agent:connect", { agentId, agentName })
      })

      socket.on("disconnect", () => {
        console.log("Agent déconnecté du serveur Socket.IO")
        setIsConnected(false)
      })

      socket.on("clients:list", (clientsList) => {
        console.log("Liste des clients:", clientsList)
        setClients(clientsList)
      })

      socket.on("client:online", (client) => {
        console.log("Nouveau client connecté:", client)
        setClients((prev) => [...prev, client])
      })

      socket.on("client:offline", ({ socketId }) => {
        console.log("Client déconnecté:", socketId)
        setClients((prev) => prev.filter((client) => client.socketId !== socketId))
      })

      socket.on("chat:started", (data) => {
        console.log("Chat démarré:", data)
        const newChat: Chat = {
          id: data.chatId,
          clientId: data.clientId,
          agentId: data.agentId,
          messages: [],
          startedAt: new Date(data.timestamp),
          status: "active",
        }
        setActiveChats((prev) => [...prev, newChat])
        setSelectedChat(newChat)
      })

      socket.on("message:received", (message) => {
        console.log("Message reçu:", message)
        setActiveChats((prev) =>
          prev.map((chat) => {
            if (chat.id === message.chatId) {
              return {
                ...chat,
                messages: [...chat.messages, message],
              }
            }
            return chat
          }),
        )

        // Mettre à jour le chat sélectionné si c'est celui qui reçoit le message
        if (selectedChat?.id === message.chatId) {
          setSelectedChat((prev) => {
            if (prev) {
              return {
                ...prev,
                messages: [...prev.messages, message],
              }
            }
            return prev
          })
        }
      })

      socket.on("chat:ended", (data) => {
        console.log("Chat terminé:", data)

        // Mettre à jour le statut du chat
        setActiveChats((prev) =>
          prev.map((chat) => {
            if (chat.id === data.chatId) {
              const updatedChat = {
                ...chat,
                status: "ended" as const,
                endedAt: new Date(data.timestamp),
              }

              // Déplacer le chat vers les archives
              setArchivedChats((prevArchived) => [...prevArchived, updatedChat])
              return updatedChat
            }
            return chat
          }),
        )

        // Filtrer les chats actifs
        setActiveChats((prev) => prev.filter((chat) => chat.id !== data.chatId))

        // Réinitialiser le chat sélectionné s'il est terminé
        if (selectedChat?.id === data.chatId) {
          setSelectedChat(null)
        }
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
  }, [agentId, agentName])

  // Faire défiler vers le bas à chaque nouveau message
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [selectedChat?.messages])

  const handleStartChat = (client: Client) => {
    if (!socketRef.current) return

    // Vérifier si un chat existe déjà avec ce client
    const existingChat = activeChats.find((chat) => chat.clientId === client.socketId)
    if (existingChat) {
      setSelectedChat(existingChat)
      return
    }

    // Démarrer un nouveau chat
    socketRef.current.emit("chat:start", { clientId: client.socketId, agentId })
    setSelectedClient(client)
  }

  const handleSendMessage = () => {
    if (!message.trim() || !socketRef.current || !selectedChat) return

    const newMessage = {
      id: `msg_${Date.now()}`,
      chatId: selectedChat.id,
      senderId: agentId,
      content: message,
      senderType: "agent" as const,
      timestamp: new Date(),
    }

    // Envoyer le message au serveur
    socketRef.current.emit("message:send", newMessage)

    // Mettre à jour le chat localement
    setActiveChats((prev) =>
      prev.map((chat) => {
        if (chat.id === selectedChat.id) {
          return {
            ...chat,
            messages: [...chat.messages, newMessage],
          }
        }
        return chat
      }),
    )

    // Mettre à jour le chat sélectionné
    setSelectedChat((prev) => {
      if (prev) {
        return {
          ...prev,
          messages: [...prev.messages, newMessage],
        }
      }
      return prev
    })

    // Réinitialiser le champ de message
    setMessage("")
  }

  const handleEndChat = () => {
    if (!socketRef.current || !selectedChat) return

    socketRef.current.emit("chat:end", { chatId: selectedChat.id })
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSendMessage()
    }
  }

  const handleTyping = () => {
    if (!socketRef.current || !selectedChat || isTyping) return

    setIsTyping(true)
    socketRef.current.emit("agent:typing", { chatId: selectedChat.id })

    // Réinitialiser le timeout précédent
    if (typingTimeout) {
      clearTimeout(typingTimeout)
    }

    // Définir un nouveau timeout
    const timeout = setTimeout(() => {
      setIsTyping(false)
      if (socketRef.current) {
        socketRef.current.emit("agent:stopped-typing", { chatId: selectedChat.id })
      }
    }, 2000)

    setTypingTimeout(timeout)
  }

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString()
  }

  const prepareChatsForExport = (chats: Chat[]) => {
    return chats.map((chat) => {
      // Trouver le client correspondant
      const client = clients.find((c) => c.socketId === chat.clientId)

      // Calculer des statistiques sur les messages
      const messageCount = chat.messages.length
      const clientMessages = chat.messages.filter((m) => m.senderType === "client").length
      const agentMessages = chat.messages.filter((m) => m.senderType === "agent").length

      // Calculer la durée de la conversation
      const startTime = new Date(chat.startedAt)
      const endTime = chat.endedAt ? new Date(chat.endedAt) : new Date()
      const durationMinutes = (endTime.getTime() - startTime.getTime()) / (1000 * 60)

      return {
        id: chat.id,
        client_name: client?.userName || "Client inconnu",
        client_id: chat.clientId,
        agent_id: chat.agentId,
        status: chat.status,
        started_at: startTime.toLocaleString("fr-FR"),
        ended_at: chat.endedAt ? new Date(chat.endedAt).toLocaleString("fr-FR") : "En cours",
        duration_minutes: durationMinutes.toFixed(2),
        total_messages: messageCount,
        client_messages: clientMessages,
        agent_messages: agentMessages,
      }
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Chat en direct</h1>
          <p className="text-gray-600">Gérez les conversations avec vos clients en temps réel</p>
          <div className="flex justify-end mb-4">
            <div className="space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => exportToCSV(prepareChatsForExport(activeChats), "conversations_actives")}
                disabled={activeChats.length === 0}
              >
                <Download className="h-4 w-4 mr-2" />
                Exporter Conversations Actives
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => exportToCSV(prepareChatsForExport(archivedChats), "conversations_archivees")}
                disabled={archivedChats.length === 0}
              >
                <Download className="h-4 w-4 mr-2" />
                Exporter Archives
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="h-[calc(100vh-200px)]">
              <CardHeader className="p-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Conversations</CardTitle>
                  <Badge variant={isConnected ? "success" : "destructive"} className="text-xs">
                    {isConnected ? "En ligne" : "Hors ligne"}
                  </Badge>
                </div>
                <div className="relative mt-2">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Rechercher..." className="pl-8" />
                </div>
              </CardHeader>
              <Tabs defaultValue="clients">
                <div className="px-4">
                  <TabsList className="w-full">
                    <TabsTrigger value="clients" className="flex-1">
                      <Users className="h-4 w-4 mr-2" />
                      Clients
                    </TabsTrigger>
                    <TabsTrigger value="active" className="flex-1">
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Actifs
                    </TabsTrigger>
                    <TabsTrigger value="archived" className="flex-1">
                      <Archive className="h-4 w-4 mr-2" />
                      Archives
                    </TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value="clients" className="m-0">
                  <ScrollArea className="h-[calc(100vh-320px)]">
                    <div className="p-4 space-y-2">
                      {clients.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                          <Users className="h-12 w-12 mx-auto mb-2 opacity-20" />
                          <p>Aucun client connecté</p>
                        </div>
                      ) : (
                        clients.map((client) => (
                          <div
                            key={client.socketId}
                            className={`p-3 rounded-lg cursor-pointer hover:bg-gray-100 ${
                              selectedClient?.socketId === client.socketId ? "bg-blue-50 border border-blue-200" : ""
                            }`}
                            onClick={() => handleStartChat(client)}
                          >
                            <div className="flex items-center space-x-3">
                              <Avatar className="h-10 w-10 bg-blue-100">
                                <AvatarFallback className="text-blue-600">
                                  {client.userName.substring(0, 2).toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1 min-w-0">
                                <p className="font-medium truncate">{client.userName}</p>
                                <div className="flex items-center text-xs text-gray-500">
                                  <Clock className="h-3 w-3 mr-1" />
                                  <span>Connecté à {formatTime(new Date(client.timestamp))}</span>
                                </div>
                              </div>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="ml-2"
                                onClick={() => handleStartChat(client)}
                              >
                                <MessageCircle className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </ScrollArea>
                </TabsContent>

                <TabsContent value="active" className="m-0">
                  <ScrollArea className="h-[calc(100vh-320px)]">
                    <div className="p-4 space-y-2">
                      {activeChats.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                          <MessageCircle className="h-12 w-12 mx-auto mb-2 opacity-20" />
                          <p>Aucune conversation active</p>
                        </div>
                      ) : (
                        activeChats.map((chat) => {
                          const client = clients.find((c) => c.socketId === chat.clientId)
                          const lastMessage = chat.messages[chat.messages.length - 1]

                          return (
                            <div
                              key={chat.id}
                              className={`p-3 rounded-lg cursor-pointer hover:bg-gray-100 ${
                                selectedChat?.id === chat.id ? "bg-blue-50 border border-blue-200" : ""
                              }`}
                              onClick={() => setSelectedChat(chat)}
                            >
                              <div className="flex items-center space-x-3">
                                <Avatar className="h-10 w-10 bg-blue-100">
                                  <AvatarFallback className="text-blue-600">
                                    {client?.userName.substring(0, 2).toUpperCase() || "CL"}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="flex-1 min-w-0">
                                  <p className="font-medium truncate">{client?.userName || "Client"}</p>
                                  {lastMessage ? (
                                    <p className="text-xs text-gray-500 truncate">
                                      {lastMessage.senderType === "client" ? "" : "Vous: "}
                                      {lastMessage.content}
                                    </p>
                                  ) : (
                                    <p className="text-xs text-gray-500">Nouvelle conversation</p>
                                  )}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {lastMessage
                                    ? formatTime(new Date(lastMessage.timestamp))
                                    : formatTime(new Date(chat.startedAt))}
                                </div>
                              </div>
                            </div>
                          )
                        })
                      )}
                    </div>
                  </ScrollArea>
                </TabsContent>

                <TabsContent value="archived" className="m-0">
                  <ScrollArea className="h-[calc(100vh-320px)]">
                    <div className="p-4 space-y-2">
                      {archivedChats.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                          <Archive className="h-12 w-12 mx-auto mb-2 opacity-20" />
                          <p>Aucune conversation archivée</p>
                        </div>
                      ) : (
                        archivedChats.map((chat) => {
                          const lastMessage = chat.messages[chat.messages.length - 1]

                          return (
                            <div
                              key={chat.id}
                              className="p-3 rounded-lg cursor-pointer hover:bg-gray-100"
                              onClick={() => setSelectedChat(chat)}
                            >
                              <div className="flex items-center space-x-3">
                                <Avatar className="h-10 w-10 bg-gray-100">
                                  <AvatarFallback className="text-gray-600">AR</AvatarFallback>
                                </Avatar>
                                <div className="flex-1 min-w-0">
                                  <p className="font-medium truncate">Client {chat.clientId.substring(0, 8)}</p>
                                  <div className="flex items-center text-xs text-gray-500">
                                    <Clock className="h-3 w-3 mr-1" />
                                    <span>{formatDate(new Date(chat.startedAt))}</span>
                                  </div>
                                </div>
                                <Badge variant="outline" className="text-xs">
                                  Archivé
                                </Badge>
                              </div>
                            </div>
                          )
                        })
                      )}
                    </div>
                  </ScrollArea>
                </TabsContent>
              </Tabs>
            </Card>
          </div>

          {/* Chat Area */}
          <div className="lg:col-span-3">
            <Card className="h-[calc(100vh-200px)]">
              {selectedChat ? (
                <>
                  <CardHeader className="p-4 border-b">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-10 w-10 bg-blue-100">
                          <AvatarFallback className="text-blue-600">
                            {clients
                              .find((c) => c.socketId === selectedChat.clientId)
                              ?.userName.substring(0, 2)
                              .toUpperCase() || "CL"}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-lg">
                            {clients.find((c) => c.socketId === selectedChat.clientId)?.userName || "Client"}
                          </CardTitle>
                          <CardDescription>
                            Conversation démarrée le {formatDate(new Date(selectedChat.startedAt))} à{" "}
                            {formatTime(new Date(selectedChat.startedAt))}
                          </CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={selectedChat.status === "active" ? "success" : "secondary"}>
                          {selectedChat.status === "active" ? "Actif" : "Terminé"}
                        </Badge>
                        {selectedChat.status === "active" && (
                          <Button variant="outline" size="sm" onClick={handleEndChat}>
                            Terminer
                          </Button>
                        )}
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0">
                    <ScrollArea className="h-[calc(100vh-340px)]">
                      <div className="p-4 space-y-4">
                        {selectedChat.messages.length === 0 ? (
                          <div className="text-center py-12 text-gray-500">
                            <MessageCircle className="h-12 w-12 mx-auto mb-2 opacity-20" />
                            <p>Aucun message dans cette conversation</p>
                            <p className="text-sm">Envoyez un message pour commencer</p>
                          </div>
                        ) : (
                          selectedChat.messages.map((msg) => (
                            <div
                              key={msg.id}
                              className={`flex ${msg.senderType === "agent" ? "justify-end" : "justify-start"}`}
                            >
                              {msg.senderType !== "agent" && (
                                <Avatar className="h-8 w-8 mr-2 mt-1">
                                  <AvatarFallback className="bg-blue-100 text-blue-600">
                                    {clients
                                      .find((c) => c.socketId === selectedChat.clientId)
                                      ?.userName.substring(0, 2)
                                      .toUpperCase() || "CL"}
                                  </AvatarFallback>
                                </Avatar>
                              )}
                              <div
                                className={`max-w-[70%] rounded-lg p-3 ${
                                  msg.senderType === "agent"
                                    ? "bg-blue-600 text-white"
                                    : msg.senderId === "system"
                                      ? "bg-gray-100 text-gray-700"
                                      : "bg-gray-200 text-gray-800"
                                }`}
                              >
                                <p className="text-sm">{msg.content}</p>
                                <p className="text-xs opacity-70 text-right mt-1">
                                  {formatTime(new Date(msg.timestamp))}
                                </p>
                              </div>
                              {msg.senderType === "agent" && (
                                <Avatar className="h-8 w-8 ml-2 mt-1">
                                  <AvatarFallback className="bg-green-100 text-green-600">AG</AvatarFallback>
                                </Avatar>
                              )}
                            </div>
                          ))
                        )}
                        <div ref={messagesEndRef} />
                      </div>
                    </ScrollArea>
                  </CardContent>
                  <CardFooter className="p-4 border-t">
                    {selectedChat.status === "active" ? (
                      <div className="flex w-full space-x-2">
                        <Input
                          placeholder="Tapez votre message..."
                          value={message}
                          onChange={(e) => {
                            setMessage(e.target.value)
                            handleTyping()
                          }}
                          onKeyPress={handleKeyPress}
                        />
                        <Button onClick={handleSendMessage} disabled={!message.trim()}>
                          <Send className="h-4 w-4 mr-2" />
                          Envoyer
                        </Button>
                      </div>
                    ) : (
                      <div className="w-full text-center">
                        <p className="text-gray-500">Cette conversation est terminée</p>
                      </div>
                    )}
                  </CardFooter>
                </>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center p-8">
                    <MessageCircle className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">Aucune conversation sélectionnée</h3>
                    <p className="text-gray-500 mb-6">
                      Sélectionnez un client dans la liste pour démarrer ou continuer une conversation
                    </p>
                    <div className="flex justify-center">
                      <Badge variant={isConnected ? "success" : "destructive"} className="text-sm">
                        {isConnected ? "Vous êtes en ligne" : "Vous êtes hors ligne"}
                      </Badge>
                    </div>
                  </div>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
