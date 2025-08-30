// Event Agent Framework - LangChain-like architecture for event search and recommendations

export interface Event {
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
  created_at: string
  updated_at: string
}

export interface Community {
  id: string
  name: string
  slug: string
  description: string
  website: string
  city: string
  created_at: string
  updated_at: string
  user_id: string
  logo_url: string
  tags: string
}

export interface EventRecommendation {
  event: Event
  score: number
  reasons: string[]
}

export interface SearchQuery {
  query: string
  location?: string
  date?: string
  type?: string
  tags?: string[]
}

class EventAgent {
  private events: Event[] = []
  private communities: Community[] = []
  private eventCommunityMap: Map<string, string> = new Map()
  private isLoadingEvents = false
  private currentPage = 1
  private hasMoreEvents = true

  constructor() {
    this.loadInitialData()
  }

  private async loadInitialData() {
    try {
      // Load first batch of events (50 events)
      await this.loadEventsBatch(1)

      // Load communities  
      const communitiesResponse = await fetch('/api/communities')
      this.communities = await communitiesResponse.json()

      // Load event-community relationships
      const relationsResponse = await fetch('/api/event-communities')
      const relations = await relationsResponse.json()
      
      relations.forEach((rel: any) => {
        this.eventCommunityMap.set(rel.event_id, rel.community_id)
      })
    } catch (error) {
      console.error('Failed to load initial data:', error)
    }
  }

  private async loadEventsBatch(page: number, limit = 50) {
    if (this.isLoadingEvents) return
    
    this.isLoadingEvents = true
    try {
      const eventsResponse = await fetch(`/api/events?page=${page}&limit=${limit}`)
      const data = await eventsResponse.json()
      
      if (page === 1) {
        // First batch - replace existing events
        this.events = data.events
      } else {
        // Subsequent batches - append to existing events
        this.events = [...this.events, ...data.events]
      }
      
      this.currentPage = page
      this.hasMoreEvents = data.pagination?.hasNext || false
    } catch (error) {
      console.error('Failed to load events batch:', error)
    } finally {
      this.isLoadingEvents = false
    }
  }

  async loadMoreEvents(): Promise<boolean> {
    if (!this.hasMoreEvents || this.isLoadingEvents) {
      return false
    }
    
    await this.loadEventsBatch(this.currentPage + 1)
    return this.hasMoreEvents
  }

  async loadAllEvents(): Promise<void> {
    while (this.hasMoreEvents && !this.isLoadingEvents) {
      await this.loadEventsBatch(this.currentPage + 1)
    }
  }

  // Search events based on user query
  async searchEvents(query: SearchQuery, loadAllIfNeeded = false): Promise<Event[]> {
    // Optionally load all events for comprehensive search
    if (loadAllIfNeeded && this.hasMoreEvents) {
      await this.loadAllEvents()
    }

    const searchTerms = query.query.toLowerCase().split(' ')
    
    return this.events.filter(event => {
      const searchableText = `
        ${event.title} 
        ${event.description} 
        ${event.location} 
        ${event.type} 
        ${event.tags}
      `.toLowerCase()

      // Check if any search terms match
      const hasTextMatch = searchTerms.some(term => searchableText.includes(term))
      
      // Location filter
      const hasLocationMatch = !query.location || 
        event.location.toLowerCase().includes(query.location.toLowerCase())
      
      // Type filter
      const hasTypeMatch = !query.type || 
        event.type.toLowerCase().includes(query.type.toLowerCase())
      
      // Tags filter
      const hasTagMatch = !query.tags || query.tags.length === 0 ||
        query.tags.some(tag => event.tags.toLowerCase().includes(tag.toLowerCase()))
      
      // Date filter (basic)
      const hasDateMatch = !query.date || event.date.includes(query.date)

      return hasTextMatch && hasLocationMatch && hasTypeMatch && hasTagMatch && hasDateMatch
    }).slice(0, 10) // Limit results
  }

