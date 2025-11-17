import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET() {
  try {
    // Import dependencies only at runtime
    const { getDatabase } = await import('@/lib/mongodb')
    const { hash } = await import('bcryptjs')
    
    const db = await getDatabase()
    
    // Drop existing collections if they exist (for clean setup)
    const existingCollections = await db.listCollections().toArray()
    const collectionNames = existingCollections.map(c => c.name)
    
    // Create agents collection
    if (!collectionNames.includes('agents')) {
      await db.createCollection('agents')
    }
    await db.collection('agents').createIndex({ email: 1 }, { unique: true })
    
    // Create students collection
    if (!collectionNames.includes('students')) {
      await db.createCollection('students')
    }
    await db.collection('students').createIndex({ applicationId: 1 }, { unique: true })
    await db.collection('students').createIndex({ agentEmail: 1 })
    await db.collection('students').createIndex({ status: 1 })
    
    // Create universities collection
    if (!collectionNames.includes('universities')) {
      await db.createCollection('universities')
    }
    await db.collection('universities').createIndex({ name: 1, country: 1 })
    
    // Create notifications collection
    if (!collectionNames.includes('notifications')) {
      await db.createCollection('notifications')
    }
    await db.collection('notifications').createIndex({ agentEmail: 1 })
    await db.collection('notifications').createIndex({ createdAt: -1 })
    
    // Insert demo users (only if not exists)
    const hashedPassword = await hash('password123', 10)
    
    const agentsCollection = db.collection('agents')
    const agentExists = await agentsCollection.findOne({ email: 'agent@example.com' })
    
    if (!agentExists) {
      await agentsCollection.insertMany([
        {
          email: 'agent@example.com',
          password: hashedPassword,
          name: 'Agent User',
          role: 'agent',
          company: 'Education Consultancy',
          country: 'India',
          phone: '+91xxxxxxxxxx',
          status: 'active',
          createdAt: new Date(),
          totalApplications: 0,
          acceptedApplications: 0,
        },
        {
          email: 'admin@example.com',
          password: hashedPassword,
          name: 'Admin User',
          role: 'admin',
          company: 'Join2Campus',
          country: 'India',
          phone: '+91xxxxxxxxxx',
          status: 'active',
          createdAt: new Date(),
          totalApplications: 0,
          acceptedApplications: 0,
        },
      ])
    }
    
    // Insert sample universities (only if empty)
    const universitiesCollection = db.collection('universities')
    const universityCount = await universitiesCollection.countDocuments()
    
    if (universityCount === 0) {
      await universitiesCollection.insertMany([
        {
          name: 'Technical University of Munich',
          country: 'Germany',
          programs: ['Engineering', 'Computer Science', 'Business'],
          intakes: ['September', 'January'],
          tuition: '€0 (Public University)',
          requirements: 'IELTS 6.5, GPA 3.0',
          createdAt: new Date(),
        },
        {
          name: 'University College Dublin',
          country: 'Ireland',
          programs: ['Business', 'Medicine', 'Law'],
          intakes: ['September'],
          tuition: '€12,000 - €25,000',
          requirements: 'IELTS 6.5, GPA 3.2',
          createdAt: new Date(),
        },
        {
          name: 'Sciences Po Paris',
          country: 'France',
          programs: ['Political Science', 'International Relations', 'Economics'],
          intakes: ['September'],
          tuition: '€0 - €14,000',
          requirements: 'IELTS 7.0, GPA 3.5',
          createdAt: new Date(),
        },
      ])
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Database setup completed!',
      collections: ['agents', 'students', 'universities', 'notifications'],
      users: ['agent@example.com', 'admin@example.com'],
      universities: await universitiesCollection.countDocuments(),
    })
  } catch (error: any) {
    console.error('Database setup error:', error)
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 })
  }
}
