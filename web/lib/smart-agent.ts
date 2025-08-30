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

interface UserIntent {
  primaryRequest: string
  preferences: {
    timeframe?: string
    location?: string
    eventTypes?: string[]
    skillLevel?: string
    format?: string
    cost?: string
    company?: string
    technology?: string[]
    interests?: string[]
  }
  constraints: {
    mustHave?: string[]
    mustNotHave?: string[]
    dateRange?: { start?: string, end?: string }
    maxResults?: number
  }
  sentiment: 'enthusiastic' | 'specific' | 'exploring' | 'urgent'
}

interface EvaluatedEvent {
  event: Event
  relevanceScore: number
  reasons: string[]
  concerns: string[]
}

interface AgentResponse {
  message: string
  events: Event[]
  reasoning: string
  totalEvaluated: number
}

class SmartEventAgent {
  private openai: OpenAI
  private events: Event[] = []
  private defaultModel: string

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    })
    this.defaultModel = process.env.OPENAI_MODEL || 'gpt-4o-mini'
    this.loadEvents()
  }

  private getModel(task?: 'intent' | 'evaluation' | 'response'): string {
    // Allow different models for different tasks
    if (task === 'intent' && process.env.OPENAI_MODEL_INTENT) {
      return process.env.OPENAI_MODEL_INTENT
    }
    if (task === 'evaluation' && process.env.OPENAI_MODEL_EVALUATION) {
      return process.env.OPENAI_MODEL_EVALUATION
    }
    if (task === 'response' && process.env.OPENAI_MODEL_RESPONSE) {
      return process.env.OPENAI_MODEL_RESPONSE
    }
    
    // Fall back to default model
    return this.defaultModel
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

  private async interpretUserIntent(userMessage: string, conversationHistory: any[] = []): Promise<UserIntent> {
    const conversationContext = conversationHistory.length > 0 ?
      `Previous conversation:\n${conversationHistory.slice(-6).map((msg) => 
        `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`
      ).join('\n')}\n\n` : ''

    const systemPrompt = `You are an expert at understanding user intent for tech event searches. Analyze the user's request deeply and extract their true intent, preferences, and constraints.

${conversationContext}Current user message: "${userMessage}"

Extract and infer:
1. PRIMARY REQUEST: What they really want (not just keywords)
2. PREFERENCES: What they'd prefer but isn't mandatory
3. CONSTRAINTS: Hard requirements that must be met
4. SENTIMENT: How they're approaching the search

Examples of deep interpretation:
- "I'm new to machine learning" → skillLevel: beginner, interests: [learning, fundamentals]
- "Something this weekend" → timeframe: this_weekend, dateRange
- "Not too corporate" → mustNotHave: [corporate], format: informal
- "I work with Python" → technology: [python], interests: [python-related]
- "Free events only" → cost: free
- "Something hands-on" → format: workshop, preferences: [practical, interactive]
- "I'm between jobs" → cost: free, interests: [networking, career]
- "Quick overview" → format: short, timeframe: brief
- "Deep dive" → format: detailed, skillLevel: advanced`

    try {
      const response = await this.openai.chat.completions.create({
        model: this.getModel('intent'),
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Analyze this request: "${userMessage}"` }
        ],
        tools: [
          {
            type: 'function',
            function: {
              name: 'extract_user_intent',
              description: 'Extract detailed user intent from natural language',
              parameters: {
                type: 'object',
                properties: {
                  primaryRequest: { type: 'string' },
                  preferences: {
                    type: 'object',
                    properties: {
                      timeframe: { type: 'string' },
                      location: { type: 'string' },
                      eventTypes: { type: 'array', items: { type: 'string' } },
                      skillLevel: { type: 'string' },
                      format: { type: 'string' },
                      cost: { type: 'string' },
                      company: { type: 'string' },
                      technology: { type: 'array', items: { type: 'string' } },
                      interests: { type: 'array', items: { type: 'string' } }
                    }
                  },
                  constraints: {
                    type: 'object',
                    properties: {
                      mustHave: { type: 'array', items: { type: 'string' } },
                      mustNotHave: { type: 'array', items: { type: 'string' } },
                      dateRange: {
                        type: 'object',
                        properties: {
                          start: { type: 'string' },
                          end: { type: 'string' }
                        }
                      },
                      maxResults: { type: 'number' }
                    }
                  },
                  sentiment: {
                    type: 'string',
                    enum: ['enthusiastic', 'specific', 'exploring', 'urgent']
                  }
                },
                required: ['primaryRequest', 'preferences', 'constraints', 'sentiment']
              }
            }
          }
        ],
        tool_choice: { type: 'function', function: { name: 'extract_user_intent' } }
      })

      const toolCall = response.choices[0].message.tool_calls?.[0]
      if (toolCall && toolCall.function.arguments) {
        return JSON.parse(toolCall.function.arguments) as UserIntent
      }
    } catch (error) {
      console.error('Error interpreting user intent:', error)
    }

    // Fallback intent
    return {
      primaryRequest: userMessage,
      preferences: {},
      constraints: {},
      sentiment: 'exploring'
    }
  }

  private basicFilter(intent: UserIntent): Event[] {
    let filteredEvents = this.events

    // Apply hard constraints first
    if (intent.preferences.location) {
      filteredEvents = filteredEvents.filter(event =>
        event.location.toLowerCase().includes(intent.preferences.location!.toLowerCase())
      )
    }

    // Date filtering with intelligent interpretation
    if (intent.preferences.timeframe || intent.constraints.dateRange?.start || intent.constraints.dateRange?.end) {
      filteredEvents = filteredEvents.filter(event => {
        const eventDate = new Date(event.date)
        const now = new Date()
        
        // Handle relative timeframes
        if (intent.preferences.timeframe) {
          const timeframe = intent.preferences.timeframe.toLowerCase()
          if (timeframe.includes('weekend') || timeframe.includes('this weekend')) {
            const nextSaturday = new Date(now)
            nextSaturday.setDate(now.getDate() + (6 - now.getDay()))
            const nextSunday = new Date(nextSaturday)
            nextSunday.setDate(nextSaturday.getDate() + 1)
            return eventDate >= nextSaturday && eventDate <= nextSunday
          } else if (timeframe.includes('week') || timeframe.includes('this week')) {
            const weekEnd = new Date(now)
            weekEnd.setDate(now.getDate() + 7)
            return eventDate >= now && eventDate <= weekEnd
          } else if (timeframe.includes('month') || timeframe.includes('this month')) {
            const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0)
            return eventDate >= now && eventDate <= monthEnd
          } else if (timeframe.includes('soon') || timeframe.includes('upcoming')) {
            const twoWeeks = new Date(now)
            twoWeeks.setDate(now.getDate() + 14)
            return eventDate >= now && eventDate <= twoWeeks
          }
        }
        
        // Handle explicit date ranges
        const start = intent.constraints.dateRange?.start ? new Date(intent.constraints.dateRange.start) : new Date('2000-01-01')
        const end = intent.constraints.dateRange?.end ? new Date(intent.constraints.dateRange.end) : new Date('2030-12-31')
        return eventDate >= start && eventDate <= end
      })
    }

    // Cost filtering (if we can infer from description)
    if (intent.preferences.cost === 'free') {
      filteredEvents = filteredEvents.filter(event =>
        event.description.toLowerCase().includes('free') ||
        event.tags.toLowerCase().includes('free') ||
        event.registration_url.includes('free')
      )
    }

    // Basic keyword filtering for must-haves
    if (intent.constraints.mustHave && intent.constraints.mustHave.length > 0) {
      filteredEvents = filteredEvents.filter(event => {
        const searchableText = `${event.title} ${event.description} ${event.tags} ${event.type}`.toLowerCase()
        return intent.constraints.mustHave!.some(mustHave =>
          searchableText.includes(mustHave.toLowerCase())
        )
      })
    }

    // Filter out must-not-haves
    if (intent.constraints.mustNotHave && intent.constraints.mustNotHave.length > 0) {
      filteredEvents = filteredEvents.filter(event => {
        const searchableText = `${event.title} ${event.description} ${event.tags} ${event.type}`.toLowerCase()
        return !intent.constraints.mustNotHave!.some(mustNotHave =>
          searchableText.includes(mustNotHave.toLowerCase())
        )
      })
    }

    return filteredEvents
  }

  private async evaluateEventsBatch(events: Event[], intent: UserIntent, batchSize: number = 10): Promise<EvaluatedEvent[]> {
    const evaluatedEvents: EvaluatedEvent[] = []
    
    for (let i = 0; i < events.length; i += batchSize) {
      const batch = events.slice(i, i + batchSize)
      console.log(`🔍 Evaluating batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(events.length/batchSize)} (${batch.length} events)`)
      
      try {
        const batchEvaluation = await this.evaluateSingleBatch(batch, intent)
        evaluatedEvents.push(...batchEvaluation)
        
        // Small delay to avoid rate limits
        if (i + batchSize < events.length) {
          await new Promise(resolve => setTimeout(resolve, 500))
        }
      } catch (error) {
        console.error(`Error evaluating batch ${i}-${i+batchSize}:`, error)
        // Continue with next batch
      }
    }

    return evaluatedEvents
  }

  private async evaluateSingleBatch(events: Event[], intent: UserIntent): Promise<EvaluatedEvent[]> {
    const eventsText = events.map((event, idx) => 
      `Event ${idx + 1}:
Title: ${event.title}
Description: ${event.description.substring(0, 300)}${event.description.length > 300 ? '...' : ''}
Date: ${event.date} ${event.time || ''}
Location: ${event.location}
Type: ${event.type}
Tags: ${event.tags}`
    ).join('\n\n')

    const systemPrompt = `You are an expert event curator. Evaluate these events against the user's specific intent and preferences.

User Intent Analysis:
- Primary Request: ${intent.primaryRequest}
- Preferences: ${JSON.stringify(intent.preferences, null, 2)}
- Constraints: ${JSON.stringify(intent.constraints, null, 2)}
- Sentiment: ${intent.sentiment}

For each event, provide:
1. Relevance score (0-100): How well it matches the user's intent
2. Reasons: Why this event is relevant (be specific)
3. Concerns: Any potential issues or mismatches

Focus on deeper meaning, not just keyword matching. Consider:
- User's skill level and learning goals
- Practical vs theoretical preferences
- Networking vs learning focus
- Time constraints and availability
- Career stage and objectives
- Technical depth desired`

    try {
      const response = await this.openai.chat.completions.create({
        model: this.getModel('evaluation'),
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Evaluate these events:\n\n${eventsText}` }
        ],
        tools: [
          {
            type: 'function',
            function: {
              name: 'evaluate_events',
              description: 'Evaluate events against user intent',
              parameters: {
                type: 'object',
                properties: {
                  evaluations: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        eventIndex: { type: 'number' },
                        relevanceScore: { type: 'number', minimum: 0, maximum: 100 },
                        reasons: { type: 'array', items: { type: 'string' } },
                        concerns: { type: 'array', items: { type: 'string' } }
                      },
                      required: ['eventIndex', 'relevanceScore', 'reasons', 'concerns']
                    }
                  }
                },
                required: ['evaluations']
              }
            }
          }
        ],
        tool_choice: { type: 'function', function: { name: 'evaluate_events' } }
      })

      const toolCall = response.choices[0].message.tool_calls?.[0]
      if (toolCall && toolCall.function.arguments) {
        const result = JSON.parse(toolCall.function.arguments)
        return result.evaluations.map((evaluation: any) => ({
          event: events[evaluation.eventIndex],
          relevanceScore: evaluation.relevanceScore,
          reasons: evaluation.reasons,
          concerns: evaluation.concerns
        }))
      }
    } catch (error) {
      console.error('Error in batch evaluation:', error)
    }

    // Fallback: return all events with medium scores
    return events.map(event => ({
      event,
      relevanceScore: 50,
      reasons: ['Basic match'],
      concerns: []
    }))
  }

  async processQuery(userMessage: string, conversationHistory: any[] = []): Promise<AgentResponse> {
    console.log(`🧠 Smart Agent analyzing: "${userMessage}"`)

    // Step 1: Deep intent interpretation
    const intent = await this.interpretUserIntent(userMessage, conversationHistory)
    console.log(`🎯 Interpreted intent:`, intent)

    // Step 2: Basic filtering based on hard constraints
    const basicFiltered = this.basicFilter(intent)
    console.log(`📊 After basic filtering: ${basicFiltered.length} events`)

    // Step 3: LLM evaluation in batches
    const evaluatedEvents = await this.evaluateEventsBatch(basicFiltered, intent, 10)
    console.log(`✅ Evaluated ${evaluatedEvents.length} events`)

    // Step 4: Sort by relevance and take top results
    const sortedEvents = evaluatedEvents
      .filter(e => e.relevanceScore >= 30) // Only keep reasonably relevant events
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .slice(0, 5)

    console.log(`🏆 Final results: ${sortedEvents.length} events`)

    // Step 5: Generate intelligent response
    const finalResponse = await this.generateSmartResponse(
      userMessage, 
      intent, 
      sortedEvents, 
      evaluatedEvents.length,
      conversationHistory
    )

    return {
      message: finalResponse,
      events: sortedEvents.map(e => e.event),
      reasoning: `Analyzed ${evaluatedEvents.length} events, found ${sortedEvents.length} highly relevant matches`,
      totalEvaluated: evaluatedEvents.length
    }
  }

  private async generateSmartResponse(
    userMessage: string, 
    intent: UserIntent, 
    evaluatedEvents: EvaluatedEvent[], 
    totalEvaluated: number,
    conversationHistory: any[]
  ): Promise<string> {
    const conversationContext = conversationHistory.length > 0 ?
      `Previous conversation:\n${conversationHistory.slice(-4).map((msg) => 
        `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`
      ).join('\n')}\n\n` : ''

    const eventSummaries = evaluatedEvents
      .filter(e => e && e.event && e.event.title) // Safety check
      .map((e, i) => 
        `${i + 1}. ${e.event.title} (Score: ${e.relevanceScore})\n   Why: ${e.reasons.join(', ')}`
      ).join('\n')

    const systemPrompt = `You are a knowledgeable AI assistant that deeply understands user intent and has intelligently analyzed events.

${conversationContext}User's original request: "${userMessage}"

Interpreted intent:
- Primary need: ${intent.primaryRequest}
- Key preferences: ${JSON.stringify(intent.preferences)}
- User sentiment: ${intent.sentiment}

Analysis results:
- Total events evaluated: ${totalEvaluated}
- Top matches found: ${evaluatedEvents.length}

Selected events:
${eventSummaries}

Generate a natural, conversational response that:
1. Shows you understood their deeper intent (not just keywords)
2. Explains why these specific events match what they're looking for
3. Addresses their skill level, interests, and constraints
4. Builds on the conversation context
5. Is enthusiastic but honest about the matches`

    try {
      const response = await this.openai.chat.completions.create({
        model: this.getModel('response'),
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Generate response for: "${userMessage}"` }
        ]
      })

      return response.choices[0].message.content || 
        `I analyzed ${totalEvaluated} events and found ${evaluatedEvents.length} that really match what you're looking for!`
    } catch (error) {
      console.error('Error generating smart response:', error)
      return `I analyzed ${totalEvaluated} events and found ${evaluatedEvents.length} that match your interests!`
    }
  }
}

export default SmartEventAgent