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

    // Create CSV content
    const headers = ['Name', 'Email', 'Company', 'Country', 'Phone', 'Status', 'Total Applications', 'Accepted Applications', 'Commission', 'Joined Date', 'Last Login']
    const csvRows = [
      headers.join(','),
      ...agents.map(agent => [
        `"${agent.name}"`,
        `"${agent.email}"`,
        `"${agent.company || ''}"`,
        `"${agent.country || ''}"`,
        `"${agent.phone || ''}"`,
        agent.status,
        agent.totalApplications || 0,
        agent.acceptedApplications || 0,
        agent.commission || 0,
        new Date(agent.createdAt).toLocaleDateString(),
        agent.lastLogin ? new Date(agent.lastLogin).toLocaleDateString() : 'Never'
      ].join(','))
    ]

    const csvContent = csvRows.join('\n')

    return new NextResponse(csvContent, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="agents-${new Date().toISOString().split('T')[0]}.csv"`
      }
    })
  } catch (error: any) {
    console.error('Export CSV error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
