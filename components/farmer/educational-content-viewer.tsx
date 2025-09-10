"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { BookOpen, Play, Clock, Award, CheckCircle, Loader2 } from "lucide-react"
import { formatDate } from "@/lib/date-utils"

interface EducationalContent {
  id: string
  title: string
  description: string
  content_type: string
  category: string
  duration_minutes: number
  difficulty_level: string
  content_url?: string
  thumbnail_url?: string
  created_at: string
}

interface EducationalContentViewerProps {
  farmerId: string
}

export function EducationalContentViewer({ farmerId }: EducationalContentViewerProps) {
  const [content, setContent] = useState<EducationalContent[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string>("all")

  useEffect(() => {
    const fetchContent = async () => {
      const supabase = createClient()
      
      let query = supabase
        .from("educational_content")
        .select("*")
        .order("created_at", { ascending: false })

      if (selectedCategory !== "all") {
        query = query.eq("category", selectedCategory)
      }

      const { data, error } = await query

      if (error) {
        setError("Failed to load educational content")
      } else {
        setContent(data || [])
      }
      setIsLoading(false)
    }

    fetchContent()
  }, [selectedCategory])

  const categories = [
    { id: "all", name: "All Content", icon: "📚" },
    { id: "biosecurity", name: "Biosecurity", icon: "🛡️" },
    { id: "disease_prevention", name: "Disease Prevention", icon: "🏥" },
    { id: "nutrition", name: "Nutrition", icon: "🌾" },
    { id: "management", name: "Management", icon: "🚜" },
    { id: "equipment", name: "Equipment", icon: "🔧" }
  ]

  const getDifficultyBadge = (difficulty: string) => {
    const difficultyConfig = {
      beginner: { color: "bg-green-100 text-green-700", label: "Beginner" },
      intermediate: { color: "bg-yellow-100 text-yellow-700", label: "Intermediate" },
      advanced: { color: "bg-red-100 text-red-700", label: "Advanced" }
    }
    
    const config = difficultyConfig[difficulty as keyof typeof difficultyConfig] || difficultyConfig.beginner
    return <Badge className={config.color}>{config.label}</Badge>
  }

  const getContentTypeIcon = (type: string) => {
    switch (type) {
      case "video":
        return <Play className="h-4 w-4" />
      case "article":
        return <BookOpen className="h-4 w-4" />
      case "quiz":
        return <Award className="h-4 w-4" />
      default:
        return <BookOpen className="h-4 w-4" />
    }
  }

  const formatDuration = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes} min`
    }
    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            Educational Content
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-24 bg-muted rounded-lg"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-primary" />
          Educational Content
        </CardTitle>
        
        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mt-4">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category.id)}
              className="gap-2"
            >
              <span>{category.icon}</span>
              {category.name}
            </Button>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {content.length === 0 ? (
          <div className="text-center py-8">
            <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No educational content found</p>
            <p className="text-sm text-muted-foreground mt-2">
              {selectedCategory === "all" 
                ? "Educational content will appear here once added to the system"
                : `No content found for ${categories.find(c => c.id === selectedCategory)?.name}`
              }
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {content.map((item) => (
              <div key={item.id} className="flex items-start gap-4 p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                {/* Thumbnail */}
                <div className="flex-shrink-0">
                  {item.thumbnail_url ? (
                    <img
                      src={item.thumbnail_url}
                      alt={item.title}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                  ) : (
                    <div className="w-20 h-20 bg-primary/10 rounded-lg flex items-center justify-center">
                      {getContentTypeIcon(item.content_type)}
                    </div>
                  )}
                </div>

                {/* Content Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-lg truncate">{item.title}</h3>
                    <div className="flex gap-2 ml-2">
                      {getDifficultyBadge(item.difficulty_level)}
                      <Badge variant="outline">{item.content_type}</Badge>
                    </div>
                  </div>
                  
                  <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                    {item.description}
                  </p>
                  
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {formatDuration(item.duration_minutes)}
                    </div>
                    <div className="flex items-center gap-1">
                      <span>📁</span>
                      {categories.find(c => c.id === item.category)?.name || item.category}
                    </div>
                    <div className="flex items-center gap-1">
                      <span>📅</span>
                      {formatDate(item.created_at)}
                    </div>
                  </div>
                </div>

                {/* Action Button */}
                <div className="flex-shrink-0">
                  <Button size="sm" className="gap-2">
                    {item.content_type === "video" ? (
                      <>
                        <Play className="h-4 w-4" />
                        Watch
                      </>
                    ) : item.content_type === "quiz" ? (
                      <>
                        <Award className="h-4 w-4" />
                        Take Quiz
                      </>
                    ) : (
                      <>
                        <BookOpen className="h-4 w-4" />
                        Read
                      </>
                    )}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Sample Content for Demo */}
        {content.length === 0 && (
          <div className="mt-6 p-4 bg-muted/50 rounded-lg">
            <h4 className="font-medium mb-2">Sample Content Available:</h4>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>Introduction to Farm Biosecurity (Video - 45 min)</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>Disease Prevention Best Practices (Article - 15 min)</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>Livestock Health Assessment Quiz (Quiz - 10 min)</span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              These will be available once the database is set up with educational content.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
