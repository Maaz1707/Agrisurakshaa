"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import {
  LayoutDashboard,
  AlertTriangle,
  BookOpen,
  FileText,
  Shield,
  Settings,
  LogOut,
  Menu,
  X,
  Home,
  Bell,
  GraduationCap,
  ClipboardList,
  BarChart3,
  User,
  HelpCircle,
  Mic
} from "lucide-react"

interface SidebarNavigationProps {
  profile?: any
  onLogout?: () => void
}

export function SidebarNavigation({ profile, onLogout }: SidebarNavigationProps) {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  const navigationItems = [
    {
      title: "Dashboard",
      href: "/farmer/dashboard",
      icon: LayoutDashboard,
      description: "Overview of your farm"
    },
    {
      title: "Alerts & Notifications",
      href: "/farmer/alerts",
      icon: Bell,
      description: "Stay informed",
      badge: "3 active"
    },
    {
      title: "Education Center",
      href: "/farmer/education",
      icon: GraduationCap,
      description: "Learn best practices"
    },
    {
      title: "Risk Assessment",
      href: "/farmer/risk-assessment",
      icon: Shield,
      description: "Evaluate biosecurity risks"
    },
    {
      title: "Reports",
      href: "/farmer/reports",
      icon: FileText,
      description: "Generate farm reports"
    }
  ]

  const quickActions = [
    {
      title: "Add Animal",
      action: "add-livestock",
      icon: Home,
      description: "Register new livestock"
    },
    {
      title: "Health Record",
      action: "add-health-record",
      icon: ClipboardList,
      description: "Log health data"
    },
    {
      title: "Create Alert",
      action: "add-alert",
      icon: Bell,
      description: "Set up notifications"
    },
    {
      title: "Generate Report",
      action: "generate-report",
      icon: FileText,
      description: "Create farm report"
    }
  ]

  const handleQuickAction = (action: string) => {
    const button = document.querySelector(`[data-voice-trigger="${action}"]`) as HTMLElement
    if (button) {
      button.click()
    }
    setIsOpen(false)
  }

  const isActive = (href: string) => {
    if (href === "/farmer/dashboard") {
      return pathname === "/farmer/dashboard"
    }
    return pathname.startsWith(href)
  }

  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        variant="outline"
        size="sm"
        className="fixed top-4 left-4 z-50 lg:hidden bg-white shadow-lg border-2 border-gray-200 hover:border-emerald-300 hover:bg-emerald-50"
        onClick={() => setIsOpen(true)}
        data-menu-button
      >
        <Menu className="h-5 w-5" />
      </Button>

      {/* Sidebar Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed left-0 top-0 z-50 h-full w-80 bg-white border-r-2 border-gray-100 shadow-xl transform transition-transform duration-300 ease-in-out lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b-2 border-gray-100 bg-gradient-to-r from-emerald-50 to-emerald-100">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="font-bold text-base text-gray-900">Biosecurity Portal</h2>
                <p className="text-sm text-emerald-700 font-medium">Farmer Dashboard</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Profile Section */}
          {profile && (
            <div className="p-6 border-b-2 border-gray-100 bg-gray-50">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-md">
                  <User className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-base text-gray-900 truncate">{profile.full_name === "Charlie" ? "Ramu" : (profile.full_name || "Farmer")}</p>
                  <p className="text-sm text-gray-600 truncate">{profile.email}</p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <ScrollArea className="flex-1 px-6 py-4">
            <div className="space-y-6">
              {/* Main Navigation */}
              <div>
                <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-4">
                  Navigation
                </h3>
                <nav className="space-y-2">
                  {navigationItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        "flex items-center gap-4 px-4 py-3 rounded-xl text-sm transition-all duration-200 hover:bg-emerald-50 hover:shadow-md group",
                        isActive(item.href) && "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg"
                      )}
                    >
                      <item.icon className={cn(
                        "h-5 w-5 flex-shrink-0 transition-colors",
                        isActive(item.href) ? "text-white" : "text-gray-600 group-hover:text-emerald-600"
                      )} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className={cn(
                            "font-semibold truncate",
                            isActive(item.href) ? "text-white" : "text-gray-900"
                          )}>{item.title}</span>
                          {item.badge && (
                            <Badge className={cn(
                              "text-xs font-bold",
                              isActive(item.href) 
                                ? "bg-white text-emerald-600" 
                                : "bg-emerald-100 text-emerald-700"
                            )}>
                              {item.badge}
                            </Badge>
                          )}
                        </div>
                        <p className={cn(
                          "text-xs truncate mt-1",
                          isActive(item.href) ? "text-emerald-100" : "text-gray-500"
                        )}>
                          {item.description}
                        </p>
                      </div>
                    </Link>
                  ))}
                </nav>
              </div>

              <Separator />

              {/* Quick Actions */}
              <div>
                <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-4">
                  Quick Actions
                </h3>
                <div className="space-y-2">
                  {quickActions.map((action) => (
                    <Button
                      key={action.action}
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start gap-4 px-4 py-3 h-auto hover:bg-blue-50 hover:shadow-md rounded-xl transition-all duration-200 group"
                      onClick={() => handleQuickAction(action.action)}
                    >
                      <action.icon className="h-5 w-5 flex-shrink-0 text-gray-600 group-hover:text-blue-600" />
                      <div className="flex-1 min-w-0 text-left">
                        <div className="text-sm font-semibold truncate text-gray-900">{action.title}</div>
                        <div className="text-xs text-gray-500 truncate">
                          {action.description}
                        </div>
                      </div>
                    </Button>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Voice Assistant */}
              <div>
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                  Voice Assistant
                </h3>
                <div className="space-y-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start gap-3 px-3 py-2 h-auto"
                    onClick={() => {
                      if ('speechSynthesis' in window) {
                        const utterance = new SpeechSynthesisUtterance("Voice assistant activated. Say 'help' for available commands.")
                        utterance.rate = 0.8
                        speechSynthesis.speak(utterance)
                      }
                    }}
                  >
                    <Mic className="h-4 w-4 flex-shrink-0" />
                    <div className="flex-1 min-w-0 text-left">
                      <div className="text-sm font-medium">Voice Commands</div>
                      <div className="text-xs text-muted-foreground">Activate voice assistant</div>
                    </div>
                  </Button>
                </div>
              </div>
            </div>
          </ScrollArea>

          {/* Footer */}
          <div className="p-6 border-t-2 border-gray-100 bg-gray-50 space-y-2">
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start gap-3 hover:bg-gray-100 rounded-xl py-3"
              onClick={() => {
                // Navigate to help or settings
                if ('speechSynthesis' in window) {
                  const utterance = new SpeechSynthesisUtterance("Help section opened")
                  utterance.rate = 0.8
                  speechSynthesis.speak(utterance)
                }
              }}
            >
              <HelpCircle className="h-5 w-5 text-gray-600" />
              <span className="font-semibold text-gray-900">Help & Support</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start gap-3 hover:bg-gray-100 rounded-xl py-3"
              onClick={() => {
                // Navigate to settings
                if ('speechSynthesis' in window) {
                  const utterance = new SpeechSynthesisUtterance("Settings opened")
                  utterance.rate = 0.8
                  speechSynthesis.speak(utterance)
                }
              }}
            >
              <Settings className="h-5 w-5 text-gray-600" />
              <span className="font-semibold text-gray-900">Settings</span>
            </Button>
            {onLogout && (
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start gap-3 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl py-3"
                onClick={onLogout}
              >
                <LogOut className="h-5 w-5" />
                <span className="font-semibold">Sign Out</span>
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content Spacer for Desktop */}
      <div className="hidden lg:block w-80 flex-shrink-0" />
    </>
  )
}
