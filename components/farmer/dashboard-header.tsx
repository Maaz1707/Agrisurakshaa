"use client"

import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarInitials } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { Bell, Settings, LogOut, User, Tractor } from "lucide-react"
import { SidebarNavigation } from "@/components/sidebar-navigation"

interface DashboardHeaderProps {
  profile: {
    full_name: string
    farm_name?: string
    email: string
  }
}

export function DashboardHeader({ profile }: DashboardHeaderProps) {
  const router = useRouter()

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/auth/login")
  }

  return (
    <>
      {/* Sidebar Navigation */}
      <SidebarNavigation profile={profile} onLogout={handleSignOut} />
      
      {/* Header */}
      <header className="bg-white border-b-2 border-gray-100 shadow-lg lg:ml-80">
        <div className="container mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            {/* Logo and Title */}
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 p-3 rounded-xl shadow-md">
                <Tractor className="h-7 w-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Digital Biosecurity Portal</h1>
                <p className="text-base text-gray-600 font-medium">
                  {profile.farm_name ? `${profile.farm_name} Dashboard` : "Farmer Dashboard"}
                </p>
              </div>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center gap-4">
              {/* Notifications */}
              <Button variant="ghost" size="icon" className="relative hover:bg-gray-100 rounded-xl p-3">
                <Bell className="h-6 w-6 text-gray-600" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-bold shadow-lg">
                  3
                </span>
              </Button>

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 rounded-xl transition-all duration-200">
                    <Avatar className="h-10 w-10 border-2 border-emerald-200">
                      <AvatarFallback className="bg-emerald-100 text-emerald-700 font-semibold">
                        <AvatarInitials name={profile.full_name === "Charlie" ? "Ramu" : (profile.full_name || profile.email)} />
                      </AvatarFallback>
                    </Avatar>
                    <div className="text-left hidden md:block">
                      <p className="text-sm font-semibold text-gray-900">{profile.full_name === "Charlie" ? "Ramu" : (profile.full_name || "Farmer")}</p>
                      <p className="text-xs text-gray-500">{profile.email}</p>
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem>
                    <User className="h-4 w-4 mr-2" />
                    Profile Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="h-4 w-4 mr-2" />
                    Dashboard Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="text-destructive">
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>
    </>
  )
}
