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

interface SearchAttempt {
  query: string
  filters: any
  results: Event[]
  reasoning: string
}

interface AgentResponse {
  message: string
  events: Event[]
  searchHistory: SearchAttempt[]
}

class IntelligentEventAgent {
  private openai: OpenAI
  private events: Event[] = []
  private searchHistory: SearchAttempt[] = []

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

  private searchEvents(searchParams: {
    keywords?: string[]
    location?: string
    eventType?: string
    tags?: string[]
    dateRange?: string
    fuzzySearch?: boolean
  }): Event[] {
    let filteredEvents = this.events

    // Filter by keywords with fuzzy matching
    if (searchParams.keywords && searchParams.keywords.length > 0) {
      filteredEvents = filteredEvents.filter(event => {
        const searchableText = `${event.title} ${event.description} ${event.tags} ${event.type}`.toLowerCase()
        
        if (searchParams.fuzzySearch) {
          // Fuzzy matching - at least one keyword matches
          return searchParams.keywords!.some(keyword => 
            searchableText.includes(keyword.toLowerCase()) ||
            this.fuzzyMatch(searchableText, keyword.toLowerCase())
          )
        } else {
          // Exact matching - all keywords must match
          return searchParams.keywords!.every(keyword => 
            searchableText.includes(keyword.toLowerCase())
          )
        }
      })
    }

    // Filter by location
    if (searchParams.location) {
      filteredEvents = filteredEvents.filter(event =>
        event.location.toLowerCase().includes(searchParams.location!.toLowerCase())
      )
    }

    // Filter by event type
    if (searchParams.eventType) {
      filteredEvents = filteredEvents.filter(event =>
        event.type.toLowerCase().includes(searchParams.eventType!.toLowerCase()) ||
        event.tags.toLowerCase().includes(searchParams.eventType!.toLowerCase())
      )
    }

    // Filter by tags
    if (searchParams.tags && searchParams.tags.length > 0) {
      filteredEvents = filteredEvents.filter(event =>
        searchParams.tags!.some(tag => 
          event.tags.toLowerCase().includes(tag.toLowerCase())
        )
      )
    }

    // Sort by relevance and date
    filteredEvents.sort((a, b) => {
      const aDate = new Date(a.date)
      const bDate = new Date(b.date)
      const now = new Date()
      
      const aUpcoming = aDate > now ? 1 : 0
      const bUpcoming = bDate > now ? 1 : 0
      
      if (aUpcoming !== bUpcoming) return bUpcoming - aUpcoming
      return aDate.getTime() - bDate.getTime()
    })

    return filteredEvents.slice(0, 20) // Return more results for agent to consider
  }

  private fuzzyMatch(text: string, pattern: string): boolean {
    // Simple fuzzy matching for similar words
    const distance = this.levenshteinDistance(text, pattern)
    return distance <= Math.max(1, Math.floor(pattern.length * 0.3))
  }

