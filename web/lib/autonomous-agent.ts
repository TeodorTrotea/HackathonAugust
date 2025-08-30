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

interface QueryAnalysis {
  requiresSearch: boolean
  queryType: 'search' | 'question' | 'conversation' | 'recommendation' | 'filter'
  searchStrategy: 'precise' | 'broad' | 'none'
  reasoning: string
  searchParams?: {
    keywords?: string[]
    location?: string
    eventType?: string
    tags?: string[]
    fuzzySearch?: boolean
    maxResults?: number
  }
}

interface AgentResponse {
  message: string
  events: Event[]
  searchPerformed: boolean
  reasoning: string
}

class AutonomousEventAgent {
  private openai: OpenAI
  private events: Event[] = []
  private conversationMemory: { role: string; content: string }[] = []

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

  private async analyzeQuery(userMessage: string, conversationHistory: { role: string; content: string }[] = []): Promise<QueryAnalysis> {
    const recentContext = conversationHistory.slice(-6).map(msg => 
      `${msg.role}: ${msg.content}`
    ).join('\n')

    const systemPrompt = `You are an intelligent agent that decides whether to search for events or respond directly to user queries. 

Analyze the user's message and conversation context to determine the best response strategy.

QUERY TYPES:
- 'search': User wants to find specific events (e.g., "show me AI events", "find startup meetups")
- 'question': User asks about events in general (e.g., "what types of events do you have?", "how do I register?")
- 'conversation': General chat or follow-up (e.g., "thanks", "tell me more", "that sounds interesting")
- 'recommendation': User wants personalized suggestions (e.g., "what should I attend?", "recommend something")
- 'filter': User wants to refine previous results (e.g., "only free ones", "just in Brussels")

SEARCH STRATEGIES:
- 'precise': When user has specific requirements - use exact matching
- 'broad': When user is exploring or needs diverse options - use fuzzy matching
- 'none': When no search is needed - provide direct response

DECISION RULES:
1. ALWAYS search if user explicitly asks for events, meetups, conferences, etc.
2. DON'T search for general questions about the service or how things work
3. DON'T search for conversational responses like "thanks", "hello", "that's interesting"
4. CONSIDER conversation context - if they just got results, they might want to refine or ask follow-ups
5. RECOMMEND if user seems unsure what they want
6. FILTER if they're refining previous search results

Recent conversation:
${recentContext}

Current message: "${userMessage}"

Analyze whether this query requires searching through events or can be answered directly.`

    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Analyze this query: "${userMessage}"` }
        ],
        tools: [
          {
            type: 'function',
            function: {
              name: 'analyze_query',
              description: 'Analyze user query to determine response strategy',
              parameters: {
                type: 'object',
                properties: {
                  requiresSearch: { type: 'boolean' },
                  queryType: {
                    type: 'string',
                    enum: ['search', 'question', 'conversation', 'recommendation', 'filter']
                  },
                  searchStrategy: {
                    type: 'string',
                    enum: ['precise', 'broad', 'none']
                  },
                  reasoning: { type: 'string' },
                  searchParams: {
                    type: 'object',
                    properties: {
                      keywords: { type: 'array', items: { type: 'string' } },
                      location: { type: 'string' },
                      eventType: { type: 'string' },
                      tags: { type: 'array', items: { type: 'string' } },
                      fuzzySearch: { type: 'boolean' },
                      maxResults: { type: 'number' }
                    }
                  }
                },
                required: ['requiresSearch', 'queryType', 'searchStrategy', 'reasoning']
              }
            }
          }
        ],
        tool_choice: { type: 'function', function: { name: 'analyze_query' } }
      })

      const toolCall = response.choices[0].message.tool_calls?.[0]
      if (toolCall && toolCall.function.arguments) {
        return JSON.parse(toolCall.function.arguments) as QueryAnalysis
      }
    } catch (error) {
      console.error('Error analyzing query:', error)
    }

    // Fallback analysis
    const lowerMessage = userMessage.toLowerCase()
    const searchKeywords = ['find', 'show', 'search', 'events', 'meetups', 'conferences', 'workshops', 'ai', 'tech', 'startup']
    const requiresSearch = searchKeywords.some(keyword => lowerMessage.includes(keyword))

    return {
      requiresSearch,
      queryType: requiresSearch ? 'search' : 'question',
      searchStrategy: requiresSearch ? 'broad' : 'none',
      reasoning: 'Fallback analysis based on keyword detection',
      searchParams: requiresSearch ? { keywords: userMessage.split(' '), fuzzySearch: true } : undefined
    }
  }

  private searchEvents(params: {
    keywords?: string[]
    location?: string
    eventType?: string
    tags?: string[]
    fuzzySearch?: boolean
    maxResults?: number
  }): Event[] {
    let filteredEvents = this.events
    const maxResults = params.maxResults || 8

    // Apply filters based on parameters
    if (params.keywords && params.keywords.length > 0) {
      filteredEvents = filteredEvents.filter(event => {
        const searchableText = `${event.title} ${event.description} ${event.location} ${event.type} ${event.tags}`.toLowerCase()
        
        if (params.fuzzySearch) {
          return params.keywords!.some(keyword => 
            keyword.length > 2 && searchableText.includes(keyword.toLowerCase())
          )
        } else {
          return params.keywords!.every(keyword => 
            keyword.length > 2 && searchableText.includes(keyword.toLowerCase())
          )
        }
      })
    }

    if (params.location) {
      filteredEvents = filteredEvents.filter(event =>
        event.location.toLowerCase().includes(params.location!.toLowerCase())
      )
    }

    if (params.eventType) {
      filteredEvents = filteredEvents.filter(event =>
        event.type.toLowerCase().includes(params.eventType!.toLowerCase()) ||
        event.tags.toLowerCase().includes(params.eventType!.toLowerCase())
      )
    }

    if (params.tags && params.tags.length > 0) {
      filteredEvents = filteredEvents.filter(event =>
        params.tags!.some(tag => event.tags.toLowerCase().includes(tag.toLowerCase()))
      )
    }

    // Sort by relevance and upcoming dates
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

  private async generateResponse(
    userMessage: string, 
    analysis: QueryAnalysis, 
    events: Event[], 
    conversationHistory: { role: string; content: string }[]
  ): Promise<string> {
    const recentContext = conversationHistory.slice(-4).map(msg => 
      `${msg.role}: ${msg.content}`
    ).join('\n')

    let systemPrompt = ''

    if (analysis.requiresSearch && events.length > 0) {
      systemPrompt = `You are a helpful AI assistant that just performed an intelligent search for tech events.

Recent conversation:
${recentContext}

User query: "${userMessage}"
Analysis: ${analysis.reasoning}
Search performed: Found ${events.length} events

Generate a natural, conversational response that:
1. Acknowledges what the user was looking for
2. Explains why these events match their interest
3. Is enthusiastic but not overly promotional
4. Builds naturally on the conversation
5. Keep it concise (2-3 sentences max)`

    } else if (analysis.requiresSearch && events.length === 0) {
      systemPrompt = `You are a helpful AI assistant that searched for events but found no results.

User query: "${userMessage}"
Analysis: ${analysis.reasoning}

Generate a helpful response that:
1. Acknowledges their search request
2. Suggests alternative search terms or broader criteria
3. Offers to help in other ways
4. Mentions popular event categories or locations available`

    } else {
      systemPrompt = `You are a helpful AI assistant specializing in tech events in Belgium and Netherlands.

Recent conversation:
${recentContext}

User query: "${userMessage}"
Analysis: ${analysis.reasoning} (No search performed)

Respond conversationally without searching for events. You can:
1. Answer general questions about events
2. Provide information about event types and locations
3. Have natural conversations
4. Ask follow-up questions to help later
5. Explain how you can help find events when they're ready

Be helpful, knowledgeable, and natural. Don't force event searches if they're not needed.`
    }

    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMessage }
        ]
      })

      return response.choices[0].message.content || 'I\'m here to help you find tech events!'
    } catch (error) {
      console.error('Error generating response:', error)
      
      if (analysis.requiresSearch && events.length > 0) {
        return `I found ${events.length} events that match what you're looking for!`
      } else if (analysis.requiresSearch && events.length === 0) {
        return "I couldn't find events matching those specific criteria. Try broader terms like 'tech', 'AI', or specific cities like 'Brussels' or 'Amsterdam'."
      } else {
        return "I'm here to help you discover tech events in Belgium and Netherlands. What would you like to know?"
      }
    }
  }

  async processQuery(userMessage: string): Promise<AgentResponse> {
    console.log(`🤖 Autonomous Agent analyzing: "${userMessage}"`)

    // Add user message to conversation memory
    this.conversationMemory.push({ role: 'user', content: userMessage })

    // Step 1: Analyze the query to decide if search is needed
    const analysis = await this.analyzeQuery(userMessage, this.conversationMemory)
    console.log(`🧠 Query analysis:`, {
      requiresSearch: analysis.requiresSearch,
      queryType: analysis.queryType,
      searchStrategy: analysis.searchStrategy,
      reasoning: analysis.reasoning
    })

    let events: Event[] = []
    let searchPerformed = false

    // Step 2: Perform search only if analysis determines it's needed
    if (analysis.requiresSearch && analysis.searchParams) {
      console.log(`🔍 Performing search with strategy: ${analysis.searchStrategy}`)
      events = this.searchEvents(analysis.searchParams)
      searchPerformed = true
      console.log(`📊 Found ${events.length} events`)
    } else {
      console.log(`💬 No search needed - responding directly`)
    }

    // Step 3: Generate appropriate response
    const message = await this.generateResponse(userMessage, analysis, events, this.conversationMemory)

    // Add assistant response to conversation memory
    this.conversationMemory.push({ role: 'assistant', content: message })

    // Keep conversation memory limited
    if (this.conversationMemory.length > 10) {
      this.conversationMemory = this.conversationMemory.slice(-8)
    }

    return {
      message,
      events,
      searchPerformed,
      reasoning: analysis.reasoning
    }
  }

  // Method to get conversation context for external use
  getConversationHistory(): { role: string; content: string }[] {
    return [...this.conversationMemory]
  }

  // Method to clear conversation memory
  clearMemory(): void {
    this.conversationMemory = []
  }
}

export default AutonomousEventAgent