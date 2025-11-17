import { NextResponse } from 'next/server'
import { getDatabase } from '@/lib/mongodb'

export async function GET() {
  try {
    const db = await getDatabase()
    
    // Test the connection
    await db.command({ ping: 1 })
    
    // Get collection stats
    const collections = await db.listCollections().toArray()
    
    return NextResponse.json({ 
      success: true, 
      message: 'MongoDB connected successfully!',
      database: db.databaseName,
      collections: collections.map(c => c.name),
    })
  } catch (error: any) {
    console.error('MongoDB connection error:', error)
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 })
  }
}
