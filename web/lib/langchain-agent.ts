import { ChatOpenAI, OpenAIEmbeddings } from '@langchain/openai'
import { MemoryVectorStore } from 'langchain/vectorstores/memory'
import { Document } from 'langchain/document'
import { RunnableSequence, RunnableLambda } from '@langchain/core/runnables'
import { StringOutputParser } from '@langchain/core/output_parsers'
import { PromptTemplate } from '@langchain/core/prompts'
import { Tool } from '@langchain/core/tools'
import { AgentExecutor } from 'langchain/agents'
import { createOpenAIToolsAgent } from 'langchain/agents'
import { HumanMessage, AIMessage, SystemMessage } from '@langchain/core/messages'
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

interface LangChainResult {
  message: string
  events: Event[]
  relevanceScores: number[]
  searchQuery: string
  processingSteps: string[]
  vectorSimilarityScores: { [key: string]: number }
}

class LangChainEventAgent {
  private llm: ChatOpenAI
  private embeddings: OpenAIEmbeddings
  private vectorStore: MemoryVectorStore | null = null
  private events: Event[] = []
  private agent: AgentExecutor | null = null
  private isInitialized = false

  constructor() {
    this.llm = new ChatOpenAI({
      modelName: process.env.OPENAI_MODEL || 'gpt-4o-mini',
      temperature: 0.3,
      openAIApiKey: process.env.OPENAI_API_KEY,
    })

    this.embeddings = new OpenAIEmbeddings({
      openAIApiKey: process.env.OPENAI_API_KEY,
      modelName: 'text-embedding-3-small'
    })

    this.initialize()
  }

  private async initialize() {
    if (this.isInitialized) return

    console.log('🚀 Initializing LangChain Event Agent...')
    
    // Load events from CSV
    await this.loadEvents()
    
    // Create vector store with embeddings
    await this.createVectorStore()
    
    // Set up agent with tools
    await this.setupAgent()
    
    this.isInitialized = true
    console.log('✅ LangChain Agent initialized successfully')
  }

