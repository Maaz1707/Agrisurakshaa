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
        className="fixed top-4 left-4 z-50 lg:hidden"
        onClick={() => setIsOpen(true)}
        data-menu-button
      >
        <Menu className="h-4 w-4" />
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
          "fixed left-0 top-0 z-50 h-full w-80 bg-background border-r border-border transform transition-transform duration-300 ease-in-out lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
                <Shield className="h-4 w-4 text-primary-foreground" />
              </div>
              <div>
                <h2 className="font-semibold text-sm">Biosecurity Portal</h2>
                <p className="text-xs text-muted-foreground">Farmer Dashboard</p>
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
            <div className="p-6 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <User className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{profile.full_name || "Farmer"}</p>
                  <p className="text-xs text-muted-foreground">{profile.email}</p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <ScrollArea className="flex-1 px-6 py-4">
            <div className="space-y-6">
              {/* Main Navigation */}
              <div>
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                  Navigation
                </h3>
                <nav className="space-y-1">
                  {navigationItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors hover:bg-accent hover:text-accent-foreground",
                        isActive(item.href) && "bg-accent text-accent-foreground"
                      )}
                    >
                      <item.icon className="h-4 w-4 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="truncate">{item.title}</span>
                          {item.badge && (
                            <Badge variant="secondary" className="text-xs">
                              {item.badge}
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground truncate">
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
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                  Quick Actions
                </h3>
                <div className="space-y-1">
                  {quickActions.map((action) => (
                    <Button
                      key={action.action}
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start gap-3 px-3 py-2 h-auto"
                      onClick={() => handleQuickAction(action.action)}
                    >
                      <action.icon className="h-4 w-4 flex-shrink-0" />
                      <div className="flex-1 min-w-0 text-left">
                        <div className="text-sm font-medium truncate">{action.title}</div>
                        <div className="text-xs text-muted-foreground truncate">
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
          <div className="p-6 border-t border-border space-y-2">
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start gap-3"
              onClick={() => {
                // Navigate to help or settings
                if ('speechSynthesis' in window) {
                  const utterance = new SpeechSynthesisUtterance("Help section opened")
                  utterance.rate = 0.8
                  speechSynthesis.speak(utterance)
                }
              }}
            >
              <HelpCircle className="h-4 w-4" />
              Help & Support
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start gap-3"
              onClick={() => {
                // Navigate to settings
                if ('speechSynthesis' in window) {
                  const utterance = new SpeechSynthesisUtterance("Settings opened")
                  utterance.rate = 0.8
                  speechSynthesis.speak(utterance)
                }
              }}
            >
              <Settings className="h-4 w-4" />
              Settings
            </Button>
            {onLogout && (
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start gap-3 text-destructive hover:text-destructive"
                onClick={onLogout}
              >
                <LogOut className="h-4 w-4" />
                Sign Out
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
