import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || (session.user as any).role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { getDatabase } = await import('@/lib/mongodb')
    const db = await getDatabase()
    
    const { name, country, programs, intakes, tuition, requirements } = await request.json()

    if (!name || !country || !programs || !intakes || !tuition || !requirements) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    await db.collection('universities').insertOne({
      name,
      country,
      programs,
      intakes,
      tuition,
      requirements,
      createdAt: new Date(),
    })

    return NextResponse.json({ 
      success: true, 
      message: 'University added successfully'
    })
  } catch (error: any) {
    console.error('Create university error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
