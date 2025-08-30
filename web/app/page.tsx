// page.tsx
'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Send, Settings } from "lucide-react"
import Link from 'next/link'
import Image from 'next/image'
import EventCard from '@/components/EventCard'
import ErrorBoundary from '@/components/ErrorBoundary'

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

interface Message {
  role: 'user' | 'assistant'
  content: string
  events?: Event[]
}

export default function BelgiumTechChat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  // Using LangChain as the only agent
  const messagesEndRef = useRef<HTMLDivElement | null>(null)

  const handleSend = async () => {
    if (!input.trim()) return
    
    const userMessage = input.trim()
    setInput('')
    setIsLoading(true)
    
    // Reset textarea height
    const textarea = document.querySelector('textarea') as HTMLTextAreaElement

    if (textarea) {
      textarea.style.height = '52px'
    }
    
    // Add user message
    setMessages(prev => [...prev, { role: 'user', content: userMessage }])
    
    try {
      // Use LangChain agent exclusively
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          message: userMessage,
          conversationHistory: messages
        })
      })
      
      const data = await response.json()
      
      // Add assistant message with events
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: data.response,
        events: data.events
      }])
    } catch (error) {
      console.error('Error calling chat API:', error)
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: "I'm sorry, I encountered an error while searching for events. Please try again."
      }])
    } finally {
      setIsLoading(false)
    }
  }

  // Auto scroll to bottom when new messages appear
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages, isLoading])

  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-800 to-black text-white flex flex-col">
      {/* Header Navigation */}
      <header className="bg-black border-b border-neutral-800">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <nav className="flex items-center justify-center">
            <Link
              href="/" 
              className="flex items-center space-x-2 select-none cursor-pointer group"
            >
              <Image
                src="/belgiumtech-chat-logo.png"
                width={25}
                height={25}
                alt="belgiumtech.chat logo"
              />
              <span className="text-xl font-bold bg-white bg-clip-text">
                BELGIUMTECH.CHAT
              </span>
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-6xl mx-auto px-6 py-8 w-full flex flex-col">
        {messages.length === 0 ? (
          /* Empty state */
          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="text-center mb-8">
              <div className="flex items-center justify-center mb-4">
                <Image
                  src="/belgiumtech-chat-logo.png"
                  width={150}
                  height={150}
                  alt="BelgiumTech logo"
                />
              </div>
              <h1 className="text-5xl font-extrabold -mb-2">Find Your Next</h1>
              <h1 className="text-5xl font-extrabold mb-6">Tech Event In Belgium</h1>
              <p className="text-neutral-400 mb-6">Powered by AI • Events, communities, networking opportunities and more.</p>
              <div className="flex flex-wrap gap-2 justify-center text-neutral-500">
                <span className="bg-neutral-800 px-4 py-2 rounded cursor-pointer hover:bg-neutral-700" onClick={() => setInput('AI events in Brussels')}>
                  "AI events in Brussels"
                </span>
                <span className="bg-neutral-800 px-4 py-2 rounded cursor-pointer hover:bg-neutral-700" onClick={() => setInput('Startup meetups')}>
                  "Startup meetups"
                </span>
                <span className="bg-neutral-800 px-4 py-2 rounded cursor-pointer hover:bg-neutral-700" onClick={() => setInput('Tech conferences')}>
                  "Tech conferences"
                </span>
                <span className="bg-neutral-800 px-4 py-2 rounded cursor-pointer hover:bg-neutral-700" onClick={() => setInput('Networking events')}>
                  "Networking events"
                </span>
              </div>
            </div>
            {/* Input */}
            <ChatInput
              input={input}
              setInput={setInput}
              handleSend={handleSend}
              isLoading={isLoading}
            />
          </div>
        ) : (
          <>
            {/* Messages */}
            <div className="flex-1 overflow-y-auto mb-4 space-y-6 no-scrollbar">
              {messages.map((message, index) => (
                <div key={index} className="space-y-4">
                  {/* Message bubble */}
                  <div className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div
                      className={`max-w-[80%] p-4 rounded-lg break-words whitespace-pre-wrap ${
                        message.role === 'user'
                          ? 'bg-blue-600 text-white'
                          : 'bg-neutral-800 text-neutral-100'
                      }`}
                    >
                      {message.content}
                    </div>
                  </div>
                  
                  {/* Event cards */}
                  {message.events && message.events.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-full">
                      {message.events
                        .filter((event, eventIndex) => {
                          // Filter out invalid events before rendering
                          if (!event) {
                            console.warn(`Skipping null/undefined event at index ${eventIndex}`)
                            return false
                          }
                          if (typeof event !== 'object') {
                            console.warn(`Skipping non-object event at index ${eventIndex}:`, typeof event)
                            return false
                          }
                          if (!event.title || typeof event.title !== 'string' || event.title.trim() === '') {
                            console.warn(`Skipping event with invalid title at index ${eventIndex}:`, event)
                            return false
                          }
                          return true // Allow events even without IDs - we'll generate keys
                        })
                        .map((event, eventIndex) => {
                          try {
                            // Generate a unique key using multiple factors to avoid duplicates
                            const uniqueKey = `msg-${index}-evt-${eventIndex}-${event.id || 'no-id'}-${event.title?.substring(0, 20) || 'no-title'}-${Date.now()}`
                            
                            return (
                              <ErrorBoundary key={uniqueKey}>
                                <EventCard event={event} />
                              </ErrorBoundary>
                            )
                          } catch (error) {
                            console.error(`Error rendering event card for ${event.title}:`, error)
                            return null
                          }
                        })
                        .filter(Boolean) // Remove any null components
                      }
                    </div>
                  )}
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-neutral-800 text-neutral-100 p-4 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }}></div>
                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></div>
                      </div>
                      <span className="text-sm text-neutral-300">AI agent is deeply analyzing your request and evaluating events...</span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <ChatInput
              input={input}
              setInput={setInput}
              handleSend={handleSend}
              isLoading={isLoading}
            />
          </>
        )}
      </main>
    </div>
  )
}

