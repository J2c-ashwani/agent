import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
import { ObjectId } from 'mongodb'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || (session.user as any).role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { getDatabase } = await import('@/lib/mongodb')
    const { agentId, name, company, country, phone } = await request.json()

    if (!agentId) {
      return NextResponse.json({ error: 'Missing agent ID' }, { status: 400 })
    }

    const db = await getDatabase()
    
    await db.collection('agents').updateOne(
      { _id: new ObjectId(agentId) },
      { 
        $set: { 
          name,
          company,
          country,
          phone,
          updatedAt: new Date() 
        } 
      }
    )

    return NextResponse.json({ 
      success: true, 
      message: 'Agent updated successfully'
    })
  } catch (error: any) {
    console.error('Update agent error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
