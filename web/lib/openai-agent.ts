import OpenAI from 'openai'
import fs from 'fs'
import path from 'path'

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

interface AgentResponse {
  message: string
  events: Event[]
  reasoning?: string
}

class EventAgent {
  private openai: OpenAI
  private events: Event[] = []

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    })
    this.loadEvents()
  }

  private loadEvents() {
    try {
      const csvPath = path.join(process.cwd(), '../data/events_export.csv')
      const csvContent = fs.readFileSync(csvPath, 'utf-8')
      
      const lines = csvContent.trim().split('\n')
      const headers = lines[0].split(',')
      
      this.events = lines.slice(1).map(line => {
        const values = []
        let current = ''
        let inQuotes = false
        
        for (let i = 0; i < line.length; i++) {
          const char = line[i]
          if (char === '"') {
            inQuotes = !inQuotes
          } else if (char === ',' && !inQuotes) {
            values.push(current.trim().replace(/^"|"$/g, ''))
            current = ''
          } else {
            current += char
          }
        }
        values.push(current.trim().replace(/^"|"$/g, ''))

        const event: any = {}
        headers.forEach((header, index) => {
          event[header] = values[index] || ''
        })
        
        return event
      }) as Event[]
    } catch (error) {
      console.error('Failed to load events:', error)
    }
  }

  private searchEvents(query: string, filters: {
    location?: string
    eventType?: string
    tags?: string[]
    maxResults?: number
  } = {}): Event[] {
    const searchTerms = query.toLowerCase().split(' ')
    const maxResults = filters.maxResults || 8

    let filteredEvents = this.events.filter(event => {
      const searchableText = `
        ${event.title} 
        ${event.description} 
        ${event.location} 
        ${event.type} 
        ${event.tags}
      `.toLowerCase()

      // Text matching
      const hasTextMatch = query.length < 3 || searchTerms.some(term => 
        term.length > 2 && searchableText.includes(term)
      )
      
      // Location filter
      const hasLocationMatch = !filters.location || 
        event.location.toLowerCase().includes(filters.location.toLowerCase())
      
      // Type filter
      const hasTypeMatch = !filters.eventType || 
        event.type.toLowerCase().includes(filters.eventType.toLowerCase()) ||
        event.tags.toLowerCase().includes(filters.eventType.toLowerCase())
      
      // Tags filter
      const hasTagMatch = !filters.tags || filters.tags.length === 0 ||
        filters.tags.some(tag => event.tags.toLowerCase().includes(tag.toLowerCase()))
      
      return hasTextMatch && hasLocationMatch && hasTypeMatch && hasTagMatch
    })

    // Sort by relevance and upcoming events
    filteredEvents.sort((a, b) => {
      const aDate = new Date(a.date)
      const bDate = new Date(b.date)
      const now = new Date()
      
      const aUpcoming = aDate > now ? 1 : 0
      const bUpcoming = bDate > now ? 1 : 0
      
      if (aUpcoming !== bUpcoming) return bUpcoming - aUpcoming
      
      return aDate.getTime() - bDate.getTime()
    })

    return filteredEvents.slice(0, maxResults)
  }

  private getEventSummary(): string {
    const totalEvents = this.events.length
    const cities = [...new Set(this.events.map(e => e.location))].slice(0, 5)
    const types = [...new Set(this.events.map(e => e.type))].slice(0, 5)
    
    return `I have access to ${totalEvents} tech events across Belgium and Netherlands. Events are available in cities like ${cities.join(', ')} and cover topics like ${types.join(', ')}.`
  }

  async processQuery(userMessage: string): Promise<AgentResponse> {
    const tools = [
      {
        type: 'function' as const,
        function: {
          name: 'search_events',
          description: 'Search for events based on user query with optional filters',
          parameters: {
            type: 'object',
            properties: {
              query: {
                type: 'string',
                description: 'Search query from user input'
              },
              location: {
                type: 'string',
                description: 'Location filter (e.g., Brussels, Amsterdam, Ghent)'
              },
              eventType: {
                type: 'string',
                description: 'Event type filter (e.g., AI, tech, startup, networking)'
              },
              tags: {
                type: 'array',
                items: { type: 'string' },
                description: 'Array of tags to filter by'
              },
              maxResults: {
                type: 'number',
                description: 'Maximum number of events to return (default 8)'
              }
            },
            required: ['query']
          }
        }
      },
      {
        type: 'function' as const,
        function: {
          name: 'get_event_summary',
          description: 'Get a summary of available events and locations',
          parameters: {
            type: 'object',
            properties: {}
          }
        }
      }
    ]

    const systemPrompt = `You are an AI assistant specialized in helping users find tech events in Belgium and Netherlands. You have access to a database of events including conferences, meetups, workshops, and networking events.

Your personality:
- Helpful and enthusiastic about tech events
- Knowledgeable about the Belgian and Dutch tech scene
- Provide concise but informative responses
- Always try to find relevant events for the user

When searching for events:
- Use the search_events function to find relevant events
- Extract key information from user queries (location, event type, interests)
- If no specific filters are mentioned, search broadly
- Recommend 3-8 most relevant events
- Always explain why you chose specific events

Event categories you understand:
- AI/ML events: artificial intelligence, machine learning, deep learning
- Tech events: general technology, software development
- Startup events: entrepreneurship, pitch events, funding
- Networking events: meetups, social events, community gatherings
- Workshop events: hands-on learning, training sessions

Common locations: Brussels, Amsterdam, Ghent, Antwerp

Respond in a conversational, helpful tone and always aim to find events that match the user's interests.`

    try {
      const completion = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMessage }
        ],
        tools,
        tool_choice: 'auto'
      })

      const message = completion.choices[0].message
      let events: Event[] = []
      let assistantMessage = message.content || 'I can help you find tech events in Belgium and Netherlands!'

      // Handle function calls
      if (message.tool_calls && message.tool_calls.length > 0) {
        for (const toolCall of message.tool_calls) {
          if (toolCall.function.name === 'search_events') {
            const args = JSON.parse(toolCall.function.arguments)
            events = this.searchEvents(args.query, {
              location: args.location,
              eventType: args.eventType,
              tags: args.tags,
              maxResults: args.maxResults
            })
          } else if (toolCall.function.name === 'get_event_summary') {
            assistantMessage = this.getEventSummary()
          }
        }

        // Generate follow-up response based on search results
        if (events.length > 0) {
          const followUpCompletion = await this.openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
              { role: 'system', content: `You are responding to a user's query about tech events. You've found ${events.length} relevant events. Create a helpful, enthusiastic response explaining what you found and why these events match their query. Keep it concise (2-3 sentences). The events will be displayed as cards below your message.` },
              { role: 'user', content: userMessage },
              { role: 'assistant', content: `I found ${events.length} events matching your query. Here are the results:` }
            ]
          })
          
          assistantMessage = followUpCompletion.choices[0].message.content || `I found ${events.length} events that match your interests!`
        } else {
          assistantMessage = "I couldn't find any events matching your specific criteria. Try searching for broader terms like 'tech events', 'AI', 'startup', or specific cities like 'Brussels' or 'Amsterdam'."
        }
      }

      return {
        message: assistantMessage,
        events
      }
    } catch (error) {
      console.error('OpenAI API error:', error)
      
      // Fallback to basic search
      const events = this.searchEvents(userMessage)
      return {
        message: events.length > 0 
          ? `I found ${events.length} events matching your search (using fallback search).`
          : "I'm having trouble connecting to the AI service, but I can still help you search for events. Try terms like 'AI', 'tech', 'startup', or city names.",
        events
      }
    }
  }
}

export default EventAgent