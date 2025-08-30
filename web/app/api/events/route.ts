import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1', 10)
    const limit = parseInt(searchParams.get('limit') || '50', 10)
    
    const csvPath = path.join(process.cwd(), '../data/events_export.csv')
    const csvContent = fs.readFileSync(csvPath, 'utf-8')
    
    const lines = csvContent.trim().split('\n')
    const headers = lines[0].split(',')
    
    const allEvents = lines.slice(1).map(line => {
      const values: string[] = []
      let current = ''
      let inQuotes = false
      
      for (let i = 0; i < line.length; i++) {
        const char = line[i]
        if (char === '"') {
          inQuotes = !inQuotes
        } else if (char === ',' && !inQuotes) {
          values.push(current.trim())
          current = ''
        } else {
          current += char
        }
      }
      values.push(current.trim())

      const event: any = {}
      headers.forEach((header, index) => {
        event[header] = values[index] || ''
      })
      
      return event
    })

    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const events = allEvents.slice(startIndex, endIndex)
    const totalCount = allEvents.length
    const totalPages = Math.ceil(totalCount / limit)

    return NextResponse.json({
      events,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    })
  } catch (error) {
    console.error('Error reading events:', error)
    return NextResponse.json({ events: [], pagination: null }, { status: 500 })
  }
}