// Extracted input component to avoid duplication
function ChatInput({
  input,
  setInput,
  handleSend,
  isLoading
}: {
  input: string,
  setInput: (val: string) => void,
  handleSend: () => void,
  isLoading: boolean
}) {
  return (
    <div className="relative w-full">
      <div className="flex items-end space-x-2">
        <div className="flex-1 relative">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                handleSend()
              }
            }}
            placeholder="Ask about tech events in Belgium..."
            className="w-full bg-neutral-800 border-neutral-600 text-white placeholder-neutral-400 focus:border-blue-500 resize-none pr-14 !text-base"
            disabled={isLoading}
            rows={1}
            style={{
              fontSize: '1rem',      // 16px
              lineHeight: '1.75rem',      // matches font size for vertical centering
              minHeight: '52px',
              maxHeight: '240px',
              height: 'auto',
              paddingTop: '0.75rem',    // adjust vertical spacing
              paddingBottom: '0.75rem',
              overflowY: 'hidden',       // hide scroll until needed
            }}
            onInput={(e) => {
              const target = e.target as HTMLTextAreaElement
              target.style.height = 'auto'
              const newHeight = Math.min(target.scrollHeight, 240)
              target.style.height = newHeight + 'px'
              target.style.overflowY = target.scrollHeight > 240 ? 'auto' : 'hidden'
            }}
          />
          {/* Buttons container */}
          <div className="absolute right-2 bottom-2 flex flex-col space-y-2 mr-1">
            {/* Send Button */}
            <Button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="bg-blue-600 hover:bg-blue-700 text-white w-9 h-9 p-0 rounded"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-neutral-800 py-4 text-center text-sm text-neutral-400 mt-6">
        <p>© 2025 Belgium Tech Chat. All rights reserved.</p>
        <p className='text-neutral-600 text-xs'>
          A{' '}
          <Link href="https://github.com/whatyouheard" target="_blank" className="text-neutral-500 hover:text-neutral-400 underline">
            Eugen
          </Link>{' '}
          and{' '}
          <Link href="https://github.com/teodortrotea" target="_blank" className="text-neutral-500 hover:text-neutral-400 underline">
            Teodor
          </Link>{' '}
          initiative
        </p>
      </footer>
    </div>
  )
}