import { NextRequest, NextResponse } from 'next/server'
import SmartEventAgent from '@/lib/smart-agent'

export async function POST(request: NextRequest) {
  try {
    const { message, conversationHistory } = await request.json()
    
    if (!message || typeof message !== 'string') {
      return NextResponse.json({
        response: "Please provide a valid message.",
        events: []
      }, { status: 400 })
    }

    // Check if OpenAI API key is configured
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({
        response: "OpenAI API key is not configured. Please add OPENAI_API_KEY to your .env file.",
        events: []
      }, { status: 500 })
    }

    // Validate AI model configuration
    const validModels = ['gpt-4o', 'gpt-4o-mini', 'gpt-4-turbo', 'gpt-4', 'gpt-3.5-turbo']
    const configuredModel = process.env.OPENAI_MODEL || 'gpt-4o-mini'
    
    if (!validModels.includes(configuredModel)) {
      console.warn(`Warning: Configured model '${configuredModel}' is not in the list of known valid models. Proceeding anyway.`)
    }
    
    // Create smart agent with deep interpretation and LLM evaluation
    const agent = new SmartEventAgent()
    const result = await agent.processQuery(message, conversationHistory || [])
    
    return NextResponse.json({
      response: result.message,
      events: result.events
    })
    
  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json({
      response: "I'm sorry, I encountered an error while processing your request. Please try again.",
      events: []
    }, { status: 500 })
  }
}