import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession()
    
    // Only admins can create agents
    if (!session || (session.user as any).role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { getDatabase } = await import('@/lib/mongodb')
    const { hash } = await import('bcryptjs')
    
    const { email, name, company, country, phone, password } = await request.json()

    // Validation
    if (!email || !name || !password) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const db = await getDatabase()
    
    // Check if user already exists
    const existingUser = await db.collection('agents').findOne({ email })
    if (existingUser) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 })
    }

    // Hash password
    const hashedPassword = await hash(password, 10)

    // Create agent
    await db.collection('agents').insertOne({
      email,
      password: hashedPassword,
      name,
      role: 'agent',
      company: company || '',
      country: country || 'India',
      phone: phone || '',
      status: 'active',
      createdAt: new Date(),
      totalApplications: 0,
      acceptedApplications: 0,
    })

    return NextResponse.json({ 
      success: true, 
      message: 'Agent created successfully',
      agent: { email, name, role: 'agent' }
    })
  } catch (error: any) {
    console.error('Create agent error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
