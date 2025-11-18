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
    const { agentIds, action } = await request.json()

    if (!agentIds || !Array.isArray(agentIds) || agentIds.length === 0) {
      return NextResponse.json({ error: 'No agents selected' }, { status: 400 })
    }

    const db = await getDatabase()
    const objectIds = agentIds.map(id => new ObjectId(id))
    let result

    switch (action) {
      case 'activate':
        result = await db.collection('agents').updateMany(
          { _id: { $in: objectIds } },
          { $set: { status: 'active', updatedAt: new Date() } }
        )
        break
      
      case 'suspend':
        result = await db.collection('agents').updateMany(
          { _id: { $in: objectIds } },
          { $set: { status: 'suspended', updatedAt: new Date() } }
        )
        break
      
      case 'delete':
        result = await db.collection('agents').deleteMany(
          { _id: { $in: objectIds } }
        )
        break
      
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }

    return NextResponse.json({ 
      success: true, 
      message: `Bulk ${action} completed`,
      affected: result.modifiedCount || result.deletedCount || 0
    })
  } catch (error: any) {
    console.error('Bulk action error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
