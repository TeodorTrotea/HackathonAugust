'use client'

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, MapPin, Clock, ExternalLink, Users, Zap, Code2, Rocket, Palette, BookOpen } from "lucide-react"
import Image from "next/image"
import { useState } from "react"

interface Event {
  id: string
  title: string
  description: string
  date: string
  time: string | null
  location: string
  type: string
  image_url: string
  registration_url: string
  tags: string
  status: string
}

interface EventCardProps {
  event: Event
}

function getEventIcon(type: string, tags: string) {
  const lowerType = type.toLowerCase()
  const lowerTags = tags.toLowerCase()
  
  if (lowerTags.includes('ai') || lowerTags.includes('ml')) {
    return <Zap className="w-5 h-5 text-purple-400" />
  } else if (lowerTags.includes('code') || lowerTags.includes('javascript') || lowerTags.includes('python')) {
    return <Code2 className="w-5 h-5 text-green-400" />
  } else if (lowerTags.includes('startup') || lowerTags.includes('fintech')) {
    return <Rocket className="w-5 h-5 text-blue-400" />
  } else if (lowerType.includes('arts') || lowerType.includes('culture')) {
    return <Palette className="w-5 h-5 text-pink-400" />
  } else if (lowerTags.includes('networking') || lowerTags.includes('meetup')) {
    return <Users className="w-5 h-5 text-orange-400" />
  } else {
    return <BookOpen className="w-5 h-5 text-gray-400" />
  }
}

function getThemeColors(type: string, tags: string) {
  const lowerType = type.toLowerCase()
  const lowerTags = tags.toLowerCase()
  
  if (lowerTags.includes('ai') || lowerTags.includes('ml')) {
    return {
      gradient: 'from-purple-500/20 to-indigo-500/20',
      border: 'border-purple-500/30',
      tag: 'bg-purple-500/20 text-purple-300'
    }
  } else if (lowerTags.includes('code') || lowerTags.includes('javascript') || lowerTags.includes('python')) {
    return {
      gradient: 'from-green-500/20 to-emerald-500/20',
      border: 'border-green-500/30',
      tag: 'bg-green-500/20 text-green-300'
    }
  } else if (lowerTags.includes('startup') || lowerTags.includes('fintech')) {
    return {
      gradient: 'from-blue-500/20 to-cyan-500/20',
      border: 'border-blue-500/30',
      tag: 'bg-blue-500/20 text-blue-300'
    }
  } else if (lowerType.includes('arts') || lowerType.includes('culture')) {
    return {
      gradient: 'from-pink-500/20 to-rose-500/20',
      border: 'border-pink-500/30',
      tag: 'bg-pink-500/20 text-pink-300'
    }
  } else if (lowerTags.includes('networking') || lowerTags.includes('meetup')) {
    return {
      gradient: 'from-orange-500/20 to-yellow-500/20',
      border: 'border-orange-500/30',
      tag: 'bg-orange-500/20 text-orange-300'
    }
  } else {
    return {
      gradient: 'from-gray-500/20 to-slate-500/20',
      border: 'border-gray-500/30',
      tag: 'bg-gray-500/20 text-gray-300'
    }
  }
}

function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  } catch {
    return dateString
  }
}

function formatTime(timeString: string | null): string {
  if (!timeString) return ''
  try {
    const [hours, minutes] = timeString.split(':')
    const date = new Date()
    date.setHours(parseInt(hours), parseInt(minutes))
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })
  } catch {
    return timeString
  }
}

function getTags(tagsString: string): string[] {
  return tagsString.split(';').filter(tag => tag.trim()).slice(0, 4)
}

function isValidImageUrl(url: string): boolean {
  if (!url || typeof url !== 'string') return false
  
  try {
    new URL(url)
    
    // Check if it's a placeholder or empty image
    const placeholderPatterns = [
      /placeholder/i,
      /example\.com/i,
      /localhost/i,
      /127\.0\.0\.1/i,
      /\.(svg|gif)$/i, // Might be problematic
    ]
    
    if (placeholderPatterns.some(pattern => pattern.test(url))) {
      return false
    }
    
    // Check for common image extensions
    const imageExtensions = /\.(jpg|jpeg|png|webp|avif|bmp)(\?.*)?$/i
    return imageExtensions.test(url) || url.includes('images.') || url.includes('img.')
  } catch {
    return false
  }
}

export default function EventCard({ event }: EventCardProps) {
  const [imageError, setImageError] = useState(false)
  const [imageLoading, setImageLoading] = useState(true)
  
  const theme = getThemeColors(event.type, event.tags)
  const icon = getEventIcon(event.type, event.tags)
  const tags = getTags(event.tags)
  
  const hasValidImage = isValidImageUrl(event.image_url) && !imageError
  
  return (
    <Card className={`bg-gradient-to-br ${theme.gradient} border ${theme.border} hover:border-opacity-50 transition-all duration-200 hover:scale-[1.02] group overflow-hidden`}>
      <div className="p-6">
        {/* Header with image and icon */}
        <div className="flex items-start gap-4 mb-4">
          <div className="relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-gradient-to-br from-neutral-700 to-neutral-800 flex items-center justify-center">
            {hasValidImage ? (
              <>
                <Image
                  src={event.image_url}
                  alt={event.title}
                  width={64}
                  height={64}
                  className={`object-cover w-full h-full transition-opacity duration-200 ${imageLoading ? 'opacity-0' : 'opacity-100'}`}
                  onLoad={() => setImageLoading(false)}
                  onError={() => {
                    setImageError(true)
                    setImageLoading(false)
                  }}
                  priority={false}
                  placeholder="blur"
                  blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyatcVTHHHHHEeiX7GbWjHHHHHHHHHHnkfTyP5v/9k="
                />
                {imageLoading && (
                  <div className="absolute inset-0 animate-pulse bg-neutral-600 flex items-center justify-center">
                    <div className="text-neutral-400 text-xs">Loading...</div>
                  </div>
                )}
              </>
            ) : (
              <div className="text-neutral-400 flex items-center justify-center">
                {icon}
              </div>
            )}
          </div>
          <div className="flex-1">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                {icon}
                <span className="text-sm text-neutral-400 font-medium">{event.type}</span>
              </div>
            </div>
            <h3 className="text-lg font-semibold text-white line-clamp-2 group-hover:text-opacity-90">
              {event.title}
            </h3>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-neutral-300 mb-4 line-clamp-3">
          {event.description.length > 150 
            ? `${event.description.substring(0, 150)}...` 
            : event.description
          }
        </p>

        {/* Event details */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-neutral-400">
            <Calendar className="w-4 h-4" />
            <span>{formatDate(event.date)}</span>
            {event.time && (
              <>
                <Clock className="w-4 h-4 ml-2" />
                <span>{formatTime(event.time)}</span>
              </>
            )}
          </div>
          
          <div className="flex items-center gap-2 text-sm text-neutral-400">
            <MapPin className="w-4 h-4" />
            <span className="line-clamp-1">{event.location}</span>
          </div>
        </div>

        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {tags.map((tag, index) => (
              <span
                key={index}
                className={`px-2 py-1 rounded-full text-xs font-medium ${theme.tag}`}
              >
                {tag.trim()}
              </span>
            ))}
          </div>
        )}

        {/* Action button */}
        <Button
          asChild
          className="w-full bg-white/10 hover:bg-white/20 text-white border border-white/20 hover:border-white/30 transition-colors"
        >
          <a
            href={event.registration_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2"
          >
            <span>Register</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </Button>
      </div>
    </Card>
  )
}