  // Get personalized recommendations based on user preferences
  async getRecommendations(userQuery: string, preferences: {
    preferredTypes?: string[]
    preferredLocations?: string[]
    preferredTags?: string[]
  } = {}, loadAllIfNeeded = false): Promise<EventRecommendation[]> {
    // Optionally load all events for comprehensive recommendations
    if (loadAllIfNeeded && this.hasMoreEvents) {
      await this.loadAllEvents()
    }

    const recommendations: EventRecommendation[] = []

    this.events.forEach(event => {
      let score = 0
      const reasons: string[] = []

      // Score based on query relevance
      const queryTerms = userQuery.toLowerCase().split(' ')
      const eventText = `${event.title} ${event.description} ${event.tags}`.toLowerCase()
      
      queryTerms.forEach(term => {
        if (eventText.includes(term)) {
          score += 10
          reasons.push(`Matches "${term}"`)
        }
      })

      // Score based on preferences
      if (preferences.preferredTypes?.some(type => 
        event.type.toLowerCase().includes(type.toLowerCase())
      )) {
        score += 15
        reasons.push('Matches your preferred event type')
      }

      if (preferences.preferredLocations?.some(location => 
        event.location.toLowerCase().includes(location.toLowerCase())
      )) {
        score += 10
        reasons.push('In your preferred location')
      }

      if (preferences.preferredTags?.some(tag => 
        event.tags.toLowerCase().includes(tag.toLowerCase())
      )) {
        score += 5
        reasons.push('Matches your interests')
      }

      // Boost upcoming events
      const eventDate = new Date(event.date)
      const now = new Date()
      const daysFromNow = Math.ceil((eventDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
      
      if (daysFromNow > 0 && daysFromNow <= 30) {
        score += 5
        reasons.push('Coming up soon')
      }

      // Only include events with a reasonable score
      if (score >= 5) {
        recommendations.push({ event, score, reasons })
      }
    })

    return recommendations
      .sort((a, b) => b.score - a.score)
      .slice(0, 8)
  }

  // Extract intent from user query using simple keyword matching
  extractIntent(query: string): {
    intent: 'search' | 'recommend' | 'filter' | 'info'
    entities: {
      location?: string
      eventType?: string
      timeframe?: string
      tags?: string[]
    }
  } {
    const lowerQuery = query.toLowerCase()
    
    // Intent detection
    let intent: 'search' | 'recommend' | 'filter' | 'info' = 'search'
    
    if (lowerQuery.includes('recommend') || lowerQuery.includes('suggest')) {
      intent = 'recommend'
    } else if (lowerQuery.includes('filter') || lowerQuery.includes('show me')) {
      intent = 'filter'
    } else if (lowerQuery.includes('what is') || lowerQuery.includes('tell me about')) {
      intent = 'info'
    }

    // Entity extraction
    const entities: any = {}
    
    // Location extraction
    const locations = ['brussels', 'amsterdam', 'ghent', 'antwerp', 'belgium', 'netherlands']
    const foundLocation = locations.find(loc => lowerQuery.includes(loc))
    if (foundLocation) {
      entities.location = foundLocation
    }

    // Event type extraction
    const eventTypes = ['tech', 'ai', 'startup', 'networking', 'workshop', 'conference', 'meetup']
    const foundType = eventTypes.find(type => lowerQuery.includes(type))
    if (foundType) {
      entities.eventType = foundType
    }

    // Tag extraction
    const commonTags = ['javascript', 'python', 'ai', 'ml', 'ui', 'ux', 'react', 'vue', 'angular']
    const foundTags = commonTags.filter(tag => lowerQuery.includes(tag))
    if (foundTags.length > 0) {
      entities.tags = foundTags
    }

    return { intent, entities }
  }

  // Main agent processing method
  async processQuery(userQuery: string): Promise<{
    response: string
    events: Event[]
    recommendations: EventRecommendation[]
  }> {
    const { intent, entities } = this.extractIntent(userQuery)
    
    let events: Event[] = []
    let recommendations: EventRecommendation[] = []
    let response = ''

    switch (intent) {
      case 'search':
        events = await this.searchEvents({
          query: userQuery,
          location: entities.location,
          type: entities.eventType,
          tags: entities.tags
        })
        response = `Found ${events.length} events matching your search for "${userQuery}"`
        break

      case 'recommend':
        recommendations = await this.getRecommendations(userQuery, {
          preferredTypes: entities.eventType ? [entities.eventType] : [],
          preferredLocations: entities.location ? [entities.location] : [],
          preferredTags: entities.tags
        })
        response = `Here are ${recommendations.length} events I recommend based on your interests`
        events = recommendations.map(r => r.event)
        break

      case 'filter':
        events = await this.searchEvents({
          query: userQuery,
          location: entities.location,
          type: entities.eventType,
          tags: entities.tags
        })
        response = `Filtered events based on your criteria`
        break

      default:
        events = await this.searchEvents({ query: userQuery })
        response = `Here's what I found for "${userQuery}"`
    }

    return { response, events, recommendations }
  }
}

export default EventAgent