import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET() {
  try {
    const csvPath = path.join(process.cwd(), '../data/communities_to_events_export.csv')
    const csvContent = fs.readFileSync(csvPath, 'utf-8')
    
    const lines = csvContent.trim().split('\n')
    const headers = lines[0].split(',')
    
    const relations = lines.slice(1).map(line => {
      const values = line.split(',')
      const relation: any = {}
      headers.forEach((header, index) => {
        relation[header] = values[index] || ''
      })
      return relation
    })

    return NextResponse.json(relations)
  } catch (error) {
    console.error('Error reading event-community relations:', error)
    return NextResponse.json([], { status: 500 })
  }
}