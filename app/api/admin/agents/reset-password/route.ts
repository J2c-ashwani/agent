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
    const { hash } = await import('bcryptjs')
    const { agentId, newPassword } = await request.json()

    if (!agentId || !newPassword) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    if (newPassword.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 })
    }

    const db = await getDatabase()
    const hashedPassword = await hash(newPassword, 10)
    
    await db.collection('agents').updateOne(
      { _id: new ObjectId(agentId) },
      { $set: { password: hashedPassword, updatedAt: new Date() } }
    )

    return NextResponse.json({ 
      success: true, 
      message: 'Password reset successfully'
    })
  } catch (error: any) {
    console.error('Reset password error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
