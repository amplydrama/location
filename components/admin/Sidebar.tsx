"use client"

import { useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import Link from "next/link"
import Cookies from "js-cookie"
import { logoutUser } from "@/app/api/login/auth"
import toast from "react-hot-toast"
import {
  Car,
  LayoutDashboard,
  Users,
  FileText,
  Settings,
  CreditCard,
  LogOut,
  ShieldAlert,
  MessageCircle,
  BarChart3,
  Globe,
  User,
  Download,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [isCollapsed, setIsCollapsed] = useState(false)

  const handleLogout = () => {
  
    const confirmLogout = window.confirm("Es-tu sûr de vouloir te déconnecter ?");

    if (confirmLogout) {
        logoutUser()
            .then(() => {
                console.log("Logout successful from component.");
                // --- Toast de succès (react-hot-toast) ---
                toast.success("Déconnexion réussie ! À bientôt.", {
                    duration: 3000,    // Durée en millisecondes (3 secondes)
                    position: "top-right", // Position du toast
                    // Tu peux ajouter d'autres options ici comme icon, style, className, etc.
                });
                // --- Fin Toast de succès ---

                router.push('/login'); // Redirige l'utilisateur
            })
            .catch((error) => {
                console.error("Logout failed from component:", error);
                // --- Toast d'erreur (react-hot-toast) ---
                const errorMessage = error.error || "Une erreur est survenue lors de la déconnexion.";
                toast.error(`Erreur : ${errorMessage}`, {
                    duration: 5000,    // Durée en millisecondes (5 secondes pour les erreurs)
                    position: "top-right",
                });
                // --- Fin Toast d'erreur ---
                
                // Toujours rediriger même en cas d'erreur pour vider le state local
                router.push('/login'); 
            });
    }
};

  const admin_email = Cookies.get("admin_email") || ""
  console.log("Admin Email:", admin_email)
  const navigation = [
    { name: "Tableau de bord", href: "/admin", icon: LayoutDashboard },
    { name: "Réservations", href: "/admin/bookings", icon: FileText },
    { name: "Véhicules", href: "/admin/vehicles", icon: Car },
    { name: "Clients", href: "/admin/customers", icon: Users },
    { name: "Chat", href: "/admin/chat", icon: MessageCircle },
    { name: "Analytics Chat", href: "/admin/chat/analytics", icon: BarChart3 },
    { name: "Paiements", href: "/admin/payments", icon: CreditCard },
    { name: "Comptes Admin", href: "/admin/accounts", icon: ShieldAlert },
    { name: "Exportation", href: "/admin/export", icon: Download },
    { name: "Paramètres", href: "/admin/settings", icon: Settings },
    // { name: "Site Web", href: "/admin/site-settings", icon: Globe },
  ]

  const isActive = (path: string) => {
    if (path === "/admin") {
      return pathname === path
    }
    return pathname.startsWith(path)
  }

  return (
    <div
      className={cn(
        "flex flex-col h-screen bg-white border-r border-gray-200 transition-all duration-300",
        isCollapsed ? "w-16" : "w-64",
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        {!isCollapsed && (
          <Link href="/admin" className="flex items-center space-x-2">
            <Car className="h-8 w-8 text-blue-600" />
            <span className="text-lg font-bold text-gray-900">CarLoc Admin</span>
          </Link>
        )}
        {isCollapsed && (
          <Link href="/admin" className="flex items-center justify-center w-full">
            <Car className="h-8 w-8 text-blue-600" />
          </Link>
        )}
        <Button variant="ghost" size="sm" onClick={() => setIsCollapsed(!isCollapsed)} className="p-1">
          {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {navigation.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={cn(
              "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
              isActive(item.href) ? "bg-blue-50 text-blue-700" : "text-gray-700 hover:bg-gray-100 hover:text-gray-900",
              isCollapsed && "justify-center",
            )}
            title={isCollapsed ? item.name : undefined}
          >
            <item.icon
              className={cn("h-5 w-5", isActive(item.href) ? "text-blue-500" : "text-gray-400", !isCollapsed && "mr-3")}
              aria-hidden="true"
            />
            {!isCollapsed && item.name}
          </Link>
        ))}
      </nav>

      {/* User section */}
      <div className="p-4 border-t border-gray-200">
        {!isCollapsed ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="w-full justify-start p-2">
                <Avatar className="h-8 w-8 mr-3">
                  <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Admin" />
                  <AvatarFallback>A</AvatarFallback>
                </Avatar>
                <div className="flex flex-col items-start">
                  <span className="text-sm font-medium">Administrateur</span>
                  <span className="text-xs text-gray-500">{admin_email ? admin_email : "admin@carloc.cm"}</span>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem asChild>
                <Link href="/admin/profile">
                  <User className="mr-2 h-4 w-4" />
                  Mon profil
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/admin/settings">
                  <Settings className="mr-2 h-4 w-4" />
                  Paramètres
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/" target="_blank">
                  <Globe className="mr-2 h-4 w-4" />
                  Voir le site
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4"  />
                Déconnexion
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="w-full p-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Admin" />
                  <AvatarFallback>A</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="px-2 py-1.5 text-sm font-medium"></div>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/admin/profile">
                  <User className="mr-2 h-4 w-4" />
                  Mon profil
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/admin/settings">
                  <Settings className="mr-2 h-4 w-4" />
                  Paramètres
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/" target="_blank">
                  <Globe className="mr-2 h-4 w-4" />
                  Voir le site
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4"  />
                Déconnexion
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </div>
  )
}
