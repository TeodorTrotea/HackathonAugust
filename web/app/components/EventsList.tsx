'use client'

import { useState, useEffect } from 'react'

interface Event {
  id: string
  title: string
  date: string
  location: string
  description: string
}

export function EventsList() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/events')
      .then(res => res.json())
      .then(data => {
        setEvents(data.events || [])
        setLoading(false)
      })
      .catch(err => {
        console.error('Error fetching events:', err)
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold mb-4">Upcoming Events</h3>
        <div className="animate-pulse space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="border-b pb-4">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-full"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold mb-4">Upcoming Events</h3>
      {events.length === 0 ? (
        <p className="text-gray-500">No events found. Check back soon!</p>
      ) : (
        <div className="space-y-4">
          {events.map((event) => (
            <div key={event.id} className="border-b pb-4 last:border-b-0">
              <h4 className="font-medium text-gray-900">{event.title}</h4>
              <p className="text-sm text-blue-600">{event.date} • {event.location}</p>
              <p className="text-gray-600 text-sm mt-2">{event.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}