import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET() {
  try {
    const csvPath = path.join(process.cwd(), '../data/communities_export.csv')
    const csvContent = fs.readFileSync(csvPath, 'utf-8')
    
    const lines = csvContent.trim().split('\n')
    const headers = lines[0].split(',')
    
    const communities = lines.slice(1).map(line => {
      const values = []
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

      const community: any = {}
      headers.forEach((header, index) => {
        community[header] = values[index] || ''
      })
      
      return community
    })

    return NextResponse.json(communities)
  } catch (error) {
    console.error('Error reading communities:', error)
    return NextResponse.json([], { status: 500 })
  }
}