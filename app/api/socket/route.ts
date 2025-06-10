import { Server } from "socket.io"
import type { NextApiRequest } from "next"
import { NextResponse } from "next/server"

// Stockage temporaire des connexions socket (en production, utilisez Redis)
const connectedClients = new Map()
const activeChats = new Map()
const onlineAgents = new Map()

// Fonction pour initialiser le serveur Socket.IO
const initSocketServer = (req: NextApiRequest, res: any) => {
  if (!res.socket.server.io) {
    console.log("Initialisation du serveur Socket.IO...")
    const io = new Server(res.socket.server, {
      path: "/api/socket",
      addTrailingSlash: false,
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
      },
    })

    // Gestion des connexions
    io.on("connection", (socket) => {
      console.log(`Client connecté: ${socket.id}`)

      // Connexion d'un client
      socket.on("client:connect", ({ userId, userName }) => {
        connectedClients.set(socket.id, { userId, userName, type: "client", timestamp: new Date() })
        console.log(`Client enregistré: ${userName} (${userId})`)

        // Informer les agents qu'un nouveau client est connecté
        io.to("agents").emit("client:online", {
          socketId: socket.id,
          userId,
          userName,
          timestamp: new Date(),
        })
      })

      // Connexion d'un agent
      socket.on("agent:connect", ({ agentId, agentName }) => {
        onlineAgents.set(socket.id, { agentId, agentName, timestamp: new Date() })
        socket.join("agents")
        console.log(`Agent connecté: ${agentName} (${agentId})`)

        // Envoyer la liste des clients connectés à l'agent
        const clients = Array.from(connectedClients.entries()).map(([socketId, client]) => ({
          socketId,
          ...client,
        }))
        socket.emit("clients:list", clients)
      })

      // Démarrer un chat
      socket.on("chat:start", ({ clientId, agentId }) => {
        const chatId = `chat_${Date.now()}`
        activeChats.set(chatId, {
          id: chatId,
          clientId,
          agentId,
          messages: [],
          startedAt: new Date(),
          status: "active",
        })

        // Informer le client et l'agent que le chat a commencé
        io.to(clientId).to(agentId).emit("chat:started", {
          chatId,
          clientId,
          agentId,
          timestamp: new Date(),
        })
      })

      // Envoyer un message
      socket.on("message:send", ({ chatId, senderId, content, senderType }) => {
        const timestamp = new Date()
        const message = {
          id: `msg_${Date.now()}`,
          chatId,
          senderId,
          content,
          senderType, // "client" ou "agent"
          timestamp,
        }

        // Stocker le message
        const chat = activeChats.get(chatId)
        if (chat) {
          chat.messages.push(message)
          activeChats.set(chatId, chat)

          // Déterminer le destinataire
          const recipientId = senderType === "client" ? chat.agentId : chat.clientId

          // Envoyer le message au destinataire
          io.to(recipientId).emit("message:received", message)
        }
      })

      // Terminer un chat
      socket.on("chat:end", ({ chatId }) => {
        const chat = activeChats.get(chatId)
        if (chat) {
          chat.status = "ended"
          chat.endedAt = new Date()
          activeChats.set(chatId, chat)

          // Informer les participants
          io.to(chat.clientId).to(chat.agentId).emit("chat:ended", {
            chatId,
            timestamp: new Date(),
          })
        }
      })

      // Déconnexion
      socket.on("disconnect", () => {
        const client = connectedClients.get(socket.id)
        const agent = onlineAgents.get(socket.id)

        if (client) {
          connectedClients.delete(socket.id)
          io.to("agents").emit("client:offline", { socketId: socket.id })
        }

        if (agent) {
          onlineAgents.delete(socket.id)
        }

        console.log(`Client déconnecté: ${socket.id}`)
      })
    })

    res.socket.server.io = io
  }
  return res.socket.server.io
}

export async function GET(req: NextApiRequest, res: any) {
  try {
    const io = initSocketServer(req, res)
    return new NextResponse("Socket.IO server is running", { status: 200 })
  } catch (error) {
    console.error("Socket initialization error:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}