  private async loadEvents() {
    try {
      const csvPath = path.join(process.cwd(), '../data/events_export.csv')
      const csvContent = fs.readFileSync(csvPath, 'utf-8')
      
      const lines = csvContent.trim().split('\n')
      const headers = lines[0].split(',')
      
      // More robust CSV parsing
      this.events = []
      
      for (let lineIndex = 1; lineIndex < lines.length; lineIndex++) {
        try {
          const line = lines[lineIndex]
          if (!line || line.trim() === '') continue
          
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
          
          // Map values to headers
          const event: any = {}
          headers.forEach((header, index) => {
            const value = values[index] || ''
            // Clean header names
            const cleanHeader = header.trim().toLowerCase().replace(/\s+/g, '_')
            event[cleanHeader] = value
          })
          
          // Extract real event dates from title/description instead of placeholder date
          let eventDate = event.date || ''
          let eventTime = event.time || null
          
          // Try to extract real dates from event title or description
          const titleAndDesc = `${event.title || ''} ${event.description || ''}`.toLowerCase()
          
          // Look for date patterns in title/description
          const datePatterns = [
            // European format: 17.10, 25.12, etc.
            /(\d{1,2})\.(\d{1,2})(?:\.(\d{2,4}))?/g,
            // Format like "September 15", "Oct 22", etc.
            /(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\s+(\d{1,2})/gi,
            // Format like "15 September", "22 Oct", etc.
            /(\d{1,2})\s+(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*/gi,
            // ISO-like format in description: 2025-09-15
            /(\d{4})-(\d{1,2})-(\d{1,2})/g
          ]
          
          for (const pattern of datePatterns) {
            const matches = [...titleAndDesc.matchAll(pattern)]
            if (matches.length > 0) {
              const match = matches[0]
              
              if (pattern.source.includes('\\.')) {
                // European format: 17.10
                const day = parseInt(match[1])
                const month = parseInt(match[2])
                let year = match[3] ? parseInt(match[3]) : 2025
                
                if (year < 100) year += 2000 // Convert 25 to 2025
                if (day <= 31 && month <= 12) {
                  eventDate = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`
                  break
                }
              } else if (pattern.source.includes('jan|feb')) {
                // Month name format
                const monthNames = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec']
                let month, day
                
                if (match[1] && isNaN(parseInt(match[1]))) {
                  // "September 15" format
                  month = monthNames.findIndex(m => match[1].toLowerCase().startsWith(m)) + 1
                  day = parseInt(match[2])
                } else {
                  // "15 September" format
                  day = parseInt(match[1])
                  month = monthNames.findIndex(m => match[2].toLowerCase().startsWith(m)) + 1
                }
                
                if (month > 0 && day <= 31) {
                  eventDate = `2025-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`
                  break
                }
              } else if (pattern.source.includes('(\\d{4})')) {
                // ISO format: 2025-09-15
                eventDate = `${match[1]}-${match[2].padStart(2, '0')}-${match[3].padStart(2, '0')}`
                break
              }
            }
          }
          
          // Look for time patterns in title/description
          const timePatterns = [
            // Format like "20:30", "14:00", "9:30"
            /(\d{1,2}):(\d{2})/g,
            // Format like "8pm", "10 PM", "2:30pm"
            /(\d{1,2})(?::(\d{2}))?\s*(am|pm)/gi
          ]
          
          for (const pattern of timePatterns) {
            const matches = [...titleAndDesc.matchAll(pattern)]
            if (matches.length > 0) {
              const match = matches[0]
              
              if (match[3]) {
                // AM/PM format
                let hours = parseInt(match[1])
                const minutes = match[2] ? parseInt(match[2]) : 0
                const ampm = match[3].toLowerCase()
                
                if (ampm === 'pm' && hours !== 12) hours += 12
                if (ampm === 'am' && hours === 12) hours = 0
                
                eventTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
                break
              } else {
                // 24-hour format
                eventTime = `${match[1].padStart(2, '0')}:${match[2]}`
                break
              }
            }
          }
          
          // If no date found, fall back to spreading future dates
          if (!eventDate || eventDate === '2025-08-30') {
            const baseDate = new Date('2025-09-01')
            const daysToAdd = Math.floor(lineIndex / 3) + Math.floor(Math.random() * 90) // Spread over ~3 months
            baseDate.setDate(baseDate.getDate() + daysToAdd)
            eventDate = baseDate.toISOString().split('T')[0]
          }
          
          const normalizedEvent: Event = {
            id: event.id || `generated-${lineIndex}`,
            title: event.title || 'Untitled Event',
            description: event.description || '',
            date: eventDate,
            time: eventTime,
            location: event.location || '',
            type: event.type || 'Event',
            image_url: event.image_url || '',
            registration_url: event.registration_url || '',
            tags: event.tags || '',
            status: event.status || 'published'
          }
          
          // Validate the event has minimum required fields
          if (normalizedEvent.title && normalizedEvent.title !== 'Untitled Event') {
            // Additional validation - skip if title looks like raw data
            if (!normalizedEvent.title.includes(',') || normalizedEvent.title.length < 100) {
              this.events.push(normalizedEvent)
            } else {
              console.warn(`Skipping event with malformed title at line ${lineIndex + 1}`)
            }
          }
        } catch (error) {
          console.warn(`Error parsing CSV line ${lineIndex + 1}:`, error)
        }
      }

      console.log(`📚 Loaded ${this.events.length} events for LangChain processing`)
    } catch (error) {
      console.error('Error loading events:', error)
      this.events = []
    }
  }

  private async createVectorStore() {
    if (this.events.length === 0) return

    console.log('🔗 Creating vector embeddings for events...')

    // Create documents for vector store, filtering out malformed events
    const documents = this.events
      .filter(event => {
        // Additional validation before creating embeddings
        if (!event.title || event.title.length > 200) return false
        if (!event.id) return false
        // Check if description looks like raw CSV data
        if (event.description && event.description.includes(',2025-') && event.description.includes('+00')) {
          console.warn(`Skipping malformed event in vector store: ${event.title}`)
          return false
        }
        return true
      })
      .map(event => {
        // Clean up the content for better embeddings
        const cleanDescription = event.description && event.description.length < 1000 
          ? event.description 
          : event.description?.substring(0, 500) + '...'
          
        const content = `
Title: ${event.title}
Description: ${cleanDescription || 'No description available'}
Type: ${event.type || 'Event'}
Location: ${event.location || 'TBD'}
Date: ${event.date || 'TBD'}
Tags: ${event.tags || ''}
        `.trim()

        return new Document({
          pageContent: content,
          metadata: {
            eventId: String(event.id || ''),
            title: String(event.title || '').substring(0, 100),
            type: String(event.type || 'Event'),
            location: String(event.location || 'TBD'),
            date: String(event.date || ''),
            tags: String(event.tags || '')
          }
        })
      })

    // Create vector store from documents
    this.vectorStore = await MemoryVectorStore.fromDocuments(
      documents,
      this.embeddings
    )

    console.log(`🎯 Vector store created with ${documents.length} event embeddings`)
  }

  private async setupAgent() {
    if (!this.vectorStore) return

    // Create semantic search tool
    const semanticSearchTool = new Tool({
      name: 'semantic_event_search',
      description: `
        Performs semantic search through tech events database using vector similarity.
        Input should be a natural language description of what the user is looking for.
        Returns the most relevant events with similarity scores.
        Use this tool when the user wants to find events related to specific topics, technologies, or interests.
        IMPORTANT: This tool respects location filters - if a user specifies a city/location, only return events from that location.
      `,
      func: async (query: string) => {
        if (!this.vectorStore) return 'Vector store not initialized'

        try {
          // Extract filters from query
          const queryLower = query.toLowerCase()
          
          // Location filtering
          const locationKeywords = ['ghent', 'gent', 'brussels', 'bruxelles', 'antwerp', 'antwerpen', 'leuven', 'hasselt', 'mechelen', 'aalst', 'bruges', 'brugge', 'liege', 'luik', 'namur', 'namen', 'charleroi', 'mons', 'bergen', 'ostend', 'oostende']
          const mentionedLocation = locationKeywords.find(loc => queryLower.includes(loc))
          
          // Time/Date filtering
          const timeKeywords = {
            'today': 0,
            'this week': 7,
            'next week': 14,
            'this month': 30,
            'next month': 60,
            'this weekend': 7,
            'tomorrow': 1,
            'upcoming': 30
          }
          
          let dayFilter = null
          for (const [timePhrase, days] of Object.entries(timeKeywords)) {
            if (queryLower.includes(timePhrase)) {
              dayFilter = days
              break
            }
          }
          
          // Month filtering
          const months = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december']
          const mentionedMonth = months.find(month => queryLower.includes(month))
          
          // Perform similarity search with more results initially
          const results = await this.vectorStore.similaritySearchWithScore(query, 50)
          
          let filteredResults = results

          // Apply location filtering
          if (mentionedLocation) {
            filteredResults = filteredResults.filter(([doc]) => {
              const docLocation = (doc.metadata.location || '').toLowerCase()
              const locationMappings: { [key: string]: string[] } = {
                'ghent': ['ghent', 'gent'],
                'gent': ['ghent', 'gent'],
                'brussels': ['brussels', 'bruxelles'],
                'bruxelles': ['brussels', 'bruxelles'],
                'antwerp': ['antwerp', 'antwerpen'],
                'antwerpen': ['antwerp', 'antwerpen'],
                'bruges': ['bruges', 'brugge'],
                'brugge': ['bruges', 'brugge'],
                'liege': ['liege', 'luik'],
                'luik': ['liege', 'luik'],
                'ostend': ['ostend', 'oostende'],
                'oostende': ['ostend', 'oostende']
              }
              
              const acceptableLocations = locationMappings[mentionedLocation] || [mentionedLocation]
              return acceptableLocations.some(loc => docLocation.includes(loc))
            })
          }
          
          // Apply time/date filtering
          if (dayFilter !== null || mentionedMonth) {
            const currentDate = new Date()
            filteredResults = filteredResults.filter(([doc]) => {
              const eventDate = doc.metadata.date
              if (!eventDate) return false
              
              try {
                const eventDateObj = new Date(eventDate)
                
                // Month filtering
                if (mentionedMonth) {
                  const eventMonth = eventDateObj.getMonth()
                  const targetMonth = months.indexOf(mentionedMonth)
                  if (eventMonth !== targetMonth) return false
                }
                
                // Day range filtering
                if (dayFilter !== null) {
                  const timeDiff = eventDateObj.getTime() - currentDate.getTime()
                  const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24))
                  
                  if (dayFilter === 0) { // today
                    return daysDiff === 0
                  } else if (dayFilter === 1) { // tomorrow
                    return daysDiff === 1
                  } else { // within range
                    return daysDiff >= 0 && daysDiff <= dayFilter
                  }
                }
                
                return true
              } catch (e) {
                return false
              }
            })
          }
          
          // Limit final results
          filteredResults = filteredResults.slice(0, 15)
          
          const searchResults = filteredResults.map(([doc, score], index) => ({
            rank: index + 1,
            eventId: doc.metadata.eventId,
            title: doc.metadata.title,
            type: doc.metadata.type,
            location: doc.metadata.location,
            date: doc.metadata.date,
            similarity: Math.round(score * 100) / 100,
            preview: doc.pageContent.substring(0, 200) + '...'
          }))

          let filterMessages = []
          if (mentionedLocation) {
            filterMessages.push(`location: ${mentionedLocation}`)
          }
          if (dayFilter !== null) {
            const filterName = Object.keys(timeKeywords).find(key => timeKeywords[key] === dayFilter)
            filterMessages.push(`time: ${filterName}`)
          }
          if (mentionedMonth) {
            filterMessages.push(`month: ${mentionedMonth}`)
          }
          
          const responseMessage = filterMessages.length > 0
            ? `Filtered results (${filterMessages.join(', ')})`
            : `General search results`

          return JSON.stringify({
            query,
            locationFilter: mentionedLocation || 'none',
            timeFilter: dayFilter !== null ? dayFilter : 'none',
            monthFilter: mentionedMonth || 'none',
            resultsFound: filteredResults.length,
            totalBeforeFilter: results.length,
            filterMessage: responseMessage,
            appliedFilters: filterMessages,
            topResults: searchResults
          })
        } catch (error) {
          return `Search error: ${error}`
        }
      }
    })

    // Create event details tool
    const getEventDetailsTool = new Tool({
      name: 'get_event_details',
      description: `
        Gets full details for specific events by their IDs.
        Input should be a comma-separated list of event IDs.
        Use this after semantic search to get complete information about selected events.
      `,
      func: async (eventIds: string) => {
        const ids = eventIds.split(',').map(id => id.trim())
        const matchedEvents = this.events.filter(event => ids.includes(event.id))
        
        return JSON.stringify({
          requestedIds: ids,
          foundEvents: matchedEvents.map(event => ({
            id: event.id,
            title: event.title,
            description: event.description,
            date: event.date,
            time: event.time,
            location: event.location,
            type: event.type,
            tags: event.tags,
            registrationUrl: event.registration_url
          }))
        })
      }
    })

    // Create agent prompt
    const prompt = PromptTemplate.fromTemplate(`
You are an expert tech events assistant powered by LangChain with semantic search capabilities. 
Your job is to help users find the most relevant tech events in Belgium and Netherlands.

AVAILABLE TOOLS:
- semantic_event_search: Find events using semantic similarity search with automatic filtering
- get_event_details: Get complete details for specific events

FILTERING CAPABILITIES:
The semantic_event_search tool automatically detects and applies:
- LOCATION filters: Brussels, Ghent, Antwerp, etc. (both Dutch and French names)
- TIME filters: today, tomorrow, this week, next week, this month, upcoming
- MONTH filters: January, February, March, etc.

WORKFLOW:
1. Understand what the user is looking for (topic, location, timing)
2. Use semantic_event_search with the exact user query to apply all filters automatically
3. Analyze search results and select the most relevant events
4. Use get_event_details for complete information
5. Present results with clear explanations

STRICT FILTERING RULES:
- LOCATION: If user mentions a city, show ONLY events from that city
- TIME: If user mentions "today", show ONLY today's events
- MONTH: If user mentions "September", show ONLY September events
- NEVER mix results from different filters when specific criteria are given

EXAMPLES:
- "AI events in Brussels today" → Only Brussels AI events happening today
- "Tech meetups this week in Ghent" → Only Ghent tech events this week
- "Upcoming conferences in Antwerp" → Only future Antwerp conferences

GUIDELINES:
- STRICTLY respect ALL filters - location, time, and month
- Be precise with filtering - don't mix filtered and unfiltered results
- If no results after filtering, mention the specific filters applied
- Explain why each event matches the user's criteria
- Never apologize for being strict with filters - it's what users want

Current conversation:
Human: {input}

{agent_scratchpad}
    `)

    // Create agent
    const agent = await createOpenAIToolsAgent({
      llm: this.llm,
      tools: [semanticSearchTool, getEventDetailsTool],
      prompt,
    })

    this.agent = new AgentExecutor({
      agent,
      tools: [semanticSearchTool, getEventDetailsTool],
      verbose: true,
      maxIterations: 5
    })

    console.log('🤖 LangChain agent with semantic search tools ready')
  }

  async processQuery(userMessage: string): Promise<LangChainResult> {
    await this.initialize()

    if (!this.agent) {
      throw new Error('Agent not initialized')
    }

    console.log(`🔍 LangChain agent processing: "${userMessage}"`)
    
    const processingSteps: string[] = []
    const vectorSimilarityScores: { [key: string]: number } = {}

    try {
      // Execute the agent with timeout
      processingSteps.push('Agent execution started')
      
      // Add a timeout to prevent hanging
      const agentPromise = this.agent.invoke({
        input: userMessage
      })
      
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Agent execution timeout')), 15000) // 15 second timeout
      })
      
      const result = await Promise.race([agentPromise, timeoutPromise])
      processingSteps.push('Agent execution completed')

      // Parse the agent's response to extract event IDs and search terms
      const output = result.output
      let events: Event[] = []
      let relevanceScores: number[] = []

      // Try to extract event IDs from the agent's intermediate steps
      if (result.intermediateSteps) {
        for (const step of result.intermediateSteps) {
          if (step.action?.tool === 'get_event_details' && step.observation) {
            try {
              const parsedObservation = JSON.parse(step.observation)
              if (parsedObservation.foundEvents) {
                // Use a Map to deduplicate events
                const uniqueEventsMap = new Map<string, Event>()
                
                parsedObservation.foundEvents.forEach((eventData: any) => {
                  try {
                    // Find the original event for complete data
                    const originalEvent = this.events.find(e => e.id === eventData.id)
                    if (!originalEvent) {
                      console.warn(`Original event not found for ID: ${eventData.id}`)
                      return
                    }

                    const processedEvent = {
                      id: originalEvent.id || `generated-${Date.now()}-${Math.random()}`,
                      title: String(originalEvent.title || '').trim(),
                      description: String(originalEvent.description || '').trim(),
                      date: String(originalEvent.date || ''),
                      time: originalEvent.time || null,
                      location: String(originalEvent.location || '').trim(),
                      type: String(originalEvent.type || '').trim(),
                      image_url: String(originalEvent.image_url || '').trim(),
                      registration_url: String(originalEvent.registration_url || '').trim(),
                      tags: String(originalEvent.tags || '').trim(),
                      status: 'published'
                    }
                    
                    // Only add if we have a valid title and it's not a duplicate
                    if (processedEvent.title) {
                      const uniqueKey = `${processedEvent.id}-${processedEvent.title.substring(0, 50)}`
                      if (!uniqueEventsMap.has(uniqueKey)) {
                        uniqueEventsMap.set(uniqueKey, processedEvent)
                      }
                    }
                  } catch (error) {
                    console.error(`Error processing event data:`, error)
                  }
                })
                
                events = Array.from(uniqueEventsMap.values())
                processingSteps.push(`Retrieved details for ${events.length} events`)
              }
            } catch (e) {
              console.error('Error parsing event details:', e)
            }
          }

          if (step.action?.tool === 'semantic_event_search' && step.observation) {
            try {
              const searchResult = JSON.parse(step.observation)
              if (searchResult.topResults) {
                searchResult.topResults.forEach((result: any) => {
                  vectorSimilarityScores[result.eventId] = result.similarity
                })
                relevanceScores = searchResult.topResults.map((r: any) => r.similarity)
                processingSteps.push(`Semantic search found ${searchResult.resultsFound} results`)
              }
            } catch (e) {
              console.error('Error parsing search results:', e)
            }
          }
        }
      }

      // If we didn't get events from the agent steps, try a fallback search with location filtering
      if (events.length === 0 && this.vectorStore) {
        processingSteps.push('Performing fallback semantic search')
        
        // Extract all filters from user message
        const messageLower = userMessage.toLowerCase()
        
        // Location filtering
        const locationKeywords = ['ghent', 'gent', 'brussels', 'bruxelles', 'antwerp', 'antwerpen', 'leuven', 'hasselt', 'mechelen', 'aalst', 'bruges', 'brugge', 'liege', 'luik', 'namur', 'namen', 'charleroi', 'mons', 'bergen', 'ostend', 'oostende']
        const mentionedLocation = locationKeywords.find(loc => messageLower.includes(loc))
        
        // Time/Date filtering
        const timeKeywords = {
          'today': 0,
          'this week': 7,
          'next week': 14,
          'this month': 30,
          'next month': 60,
          'this weekend': 7,
          'tomorrow': 1,
          'upcoming': 30
        }
        
        let dayFilter = null
        for (const [timePhrase, days] of Object.entries(timeKeywords)) {
          if (messageLower.includes(timePhrase)) {
            dayFilter = days
            break
          }
        }
        
        // Month filtering
        const months = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december']
        const mentionedMonth = months.find(month => messageLower.includes(month))
        
        const fallbackResults = await this.vectorStore.similaritySearchWithScore(userMessage, 50)
        
        // Apply all filters
        let filteredResults = fallbackResults
        
        // Location filtering
        if (mentionedLocation) {
          filteredResults = filteredResults.filter(([doc]) => {
            const docLocation = (doc.metadata.location || '').toLowerCase()
            const locationMappings: { [key: string]: string[] } = {
              'ghent': ['ghent', 'gent'],
              'gent': ['ghent', 'gent'],
              'brussels': ['brussels', 'bruxelles'],
              'bruxelles': ['brussels', 'bruxelles'],
              'antwerp': ['antwerp', 'antwerpen'],
              'antwerpen': ['antwerp', 'antwerpen'],
              'bruges': ['bruges', 'brugge'],
              'brugge': ['bruges', 'brugge'],
              'liege': ['liege', 'luik'],
              'luik': ['liege', 'luik'],
              'ostend': ['ostend', 'oostende'],
              'oostende': ['ostend', 'oostende']
            }
            
            const acceptableLocations = locationMappings[mentionedLocation] || [mentionedLocation]
            return acceptableLocations.some(loc => docLocation.includes(loc))
          })
          processingSteps.push(`Applied location filter for: ${mentionedLocation}`)
        }
        
        // Time/Date filtering
        if (dayFilter !== null || mentionedMonth) {
          const currentDate = new Date()
          filteredResults = filteredResults.filter(([doc]) => {
            const eventDate = doc.metadata.date
            if (!eventDate) return false
            
            try {
              const eventDateObj = new Date(eventDate)
              
              // Month filtering
              if (mentionedMonth) {
                const eventMonth = eventDateObj.getMonth()
                const targetMonth = months.indexOf(mentionedMonth)
                if (eventMonth !== targetMonth) return false
              }
              
              // Day range filtering
              if (dayFilter !== null) {
                const timeDiff = eventDateObj.getTime() - currentDate.getTime()
                const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24))
                
                if (dayFilter === 0) { // today
                  return daysDiff === 0
                } else if (dayFilter === 1) { // tomorrow
                  return daysDiff === 1
                } else { // within range
                  return daysDiff >= 0 && daysDiff <= dayFilter
                }
              }
              
              return true
            } catch (e) {
              return false
            }
          })
          
          if (dayFilter !== null) {
            const filterName = Object.keys(timeKeywords).find(key => timeKeywords[key] === dayFilter)
            processingSteps.push(`Applied time filter: ${filterName}`)
          }
          if (mentionedMonth) {
            processingSteps.push(`Applied month filter: ${mentionedMonth}`)
          }
        }
        
        // Use a Map to prevent duplicates based on event ID
        const uniqueEventsMap = new Map<string, Event>()
        
        filteredResults.forEach(([doc]) => {
          const eventId = doc.metadata.eventId
          const event = this.events.find(e => e.id === eventId)
          
          if (event && event.title && typeof event.title === 'string' && event.title.trim()) {
            // Use a composite key to prevent duplicates
            const uniqueKey = `${event.id || 'no-id'}-${event.title.substring(0, 50)}`
            if (!uniqueEventsMap.has(uniqueKey)) {
              uniqueEventsMap.set(uniqueKey, {
                ...event,
                id: event.id || `generated-${Date.now()}-${Math.random()}`
              })
            }
          }
        })
        
        events = Array.from(uniqueEventsMap.values()).slice(0, 12)
        relevanceScores = filteredResults.slice(0, events.length).map(([, score]) => score)
        
        events.forEach((event, idx) => {
          if (filteredResults[idx]) {
            vectorSimilarityScores[event.id] = filteredResults[idx][1]
          }
        })
      }

      return {
        message: output,
        events,
        relevanceScores,
        searchQuery: userMessage,
        processingSteps,
        vectorSimilarityScores
      }

    } catch (error) {
      console.error('LangChain agent error:', error)
      processingSteps.push(`Error: ${error}`)

      // Enhanced fallback to direct semantic search with location filtering
      if (this.vectorStore) {
        processingSteps.push('Using direct semantic search fallback with location filtering')
        
        // Extract location from user message for filtering
        const locationKeywords = ['ghent', 'gent', 'brussels', 'bruxelles', 'antwerp', 'antwerpen', 'leuven', 'hasselt', 'mechelen', 'aalst', 'bruges', 'brugge', 'liege', 'luik', 'namur', 'namen', 'charleroi', 'mons', 'bergen', 'ostend', 'oostende']
        const messageLower = userMessage.toLowerCase()
        const mentionedLocation = locationKeywords.find(loc => messageLower.includes(loc))
        
        const fallbackResults = await this.vectorStore.similaritySearchWithScore(userMessage, 20)
        
        // Apply location filtering if location is mentioned
        let filteredResults = fallbackResults
        if (mentionedLocation) {
          filteredResults = fallbackResults.filter(([doc]) => {
            const docLocation = String(doc.metadata.location || '').toLowerCase()
            const locationMappings: { [key: string]: string[] } = {
              'ghent': ['ghent', 'gent'],
              'gent': ['ghent', 'gent'],
              'brussels': ['brussels', 'bruxelles'],
              'bruxelles': ['brussels', 'bruxelles'],
              'antwerp': ['antwerp', 'antwerpen'],
              'antwerpen': ['antwerp', 'antwerpen'],
              'bruges': ['bruges', 'brugge'],
              'brugge': ['bruges', 'brugge'],
              'liege': ['liege', 'luik'],
              'luik': ['liege', 'luik'],
              'ostend': ['ostend', 'oostende'],
              'oostende': ['ostend', 'oostende']
            }
            
            const acceptableLocations = locationMappings[mentionedLocation] || [mentionedLocation]
            return acceptableLocations.some(loc => docLocation.includes(loc))
          })
          processingSteps.push(`Applied location filter for: ${mentionedLocation}`)
        }
        
        const events = filteredResults.map(([doc]) => {
          const eventId = String(doc.metadata.eventId || '')
          return this.events.find(e => e.id === eventId)
        }).filter(Boolean).slice(0, 8)

        const locationMessage = mentionedLocation 
          ? ` in ${mentionedLocation.charAt(0).toUpperCase() + mentionedLocation.slice(1)}`
          : ''

        return {
          message: `I found ${events.length} relevant events${locationMessage} using semantic search, though I encountered an issue with the full analysis.`,
          events,
          relevanceScores: filteredResults.slice(0, events.length).map(([, score]) => score),
          searchQuery: userMessage,
          processingSteps,
          vectorSimilarityScores: {}
        }
      }

      throw error
    }
  }
}

export default LangChainEventAgent