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
          
          // Normalize the event structure
          const normalizedEvent: Event = {
            id: event.id || `generated-${lineIndex}`,
            title: event.title || 'Untitled Event',
            description: event.description || '',
            date: event.date || '',
            time: event.time || null,
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
            eventId: event.id,
            title: event.title.substring(0, 100),
            type: event.type || 'Event',
            location: event.location || 'TBD',
            date: event.date || '',
            tags: event.tags || ''
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
      `,
      func: async (query: string) => {
        if (!this.vectorStore) return 'Vector store not initialized'

        try {
          // Perform similarity search
          const results = await this.vectorStore.similaritySearchWithScore(query, 15)
          
          const searchResults = results.map(([doc, score], index) => ({
            rank: index + 1,
            eventId: doc.metadata.eventId,
            title: doc.metadata.title,
            type: doc.metadata.type,
            location: doc.metadata.location,
            date: doc.metadata.date,
            similarity: Math.round(score * 100) / 100,
            preview: doc.pageContent.substring(0, 200) + '...'
          }))

          return JSON.stringify({
            query,
            resultsFound: results.length,
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
- semantic_event_search: Find events using semantic similarity search
- get_event_details: Get complete details for specific events

WORKFLOW:
1. Understand what the user is really looking for (be generous in interpretation)
2. Use semantic_event_search with a well-crafted query that captures their intent
3. Analyze the search results and select the most relevant events
4. Use get_event_details to get full information for the selected events
5. Present the results with clear explanations of why each event is relevant

GUIDELINES:
- Be generous with search terms - cast a wide net
- Look for semantic connections, not just keyword matches
- Consider related technologies, concepts, and interests
- Explain why each event is relevant to the user's query
- Provide actionable recommendations
- If few results found, try broader search terms

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
      // Execute the agent
      processingSteps.push('Agent execution started')
      const result = await this.agent.invoke({
        input: userMessage
      })

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

      // If we didn't get events from the agent steps, try a fallback search
      if (events.length === 0 && this.vectorStore) {
        processingSteps.push('Performing fallback semantic search')
        const fallbackResults = await this.vectorStore.similaritySearchWithScore(userMessage, 20)
        
        // Use a Map to prevent duplicates based on event ID
        const uniqueEventsMap = new Map<string, Event>()
        
        fallbackResults.forEach(([doc]) => {
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
        relevanceScores = fallbackResults.slice(0, events.length).map(([, score]) => score)
        
        events.forEach((event, idx) => {
          if (fallbackResults[idx]) {
            vectorSimilarityScores[event.id] = fallbackResults[idx][1]
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

      // Fallback to direct semantic search
      if (this.vectorStore) {
        processingSteps.push('Using direct semantic search fallback')
        const fallbackResults = await this.vectorStore.similaritySearchWithScore(userMessage, 8)
        const events = fallbackResults.map(([doc]) => {
          const eventId = doc.metadata.eventId
          return this.events.find(e => e.id === eventId)!
        }).filter(Boolean)

        return {
          message: `I found ${events.length} relevant events using semantic search, though I encountered an issue with the full analysis.`,
          events,
          relevanceScores: fallbackResults.map(([, score]) => score),
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