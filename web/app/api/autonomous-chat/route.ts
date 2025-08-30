import { NextRequest, NextResponse } from 'next/server'
import AutonomousEventAgent from '@/lib/autonomous-agent'

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json()
    
    if (!message || typeof message !== 'string') {
      return NextResponse.json({
        response: "Please provide a valid message.",
        events: [],
        searchPerformed: false,
        reasoning: "Invalid input"
      }, { status: 400 })
    }

    // Check if OpenAI API key is configured
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({
        response: "OpenAI API key is not configured. Please add OPENAI_API_KEY to your .env file.",
        events: [],
        searchPerformed: false,
        reasoning: "Missing API key"
      }, { status: 500 })
    }

    console.log(`🤖 Autonomous chat processing: "${message}"`)
    
    // Create autonomous agent that decides whether to search or not
    const agent = new AutonomousEventAgent()
    const result = await agent.processQuery(message)
    
    console.log(`✅ Response generated - Search performed: ${result.searchPerformed}, Events: ${result.events.length}`)
    
    return NextResponse.json({
      response: result.message,
      events: result.events,
      searchPerformed: result.searchPerformed,
      reasoning: result.reasoning
    })
    
  } catch (error) {
    console.error('Autonomous chat API error:', error)
    return NextResponse.json({
      response: "I'm sorry, I encountered an error while processing your request. Please try again.",
      events: [],
      searchPerformed: false,
      reasoning: "Internal error"
    }, { status: 500 })
  }
}