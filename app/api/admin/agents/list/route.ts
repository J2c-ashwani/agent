import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || (session.user as any).role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { getDatabase } = await import('@/lib/mongodb')
    const db = await getDatabase()
    
    const agents = await db.collection('agents')
      .find({ role: 'agent' })
      .project({ password: 0 })
      .toArray()

    return NextResponse.json({ 
      success: true,
      agents: agents.map(a => ({
        id: a._id.toString(),
        email: a.email,
        name: a.name,
        company: a.company,
        country: a.country,
        phone: a.phone,
        status: a.status,
        totalApplications: a.totalApplications || 0,
        acceptedApplications: a.acceptedApplications || 0,
        commission: a.commission || 0,
        lastLogin: a.lastLogin || null,
        createdAt: a.createdAt,
      }))
    })
  } catch (error: any) {
    console.error('List agents error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
