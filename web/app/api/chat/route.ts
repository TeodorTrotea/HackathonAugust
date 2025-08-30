import { NextRequest, NextResponse } from 'next/server'
import LangChainEventAgent from '@/lib/langchain-agent'

export async function POST(request: NextRequest) {
  try {
    const { message, conversationHistory } = await request.json()
    
    if (!message || typeof message !== 'string') {
      return NextResponse.json({
        response: "Please provide a valid message.",
        events: [],
        processingSteps: [],
        vectorSimilarityScores: {},
        error: "Invalid input"
      }, { status: 400 })
    }

    // Check if OpenAI API key is configured
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({
        response: "OpenAI API key is not configured. Please add OPENAI_API_KEY to your .env file.",
        events: [],
        processingSteps: [],
        vectorSimilarityScores: {},
        error: "Missing API key"
      }, { status: 500 })
    }

    console.log(`🔗 LangChain chat processing: "${message}"`)
    const startTime = Date.now()
    
    // Use LangChain agent exclusively
    const agent = new LangChainEventAgent()
    const result = await agent.processQuery(message)
    
    const processingTime = Date.now() - startTime
    
    console.log(`🎯 LangChain processing complete:`)
    console.log(`   - Events found: ${result.events.length}`)
    console.log(`   - Processing steps: ${result.processingSteps.length}`)
    console.log(`   - Total time: ${processingTime}ms`)
    
    return NextResponse.json({
      response: result.message,
      events: result.events,
      relevanceScores: result.relevanceScores,
      searchQuery: result.searchQuery,
      processingSteps: result.processingSteps,
      vectorSimilarityScores: result.vectorSimilarityScores,
      processingTime,
      agentType: 'langchain'
    })
    
  } catch (error) {
    console.error('LangChain chat API error:', error)
    return NextResponse.json({
      response: "I encountered an error while processing your request with LangChain. Please try again.",
      events: [],
      processingSteps: [`Error: ${error instanceof Error ? error.message : 'Unknown error'}`],
      vectorSimilarityScores: {},
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}