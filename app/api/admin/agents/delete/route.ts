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
    const { agentId } = await request.json()

    if (!agentId) {
      return NextResponse.json({ error: 'Missing agent ID' }, { status: 400 })
    }

    const db = await getDatabase()
    
    // Delete agent
    await db.collection('agents').deleteOne({ _id: new ObjectId(agentId) })
    
    // Optionally: Delete or reassign their students
    // await db.collection('students').deleteMany({ agentEmail: agentEmail })

    return NextResponse.json({ 
      success: true, 
      message: 'Agent deleted successfully'
    })
  } catch (error: any) {
    console.error('Delete agent error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
