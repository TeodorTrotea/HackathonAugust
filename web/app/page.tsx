// page.tsx
'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Send } from "lucide-react"
import Link from 'next/link'
import Image from 'next/image'

export default function BelgiumTechChat() {
  const [messages, setMessages] = useState<Array<{role: 'user' | 'assistant', content: string}>>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
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
    
    // Simulate AI response (replace with actual API call)
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: `I understand you're asking about "${userMessage}". This is a demo response for the Belgium tech events chat interface. In a real implementation, this would connect to an AI service to provide helpful responses about tech events, communities, and opportunities in Belgium.` 
      }])
      setIsLoading(false)
    }, 1500)
  }

  // Auto scroll to bottom when new messages appear
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages, isLoading])

  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-900 to-black text-white flex flex-col">
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
      <main className="flex-1 max-w-4xl mx-auto px-6 py-8 w-full flex flex-col">
        {messages.length === 0 ? (
          /* Empty state */
          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="text-center mb-8">
              <div className="text-2xl mb-2">💬</div>
              <p className="text-lg mb-2">Ask me about tech events in Belgium!</p>
              <p className="text-sm text-neutral-400">Events, communities, networking opportunities and more.</p>
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
            <div className="flex-1 overflow-y-auto mb-4 space-y-4 no-scrollbar">
              {messages.map((message, index) => (
                <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
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
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-neutral-800 text-neutral-100 p-4 rounded-lg">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }}></div>
                      <div className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></div>
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
            className="w-full bg-neutral-800 border-neutral-600 text-white placeholder-neutral-400 focus:border-blue-500 resize-none min-h-[52px] max-h-[240px] overflow-y-auto pr-12"
            disabled={isLoading}
            rows={1}
            style={{ height: 'auto', minHeight: '52px' }}
            onInput={(e) => {
              const target = e.target as HTMLTextAreaElement
              target.style.height = 'auto'
              const newHeight = Math.min(target.scrollHeight, 240)
              target.style.height = newHeight + 'px'
              target.style.overflowY = target.scrollHeight > 240 ? 'auto' : 'hidden'
            }}
          />
          <Button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="absolute right-2 bottom-2 bg-blue-600 hover:bg-blue-700 text-white w-8 h-8 p-0 rounded"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-neutral-800 py-4 text-center text-sm text-neutral-400">
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
