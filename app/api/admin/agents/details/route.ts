import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
import { ObjectId } from 'mongodb'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || (session.user as any).role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const agentId = searchParams.get('agentId')

    if (!agentId) {
      return NextResponse.json({ error: 'Missing agent ID' }, { status: 400 })
    }

    const { getDatabase } = await import('@/lib/mongodb')
    const db = await getDatabase()
    
    // Get agent info
    const agent = await db.collection('agents').findOne({ _id: new ObjectId(agentId) })
    
    if (!agent) {
      return NextResponse.json({ error: 'Agent not found' }, { status: 404 })
    }

    // Get agent's applications
    const applications = await db.collection('students')
      .find({ agentEmail: agent.email })
      .sort({ createdAt: -1 })
      .limit(10)
      .toArray()

    // Build activity log
    const activities = [
      {
        date: agent.createdAt.toISOString(),
        action: 'Account Created',
        details: 'Agent account was created'
      },
      ...applications.map(app => ({
        date: app.createdAt.toISOString(),
        action: 'Application Submitted',
        details: `Submitted application for ${app.studentName} - ${app.applicationId}`
      }))
    ]

    // Add login activity if available
    if (agent.lastLogin) {
      activities.push({
        date: agent.lastLogin.toISOString(),
        action: 'Last Login',
        details: 'Agent logged into the portal'
      })
    }

    // Sort activities by date (newest first)
    activities.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

    return NextResponse.json({ 
      success: true,
      agent: {
        id: agent._id.toString(),
        email: agent.email,
        name: agent.name,
        company: agent.company,
        totalApplications: agent.totalApplications || 0,
        acceptedApplications: agent.acceptedApplications || 0,
        commission: agent.commission || 0,
      },
      activities: activities.slice(0, 20), // Last 20 activities
      recentApplications: applications.map(app => ({
        id: app._id.toString(),
        applicationId: app.applicationId,
        studentName: app.studentName,
        status: app.status,
        createdAt: app.createdAt,
      }))
    })
  } catch (error: any) {
    console.error('Get agent details error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
