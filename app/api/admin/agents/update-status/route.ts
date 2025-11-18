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
    const { agentId, status, sendEmail } = await request.json()

    if (!agentId || !status) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const db = await getDatabase()
    
    // Get agent info for email
    const agent = await db.collection('agents').findOne({ _id: new ObjectId(agentId) })
    
    if (!agent) {
      return NextResponse.json({ error: 'Agent not found' }, { status: 404 })
    }

    // Update status
    await db.collection('agents').updateOne(
      { _id: new ObjectId(agentId) },
      { $set: { status, updatedAt: new Date() } }
    )

    // Send email notification if requested and Resend is configured
    if (sendEmail && process.env.RESEND_API_KEY) {
      try {
        await fetch(`${process.env.NEXTAUTH_URL}/api/notifications/send`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            to: agent.email,
            subject: `Account ${status === 'active' ? 'Activated' : 'Suspended'}`,
            template: 'agent_status_changed',
            data: {
              name: agent.name,
              status: status,
              message: status === 'active' 
                ? 'Your agent account has been activated. You can now login to the portal.'
                : 'Your agent account has been suspended. Please contact admin for more information.'
            },
          }),
        })
      } catch (emailError) {
        console.error('Email notification error:', emailError)
        // Continue even if email fails
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Agent status updated successfully'
    })
  } catch (error: any) {
    console.error('Update status error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
