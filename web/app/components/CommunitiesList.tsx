'use client'

import { useState, useEffect } from 'react'

interface Community {
  id: string
  name: string
  description: string
  memberCount: number
  category: string
}

export function CommunitiesList() {
  const [communities, setCommunities] = useState<Community[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/communities')
      .then(res => res.json())
      .then(data => {
        setCommunities(data.communities || [])
        setLoading(false)
      })
      .catch(err => {
        console.error('Error fetching communities:', err)
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold mb-4">Local Communities</h3>
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
      <h3 className="text-xl font-semibold mb-4">Local Communities</h3>
      {communities.length === 0 ? (
        <p className="text-gray-500">No communities found. Check back soon!</p>
      ) : (
        <div className="space-y-4">
          {communities.map((community) => (
            <div key={community.id} className="border-b pb-4 last:border-b-0">
              <h4 className="font-medium text-gray-900">{community.name}</h4>
              <p className="text-sm text-blue-600">{community.category} • {community.memberCount} members</p>
              <p className="text-gray-600 text-sm mt-2">{community.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}