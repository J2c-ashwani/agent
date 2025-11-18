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
    const { agentId, status } = await request.json()

    if (!agentId || !status) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const db = await getDatabase()
    
    await db.collection('agents').updateOne(
      { _id: new ObjectId(agentId) },
      { $set: { status, updatedAt: new Date() } }
    )

    return NextResponse.json({ 
      success: true, 
      message: 'Agent status updated successfully'
    })
  } catch (error: any) {
    console.error('Update status error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