  private levenshteinDistance(str1: string, str2: string): number {
    const matrix = []
    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i]
    }
    for (let j = 0; j <= str1.length; j++) {
      matrix[0][j] = j
    }
    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1]
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          )
        }
      }
    }
    return matrix[str2.length][str1.length]
  }

  private async planSearch(userQuery: string, previousAttempts: SearchAttempt[] = [], conversationHistory: any[] = []): Promise<{
    searchParams: any
    reasoning: string
    shouldContinue: boolean
  }> {
    const attemptHistory = previousAttempts.length > 0 ? 
      `Previous search attempts:\n${previousAttempts.map((attempt, i) => 
        `${i + 1}. Query: "${attempt.query}" -> Found ${attempt.results.length} results\n   Reasoning: ${attempt.reasoning}`
      ).join('\n')}\n\n` : ''

    const conversationContext = conversationHistory.length > 0 ?
      `Conversation history:\n${conversationHistory.slice(-6).map((msg, i) => 
        `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`
      ).join('\n')}\n\n` : ''

    const systemPrompt = `You are an intelligent search planner for tech events in Belgium and Netherlands. Based on the user's current query, conversation history, and previous search attempts, plan the next search strategy.

IMPORTANT: Consider the conversation context to understand:
- What the user has previously asked about
- Their interests and preferences shown in the conversation
- Follow-up questions or refinements they're making
- References to previous events or topics discussed

Available search parameters:
- keywords: Array of search terms to look for in title, description, tags
- location: City/region filter (Brussels, Amsterdam, Ghent, Antwerp, etc.)
- eventType: Event category (AI, tech, startup, networking, workshop, conference, etc.)
- tags: Specific tags to match
- fuzzySearch: true for broader matching, false for exact matching

Strategy guidelines:
1. Start broad, then narrow down if too many results
2. If no results, try broader terms or fuzzy search
3. Extract key concepts from user query
4. Consider synonyms and related terms
5. Try different combinations of filters
6. Be persistent - you have up to 20 attempts to find the best results
7. Only stop when you find 1-5 perfect results or exhaust search strategies
8. Consider related terms, synonyms, and broader categories

${conversationContext}${attemptHistory}Current user query: "${userQuery}"

Plan the next search parameters and explain your reasoning. If you think we have enough information or have tried enough approaches, set shouldContinue to false.`

    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Plan search strategy for: "${userQuery}"` }
        ],
        tools: [
          {
            type: 'function',
            function: {
              name: 'plan_search',
              description: 'Plan the next search strategy',
              parameters: {
                type: 'object',
                properties: {
                  searchParams: {
                    type: 'object',
                    properties: {
                      keywords: { type: 'array', items: { type: 'string' } },
                      location: { type: 'string' },
                      eventType: { type: 'string' },
                      tags: { type: 'array', items: { type: 'string' } },
                      fuzzySearch: { type: 'boolean' }
                    }
                  },
                  reasoning: { type: 'string' },
                  shouldContinue: { type: 'boolean' }
                },
                required: ['searchParams', 'reasoning', 'shouldContinue']
              }
            }
          }
        ],
        tool_choice: { type: 'function', function: { name: 'plan_search' } }
      })

      const toolCall = response.choices[0].message.tool_calls?.[0]
      if (toolCall && toolCall.function.arguments) {
        const result = JSON.parse(toolCall.function.arguments)
        return result
      }
    } catch (error) {
      console.error('Error planning search:', error)
    }

    // Fallback search strategy
    const keywords = userQuery.toLowerCase().split(' ').filter(word => word.length > 2)
    return {
      searchParams: { keywords, fuzzySearch: true },
      reasoning: 'Using fallback search strategy with extracted keywords',
      shouldContinue: false
    }
  }

  async processQuery(userMessage: string, conversationHistory: any[] = []): Promise<AgentResponse> {
    this.searchHistory = []
    let finalEvents: Event[] = []
    let attempts = 0
    const maxAttempts = 20 // Allow up to 20 search iterations
    const maxDisplayResults = 5 // Maximum number of event cards to display

    console.log(`🤖 Agent starting search for: "${userMessage}"`)

    while (attempts < maxAttempts) {
      attempts++
      console.log(`🔍 Search attempt ${attempts}/${maxAttempts}`)

      // Plan the next search with conversation context
      const plan = await this.planSearch(userMessage, this.searchHistory, conversationHistory)
      console.log(`📝 Search plan: ${plan.reasoning}`)

      // Execute search
      const searchResults = this.searchEvents(plan.searchParams)
      
      // Record this attempt
      const attempt: SearchAttempt = {
        query: JSON.stringify(plan.searchParams),
        filters: plan.searchParams,
        results: searchResults,
        reasoning: plan.reasoning
      }
      this.searchHistory.push(attempt)

      console.log(`📊 Found ${searchResults.length} results`)

      // Check if we found good results or should stop
      if (searchResults.length > 0 && searchResults.length <= maxDisplayResults) {
        // Perfect number of results
        finalEvents = searchResults
        console.log(`✅ Found optimal ${searchResults.length} results, stopping search`)
        break
      } else if (searchResults.length > maxDisplayResults) {
        // Too many results, take the best ones and continue to see if we can narrow down
        finalEvents = searchResults.slice(0, maxDisplayResults)
        console.log(`📊 Too many results (${searchResults.length}), taking top ${maxDisplayResults}${plan.shouldContinue ? ', continuing to refine...' : ''}`)
        if (!plan.shouldContinue) break
      } else if (searchResults.length === 0) {
        // No results, try broader search
        console.log(`❌ No results found${plan.shouldContinue ? ', trying broader search...' : ', stopping'}`)
        if (!plan.shouldContinue) break
      } else {
        // Some results but not in optimal range
        finalEvents = searchResults
        if (!plan.shouldContinue) {
          console.log(`✋ Agent decided to stop search with ${searchResults.length} results`)
          break
        }
      }
    }

    // Generate final response with conversation context
    const finalResponse = await this.generateFinalResponse(userMessage, finalEvents, this.searchHistory, conversationHistory)
    console.log(`✅ Final response generated with ${finalEvents.length} events`)

    return {
      message: finalResponse,
      events: finalEvents,
      searchHistory: this.searchHistory
    }
  }

  private async generateFinalResponse(userQuery: string, events: Event[], searchHistory: SearchAttempt[], conversationHistory: any[] = []): Promise<string> {
    const searchSummary = searchHistory.map((attempt, i) => 
      `Attempt ${i + 1}: ${attempt.reasoning} -> ${attempt.results.length} results`
    ).join('\n')

    const conversationContext = conversationHistory.length > 0 ?
      `Previous conversation:\n${conversationHistory.slice(-4).map((msg) => 
        `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`
      ).join('\n')}\n\n` : ''

    const systemPrompt = `You are a helpful AI assistant that has just completed an intelligent search for tech events. Generate a natural, conversational response explaining what you found.

IMPORTANT: Consider the conversation context to:
- Reference previous questions or interests the user mentioned
- Build on the conversation naturally
- Use "also", "additionally", "as a follow-up" when appropriate
- Acknowledge if this is a refinement of a previous search

${conversationContext}Search process:
${searchSummary}

Guidelines:
- Be conversational and enthusiastic
- Explain briefly what you searched for
- If you found events, highlight what makes them relevant
- If no events, suggest alternative search terms
- Keep response concise (2-3 sentences max)
- Don't mention the technical search process details`

    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Generate response for query: "${userQuery}" with ${events.length} events found` }
        ]
      })

      return response.choices[0].message.content || `I found ${events.length} events that match your interests!`
    } catch (error) {
      console.error('Error generating final response:', error)
      if (events.length > 0) {
        return `I found ${events.length} great events for you! These match what you're looking for.`
      } else {
        return "I searched thoroughly but couldn't find events matching your specific criteria. Try broader terms like 'tech', 'AI', 'startup', or specific cities."
      }
    }
  }
}

export default IntelligentEventAgent